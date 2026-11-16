import { beforeEach, expect, test } from "bun:test"
import Dexie from "dexie"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
const { db } = await import("@/data/db")
const { createRecord, updateRecord } = await import("@/logic/records")
const { ValidationError } = await import("@/logic/validate")

const base = {
	title: "Coffee",
	datetime: "2026-10-03T12:00",
	amount: -10,
	category_id: "c",
}

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.accounts.add({ id: "a", name: "DBS", balance: 0, bank: "DBS" })
	await db.categories.add({
		id: "c",
		name: "Cafe",
		icon: "x",
		color: "#000000",
		parent_category_id: null,
		analytics_treatment: "automatic",
		default_monthly_budget_id: null,
	})
	await db.statements.add({
		id: "s",
		account_id: "a",
		description: "COFFEE",
		datetime: "2026-10-03 12:00",
		amount: -20,
		index: 0,
		is_pending: 0,
	})
})

async function rejection(run: () => Promise<unknown>) {
	try {
		await run()
	} catch (error) {
		return error
	}
}

test("a Record cannot allocate the same Statement twice on create", async () => {
	const error = await rejection(() =>
		createRecord({
			...base,
			statements: [
				{ id: "s", amount: -5 },
				{ id: "s", amount: -5 },
			],
		}),
	)
	expect(error).toBeInstanceOf(ValidationError)
	expect(Object.keys((error as InstanceType<typeof ValidationError>).errors)).toEqual(["statements.1.id"])
	expect(await db.records.count()).toBe(0)
	expect(await db.allocations.count()).toBe(0)
})

test("a Record cannot allocate the same Statement twice on update", async () => {
	const record = await createRecord({ ...base, statements: [{ id: "s", amount: -10 }] })
	const error = await rejection(() =>
		updateRecord(record.id, {
			...base,
			statements: [
				{ id: "s", amount: -5 },
				{ id: "s", amount: -5 },
			],
		}),
	)
	expect(error).toBeInstanceOf(ValidationError)
	expect(Object.keys((error as InstanceType<typeof ValidationError>).errors)).toEqual(["statements.1.id"])
	expect(await db.allocations.count()).toBe(1)
})
