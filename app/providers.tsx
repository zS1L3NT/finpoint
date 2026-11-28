"use client"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { MotionConfig } from "framer-motion"
import { useEffect, useState } from "react"
import { preloadCategoryIcons } from "@/components/icon"
import ShellHeader from "@/components/layout/shell-header"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { db } from "@/data/db"
import { seedIfEmpty } from "@/data/seed"
import { HistoryProvider } from "@/history"
import { initializeAppearance } from "@/hooks/use-appearance"
import { useSyncToasts } from "@/hooks/use-sync-toasts"
import { UrlParamsProvider } from "@/hooks/use-url-params"
import { startAutoSync } from "@/logic/auto-sync"
import { listCategoryIconNames } from "@/logic/categories"

function Boot() {
	useSyncToasts()
	const [failed, setFailed] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false
		initializeAppearance("system")
		db.open()
			.then(() => seedIfEmpty())
			.then(() => listCategoryIconNames())
			.then(preloadCategoryIcons)
			.then(() => {
				if (!cancelled) startAutoSync()
			})
			.catch((cause: unknown) => {
				if (!cancelled) {
					setFailed(
						cause instanceof Error
							? cause.message
							: "Unable to open the local database.",
					)
				}
			})
		return () => {
			cancelled = true
		}
	}, [])

	if (failed) {
		return (
			<div className="flex min-h-screen items-center justify-center p-8 text-xs text-muted-foreground">
				Finpoint could not start: {failed}
			</div>
		)
	}
	return null
}

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<MotionConfig reducedMotion="user">
			<HistoryProvider>
				<UrlParamsProvider>
					<TooltipProvider delayDuration={0}>
						<Boot />
						<Toaster />
						<Analytics />
						<SpeedInsights />
						<div className="flex min-h-svh flex-col">
							<ShellHeader />
							<main className="flex-1">{children}</main>
						</div>
					</TooltipProvider>
				</UrlParamsProvider>
			</HistoryProvider>
		</MotionConfig>
	)
}
