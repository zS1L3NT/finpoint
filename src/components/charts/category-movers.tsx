"use client"

import { UiIcon } from "@/components/icon"
import { cn, formatCurrency } from "@/lib/utils"

type Mover = {
	id: string
	name: string
	icon: string
	color: string
	spending: number
	comparison: number | null
}

/**
 * Diverging bars: which categories moved most against their average. Answers
 * "why is this month different?" directly, which the 100% mix chart cannot.
 */
export default function CategoryMovers({
	categories,
	comparisonCount,
	limit = 6,
}: {
	categories: Mover[]
	comparisonCount: number
	limit?: number
}) {
	const movers = categories
		.filter(category => category.comparison !== null && Math.abs(category.comparison) >= 0.5)
		.sort((a, b) => Math.abs(b.comparison ?? 0) - Math.abs(a.comparison ?? 0))
		.slice(0, limit)
	const max = Math.max(...movers.map(category => Math.abs(category.comparison ?? 0)), 1)

	if (!comparisonCount || !movers.length) {
		return (
			<p className="py-6 text-center text-sm text-muted-foreground">
				Not enough history to compare categories yet.
			</p>
		)
	}

	return (
		<div className="grid gap-1">
			<div className="flex justify-between px-1 pb-1 text-[0.6875rem] text-muted-foreground">
				<span>← Spent less</span>
				<span>Spent more →</span>
			</div>
			{movers.map(category => {
				const difference = category.comparison ?? 0
				const scale = Math.abs(difference) / max
				const up = difference > 0
				const average = category.spending - difference
				return (
					<div
						key={category.id}
						className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] items-center gap-3 rounded-md px-1 py-1.5 transition-colors duration-150 hover:bg-muted/50 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]"
						title={`${category.name}: ${formatCurrency(category.spending)} vs ${formatCurrency(average)} average`}
					>
						<span className="flex min-w-0 items-center gap-2 text-sm">
							<span
								className="grid size-6 shrink-0 place-items-center rounded-md"
								style={{ backgroundColor: category.color }}
							>
								<UiIcon icon={category.icon} className="size-3.5 text-white" />
							</span>
							<span className="truncate">{category.name}</span>
						</span>
						<div className="relative h-7">
							<span className="absolute inset-y-0 left-1/2 w-px bg-border" />
							<span
								className={cn(
									"absolute top-1/2 h-3 w-1/2 transition-transform duration-300 ease-out",
									up
										? "left-1/2 origin-left rounded-r-[4px] bg-chart-8"
										: "right-1/2 origin-right rounded-l-[4px] bg-chart-1",
								)}
								style={{ transform: `translateY(-50%) scaleX(${scale})` }}
							/>
							<span
								className={cn(
									"absolute top-1/2 -translate-y-1/2 text-xs font-medium whitespace-nowrap tabular-nums",
									up ? "right-[calc(50%+0.375rem)]" : "left-[calc(50%+0.375rem)]",
								)}
							>
								{up ? "+" : "−"}
								{formatCurrency(Math.abs(difference))}
							</span>
						</div>
					</div>
				)
			})}
			<p className="px-1 pt-1 text-xs text-muted-foreground">
				Against the {comparisonCount}-month average over the same period.
			</p>
		</div>
	)
}
