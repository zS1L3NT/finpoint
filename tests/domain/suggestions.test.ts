import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
import { DateTime } from "luxon"
import type { RecordRow, StatementRow } from "../../src/data/db"
const { db } = await import("../../src/data/db")
const { importData } = await import("../../src/data/export-import")
const { generateTestData } = await import("../../src/data/test-data")
const { createMatchingRecords } = await import("../../src/logic/records")
const { saveStatementRule } = await import("../../src/logic/statement-rules")
const {
	descriptionTokens,
	recordSuggestions,
	recurringCharges,
	similarStatements,
	suggestedStatementRules,
	suggestionAccuracy,
} = await import("../../src/logic/suggestions")

let ids = 0
const statement = (description: string, overrides: Partial<StatementRow> = {}): StatementRow => ({
	id: `s${++ids}`,
	account_id: "a",
	description,
	datetime: "2026-10-01 12:00",
	amount: -15,
	is_pending: 0,
	index: 0,
	...overrides,
})
const record = (overrides: Partial<RecordRow> = {}): RecordRow => ({
	id: `r${++ids}`,
	title: "Grab Ride",
	people: null,
	location: null,
	description: null,
	datetime: "2026-10-01 12:00",
	amount: -15,
	category_id: "transport",
	analytics_treatment: "spending",
	analytics_treatment_source: "category",
	monthly_budget_id: null,
	monthly_budget_source: null,
	revision: 1,
	...overrides,
})
/** Adds a Statement and the Record the user made from it. */
async function decided(description: string, details: Partial<RecordRow>, at = "2026-10-01 12:00") {
	const s = statement(description, { datetime: at, amount: details.amount ?? -15 })
	const r = record({ datetime: at, ...details })
	await db.statements.add(s)
	await db.records.add(r)
	await db.allocations.add({ statement_id: s.id, record_id: r.id, amount: s.amount })
	return { statement: s, record: r }
}
const chip = (chips: { field: string; value: string }[], field: string) =>
	chips.filter(c => c.field === field).map(c => c.value)

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "a", name: "DBS", balance: 0, bank: "DBS" })
	for (const [id, name] of [
		["transport", "Transport"],
		["dining", "Dining"],
		["groceries", "Groceries"],
		["subscriptions", "Subscriptions"],
	])
		await db.categories.add({
			id,
			name,
			icon: "",
			color: "",
			parent_category_id: null,
			analytics_treatment: "spending",
			default_monthly_budget_id: null,
		})
	await db.monthly_budgets.add({
		id: "recurring",
		name: "Recurring",
		color: "",
		group: "core",
		pace_kind: "recurring",
		display_order: 1,
		archived: false,
	})
})

test("descriptions reduce to words; reference codes and numbers drop out", () => {
	expect(descriptionTokens("Grab* A-AWBP8DAGWKCFAV Singapore SGP")).toEqual([
		"grab",
		"singapore",
		"sgp",
	])
	expect(descriptionTokens("7-ELEVEN-QUEENSTOWN MR Singapore SGP")).toEqual([
		"eleven",
		"queenstown",
		"mr",
		"singapore",
		"sgp",
	])
})

test("a new Statement gets the details past Records made from similar Statements", async () => {
	for (let day = 1; day <= 4; day++)
		await decided(`Grab* A-CODE${day} Singapore SGP`, {}, `2026-10-0${day} 12:00`)
	for (let day = 1; day <= 4; day++)
		await decided(
			"FAIRPRICE-QUEENSTOWN Singapore SGP",
			{ title: "FairPrice Run", category_id: "groceries", amount: -40 },
			`2026-10-0${day} 18:00`,
		)
	const grab = statement("Grab* A-AWBP8DAGWKCFAV Singapore SGP", { amount: -18.1 })
	await db.statements.add(grab)

	const { chips, ranked } = await recordSuggestions({ statementIds: [grab.id] })

	// Shared bank text ("Singapore SGP") carries little weight; the merchant decides.
	expect(chip(chips, "title")).toEqual(["Grab Ride"])
	expect(chip(chips, "category_id")).toEqual(["transport"])
	expect(chips.find(c => c.field === "title")?.reason).toBe(
		"Learned from 4 past Records like “Grab Ride”",
	)
	expect(ranked.title[0]).toBe("Grab Ride")
	expect(ranked.title).not.toContain("FairPrice Run")
})

test("amount and time of day separate the same merchant's different Records", async () => {
	for (const day of ["05", "06", "07", "08"]) {
		await decided("GRAB SINGAPORE", { title: "Grab to work", amount: -15 }, `2026-10-${day} 08:10`)
		await decided("GRAB SINGAPORE", { title: "Grab home", amount: -32 }, `2026-10-${day} 23:30`)
	}
	await decided("GRAB SINGAPORE", { title: "Unrelated" }, "2026-10-09 12:00")
	const morning = statement("GRAB SINGAPORE", { datetime: "2026-10-12 08:30", amount: -16 })
	const night = statement("GRAB SINGAPORE", { datetime: "2026-10-12 23:10", amount: -30 })
	await db.statements.bulkAdd([morning, night])

	expect(chip((await recordSuggestions({ statementIds: [morning.id] })).chips, "title")[0]).toBe(
		"Grab to work",
	)
	expect(chip((await recordSuggestions({ statementIds: [night.id] })).chips, "title")[0]).toBe(
		"Grab home",
	)
})

test("a typed title brings its usual Category, people and place without any Statement", async () => {
	for (const day of ["01", "02", "03"])
		await decided(
			`HAWKER ${day}`,
			{ title: "Lunch", category_id: "dining", people: "Alex", location: "Maxwell" },
			`2026-10-${day} 12:00`,
		)

	const { chips } = await recordSuggestions({ statementIds: [], title: " lunch " })

	expect(chip(chips, "title")).toEqual([])
	expect(chip(chips, "category_id")).toEqual(["dining"])
	expect(chip(chips, "people")).toEqual(["Alex"])
	expect(chips.find(c => c.field === "people")?.reason).toBe(
		"Learned from 3 past Records titled “Lunch”",
	)
})

test("fields the similar Records mostly left empty get no chip", async () => {
	for (let day = 1; day <= 5; day++)
		await decided("MRT TOP-UP", { title: "MRT Top-up" }, `2026-10-0${day} 09:00`)
	await decided("MRT TOP-UP", { title: "MRT Top-up", people: "Sam" }, "2026-10-06 09:00")
	const query = statement("MRT TOP-UP")
	await db.statements.add(query)

	const { chips } = await recordSuggestions({ statementIds: [query.id] })

	expect(chip(chips, "people")).toEqual([])
	expect(chip(chips, "title")).toEqual(["MRT Top-up"])
})

test("recent decisions outweigh older ones, so changed habits show first", async () => {
	for (const month of ["01", "02", "03", "04"])
		await decided("NETFLIX.COM", { title: "Netflix", category_id: "dining" }, `2025-${month}-01 10:00`)
	for (const month of ["08", "09"])
		await decided(
			"NETFLIX.COM",
			{ title: "Netflix", category_id: "subscriptions" },
			`2026-${month}-01 10:00`,
		)
	const query = statement("NETFLIX.COM", { datetime: "2026-10-01 10:00" })
	await db.statements.add(query)

	expect(chip((await recordSuggestions({ statementIds: [query.id] })).chips, "category_id")[0]).toBe(
		"subscriptions",
	)
})

test("similar allocable Statements are offered and become one Record each", async () => {
	await decided("GRAB SINGAPORE", {}, "2026-10-01 08:00")
	const selected = statement("GRAB SINGAPORE", { datetime: "2026-10-02 08:00" })
	const other = statement("GRAB SINGAPORE", { datetime: "2026-10-03 21:15", amount: -22.5 })
	const refund = statement("GRAB SINGAPORE", { amount: 15 })
	const different = statement("FAIRPRICE SINGAPORE")
	await db.statements.bulkAdd([selected, other, refund, different])
	await db.statements.add(statement("FAIRPRICE SINGAPORE"))

	const similar = await similarStatements([selected.id])
	expect(similar.map(s => s.id)).toEqual([other.id])

	const created = await createMatchingRecords(
		{ title: "Grab Ride", category_id: "transport" },
		similar.map(s => s.id),
	)
	expect(created).toBe(1)
	const allocation = await db.allocations.where("statement_id").equals(other.id).first()
	expect(await db.records.get(allocation?.record_id ?? "")).toMatchObject({
		title: "Grab Ride",
		amount: -22.5,
		datetime: "2026-10-03 21:15",
	})
	expect(await similarStatements([selected.id])).toEqual([])
})

test("repeated decisions propose a rule with its own dry run, until a rule covers them", async () => {
	for (let day = 1; day <= 9; day++)
		await decided(`Grab* A-CODE${day} Singapore SGP`, {}, `2026-10-0${day} 12:00`)
	await decided("Grab* A-CODEX Singapore SGP", { title: "Grab Food", category_id: "dining" })
	for (let day = 1; day <= 3; day++)
		await decided(`HAWKER STALL ${day} Singapore SGP`, { title: "Lunch", category_id: "dining" })

	const [suggestion, ...rest] = await suggestedStatementRules()

	expect(suggestion).toMatchObject({
		name: "Grab Ride",
		conditions: { mode: "all", items: [{ operator: "contains", value: "Grab" }] },
		actions: { category_id: { value: "transport" }, title: { value: "Grab Ride" } },
		matches: 10,
		agreeing: 9,
	})
	// Purity is not met by words shared across merchants.
	expect(rest.some(r => r.conditions.items[0]?.value.toLowerCase() === "singapore")).toBe(false)

	await saveStatementRule({
		name: "Grab",
		enabled: true,
		conditions: { mode: "all", items: [{ operator: "contains", value: "GRAB" }] },
		actions: { category_id: { value: "transport" } },
	})
	expect((await suggestedStatementRules()).some(r => r.key === "grab")).toBe(false)
})

test("a monthly charge that misses its usual date is overdue and suggests the recurring budget", async () => {
	const today = DateTime.now().startOf("day")
	for (const back of [3, 2, 1])
		await decided(
			`SPOTIFY P${back}23 STOCKHOLM`,
			{ title: "Spotify", category_id: "subscriptions", amount: -11.98 },
			today.minus({ months: back, days: 8 }).toFormat("yyyy-MM-dd 10:00"),
		)

	expect(await recurringCharges()).toMatchObject([
		{ label: "Spotify", query: "spotify", amount: -11.98, overdue: true },
	])

	const next = statement("SPOTIFY P0123 STOCKHOLM", {
		datetime: today.toFormat("yyyy-MM-dd 10:00"),
		amount: -11.98,
	})
	await db.statements.add(next)
	const { chips } = await recordSuggestions({ statementIds: [next.id] })
	expect(chips).toContainEqual({
		field: "monthly_budget_id",
		value: "recurring",
		reason: "Charged every month",
	})
	expect((await recurringCharges())[0]?.overdue).toBe(false)
})

test("replaying history scores each Record against earlier Records only", async () => {
	const first = await decided("GRAB SINGAPORE", {}, "2026-10-01 08:00")
	await decided("GRAB SINGAPORE", {}, "2026-10-02 08:00")
	await decided("GRAB SINGAPORE", { title: "Grab Food", category_id: "dining" }, "2026-10-03 08:00")

	const accuracy = await suggestionAccuracy()

	expect(accuracy.records).toBe(3)
	// The first Record has nothing earlier to learn from; the second follows the first; the
	// third breaks the pattern.
	expect(accuracy.fields.find(f => f.field === "category_id")).toEqual({
		field: "category_id",
		hits: 1,
		total: 3,
	})
	expect(first.record.title).toBe("Grab Ride")
})

test("the demo workspace benchmark: the first chip is usually right", async () => {
	await importData(generateTestData())

	const { records, fields } = await suggestionAccuracy()
	const rate = (field: string) => {
		const entry = fields.find(f => f.field === field)
		return (entry?.hits ?? 0) / (entry?.total || 1)
	}

	expect(records).toBeGreaterThan(300)
	expect(rate("category_id")).toBeGreaterThan(0.8)
	expect(rate("title")).toBeGreaterThan(0.8)
}, 30_000)
