import { Icon as IconifyIcon } from "@iconify/react"
import { Link } from "@inertiajs/react"
import { DateTime } from "luxon"
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
import {
	accountsWebRoute,
	allocatorWebRoute,
	budgetsWebRoute,
	categoriesWebRoute,
	dashboardWebRoute,
	importerWebRoute,
	recordsWebRoute,
	statementsWebRoute,
} from "@/wayfinder/routes"

export default function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const { handleClear } = useHistory()
	const { isMobile, setOpenMobile } = useSidebar()
	const handleSidebarLink = () => {
		handleClear()

		if (isMobile) {
			setOpenMobile(false)
		}
	}

	return (
		<Sidebar collapsible="offcanvas" variant="floating" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:p-1.5!"
						>
							<Link href={dashboardWebRoute.url()} onClick={handleSidebarLink}>
								<IconifyIcon icon="lucide:circle-dollar-sign" className="size-5!" />
								<span className="text-base font-semibold">Finpoint</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Workspaces</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={dashboardWebRoute.url()} onClick={handleSidebarLink}>
									<IconifyIcon icon="lucide:chart-area" />
									<span>Dashboard</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link
									href={allocatorWebRoute.url({
										query: {
											start_date: START_DATE,
										},
									})}
									onClick={handleSidebarLink}
								>
									<IconifyIcon icon="lucide:link" />
									<span>Allocator</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={budgetsWebRoute.url()} onClick={handleSidebarLink}>
									<IconifyIcon icon="lucide:piggy-bank" />
									<span>Budgets</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Data</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={importerWebRoute.url()} onClick={handleSidebarLink}>
									<IconifyIcon icon="lucide:import" />
									<span>Importer</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={accountsWebRoute.url()} onClick={handleSidebarLink}>
									<IconifyIcon icon="lucide:landmark" />
									<span>Accounts</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link
									href={recordsWebRoute.url({
										query: {
											start_date: START_DATE,
											end_date: DateTime.now().toFormat("yyyy-MM-dd"),
										},
									})}
									onClick={handleSidebarLink}
								>
									<IconifyIcon icon="lucide:receipt-text" />
									<span>Records</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={statementsWebRoute.url()} onClick={handleSidebarLink}>
									<IconifyIcon icon="lucide:credit-card" />
									<span>Statements</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Settings</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={categoriesWebRoute.url()} onClick={handleSidebarLink}>
									<IconifyIcon icon="lucide:tag" />
									<span>Categories</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
