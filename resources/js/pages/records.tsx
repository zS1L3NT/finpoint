import { Link } from "@inertiajs/react"
import { ReceiptTextIcon } from "lucide-react"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, formatCurrency, formatDatetime } from "@/lib/utils"
import { Category, Paginated, Record } from "@/types"
import { recordsWebRoute, recordWebRoute } from "@/wayfinder/routes"

type RecordExtra = {
	category: Category
}

export default function RecordsPage({ records }: { records: Paginated<Record & RecordExtra> }) {
	const { handlePush } = useHistory()

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
					subtitle="Browse and manage your financial records."
					description="Ledger view"
					icon={ReceiptTextIcon}
				/>

				<PaginatedDataTable
					paginated={records}
					columns={[
						{
							header: "Record",
							meta: { width: TABLE_WIDTHS.RECORD },
							cell: ({ row }) => (
								<div className="flex items-center gap-3">
									<Icon {...row.original.category} size={16} />
									<div className="flex-1 overflow-hidden">
										<p className="truncate font-medium">{row.original.title}</p>
										<p className="truncate text-muted-foreground">
											{row.original.subtitle || "No extra context"}
										</p>
									</div>
								</div>
							),
						},
						{
							header: "Amount",
							meta: { width: TABLE_WIDTHS.AMOUNT },
							cell: ({ row }) => (
								<span className={classForCurrency(row.original.amount)}>
									{formatCurrency(row.original.amount)}
								</span>
							),
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
							header: "Description",
							meta: { width: TABLE_WIDTHS.DESCRIPTION },
							cell: ({ row }) => (
								<div className="truncate text-muted-foreground">
									{row.original.description || "-"}
								</div>
							),
						},
						{
							id: "actions",
							cell: ({ row }) => (
								<div className="flex justify-end">
									<Button variant="outline" size="sm" asChild>
										<Link
											href={recordWebRoute.url({ record: row.original })}
											onClick={handlePush("Records")}
										>
											Open
										</Link>
									</Button>
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
				/>
			</div>
		</>
	)
}
