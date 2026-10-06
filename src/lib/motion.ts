import type { Transition } from "framer-motion"
import type { CSSProperties } from "react"

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

/**
 * How many rows cascade in on arrival. Anything past this is below the fold, so it appears with
 * the page: capping only the delay would make every remaining row start fading in at once.
 */
export const ROW_CASCADE_LIMIT = 12
const ROW_STEP = 0.03

/**
 * Props for a table row. While `cascade` is on (the first moments after data arrives) the rows
 * on screen rise in one after another; afterwards, rows that join (paging, filtering, typing in
 * search) just fade, so ongoing changes stay calm.
 */
export const rowEnter = (index: number, cascade: boolean) => {
	if (index >= ROW_CASCADE_LIMIT) return { initial: false as const }
	if (!cascade) {
		return {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			transition: { duration: 0.18, ease: EASE_OUT },
		}
	}
	return {
		initial: { opacity: 0, y: 10 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.34, ease: EASE_OUT, delay: index * ROW_STEP },
	}
}

/** The same entrance as {@link rowEnter} for plain elements (the mobile list), as CSS. */
export const rowEnterCss = (
	index: number,
	cascade: boolean,
): { className?: string; style?: CSSProperties } => {
	if (index >= ROW_CASCADE_LIMIT) return {}
	if (!cascade) return { className: "animate-in fade-in ease-out [animation-duration:180ms]" }
	return {
		className:
			"animate-in fade-in slide-in-from-bottom-2 ease-out [animation-duration:340ms] [animation-fill-mode:backwards]",
		style: { animationDelay: `${index * ROW_STEP}s` },
	}
}
