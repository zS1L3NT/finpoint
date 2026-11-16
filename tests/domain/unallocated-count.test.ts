import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
import { DateTime } from "luxon"
const { db } = await import("../../src/data/db")
const { getDashboard } = await import("../../src/logic/dashboard")
const { listAccounts } = await import("../../src/logic/accounts")
const { listStatements } = await import("../../src/logic/statements")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

test("every unallocated count equals the Allocator list: amount left, Pending included", async () => {
	const today = DateTime.now().startOf("day")
	const datetime = `${today.toFormat("yyyy-MM-dd")} 12:00`
	await db.accounts.add({ id: "a", name: "A", balance: 0, bank: "DBS" })
	const row = (id: string, is_pending = 0) => ({
		id,
		account_id: "a",
		datetime,
		description: id,
		amount: -100,
		index: 0,
		is_pending,
	})
	await db.statements.bulkAdd([
		row("untouched-1"),
		row("untouched-2"),
		row("untouched-3"),
		row("partly-1"),
		row("partly-2"),
		row("full"),
		row("pending", 1),
	])
	const allocate = (statement_id: string, amount: number) => ({
		statement_id,
		record_id: `r-${statement_id}`,
		amount,
	})
	await db.allocations.bulkAdd([
		allocate("partly-1", -60),
		allocate("partly-2", -99.5),
		allocate("full", -100),
	])

	const list = await listStatements({ is_allocable: true })
	const dashboard = await getDashboard({ month: today.monthLong ?? "", year: today.year })
	const account = (await listAccounts()).find(a => a.id === "a")

	expect(list.length).toBe(6)
	expect(dashboard.review.unallocated_statements).toBe(6)
	expect(account?.unallocated_count).toBe(6)
})
