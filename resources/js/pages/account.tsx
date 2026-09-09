import { Icon as IconifyIcon } from "@iconify/react"
import { useState } from "react"
import { DetailSummary, DetailSummaryItem } from "@/components/detail-summary"
import AccountDialog from "@/components/dialogs/account"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
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
	accounts,
	statements,
}: {
	account: Account
	accounts: Account[]
	statements: Paginated<Statement>
}) {
	const [isEditingAccount, setIsEditingAccount] = useState(false)
	const [editingStatement, setEditingStatement] = useState<Statement | null>(null)

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query => accountWebRoute({ account }, { query }).url,
	})
	const columns = useStatementColumns<Statement>({
		showAccount: false,
		pageName: `Account ${account.name}`,
		onEdit: setEditingStatement,
	})
	const mobileRow = useStatementMobileRow<Statement>({
		showAccount: false,
		pageName: `Account ${account.name}`,
		onEdit: setEditingStatement,
	})

	return (
		<>
			<AppHeader title="Account" />

			<PageContent>
				<PageHeader
					title={account.name}
					subtitle={`${account.bank} account`}
					description="Account details"
					icon="lucide:landmark"
					actions={
						<AccountDialog
							account={account}
							isOpen={isEditingAccount}
							setIsOpen={setIsEditingAccount}
							trigger={
								<Button className="w-full sm:w-auto">
									<IconifyIcon icon="lucide:pencil" /> Edit Account
								</Button>
							}
						/>
					}
					back={{
						name: "Accounts",
						url: accountsWebRoute.url(),
					}}
				/>

				<DetailSummary columns={2} footer={<span>Account ID · {account.id}</span>}>
					<DetailSummaryItem icon="lucide:landmark" label="Bank" value={account.bank} />
					<DetailSummaryItem
						icon="lucide:credit-card"
						label="Statements"
						value={account.statements_count ?? 0}
					/>
				</DetailSummary>

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

			{editingStatement ? (
				<PendingStatementDialog
					statement={editingStatement}
					accounts={accounts}
					isOpen
					setIsOpen={open => {
						if (!open) setEditingStatement(null)
					}}
				/>
			) : null}
		</>
	)
}
