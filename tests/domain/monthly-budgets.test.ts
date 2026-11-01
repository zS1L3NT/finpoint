import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
import { DateTime } from "luxon"
const { db } = await import("../../src/data/db")
const { upsertMonthlyBudget } = await import("../../src/logic/monthly-budgets")
const { getDashboardView } = await import("../../src/logic/dashboard")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

const today = DateTime.now()
const input = {
	name: "Travel",
	color: "#123456",
	group: "outlier",
	month: today.toFormat("yyyy-MM-01"),
	amount: 100,
	scope: "month",
}

test("new Monthly Budgets store none and edits preserve the legacy column", async () => {
	const row = await upsertMonthlyBudget(input)
	expect(row.pace_kind).toBe("none")
	await db.monthly_budgets.update(row.id, { pace_kind: "daily" })
	await upsertMonthlyBudget({ ...input, id: row.id, name: "Holiday" })
	expect((await db.monthly_budgets.get(row.id))?.pace_kind).toBe("daily")
})

test("current-month forecasts compare the selected budget, group and All spending", async () => {
	const row = await upsertMonthlyBudget(input)
	await upsertMonthlyBudget({ ...input, name: "Food", group: "core", amount: 200 })
	for (const [scope, name, amount] of [
		[row.id, "Travel", 100],
		["outlier", "Outlier", 100],
		["core", "Core", 200],
		["all", "All spending", 300],
	] as const) {
		const view = await getDashboardView({ month: today.toFormat("MMMM"), year: today.year, scope })
		expect(view.pace.projection.available).toBe(true)
		expect(view.pace.projection.monthly_budget).toMatchObject({ name, amount })
		expect(view.paceFilters).toEqual(view.scopeFilters)
	}
})

test("forecasts remain available without a comparison amount and accept zero", async () => {
	const row = await upsertMonthlyBudget({ ...input, amount: null })
	for (const scope of [row.id, "outlier", "all"]) {
		const view = await getDashboardView({ month: today.toFormat("MMMM"), year: today.year, scope })
		expect(view.pace.projection.available).toBe(true)
		expect(view.pace.projection.monthly_budget).toBeNull()
	}
	await upsertMonthlyBudget({ ...input, id: row.id, amount: 0 })
	const view = await getDashboardView({ month: today.toFormat("MMMM"), year: today.year, scope: row.id })
	expect(view.pace.projection.monthly_budget?.amount).toBe(0)
})
