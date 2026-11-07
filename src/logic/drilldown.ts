import { DateTime } from "luxon"
import { db } from "@/data/db"
import { contribution, summaryMeasure } from "@/logic/analytics"
import { getDashboardView } from "@/logic/dashboard"
import { getRecord, listRecords, pendingReason } from "@/logic/records"
import { getStatement } from "@/logic/statements"
import { pathRecords } from "@/routes"

export type Selection = {
	kind:
		| "compare"
		| "largest"
		| "metric"
		| "day"
		| "category-gross"
		| "category"
		| "month"
		| "budget"
	value: string
	at?: string
}

export async function getDrilldown(
	month: string,
	year: number,
	scope: string,
	selection: Selection,
) {
	const at = selection.kind === "month" ? selection.value : selection.at
	const date = at
		? DateTime.fromISO(`${at}-01`)
		: DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
	const view = await getDashboardView({ month: date.toFormat("MMMM"), year: date.year, scope })
	if (
		(selection.kind === "compare" ||
			selection.kind === "category" ||
			selection.kind === "category-gross") &&
		(await db.categories.bulkGet(selection.value.split(","))).some(c => !c)
	)
		return null
	if (
		selection.kind === "budget" &&
		!["all", "unbudgeted"].includes(selection.value) &&
		!view.dashboard.monthlyBudgets.some(b => b.id === selection.value)
	)
		return null
	const start = selection.kind === "day" ? selection.value : date.toFormat("yyyy-MM-dd")
	const end =
		selection.kind === "day"
			? selection.value
			: (view.dashboard.period.through ?? date.endOf("month").toFormat("yyyy-MM-dd"))
	const filters = {
		sort: selection.kind === "largest" ? "amount_desc" : undefined,
		start_date: start,
		end_date: end,
		effective_spending: selection.kind !== "metric",
		measure: selection.kind === "metric" ? selection.value : undefined,
		max_amount:
			selection.kind === "category-gross" || selection.kind === "month" ? "-0.01" : undefined,
		category_ids:
			selection.kind === "compare" || selection.kind.startsWith("category")
				? selection.value.split(",")
				: undefined,
		show_unbudgeted: selection.kind === "budget" && selection.value === "unbudgeted",
		monthly_budget_id:
			selection.kind === "budget"
				? ["all", "unbudgeted"].includes(selection.value)
					? undefined
					: selection.value
				: selection.kind === "metric" || scope === "all"
					? undefined
					: scope,
	}
	let records =
		selection.kind === "compare" && view.dashboard.period.is_future
			? []
			: await listRecords(filters)
	const measure = (r: (typeof records)[number]) =>
		summaryMeasure(
			r.analytics_treatment,
			r.amount,
			selection.kind === "metric" ? selection.value : "spent",
		)
	if (selection.kind === "category-gross" || selection.kind === "month")
		records = records.filter(r => contribution(r.analytics_treatment, r.amount).spending > 0)
	records.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
	const details = await Promise.all(records.map(r => getRecord(r.id)))
	const total = Math.max(
		selection.kind === "day" ? 0 : Number.NEGATIVE_INFINITY,
		records.reduce((sum, r) => sum + measure(r), 0) / 100,
	)
	const title =
		selection.kind === "largest"
			? `Largest Records in ${date.toFormat("MMMM")}`
			: selection.kind === "metric"
				? `${({ spent: "Spent", income: "Income", leftover: "Left over", saved: "Saved this month" } as Record<string, string>)[selection.value]} in ${date.toFormat("MMMM")}`
				: selection.kind === "day"
					? `Spending on ${DateTime.fromISO(selection.value).toFormat("ccc d LLL")}`
					: selection.kind === "compare"
						? `${view.scopedCategories.find(c => c.id === selection.value)?.name}: ${month} vs usual`
						: selection.kind.startsWith("category")
							? `${view.scopedCategories.find(c => c.id === selection.value)?.name ?? "Categories"} in ${date.toFormat("MMMM")}`
							: selection.kind === "budget"
								? `${view.dashboard.monthlyBudgets.find(b => b.id === selection.value)?.name ?? (selection.value === "unbudgeted" ? "Unbudgeted" : "All budgets")} in ${date.toFormat("MMMM")}`
								: `Spending in ${date.toFormat("MMMM")}`

	const category = view.scopedCategories.find(c => c.id === selection.value)
	const comparisonRecords =
		selection.kind === "compare"
			? (
					await Promise.all(
						view.scopedComparisonMonths.map(async label => {
							const previous = DateTime.fromFormat(label, "MMM yyyy")
							return listRecords({
								...filters,
								start_date: previous.toFormat("yyyy-MM-dd"),
								end_date: previous
									.set({
										day: view.dashboard.period.is_current
											? Math.min(
													DateTime.now().day,
													previous.daysInMonth ?? 28,
												)
											: (previous.daysInMonth ?? 28),
									})
									.toFormat("yyyy-MM-dd"),
							})
						}),
					)
				).flat()
			: []
	return {
		comparison:
			selection.kind === "compare"
				? {
						average:
							category?.comparison === null || category?.comparison === undefined
								? null
								: category.spending - category.comparison,
						months: view.scopedComparisonMonths,
						period: view.dashboard.period.is_current
							? `Days 1–${DateTime.now().day}`
							: "Full months",
						total:
							comparisonRecords.reduce(
								(sum, r) =>
									sum + summaryMeasure(r.analytics_treatment, r.amount, "spent"),
								0,
							) / 100,
						records: comparisonRecords.sort(
							(a, b) => Math.abs(b.amount) - Math.abs(a.amount),
						),
						uniqueCurrentIds: details
							.filter(r => !comparisonRecords.some(p => p.title === r.title))
							.map(r => r.id),
						uniquePreviousIds: comparisonRecords
							.filter(r => !details.some(p => p.title === r.title))
							.map(r => r.id),
					}
				: undefined,
		budget:
			selection.kind === "budget"
				? view.dashboard.monthlyBudgets.find(b => b.id === selection.value)
				: undefined,
		title,
		total,
		records: details.map(r => ({
			...r,
			pendingReason: r.is_pending ? pendingReason(r) : null,
		})),
		href: pathRecords({
			...filters,
			effective_spending: filters.effective_spending ? "true" : undefined,
			show_unbudgeted: filters.show_unbudgeted ? "true" : undefined,
			category_ids: filters.category_ids?.join(","),
		}),
	}
}

export async function getDrillStatement(id: string) {
	return (await db.statements.get(id)) ? getStatement(id) : null
}
