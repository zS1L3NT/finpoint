import { Icon as IconifyIcon } from "@iconify/react"
import { router, usePage } from "@inertiajs/react"
import { useState } from "react"
import RecordCreatorDialog from "@/components/dialogs/record-creator"
import DateField from "@/components/form/date-field"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useFetch } from "@/hooks/use-fetch"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { useSearchParam } from "@/hooks/use-search-param"
import { cn } from "@/lib/utils"
import { CategoryWithChildren, Paginated, Record } from "@/types"
import { categoryIndexApiRoute, recordsWebRoute } from "@/wayfinder/routes"

export default function RecordsPage({ records }: { records: Paginated<Record> }) {
	const [isCreatingRecord, setIsCreatingRecord] = useState(false)
	const page = usePage()

	const [startDate, setStartDate] = useSearchParam("start_date")
	const [endDate, setEndDate] = useSearchParam("end_date")
	const [isAllocated, setIsAllocated] = useSearchParam("is_allocated")
	const categoryIds =
		new URL(page.url, "http://localhost").searchParams
			.get("category_ids")
			?.split(",")
			.filter(Boolean) ?? []

	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: records,
		buildUrl: query =>
			recordsWebRoute({
				query: {
					...query,
					start_date: startDate || undefined,
					end_date: endDate || undefined,
					is_allocated: isAllocated || undefined,
					category_ids: categoryIds.join(",") || undefined,
				},
			}).url,
	})
	const pendingFilterLabel =
		isAllocated === "true" ? "Not pending" : isAllocated === "false" ? "Pending" : null

	const columns = useRecordColumns<Record>({ pageName: "Records" })
	const mobileRow = useRecordMobileRow<Record>({ pageName: "Records" })

	return (
		<>
			<AppHeader title="Records" />

			<PageContent>
				<PageHeader
					title="Records"
					subtitle="Browse and manage your financial records."
					description="Ledger view"
					icon="lucide:receipt-text"
				/>

				<PaginatedDataTable
					paginated={records}
					columns={columns}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search all records...",
						filters: (
							<div className="flex flex-col gap-2 sm:flex-row">
								<CategoryFilter categories={categories} selectedIds={categoryIds} />

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant={pendingFilterLabel ? "secondary" : "outline"}
											className="w-full sm:w-auto"
										>
											<IconifyIcon icon="lucide:list-filter" /> Filter status
											{pendingFilterLabel ? (
												<Badge variant="outline">
													{pendingFilterLabel}
												</Badge>
											) : null}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-48">
										<DropdownMenuLabel>Filter by status</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuCheckboxItem
												checked={isAllocated === "false"}
												onSelect={event => event.preventDefault()}
												onCheckedChange={checked =>
													setIsAllocated(
														checked === true ? "false" : null,
													)
												}
											>
												Pending
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={isAllocated === "true"}
												onSelect={event => event.preventDefault()}
												onCheckedChange={checked =>
													setIsAllocated(checked === true ? "true" : null)
												}
											>
												Not pending
											</DropdownMenuCheckboxItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>

								<div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
									<DateField
										id="start_date"
										value={startDate ?? ""}
										className="min-w-0 sm:w-32"
										placeholder="Start date"
										onChange={date => setStartDate(date || null)}
									/>

									<DateField
										id="end_date"
										value={endDate ?? ""}
										className="min-w-0 sm:w-32"
										placeholder="End date"
										onChange={date => setEndDate(date || null)}
									/>
								</div>
							</div>
						),
						actions: (
							<RecordCreatorDialog
								statements={[]}
								categories={categories}
								isOpen={isCreatingRecord}
								setIsOpen={setIsCreatingRecord}
								trigger={
									<Button className="w-full sm:w-auto">
										<IconifyIcon icon="lucide:plus" /> Create Pending Record
									</Button>
								}
							/>
						),
					}}
					footer={{
						summary: `Showing ${records.data.length} of ${records.total} records.`,
					}}
					mobileRow={mobileRow}
					emptyMessage="No records found."
				/>
			</PageContent>
		</>
	)
}

function CategoryFilter({
	categories,
	selectedIds,
}: {
	categories: CategoryWithChildren[]
	selectedIds: string[]
}) {
	const page = usePage()
	const categoriesFlat = categories.flatMap(category => [category, ...category.children])

	const setSelectedIds = (ids: string[]) => {
		const url = new URL(page.url, "http://localhost")

		if (ids.length) {
			url.searchParams.set("category_ids", ids.join(","))
		} else {
			url.searchParams.delete("category_ids")
		}

		url.searchParams.delete("page")
		router.visit(url.pathname + url.search, { preserveState: true, preserveScroll: true })
	}

	const toggle = (id: string) =>
		setSelectedIds(
			selectedIds.includes(id)
				? selectedIds.filter(selectedId => selectedId !== id)
				: [...selectedIds, id],
		)

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant={selectedIds.length ? "secondary" : "outline"}
						className="w-full sm:w-auto"
					/>
				}
			>
				<IconifyIcon icon="lucide:tags" /> Filter categories
				{selectedIds.length ? (
					<Badge variant="outline">{selectedIds.length} selected</Badge>
				) : null}
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-[calc(100vw-2rem)] gap-0 overflow-hidden p-0 sm:w-72"
			>
				<Command
					filter={(value, search) =>
						value.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0
					}
				>
					<CommandInput
						placeholder="Search categories..."
						className={selectedIds.length ? "pr-6" : undefined}
					/>
					{selectedIds.length ? (
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							className="absolute top-2 right-2 z-10"
							aria-label="Clear categories"
							onClick={() => setSelectedIds([])}
						>
							<IconifyIcon icon="lucide:x" />
						</Button>
					) : null}
					<CommandList>
						<CommandEmpty>No categories found.</CommandEmpty>
						<CommandGroup>
							{categoriesFlat.map(category => (
								<CategoryFilterItem
									key={category.id}
									category={category}
									checked={selectedIds.includes(category.id)}
									onSelect={() => toggle(category.id)}
								/>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

function CategoryFilterItem({
	category,
	checked,
	onSelect,
}: {
	category: CategoryWithChildren["children"][number] | CategoryWithChildren
	checked: boolean
	onSelect: () => void
}) {
	return (
		<CommandItem value={category.name} data-checked={checked} onSelect={onSelect}>
			<div
				className={cn(
					"flex min-w-0 items-center gap-1",
					category.parent_category_id ? "pl-2" : null,
				)}
			>
				<Icon {...category} size={10} />
				<span className="truncate">{category.name}</span>
			</div>
		</CommandItem>
	)
}
