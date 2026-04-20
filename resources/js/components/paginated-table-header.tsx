import type { ReactNode } from "react"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

export default function PaginatedTableHeader({
	query,
	onQueryChange,
	pageSize,
	onPageSizeChange,
	searchPlaceholder,
	children,
}: {
	query: string
	onQueryChange: (value: string) => void
	pageSize: string
	onPageSizeChange: (value: string) => void
	searchPlaceholder: string
	children?: ReactNode
}) {
	return (
		<div className="flex items-end justify-between gap-4">
			<div className="w-full max-w-sm">
				<Input
					placeholder={searchPlaceholder}
					value={query}
					onChange={e => onQueryChange(e.target.value)}
				/>
			</div>

			<div className="flex items-center gap-3">
				<div className="flex items-center gap-3">
					<span className="text-xs text-muted-foreground">Rows per page</span>
					<Select value={pageSize} onValueChange={onPageSizeChange}>
						<SelectTrigger className="w-20">
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent align="end">
							<SelectGroup>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="25">25</SelectItem>
								<SelectItem value="50">50</SelectItem>
								<SelectItem value="100">100</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				{children}
			</div>
		</div>
	)
}
