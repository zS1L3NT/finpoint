import { Link } from "@inertiajs/react"
import {
	ChartAreaIcon,
	CircleDollarSignIcon,
	CreditCardIcon,
	ImportIcon,
	LinkIcon,
	PiggyBankIcon,
	ReceiptTextIcon,
	TagIcon,
} from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useHistory } from "@/history"
import {
	allocatorWebRoute,
	budgetsWebRoute,
	categoriesWebRoute,
	dashboardWebRoute,
	importerWebRoute,
	recordsWebRoute,
	statementsWebRoute,
} from "@/wayfinder/routes"

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { handleClear } = useHistory()

	return (
		<Sidebar collapsible="offcanvas" variant="floating" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:p-1.5!"
						>
							<Link href={dashboardWebRoute.url()} onClick={handleClear}>
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
								<Link href={dashboardWebRoute.url()} onClick={handleClear}>
									<ChartAreaIcon />
									<span>Dashboard</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={allocatorWebRoute.url()} onClick={handleClear}>
									<LinkIcon />
									<span>Allocator</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={importerWebRoute.url()} onClick={handleClear}>
									<ImportIcon />
									<span>Importer</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={budgetsWebRoute.url()} onClick={handleClear}>
									<PiggyBankIcon />
									<span>Budgets</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Data View</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={recordsWebRoute.url()} onClick={handleClear}>
									<ReceiptTextIcon />
									<span>Records</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={statementsWebRoute.url()} onClick={handleClear}>
									<CreditCardIcon />
									<span>Statements</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={categoriesWebRoute.url()} onClick={handleClear}>
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
