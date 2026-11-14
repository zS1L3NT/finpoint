import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { asPending, db } = await import("../../src/data/db")
const { ConflictError, createRecord, updateRecord } = await import("../../src/logic/records")
const { deletePendingStatement, updatePendingStatement } = await import(
	"../../src/logic/statements"
)
const { createCategory, deleteCategory, updateCategory } = await import(
	"../../src/logic/categories"
)
const { attachBudgetRecord } = await import("../../src/logic/budgets")
const { upsertMonthlyBudget } = await import("../../src/logic/monthly-budgets")
const { ValidationError } = await import("../../src/logic/validate")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "acc", name: "Main", color: "#000000" } as never)
	await db.categories.add({
		id: "cat",
		name: "Food",
		icon: "",
		color: "",
		parent_category_id: null,
		analytics_treatment: "spending",
		default_monthly_budget_id: null,
	})
})

async function statement(id: string, amount: number, pending = 0) {
	await db.statements.add({
		id,
		account_id: "acc",
		datetime: "2026-01-01 00:00:00",
		description: id,
		amount,
		index: 0,
		is_pending: pending ? asPending(true) : 0,
	} as never)
}

const record = (statements: { id: string; amount: number }[]) => ({
	title: "Lunch",
	datetime: "2026-01-02T12:00",
	amount: -100,
	category_id: "cat",
	statements,
})

test("overlapping createRecord calls cannot over-allocate a Statement", async () => {
	await statement("s", -100)
	const results = await Promise.allSettled(
		Array.from({ length: 6 }, () => createRecord(record([{ id: "s", amount: -100 }]))),
	)
	expect(results.filter(r => r.status === "fulfilled")).toHaveLength(1)
	const rejected = results.find(r => r.status === "rejected")
	expect((rejected as PromiseRejectedResult).reason).toBeInstanceOf(ValidationError)
	const sum = (await db.allocations.toArray()).reduce((s, a) => s + a.amount, 0)
	expect(sum).toBe(-100)
})

test("overlapping updateRecord calls with one revision conflict", async () => {
	const created = await createRecord(record([]))
	const results = await Promise.allSettled([
		updateRecord(created.id, { ...record([]), title: "A", revision: created.revision }),
		updateRecord(created.id, { ...record([]), title: "B", revision: created.revision }),
	])
	expect(results.filter(r => r.status === "fulfilled")).toHaveLength(1)
	const rejected = results.find(r => r.status === "rejected")
	expect((rejected as PromiseRejectedResult).reason).toBeInstanceOf(ConflictError)
})

test("deleting a pending Statement while a Record allocates it leaves no orphan", async () => {
	await statement("p", -100, 1)
	await Promise.allSettled([
		deletePendingStatement("p"),
		createRecord(record([{ id: "p", amount: -100 }])),
	])
	for (const a of await db.allocations.toArray()) {
		expect(await db.statements.get(a.statement_id)).toBeDefined()
	}
})

test("editing a pending Statement while a Record allocates it never under-covers it", async () => {
	await statement("p", -100, 1)
	await Promise.allSettled([
		updatePendingStatement("p", {
			account_id: "acc",
			datetime: "2026-01-01T00:00",
			description: "p",
			amount: -10,
		} as never),
		createRecord(record([{ id: "p", amount: -100 }])),
	])
	const stored = await db.statements.get("p")
	const sum = (await db.allocations.toArray()).reduce((s, a) => s + a.amount, 0)
	expect(sum).toBeGreaterThanOrEqual(stored?.amount ?? 0)
})

test("deleting a category while a Record is created in it leaves no orphan", async () => {
	await Promise.allSettled([deleteCategory("cat"), createRecord(record([]))])
	for (const r of await db.records.toArray()) {
		expect(await db.categories.get(r.category_id)).toBeDefined()
	}
})

test("overlapping Monthly Budget creates with one name leave one row", async () => {
	const input = { name: "Travel", color: "#123456", month: "2026-01-01", amount: 100, scope: "month" }
	await Promise.allSettled([upsertMonthlyBudget(input), upsertMonthlyBudget(input)])
	expect(await db.monthly_budgets.count()).toBe(1)
})

const child = (parent: string | null) => ({
	name: "Snacks",
	icon: "lucide:cookie",
	color: "#111111",
	parent_category_id: parent,
	default_monthly_budget_id: "mb",
})

const addMonthlyBudget = () =>
	db.monthly_budgets.add({ id: "mb", name: "Food", color: "", display_order: 0 } as never)

async function expectNoOrphanParents() {
	for (const c of await db.categories.toArray()) {
		if (c.parent_category_id) expect(await db.categories.get(c.parent_category_id)).toBeDefined()
	}
}

// The parent is deleted after the write has checked it and before it stores the row: the
// checks used to run outside the write's transaction, so the delete could slip between them.
async function deleteParentMidWrite(write: () => Promise<unknown>) {
	const writing = write()
	for (let tick = 0; tick < 2; tick++) await db.accounts.count()
	await Promise.allSettled([writing, deleteCategory("cat")])
	await expectNoOrphanParents()
}

test("creating a child Category while its parent is deleted leaves no orphan", async () => {
	await addMonthlyBudget()
	await deleteParentMidWrite(() => createCategory(child("cat")))
})

test("moving a Category under a parent that is being deleted leaves no orphan", async () => {
	await addMonthlyBudget()
	await db.categories.add({
		id: "other",
		name: "Other",
		icon: "",
		color: "",
		parent_category_id: null,
		analytics_treatment: "spending",
		default_monthly_budget_id: null,
	})
	const created = await createCategory(child("other"))
	await deleteParentMidWrite(() => updateCategory(created.id, child("cat")))
})

test("attaching a Record to a deleted Budget stores nothing", async () => {
	const created = await createRecord(record([]))
	await attachBudgetRecord("gone", created.id).catch(() => undefined)
	expect(await db.budget_records.count()).toBe(0)
})
