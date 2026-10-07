"use client"

import { ContextHelp } from "@/components/help/context-help"
import { LearningObserver } from "@/components/help/welcome-guide"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function AppHeader({ title }: { title: string }) {
	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex min-w-0 w-full items-center gap-1 px-3 md:px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" size="icon-lg" />
				<Separator orientation="vertical" className="mx-1 md:mx-2" />
				<h1 className="truncate text-base font-medium">{title}</h1>
				<div className="ml-auto">
					<ContextHelp />
				</div>
				<LearningObserver />
			</div>
		</header>
	)
}
