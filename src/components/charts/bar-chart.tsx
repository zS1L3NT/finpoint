import ChartFrame, { type ChartSize, ReadoutRows } from "@/components/charts/chart-frame"
import { formatChartCurrency } from "@/lib/chart-currency"
import { cn, formatCurrency } from "@/lib/utils"

export type BarSeries = {
	key: string
	label: string
	color: string
	opacity?: number
	values: number[]
}

const PAD = { top: 12, right: 48 }
const RADIUS = 3

/**
 * Bars on the shared chart frame. `stack` piles series per index (negatives
 * below $0), `group` sets them side by side, and `share` stacks each index to
 * 100%. The active index stays bright while the rest dim.
 */
export default function BarChart({
	label,
	labels,
	series,
	layout,
	tick,
	ticks,
	bottom = 24,
	readout,
	introKey,
	onSelect,
	className,
}: {
	label: string
	labels: string[]
	series: BarSeries[]
	layout: "stack" | "group" | "share"
	tick: (index: number) => React.ReactNode
	/** Indices that get a tick; every index by default. */
	ticks?: number[]
	bottom?: number
	readout?: (index: number) => React.ReactNode
	introKey?: string
	onSelect?: (index: number) => void
	className?: string
}) {
	const totals = labels.map((_, index) => series.map(s => s.values[index] ?? 0))
	const dataMax = Math.max(
		0,
		...totals.map(values =>
			layout === "group"
				? Math.max(...values)
				: values.filter(value => value > 0).reduce((sum, value) => sum + value, 0),
		),
	)
	const dataMin = Math.min(
		0,
		...totals.map(values =>
			layout === "group"
				? Math.min(...values)
				: values.filter(value => value < 0).reduce((sum, value) => sum + value, 0),
		),
	)
	const span = dataMax - dataMin || 1
	const top = layout === "share" ? 1 : dataMax + span * 0.08
	const floor = layout === "share" || dataMin === 0 ? 0 : dataMin - span * 0.08
	const right = layout === "share" ? 0 : PAD.right

	const scales = ({ width, height }: ChartSize) => {
		const plotWidth = Math.max(width - right, 0)
		const plotHeight = Math.max(height - PAD.top - bottom, 0)
		const band = labels.length ? plotWidth / labels.length : 0
		return {
			plotWidth,
			plotHeight,
			band,
			y: (value: number) => PAD.top + ((top - value) / (top - floor)) * plotHeight,
		}
	}

	return (
		<ChartFrame
			label={label}
			count={labels.length}
			introKey={introKey}
			className={className}
			onSelect={onSelect}
			indexAt={(position, size) => {
				const { band } = scales(size)
				return band ? Math.floor(position / band) : 0
			}}
			anchor={(index, size) => {
				const { band } = scales(size)
				return band * (index + 0.5)
			}}
			background={size => {
				const { plotWidth, plotHeight, band, y } = scales(size)
				return (
					<>
						<g className="stroke-border/60" strokeWidth={1}>
							{[0, 0.25, 0.5, 0.75, 1].map(step => (
								<line
									key={step}
									x1={0}
									x2={size.width}
									y1={PAD.top + plotHeight * step}
									y2={PAD.top + plotHeight * step}
								/>
							))}
						</g>
						{floor < 0 ? (
							<line
								x1={0}
								x2={plotWidth}
								y1={y(0)}
								y2={y(0)}
								className="stroke-muted-foreground/50"
							/>
						) : null}
						{(ticks ?? labels.map((_, index) => index)).map(index => (
							<g
								key={index}
								transform={`translate(${band * (index + 0.5)},${PAD.top + plotHeight + 6})`}
								className="fill-muted-foreground text-[0.6875rem] tabular-nums"
							>
								{tick(index)}
							</g>
						))}
					</>
				)
			}}
			marks={(size, active) => {
				const { band, y } = scales(size)
				const width = Math.min(band * (layout === "group" ? 0.72 : 0.8), 64)
				return labels.map((_, index) => {
					const values = series.map(s => s.values[index] ?? 0)
					const total = values.reduce((sum, value) => sum + value, 0)
					const left = band * (index + 0.5) - width / 2
					let up = 0
					let down = 0
					const outerUp = values.findLastIndex(value => value > 0)
					const outerDown = values.findLastIndex(value => value < 0)
					return (
						<g
							key={index}
							className={cn(
								"transition-opacity duration-150 ease-out",
								active !== null && active !== index && "opacity-35",
							)}
						>
							{series.map((s, position) => {
								const value =
									layout === "share"
										? total
											? (values[position] ?? 0) / total
											: 0
										: (values[position] ?? 0)
								if (!value) return null
								if (layout === "group") {
									const slot = width / series.length
									return (
										<path
											key={s.key}
											data-slot="chart-mark"
											d={bar(
												left + slot * position + 1,
												slot - 2,
												y(Math.max(value, 0)),
												y(Math.min(value, 0)),
												value > 0 ? "top" : "bottom",
											)}
											fill={s.color}
											fillOpacity={s.opacity}
										/>
									)
								}
								const start = value > 0 ? up : down
								if (value > 0) up += value
								else down += value
								const outer =
									position === (value > 0 ? outerUp : outerDown) &&
									layout !== "share"
								return (
									<path
										key={s.key}
										data-slot="chart-mark"
										d={bar(
											left,
											width,
											y(Math.max(start, start + value)),
											y(Math.min(start, start + value)),
											outer ? (value > 0 ? "top" : "bottom") : null,
										)}
										fill={s.color}
										fillOpacity={s.opacity}
										className="stroke-card"
										strokeWidth={1}
									/>
								)
							})}
						</g>
					)
				})
			}}
			readout={
				readout ??
				(index => (
					<ReadoutRows
						title={labels[index]}
						rows={series
							.filter(s => s.values[index])
							.map(s => ({
								key: s.key,
								label: s.label,
								color: s.color,
								opacity: s.opacity,
								value: formatCurrency(s.values[index] ?? 0),
							}))}
					/>
				))
			}
		>
			{size => {
				if (layout === "share") return null
				const { y } = scales(size)
				return [dataMax, ...(dataMin < 0 ? [dataMin] : [])].map(value => (
					<span
						key={value}
						className="pointer-events-none absolute right-0 -translate-y-1/2 rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground tabular-nums"
						style={{ top: y(value) }}
					>
						{formatChartCurrency(value)}
					</span>
				))
			}}
		</ChartFrame>
	)
}

// A bar from `high` (top edge) to `low` (bottom edge), rounding only its outer end.
function bar(x: number, width: number, high: number, low: number, round: "top" | "bottom" | null) {
	const r = round ? Math.min(RADIUS, width / 2, (low - high) / 2) : 0
	return round === "bottom"
		? `M${x},${high}H${x + width}V${low - r}Q${x + width},${low} ${x + width - r},${low}H${x + r}Q${x},${low} ${x},${low - r}Z`
		: `M${x},${low}V${high + r}Q${x},${high} ${x + r},${high}H${x + width - r}Q${x + width},${high} ${x + width},${high + r}V${low}Z`
}
