import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useId, useRef, useState } from "react"
import { CHART_INTRO_MS, EASE_OUT } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ChartSize = { width: number; height: number }

// A press holds this long before it reads, so a scroll starting on the chart never flashes it.
const HOLD_MS = 120

/**
 * Shell of the custom charts: measures itself, owns the active index and reveals
 * the marks once per `introKey`. Touch reads only while a finger is down and
 * follows it as it scrubs; a mouse reads on hover and clicks to select; keyboard
 * focus starts at the first point.
 */
export default function ChartFrame({
	label,
	count,
	introKey = "mount",
	indexAt,
	anchor,
	onSelect,
	className,
	style,
	background,
	marks,
	overlay,
	readout,
	onActive,
	children,
}: {
	label: string
	count: number
	introKey?: string
	indexAt: (x: number, size: ChartSize) => number
	anchor: (index: number, size: ChartSize) => number
	onSelect?: (index: number) => void
	className?: string
	style?: React.CSSProperties
	background?: (size: ChartSize) => React.ReactNode
	marks: (size: ChartSize, active: number | null) => React.ReactNode
	overlay?: (size: ChartSize, active: number | null) => React.ReactNode
	readout: (index: number) => React.ReactNode
	onActive?: (index: number | null) => void
	children?: (size: ChartSize) => React.ReactNode
}) {
	const id = useId().replace(/:/g, "")
	const box = useRef<HTMLDivElement>(null)
	const press = useRef<{
		pointer: number
		index: number
		timer: number
		reading: boolean
	} | null>(null)
	const pointerType = useRef<string | null>(null)
	const reduceMotion = useReducedMotion()
	const [size, setSize] = useState<ChartSize>({ width: 0, height: 0 })
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

	useEffect(
		() => () => {
			if (press.current) window.clearTimeout(press.current.timer)
		},
		[],
	)

	// A shorter dataset (e.g. a 28-day month after a 31-day one) drops an index past its end.
	const current = active !== null && active < count ? active : null
	useEffect(() => onActive?.(current), [current, onActive])

	const intro = !reduceMotion && played !== introKey
	const pointed = (event: React.MouseEvent<SVGSVGElement>) =>
		Math.min(
			Math.max(
				indexAt(event.clientX - event.currentTarget.getBoundingClientRect().left, size),
				0,
			),
			count - 1,
		)
	const release = () => {
		if (press.current) window.clearTimeout(press.current.timer)
		press.current = null
	}
	const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
		const next =
			event.key === "ArrowRight"
				? Math.min((current ?? -1) + 1, count - 1)
				: event.key === "ArrowLeft"
					? Math.max((current ?? 1) - 1, 0)
					: event.key === "Home"
						? 0
						: event.key === "End"
							? count - 1
							: null
		if (next !== null) {
			event.preventDefault()
			setActive(next)
		} else if (event.key === "Enter" && current !== null) onSelect?.(current)
		else if (event.key === "Escape") setActive(null)
	}

	return (
		<div ref={box} className={cn("relative select-none", className)} style={style}>
			{size.width && count ? (
				<svg
					role="application"
					aria-label={label}
					tabIndex={0}
					data-slot="chart-surface"
					width={size.width}
					height={size.height}
					className={cn(
						"block touch-pan-y [-webkit-touch-callout:none] focus:outline-hidden focus-visible:outline-2 focus-visible:outline-ring",
						onSelect && "cursor-pointer",
					)}
					onPointerDown={event => {
						pointerType.current = event.pointerType
						// The first finger owns the reading; later fingers are ignored.
						if (event.pointerType === "mouse" || press.current) return
						const index = pointed(event)
						const timer = window.setTimeout(() => {
							if (!press.current) return
							press.current.reading = true
							setActive(press.current.index)
						}, HOLD_MS)
						press.current = { pointer: event.pointerId, index, timer, reading: false }
					}}
					onPointerMove={event => {
						if (event.pointerType === "mouse") setActive(pointed(event))
						else if (press.current?.pointer === event.pointerId) {
							press.current.index = pointed(event)
							if (press.current.reading) setActive(press.current.index)
						}
					}}
					// Touch never selects: lifting the finger only ends the reading.
					onPointerUp={event => {
						if (press.current?.pointer !== event.pointerId) return
						release()
						setActive(null)
					}}
					onPointerCancel={event => {
						if (press.current?.pointer !== event.pointerId) return
						release()
						setActive(null)
					}}
					// Only a mouse selects, judged at pointerdown because iOS Safari's click can
					// misreport its pointer type; touch and pen holds only read. Click fires for
					// the primary button only, pressed and released on the chart.
					onClick={event => {
						if (pointerType.current === "mouse") onSelect?.(pointed(event))
					}}
					onPointerLeave={event => {
						if (event.pointerType === "mouse") setActive(null)
					}}
					// Only keyboard focus opens a reading: touch focuses the chart after the finger lifts.
					onFocus={event => {
						if (event.currentTarget.matches(":focus-visible"))
							setActive(value => value ?? 0)
					}}
					onBlur={() => setActive(null)}
					onKeyDown={onKeyDown}
				>
					{intro ? (
						<defs>
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
						</defs>
					) : null}
					{background?.(size)}
					<g clipPath={intro ? `url(#${id}-intro)` : undefined}>{marks(size, current)}</g>
					{overlay?.(size, current)}
				</svg>
			) : null}
			{size.width ? children?.(size) : null}
			<div aria-live="polite">
				{current !== null && size.width ? (
					<div
						data-slot="chart-tooltip"
						className="pointer-events-none absolute top-3 z-10 grid gap-1 rounded-xl bg-popover/95 px-3 py-2 text-xs shadow-lg ring-1 ring-foreground/10 backdrop-blur-sm"
						style={
							// The card takes the wider side of the anchor and wraps to fit it.
							anchor(current, size) > size.width / 2
								? {
										right: size.width - anchor(current, size) + 12,
										maxWidth: anchor(current, size) - 20,
									}
								: {
										left: anchor(current, size) + 12,
										maxWidth: size.width - anchor(current, size) - 20,
									}
						}
					>
						{readout(current)}
					</div>
				) : null}
			</div>
		</div>
	)
}

/** The default readout: a title, then one coloured row per series. */
export function ReadoutRows({
	title,
	rows,
}: {
	title: React.ReactNode
	rows: {
		key: string
		label: React.ReactNode
		color: string
		opacity?: number
		value: React.ReactNode
	}[]
}) {
	return (
		<>
			<span className="font-medium">{title}</span>
			{rows.map(row => (
				<span key={row.key} className="flex items-center justify-between gap-4">
					<span className="flex items-center gap-1.5 text-muted-foreground">
						<span
							className="size-2 shrink-0 rounded-full"
							style={{ backgroundColor: row.color, opacity: row.opacity }}
						/>
						{row.label}
					</span>
					<span className="font-medium tabular-nums">{row.value}</span>
				</span>
			))}
		</>
	)
}
