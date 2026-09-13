import { useSearchParams } from "react-router-dom"
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
		out.push(pages[i])
		if (i < pages.length - 1 && pages[i + 1] - pages[i] > 1) out.push("…")
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
	const [searchParams] = useSearchParams()
	const current = Math.min(Math.max(1, page), Math.max(1, lastPage))

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-xs text-muted-foreground">{summary}</p>

			<Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
				<PaginationContent className="flex-wrap">
					<PaginationItem>
						<PaginationPrevious
							to={pageHref(searchParams, current - 1)}
							className={current <= 1 ? "pointer-events-none opacity-50" : undefined}
							aria-disabled={current <= 1}
						/>
					</PaginationItem>
					{pageWindow(current, Math.max(1, lastPage)).map(item =>
						item === "…" ? (
							<PaginationItem key={`ellipsis-${current}`}>
								<PaginationEllipsis />
							</PaginationItem>
						) : (
							<PaginationItem key={item}>
								<PaginationLink
									to={pageHref(searchParams, item)}
									isActive={item === current}
								>
									{item}
								</PaginationLink>
							</PaginationItem>
						),
					)}
					<PaginationItem>
						<PaginationNext
							to={pageHref(searchParams, current + 1)}
							className={
								current >= lastPage ? "pointer-events-none opacity-50" : undefined
							}
							aria-disabled={current >= lastPage}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
}
