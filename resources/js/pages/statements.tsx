import { router } from "@inertiajs/react"
import AppHeader from "@/components/app-header"
import DataTable from "@/components/data-table"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { currencyClass, toCurrency, toDate } from "@/lib/utils"
import { Account, Paginated, Record, Statement } from "@/types"
import StatementController from "@/wayfinder/actions/App/Http/Controllers/StatementController"

type StatementExtra = {
	account: Account
	records: Record[]
}

export default function StatementsPage({
	statements,
}: {
	statements: Paginated<Statement & StatementExtra>
}) {
	const { query, pageSize, handleQueryChange, handlePageSizeChange, handleVisit } =
		usePaginatedTableState({
			syncOn: statements,
			buildUrl: query => StatementController.index({ query }).url,
		})

	return (
		<>
			<AppHeader title="Statements" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-semibold">Statements</h2>
					<p className="text-muted-foreground">
						Review imported bank statements and their linked records.
					</p>
				</div>

				<DataTable
					data={statements}
					columns={[
						{
							header: "Account",
							cell: ({ row }) => row.original.account.id,
						},
						{
							header: "Date",
							cell: ({ row }) => (
								<span className="text-muted-foreground">
									{toDate(row.original.date)}
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
							header: "Description",
							cell: ({ row }) => (
								<div
									className="truncate text-muted-foreground"
									dangerouslySetInnerHTML={{
										__html: row.original.description.replaceAll(
											/(\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))/g,
											"<mark>$1</mark>",
										),
									}}
								/>
							),
						},
					]}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search statements...",
					}}
					footer={{
						summary: `Showing ${statements.data.length} of ${statements.total} statements.`,
						handleVisit,
					}}
					emptyMessage="No statements found."
					onRowClick={row =>
						router.visit(StatementController.show({ statement: row.original.id }).url)
					}
				/>
			</div>
		</>
	)
}
