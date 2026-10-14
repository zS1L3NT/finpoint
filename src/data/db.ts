// Persistence layer (IndexedDB via Dexie).
//
// UI code must NOT touch Dexie directly. Import from `@/logic/*` instead —
// those modules mirror the old Laravel `Api/*Controller` surface so domain
// knowledge transfers 1:1 (PHP -> TypeScript).
//
// Schema migrations live here. To change the schema:
//  1. Bump `DB_VERSION`.
//  2. Add a new `db.version(N).stores({...}).upgrade(...)` block describing
//     only the delta, mirroring how Laravel migrations each described a delta.
//  3. Keep old version blocks untouched so existing browsers upgrade cleanly.

import Dexie, { type Table } from "dexie"
import { hashLegacySnapshot, hashSnapshot } from "@/data/snapshot-hash"
import type { AnalyticsTreatment } from "@/types"

export type AccountRow = {
	id: string
	name: string
	balance: number
	bank: string
}

export type StatementRow = {
	id: string
	account_id: string
	/** "yyyy-MM-dd HH:mm" */
	datetime: string
	description: string
	amount: number
	index: number
	/** 0 | 1 (boolean stored as number so it can be indexed) */
	is_pending: number
}

export type DuplicateDismissalRow = { statement_id: string; other_statement_id: string }

export type CategoryRow = {
	id: string
	name: string
	icon: string
	color: string
	parent_category_id: string | null
	analytics_treatment: AnalyticsTreatment | null
	default_monthly_budget_id: string | null
}

export type RecordRow = {
	id: string
	title: string
	people: string | null
	location: string | null
	description: string | null
	/** "yyyy-MM-dd HH:mm" */
	datetime: string
	amount: number
	category_id: string
	analytics_treatment: AnalyticsTreatment
	analytics_treatment_source: "category" | "manual"
	monthly_budget_id: string | null
	monthly_budget_source: "category" | "manual" | null
	revision: number
}

export type AllocationRow = {
	statement_id: string
	record_id: string
	amount: number
}

export type BudgetRow = {
	id: string
	name: string
	amount: number
	/** "yyyy-MM-dd" */
	start_date: string
	/** "yyyy-MM-dd" */
	end_date: string
	automatic: boolean
}

export type BudgetRecordRow = {
	budget_id: string
	record_id: string
}

export type MonthlyBudgetRow = {
	id: string
	name: string
	color: string
	group: "core" | "outlier" | "other"
	pace_kind: "daily" | "recurring" | "none"
	display_order: number
	archived: boolean
}

export type MonthlyBudgetDefaultRow = {
	monthly_budget_id: string
	/** "yyyy-MM-dd" (first of month) */
	effective_month: string
	amount: number | null
}

export type MonthlyBudgetAmountRow = {
	monthly_budget_id: string
	/** "yyyy-MM-dd" (first of month) */
	month: string
	amount: number | null
}

export type AnalyticsMonthRow = {
	/** "yyyy-MM-dd" (first of month) */
	month: string
	coverage: string
	covered_through: string | null
	excluded_from_comparisons: boolean
}

export type MetaRow = {
	key: string
	value: string
}

export type SettingsRow = {
	key: string
	value: string | null
}

export const DB_NAME = "finpoint"
export const DB_VERSION = 5

class FinpointDB extends Dexie {
	accounts!: Table<AccountRow, string>
	statements!: Table<StatementRow, string>
	duplicate_dismissals!: Table<DuplicateDismissalRow, [string, string]>
	categories!: Table<CategoryRow, string>
	records!: Table<RecordRow, string>
	allocations!: Table<AllocationRow, [string, string]>
	budgets!: Table<BudgetRow, string>
	budget_records!: Table<BudgetRecordRow, [string, string]>
	monthly_budgets!: Table<MonthlyBudgetRow, string>
	monthly_budget_defaults!: Table<MonthlyBudgetDefaultRow, [string, string]>
	monthly_budget_amounts!: Table<MonthlyBudgetAmountRow, [string, string]>
	analytics_months!: Table<AnalyticsMonthRow, string>
	settings!: Table<SettingsRow, string>
	meta!: Table<MetaRow, string>

	constructor() {
		super(DB_NAME)

		// v1 squashes the final state of the Laravel migrations
		// (0001-0020, incl. the quota -> bucket conversion) into one baseline.
		this.version(1).stores({
			accounts: "id, name, bank",
			statements:
				"id, account_id, datetime, is_pending, [account_id+datetime], [account_id+is_pending]",
			categories: "id, &name, parent_category_id",
			records: "id, datetime, category_id, bucket_id, analytics_treatment",
			allocations: "[statement_id+record_id], statement_id, record_id",
			budgets: "id, start_date",
			budget_records: "[budget_id+record_id], budget_id, record_id",
			buckets: "id, &name, display_order",
			bucket_defaults: "[bucket_id+effective_month], bucket_id, effective_month",
			bucket_targets: "[bucket_id+month], bucket_id, month",
			analytics_months: "month",
			meta: "key",
		})

		this.version(2).stores({
			settings: "key",
		})
		this.version(3)
			.stores({
				records: "id, datetime, category_id, monthly_budget_id, analytics_treatment",
				monthly_budgets: "id, &name, display_order",
				monthly_budget_defaults:
					"[monthly_budget_id+effective_month], monthly_budget_id, effective_month",
				monthly_budget_amounts: "[monthly_budget_id+month], monthly_budget_id, month",
			})
			.upgrade(async transaction => {
				const tables: Record<string, unknown[]> = {}
				for (const table of [
					"accounts",
					"statements",
					"categories",
					"records",
					"allocations",
					"budgets",
					"budget_records",
					"buckets",
					"bucket_defaults",
					"bucket_targets",
					"analytics_months",
				]) {
					tables[table] = await transaction.table(table).toArray()
				}
				const settings = {
					default_filter_start_date:
						(await transaction.table("settings").get("default_filter_start_date"))
							?.value ?? null,
					default_filter_end_date_today:
						(await transaction.table("settings").get("default_filter_end_date_today"))
							?.value === "true",
				}
				const lastHash = await transaction.table("meta").get("drive_last_hash")
				// Convert only a clean baseline: unsynced edits must still trigger conflicts.
				const clean =
					lastHash &&
					lastHash.value ===
						(await Dexie.waitFor(hashLegacySnapshot({ settings, tables })))
				await transaction
					.table("monthly_budgets")
					.bulkPut(await transaction.table("buckets").toArray())
				for (const [legacy, canonical] of [
					["bucket_defaults", "monthly_budget_defaults"],
					["bucket_targets", "monthly_budget_amounts"],
				] as const) {
					const rows = await transaction.table(legacy).toArray()
					await transaction.table(canonical).bulkPut(
						rows.map(({ bucket_id, ...row }) => ({
							...row,
							monthly_budget_id: bucket_id,
						})),
					)
				}
				await transaction
					.table("records")
					.toCollection()
					.modify(row => {
						row.monthly_budget_id = row.bucket_id ?? null
						row.monthly_budget_source = row.bucket_source ?? null
						delete row.bucket_id
						delete row.bucket_source
					})
				await transaction
					.table("categories")
					.toCollection()
					.modify(row => {
						row.default_monthly_budget_id = row.default_bucket_id ?? null
						delete row.default_bucket_id
					})
				if (clean) {
					for (const [legacy, canonical] of [
						["buckets", "monthly_budgets"],
						["bucket_defaults", "monthly_budget_defaults"],
						["bucket_targets", "monthly_budget_amounts"],
						["records", "records"],
						["categories", "categories"],
					] as const) {
						delete tables[legacy]
						tables[canonical] = await transaction.table(canonical).toArray()
					}
					await transaction.table("meta").put({
						key: "drive_last_hash",
						value: await Dexie.waitFor(hashSnapshot({ settings, tables })),
					})
				}
			})
		this.version(4)
			.stores({ buckets: null, bucket_defaults: null, bucket_targets: null })
			.upgrade(() => {
				// The preceding migration copied every legacy row before these stores are removed.
			})
		this.version(5)
			.stores({
				duplicate_dismissals:
					"[statement_id+other_statement_id], statement_id, other_statement_id",
			})
			.upgrade(async transaction => {
				const tables: Record<string, unknown[]> = {}
				// Frozen v4 snapshot shape: later TABLES additions must not change this hash.
				for (const name of [
					"accounts",
					"statements",
					"categories",
					"records",
					"allocations",
					"budgets",
					"budget_records",
					"monthly_budgets",
					"monthly_budget_defaults",
					"monthly_budget_amounts",
					"analytics_months",
				])
					tables[name] = await transaction.table(name).toArray()
				const settings = {
					default_filter_start_date:
						(await transaction.table("settings").get("default_filter_start_date"))
							?.value ?? null,
					default_filter_end_date_today:
						(await transaction.table("settings").get("default_filter_end_date_today"))
							?.value === "true",
				}
				const lastHash = await transaction.table("meta").get("drive_last_hash")
				// Adding an empty table must not turn a clean Drive baseline into unsynced edits.
				if (lastHash?.value === (await Dexie.waitFor(hashSnapshot({ settings, tables })))) {
					tables.duplicate_dismissals = []
					await transaction.table("meta").put({
						key: "drive_last_hash",
						value: await Dexie.waitFor(hashSnapshot({ settings, tables })),
					})
				}
			})
	}
}

export const db = new FinpointDB()

export function asPending(value: boolean): number {
	return value ? 1 : 0
}

export function isPendingRow(row: { is_pending: number }): boolean {
	return row.is_pending === 1
}
