import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { asPending, db } = await import("../../src/data/db")
const { ConflictError, createRecord, deleteRecord, updateRecord } = await import("../../src/logic/records")
const { deletePendingStatement, updatePendingStatement } = await import(
	"../../src/logic/statements"
)
const { createCategory, deleteCategory, updateCategory } = await import(
	"../../src/logic/categories"
)
const { attachBudgetRecord } = await import("../../src/logic/budgets")
const { upsertMonthlyBudget } = await import("../../src/logic/monthly-budgets")
const { ValidationError } = await import("../../src/logic/validate")

async function reset() {
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
}

beforeEach(reset)

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

// Runs `first` until it reaches its first write (opening its transaction, or a write outside
// one), holds it there, lets `second` run, then lets `first` continue. Whatever `first` read or
// checked before that point can have gone stale by then; code that checks inside its transaction
// is unaffected because the transaction opens (and locks) only when `first` is released.
const HELD = ["add", "put", "update", "delete", "bulkAdd", "bulkPut", "bulkDelete"]

async function raceGap(
	setup: () => Promise<void>,
	first: () => Promise<unknown>,
	second: () => Promise<unknown>,
	check: () => Promise<void>,
) {
	await reset()
	await setup()
	let release = () => {}
	let reached = () => {}
	const gate = new Promise<void>(r => (release = r))
	const held = new Promise<void>(r => (reached = r))
	let armed = true
	const restore: (() => void)[] = []
	const hold = (target: Record<string, unknown>, key: string) => {
		const original = target[key] as (...args: unknown[]) => unknown
		target[key] = function (this: unknown, ...args: unknown[]) {
			if (!armed) return original.apply(this, args)
			armed = false
			reached()
			return gate.then(() => original.apply(this, args))
		}
		restore.push(() => (target[key] = original))
	}
	try {
		const tableProto = Object.getPrototypeOf(db.accounts)
		for (const key of HELD) hold(tableProto, key)
		hold(db as never, "transaction")
		const writing = first()
		await Promise.race([held, writing.then(undefined, () => undefined)])
		const other = second()
		for (let tick = 0; tick < 30; tick++) await db.accounts.count()
		release()
		await Promise.allSettled([writing, other])
	} finally {
		for (const undo of restore) undo()
	}
	await check()
}

const allocatedSum = async () => (await db.allocations.toArray()).reduce((s, a) => s + a.amount, 0)

test("overlapping createRecord calls cannot over-allocate a Statement", async () => {
	await raceGap(
		() => statement("s", -100),
		() => createRecord(record([{ id: "s", amount: -100 }])),
		() => createRecord(record([{ id: "s", amount: -100 }])),
		async () => expect(await allocatedSum()).toBe(-100),
	)
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
	let allocated = 0
	let deleted = 0
	const check = async () => {
		const rows = await db.allocations.toArray()
		for (const a of rows) expect(await db.statements.get(a.statement_id)).toBeDefined()
		if (rows.length) allocated++
		else if (!(await db.statements.get("p"))) deleted++
	}
	const create = () => createRecord(record([{ id: "p", amount: -100 }]))
	const setup = () => statement("p", -100, 1)
	await raceGap(setup, create, () => deletePendingStatement("p"), check)
	await raceGap(setup, () => deletePendingStatement("p"), create, check)
	// Both outcomes happen across the orderings, so the loops are not passing on an empty run.
	expect(allocated).toBeGreaterThan(0)
	expect(deleted).toBeGreaterThan(0)
})

test("editing a pending Statement while a Record allocates it never under-covers it", async () => {
	let allocated = 0
	const edit = () =>
		updatePendingStatement("p", {
			account_id: "acc",
			datetime: "2026-01-01T00:00",
			description: "p",
			amount: -10,
		} as never)
	const create = () => createRecord(record([{ id: "p", amount: -100 }]))
	const setup = () => statement("p", -100, 1)
	const check = async () => {
		const stored = await db.statements.get("p")
		const sum = await allocatedSum()
		if (sum) allocated++
		// An Allocation beyond the Statement's amount (more negative) over-covers it.
		expect(sum).toBeGreaterThanOrEqual(stored?.amount ?? 0)
	}
	await raceGap(setup, create, edit, check)
	await raceGap(setup, edit, create, check)
	expect(allocated).toBeGreaterThan(0)
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

test("attaching a Budget to a Record that is being deleted stores nothing", async () => {
	const budget = {
		id: "b",
		name: "Trip",
		amount: 100,
		start_date: "2026-01-01",
		end_date: "2026-01-31",
		automatic: false,
	}
	let recordId = ""
	await raceGap(
		async () => {
			await db.budgets.add(budget)
			recordId = (await createRecord(record([]))).id
		},
		() => attachBudgetRecord("b", recordId),
		() => deleteRecord(recordId),
		async () => {
			for (const link of await db.budget_records.toArray()) {
				expect(await db.records.get(link.record_id)).toBeDefined()
			}
		},
	)
})
