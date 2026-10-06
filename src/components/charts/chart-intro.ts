import { useReducedMotion } from "framer-motion"
import { useState } from "react"

/**
 * Recharts animation props shared by every chart: a short ease-out grow-in that
 * plays once per `introKey` (mount by default), never on hover, resize or data
 * refreshes. Recharts only accepts named easings, so `ease-out` is the strongest on offer.
 */
export const CHART_INTRO_MS = 400

export function useChartIntro(introKey = "mount") {
	const reduceMotion = useReducedMotion()
	const [played, setPlayed] = useState<string | null>(null)
	const active = !reduceMotion && played !== introKey
	return {
		isAnimationActive: active,
		animationDuration: CHART_INTRO_MS,
		animationEasing: "ease-out" as const,
		onAnimationEnd: () => setPlayed(introKey),
	}
}
