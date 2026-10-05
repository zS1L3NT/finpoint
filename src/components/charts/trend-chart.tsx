"use client"

import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatCurrency } from "@/lib/utils"
import type { TrendMonth } from "@/logic/dashboard"

const config = {
	income: { label: "Income", color: "var(--income)" },
	spending: { label: "Spending", color: "var(--spending)" },
	surplus: { label: "Surplus / shortfall", color: "var(--foreground)" },
}

function compact(value: number) {
	const abs = Math.abs(value)
	const sign = value < 0 ? "-" : ""
	if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`
	return `${sign}$${abs.toFixed(0)}`
}

export default function TrendChart({
	months,
	onSelect,
}: {
	months: TrendMonth[]
	onSelect: (key: string) => void
}) {
	const isMobile = useIsMobile()
	const data = isMobile ? months.slice(-6) : months

	return (
		<div className="grid gap-3">
			<div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
				<LegendSwatch className="rounded-sm bg-income" label="Income" />
				<LegendSwatch className="rounded-sm bg-spending" label="Spending" />
				<LegendSwatch className="h-0.5 w-3 bg-foreground" label="Surplus / shortfall" />
			</div>
			<ChartContainer config={config} className="h-64 w-full aspect-auto sm:h-72">
				<ComposedChart
					data={data}
					barGap={2}
					barCategoryGap="22%"
					margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
					onClick={state => {
						const index = Number(state?.activeTooltipIndex)
						const month = Number.isInteger(index) ? data[index] : undefined
						if (month) onSelect(month.key)
					}}
					style={{ cursor: "pointer" }}
					accessibilityLayer
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="label"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tick={<MonthTick data={data} />}
					/>
					<YAxis
						width={52}
						tickLine={false}
						axisLine={false}
						tickFormatter={value => compact(Number(value))}
					/>
					<ReferenceLine y={0} stroke="var(--border)" />
					<ChartTooltip
						cursor={{ fill: "var(--muted)", fillOpacity: 0.5 }}
						content={<TrendTooltip />}
					/>
					<Bar
						dataKey="income"
						fill="var(--income)"
						radius={[4, 4, 0, 0]}
						maxBarSize={28}
						isAnimationActive={false}
					/>
					<Bar
						dataKey="spending"
						fill="var(--spending)"
						radius={[4, 4, 0, 0]}
						maxBarSize={28}
						isAnimationActive={false}
					/>
					<Line
						dataKey="surplus"
						stroke="var(--foreground)"
						strokeWidth={2}
						dot={{
							r: 3,
							fill: "var(--foreground)",
							stroke: "var(--card)",
							strokeWidth: 2,
						}}
						activeDot={{ r: 5 }}
						isAnimationActive={false}
					/>
				</ComposedChart>
			</ChartContainer>
		</div>
	)
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
	return (
		<span className="flex items-center gap-1.5">
			<span className={`size-2.5 ${className}`} />
			{label}
		</span>
	)
}

function MonthTick({
	x = 0,
	y = 0,
	payload,
	data,
}: {
	x?: number
	y?: number
	payload?: { value: string }
	data: TrendMonth[]
}) {
	const month = data.find(item => item.label === payload?.value)
	return (
		<text
			x={x}
			y={y}
			dy="0.9em"
			textAnchor="middle"
			className={
				month?.current
					? "fill-foreground text-[11px] font-semibold"
					: "fill-muted-foreground text-[11px]"
			}
		>
			{payload?.value}
		</text>
	)
}

function TrendTooltip({
	active,
	payload,
}: {
	active?: boolean
	payload?: { payload?: TrendMonth }[]
}) {
	const month = payload?.[0]?.payload
	if (!active || !month) return null
	const rate = month.income > 0 ? (month.surplus / month.income) * 100 : null
	return (
		<div className="grid min-w-48 gap-1.5 rounded-lg border bg-background px-3 py-2 text-xs shadow-xl">
			<p className="font-medium">
				{month.label}
				{month.partial ? " · month to date" : ""}
			</p>
			<TooltipRow swatch="bg-income" label="Income" value={month.income} />
			<TooltipRow swatch="bg-spending" label="Spending" value={month.spending} />
			<div className="mt-0.5 flex items-center justify-between gap-4 border-t pt-1.5">
				<span className="text-muted-foreground">
					{month.surplus >= 0 ? "Surplus" : "Shortfall"}
					{rate !== null ? ` · ${rate.toFixed(0)}%` : ""}
				</span>
				<span className="font-medium tabular-nums">
					{formatCurrency(Math.abs(month.surplus))}
				</span>
			</div>
			<p className="text-muted-foreground">Click to open this month</p>
		</div>
	)
}

function TooltipRow({ swatch, label, value }: { swatch: string; label: string; value: number }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<span className="flex items-center gap-2 text-muted-foreground">
				<span className={`size-2 rounded-sm ${swatch}`} />
				{label}
			</span>
			<span className="font-medium tabular-nums">{formatCurrency(value)}</span>
		</div>
	)
}
