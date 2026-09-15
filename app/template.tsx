"use client"

import { usePathname } from "next/navigation"

/**
 * Remounts on every navigation (unlike layout) so the page enter animation
 * replays per route — mirroring the old TransitionedOutlet. Overview and
 * Monthly Records share one key so tab switches keep the month shell mounted.
 */
export default function Template({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const key = pathname === "/" || pathname === "/records/monthly" ? "month" : pathname

	return (
		<div
			key={key}
			className="animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none"
		>
			{children}
		</div>
	)
}
