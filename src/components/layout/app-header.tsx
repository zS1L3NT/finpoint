"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export default function AppHeader({ title }: { title: string }) {
	const { dragDrawer } = useSidebar()

	// On phones the header doubles as the drawer's drag handle; the tab bar's Menu replaces the trigger.
	return (
		<header
			className="flex h-(--header-height) shrink-0 touch-pan-y touch-pinch-zoom items-center gap-2 border-b group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
			onPointerDown={dragDrawer}
		>
			{/* Installed (standalone) apps have no browser edge-back gesture to collide with. */}
			<div
				aria-hidden
				className="fixed inset-y-0 left-0 z-30 hidden w-5 touch-pan-y touch-pinch-zoom max-md:[@media(display-mode:standalone)]:block"
				onPointerDown={dragDrawer}
			/>
			<div className="flex min-w-0 w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1 max-md:hidden" size="icon-lg" />
				<Separator orientation="vertical" className="mx-1 max-md:hidden md:mx-2" />
				<h1 className="truncate text-sm font-medium">{title}</h1>
			</div>
		</header>
	)
}
