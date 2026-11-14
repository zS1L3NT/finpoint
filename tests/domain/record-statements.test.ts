import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { getRecord } = await import("../../src/logic/records")
const { listStatements } = await import("../../src/logic/statements")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "a", name: "DBS", balance: 0, bank: "DBS" })
})
test("a Record shows its Statements as the Statement list does, card number masked", async () => {
	await db.statements.add({
		id: "s",
		account_id: "a",
		description: "POS 4111-2222-3333-4444 COFFEE",
		datetime: "2026-10-03 12:00",
		amount: -10,
		index: 0,
		is_pending: 0,
	})
	await db.records.add({
		id: "r",
		title: "Coffee",
		amount: -10,
		datetime: "2026-10-03 12:00",
		category_id: "c",
		people: null,
		location: null,
		description: null,
		treatment_choice: { kind: "explicit", value: "spending" },
		monthly_budget_choice: { kind: "unbudgeted" },
		revision: 1,
	})
	await db.allocations.add({ statement_id: "s", record_id: "r", amount: -10 })
	const [listed] = (await listStatements()).filter(s => s.id === "s")
	const [attached] = (await getRecord("r")).statements
	expect(listed?.description).toBe("POS XXXX-XXXX-XXXX-4444 COFFEE")
	expect(attached?.description).toBe(listed?.description)
})
