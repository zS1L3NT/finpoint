import { Link } from "@inertiajs/react"
import { LinkIcon } from "lucide-react"
import { useState } from "react"
import AllocateBar from "@/components/allocate-bar"
import DetailCard from "@/components/detail-card"
import RecordCreatorDialog from "@/components/dialogs/record-creator"
import DateField from "@/components/form/date-field"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useHistory } from "@/history"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { useSearchParam } from "@/hooks/use-search-param"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, formatCurrency, formatDatetime, round2dp } from "@/lib/utils"
import { CategoryWithChildren, Paginated, Statement } from "@/types"
import { allocatorWebRoute, statementWebRoute } from "@/wayfinder/routes"

export default function AllocatorPage({
	statements,
	categories,
	titles,
	locations,
	peoples,
}: {
	statements: Paginated<Statement>
	categories: CategoryWithChildren[]
	titles: string[]
	locations: string[]
	peoples: string[]
}) {
	const { handlePush } = useHistory()

	const [startDate, setStartDate] = useSearchParam("start_date")
	const [endDate, setEndDate] = useSearchParam("end_date")

	const [selected, setSelected] = useState<Statement[]>([])

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query =>
			allocatorWebRoute({
				query: {
					...query,
					start_date: startDate || undefined,
					end_date: endDate || undefined,
				},
			}).url,
	})

	const selectedAmount = selected.reduce((sum, statement) => sum + statement.allocable_amount, 0)

	return (
		<>
			<AppHeader title="Allocator" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Allocator"
					subtitle="Allocate bank statements to app records."
					description="Allocation workspace"
					icon={LinkIcon}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<DetailCard label="Pending Statements" value={statements.total} />
					<DetailCard label="Selected Statements" value={selected.length} />
					<DetailCard
						label="Selected Amount"
						value={formatCurrency(selectedAmount)}
						valueClassName={classForCurrency(selectedAmount)}
					/>
				</div>

				<PaginatedDataTable
					paginated={statements}
					columns={[
						{
							id: "select",
							meta: { width: TABLE_WIDTHS.CHECKBOX },
							cell: ({ row }) => (
								<div className="flex items-center justify-center">
									<Checkbox
										checked={!!selected.find(s => s.id === row.original.id)}
										onCheckedChange={value =>
											setSelected(prev =>
												value
													? [...prev, row.original]
													: prev.filter(s => s.id !== row.original.id),
											)
										}
										aria-label={`Select statement ${row.original.id}`}
									/>
								</div>
							),
						},
						{
							header: "Account",
							meta: { width: TABLE_WIDTHS.ACCOUNT },
							cell: ({ row }) => row.original.account.id,
						},
						{
							header: "Date & Time",
							meta: { width: TABLE_WIDTHS.DATETIME },
							cell: ({ row }) => (
								<span className="text-muted-foreground">
									{formatDatetime(row.original.datetime)}
								</span>
							),
						},
						{
							header: "Amount",
							meta: { width: TABLE_WIDTHS.AMOUNT_BAR },
							cell: ({ row }) => (
								<AllocateBar
									title="Allocable"
									value={round2dp(row.original.allocable_amount)}
									total={row.original.amount}
								/>
							),
						},
						{
							header: "Description",
							// Expand width to maximum for statements
							cell: ({ row }) => (
								<div className="truncate text-muted-foreground">
									{row.original.description}
								</div>
							),
						},
						{
							id: "actions",
							meta: { width: TABLE_WIDTHS.ACTIONS_OPEN },
							cell: ({ row }) => (
								<Button variant="outline" size="sm" asChild>
									<Link
										href={statementWebRoute.url({ statement: row.original })}
										onClick={handlePush("Allocator")}
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
						searchPlaceholder: "Search unallocated statements...",
						filters: (
							<>
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
							</>
						),
						actions: (
							<RecordCreatorDialog
								statements={selected}
								categories={categories}
								disabled={!selected.length}
								clear={() => setSelected([])}
							/>
						),
					}}
					footer={{
						summary: `${Object.values(selected).filter(Boolean).length} selected. Showing ${statements.data.length} of ${statements.total} statements.`,
					}}
					selectedIds={selected.map(s => s.id)}
					emptyMessage="No statements found."
				/>
			</div>
		</>
	)
}
