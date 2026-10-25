"use client"

import { DateTime } from "luxon"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { useSidebar } from "@/components/ui/sidebar"
import { useHistory } from "@/history"
import { useDefaultFilterEndDateToday, useDefaultFilterStartDate } from "@/hooks/use-settings"
import { cn } from "@/lib/utils"
import { pathAllocator, pathDashboard, pathRecords } from "@/routes"

const TAB_CLASS =
	"flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-lg py-1.5 text-[0.6875rem] text-muted-foreground transition-colors duration-150 ease-out active:bg-muted [&_svg]:size-5"

/** Phone-only primary navigation; the sidebar drawer stays the full toolset behind Menu. */
export default function MobileTabBar() {
	const { handleClear } = useHistory()
	const { openMobile, toggleSidebar } = useSidebar()
	const pathname = usePathname()
	const defaultFilterStartDate = useDefaultFilterStartDate()
	const defaultFilterEndDate = useDefaultFilterEndDateToday()
		? DateTime.now().toFormat("yyyy-MM-dd")
		: undefined
	const range = {
		start_date: defaultFilterStartDate ?? undefined,
		end_date: defaultFilterEndDate,
	}

	const tabs = [
		{
			to: pathDashboard(),
			icon: "lucide:chart-area",
			label: "Dashboard",
			active: pathname === "/" || pathname.startsWith("/records/monthly"),
		},
		{
			to: pathRecords(defaultFilterStartDate || defaultFilterEndDate ? range : undefined),
			icon: "lucide:receipt-text",
			label: "Records",
			active: pathname.startsWith("/records") && !pathname.startsWith("/records/monthly"),
		},
		{
			to: pathAllocator(range),
			icon: "lucide:link",
			label: "Workflows",
			active: pathname.startsWith("/allocator"),
		},
	]

	return (
		<nav
			aria-label="Primary"
			className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background/90 px-2 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur-xl select-none md:hidden"
		>
			{tabs.map(tab => (
				<Link
					key={tab.label}
					href={tab.to}
					aria-current={tab.active ? "page" : undefined}
					className={cn(TAB_CLASS, tab.active && "font-medium text-foreground")}
					onClick={handleClear}
				>
					<IconifyIcon icon={tab.icon} />
					{tab.label}
				</Link>
			))}
			<button
				type="button"
				aria-expanded={openMobile}
				className={cn(TAB_CLASS, openMobile && "font-medium text-foreground")}
				onClick={toggleSidebar}
			>
				<IconifyIcon icon="lucide:menu" />
				Menu
			</button>
		</nav>
	)
}
