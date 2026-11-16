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
