import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { afterEach, beforeEach, expect, test } from "bun:test"
import { Settings } from "luxon"
const { db } = await import("../../src/data/db")
const { getPaceView } = await import("../../src/logic/dashboard")
const now = Settings.now
beforeEach(async () => {
	Settings.now = () => new Date("2026-11-03T12:00:00").getTime()
	for (const table of db.tables) await table.clear()
	await db.categories.add({
		id: "c",
		name: "Rent",
		icon: "",
		color: "",
		parent_category_id: null,
		analytics_treatment: "spending",
		default_monthly_budget_id: null,
	})
})
afterEach(() => {
	Settings.now = now
})
async function spend(id: string, day: string, amount: number, budget?: string) {
	await db.records.add({
		id,
		datetime: `${day} 12:00`,
		amount: -amount,
		category_id: "c",
		title: id,
		people: null,
		location: null,
		description: null,
		treatment_choice: { kind: "explicit", value: "spending" },
		monthly_budget_choice: budget ? { kind: "explicit", id: budget } : { kind: "unbudgeted" },
		revision: 1,
	})
}
const pace = () => getPaceView("November", 2026, "all")
test("day-1 rent without history uses the median including zero days", async () => {
	await spend("rent", "2026-11-01", 1400)
	expect((await pace()).projection.projected_spending).toBe(1400)
	Settings.now = () => new Date("2026-11-01T12:00:00").getTime()
	expect((await pace()).projection.projected_spending).toBe(42000)
})
test("rent with two months of history uses only the scaled remaining spending plus scheduled Records", async () => {
	for (const month of ["09", "10"]) {
		await spend(`rent-${month}`, `2026-${month}-01`, 1400)
		await spend(`food-${month}`, `2026-${month}-20`, 270)
	}
	await spend("rent", "2026-11-01", 1400)
	await spend("scheduled", "2026-11-25", 50)
	const view = await pace()
	expect(view.projection.projected_spending).toBe(1715.18)
	expect(view.forecast[0].points.at(-1)?.projected_spending).toBe(1715.18)
})
test("mid-month big purchase does not multiply into the remaining days", async () => {
	Settings.now = () => new Date("2026-11-15T12:00:00").getTime()
	await spend("purchase", "2026-11-15", 2000)
	expect((await pace()).projection.projected_spending).toBe(2000)
})
test("future month retains scheduled Records without a projection", async () => {
	await spend("scheduled", "2026-12-01", 1400)
	const view = await getPaceView("December", 2026, "all")
	expect(view.projection.available).toBe(false)
	expect(view.spending).toBe(0)
})
test("completed month reports actual spending without extrapolation", async () => {
	await spend("rent", "2026-10-01", 1400)
	const view = await getPaceView("October", 2026, "all")
	expect(view.projection.available).toBe(false)
	expect(view.completedMonth?.spending).toBe(1400)
})
test("forecast honours comparison exclusions and complete empty months", async () => {
	await spend("rent", "2026-11-01", 1400)
	await spend("excluded", "2026-10-20", 5000)
	await spend("outside-window", "2026-08-20", 5000)
	await db.analytics_months.bulkAdd([
		{
			month: "2026-10-01",
			coverage: "complete",
			covered_through: null,
			excluded_from_comparisons: true,
		},
		{
			month: "2026-09-01",
			coverage: "complete",
			covered_through: null,
			excluded_from_comparisons: false,
		},
	])
	const view = await pace()
	expect(view.projection.history_remaining).toBe(0)
	expect(view.projection.projected_spending).toBe(1400)
})

test("Total forecast uses total daily median when budget medians differ", async () => {
	for (const [index, id] of ["a", "b", "c"].entries()) {
		await db.monthly_budgets.add({
			id,
			name: id,
			color: "#123456",
			display_order: index,
			archived: false,
		})
		await spend(id, `2026-11-0${index + 1}`, 100, id)
	}
	const view = await pace()
	expect(view.projection.projected_spending).toBe(3000)
	expect(view.forecast[0].points.at(-1)?.projected_spending).toBe(3000)
})
