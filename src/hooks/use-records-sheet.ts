"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { pathDashboard } from "@/routes"

const FILTER_KEYS = [
	"category_ids",
	"is_allocated",
	"monthly_budget_id",
	"show_unbudgeted",
	"effective_spending",
	"treatment",
	"start_date",
	"end_date",
] as const

export type RecordsSheetFilters = Partial<Record<(typeof FILTER_KEYS)[number], string>>

/**
 * The Dashboard's Records sheet lives in its URL (`records=1` plus the filters), next to the
 * Dashboard's own `month`, `year` and `scope`, so a drill survives a reload and Back closes it.
 */
export function useRecordsSheet() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const dashboardParams = () => {
		const params = Object.fromEntries(searchParams)
		delete params.records
		for (const key of FILTER_KEYS) delete params[key]
		return params
	}
	const href = (filters: RecordsSheetFilters = {}) =>
		pathDashboard({ ...dashboardParams(), records: "1", ...filters })

	return {
		filters: searchParams.has("records")
			? (Object.fromEntries(
					FILTER_KEYS.flatMap(key => {
						const value = searchParams.get(key)
						return value ? [[key, value]] : []
					}),
				) as RecordsSheetFilters)
			: null,
		href,
		open: (filters?: RecordsSheetFilters) => router.push(href(filters), { scroll: false }),
		close: () => router.replace(pathDashboard(dashboardParams()), { scroll: false }),
	}
}
