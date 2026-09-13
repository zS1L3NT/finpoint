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

		let day = summary.daily[date]
		if (!day) {
			day = { date, income: 0, spending: 0, contributions: 0, withdrawals: 0, records: 0 }
			summary.daily[date] = day
		}
		day.income += value.income
		day.spending += value.spending
		day.contributions += value.contributions
		day.withdrawals += value.withdrawals
		day.records++

		if (value.spending !== 0) {
			let cat = summary.categories[category.id]
			if (!cat) {
				cat = {
					id: category.id,
					name: category.name,
					icon: category.icon,
					color: category.color,
					spending: 0,
					records: 0,
					bucket_spending: {},
				}
				summary.categories[category.id] = cat
			}
			cat.spending += value.spending
			cat.records++
			const bucketKey = record.bucket_id ?? "unbucketed"
			cat.bucket_spending[bucketKey] = (cat.bucket_spending[bucketKey] ?? 0) + value.spending

			if (record.bucket) {
				let bucket = summary.buckets[record.bucket.id]
				if (!bucket) {
					bucket = { ...record.bucket, spending: 0, records: 0 }
					summary.buckets[record.bucket.id] = bucket
				}
				bucket.spending += value.spending
				bucket.records++
			}
		}
	}

	const income = fromCents(summary.income)
	const spending = fromCents(summary.spending)

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

	const surplus = income - spending

	return {
		income,
		spending,
		gross_spending: fromCents(summary.gross_spending),
		refunds: fromCents(summary.refunds),
		contributions: fromCents(summary.contributions),
		withdrawals: fromCents(summary.withdrawals),
		pending_income: fromCents(summary.pending_income),
		pending_spending: fromCents(summary.pending_spending),
		pending_gross_spending: fromCents(summary.pending_gross_spending),
		pending_refunds: fromCents(summary.pending_refunds),
		surplus,
		surplus_rate: income > 0 ? (surplus / income) * 100 : null,
		pending_count: summary.pending_count,
		unbucketed_count: summary.unbucketed_count,
		daily,
		categories,
		buckets,
	}
}
