import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { listRecords } = await import("../../src/logic/records")

const category = (id: string, parent: string | null) => ({
	id,
	name: id,
	icon: "circle",
	color: "#000000",
	parent_category_id: parent,
	analytics_treatment: "automatic" as const,
	default_monthly_budget_id: null,
})
const record = (id: string, category_id: string) => ({
	id,
	title: id,
	people: null,
	location: null,
	description: null,
	datetime: "2026-10-03 12:00",
	amount: -5,
	category_id,
	treatment_choice: { kind: "category" as const },
	monthly_budget_choice: { kind: "category" as const },
	revision: 1,
})

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.categories.bulkAdd([category("food", null), category("coffee", "food"), category("fun", null)])
	await db.records.bulkAdd([record("r-food", "food"), record("r-coffee", "coffee"), record("r-fun", "fun")])
})

test("filtering Records by a parent Category includes its sub-categories", async () => {
	const rows = await listRecords({ category_ids: ["food"] })
	expect(rows.map(r => r.id).sort()).toEqual(["r-coffee", "r-food"])
	const child = await listRecords({ category_ids: ["coffee"] })
	expect(child.map(r => r.id)).toEqual(["r-coffee"])
})
