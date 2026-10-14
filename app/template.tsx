"use client"

import { usePathname } from "next/navigation"
import { pathDashboard, pathMonthlyRecords } from "@/routes"

/**
 * Remounts on every navigation (unlike layout) so the page enter animation
 * replays per route. Overview and Monthly Records share one key so tab switches keep
 * the month shell mounted.
 *
 * Fade only: the content's own reveal and row cascade carry the upward motion, so a
 * slide here would stack a second rise on top. Without a transform, `fixed` children
 * (the selection bar) also stay anchored to the viewport while it plays.
 */
export default function Template({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const key =
		pathname === pathDashboard() || pathname === pathMonthlyRecords() ? "month" : pathname

	return (
		<div key={key} className="animate-in fade-in duration-200 ease-out">
			{children}
		</div>
	)
}
