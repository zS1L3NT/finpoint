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
import { formatCurrency, pluralize } from "@/lib/utils"
import { type AnalyticsRecord, contribution, summarize } from "@/logic/analytics"
import { defaultAmountFor } from "@/logic/monthly-budgets"
import { expandCategoryIdsForMonthly } from "@/logic/monthly-shared"
import {
	type AllocationTally,
	isPendingRecord,
	pendingStatementIds,
	tallyAllocations,
} from "@/logic/pending"
import { resolveRecordChoices } from "@/logic/record-choices"

import { pathAllocator, pathRecords, pathStatements } from "@/routes"

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
	rows: RecordRow[],
	allocatedByRecord: Map<string, AllocationTally>,
	categories: Map<string, CategoryRow>,
	monthlyBudgets: Map<string, MonthlyBudgetRow>,
): AnalyticsRecord[] {
	const items: (AnalyticsRecord | null)[] = rows.map(stored => {
		const row = resolveRecordChoices(stored, categories.get(stored.category_id))
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
	records: ReturnType<typeof resolveRecordChoices>[]
	statements: StatementRow[]
	allocatedStatementIds: Set<string>
	allocated: Map<string, AllocationTally>
	categories: Map<string, CategoryRow>
	monthlyBudgets: Map<string, MonthlyBudgetRow>
	monthlyBudgetRows: MonthlyBudgetRow[]
	amounts: MonthlyBudgetAmountRow[]
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
		amounts,
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
		records: allRecords.map(r =>
			resolveRecordChoices(
				r,
				categories.find(c => c.id === r.category_id),
			),
		),
		statements,
		allocatedStatementIds: new Set(allocations.map(a => a.statement_id)),
		allocated: tallyAllocations(allocations, pending),
		categories: new Map(categories.map(c => [c.id, c])),
		monthlyBudgets: new Map(monthlyBudgets.map(b => [b.id, b])),
		monthlyBudgetRows: monthlyBudgets,
		amounts,
		defaults,
		coverages: new Map(coverages.map(c => [c.month, c])),
	}
}

/** MonthlyBudget ids for a pace/breakdown scope, or null for everything. */
export function scopeMonthlyBudgetIds(scope: string): string[] | null {
	if (scope === "all") return null
	return [scope]
}

function inScope(monthlyBudgetId: string | null, scopeIds: string[] | null): boolean {
	return scopeIds === null || (monthlyBudgetId !== null && scopeIds.includes(monthlyBudgetId))
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

export type RecordMonth = { month: string; year: number }

/**
 * Most recent month before the given one holding at least one Record, or null
 * when no earlier month has any. Powers the empty-month "Go to <month>" notice.
 */
export async function findLatestRecordMonth(input: DashboardInput): Promise<RecordMonth | null> {
	const start = monthStart(input.month, input.year)

	const latest = await db.records
		.where("datetime")
		.below(start.toFormat("yyyy-MM-dd HH:mm"))
		.reverse()
		.first()
	if (!latest) return null

	const date = DateTime.fromFormat(latest.datetime.slice(0, 7), "yyyy-MM")
	return { month: date.monthLong ?? input.month, year: date.year }
}

export async function getDashboard(
	input: DashboardInput & { scope?: string },
	preloaded?: LoadedTables,
) {
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
		tables.monthlyBudgetRows,
		tables.amounts,
		tables.defaults,
		input.scope,
	)
	const projection = buildProjection(
		date,
		summary,
		futureSummary,
		monthlyBudgetsWithSpending,
		isCurrent,
		isFuture,
		actualEnd.day ?? 1,
		comparisonSummaries(date, today, false, tables, null),
		actualRecords,
	)
	const categories = buildCategories(summary, included)
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
		comparison_months: included.map(m => m.month),
		projection,
		spendingTotals: {
			budgeted:
				Math.round(
					monthlyBudgetsWithSpending.reduce((sum, b) => sum + b.spending, 0) * 100,
				) / 100,
			unbudgeted:
				Math.round(
					summary.categories.reduce(
						(sum, c) => sum + (c.monthly_budget_spending.unbudgeted ?? 0),
						0,
					) * 100,
				) / 100,
		},
		monthlyBudgets: monthlyBudgetsWithSpending,
		categories,
		future_records_count: futureRecords.length,
		record_count: monthRecords.length,
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
	const scopeIds = scopeMonthlyBudgetIds(scope)
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
		? tables.monthlyBudgetRows.filter(b => scopeIds.includes(b.id))
		: tables.monthlyBudgetRows
	const monthlyBudgetsBuilt = buildMonthlyBudgets(
		date,
		summary,
		included,
		scopedMonthlyBudgetRows,
		tables.amounts,
		tables.defaults,
		scope,
	)
	const amounts = monthlyBudgetsBuilt.filter(b => b.amount !== null)
	const pace =
		scope === "all"
			? {
					id: scope,
					name: "Total",
					amount: amounts.length
						? amounts.reduce((sum, b) => sum + (b.amount ?? 0), 0)
						: null,
					spending: summary.spending,
				}
			: monthlyBudgetsBuilt.find(b => b.amount !== null && b.amount >= 0)
	const forecastComparisons = comparisonSummaries(date, today, false, tables, scopeIds)
	const projection = buildProjection(
		date,
		summary,
		futureSummary,
		pace ? [{ ...pace, scheduled_spending: futureSummary.spending }] : [],
		isCurrent,
		isFuture,
		actualEnd.day ?? 1,
		forecastComparisons,
		actualRecords,
	)

	const series = buildSeries(
		summary,
		futureSummary,
		included,
		date.daysInMonth ?? 30,
		isFuture ? 0 : actualEnd.day,
		projection.daily_spending,
	)
	const daily = await getMonthlyBudgetDaily(month, year, tables)
	const budgets = daily.monthlyBudgets.filter(b =>
		inScope(b.id === "unbudgeted" ? null : b.id, scopeIds),
	)
	for (const budget of scopedMonthlyBudgetRows) {
		if (
			!budgets.some(b => b.id === budget.id) &&
			(monthlyBudgetsBuilt.some(b => b.id === budget.id && b.amount !== null) ||
				futureRecords.some(
					r =>
						r.monthly_budget_id === budget.id &&
						contribution(r.analytics_treatment, r.amount).spending !== 0,
				))
		) {
			budgets.push({ id: budget.id, name: budget.name, color: budget.color })
		}
	}
	if (
		scopeIds === null &&
		!budgets.some(b => b.id === "unbudgeted") &&
		futureRecords.some(
			r =>
				!r.monthly_budget_id &&
				contribution(r.analytics_treatment, r.amount).spending !== 0,
		)
	) {
		budgets.push({ id: "unbudgeted", name: "Unbudgeted", color: "#94a3b8" })
	}
	budgets.sort(
		(a, b) =>
			(tables.monthlyBudgets.get(a.id)?.display_order ?? Infinity) -
			(tables.monthlyBudgets.get(b.id)?.display_order ?? Infinity),
	)
	const forecast = budgets.map(budget => {
		const matches = (r: AnalyticsRecord) => (r.monthly_budget_id ?? "unbudgeted") === budget.id
		const actual = summarize(actualRecords.filter(matches))
		const future = summarize(futureRecords.filter(matches))
		const projected = buildProjection(
			date,
			actual,
			future,
			[],
			isCurrent,
			isFuture,
			actualEnd.day,
			forecastComparisons.map(month => ({
				...month,
				items: month.items.filter(matches),
				summary: summarize(month.items.filter(matches)),
			})),
			actualRecords.filter(matches),
		)
		return {
			...budget,
			previous:
				scope !== "all"
					? buildCashflowHistory(date, today, tables, [budget.id]).find(
							item => item.offset === 1,
						)
					: undefined,
			points: buildSeries(
				actual,
				future,
				[],
				date.daysInMonth ?? 30,
				isFuture ? 0 : actualEnd.day,
				projected.daily_spending,
			),
		}
	})

	if (scope === "all") {
		forecast.unshift({
			id: "total",
			name: "Total",
			color: "var(--foreground)",
			previous: buildCashflowHistory(date, today, tables, scopeIds).find(
				item => item.offset === 1,
			),
			points: series.map((point, index) => ({
				...point,
				spending:
					point.spending === null
						? null
						: forecast.reduce((sum, b) => sum + (b.points[index]?.spending ?? 0), 0),
				projected_spending: point.projected_spending,
			})),
		})
	}

	const highestSpendingDay = summary.daily.reduce<(typeof summary.daily)[number] | null>(
		(highest, day) =>
			day.spending > 0 && (!highest || day.spending > highest.spending) ? day : highest,
		null,
	)

	return {
		forecast,
		singleBudget: scope !== "all",
		series,
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
	const active = tables.monthlyBudgetRows
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
		amount: number | null
		spending: number
		id: string
		name: string
		scheduled_spending?: number
	}[],
	isCurrent: boolean,
	isFuture: boolean,
	elapsedDays: number,
	comparisons: ReturnType<typeof comparisonSummaries>,
	actualItems: AnalyticsRecord[],
) {
	if (!isCurrent || isFuture || elapsedDays < 1) {
		return {
			available: false,
			history_remaining: null,
			daily_spending: null,
			projected_spending: null,
			scheduled_spending: 0,
			remaining_days: 0,
			monthly_budget: null,
		}
	}
	const remainingDays = Math.max((date.daysInMonth ?? 30) - elapsedDays, 0)
	const included = comparisons.filter(month => month.included)
	const remainingSpending = (actual: ReturnType<typeof summarize>, budgetId?: string) => {
		if (budgetId === "all") budgetId = undefined
		if (included.length)
			return (
				included.reduce((sum, month) => {
					const days = DateTime.fromISO(month.start).daysInMonth ?? 30
					const cutoff = Math.min(elapsedDays, days)
					const daily = budgetId
						? summarize(month.items.filter(r => r.monthly_budget_id === budgetId)).daily
						: month.summary.daily
					const remaining = daily
						.filter(day => Number(day.date.slice(-2)) > cutoff)
						.reduce((total, day) => total + day.spending, 0)
					return sum + (days > cutoff ? (remaining * remainingDays) / (days - cutoff) : 0)
				}, 0) / included.length
			)
		const days = Array.from({ length: elapsedDays }, (_, day) =>
			Math.max(
				actual.daily.find(row => Number(row.date.slice(-2)) === day + 1)?.spending ?? 0,
				0,
			),
		).sort((a, b) => a - b)
		const middle = Math.floor(days.length / 2)
		return (
			(days.length % 2
				? (days[middle] ?? 0)
				: ((days[middle - 1] ?? 0) + (days[middle] ?? 0)) / 2) * remainingDays
		)
	}
	const remaining = remainingSpending(summary)
	const dailySpending = remainingDays ? remaining / remainingDays : 0
	const paceMonthlyBudget = monthlyBudgets.find(b => b.amount !== null && b.amount >= 0)
	const paceAmount = paceMonthlyBudget?.amount ?? null
	const futureMonthlyBudgets = new Map(futureSummary.monthlyBudgets.map(b => [b.id, b]))
	const scheduledMonthlyBudgetSpending = paceMonthlyBudget
		? (paceMonthlyBudget.scheduled_spending ??
			Number(futureMonthlyBudgets.get(paceMonthlyBudget.id)?.spending ?? 0))
		: 0
	return {
		available: true,
		history_remaining: included.length ? Math.round(remaining * 100) / 100 : null,
		daily_spending: dailySpending,
		projected_spending:
			Math.round(
				(summary.spending + futureSummary.spending + dailySpending * remainingDays) * 100,
			) / 100,
		scheduled_spending: Math.round(futureSummary.spending * 100) / 100,
		remaining_days: remainingDays,
		monthly_budget:
			paceMonthlyBudget && paceAmount !== null
				? {
						id: paceMonthlyBudget.id,
						name: paceMonthlyBudget.name,
						remaining:
							paceAmount -
							paceMonthlyBudget.spending -
							scheduledMonthlyBudgetSpending,
						spent: paceMonthlyBudget.spending,
						amount: paceAmount,
						projected:
							Math.round(
								(paceMonthlyBudget.spending +
									scheduledMonthlyBudgetSpending +
									remainingSpending(
										paceMonthlyBudget.id === "all"
											? summary
											: summarize(
													actualItems.filter(
														r =>
															r.monthly_budget_id ===
															paceMonthlyBudget.id,
													),
												),
										paceMonthlyBudget.id,
									)) *
									100,
							) / 100,
						usage_pace:
							Math.round((paceMonthlyBudget.spending / elapsedDays) * 100) / 100,
						amount_pace:
							Math.round((paceAmount / (date.daysInMonth ?? 30)) * 100) / 100,
						recommended_pace: remainingDays
							? Math.round(
									Math.max(
										(paceAmount -
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
	monthlyBudgetRows: MonthlyBudgetRow[],
	amounts: MonthlyBudgetAmountRow[],
	defaults: MonthlyBudgetDefaultRow[],
	selectedId?: string,
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
	const monthlyBudgets = monthlyBudgetRows
		.filter(b => !b.archived || current.has(b.id) || b.id === selectedId)
		.sort((a, b) => a.display_order - b.display_order)
	const out = []
	for (const monthly_budget of monthlyBudgets) {
		const override = amounts.find(
			t => t.monthly_budget_id === monthly_budget.id && t.month === monthKey,
		)
		const amount = override
			? override.amount
			: defaultAmountFor(defaults, monthly_budget.id, monthKey)
		const spending = Number(current.get(monthly_budget.id)?.spending ?? 0)
		out.push({
			...monthly_budget,
			spending,
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
		const monthlyBudgetIds = new Set(items.flatMap(i => Object.keys(i.monthly_budget_spending)))
		const perMonthlyBudget: Record<string, number> = {}
		for (const monthlyBudgetId of monthlyBudgetIds) {
			perMonthlyBudget[monthlyBudgetId] =
				items.reduce((s, i) => s + (i.monthly_budget_spending[monthlyBudgetId] ?? 0), 0) /
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
	const byMonth = new Map<string, ReturnType<typeof resolveRecordChoices>[]>()
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
	const scope = input.scope && tables.monthlyBudgets.has(input.scope) ? input.scope : "all"
	const selectedBudget = tables.monthlyBudgets.get(scope)
	const scopedBudgetIds = scopeMonthlyBudgetIds(scope)
	const scopeLabel = scope === "all" ? "All budgets" : (selectedBudget?.name ?? "Monthly budget")
	const scopeFilters = {
		monthly_budget_id: selectedBudget?.id,
	}
	const scoped =
		scope === "all"
			? dashboard
			: await getDashboard(input, {
					...tables,
					records: tables.records.filter(r =>
						inScope(r.monthly_budget_id, scopedBudgetIds),
					),
				})

	const pace = await getPaceView(input.month, input.year, scope, tables)

	const date = monthStart(input.month, input.year)
	const trend = buildTrend(date, DateTime.now().startOf("day"), tables)

	const incomeMonths = new Map<string, { amount: number; day: number }>()
	for (const r of toAnalyticsRecords(
		tables.records,
		tables.allocated,
		tables.categories,
		tables.monthlyBudgets,
	)) {
		if (r.datetime.slice(0, 10) >= date.toFormat(ISO_DAY)) continue
		const income = contribution(r.analytics_treatment, r.amount).income / 100
		if (income <= 0) continue
		const key = r.datetime.slice(0, 7)
		const previous = incomeMonths.get(key)
		incomeMonths.set(key, {
			amount: (previous?.amount ?? 0) + income,
			day: Math.max(previous?.day ?? 1, Number(r.datetime.slice(8, 10))),
		})
	}
	const incomeHistory = incomeMonths.size
		? {
				amount:
					[...incomeMonths.values()].reduce((sum, m) => sum + m.amount, 0) /
					incomeMonths.size,
				day: Math.round(
					[...incomeMonths.values()].reduce((sum, m) => sum + m.day, 0) /
						incomeMonths.size,
				),
			}
		: null
	return {
		incomeHistory,
		headline: buildHeadline(
			pace.spending,
			pace.paceMonthlyBudget?.amount ?? null,
			scoped.categories,
			input.month,
			dashboard.period.is_current
				? Math.max(0, (date.daysInMonth ?? 30) - DateTime.now().day)
				: 0,
			dashboard.period.is_future,
			dashboard.record_count === 0 &&
				!dashboard.period.is_current &&
				!dashboard.period.is_future
				? input.year
				: undefined,
		),
		dashboard,
		pace,
		trend,
		scope,
		scopedBudgetIds,
		scopedCategories: scoped.categories,
		scopedComparisonCount: scoped.comparison.count,
		scopedComparisonMonths: scoped.comparison_months,
		scopedDaily: scoped.summary.daily,
		scopeLabel,
		scopeColor: selectedBudget?.color,
		scopeFilters,
		paceFilters: scopeFilters,
	}
}

export function buildHeadline(
	spent: number,
	plan: number | null,
	categories: { name: string; share: number | null }[],
	month: string,
	days: number,
	future: boolean,
	emptyYear?: number,
) {
	if (emptyYear !== undefined) return `No Records in ${month} ${emptyYear}.`
	if (future)
		return plan === null
			? `Set your ${month} plan below.`
			: `Your ${month} plan is ${formatCurrency(plan)}.`
	const majority = categories.find(c => (c.share ?? 0) >= 50)
	return [
		`You've spent ${formatCurrency(spent)}${plan === null ? "" : ` of your ${formatCurrency(plan)} plan`}.`,
		majority && spent > 0 ? `${majority.name} is most of it.` : "",
		days > 0
			? `${days} ${days === 1 ? "day" : "days"} left.`
			: plan === null
				? `${month} is complete.`
				: `${month} closed ${formatCurrency(Math.abs(plan - spent))} ${spent > plan ? "over" : "under"} plan.`,
	]
		.filter(Boolean)
		.join(" ")
}

export function buildAttention(
	data: Awaited<ReturnType<typeof getDashboard>>,
	month: string,
	year: number,
) {
	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
	const range = {
		start_date: date.startOf("month").toISODate() ?? "",
		end_date: date.endOf("month").toISODate() ?? "",
	}
	const rows = [
		...data.monthlyBudgets
			.filter(b => b.remaining !== null && b.remaining < 0)
			.map(b => ({
				label: `${b.name}: ${formatCurrency(-(b.remaining ?? 0))} over plan`,
				detail: "Review the Records behind this Monthly Budget.",
				icon: "lucide:triangle-alert",
				selection: { kind: "budget", value: b.id } as const,
				href: undefined as string | undefined,
			})),
		...(data.review.unallocated_statements
			? [
					{
						label: pluralize(
							data.review.unallocated_statements,
							"unallocated Statement",
						),
						detail: "Totals may be low until these are allocated.",
						icon: "lucide:inbox",
						href: pathAllocator({ ...range, is_pending: "false" }),
						selection: undefined,
					},
				]
			: []),
		...(data.review.pending_records
			? [
					{
						label: pluralize(data.review.pending_records, "Pending Record"),
						detail: "Not yet matched to a Statement.",
						icon: "lucide:circle-dashed",
						href: pathRecords({
							month,
							year: String(year),
							is_allocated: "false",
						}),
						selection: undefined,
					},
				]
			: []),
		...(data.review.pending_statements
			? [
					{
						label: pluralize(data.review.pending_statements, "Pending Statement"),
						detail: "Bank activity waiting for confirmation.",
						icon: "lucide:circle-dashed",
						href: pathStatements({ ...range, is_pending: "true" }),
						selection: undefined,
					},
				]
			: []),
		...(data.summary.unbudgeted_count
			? [
					{
						label: `${formatCurrency(data.categories.reduce((sum, category) => sum + (category.monthly_budget_spending.unbudgeted ?? 0), 0))} without a Monthly Budget`,
						detail: "Spending without a Monthly Budget.",
						icon: "lucide:wallet",
						selection: { kind: "budget", value: "unbudgeted" } as const,
						href: undefined,
					},
				]
			: []),
	].slice(0, 3)
	return rows
}
