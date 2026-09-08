import { router } from "@inertiajs/react"
import { DateTime } from "luxon"
import {
	type ActiveDotProps,
	Area,
	AreaChart,
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatCurrency } from "@/lib/utils"
import { recordsWebRoute } from "@/wayfinder/routes"

export type CashflowPoint = {
	day: number
	income: number | null
	spending: number | null
	projected_spending: number | null
	surplus: number | null
	average_spending: number | null
}

export default function CashflowChart({
	data,
	month,
	year,
	target,
	targetLabel,
}: {
	data: CashflowPoint[]
	month: string
	year: number
	target: number | null
	targetLabel: string | null
}) {
	const isMobile = useIsMobile()
	const interval = isMobile ? Math.max(Math.floor(data.length / 4), 0) : "preserveStartEnd"
	const actualChange = colorChange(data, "spending", target)
	const projectionChange = colorChange(data, "projected_spending", target)
	const openDay = (state: { activeLabel?: number | string } | null) => {
		if (!state?.activeLabel) return
		const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy").set({
			day: Number(state.activeLabel),
		})
		const isoDate = date.toISODate()
		if (!isoDate) return
		router.visit(recordsWebRoute({ query: { start_date: isoDate, end_date: isoDate } }))
	}

	const tooltip = (
		<ChartTooltipContent
			labelFormatter={label => `${month} ${label}`}
			formatter={(value, name) => (
				<div className="flex min-w-40 items-center justify-between gap-4">
					<span className="text-muted-foreground">{seriesLabel(name)}</span>
					<span className="font-medium tabular-nums">
						{formatCurrency(Number(value))}
					</span>
				</div>
			)}
		/>
	)

	return (
		<div className="grid gap-4" aria-label="Cumulative income, spending, and surplus">
			<div>
				<p className="mb-2 text-xs font-medium text-muted-foreground">
					Cumulative spending · SGD
				</p>
				<ChartContainer
					className="h-72 w-full aspect-auto cursor-crosshair sm:h-80"
					config={{
						spending: { label: "Usage", color: "var(--color-emerald-500)" },
						projected_spending: {
							label: "Usage (projection)",
							color: "var(--color-amber-400)",
						},
					}}
				>
					<AreaChart data={data} onClick={openDay} accessibilityLayer>
						<defs>
							<linearGradient id="actual-line" x1="0" y1="0" x2="1" y2="0">
								<stop
									offset={`${actualChange}%`}
									stopColor="var(--color-emerald-500)"
								/>
								<stop
									offset={`${actualChange}%`}
									stopColor="var(--color-rose-500)"
								/>
							</linearGradient>
							<linearGradient id="actual-fill" x1="0" y1="0" x2="1" y2="0">
								<stop
									offset={`${actualChange}%`}
									stopColor="var(--color-emerald-500)"
									stopOpacity={0.18}
								/>
								<stop
									offset={`${actualChange}%`}
									stopColor="var(--color-rose-500)"
									stopOpacity={0.18}
								/>
							</linearGradient>
							<linearGradient id="projection-line" x1="0" y1="0" x2="1" y2="0">
								<stop
									offset={`${projectionChange}%`}
									stopColor="var(--color-amber-400)"
								/>
								<stop
									offset={`${projectionChange}%`}
									stopColor="var(--color-orange-500)"
								/>
							</linearGradient>
							<linearGradient id="projection-fill" x1="0" y1="0" x2="1" y2="0">
								<stop
									offset={`${projectionChange}%`}
									stopColor="var(--color-amber-400)"
									stopOpacity={0.1}
								/>
								<stop
									offset={`${projectionChange}%`}
									stopColor="var(--color-orange-500)"
									stopOpacity={0.12}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" vertical />
						<XAxis dataKey="day" interval={interval} tickMargin={8} />
						<YAxis width={isMobile ? 44 : 64} tickFormatter={compactCurrency} />
						<ReferenceLine y={0} stroke="var(--border)" />
						{target !== null ? (
							<ReferenceLine
								y={target}
								stroke="var(--muted-foreground)"
								strokeDasharray="4 4"
								label={{
									value: `${targetLabel ?? "Monthly"} target`,
									position: "insideTopRight",
									fill: "var(--muted-foreground)",
									fontSize: 11,
								}}
							/>
						) : null}
						<ChartTooltip content={tooltip} />
						<Area
							dataKey="spending"
							name="Usage"
							stroke="url(#actual-line)"
							fill="url(#actual-fill)"
							strokeWidth={2.5}
							dot={false}
							activeDot={props => (
								<StatefulActiveDot
									{...props}
									field="spending"
									threshold={target}
									within="var(--color-emerald-500)"
									exceeded="var(--color-rose-500)"
								/>
							)}
						/>
						<Area
							dataKey="projected_spending"
							name="Usage (projection)"
							stroke="url(#projection-line)"
							fill="url(#projection-fill)"
							strokeWidth={2.5}
							strokeDasharray="7 5"
							dot={false}
							connectNulls
							activeDot={props =>
								props.payload.spending === null ? (
									<StatefulActiveDot
										{...props}
										field="projected_spending"
										threshold={target}
										within="var(--color-amber-400)"
										exceeded="var(--color-orange-500)"
									/>
								) : null
							}
						/>
					</AreaChart>
				</ChartContainer>
				<div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
					<LegendItem color="bg-emerald-500" label="Usage" />
					<LegendItem color="bg-rose-500" label="Exceed" />
					<LegendItem color="bg-amber-400" label="Usage (projection)" />
					<LegendItem color="bg-orange-500" label="Exceed (projection)" />
				</div>
			</div>

			<div>
				<p className="mb-2 text-xs font-medium text-muted-foreground">
					Surplus / shortfall · SGD
				</p>
				<ChartContainer
					className="h-36 w-full aspect-auto cursor-crosshair sm:h-40"
					config={{ surplus: { label: "Surplus", color: "var(--foreground)" } }}
				>
					<LineChart data={data} onClick={openDay} accessibilityLayer>
						<XAxis dataKey="day" interval={interval} tickMargin={8} />
						<YAxis width={isMobile ? 44 : 64} tickFormatter={compactCurrency} />
						<ReferenceLine y={0} stroke="var(--border)" />
						<ChartTooltip content={tooltip} />
						<Line
							dataKey="surplus"
							stroke="var(--color-surplus)"
							strokeWidth={2.5}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</div>
			<details className="rounded-md border px-3 py-2 text-xs">
				<summary className="cursor-pointer font-medium">Daily chart data</summary>
				<div className="mt-2 overflow-x-auto">
					<table className="w-full min-w-120 border-collapse text-right tabular-nums">
						<thead className="text-muted-foreground">
							<tr>
								<th className="border-b py-1 text-left font-medium">Day</th>
								<th className="border-b py-1 font-medium">Income</th>
								<th className="border-b py-1 font-medium">Spending</th>
								<th className="border-b py-1 font-medium">Projected</th>
								<th className="border-b py-1 font-medium">Surplus</th>
								<th className="border-b py-1 font-medium">Average spending</th>
							</tr>
						</thead>
						<tbody>
							{data.map(point => (
								<tr key={point.day}>
									<th className="border-b py-1 text-left font-normal">
										{point.day}
									</th>
									<td className="border-b py-1">
										{currencyOrDash(point.income)}
									</td>
									<td className="border-b py-1">
										{currencyOrDash(point.spending)}
									</td>
									<td className="border-b py-1">
										{currencyOrDash(point.projected_spending)}
									</td>
									<td className="border-b py-1">
										{currencyOrDash(point.surplus)}
									</td>
									<td className="border-b py-1">
										{point.average_spending === null
											? "—"
											: formatCurrency(point.average_spending)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</details>
			<p className="text-xs text-muted-foreground">
				The dashed line extends the current gross spending pace and includes later-dated
				Records already entered. Select a day to open its Records.
			</p>
		</div>
	)
}

function StatefulActiveDot({
	cx,
	cy,
	payload,
	field,
	threshold,
	within,
	exceeded,
}: ActiveDotProps & {
	field: "spending" | "projected_spending"
	threshold: number | null
	within: string
	exceeded: string
}) {
	if (cx === undefined || cy === undefined) return null
	const value = Number(payload[field])
	const color = threshold !== null && value > threshold ? exceeded : within

	return <circle cx={cx} cy={cy} r={5} fill={color} stroke="var(--background)" strokeWidth={2} />
}

function LegendItem({ color, label }: { color: string; label: string }) {
	return (
		<span className="flex items-center gap-1.5">
			<span className={`size-2 rounded-sm ${color}`} />
			{label}
		</span>
	)
}

function colorChange(
	data: CashflowPoint[],
	field: "spending" | "projected_spending",
	target: number | null,
) {
	if (target === null) return 100
	const points = data.flatMap((point, index) => {
		const value = point[field]
		return value === null ? [] : [{ index, value }]
	})
	if (!points.length) return 100
	if (points[0].value > target) return 0

	for (let index = 1; index < points.length; index += 1) {
		const previous = points[index - 1]
		const current = points[index]
		if (current.value <= target) continue

		const change = current.value - previous.value
		const progress = change > 0 ? (target - previous.value) / change : 1
		const crossing = previous.index + (current.index - previous.index) * progress
		const visibleSpan = points[points.length - 1].index - points[0].index

		return visibleSpan > 0 ? ((crossing - points[0].index) / visibleSpan) * 100 : 0
	}

	return 100
}

function compactCurrency(value: number) {
	if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}k`
	return `$${value}`
}

function seriesLabel(name: number | string | undefined) {
	const label = String(name ?? "Value").replaceAll("_", " ")
	return label[0].toUpperCase() + label.slice(1)
}

function currencyOrDash(value: number | null) {
	return value === null ? "—" : formatCurrency(value)
}
