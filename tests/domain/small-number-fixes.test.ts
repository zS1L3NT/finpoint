import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
import { DateTime } from "luxon"
const { db } = await import("../../src/data/db")
const { listAccounts } = await import("../../src/logic/accounts")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

test("the Account 30 day figures ignore future Pending Statements", async () => {
	const future = DateTime.now().plus({ days: 20 }).toFormat("yyyy-MM-dd")
	await db.accounts.add({ id: "a", name: "A", balance: 0, bank: "DBS" })
	await db.statements.add({
		id: "future",
		account_id: "a",
		datetime: `${future} 12:00`,
		description: "future",
		amount: -50,
		index: 0,
		is_pending: 1,
	})
	const account = (await listAccounts()).find(a => a.id === "a")
	expect(account?.outflow_30d).toBe(0)
})

test("a day header can total the allocable amount and says it covers the page", async () => {
	const { byDay } = await import("../../src/components/table/row-groups")
	const rows = [{ datetime: "2026-10-05 12:00", amount: -100, allocable_amount: -40 }]
	const group = byDay<(typeof rows)[number]>("Statement", row => row.allocable_amount, "Left to allocate on this page")
	expect(group.total?.(rows)).toBe(-40)
	expect(group.totalLabel).toBe("Left to allocate on this page")
	expect(byDay<(typeof rows)[number]>("Statement").total?.(rows)).toBe(-100)
})

test("the Budget detail orders same-minute Records like the Records list", async () => {
	const { createCategory } = await import("../../src/logic/categories")
	const { createRecord, listRecords } = await import("../../src/logic/records")
	const { attachBudgetRecord, createBudget, getBudget } = await import("../../src/logic/budgets")
	const category = await createCategory({ name: "Food", icon: "utensils", color: "#123456" })
	const budget = await createBudget({
		name: "B",
		amount: 100,
		start_date: "2026-10-01",
		end_date: "2026-10-31",
	})
	for (const [title, amount] of [
		["Zed", -5],
		["Alpha", -5],
		["Big", -50],
	] as const) {
		const record = await createRecord({ title, amount, datetime: "2026-10-05T12:00", category_id: category.id })
		await attachBudgetRecord(budget.id, record.id)
	}
	const detail = (await getBudget(budget.id)).records.map(r => r.id)
	expect(detail).toEqual((await listRecords()).map(r => r.id))
})

test("the unbudgeted badge counts later Records the sheet lists", async () => {
	const { getDashboard } = await import("../../src/logic/dashboard")
	const { Settings } = await import("luxon")
	const previousNow = Settings.now
	try {
		Settings.now = () => 1791201600000
		await db.categories.add({
			id: "c",
			name: "Food",
			icon: "",
			color: "",
			parent_category_id: null,
			analytics_treatment: "spending",
			default_monthly_budget_id: null,
		})
		for (const [index, day] of ["01", "02", "03", "04", "20", "21"].entries()) {
			await db.records.add({
				id: `r${index}`,
				title: `r${index}`,
				amount: -10,
				datetime: `2026-10-${day} 12:00`,
				category_id: "c",
				people: null,
				location: null,
				description: null,
				treatment_choice: { kind: "explicit", value: "spending" },
				monthly_budget_choice: { kind: "unbudgeted" },
				revision: 1,
			})
		}
		expect((await getDashboard({ month: "October", year: 2026 })).summary.unbudgeted_count).toBe(6)
	} finally {
		Settings.now = previousNow
	}
})

test("Monthly Budget remaining is rounded to cents, so a used-up plan reads 0", async () => {
	const { upsertMonthlyBudget } = await import("../../src/logic/monthly-budgets")
	const { getDashboardView } = await import("../../src/logic/dashboard")
	const { Settings } = await import("luxon")
	const previousNow = Settings.now
	try {
		Settings.now = () => 1791201600000
		await db.categories.add({
			id: "c",
			name: "Food",
			icon: "",
			color: "",
			parent_category_id: null,
			analytics_treatment: "spending",
			default_monthly_budget_id: null,
		})
		const budget = await upsertMonthlyBudget({ name: "Food", color: "#123456", month: "2026-10-01", amount: 100, scope: "month" })
		for (const [id, day, amount] of [
			["spent", "01", -9.46],
			["second", "02", -90.54],
		] as const) {
			await db.records.add({
				id,
				title: id,
				amount,
				datetime: `2026-10-${day} 12:00`,
				category_id: "c",
				people: null,
				location: null,
				description: null,
				treatment_choice: { kind: "explicit", value: "spending" },
				monthly_budget_choice: { kind: "explicit", id: budget.id },
				revision: 1,
			})
		}
		const view = await getDashboardView({ month: "October", year: 2026, scope: budget.id })
		// The page tests `=== 0`, which -0 also satisfies.
		expect(view.pace.projection.monthly_budget?.remaining === 0).toBe(true)
		expect(view.dashboard.monthlyBudgets.find(b => b.id === budget.id)?.remaining === 0).toBe(true)
	} finally {
		Settings.now = previousNow
	}
})
