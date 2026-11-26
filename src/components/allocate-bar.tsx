import { classForCurrency, cn, formatCurrency } from "@/lib/utils"

export default function AllocateBar({
	title,
	value,
	total,
}: {
	title: string
	value: number
	total: number
}) {
	const percent = total === 0 ? 0 : (value / total) * 100
	return (
		<div className="flex flex-col gap-2 tabular-nums">
			<div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
				<span>{title}</span>
				<div className="flex flex-wrap gap-x-1">
					<span
						className={cn(
							"text-muted-foreground whitespace-nowrap",
							classForCurrency(value),
						)}
					>
						{formatCurrency(value)}
					</span>
					<span>/</span>
					<span className={cn("font-bold whitespace-nowrap", classForCurrency(total))}>
						{formatCurrency(total)}
					</span>
				</div>
			</div>
			<div
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round(Math.min(Math.max(percent, 0), 100))}
				className="relative h-1 w-full overflow-hidden rounded-md bg-muted"
			>
				<div
					className="h-full origin-left bg-current transition-transform duration-300 ease-out motion-reduce:transition-none"
					style={{ transform: `scaleX(${Math.min(Math.max(percent, 0), 100) / 100})` }}
				/>
				{percent > 100 ? (
					<div
						className="absolute inset-0 origin-left bg-destructive transition-transform duration-300 ease-out motion-reduce:transition-none"
						style={{ transform: `scaleX(${Math.min(percent - 100, 100) / 100})` }}
					/>
				) : null}
			</div>
		</div>
	)
}

/** Why a Record whose amount differs from its Allocations stays Pending, and the one-step fix. */
export function AllocationMismatch({
	allocated,
	onUseAllocated,
}: {
	allocated: number
	onUseAllocated: () => void
}) {
	// One quiet line in the Amount field's note slot: the state, the total and the fix.
	return (
		<p
			role="status"
			className="flex flex-wrap items-baseline gap-x-1.5 text-xs/relaxed tabular-nums"
		>
			<span className="font-medium text-amber-700 dark:text-amber-400">Pending</span>
			<span aria-hidden className="text-muted-foreground">
				·
			</span>
			<span className="text-muted-foreground">
				{allocated === 0
					? "No Statements allocated"
					: `Allocated ${formatCurrency(allocated)}`}
			</span>
			<span className="sr-only">
				This Record stays Pending until its amount equals its Allocations.
			</span>
			{allocated !== 0 ? (
				<button
					type="button"
					aria-label={`Use total ${formatCurrency(allocated)}`}
					className="cursor-pointer rounded-sm font-medium text-foreground underline decoration-current/40 underline-offset-2 transition-colors duration-150 ease-out hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onClick={onUseAllocated}
				>
					Use total
				</button>
			) : null}
		</p>
	)
}
