"use client"

import { UiIcon } from "@/components/icon"
import { themeColor } from "@/lib/palette"
import { cn, formatCurrency } from "@/lib/utils"
import type { Selection } from "@/logic/drilldown"

type Mover = {
	id: string
	name: string
	icon: string
	color: string
	spending: number
	comparison: number | null
}

/**
 * Categories with the largest spending changes against their same-period average.
 */
export default function CategoryMovers({
	categories,
	comparisonCount,
	comparisonMonths = [],
	period = "Same period",
	onDrill,
	limit = 6,
}: {
	categories: Mover[]
	comparisonCount: number
	comparisonMonths?: string[]
	period?: string
	onDrill: (selection: Selection) => void
	limit?: number
}) {
	const movers = categories
		.filter(category => category.comparison !== null && Math.abs(category.comparison) >= 0.5)
		.sort((a, b) => Math.abs(b.comparison ?? 0) - Math.abs(a.comparison ?? 0))
		.slice(0, limit)

	if (!comparisonCount || !movers.length) {
		return (
			<p className="py-6 text-center text-xs text-muted-foreground">
				Not enough history to compare categories yet.
			</p>
		)
	}

	return (
		<div className="grid gap-1">
			{movers.map(category => {
				const difference = category.comparison ?? 0
				const up = difference > 0
				return (
					<button
						type="button"
						key={category.id}
						onClick={() => onDrill({ kind: "compare", value: category.id })}
						className="cursor-pointer text-left grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150 ease-out hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<span
							className="grid size-9 shrink-0 place-items-center rounded-full"
							style={{ backgroundColor: themeColor(category.color) }}
						>
							<UiIcon icon={category.icon} className="size-4 text-white" />
						</span>
						<span className="grid min-w-0">
							<span className="truncate text-sm font-medium">{category.name}</span>
							<span className="whitespace-normal text-xs text-muted-foreground tabular-nums">
								{formatCurrency(Math.abs(difference))} {up ? "more" : "less"} than
								your {comparisonCount}-month average
							</span>
						</span>
						<span className="grid justify-items-end">
							<span className="text-sm font-medium tabular-nums">
								{formatCurrency(category.spending)}
							</span>
							<span
								className={cn(
									"text-xs tabular-nums",
									period.startsWith("Days")
										? "text-muted-foreground"
										: up
											? "text-destructive"
											: "text-creative",
								)}
							>
								{up ? "▲" : "▼"} {formatCurrency(Math.abs(difference))}
							</span>
						</span>
					</button>
				)
			})}
			<p className="px-2 pt-1 text-xs text-muted-foreground">
				Comparison window: {period} · {comparisonMonths.join(", ")}. Open a row to compare
				Records.
			</p>
		</div>
	)
}
