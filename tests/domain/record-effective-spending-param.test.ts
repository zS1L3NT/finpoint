import { expect, test } from "bun:test"
import Dexie from "dexie"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
const { parseRecordFilters } = await import("@/logic/records")

const url = (query: string) => new URLSearchParams(query)

test("the Record list reads the spending-only filter a Dashboard drill sets", () => {
	expect(parseRecordFilters(url("effective_spending=true")).effective_spending).toBe(true)
	expect(parseRecordFilters(url("effective_spending=1")).effective_spending).toBe(true)
	expect(parseRecordFilters(url("")).effective_spending).toBeUndefined()
})
