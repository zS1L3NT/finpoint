"use client"

export const dynamic = "force-dynamic"

import { useLiveQuery } from "dexie-react-hooks"
import { use, useMemo, useState } from "react"
import { DetailSummary, DetailSummaryItem } from "@/components/detail-summary"
import AccountDialog from "@/components/dialogs/account"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import { UiIcon as IconifyIcon } from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useStatementColumns, useStatementMobileRow } from "@/components/table/statement-columns"
import { Button } from "@/components/ui/button"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { getAccount, listAccounts } from "@/logic/accounts"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { listStatements } from "@/logic/statements"
import { pathAccounts } from "@/routes"
import type { Statement } from "@/types"

export default function AccountPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const [isEditingAccount, setIsEditingAccount] = useState(false)
	const [editingStatement, setEditingStatement] = useState<Statement | null>(null)

	const { query, page, pageSize, handleQueryChange, handlePageSizeChange } =
		usePaginatedTableState()

	const account = useLiveQuery(() => (id ? getAccount(id).catch(() => null) : null), [id])
	const accounts = useLiveQuery(() => listAccounts(), []) ?? []
	const statements =
		useLiveQuery(
			() => listStatements({ query: query || null, account_id: id ?? null }),
			[query, id],
		) ?? []
	const paginated = useMemo(
		() => paginateItems(statements, parsePage(page), parsePageSize(pageSize)),
		[statements, page, pageSize],
	)

	const columns = useStatementColumns<Statement>({
		showAccount: false,
		pageName: `Account ${account?.name ?? ""}`,
		onEdit: setEditingStatement,
	})
	const mobileRow = useStatementMobileRow<Statement>({
		showAccount: false,
		pageName: `Account ${account?.name ?? ""}`,
		onEdit: setEditingStatement,
	})

	if (!account) {
		return (
			<>
				<AppHeader title="Account" />
				<PageContent>
					<p className="text-sm text-muted-foreground">Account not found.</p>
				</PageContent>
			</>
		)
	}

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
						url: pathAccounts(),
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
					paginated={paginated}
					columns={columns}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search account statements...",
					}}
					footer={{
						summary: `Showing ${paginated.data.length} of ${paginated.total} statements.`,
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
