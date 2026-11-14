import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db, asPending } = await import("../../src/data/db")
const { createCategory, deleteCategory, listCategories } = await import("../../src/logic/categories")
const { saveStatementRule } = await import("../../src/logic/statement-rules")
const { updatePendingStatement } = await import("../../src/logic/statements")
const { ValidationError, Validator } = await import("../../src/logic/validate")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "a", name: "DBS", balance: 0, bank: "DBS" })
})

const rule = (value: string) => ({
	name: "Gym",
	enabled: true,
	conditions: { mode: "all" as const, items: [{ operator: "contains" as const, value: " GYM " }] },
	actions: { category_id: { value: "gym" }, title: { value } },
})

test("a Category that a Statement Rule fills cannot be deleted", async () => {
	await createCategory({ name: "Gym", icon: "lucide:dumbbell", color: "#111111" })
	await saveStatementRule(rule("Gym"))
	expect((await listCategories()).find(c => c.id === "gym")?.can_delete).toBe(false)
	await expect(deleteCategory("gym")).rejects.toBeInstanceOf(ValidationError)
	expect(await db.categories.get("gym")).toBeDefined()
})

test("a Statement Rule stores trimmed condition and action text", async () => {
	await createCategory({ name: "Gym", icon: "lucide:dumbbell", color: "#111111" })
	const saved = await saveStatementRule(rule("  Gym visit "))
	expect(saved.actions.title).toEqual({ value: "Gym visit" })
	expect(saved.conditions.items[0]?.value).toBe("GYM")
})

test("a Pending Statement cannot be moved to an Account that does not exist", async () => {
	await db.statements.add({
		id: "p",
		account_id: "a",
		description: "Lunch",
		datetime: "2026-10-03 12:00",
		amount: -10,
		index: 0,
		is_pending: asPending(true),
	} as never)
	const edit = { account_id: "ghost", datetime: "2026-10-03T12:00", description: "Lunch", amount: -10 }
	await expect(updatePendingStatement("p", edit as never)).rejects.toBeInstanceOf(ValidationError)
	expect((await db.statements.get("p"))?.account_id).toBe("a")
})

test("dates must exist on the calendar, not only match the pattern", () => {
	const v = new Validator()
	expect(v.date("2026-02-28", "ok")).toBe("2026-02-28")
	expect(v.datetime("2026-02-28T23:59", "ok")).toBe("2026-02-28T23:59")
	v.throwIfInvalid()
	for (const value of ["2026-13-45", "2026-02-31"]) {
		const bad = new Validator()
		bad.date(value, "date")
		expect(() => bad.throwIfInvalid()).toThrow()
	}
	for (const value of ["2026-02-31T10:00", "2026-01-01T25:00"]) {
		const bad = new Validator()
		bad.datetime(value, "datetime")
		expect(() => bad.throwIfInvalid()).toThrow()
	}
})
