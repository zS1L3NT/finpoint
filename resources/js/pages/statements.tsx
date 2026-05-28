import { CreditCardIcon } from "lucide-react"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useStatementColumns, useStatementMobileRow } from "@/components/table/statement-columns"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { Paginated, Statement } from "@/types"
import { statementsWebRoute } from "@/wayfinder/routes"

export default function StatementsPage({ statements }: { statements: Paginated<Statement> }) {
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query => statementsWebRoute({ query }).url,
	})

	const columns = useStatementColumns<Statement>({ pageName: "Statements" })
	const mobileRow = useStatementMobileRow<Statement>({ pageName: "Statements" })

	return (
		<>
			<AppHeader title="Statements" />

			<PageContent>
				<PageHeader
					title="Statements"
					subtitle="Review imported bank statements and their linked records."
					description="Imported bank feed"
					icon={CreditCardIcon}
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
