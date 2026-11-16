import { beforeEach, expect, test } from "bun:test"
import Dexie from "dexie"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
const { db } = await import("@/data/db")
const { importRevolut } = await import("@/logic/importer")

function file(count: number) {
	const csv = [
		"State,Started Date,Description,Amount,Fee",
		...Array(count).fill("COMPLETED,2026-07-31 12:00:30,Transit,-2.00,0"),
	].join("\n")
	return new File([csv], "revolut.csv", { type: "text/csv" })
}

const run = (count: number) => importRevolut(file(count), "123456", "Account")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

test("two identical Revolut rows in one file are both imported", async () => {
	expect(await run(2)).toEqual({ imported: 2, reindexed: 0, skipped: 0 })
	expect(await db.statements.count()).toBe(2)
})

test("importing the same Revolut file again adds nothing", async () => {
	await run(2)
	expect(await run(2)).toEqual({ imported: 0, reindexed: 0, skipped: 2 })
	expect(await db.statements.count()).toBe(2)
})

test("a Revolut file with three identical rows after two are stored adds one", async () => {
	await run(2)
	expect(await run(3)).toEqual({ imported: 1, reindexed: 0, skipped: 2 })
	expect(await db.statements.count()).toBe(3)
})
