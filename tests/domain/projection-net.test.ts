import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { upsertMonthlyBudget } = await import("../../src/logic/monthly-budgets")
const { getDashboardView } = await import("../../src/logic/dashboard")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

test("Projected month-end and Usage pace use the same net daily rate", async () => {
	const { Settings } = await import("luxon")
	const previousNow = Settings.now
	try {
		Settings.now = () => 1791201600000
		await db.categories.add({
			id: "c",
			name: "Food",
			icon: "",
			color: "",
			parent_category_id: null,
			analytics_treatment: "spending",
			default_monthly_budget_id: null,
		})
		const budget = await upsertMonthlyBudget({
			name: "Food",
			color: "#123456",
			month: "2026-10-01",
			amount: 1000,
			scope: "month",
		})
		for (const [id, day, amount] of [
			["spent", "01", -100],
			["refund", "02", 20],
		] as const) {
			await db.records.add({
				id,
				title: id,
				amount,
				datetime: `2026-10-${day} 12:00`,
				category_id: "c",
				people: null,
				location: null,
				description: null,
				treatment_choice: { kind: "explicit", value: "spending" },
				monthly_budget_choice: { kind: "explicit", id: budget.id },
				revision: 1,
			})
		}
		const { pace } = await getDashboardView({ month: "October", year: 2026, scope: "all" })
		const { projection } = pace
		expect(projection.daily_spending).toBe(projection.monthly_budget?.usage_pace)
		expect(projection.projected_spending).toBe(projection.monthly_budget?.projected)
	} finally {
		Settings.now = previousNow
	}
})
