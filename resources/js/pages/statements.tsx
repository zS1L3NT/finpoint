import { Link } from "@inertiajs/react"
import { MoreHorizontalIcon } from "lucide-react"
import AppHeader from "@/components/app-header"
import DataTable from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { currencyClass, toCurrency, toDate } from "@/lib/utils"
import { Account, Paginated, Record, Statement } from "@/types"
import { statement, statements as statementsRoute } from "@/wayfinder/routes"

type StatementExtra = {
	account: Account
	records: Record[]
}

export default function StatementsPage({
	statements,
}: {
	statements: Paginated<Statement & StatementExtra>
}) {
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query => statementsRoute({ query }).url,
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
						{
							id: "actions",
							meta: { width: "3rem" },
							cell: ({ row }) => (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="size-8 p-0">
											<span className="sr-only">Open menu</span>
											<MoreHorizontalIcon className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Actions</DropdownMenuLabel>
										<DropdownMenuItem asChild>
											<Link href={statement.url({ statement: row.original })}>
												View statement
											</Link>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
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
