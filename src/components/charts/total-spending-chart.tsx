import { useId } from "react"
import { useNavigate } from "react-router-dom"
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn, formatCurrency } from "@/lib/utils"
import { pathMonthlyRecords } from "@/routes"

type SurplusPoint = { day: number; surplus: number | null }

export default function TotalSpendingChart({
	data,
	month,
	year,
}: {
	data: SurplusPoint[]
	month: string
	year: number
}) {
	const isMobile = useIsMobile()
	const navigate = useNavigate()
	const fillId = `surplus-fill-${useId().replace(/:/g, "")}`
	const interval = isMobile ? Math.max(Math.floor(data.length / 4), 0) : "preserveStartEnd"
	const axis = surplusAxis(data)
	const zeroOffset = surplusZeroOffset(data)
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
		<div className="grid gap-2">
			<ChartContainer
				className="h-48 w-full aspect-auto cursor-crosshair sm:h-54"
				config={{
					surplus: { label: "Surplus / Shortfall", color: "var(--color-white)" },
				}}
			>
				<ComposedChart data={data} onClick={openDay} accessibilityLayer>
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
					<XAxis dataKey="day" interval={interval} tickMargin={8} />
					<YAxis
						domain={axis.domain}
						ticks={axis.ticks}
						width={isMobile ? 44 : 64}
						tickFormatter={value => formatCurrency(Number(value)).replace(/\.00$/, "")}
					/>
					<ReferenceLine y={0} stroke="var(--border)" strokeWidth={1.5} />
					<ChartTooltip
						content={
							<ChartTooltipContent
								labelFormatter={label => `${month} ${label}`}
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
					<Area
						dataKey="surplus"
						baseValue={0}
						fill={`url(#${fillId})`}
						stroke="none"
						dot={false}
						activeDot={false}
						tooltipType="none"
						legendType="none"
						isAnimationActive={false}
					/>
					<Line
						dataKey="surplus"
						name="Surplus / Shortfall"
						stroke="var(--color-surplus)"
						strokeWidth={2.5}
						dot={false}
						isAnimationActive={false}
					/>
				</ComposedChart>
			</ChartContainer>
			<div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
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
