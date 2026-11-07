import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { findLatestRecordMonth, getDashboard } = await import("../../src/logic/dashboard")
beforeEach(async () => {
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
async function record(id: string, day: string) {
	await db.records.add({
		id,
		datetime: `${day} 12:00`,
		amount: -10,
		category_id: "c",
		title: id,
		people: null,
		location: null,
		description: null,
		treatment_choice: { kind: "explicit", value: "spending" },
		monthly_budget_choice: { kind: "unbudgeted" },
		revision: 1,
	})
}
test("returns null with no earlier Records", async () => {
	expect(await findLatestRecordMonth({ month: "November", year: 2026 })).toBeNull()
	await record("only", "2026-11-05")
	expect(await findLatestRecordMonth({ month: "November", year: 2026 })).toBeNull()
})
test("skips empty months on the way back", async () => {
	await record("sep", "2026-09-10")
	await record("nov", "2026-11-05")
	expect(await findLatestRecordMonth({ month: "November", year: 2026 })).toEqual({
		month: "September",
		year: 2026,
	})
	expect(await findLatestRecordMonth({ month: "December", year: 2026 })).toEqual({
		month: "November",
		year: 2026,
	})
})
test("ignores the selected month and later months", async () => {
	await record("nov", "2026-11-05")
	await record("dec", "2026-12-01")
	expect(await findLatestRecordMonth({ month: "November", year: 2026 })).toBeNull()
	expect(await findLatestRecordMonth({ month: "October", year: 2026 })).toBeNull()
})
test("dashboard reports the month's stored Record count", async () => {
	expect((await getDashboard({ month: "November", year: 2026 })).record_count).toBe(0)
	await record("nov", "2026-11-05")
	expect((await getDashboard({ month: "November", year: 2026 })).record_count).toBe(1)
})
