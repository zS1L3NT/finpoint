import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useId, useRef, useState } from "react"
import { CHART_INTRO_MS } from "@/components/charts/chart-intro"
import { formatChartCurrency } from "@/lib/chart-currency"
import { EASE_OUT } from "@/lib/motion"
import { cn, formatCurrency } from "@/lib/utils"

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
// A touch released sooner than this, without scrubbing, is a tap that selects the day.
const TAP_MS = 300

/**
 * Line and area chart drawn directly in SVG so touch behaves natively: the
 * readout shows only while a finger is down and follows it as it scrubs, while
 * a mouse reads on hover. Keyboard focus starts at the first point.
 */
export default function TrendChart({
	label,
	series,
	labels,
	ticks,
	split,
	reference,
	introKey = "mount",
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
	const box = useRef<HTMLDivElement>(null)
	const press = useRef<{ index: number; time: number } | null>(null)
	const reduceMotion = useReducedMotion()
	const [size, setSize] = useState({ width: 0, height: 0 })
	const [active, setActive] = useState<number | null>(null)
	const [played, setPlayed] = useState<string | null>(null)

	useEffect(() => {
		const element = box.current
		if (!element) return
		const observer = new ResizeObserver(([entry]) => {
			if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
		})
		observer.observe(element)
		return () => observer.disconnect()
	}, [])

	const plotWidth = Math.max(size.width - PAD.right, 0)
	const plotHeight = Math.max(size.height - PAD.top - PAD.bottom, 0)
	const bottom = PAD.top + plotHeight
	const values = series.flatMap(s => s.values.filter(value => value !== null))
	const dataMax = Math.max(0, ...values)
	const dataMin = Math.min(0, ...values)
	const max = Math.max(dataMax, reference?.value ?? 0)
	const span = max - dataMin || 1
	const top = max + span * 0.08
	const floor = dataMin < 0 ? dataMin - span * 0.08 : 0
	const x = (index: number) =>
		labels.length > 1 ? (index / (labels.length - 1)) * plotWidth : plotWidth / 2
	const y = (value: number) => PAD.top + ((top - value) / (top - floor)) * plotHeight
	const offset = (value: number) =>
		plotHeight ? Math.min(Math.max((y(value) - PAD.top) / plotHeight, 0), 1) : 0
	const tone = (s: TrendSeries, value: number) =>
		split !== undefined && s.over && value > split ? s.over : s.color
	const intro = !reduceMotion && played !== introKey

	const pills = [
		...(reference ? [reference.value] : []),
		dataMax,
		...(dataMin < 0 ? [0, dataMin] : []),
	].reduce<number[]>(
		(kept, value) =>
			kept.some(other => Math.abs(y(other) - y(value)) < PILL_GAP) ? kept : [...kept, value],
		[],
	)

	const indexAt = (event: React.PointerEvent<SVGSVGElement>) => {
		const left = event.currentTarget.getBoundingClientRect().left
		const ratio = plotWidth ? (event.clientX - left) / plotWidth : 0
		return Math.min(Math.max(Math.round(ratio * (labels.length - 1)), 0), labels.length - 1)
	}
	const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
		if (event.button !== 0) return
		const index = indexAt(event)
		press.current = { index, time: event.timeStamp }
		if (event.pointerType !== "mouse") setActive(index)
	}
	const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
		if (event.pointerType === "mouse" || press.current) setActive(indexAt(event))
	}
	const onPointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
		const started = press.current
		press.current = null
		const index = indexAt(event)
		if (event.pointerType !== "mouse") setActive(null)
		if (
			started &&
			(event.pointerType === "mouse" ||
				(started.index === index && event.timeStamp - started.time < TAP_MS))
		)
			onSelect?.(index)
	}
	const onPointerCancel = () => {
		press.current = null
		setActive(null)
	}
	const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
		const last = labels.length - 1
		const next =
			event.key === "ArrowRight"
				? Math.min((active ?? -1) + 1, last)
				: event.key === "ArrowLeft"
					? Math.max((active ?? 1) - 1, 0)
					: event.key === "Home"
						? 0
						: event.key === "End"
							? last
							: null
		if (next !== null) {
			event.preventDefault()
			setActive(next)
		} else if (event.key === "Enter" && active !== null) onSelect?.(active)
		else if (event.key === "Escape") setActive(null)
	}

	// The filled (primary) series lead the readout; comparison lines follow.
	const readout =
		active === null
			? []
			: series
					.filter(s => s.values[active] != null)
					.toSorted((a, b) => (b.fill ?? 0) - (a.fill ?? 0))

	return (
		<div ref={box} className={cn("relative select-none", className)}>
			{size.width ? (
				<svg
					role="application"
					aria-label={label}
					tabIndex={0}
					data-slot="chart-surface"
					width={size.width}
					height={size.height}
					className={cn(
						"block touch-pan-y [-webkit-touch-callout:none] focus-visible:outline-2 focus-visible:outline-ring",
						onSelect && "cursor-pointer",
					)}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={onPointerCancel}
					onPointerLeave={event => {
						if (event.pointerType === "mouse") setActive(null)
					}}
					// Pointer presses own their readout; only keyboard focus opens it at the first point.
					onFocus={() => {
						if (!press.current) setActive(0)
					}}
					onBlur={() => setActive(null)}
					onKeyDown={onKeyDown}
				>
					<defs>
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
						{series.map(s => (
							<linearGradient
								key={s.key}
								id={`${id}-${s.key}`}
								gradientUnits="userSpaceOnUse"
								x1={0}
								y1={PAD.top}
								x2={0}
								y2={bottom}
							>
								<stop
									offset={0}
									stopColor={split !== undefined && s.over ? s.over : s.color}
								/>
								<stop
									offset={split === undefined ? 0 : offset(split)}
									stopColor={split !== undefined && s.over ? s.over : s.color}
								/>
								<stop
									offset={split === undefined ? 0 : offset(split)}
									stopColor={s.color}
								/>
								<stop offset={1} stopColor={s.color} />
							</linearGradient>
						))}
						{intro ? (
							<clipPath id={`${id}-intro`} data-chart-intro>
								<motion.rect
									key={introKey}
									height={size.height}
									initial={{ width: 0 }}
									animate={{ width: size.width }}
									transition={{ duration: CHART_INTRO_MS / 1000, ease: EASE_OUT }}
									onAnimationComplete={() => setPlayed(introKey)}
								/>
							</clipPath>
						) : null}
					</defs>

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
								x={plotWidth - 4}
								y={y(reference.value) - 6}
								textAnchor="end"
								stroke="none"
								className="text-[0.6875rem]"
							>
								{reference.label}
							</text>
						</g>
					) : null}

					<g clipPath={intro ? `url(#${id}-intro)` : undefined}>
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
					</g>

					{active !== null ? (
						<g>
							<line
								x1={x(active)}
								x2={x(active)}
								y1={PAD.top}
								y2={bottom}
								className="stroke-foreground/40"
							/>
							{readout.map(s => {
								const value = s.values[active] ?? 0
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
				</svg>
			) : null}

			{size.width
				? pills.map(value => (
						<span
							key={value}
							className="pointer-events-none absolute right-0 -translate-y-1/2 rounded-md bg-muted px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground tabular-nums"
							style={{ top: y(value) }}
						>
							{formatChartCurrency(value)}
						</span>
					))
				: null}

			<div aria-live="polite">
				{active !== null && readout.length ? (
					<div
						data-slot="chart-tooltip"
						className="pointer-events-none absolute z-10 grid min-w-40 gap-1 rounded-xl bg-popover/95 px-3 py-2 text-xs shadow-lg ring-1 ring-foreground/10 backdrop-blur-sm"
						style={
							x(active) > plotWidth / 2
								? { top: PAD.top, right: size.width - x(active) + 12 }
								: { top: PAD.top, left: x(active) + 12 }
						}
					>
						<span className="font-medium">{labels[active]}</span>
						{readout.map(s => {
							const value = s.values[active] ?? 0
							return (
								<span
									key={s.key}
									className="flex items-center justify-between gap-4"
								>
									<span className="flex items-center gap-1.5 text-muted-foreground">
										<span
											className="size-2 shrink-0 rounded-full"
											style={{
												backgroundColor: tone(s, value),
												opacity: s.opacity,
											}}
										/>
										{s.label}
									</span>
									<span className="font-medium tabular-nums">
										{formatCurrency(value)}
									</span>
								</span>
							)
						})}
					</div>
				) : null}
			</div>
		</div>
	)
}

// Each run of non-null values is its own subpath, so gaps stay gaps.
function runs(values: Array<number | null>) {
	return values.reduce<{ index: number; value: number }[][]>((result, value, index) => {
		if (value === null) return result
		const last = result.at(-1)
		const previous = last?.at(-1)
		if (last && previous?.index === index - 1) last.push({ index, value })
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
			const trace = run.map((p, i) => `${i ? "L" : "M"}${x(p.index)},${y(p.value)}`).join("")
			const first = run[0]
			const last = run.at(-1)
			return area && first && last
				? `${trace}L${x(last.index)},${y(0)}L${x(first.index)},${y(0)}Z`
				: trace
		})
		.join("")
}
