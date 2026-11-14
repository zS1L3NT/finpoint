import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { afterEach, beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { disconnectDriveSync } = await import("../../src/logic/drive-sync")

const realFetch = globalThis.fetch

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.meta.bulkPut([
		{ key: "drive_file_id", value: "file" },
		{ key: "drive_last_sync_at", value: "2026-01-01T00:00:00Z" },
	])
})

afterEach(() => {
	globalThis.fetch = realFetch
})

test("a failed logout request keeps the Drive connection", async () => {
	globalThis.fetch = (() => Promise.reject(new Error("offline"))) as typeof fetch

	await expect(disconnectDriveSync()).rejects.toThrow()
	expect((await db.meta.get("drive_file_id"))?.value).toBe("file")
	expect((await db.meta.get("drive_last_sync_at"))?.value).toBe("2026-01-01T00:00:00Z")
})

test("a rejected logout response keeps the Drive connection", async () => {
	globalThis.fetch = (() => Promise.resolve(new Response(null, { status: 500 }))) as typeof fetch

	await expect(disconnectDriveSync()).rejects.toThrow()
	expect((await db.meta.get("drive_file_id"))?.value).toBe("file")
})

test("a successful logout clears the Drive keys", async () => {
	globalThis.fetch = (() => Promise.resolve(new Response(null, { status: 200 }))) as typeof fetch

	await disconnectDriveSync()
	expect(await db.meta.get("drive_file_id")).toBeUndefined()
	expect(await db.meta.get("drive_last_sync_at")).toBeUndefined()
})
