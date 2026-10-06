"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { use, useMemo, useState } from "react"
import AccountDialog from "@/components/dialogs/account"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Metric, MetricGrid } from "@/components/metric"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { byDay } from "@/components/table/row-groups"
import { useStatementColumns, useStatementMobileRow } from "@/components/table/statement-columns"
import { Button } from "@/components/ui/button"
import { useOpenRow } from "@/hooks/use-open-row"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { bankMeta } from "@/lib/banks"
import { formatCurrency, formatDatetime } from "@/lib/utils"
import { getAccount, listAccounts } from "@/logic/accounts"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { listStatements } from "@/logic/statements"
import { pathAccounts, pathStatement } from "@/routes"
import type { Statement } from "@/types"

export default function AccountPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const [isEditingAccount, setIsEditingAccount] = useState(false)
	const [editingStatement, setEditingStatement] = useState<Statement | null>(null)

	const { page, pageSize } = usePaginatedTableState()

	const account = useLiveQuery(() => (id ? getAccount(id).catch(() => null) : null), [id])
	const accounts = useLiveQuery(() => listAccounts(), []) ?? []
	const statements = useLiveQuery(() => listStatements({ account_id: id ?? null }), [id]) ?? []
	const paginated = useMemo(
		() => paginateItems(statements, parsePage(page), parsePageSize(pageSize)),
		[statements, page, pageSize],
	)

	const columns = useStatementColumns<Statement>({
		showAccount: false,
		pageName: `Account ${account?.name ?? ""}`,
		onEdit: setEditingStatement,
		grouped: true,
	})
	const mobileRow = useStatementMobileRow<Statement>({
		showAccount: false,
		pageName: `Account ${account?.name ?? ""}`,
		onEdit: setEditingStatement,
		grouped: true,
	})
	const openStatement = useOpenRow<Statement>(pathStatement, `Account ${account?.name ?? ""}`)

	if (!account) {
		return (
			<>
				<PageContent>
					<p className="text-sm text-muted-foreground">Account not found.</p>
				</PageContent>
			</>
		)
	}

	return (
		<>
			<PageContent>
				<PageHeader
					title={account.name}
					subtitle={`${bankMeta(account.bank).label} account · ID ${account.id}`}
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

				<MetricGrid>
					<Metric
						icon="lucide:credit-card"
						label="Statements"
						value={account.statements_count.toLocaleString()}
						detail={
							account.last_activity
								? `Last activity ${formatDatetime(account.last_activity)}`
								: "No activity yet"
						}
					/>
					<Metric
						icon="lucide:link-2-off"
						label="Unallocated"
						value={account.unallocated_count.toLocaleString()}
						detail={
							account.pending_count
								? `${account.pending_count} pending Statement${account.pending_count === 1 ? "" : "s"}`
								: "No pending Statements"
						}
						tone={account.unallocated_count ? "negative" : "positive"}
					/>
					<Metric
						icon="lucide:arrow-down-left"
						label="Money in · 30 days"
						value={formatCurrency(account.inflow_30d)}
						detail="Imported and pending Statements"
					/>
					<Metric
						icon="lucide:arrow-up-right"
						label="Money out · 30 days"
						value={formatCurrency(account.outflow_30d)}
						detail={`Net ${formatCurrency(account.inflow_30d - account.outflow_30d)}`}
					/>
				</MetricGrid>

				<PaginatedDataTable
					paginated={paginated}
					columns={columns}
					footer={{
						summary: `Showing ${paginated.data.length} of ${paginated.total} statements.`,
					}}
					mobileRow={mobileRow}
					groupBy={byDay<Statement>()}
					onRowClick={openStatement}
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
