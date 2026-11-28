import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { replacementCandidates } = await import("../../src/logic/statements")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "a", name: "DBS", balance: 0, bank: "DBS" })
	await db.statements.add({
		id: "pending",
		account_id: "a",
		description: "COFFEE",
		datetime: "2026-10-03 12:00",
		amount: -10,
		index: 0,
		is_pending: 1,
	})
	for (let i = 0; i < 3; i++) {
		await db.statements.add({
			id: `imported-${i}`,
			account_id: "a",
			description: `COFFEE ${i}`,
			datetime: "2026-10-03 12:00",
			amount: -10,
			index: i,
			is_pending: 0,
		})
	}
})

test("replacement candidates are paginated with a last page, clamped to it", async () => {
	const first = await replacementCandidates("pending", { per_page: 2 })
	expect(first.total).toBe(3)
	expect(first.last_page).toBe(2)
	expect(first.data).toHaveLength(2)

	const beyond = await replacementCandidates("pending", { per_page: 2, page: 9 })
	expect(beyond.current_page).toBe(2)
	expect(beyond.data).toHaveLength(1)
})

const imported = (id: string, description: string, amount: number, datetime = "2026-10-03 12:00") =>
	db.statements.add({
		id,
		account_id: "a",
		description,
		datetime,
		amount,
		index: 0,
		is_pending: 0,
	})
const record = (id: string, title: string, amount: number) =>
	db.records.add({
		id,
		title,
		amount,
		datetime: "2026-10-03 12:00",
		category_id: "c",
		people: null,
		location: null,
		description: null,
		treatment_choice: { kind: "explicit", value: "spending" },
		monthly_budget_choice: { kind: "unbudgeted" },
		revision: 1,
	})

test("suggestions follow the description or exact amount, with no date or amount window", async () => {
	await imported("similar-far", "COFFEE", -24, "2026-12-20 09:00")
	await imported("exact-far", "BOOKSHOP", -10, "2026-08-01 09:00")
	await imported("unrelated", "BOOKSHOP", -11)
	await imported("refund", "COFFEE", 10)
	const suggested = (await replacementCandidates("pending")).data
	expect(suggested.map(c => c.id)).toEqual([
		"imported-0",
		"imported-1",
		"imported-2",
		"similar-far",
		"exact-far",
	])
	expect(suggested.find(c => c.id === "exact-far")?.similarity).toBe(0)
	const all = await replacementCandidates("pending", { scope: "all" })
	expect(all.data.map(c => c.id)).toContain("unrelated")
})

test("bank text behind same-titled Records makes a handwritten placeholder similar", async () => {
	await db.statements.add({
		id: "lunch",
		account_id: "a",
		description: "Lunch",
		datetime: "2026-10-03 12:00",
		amount: -8,
		index: 0,
		is_pending: 1,
	})
	await record("past-record", "Koufu lunch", -7)
	await record("pending-record", "Koufu Lunch", -8)
	await imported("past", "NETS QR KOUFU PTE LTD", -7, "2026-09-01 12:00")
	await db.allocations.bulkAdd([
		{ statement_id: "past", record_id: "past-record", amount: -7 },
		{ statement_id: "lunch", record_id: "pending-record", amount: -8 },
	])
	await imported("koufu", "NETS QR KOUFU PTE LTD", -9)
	await imported("zheng", "NETS QR ZHENG PTE", -9)
	expect((await replacementCandidates("lunch")).data.map(c => c.id)).toEqual(["koufu"])
})
