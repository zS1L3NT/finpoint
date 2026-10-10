"use client"

import { useSearchParams } from "next/navigation"
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"

function pageHref(searchParams: URLSearchParams, page: number): string {
	const next = new URLSearchParams(searchParams)
	if (page <= 1) next.delete("page")
	else next.set("page", String(page))
	const suffix = next.toString()
	return suffix ? `?${suffix}` : "?"
}

function pageWindow(current: number, last: number): (number | "…")[] {
	if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
	const window = new Set([1, 2, current - 1, current, current + 1, last - 1, last])
	const pages = [...window].filter(p => p >= 1 && p <= last).sort((a, b) => a - b)
	const out: (number | "…")[] = []
	for (let i = 0; i < pages.length; i++) {
		const page = pages[i]
		if (page === undefined) continue
		out.push(page)
		const next = pages[i + 1]
		if (next !== undefined && next - page > 1) out.push("…")
	}
	return out
}

export default function PaginationFooter({
	summary,
	page,
	lastPage,
}: {
	summary: React.ReactNode
	page: number
	lastPage: number
	links?: unknown
}) {
	const searchParams = useSearchParams()
	const current = Math.min(Math.max(1, page), Math.max(1, lastPage))
	const atStart = current <= 1
	const atEnd = current >= lastPage
	// Disabled ends stay in place for layout, but leave the tab order and never point past the range.
	const edge = (disabled: boolean) =>
		disabled
			? { className: "pointer-events-none opacity-50", "aria-disabled": true, tabIndex: -1 }
			: {}

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="text-xs text-muted-foreground">{summary}</div>

			<Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
				<PaginationContent className="flex-wrap">
					<PaginationItem>
						<PaginationPrevious
							href={pageHref(searchParams, atStart ? current : current - 1)}
							{...edge(atStart)}
						/>
					</PaginationItem>
					{pageWindow(current, Math.max(1, lastPage)).map((item, index) =>
						item === "…" ? (
							// Up to two gaps can show at once, so key them by position.
							<PaginationItem key={`ellipsis-${index}`}>
								<PaginationEllipsis />
							</PaginationItem>
						) : (
							<PaginationItem key={item}>
								<PaginationLink
									href={pageHref(searchParams, item)}
									isActive={item === current}
								>
									{item}
								</PaginationLink>
							</PaginationItem>
						),
					)}
					<PaginationItem>
						<PaginationNext
							href={pageHref(searchParams, atEnd ? current : current + 1)}
							{...edge(atEnd)}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
}
