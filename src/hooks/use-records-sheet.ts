"use client"

import { useUrlParams } from "@/hooks/use-url-params"
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
	const { params, setParams } = useUrlParams()

	const cleared = { records: null, ...Object.fromEntries(FILTER_KEYS.map(key => [key, null])) }
	const href = (filters: RecordsSheetFilters = {}) =>
		pathDashboard({
			...Object.fromEntries([...params].filter(([key]) => !(key in cleared))),
			records: "1",
			...filters,
		})

	return {
		filters: params.has("records")
			? (Object.fromEntries(
					FILTER_KEYS.flatMap(key => {
						const value = params.get(key)
						return value ? [[key, value]] : []
					}),
				) as RecordsSheetFilters)
			: null,
		href,
		open: (filters?: RecordsSheetFilters) =>
			setParams({ ...cleared, records: "1", ...filters }),
		close: () => setParams(cleared, { replace: true }),
	}
}
