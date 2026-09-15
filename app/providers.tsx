"use client"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useEffect, useState } from "react"
import AppSidebar from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { db } from "@/data/db"
import { seedIfEmpty } from "@/data/seed"
import { HistoryProvider } from "@/history"
import { initializeAppearance } from "@/hooks/use-appearance"
import { useSyncToasts } from "@/hooks/use-sync-toasts"
import { startAutoSync } from "@/logic/auto-sync"

function Boot() {
	useSyncToasts()
	const [failed, setFailed] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false
		initializeAppearance("system")
		db.open()
			.then(() => seedIfEmpty())
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
			<div className="flex min-h-screen items-center justify-center p-8 text-sm text-muted-foreground">
				Finpoint could not start: {failed}
			</div>
		)
	}
	return null
}

export default function Providers({
	children,
	sidebarOpen,
}: {
	children: React.ReactNode
	sidebarOpen: boolean
}) {
	return (
		<HistoryProvider>
			<TooltipProvider delayDuration={0}>
				<SidebarProvider
					defaultOpen={sidebarOpen}
					style={
						{
							"--sidebar-width": "calc(var(--spacing) * 72)",
							"--header-height": "calc(var(--spacing) * 12)",
						} as React.CSSProperties
					}
				>
					<Boot />
					<Toaster />
					<Analytics />
					<SpeedInsights />
					<AppSidebar />
					<SidebarInset className="min-h-full">{children}</SidebarInset>
				</SidebarProvider>
			</TooltipProvider>
		</HistoryProvider>
	)
}
