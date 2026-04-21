import type { ReactNode } from "react"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { PaginatedLink } from "@/types"

export default function PaginatedTableFooter({
	summary,
	links,
}: {
	summary: ReactNode
	links: PaginatedLink[]
}) {
	const previousLink = links[0]
	const nextLink = links.at(-1)

	return (
		<div className="flex items-center justify-between gap-4">
			<p className="text-xs text-muted-foreground">{summary}</p>

			<Pagination className="mx-0 w-auto justify-end">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href={previousLink?.url ?? "#"}
							className={
								!previousLink?.url ? "pointer-events-none opacity-50" : undefined
							}
							aria-disabled={!previousLink?.url}
						/>
					</PaginationItem>
					{links.slice(1, -1).map(link => (
						<PaginationItem key={`${link.label}-${link.url ?? "null"}`}>
							<PaginationLink
								href={link.url ?? "#"}
								className={!link.url ? "pointer-events-none opacity-50" : undefined}
								isActive={link.active}
							>
								<span dangerouslySetInnerHTML={{ __html: link.label }} />
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							href={nextLink?.url ?? "#"}
							aria-disabled={!nextLink?.url}
							className={
								!nextLink?.url ? "pointer-events-none opacity-50" : undefined
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
}
