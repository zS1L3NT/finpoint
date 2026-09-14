import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatCurrency } from "@/lib/utils"

function compactCurrency(value: number): string {
	return formatCurrency(value).replace(/\.00$/, "")
}

export default function WeekdayBars({
	stats,
}: {
	stats: { day: string; spending: number; baseline: number }[]
}) {
	const isMobile = useIsMobile()

	return (
		<div className="grid gap-3">
			<div className="flex flex-wrap gap-x-4 gap-y-1.5">
				<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<span className="size-2 rounded-full bg-emerald-500" />
					This month
				</span>
				<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<span className="size-2 rounded-full bg-muted-foreground/35" />
					Usual
				</span>
			</div>
			<ChartContainer
				className="h-64 w-full aspect-auto sm:h-72"
				config={{
					spending: { label: "This month", color: "var(--color-emerald-500)" },
					baseline: { label: "Usual", color: "var(--color-muted-foreground)" },
				}}
			>
				<BarChart data={stats} accessibilityLayer barCategoryGap="28%">
					<CartesianGrid vertical={false} />
					<XAxis dataKey="day" tickMargin={8} tickLine={false} axisLine={false} />
					<YAxis width={isMobile ? 44 : 64} tickFormatter={compactCurrency} />
					<ChartTooltip
						content={
							<ChartTooltipContent
								labelFormatter={label => `${label}s`}
								formatter={(value, name) => (
									<div className="flex min-w-40 items-center justify-between gap-4">
										<span className="text-muted-foreground">
											{String(name)}
										</span>
										<span className="font-medium tabular-nums">
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
						isAnimationActive={false}
					/>
					<Bar
						dataKey="baseline"
						name="Usual"
						fill="var(--color-muted-foreground)"
						fillOpacity={0.35}
						radius={[4, 4, 0, 0]}
						isAnimationActive={false}
					/>
				</BarChart>
			</ChartContainer>
		</div>
	)
}
