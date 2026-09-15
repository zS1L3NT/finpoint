import { XIcon } from "lucide-react"
import { DateTime } from "luxon"
import { Link, useLocation } from "react-router-dom"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { START_DATE } from "@/constants"
import { useHistory } from "@/history"
import { useSyncStatus } from "@/hooks/use-sync-status"
import {
	pathAccounts,
	pathAllocator,
	pathBudgets,
	pathCategories,
	pathDashboard,
	pathDataSettings,
	pathImporter,
	pathRecords,
	pathStatements,
} from "@/routes"

function SyncDot() {
	const sync = useSyncStatus()
	if (!sync.configured) return null
	const tone: string =
		sync.activity != null
			? "bg-sky-500 animate-pulse"
			: sync.kind === "conflict" || sync.kind === "remote-newer"
				? "bg-amber-500"
				: sync.kind === "needs-auth" || sync.kind === "error"
					? "bg-red-500"
					: sync.kind === "offline"
						? sync.localDirty
							? "bg-amber-500"
							: "bg-zinc-400"
						: sync.kind === "local-changes" || sync.kind === "never-synced"
							? "bg-sky-500"
							: "bg-emerald-500"
	const title =
		sync.activity === "checking"
			? "Checking Drive…"
			: sync.activity === "pushing"
				? "Writing to Drive…"
				: sync.activity === "pulling"
					? "Reading from Drive…"
					: sync.kind === "conflict"
						? "Needs your decision"
						: sync.kind === "remote-newer"
							? "Drive has a newer copy"
							: sync.kind === "needs-auth"
								? "Reconnect Google Drive"
								: sync.kind === "offline"
									? "Offline"
									: sync.kind === "local-changes"
										? "Unsaved changes"
										: sync.kind === "never-synced"
											? "Not connected yet"
											: sync.kind === "error"
												? (sync.error ?? "Sync failed")
												: "In sync"
	return <span title={title} className={`ml-auto size-2 shrink-0 rounded-full ${tone}`} />
}

export default function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const { handleClear } = useHistory()
	const { isMobile, setOpenMobile } = useSidebar()
	const { pathname } = useLocation()
	const handleSidebarLink = () => {
		handleClear()

		if (isMobile) {
			setOpenMobile(false)
		}
	}

	const groups = [
		{
			label: "Overview",
			items: [
				{
					to: pathDashboard(),
					icon: "lucide:chart-area",
					label: "Dashboard",
					active: pathname === "/",
				},
			],
		},
		{
			label: "Manage",
			items: [
				{
					to: pathAllocator({ start_date: START_DATE }),
					icon: "lucide:link",
					label: "Allocator",
					active: pathname.startsWith("/allocator"),
				},
				{
					to: pathRecords({
						start_date: START_DATE,
						end_date: DateTime.now().toFormat("yyyy-MM-dd"),
					}),
					icon: "lucide:receipt-text",
					label: "Records",
					active: pathname.startsWith("/records"),
				},
				{
					to: pathStatements(),
					icon: "lucide:credit-card",
					label: "Statements",
					active: pathname.startsWith("/statements"),
				},
				{
					to: pathAccounts(),
					icon: "lucide:landmark",
					label: "Accounts",
					active: pathname.startsWith("/accounts"),
				},
			],
		},
		{
			label: "Plan",
			items: [
				{
					to: pathBudgets(),
					icon: "lucide:piggy-bank",
					label: "Budgets",
					active: pathname.startsWith("/budgets"),
				},
				{
					to: pathCategories(),
					icon: "lucide:tag",
					label: "Categories",
					active: pathname.startsWith("/categories"),
				},
			],
		},
		{
			label: "Data",
			items: [
				{
					to: pathImporter(),
					icon: "lucide:import",
					label: "Importer",
					active: pathname === "/importer",
				},
				{
					to: pathDataSettings(),
					icon: "lucide:refresh-cw",
					label: "Sync",
					active: pathname.startsWith("/settings"),
				},
			],
		},
	]

	return (
		<Sidebar collapsible="offcanvas" variant="floating" {...props}>
			<SidebarHeader className="flex-row items-center">
				<SidebarMenu className="min-w-0 flex-1">
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:h-auto! data-[slot=sidebar-menu-button]:py-1.5!"
						>
							<Link to={pathDashboard()} onClick={handleSidebarLink}>
								<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
									<img src="/favicon.svg" alt="" className="size-5" />
								</span>
								<span className="text-base font-semibold">Finpoint</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				{isMobile ? (
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						onClick={() => setOpenMobile(false)}
					>
						<XIcon />
						<span className="sr-only">Close menu</span>
					</Button>
				) : null}
			</SidebarHeader>
			<SidebarContent>
				{groups.map(group => (
					<SidebarGroup
						key={group.label}
						className="group-data-[collapsible=icon]:hidden"
					>
						<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						<SidebarMenu>
							{group.items.map(item => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton asChild isActive={item.active}>
										<Link to={item.to} onClick={handleSidebarLink}>
											<IconifyIcon icon={item.icon} />
											<span>{item.label}</span>
											{item.to === pathDataSettings() ? <SyncDot /> : null}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				))}
			</SidebarContent>
		</Sidebar>
	)
}
