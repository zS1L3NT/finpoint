"use client"

import { DateTime } from "luxon"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

type SearchInit =
	| Record<string, string | undefined>
	| ((previous: URLSearchParams) => URLSearchParams | Record<string, string | undefined>)

/** Month/year from the URL, falling back to the current month when absent. */
export function useMonthParams() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const now = DateTime.now()
	const parsed = DateTime.fromFormat(
		`${searchParams.get("month") ?? now.toFormat("MMMM")} ${searchParams.get("year") ?? String(now.year)}`,
		"MMMM yyyy",
	)
	const month = parsed.isValid ? (parsed.monthLong ?? now.toFormat("MMMM")) : now.toFormat("MMMM")
	const year = parsed.isValid ? parsed.year : now.year
	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")

	const setSearchParams = useCallback(
		(init: SearchInit) => {
			const params = new URLSearchParams(searchParams.toString())
			if (typeof init === "function") {
				const out = init(params)
				if (out instanceof URLSearchParams) {
					router.push(`${pathname}?${out.toString()}`, { scroll: false })
					return
				}
				const next = new URLSearchParams()
				for (const [key, value] of Object.entries(out)) {
					if (value !== undefined && value !== "") next.set(key, value)
				}
				const suffix = next.toString()
				router.push(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false })
				return
			}
			const next = new URLSearchParams()
			for (const [key, value] of Object.entries(init)) {
				if (value !== undefined && value !== "") next.set(key, value)
			}
			const suffix = next.toString()
			router.push(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false })
		},
		[searchParams, router, pathname],
	)

	return { month, year, date, setSearchParams }
}
