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

export type CategoryRow = {
	id: string
	name: string
	icon: string
	color: string
	parent_category_id: string | null
	analytics_treatment: AnalyticsTreatment | null
	default_bucket_id: string | null
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
	bucket_id: string | null
	bucket_source: "category" | "manual" | null
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

export type BucketRow = {
	id: string
	name: string
	color: string
	group: "core" | "outlier" | "other"
	pace_kind: "daily" | "recurring" | "none"
	display_order: number
	archived: boolean
}

export type BucketDefaultRow = {
	bucket_id: string
	/** "yyyy-MM-dd" (first of month) */
	effective_month: string
	amount: number | null
}

export type BucketTargetRow = {
	bucket_id: string
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

export const DB_NAME = "finpoint"
export const DB_VERSION = 1

class FinpointDB extends Dexie {
	accounts!: Table<AccountRow, string>
	statements!: Table<StatementRow, string>
	categories!: Table<CategoryRow, string>
	records!: Table<RecordRow, string>
	allocations!: Table<AllocationRow, [string, string]>
	budgets!: Table<BudgetRow, string>
	budget_records!: Table<BudgetRecordRow, [string, string]>
	buckets!: Table<BucketRow, string>
	bucket_defaults!: Table<BucketDefaultRow, [string, string]>
	bucket_targets!: Table<BucketTargetRow, [string, string]>
	analytics_months!: Table<AnalyticsMonthRow, string>
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
	}
}

export const db = new FinpointDB()

export function asPending(value: boolean): number {
	return value ? 1 : 0
}

export function isPendingRow(row: { is_pending: number }): boolean {
	return row.is_pending === 1
}
