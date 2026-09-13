// Client-side pagination (replaces Laravel's `->paginate()`).
// Every list page filters in `logic/*`, then slices here so the table
// component keeps its existing `Paginated<T>` shape.

import type { Paginated } from "@/types"

export function paginateItems<T>(items: T[], page: number, perPage: number): Paginated<T> {
	const safePerPage = Math.min(Math.max(1, perPage || 100), 250)
	const total = items.length
	const last_page = Math.max(1, Math.ceil(total / safePerPage))
	const current_page = Math.min(Math.max(1, page || 1), last_page)
	return {
		data: items.slice((current_page - 1) * safePerPage, current_page * safePerPage),
		links: [],
		total,
		per_page: safePerPage,
		current_page,
		last_page,
	}
}

export function parsePage(value: string | null, fallback = 1): number {
	const page = Number(value ?? fallback)
	return Number.isFinite(page) && page >= 1 ? Math.floor(page) : fallback
}

export function parsePageSize(value: string | null, fallback = 100): number {
	const size = Number(value ?? fallback)
	if (!Number.isFinite(size)) return fallback
	return Math.min(Math.max(1, Math.floor(size)), 250)
}
