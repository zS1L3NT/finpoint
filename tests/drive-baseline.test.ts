import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../src/data/db")
const { seedIfEmpty } = await import("../src/data/seed")
const { driveLocalDirty } = await import("../src/logic/drive-sync")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

test("an untouched seeded workspace has no changes for Drive", async () => {
	await seedIfEmpty()

	expect(await driveLocalDirty()).toBe(false)
})

test("editing a starter row counts as a change", async () => {
	await seedIfEmpty()
	const category = await db.categories.toCollection().first()
	await db.categories.update(category?.id ?? "", { name: "Renamed" })

	expect(await driveLocalDirty()).toBe(true)
})

test("seeding beside existing data keeps the workspace counted as changed", async () => {
	await db.accounts.add({ id: "a", name: "FRANK", balance: 0, bank: "OCBC" })
	await seedIfEmpty()

	expect(await driveLocalDirty()).toBe(true)
})

test("the last sync stays the baseline once Drive has synced", async () => {
	await seedIfEmpty()
	await db.meta.put({ key: "drive_last_hash", value: "elsewhere" })

	expect(await driveLocalDirty()).toBe(true)
})
