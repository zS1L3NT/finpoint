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

test("forecast lines reconcile budgets and Unbudgeted spending across scopes", async () => {
	await db.categories.add({
		id: "c",
		name: "Food",
		icon: "",
		color: "",
		parent_category_id: null,
		analytics_treatment: "spending",
		default_monthly_budget_id: null,
	})
	const travel = await upsertMonthlyBudget(input)
	const food = await upsertMonthlyBudget({ ...input, name: "Food", group: "core" })
	for (const [id, budget, amount] of [
		["a", travel.id, -30],
		["b", food.id, -20],
		["c", null, -10],
	] as const) {
		await db.records.add({
			id,
			title: id,
			amount,
			datetime: today.toFormat("yyyy-MM-01 12:00"),
			category_id: "c",
			people: null,
			location: null,
			description: null,
			analytics_treatment: "spending",
			analytics_treatment_source: "manual",
			monthly_budget_id: budget,
			monthly_budget_source: "manual",
			revision: 1,
		})
	}
	for (const [scope, names, total] of [
		["all", ["Travel", "Food", "Unbudgeted"], 60],
		["core", ["Food"], 20],
		[travel.id, ["Travel"], 30],
	] as const) {
		const { pace } = await getDashboardView({
			month: today.toFormat("MMMM"),
			year: today.year,
			scope,
		})
		expect(pace.forecast.map(b => b.name).sort()).toEqual([...names].sort())
		expect(pace.forecast.reduce((sum, b) => sum + (b.points[0].spending ?? 0), 0)).toBe(total)
		expect(pace.forecast.find(b => b.name === "Travel")?.color ?? food.color).toBe("#123456")
		for (const b of pace.forecast) {
			expect(b.points[today.day - 1].projected_spending).toBe(
				b.points[today.day - 1].spending,
			)
			expect(b.points.at(-1)?.projected_spending).toBeGreaterThanOrEqual(
				b.points[0].spending ?? 0,
			)
		}
	}
})

test("forecast projections retain gross pace after refunds and add scheduled spending", async () => {
	const { Settings } = await import("luxon")
	const previousNow = Settings.now
	try {
		// Use a fixed clock so scheduled Records remain in the future on every run.
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
		const budget = await upsertMonthlyBudget({ ...input, month: "2026-10-01" })
		for (const [id, day, amount] of [
			["spent", "01", -100],
			["refund", "02", 20],
			["scheduled", "10", -50],
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
				analytics_treatment: "spending",
				analytics_treatment_source: "manual",
				monthly_budget_id: budget.id,
				monthly_budget_source: "manual",
				revision: 1,
			})
		}
		const { pace } = await getDashboardView({ month: "October", year: 2026, scope: budget.id })
		expect(pace.forecast[0].points[4].spending).toBe(80)
		expect(pace.forecast[0].points[4].projected_spending).toBe(80)
		expect(pace.forecast[0].points[9].projected_spending).toBe(230)
		expect(pace.forecast[0].points[30].projected_spending).toBe(650)
	} finally {
		Settings.now = previousNow
	}
})
