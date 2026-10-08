"use client"

// Client-side replacement for the Inertia search/pagination helper.
// Search text, page and page size live in the URL search params so links stay
// shareable. Typing in search edits one history entry rather than adding one per key.

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const DEFAULT_PAGE_SIZE = "100"

export function usePaginatedTableState() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const [query, setQuery] = useState(() => searchParams.get("query") ?? "")
	const [pageSize, setPageSize] = useState(
		() => searchParams.get("per_page") ?? DEFAULT_PAGE_SIZE,
	)

	useEffect(() => {
		setQuery(searchParams.get("query") ?? "")
		setPageSize(searchParams.get("per_page") ?? DEFAULT_PAGE_SIZE)
	}, [searchParams])

	const page = searchParams.get("page") ?? "1"

	const setParams = useCallback(
		(changes: Record<string, string | null>, { replace = false } = {}) => {
			const next = new URLSearchParams(searchParams.toString())
			for (const [key, value] of Object.entries(changes)) {
				if (value === null || value === "") next.delete(key)
				else next.set(key, value)
			}
			const suffix = next.toString()
			const href = suffix ? `${pathname}?${suffix}` : pathname
			if (replace) router.replace(href, { scroll: false })
			else router.push(href, { scroll: false })
		},
		[searchParams, router, pathname],
	)

	const handleQueryChange = useCallback(
		(value: string) => {
			setQuery(value)
			// The first keystroke starts a search (one Back undoes it); refining it
			// replaces that entry.
			setParams(
				{ query: value || null, page: null },
				{ replace: !!searchParams.get("query") },
			)
		},
		[setParams, searchParams],
	)

	const handlePageSizeChange = useCallback(
		(value: string) => {
			setPageSize(value)
			setParams({ per_page: value, page: null })
		},
		[setParams],
	)

	const handlePageChange = useCallback(
		(nextPage: number) => {
			setParams({ page: nextPage <= 1 ? null : String(nextPage) })
		},
		[setParams],
	)

	return {
		query,
		page,
		pageSize,
		handleQueryChange,
		handlePageSizeChange,
		handlePageChange,
		setParams,
	}
}
