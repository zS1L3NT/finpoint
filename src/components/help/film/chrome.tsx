import {
	BookOpen,
	CircleCheck,
	CircleHelp,
	Lightbulb,
	ListChecks,
	type LucideIcon,
	TriangleAlert,
} from "lucide-react"
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion"
import { useProgress, useReduced } from "./motion"
import { alpha, color, ease, font, layout } from "./theme"

export function Logo({ size = 44, tint }: { size?: number; tint: string }) {
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: size * 0.28,
				background: `linear-gradient(145deg, ${tint}, ${alpha(tint, 0.55)})`,
				boxShadow: `0 8px 24px ${alpha(tint, 0.35)}, inset 0 1px 0 rgba(255,255,255,0.35)`,
				display: "grid",
				placeItems: "center",
			}}
		>
			<svg viewBox="380 350 520 580" width={size * 0.62} height={size * 0.62} aria-hidden>
				<g fill={color.night}>
					<path d="M 510 389 H 792 A 60 60 0 0 1 792 509 H 557 Q 537 509 537 529 V 583 H 745 A 59 59 0 0 1 745 701 H 557 Q 537 701 537 721 V 877 Q 537 888 526 888 H 482 Q 424 888 424 830 V 475 A 86 86 0 0 1 510 389 Z" />
					<circle cx="747" cy="820" r="68" />
				</g>
			</svg>
		</div>
	)
}

/** Ambient light in the chapter's accent, slowly drifting so held frames never feel frozen. */
export function Backdrop({ tint, seed }: { tint: string; seed: number }) {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	const t = reduced ? 0 : frame / 30
	const ax = 22 + Math.sin(t / 7 + seed) * 8
	const ay = 18 + Math.cos(t / 9 + seed) * 6
	const bx = 82 + Math.cos(t / 8 + seed * 2) * 7
	const by = 86 + Math.sin(t / 6 + seed) * 5
	return (
		<AbsoluteFill style={{ background: color.night, overflow: "hidden" }}>
			<AbsoluteFill
				style={{
					background: [
						`radial-gradient(60% 50% at ${ax}% ${ay}%, ${alpha(tint, 0.24)}, transparent 70%)`,
						`radial-gradient(55% 45% at ${bx}% ${by}%, ${alpha(color.allocation, 0.14)}, transparent 70%)`,
						"radial-gradient(120% 80% at 50% 120%, rgba(0,0,0,0.6), transparent 60%)",
					].join(", "),
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage:
						"radial-gradient(rgba(255,255,255,0.11) 1.4px, transparent 1.6px)",
					backgroundSize: "36px 36px",
					backgroundPosition: `${(t * 3) % 36}px ${(t * 2) % 36}px`,
					maskImage: "radial-gradient(75% 65% at 50% 45%, black, transparent)",
					WebkitMaskImage: "radial-gradient(75% 65% at 50% 45%, black, transparent)",
					opacity: 0.6,
				}}
			/>
		</AbsoluteFill>
	)
}

export function Header({
	number,
	group,
	title,
	tint,
	at,
	segment,
	segmentProgress,
	segments,
}: {
	number: number
	group: string
	title: string
	tint: string
	at: number
	segment: number
	segmentProgress: number
	segments: number
}) {
	const progress = useProgress(at, 22)
	const reduced = useReduced()
	return (
		<div
			style={{
				position: "absolute",
				left: layout.gutter,
				right: layout.gutter,
				top: 52,
				display: "flex",
				alignItems: "center",
				gap: 22,
				opacity: progress,
				transform: reduced ? undefined : `translateY(${(1 - progress) * -16}px)`,
			}}
		>
			<Logo tint={tint} size={58} />
			<div style={{ flex: 1, minWidth: 0 }}>
				<div
					style={{
						fontSize: 19,
						fontWeight: 700,
						letterSpacing: "0.16em",
						textTransform: "uppercase",
						color: tint,
					}}
				>
					<span style={font.numbers}>{String(number).padStart(2, "0")}</span>
					<span style={{ color: color.faint }}> / 17 · </span>
					{group}
				</div>
				<div
					style={{
						fontSize: 27,
						fontWeight: 650,
						letterSpacing: "-0.01em",
						marginTop: 4,
						color: color.ink,
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					{title}
				</div>
			</div>
			<div style={{ display: "flex", gap: 7 }}>
				{Array.from({ length: segments }, (_, index) => {
					const fill = index < segment ? 1 : index === segment ? segmentProgress : 0
					return (
						<div
							key={index}
							style={{
								width: index === segment ? 34 : 14,
								height: 8,
								borderRadius: 9,
								background: "rgba(255,255,255,0.13)",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									width: `${fill * 100}%`,
									height: "100%",
									background: tint,
								}}
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}

const labelIcons: Record<string, LucideIcon> = {
	"The problem": CircleHelp,
	"The idea": Lightbulb,
	"Check your result": CircleCheck,
	"Watch out": TriangleAlert,
	Example: BookOpen,
}

export const labelTint = (label: string, accent: string) =>
	label === "Check your result" ? color.record : label === "Watch out" ? color.pending : accent

/** The segment's eyebrow: what kind of moment this is (problem, steps, check…). */
export function SegmentLabel({
	label,
	tint,
	at = 0,
}: {
	label: string
	tint: string
	at?: number
}) {
	const progress = useProgress(at, 18)
	const reduced = useReduced()
	const Icon = labelIcons[label] ?? ListChecks
	return (
		<div
			style={{
				position: "absolute",
				left: layout.gutter,
				top: 160,
				display: "flex",
				alignItems: "center",
				gap: 12,
				padding: "10px 20px 10px 12px",
				borderRadius: 999,
				background: alpha(tint, 0.12),
				boxShadow: `inset 0 0 0 1.5px ${alpha(tint, 0.3)}`,
				color: tint,
				fontSize: 22,
				fontWeight: 700,
				letterSpacing: "0.08em",
				textTransform: "uppercase",
				opacity: progress,
				transform: reduced ? undefined : `translateX(${(1 - progress) * -30}px)`,
			}}
		>
			<Icon size={26} strokeWidth={2.4} />
			{label.startsWith("Step") ? "Steps" : label}
		</div>
	)
}

/**
 * The chapter opens on its question, said aloud. Words rise one after another, then the card
 * lifts away into the header as the narration moves on.
 */
export function TitleCard({
	number,
	group,
	title,
	tint,
	until,
	first,
}: {
	number: number
	group: string
	title: string
	tint: string
	until: number
	first: boolean
}) {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	const leave = interpolate(frame, [until - 14, until + 6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: ease.inOut,
	})
	const rule = useProgress(4, 30)
	const numberIn = useProgress(0, 26)
	if (leave >= 1) return null
	const words = title.split(" ")
	return (
		<AbsoluteFill
			style={{
				justifyContent: "center",
				padding: `0 ${layout.gutter + 16}px`,
				opacity: 1 - leave,
				transform: reduced
					? undefined
					: `translateY(${leave * -80}px) scale(${1 - leave * 0.06})`,
			}}
		>
			<div
				style={{
					position: "absolute",
					right: 40,
					top: 120,
					fontSize: 420,
					fontWeight: 800,
					letterSpacing: "-0.06em",
					lineHeight: 1,
					color: "transparent",
					WebkitTextStroke: `2px ${alpha(tint, 0.35)}`,
					opacity: numberIn,
					transform: reduced ? undefined : `translateX(${(1 - numberIn) * 60}px)`,
					...font.numbers,
				}}
			>
				{String(number).padStart(2, "0")}
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 34 }}>
				<Logo tint={tint} size={64} />
				<div>
					<div
						style={{
							fontSize: 22,
							fontWeight: 700,
							letterSpacing: "0.16em",
							textTransform: "uppercase",
							color: tint,
						}}
					>
						{first ? "Finpoint · Beginner guide" : `Chapter ${number}`}
					</div>
					<div style={{ fontSize: 22, color: color.dim, marginTop: 4 }}>{group}</div>
				</div>
			</div>
			<div
				style={{
					height: 4,
					width: 160 * rule,
					borderRadius: 4,
					background: tint,
					marginBottom: 36,
				}}
			/>
			<h1
				style={{
					margin: 0,
					fontSize: title.length > 52 ? 78 : 88,
					fontWeight: 760,
					lineHeight: 1.04,
					letterSpacing: "-0.04em",
					maxWidth: 900,
				}}
			>
				{words.map((word, index) => {
					const appear = interpolate(frame, [6 + index * 3, 24 + index * 3], [0, 1], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: ease.out,
					})
					return (
						<span
							key={index}
							style={{
								display: "inline-block",
								marginRight: "0.24em",
								opacity: appear,
								transform: reduced
									? undefined
									: `translateY(${(1 - appear) * 44}px)`,
								filter: reduced ? undefined : `blur(${(1 - appear) * 8}px)`,
							}}
						>
							{word}
						</span>
					)
				})}
			</h1>
		</AbsoluteFill>
	)
}
