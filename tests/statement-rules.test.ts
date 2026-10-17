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
	runStatementRule,
	previewStatementRule,
	statementRecommendations,
	recommendationAutofill,
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
	priority: 10,
	account_ids: ["a"],
	conditions: {
		mode: "all",
		items: [{ field: "description", operator: "contains", value: "COFFEE" }],
	},
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
test("conditions support literal case-insensitive text, signed amounts, dates, status and account scope", () => {
	const rule = input({
		conditions: {
			mode: "all",
			items: [
				{ field: "description", operator: "contains", value: "COFFEE" },
				{ field: "amount", operator: "lte", value: "-3" },
				{ field: "date", operator: "gte", value: "2026-10-01" },
				{ field: "is_pending", operator: "equals", value: "false" },
			],
		},
	})
	expect(matchesStatement(rule, statement("s"))).toBe(true)
	expect(matchesStatement(rule, statement("s", { account_id: "other" }))).toBe(false)
	expect(matchesStatement(rule, statement("s", { amount: 5 }))).toBe(false)
	expect(matchesStatement(rule, statement("s", { is_pending: 1 }))).toBe(false)
	expect(
		matchesStatement(
			{ ...rule, conditions: { ...rule.conditions, mode: "any" } },
			statement("s", { amount: 5 }),
		),
	).toBe(true)
	expect(
		matchesStatement(input({ conditions: { mode: "any", items: [] } }), statement("s")),
	).toBe(false)
	for (const [operator, value, result] of [
		["equals", "some coffee shop", true],
		["starts_with", "some", true],
		["not_contains", "tea", true],
		["contains", ".*", false],
	] as const)
		expect(
			matchesStatement(
				input({
					conditions: { mode: "all", items: [{ field: "description", operator, value }] },
				}),
				statement("s"),
			),
		).toBe(result)
})
test("run dataset is transient; new statements are identified by arrival, not bank date", async () => {
	await db.statements.add(statement("old"))
	const rule = await saveStatementRule(input())
	expect(rule).not.toHaveProperty("scope")
	await db.statements.add(statement("new", { datetime: "2020-01-01 00:00" }))
	expect((await previewStatementRule(rule, rule.id, "existing")).map(s => s.id)).toEqual(["old"])
	expect((await previewStatementRule(rule, rule.id, "new")).map(s => s.id)).toEqual(["new"])
	expect(await statementRecommendations(["old", "new"])).toEqual([])
	expect(await runStatementRule(rule.id, "new")).toEqual({ scanned: 1, matched: 1 })
	expect(await statementRecommendations(["old"])).toEqual([])
	expect(await statementRecommendations(["new"])).toHaveLength(2)
	expect(await previewStatementRule(rule, rule.id, "new")).toEqual([])
	expect(await runStatementRule(rule.id, "both")).toEqual({ scanned: 2, matched: 2 })
	expect(await db.records.count()).toBe(0)
})
test("priority resolves autofill per field, preserves explicit null, and keeps suggestions", async () => {
	await db.statements.add(statement("s"))
	const later = await saveStatementRule(
		input({
			priority: 20,
			actions: {
				title: { mode: "autofill", value: "Later" },
				location: { mode: "suggest", value: "Cafe" },
			},
		}),
	)
	const first = await saveStatementRule(
		input({
			priority: 1,
			actions: {
				title: { mode: "autofill", value: "First" },
				monthly_budget_id: { mode: "autofill", value: null },
			},
		}),
	)
	await runStatementRule(later.id, "both")
	await runStatementRule(first.id, "both")
	const result = await statementRecommendations(["s"])
	expect(recommendationAutofill(result)).toEqual({ title: "First", monthly_budget_id: null })
	expect(result.filter(r => r.mode === "suggest").map(r => r.value)).toEqual(["Cafe"])
})
test("edits invalidate runs, disabled rules and changed statements do not recommend", async () => {
	await db.statements.add(statement("s"))
	const rule = await saveStatementRule(input())
	await runStatementRule(rule.id, "both")
	await db.statements.update("s", { description: "Tea" })
	expect(await statementRecommendations(["s"])).toEqual([])
	await db.statements.update("s", { description: "Coffee" })
	await saveStatementRule(input({ enabled: false }), rule.id)
	expect(await statementRecommendations(["s"])).toEqual([])
	const failure = await runStatementRule(rule.id, "both").catch(cause => cause)
	expect(failure.message).toContain("Enable")
	await deleteStatementRule(rule.id)
	expect(await db.statement_rule_runs.get(rule.id)).toBeUndefined()
})
test("validation rejects invalid fields, operators, amounts, actions and references atomically", async () => {
	await expect(
		saveStatementRule(
			input({
				conditions: {
					mode: "all",
					items: [{ field: "amount", operator: "contains", value: "no" }],
				},
				actions: {},
			}),
		),
	).rejects.toMatchObject({
		name: "ValidationError",
		errors: expect.objectContaining({
			"conditions.items.0.operator": expect.any(Array),
			"conditions.items.0.value": expect.any(Array),
			actions: expect.any(Array),
		}),
	})
	const missingCategory = await saveStatementRule(
		input({ actions: { category_id: { mode: "autofill", value: "missing" } } }),
	).catch(cause => cause)
	expect(missingCategory.message).toContain("category")
	await expect(saveStatementRule(input({ priority: -1 }))).rejects.toThrow()
	expect(await db.statement_rules.count()).toBe(0)
})
test("backups, Drive tables, legacy restore and reset include rules and run state", async () => {
	await db.statements.add(statement("s"))
	const rule = await saveStatementRule(input())
	await runStatementRule(rule.id, "both")
	const backup = await exportData()
	await clearAllData()
	await importData(backup)
	expect(await statementRecommendations(["s"])).toHaveLength(2)
	expect(SYNC_TABLES).toContain("statement_rules")
	expect(SYNC_TABLES).toContain("statement_rule_runs")
	const legacy = JSON.parse(JSON.stringify(backup))
	legacy.version = 4
	delete legacy.tables.statement_rules
	delete legacy.tables.statement_rule_runs
	await importData(parseImportFile(JSON.stringify(legacy)))
	expect(await db.statement_rules.count()).toBe(0)
	expect(await db.statements.count()).toBe(1)
	await clearAllData()
	expect(await db.statement_rule_runs.count()).toBe(0)
})
test("version five upgrade preserves financial rows and clean or dirty Drive baseline", async () => {
	const { hashSnapshot } = await import("../src/data/snapshot-hash")
	for (const clean of [true, false]) {
		await db.statements.put(statement("s"))
		const backup = await exportData()
		const tables: Record<string, unknown[]> = { ...backup.tables }
		delete tables.statement_rules
		delete tables.statement_rule_runs
		const baseline = clean ? await hashSnapshot({ settings: backup.settings, tables }) : "dirty"
		const schema = Object.fromEntries(
			db.tables
				.filter(t => !["statement_rules", "statement_rule_runs"].includes(t.name))
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
