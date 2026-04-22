import { Link } from "@inertiajs/react"
import { CreditCardIcon } from "lucide-react"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { currencyClass, toCurrency, toDate } from "@/lib/utils"
import { Account, Paginated, Statement } from "@/types"
import { statementsWebRoute, statementWebRoute } from "@/wayfinder/routes"

type StatementExtra = {
	account: Account
}

export default function StatementsPage({
	statements,
}: {
	statements: Paginated<Statement & StatementExtra>
}) {
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query => statementsWebRoute({ query }).url,
	})

	return (
		<>
			<AppHeader title="Statements" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					icon={CreditCardIcon}
					description="Imported bank feed"
					title="Statements"
					subtitle="Review imported bank statements and their linked records."
				/>

				<DataTable
					data={statements}
					columns={[
						{
							header: "Account",
							meta: { width: "8rem" },
							cell: ({ row }) => row.original.account.id,
						},
						{
							header: "Date",
							meta: { width: "8rem" },
							cell: ({ row }) => (
								<span className="text-muted-foreground">
									{toDate(row.original.date)}
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
							header: "Description",
							cell: ({ row }) => (
								<div className="truncate text-muted-foreground">
									{row.original.description}
								</div>
							),
						},
						{
							id: "actions",
							meta: { width: "4rem" },
							cell: ({ row }) => (
								<Button variant="outline" size="sm" asChild>
									<Link href={statementWebRoute.url({ statement: row.original })}>
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
						searchPlaceholder: "Search statements...",
					}}
					footer={{
						summary: `Showing ${statements.data.length} of ${statements.total} statements.`,
					}}
					emptyMessage="No statements found."
				/>
			</div>
		</>
	)
}
