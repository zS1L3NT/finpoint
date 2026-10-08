// Mirrors `DashboardController` + `MonthlyRecordController` (read-model logic).
// Pure functions over the IndexedDB tables — no HTTP involved.

import { DateTime } from "luxon"
import {
	type AnalyticsMonthRow,
	type BucketDefaultRow,
	type BucketRow,
	type BucketTargetRow,
	type CategoryRow,
	db,
	type RecordRow,
} from "@/data/db"
import { type AnalyticsRecord, contribution, summarize } from "@/logic/analytics"
import { expandCategoryIdsForMonthly } from "@/logic/monthly-shared"
import {
	type AllocationTally,
	isPendingRecord,
	pendingStatementIds,
	tallyAllocations,
} from "@/logic/pending"

export type DashboardInput = { month: string; year: number; comparison_months?: number }

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
		bucket_spending: Record<string, number>
	}[]
}

function normalizeComparisonMonths(value = 3): number {
	return Math.min(24, Math.max(1, Math.trunc(Number.isFinite(value) ? value : 3)))
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
		bucket_id: string | null
		category_id: string
	}[],
	allocatedByRecord: Map<string, AllocationTally>,
	categories: Map<string, CategoryRow>,
	buckets: Map<string, BucketRow>,
): AnalyticsRecord[] {
	const items: (AnalyticsRecord | null)[] = rows.map(row => {
		const entry = allocatedByRecord.get(row.id)
		const category = categories.get(row.category_id)
		if (!category) return null
		const parent = category.parent_category_id
			? (categories.get(category.parent_category_id) ?? null)
			: null
		const bucket = row.bucket_id ? (buckets.get(row.bucket_id) ?? null) : null
		return {
			id: row.id,
			amount: row.amount,
			datetime: row.datetime,
			analytics_treatment: row.analytics_treatment,
			bucket_id: row.bucket_id,
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
			bucket: bucket
				? {
						id: bucket.id,
						name: bucket.name,
						color: bucket.color,
						group: bucket.group,
						pace_kind: bucket.pace_kind,
						display_order: bucket.display_order,
						archived: bucket.archived,
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
	allocated: Map<string, AllocationTally>
	categories: Map<string, CategoryRow>
	buckets: Map<string, BucketRow>
	bucketRows: BucketRow[]
	targets: BucketTargetRow[]
	defaults: BucketDefaultRow[]
	coverages: Map<string, AnalyticsMonthRow>
}

async function loadDashboardTables(): Promise<LoadedTables> {
	const [allRecords, allocations, coverages, categories, buckets, targets, defaults, pending] =
		await Promise.all([
			db.records.toArray(),
			db.allocations.toArray(),
			db.analytics_months.toArray(),
			db.categories.toArray(),
			db.buckets.toArray(),
			db.bucket_targets.toArray(),
			db.bucket_defaults.toArray(),
			pendingStatementIds(),
		])

	return {
		records: allRecords,
		allocated: tallyAllocations(allocations, pending),
		categories: new Map(categories.map(c => [c.id, c])),
		buckets: new Map(buckets.map(b => [b.id, b])),
		bucketRows: buckets,
		targets,
		defaults,
		coverages: new Map(coverages.map(c => [c.month, c])),
	}
}

/** Bucket ids for a pace/breakdown scope, or null for everything. */
export function scopeBucketIds(scope: string, buckets: BucketRow[]): string[] | null {
	if (scope === "all") return null
	if (scope === "core" || scope === "outlier" || scope === "other") {
		return buckets.filter(b => b.group === scope).map(b => b.id)
	}
	return [scope]
}

function inScope(bucketId: string | null, scopeIds: string[] | null): boolean {
	return scopeIds === null || (bucketId !== null && scopeIds.includes(bucketId))
}

function comparisonSummaries(
	date: DateTime,
	today: DateTime,
	isCurrent: boolean,
	tables: LoadedTables,
	scopeIds: string[] | null,
	comparisonMonths: number,
) {
	const out = []
	for (let offset = 1; offset <= comparisonMonths; offset++) {
		const month = date.minus({ months: offset }).startOf("month")
		const coverage = tables.coverages.get(month.toFormat("yyyy-MM-dd"))
		const endDay = isCurrent
			? Math.min(today.day ?? 1, month.daysInMonth ?? 28)
			: (month.daysInMonth ?? 28)
		const end = month.set({ day: endDay }).endOf("day")
		const startKey = month.toFormat(ISO_DAY)
		const endKey = end.toFormat(ISO_DAY)
		const rows = tables.records.filter(
			r => inRange(r.datetime, startKey, endKey) && inScope(r.bucket_id, scopeIds),
		)
		const items = toAnalyticsRecords(rows, tables.allocated, tables.categories, tables.buckets)
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

function buildSpendingHistory(
	date: DateTime,
	currentItems: AnalyticsRecord[],
	comparisons: ReturnType<typeof comparisonSummaries>,
): SpendingHistoryMonth[] {
	const buildBreakdown = (items: AnalyticsRecord[]) => {
		const totals = new Map<
			string,
			{ name: string; color: string; cents: number; buckets: Record<string, number> }
		>()
		for (const item of items) {
			const category = item.category_parent ?? item.category
			const cents = contribution(item.analytics_treatment, item.amount).spending
			if (!category || cents <= 0) continue
			const value = totals.get(category.id) ?? {
				name: category.name,
				color: category.color,
				cents: 0,
				buckets: {},
			}
			value.cents += cents
			const bucket = item.bucket_id ?? "unbucketed"
			value.buckets[bucket] = (value.buckets[bucket] ?? 0) + cents
			totals.set(category.id, value)
		}
		return {
			categories: [...totals].map(([id, value]) => ({
				id,
				name: value.name,
				color: value.color,
				spending: value.cents / 100,
				bucket_spending: Object.fromEntries(
					Object.entries(value.buckets).map(([id, cents]) => [id, cents / 100]),
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
	const comparisonMonthCount = normalizeComparisonMonths(input.comparison_months)
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
		tables.buckets,
	)

	const actualRecords = isFuture
		? []
		: analyticsAll.filter(r => r.datetime.slice(0, 10) <= actualEndKey)
	const actualIds = new Set(actualRecords.map(r => r.id))
	const futureRecords = analyticsAll.filter(r => !actualIds.has(r.id))

	const summary = summarize(actualRecords)
	const futureSummary = summarize(futureRecords)

	const comparisonMonths = comparisonSummaries(
		date,
		today,
		isCurrent,
		tables,
		null,
		comparisonMonthCount,
	)

	const included = comparisonMonths.filter(m => m.included)
	const comparison = buildComparison(summary, included)
	const bucketsWithSpending = buildBuckets(
		date,
		summary,
		included,
		tables.bucketRows,
		tables.targets,
		tables.defaults,
	)
	const projection = buildProjection(
		date,
		summary,
		futureSummary,
		bucketsWithSpending,
		isCurrent,
		isFuture,
		actualEnd.day ?? 1,
	)
	const series = buildSeries(
		summary,
		futureSummary,
		included,
		date.daysInMonth ?? 30,
		actualEnd.day,
		projection.daily_spending,
	)
	const categories = buildCategories(summary, included)
	const historyMonths = isCurrent
		? comparisonSummaries(date, today, false, tables, null, comparisonMonthCount)
		: comparisonMonths
	const comparisonHistory = buildSpendingHistory(date, actualRecords, historyMonths)

	return {
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
		comparison_months: comparisonMonthCount,
		comparison_history: comparisonHistory,
		series,
		projection,
		buckets: bucketsWithSpending,
		categories,
		weekday: buildWeekday(
			date,
			isFuture ? 0 : (date.daysInMonth ?? 30),
			summary,
			historyMonths.filter(m => m.included),
		),
		future_records_count: futureRecords.length,
	}
}

export async function getPaceView(
	month: string,
	year: number,
	scope: string,
	comparisonMonths = 3,
	preloaded?: LoadedTables,
) {
	comparisonMonths = normalizeComparisonMonths(comparisonMonths)
	const date = monthStart(month, year)
	const today = DateTime.now().startOf("day")
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date.startOf("month") > today.startOf("month")
	const actualEnd = isCurrent ? today.endOf("day") : date.endOf("month")

	const tables = preloaded ?? (await loadDashboardTables())
	const scopeIds = scopeBucketIds(scope, tables.bucketRows)
	const monthStartKey = date.startOf("month").toFormat(ISO_DAY)
	const monthEndKey = date.endOf("month").toFormat(ISO_DAY)
	const actualEndKey = actualEnd.toFormat(ISO_DAY)

	const monthRecords = tables.records.filter(
		r => inRange(r.datetime, monthStartKey, monthEndKey) && inScope(r.bucket_id, scopeIds),
	)
	const analyticsAll = toAnalyticsRecords(
		monthRecords,
		tables.allocated,
		tables.categories,
		tables.buckets,
	)

	const actualRecords = isFuture
		? []
		: analyticsAll.filter(r => r.datetime.slice(0, 10) <= actualEndKey)
	const actualIds = new Set(actualRecords.map(r => r.id))
	const futureRecords = analyticsAll.filter(r => !actualIds.has(r.id))

	const summary = summarize(actualRecords)
	const futureSummary = summarize(futureRecords)
	const comparisonSummariesForPace = comparisonSummaries(
		date,
		today,
		isCurrent,
		tables,
		scopeIds,
		comparisonMonths,
	)
	const included = comparisonSummariesForPace.filter(m => m.included)

	const scopedBucketRows = scopeIds
		? tables.bucketRows.filter(b => scopeIds.includes(b.id))
		: tables.bucketRows
	const bucketsBuilt = buildBuckets(
		date,
		summary,
		included,
		scopedBucketRows,
		tables.targets,
		tables.defaults,
	)
	const projection = buildProjection(
		date,
		summary,
		futureSummary,
		bucketsBuilt,
		isCurrent,
		isFuture,
		actualEnd.day ?? 1,
	)
	const series = buildSeries(
		summary,
		futureSummary,
		included,
		date.daysInMonth ?? 30,
		actualEnd.day,
		projection.daily_spending,
	)
	const pace = bucketsBuilt.find(
		b => b.pace_kind === "daily" && b.target !== null && b.target > 0,
	)
	const highestSpendingDay = summary.daily.reduce<(typeof summary.daily)[number] | null>(
		(highest, day) =>
			day.spending > 0 && (!highest || day.spending > highest.spending) ? day : highest,
		null,
	)

	return {
		series,
		projection,
		paceBucket: pace ? { id: pace.id, name: pace.name, target: pace.target } : null,
		completedMonth:
			!isCurrent && !isFuture
				? {
						spending: Math.round(summary.spending * 100) / 100,
						spending_per_day:
							Math.round((summary.spending / (date.daysInMonth ?? 30)) * 100) / 100,
						target: pace?.target ?? null,
						target_difference:
							pace?.target === null || pace?.target === undefined
								? null
								: Math.round((pace.target - pace.spending) * 100) / 100,
					}
				: null,
		highestSpendingDay: highestSpendingDay
			? { date: highestSpendingDay.date, spending: highestSpendingDay.spending }
			: null,
	}
}

export async function getBucketDaily(
	month: string,
	year: number,
	preloaded?: LoadedTables,
): Promise<{
	rows: Record<string, number | null>[]
	buckets: { id: string; name: string; color: string }[]
}> {
	const date = monthStart(month, year)
	const today = DateTime.now().startOf("day")
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date.startOf("month") > today.startOf("month")
	const daysInMonth = date.daysInMonth ?? 30
	const elapsed = isFuture ? 0 : isCurrent ? (today.day ?? daysInMonth) : daysInMonth

	const tables = preloaded ?? (await loadDashboardTables())
	const monthKey = date.toFormat("yyyy-MM")
	const active = tables.bucketRows.filter(b => !b.archived)
	const spent = new Map<string, number>()
	const unbucketed = new Map<number, number>()
	for (const record of tables.records) {
		const day = Number(record.datetime.slice(8, 10))
		if (record.datetime.slice(0, 7) !== monthKey || day > elapsed) continue
		const outflow =
			record.analytics_treatment === "spending" ||
			(record.analytics_treatment === "automatic" && record.amount < 0)
				? Math.max(-record.amount, 0)
				: 0
		if (outflow <= 0) continue
		if (record.bucket_id) {
			spent.set(record.bucket_id, (spent.get(record.bucket_id) ?? 0) + outflow)
			const key = `${record.bucket_id}|${day}`
			spent.set(key, (spent.get(key) ?? 0) + outflow)
		} else {
			unbucketed.set(day, (unbucketed.get(day) ?? 0) + outflow)
		}
	}

	const buckets = active
		.filter(b => (spent.get(b.id) ?? 0) > 0)
		.map(b => ({ id: b.id, name: b.name, color: b.color }))
	if ([...unbucketed.values()].some(v => v > 0)) {
		buckets.push({ id: "unbucketed", name: "No bucket", color: "#94a3b8" })
	}

	const rows = Array.from({ length: Math.max(daysInMonth, 1) }, (_, i) => {
		const day = i + 1
		const point: Record<string, number | null> = { day }
		for (const bucket of buckets) {
			point[bucket.id] =
				day > elapsed
					? null
					: Math.round(
							(bucket.id === "unbucketed"
								? (unbucketed.get(day) ?? 0)
								: (spent.get(`${bucket.id}|${day}`) ?? 0)) * 100,
						) / 100
		}
		return point
	})

	return { rows, buckets }
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

	return { stats, comparison_count: included.length }
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
	const result: Record<string, unknown> = { count: included.length }
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
	buckets: {
		pace_kind: string
		target: number | null
		spending: number
		id: string
		name: string
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
			bucket: null,
		}
	}
	const remainingDays = Math.max((date.daysInMonth ?? 30) - elapsedDays, 0)
	const dailySpending = summary.gross_spending / elapsedDays
	const paceBucket = buckets.find(
		b => b.pace_kind === "daily" && b.target !== null && b.target > 0,
	)
	const paceTarget = paceBucket?.target ?? null
	const futureBuckets = new Map(futureSummary.buckets.map(b => [b.id, b]))
	const scheduledBucketSpending = paceBucket
		? Number(futureBuckets.get(paceBucket.id)?.spending ?? 0)
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
		bucket:
			paceBucket && paceTarget !== null
				? {
						name: paceBucket.name,
						spent: paceBucket.spending,
						target: paceTarget,
						projected:
							Math.round(
								(paceBucket.spending +
									scheduledBucketSpending +
									(paceBucket.spending / elapsedDays) * remainingDays) *
									100,
							) / 100,
						usage_pace: Math.round((paceBucket.spending / elapsedDays) * 100) / 100,
						target_pace:
							Math.round((paceTarget / (date.daysInMonth ?? 30)) * 100) / 100,
						recommended_pace: remainingDays
							? Math.round(
									Math.max(
										(paceTarget -
											paceBucket.spending -
											scheduledBucketSpending) /
											remainingDays,
										0,
									) * 100,
								) / 100
							: null,
					}
				: null,
	}
}

function buildBuckets(
	date: DateTime,
	summary: ReturnType<typeof summarize>,
	included: { summary: ReturnType<typeof summarize> }[],
	bucketRows: BucketRow[],
	targets: BucketTargetRow[],
	defaults: BucketDefaultRow[],
) {
	const current = new Map(summary.buckets.map(b => [b.id, b]))
	const baseline = new Map<string, number>()
	for (const month of included) {
		for (const bucket of month.summary.buckets) {
			baseline.set(bucket.id, (baseline.get(bucket.id) ?? 0) + bucket.spending)
		}
	}
	for (const [id, total] of baseline) baseline.set(id, total / Math.max(included.length, 1))

	const monthKey = date.toFormat("yyyy-MM-dd")
	const buckets = bucketRows
		.filter(b => !b.archived)
		.sort((a, b) => a.display_order - b.display_order)
	const out = []
	for (const bucket of buckets) {
		const override = targets.find(t => t.bucket_id === bucket.id && t.month === monthKey)
		let target = override ? override.amount : null
		if (target === undefined) target = null
		if (override === undefined) {
			const eligible = defaults
				.filter(d => d.bucket_id === bucket.id && d.effective_month <= monthKey)
				.sort((a, b) => (a.effective_month < b.effective_month ? 1 : -1))
			target = eligible[0]?.amount ?? null
		}
		const spending = Number(current.get(bucket.id)?.spending ?? 0)
		out.push({
			...bucket,
			spending,
			target: target === null || target === undefined ? null : Number(target),
			remaining: target === null || target === undefined ? null : Number(target) - spending,
			comparison: baseline.has(bucket.id) ? spending - (baseline.get(bucket.id) ?? 0) : null,
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
				bucket_spending: Record<string, number>
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
	const baselineBuckets = new Map<string, Record<string, number>>()
	for (const [id, items] of baselineGroups) {
		baseline.set(id, items.reduce((s, i) => s + i.spending, 0) / Math.max(included.length, 1))
		const bucketIds = new Set(items.flatMap(i => Object.keys(i.bucket_spending)))
		const perBucket: Record<string, number> = {}
		for (const bucketId of bucketIds) {
			perBucket[bucketId] =
				items.reduce((s, i) => s + (i.bucket_spending[bucketId] ?? 0), 0) /
				Math.max(included.length, 1)
		}
		baselineBuckets.set(id, perBucket)
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
			records: 0,
			bucket_spending: {},
		}
		return {
			...category,
			share:
				summary.spending > 0 && category.spending >= 0
					? (category.spending / summary.spending) * 100
					: null,
			comparison: baseline.has(id) ? category.spending - (baseline.get(id) ?? 0) : null,
			baseline_bucket_spending: baselineBuckets.get(id) ?? {},
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
 * Income vs spending for the trailing `count` months ending at the selected month. While the
 * selected month is still running, every month is cut at the same day of the month, so the
 * sparkline compares like with like (as the comparison text does) instead of ending in a cliff.
 */
function buildTrend(date: DateTime, today: DateTime, tables: LoadedTables, count = 12) {
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
	for (let offset = count - 1; offset >= 0; offset--) {
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
			toAnalyticsRecords(rows, tables.allocated, tables.categories, tables.buckets),
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
export async function getDashboardView(input: DashboardInput) {
	const tables = await loadDashboardTables()
	const dashboard = await getDashboard(input, tables)
	const dailyBucket =
		dashboard.buckets.find(bucket => bucket.pace_kind === "daily") ??
		dashboard.buckets.find(bucket => bucket.name.toLowerCase() === "daily") ??
		null
	const [pace, bucketDaily] = await Promise.all([
		getPaceView(
			input.month,
			input.year,
			dailyBucket?.id ?? "all",
			dashboard.comparison_months,
			tables,
		),
		getBucketDaily(input.month, input.year, tables),
	])
	const date = monthStart(input.month, input.year)
	const trend = buildTrend(date, DateTime.now().startOf("day"), tables)
	return { dashboard, pace, bucketDaily, dailyBucketId: dailyBucket?.id ?? null, trend }
}
