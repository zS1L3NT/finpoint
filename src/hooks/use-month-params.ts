import { DateTime } from "luxon"
import { useSearchParams } from "react-router-dom"

/** Month/year from the URL, falling back to the current month when absent. */
export function useMonthParams() {
	const [searchParams, setSearchParams] = useSearchParams()
	const now = DateTime.now()
	const parsed = DateTime.fromFormat(
		`${searchParams.get("month") ?? now.toFormat("MMMM")} ${searchParams.get("year") ?? String(now.year)}`,
		"MMMM yyyy",
	)
	const month = parsed.isValid ? (parsed.monthLong ?? now.toFormat("MMMM")) : now.toFormat("MMMM")
	const year = parsed.isValid ? parsed.year : now.year
	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")

	return { month, year, date, setSearchParams }
}
