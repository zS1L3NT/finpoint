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
		<div className="flex flex-col gap-4">
			<div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:justify-between">
				<Input
					className="w-full border-border bg-input/20 dark:bg-input/30 md:w-sm"
					placeholder={searchPlaceholder}
					value={query}
					onChange={e => onQueryChange(e.target.value)}
				/>

				{actions ? (
					<div className="flex flex-col gap-2 sm:flex-row md:items-center md:justify-end">
						{actions}
					</div>
				) : null}
			</div>

			{filters ? <div className="min-w-0">{filters}</div> : null}
		</div>
	)
}
