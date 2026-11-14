"use client"

// Search text, page and page size live in the URL search params so links stay
// shareable. Typing in search edits one history entry rather than adding one per key.

import { useUrlParams } from "@/hooks/use-url-params"

const DEFAULT_PAGE_SIZE = "100"

export function usePaginatedTableState() {
	const { params, committed, setParams } = useUrlParams()

	// The params are optimistic: they move on the keystroke, not when the router commits, so
	// the input needs no copy of them.
	const query = params.get("query") ?? ""
	const page = params.get("page") ?? "1"
	const pageSize = params.get("per_page") ?? DEFAULT_PAGE_SIZE

	// The first keystroke starts a search (one Back undoes it); refining it replaces that
	// entry. Keystrokes before the first commit keep pushing: the router lets the latest
	// supersede the pending push, so a burst still adds one entry, whereas a replace would
	// supersede it and add none.
	const handleQueryChange = (value: string) =>
		setParams({ query: value || null, page: null }, { replace: !!committed.get("query") })

	const handlePageSizeChange = (value: string) => setParams({ per_page: value, page: null })

	const handlePageChange = (nextPage: number) =>
		setParams({ page: nextPage <= 1 ? null : String(nextPage) })

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
