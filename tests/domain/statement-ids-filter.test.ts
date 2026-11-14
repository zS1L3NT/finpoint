import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { listStatements } = await import("../../src/logic/statements")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "a", name: "DBS", balance: 0, bank: "DBS" })
})

const statement = (id: string, amount: number) => ({
	id,
	account_id: "a",
	description: id,
	datetime: "2026-10-03 12:00",
	amount,
	index: 0,
	is_pending: 0 as const,
})

test("the ids filter keeps only the listed Statements, and drops ones that are gone or fully allocated", async () => {
	await db.statements.bulkAdd([statement("s1", -10), statement("s2", -20), statement("s3", -30)])
	await db.allocations.add({ statement_id: "s3", record_id: "r", amount: -30 })

	expect((await listStatements({ ids: "s1,s3,missing" })).map(s => s.id).sort()).toEqual(["s1", "s3"])
	expect((await listStatements({ ids: "s1,s3,missing", is_allocable: "true" })).map(s => s.id)).toEqual(["s1"])
	expect(await listStatements({ ids: "missing" })).toEqual([])
	expect(await listStatements({ ids: "" })).toHaveLength(3)
})
