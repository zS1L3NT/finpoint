import { router } from "@inertiajs/react"
import AppHeader from "@/components/app-header"
import DataTable from "@/components/data-table"
import Icon from "@/components/icon"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { currencyClass, toCurrency, toDatetime } from "@/lib/utils"
import { Category, Paginated, Record, Statement } from "@/types"
import RecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"

type RecordExtra = {
	category: Category
	statements: Statement[]
}

export default function RecordsPage({ records }: { records: Paginated<Record & RecordExtra> }) {
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: records,
		buildUrl: query => recordsRoute({ query }).url,
	})

	return (
		<>
			<AppHeader title="Records" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-semibold">Records</h2>
					<p className="text-muted-foreground">
						Browse records with linked statements and category context.
					</p>
				</div>

				<DataTable
					data={records}
					columns={[
						{
							header: "Date & Time",
							cell: ({ row }) => (
								<span className="text-muted-foreground">
									{toDatetime(row.original.datetime)}
								</span>
							),
						},
						{
							header: "Amount",
							cell: ({ row }) => (
								<span className={currencyClass(row.original.amount)}>
									{toCurrency(row.original.amount)}
								</span>
							),
						},
						{
							header: "Record",
							cell: ({ row }) => (
								<div className="flex items-center gap-3">
									<Icon {...row.original.category} size={16} />
									<div className="min-w-0">
										<p className="truncate font-medium">{row.original.title}</p>
										<p className="truncate text-muted-foreground">
											{[
												row.original.people
													? `w/ ${row.original.people}`
													: null,
												row.original.location
													? `@ ${row.original.location}`
													: null,
											]
												.filter(Boolean)
												.join(" ") || "No extra context"}
										</p>
									</div>
								</div>
							),
						},
					]}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search records...",
					}}
					footer={{
						summary: `Showing ${records.data.length} of ${records.total} records.`,
					}}
					emptyMessage="No records found."
					onRowClick={row =>
						router.visit(RecordController.show({ record: row.original.id }).url)
					}
				/>
			</div>
		</>
	)
}
