import { useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Recharts animation props shared by every chart: a short ease-out grow-in that
 * plays once per `introKey` (mount by default), never on hover, resize or data
 * refreshes. Recharts only accepts named easings, so `ease-out` is the strongest on offer.
 */
export const CHART_INTRO_MS = 450
// Genuine ends cannot arrive earlier than begin + duration; anything earlier is a
// cleanup artifact. Small grace for rAF/timer granularity.
const END_GRACE_MS = 50

export function useChartIntro(introKey = "mount") {
	const reduceMotion = useReducedMotion()
	const [played, setPlayed] = useState<string | null>(null)
	// Installed JavascriptAnimate calls onAnimationEnd from its effect cleanup on
	// every unmount/restart, even mid-flight
	// (recharts/es6/animation/JavascriptAnimate.js). Area/Bar remount the animator
	// (key change) whenever points/props identity changes (useAnimationId), so a
	// mid-intro data tick would otherwise mark the intro played and stillborn the
	// restarted animation. The manager sequences a genuine end after begin +
	// duration, so ends arriving earlier must be premature cleanups: ignore them.
	const armedAt = useRef(0)
	useEffect(() => {
		armedAt.current = performance.now()
	}, [introKey])
	// Recharts invokes onAnimationStart synchronously when an intro actually begins
	// (manager sequence). Re-arm here so staged late mounts and remounts measure
	// from the real start, and clear any premature mark: a remount cleanup always
	// runs before the new start in the same commit, so clearing can only revive a
	// stillborn restart, never erase a genuine completion (no start follows those).
	// This callback only ever resets; it never marks played, so zero-bar mounts
	// cannot complete the intro early.
	const onAnimationStart = useCallback(() => {
		armedAt.current = performance.now()
		setPlayed(null)
	}, [])
	const onAnimationEnd = useCallback(() => {
		if (performance.now() - armedAt.current < CHART_INTRO_MS - END_GRACE_MS) return
		setPlayed(introKey)
	}, [introKey])
	const active = !reduceMotion && played !== introKey
	return {
		isAnimationActive: active,
		animationDuration: CHART_INTRO_MS,
		animationEasing: "ease-out" as const,
		onAnimationStart,
		onAnimationEnd,
	}
}
