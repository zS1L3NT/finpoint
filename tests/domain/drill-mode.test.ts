import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { getDrillMode, setDrillMode, updateSettings } = await import("../../src/logic/settings")
beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})
test("defaults to side peek", async () => {
	expect(await getDrillMode()).toBe("side")
})
test("persists each mode", async () => {
	for (const mode of ["center", "full", "side"] as const) {
		await setDrillMode(mode)
		expect(await getDrillMode()).toBe(mode)
	}
})
test("rejects an unknown mode", async () => {
	await expect(setDrillMode("dock" as never)).rejects.toThrow()
	expect(await getDrillMode()).toBe("side")
})
test("a stored unknown value falls back to side peek", async () => {
	await db.settings.put({ key: "drill_mode", value: "dock" })
	expect(await getDrillMode()).toBe("side")
})
test("saving other settings keeps the chosen mode", async () => {
	await setDrillMode("full")
	await updateSettings({ default_filter_start_date: "2026-01-01", default_filter_end_date_today: true })
	expect(await getDrillMode()).toBe("full")
})
