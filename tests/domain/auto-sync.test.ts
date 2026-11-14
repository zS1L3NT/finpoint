import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { afterAll, beforeEach, expect, mock, test } from "bun:test"

// The engine runs in a browser: give it the few globals it touches and capture its timers so
// the test decides when the debounce fires. Drive itself is replaced by controllable stubs.
const timers = new Map<number, () => void>()
let nextTimer = 1
const listeners = new Map<string, () => void>()
const win = {
	setTimeout: (fn: () => void) => {
		timers.set(nextTimer, fn)
		return nextTimer++
	},
	addEventListener: (type: string, fn: () => void) => listeners.set(type, fn),
}
const nav = { onLine: true }
Object.assign(globalThis, {
	window: win,
	document: { hidden: false, addEventListener: () => undefined },
})
Object.defineProperty(globalThis, "navigator", { value: nav, configurable: true })
const realClearTimeout = globalThis.clearTimeout
globalThis.clearTimeout = ((id: number) => {
	if (timers.delete(id)) return
	realClearTimeout(id)
}) as typeof clearTimeout

const realDrive = { ...(await import("../../src/data/google-drive")) }
const realSync = { ...(await import("../../src/logic/drive-sync")) }

const drive = {
	pushes: 0,
	release: null as null | (() => void),
	pushFails: false,
	authNeeded: false,
	dirty: true,
	lastSyncAt: null as string | null,
}
mock.module("../../src/data/google-drive", () => ({
	...realDrive,
	isDriveConfigured: () => true,
	hasFreshDriveToken: () => true,
	ensureDriveTokenSilent: async () => {
		if (drive.authNeeded) throw new realDrive.AuthNeededError()
		return "token"
	},
	findBackupFile: async () => null,
	getFileMeta: async () => null,
	getClockSkewMs: () => 0,
}))
mock.module("../../src/logic/drive-sync", () => ({
	...realSync,
	driveStatus: async () => ({
		fileId: null,
		lastSyncAt: drive.lastSyncAt,
		remoteModifiedTime: null,
		lastCheckAt: null,
	}),
	driveLocalDirty: async () => drive.dirty,
	markDriveChecked: async () => undefined,
	pullDrive: async () => undefined,
	pushDrive: async () => {
		drive.pushes++
		if (drive.pushFails) throw new Error("Upload failed.")
		await new Promise<void>(resolve => {
			drive.release = resolve
		})
	},
}))

const { db } = await import("../../src/data/db")
const sync = await import("../../src/logic/auto-sync")

afterAll(() => {
	mock.module("../../src/data/google-drive", () => realDrive)
	mock.module("../../src/logic/drive-sync", () => realSync)
	// The write hooks stay registered on the shared db; make them inert.
	timers.clear()
	win.setTimeout = () => 0
})

const settle = () => new Promise(resolve => realSetTimeout(resolve, 20))
const realSetTimeout = setTimeout
let rows = 0
const write = () => db.accounts.add({ id: `a${rows++}`, name: "x", balance: 0, bank: "OCBC" })
const fireTimers = () => {
	const due = [...timers.values()]
	timers.clear()
	for (const fn of due) fn()
}

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	timers.clear()
	nav.onLine = true
	drive.pushes = 0
	drive.pushFails = false
	drive.authNeeded = false
	drive.dirty = true
	drive.lastSyncAt = null
	if (drive.release) drive.release()
	drive.release = null
	await settle()
	timers.clear()
})

sync.startAutoSync()
await settle()

test("a write during a push is pushed by the next cycle", async () => {
	await write()
	fireTimers()
	await settle()
	expect(drive.pushes).toBe(1)

	await write()
	drive.release?.()
	await settle()
	expect(timers.size).toBe(1)

	fireTimers()
	await settle()
	expect(drive.pushes).toBe(2)
	drive.release?.()
	await settle()
})

test("a cycle skipped because another is running re-arms the push timer", async () => {
	await write()
	fireTimers()
	await settle()
	expect(sync.getSyncSnapshot().activity).toBe("pushing")

	await write()
	fireTimers()
	await settle()
	expect(drive.pushes).toBe(1)
	expect(timers.size).toBe(1)
	drive.release?.()
	await settle()
})

test("a write keeps a state that needs the user", async () => {
	drive.authNeeded = true
	drive.lastSyncAt = "2026-01-01T00:00:00Z"
	drive.dirty = false
	await write()
	fireTimers()
	await settle()
	expect(sync.getSyncSnapshot()).toMatchObject({ kind: "needs-auth", localDirty: false })

	drive.dirty = true
	await write()
	await settle()
	expect(sync.getSyncSnapshot().kind).toBe("needs-auth")
	expect(sync.getSyncSnapshot().localDirty).toBe(true)
})

test("a local refresh keeps a failed cycle's error", async () => {
	drive.pushFails = true
	await write()
	fireTimers()
	await settle()
	expect(sync.getSyncSnapshot()).toMatchObject({ kind: "error", error: "Upload failed." })

	await sync.refreshSyncDisplay()
	expect(sync.getSyncSnapshot()).toMatchObject({ kind: "error", error: "Upload failed." })
})

test("an offline check does not clear the activity of a running cycle", async () => {
	await sync.resetSyncDisplay()
	await write()
	fireTimers()
	await settle()
	expect(sync.getSyncSnapshot().activity).toBe("pushing")

	nav.onLine = false
	listeners.get("online")?.()
	await settle()
	expect(sync.getSyncSnapshot().activity).toBe("pushing")
	drive.release?.()
	await settle()
})
