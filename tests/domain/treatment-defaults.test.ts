import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { exportData, importData, parseImportFile } = await import("../../src/data/export-import")
const { createCategory, updateCategory } = await import("../../src/logic/categories")
const { createRecord, updateRecord } = await import("../../src/logic/records")
const { hashSnapshot } = await import("../../src/data/snapshot-hash")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

const input = { name: "Food", icon: "utensils", color: "#123456" }

test("categories default to Automatic and retain explicit treatments", async () => {
	const category = await createCategory(input)
	expect(category.analytics_treatment).toBe("automatic")
	expect((await updateCategory(category.id, { ...input, analytics_treatment: "spending" })).analytics_treatment).toBe("spending")
	expect((await updateCategory(category.id, { ...input, analytics_treatment: null })).analytics_treatment).toBe("automatic")
})

test("records inherit Automatic while an explicit Automatic remains manual", async () => {
	const category = await createCategory(input)
	const record = await createRecord({ title: "Lunch", amount: -10, datetime: "2026-10-01T12:00", category_id: category.id })
	expect(record.analytics_treatment).toBe("automatic")
	expect(record.analytics_treatment_source).toBe("category")
	const edited = await updateRecord(record.id, { title: "Lunch", amount: -10, datetime: "2026-10-01T12:00", category_id: category.id, analytics_treatment: "automatic" })
	expect(edited.analytics_treatment_source).toBe("manual")
})

test("older backups normalize missing category treatments without changing records", async () => {
	await createCategory(input)
	await createRecord({ title: "Lunch", amount: -10, datetime: "2026-10-01T12:00", category_id: "food" })
	const backup = await exportData()
	for (const treatment of [null, undefined]) {
		const old = { ...backup, version: 6, tables: { ...backup.tables, categories: backup.tables.categories.map(category => ({ ...category as object, analytics_treatment: treatment })) } }
		const parsed = parseImportFile(JSON.stringify(old))
		expect(parsed.tables.categories).toEqual(backup.tables.categories)
		await importData(old)
		expect((await db.categories.get("food"))?.analytics_treatment).toBe("automatic")
		expect((await exportData()).tables.records).toEqual(backup.tables.records)
	}
})

test("version seven upgrade normalizes categories and preserves clean and dirty Drive baselines", async () => {
	await createCategory(input)
	await createRecord({ title: "Lunch", amount: -10, datetime: "2026-10-01T12:00", category_id: "food" })
	for (const clean of [true, false]) {
		const backup = await exportData()
		const tables = { ...backup.tables, categories: backup.tables.categories.map(category => ({ ...category as object, analytics_treatment: null })) }
		const baseline = clean ? await hashSnapshot({ settings: backup.settings, tables }) : "dirty"
		const schema = Object.fromEntries(db.tables.map(t => [t.name, [t.schema.primKey.src, ...t.schema.indexes.map(i => i.src)].join(",")]))
		await db.delete()
		const old = new Dexie("finpoint")
		old.version(7).stores(schema)
		for (const [name, rows] of Object.entries(tables))
			if (rows.length) await old.table(name).bulkAdd(rows)
		await old.table("meta").put({ key: "drive_last_hash", value: baseline })
		old.close()
		await db.open()
		expect((await db.categories.get("food"))?.analytics_treatment).toBe("automatic")
		expect((await exportData()).tables.records).toEqual(backup.tables.records)
		expect((await db.meta.get("drive_last_hash"))?.value).toBe(clean ? await hashSnapshot(await exportData()) : baseline)
	}
})
