// Mirrors `MonthlyRecordController::__invoke`.

import { DateTime } from "luxon"
import { db } from "@/data/db"
import { summarize } from "@/logic/analytics"
import { monthStart } from "@/logic/dashboard"
import { expandCategoryIdsForMonthly } from "@/logic/monthly-shared"
import { listRecords } from "@/logic/records"

export type MonthlyFilters = {
	query?: string | null
	category_ids?: string | null
	is_allocated?: string | null
	bucket_id?: string | null
	bucket_group?: string | null
	show_unbucketed?: boolean
	treatment?: string | null
	start_date?: string | null
	end_date?: string | null
	min_amount?: string | null
	max_amount?: string | null
}

export async function getMonthlyRecords(month: string, year: number, filters: MonthlyFilters = {}) {
	const date = monthStart(month, year)
	const today = DateTime.now().startOf("day")
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date > today.startOf("month")
	const actualEnd = isCurrent
		? today.toFormat("yyyy-MM-dd")
		: date.endOf("month").toFormat("yyyy-MM-dd")

	const rawCategoryIds = (filters.category_ids ?? "").split(",").filter(Boolean)
	const category_ids = await expandCategoryIdsForMonthly(rawCategoryIds)
	const startDate = filters.start_date ?? date.toFormat("yyyy-MM-dd")
	const endDate = filters.end_date ?? date.endOf("month").toFormat("yyyy-MM-dd")
	const rangeStart = DateTime.fromFormat(startDate, "yyyy-MM-dd")
	const rangeEnd = DateTime.fromFormat(endDate, "yyyy-MM-dd")
	if (
		!rangeStart.isValid ||
		!rangeEnd.isValid ||
		!rangeStart.hasSame(date, "month") ||
		!rangeEnd.hasSame(date, "month") ||
		rangeEnd < rangeStart
	) {
		throw new Error("Invalid date range.")
	}

	const records = await listRecords({
		query: filters.query ?? null,
		start_date: startDate,
		end_date: endDate,
		min_amount: filters.min_amount ?? null,
		max_amount: filters.max_amount ?? null,
		is_allocated: filters.is_allocated ?? null,
		category_ids,
		bucket_id: filters.bucket_id ?? null,
		bucket_group: filters.bucket_group ?? null,
		show_unbucketed: !!filters.show_unbucketed,
		treatment: filters.treatment ?? null,
	})

	// listRecords returns enriched rows; rebuild analytics shapes for summarize().
	const toAnalytics = (r: (typeof records)[number]) => ({
		id: r.id,
		amount: r.amount,
		datetime: r.datetime,
		analytics_treatment: r.analytics_treatment,
		bucket_id: r.bucket_id,
		is_pending: r.is_pending,
		category: r.category
			? {
					id: r.category.id,
					name: r.category.name,
					icon: r.category.icon,
					color: r.category.color,
				}
			: null,
		category_parent: null,
		bucket: r.bucket
			? {
					id: r.bucket.id,
					name: r.bucket.name,
					color: r.bucket.color,
					group: r.bucket.group,
					pace_kind: r.bucket.pace_kind,
					display_order: r.bucket.display_order,
					archived: r.bucket.archived,
				}
			: null,
	})

	const actualRecords = isFuture ? [] : records.filter(r => r.datetime.slice(0, 10) <= actualEnd)
	const futureRecords = records.filter(r => !actualRecords.includes(r))
	const buckets = (await db.buckets.toArray())
		.filter(b => !b.archived)
		.sort((a, b) => a.display_order - b.display_order)

	return {
		month,
		year,
		period: {
			is_current: isCurrent,
			is_future: isFuture,
			through: isCurrent ? today.toFormat("yyyy-MM-dd") : null,
		},
		records: actualRecords,
		future_records: futureRecords,
		summary: summarize(actualRecords.map(toAnalytics)),
		buckets,
		filters: {
			query: filters.query ?? null,
			category_ids: filters.category_ids ?? null,
			is_allocated: filters.is_allocated ?? null,
			bucket_id: filters.bucket_id ?? null,
			bucket_group: filters.bucket_group ?? null,
			show_unbucketed: !!filters.show_unbucketed,
			treatment: filters.treatment ?? null,
			start_date: filters.start_date ?? null,
			end_date: filters.end_date ?? null,
			min_amount: filters.min_amount ?? null,
			max_amount: filters.max_amount ?? null,
		},
	}
}
