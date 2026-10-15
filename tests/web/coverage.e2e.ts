import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { expect, test } from "@playwright/test"
import ts from "typescript"
import {
	behaviourCoverage,
	componentInventory,
	facetNotApplicable,
	notApplicable,
	openFacets,
	routeInventory,
	scenarioDescriptions,
	scenarioFamilies,
} from "./component-inventory"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")

// Financial Pending states are valid evidence. Only admissions of unfinished
// coverage count here; an executable mapping cannot close an admitted facet.
function admitsOpenFacets(description: string) {
	return /\bgaps?\b|\b(?:facets?|coverage|assertions?|behaviou?r|keyboard|correctness|contrast|input\/output|long content)\b[^.;]*\b(?:remain|remains|still)\b[^.;]*\bpending\b|\bpending\s+(?:cases|facets)\b|\b(?:still needs|needs its own|not asserted yet|not covered|uncovered|unverified|todo|tbd)\b/i.test(
		description,
	)
}

function collectOpenFacets(
	scenarios: { id: string; description: string }[],
	declared: Record<string, string[]>,
) {
	return scenarios.flatMap(scenario => {
		const facets = [...(declared[scenario.id] ?? [])]
		if (admitsOpenFacets(scenario.description))
			facets.push(`Description admits unfinished coverage: ${scenario.description}`)
		return facets.length ? [{ id: scenario.id, facets }] : []
	})
}

test("[UI-INVENTORY-FACETS] a mapped scenario stays incomplete while any facet is admitted open", () => {
	const scenarios = [
		{ id: "mapped", description: "Long option facets remain gaps" },
		{ id: "keyboard", description: "Keyboard behaviour remains pending" },
		{ id: "explicit", description: "Selected rows retain values" },
		{ id: "financial", description: "Pending Statement badge shows its pending reason" },
	]
	const mappings = { mapped: ["real-test"], keyboard: ["keys"], explicit: ["rows"] }
	const opened = collectOpenFacets(scenarios, { explicit: ["Long values"] })
	expect(opened.map(entry => entry.id)).toEqual(["mapped", "keyboard", "explicit"])
	expect(Object.keys(mappings).filter(id => !opened.some(entry => entry.id === id))).toEqual([])
	expect(admitsOpenFacets("Null/empty comparison states remain separate pending cases")).toBe(
		true,
	)
	expect(admitsOpenFacets("Description still needs its own assertion")).toBe(true)
	expect(admitsOpenFacets("Financial Pending Records remain pending until confirmed")).toBe(false)
})

function files(directory: string): string[] {
	return readdirSync(join(root, directory), { withFileTypes: true })
		.flatMap(entry =>
			entry.isDirectory()
				? files(`${directory}/${entry.name}`)
				: [`${directory}/${entry.name}`],
		)
		.sort()
}

function runtimeExports(path: string): string[] {
	const source = ts.createSourceFile(
		path,
		readFileSync(join(root, path), "utf8"),
		ts.ScriptTarget.Latest,
		true,
	)
	const types = new Set(
		source.statements.flatMap(node =>
			ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)
				? [node.name.text]
				: [],
		),
	)
	return source.statements
		.flatMap(node => {
			if (ts.isExportAssignment(node)) return ["default"]
			if (ts.isExportDeclaration(node)) {
				if (node.isTypeOnly) return []
				expect(
					node.exportClause,
					`${path}: star exports need explicit inventory resolution`,
				).toBeDefined()
				if (!node.exportClause || !ts.isNamedExports(node.exportClause)) return []
				return node.exportClause.elements
					.filter(
						element =>
							!element.isTypeOnly &&
							!types.has(element.propertyName?.text ?? element.name.text),
					)
					.map(element => element.name.text)
			}
			if (
				!ts.canHaveModifiers(node) ||
				!ts
					.getModifiers(node)
					?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)
			)
				return []
			if (
				ts
					.getModifiers(node)
					?.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword)
			)
				return ["default"]
			if (
				ts.isFunctionDeclaration(node) ||
				ts.isClassDeclaration(node) ||
				ts.isEnumDeclaration(node)
			)
				return node.name ? [node.name.text] : []
			if (ts.isVariableStatement(node))
				return node.declarationList.declarations.map(declaration => {
					expect(
						ts.isIdentifier(declaration.name),
						`${path}: destructured exports need explicit inventory resolution`,
					).toBe(true)
					return declaration.name.getText(source)
				})
			return []
		})
		.sort()
}

// Resolve only static syntax; never execute the test file or product code.
function collectTests(path: string, text: string, declarations: Map<string, string[]>) {
	const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
	const constants = new Map<string, ts.Expression>()
	for (const statement of source.statements) {
		if (ts.isVariableStatement(statement))
			for (const declaration of statement.declarationList.declarations) {
				if (ts.isIdentifier(declaration.name) && declaration.initializer)
					constants.set(declaration.name.text, declaration.initializer)
			}
	}
	// IDS is reviewed deterministic fixture data, not a dynamic executable import.
	const data = ts.createSourceFile(
		"data.ts",
		readFileSync(join(root, "tests/web/support/data.ts"), "utf8"),
		ts.ScriptTarget.Latest,
		true,
	)
	for (const statement of data.statements)
		if (ts.isVariableStatement(statement)) {
			for (const declaration of statement.declarationList.declarations) {
				if (
					ts.isIdentifier(declaration.name) &&
					declaration.name.text === "IDS" &&
					declaration.initializer
				)
					constants.set("IDS", declaration.initializer)
			}
		}
	type Value = string | number | boolean | null | Value[] | { [key: string]: Value }
	function value(node: ts.Expression, env: Map<string, Value>, depth = 0): Value | undefined {
		if (depth > 20) return undefined
		if (ts.isStringLiteralLike(node)) return node.text
		if (ts.isNumericLiteral(node)) return Number(node.text)
		if (
			ts.isAsExpression(node) ||
			ts.isParenthesizedExpression(node) ||
			ts.isSatisfiesExpression(node)
		)
			return value(node.expression, env, depth + 1)
		if (ts.isIdentifier(node)) {
			const constant = constants.get(node.text)
			return env.get(node.text) ?? (constant ? value(constant, env, depth + 1) : undefined)
		}
		if (ts.isArrayLiteralExpression(node)) {
			const values = node.elements.map(element => value(element, env, depth + 1))
			return values.every(item => item !== undefined) ? (values as Value[]) : undefined
		}
		if (ts.isObjectLiteralExpression(node)) {
			const result: { [key: string]: Value } = {}
			for (const property of node.properties) {
				if (!ts.isPropertyAssignment(property)) return undefined
				const item = value(property.initializer, env, depth + 1)
				if (item === undefined) continue // retain statically known object fields
				result[
					ts.isIdentifier(property.name) || ts.isStringLiteralLike(property.name)
						? property.name.text
						: property.name.getText(source)
				] = item
			}
			return result
		}
		if (ts.isPropertyAccessExpression(node)) {
			const object = value(node.expression, env, depth + 1)
			return object && typeof object === "object" && !Array.isArray(object)
				? object[node.name.text]
				: undefined
		}
		if (ts.isTemplateExpression(node)) {
			let result = node.head.text
			for (const span of node.templateSpans) {
				const item = value(span.expression, env, depth + 1)
				if (item === undefined || typeof item === "object") return undefined
				result += String(item) + span.literal.text
			}
			return result
		}
		if (
			ts.isCallExpression(node) &&
			node.expression.getText(source) === "Object.keys" &&
			node.arguments[0]
		) {
			const object = value(node.arguments[0], env, depth + 1)
			return object && typeof object === "object" ? Object.keys(object) : undefined
		}
		return undefined
	}
	function disabled(node: ts.Node): boolean {
		if (
			ts.isCallExpression(node) &&
			/^(?:test(?:\.info\(\))?\.(?:skip|fixme)|testInfo\.(?:skip|fixme))$/.test(
				node.expression.getText(source),
			)
		)
			return true
		return node.getChildren(source).some(disabled)
	}
	function visit(node: ts.Node, env: Map<string, Value>) {
		if (ts.isForOfStatement(node)) {
			const values = value(node.expression, env)
			const binding = ts.isVariableDeclarationList(node.initializer)
				? node.initializer.declarations[0]?.name
				: undefined
			if (!Array.isArray(values) || !binding) return // unresolved templates must stay unmapped
			for (const item of values) {
				const scope = new Map(env)
				if (ts.isIdentifier(binding)) scope.set(binding.text, item)
				else if (ts.isArrayBindingPattern(binding) && Array.isArray(item))
					binding.elements.forEach((element, index) => {
						if (
							ts.isBindingElement(element) &&
							ts.isIdentifier(element.name) &&
							item[index] !== undefined
						)
							scope.set(element.name.text, item[index])
					})
				visit(node.statement, scope)
			}
			return
		}
		if (ts.isCallExpression(node)) {
			const callee = node.expression.getText(source)
			if (/^test\.describe\.(?:skip|fixme|only)$/.test(callee)) return
			if (callee === "test" && node.arguments[0] && !disabled(node)) {
				const title = value(node.arguments[0], env)
				if (typeof title === "string") {
					const id = title.match(/^\[([^\]]+)\]/)?.[1] ?? title
					const references = declarations.get(id) ?? []
					references.push(
						`${path}:${source.getLineAndCharacterOfPosition(node.pos).line + 1}`,
					)
					declarations.set(id, references)
				}
			}
		}
		ts.forEachChild(node, child => visit(child, env))
	}
	visit(source, new Map())
}

function declaredTests() {
	const declarations = new Map<string, string[]>()
	for (const path of files("tests/web").filter(
		path => path.endsWith(".e2e.ts") && !path.endsWith("/coverage.e2e.ts"),
	)) {
		collectTests(path, readFileSync(join(root, path), "utf8"), declarations)
	}
	return declarations
}

test("[UI-INVENTORY-PARSER] static generated titles resolve but skipped cases cannot cover a component", () => {
	const declarations = new Map<string, string[]>()
	collectTests(
		"parser-fixture.ts",
		`
		const cases = [{ name: "first" }, { name: "second" }]
		for (const entry of cases) test(\`case \${entry.name}\`, async () => { expect(true).toBe(true) })
		for (const [name, count] of [["third", 2]] as const) test(\`case \${name} \${count}\`, async () => {})
		test.skip("skip", () => {})
		test.fixme("fixme", () => {})
		test("conditional", () => { test.skip(true, "unsupported project") })
		test.describe.skip("disabled suite", () => { test("inside", () => {}) })
		for (const value of externalValues) test(\`unresolved \${value}\`, () => {})
	`,
		declarations,
	)
	expect([...declarations.keys()]).toEqual(["case first", "case second", "case third 2"])
})

test("[UI-INVENTORY-FILES] every component and app file has an explicit owner and classification", () => {
	expect(componentInventory.map(entry => entry.path).sort()).toEqual(files("src/components"))
	expect(routeInventory.map(entry => entry.path).sort()).toEqual(files("app"))
	const paths = [...componentInventory, ...routeInventory].map(entry => entry.path)
	expect(new Set(paths).size, "Duplicate inventory entries").toBe(paths.length)
	const urls = routeInventory.filter(entry => entry.kind === "page").map(entry => entry.url)
	expect(new Set(urls).size, "Route groups must not produce duplicate URLs").toBe(urls.length)

	for (const entry of [...componentInventory, ...routeInventory]) {
		expect(["team2", "team3"], entry.path).toContain(entry.owner)
		expect(entry.scenarios.length, `${entry.path}: missing scenarios`).toBeGreaterThan(0)
		for (const family of entry.scenarios)
			expect(scenarioFamilies, `${entry.path}: unknown scenario ${family}`).toHaveProperty(
				family,
			)
	}
	for (const entry of routeInventory.filter(entry => entry.kind !== "framework")) {
		const url = `/${dirname(entry.path)
			.split("/")
			.slice(1)
			.filter(segment => !segment.startsWith("("))
			.join("/")}`
		expect(entry.url, entry.path).toBe(url)
	}
	for (const entry of componentInventory) {
		for (const route of entry.routes)
			expect(urls, `${entry.path}: unknown route candidate`).toContain(route)
	}
})

test("[UI-INVENTORY-EXPORTS] every runtime export is visible, dormant, or a non-rendering helper", () => {
	for (const entry of componentInventory) {
		const names = [...entry.visibleExports, ...entry.dormantExports, ...entry.helperExports]
		expect(new Set(names).size, `${entry.path}: duplicate export classification`).toBe(
			names.length,
		)
		expect(names.sort(), `${entry.path}: update classification after export changes`).toEqual(
			runtimeExports(entry.path),
		)
	}
})

test("[UI-INVENTORY-COVERAGE] reviewed behaviour mappings reference executable test IDs and report gaps", async () => {
	const testInfo = test.info()
	const declarations = declaredTests()
	const scenarios = [...componentInventory, ...routeInventory].flatMap(entry =>
		entry.scenarios.flatMap(family =>
			Object.entries(scenarioFamilies[family] ?? {}).map(([key, description]) => ({
				id: `${entry.path}#${family}.${key}`,
				owner: entry.owner,
				description: scenarioDescriptions[`${entry.path}#${family}.${key}`] ?? description,
				// Only the non-visual OAuth broker is exempt. Rendering helpers
				// (statement cells, chart intro, icon map) are NOT exempt: they
				// need consumer mappings or an explicit notApplicable reason.
				exempt: family === "auth",
			})),
		),
	)
	// A file-level scenario never silently stands in for every exported UI component.
	for (const entry of componentInventory) {
		for (const name of [...entry.visibleExports, ...entry.dormantExports]) {
			scenarios.push({
				id: `${entry.path}#export.${name}.behaviour`,
				owner: entry.owner,
				description: entry.dormantExports.includes(name)
					? `Dormant ${name}: substantive standalone tests/web/harness consumer at port 5174; verify supported output and interactions, not just mounting`
					: `${name}: reviewed substantive output/interaction assertions through a real route or composed harness consumer`,
				exempt: false,
			})
		}
	}
	const ids = scenarios.map(scenario => scenario.id)
	for (const id of Object.keys(scenarioDescriptions))
		expect(ids, `Unknown scenario refinement: ${id}`).toContain(id)
	for (const id of Object.keys(notApplicable))
		expect(ids, `Unknown notApplicable scenario: ${id}`).toContain(id)
	for (const [id, facets] of Object.entries(openFacets)) {
		expect(ids, `Unknown open-facet scenario: ${id}`).toContain(id)
		expect(facets.length, `${id}: omit empty open-facet entries`).toBeGreaterThan(0)
		for (const facet of facets) expect(facet.trim().length, id).toBeGreaterThan(0)
	}
	for (const [id, facets] of Object.entries(facetNotApplicable)) {
		expect(ids, `Unknown facet applicability scenario: ${id}`).toContain(id)
		expect(Object.keys(facets).length, id).toBeGreaterThan(0)
		for (const [facet, reason] of Object.entries(facets)) {
			expect(facet.trim().length, id).toBeGreaterThan(0)
			expect(reason, `${id}: a facet exception requires a source-backed reason`).toMatch(
				/(?:src|app)\/[\w/.[\]()-]+/,
			)
		}
	}
	for (const [id, tests] of Object.entries(behaviourCoverage)) {
		expect(ids, `Unknown scenario mapping: ${id}`).toContain(id)
		expect(
			notApplicable[id],
			`${id}: mapped and marked notApplicable; keep exactly one`,
		).toBeUndefined()
		expect(
			tests.length,
			`${id}: mapping must name substantive behaviour tests`,
		).toBeGreaterThan(0)
		for (const testId of tests) {
			expect(
				declarations.get(testId),
				`${id}: missing, skipped, or duplicate test ID ${testId}`,
			).toHaveLength(1)
		}
	}
	const pending = scenarios.filter(
		scenario =>
			!scenario.exempt &&
			!notApplicable[scenario.id] &&
			!behaviourCoverage[scenario.id]?.length,
	)
	const notApplicableReport = Object.entries(notApplicable).map(([id, reason]) => ({
		id,
		reason,
	}))
	const opened = collectOpenFacets(scenarios, openFacets)
	const report = {
		componentFiles: componentInventory.length,
		pageRoutes: routeInventory.filter(entry => entry.kind === "page").length,
		declaredTests: Object.fromEntries(declarations),
		mappedScenarios: scenarios.filter(scenario => behaviourCoverage[scenario.id]?.length)
			.length,
		pending,
		openFacets: opened,
		mappedWithOpenFacets: opened.filter(entry => behaviourCoverage[entry.id]?.length),
		completeMappedScenarios: scenarios.filter(
			scenario =>
				behaviourCoverage[scenario.id]?.length &&
				!opened.some(entry => entry.id === scenario.id),
		).length,
		facetNotApplicable,
		exempt: scenarios.filter(scenario => scenario.exempt),
		notApplicable: notApplicableReport,
		// Declaration validation alone does not prove assertions or a successful run.
		meaning:
			"Inventory completeness and mapping integrity only; reviewed assertions and passing browser results are separate evidence",
	}
	const reportPath = testInfo.outputPath("ui-behaviour-coverage.json")
	writeFileSync(reportPath, JSON.stringify(report, null, 2))
	await testInfo.attach("ui-behaviour-coverage.json", {
		path: reportPath,
		contentType: "application/json",
	})
	if (pending.length || opened.length)
		testInfo.annotations.push({
			type: "coverage-gap",
			description: `${pending.length} unmapped scenarios; ${opened.length} scenarios with open facets; see attachment`,
		})
	if (process.env.UI_COVERAGE_ALLOW_PENDING !== "1") {
		expect(
			pending.length,
			"Behaviour coverage is incomplete; see ui-behaviour-coverage.json and map reviewed tests rather than imports or mounts",
		).toBe(0)
		expect(
			opened,
			"Mapped scenarios still admit open facets; add evidence or a source-backed applicability reason before claiming completion",
		).toEqual([])
	}
})
