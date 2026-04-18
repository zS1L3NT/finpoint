import {
	CalendarSyncIcon,
	ChartPieIcon,
	CreditCardIcon,
	ImportIcon,
	LinkIcon,
	ReceiptTextIcon,
	TagIcon,
} from "lucide-react"
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
} from "@/components/ui/sidebar"
import {
	allocator,
	budgets,
	categories,
	importer,
	records,
	recurrences,
	statements,
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
							<a href={importer.url()}>
								{/* <IconInnerShadowTop className="size-5!" /> */}
								<span className="text-base font-semibold">Finpoint</span>
							</a>
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
								<a href={importer.url()}>
									<ImportIcon />
									<span>Importer</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<a href={allocator.url()}>
									<LinkIcon />
									<span>Allocator</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Accounting</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<a href={budgets.url()}>
									<ChartPieIcon />
									<span>Budgets</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<a href={recurrences.url()}>
									<CalendarSyncIcon />
									<span>Recurrences</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Data View</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<a href={records.url()}>
									<ReceiptTextIcon />
									<span>Records</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<a href={statements.url()}>
									<CreditCardIcon />
									<span>Statements</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<a href={categories.url()}>
									<TagIcon />
									<span>Categories</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
				{/* <NavMain items={data.navMain} />
				<NavDocuments items={data.documents} />
				<NavSecondary items={data.navSecondary} className="mt-auto" /> */}
			</SidebarContent>
			<SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
		</Sidebar>
	)
}
