"use client"

// Search text, page and page size live in the URL search params so links stay
// shareable. Typing in search edits one history entry rather than adding one per key.

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

const DEFAULT_PAGE_SIZE = "100"

export function usePaginatedTableState() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const [query, setQuery] = useState(() => searchParams.get("query") ?? "")
	const [pageSize, setPageSize] = useState(
		() => searchParams.get("per_page") ?? DEFAULT_PAGE_SIZE,
	)

	// Values this hook navigated to that the router has not committed yet. Their commits are
	// echoes of the input and must not overwrite newer typing; anything else (Back/Forward, a
	// Link, "Clear filters") is copied into the input.
	const sentQuery = useRef<string[]>([])
	const sentPageSize = useRef<string[]>([])
	useEffect(() => {
		const mirror = (sent: typeof sentQuery, committed: string, set: (v: string) => void) => {
			const index = sent.current.indexOf(committed)
			if (index === -1) {
				sent.current = []
				set(committed)
			} else sent.current = sent.current.slice(index + 1)
		}
		mirror(sentQuery, searchParams.get("query") ?? "", setQuery)
		mirror(sentPageSize, searchParams.get("per_page") ?? DEFAULT_PAGE_SIZE, setPageSize)
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
			// replaces that entry. Keystrokes before the first commit keep pushing: the router
			// lets the latest supersede the pending push, so a burst still adds one entry,
			// whereas a replace would supersede it and add none.
			const current = sentQuery.current.at(-1) ?? searchParams.get("query")
			// A value already in the URL commits nothing, so it is not awaited.
			if (value !== (current ?? "")) sentQuery.current.push(value)
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
			const current =
				sentPageSize.current.at(-1) ?? searchParams.get("per_page") ?? DEFAULT_PAGE_SIZE
			if (value !== current) sentPageSize.current.push(value)
			setParams({ per_page: value, page: null })
		},
		[setParams, searchParams],
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
