import { DateTime } from "luxon"
import { db } from "@/data/db"
import { contribution } from "@/logic/analytics"
import { getDashboardView } from "@/logic/dashboard"
import { getRecord, listRecords } from "@/logic/records"
import { getStatement } from "@/logic/statements"
import { pathRecords } from "@/routes"

export type Selection = {
	kind: "day" | "category" | "month" | "budget"
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
		selection.kind === "category" &&
		!selection.value.split(",").every(id => view.scopedCategories.some(c => c.id === id))
	)
		return null
	if (
		selection.kind === "budget" &&
		!view.dashboard.monthlyBudgets.some(b => b.id === selection.value)
	)
		return null
	const start = selection.kind === "day" ? selection.value : date.toFormat("yyyy-MM-dd")
	const end =
		selection.kind === "day"
			? selection.value
			: (view.dashboard.period.through ?? date.endOf("month").toFormat("yyyy-MM-dd"))
	const filters = {
		start_date: start,
		end_date: end,
		effective_spending: true,
		max_amount:
			selection.kind === "category" || selection.kind === "month" ? "-0.01" : undefined,
		category_ids: selection.kind === "category" ? selection.value.split(",") : undefined,
		monthly_budget_id:
			selection.kind === "budget" ? selection.value : scope === "all" ? undefined : scope,
	}
	let records = await listRecords(filters)
	if (selection.kind === "category" || selection.kind === "month")
		records = records.filter(r => contribution(r.analytics_treatment, r.amount).spending > 0)
	records.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
	const details = await Promise.all(records.map(r => getRecord(r.id)))
	const total = Math.max(
		selection.kind === "day" ? 0 : Number.NEGATIVE_INFINITY,
		records.reduce(
			(sum, r) => sum + contribution(r.analytics_treatment, r.amount).spending,
			0,
		) / 100,
	)
	const title =
		selection.kind === "day"
			? `Spending on ${DateTime.fromISO(selection.value).toFormat("ccc d LLL")}`
			: selection.kind === "category"
				? `${view.scopedCategories.find(c => c.id === selection.value)?.name ?? "Categories"} in ${date.toFormat("MMMM")}`
				: selection.kind === "budget"
					? `${view.dashboard.monthlyBudgets.find(b => b.id === selection.value)?.name ?? "Monthly budget"} in ${date.toFormat("MMMM")}`
					: `Spending in ${date.toFormat("MMMM")}`
	return {
		title,
		total,
		records: details,
		href: pathRecords({
			...filters,
			effective_spending: "true",
			category_ids: filters.category_ids?.join(","),
		}),
	}
}

export async function getDrillStatement(id: string) {
	return (await db.statements.get(id)) ? getStatement(id) : null
}
