import { animate } from "framer-motion"
import { type RefObject, useEffect, useRef, useState } from "react"
import { DURATION, EASE_OUT } from "@/lib/motion"

let armed = false
let monthDirection: -1 | 0 | 1 = 0

/** Arm the next month-tab content to fade in. Called by tabs and dashboard shortcuts. */
export function armTabTransition(): void {
	armed = true
}

/** Record which way the month is moving (1 = later, -1 = earlier) for the next content swap. */
export function armMonthTransition(direction: -1 | 1): void {
	monthDirection = direction
}

function consumeTabTransition(): boolean {
	const was = armed
	armed = false
	return was
}

/**
 * True when this mount was triggered by navigation within the month shell. Month content
 * animates only then — fresh arrivals already play the shell transition,
 * so animating both would read as a double render.
 */
export function useTabTransition(): boolean {
	const [animateContent, setAnimateContent] = useState(false)

	useEffect(() => {
		if (consumeTabTransition()) setAnimateContent(true)
	}, [])

	return animateContent
}

/**
 * Nudges the content in the direction of travel when the month changes, so
 * stepping forward/back reads as time moving. Skips the first render and any
 * change that was not armed by month navigation.
 */
export function useMonthTransition(ref: RefObject<HTMLElement | null>, monthKey: string): void {
	const previous = useRef(monthKey)

	useEffect(() => {
		if (previous.current === monthKey) return
		previous.current = monthKey
		const direction = monthDirection
		monthDirection = 0
		const element = ref.current
		if (!element || direction === 0) return
		const controls = animate(
			element,
			{
				opacity: [0.4, 1],
				transform: [`translateX(${direction * 10}px)`, "translateX(0px)"],
			},
			{ duration: DURATION.base, ease: EASE_OUT },
		)
		return () => controls.stop()
	}, [ref, monthKey])
}
