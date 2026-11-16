import { DateTime } from "luxon"
import TrendChart from "@/components/charts/trend-chart"
import { formatCurrency } from "@/lib/utils"
import type { BudgetProgressPoint } from "@/logic/budgets"

const OUTSIDE = {
	before: { tick: "Before", label: "Before the window" },
	after: { tick: "After", label: "After the window" },
} as const

export default function BudgetProgressChart({
	points,
	limit,
}: {
	points: BudgetProgressPoint[]
	limit: number
}) {
	const named = points.map(point => {
		if (point.key === "before" || point.key === "after") return OUTSIDE[point.key]
		const date = DateTime.fromISO(point.key)
		// The readout label carries the year, since a Budget can cross into a new year.
		return { tick: date.toFormat("d MMM"), label: date.toFormat("d MMM yyyy") }
	})
	const last = points.length - 1

	return (
		<div className="grid gap-2">
			<p className="text-xs font-medium text-muted-foreground">Cumulative spending · SGD</p>
			<TrendChart
				label="Cumulative budget spending by day"
				className="h-72 w-full sm:h-80"
				labels={named.map(point => point.label)}
				ticks={[...new Set([0, Math.round(last / 3), Math.round((last * 2) / 3), last])]
					.filter(index => index >= 0)
					.map(index => ({ index, label: named[index]?.tick ?? "" }))}
				split={limit}
				reference={{ value: limit, label: "Budget limit" }}
				notes={points.map(point =>
					point.scheduled
						? { label: "Scheduled", value: formatCurrency(point.scheduled) }
						: null,
				)}
				series={[
					{
						key: "projection",
						label: "Usage (projection)",
						values: points.map(point => point.projection),
						color: "var(--color-amber-400)",
						over: "var(--color-orange-500)",
						dash: "7 5",
						fill: 0.12,
						markers: points.flatMap((point, index) => (point.scheduled ? [index] : [])),
					},
					{
						key: "usage",
						label: "Usage",
						values: points.map(point => point.usage),
						color: "var(--color-emerald-500)",
						over: "var(--color-rose-500)",
						fill: 0.3,
					},
				]}
			/>
		</div>
	)
}
