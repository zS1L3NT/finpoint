import { Link } from "@inertiajs/react"
import { ListFilterIcon, PlusIcon, ReceiptTextIcon } from "lucide-react"
import { useState } from "react"
import RecordCreatorDialog from "@/components/dialogs/record-creator"
import DateField from "@/components/form/date-field"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useHistory } from "@/history"
import { useFetch } from "@/hooks/use-fetch"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { useSearchParam } from "@/hooks/use-search-param"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, formatCurrency, formatDatetime } from "@/lib/utils"
import { CategoryWithChildren, Paginated, Record } from "@/types"
import { categoryIndexApiRoute, recordsWebRoute, recordWebRoute } from "@/wayfinder/routes"

export default function RecordsPage({ records }: { records: Paginated<Record> }) {
	const { handlePush } = useHistory()
	const [isCreatingRecord, setIsCreatingRecord] = useState(false)

	const [startDate, setStartDate] = useSearchParam("start_date")
	const [endDate, setEndDate] = useSearchParam("end_date")
	const [isAllocated, setIsAllocated] = useSearchParam("is_allocated")

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
				},
			}).url,
	})
	const pendingFilterLabel =
		isAllocated === "true" ? "Not pending" : isAllocated === "false" ? "Pending" : null

	return (
		<>
			<AppHeader title="Records" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Records"
					subtitle="Browse and manage your financial records."
					description="Ledger view"
					icon={ReceiptTextIcon}
				/>

				<PaginatedDataTable
					paginated={records}
					columns={[
						{
							header: "Record",
							meta: { width: TABLE_WIDTH_CLASSNAMES.RECORD },
							cell: ({ row }) => (
								<div className="flex items-center gap-3">
									<Icon {...row.original.category} size={16} />
									<div className="flex-1 overflow-hidden">
										<p className="truncate font-medium">
											{row.original.is_pending && (
												<Badge variant="warning" className="mr-1">
													Pending
												</Badge>
											)}
											{row.original.title}
										</p>
										<p className="truncate text-muted-foreground">
											{row.original.subtitle || "No extra context"}
										</p>
									</div>
								</div>
							),
						},
						{
							header: "Amount",
							meta: { width: TABLE_WIDTH_CLASSNAMES.AMOUNT },
							cell: ({ row }) => (
								<span className={classForCurrency(row.original.amount)}>
									{formatCurrency(row.original.amount)}
								</span>
							),
						},
						{
							header: "Date & Time",
							meta: { width: TABLE_WIDTH_CLASSNAMES.DATETIME },
							cell: ({ row }) => (
								<span className="text-muted-foreground">
									{formatDatetime(row.original.datetime)}
								</span>
							),
						},
						{
							header: "Description",
							meta: { width: TABLE_WIDTH_CLASSNAMES.DESCRIPTION },
							cell: ({ row }) => (
								<div className="truncate text-muted-foreground">
									{row.original.description || "-"}
								</div>
							),
						},
						{
							id: "actions",
							meta: { width: TABLE_WIDTH_CLASSNAMES.ACTIONS_OPEN },
							cell: ({ row }) => (
								<Button variant="outline" size="sm" asChild>
									<Link
										href={recordWebRoute.url({ record: row.original })}
										onClick={handlePush("Records")}
									>
										Open
									</Link>
								</Button>
							),
						},
					]}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search all records...",
						filters: (
							<div className="flex gap-2">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant={pendingFilterLabel ? "secondary" : "outline"}
										>
											<ListFilterIcon /> Filter status
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

								<DateField
									id="start_date"
									value={startDate ?? ""}
									className="w-32"
									placeholder="Start date"
									onChange={date => setStartDate(date || null)}
								/>

								<DateField
									id="end_date"
									value={endDate ?? ""}
									className="w-32"
									placeholder="End date"
									onChange={date => setEndDate(date || null)}
								/>
							</div>
						),
						actions: (
							<RecordCreatorDialog
								statements={[]}
								categories={categories}
								isOpen={isCreatingRecord}
								setIsOpen={setIsCreatingRecord}
								trigger={
									<Button>
										<PlusIcon /> Create Pending Record
									</Button>
								}
							/>
						),
					}}
					footer={{
						summary: `Showing ${records.data.length} of ${records.total} records.`,
					}}
					emptyMessage="No records found."
				/>
			</div>
		</>
	)
}
