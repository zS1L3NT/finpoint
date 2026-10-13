// Mirrors `DashboardController` + `MonthlyRecordController` (read-model logic).
// Pure functions over the IndexedDB tables — no HTTP involved.

import { DateTime } from "luxon"
import {
	type AnalyticsMonthRow,
	type CategoryRow,
	db,
	type MonthlyBudgetAmountRow,
	type MonthlyBudgetDefaultRow,
	type MonthlyBudgetRow,
	type RecordRow,
	type StatementRow,
} from "@/data/db"
import { type AnalyticsRecord, contribution, summarize } from "@/logic/analytics"
import { expandCategoryIdsForMonthly } from "@/logic/monthly-shared"
import {
	type AllocationTally,
	isPendingRecord,
	pendingStatementIds,
	tallyAllocations,
} from "@/logic/pending"

export const COMPARISON_MONTHS = 2
export const BREAKDOWN_MONTHS = 4

export type DashboardInput = { month: string; year: number }

export type CashflowHistoryMonth = {
	month: string
	offset: number
	spending: number[]
	surplus: number[]
}

export type SpendingHistoryMonth = {
	month: string
	included: boolean
	reason: string
	current: boolean
	categories: {
		id: string
		name: string
		color: string
		spending: number
		monthly_budget_spending: Record<string, number>
	}[]
}

export function monthStart(month: string, year: number): DateTime {
	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
	if (!date.isValid || date.monthLong !== month || year < 2000 || year > 2100) {
		throw new Error("Invalid month.")
	}
	return date.startOf("month")
}

function toAnalyticsRecords(
	rows: {
		id: string
		amount: number
		datetime: string
		analytics_treatment: string
		monthly_budget_id: string | null
		category_id: string
	}[],
	allocatedByRecord: Map<string, AllocationTally>,
	categories: Map<string, CategoryRow>,
	monthlyBudgets: Map<string, MonthlyBudgetRow>,
): AnalyticsRecord[] {
	const items: (AnalyticsRecord | null)[] = rows.map(row => {
		const entry = allocatedByRecord.get(row.id)
		const category = categories.get(row.category_id)
		if (!category) return null
		const parent = category.parent_category_id
			? (categories.get(category.parent_category_id) ?? null)
			: null
		const monthly_budget = row.monthly_budget_id
			? (monthlyBudgets.get(row.monthly_budget_id) ?? null)
			: null
		return {
			id: row.id,
			amount: row.amount,
			datetime: row.datetime,
			analytics_treatment: row.analytics_treatment,
			monthly_budget_id: row.monthly_budget_id,
			is_pending: isPendingRecord(row.amount, entry),
			category: {
				id: category.id,
				name: category.name,
				icon: category.icon,
				color: category.color,
			},
			category_parent: parent
				? { id: parent.id, name: parent.name, icon: parent.icon, color: parent.color }
				: null,
			monthly_budget: monthly_budget
				? {
						id: monthly_budget.id,
						name: monthly_budget.name,
						color: monthly_budget.color,
						group: monthly_budget.group,
						pace_kind: monthly_budget.pace_kind,
						display_order: monthly_budget.display_order,
						archived: monthly_budget.archived,
					}
				: null,
		} satisfies AnalyticsRecord
	})
	return items.filter((r): r is AnalyticsRecord => r !== null)
}

/** Range check on the "yyyy-MM-dd" prefix; callers format the bounds once, not per record. */
function inRange(datetime: string, start: string, end: string): boolean {
	const day = datetime.slice(0, 10)
	return day >= start && day <= end
}

const ISO_DAY = "yyyy-MM-dd"

type LoadedTables = {
	records: RecordRow[]
	statements: StatementRow[]
	allocatedStatementIds: Set<string>
	allocated: Map<string, AllocationTally>
	categories: Map<string, CategoryRow>
	monthlyBudgets: Map<string, MonthlyBudgetRow>
	monthly_budgetRows: MonthlyBudgetRow[]
	targets: MonthlyBudgetAmountRow[]
	defaults: MonthlyBudgetDefaultRow[]
	coverages: Map<string, AnalyticsMonthRow>
}

async function loadDashboardTables(): Promise<LoadedTables> {
	const [
		allRecords,
		allocations,
		coverages,
		categories,
		monthlyBudgets,
		targets,
		defaults,
		pending,
		statements,
	] = await Promise.all([
		db.records.toArray(),
		db.allocations.toArray(),
		db.analytics_months.toArray(),
		db.categories.toArray(),
		db.monthly_budgets.toArray(),
		db.monthly_budget_amounts.toArray(),
		db.monthly_budget_defaults.toArray(),
		pendingStatementIds(),
		db.statements.toArray(),
	])

	return {
		records: allRecords,
		statements,
		allocatedStatementIds: new Set(allocations.map(a => a.statement_id)),
		allocated: tallyAllocations(allocations, pending),
		categories: new Map(categories.map(c => [c.id, c])),
		monthlyBudgets: new Map(monthlyBudgets.map(b => [b.id, b])),
		monthly_budgetRows: monthlyBudgets,
		targets,
		defaults,
		coverages: new Map(coverages.map(c => [c.month, c])),
	}
}

/** MonthlyBudget ids for a pace/breakdown scope, or null for everything. */
export function scopeMonthlyBudgetIds(
	scope: string,
	monthlyBudgets: MonthlyBudgetRow[],
): string[] | null {
	if (scope === "all") return null
	if (scope === "core" || scope === "outlier" || scope === "other") {
		return monthlyBudgets.filter(b => b.group === scope).map(b => b.id)
	}
	return [scope]
}

function inScope(monthly_budgetId: string | null, scopeIds: string[] | null): boolean {
	return scopeIds === null || (monthly_budgetId !== null && scopeIds.includes(monthly_budgetId))
}

function comparisonSummaries(
	date: DateTime,
	today: DateTime,
	isCurrent: boolean,
	tables: LoadedTables,
	scopeIds: string[] | null,
	months = COMPARISON_MONTHS,
) {
	const out = []
	for (let offset = 1; offset <= months; offset++) {
		const month = date.minus({ months: offset }).startOf("month")
		const coverage = tables.coverages.get(month.toFormat("yyyy-MM-dd"))
		const endDay = isCurrent
			? Math.min(today.day ?? 1, month.daysInMonth ?? 28)
			: (month.daysInMonth ?? 28)
		const end = month.set({ day: endDay }).endOf("day")
		const startKey = month.toFormat(ISO_DAY)
		const endKey = end.toFormat(ISO_DAY)
		const rows = tables.records.filter(
			r => inRange(r.datetime, startKey, endKey) && inScope(r.monthly_budget_id, scopeIds),
		)
		const items = toAnalyticsRecords(
			rows,
			tables.allocated,
			tables.categories,
			tables.monthlyBudgets,
		)
		const excluded =
			(coverage?.excluded_from_comparisons ?? false) ||
			(coverage?.coverage ?? null) === "incomplete" ||
			(items.length === 0 && (coverage?.coverage ?? "unknown") !== "complete")
		out.push({
			month: month.toFormat("MMM yyyy"),
			start: month.toFormat("yyyy-MM-dd"),
			included: !excluded,
			reason: coverage?.excluded_from_comparisons
				? "Excluded manually"
				: (coverage?.coverage ?? null) === "incomplete"
					? "Marked incomplete"
					: items.length === 0 && (coverage?.coverage ?? "unknown") !== "complete"
						? "No recorded activity; coverage unknown"
						: (coverage?.coverage ?? "unknown") === "complete"
							? "Complete"
							: "Recorded history; coverage unconfirmed",
			summary: summarize(items),
			items,
		})
	}
	return out
}

function buildCashflowHistory(
	date: DateTime,
	today: DateTime,
	tables: LoadedTables,
	scopeIds: string[] | null,
): CashflowHistoryMonth[] {
	// Full calendar months, ordered oldest first, independent of the comparison-average window.
	return comparisonSummaries(date, today, false, tables, scopeIds)
		.flatMap((month, index) => {
			if (!month.included) return []
			let spending = 0
			let income = 0
			const cumulative = Array.from(
				{ length: DateTime.fromISO(month.start).daysInMonth ?? 30 },
				(_, day) => {
					const entry = month.summary.daily.find(
						item => Number(item.date.slice(-2)) === day + 1,
					)
					spending += entry?.spending ?? 0
					income += entry?.income ?? 0
					return {
						spending: Math.round(spending * 100) / 100,
						surplus: Math.round((income - spending) * 100) / 100,
					}
				},
			)
			return [
				{
					month: month.month,
					offset: index + 1,
					spending: cumulative.map(point => point.spending),
					surplus: cumulative.map(point => point.surplus),
				},
			]
		})
		.reverse()
}

function buildSpendingHistory(
	date: DateTime,
	currentItems: AnalyticsRecord[],
	comparisons: ReturnType<typeof comparisonSummaries>,
): SpendingHistoryMonth[] {
	const buildBreakdown = (items: AnalyticsRecord[]) => {
		const totals = new Map<
			string,
			{ name: string; color: string; cents: number; monthlyBudgets: Record<string, number> }
		>()
		for (const item of items) {
			const category = item.category_parent ?? item.category
			const cents = contribution(item.analytics_treatment, item.amount).spending
			if (!category || cents <= 0) continue
			const value = totals.get(category.id) ?? {
				name: category.name,
				color: category.color,
				cents: 0,
				monthlyBudgets: {},
			}
			value.cents += cents
			const monthly_budget = item.monthly_budget_id ?? "unbudgeted"
			value.monthlyBudgets[monthly_budget] =
				(value.monthlyBudgets[monthly_budget] ?? 0) + cents
			totals.set(category.id, value)
		}
		return {
			categories: [...totals].map(([id, value]) => ({
				id,
				name: value.name,
				color: value.color,
				spending: value.cents / 100,
				monthly_budget_spending: Object.fromEntries(
					Object.entries(value.monthlyBudgets).map(([id, cents]) => [id, cents / 100]),
				),
			})),
		}
	}
	const selected = {
		month: date.toFormat("MMM yyyy"),
		included: true,
		reason: "Selected month",
		current: true,
		...buildBreakdown(currentItems),
	}
	return [
		...comparisons
			.slice()
			.reverse()
			.map(({ items, month, included, reason }) => ({
				month,
				included,
				reason,
				current: false,
				...buildBreakdown(items),
			})),
		selected,
	]
}

export async function getDashboard(input: DashboardInput, preloaded?: LoadedTables) {
	const date = monthStart(input.month, input.year)
	const today = DateTime.now().startOf("day")
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date.startOf("month") > today.startOf("month")
	const actualEnd = isCurrent ? today.endOf("day") : date.endOf("month")

	const tables = preloaded ?? (await loadDashboardTables())
	const actualEndKey = actualEnd.toFormat(ISO_DAY)

	const monthStartDay = date.startOf("month")
	const monthEndDay = date.endOf("month")
	const monthStartKey = monthStartDay.toFormat(ISO_DAY)
	const monthEndKey = monthEndDay.toFormat(ISO_DAY)
	const monthRecords = tables.records.filter(r => inRange(r.datetime, monthStartKey, monthEndKey))
	const analyticsAll = toAnalyticsRecords(
		monthRecords,
		tables.allocated,
		tables.categories,
		tables.monthlyBudgets,
	)

	const actualRecords = isFuture
		? []
		: analyticsAll.filter(r => r.datetime.slice(0, 10) <= actualEndKey)
	const actualIds = new Set(actualRecords.map(r => r.id))
	const futureRecords = analyticsAll.filter(r => !actualIds.has(r.id))

	const summary = summarize(actualRecords)
	const futureSummary = summarize(futureRecords)

	const comparisonMonths = comparisonSummaries(date, today, isCurrent, tables, null)

	const included = comparisonMonths.filter(m => m.included)
	const comparison = buildComparison(summary, included)
	const monthlyBudgetsWithSpending = buildMonthlyBudgets(
		date,
		summary,
		included,
		tables.monthly_budgetRows,
		tables.targets,
		tables.defaults,
	)
	const projection = buildProjection(
		date,
		summary,
		futureSummary,
		monthlyBudgetsWithSpending,
		isCurrent,
		isFuture,
		actualEnd.day ?? 1,
	)
	const series = buildSeries(
		summary,
		futureSummary,
		included,
		date.daysInMonth ?? 30,
		isFuture ? 0 : actualEnd.day,
		projection.daily_spending,
	)
	const categories = buildCategories(summary, included)
	const historyMonths = isCurrent
		? comparisonSummaries(date, today, false, tables, null)
		: comparisonMonths
	const comparisonHistory = buildSpendingHistory(
		date,
		actualRecords,
		comparisonSummaries(date, today, false, tables, null, BREAKDOWN_MONTHS),
	)

	const review = {
		pending_records: monthRecords.filter(r =>
			isPendingRecord(r.amount, tables.allocated.get(r.id)),
		).length,
		pending_statements: tables.statements.filter(
			s => s.is_pending === 1 && inRange(s.datetime, monthStartKey, monthEndKey),
		).length,
		unallocated_statements: tables.statements.filter(
			s =>
				s.is_pending === 0 &&
				inRange(s.datetime, monthStartKey, monthEndKey) &&
				!tables.allocatedStatementIds.has(s.id),
		).length,
	}

	return {
		review,
		month: date.monthLong,
		year: date.year,
		period: {
			is_current: isCurrent,
			is_future: isFuture,
			through: isCurrent ? today.toFormat("yyyy-MM-dd") : null,
			label: isCurrent
				? `Through ${today.toFormat("d MMM")}`
				: isFuture
					? "Future month"
					: "Full month",
		},
		summary,
		comparison,
		comparison_history: comparisonHistory,
		history: buildCashflowHistory(date, today, tables, null),
		series,
		projection,
		monthlyBudgets: monthlyBudgetsWithSpending,
		categories,
		weekday: buildWeekday(
			date,
			isFuture ? 0 : isCurrent ? today.day : (date.daysInMonth ?? 30),
			summary,
			historyMonths.filter(m => m.included),
			actualRecords.filter(r => contribution(r.analytics_treatment, r.amount).spending > 0)
				.length,
		),
		future_records_count: futureRecords.length,
	}
}

export async function getPaceView(
	month: string,
	year: number,
	scope: string,
	preloaded?: LoadedTables,
) {
	const date = monthStart(month, year)
	const today = DateTime.now().startOf("day")
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date.startOf("month") > today.startOf("month")
	const actualEnd = isCurrent ? today.endOf("day") : date.endOf("month")

	const tables = preloaded ?? (await loadDashboardTables())
	const scopeIds = scopeMonthlyBudgetIds(scope, tables.monthly_budgetRows)
	const monthStartKey = date.startOf("month").toFormat(ISO_DAY)
	const monthEndKey = date.endOf("month").toFormat(ISO_DAY)
	const actualEndKey = actualEnd.toFormat(ISO_DAY)

	const monthRecords = tables.records.filter(
		r =>
			inRange(r.datetime, monthStartKey, monthEndKey) &&
			inScope(r.monthly_budget_id, scopeIds),
	)
	const analyticsAll = toAnalyticsRecords(
		monthRecords,
		tables.allocated,
		tables.categories,
		tables.monthlyBudgets,
	)

	const actualRecords = isFuture
		? []
		: analyticsAll.filter(r => r.datetime.slice(0, 10) <= actualEndKey)
	const actualIds = new Set(actualRecords.map(r => r.id))
	const futureRecords = analyticsAll.filter(r => !actualIds.has(r.id))

	const summary = summarize(actualRecords)
	const futureSummary = summarize(futureRecords)
	const comparisonSummariesForPace = comparisonSummaries(date, today, isCurrent, tables, scopeIds)
	const included = comparisonSummariesForPace.filter(m => m.included)

	const scopedMonthlyBudgetRows = scopeIds
		? tables.monthly_budgetRows.filter(b => scopeIds.includes(b.id))
		: tables.monthly_budgetRows
	const monthlyBudgetsBuilt = buildMonthlyBudgets(
		date,
		summary,
		included,
		scopedMonthlyBudgetRows,
		tables.targets,
		tables.defaults,
	)
	const groupScope = scope === "core" || scope === "outlier" || scope === "other"
	const amounts = monthlyBudgetsBuilt.filter(b => b.amount !== null)
	const pace = groupScope
		? {
				id: scope,
				name: scope.charAt(0).toUpperCase() + scope.slice(1),
				amount: amounts.length
					? amounts.reduce((sum, b) => sum + (b.amount ?? 0), 0)
					: null,
				spending: summary.spending,
				pace_kind:
					monthlyBudgetsBuilt.length &&
					monthlyBudgetsBuilt.every(b => b.pace_kind === "daily")
						? "daily"
						: "none",
			}
		: scope === "all"
			? monthlyBudgetsBuilt.find(
					b => b.pace_kind === "daily" && b.amount !== null && b.amount >= 0,
				)
			: monthlyBudgetsBuilt[0]
	const projection = buildProjection(
		date,
		summary,
		futureSummary,
		scope === "all"
			? monthlyBudgetsBuilt
			: pace
				? [{ ...pace, scheduled_spending: futureSummary.spending }]
				: [],
		isCurrent && (scope === "all" || pace?.pace_kind === "daily"),
		isFuture,
		actualEnd.day ?? 1,
	)
	const series = buildSeries(
		summary,
		futureSummary,
		included,
		date.daysInMonth ?? 30,
		isFuture ? 0 : actualEnd.day,
		projection.daily_spending,
	)
	const history = buildCashflowHistory(date, today, tables, scopeIds)
	const highestSpendingDay = summary.daily.reduce<(typeof summary.daily)[number] | null>(
		(highest, day) =>
			day.spending > 0 && (!highest || day.spending > highest.spending) ? day : highest,
		null,
	)

	return {
		series,
		history,
		projection,
		paceMonthlyBudget: pace ? { id: pace.id, name: pace.name, amount: pace.amount } : null,
		spending: Math.round(summary.spending * 100) / 100,
		remaining:
			pace?.amount == null ? null : Math.round((pace.amount - summary.spending) * 100) / 100,
		completedMonth:
			!isCurrent && !isFuture
				? {
						spending: Math.round(summary.spending * 100) / 100,
						spending_per_day:
							Math.round((summary.spending / (date.daysInMonth ?? 30)) * 100) / 100,
						amount: pace?.amount ?? null,
						amount_difference:
							pace?.amount === null || pace?.amount === undefined
								? null
								: Math.round((pace.amount - pace.spending) * 100) / 100,
					}
				: null,
		highestSpendingDay: highestSpendingDay
			? { date: highestSpendingDay.date, spending: highestSpendingDay.spending }
			: null,
	}
}

export async function getMonthlyBudgetDaily(
	month: string,
	year: number,
	preloaded?: LoadedTables,
): Promise<{
	rows: Record<string, number | null>[]
	monthlyBudgets: { id: string; name: string; color: string }[]
}> {
	const date = monthStart(month, year)
	const today = DateTime.now().startOf("day")
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date.startOf("month") > today.startOf("month")
	const daysInMonth = date.daysInMonth ?? 30
	const elapsed = isFuture ? 0 : isCurrent ? (today.day ?? daysInMonth) : daysInMonth

	const tables = preloaded ?? (await loadDashboardTables())
	const monthKey = date.toFormat("yyyy-MM")
	const active = tables.monthly_budgetRows
	const spent = new Map<string, number>()
	const unbudgeted = new Map<number, number>()
	for (const record of tables.records) {
		const day = Number(record.datetime.slice(8, 10))
		if (record.datetime.slice(0, 7) !== monthKey || day > elapsed) continue
		const outflow = contribution(record.analytics_treatment, record.amount).spending / 100
		if (outflow === 0) continue
		if (record.monthly_budget_id) {
			spent.set(
				record.monthly_budget_id,
				(spent.get(record.monthly_budget_id) ?? 0) + outflow,
			)
			const key = `${record.monthly_budget_id}|${day}`
			spent.set(key, (spent.get(key) ?? 0) + outflow)
		} else {
			unbudgeted.set(day, (unbudgeted.get(day) ?? 0) + outflow)
		}
	}

	const monthlyBudgets = active
		.filter(b => spent.has(b.id))
		.map(b => ({ id: b.id, name: b.name, color: b.color }))
	if (unbudgeted.size > 0) {
		monthlyBudgets.push({ id: "unbudgeted", name: "Unbudgeted", color: "#94a3b8" })
	}

	const rows = Array.from({ length: Math.max(daysInMonth, 1) }, (_, i) => {
		const day = i + 1
		const point: Record<string, number | null> = { day }
		for (const monthly_budget of monthlyBudgets) {
			point[monthly_budget.id] =
				day > elapsed
					? null
					: Math.round(
							(monthly_budget.id === "unbudgeted"
								? (unbudgeted.get(day) ?? 0)
								: (spent.get(`${monthly_budget.id}|${day}`) ?? 0)) * 100,
						) / 100
		}
		return point
	})

	return { rows, monthlyBudgets }
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

function weekdayOf(dateString: string): string {
	// summary.daily dates are "yyyy-MM-dd"; luxon weekday: 1 = Monday.
	const weekday = DateTime.fromFormat(dateString, "yyyy-MM-dd").weekday ?? 1
	return WEEKDAYS[weekday - 1] ?? "Mon"
}

function buildWeekday(
	date: DateTime,
	daysInMonth: number,
	summary: ReturnType<typeof summarize>,
	included: ReturnType<typeof comparisonSummaries>,
	spendingRecords: number,
) {
	function occurrences(start: DateTime, days: number, weekday: number) {
		const first = ((weekday - start.weekday + 7) % 7) + 1
		return first > days ? 0 : Math.floor((days - first) / 7) + 1
	}

	const stats = WEEKDAYS.map((name, index) => {
		const days = occurrences(date, daysInMonth, index + 1)
		const spending = summary.daily
			.filter(d => weekdayOf(d.date) === name)
			.reduce((sum, d) => sum + d.spending, 0)
		const baselineDays = included.reduce((sum, m) => {
			const start = DateTime.fromISO(m.start)
			return sum + occurrences(start, start.daysInMonth ?? 30, index + 1)
		}, 0)
		const baseline = included.reduce(
			(sum, m) =>
				sum +
				m.summary.daily
					.filter(d => weekdayOf(d.date) === name)
					.reduce((total, d) => total + d.spending, 0),
			0,
		)
		return {
			day: name,
			spending: days ? Math.round((spending / days) * 100) / 100 : null,
			baseline: baselineDays ? Math.round((baseline / baselineDays) * 100) / 100 : null,
			days,
			baseline_days: baselineDays,
		}
	})

	// Only reported with enough observations and a meaningful (>= 15%) gap.
	const observed = Array.from({ length: daysInMonth }, (_, i) => {
		const day = date.plus({ days: i })
		return {
			weekend: day.weekday >= 6,
			spending: summary.daily.find(d => d.date === day.toFormat(ISO_DAY))?.spending ?? 0,
		}
	})
	const weekends = observed.filter(d => d.weekend)
	const weekdays = observed.filter(d => !d.weekend)
	const average = (days: typeof observed) =>
		days.reduce((sum, d) => sum + d.spending, 0) / days.length
	let weekend: { weekend_average: number; weekday_average: number } | null = null
	if (weekends.length >= 4 && weekdays.length >= 10 && spendingRecords >= 8) {
		const weekendAverage = average(weekends)
		const weekdayAverage = average(weekdays)
		if (
			Math.abs(weekendAverage - weekdayAverage) >=
			0.15 * Math.max(weekendAverage, weekdayAverage)
		)
			weekend = {
				weekend_average: Math.round(weekendAverage * 100) / 100,
				weekday_average: Math.round(weekdayAverage * 100) / 100,
			}
	}

	return { stats, comparison_count: included.length, weekend }
}

function avg(values: (number | null)[]): number | null {
	const defined = values.filter((v): v is number => v !== null && v !== undefined)
	if (!defined.length) return null
	return defined.reduce((a, b) => a + b, 0) / defined.length
}

function buildComparison(
	summary: ReturnType<typeof summarize>,
	included: { summary: ReturnType<typeof summarize> }[],
) {
	const result = { count: included.length } as { count: number } & Record<
		"income" | "spending" | "surplus" | "surplus_rate",
		{ average: number | null; difference: number | null }
	>
	for (const field of ["income", "spending", "surplus", "surplus_rate"] as const) {
		const average = avg(included.map(m => m.summary[field] as number | null))
		result[field] = {
			average,
			difference: average === null ? null : (summary[field] as number) - average,
		}
	}
	if (included.length) {
		const meanIncome = avg(included.map(m => m.summary.income))
		const meanSpending = avg(included.map(m => m.summary.spending))
		const rate =
			meanIncome && meanIncome > 0
				? ((meanIncome - (meanSpending ?? 0)) / meanIncome) * 100
				: null
		const current = summary.surplus_rate
		;(result.surplus_rate as { average: number | null; difference: number | null }).average =
			rate
		;(result.surplus_rate as { average: number | null; difference: number | null }).difference =
			current !== null && rate !== null ? current - rate : null
	}
	return result
}

function buildSeries(
	summary: ReturnType<typeof summarize>,
	futureSummary: ReturnType<typeof summarize>,
	included: { summary: ReturnType<typeof summarize> }[],
	days: number,
	actualDays: number,
	projectedDailySpending: number | null,
) {
	let income = 0
	let spending = 0
	const comparisonCumulative: Record<number, number> = {}
	for (let d = 1; d <= days; d++) comparisonCumulative[d] = 0
	for (const month of included) {
		let monthTotal = 0
		for (let day = 1; day <= days; day++) {
			const entry = month.summary.daily.find(item => Number(item.date.slice(-2)) === day)
			monthTotal += entry?.spending ?? 0
			comparisonCumulative[day] = (comparisonCumulative[day] ?? 0) + monthTotal
		}
	}
	let projectedSpending = summary.spending
	return Array.from({ length: days }, (_, i) => {
		const day = i + 1
		const isActual = day <= actualDays
		if (isActual) {
			const entry = summary.daily.find(item => Number(item.date.slice(-2)) === day)
			income += entry?.income ?? 0
			spending += entry?.spending ?? 0
		}
		if (!isActual && projectedDailySpending !== null) {
			const entry = futureSummary.daily.find(item => Number(item.date.slice(-2)) === day)
			projectedSpending += projectedDailySpending + (entry?.spending ?? 0)
		}
		return {
			day,
			income: isActual ? Math.round(income * 100) / 100 : null,
			spending: isActual ? Math.round(spending * 100) / 100 : null,
			projected_spending:
				projectedDailySpending !== null && day >= actualDays
					? Math.round(projectedSpending * 100) / 100
					: null,
			surplus: isActual ? Math.round((income - spending) * 100) / 100 : null,
			average_spending:
				!included.length || !isActual
					? null
					: Math.round(((comparisonCumulative[day] ?? 0) / included.length) * 100) / 100,
		}
	})
}

function buildProjection(
	date: DateTime,
	summary: ReturnType<typeof summarize>,
	futureSummary: ReturnType<typeof summarize>,
	monthlyBudgets: {
		pace_kind: string
		amount: number | null
		spending: number
		id: string
		name: string
		scheduled_spending?: number
	}[],
	isCurrent: boolean,
	isFuture: boolean,
	elapsedDays: number,
) {
	if (!isCurrent || isFuture || elapsedDays < 1) {
		return {
			available: false,
			daily_spending: null,
			projected_spending: null,
			scheduled_spending: 0,
			remaining_days: 0,
			monthly_budget: null,
		}
	}
	const remainingDays = Math.max((date.daysInMonth ?? 30) - elapsedDays, 0)
	const dailySpending = summary.gross_spending / elapsedDays
	const paceMonthlyBudget = monthlyBudgets.find(
		b => b.pace_kind === "daily" && b.amount !== null && b.amount >= 0,
	)
	const paceTarget = paceMonthlyBudget?.amount ?? null
	const futureMonthlyBudgets = new Map(futureSummary.monthlyBudgets.map(b => [b.id, b]))
	const scheduledMonthlyBudgetSpending = paceMonthlyBudget
		? (paceMonthlyBudget.scheduled_spending ??
			Number(futureMonthlyBudgets.get(paceMonthlyBudget.id)?.spending ?? 0))
		: 0
	return {
		available: true,
		daily_spending: Math.round(dailySpending * 100) / 100,
		projected_spending:
			Math.round(
				(summary.spending + futureSummary.spending + dailySpending * remainingDays) * 100,
			) / 100,
		scheduled_spending: Math.round(futureSummary.spending * 100) / 100,
		remaining_days: remainingDays,
		monthly_budget:
			paceMonthlyBudget && paceTarget !== null
				? {
						id: paceMonthlyBudget.id,
						name: paceMonthlyBudget.name,
						remaining:
							paceTarget -
							paceMonthlyBudget.spending -
							scheduledMonthlyBudgetSpending,
						spent: paceMonthlyBudget.spending,
						amount: paceTarget,
						projected:
							Math.round(
								(paceMonthlyBudget.spending +
									scheduledMonthlyBudgetSpending +
									(paceMonthlyBudget.spending / elapsedDays) * remainingDays) *
									100,
							) / 100,
						usage_pace:
							Math.round((paceMonthlyBudget.spending / elapsedDays) * 100) / 100,
						target_pace:
							Math.round((paceTarget / (date.daysInMonth ?? 30)) * 100) / 100,
						recommended_pace: remainingDays
							? Math.round(
									Math.max(
										(paceTarget -
											paceMonthlyBudget.spending -
											scheduledMonthlyBudgetSpending) /
											remainingDays,
										0,
									) * 100,
								) / 100
							: null,
					}
				: null,
	}
}

function buildMonthlyBudgets(
	date: DateTime,
	summary: ReturnType<typeof summarize>,
	included: { summary: ReturnType<typeof summarize> }[],
	monthly_budgetRows: MonthlyBudgetRow[],
	targets: MonthlyBudgetAmountRow[],
	defaults: MonthlyBudgetDefaultRow[],
) {
	const current = new Map(summary.monthlyBudgets.map(b => [b.id, b]))
	const baseline = new Map<string, number>()
	for (const month of included) {
		for (const monthly_budget of month.summary.monthlyBudgets) {
			baseline.set(
				monthly_budget.id,
				(baseline.get(monthly_budget.id) ?? 0) + monthly_budget.spending,
			)
		}
	}
	for (const [id, total] of baseline) baseline.set(id, total / Math.max(included.length, 1))

	const monthKey = date.toFormat("yyyy-MM-dd")
	const monthlyBudgets = monthly_budgetRows
		.filter(b => !b.archived || current.has(b.id))
		.sort((a, b) => a.display_order - b.display_order)
	const out = []
	for (const monthly_budget of monthlyBudgets) {
		const override = targets.find(
			t => t.monthly_budget_id === monthly_budget.id && t.month === monthKey,
		)
		let amount = override ? override.amount : null
		if (amount === undefined) amount = null
		if (override === undefined) {
			const eligible = defaults
				.filter(
					d => d.monthly_budget_id === monthly_budget.id && d.effective_month <= monthKey,
				)
				.sort((a, b) => (a.effective_month < b.effective_month ? 1 : -1))
			amount = eligible[0]?.amount ?? null
		}
		const spending = Number(current.get(monthly_budget.id)?.spending ?? 0)
		out.push({
			...monthly_budget,
			spending,
			default_amount:
				defaults
					.filter(
						d =>
							d.monthly_budget_id === monthly_budget.id &&
							d.effective_month <= monthKey,
					)
					.sort((a, b) => b.effective_month.localeCompare(a.effective_month))[0]
					?.amount ?? null,
			amount: amount === null || amount === undefined ? null : Number(amount),
			remaining: amount === null || amount === undefined ? null : Number(amount) - spending,
			comparison: baseline.has(monthly_budget.id)
				? spending - (baseline.get(monthly_budget.id) ?? 0)
				: null,
		})
	}
	return out
}

function buildCategories(
	summary: ReturnType<typeof summarize>,
	included: {
		summary: {
			categories: {
				id: string
				name: string
				icon: string
				color: string
				spending: number
				records: number
				monthly_budget_spending: Record<string, number>
			}[]
		}
	}[],
) {
	const current = new Map(summary.categories.map(c => [c.id, c]))
	const baselineGroups = new Map<string, typeof summary.categories>()
	for (const month of included) {
		for (const cat of month.summary.categories) {
			const list = baselineGroups.get(cat.id) ?? []
			list.push(cat as (typeof summary.categories)[number])
			baselineGroups.set(cat.id, list)
		}
	}
	const baseline = new Map<string, number>()
	const baselineMonthlyBudgets = new Map<string, Record<string, number>>()
	for (const [id, items] of baselineGroups) {
		baseline.set(id, items.reduce((s, i) => s + i.spending, 0) / Math.max(included.length, 1))
		const monthly_budgetIds = new Set(
			items.flatMap(i => Object.keys(i.monthly_budget_spending)),
		)
		const perMonthlyBudget: Record<string, number> = {}
		for (const monthly_budgetId of monthly_budgetIds) {
			perMonthlyBudget[monthly_budgetId] =
				items.reduce((s, i) => s + (i.monthly_budget_spending[monthly_budgetId] ?? 0), 0) /
				Math.max(included.length, 1)
		}
		baselineMonthlyBudgets.set(id, perMonthlyBudget)
	}
	const ids = new Set([...current.keys(), ...baselineGroups.keys()])
	return [...ids].map(id => {
		const fallback = baselineGroups.get(id)?.[0]
		const category = current.get(id) ?? {
			id,
			name: fallback?.name ?? id,
			icon: fallback?.icon ?? "circle-question-mark",
			color: fallback?.color ?? "#9E9E9E",
			spending: 0,
			outflow: 0,
			refunds: 0,
			records: 0,
			monthly_budget_spending: {},
			monthly_budget_outflow: {},
			monthly_budget_refunds: {},
			monthly_budget_records: {},
		}
		return {
			...category,
			share:
				summary.gross_spending > 0
					? (category.outflow / summary.gross_spending) * 100
					: null,
			comparison: baseline.has(id) ? category.spending - (baseline.get(id) ?? 0) : null,
			baseline_monthly_budget_spending: baselineMonthlyBudgets.get(id) ?? {},
		}
	})
}

export { expandCategoryIdsForMonthly }

export type TrendMonth = {
	key: string
	label: string
	income: number
	spending: number
	surplus: number
	current: boolean
	partial: boolean
}

/**
 * Income vs spending for the selected month and the two months before it (the same
 * window the comparison text averages over). While the
 * selected month is still running, every month is cut at the same day of the month, so the
 * sparkline compares like with like (as the comparison text does) instead of ending in a cliff.
 */
function buildTrend(date: DateTime, today: DateTime, tables: LoadedTables) {
	const byMonth = new Map<string, RecordRow[]>()
	for (const record of tables.records) {
		const key = record.datetime.slice(0, 7)
		const list = byMonth.get(key)
		if (list) list.push(record)
		else byMonth.set(key, [record])
	}
	const todayKey = today.toFormat(ISO_DAY)
	const toDate = date.hasSame(today, "month")
	const months: TrendMonth[] = []
	for (let offset = COMPARISON_MONTHS; offset >= 0; offset--) {
		const month = date.minus({ months: offset }).startOf("month")
		if (month > today) continue
		const key = month.toFormat("yyyy-MM")
		const partial = month.hasSame(today, "month")
		const cutoff = toDate
			? month.set({ day: Math.min(today.day, month.daysInMonth ?? 28) }).toFormat(ISO_DAY)
			: partial
				? todayKey
				: null
		const rows = (byMonth.get(key) ?? []).filter(
			r => cutoff === null || r.datetime.slice(0, 10) <= cutoff,
		)
		const summary = summarize(
			toAnalyticsRecords(rows, tables.allocated, tables.categories, tables.monthlyBudgets),
		)
		months.push({
			key,
			label: month.toFormat("MMM yy"),
			income: summary.income,
			spending: summary.spending,
			surplus: summary.surplus,
			current: month.hasSame(date, "month"),
			partial,
		})
	}
	// Months before the first Record are not "zero" months, just untracked.
	const first = months.findIndex(month => byMonth.has(month.key))
	return first === -1 ? [] : months.slice(first)
}

/**
 * Everything the Overview tab renders, read from one table load. The page used
 * to run three live queries that each scanned every table on every change.
 */
export async function getDashboardView(input: DashboardInput & { scope?: string }) {
	const tables = await loadDashboardTables()
	const dashboard = await getDashboard(input, tables)
	const dailyMonthlyBudget =
		dashboard.monthlyBudgets.find(monthly_budget => monthly_budget.pace_kind === "daily") ??
		dashboard.monthlyBudgets.find(
			monthly_budget => monthly_budget.name.toLowerCase() === "daily",
		) ??
		null
	const scope =
		input.scope &&
		(input.scope === "core" ||
			input.scope === "outlier" ||
			input.scope === "other" ||
			dashboard.monthlyBudgets.some(b => b.id === input.scope))
			? input.scope
			: "all"
	const [pace, monthlyBudgetDaily] = await Promise.all([
		getPaceView(
			input.month,
			input.year,
			scope === "all" ? (dailyMonthlyBudget?.id ?? "all") : scope,
			tables,
		),
		getMonthlyBudgetDaily(input.month, input.year, tables),
	])
	const date = monthStart(input.month, input.year)
	const trend = buildTrend(date, DateTime.now().startOf("day"), tables)
	return {
		dashboard,
		pace,
		monthlyBudgetDaily,
		dailyMonthlyBudgetId: dailyMonthlyBudget?.id ?? null,
		trend,
	}
}
