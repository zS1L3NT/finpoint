import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import { useId } from "react"
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts"
import { useChartIntro } from "@/components/charts/chart-intro"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useHistory } from "@/history"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatChartCurrency } from "@/lib/chart-currency"
import { dayTicks } from "@/lib/chart-days"
import { cn, formatCurrency } from "@/lib/utils"
import type { CashflowHistoryMonth } from "@/logic/dashboard"
import { pathMonthlyRecords } from "@/routes"

type SurplusPoint = { day: number; surplus: number | null }

export default function TotalSpendingChart({
	data,
	history,
	month,
	year,
}: {
	data: SurplusPoint[]
	history: CashflowHistoryMonth[]
	month: string
	year: number
}) {
	const intro = useChartIntro(`${month}-${year}`)
	const isMobile = useIsMobile()
	const router = useRouter()
	const { handlePush } = useHistory()
	const fillId = `surplus-fill-${useId().replace(/:/g, "")}`
	const ticks = dayTicks(data.length)
	const historyLines = history.map(item => ({
		...item,
		key: `previous_${item.offset}`,
		opacity: item.offset === 1 ? 0.6 : 0.3,
		dash: item.offset === 1 ? "4 4" : "1 5",
	}))
	const chartData = Array.from(
		{ length: Math.max(data.length, ...history.map(item => item.surplus.length)) },
		(_, index) => ({
			day: index + 1,
			surplus: data[index]?.surplus ?? null,
			...Object.fromEntries(
				historyLines.map(item => [item.key, item.surplus[index] ?? null]),
			),
		}),
	)
	const axis = surplusAxis([
		...data,
		...history.flatMap(item =>
			item.surplus.map((surplus, index) => ({ day: index + 1, surplus })),
		),
	])
	const zeroOffset = surplusZeroOffset(data)
	const openDay = (state: { activeLabel?: number | string } | null) => {
		if (!state?.activeLabel || Number(state.activeLabel) > data.length) return
		const selected = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
			.set({ day: Number(state.activeLabel) })
			.toFormat("yyyy-MM-dd")
		handlePush("overview")()
		void router.push(
			pathMonthlyRecords({
				month,
				year: String(year),
				start_date: selected,
				end_date: selected,
			}),
		)
	}

	return (
		<div className="grid gap-2">
			<ChartContainer
				className="h-52 w-full min-w-0 aspect-auto [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-ring cursor-pointer sm:h-64"
				config={{
					surplus: { label: "Surplus / Shortfall", color: "var(--color-white)" },
				}}
			>
				<ComposedChart
					data={chartData}
					margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
					onClick={openDay}
					style={{ cursor: "pointer" }}
					accessibilityLayer
				>
					<defs>
						<linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
							<stop
								offset={`${zeroOffset}%`}
								stopColor="var(--color-emerald-500)"
								stopOpacity={0.18}
							/>
							<stop
								offset={`${zeroOffset}%`}
								stopColor="var(--color-rose-500)"
								stopOpacity={0.18}
							/>
						</linearGradient>
					</defs>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="day"
						ticks={ticks}
						interval={0}
						height={24}
						tickMargin={isMobile ? 4 : 8}
					/>
					<YAxis
						domain={axis.domain}
						ticks={axis.ticks}
						interval={0}
						width={isMobile ? 40 : 48}
						tickFormatter={formatChartCurrency}
					/>
					<ReferenceLine y={0} stroke="var(--border)" strokeWidth={1.5} />
					<ChartTooltip
						content={
							<ChartTooltipContent
								labelFormatter={(_, payload) =>
									`${month} ${payload[0]?.payload.day}`
								}
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
					{historyLines.map(item => (
						<Line
							key={item.key}
							dataKey={item.key}
							name={item.month}
							stroke="var(--foreground)"
							strokeOpacity={item.opacity}
							strokeWidth={2}
							strokeDasharray={item.dash}
							strokeLinecap="round"
							dot={false}
							activeDot={{
								r: 4,
								fill: "var(--foreground)",
								fillOpacity: item.opacity,
							}}
							isAnimationActive={false}
						/>
					))}
					<Area
						dataKey="surplus"
						baseValue={0}
						fill={`url(#${fillId})`}
						stroke="none"
						dot={false}
						activeDot={false}
						tooltipType="none"
						legendType="none"
						{...intro}
					/>
					<Line
						dataKey="surplus"
						name="Surplus / Shortfall"
						stroke="var(--color-surplus)"
						strokeWidth={2.5}
						dot={false}
						{...intro}
					/>
				</ComposedChart>
			</ChartContainer>
			<div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
				{historyLines.map(item => (
					<span key={item.key} className="flex items-center gap-1.5">
						<svg width="20" height="4" aria-hidden="true">
							<line
								x1="1"
								y1="2"
								x2="19"
								y2="2"
								stroke="var(--foreground)"
								strokeOpacity={item.opacity}
								strokeWidth={2}
								strokeDasharray={item.dash}
								strokeLinecap="round"
							/>
						</svg>
						{item.month}
					</span>
				))}
				<LegendItem color="bg-emerald-500" label="Surplus above $0" />
				<LegendItem color="bg-rose-500" label="Shortfall below $0" />
				<LegendItem color="bg-white" label="Total balance" />
			</div>
		</div>
	)
}

function LegendItem({
	color,
	label,
}: {
	color: "bg-emerald-500" | "bg-rose-500" | "bg-white"
	label: string
}) {
	return (
		<span className="flex items-center gap-1.5">
			<span
				className={cn(
					"size-2 rounded-sm",
					color,
					color === "bg-white" && "ring-1 ring-foreground/20",
				)}
			/>
			{label}
		</span>
	)
}

function surplusAxis(data: SurplusPoint[]): {
	domain: [number, number]
	ticks: number[]
} {
	const values = data.flatMap(point => (point.surplus === null ? [] : [point.surplus]))
	const minimum = Math.min(0, ...values)
	const maximum = Math.max(0, ...values)
	if (minimum === maximum) {
		return { domain: [-1, 1], ticks: [-1, -0.5, 0, 0.5, 1] }
	}

	const step = niceStep((maximum - minimum) / 4)
	const domainMinimum = minimum < 0 ? Math.floor(minimum / step) * step : 0
	const domainMaximum = maximum > 0 ? Math.ceil(maximum / step) * step : 0
	const intervalCount = Math.round((domainMaximum - domainMinimum) / step)
	const ticks = Array.from({ length: intervalCount + 1 }, (_, index) =>
		roundTick(domainMinimum + step * index),
	)

	return {
		domain: [roundTick(domainMinimum), roundTick(domainMaximum)],
		ticks,
	}
}

function niceStep(roughStep: number): number {
	const magnitude = 10 ** Math.floor(Math.log10(roughStep))
	const normalized = roughStep / magnitude
	const factor =
		normalized <= 1
			? 1
			: normalized <= 2
				? 2
				: normalized <= 2.5
					? 2.5
					: normalized <= 5
						? 5
						: 10

	return factor * magnitude
}

function roundTick(value: number): number {
	return Math.round(value * 1e10) / 1e10
}

function surplusZeroOffset(data: SurplusPoint[]): number {
	const values = data.flatMap(point => (point.surplus === null ? [] : [point.surplus]))
	const minimum = Math.min(0, ...values)
	const maximum = Math.max(0, ...values)

	return minimum === maximum ? 50 : (maximum / (maximum - minimum)) * 100
}
