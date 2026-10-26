import BarChart from "@/components/charts/bar-chart"
import { ReadoutRows } from "@/components/charts/chart-frame"
import { formatCurrency } from "@/lib/utils"

const WEEKDAYS: Record<string, string> = {
	Mon: "Monday",
	Tue: "Tuesday",
	Wed: "Wednesday",
	Thu: "Thursday",
	Fri: "Friday",
	Sat: "Saturday",
	Sun: "Sunday",
}

export default function WeekdayBars({
	stats,
	comparisonCount,
}: {
	stats: {
		day: string
		spending: number | null
		baseline: number | null
		days: number
		baseline_days: number
	}[]
	comparisonCount: number
}) {
	const baselineLabel = `Previous ${comparisonCount} ${comparisonCount === 1 ? "month" : "months"}`

	return (
		<div className="grid gap-3">
			<div className="flex flex-wrap gap-x-4 gap-y-1.5">
				<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<span className="size-2 rounded-full bg-emerald-500" />
					This month
				</span>
				<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<span className="size-2 rounded-full bg-muted-foreground/35" />
					{baselineLabel}
				</span>
			</div>
			<BarChart
				label="Spending by weekday"
				className="h-48 w-full min-w-0 sm:h-64"
				labels={stats.map(stat => `Average per ${WEEKDAYS[stat.day]}`)}
				layout="group"
				series={[
					{
						key: "spending",
						label: "This month",
						color: "var(--color-emerald-500)",
						values: stats.map(stat => stat.spending ?? 0),
					},
					{
						key: "baseline",
						label: baselineLabel,
						color: "var(--color-muted-foreground)",
						opacity: 0.35,
						values: stats.map(stat => stat.baseline ?? 0),
					},
				]}
				tick={index => (
					<text textAnchor="middle" dy="1em">
						{stats[index]?.day}
					</text>
				)}
				readout={index => {
					const stat = stats[index]
					if (!stat) return null
					return (
						<ReadoutRows
							title={`Average per ${WEEKDAYS[stat.day]}`}
							rows={[
								...(stat.spending === null
									? []
									: [
											{
												key: "spending",
												label: `This month · ${stat.days} ${WEEKDAYS[stat.day]}s`,
												color: "var(--color-emerald-500)",
												value: formatCurrency(stat.spending),
											},
										]),
								...(stat.baseline === null
									? []
									: [
											{
												key: "baseline",
												label: `${baselineLabel} · ${stat.baseline_days} ${WEEKDAYS[stat.day]}s`,
												color: "var(--color-muted-foreground)",
												opacity: 0.35,
												value: formatCurrency(stat.baseline),
											},
										]),
							]}
						/>
					)
				}}
			/>
		</div>
	)
}
