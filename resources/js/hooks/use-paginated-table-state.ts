// Client-side replacement for the Inertia search/pagination helper.
// Search text stays local (debounced by the table); page + page size live in
// the URL search params via react-router so links stay shareable.

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

const DEFAULT_PAGE_SIZE = "100"

export function usePaginatedTableState() {
	const [searchParams, setSearchParams] = useSearchParams()
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
		(changes: Record<string, string | null>) => {
			setSearchParams(prev => {
				const next = new URLSearchParams(prev)
				for (const [key, value] of Object.entries(changes)) {
					if (value === null || value === "") next.delete(key)
					else next.set(key, value)
				}
				return next
			})
		},
		[setSearchParams],
	)

	const handleQueryChange = useCallback(
		(value: string) => {
			setQuery(value)
			setParams({ query: value || null, page: null })
		},
		[setParams],
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
