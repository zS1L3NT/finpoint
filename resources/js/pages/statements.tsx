import { Icon as IconifyIcon } from "@iconify/react"
import { useState } from "react"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useStatementColumns, useStatementMobileRow } from "@/components/table/statement-columns"
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
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { useSearchParam } from "@/hooks/use-search-param"
import { Account, Paginated, Statement } from "@/types"
import { statementsWebRoute } from "@/wayfinder/routes"

export default function StatementsPage({
	statements,
	accounts,
}: {
	statements: Paginated<Statement>
	accounts: Account[]
}) {
	const [isCreatingStatement, setIsCreatingStatement] = useState(false)
	const [isPending, setIsPending] = useSearchParam("is_pending")

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query =>
			statementsWebRoute({
				query: {
					...query,
					is_pending: isPending || undefined,
				},
			}).url,
	})
	const pendingFilterLabel =
		isPending === "true" ? "Pending" : isPending === "false" ? "Imported" : null

	const columns = useStatementColumns<Statement>({ pageName: "Statements" })
	const mobileRow = useStatementMobileRow<Statement>({ pageName: "Statements" })

	return (
		<>
			<AppHeader title="Statements" />

			<PageContent>
				<PageHeader
					title="Statements"
					subtitle="Review imported and handwritten pending statements with their allocated records."
					description="Account activity"
					icon="lucide:credit-card"
				/>

				<PaginatedDataTable
					paginated={statements}
					columns={columns}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search all statements...",
						filters: (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										variant={pendingFilterLabel ? "secondary" : "outline"}
										className="w-full sm:w-auto"
									>
										<IconifyIcon icon="lucide:list-filter" /> Filter status
										{pendingFilterLabel ? (
											<Badge variant="outline">{pendingFilterLabel}</Badge>
										) : null}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuLabel>Filter by status</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuCheckboxItem
											checked={isPending === "true"}
											onSelect={event => event.preventDefault()}
											onCheckedChange={checked =>
												setIsPending(checked === true ? "true" : null)
											}
										>
											Pending
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={isPending === "false"}
											onSelect={event => event.preventDefault()}
											onCheckedChange={checked =>
												setIsPending(checked === true ? "false" : null)
											}
										>
											Imported
										</DropdownMenuCheckboxItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						),
						actions: (
							<PendingStatementDialog
								accounts={accounts}
								isOpen={isCreatingStatement}
								setIsOpen={setIsCreatingStatement}
								trigger={
									<Button className="w-full sm:w-auto">
										<IconifyIcon icon="lucide:plus" /> Create Pending Statement
									</Button>
								}
							/>
						),
					}}
					footer={{
						summary: `Showing ${statements.data.length} of ${statements.total} statements.`,
					}}
					mobileRow={mobileRow}
					emptyMessage="No statements found."
				/>
			</PageContent>
		</>
	)
}
