import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
import type { StatementRow } from "../src/data/db"
const { db } = await import("../src/data/db")
const { duplicateGroups, dismissDuplicatePair, restoreDuplicatePair, fixDuplicates } = await import(
	"../src/logic/duplicates"
)

const statement = (
	id: string,
	description = "DEBIT PURCHASE xx-7962 SHENG SIONG SUPERMARKET -S 03/10/26",
	overrides: Partial<StatementRow> = {},
): StatementRow => ({
	id,
	description,
	account_id: "a",
	amount: -10,
	datetime: "2026-10-03 12:00",
	index: 0,
	is_pending: 0,
	...overrides,
})
beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "a", name: "FRANK", balance: 0, bank: "OCBC" })
})
test("spacing changes form groups and dismissals affect only one pair", async () => {
	await db.statements.bulkAdd([
		statement("a"),
		statement("b", "DEBIT PURCHASE xx-7962 SHENG SIONG SUPERMARKET -S03/10/26"),
		statement("c"),
	])
	expect((await duplicateGroups())[0]?.pairs).toHaveLength(3)
	await dismissDuplicatePair("b", "a")
	expect((await duplicateGroups())[0]?.pairs).toHaveLength(2)
	expect(await db.duplicate_dismissals.toArray()).toEqual([
		{ statement_id: "a", other_statement_id: "b" },
	])
	await restoreDuplicatePair("a", "b")
	expect((await duplicateGroups())[0]?.pairs).toHaveLength(3)
})
test("PayNow reordered wording matches while conflicting references and recipients do not", async () => {
	await db.statements.bulkAdd([
		statement(
			"a",
			"FAST PAYMENT OTHR-EPOSSP SNLR0877606BNTV4A0 via PayNow-UEN to DSE SERVICE PTE.",
		),
		statement(
			"b",
			"FAST PAYMENT OTHR-EPOSSP SNLR0877606BNTV4A0 to DSE SERVICE PTE.via PayNow-UEN",
		),
		statement(
			"c",
			"FAST PAYMENT OTHR-EPOSSP SNLR0877607BNTV4A0 to DSE SERVICE PTE.via PayNow-UEN",
		),
		statement(
			"d",
			"FAST PAYMENT OTHR-EPOSSP SNLR0877606BNTV4A0 to OTHER SERVICE PTE.via PayNow-UEN",
		),
		statement("e", "NETS QR DING JI NETS QR PURCHASE 91594501"),
	])
	expect((await duplicateGroups()).map(g => g.statements.map(s => s.id))).toEqual([["a", "b"]])
})
test("eligibility excludes pending, other dates/accounts/amounts", async () => {
	await db.statements.bulkAdd([
		statement("a"),
		statement("b", undefined, { is_pending: 1 }),
		statement("c", undefined, { datetime: "2026-10-04 12:00" }),
		statement("d", undefined, { account_id: "b" }),
		statement("e", undefined, { amount: 10 }),
	])
	expect(await duplicateGroups()).toEqual([])
	await expect(fixDuplicates({ survivor_id: "a", delete_ids: ["b"] })).rejects.toThrow()
	expect(await db.statements.count()).toBe(5)
})
test("move allocations without changing survivor fields or records, and clean dismissals", async () => {
	await db.statements.bulkAdd([statement("a"), statement("b")])
	await dismissDuplicatePair("a", "b")
	await db.allocations.add({ statement_id: "b", record_id: "r", amount: -7 })
	await db.records.add({
		id: "r",
		title: "Lunch",
		amount: -10,
		datetime: "2026-10-03 12:00",
		category_id: "c",
		people: null,
		location: null,
		description: null,
		analytics_treatment: "spending",
		analytics_treatment_source: "manual",
		bucket_id: null,
		bucket_source: null,
		revision: 1,
	})
	const record = await db.records.get("r")
	expect(await fixDuplicates({ survivor_id: "a", delete_ids: ["b"] })).toEqual(["r"])
	expect(await db.statements.get("a")).toEqual(statement("a"))
	expect(await db.records.get("r")).toEqual(record)
	expect(await db.allocations.toArray()).toEqual([
		{ statement_id: "a", record_id: "r", amount: -7 },
	])
	expect(await db.duplicate_dismissals.count()).toBe(0)
})
test("allocated survivor wins, including shared record allocations", async () => {
	await db.statements.bulkAdd([statement("a"), statement("b")])
	await db.allocations.bulkAdd([
		{ statement_id: "a", record_id: "r", amount: -5 },
		{ statement_id: "b", record_id: "r", amount: -5 },
	])
	await fixDuplicates({ survivor_id: "a", delete_ids: ["b"] })
	expect(await db.allocations.toArray()).toEqual([
		{ statement_id: "a", record_id: "r", amount: -5 },
	])
})
test("multiple sources require explicit choice; invalid allocation rollback", async () => {
	await db.statements.bulkAdd([statement("a"), statement("b"), statement("c")])
	await db.allocations.bulkAdd([
		{ statement_id: "b", record_id: "r", amount: -10 },
		{ statement_id: "c", record_id: "s", amount: -10 },
	])
	await expect(fixDuplicates({ survivor_id: "a", delete_ids: ["b", "c"] })).rejects.toThrow()
	expect(await db.statements.count()).toBe(3)
	await db.allocations.put({ statement_id: "b", record_id: "r", amount: -11 })
	await expect(
		fixDuplicates({ survivor_id: "a", delete_ids: ["b", "c"], allocation_source_id: "b" }),
	).rejects.toThrow()
	expect(await db.statements.count()).toBe(3)
	await fixDuplicates({ survivor_id: "a", delete_ids: ["b", "c"], allocation_source_id: "c" })
	expect(await db.allocations.toArray()).toEqual([
		{ statement_id: "a", record_id: "s", amount: -10 },
	])
})

test("reference and date internals are not treated as reorderable words", async () => {
	await db.statements.bulkAdd([
		statement("a", "FAST PAYMENT OTHR AB12CD34 via PayNow-UEN to DSE SERVICE PTE."),
		statement("b", "FAST PAYMENT OTHR CD34AB12 via PayNow-UEN to DSE SERVICE PTE."),
		statement("c", "DEBIT PURCHASE SHENG SIONG -S 03/10/26"),
		statement("d", "DEBIT PURCHASE SHENG SIONG -S 10/03/26"),
	])
	expect(await duplicateGroups()).toEqual([])
})
test("generic wording alone cannot create a strong match", async () => {
	await db.statements.bulkAdd([
		statement("a", "FAST PAYMENT OTHR via PayNow-UEN"),
		statement("b", "FAST PAYMENT OTHR PayNow-UEN via"),
	])
	expect(await duplicateGroups()).toEqual([])
	expect(await duplicateGroups(true)).toHaveLength(1)
})
test("backup restore, earlier backups and reset include the dismissal table", async () => {
	const { exportData, importData, parseImportFile, clearAllData, SYNC_TABLES } = await import(
		"../src/data/export-import"
	)
	await db.statements.bulkAdd([statement("a"), statement("b")])
	await dismissDuplicatePair("a", "b")
	const backup = await exportData()
	await clearAllData()
	expect(await db.duplicate_dismissals.count()).toBe(0)
	await importData(parseImportFile(JSON.stringify(backup)))
	expect(await db.duplicate_dismissals.count()).toBe(1)
	const old = JSON.parse(JSON.stringify(backup))
	old.version = 2
	delete old.tables.duplicate_dismissals
	await importData(parseImportFile(JSON.stringify(old)))
	expect(await db.duplicate_dismissals.count()).toBe(0)
	expect(SYNC_TABLES).toContain("duplicate_dismissals")
})
test("schema version two upgrades with financial data intact", async () => {
	const schemas = Object.fromEntries(
		db.tables
			.filter(t => t.name !== "duplicate_dismissals")
			.map(t => [
				t.name,
				[t.schema.primKey.src, ...t.schema.indexes.map(i => i.src)].join(","),
			]),
	)
	await db.delete()
	const legacy = new Dexie("finpoint")
	legacy.version(2).stores(schemas)
	await legacy.table("statements").put(statement("a"))
	legacy.close()
	await db.open()
	expect(db.verno).toBe(3)
	expect(await db.statements.get("a")).toEqual(statement("a"))
	expect(await db.duplicate_dismissals.count()).toBe(0)
})

test("screenshots preserve PayNow mixed references and method reordering", async () => {
	await db.statements.bulkAdd([
		statement(
			"a",
			"FAST PAYMENT OTHR-EPOSSP SNLR0877606BNTV4A0 via PayNow-UEN to DSE SERVICE PTE.".replace(
				"EPOSSP SNLR",
				"EPOSSPSNLR",
			),
		),
		statement(
			"b",
			"FAST PAYMENT OTHR-EPOSSPSNLR0877606BNTV4A0 to DSE SERVICE PTE.via PayNow-UEN",
		),
		statement("c", "FAST PAYMENT OTHR-OTHR to YEX KWXX WAX (QXvia PayNow-Mobile"),
		statement("d", "FAST PAYMENT OTHR-OTHR via PayNow-Mobile to YEX KWXX WAX (QX"),
	])
	expect((await duplicateGroups()).map(g => g.statements.map(s => s.id))).toEqual([
		["a", "b"],
		["c", "d"],
	])
})
test("short mixed references cannot be rearranged internally", async () => {
	await db.statements.bulkAdd([
		statement("a", "FAST PAYMENT AB12 via PayNow-UEN to DSE SERVICE"),
		statement("b", "FAST PAYMENT 12AB via PayNow-UEN to DSE SERVICE"),
	])
	expect(await duplicateGroups()).toEqual([])
})
test("record allocation deficits use the existing pending rule", async () => {
	const { getRecord } = await import("../src/logic/records")
	await db.statements.bulkAdd([statement("a"), statement("b")])
	await db.records.add({
		id: "r",
		title: "Lunch",
		amount: -10,
		datetime: "2026-10-03 12:00",
		category_id: "c",
		people: null,
		location: null,
		description: null,
		analytics_treatment: "spending",
		analytics_treatment_source: "manual",
		bucket_id: null,
		bucket_source: null,
		revision: 1,
	})
	await db.allocations.bulkAdd([
		{ statement_id: "a", record_id: "r", amount: -5 },
		{ statement_id: "b", record_id: "r", amount: -5 },
	])
	expect((await getRecord("r")).is_pending).toBe(false)
	await fixDuplicates({ survivor_id: "a", delete_ids: ["b"] })
	expect((await getRecord("r")).is_pending).toBe(true)
})
test("replacement and pending deletion clean dismissal references", async () => {
	const { replacePendingStatement, deletePendingStatement } = await import(
		"../src/logic/statements"
	)
	await db.statements.bulkAdd([
		statement("a"),
		statement("p", undefined, { is_pending: 1 }),
		statement("q", undefined, { is_pending: 1 }),
	])
	await db.duplicate_dismissals.bulkAdd([
		{ statement_id: "a", other_statement_id: "p" },
		{ statement_id: "a", other_statement_id: "q" },
	])
	await replacePendingStatement("a", "p")
	expect(await db.duplicate_dismissals.count()).toBe(1)
	await deletePendingStatement("q")
	expect(await db.duplicate_dismissals.count()).toBe(0)
})
test("version three backups require dismissal data", async () => {
	const { exportData, parseImportFile } = await import("../src/data/export-import")
	const backup = JSON.parse(JSON.stringify(await exportData()))
	delete backup.tables.duplicate_dismissals
	expect(() => parseImportFile(JSON.stringify(backup))).toThrow("incomplete")
})

test("unallocated duplicates delete without changing any survivor field", async () => {
	const survivor = statement("a", "Chosen imported description", {
		index: 5,
		datetime: "2026-10-03 08:55",
	})
	await db.statements.bulkAdd([
		survivor,
		statement("b", "Different bank description", { index: 8, datetime: "2026-10-03 15:00" }),
	])
	expect(await fixDuplicates({ survivor_id: "a", delete_ids: ["b"] })).toEqual([])
	expect(await db.statements.toArray()).toEqual([survivor])
})
test("stale statement changes and invalid sources cannot mutate selected data", async () => {
	await db.statements.bulkAdd([statement("a"), statement("b")])
	await db.allocations.add({ statement_id: "b", record_id: "r", amount: 10 })
	await expect(fixDuplicates({ survivor_id: "a", delete_ids: ["b"] })).rejects.toThrow()
	expect(await db.allocations.count()).toBe(1)
	await db.allocations.put({ statement_id: "b", record_id: "r", amount: -10 })
	await expect(
		fixDuplicates({ survivor_id: "a", delete_ids: ["b"], allocation_source_id: "missing" }),
	).rejects.toThrow()
	await db.statements.update("b", { datetime: "2026-10-04 12:00" })
	await expect(fixDuplicates({ survivor_id: "a", delete_ids: ["b"] })).rejects.toThrow()
	expect(await db.statements.count()).toBe(2)
	await expect(fixDuplicates({ survivor_id: "a", delete_ids: ["missing"] })).rejects.toThrow()
	await expect(fixDuplicates({ survivor_id: "a", delete_ids: ["b", "b"] })).rejects.toThrow()
})
