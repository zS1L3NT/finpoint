import { usePage } from "@inertiajs/react"
import AppSidebar from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { SharedPageProps } from "@/types"
import { TooltipProvider } from "./components/ui/tooltip"
import { HistoryProvider } from "./history"

export default function Layout({ children }: { children: React.ReactNode }) {
	const { sidebarOpen } = usePage<SharedPageProps>().props

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
					<Toaster />
					<AppSidebar />
					<SidebarInset className="min-h-full">{children}</SidebarInset>
				</SidebarProvider>
				<Toaster />
			</TooltipProvider>
		</HistoryProvider>
	)
}
