import { type CSSProperties, createContext, type ReactNode, useContext } from "react"
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { ease, font, money } from "./theme"

export const ReducedMotion = createContext(false)

/** Spoken words of the current narration segment and the frame each one starts on. */
export const Cues = createContext<{ words: string[]; frames: number[] }>({ words: [], frames: [] })

export const useReduced = () => useContext(ReducedMotion)

const normalize = (word: string) => word.toLowerCase().replace(/[^a-z0-9$−+]/g, "")

/**
 * The frame on which `match` is spoken in the current segment, so visuals land on the word that
 * introduces them. `nth` picks a later occurrence; a missing word falls back to `fallback`.
 */
export function useCue(match: string, { nth = 0, offset = 0, fallback = 0 } = {}) {
	const { words, frames } = useContext(Cues)
	const target = normalize(match)
	let seen = 0
	for (let index = 0; index < words.length; index++) {
		if (normalize(words[index] ?? "").startsWith(target)) {
			if (seen === nth) return (frames[index] ?? fallback) + offset
			seen++
		}
	}
	return fallback + offset
}

/** 0 → 1 over `duration` frames from `at`, on the app's strong ease-out. */
export function useProgress(at: number, duration = 18) {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	return interpolate(frame, [at, at + (reduced ? 6 : duration)], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: reduced ? undefined : ease.out,
	})
}

/** A soft spring with a little overshoot, for things that arrive with weight. */
export function useSpring(at: number, { damping = 14, mass = 0.7, stiffness = 140 } = {}) {
	const frame = useCurrentFrame()
	const { fps } = useVideoConfig()
	const reduced = useReduced()
	if (reduced) return frame >= at ? 1 : 0
	return spring({ frame: frame - at, fps, config: { damping, mass, stiffness } })
}

export function Rise({
	at = 0,
	y = 28,
	x = 0,
	from = 1,
	duration = 20,
	children,
	style,
}: {
	at?: number
	y?: number
	x?: number
	from?: number
	duration?: number
	children: ReactNode
	style?: CSSProperties
}) {
	const progress = useProgress(at, duration)
	const reduced = useReduced()
	const shift = reduced ? 0 : 1 - progress
	return (
		<div
			style={{
				opacity: progress,
				transform: `translate(${x * shift}px, ${y * shift}px) scale(${from + (1 - from) * progress})`,
				...style,
			}}
		>
			{children}
		</div>
	)
}

export function Pop({
	at = 0,
	children,
	style,
	from = 0.4,
}: {
	at?: number
	children: ReactNode
	style?: CSSProperties
	from?: number
}) {
	const value = useSpring(at)
	const frame = useCurrentFrame()
	return (
		<div
			style={{
				opacity: interpolate(frame, [at, at + 6], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				}),
				transform: `scale(${from + (1 - from) * value})`,
				...style,
			}}
		>
			{children}
		</div>
	)
}

/** A signed amount that counts towards its value, then settles. */
export function CountUp({
	value,
	from = 0,
	at = 0,
	duration = 36,
	signed = true,
	format,
	style,
}: {
	value: number
	from?: number
	at?: number
	duration?: number
	signed?: boolean
	format?: (value: number) => string
	style?: CSSProperties
}) {
	const progress = useProgress(at, duration)
	const current = from + (value - from) * progress
	return (
		<span style={{ ...font.numbers, whiteSpace: "nowrap", ...style }}>
			{format ? format(current) : money(current, { signed })}
		</span>
	)
}

/** Swaps between two values with a quick vertical roll. */
export function Roll({
	at,
	before,
	after,
	style,
}: {
	at: number
	before: ReactNode
	after: ReactNode
	style?: CSSProperties
}) {
	const progress = useProgress(at, 16)
	return (
		<span
			style={{
				position: "relative",
				display: "inline-grid",
				overflow: "hidden",
				verticalAlign: "bottom",
				...style,
			}}
		>
			<span
				style={{
					gridArea: "1 / 1",
					opacity: 1 - progress,
					transform: `translateY(${-60 * progress}%)`,
				}}
			>
				{before}
			</span>
			<span
				style={{
					gridArea: "1 / 1",
					opacity: progress,
					transform: `translateY(${60 * (1 - progress)}%)`,
				}}
			>
				{after}
			</span>
		</span>
	)
}

/** Fades a layer in on arrival and out at `end`, so segments overlap into a soft cut. */
export function useLayer(end: number, { enter = 14, exit = 12 } = {}) {
	const frame = useCurrentFrame()
	const reduced = useReduced()
	const opening = interpolate(frame, [0, enter], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: ease.out,
	})
	const closing = interpolate(frame, [end - 2, end + exit - 2], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: ease.inOut,
	})
	return {
		opacity: Math.min(opening, closing),
		transform: reduced
			? undefined
			: `translateY(${(1 - opening) * 18 - (1 - closing) * 18}px) scale(${0.985 + 0.015 * Math.min(opening, closing)})`,
	}
}
