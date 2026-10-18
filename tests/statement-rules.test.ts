import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
import type { StatementRow } from "../src/data/db"
import type { RuleInput } from "../src/logic/statement-rules"
const { db } = await import("../src/data/db")
const {
	saveStatementRule,
	previewStatementRule,
	listStatementRules,
	statementRecommendations,
	recommendationAutofill,
	setStatementRuleEnabled,
	deleteStatementRule,
	matchesStatement,
} = await import("../src/logic/statement-rules")
const { exportData, importData, parseImportFile, clearAllData, SYNC_TABLES } = await import(
	"../src/data/export-import"
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
	include_existing: true,
	conditions: { mode: "all", items: [{ operator: "contains", value: "COFFEE" }] },
	actions: {
		title: { mode: "suggest", value: "Coffee" },
		category_id: { mode: "autofill", value: "food" },
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
		["starts_with", "SOME", true],
		["starts_with", "coffee", false],
		["not_contains", "tea", true],
		["contains", ".*", false],
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
test("new-only rules reach Statements imported after creation, judged by import time not bank date", async () => {
	await db.statements.add(statement("old"))
	const rule = await saveStatementRule(input({ include_existing: false }))
	await db.statements.add(
		statement("new", {
			datetime: "2020-01-01 00:00",
			imported_at: new Date(Date.parse(rule.created_at) + 1).toISOString(),
		}),
	)
	expect(
		(await previewStatementRule(rule)).map(s => [s.id, s.applies]).sort(),
	).toEqual([
		["new", true],
		["old", false],
	])
	expect(await statementRecommendations(["old"])).toEqual([])
	expect(await statementRecommendations(["new"])).toHaveLength(2)
	expect((await listStatementRules())[0]).toMatchObject({ matches: 1 })
	// The choice is fixed at creation; edits keep it.
	await saveStatementRule(input({ include_existing: true }), rule.id)
	expect((await db.statement_rules.get(rule.id))?.include_existing).toBe(false)
	expect(
		(await previewStatementRule({ ...input(), include_existing: false })).every(s => !s.applies),
	).toBe(true)
	const all = await saveStatementRule(input({ name: "All" }))
	expect(all.include_existing).toBe(true)
	expect((await statementRecommendations(["old"])).map(r => r.rule_name)).toEqual(["All", "All"])
	expect(await db.records.count()).toBe(0)
})
test("importing and adding pending Statements stamps the import time", async () => {
	const { createPendingStatement } = await import("../src/logic/statements")
	const before = new Date().toISOString()
	const row = await createPendingStatement({
		account_id: "a",
		datetime: "2026-10-18T12:00",
		description: "Coffee",
		amount: -5,
	})
	expect((await db.statements.get(row.id))?.imported_at! >= before).toBe(true)
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
	const missingCategory = await saveStatementRule(
		input({ actions: { category_id: { mode: "autofill", value: "missing" } } }),
	).catch(cause => cause)
	expect(missingCategory.message).toContain("category")
	await expect(
		saveStatementRule(input({ include_existing: "yes" as unknown as boolean })),
	).rejects.toThrow()
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
	const { hashSnapshot } = await import("../src/data/snapshot-hash")
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
