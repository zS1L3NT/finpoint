import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useChartIntro } from "@/components/charts/chart-intro"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatChartCurrency } from "@/lib/chart-currency"
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
	const intro = useChartIntro("mount")
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
				className="h-48 w-full min-w-0 aspect-auto [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-ring sm:h-64"
				config={{
					spending: { label: "This month", color: "var(--color-emerald-500)" },
					baseline: { label: baselineLabel, color: "var(--color-muted-foreground)" },
				}}
			>
				<BarChart
					data={stats}
					margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
					accessibilityLayer
					barCategoryGap="28%"
				>
					<CartesianGrid vertical={false} />
					<XAxis
						height={24}
						dataKey="day"
						tickMargin={isMobile ? 4 : 8}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis width={isMobile ? 40 : 48} tickFormatter={formatChartCurrency} />
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
											<p className="text-[0.6875rem]">
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
