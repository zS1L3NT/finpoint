import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { afterAll, beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { exportData } = await import("../../src/data/export-import")
const { seedIfEmpty } = await import("../../src/data/seed")
const { driveLocalDirty, pullDrive } = await import("../../src/logic/drive-sync")

const realFetch = globalThis.fetch
const realClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "test-client"
Object.defineProperty(globalThis, "navigator", { value: { onLine: true }, configurable: true })

afterAll(() => {
	globalThis.fetch = realFetch
	process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = realClientId
})

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

test("an edit made while a restore finishes still counts as a change for Drive", async () => {
	await seedIfEmpty()
	const backup = JSON.stringify(await exportData())
	await db.meta.put({ key: "drive_file_id", value: "file" })
	const json = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body)))
	globalThis.fetch = (async (input: RequestInfo | URL) => {
		const url = String(input)
		if (url.endsWith("/api/auth/token")) return json({ access_token: "t", expires_in: 3600 })
		if (url.includes("alt=media")) return new Response(backup)
		// The restore has replaced the data and is asking Drive for the file's timestamp.
		await db.accounts.add({ id: "mid-pull", name: "FRANK", balance: 0, bank: "OCBC" })
		return json({ id: "file", modifiedTime: "2026-01-01T00:00:00Z" })
	}) as typeof fetch

	await pullDrive()

	expect(await db.accounts.get("mid-pull")).toBeDefined()
	expect(await driveLocalDirty()).toBe(true)
})
