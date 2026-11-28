import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
import type { AnalyticsTreatment } from "@/types"
const { db } = await import("../../src/data/db")
const { listRecords, parseRecordFilters } = await import("../../src/logic/records")
const { parseMonthlyFilters } = await import("../../src/logic/monthly")

const record = (id: string, amount: number, treatment: AnalyticsTreatment) => ({
	id,
	title: id,
	people: null,
	location: null,
	description: null,
	datetime: "2026-10-03 12:00",
	amount,
	category_id: "general",
	treatment_choice: { kind: "explicit" as const, value: treatment },
	monthly_budget_choice: { kind: "category" as const },
	revision: 1,
})

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.categories.add({
		id: "general",
		name: "General",
		icon: "circle",
		color: "#000000",
		parent_category_id: null,
		analytics_treatment: "automatic",
		default_monthly_budget_id: null,
	})
	await db.records.bulkAdd([
		record("salary", 900, "income"),
		record("refund-in", 20, "automatic"),
		record("lunch", -12, "automatic"),
		record("rent", -400, "spending"),
		record("deposit", -200, "saving_investment"),
		record("redeem", 250, "saving_investment"),
		record("transfer", 50, "neutral"),
	])
})

const ids = async (filters: Parameters<typeof listRecords>[0]) =>
	(await listRecords(filters)).map(r => r.id).sort()

test("each Dashboard total's drill lists exactly the Records that total counts", async () => {
	expect(await ids({ effective_income: true })).toEqual(["refund-in", "salary"])
	expect(await ids({ effective_spending: true })).toEqual(["lunch", "rent"])
	expect(await ids({ effective_contributions: true })).toEqual(["deposit"])
	expect(await ids({ effective_withdrawals: true })).toEqual(["redeem"])
})

test("the Records list and sheet read the total drills a Dashboard tile links to", () => {
	const query = new URLSearchParams(
		"effective_income=true&effective_contributions=true&effective_withdrawals=true",
	)
	for (const filters of [parseRecordFilters(query), parseMonthlyFilters(query)]) {
		expect(filters.effective_income).toBe(true)
		expect(filters.effective_contributions).toBe(true)
		expect(filters.effective_withdrawals).toBe(true)
	}
})
