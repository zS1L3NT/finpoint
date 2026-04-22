import { Link } from "@inertiajs/react"
import { ReceiptTextIcon } from "lucide-react"
import AppHeader from "@/components/app-header"
import DataTable from "@/components/data-table"
import Icon from "@/components/icon"
import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { currencyClass, toCurrency, toDatetime } from "@/lib/utils"
import { Category, Paginated, Record, Statement } from "@/types"
import { recordsWebRoute, recordWebRoute } from "@/wayfinder/routes"

type RecordExtra = {
	category: Category
	statements: Statement[]
}

export default function RecordsPage({ records }: { records: Paginated<Record & RecordExtra> }) {
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: records,
		buildUrl: query => recordsWebRoute({ query }).url,
	})

	return (
		<>
			<AppHeader title="Records" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Records"
					subtitle="Browse records with linked statements and category context."
					description="Ledger view"
					icon={ReceiptTextIcon}
				/>

				<DataTable
					data={records}
					columns={[
						{
							header: "Date & Time",
							meta: { width: "12rem" },
							cell: ({ row }) => (
								<span className="text-muted-foreground">
									{toDatetime(row.original.datetime)}
								</span>
							),
						},
						{
							header: "Amount",
							meta: { width: "6rem" },
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
						{
							id: "actions",
							meta: { width: "4rem" },
							cell: ({ row }) => (
								<Button variant="outline" size="sm" asChild>
									<Link href={recordWebRoute.url({ record: row.original })}>
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
						searchPlaceholder: "Search records...",
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
