// Port of `App\Support\RecordAnalytics` (PHP -> TypeScript, same math).
// Operates on plain enriched records so dashboard + monthly pages stay thin.

import { fromCents, toCents } from "@/logic/shared"

export type AnalyticsRecord = {
	id: string
	amount: number
	datetime: string
	analytics_treatment: string
	bucket_id: string | null
	is_pending: boolean
	category: { id: string; name: string; icon: string; color: string } | null
	category_parent: { id: string; name: string; icon: string; color: string } | null
	bucket: {
		id: string
		name: string
		color: string
		group: "core" | "outlier" | "other"
		pace_kind: "daily" | "recurring" | "none"
		display_order: number
		archived: boolean
	} | null
}

export function contribution(treatment: string, amount: number) {
	const cents = toCents(amount)
	switch (treatment) {
		case "income":
			return { income: cents, spending: 0, contributions: 0, withdrawals: 0 }
		case "spending":
			return { income: 0, spending: -cents, contributions: 0, withdrawals: 0 }
		case "saving_investment":
			return {
				income: 0,
				spending: 0,
				contributions: Math.max(-cents, 0),
				withdrawals: Math.max(cents, 0),
			}
		case "neutral":
			return { income: 0, spending: 0, contributions: 0, withdrawals: 0 }
		default:
			return {
				income: Math.max(cents, 0),
				spending: Math.max(-cents, 0),
				contributions: 0,
				withdrawals: 0,
			}
	}
}

export type AnalyticsSummary = {
	income: number
	spending: number
	gross_spending: number
	refunds: number
	contributions: number
	withdrawals: number
	pending_income: number
	pending_spending: number
	pending_gross_spending: number
	pending_refunds: number
	surplus: number
	surplus_rate: number | null
	pending_count: number
	unbucketed_count: number
	daily: {
		date: string
		income: number
		spending: number
		contributions: number
		withdrawals: number
		net: number
		records: number
	}[]
	categories: {
		id: string
		name: string
		icon: string
		color: string
		spending: number
		records: number
		bucket_spending: Record<string, number>
	}[]
	buckets: {
		id: string
		name: string
		color: string
		group: "core" | "outlier" | "other"
		pace_kind: "daily" | "recurring" | "none"
		display_order: number
		archived: boolean
		spending: number
		records: number
	}[]
}

export function summarize(records: AnalyticsRecord[]): AnalyticsSummary {
	const summary = {
		income: 0,
		spending: 0,
		gross_spending: 0,
		refunds: 0,
		contributions: 0,
		withdrawals: 0,
		pending_income: 0,
		pending_spending: 0,
		pending_gross_spending: 0,
		pending_refunds: 0,
		pending_count: 0,
		unbucketed_count: 0,
		daily: {} as Record<
			string,
			{
				date: string
				income: number
				spending: number
				contributions: number
				withdrawals: number
				records: number
			}
		>,
		categories: {} as Record<
			string,
			{
				id: string
				name: string
				icon: string
				color: string
				spending: number
				records: number
				bucket_spending: Record<string, number>
			}
		>,
		buckets: {} as Record<
			string,
			{
				id: string
				name: string
				color: string
				group: "core" | "outlier" | "other"
				pace_kind: "daily" | "recurring" | "none"
				display_order: number
				archived: boolean
				spending: number
				records: number
			}
		>,
	}

	for (const record of records) {
		const value = contribution(record.analytics_treatment, record.amount)
		const date = record.datetime.slice(0, 10)
		const category = record.category_parent ?? record.category
		if (!category) continue

		summary.income += value.income
		summary.spending += value.spending
		summary.contributions += value.contributions
		summary.withdrawals += value.withdrawals
		summary.gross_spending += Math.max(value.spending, 0)
		summary.refunds += Math.max(-value.spending, 0)

		if (record.is_pending) {
			summary.pending_count++
			summary.pending_income += value.income
			summary.pending_spending += value.spending
			summary.pending_gross_spending += Math.max(value.spending, 0)
			summary.pending_refunds += Math.max(-value.spending, 0)
		}

		if (value.spending !== 0 && record.bucket_id === null) summary.unbucketed_count++

		summary.daily[date] ??= {
			date,
			income: 0,
			spending: 0,
			contributions: 0,
			withdrawals: 0,
			records: 0,
		}
		const day = summary.daily[date]
		day.income += value.income
		day.spending += value.spending
		day.contributions += value.contributions
		day.withdrawals += value.withdrawals
		day.records++

		if (value.spending !== 0) {
			summary.categories[category.id] ??= {
				id: category.id,
				name: category.name,
				icon: category.icon,
				color: category.color,
				spending: 0,
				records: 0,
				bucket_spending: {},
			}
			const cat = summary.categories[category.id]
			cat.spending += value.spending
			cat.records++
			const bucketKey = record.bucket_id ?? "unbucketed"
			cat.bucket_spending[bucketKey] = (cat.bucket_spending[bucketKey] ?? 0) + value.spending

			if (record.bucket) {
				summary.buckets[record.bucket.id] ??= {
					...record.bucket,
					spending: 0,
					records: 0,
				}
				summary.buckets[record.bucket.id].spending += value.spending
				summary.buckets[record.bucket.id].records++
			}
		}
	}

	const moneyFields = [
		"income",
		"spending",
		"gross_spending",
		"refunds",
		"contributions",
		"withdrawals",
		"pending_income",
		"pending_spending",
		"pending_gross_spending",
		"pending_refunds",
	] as const

	const out: Record<string, number> = {}
	for (const field of moneyFields) out[field] = fromCents(summary[field])

	const daily = Object.values(summary.daily)
		.sort((a, b) => (a.date < b.date ? -1 : 1))
		.map(day => ({
			date: day.date,
			income: fromCents(day.income),
			spending: fromCents(day.spending),
			contributions: fromCents(day.contributions),
			withdrawals: fromCents(day.withdrawals),
			net: fromCents(day.income - day.spending),
			records: day.records,
		}))

	const categories = Object.values(summary.categories)
		.map(cat => ({
			...cat,
			spending: fromCents(cat.spending),
			bucket_spending: Object.fromEntries(
				Object.entries(cat.bucket_spending).map(([k, v]) => [k, fromCents(v)]),
			),
		}))
		.sort((a, b) => b.spending - a.spending)

	const buckets = Object.values(summary.buckets).map(bucket => ({
		...bucket,
		spending: fromCents(bucket.spending),
	}))

	const surplus = out.income - out.spending

	return {
		income: out.income,
		spending: out.spending,
		gross_spending: out.gross_spending,
		refunds: out.refunds,
		contributions: out.contributions,
		withdrawals: out.withdrawals,
		pending_income: out.pending_income,
		pending_spending: out.pending_spending,
		pending_gross_spending: out.pending_gross_spending,
		pending_refunds: out.pending_refunds,
		surplus,
		surplus_rate: out.income > 0 ? (surplus / out.income) * 100 : null,
		pending_count: summary.pending_count,
		unbucketed_count: summary.unbucketed_count,
		daily,
		categories,
		buckets,
	}
}
