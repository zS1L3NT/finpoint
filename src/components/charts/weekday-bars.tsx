import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useChartIntro } from "@/components/charts/chart-intro"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
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

function compactCurrency(value: number): string {
	return formatCurrency(value).replace(/\.00$/, "")
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
	const intro = useChartIntro()
	const isMobile = useIsMobile()
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
			<ChartContainer
				className="h-64 w-full aspect-auto sm:h-72"
				config={{
					spending: { label: "This month", color: "var(--color-emerald-500)" },
					baseline: { label: baselineLabel, color: "var(--color-muted-foreground)" },
				}}
			>
				<BarChart data={stats} accessibilityLayer barCategoryGap="28%">
					<CartesianGrid vertical={false} />
					<XAxis dataKey="day" tickMargin={8} tickLine={false} axisLine={false} />
					<YAxis width={isMobile ? 44 : 64} tickFormatter={compactCurrency} />
					<ChartTooltip
						content={
							<ChartTooltipContent
								labelFormatter={label => `Average per ${WEEKDAYS[String(label)]}`}
								formatter={(value, name, item) => (
									<div className="grid w-full min-w-52 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
										<span
											className="size-2 rounded-full"
											style={{
												backgroundColor: item.color,
												opacity: item.dataKey === "baseline" ? 0.35 : 1,
											}}
										/>
										<div className="text-muted-foreground">
											{String(name)}
											<p className="text-[10px]">
												{item.dataKey === "spending"
													? item.payload.days
													: item.payload.baseline_days}{" "}
												{WEEKDAYS[item.payload.day]}s
											</p>
										</div>
										<span className="text-right font-medium tabular-nums">
											{formatCurrency(Number(value))}
										</span>
									</div>
								)}
							/>
						}
					/>
					<Bar
						dataKey="spending"
						name="This month"
						fill="var(--color-emerald-500)"
						radius={[4, 4, 0, 0]}
						{...intro}
					/>
					<Bar
						dataKey="baseline"
						name={baselineLabel}
						fill="var(--color-muted-foreground)"
						fillOpacity={0.35}
						radius={[4, 4, 0, 0]}
						{...intro}
					/>
				</BarChart>
			</ChartContainer>
		</div>
	)
}
