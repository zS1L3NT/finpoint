import { useNavigate } from "react-router-dom"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatCurrency } from "@/lib/utils"
import { pathMonthlyRecords } from "@/routes"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function compactCurrency(value: number): string {
	return formatCurrency(value).replace(/\.00$/, "")
}

function currencyTooltip(value: unknown, name: unknown) {
	return (
		<div className="flex min-w-40 items-center justify-between gap-4">
			<span className="text-muted-foreground">{String(name)}</span>
			<span className="font-medium tabular-nums">{formatCurrency(Number(value))}</span>
		</div>
	)
}

export default function WeekdayCharts({
	stats,
	series,
	month,
	year,
}: {
	stats: { day: string; spending: number; baseline: number }[]
	series: Record<string, number | null>[]
	month: string
	year: number
}) {
	const isMobile = useIsMobile()
	const navigate = useNavigate()
	const daily = series.map(point => {
		const values = WEEKDAYS.map(name => point[name])
		return {
			day: point.day,
			spending: values.every(value => value === null)
				? null
				: values.reduce<number>((sum, value) => sum + (value ?? 0), 0),
		}
	})
	const interval = isMobile ? Math.max(Math.floor(daily.length / 4), 0) : "preserveStartEnd"
	const openDay = (state: { activeLabel?: number | string } | null) => {
		if (!state?.activeLabel) return
		void navigate(
			pathMonthlyRecords({
				month,
				year: String(year),
				day: String(Number(state.activeLabel)),
			}),
		)
	}

	return (
		<div className="grid gap-6">
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
									formatter={currencyTooltip}
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

			<div className="grid gap-3">
				<p className="text-sm font-medium">Daily spending this month</p>
				<ChartContainer
					className="h-64 w-full aspect-auto cursor-crosshair sm:h-72"
					config={{
						spending: { label: "Spending", color: "var(--color-emerald-500)" },
					}}
				>
					<LineChart data={daily} onClick={openDay} accessibilityLayer>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="day" interval={interval} tickMargin={8} />
						<YAxis width={isMobile ? 44 : 64} tickFormatter={compactCurrency} />
						<ChartTooltip
							content={
								<ChartTooltipContent
									labelFormatter={label => `${month} ${label}`}
									formatter={currencyTooltip}
								/>
							}
						/>
						<Line
							dataKey="spending"
							stroke="var(--color-emerald-500)"
							strokeWidth={2}
							dot={false}
							isAnimationActive={false}
						/>
					</LineChart>
				</ChartContainer>
			</div>
		</div>
	)
}
