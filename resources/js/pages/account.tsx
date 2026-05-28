import { LandmarkIcon, PencilIcon } from "lucide-react"
import { useState } from "react"
import DetailCard from "@/components/detail-card"
import AccountDialog from "@/components/dialogs/account"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useStatementColumns, useStatementMobileRow } from "@/components/table/statement-columns"
import { Button } from "@/components/ui/button"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import type { Account, Paginated, Statement } from "@/types"
import { accountsWebRoute, accountWebRoute } from "@/wayfinder/routes"

export default function AccountPage({
	account,
	statements,
}: {
	account: Account
	statements: Paginated<Statement>
}) {
	const [isEditingAccount, setIsEditingAccount] = useState(false)

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query => accountWebRoute({ account }, { query }).url,
	})
	const columns = useStatementColumns<Statement>({
		showAccount: false,
		pageName: `Account ${account.name}`,
	})
	const mobileRow = useStatementMobileRow<Statement>({
		showAccount: false,
		pageName: `Account ${account.name}`,
	})

	return (
		<>
			<AppHeader title="Account" />

			<PageContent>
				<PageHeader
					title={account.name}
					subtitle={`${account.bank} account`}
					description="Account details"
					icon={LandmarkIcon}
					actions={
						<AccountDialog
							account={account}
							isOpen={isEditingAccount}
							setIsOpen={setIsEditingAccount}
							trigger={
								<Button className="w-full sm:w-auto">
									<PencilIcon /> Edit Account
								</Button>
							}
						/>
					}
					back={{
						name: "Back to accounts",
						url: accountsWebRoute.url(),
					}}
				/>

				<div className="grid gap-4 lg:grid-cols-4">
					<DetailCard label="Account ID" value={account.id} />
					<DetailCard label="Bank" value={account.bank} />
					<DetailCard label="Statements" value={account.statements_count ?? 0} />
				</div>

				<PaginatedDataTable
					paginated={statements}
					columns={columns}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search account statements...",
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
