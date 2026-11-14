"use client"

// The URL's search params as one shared optimistic value. `useSearchParams()` only changes when a
// navigation commits, so a URL built from it while another navigation is pending drops that
// navigation's changes. The optimistic copy moves the moment a change is requested and settles
// back to the committed params when the transition ends (a superseded navigation settles with the
// newer one), so changes made in a row, from any component, compose.

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createContext, startTransition, useContext, useOptimistic } from "react"

type UrlParams = {
	params: URLSearchParams
	committed: URLSearchParams
	setParams: (
		changes: Record<string, string | null | undefined>,
		options?: { replace?: boolean },
	) => void
}

const UrlParamsContext = createContext<UrlParams | null>(null)

export function UrlParamsProvider({ children }: { children: React.ReactNode }) {
	const committed = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const [params, setOptimistic] = useOptimistic<URLSearchParams, URLSearchParams>(
		committed,
		(_, next) => next,
	)

	const setParams: UrlParams["setParams"] = (changes, { replace = false } = {}) => {
		const next = new URLSearchParams(params)
		for (const [key, value] of Object.entries(changes)) {
			if (value) next.set(key, value)
			else next.delete(key)
		}
		const suffix = next.toString()
		const href = suffix ? `${pathname}?${suffix}` : pathname
		startTransition(() => {
			setOptimistic(next)
			if (replace) router.replace(href, { scroll: false })
			else router.push(href, { scroll: false })
		})
	}

	return <UrlParamsContext value={{ params, committed, setParams }}>{children}</UrlParamsContext>
}

export function useUrlParams() {
	const context = useContext(UrlParamsContext)
	if (!context) throw new Error("useUrlParams needs UrlParamsProvider")
	return context
}
