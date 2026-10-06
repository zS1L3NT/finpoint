import type { Transition } from "framer-motion"

/**
 * Shared motion vocabulary, mirroring the CSS tokens in `src/app.css` so framer-motion
 * and Tailwind animations feel like one system.
 */

/** Strong ease-out: enters, exits and anything reacting to input. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** Strong ease-in-out: things already on screen moving to a new place. */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

/** iOS-like drawer curve for edge sheets. */
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const

/** Durations in seconds. UI motion stays under 300ms; frequent actions sit at the low end. */
export const DURATION = {
	instant: 0.12,
	fast: 0.16,
	base: 0.22,
	slow: 0.3,
} as const

export const TRANSITION = {
	fast: { duration: DURATION.fast, ease: EASE_OUT },
	base: { duration: DURATION.base, ease: EASE_OUT },
	move: { duration: DURATION.slow, ease: EASE_IN_OUT },
} satisfies Record<string, Transition>

/** Critically damped springs: no overshoot, interruptible, for layout and indicators. */
export const SPRING = {
	snappy: { type: "spring", duration: 0.3, bounce: 0 },
	smooth: { type: "spring", duration: 0.45, bounce: 0 },
	/** A touch of bounce for celebratory or tactile moments only. */
	lively: { type: "spring", duration: 0.4, bounce: 0.15 },
} satisfies Record<string, Transition>

/** Delay for the nth item of a cascading entrance; the cap keeps long lists from dragging on. */
export const staggerDelay = (index: number, step = 0.025, cap = 14) => Math.min(index, cap) * step

/** Props for a table row that rises into place as its data arrives, cascading down the list. */
export const rowEnter = (index: number) => ({
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.34, ease: EASE_OUT, delay: staggerDelay(index) },
})
