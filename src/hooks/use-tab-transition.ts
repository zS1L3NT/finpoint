import { useEffect, useState } from "react"

let armed = false

/** Arm the next month-tab content to fade in. Called by tabs and dashboard shortcuts. */
export function armTabTransition(): void {
	armed = true
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
	const [animate, setAnimate] = useState(false)

	useEffect(() => {
		if (consumeTabTransition()) setAnimate(true)
	}, [])

	return animate
}
