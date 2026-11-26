"use client"

import Link from "next/link"
import { UiIcon } from "@/components/icon"
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
 * Categories that moved most against their average. Its rows match the category spending
 * list, but lead with the coloured ▲/▼ change, with this month's amount beneath it.
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

	// Every bar shares one scale, so the biggest change reaches the end of its half.
	const largest = Math.max(...movers.map(category => Math.abs(category.comparison ?? 0)))

	return (
		<div className="grid gap-0.5">
			{movers.map(category => {
				const difference = category.comparison ?? 0
				const up = difference > 0
				const average = category.spending - difference
				const half = largest ? (Math.abs(difference) / largest) * 50 : 0
				return (
					<Link
						key={category.id}
						href={recordHref(category.id)}
						scroll={false}
						className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 rounded-lg px-2 py-1.5 transition-colors duration-150 ease-out hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<span
							aria-hidden
							className="row-span-2 grid size-8 place-items-center rounded-full"
							style={{ backgroundColor: themeColor(category.color) }}
						>
							<UiIcon icon={category.icon} className="size-4 text-white" />
						</span>
						<span className="grid min-w-0">
							<span className="truncate text-sm font-medium">{category.name}</span>
							<span className="truncate text-xs text-muted-foreground tabular-nums">
								{formatCurrency(category.spending)} vs {formatCurrency(average)}{" "}
								average
							</span>
						</span>
						<span className="grid justify-items-end">
							<span
								className={cn(
									"text-sm font-medium tabular-nums",
									up ? "text-destructive" : "text-creative",
								)}
							>
								{up ? "▲" : "▼"} {formatCurrency(Math.abs(difference))}{" "}
								{up ? "more" : "less"}
							</span>
							<span className="text-xs text-muted-foreground tabular-nums">
								{average > 0
									? `${up ? "+" : "−"}${Math.round((Math.abs(difference) / average) * 100)}%`
									: "New"}
							</span>
						</span>
						{/* Diverging from the average: less grows left, more grows right. */}
						<span
							aria-hidden
							className="relative col-span-2 h-1.5 rounded-full bg-muted"
						>
							{/* The average: a tick that stands just proud of the track. */}
							<span className="absolute -inset-y-0.5 left-1/2 w-px -translate-x-1/2 bg-muted-foreground/50" />
							<span
								className={cn(
									"absolute inset-y-0 rounded-full",
									up ? "left-1/2 bg-destructive" : "right-1/2 bg-creative",
								)}
								style={{ width: `${half}%` }}
							/>
						</span>
					</Link>
				)
			})}
			<p className="px-2 pt-1 text-[0.6875rem] leading-relaxed text-muted-foreground">
				Against the {comparisonCount}-month average over the same period, marked by the
				centre tick: red bars grow right for more, green bars grow left for less.
			</p>
		</div>
	)
}
