"use client"

import Link from "next/link"
import { UiIcon } from "@/components/icon"
import { useHistory } from "@/history"
import { themeColor } from "@/lib/palette"
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
 * Categories that moved most against their average, as a Revolut-style list:
 * this month's amount with a coloured ▲/▼ change against the average.
 */
export default function CategoryMovers({
	categories,
	comparisonCount,
	recordHref,
	limit = 6,
}: {
	categories: Mover[]
	comparisonCount: number
	recordHref: (id: string) => string
	limit?: number
}) {
	const { handlePush } = useHistory()
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
					<Link
						key={category.id}
						href={recordHref(category.id)}
						onClick={handlePush("overview")}
						className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150 ease-out hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<span
							className="grid size-9 shrink-0 place-items-center rounded-full"
							style={{ backgroundColor: themeColor(category.color) }}
						>
							<UiIcon icon={category.icon} className="size-4 text-white" />
						</span>
						<span className="grid min-w-0">
							<span className="truncate text-sm font-medium">{category.name}</span>
							<span className="truncate text-xs text-muted-foreground tabular-nums">
								vs {formatCurrency(category.spending - difference)} average
							</span>
						</span>
						<span className="grid justify-items-end">
							<span className="text-sm font-medium tabular-nums">
								{formatCurrency(category.spending)}
							</span>
							<span
								className={cn(
									"text-xs font-medium tabular-nums",
									up ? "text-destructive" : "text-creative",
								)}
							>
								{up ? "▲" : "▼"} {formatCurrency(Math.abs(difference))}
							</span>
						</span>
					</Link>
				)
			})}
			<p className="px-2 pt-1 text-xs text-muted-foreground">
				Against the {comparisonCount}-month average over the same period. Red spent more;
				green spent less.
			</p>
		</div>
	)
}
