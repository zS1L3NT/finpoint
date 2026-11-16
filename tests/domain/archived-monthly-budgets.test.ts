import { beforeEach, expect, test } from "bun:test"
import Dexie from "dexie"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
const { db } = await import("@/data/db")
const { createRecord, updateRecord } = await import("@/logic/records")
const { createCategory, updateCategory } = await import("@/logic/categories")
const { upsertMonthlyBudget } = await import("@/logic/monthly-budgets")
const { saveStatementRule } = await import("@/logic/statement-rules")
const { ValidationError } = await import("@/logic/validate")

const base = {
	title: "Coffee",
	datetime: "2026-10-03T12:00",
	amount: -10,
	category_id: "c",
}
const category = {
	name: "Fun",
	icon: "x",
	color: "#000000",
}
const budget = (id: string, archived: boolean) => ({
	id,
	name: id,
	color: "#123456",
	display_order: 10,
	archived,
})

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.categories.add({
		id: "c",
		name: "Cafe",
		icon: "x",
		color: "#000000",
		parent_category_id: null,
		analytics_treatment: "automatic",
		default_monthly_budget_id: null,
	})
	await db.monthly_budgets.bulkAdd([budget("live", false), budget("old", true)])
})

async function fields(run: () => Promise<unknown>) {
	try {
		await run()
	} catch (error) {
		if (error instanceof ValidationError) return Object.keys(error.errors)
		throw error
	}
	return []
}

test("a Record rejects a missing Monthly Budget on create and update", async () => {
	expect(await fields(() => createRecord({ ...base, monthly_budget_id: "gone" }))).toEqual([
		"monthly_budget_id",
	])
	const record = await createRecord({ ...base, monthly_budget_id: "live" })
	expect(await fields(() => updateRecord(record.id, { ...base, monthly_budget_id: "gone" }))).toEqual([
		"monthly_budget_id",
	])
})

test("a Record cannot newly take an archived Monthly Budget", async () => {
	expect(await fields(() => createRecord({ ...base, monthly_budget_id: "old" }))).toEqual([
		"monthly_budget_id",
	])
	const record = await createRecord({ ...base, monthly_budget_id: "live" })
	expect(await fields(() => updateRecord(record.id, { ...base, monthly_budget_id: "old" }))).toEqual([
		"monthly_budget_id",
	])
})

test("a Record that already has an archived Monthly Budget can still be saved", async () => {
	const record = await createRecord({ ...base, monthly_budget_id: "live" })
	await db.monthly_budgets.update("live", { archived: true })
	expect(
		await fields(() => updateRecord(record.id, { ...base, title: "Tea", monthly_budget_id: "live" })),
	).toEqual([])
})

test("a Category cannot newly take an archived default Monthly Budget", async () => {
	expect(
		await fields(() => createCategory({ ...category, default_monthly_budget_id: "old" })),
	).toEqual(["default_monthly_budget_id"])
	expect(
		await fields(() => updateCategory("c", { ...category, name: "c", default_monthly_budget_id: "old" })),
	).toEqual(["default_monthly_budget_id"])
})

test("a Category that already has an archived default keeps it when saved", async () => {
	await db.categories.update("c", { default_monthly_budget_id: "old" })
	expect(
		await fields(() => updateCategory("c", { ...category, name: "c", default_monthly_budget_id: "old" })),
	).toEqual([])
})

const archive = (id: string) =>
	upsertMonthlyBudget({
		id,
		name: id,
		color: "#123456",
		archived: true,
		month: "2026-10-01",
		amount: null,
		scope: "inherit",
	})

test("archiving a Monthly Budget is refused while a Category default uses it", async () => {
	await db.categories.update("c", { default_monthly_budget_id: "live" })
	expect(await fields(() => archive("live"))).toEqual(["archived"])
	expect((await db.monthly_budgets.get("live"))?.archived).toBe(false)
})

test("archiving a Monthly Budget is refused while a Statement Rule uses it", async () => {
	await saveStatementRule({
		name: "Coffee",
		enabled: true,
		conditions: { mode: "all", items: [{ operator: "contains", value: "COFFEE" }] },
		actions: { monthly_budget_id: { value: "live" } },
	})
	expect(await fields(() => archive("live"))).toEqual(["archived"])
	expect((await db.monthly_budgets.get("live"))?.archived).toBe(false)
})

test("an unused Monthly Budget can be archived", async () => {
	expect(await fields(() => archive("live"))).toEqual([])
	expect((await db.monthly_budgets.get("live"))?.archived).toBe(true)
})
