import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
import type { StatementRow } from "../../src/data/db"
import type { RuleInput } from "../../src/logic/statement-rules"
const { db } = await import("../../src/data/db")
const {
	saveStatementRule,
	previewStatementRule,
	listStatementRules,
	statementRecommendations,
	recommendationAutofill,
	setStatementRuleEnabled,
	deleteStatementRule,
	matchesStatement,
} = await import("../../src/logic/statement-rules")
const { exportData, importData, parseImportFile, clearAllData, SYNC_TABLES } = await import(
	"../../src/data/export-import"
)
const statement = (id: string, overrides: Partial<StatementRow> = {}): StatementRow => ({
	id,
	account_id: "a",
	description: "Some coffee shop",
	datetime: "2026-10-18 12:00",
	amount: -5,
	is_pending: 0,
	index: 0,
	...overrides,
})
const input = (overrides: Partial<RuleInput> = {}): RuleInput => ({
	name: "Coffee",
	enabled: true,
	conditions: { mode: "all", items: [{ operator: "contains", value: "COFFEE" }] },
	actions: {
		title: { value: "Coffee" },
		category_id: { value: "food" },
	},
	...overrides,
})
beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "a", name: "DBS", balance: 0, bank: "DBS" })
	await db.categories.add({
		id: "food",
		name: "Food",
		icon: "",
		color: "",
		parent_category_id: null,
		analytics_treatment: "spending",
		default_monthly_budget_id: null,
	})
})
test("conditions compare the description as literal, case-insensitive text", () => {
	const s = statement("s")
	expect(matchesStatement(input(), s)).toBe(true)
	expect(matchesStatement(input(), statement("s", { description: "Tea" }))).toBe(false)
	expect(matchesStatement(input({ conditions: { mode: "any", items: [] } }), s)).toBe(false)
	for (const [operator, value, result] of [
		["equals", "some coffee shop", true],
		["equals", "coffee", false],
		["equals", "SOME COFFEE SHOP", true],
		["contains", ".*", false],
		["regex", "^some\\s+coffee", true],
		["regex", "^coffee", false],
		["regex", "(tea|coffee) shop$", true],
		["regex", "[unclosed", false],
		["contains", "   ", false],
	] as const)
		expect(
			matchesStatement(
				input({ conditions: { mode: "all", items: [{ operator, value }] } }),
				s,
			),
		).toBe(result)
	const both = (mode: "all" | "any") =>
		input({
			conditions: {
				mode,
				items: [
					{ operator: "contains", value: "coffee" },
					{ operator: "contains", value: "tea" },
				],
			},
		})
	expect(matchesStatement(both("all"), s)).toBe(false)
	expect(matchesStatement(both("any"), s)).toBe(true)
})
test("rules apply to every matching Statement whenever a Record is created", async () => {
	await db.statements.add(statement("old"))
	const rule = await saveStatementRule(input())
	await db.statements.add(statement("new", { datetime: "2020-01-01 00:00" }))
	await db.statements.add(statement("tea", { description: "Tea house" }))
	expect((await previewStatementRule(rule)).map(s => s.id).sort()).toEqual(["new", "old"])
	expect((await listStatementRules())[0]).toMatchObject({ matches: 2 })
	expect(await statementRecommendations(["old"])).toHaveLength(2)
	expect(await statementRecommendations(["new"])).toHaveLength(2)
	expect(await statementRecommendations(["tea"])).toEqual([])
	expect(await statementRecommendations(["tea", "new"])).toHaveLength(2)
	expect(await db.records.count()).toBe(0)
})
test("paused rules and changed statements do not recommend; delete removes the rule", async () => {
	await db.statements.add(statement("s"))
	const rule = await saveStatementRule(input())
	await db.statements.update("s", { description: "Tea" })
	expect(await statementRecommendations(["s"])).toEqual([])
	await db.statements.update("s", { description: "Coffee" })
	await setStatementRuleEnabled(rule.id, false)
	expect(await statementRecommendations(["s"])).toEqual([])
	await setStatementRuleEnabled(rule.id, true)
	expect(await statementRecommendations(["s"])).toHaveLength(2)
	await deleteStatementRule(rule.id)
	expect(await db.statement_rules.get(rule.id)).toBeUndefined()
})
test("rules can fill people alongside the other text fields", async () => {
	await db.statements.add(statement("s"))
	await saveStatementRule(
		input({ actions: { people: { value: "Alex" } } }),
	)
	expect(recommendationAutofill(await statementRecommendations(["s"]))).toEqual({
		people: "Alex",
	})
})
test("validation rejects bad operators, blank text, empty actions and missing references", async () => {
	await expect(
		saveStatementRule(
			input({
				name: " ",
				conditions: {
					mode: "all",
					items: [{ operator: "gte" as "contains", value: " " }],
				},
				actions: {},
			}),
		),
	).rejects.toMatchObject({
		name: "ValidationError",
		errors: expect.objectContaining({
			name: expect.any(Array),
			"conditions.items.0.operator": expect.any(Array),
			"conditions.items.0.value": expect.any(Array),
			actions: expect.any(Array),
		}),
	})
	await expect(
		saveStatementRule(
			input({ conditions: { mode: "all", items: [{ operator: "regex", value: "(GRAB" }] } }),
		),
	).rejects.toMatchObject({
		errors: { "conditions.items.0.value": ["Enter a valid regular expression."] },
	})
	const missingCategory = await saveStatementRule(
		input({ actions: { category_id: { value: "missing" } } }),
	).catch(cause => cause)
	expect(missingCategory.message).toContain("category")
	expect(await db.statement_rules.count()).toBe(0)
})
test("backups, Drive tables, legacy restore and reset include rules", async () => {
	await db.statements.add(statement("s"))
	await saveStatementRule(input())
	const backup = await exportData()
	await clearAllData()
	await importData(backup)
	expect(await statementRecommendations(["s"])).toHaveLength(2)
	expect(SYNC_TABLES).toContain("statement_rules")
	const legacy = JSON.parse(JSON.stringify(backup))
	legacy.version = 4
	delete legacy.tables.statement_rules
	await importData(parseImportFile(JSON.stringify(legacy)))
	expect(await db.statement_rules.count()).toBe(0)
	expect(await db.statements.count()).toBe(1)
	await clearAllData()
	expect(await db.statement_rules.count()).toBe(0)
})
test("version five upgrade preserves financial rows and clean or dirty Drive baseline", async () => {
	const { hashSnapshot } = await import("../../src/data/snapshot-hash")
	for (const clean of [true, false]) {
		await db.statements.put(statement("s"))
		const backup = await exportData()
		const tables: Record<string, unknown[]> = { ...backup.tables }
		delete tables.statement_rules
		const baseline = clean ? await hashSnapshot({ settings: backup.settings, tables }) : "dirty"
		const schema = Object.fromEntries(
			db.tables
				.filter(t => !["statement_rules"].includes(t.name))
				.map(t => [
					t.name,
					[t.schema.primKey.src, ...t.schema.indexes.map(i => i.src)].join(","),
				]),
		)
		await db.delete()
		const old = new Dexie("finpoint")
		old.version(5).stores(schema)
		for (const [name, rows] of Object.entries(tables))
			if (rows.length) await old.table(name).bulkAdd(rows)
		await old.table("meta").put({ key: "drive_last_hash", value: baseline })
		old.close()
		await db.open()
		expect(await db.statements.get("s")).toEqual(statement("s"))
		expect((await db.meta.get("drive_last_hash"))?.value).toBe(
			clean ? await hashSnapshot(await exportData()) : baseline,
		)
	}
})

test("version five backups restore suggest-mode actions as autofill", async () => {
	await db.statements.add(statement("s"))
	await saveStatementRule(input())
	const legacy = JSON.parse(JSON.stringify(await exportData()))
	legacy.version = 5
	legacy.tables.statement_rules[0].actions = {
		title: { mode: "suggest", value: "Coffee" },
		category_id: { mode: "autofill", value: "food" },
	}
	await importData(parseImportFile(JSON.stringify(legacy)))
	expect((await db.statement_rules.toArray())[0]?.actions).toEqual({
		title: { value: "Coffee" },
		category_id: { value: "food" },
	})
	expect(recommendationAutofill(await statementRecommendations(["s"]))).toEqual({
		title: "Coffee",
		category_id: "food",
	})
})
test("version six upgrade turns suggest-mode actions into autofill and keeps the Drive baseline", async () => {
	const { hashSnapshot } = await import("../../src/data/snapshot-hash")
	for (const clean of [true, false]) {
		await db.statements.put(statement("s"))
		const backup = await exportData()
		const rule = {
			...(await saveStatementRule(input())),
			actions: {
				title: { mode: "suggest", value: "Coffee" },
				category_id: { mode: "autofill", value: "food" },
			},
		}
		const tables: Record<string, unknown[]> = { ...backup.tables, statement_rules: [rule] }
		const baseline = clean ? await hashSnapshot({ settings: backup.settings, tables }) : "dirty"
		const schema = Object.fromEntries(
			db.tables.map(t => [
				t.name,
				[t.schema.primKey.src, ...t.schema.indexes.map(i => i.src)].join(","),
			]),
		)
		await db.delete()
		const old = new Dexie("finpoint")
		old.version(6).stores(schema)
		for (const [name, rows] of Object.entries(tables))
			if (rows.length) await old.table(name).bulkAdd(rows)
		await old.table("meta").put({ key: "drive_last_hash", value: baseline })
		old.close()
		await db.open()
		expect((await db.statement_rules.get(rule.id))?.actions).toEqual({
			title: { value: "Coffee" },
			category_id: { value: "food" },
		})
		expect((await db.meta.get("drive_last_hash"))?.value).toBe(
			clean ? await hashSnapshot(await exportData()) : baseline,
		)
	}
})
