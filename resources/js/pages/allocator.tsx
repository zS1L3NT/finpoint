import { Link } from "@inertiajs/react"
import { LinkIcon } from "lucide-react"
import { useState } from "react"
import AllocateBar from "@/components/allocate-bar"
import DetailCard from "@/components/detail-card"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import RecordCreatorDialog from "@/dialogs/record-creator"
import { useHistory } from "@/history"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, formatCurrency, formatDatetime, round2dp } from "@/lib/utils"
import { Account, Category, Paginated, Statement } from "@/types"
import { allocatorWebRoute, statementWebRoute } from "@/wayfinder/routes"

type StatementExtra = {
	account: Account
	allocations_sum_amount: number | null
}

type CategoryExtra = {
	children: Category[]
}

export default function AllocatorPage({
	statements,
	categories,
	titles,
	locations,
	peoples,
}: {
	statements: Paginated<Statement & StatementExtra>
	categories: (Category & CategoryExtra)[]
	titles: string[]
	locations: string[]
	peoples: string[]
}) {
	const { handlePush } = useHistory()

	const [selected, setSelected] = useState<(Statement & StatementExtra)[]>([])
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query => allocatorWebRoute({ query }).url,
	})

	const selectedAmount = selected.reduce(
		(sum, statement) => sum + (statement.amount - (statement.allocations_sum_amount ?? 0)),
		0,
	)

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
									value={round2dp(
										row.original.amount -
											(row.original.allocations_sum_amount ?? 0),
									)}
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
						searchPlaceholder: "Filter statements...",
						children: (
							<RecordCreatorDialog
								statements={selected ? Object.values(selected) : []}
								categories={categories}
								titles={titles}
								locations={locations}
								peoples={peoples}
								clear={() => setSelected([])}
							/>
						),
					}}
					footer={{
						summary: `${Object.values(selected).filter(Boolean).length} selected. Showing ${statements.data.length} of ${statements.total} statements.`,
					}}
					emptyMessage="No statements found."
				/>
			</div>
		</>
	)
}
