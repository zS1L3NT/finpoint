import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db, asPending } = await import("../../src/data/db")
const { duplicateGroups, dismissDuplicatePair, dismissedDuplicatePairs, duplicateReview } =
	await import("../../src/logic/duplicates")
const { getStatement, listStatements, replacementCandidates, updatePendingStatement } =
	await import("../../src/logic/statements")

const RAW = "POS 4111-2222-3333-4444 COFFEE"
const MASKED = "POS XXXX-XXXX-XXXX-4444 COFFEE"
const statement = (id: string, pending = false) =>
	({
		id,
		account_id: "a",
		description: RAW,
		datetime: "2026-10-03 12:00",
		amount: -10,
		index: 0,
		is_pending: pending ? asPending(true) : 0,
	}) as never
const edit = (description: string) =>
	({ account_id: "a", datetime: "2026-10-03T12:00", description, amount: -10 }) as never

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "a", name: "DBS", balance: 0, bank: "DBS" })
	await db.statements.bulkAdd([statement("x"), statement("y"), statement("p", true)])
})

test("duplicate groups, separated pairs and the review show masked card numbers", async () => {
	const [group] = await duplicateGroups()
	expect(group?.statements.map(s => s.description)).toEqual([MASKED, MASKED])
	expect((await duplicateReview(["x", "y"])).statements.map(s => s.description)).toEqual([
		MASKED,
		MASKED,
	])
	await dismissDuplicatePair("x", "y")
	const [pair] = await dismissedDuplicatePairs()
	expect(pair?.statements.map(s => s.description)).toEqual([MASKED, MASKED])
})

test("saving a Pending Statement from its masked description keeps the card number", async () => {
	const shown = (await getStatement("p")).description
	expect(shown).toBe(MASKED)
	await updatePendingStatement("p", edit(shown))
	expect((await db.statements.get("p"))?.description).toBe(RAW)
	await updatePendingStatement("p", edit("POS XXXX-XXXX-XXXX-4444 TEA"))
	expect((await db.statements.get("p"))?.description).toBe("POS 4111-2222-3333-4444 TEA")
	await updatePendingStatement("p", edit("Tea"))
	expect((await db.statements.get("p"))?.description).toBe("Tea")
})

test("search matches the masked description, not the hidden digits", async () => {
	expect(await listStatements({ query: "4111-2222" })).toHaveLength(0)
	expect(await listStatements({ query: "xxxx-4444 coffee" })).toHaveLength(3)
	const hidden = await replacementCandidates("p", { scope: "all", query: "4111" } as never)
	expect(hidden.data).toHaveLength(0)
	const shown = await replacementCandidates("p", { scope: "all", query: "4444" } as never)
	expect(shown.data.length).toBeGreaterThan(0)
})
