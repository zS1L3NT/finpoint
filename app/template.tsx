"use client"

import { usePathname } from "next/navigation"

/**
 * Remounts on every navigation (unlike layout) so the page enter animation
 * replays per route. The Dashboard layout keeps its month header mounted.
 *
 * Fade only: the content's own reveal and row cascade carry the upward motion, so a
 * slide here would stack a second rise on top. Without a transform, `fixed` children
 * (the selection bar) also stay anchored to the viewport while it plays.
 */
export default function Template({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()

	return (
		<div key={pathname} className="animate-in fade-in duration-200 ease-out">
			{children}
		</div>
	)
}
