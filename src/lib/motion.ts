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

/** The shortest row any table renders (a compact row, ~37px), used to count rows on screen. */
const SHORTEST_ROW = 34

/**
 * How many rows cascade in on arrival: every row that can fit on this screen, plus a couple of
 * spare. Anything past that is below the fold, so it appears with the page: capping only the
 * delay would make every remaining row start fading in at once.
 */
export const rowCascadeLimit = () =>
	typeof window === "undefined" ? 24 : Math.ceil(window.innerHeight / SHORTEST_ROW) + 2

/** The whole cascade lands within this window however tall the screen, so big screens stay quick. */
const CASCADE_SPAN = { cascade: 0.5, refilter: 0.3 }

/**
 * How a table's rows enter:
 * - `cascade`: first arrival of the data; the rows on screen rise in one after another.
 * - `refilter`: the rows changed on the same page (filters, search, edits that add or remove
 *   rows); the same rise, but quicker and shorter so repeated changes stay light.
 * - `fade`: everything else (a new page, rows joining later); a plain brief fade.
 */
export type RowEntrance = "cascade" | "refilter" | "fade"

/** Motion props for a table row (or its group header); rows past the fold do not animate. */
export const rowEnter = (index: number, entrance: RowEntrance) => {
	const limit = rowCascadeLimit()
	if (index >= limit) return { initial: false as const }
	if (entrance === "fade") {
		return {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			transition: { duration: 0.18, ease: EASE_OUT },
		}
	}
	const refilter = entrance === "refilter"
	return {
		initial: { opacity: 0, y: refilter ? 6 : 10 },
		animate: { opacity: 1, y: 0 },
		transition: {
			duration: refilter ? 0.24 : 0.34,
			ease: EASE_OUT,
			delay: index * Math.min(refilter ? 0.02 : 0.03, CASCADE_SPAN[entrance] / limit),
		},
	}
}
