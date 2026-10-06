"use client"

import { motion, useReducedMotion } from "framer-motion"
import { DURATION, EASE_OUT } from "@/lib/motion"

/**
 * Tiny inline trend line for stat tiles. Plain SVG (no Recharts, no resize
 * observer) so a row of them costs nothing when the layout changes.
 */
export default function Sparkline({
	values,
	color = "currentColor",
	label,
	className,
}: {
	values: number[]
	color?: string
	label: string
	className?: string
}) {
	const reduceMotion = useReducedMotion()
	if (values.length < 2) return null
	const width = 96
	const height = 28
	const pad = 3
	const min = Math.min(...values, 0)
	const max = Math.max(...values, 0)
	const span = max - min || 1
	const x = (index: number) => pad + (index / (values.length - 1)) * (width - pad * 2)
	const y = (value: number) => pad + (1 - (value - min) / span) * (height - pad * 2)
	const points = values.map((value, index) => `${x(index)},${y(value)}`).join(" ")
	const last = values.length - 1

	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			className={className}
			width={width}
			height={height}
			role="img"
			aria-label={label}
		>
			{min < 0 && max > 0 ? (
				<line
					x1={pad}
					x2={width - pad}
					y1={y(0)}
					y2={y(0)}
					stroke="currentColor"
					strokeOpacity={0.2}
					strokeDasharray="2 2"
				/>
			) : null}
			<motion.polyline
				initial={reduceMotion ? false : { pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: DURATION.slow + 0.1, ease: EASE_OUT }}
				points={points}
				fill="none"
				stroke={color}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<motion.circle
				initial={reduceMotion ? false : { opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: DURATION.base, delay: DURATION.slow, ease: EASE_OUT }}
				cx={x(last)}
				cy={y(values[last] ?? 0)}
				r={2.75}
				fill={color}
				stroke="var(--card)"
				strokeWidth={1.5}
			/>
		</svg>
	)
}
