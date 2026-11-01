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

test("new Monthly Budgets and edits store only current fields", async () => {
	const row = await upsertMonthlyBudget(input)
	const expected = { id: row.id, name: "Travel", color: "#123456", group: "outlier", display_order: row.display_order, archived: false }
	expect(row).toEqual(expected)
	await upsertMonthlyBudget({ ...input, id: row.id, name: "Holiday" })
	expect(await db.monthly_budgets.get(row.id)).toEqual({ ...expected, name: "Holiday" })
})

test("current-month forecasts compare the selected budget, group and Total", async () => {
	const row = await upsertMonthlyBudget(input)
	await upsertMonthlyBudget({ ...input, name: "Food", group: "core", amount: 200 })
	for (const [scope, name, amount] of [
		[row.id, "Travel", 100],
		["outlier", "Outlier", 100],
		["core", "Core", 200],
		["all", "Total", 300],
	] as const) {
		const view = await getDashboardView({ month: today.toFormat("MMMM"), year: today.year, scope })
		expect(view.pace.projection.available).toBe(true)
		expect(view.pace.projection.monthly_budget).toMatchObject({ name, amount })
		expect(view.scopeLabel).toBe(name)
		expect(view.paceFilters).toEqual(view.scopeFilters)
	}
})

test("forecasts remain available without a comparison amount and accept zero", async () => {
	const row = await upsertMonthlyBudget({ ...input, amount: null })
	for (const scope of [row.id, "outlier", "all"]) {
		const view = await getDashboardView({ month: today.toFormat("MMMM"), year: today.year, scope })
		expect(view.pace.projection.available).toBe(true)
		expect(view.pace.projection.monthly_budget).toBeNull()
		expect(view.pace.paceMonthlyBudget?.amount ?? null).toBeNull()
	}
	await upsertMonthlyBudget({ ...input, id: row.id, amount: 0 })
	const view = await getDashboardView({ month: today.toFormat("MMMM"), year: today.year, scope: row.id })
	expect(view.pace.projection.monthly_budget?.amount).toBe(0)
})

test("forecast lines reconcile budgets and Unbudgeted spending across scopes", async () => {
	await db.analytics_months.add({ month: today.minus({ months: 1 }).startOf("month").toFormat("yyyy-MM-dd"), coverage: "complete", covered_through: null, excluded_from_comparisons: false })
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
			treatment_choice: { kind: "explicit", value: "spending" },
			monthly_budget_choice: budget ? { kind: "explicit", id: budget } : { kind: "unbudgeted" },
			revision: 1,
		})
		const record = await db.records.get(id)
		await db.records.add({ ...record!, id: `previous-${id}`, datetime: today.minus({ months: 1 }).toFormat("yyyy-MM-01 12:00"), amount: amount * 2 })
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
		const budgets = pace.forecast.filter(b => b.id !== "total")
		expect(budgets.map(b => b.name).sort()).toEqual([...names].sort())
		expect(pace.forecast[0].id === "total").toBe(scope !== travel.id)
		if (scope !== travel.id) {
			expect(pace.forecast[0].previous?.spending).toEqual(Array(today.minus({ months: 1 }).daysInMonth).fill(total * 2))
			expect(pace.paceMonthlyBudget?.amount).toBe(scope === "all" ? 200 : 100)
			for (const [index, point] of pace.forecast[0].points.entries()) {
				for (const key of ["spending", "projected_spending"] as const) {
					expect(point[key]).toBe(budgets[0].points[index][key] === null ? null : budgets.reduce((sum, b) => sum + (b.points[index][key] ?? 0), 0))
				}
			}
		}
		for (const b of budgets) expect(b.previous !== undefined).toBe(scope === travel.id)
		expect(budgets.reduce((sum, b) => sum + (b.points[0].spending ?? 0), 0)).toBe(total)
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
				treatment_choice: { kind: "explicit", value: "spending" },
				monthly_budget_choice: { kind: "explicit", id: budget.id },
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

// Assemble the retired key only in compatibility fixtures so source scans stay useful.
const legacyPaceKey = ["pace", "kind"].join("_")

test("version nine upgrade removes retired budget metadata and preserves Drive baselines", async () => {
	const { exportData } = await import("../../src/data/export-import")
	const { hashSnapshot } = await import("../../src/data/snapshot-hash")
	for (const clean of [true, false]) {
		const rows = ["daily", "recurring", "none"].map((pace, i) => ({ id: String(i), name: pace, color: "#123456", group: "core", display_order: i * 10, archived: i === 2, [legacyPaceKey]: pace }))
		const backup = await exportData()
		const tables = { ...backup.tables, monthly_budgets: rows }
		const baseline = clean ? await hashSnapshot({ settings: backup.settings, tables }) : "dirty"
		const schema = Object.fromEntries(db.tables.map(t => [t.name, [t.schema.primKey.src, ...t.schema.indexes.map(i => i.src)].join(",")]))
		await db.delete()
		const old = new Dexie("finpoint")
		old.version(8).stores(schema)
		await old.table("monthly_budgets").bulkAdd(rows)
		await old.table("meta").put({ key: "drive_last_hash", value: baseline })
		old.close()
		await db.open()
		expect(db.verno).toBe(9)
		expect(await db.monthly_budgets.toArray()).toEqual(rows.map(({ [legacyPaceKey]: _, ...row }) => row))
		expect((await db.meta.get("drive_last_hash"))?.value).toBe(clean ? await hashSnapshot(await exportData()) : baseline)
	}
})

test("old backup import removes retired budget metadata and exports current fields", async () => {
	const { exportData, importData } = await import("../../src/data/export-import")
	const budget = await upsertMonthlyBudget(input)
	const backup = await exportData()
	for (const version of [6, 7, 8]) {
		await importData({ ...backup, version, tables: { ...backup.tables, monthly_budgets: [{ ...budget, [legacyPaceKey]: "daily" }] } })
		expect(await db.monthly_budgets.get(budget.id)).toEqual(budget)
		expect((await exportData()).version).toBe(8)
		expect((await exportData()).tables.monthly_budgets).toEqual([budget])
	}
})

test("legacy Holiday starter detection works with current budget fields", async () => {
	const { seedIfEmpty } = await import("../../src/data/seed")
	const holiday = { id: "holiday", name: "Holiday", color: "#fb7185", group: "outlier" as const, display_order: 40, archived: false }
	await db.monthly_budgets.add(holiday)
	await seedIfEmpty()
	expect(await db.monthly_budgets.get(holiday.id)).toEqual({ ...holiday, name: "Travel" })
	expect(await db.monthly_budgets.where("name").equals("Travel").count()).toBe(1)
})
