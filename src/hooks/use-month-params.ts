"use client"

import { DateTime } from "luxon"
import { useUrlParams } from "@/hooks/use-url-params"

/** Month/year from the URL, falling back to the current month when absent. */
export function useMonthParams() {
	const { params } = useUrlParams()
	const now = DateTime.now()
	const parsed = DateTime.fromFormat(
		`${params.get("month") ?? now.toFormat("MMMM")} ${params.get("year") ?? String(now.year)}`,
		"MMMM yyyy",
	)
	const month = parsed.isValid ? (parsed.monthLong ?? now.toFormat("MMMM")) : now.toFormat("MMMM")
	const year = parsed.isValid ? parsed.year : now.year
	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")

	return { month, year, date }
}
