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

test("a Monthly Budget's quiet month still counts as a comparison month", async () => {
	await db.categories.add({
		id: "c",
		name: "Misc",
		icon: "",
		color: "",
		parent_category_id: null,
		analytics_treatment: "spending",
		default_monthly_budget_id: null,
	})
	const base = { name: "Travel", color: "#123456", month: today.toFormat("yyyy-MM-01"), amount: 100, scope: "month" }
	const travel = await upsertMonthlyBudget(base)
	const food = await upsertMonthlyBudget({ ...base, name: "Food" })
	for (const [id, offset, budget, amount] of [
		["travel-1", 1, travel.id, -400],
		["food-2", 2, food.id, -50],
	] as const) {
		await db.records.add({
			id,
			title: id,
			amount,
			datetime: today.minus({ months: offset }).toFormat("yyyy-MM-01 12:00"),
			category_id: "c",
			people: null,
			location: null,
			description: null,
			treatment_choice: { kind: "explicit", value: "spending" },
			monthly_budget_choice: { kind: "explicit", id: budget },
			revision: 1,
		})
	}
	const input = { month: today.toFormat("MMMM"), year: today.year }
	const all = await getDashboardView({ ...input, scope: "all" })
	const scoped = await getDashboardView({ ...input, scope: travel.id })
	expect(all.scopedComparisonCount).toBe(2)
	expect(scoped.scopedComparisonCount).toBe(2)
})
