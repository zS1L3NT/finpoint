import type { Transition } from "framer-motion"

/**
 * Shared motion vocabulary, mirroring the CSS tokens in `src/app.css` so framer-motion
 * and Tailwind animations feel like one system.
 */

/** Strong ease-out: enters, exits and anything reacting to input. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** Strong ease-in-out: things already on screen moving to a new place. */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

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
 * How a table's rows enter:
 * - `cascade`: first arrival of the data; the rows on screen rise in one after another.
 * - `refilter`: the rows changed on the same page (filters, search, edits that add or remove
 *   rows); the same rise, but quicker and shorter so repeated changes stay light.
 * - `fade`: everything else (a new page, rows joining later); a plain brief fade.
 */
export type RowEntrance = "cascade" | "refilter" | "fade"

/** Per-row timings of the table entrance, in seconds. */
const ROW_FADE_DURATION = 0.18
const ROW_REFILTER_DURATION = 0.24
const ROW_CASCADE_DURATION = 0.28
/** Compress the stagger smoothly so every item enters, even in very long lists. */
const cascadeDelay = (index: number) => (0.45 * index) / (index + 15)
const ROW_REFILTER_RISE = 6
const ROW_CASCADE_RISE = 10

/** Motion props for every table row (or its group header), with a bounded stagger. */
export const rowEnter = (index: number, entrance: RowEntrance) => {
	if (entrance === "fade") {
		return {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			transition: { duration: ROW_FADE_DURATION, ease: EASE_OUT },
		}
	}
	const refilter = entrance === "refilter"
	return {
		initial: { opacity: 0, y: refilter ? ROW_REFILTER_RISE : ROW_CASCADE_RISE },
		animate: { opacity: 1, y: 0 },
		transition: {
			duration: refilter ? ROW_REFILTER_DURATION : ROW_CASCADE_DURATION,
			ease: EASE_OUT,
			delay: cascadeDelay(index) * (refilter ? 2 / 3 : 1),
		},
	}
}

/** Motion props for a card in a grid: a short rise with the same bounded cascade as rows. */
export const cardEnter = (index: number) => ({
	initial: { opacity: 0, y: 6 },
	animate: { opacity: 1, y: 0 },
	transition: { ...TRANSITION.base, delay: cascadeDelay(index) },
})

/** Motion props for a block that collapses to nothing: height and margin close together. */
export const COLLAPSE_MOTION = {
	initial: { opacity: 0, height: 0, marginTop: -16 },
	animate: { opacity: 1, height: "auto", marginTop: 0 },
	exit: { opacity: 0, height: 0, marginTop: -16, transition: TRANSITION.fast },
	transition: {
		height: SPRING.smooth,
		marginTop: SPRING.smooth,
		opacity: TRANSITION.base,
	},
} as const
