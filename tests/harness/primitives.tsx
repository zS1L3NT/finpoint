import { useState } from "react"
import { toast } from "sonner"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxCollection,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
	ComboboxSeparator,
	ComboboxValue,
} from "@/components/ui/combobox"
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty"
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemGroup,
	ItemHeader,
	ItemMedia,
	ItemSeparator,
	ItemTitle,
} from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { MonthPicker } from "@/components/ui/monthpicker"
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/sonner"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const FRUITS = ["Apple", "Banana", "Cherry", "Durian", "Elderberry"]
const LONG_SELECT_ITEMS = Array.from({ length: 40 }, (_, index) => ({
	value: `long-${index + 1}`,
	label: `Long item ${index + 1}`,
}))
const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
]

export function PrimitivesSection() {
	const [clicks, setClicks] = useState(0)
	const [checked, setChecked] = useState<boolean>(false)
	const [toggle, setToggle] = useState("day")
	const [day, setDay] = useState<Date | undefined>(new Date(2026, 8, 14))
	const [month, setMonth] = useState<Date>(new Date(2026, 8, 1))
	const [commandChoice, setCommandChoice] = useState("")
	const [commandOpen, setCommandOpen] = useState(false)
	const [selectValue, setSelectValue] = useState("apple")
	const [longSelect, setLongSelect] = useState("long-1")
	const [comboValue, setComboValue] = useState<string | null>(null)
	const [multi, setMulti] = useState<string[]>(["Apple"])
	const [menuChoice, setMenuChoice] = useState("")
	const [menuFlag, setMenuFlag] = useState(true)
	const [menuAlign, setMenuAlign] = useState("left")
	const [alertDecision, setAlertDecision] = useState("")
	const [dialogOpen, setDialogOpen] = useState(false)
	const [collectionValue, setCollectionValue] = useState<string | null>(null)
	const [progress, setProgress] = useState(50)
	const [groupText, setGroupText] = useState("")
	const [labelInput, setLabelInput] = useState("")
	const [sidebarChoice, setSidebarChoice] = useState("records")
	const [sidebarFilter, setSidebarFilter] = useState("")
	const [sidebarPinned, setSidebarPinned] = useState(false)
	const [groupAdds, setGroupAdds] = useState(0)
	const [itemOpens, setItemOpens] = useState(0)

	return (
		<section
			aria-label="UI primitives"
			data-testid="harness-primitives"
			className="flex flex-col gap-8"
		>
			<h2 className="text-sm font-semibold">Primitives</h2>

			<div data-testid="primitive-buttons" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Buttons</h3>
				<div className="flex flex-wrap items-center gap-2">
					<Button onClick={() => setClicks(c => c + 1)}>Count clicks</Button>
					<Button variant="outline" onClick={() => setClicks(c => c + 1)}>
						Outline
					</Button>
					<Button variant="ghost" onClick={() => setClicks(c => c + 1)}>
						Ghost
					</Button>
					<Button variant="destructive" onClick={() => setClicks(c => c + 1)}>
						Delete
					</Button>
					<Button variant="link" onClick={() => setClicks(c => c + 1)}>
						Learn more
					</Button>
					<Button disabled>Disabled action</Button>
				</div>
				<p data-testid="button-clicks">Button clicks: {clicks}</p>
			</div>

			<div data-testid="primitive-button-group" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Button group</h3>
				<ButtonGroup>
					<Button variant="outline" onClick={() => setClicks(c => c + 1)}>
						Left
					</Button>
					<ButtonGroupSeparator />
					<Button variant="outline" onClick={() => setClicks(c => c + 1)}>
						Right
					</Button>
					<ButtonGroupText>Group label</ButtonGroupText>
				</ButtonGroup>
			</div>

			<div data-testid="primitive-checkbox" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Checkbox</h3>
				<div className="flex items-center gap-2">
					<Checkbox
						id="harness-check"
						checked={checked}
						onCheckedChange={value => setChecked(value === true)}
						aria-label="Accept terms"
					/>
					<Label htmlFor="harness-check">Accept terms</Label>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox id="harness-check-disabled" disabled aria-label="Disabled option" />
					<Label htmlFor="harness-check-disabled">Disabled option</Label>
				</div>
				<p data-testid="checkbox-value">Checkbox: {checked ? "checked" : "unchecked"}</p>
			</div>

			<div data-testid="primitive-toggle" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Toggle group</h3>
				<ToggleGroup
					type="single"
					value={toggle}
					onValueChange={value => value && setToggle(value)}
					aria-label="View"
				>
					<ToggleGroupItem value="day" aria-label="Day view">
						Day
					</ToggleGroupItem>
					<ToggleGroupItem value="week" aria-label="Week view">
						Week
					</ToggleGroupItem>
					<ToggleGroupItem value="archived" aria-label="Archived view" disabled>
						Archived
					</ToggleGroupItem>
				</ToggleGroup>
				<p data-testid="toggle-value">Toggle: {toggle}</p>
			</div>

			<div data-testid="primitive-calendar" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Calendar</h3>
				<Calendar
					mode="single"
					defaultMonth={new Date(2026, 8, 1)}
					selected={day}
					onSelect={setDay}
				/>
				<p data-testid="calendar-value">
					Selected day: {day ? day.toDateString() : "none"}
				</p>
			</div>

			<div data-testid="primitive-monthpicker" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Month picker</h3>
				<MonthPicker selectedMonth={month} onMonthSelect={setMonth} />
				<p data-testid="monthpicker-value">
					Selected month: {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
				</p>
				<MonthPicker
					selectedMonth={new Date(2026, 8, 1)}
					minDate={new Date(2026, 5, 1)}
					maxDate={new Date(2026, 9, 1)}
					aria-label="Bounded month picker"
				/>
			</div>

			<div data-testid="primitive-command" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Command</h3>
				<Command aria-label="Fruit commands">
					<CommandInput placeholder="Search fruit" aria-label="Search fruit" />
					<CommandList aria-label="Fruit results">
						<CommandEmpty>No fruit found.</CommandEmpty>
						<CommandGroup heading="Fruit">
							{FRUITS.map(fruit => (
								<CommandItem key={fruit} value={fruit} onSelect={setCommandChoice}>
									{fruit}
									<CommandShortcut>{fruit.slice(0, 1)}</CommandShortcut>
								</CommandItem>
							))}
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="More">
							<CommandItem value="fig" onSelect={setCommandChoice}>
								Fig
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
				<p data-testid="command-value">Command choice: {commandChoice || "none"}</p>
				<Button variant="outline" onClick={() => setCommandOpen(true)}>
					Open command dialog
				</Button>
				<CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
					<Command aria-label="Dialog commands">
						<CommandInput placeholder="Search" aria-label="Search dialog" />
						<CommandList aria-label="Dialog results">
							<CommandEmpty>Nothing here.</CommandEmpty>
							<CommandGroup heading="Actions">
								<CommandItem value="close" onSelect={() => setCommandOpen(false)}>
									Close dialog
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</CommandDialog>
			</div>

			<div data-testid="primitive-tooltip" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Tooltip</h3>
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline">Hover target</Button>
						</TooltipTrigger>
						<TooltipContent>Harness tooltip body</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<div data-testid="primitive-popover" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Popover</h3>
				<Popover>
					<PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
					<PopoverContent>
						<PopoverHeader>
							<PopoverTitle>Popover title</PopoverTitle>
							<PopoverDescription>Popover description text.</PopoverDescription>
						</PopoverHeader>
						<p className="text-xs">Popover body content.</p>
					</PopoverContent>
				</Popover>
			</div>

			<div data-testid="primitive-select" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Select</h3>
				<Label htmlFor="harness-select">Fruit select</Label>
				<Select value={selectValue} onValueChange={setSelectValue}>
					<SelectTrigger id="harness-select">
						<SelectValue placeholder="Choose fruit" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Common</SelectLabel>
							<SelectItem value="apple">Apple</SelectItem>
							<SelectItem value="banana">Banana</SelectItem>
							<SelectSeparator />
							<SelectItem value="durian" disabled>
								Durian (unavailable)
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<p data-testid="select-value">Select value: {selectValue}</p>
				<Label htmlFor="harness-select-long">Long fruit select</Label>
				<Select value={longSelect} onValueChange={setLongSelect}>
					<SelectTrigger id="harness-select-long">
						<SelectValue placeholder="Choose a long-list fruit" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Common</SelectLabel>
							{LONG_SELECT_ITEMS.slice(0, 5).map(item => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
							<SelectSeparator />
						</SelectGroup>
						<SelectGroup>
							<SelectLabel>More fruit</SelectLabel>
							{LONG_SELECT_ITEMS.slice(5).map(item => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<p data-testid="select-long-value">Long select value: {longSelect}</p>
			</div>

			<div data-testid="primitive-combobox" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Combobox</h3>
				<Combobox
					items={FRUITS}
					value={comboValue}
					onValueChange={setComboValue}
					autoHighlight
				>
					<ComboboxInput
						id="harness-combo"
						placeholder="Choose fruit"
						aria-label="Fruit combobox"
						showClear
					/>
					<ComboboxContent>
						<ComboboxEmpty>No fruit found.</ComboboxEmpty>
						<ComboboxList>
							{(fruit: string) => (
								<ComboboxItem key={fruit} value={fruit}>
									{fruit}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
				<p data-testid="combobox-value">Combobox value: {comboValue ?? "none"}</p>
				<Combobox items={FRUITS} value={comboValue} onValueChange={setComboValue}>
					<ComboboxInput placeholder="Grouped" aria-label="Grouped fruit combobox" />
					<ComboboxContent>
						<ComboboxGroup>
							<ComboboxLabel>Grouped fruit</ComboboxLabel>
							<ComboboxList>
								{(fruit: string) => (
									<ComboboxItem key={fruit} value={fruit}>
										<ComboboxValue>{fruit}</ComboboxValue>
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxGroup>
						<ComboboxSeparator />
					</ComboboxContent>
				</Combobox>
				<Combobox items={FRUITS} value={collectionValue} onValueChange={setCollectionValue}>
					<ComboboxInput
						placeholder="Collection"
						aria-label="Collection fruit combobox"
					/>
					<ComboboxContent>
						<ComboboxEmpty>No fruit found.</ComboboxEmpty>
						<ComboboxList aria-label="Collection fruit results">
							<ComboboxCollection>
								{(fruit: string) => (
									<ComboboxItem key={fruit} value={fruit}>
										{fruit}
									</ComboboxItem>
								)}
							</ComboboxCollection>
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
				<p data-testid="combobox-collection-value">
					Collection value: {collectionValue ?? "none"}
				</p>
				<Combobox multiple items={FRUITS} value={multi} onValueChange={setMulti}>
					<ComboboxChips aria-label="Multi fruit">
						{multi.map(item => (
							<ComboboxChip key={item}>{item}</ComboboxChip>
						))}
						<ComboboxChipsInput placeholder="Add fruit" aria-label="Add fruit" />
					</ComboboxChips>
					<ComboboxContent>
						<ComboboxList>
							{(fruit: string) => (
								<ComboboxItem key={fruit} value={fruit}>
									{fruit}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
				<p data-testid="combobox-multi-value">Multi value: {multi.join(", ") || "none"}</p>
			</div>

			<div data-testid="primitive-dropdown" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Dropdown menu</h3>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Open menu</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Menu label</DropdownMenuLabel>
						<DropdownMenuGroup>
							<DropdownMenuItem onSelect={() => setMenuChoice("edit")}>
								Edit item
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setMenuChoice("duplicate")}>
								Duplicate item
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem checked={menuFlag} onCheckedChange={setMenuFlag}>
							Show archived
						</DropdownMenuCheckboxItem>
						<DropdownMenuRadioGroup value={menuAlign} onValueChange={setMenuAlign}>
							<DropdownMenuRadioItem value="left">Align left</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="right">Align right</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
						<DropdownMenuSeparator />
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>More actions</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem onSelect={() => setMenuChoice("export")}>
										Export <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>
				<p data-testid="dropdown-value">
					Menu: {menuChoice || "none"}; flag {menuFlag ? "on" : "off"}; align {menuAlign}
				</p>
			</div>

			<div data-testid="primitive-alert" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Alert</h3>
				<Alert>
					<AlertTitle>Heads up</AlertTitle>
					<AlertDescription>Plain alert description for review.</AlertDescription>
					<AlertAction>
						<Button size="xs" variant="outline">
							Review
						</Button>
					</AlertAction>
				</Alert>
				<Alert variant="destructive">
					<AlertTitle>Something needs attention</AlertTitle>
					<AlertDescription>Destructive alert description.</AlertDescription>
				</Alert>
			</div>

			<div data-testid="primitive-alert-dialog" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Alert dialog</h3>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="outline">Delete workspace</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete workspace?</AlertDialogTitle>
							<AlertDialogDescription>
								This removes local demo data only.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setAlertDecision("cancelled")}>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction onClick={() => setAlertDecision("confirmed")}>
								Confirm delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<p data-testid="alert-decision">Alert decision: {alertDecision || "none"}</p>
			</div>

			<div data-testid="primitive-dialog" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Dialog</h3>
				<Button variant="outline" onClick={() => setDialogOpen(true)}>
					Open dialog
				</Button>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Harness dialog</DialogTitle>
							<DialogDescription>
								Dialog description for backdrop checks.
							</DialogDescription>
						</DialogHeader>
						<p className="text-xs">Dialog body stays mounted while open.</p>
						<DialogFooter>
							<DialogClose>Close dialog</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<p data-testid="dialog-value">Dialog open: {dialogOpen ? "yes" : "no"}</p>
			</div>

			<div data-testid="primitive-sheet" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Sheet</h3>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline">Open sheet</Button>
					</SheetTrigger>
					<SheetContent side="right">
						<SheetHeader>
							<SheetTitle>Harness sheet</SheetTitle>
							<SheetDescription>
								Sheet description for backdrop checks.
							</SheetDescription>
						</SheetHeader>
						<p className="p-4 text-xs md:p-6">Sheet body content.</p>
						<SheetFooter>
							<SheetClose asChild>
								<Button variant="outline">Close sheet</Button>
							</SheetClose>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</div>

			<div
				data-testid="primitive-sidebar"
				id="harness-sidebar"
				className="flex flex-col gap-2"
			>
				<h3 className="text-xs font-semibold">Sidebar</h3>
				<SidebarProvider>
					{/* Relative box + md:absolute panel: the product Sidebar panel is
					    viewport-fixed (like the app shell, where sidebar-gap offsets
					    content). Scoping it to this demo box keeps it from overlaying
					    unrelated harness sections during pointer tests. Mobile is
					    unaffected (Sheet path; md: classes inert there). */}
					<div className="relative flex min-h-72 gap-2 rounded-md border">
						<Sidebar collapsible="icon" className="md:absolute md:h-full">
							<SidebarHeader>
								<SidebarInput
									value={sidebarFilter}
									onChange={event => setSidebarFilter(event.target.value)}
									placeholder="Filter sidebar"
									aria-label="Filter sidebar"
								/>
							</SidebarHeader>
							<SidebarContent>
								<SidebarGroup>
									<SidebarGroupLabel>Workspace</SidebarGroupLabel>
									<SidebarGroupAction
										aria-label="Add group item"
										onClick={() => setGroupAdds(c => c + 1)}
									>
										<span aria-hidden>+</span>
									</SidebarGroupAction>
									<SidebarGroupContent>
										<SidebarMenu>
											<SidebarMenuItem>
												<SidebarMenuButton
													isActive={sidebarChoice === "records"}
													onClick={() => setSidebarChoice("records")}
												>
													Records
												</SidebarMenuButton>
												<SidebarMenuBadge>12</SidebarMenuBadge>
												<SidebarMenuSub>
													<SidebarMenuSubItem>
														<SidebarMenuSubButton
															isActive={sidebarChoice === "monthly"}
															onClick={() =>
																setSidebarChoice("monthly")
															}
														>
															Monthly
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												</SidebarMenuSub>
											</SidebarMenuItem>
											<SidebarMenuItem>
												<SidebarMenuButton
													isActive={sidebarChoice === "statements"}
													onClick={() => setSidebarChoice("statements")}
												>
													Statements
												</SidebarMenuButton>
												<SidebarMenuAction
													aria-label="Pin statements"
													onClick={() => setSidebarPinned(v => !v)}
												>
													<span aria-hidden>!</span>
												</SidebarMenuAction>
											</SidebarMenuItem>
											<SidebarMenuItem>
												<SidebarMenuSkeleton showIcon />
											</SidebarMenuItem>
										</SidebarMenu>
									</SidebarGroupContent>
								</SidebarGroup>
								<SidebarSeparator />
							</SidebarContent>
							<SidebarFooter>
								<span className="px-2 text-xs text-muted-foreground">
									Harness footer
								</span>
							</SidebarFooter>
							<SidebarRail />
						</Sidebar>
						<SidebarInset>
							<div className="flex items-center gap-2 p-2">
								<SidebarTrigger />
								<p data-testid="sidebar-value">
									Sidebar choice: {sidebarChoice}; pinned{" "}
									{sidebarPinned ? "yes" : "no"}; adds {groupAdds}; filter{" "}
									{sidebarFilter || "empty"}
								</p>
							</div>
							<Skeleton className="m-2 h-4 w-32" data-testid="standalone-skeleton" />
						</SidebarInset>
					</div>
				</SidebarProvider>
			</div>

			<div data-testid="primitive-badge" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Badge</h3>
				<div className="flex flex-wrap gap-2">
					<Badge>Default badge</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="destructive">Over budget</Badge>
					<Badge variant="warning">Pending</Badge>
					<Badge variant="outline">Outline</Badge>
					<Badge variant="ghost">Ghost</Badge>
					<Badge
						variant="secondary"
						className="max-w-full truncate"
						data-testid="primitive-long-badge"
						title={`Archive — ${"早餐 café ☕ ".repeat(12).trim()}`}
					>
						{`Archive — ${"早餐 café ☕ ".repeat(12).trim()}`}
					</Badge>
				</div>
			</div>

			<div data-testid="primitive-card" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Card</h3>
				<Card>
					<CardHeader>
						<CardTitle>Spending summary</CardTitle>
						<CardDescription>September totals across budgets.</CardDescription>
						<CardAction>
							<Button size="xs" variant="outline">
								View
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						<p>Card body with enough copy to wrap on narrow screens.</p>
					</CardContent>
					<CardFooter>
						<Button size="xs">Open report</Button>
					</CardFooter>
				</Card>
			</div>

			<div data-testid="primitive-empty" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Empty</h3>
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">◌</EmptyMedia>
						<EmptyTitle>No records yet</EmptyTitle>
						<EmptyDescription>
							Add the first record to populate this view.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button size="sm">Add record</Button>
					</EmptyContent>
				</Empty>
			</div>

			<div data-testid="primitive-progress" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Progress</h3>
				<Progress value={progress} aria-label="Budget progress" />
				<div className="flex gap-2">
					<Button size="xs" variant="outline" onClick={() => setProgress(-20)}>
						Set -20
					</Button>
					<Button size="xs" variant="outline" onClick={() => setProgress(0)}>
						Set 0
					</Button>
					<Button size="xs" variant="outline" onClick={() => setProgress(50)}>
						Set 50
					</Button>
					<Button size="xs" variant="outline" onClick={() => setProgress(100)}>
						Set 100
					</Button>
					<Button size="xs" variant="outline" onClick={() => setProgress(150)}>
						Set 150
					</Button>
				</div>
				<p data-testid="progress-value">Progress value: {progress}</p>
				<Progress value={150} aria-label="Over budget progress" />
			</div>

			<div data-testid="primitive-scroll" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Scroll area</h3>
				<ScrollArea className="h-32 w-full rounded-md border">
					<div className="flex flex-col gap-1 p-2">
						{Array.from({ length: 20 }, (_, index) => (
							<p key={index}>Scrollable row {index + 1}</p>
						))}
					</div>
				</ScrollArea>
			</div>

			<div data-testid="primitive-separator" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Separator</h3>
				<p>Above separator</p>
				<Separator />
				<p>Below separator</p>
				<div className="flex h-8 items-center gap-2">
					<span>Left</span>
					<Separator orientation="vertical" />
					<span>Right</span>
				</div>
			</div>

			<div data-testid="primitive-table" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Table</h3>
				<Table>
					<TableCaption>Demo spending by payee.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Payee</TableHead>
							<TableHead>Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>Makan place</TableCell>
							<TableCell>$12.50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Groceries</TableCell>
							<TableCell>$48.20</TableCell>
						</TableRow>
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell>Total</TableCell>
							<TableCell>$60.70</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</div>

			<div data-testid="primitive-pagination" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Pagination</h3>
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious href="#/primitives" />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#/primitives">1</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#/primitives" isActive>
								2
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#/primitives" />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>

			<div data-testid="primitive-input-group" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Input group</h3>
				<InputGroup>
					<InputGroupAddon>$</InputGroupAddon>
					<InputGroupInput
						value={groupText}
						onChange={event => setGroupText(event.target.value)}
						placeholder="Grouped amount"
						aria-label="Grouped amount"
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupButton onClick={() => setGroupText("")}>Clear</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
				<p data-testid="input-group-value">Group value: {groupText || "empty"}</p>
				<InputGroup>
					<InputGroupAddon>
						<InputGroupText>Note</InputGroupText>
					</InputGroupAddon>
					<InputGroupTextarea placeholder="Grouped notes" aria-label="Grouped notes" />
				</InputGroup>
			</div>

			<div data-testid="primitive-item" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Item</h3>
				<ItemGroup>
					<Item>
						<ItemMedia variant="icon">◌</ItemMedia>
						<ItemContent>
							<ItemHeader>
								<ItemTitle>Dinner record</ItemTitle>
							</ItemHeader>
							<ItemDescription>Dining · Spending · 14 Sep 2026</ItemDescription>
							<ItemFooter>
								<span>$12.50</span>
							</ItemFooter>
						</ItemContent>
						<ItemActions>
							<Button
								size="xs"
								variant="outline"
								onClick={() => setItemOpens(c => c + 1)}
							>
								Open
							</Button>
						</ItemActions>
					</Item>
					<ItemSeparator />
					<Item variant="outline" size="sm">
						<ItemContent>
							<ItemTitle>Second item</ItemTitle>
						</ItemContent>
					</Item>
				</ItemGroup>
				<p data-testid="item-opens">Item opens: {itemOpens}</p>
			</div>

			<div data-testid="primitive-label" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Label + atoms</h3>
				<Label htmlFor="primitive-label-input">Atom label</Label>
				<Input
					id="primitive-label-input"
					value={labelInput}
					onChange={event => setLabelInput(event.target.value)}
					placeholder="Label target"
				/>
				<Textarea
					value={labelInput}
					onChange={event => setLabelInput(event.target.value)}
					placeholder="Mirror notes"
					aria-label="Mirror notes"
				/>
				<p data-testid="label-value">Label input: {labelInput || "empty"}</p>
			</div>

			<div data-testid="primitive-field" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Field</h3>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="harness-field-demo">Field label</FieldLabel>
						<FieldDescription>Field description text.</FieldDescription>
						<Input id="harness-field-demo" placeholder="Field input" />
						<FieldError errors={[{ message: "Demo error text" }]} />
					</Field>
					<FieldSeparator>or</FieldSeparator>
					<FieldSet>
						<FieldLegend>Fieldset legend</FieldLegend>
						<Field orientation="horizontal">
							<Checkbox id="harness-field-check" aria-label="Field checkbox" />
							<FieldContent>
								<FieldTitle>Field title</FieldTitle>
								<FieldDescription>Horizontal field copy.</FieldDescription>
							</FieldContent>
						</Field>
					</FieldSet>
				</FieldGroup>
			</div>

			<div data-testid="primitive-sonner" className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold">Sonner</h3>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => toast.success("Saved demo record")}>
						Show success toast
					</Button>
					<Button variant="outline" onClick={() => toast.error("Demo import failed")}>
						Show error toast
					</Button>
				</div>
				<Toaster richColors closeButton />
			</div>
		</section>
	)
}
