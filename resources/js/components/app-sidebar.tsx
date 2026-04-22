import { Link } from "@inertiajs/react"
import {
	CalendarSyncIcon,
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
import {
	allocatorWebRoute,
	budgetsWebRoute,
	categoriesWebRoute,
	dashboardWebRoute,
	importerWebRoute,
	recordsWebRoute,
	recurrencesWebRoute,
	statementsWebRoute,
} from "@/wayfinder/routes"

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" variant="floating" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:p-1.5!"
						>
							<Link href={dashboardWebRoute.url()}>
								<CircleDollarSignIcon className="size-5!" />
								<span className="text-base font-semibold">Finpoint</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Data Control</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={importerWebRoute.url()}>
									<ImportIcon />
									<span>Importer</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={allocatorWebRoute.url()}>
									<LinkIcon />
									<span>Allocator</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Accounting</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={budgetsWebRoute.url()}>
									<PiggyBankIcon />
									<span>Budgets</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={recurrencesWebRoute.url()}>
									<CalendarSyncIcon />
									<span>Recurrences</span>
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
								<Link href={recordsWebRoute.url()}>
									<ReceiptTextIcon />
									<span>Records</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={statementsWebRoute.url()}>
									<CreditCardIcon />
									<span>Statements</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href={categoriesWebRoute.url()}>
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
