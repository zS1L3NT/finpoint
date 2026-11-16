import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { createCategory } = await import("../../src/logic/categories")
const { createRecord } = await import("../../src/logic/records")
const { attachBudgetRecord, createBudget, getBudget, listBudgets } = await import(
	"../../src/logic/budgets"
)

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

async function seed() {
	const food = await createCategory({ name: "Food", icon: "utensils", color: "#123456" })
	const transfer = await createCategory({
		name: "Transfer",
		icon: "utensils",
		color: "#123456",
		analytics_treatment: "neutral",
	})
	const budget = await createBudget({
		name: "October",
		amount: 2000,
		start_date: "2026-10-01",
		end_date: "2026-10-31",
		automatic: true,
	})
	const add = (title: string, amount: number, category_id: string, day = "2026-10-05") =>
		createRecord({ title, amount, datetime: `${day}T12:00`, category_id }).then(r => r.id)
	return { food, transfer, budget, add }
}

test("spent is the Dashboard rule, equal on the list and the detail", async () => {
	const { food, transfer, budget, add } = await seed()
	const ids = [
		await add("Groceries", -1500, food.id),
		await add("Move", 300, transfer.id),
		await add("Salary", 3000, food.id),
	]
	for (const id of ids) await attachBudgetRecord(budget.id, id)
	// Automatic: only the negative amount spends; income and neutral Records do not reduce it.
	expect((await listBudgets())[0].used_amount).toBe(1500)
	expect((await getBudget(budget.id)).used_amount).toBe(1500)
})

test("a refund on a spending Category subtracts and spent may go negative", async () => {
	const { budget, add } = await seed()
	const cat = await createCategory({
		name: "Shop",
		icon: "utensils",
		color: "#123456",
		analytics_treatment: "spending",
	})
	await attachBudgetRecord(budget.id, await add("Buy", -100, cat.id))
	await attachBudgetRecord(budget.id, await add("Refund", 130, cat.id))
	expect((await getBudget(budget.id)).used_amount).toBe(-30)
	expect((await listBudgets())[0].used_amount).toBe(-30)
})
