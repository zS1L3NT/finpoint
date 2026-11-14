// The Dashboard Records sheet's read; mirrors `MonthlyRecordController::__invoke`.

import { DateTime } from "luxon"
import { db } from "@/data/db"
import { monthStart } from "@/logic/dashboard"
import { expandCategoryIdsForMonthly } from "@/logic/monthly-shared"
import { listRecords } from "@/logic/records"

export type MonthlyFilters = {
	query?: string | null
	category_ids?: string | null
	is_allocated?: string | null
	monthly_budget_id?: string | null
	show_unbudgeted?: boolean
	effective_spending?: boolean
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
	// Avoid awaiting a non-Dexie promise before the first read: liveQuery must
	// retain its observation context when no Category filter is selected.
	const category_ids = rawCategoryIds.length
		? await expandCategoryIdsForMonthly(rawCategoryIds)
		: []
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
		monthly_budget_id: filters.monthly_budget_id ?? null,
		show_unbudgeted: !!filters.show_unbudgeted,
		effective_spending: !!filters.effective_spending,
		treatment: filters.treatment ?? null,
	})

	const actualRecords = isFuture ? [] : records.filter(r => r.datetime.slice(0, 10) <= actualEnd)
	const futureRecords = records.filter(r => !actualRecords.includes(r))
	// Archived too: an old drill can still name its Monthly Budget.
	const monthlyBudget = filters.monthly_budget_id
		? ((await db.monthly_budgets.get(filters.monthly_budget_id)) ?? null)
		: null

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
		monthlyBudget,
	}
}
