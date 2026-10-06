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
			<polyline
				points={points}
				fill="none"
				stroke={color}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle
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
