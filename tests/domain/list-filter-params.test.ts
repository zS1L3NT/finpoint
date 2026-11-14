import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { parseMonthlyFilters, getMonthlyRecords } = await import("../../src/logic/monthly")
const { parseRecordFilters } = await import("../../src/logic/records")
const { parseStatementFilters } = await import("../../src/logic/statements")

const url = (query: string) => new URLSearchParams(query)

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

test("an absent, false and true Statement flag are three different filters", () => {
	expect(parseStatementFilters(url("")).is_pending).toBeUndefined()
	expect(parseStatementFilters(url("is_pending=false")).is_pending).toBe(false)
	expect(parseStatementFilters(url("is_pending=true")).is_pending).toBe(true)
	expect(parseStatementFilters(url("is_unallocated=false")).is_unallocated).toBe(false)
	expect(parseStatementFilters(url("is_unallocated=true")).is_unallocated).toBe(true)
})

test("the Statement list reads only true and false, never 1 or 0", () => {
	expect(parseStatementFilters(url("is_pending=1")).is_pending).toBeUndefined()
	expect(parseStatementFilters(url("is_unallocated=0")).is_unallocated).toBeUndefined()
})

test("the Statement list reads the Account, dates and amounts the page writes", () => {
	expect(
		parseStatementFilters(
			url("account_id=dbs&start_date=2026-10-01&end_date=2026-10-31&min_amount=-50.5&max_amount=0"),
		),
	).toEqual({
		account_id: "dbs",
		is_pending: undefined,
		is_unallocated: undefined,
		start_date: "2026-10-01",
		end_date: "2026-10-31",
		min_amount: -50.5,
		max_amount: 0,
	})
	expect(parseStatementFilters(url("account_id=all")).account_id).toBeUndefined()
	expect(parseStatementFilters(url("account_id=")).account_id).toBeUndefined()
})

test("empty and non-numeric amounts are no filter, zero is a filter", () => {
	for (const parse of [parseStatementFilters, parseRecordFilters]) {
		expect(parse(url("min_amount=&max_amount=abc"))).toMatchObject({
			min_amount: undefined,
			max_amount: undefined,
		})
		expect(parse(url("min_amount=0")).min_amount).toBe(0)
	}
})

test("an absent, false and true Record is_allocated are three different filters", () => {
	expect(parseRecordFilters(url("")).is_allocated).toBeUndefined()
	expect(parseRecordFilters(url("is_allocated=false")).is_allocated).toBe(false)
	expect(parseRecordFilters(url("is_allocated=true")).is_allocated).toBe(true)
})

test("the Record list also reads 1 and 0 so existing links keep their meaning", () => {
	expect(parseRecordFilters(url("is_allocated=1")).is_allocated).toBe(true)
	expect(parseRecordFilters(url("is_allocated=0")).is_allocated).toBe(false)
	expect(parseRecordFilters(url("show_unbudgeted=1")).show_unbudgeted).toBe(true)
	expect(parseRecordFilters(url("show_unbudgeted=true")).show_unbudgeted).toBe(true)
	expect(parseRecordFilters(url("show_unbudgeted=0")).show_unbudgeted).toBe(false)
	expect(parseRecordFilters(url("show_unbudgeted=yes")).show_unbudgeted).toBeUndefined()
})

test("category ids come back as a list, empty ones as no filter", () => {
	expect(parseRecordFilters(url("category_ids=food")).category_ids).toEqual(["food"])
	expect(parseRecordFilters(url("category_ids=food,coffee,,rent")).category_ids).toEqual([
		"food",
		"coffee",
		"rent",
	])
	expect(parseRecordFilters(url("category_ids=")).category_ids).toBeUndefined()
	expect(parseRecordFilters(url("category_ids=,")).category_ids).toBeUndefined()
	expect(parseRecordFilters(url("")).category_ids).toBeUndefined()
})

test("the Record list reads the other filters the page writes", () => {
	expect(
		parseRecordFilters(
			url("start_date=2026-10-01&monthly_budget_id=mb&treatment=spending&max_amount=12"),
		),
	).toMatchObject({
		start_date: "2026-10-01",
		end_date: undefined,
		monthly_budget_id: "mb",
		treatment: "spending",
		max_amount: 12,
	})
})

test("the Records sheet reads the filters a Dashboard drill writes", () => {
	expect(
		parseMonthlyFilters(
			url(
				"category_ids=food,coffee&effective_spending=true&show_unbudgeted=true&start_date=2026-10-01&end_date=2026-10-31&monthly_budget_id=mb&treatment=spending&is_allocated=false",
			),
		),
	).toEqual({
		category_ids: ["food", "coffee"],
		is_allocated: false,
		monthly_budget_id: "mb",
		show_unbudgeted: true,
		effective_spending: true,
		treatment: "spending",
		start_date: "2026-10-01",
		end_date: "2026-10-31",
	})
	expect(parseMonthlyFilters(url(""))).toEqual({
		category_ids: undefined,
		is_allocated: undefined,
		monthly_budget_id: undefined,
		show_unbudgeted: undefined,
		effective_spending: undefined,
		treatment: undefined,
		start_date: undefined,
		end_date: undefined,
	})
})

test("the Records sheet keeps 1 and 0 for is_allocated but reads other flags as true only", () => {
	expect(parseMonthlyFilters(url("is_allocated=1")).is_allocated).toBe(true)
	expect(parseMonthlyFilters(url("is_allocated=0")).is_allocated).toBe(false)
	expect(parseMonthlyFilters(url("show_unbudgeted=1")).show_unbudgeted).toBeUndefined()
	expect(parseMonthlyFilters(url("effective_spending=1")).effective_spending).toBeUndefined()
	expect(parseMonthlyFilters(url("show_unbudgeted=false")).show_unbudgeted).toBe(false)
})

test("the Records sheet parses a plain map of the sheet's filters", () => {
	expect(
		parseMonthlyFilters(new Map([["category_ids", "food"], ["is_allocated", "false"]])),
	).toMatchObject({ category_ids: ["food"], is_allocated: false })
})

test("a Category filter on the Records sheet includes its child Categories", async () => {
	const category = (id: string, parent: string | null) => ({
		id,
		name: id,
		icon: "circle",
		color: "#000000",
		parent_category_id: parent,
		analytics_treatment: "automatic" as const,
		default_monthly_budget_id: null,
	})
	const record = (id: string, category_id: string) => ({
		id,
		title: id,
		people: null,
		location: null,
		description: null,
		datetime: "2026-10-03 12:00",
		amount: -5,
		category_id,
		treatment_choice: { kind: "category" as const },
		monthly_budget_choice: { kind: "category" as const },
		revision: 1,
	})
	await db.categories.bulkAdd([category("food", null), category("coffee", "food"), category("rent", null)])
	await db.records.bulkAdd([record("r1", "food"), record("r2", "coffee"), record("r3", "rent")])

	const filtered = await getMonthlyRecords(
		"October",
		2026,
		parseMonthlyFilters(url("category_ids=food")),
	)
	expect(filtered.records.map(r => r.id).sort()).toEqual(["r1", "r2"])

	const all = await getMonthlyRecords("October", 2026, parseMonthlyFilters(url("category_ids=")))
	expect(all.records).toHaveLength(3)
})
