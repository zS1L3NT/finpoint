import {
	Check,
	FileText,
	Landmark,
	Link2,
	type LucideIcon,
	Receipt,
	TriangleAlert,
} from "lucide-react"
import {
	type CSSProperties,
	createContext,
	type ReactNode,
	useContext,
	useLayoutEffect,
	useState,
} from "react"
import { interpolate, useCurrentFrame } from "remotion"
import { useProgress, useReduced } from "./motion"
import { alpha, color, font, money } from "./theme"

/**
 * The 952 × 520 stage a scene draws on, so connectors can measure where its cards landed. It is
 * held in state rather than a ref, so connectors measure again once the stage has mounted.
 */
export const StageRoot = createContext<HTMLDivElement | null>(null)

/**
 * Absolutely positioned block inside a 952 × 520 stage. Name it with `anchor` and a `Link` can
 * connect to its edges wherever its content makes it end up.
 */
export function At({
	x,
	y,
	w,
	h,
	anchor,
	children,
	style,
}: {
	x: number
	y: number
	w?: number
	h?: number
	anchor?: string
	children: ReactNode
	style?: CSSProperties
}) {
	return (
		<div
			data-anchor={anchor}
			style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}
		>
			{children}
		</div>
	)
}

export function IconTile({
	icon: Icon,
	tint,
	size = 64,
	style,
}: {
	icon: LucideIcon
	tint: string
	size?: number
	style?: CSSProperties
}) {
	return (
		<div
			style={{
				width: size,
				height: size,
				flexShrink: 0,
				borderRadius: size * 0.3,
				display: "grid",
				placeItems: "center",
				background: `linear-gradient(145deg, ${alpha(tint, 0.32)}, ${alpha(tint, 0.1)})`,
				boxShadow: `inset 0 0 0 1.5px ${alpha(tint, 0.45)}, 0 10px 30px ${alpha(tint, 0.18)}`,
				color: tint,
				...style,
			}}
		>
			<Icon size={size * 0.5} strokeWidth={2} />
		</div>
	)
}

export function Card({
	children,
	tint,
	glow = 0,
	style,
}: {
	children: ReactNode
	tint?: string
	glow?: number
	style?: CSSProperties
}) {
	return (
		<div
			style={{
				position: "relative",
				borderRadius: 26,
				background: `linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.03)), ${color.raised}`,
				boxShadow: [
					`inset 0 0 0 1.5px ${tint ? alpha(tint, 0.28 + glow * 0.5) : color.line}`,
					"inset 0 1px 0 rgba(255,255,255,0.08)",
					"0 24px 60px rgba(0,0,0,0.45)",
					tint && glow ? `0 0 ${60 * glow}px ${alpha(tint, 0.35 * glow)}` : "",
				]
					.filter(Boolean)
					.join(", "),
				...style,
			}}
		>
			{children}
		</div>
	)
}

export function Kicker({ children, tint = color.dim }: { children: ReactNode; tint?: string }) {
	return (
		<div
			style={{
				fontSize: 20,
				fontWeight: 650,
				letterSpacing: "0.14em",
				textTransform: "uppercase",
				color: tint,
			}}
		>
			{children}
		</div>
	)
}

export function Chip({
	children,
	tint = color.dim,
	solid = false,
	size = 22,
	style,
}: {
	children: ReactNode
	tint?: string
	solid?: boolean
	size?: number
	style?: CSSProperties
}) {
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: size * 0.4,
				padding: `${size * 0.32}px ${size * 0.7}px`,
				borderRadius: 999,
				fontSize: size,
				fontWeight: 600,
				lineHeight: 1.1,
				whiteSpace: "nowrap",
				color: solid ? color.night : tint,
				background: solid ? tint : alpha(tint, 0.13),
				boxShadow: solid ? undefined : `inset 0 0 0 1.5px ${alpha(tint, 0.35)}`,
				...style,
			}}
		>
			{!solid && (
				<span
					style={{
						width: size * 0.38,
						height: size * 0.38,
						borderRadius: 99,
						background: tint,
					}}
				/>
			)}
			{children}
		</span>
	)
}

export function Status({ pending, at = 0 }: { pending: boolean; at?: number }) {
	const progress = useProgress(at, 14)
	const tint = pending ? color.pending : color.record
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 8,
				padding: "6px 14px 6px 10px",
				borderRadius: 999,
				fontSize: 21,
				fontWeight: 650,
				color: tint,
				background: alpha(tint, 0.14),
				boxShadow: `inset 0 0 0 1.5px ${alpha(tint, 0.4)}`,
				opacity: progress,
				transform: `scale(${0.8 + 0.2 * progress})`,
			}}
		>
			{pending ? (
				<TriangleAlert size={20} strokeWidth={2.4} />
			) : (
				<Check size={20} strokeWidth={3} />
			)}
			{pending ? "Pending" : "Complete"}
		</span>
	)
}

const amountStyle = (size: number): CSSProperties => ({
	...font.numbers,
	flexShrink: 0,
	fontSize: size,
	fontWeight: 700,
	letterSpacing: "-0.02em",
	whiteSpace: "nowrap",
})

/** Card titles wrap onto a second line rather than run under the amount or get cut off. */
const titleStyle = (compact?: boolean): CSSProperties => ({
	fontSize: compact ? 24 : 30,
	fontWeight: 650,
	lineHeight: 1.18,
	textWrap: "balance",
	overflowWrap: "break-word",
})

/** A bank row: what the Account says happened. */
export function StatementCard({
	title,
	meta = "Statement",
	amount,
	right,
	footer,
	pending,
	tint = color.statement,
	glow,
	compact,
	style,
}: {
	title: string
	meta?: string
	amount?: number
	right?: ReactNode
	footer?: ReactNode
	pending?: boolean
	tint?: string
	glow?: number
	compact?: boolean
	style?: CSSProperties
}) {
	return (
		<Card tint={pending ? color.pending : tint} glow={glow} style={style}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: compact ? 16 : 20,
					padding: compact ? "18px 20px" : "24px 26px",
				}}
			>
				<IconTile
					icon={Landmark}
					tint={pending ? color.pending : tint}
					size={compact ? 48 : 60}
				/>
				<div style={{ flex: 1, minWidth: 0 }}>
					<div style={titleStyle(compact)}>{title}</div>
					<div style={{ fontSize: 21, lineHeight: 1.25, color: color.dim, marginTop: 4 }}>
						{pending ? "Pending Statement" : meta}
					</div>
				</div>
				{right ??
					(amount !== undefined && (
						<span style={amountStyle(compact ? 32 : 38)}>{money(amount)}</span>
					))}
			</div>
			{footer}
		</Card>
	)
}

/** Your explanation: what the money was really for. */
export function RecordCard({
	title,
	amount,
	right,
	chips,
	status,
	icon = Receipt,
	glow,
	compact,
	style,
}: {
	title: string
	amount?: number
	right?: ReactNode
	chips?: ReactNode
	status?: ReactNode
	icon?: LucideIcon
	glow?: number
	compact?: boolean
	style?: CSSProperties
}) {
	return (
		<Card tint={color.record} glow={glow} style={style}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: compact ? 16 : 20,
					padding: compact ? "18px 20px" : "24px 26px",
				}}
			>
				<IconTile icon={icon} tint={color.record} size={compact ? 48 : 60} />
				<div style={{ flex: 1, minWidth: 0 }}>
					<div style={titleStyle(compact)}>{title}</div>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: 8,
							marginTop: 8,
							alignItems: "center",
						}}
					>
						{chips ?? <span style={{ fontSize: 21, color: color.dim }}>Record</span>}
					</div>
				</div>
				<div
					style={{
						display: "flex",
						flexShrink: 0,
						flexDirection: "column",
						alignItems: "flex-end",
						gap: 10,
					}}
				>
					{right ??
						(amount !== undefined && (
							<span style={amountStyle(compact ? 32 : 38)}>{money(amount)}</span>
						))}
					{status}
				</div>
			</div>
		</Card>
	)
}

/** The assigned amount that links a Statement to a Record. */
export function AllocationTag({
	amount,
	at = 0,
	label = "Allocation",
	tint = color.allocation,
	style,
}: {
	amount: ReactNode
	at?: number
	label?: string
	tint?: string
	style?: CSSProperties
}) {
	const progress = useProgress(at, 16)
	return (
		<div
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 10,
				padding: "10px 18px 10px 12px",
				borderRadius: 999,
				background: `linear-gradient(180deg, ${alpha(tint, 0.3)}, ${alpha(tint, 0.16)}), ${color.raised}`,
				boxShadow: `inset 0 0 0 1.5px ${alpha(tint, 0.6)}, 0 10px 30px ${alpha(tint, 0.25)}`,
				color: color.ink,
				fontSize: 24,
				fontWeight: 650,
				whiteSpace: "nowrap",
				opacity: progress,
				transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * progress})`,
				...style,
			}}
		>
			<span
				style={{
					display: "grid",
					placeItems: "center",
					width: 32,
					height: 32,
					borderRadius: 99,
					background: tint,
					color: color.night,
				}}
			>
				<Link2 size={19} strokeWidth={2.6} />
			</span>
			{label && <span style={{ color: tint, fontWeight: 600 }}>{label}</span>}
			<span style={font.numbers}>{amount}</span>
		</div>
	)
}

type Point = { x: number; y: number }

function bezier(a: Point, b: Point, vertical: boolean) {
	const dx = (b.x - a.x) / 2
	const dy = (b.y - a.y) / 2
	const c1 = vertical ? { x: a.x, y: a.y + dy } : { x: a.x + dx, y: a.y }
	const c2 = vertical ? { x: b.x, y: b.y - dy } : { x: b.x - dx, y: b.y }
	return { c1, c2 }
}

function pointOn(a: Point, c1: Point, c2: Point, b: Point, t: number) {
	const u = 1 - t
	return {
		x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
		y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
	}
}

/** A connector that draws itself on, then carries little pulses of money along it. */
export function Flow({
	from,
	to,
	at = 0,
	duration = 22,
	tint = color.allocation,
	vertical = false,
	pulses = true,
	width = 4,
	dashed = false,
	controls,
}: {
	from: Point
	to: Point
	/** Bezier handles, when the curve should leave and enter along particular directions. */
	controls?: { c1: Point; c2: Point }
	at?: number
	duration?: number
	tint?: string
	vertical?: boolean
	pulses?: boolean
	width?: number
	dashed?: boolean
}) {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	const drawn = useProgress(at, duration)
	const { c1, c2 } = controls ?? bezier(from, to, vertical)
	const d = `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`
	const live = pulses && !reduced && drawn >= 1
	return (
		<svg
			width={952}
			height={520}
			style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
			aria-hidden
		>
			<path
				d={d}
				stroke={alpha(tint, 0.16)}
				strokeWidth={width + 10}
				fill="none"
				strokeLinecap="round"
				pathLength={1}
				strokeDasharray="1 1"
				strokeDashoffset={1 - drawn}
			/>
			<path
				d={d}
				stroke={tint}
				strokeWidth={width}
				fill="none"
				strokeLinecap="round"
				pathLength={1}
				strokeDasharray={dashed ? "0.02 0.025" : "1 1"}
				strokeDashoffset={dashed ? -frame * 0.002 : 1 - drawn}
				opacity={dashed ? drawn : 1}
			/>
			{drawn > 0 && drawn < 1 && (
				<circle
					cx={pointOn(from, c1, c2, to, drawn).x}
					cy={pointOn(from, c1, c2, to, drawn).y}
					r={width * 2.2}
					fill={tint}
					style={{ filter: `drop-shadow(0 0 10px ${tint})` }}
				/>
			)}
			{live &&
				[0, 0.5].map(offset => {
					const t = ((frame - at - duration) / 60 + offset) % 1
					const point = pointOn(from, c1, c2, to, t)
					return (
						<circle
							key={offset}
							cx={point.x}
							cy={point.y}
							r={width * 1.6}
							fill={color.ink}
							opacity={Math.sin(t * Math.PI) * 0.9}
							style={{ filter: `drop-shadow(0 0 8px ${tint})` }}
						/>
					)
				})}
		</svg>
	)
}

type Side = "left" | "right" | "top" | "bottom"

const normals: Record<Side, Point> = {
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
	top: { x: 0, y: -1 },
	bottom: { x: 0, y: 1 },
}

/** Handles that leave `a` straight out of its side and arrive at `b` straight into its side. */
function handles(a: Point, b: Point, start: Side, end: Side) {
	const reach = Math.max(36, Math.hypot(b.x - a.x, b.y - a.y) * 0.45)
	return {
		c1: { x: a.x + normals[start].x * reach, y: a.y + normals[start].y * reach },
		c2: { x: b.x + normals[end].x * reach, y: b.y + normals[end].y * reach },
	}
}

function edge(rect: DOMRect, root: DOMRect, ratio: number, side: Side): Point {
	const x = (rect.left - root.left) / ratio
	const y = (rect.top - root.top) / ratio
	const w = rect.width / ratio
	const h = rect.height / ratio
	if (side === "left") return { x, y: y + h / 2 }
	if (side === "right") return { x: x + w, y: y + h / 2 }
	if (side === "top") return { x: x + w / 2, y }
	return { x: x + w / 2, y: y + h }
}

/**
 * A connector between two anchored blocks, drawn from edge to edge of where they actually are, with
 * a dot at each end so it visibly plugs in. `tag` sits on the middle of the curve.
 */
export function Link({
	from,
	to,
	fromSide,
	toSide,
	at = 0,
	tint = color.allocation,
	tag,
	tagAt,
	dashed,
	pulses,
}: {
	from: string
	to: string
	fromSide?: Side
	toSide?: Side
	at?: number
	tint?: string
	tag?: ReactNode
	tagAt?: number
	dashed?: boolean
	pulses?: boolean
}) {
	const root = useContext(StageRoot)
	const [points, setPoints] = useState<{
		a: Point
		b: Point
		start: Side
		end: Side
	} | null>(null)
	useLayoutEffect(() => {
		const stage = root
		if (!stage) return
		const a = stage.querySelector(`[data-anchor="${from}"]`)
		const b = stage.querySelector(`[data-anchor="${to}"]`)
		if (!a || !b) return
		const box = stage.getBoundingClientRect()
		const ratio = box.width / 952 || 1
		const ra = a.getBoundingClientRect()
		const rb = b.getBoundingClientRect()
		const dx = (rb.left + rb.width / 2 - ra.left - ra.width / 2) / ratio
		const dy = (rb.top + rb.height / 2 - ra.top - ra.height / 2) / ratio
		const vertical = Math.abs(dy) > Math.abs(dx) * 1.2
		const start: Side =
			fromSide ?? (vertical ? (dy > 0 ? "bottom" : "top") : dx > 0 ? "right" : "left")
		const end: Side =
			toSide ?? (vertical ? (dy > 0 ? "top" : "bottom") : dx > 0 ? "left" : "right")
		const next = { a: edge(ra, box, ratio, start), b: edge(rb, box, ratio, end), start, end }
		setPoints(previous =>
			previous &&
			previous.start === next.start &&
			previous.end === next.end &&
			Math.abs(previous.a.x - next.a.x) < 0.5 &&
			Math.abs(previous.a.y - next.a.y) < 0.5 &&
			Math.abs(previous.b.x - next.b.x) < 0.5 &&
			Math.abs(previous.b.y - next.b.y) < 0.5
				? previous
				: next,
		)
	})
	const drawn = useProgress(at, 22)
	if (!points) return null
	const controls = handles(points.a, points.b, points.start, points.end)
	const middle = pointOn(points.a, controls.c1, controls.c2, points.b, 0.5)
	return (
		<>
			<Flow
				from={points.a}
				to={points.b}
				controls={controls}
				at={at}
				tint={tint}
				dashed={dashed}
				pulses={pulses}
			/>
			<svg
				width={952}
				height={520}
				style={{
					position: "absolute",
					inset: 0,
					overflow: "visible",
					pointerEvents: "none",
				}}
				aria-hidden
			>
				{[points.a, points.b].map(point => (
					<circle
						key={`${point.x},${point.y}`}
						cx={point.x}
						cy={point.y}
						r={6}
						fill={color.night}
						stroke={tint}
						strokeWidth={3}
						opacity={drawn}
					/>
				))}
			</svg>
			{tag !== undefined && (
				<div style={{ position: "absolute", left: middle.x, top: middle.y }}>
					<AllocationTag amount={tag} label="" at={tagAt ?? at + 12} tint={tint} />
				</div>
			)}
		</>
	)
}

export function Tile({
	label,
	value,
	tint,
	sub,
	style,
}: {
	label: string
	value: ReactNode
	tint: string
	sub?: ReactNode
	style?: CSSProperties
}) {
	return (
		<Card tint={tint} style={{ padding: "24px 26px", overflow: "hidden", ...style }}>
			<div
				style={{
					position: "absolute",
					left: 0,
					top: 22,
					bottom: 22,
					width: 5,
					borderRadius: 9,
					background: tint,
				}}
			/>
			<div style={{ fontSize: 22, fontWeight: 600, color: color.dim }}>{label}</div>
			<div style={{ fontSize: 50, fontWeight: 750, letterSpacing: "-0.03em", marginTop: 6 }}>
				{value}
			</div>
			{sub && <div style={{ fontSize: 20, color: color.dim, marginTop: 6 }}>{sub}</div>}
		</Card>
	)
}

/** A browser window, standing in for "this browser on this device". */
export function BrowserWindow({
	url = "finpoint.app",
	children,
	style,
	tint,
}: {
	url?: string
	children?: ReactNode
	style?: CSSProperties
	tint?: string
}) {
	return (
		<Card tint={tint} style={{ overflow: "hidden", ...style }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 10,
					padding: "16px 20px",
					borderBottom: `1.5px solid ${color.line}`,
					background: "rgba(255,255,255,0.03)",
				}}
			>
				{["#ff5f57", "#febc2e", "#28c840"].map(dot => (
					<span
						key={dot}
						style={{
							width: 14,
							height: 14,
							borderRadius: 99,
							background: dot,
							opacity: 0.85,
						}}
					/>
				))}
				<span
					style={{
						marginLeft: 14,
						padding: "6px 18px",
						borderRadius: 99,
						background: "rgba(255,255,255,0.06)",
						color: color.dim,
						fontSize: 19,
					}}
				>
					{url}
				</span>
			</div>
			<div style={{ position: "relative" }}>{children}</div>
		</Card>
	)
}

/** A file on disk: a bank CSV, a JSON backup, a PDF that will not import. */
export function FileDoc({
	ext,
	name,
	tint,
	size = 1,
	crossed = 0,
	style,
}: {
	ext: string
	name?: string
	tint: string
	size?: number
	crossed?: number
	style?: CSSProperties
}) {
	return (
		<div
			style={{
				width: 150 * size,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 12 * size,
				...style,
			}}
		>
			<div
				style={{
					position: "relative",
					width: 120 * size,
					height: 150 * size,
					borderRadius: 18 * size,
					background: `linear-gradient(160deg, ${alpha(tint, 0.3)}, ${alpha(tint, 0.08)}), ${color.raised}`,
					boxShadow: `inset 0 0 0 2px ${alpha(tint, 0.5)}, 0 18px 40px rgba(0,0,0,0.4)`,
					clipPath: `polygon(0 0, 70% 0, 100% 22%, 100% 100%, 0 100%)`,
				}}
			>
				<div
					style={{
						position: "absolute",
						right: 0,
						top: 0,
						width: "30%",
						height: "22%",
						background: alpha(tint, 0.5),
						borderBottomLeftRadius: 10 * size,
					}}
				/>
				<FileText
					size={40 * size}
					color={tint}
					style={{ position: "absolute", left: 18 * size, top: 24 * size, opacity: 0.6 }}
				/>
				<div
					style={{
						position: "absolute",
						left: 14 * size,
						bottom: 16 * size,
						padding: `${4 * size}px ${10 * size}px`,
						borderRadius: 8 * size,
						background: tint,
						color: color.night,
						fontSize: 22 * size,
						fontWeight: 800,
						letterSpacing: "0.04em",
					}}
				>
					{ext}
				</div>
				{crossed > 0 && (
					<svg
						viewBox="0 0 120 150"
						style={{ position: "absolute", inset: 0 }}
						aria-hidden
					>
						<path
							d="M 18 20 L 102 130"
							stroke={color.danger}
							strokeWidth={9}
							strokeLinecap="round"
							pathLength={1}
							strokeDasharray="1 1"
							strokeDashoffset={1 - crossed}
						/>
					</svg>
				)}
			</div>
			{name && (
				<div
					style={{
						fontSize: 20 * Math.max(size, 0.9),
						color: color.dim,
						whiteSpace: "nowrap",
					}}
				>
					{name}
				</div>
			)}
		</div>
	)
}

/** A thin bar that fills to `value` (0–1). */
export function Meter({
	value,
	tint,
	height = 14,
	style,
	marker,
}: {
	value: number
	tint: string
	height?: number
	style?: CSSProperties
	marker?: number
}) {
	return (
		<div
			style={{
				position: "relative",
				height,
				borderRadius: 99,
				background: "rgba(255,255,255,0.07)",
				...style,
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: 0,
					width: `${Math.max(0, Math.min(1, value)) * 100}%`,
					borderRadius: 99,
					background: `linear-gradient(90deg, ${alpha(tint, 0.7)}, ${tint})`,
					boxShadow: `0 0 18px ${alpha(tint, 0.5)}`,
				}}
			/>
			{marker !== undefined && (
				<div
					style={{
						position: "absolute",
						left: `${marker * 100}%`,
						top: -8,
						bottom: -8,
						width: 3,
						borderRadius: 3,
						background: color.ink,
					}}
				/>
			)}
		</div>
	)
}

/** Draws a check mark stroke by stroke. */
export function CheckMark({
	at = 0,
	size = 120,
	tint = color.record,
}: {
	at?: number
	size?: number
	tint?: string
}) {
	const ring = useProgress(at, 22)
	const tick = useProgress(at + 12, 16)
	return (
		<svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
			<circle cx={60} cy={60} r={52} fill={alpha(tint, 0.14 * ring)} />
			<circle
				cx={60}
				cy={60}
				r={52}
				stroke={tint}
				strokeWidth={6}
				fill="none"
				pathLength={1}
				strokeDasharray="1 1"
				strokeDashoffset={1 - ring}
				transform="rotate(-90 60 60)"
				strokeLinecap="round"
			/>
			<path
				d="M 38 62 L 53 77 L 83 45"
				stroke={tint}
				strokeWidth={9}
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				pathLength={1}
				strokeDasharray="1 1"
				strokeDashoffset={1 - tick}
			/>
		</svg>
	)
}

/** A gentle wobble for warnings, settling after it lands. */
export function useWobble(at: number) {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	if (reduced) return 0
	const local = frame - at
	return (
		interpolate(local, [0, 40], [1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}) *
		Math.sin(local / 2.4) *
		9
	)
}
