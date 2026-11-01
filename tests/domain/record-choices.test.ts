import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import Dexie from "dexie"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
import { beforeEach, expect, test } from "bun:test"
const { db } = await import("../../src/data/db")
const { exportData, importData, parseImportFile } = await import("../../src/data/export-import")
const { createCategory, updateCategory } = await import("../../src/logic/categories")
const { createRecord, updateRecord, listRecords, getRecord } = await import("../../src/logic/records")
const { migrateRecordChoices } = await import("../../src/data/record-choices")
const { resolveRecordChoices } = await import("../../src/logic/record-choices")
const { contribution } = await import("../../src/logic/analytics")
const { hashSnapshot } = await import("../../src/data/snapshot-hash")

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
})

async function setupBudgets() {
	await db.monthly_budgets.bulkAdd([
		{ id: "daily", name: "Daily", color: "#38bdf8", group: "core", pace_kind: "daily", display_order: 10, archived: false },
		{ id: "recurring", name: "Recurring", color: "#a78bfa", group: "core", pace_kind: "recurring", display_order: 20, archived: false },
	])
}

test("Taxi regression: category-origin automatic resolves to current saving/investment", async () => {
	await setupBudgets()
	// Category currently saving/investment, no budget default
	await db.categories.add({
		id: "taxi",
		name: "Taxi",
		icon: "navigation",
		color: "#AB47BD",
		parent_category_id: null,
		analytics_treatment: "saving_investment",
		default_monthly_budget_id: null,
	})
	// Old record: stored automatic + category origin, while category is now saving/investment
	// Simulates backup where record was saved when category was automatic, then category changed
	const oldRow = {
		id: "taxi-1",
		title: "Taxi from AMQ Camp to Home",
		people: null,
		location: null,
		description: null,
		datetime: "2026-07-24 12:00",
		amount: -20,
		category_id: "taxi",
		analytics_treatment: "automatic",
		analytics_treatment_source: "category",
		monthly_budget_id: null,
		monthly_budget_source: null,
		revision: 1,
	}
	const migrated = migrateRecordChoices(oldRow, true)
	expect(migrated.treatment_choice).toEqual({ kind: "category" })
	expect(migrated.monthly_budget_choice).toEqual({ kind: "category" })
	await db.records.add(migrated as never)

	const stored = await db.records.get("taxi-1")
	if (!stored) throw new Error("missing")
	const resolved = resolveRecordChoices(stored, await db.categories.get("taxi"))
	// Must follow current category, not old copied automatic
	expect(resolved.analytics_treatment).toBe("saving_investment")

	// Filters, details and calculations must agree
	const filtered = await listRecords({ treatment: "saving_investment" })
	expect(filtered.map(r => r.id)).toContain("taxi-1")
	const autoFiltered = await listRecords({ treatment: "automatic" })
	expect(autoFiltered.map(r => r.id)).not.toContain("taxi-1")
	const detail = await getRecord("taxi-1")
	expect(detail.analytics_treatment).toBe("saving_investment")
	// saving/investment with negative amount = contribution, not spending/income
	const c = contribution(detail.analytics_treatment, detail.amount)
	expect(c.contributions).toBeGreaterThan(0)
})

test("independent choices and category default changes", async () => {
	await setupBudgets()
	const cat = await createCategory({ name: "Food", icon: "utensils", color: "#123456", analytics_treatment: "spending", default_monthly_budget_id: "daily" })
	// New records default to category choices
	const rec = await createRecord({ title: "Lunch", amount: -10, datetime: "2026-10-01T12:00", category_id: cat.id })
	expect(rec.treatment_choice).toEqual({ kind: "category" })
	expect(rec.monthly_budget_choice).toEqual({ kind: "category" })
	expect(rec.analytics_treatment).toBe("spending")
	expect(rec.monthly_budget_id).toBe("daily")

	// Explicit choices stay fixed when category changes
	const explicit = await createRecord({
		title: "Explicit",
		amount: -10,
		datetime: "2026-10-01T12:00",
		category_id: cat.id,
		analytics_treatment: "income",
		monthly_budget_id: "recurring",
		monthly_budget_source: "manual",
	})
	expect(explicit.analytics_treatment).toBe("income")
	expect(explicit.monthly_budget_id).toBe(null) // income ineligible, retained but hidden
	expect(explicit.monthly_budget_choice).toEqual({ kind: "explicit", id: "recurring" })

	// Change category default: inherited follows, explicit stays
	await updateCategory(cat.id, { name: "Food", icon: "utensils", color: "#123456", analytics_treatment: "income", default_monthly_budget_id: "recurring" })
	const after = await getRecord(rec.id)
	expect(after.analytics_treatment).toBe("income")
	expect(after.monthly_budget_id).toBe(null) // income ineligible
	const afterExplicit = await getRecord(explicit.id)
	expect(afterExplicit.treatment_choice).toEqual({ kind: "explicit", value: "income" })
	expect(afterExplicit.monthly_budget_choice).toEqual({ kind: "explicit", id: "recurring" })
})

test("explicit Unbudgeted survives category changes", async () => {
	await setupBudgets()
	const cat = await createCategory({ name: "Dining", icon: "utensils", color: "#123", analytics_treatment: "spending", default_monthly_budget_id: "daily" })
	const rec = await createRecord({
		title: "Unbudgeted",
		amount: -10,
		datetime: "2026-10-01T12:00",
		category_id: cat.id,
		monthly_budget_id: null,
		monthly_budget_source: "manual",
	})
	expect(rec.monthly_budget_choice).toEqual({ kind: "unbudgeted" })
	expect(rec.monthly_budget_id).toBe(null)

	await updateCategory(cat.id, { name: "Dining", icon: "utensils", color: "#123", analytics_treatment: "spending", default_monthly_budget_id: "recurring" })
	const after = await getRecord(rec.id)
	expect(after.monthly_budget_choice).toEqual({ kind: "unbudgeted" })
	expect(after.monthly_budget_id).toBe(null)
})

test("Automatic sign transitions and Spending refund", async () => {
	await setupBudgets()
	const cat = await createCategory({ name: "Auto", icon: "x", color: "#123", analytics_treatment: "automatic", default_monthly_budget_id: "daily" })
	const neg = await createRecord({ title: "Neg", amount: -10, datetime: "2026-10-01T12:00", category_id: cat.id })
	expect(neg.analytics_treatment).toBe("automatic")
	expect(neg.monthly_budget_id).toBe("daily") // automatic + negative = eligible
	const pos = await createRecord({ title: "Pos", amount: 10, datetime: "2026-10-01T12:00", category_id: cat.id })
	expect(pos.monthly_budget_id).toBe(null) // automatic + positive = income, ineligible

	const spendCat = await createCategory({ name: "Spend", icon: "x", color: "#123", analytics_treatment: "spending", default_monthly_budget_id: "daily" })
	const refund = await createRecord({ title: "Refund", amount: 20, datetime: "2026-10-01T12:00", category_id: spendCat.id })
	expect(refund.monthly_budget_id).toBe("daily") // spending always eligible, even positive refund
	const c = contribution(refund.analytics_treatment, refund.amount)
	expect(c.spending).toBe(-2000) // reduces spending
})

test("no-op edits preserve choices", async () => {
	await setupBudgets()
	const cat = await createCategory({ name: "Food", icon: "x", color: "#123", analytics_treatment: "spending", default_monthly_budget_id: "daily" })
	const rec = await createRecord({ title: "Lunch", amount: -10, datetime: "2026-10-01T12:00", category_id: cat.id })
	const before = await db.records.get(rec.id)
	const edited = await updateRecord(rec.id, {
		title: "Lunch",
		amount: -10,
		datetime: "2026-10-01T12:00",
		category_id: cat.id,
		analytics_treatment: null,
		monthly_budget_id: null,
		monthly_budget_source: "category",
		revision: rec.revision,
	})
	// Passing category choice explicitly must preserve category choice, not convert to unbudgeted
	expect(edited.monthly_budget_choice).toEqual({ kind: "category" })
	expect((before as never as { treatment_choice: unknown }).treatment_choice).toEqual((edited as never as { treatment_choice: unknown }).treatment_choice)
})

test("eligibility round trip retains choice", async () => {
	await setupBudgets()
	const cat = await createCategory({ name: "Food", icon: "x", color: "#123", analytics_treatment: "spending", default_monthly_budget_id: "daily" })
	const rec = await createRecord({ title: "Lunch", amount: -10, datetime: "2026-10-01T12:00", category_id: cat.id })
	expect(rec.monthly_budget_id).toBe("daily")

	// Make ineligible via explicit transfer
	const excluded = await updateRecord(rec.id, {
		title: "Lunch",
		amount: -10,
		datetime: "2026-10-01T12:00",
		category_id: cat.id,
		analytics_treatment: "neutral",
		revision: rec.revision,
	})
	expect(excluded.analytics_treatment).toBe("neutral")
	expect(excluded.monthly_budget_id).toBe(null) // hidden
	expect(excluded.monthly_budget_choice).toEqual({ kind: "category" }) // retained internally

	// Back to eligible: category default resumes
	const back = await updateRecord(excluded.id, {
		title: "Lunch",
		amount: -10,
		datetime: "2026-10-01T12:00",
		category_id: cat.id,
		analytics_treatment: null,
		revision: excluded.revision,
	})
	expect(back.monthly_budget_id).toBe("daily")
})

test("category hidden-default retention", async () => {
	await setupBudgets()
	const cat = await createCategory({ name: "Food", icon: "x", color: "#123", analytics_treatment: "spending", default_monthly_budget_id: "daily" })
	// Make category ineligible but retain default internally
	const updated = await updateCategory(cat.id, { name: "Food", icon: "x", color: "#123", analytics_treatment: "neutral", default_monthly_budget_id: "daily" })
	expect(updated.default_monthly_budget_id).toBe("daily")

	const rec = await createRecord({ title: "Lunch", amount: -10, datetime: "2026-10-01T12:00", category_id: cat.id })
	// Record inherits category choice, but effective is null while ineligible
	expect(rec.monthly_budget_choice).toEqual({ kind: "category" })
	expect(rec.monthly_budget_id).toBe(null)

	// Back to eligible: default reappears
	await updateCategory(cat.id, { name: "Food", icon: "x", color: "#123", analytics_treatment: "spending", default_monthly_budget_id: "daily" })
	const after = await getRecord(rec.id)
	expect(after.monthly_budget_id).toBe("daily")
})

test("migration preserves explicit and converts ambiguous to category", async () => {
	const legacyExplicit = {
		id: "r1",
		analytics_treatment: "spending",
		analytics_treatment_source: "manual",
		monthly_budget_id: "daily",
		monthly_budget_source: "manual",
	}
	expect(migrateRecordChoices(legacyExplicit, true).treatment_choice).toEqual({ kind: "explicit", value: "spending" })
	expect(migrateRecordChoices(legacyExplicit, true).monthly_budget_choice).toEqual({ kind: "explicit", id: "daily" })

	const legacyCategory = {
		id: "r2",
		analytics_treatment: "automatic",
		analytics_treatment_source: "category",
		monthly_budget_id: null,
		monthly_budget_source: null,
	}
	expect(migrateRecordChoices(legacyCategory, true).treatment_choice).toEqual({ kind: "category" })
	expect(migrateRecordChoices(legacyCategory, true).monthly_budget_choice).toEqual({ kind: "category" })

	const legacyMissingNoCat = {
		id: "r3",
		analytics_treatment: "automatic",
		analytics_treatment_source: null,
		monthly_budget_id: null,
		monthly_budget_source: null,
	}
	expect(migrateRecordChoices(legacyMissingNoCat, false).monthly_budget_choice).toEqual({ kind: "unbudgeted" })
})

test("old backup import converts to choices and validates", async () => {
	await setupBudgets()
	await createCategory({ name: "Food", icon: "x", color: "#123", analytics_treatment: "spending", default_monthly_budget_id: "daily" })
	await createRecord({ title: "Lunch", amount: -10, datetime: "2026-10-01T12:00", category_id: "food" })
	const backup = await exportData()
	const old = JSON.parse(JSON.stringify(backup))
	old.version = 6
	// Simulate old shape: replace choices with legacy fields
	old.tables.records = old.tables.records.map((r: Record<string, unknown>) => {
		const { treatment_choice, monthly_budget_choice, ...rest } = r
		const tc = treatment_choice as { kind: string; value?: string }
		const bc = monthly_budget_choice as { kind: string; id?: string }
		return {
			...rest,
			analytics_treatment: tc.kind === "explicit" ? tc.value : "spending",
			analytics_treatment_source: tc.kind === "explicit" ? "manual" : "category",
			monthly_budget_id: bc.kind === "explicit" ? bc.id : null,
			monthly_budget_source: bc.kind === "category" ? "category" : bc.kind === "explicit" ? "manual" : null,
		}
	})
	const parsed = parseImportFile(JSON.stringify(old))
	expect(parsed.version).toBe(7)
	for (const row of parsed.tables.records as Record<string, unknown>[]) {
		expect(row.treatment_choice).toBeDefined()
		expect(row.monthly_budget_choice).toBeDefined()
		expect("analytics_treatment" in row).toBe(false)
	}
})

test("version seven upgrade normalizes categories and converts choices while preserving Drive baselines", async () => {
	await setupBudgets()
	await createCategory({ name: "Food", icon: "x", color: "#123", analytics_treatment: "spending", default_monthly_budget_id: "daily" })
	await createRecord({ title: "Lunch", amount: -10, datetime: "2026-10-01T12:00", category_id: "food" })
	// Taxi-like: category-origin automatic that disagrees with current category
	await db.categories.add({
		id: "taxi",
		name: "Taxi",
		icon: "x",
		color: "#123",
		parent_category_id: null,
		analytics_treatment: "saving_investment",
		default_monthly_budget_id: null,
	})
	await db.records.add({
		id: "taxi-1",
		title: "Taxi",
		people: null,
		location: null,
		description: null,
		datetime: "2026-07-24 12:00",
		amount: -20,
		category_id: "taxi",
		treatment_choice: { kind: "category" },
		monthly_budget_choice: { kind: "category" },
		revision: 1,
	} as never)
	for (const clean of [true, false]) {
		const backup = await exportData()
		// Simulate released v7 shape: choices -> legacy resolved+source
		const tables = {
			...backup.tables,
			categories: (backup.tables.categories as Record<string, unknown>[]).map(category =>
				category.id === "food" ? { ...category, analytics_treatment: null } : category,
			),
			records: (backup.tables.records as Record<string, unknown>[]).map(row => {
				const { treatment_choice, monthly_budget_choice, ...rest } = row
				const tc = treatment_choice as { kind: string; value?: string }
				const bc = monthly_budget_choice as { kind: string; id?: string }
				// Taxi row keeps old copied automatic even though category is saving/investment
				const isTaxi = (row as { id: string }).id === "taxi-1"
				return {
					...rest,
					analytics_treatment: isTaxi ? "automatic" : tc.kind === "explicit" ? tc.value : "spending",
					analytics_treatment_source: tc.kind === "explicit" ? "manual" : "category",
					monthly_budget_id: bc.kind === "explicit" ? bc.id : (row as { id: string }).id === "lunch" ? "daily" : null,
					monthly_budget_source: bc.kind === "category" ? "category" : bc.kind === "explicit" ? "manual" : null,
				}
			}),
		}
		const baseline = clean ? await hashSnapshot({ settings: backup.settings, tables }) : "dirty"
		const schema = Object.fromEntries(db.tables.map(t => [t.name, [t.schema.primKey.src, ...t.schema.indexes.map(i => i.src)].join(",")]))
		await db.delete()
		const old = new Dexie("finpoint")
		old.version(7).stores({ ...schema, records: "id, datetime, category_id, monthly_budget_id, analytics_treatment" })
		for (const [name, rows] of Object.entries(tables))
			if ((rows as unknown[]).length) await old.table(name).bulkAdd(rows as never[])
		await old.table("meta").put({ key: "drive_last_hash", value: baseline })
		old.close()
		await db.open()
		// Both conversions run directly from the released schema.
		expect(db.verno).toBe(8)
		expect((await db.categories.get("food"))?.analytics_treatment).toBe("automatic")
		expect(db.records.schema.indexes.some(index => index.name === "monthly_budget_id")).toBe(false)
		const taxi = await db.records.get("taxi-1")
		expect(taxi?.treatment_choice).toEqual({ kind: "category" })
		const resolved = resolveRecordChoices(taxi as never, await db.categories.get("taxi"))
		expect(resolved.analytics_treatment).toBe("saving_investment")
		expect((await db.meta.get("drive_last_hash"))?.value).toBe(clean ? await hashSnapshot(await exportData()) : baseline)
	}
})
