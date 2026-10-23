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
	scenarioProjectExemptions,
	scenarioProjectLexiconExemptions,
	scenarioProjects,
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
export type TestSelection = { path: string; test: string; tags: string[]; motion: boolean }

function collectTests(
	path: string,
	text: string,
	declarations: Map<string, string[]>,
	selections: Map<string, TestSelection[]>,
) {
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
		if (node.kind === ts.SyntaxKind.TrueKeyword) return true
		if (node.kind === ts.SyntaxKind.FalseKeyword) return false
		if (node.kind === ts.SyntaxKind.NullKeyword) return null
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
	function unwrap(node: ts.Expression): ts.Expression {
		while (
			ts.isAsExpression(node) ||
			ts.isParenthesizedExpression(node) ||
			ts.isSatisfiesExpression(node)
		)
			node = node.expression
		return node
	}
	// Tag details are a static object literal in the second argument:
	// test(title, { tag: "@motion" }, …), test(title, { tag: ["@tall"] }, …),
	// test(title, { tag: tags }, …) with tags bound through a static for…of, or
	// a conditional whose condition resolves statically (loop bindings included).
	// Anything else in the second argument is the callback, not details.
	// A conditional records exactly the taken branch: unioning both branches
	// would certify tags the runner never selects.
	function conditionBranch(
		node: ts.ConditionalExpression,
		scope: Map<string, Value>,
		here: string,
	): ts.Expression {
		const direct = value(node.condition, scope)
		if (typeof direct === "boolean") return direct ? node.whenTrue : node.whenFalse
		const test = unwrap(node.condition)
		if (
			ts.isBinaryExpression(test) &&
			(test.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
				test.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken)
		) {
			const left = value(test.left, scope)
			const right = value(test.right, scope)
			const primitive = (item: Value | undefined) =>
				typeof item === "string" || typeof item === "number" || typeof item === "boolean"
					? item
					: undefined
			const a = primitive(left)
			const b = primitive(right)
			if (a !== undefined && b !== undefined) {
				const take =
					test.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken
						? a === b
						: a !== b
				return take ? node.whenTrue : node.whenFalse
			}
		}
		throw new Error(
			`${here}: unresolved test tag condition; tags must be static string literals`,
		)
	}
	function detailsTags(
		argument: ts.Expression | undefined,
		scope: Map<string, Value>,
		here: string,
	): string[] {
		if (!argument) return []
		const unwrapped = unwrap(argument)
		if (ts.isConditionalExpression(unwrapped))
			return detailsTags(conditionBranch(unwrapped, scope, here), scope, here)
		if (!ts.isObjectLiteralExpression(unwrapped)) return []
		const tag = unwrapped.properties.find(
			(property): property is ts.PropertyAssignment | ts.ShorthandPropertyAssignment =>
				(ts.isPropertyAssignment(property) &&
					(ts.isIdentifier(property.name) || ts.isStringLiteralLike(property.name)) &&
					property.name.text === "tag") ||
				(ts.isShorthandPropertyAssignment(property) && property.name.text === "tag"),
		)
		if (!tag) return []
		return tagValues(
			ts.isShorthandPropertyAssignment(tag) ? tag.name : tag.initializer,
			scope,
			here,
		)
	}
	function tagValues(node: ts.Expression, scope: Map<string, Value>, here: string): string[] {
		const unwrapped = unwrap(node)
		if (ts.isConditionalExpression(unwrapped))
			return tagValues(conditionBranch(unwrapped, scope, here), scope, here)
		const resolved = value(unwrapped, scope)
		if (typeof resolved === "string") return [resolved]
		if (Array.isArray(resolved) && resolved.every(item => typeof item === "string"))
			return [...new Set(resolved)]
		throw new Error(
			`${here}: unresolved test tag expression; tags must be static string literals`,
		)
	}
	const motionPattern =
		/expectPopupEntrance|expectReducedRowMovement|prefers-reduced-motion|"reduced-motion"|reducedMotion/
	function fileFunctions(): Map<string, string> {
		const bodies = new Map<string, string>()
		for (const statement of source.statements) {
			if (ts.isFunctionDeclaration(statement) && statement.name)
				bodies.set(statement.name.text, statement.getText(source))
			else if (ts.isVariableStatement(statement))
				for (const declaration of statement.declarationList.declarations) {
					if (
						ts.isIdentifier(declaration.name) &&
						/^[A-Za-z_][A-Za-z0-9_]*$/.test(declaration.name.text) &&
						declaration.initializer &&
						(ts.isArrowFunction(declaration.initializer) ||
							ts.isFunctionExpression(declaration.initializer))
					)
						bodies.set(declaration.name.text, declaration.initializer.getText(source))
				}
		}
		return bodies
	}
	const helpers = fileFunctions()
	function mentionsMotion(callback: ts.Node): boolean {
		let combined = callback.getText(source)
		const used = new Set<string>()
		let changed = true
		while (changed) {
			changed = false
			for (const [name, body] of helpers) {
				if (!used.has(name) && new RegExp(`\\b${name}\\b`).test(combined)) {
					used.add(name)
					combined += `\n${body}`
					changed = true
				}
			}
		}
		return motionPattern.test(combined)
	}
	function disabled(node: ts.Node): boolean {
		if (
			ts.isCallExpression(node) &&
			/^(?:test(?:\.info\(\))?\.(?:skip|fixme)|test\.step\.(?:skip|fixme)|testInfo\.(?:skip|fixme))$/.test(
				node.expression.getText(source),
			)
		)
			return true
		return node.getChildren(source).some(disabled)
	}
	function visit(
		node: ts.Node,
		env: Map<string, Value>,
		active: boolean,
		tags: string[],
		currentTest: string | null,
	) {
		// Only recognised test/describe/step callbacks are entered below. A
		// nested function declaration is not evidence that its body ever runs.
		if (ts.isFunctionLike(node)) return
		if (ts.isIfStatement(node) && node.expression.kind === ts.SyntaxKind.FalseKeyword) {
			if (node.elseStatement) visit(node.elseStatement, env, active, tags, currentTest)
			return
		}
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
				visit(node.statement, scope, active, tags, currentTest)
			}
			return
		}
		if (ts.isCallExpression(node)) {
			const callee = node.expression.getText(source)
			const here = `${path}:${source.getLineAndCharacterOfPosition(node.pos).line + 1}`
			// Pruned branches never run, so nothing inside them is executable
			// evidence — including nested step aliases from skipped parents.
			if (
				/^test\.describe\.(?:skip|fixme|only)$/.test(callee) ||
				/^test\.(?:skip|fixme|only)$/.test(callee) ||
				/^test\.step\.(?:skip|fixme)$/.test(callee)
			)
				return
			// Grouped tests keep the legacy case title as a static test.step
			// name. Steps resolve through the same static scope as tests
			// (including static for…of loops), so a combined test preserves
			// the exact executable IDs the behaviour ledger references. A
			// step only counts with enabled executable test ancestry: a step
			// in an uncalled helper or outside any test never runs. A step
			// that is itself skipped or lives in a skipped suite cannot
			// cover a component, exactly like a skipped test. Tag details in
			// the second argument never change an ID; steps inherit their
			// test's tags through the describe/test/step stack, recorded in
			// a separate selections map so declaration counts are unchanged.
			if (callee === "test.describe") {
				visitCallback(
					node,
					env,
					false,
					[...new Set([...tags, ...detailsTags(node.arguments[1], env, here)])],
					currentTest,
				)
				return
			}
			if (callee === "test.step") {
				if (!active || disabled(node)) return
				const effective = [
					...new Set([...tags, ...detailsTags(node.arguments[1], env, here)]),
				]
				if (node.arguments[0]) record(node, env, currentTest, effective, false)
				visitCallback(node, env, true, effective, currentTest)
				return
			}
			if (callee === "test" && node.arguments[0]) {
				if (disabled(node)) return
				const title = titleOf(node, env)
				const effective = [
					...new Set([...tags, ...detailsTags(node.arguments[1], env, here)]),
				]
				const motion = node.arguments.some(
					argument =>
						(ts.isArrowFunction(argument) || ts.isFunctionExpression(argument)) &&
						mentionsMotion(argument),
				)
				record(node, env, title ?? currentTest, effective, motion)
				visitCallback(node, env, true, effective, title ?? currentTest)
				return
			}
		}
		ts.forEachChild(node, child => visit(child, env, active, tags, currentTest))
	}
	function visitCallback(
		node: ts.CallExpression,
		env: Map<string, Value>,
		active: boolean,
		tags: string[],
		currentTest: string | null,
	) {
		for (const argument of node.arguments) {
			if (ts.isArrowFunction(argument) || ts.isFunctionExpression(argument))
				visit(argument.body, env, active, tags, currentTest)
		}
	}
	function titleOf(node: ts.CallExpression, env: Map<string, Value>): string | undefined {
		const title = node.arguments[0] ? value(node.arguments[0], env) : undefined
		return typeof title === "string" ? title : undefined
	}
	function record(
		node: ts.CallExpression,
		env: Map<string, Value>,
		test: string | null,
		tags: string[],
		motion: boolean,
	) {
		const title = titleOf(node, env)
		if (title === undefined) return
		const id = title.match(/^\[([^\]]+)\]/)?.[1] ?? title
		const references = declarations.get(id) ?? []
		references.push(`${path}:${source.getLineAndCharacterOfPosition(node.pos).line + 1}`)
		declarations.set(id, references)
		const entries = selections.get(id) ?? []
		entries.push({ path, test: test ?? title, tags, motion })
		selections.set(id, entries)
	}
	visit(source, new Map(), false, [], null)
}

function declaredTests() {
	const declarations = new Map<string, string[]>()
	const selections = new Map<string, TestSelection[]>()
	for (const path of files("tests/web").filter(
		path => path.endsWith(".e2e.ts") && !path.endsWith("/coverage.e2e.ts"),
	)) {
		collectTests(path, readFileSync(join(root, path), "utf8"), declarations, selections)
	}
	return { declarations, selections }
}

test("[UI-INVENTORY-PARSER] static generated titles resolve but skipped cases cannot cover a component", () => {
	const declarations = new Map<string, string[]>()
	const selections = new Map<string, TestSelection[]>()
	collectTests(
		"parser-fixture.ts",
		`
		const cases = [{ name: "first" }, { name: "second" }]
		for (const entry of cases) test(\`case \${entry.name}\`, async () => { expect(true).toBe(true) })
		for (const [name, count] of [["third", 2]] as const) test(\`case \${name} \${count}\`, async () => {})
		test("grouped", async () => {
			function unusedNested() { test.step("must-not-map-nested-helper", () => {}) }
			const unusedArrow = () => test.step("must-not-map-nested-arrow", () => {})
			if (false) await test.step("must-not-map-false-branch", async () => {})
			await test.step("grouped first", async () => {})
			await test.step(\`grouped \${"second"}\`, async () => {})
		})
		for (const name of ["alpha", "beta"] as const) test("looped group", async () => {
			await test.step(\`looped \${name} step\`, async () => {})
		})
		test("tag mirror", { tag: "@motion" }, async () => {
			await test.step("tag mirror step", async () => {})
		})
		test.describe("tagged suite", { tag: ["@tall"] }, () => {
			test("suite child", async () => {
				await test.step("suite child step", async () => {})
			})
		})
		for (const [group, tags] of [["core", ["@tall", "@motion"]]] as const)
			test(\`looped \${group}\`, { tag: tags }, async () => {
				await test.step(\`looped \${group} step\`, async () => {})
			})
		test("conditional tags", { tag: true ? ["@light"] : ["@motion"] }, async () => {})
		test("conditional tags false", { tag: false ? ["@motion"] : [] }, async () => {})
		for (const kind of ["tall", "plain"] as const)
			test(\`conditional \${kind}\`, { tag: kind === "tall" ? ["@tall"] : [] }, async () => {})
		test.skip("skipped with tags", { tag: "@motion" }, () => {})
		test("skipped group", async () => {
			await test.step.skip("skipped step", async () => {})
		})
		test.skip("skipped parent", () => {
			test.step("must-not-map-skipped-parent", () => {})
		})
		test("conditional parent with step", () => {
			test.skip(true, "unsupported project")
			test.step("must-not-map-conditional-parent", () => {})
		})
		test.only("only parent", () => {
			test.step("must-not-map-only-parent", () => {})
		})
		function uncalledHelper() {
			test.step("must-not-map-helper", () => {})
		}
		void uncalledHelper
		test.skip("skip", () => {})
		test.fixme("fixme", () => {})
		test("conditional", () => { test.skip(true, "unsupported project") })
		test.describe.skip("disabled suite", () => { test("inside", () => {}) })
		for (const value of externalValues) test(\`unresolved \${value}\`, () => {})
	`,
		declarations,
		selections,
	)
	expect([...declarations.keys()]).toEqual([
		"case first",
		"case second",
		"case third 2",
		"grouped",
		"grouped first",
		"grouped second",
		"looped group",
		"looped alpha step",
		"looped beta step",
		"tag mirror",
		"tag mirror step",
		"suite child",
		"suite child step",
		"looped core",
		"looped core step",
		"conditional tags",
		"conditional tags false",
		"conditional tall",
		"conditional plain",
	])
	expect(selections.get("tag mirror")).toEqual([
		{ path: "parser-fixture.ts", test: "tag mirror", tags: ["@motion"], motion: false },
	])
	expect(selections.get("tag mirror step")).toEqual([
		{ path: "parser-fixture.ts", test: "tag mirror", tags: ["@motion"], motion: false },
	])
	expect(selections.get("suite child")).toEqual([
		{ path: "parser-fixture.ts", test: "suite child", tags: ["@tall"], motion: false },
	])
	expect(selections.get("suite child step")).toEqual([
		{ path: "parser-fixture.ts", test: "suite child", tags: ["@tall"], motion: false },
	])
	expect(selections.get("looped core")).toEqual([
		{
			path: "parser-fixture.ts",
			test: "looped core",
			tags: ["@tall", "@motion"],
			motion: false,
		},
	])
	expect(selections.get("looped core step")).toEqual([
		{
			path: "parser-fixture.ts",
			test: "looped core",
			tags: ["@tall", "@motion"],
			motion: false,
		},
	])
	expect(selections.get("conditional tags")).toEqual([
		{
			path: "parser-fixture.ts",
			test: "conditional tags",
			tags: ["@light"],
			motion: false,
		},
	])
	expect(selections.get("conditional tags false")).toEqual([
		{
			path: "parser-fixture.ts",
			test: "conditional tags false",
			tags: [],
			motion: false,
		},
	])
	expect(selections.get("conditional tall")).toEqual([
		{
			path: "parser-fixture.ts",
			test: "conditional tall",
			tags: ["@tall"],
			motion: false,
		},
	])
	expect(selections.get("conditional plain")).toEqual([
		{
			path: "parser-fixture.ts",
			test: "conditional plain",
			tags: [],
			motion: false,
		},
	])
	expect(selections.has("skipped with tags"), "skipped tests stay unrecorded").toBe(false)
	expect(selections.get("grouped")).toEqual([
		{ path: "parser-fixture.ts", test: "grouped", tags: [], motion: false },
	])
})

test("[UI-INVENTORY-PARSER-TAGS] unresolved tag expressions throw instead of vanishing", () => {
	for (const text of [
		`test("unbound tag", { tag }, async () => {})`,
		`test("numeric tag", { tag: 42 }, async () => {})`,
		`test("half conditional", { tag: known ? ["@motion"] : other }, async () => {})`,
	]) {
		const declarations = new Map<string, string[]>()
		const selections = new Map<string, TestSelection[]>()
		expect(() => collectTests("parser-fixture.ts", text, declarations, selections)).toThrow(
			/unresolved test tag/,
		)
	}
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
	const { declarations } = declaredTests()
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

const projectTagVocabulary = ["@desktop-only", "@mobile-only", "@tall", "@light", "@motion"]

type SelectionProject = {
	name: string
	testIgnore?: string | RegExp | (string | RegExp)[]
	grep?: RegExp | RegExp[]
	grepInvert?: RegExp | RegExp[]
}

function projectIgnores(project: SelectionProject): (string | RegExp)[] {
	if (!project.testIgnore) return []
	return Array.isArray(project.testIgnore) ? project.testIgnore : [project.testIgnore]
}

function projectPatterns(patterns: RegExp | RegExp[] | undefined): RegExp[] {
	if (!patterns) return []
	return Array.isArray(patterns) ? patterns : [patterns]
}

// Playwright matches project grep/grepInvert against "<title> <tags…>"; every
// testIgnore pattern in this repo is "**/<file>".
function selectedBy(project: SelectionProject, file: string, fullTitle: string): boolean {
	for (const pattern of projectIgnores(project)) {
		if (typeof pattern === "string") {
			expect(
				pattern.startsWith("**/"),
				`project selection only supports **/<file> ignores, found ${pattern}`,
			).toBe(true)
			if (file === pattern.slice("**/".length)) return false
		} else if (pattern instanceof RegExp) {
			if (pattern.test(`tests/web/${file}`)) return false
		} else {
			throw new Error(`unsupported testIgnore pattern in project ${project.name}`)
		}
	}
	const grep = projectPatterns(project.grep)
	if (grep.length > 0 && !grep.some(expression => expression.test(fullTitle))) return false
	if (projectPatterns(project.grepInvert).some(expression => expression.test(fullTitle)))
		return false
	return true
}

// Effective description exactly as [UI-INVENTORY-COVERAGE] resolves it:
// a scenarioDescriptions refinement, else the family case, else the synthetic
// export/dormant consumer wording.
function ledgerDescription(id: string): string {
	const override = scenarioDescriptions[id]
	if (override) return override
	const hash = id.lastIndexOf("#")
	const path = id.slice(0, hash)
	const rest = id.slice(hash + 1)
	const dot = rest.indexOf(".")
	const family = rest.slice(0, dot)
	const key = rest.slice(dot + 1)
	if (family === "export" || family === "dormant") {
		const entry = componentInventory.find(candidate => candidate.path === path)
		const name = rest.split(".")[1] ?? rest
		if (entry?.dormantExports.includes(name))
			return `Dormant ${name}: standalone harness at port 5174; assert rendered output, meaningful pointer/keyboard interaction, selected/disabled states and long content where supported; a mount alone is insufficient`
		return `${name}: reviewed substantive output/interaction assertions through a real route or composed harness consumer`
	}
	return scenarioFamilies[family]?.[key] ?? id
}

test("[UI-INVENTORY-PROJECTS] project selection executes every ledger configuration claim", async () => {
	delete process.env.PLAYWRIGHT_FULL_MATRIX
	delete process.env.PLAYWRIGHT_BROWSERS
	const config = (await import("../../playwright.config")).default as unknown as {
		projects: SelectionProject[]
	}
	const projects = new Map(config.projects.map(project => [project.name, project]))
	for (const name of ["chromium", "mobile", "tall-desktop", "light", "reduced-motion"]) {
		expect(
			projects.has(name),
			`playwright.config.ts must define a ${name} project for tag-filtered selection`,
		).toBe(true)
	}
	const desktop = projects.get("chromium")
	const mobile = projects.get("mobile")
	const reducedMotion = projects.get("reduced-motion")
	if (!desktop || !mobile || !reducedMotion)
		throw new Error("tag-filtered desktop, mobile and reduced-motion projects are required")
	const { selections } = declaredTests()

	// Every used tag is one of the vocabulary tags; no test opts out of
	// both desktop and mobile viewports at once.
	const usedTags = new Set<string>()
	for (const entries of selections.values())
		for (const entry of entries) for (const tag of entry.tags) usedTags.add(tag)
	for (const tag of usedTags)
		expect(
			projectTagVocabulary,
			`unknown project tag ${tag}; extend the ledger vocabulary deliberately`,
		).toContain(tag)
	for (const [id, entries] of selections)
		for (const entry of entries)
			expect(
				entry.tags.includes("@desktop-only") && entry.tags.includes("@mobile-only"),
				`${id} carries both @desktop-only and @mobile-only`,
			).toBe(false)

	// Every enabled top-level test is selected by at least one project, so no
	// test is orphaned. The tall-only file runs solely in tall-desktop by
	// design, so desktop-or-mobile alone would falsely orphan it.
	const selectors: SelectionProject[] = []
	for (const project of projects.values()) selectors.push(project)
	const topLevel = new Map<string, { file: string; title: string; tags: string[] }>()
	for (const entries of selections.values())
		for (const entry of entries) {
			const key = `${entry.path} ${entry.test}`
			const group = topLevel.get(key) ?? {
				file: entry.path.split("/").pop() ?? entry.path,
				title: entry.test,
				tags: [],
			}
			group.tags = [...new Set([...group.tags, ...entry.tags])]
			topLevel.set(key, group)
		}
	for (const group of topLevel.values()) {
		const full = `${group.title} ${group.tags.join(" ")}`.trim()
		expect(
			selectors.some(project => selectedBy(project, group.file, full)),
			`enabled test "${group.title}" in ${group.file} is selected by no project`,
		).toBe(true)
	}

	// Every scenarioProjects claim is executed by the claimed projects for
	// every mapped test ID, unless that ID is exempted with a reason. Both
	// desktop and mobile must select the test when the claim includes mobile.
	for (const scenario of Object.keys(scenarioProjects))
		expect(
			Object.hasOwn(behaviourCoverage, scenario),
			`unknown scenarioProjects scenario`,
		).toBe(true)
	for (const [scenario, exemptions] of Object.entries(scenarioProjectExemptions)) {
		expect(
			Object.hasOwn(behaviourCoverage, scenario),
			"unknown scenarioProjectExemptions",
		).toBe(true)
		for (const [testId, reason] of Object.entries(exemptions)) {
			expect(
				behaviourCoverage[scenario],
				`${scenario}: exempted test ID is not mapped`,
			).toContain(testId)
			expect(
				reason,
				`${scenario}: a project exemption requires a source-backed reason`,
			).toMatch(/(?:src|app)\/[\w/.[\]()-]+/)
		}
	}
	for (const [scenario, claimed] of Object.entries(scenarioProjects)) {
		for (const projectName of claimed) {
			const project = projects.get(projectName)
			if (!project) throw new Error(`unknown claimed project ${projectName} for ${scenario}`)
			for (const testId of behaviourCoverage[scenario] ?? []) {
				if (scenarioProjectExemptions[scenario]?.[testId]) continue
				const entries = selections.get(testId)
				expect(
					entries?.length,
					`${scenario}: mapped test ID ${testId} resolves to exactly one selection`,
				).toBe(1)
				for (const entry of entries ?? []) {
					const file = entry.path.split("/").pop() ?? entry.path
					const full = `${entry.test} ${entry.tags.join(" ")}`.trim()
					expect(
						selectedBy(project, file, full),
						`${scenario} claims ${projectName} but "${testId}" (${entry.test} in ${file}) is not selected`,
					).toBe(true)
					if (projectName === "mobile")
						expect(
							selectedBy(desktop, file, full),
							`${scenario} claims mobile but "${testId}" is not selected by chromium`,
						).toBe(true)
				}
			}
		}
	}

	// Prose that claims a configuration without a scenarioProjects entry (or
	// an explicit exemption) fails, so later re-tagging cannot silently
	// falsify a description.
	const claimLexicon =
		/\b(?:tall|reduced[- ]motion|mobile|dark|light|normal\/|five projects|every viewport|each viewport)\b/i
	for (const scenario of Object.keys(behaviourCoverage)) {
		if (!claimLexicon.test(ledgerDescription(scenario))) continue
		if (scenarioProjects[scenario]) continue
		expect(
			scenarioProjectLexiconExemptions[scenario],
			`${scenario} description claims a configuration but has no scenarioProjects entry`,
		).toMatch(/\S/)
	}
	for (const scenario of Object.keys(scenarioProjectLexiconExemptions))
		expect(
			Object.hasOwn(behaviourCoverage, scenario),
			"unknown scenarioProjectLexiconExemptions scenario",
		).toBe(true)

	// A test whose callback, or any transitively referenced file-local
	// function, exercises reduced-motion behaviour must be selected by
	// reduced-motion. Files the reduced-motion project ignores in the config
	// (helper probes forcing no-preference) are exempt through that list only.
	const reducedIgnores = new Set(
		projectIgnores(reducedMotion).map(pattern => {
			if (typeof pattern !== "string" || !pattern.startsWith("**/"))
				throw new Error("reduced-motion ignores must be **/<file> strings")
			return pattern.slice("**/".length)
		}),
	)
	for (const [id, entries] of selections)
		for (const entry of entries) {
			if (!entry.motion) continue
			const file = entry.path.split("/").pop() ?? entry.path
			if (reducedIgnores.has(file)) continue
			const full = `${entry.test} ${entry.tags.join(" ")}`.trim()
			expect(
				selectedBy(reducedMotion, file, full),
				`"${id}" (${entry.test}) exercises reduced-motion behaviour but is not selected by reduced-motion`,
			).toBe(true)
		}
})
