import { Link } from "@inertiajs/react"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import type { Account, Paginated } from "@/types"
import { accountsWebRoute, accountWebRoute } from "@/wayfinder/routes"

export default function AccountsPage({ accounts }: { accounts: Paginated<Account> }) {
	const { handlePush } = useHistory()

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: accounts,
		buildUrl: query => accountsWebRoute({ query }).url,
	})

	return (
		<>
			<AppHeader title="Accounts" />

			<PageContent>
				<PageHeader
					title="Accounts"
					subtitle="Manage imported bank accounts and their display names."
					description="Account directory"
					icon="lucide:landmark"
				/>

				<PaginatedDataTable
					paginated={accounts}
					columns={[
						{
							header: "Account",
							meta: { width: TABLE_WIDTH_CLASSNAMES.ACCOUNT },
							cell: ({ row }) => row.original.name,
						},
						{
							header: "Bank",
							meta: { width: TABLE_WIDTH_CLASSNAMES.BANK },
							cell: ({ row }) => <div className="pe-8">{row.original.bank}</div>,
						},
						{
							header: "Statements",
							meta: { width: TABLE_WIDTH_CLASSNAMES.STATEMENT_COUNT },
							cell: ({ row }) => (
								<div className="pe-8">{row.original.statements_count ?? 0}</div>
							),
						},
						{
							id: "actions",
							meta: { width: TABLE_WIDTH_CLASSNAMES.ACTIONS_DYNAMIC_OPEN },
							cell: ({ row }) => (
								<Button variant="outline" size="sm" asChild>
									<Link
										href={accountWebRoute.url({ account: row.original })}
										onClick={handlePush("Accounts")}
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
						searchPlaceholder: "Search accounts...",
					}}
					footer={{
						summary: `Showing ${accounts.data.length} of ${accounts.total} accounts.`,
					}}
					mobileRow={({ original: account }) => (
						<div className="flex flex-col gap-3">
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<p className="font-medium break-words">{account.name}</p>
									<p className="text-xs text-muted-foreground">{account.bank}</p>
								</div>
								<p className="text-xs text-muted-foreground">
									{account.statements_count ?? 0} statements
								</p>
							</div>
							<div className="flex justify-end">
								<Button variant="outline" size="sm" asChild>
									<Link
										href={accountWebRoute.url({ account })}
										onClick={handlePush("Accounts")}
									>
										Open
									</Link>
								</Button>
							</div>
						</div>
					)}
					emptyMessage="No accounts found."
				/>
			</PageContent>
		</>
	)
}
