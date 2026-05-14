import { Input } from "@/components/ui/input"

export default function PaginationHeader({
	query,
	onQueryChange,
	pageSize,
	onPageSizeChange,
	searchPlaceholder,
	filters,
	actions,
}: {
	query: string
	onQueryChange: (value: string) => void
	pageSize: string
	onPageSizeChange: (value: string) => void
	searchPlaceholder: string
	filters?: React.ReactNode
	actions?: React.ReactNode
}) {
	return (
		<div className="flex items-end justify-between gap-4">
			<div className="flex flex-col 2xl:flex-row gap-2">
				<Input
					className="w-sm"
					placeholder={searchPlaceholder}
					value={query}
					onChange={e => onQueryChange(e.target.value)}
				/>

				{filters}
			</div>

			<div className="flex items-center gap-2">{actions}</div>
		</div>
	)
}
