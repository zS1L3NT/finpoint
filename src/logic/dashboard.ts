// Mirrors `DashboardController` + `MonthlyRecordController` (read-model logic).
// Pure functions over the IndexedDB tables — no HTTP involved.

import { DateTime } from "luxon"
import {
	type AllocationRow,
	type BucketDefaultRow,
	type BucketRow,
	type BucketTargetRow,
	type CategoryRow,
	db,
} from "@/data/db"
import { type AnalyticsRecord, summarize } from "@/logic/analytics"
import { expandCategoryIdsForMonthly } from "@/logic/monthly-shared"

export type DashboardInput = { month: string; year: number }

export function monthStart(month: string, year: number): DateTime {
	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
	if (!date.isValid || date.monthLong !== month || year < 2000 || year > 2100) {
		throw new Error("Invalid month.")
	}
	return date.startOf("month")
}

async function toAnalyticsRecords(
	rows: {
		id: string
		amount: number
		datetime: string
		analytics_treatment: string
		bucket_id: string | null
		category_id: string
	}[],
	allocatedByRecord: Map<string, { sum: number; count: number }>,
	categories: Map<string, CategoryRow>,
	buckets: Map<string, BucketRow>,
): Promise<AnalyticsRecord[]> {
	const items: (AnalyticsRecord | null)[] = rows.map(row => {
		const entry = allocatedByRecord.get(row.id) ?? { sum: 0, count: 0 }
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
			is_pending: entry.sum !== row.amount || entry.count === 0,
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

function summarizeAllocations(
	allocations: AllocationRow[],
): Map<string, { sum: number; count: number }> {
	const map = new Map<string, { sum: number; count: number }>()
	for (const allocation of allocations) {
		const entry = map.get(allocation.record_id) ?? { sum: 0, count: 0 }
		entry.sum = Math.round((entry.sum + allocation.amount) * 100) / 100
		entry.count++
		map.set(allocation.record_id, entry)
	}
	return map
}

function inMonth(datetime: string, start: DateTime, end: DateTime): boolean {
	const day = datetime.slice(0, 10)
	return day >= start.toFormat("yyyy-MM-dd") && day <= end.toFormat("yyyy-MM-dd")
}

export async function getDashboard(input: DashboardInput) {
	const date = monthStart(input.month, input.year)
	const today = DateTime.now().startOf("day")
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date.startOf("month") > today.startOf("month")
	const actualEnd = isCurrent ? today.endOf("day") : date.endOf("month")

	const [allRecords, allocations, coverages, categoryRows, buckets, targets, defaults] =
		await Promise.all([
			db.records.toArray(),
			db.allocations.toArray(),
			db.analytics_months.toArray(),
			db.categories.toArray(),
			db.buckets.toArray(),
			db.bucket_targets.toArray(),
			db.bucket_defaults.toArray(),
		])
	const allocated = summarizeAllocations(allocations)
	const categoriesById = new Map(categoryRows.map(c => [c.id, c]))
	const bucketsById = new Map(buckets.map(b => [b.id, b]))
	const coverageByMonth = new Map(coverages.map(c => [c.month, c]))

	const monthStartDay = date.startOf("month")
	const monthEndDay = date.endOf("month")
	const monthRecords = allRecords.filter(r => inMonth(r.datetime, monthStartDay, monthEndDay))
	const analyticsAll = await toAnalyticsRecords(
		monthRecords,
		allocated,
		categoriesById,
		bucketsById,
	)

	const actualRecords = isFuture
		? []
		: analyticsAll.filter(r => DateTime.fromFormat(r.datetime, "yyyy-MM-dd HH:mm") <= actualEnd)
	const futureRecords = analyticsAll.filter(r => !actualRecords.includes(r))

	const summary = summarize(actualRecords)
	const futureSummary = summarize(futureRecords)

	const comparisonMonths = []
	for (let offset = 1; offset <= 3; offset++) {
		const month = date.minus({ months: offset }).startOf("month")
		const coverage = coverageByMonth.get(month.toFormat("yyyy-MM-dd"))
		const endDay = isCurrent
			? Math.min(today.day ?? 1, month.daysInMonth ?? 28)
			: (month.daysInMonth ?? 28)
		const end = month.set({ day: endDay }).endOf("day")
		const rows = allRecords.filter(r => inMonth(r.datetime, month, end))
		const items = await toAnalyticsRecords(rows, allocated, categoriesById, bucketsById)
		const excluded =
			(coverage?.excluded_from_comparisons ?? false) ||
			(coverage?.coverage ?? null) === "incomplete" ||
			(items.length === 0 && (coverage?.coverage ?? "unknown") !== "complete")
		comparisonMonths.push({
			month: month.toFormat("MMM yyyy"),
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
		})
	}

	const included = comparisonMonths.filter(m => m.included)
	const comparison = buildComparison(summary, included)
	const bucketsWithSpending = buildBuckets(date, summary, included, buckets, targets, defaults)
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
		series,
		projection,
		buckets: bucketsWithSpending,
		categories,
		future_records_count: futureRecords.length,
	}
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
