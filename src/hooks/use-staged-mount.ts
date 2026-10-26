import { useEffect, useState } from "react"

/**
 * Counts up to `stages`, one step per painted frame once `ready`. Gate heavy below-the-fold
 * sections on it (`stage > n`) so they mount in separate small commits after the first paint,
 * instead of one long commit that blocks the page's arrival.
 */
export function useStagedMount(stages: number, ready = true): number {
	const [mounted, setMounted] = useState(0)

	useEffect(() => {
		if (!ready || mounted >= stages) return
		let timeout: ReturnType<typeof setTimeout> | undefined
		// rAF then a task: the step lands after the current frame has painted.
		const frame = requestAnimationFrame(() => {
			timeout = setTimeout(() => setMounted(count => count + 1))
		})
		return () => {
			cancelAnimationFrame(frame)
			clearTimeout(timeout)
		}
	}, [mounted, stages, ready])

	return mounted
}
