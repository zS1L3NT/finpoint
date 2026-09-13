import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { useLocation } from "react-router-dom"

const DYNAMIC_ROUTES: [RegExp, string][] = [
	[/^\/statements\/[^/]+$/, "/statements/:id"],
	[/^\/accounts\/[^/]+$/, "/accounts/:id"],
	[/^\/records\/[^/]+$/, "/records/:id"],
	[/^\/budgets\/[^/]+$/, "/budgets/:id"],
]

function toRoutePattern(pathname: string): string {
	for (const [pattern, route] of DYNAMIC_ROUTES) {
		if (pattern.test(pathname)) return route
	}
	return pathname
}

/**
 * Vercel observability. Mounted once in the root layout so it survives
 * client-side navigations; the route pattern keeps per-record URLs from
 * fragmenting Speed Insights metrics.
 */
export default function Observability() {
	const { pathname } = useLocation()

	return (
		<>
			<Analytics />
			<SpeedInsights route={toRoutePattern(pathname)} debug={import.meta.env.DEV} />
		</>
	)
}
