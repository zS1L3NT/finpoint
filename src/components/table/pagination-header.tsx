import { UiIcon as IconifyIcon } from "@/components/icon"
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
				<div className="relative w-full md:w-sm">
					<IconifyIcon
						icon="lucide:search"
						className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						type="search"
						aria-label={searchPlaceholder.replace(/\.+$/, "")}
						className="border-border bg-input/20 pl-8 dark:bg-input/30"
						placeholder={searchPlaceholder}
						value={query}
						onChange={e => onQueryChange(e.target.value)}
					/>
				</div>

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
