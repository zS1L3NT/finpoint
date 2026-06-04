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
		<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
			<div className="flex min-w-0 flex-col gap-2 md:flex-row md:flex-wrap">
				<Input
					className="w-full md:w-sm"
					placeholder={searchPlaceholder}
					value={query}
					onChange={e => onQueryChange(e.target.value)}
				/>

				{filters}
			</div>

			{actions ? (
				<div className="flex flex-col gap-2 sm:flex-row md:items-center md:justify-end">
					{actions}
				</div>
			) : null}
		</div>
	)
}
