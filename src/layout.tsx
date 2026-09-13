import { Outlet } from "react-router-dom"
import AppSidebar from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HistoryProvider } from "@/history"

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
					<AppSidebar />
					<SidebarInset className="min-h-full">
						<Outlet />
					</SidebarInset>
				</SidebarProvider>
				<Toaster />
			</TooltipProvider>
		</HistoryProvider>
	)
}
