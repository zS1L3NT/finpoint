import { Outlet, useLocation } from "react-router-dom"
import AppSidebar from "@/components/layout/app-sidebar"
import Observability from "@/components/observability"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HistoryProvider } from "@/history"

function TransitionedOutlet() {
	const { pathname } = useLocation()
	// Overview and Monthly Records share one shell key so tab switches keep
	// the month header mounted; their content animates itself on arrival.
	const key = pathname === "/" || pathname === "/records/monthly" ? "month" : pathname

	return (
		<div
			key={key}
			className="animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none"
		>
			<Outlet />
		</div>
	)
}

export default function Layout() {
	return (
		<HistoryProvider>
			<TooltipProvider delayDuration={0}>
				<SidebarProvider
					defaultOpen
					style={
						{
							"--sidebar-width": "calc(var(--spacing) * 72)",
							"--header-height": "calc(var(--spacing) * 12)",
						} as React.CSSProperties
					}
				>
					<Toaster />
					<Observability />
					<AppSidebar />
					<SidebarInset className="min-h-full">
						<TransitionedOutlet />
					</SidebarInset>
				</SidebarProvider>
				<Toaster />
			</TooltipProvider>
		</HistoryProvider>
	)
}
