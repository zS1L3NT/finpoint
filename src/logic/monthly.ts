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
	monthly_budget_id?: string | null
	monthly_budget_group?: string | null
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
		monthly_budget_group: filters.monthly_budget_group ?? null,
		show_unbudgeted: !!filters.show_unbudgeted,
		effective_spending: !!filters.effective_spending,
		treatment: filters.treatment ?? null,
	})

	// listRecords returns enriched rows; rebuild analytics shapes for summarize().
	const toAnalytics = (r: (typeof records)[number]) => ({
		id: r.id,
		amount: r.amount,
		datetime: r.datetime,
		analytics_treatment: r.analytics_treatment,
		monthly_budget_id: r.monthly_budget_id,
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
		monthly_budget: r.monthly_budget
			? {
					id: r.monthly_budget.id,
					name: r.monthly_budget.name,
					color: r.monthly_budget.color,
					group: r.monthly_budget.group,
					pace_kind: r.monthly_budget.pace_kind,
					display_order: r.monthly_budget.display_order,
					archived: r.monthly_budget.archived,
				}
			: null,
	})

	const actualRecords = isFuture ? [] : records.filter(r => r.datetime.slice(0, 10) <= actualEnd)
	const futureRecords = records.filter(r => !actualRecords.includes(r))
	const monthlyBudgets = (await db.monthly_budgets.toArray())
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
		monthlyBudgets,
		filters: {
			query: filters.query ?? null,
			category_ids: filters.category_ids ?? null,
			is_allocated: filters.is_allocated ?? null,
			monthly_budget_id: filters.monthly_budget_id ?? null,
			monthly_budget_group: filters.monthly_budget_group ?? null,
			show_unbudgeted: !!filters.show_unbudgeted,
			effective_spending: !!filters.effective_spending,
			treatment: filters.treatment ?? null,
			start_date: filters.start_date ?? null,
			end_date: filters.end_date ?? null,
			min_amount: filters.min_amount ?? null,
			max_amount: filters.max_amount ?? null,
		},
	}
}
