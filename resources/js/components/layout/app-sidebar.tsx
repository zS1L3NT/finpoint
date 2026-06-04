import { Link } from "@inertiajs/react"
import {
	ChartAreaIcon,
	CircleDollarSignIcon,
	CreditCardIcon,
	ImportIcon,
	LandmarkIcon,
	LinkIcon,
	PiggyBankIcon,
	ReceiptTextIcon,
	TagIcon,
} from "lucide-react"
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
								<CircleDollarSignIcon className="size-5!" />
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
									<ChartAreaIcon />
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
									<LinkIcon />
									<span>Allocator</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={budgetsWebRoute.url()} onClick={handleSidebarLink}>
									<PiggyBankIcon />
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
									<ImportIcon />
									<span>Importer</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={accountsWebRoute.url()} onClick={handleSidebarLink}>
									<LandmarkIcon />
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
									<ReceiptTextIcon />
									<span>Records</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={statementsWebRoute.url()} onClick={handleSidebarLink}>
									<CreditCardIcon />
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
									<TagIcon />
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
