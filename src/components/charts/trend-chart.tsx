import { useId } from "react"
import ChartFrame, { type ChartSize, ReadoutRows } from "@/components/charts/chart-frame"
import { formatChartCurrency } from "@/lib/chart-currency"
import { formatCurrency } from "@/lib/utils"

export type TrendSeries = {
	key: string
	label: string
	values: Array<number | null>
	/** Colour at or below the chart's `split` value. */
	color: string
	/** Colour above the chart's `split` value. */
	over?: string
	dash?: string
	opacity?: number
	/** Strength of the fill fading from the line towards $0. */
	fill?: number
}

// The right gutter holds the value pills that replace a Y axis.
const PAD = { top: 12, right: 48, bottom: 24 }
const PILL_GAP = 18

/** Daily values as one smooth line, with a fill fading towards $0. */
export default function TrendChart({
	label,
	series,
	labels,
	ticks,
	split,
	reference,
	introKey,
	onSelect,
	className,
}: {
	label: string
	series: TrendSeries[]
	labels: string[]
	ticks: { index: number; label: string }[]
	split?: number
	reference?: { value: number; label: string } | null
	introKey?: string
	onSelect?: (index: number) => void
	className?: string
}) {
	const id = useId().replace(/:/g, "")
	const values = series.flatMap(s => s.values.filter(value => value !== null))
	const dataMax = Math.max(0, ...values)
	const dataMin = Math.min(0, ...values)
	const max = Math.max(dataMax, reference?.value ?? 0)
	const span = max - dataMin || 1
	const top = max + span * 0.08
	const floor = dataMin < 0 ? dataMin - span * 0.08 : 0
	const tone = (s: TrendSeries, value: number) =>
		split !== undefined && s.over && value > split ? s.over : s.color

	const scales = ({ width, height }: ChartSize) => {
		const plotWidth = Math.max(width - PAD.right, 0)
		const plotHeight = Math.max(height - PAD.top - PAD.bottom, 0)
		const y = (value: number) => PAD.top + ((top - value) / (top - floor)) * plotHeight
		return {
			plotWidth,
			plotHeight,
			bottom: PAD.top + plotHeight,
			x: (index: number) =>
				labels.length > 1 ? (index / (labels.length - 1)) * plotWidth : plotWidth / 2,
			y,
			offset: (value: number) =>
				plotHeight ? Math.min(Math.max((y(value) - PAD.top) / plotHeight, 0), 1) : 0,
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
				const { plotWidth } = scales(size)
				return Math.round((plotWidth ? position / plotWidth : 0) * (labels.length - 1))
			}}
			anchor={(index, size) => scales(size).x(index)}
			background={size => {
				const { plotWidth, plotHeight, bottom, x, y } = scales(size)
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
							{ticks.map(tick => (
								<line
									key={tick.index}
									x1={x(tick.index)}
									x2={x(tick.index)}
									y1={PAD.top}
									y2={bottom}
								/>
							))}
						</g>
						{dataMin < 0 ? (
							<line
								x1={0}
								x2={plotWidth}
								y1={y(0)}
								y2={y(0)}
								className="stroke-muted-foreground/50"
							/>
						) : null}
						{reference ? (
							<g className="fill-muted-foreground stroke-muted-foreground">
								<line
									x1={0}
									x2={plotWidth}
									y1={y(reference.value)}
									y2={y(reference.value)}
									strokeDasharray="4 4"
								/>
								<text
									x={4}
									y={y(reference.value) - 6}
									textAnchor="start"
									stroke="none"
									className="text-[0.6875rem]"
								>
									{reference.label}
								</text>
							</g>
						) : null}
						{ticks.map(tick => (
							<text
								key={tick.index}
								x={x(tick.index)}
								y={size.height - 6}
								textAnchor={
									tick.index === 0
										? "start"
										: tick.index === labels.length - 1
											? "end"
											: "middle"
								}
								className="fill-muted-foreground text-[0.6875rem] tabular-nums"
							>
								{tick.label}
							</text>
						))}
					</>
				)
			}}
			marks={size => {
				const { plotWidth, plotHeight, bottom, x, y, offset } = scales(size)
				return (
					<>
						<defs>
							{/* The fill fades out towards $0, from above and below. */}
							<linearGradient
								id={`${id}-fade`}
								gradientUnits="userSpaceOnUse"
								x1={0}
								y1={PAD.top}
								x2={0}
								y2={bottom}
							>
								<stop offset={0} stopColor="white" />
								<stop offset={offset(0)} stopColor="white" stopOpacity={0} />
								<stop
									offset={1}
									stopColor="white"
									stopOpacity={offset(0) < 1 ? 1 : 0}
								/>
							</linearGradient>
							<mask id={`${id}-mask`} maskUnits="userSpaceOnUse">
								<rect
									y={PAD.top}
									width={plotWidth}
									height={plotHeight}
									fill={`url(#${id}-fade)`}
								/>
							</mask>
							{series.map(s => {
								const above = split !== undefined && s.over ? s.over : s.color
								const at = split === undefined ? 0 : offset(split)
								return (
									<linearGradient
										key={s.key}
										id={`${id}-${s.key}`}
										gradientUnits="userSpaceOnUse"
										x1={0}
										y1={PAD.top}
										x2={0}
										y2={bottom}
									>
										<stop offset={0} stopColor={above} />
										<stop offset={at} stopColor={above} />
										<stop offset={at} stopColor={s.color} />
										<stop offset={1} stopColor={s.color} />
									</linearGradient>
								)
							})}
						</defs>
						{series.map(s =>
							s.fill ? (
								<path
									key={s.key}
									data-slot="chart-mark"
									d={path(s.values, x, y, true)}
									fill={`url(#${id}-${s.key})`}
									fillOpacity={s.fill}
									mask={`url(#${id}-mask)`}
								/>
							) : null,
						)}
						{series.map(s => (
							<path
								key={s.key}
								data-slot="chart-mark"
								d={path(s.values, x, y)}
								fill="none"
								stroke={`url(#${id}-${s.key})`}
								strokeOpacity={s.opacity}
								strokeWidth={s.fill ? 2.5 : 2}
								strokeDasharray={s.dash}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						))}
					</>
				)
			}}
			overlay={(size, active) => {
				if (active === null) return null
				const { bottom, x, y } = scales(size)
				return (
					<g>
						<line
							x1={x(active)}
							x2={x(active)}
							y1={PAD.top}
							y2={bottom}
							className="stroke-foreground/40"
						/>
						{series.map(s => {
							const value = s.values[active]
							if (value == null) return null
							return (
								<circle
									key={s.key}
									cx={x(active)}
									cy={y(value)}
									r={s.fill ? 5 : 3.5}
									fill={tone(s, value)}
									fillOpacity={s.opacity}
									className="stroke-background"
									strokeWidth={2}
								/>
							)
						})}
					</g>
				)
			}}
			readout={index => (
				<ReadoutRows
					title={labels[index]}
					// The filled (primary) series lead; comparison lines follow.
					rows={series
						.filter(s => s.values[index] != null)
						.toSorted((a, b) => (b.fill ?? 0) - (a.fill ?? 0))
						.map(s => {
							const value = s.values[index] ?? 0
							return {
								key: s.key,
								label: s.label,
								color: tone(s, value),
								opacity: s.opacity,
								value: formatCurrency(value),
							}
						})}
				/>
			)}
		>
			{size => {
				const { y } = scales(size)
				const pills = [
					...(reference ? [reference.value] : []),
					dataMax,
					...(dataMin < 0 ? [0, dataMin] : []),
				].reduce<number[]>(
					(kept, value) =>
						kept.some(other => Math.abs(y(other) - y(value)) < PILL_GAP)
							? kept
							: [...kept, value],
					[],
				)
				return pills.map(value => (
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

// Each run of non-null values is its own subpath, so gaps stay gaps.
function runs(values: Array<number | null>) {
	return values.reduce<{ index: number; value: number }[][]>((result, value, index) => {
		if (value === null) return result
		const last = result.at(-1)
		if (last && last.at(-1)?.index === index - 1) last.push({ index, value })
		else result.push([{ index, value }])
		return result
	}, [])
}

function path(
	values: Array<number | null>,
	x: (index: number) => number,
	y: (value: number) => number,
	area = false,
) {
	return runs(values)
		.map(run => {
			const points = run.map(p => [x(p.index), y(p.value)] as const)
			const slopes = points.slice(1).map(([x1, y1], i) => {
				const [x0, y0] = points[i] ?? [x1, y1]
				return x1 === x0 ? 0 : (y1 - y0) / (x1 - x0)
			})
			// Monotone tangents: a flat stretch stays flat and the curve never overshoots a value.
			const tangents = points.map((_, i) => {
				const before = slopes[i - 1]
				const after = slopes[i]
				if (before === undefined || after === undefined) return before ?? after ?? 0
				return Math.sign(before) === Math.sign(after)
					? Math.sign(before) *
							Math.min(
								Math.abs(before),
								Math.abs(after),
								Math.abs(before + after) / 2,
							)
					: 0
			})
			const trace = points
				.map(([x1, y1], i) => {
					const previous = points[i - 1]
					if (!previous) return `M${x1},${y1}`
					const [x0, y0] = previous
					const third = (x1 - x0) / 3
					return `C${x0 + third},${y0 + (tangents[i - 1] ?? 0) * third} ${x1 - third},${y1 - (tangents[i] ?? 0) * third} ${x1},${y1}`
				})
				.join("")
			const first = run[0]
			const last = run.at(-1)
			// A lone point draws as a dot: a zero-length segment with a round cap.
			if (!area && run.length === 1) return `${trace}h0`
			return area && first && last
				? `${trace}L${x(last.index)},${y(0)}L${x(first.index)},${y(0)}Z`
				: trace
		})
		.join("")
}
