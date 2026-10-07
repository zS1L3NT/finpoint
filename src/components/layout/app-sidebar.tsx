"use client"

import { motion } from "framer-motion"
import { MonitorIcon, MoonIcon, SunIcon, XIcon } from "lucide-react"
import { DateTime } from "luxon"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar"
import { useHistory } from "@/history"
import { type Appearance, useAppearance } from "@/hooks/use-appearance"
import { useDefaultFilterEndDateToday, useDefaultFilterStartDate } from "@/hooks/use-settings"
import { useSyncStatus } from "@/hooks/use-sync-status"
import { SPRING } from "@/lib/motion"
import {
	pathAccounts,
	pathAllocator,
	pathBudgets,
	pathCategories,
	pathDashboard,
	pathDataSettings,
	pathHelp,
	pathImporter,
	pathRecords,
	pathSettings,
	pathStatements,
} from "@/routes"

function useSyncIndicator() {
	const sync = useSyncStatus()
	if (!sync.configured) return null
	const busy = sync.activity != null
	const tone: string =
		sync.activity != null
			? "bg-sky-500"
			: sync.kind === "conflict"
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
	return { tone, title, busy }
}

function SyncDot() {
	const indicator = useSyncIndicator()
	if (!indicator) return null
	return (
		<span
			title={indicator.title}
			className={`relative ml-auto size-2 shrink-0 rounded-full transition-colors duration-300 ease-out group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:top-1 group-data-[collapsible=icon]:right-1 group-data-[collapsible=icon]:size-1.5 ${indicator.tone}`}
		>
			{indicator.busy ? (
				<span className="absolute inset-0 animate-ping rounded-full bg-sky-500/60 motion-reduce:hidden" />
			) : null}
		</span>
	)
}

type AppearanceOption = { value: Appearance; label: string; icon: typeof SunIcon }

const SYSTEM_APPEARANCE: AppearanceOption = { value: "system", label: "System", icon: MonitorIcon }
const APPEARANCES: AppearanceOption[] = [
	{ value: "light", label: "Light", icon: SunIcon },
	{ value: "dark", label: "Dark", icon: MoonIcon },
	SYSTEM_APPEARANCE,
]

function AppearanceSwitch() {
	const { appearance, updateAppearance } = useAppearance()
	const index = APPEARANCES.findIndex(item => item.value === appearance)
	const current = APPEARANCES[index] ?? SYSTEM_APPEARANCE
	const next = APPEARANCES[(index + 1) % APPEARANCES.length] ?? SYSTEM_APPEARANCE
	const Current = current.icon
	return (
		<>
			<div
				role="radiogroup"
				aria-label="Appearance"
				className="grid grid-cols-3 gap-0.5 rounded-lg bg-sidebar-accent p-0.5 group-data-[collapsible=icon]:hidden"
			>
				{APPEARANCES.map(item => (
					<button
						key={item.value}
						type="button"
						role="radio"
						aria-checked={appearance === item.value}
						title={item.label}
						onClick={() => updateAppearance(item.value)}
						className="relative isolate flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-md text-xs text-sidebar-foreground/70 transition-colors duration-150 ease-out hover:text-sidebar-foreground aria-checked:text-sidebar-foreground"
					>
						{appearance === item.value ? (
							<motion.span
								layoutId="appearance-thumb"
								transition={SPRING.snappy}
								className="absolute inset-0 -z-10 rounded-md bg-sidebar shadow-xs"
							/>
						) : null}
						<item.icon className="size-3.5" />
						<span className="sr-only sm:not-sr-only">{item.label}</span>
					</button>
				))}
			</div>
			<SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
				<SidebarMenuItem>
					<SidebarMenuButton
						tooltip={`Appearance: ${current.label} (switch to ${next.label})`}
						onClick={() => updateAppearance(next.value)}
					>
						<Current />
						<span>Appearance</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</>
	)
}

export default function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const { handleClear } = useHistory()
	const { isMobile, setOpenMobile } = useSidebar()
	const pathname = usePathname()
	const defaultFilterStartDate = useDefaultFilterStartDate()
	const defaultFilterEndDateToday = useDefaultFilterEndDateToday()
	const defaultFilterEndDate = defaultFilterEndDateToday
		? DateTime.now().toFormat("yyyy-MM-dd")
		: undefined
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
					to: pathAllocator({
						start_date: defaultFilterStartDate ?? undefined,
						end_date: defaultFilterEndDate,
					}),
					icon: "lucide:link",
					label: "Allocator",
					active: pathname.startsWith("/allocator"),
				},
				{
					to: pathRecords(
						defaultFilterStartDate || defaultFilterEndDate
							? {
									start_date: defaultFilterStartDate ?? undefined,
									end_date: defaultFilterEndDate,
								}
							: undefined,
					),
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
					icon: "lucide:database",
					label: "Data",
					active: pathname.startsWith("/sync"),
				},
				{
					to: pathSettings(),
					icon: "lucide:settings-2",
					label: "Settings",
					active: pathname.startsWith("/settings"),
				},
			],
		},
		{
			label: "Learn",
			items: [
				{
					to: pathHelp(),
					icon: "lucide:circle-help",
					label: "Help & guides",
					active: pathname.startsWith("/help"),
				},
			],
		},
	]

	return (
		<Sidebar collapsible="icon" variant="floating" {...props}>
			<SidebarHeader className="flex-row items-center">
				<SidebarMenu className="min-w-0 flex-1">
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:h-auto! data-[slot=sidebar-menu-button]:py-1.5!"
						>
							<Link href={pathDashboard()} onClick={handleSidebarLink}>
								<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 group-data-[collapsible=icon]:size-4 group-data-[collapsible=icon]:bg-transparent">
									<img src="/favicon.svg" alt="" className="size-5" />
								</span>
								<span className="grid leading-tight">
									<span className="text-base font-semibold">Finpoint</span>
									<span className="text-[0.6875rem] text-sidebar-foreground/60">
										Local-first finance
									</span>
								</span>
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
					<SidebarGroup key={group.label}>
						{/* Collapsed labels fade out and slide up over the previous group's
						last item, so they must not swallow its hover and clicks. */}
						<SidebarGroupLabel className="group-data-[collapsible=icon]:pointer-events-none">
							{group.label}
						</SidebarGroupLabel>
						<SidebarMenu>
							{group.items.map(item => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton
										asChild
										isActive={item.active}
										tooltip={item.label}
									>
										<Link href={item.to} onClick={handleSidebarLink}>
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
			<SidebarFooter>
				<AppearanceSwitch />
				<p className="hidden px-2 text-[0.6875rem] text-sidebar-foreground/50 md:block group-data-[collapsible=icon]:hidden">
					<kbd className="font-sans">Ctrl/⌘ B</kbd> to collapse
				</p>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
