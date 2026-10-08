import { type RefObject, useEffect, useRef } from "react"
import { DURATION, EASE_OUT } from "@/lib/motion"

let pendingDirection: -1 | 0 | 1 = 0

/** Record which way the month is moving (1 = later, -1 = earlier) for the next content swap. */
export function armMonthTransition(direction: -1 | 1): void {
	pendingDirection = direction
}

/**
 * Read and reset the armed direction. Kept behind a call on purpose: with the value read
 * inline, the React Compiler folded the read past the reset and the nudge never played.
 */
function takeMonthDirection(): -1 | 0 | 1 {
	const direction = pendingDirection
	pendingDirection = 0
	return direction
}

/**
 * Nudges the content in the direction of travel once the new month's data is on screen, so
 * stepping forward/back reads as time moving. `dataKey` identifies the month the rendered data
 * belongs to (null before the first load). Skips the first data and any change that was not
 * armed by month navigation.
 */
export function useMonthTransition(
	ref: RefObject<HTMLElement | null>,
	dataKey: string | null,
): void {
	const previous = useRef(dataKey)

	useEffect(() => {
		if (dataKey === null || previous.current === dataKey) return
		const first = previous.current === null
		previous.current = dataKey
		const direction = takeMonthDirection()
		const element = ref.current
		if (first || !element || direction === 0) return
		// Plain WAAPI with no fill: nothing is left inline afterwards, so the element never
		// lingers as a transformed containing block for fixed descendants (the selection bar).
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		const animation = element.animate(
			reduceMotion
				? { opacity: [0.4, 1] }
				: {
						opacity: [0.4, 1],
						transform: [`translateX(${direction * 10}px)`, "translateX(0)"],
					},
			{ duration: DURATION.base * 1000, easing: `cubic-bezier(${EASE_OUT.join(", ")})` },
		)
		return () => animation.cancel()
	}, [ref, dataKey])
}

/**
 * Classes for month content whose data still belongs to the previous month: it dims after a
 * short delay, so quick loads swap straight in and slow ones read as loading, not as wrong numbers.
 */
export const STALE_MONTH_CLASS = "opacity-50 transition-opacity delay-150 duration-200"
