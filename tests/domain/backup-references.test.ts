import { beforeEach, expect, test } from "bun:test"
import Dexie from "dexie"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
const { db } = await import("@/data/db")
const { exportData, importData, parseImportFile } = await import("@/data/export-import")

type Backup = Awaited<ReturnType<typeof exportData>>
const tables = (b: Backup) => b.tables as Record<string, Record<string, unknown>[]>

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "a", name: "DBS", balance: 0, bank: "DBS" })
	await db.categories.add({
		id: "c",
		name: "c",
		icon: "x",
		color: "#000000",
		parent_category_id: null,
		analytics_treatment: "automatic",
		default_monthly_budget_id: "m",
	})
	await db.monthly_budgets.add({ id: "m", name: "M", color: "#123456", display_order: 1, archived: false })
	await db.budgets.add({
		id: "b",
		name: "Trip",
		amount: 100,
		start_date: "2026-10-01",
		end_date: "2026-10-31",
		automatic: false,
	} as never)
	await db.statements.add({
		id: "s",
		account_id: "a",
		description: "COFFEE",
		datetime: "2026-10-03 12:00",
		amount: -10,
		index: 0,
		is_pending: 0,
	})
	await db.records.add({
		id: "r",
		title: "Coffee",
		amount: -10,
		datetime: "2026-10-03 12:00",
		category_id: "c",
		people: null,
		location: null,
		description: null,
		treatment_choice: { kind: "category" },
		monthly_budget_choice: { kind: "explicit", id: "m" },
		revision: 1,
	})
	await db.allocations.add({ statement_id: "s", record_id: "r", amount: -10 })
	await db.budget_records.add({ budget_id: "b", record_id: "r" })
	await db.statement_rules.add({
		id: "u",
		name: "Rule",
		enabled: true,
		conditions: { mode: "all", items: [{ operator: "contains", value: "COFFEE" }] },
		actions: { category_id: { value: "c" }, monthly_budget_id: { value: "m" } },
		created_at: "2026-10-01T00:00:00.000Z",
		updated_at: "2026-10-01T00:00:00.000Z",
	})
})

test("a backup with every reference intact is accepted unchanged", async () => {
	const backup = await exportData()
	expect(tables(parseImportFile(JSON.stringify(backup))).statements).toHaveLength(1)
})

const breakers: [string, (t: Record<string, Record<string, unknown>[]>) => void][] = [
	["a Statement on a missing Account", t => void (t.statements![0]!.account_id = "x")],
	["a Record in a missing Category", t => void (t.records![0]!.category_id = "x")],
	["an Allocation on a missing Record", t => void (t.allocations![0]!.record_id = "x")],
	["an Allocation on a missing Statement", t => void (t.allocations![0]!.statement_id = "x")],
	["a Budget link to a missing Record", t => void (t.budget_records![0]!.record_id = "x")],
	["a Budget link to a missing Budget", t => void (t.budget_records![0]!.budget_id = "x")],
	["a Category default on a missing Monthly Budget", t => void (t.categories![0]!.default_monthly_budget_id = "x")],
	[
		"a rule action on a missing Category",
		t => void ((t.statement_rules![0]!.actions as Record<string, { value: string }>).category_id!.value = "x"),
	],
]

for (const [name, mutate] of breakers) {
	test(`a backup with ${name} is rejected and keeps the current data`, async () => {
		const backup = await exportData()
		mutate(tables(backup))
		await expect(importData(backup)).rejects.toThrow("not in it")
		expect(await db.statements.count()).toBe(1)
		expect(await db.records.count()).toBe(1)
		expect(await db.allocations.count()).toBe(1)
	})
}
