import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, describe, expect, test } from "bun:test"
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

test("descriptions reduce to letter runs in any script; numbers drop out", () => {
	expect(descriptionTokens("Grab* A-AWBP8DAGWKCFAV Singapore SGP 25JAN")).toEqual([
		"grab",
		"singapore",
		"sgp",
		"jan",
	])
	// A merchant written with digits keeps its letters.
	expect(descriptionTokens("7ELEVEN 0412")).toEqual(["eleven"])
	expect(descriptionTokens("Café Ñandú")).toEqual(["café", "ñandú"])
	// Scripts without spaces compare by character pairs.
	expect(descriptionTokens("麦当劳 中关村")).toEqual(["麦当", "当劳", "中关", "关村"])
})

test("a new merchant behind shared bank wording is not mistaken for a known one", async () => {
	for (let day = 1; day <= 4; day++)
		await decided(
			`NETS QR PAYMENT 61${day}, TO: NOODLE HOUSE`,
			{ title: "Noodles", category_id: "dining" },
			`2026-10-0${day} 12:00`,
		)
	for (let day = 5; day <= 8; day++)
		await decided(
			`NETS QR PAYMENT 61${day}, TO: CORNER GROCER`,
			{ title: "Groceries", category_id: "groceries" },
			`2026-10-0${day} 12:00`,
		)
	const known = statement("NETS QR PAYMENT 699, TO: NOODLE HOUSE")
	const fresh = statement("NETS QR PAYMENT 698, TO: BICYCLE WORKSHOP")
	await db.statements.bulkAdd([known, fresh])

	expect(chip((await recordSuggestions({ statementIds: [known.id] })).chips, "title")).toEqual([
		"Noodles",
	])
	expect(chip((await recordSuggestions({ statementIds: [fresh.id] })).chips, "title")).toEqual([])
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

test("a chosen title leads the Category; the bank text still leads the place", async () => {
	for (const day of ["01", "02", "03"]) {
		await decided("CAMPUS CAFE", { title: "Coffee", category_id: "dining", location: "Campus" }, `2026-10-${day} 09:00`)
		await decided("CAMPUS CAFE", { title: "Coffee", category_id: "dining", location: "Campus" }, `2026-10-${day} 10:00`)
		await decided("CAMPUS CAFE", { title: "Drink", category_id: "groceries", location: "Campus" }, `2026-10-${day} 19:00`)
		await decided("JUICE STALL", { title: "Drink", category_id: "groceries", location: "Library" }, `2026-10-${day} 15:00`)
	}
	const query = statement("CAMPUS CAFE")
	await db.statements.add(query)

	const { chips } = await recordSuggestions({ statementIds: [query.id], title: "Drink" })

	expect(chip(chips, "category_id")[0]).toBe("groceries")
	expect(chip(chips, "location")).toEqual(["Campus"])
	expect(chips.find(c => c.field === "category_id")?.reason).toBe(
		"Learned from 6 past Records titled “Drink”",
	)
})

test("people named in the bank text are suggested first", async () => {
	await decided("HOTPOT HOUSE", { title: "Dinner", people: "Team" }, "2026-10-01 19:00")
	await decided("KOPITIAM", { title: "Coffee", people: "Sam & Alex" }, "2026-10-02 10:00")
	await decided("KOPITIAM", { title: "Coffee", people: "Alex" }, "2026-10-03 10:00")
	const paid = statement("HOTPOT HOUSE", { amount: -30 })
	const back = statement("ICT Incoming PayNow Ref 1000001, From: TAN ALEX, OTHR", {
		amount: 10,
	})
	const also = statement("ICT Incoming PayNow Ref 1000002, From: LEE SAM, OTHR", { amount: 10 })
	await db.statements.bulkAdd([paid, back, also])

	const { chips } = await recordSuggestions({ statementIds: [paid.id, back.id, also.id] })

	expect(chips.find(c => c.field === "people")).toEqual({
		field: "people",
		value: "Sam & Alex",
		reason: "Named in the Statement",
	})
})

test("names in bank text stop leading People once they have proved misleading", async () => {
	for (const day of ["01", "02", "03", "04", "05"])
		await decided("KOPITIAM", { title: "Coffee", people: "Alex" }, `2026-01-${day} 10:00`)
	// A bakery that happens to carry the same name, never visited with Alex.
	for (let i = 0; i < 30; i++)
		await decided(
			"ALEX BAKERY",
			{ title: "Bread" },
			DateTime.fromISO("2026-02-01").plus({ days: i }).toFormat("yyyy-MM-dd 09:00"),
		)
	const next = statement("ALEX BAKERY", { datetime: "2026-04-01 09:00" })
	await db.statements.add(next)

	const { chips } = await recordSuggestions({ statementIds: [next.id] })

	expect(chips.some(c => c.reason === "Named in the Statement")).toBe(false)
})

test("weekly purchases of the same amount are not mistaken for a monthly charge", async () => {
	const today = DateTime.now().startOf("day")
	for (let week = 12; week >= 1; week--)
		await decided(
			"SWIM CLUB",
			{ title: "Swim", category_id: "subscriptions", amount: -5 },
			today.minus({ weeks: week }).toFormat("yyyy-MM-dd 07:00"),
		)

	expect(await recurringCharges()).toEqual([])
})

test("a Statement split across many Records counts less, and blank descriptions still match", async () => {
	const wallet = statement("WALLET TOP-UP", { amount: -100 })
	await db.statements.add(wallet)
	// One top-up paid for four bottles of water; two other top-ups were just top-ups.
	for (const i of [1, 2, 3, 4]) {
		const r = record({ id: `wallet-${i}`, title: "Water", category_id: "dining" })
		await db.records.add(r)
		await db.allocations.add({ statement_id: wallet.id, record_id: r.id, amount: -25 })
	}
	for (const day of ["05", "06"])
		await decided(
			"WALLET TOP-UP",
			{ title: "Travel wallet", category_id: "transport", amount: -100 },
			`2026-10-${day} 12:00`,
		)
	for (const day of ["01", "02"])
		await decided("", { title: "Interest", category_id: "groceries", amount: 0.3 }, `2026-10-${day} 00:00`)
	const next = statement("WALLET TOP-UP", { amount: -100 })
	const interest = statement("", { amount: 0.31 })
	await db.statements.bulkAdd([next, interest])

	expect(chip((await recordSuggestions({ statementIds: [next.id] })).chips, "title")[0]).toBe(
		"Travel wallet",
	)
	expect(chip((await recordSuggestions({ statementIds: [interest.id] })).chips, "title")).toEqual([
		"Interest",
	])
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

	const [late] = await recurringCharges()
	expect(late).toMatchObject({
		label: "Spotify",
		source: "records",
		query: "Spotify",
		amount: -11.98,
		status: "late",
	})

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
	// The unrecorded Statement shares the Records' bank text, so the charge has arrived.
	expect((await recurringCharges())[0]).toMatchObject({
		label: "Spotify",
		status: "charged",
		date: today.toISODate(),
	})
})

test("a yearly plan recorded as monthly Records is a monthly charge though one Statement paid it", async () => {
	const today = DateTime.now().startOf("day")
	const paid = statement("APPLE.COM/BILL ITUNES", {
		datetime: today.minus({ months: 3 }).toFormat("yyyy-MM-dd 10:00"),
		amount: -48,
	})
	await db.statements.add(paid)
	for (const back of [3, 2, 1, 0]) {
		const r = record({
			title: "iCloud",
			category_id: "subscriptions",
			amount: -4,
			datetime: today.minus({ months: back }).toFormat("yyyy-MM-dd 10:00"),
		})
		await db.records.add(r)
		await db.allocations.add({ statement_id: paid.id, record_id: r.id, amount: -4 })
	}

	expect(await recurringCharges()).toMatchObject([
		{ label: "iCloud", source: "records", amount: -4, status: "charged" },
	])
})

test("a workspace without Records finds monthly charges from Statements alone", async () => {
	const today = DateTime.now().startOf("day")
	for (const back of [3, 2, 1])
		await db.statements.add(
			statement(`NETFLIX.COM ${back}8812`, {
				datetime: today.minus({ months: back }).toFormat("yyyy-MM-dd 10:00"),
				amount: -15.98,
			}),
		)

	const [charge] = await recurringCharges()
	expect(charge).toMatchObject({ source: "statements", query: "netflix", amount: -15.98 })
	// Last month it was charged; next month it is expected again.
	const month = (shift: number) => today.plus({ months: shift }).startOf("month").toISODate() ?? ""
	expect((await recurringCharges(month(-1)))[0]?.status).toBe("charged")
	expect((await recurringCharges(month(1)))[0]?.status).toBe("due")
	// Before it began there is nothing to show.
	expect(await recurringCharges(month(-6))).toEqual([])
})

test("replaying history scores each Record against earlier Records only", async () => {
	const first = await decided("GRAB SINGAPORE", {}, "2026-10-01 08:00")
	await decided("GRAB SINGAPORE", {}, "2026-10-02 08:00")
	await decided("GRAB SINGAPORE", { title: "Grab Food", category_id: "dining" }, "2026-10-03 08:00")

	const accuracy = await suggestionAccuracy()

	expect(accuracy.records).toBe(3)
	// The first Record has nothing earlier to learn from; the second follows the first; the
	// third breaks the pattern.
	expect(accuracy.fields.find(f => f.field === "category_id")).toMatchObject({
		field: "category_id",
		hits: 1,
		total: 3,
	})
	expect(first.record.title).toBe("Grab Ride")
})

test("replaying history reports the mix-ups that keep coming back", async () => {
	for (const day of ["01", "02", "03"])
		await decided("GRAB SINGAPORE", {}, `2026-10-${day} 08:00`)
	for (const day of ["04", "05", "06"])
		await decided("GRAB SINGAPORE", { category_id: "dining" }, `2026-10-${day} 08:00`)

	const category = (await suggestionAccuracy()).fields.find(f => f.field === "category_id")

	// One wrong guess is noise; the same wrong guess twice is worth showing.
	expect(category?.misses).toEqual([
		{ offered: "transport", actual: "dining", count: expect.any(Number) },
	])
	expect(category?.misses[0]?.count).toBeGreaterThan(1)
})

test("the demo workspace benchmark: the first chip is usually right", async () => {
	await importData(generateTestData())

	const { records, fields } = await suggestionAccuracy()
	const rate = (field: string) => {
		const entry = fields.find(f => f.field === field)
		return (entry?.hits ?? 0) / (entry?.total || 1)
	}

	// The newest third is scored, with weights learned from the older two thirds.
	expect(records).toBeGreaterThan(100)
	expect(rate("category_id")).toBeGreaterThan(0.8)
	expect(rate("title")).toBeGreaterThan(0.8)
}, 30_000)

/**
 * Synthetic users with deliberately different habits. Each must get weights that fit their own
 * history, not one person's: nothing in the learner may assume a particular user.
 */
describe("learned weights follow each user's own habits", () => {
	const seeded = (seed: number) => () => {
		seed = (seed * 1103515245 + 12345) % 2147483648
		return seed / 2147483648
	}
	/** Adds a few hundred Records, one Statement each, as `persona` decides them. */
	async function live(
		persona: (i: number, random: () => number) => {
			description: string
			amount: number
			title: string
			category_id: string
			hour?: number
		},
	) {
		const random = seeded(7)
		const start = DateTime.fromISO("2026-01-01")
		for (let i = 0; i < 240; i++) {
			const day = start.plus({ days: Math.floor(i * 1.2) })
			const p = persona(i, random)
			await decided(
				`${p.description} ${Math.floor(random() * 90000) + 10000}`,
				{ title: p.title, category_id: p.category_id, amount: p.amount },
				day.set({ hour: p.hour ?? 0, minute: 0 }).toFormat("yyyy-MM-dd HH:mm"),
			)
		}
		const { fields } = await suggestionAccuracy()
		const field = (name: string) => {
			const entry = fields.find(f => f.field === name)
			return { ...entry, rate: (entry?.hits ?? 0) / (entry?.total || 1) }
		}
		return field
	}

	test("prices that tell items apart earn a price boost for titles", async () => {
		const items = [
			["Water", -1.0],
			["Coffee", -1.4],
			["Juice", -1.8],
		] as const
		const field = await live((_, random) => {
			const [title, amount] = items[Math.floor(random() * items.length)] ?? items[0]
			return { description: "SNACK MACHINE", amount, title, category_id: "dining" }
		})
		expect(field("title").weights?.price).toBeGreaterThan(1)
		expect(field("title").rate).toBeGreaterThan(0.9)
	})

	test("titles that follow the time of day earn an hour boost", async () => {
		const meals = [
			["Breakfast", 8],
			["Lunch", 12],
			["Dinner", 19],
		] as const
		const field = await live((_, random) => {
			const [title, hour] = meals[Math.floor(random() * meals.length)] ?? meals[0]
			return { description: "FOOD HALL", amount: -6, title, category_id: "dining", hour }
		})
		expect(field("title").weights?.hour).toBeGreaterThan(1)
		// The bank text has no time, so the entered time is what picks the meal.
		const next = statement("FOOD HALL 55555", { amount: -6, datetime: "2026-12-01 00:00", index: 1 })
		await db.statements.add(next)
		for (const [title, hour] of meals)
			expect(
				chip(
					(
						await recordSuggestions({
							statementIds: [next.id],
							datetime: `2026-12-01T${String(hour).padStart(2, "0")}:20`,
						})
					).chips,
					"title",
				)[0],
			).toBe(title)

		for (const table of [db.statements, db.records, db.allocations]) await table.clear()
		// The same meals at random hours: time says nothing, so it must not gain weight.
		const random = await live((_, next) => {
			const [title] = meals[Math.floor(next() * meals.length)] ?? meals[0]
			return {
				description: "FOOD HALL",
				amount: -6,
				title,
				category_id: "dining",
				hour: 7 + Math.floor(next() * 14),
			}
		})
		expect(random("title").weights?.hour).toBe(1)
	})

	test("a user who changes habits gets a short memory; a steady user keeps a long one", async () => {
		const changing = await live(i => ({
			description: ["CORNER SHOP", "BOOK STORE", "CAFE ONE"][i % 3] ?? "CORNER SHOP",
			amount: -10,
			title: "Shopping",
			// Each merchant's Category changes every two months.
			category_id: Math.floor(i / 50) % 2 ? "groceries" : "dining",
		}))
		expect(changing("category_id").weights?.halfLife).toBeLessThanOrEqual(60)

		for (const table of [db.statements, db.records, db.allocations]) await table.clear()
		const steady = await live((i, random) => ({
			description: ["CORNER SHOP", "BOOK STORE", "CAFE ONE"][i % 3] ?? "CORNER SHOP",
			amount: -10,
			title: "Shopping",
			// The same merchant goes to its usual Category most of the time, at random.
			category_id:
				random() < 0.7 ? (["groceries", "dining", "transport"][i % 3] ?? "dining") : "subscriptions",
		}))
		expect(steady("category_id").weights?.halfLife).toBeGreaterThanOrEqual(120)
	})

	test("whether the title or the bank text decides the Category is learned, not assumed", async () => {
		const reasons = [
			["Rent", "groceries"],
			["Lunch", "dining"],
			["Bus fare", "transport"],
		] as const
		// Every transfer looks the same; only the title says what it was for.
		const titleLed = await live((_, random) => {
			const [title, category_id] = reasons[Math.floor(random() * reasons.length)] ?? reasons[0]
			return { description: "FUNDS TRANSFER", amount: -20, title, category_id }
		})
		expect(titleLed("category_id").weights?.title).toBeGreaterThanOrEqual(1)
		expect(titleLed("category_id").rate).toBeGreaterThan(0.9)

		for (const table of [db.statements, db.records, db.allocations]) await table.clear()
		const shops = [
			["CORNER GROCER", "groceries"],
			["NOODLE HOUSE", "dining"],
			["TRAIN TICKETS", "transport"],
		] as const
		// The title is a vague note; the merchant says what it was.
		const merchantLed = await live((_, random) => {
			const [description, category_id] = shops[Math.floor(random() * shops.length)] ?? shops[0]
			return { description, amount: -12, title: random() < 0.5 ? "Stuff" : "Misc", category_id }
		})
		expect(merchantLed("category_id").weights?.title).toBeLessThanOrEqual(1)
		expect(merchantLed("category_id").rate).toBeGreaterThan(0.9)
	})
})
