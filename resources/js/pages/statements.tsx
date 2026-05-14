import { Link } from "@inertiajs/react"
import { CreditCardIcon } from "lucide-react"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, formatCurrency, formatDatetime } from "@/lib/utils"
import { Paginated, Statement } from "@/types"
import { statementsWebRoute, statementWebRoute } from "@/wayfinder/routes"

export default function StatementsPage({ statements }: { statements: Paginated<Statement> }) {
	const { handlePush } = useHistory()

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query => statementsWebRoute({ query }).url,
	})

	return (
		<>
			<AppHeader title="Statements" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Statements"
					subtitle="Review imported bank statements and their linked records."
					description="Imported bank feed"
					icon={CreditCardIcon}
				/>

				<PaginatedDataTable
					paginated={statements}
					columns={[
						{
							header: "Account",
							meta: { width: TABLE_WIDTH_CLASSNAMES.ACCOUNT },
							cell: ({ row }) => row.original.account.id,
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
							header: "Amount",
							meta: { width: TABLE_WIDTH_CLASSNAMES.AMOUNT },
							cell: ({ row }) => (
								<span className={classForCurrency(row.original.amount)}>
									{formatCurrency(row.original.amount)}
								</span>
							),
						},
						{
							header: "Description",
							meta: { width: TABLE_WIDTH_CLASSNAMES.STATEMENT },
							cell: ({ row }) => (
								<div className="truncate text-muted-foreground">
									{row.original.description}
								</div>
							),
						},
						{
							id: "actions",
							meta: { width: TABLE_WIDTH_CLASSNAMES.ACTIONS_FIXED_OPEN },
							cell: ({ row }) => (
								<Button variant="outline" size="sm" asChild>
									<Link
										href={statementWebRoute.url({
											statement: row.original,
										})}
										onClick={handlePush("Statements")}
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
						searchPlaceholder: "Search all statements...",
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
