import { router } from "@inertiajs/react"
import { useEffect, useState } from "react"

type PaginatedTableQuery = {
	page?: string
	per_page?: string
	query?: string
}

const DEFAULT_PAGE_SIZE = "25"

const getSearchParams = () =>
	typeof window === "undefined"
		? new URLSearchParams()
		: new URLSearchParams(window.location.search)

export default function usePaginatedTableState({
	syncOn,
	buildUrl,
}: {
	syncOn: unknown
	buildUrl: (query: PaginatedTableQuery) => string
}) {
	const [query, setQuery] = useState(() => getSearchParams().get("query") ?? "")
	const [pageSize, setPageSize] = useState(
		() => getSearchParams().get("per_page") ?? DEFAULT_PAGE_SIZE,
	)

	useEffect(() => {
		const params = getSearchParams()
		setQuery(params.get("query") ?? "")
		setPageSize(params.get("per_page") ?? DEFAULT_PAGE_SIZE)
	}, [syncOn])

	const visit = (overrides?: PaginatedTableQuery) => {
		const nextQuery =
			overrides && "query" in overrides
				? overrides.query
					? overrides.query
					: undefined
				: query !== ""
					? query
					: undefined

		router.visit(
			buildUrl({
				page: overrides?.page,
				per_page: overrides?.per_page ?? pageSize,
				query: nextQuery,
			}),
			{ preserveState: true, preserveScroll: true },
		)
	}

	const handleQueryChange = (value: string) => {
		setQuery(value)
		visit({ query: value, page: "1" })
	}

	const handlePageSizeChange = (value: string) => {
		setPageSize(value)
		visit({ per_page: value, page: "1" })
	}

	return {
		query,
		handleQueryChange,
		pageSize,
		handlePageSizeChange,
	}
}
