import { beforeEach, expect, test } from "bun:test"
import Dexie from "dexie"
import { IDBKeyRange, indexedDB } from "fake-indexeddb"

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
const { db } = await import("@/data/db")
const { importRevolut, importUob } = await import("@/logic/importer")
const { ValidationError } = await import("@/logic/validate")

function revolut(description: string) {
	const csv = [
		"State,Started Date,Description,Amount,Fee",
		`COMPLETED,2026-07-31 12:00:30,${description},-2.00,0`,
	].join("\n")
	return new File([csv], "revolut.csv", { type: "text/csv" })
}

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

test("an imported description is stored without surrounding spaces", async () => {
	await importRevolut(revolut("  GRAB  "), "123456", "Account")
	expect((await db.statements.toArray()).map(s => s.description)).toEqual(["GRAB"])
})

test("a description stored with spaces still matches its trimmed re-import", async () => {
	await importRevolut(revolut("GRAB"), "123456", "Account")
	const [stored] = await db.statements.toArray()
	await db.statements.update(stored.id, { description: "GRAB  " })
	expect(await importRevolut(revolut("GRAB"), "123456", "Account")).toEqual({
		imported: 0,
		reindexed: 0,
		skipped: 1,
	})
	expect(await db.statements.count()).toBe(1)
})

test("a UOB export with a blank account number is rejected and nothing is written", async () => {
	const csv = [
		"Account Number:,   ",
		"Account Type:,One Account",
		"Transaction Date,Transaction Description,Withdrawal,Deposit",
		"31 Jul 2026,SHOP,2.00,",
	].join("\n")
	const file = new File([csv], "uob.csv", { type: "text/csv" })
	await expect(importUob([file])).rejects.toBeInstanceOf(ValidationError)
	expect(await db.accounts.count()).toBe(0)
	expect(await db.statements.count()).toBe(0)
})
