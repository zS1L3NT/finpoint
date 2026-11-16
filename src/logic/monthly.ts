// The Dashboard Records sheet's read; mirrors `MonthlyRecordController::__invoke`.

import { DateTime } from "luxon"
import { db } from "@/data/db"
import { monthStart } from "@/logic/dashboard"
import {
	flagParam,
	listParam,
	looseFlagParam,
	type ParamSource,
	textParam,
} from "@/logic/filter-params"
import { listRecords, type RecordFilters } from "@/logic/records"

export type MonthlyFilters = Omit<RecordFilters, "exclude_budget_id">

/**
 * The Records sheet's URL filters. `is_allocated` reads as the Records list does, so a link
 * using `1`/`0` keeps its meaning; the other flags take `"true"` only.
 */
export function parseMonthlyFilters(params: ParamSource): MonthlyFilters {
	return {
		category_ids: listParam(params.get("category_ids")),
		is_allocated: looseFlagParam(params.get("is_allocated")),
		monthly_budget_id: textParam(params.get("monthly_budget_id")),
		show_unbudgeted: flagParam(params.get("show_unbudgeted")),
		effective_spending: flagParam(params.get("effective_spending")),
		treatment: textParam(params.get("treatment")),
		start_date: textParam(params.get("start_date")),
		end_date: textParam(params.get("end_date")),
	}
}

export async function getMonthlyRecords(month: string, year: number, filters: MonthlyFilters = {}) {
	const date = monthStart(month, year)
	const today = DateTime.now().startOf("day")
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date > today.startOf("month")
	const actualEnd = isCurrent
		? today.toFormat("yyyy-MM-dd")
		: date.endOf("month").toFormat("yyyy-MM-dd")

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

	const records = await listRecords({ ...filters, start_date: startDate, end_date: endDate })

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
