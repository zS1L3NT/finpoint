"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import DateRange from "@/components/form/date-range"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import StatementTabs from "@/components/statement-tabs"
import AmountFilter from "@/components/table/amount-filter"
import {
	ClearFiltersButton,
	FilterBar,
	FilterField,
	FilterSelect,
	filterControlClass,
} from "@/components/table/filter-bar"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { byDay } from "@/components/table/row-groups"
import { useStatementColumns, useStatementMobileRow } from "@/components/table/statement-columns"
import { Button } from "@/components/ui/button"
import { SelectItem } from "@/components/ui/select"
import { useHistory } from "@/history"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { pluralize } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { listStatements } from "@/logic/statements"
import type { Statement } from "@/types"

export default function StatementsPage() {
	const { latest } = useHistory()
	const [isCreatingStatement, setIsCreatingStatement] = useState(false)
	const [editingStatement, setEditingStatement] = useState<Statement | null>(null)
	const searchParams = useSearchParams()
	const accountId = searchParams.get("account_id") ?? "all"
	const isPending = searchParams.get("is_pending")
	const isUnallocated = searchParams.get("is_unallocated")
	const startDate = searchParams.get("start_date")
	const endDate = searchParams.get("end_date")
	const minAmount = searchParams.get("min_amount")
	const maxAmount = searchParams.get("max_amount")

	const { query, page, pageSize, handleQueryChange, handlePageSizeChange, setParams } =
		usePaginatedTableState()
	const updateFilters = (changes: { [key: string]: string | null }) => {
		setParams({ ...changes, page: null })
	}
	const activeFilterCount = [
		searchParams.get("query"),
		accountId === "all" ? "" : accountId,
		isPending,
		isUnallocated,
		startDate ?? endDate,
		minAmount ?? maxAmount,
	].filter(Boolean).length
	const clearFilters = () =>
		setParams({
			query: null,
			account_id: null,
			is_pending: null,
			is_unallocated: null,
			start_date: null,
			end_date: null,
			min_amount: null,
			max_amount: null,
			page: null,
		})

	const accounts = useLiveQuery(() => listAccounts(), [])
	const statementsQuery = useLiveQuery(
		() =>
			listStatements({
				query: query || null,
				account_id: accountId === "all" ? null : accountId,
				is_pending: isPending,
				is_unallocated: isUnallocated,
				start_date: startDate,
				end_date: endDate,
				min_amount: minAmount,
				max_amount: maxAmount,
			}),
		[query, accountId, isPending, isUnallocated, startDate, endDate, minAmount, maxAmount],
	)
	const statements = statementsQuery ?? []
	const paginated = useMemo(
		() => paginateItems(statements, parsePage(page), parsePageSize(pageSize)),
		[statements, page, pageSize],
	)
	const columns = useStatementColumns<Statement>({
		pageName: "Statements",
		onEdit: setEditingStatement,
		grouped: true,
	})
	const mobileRow = useStatementMobileRow<Statement>({
		pageName: "Statements",
		onEdit: setEditingStatement,
		grouped: true,
	})

	if (accounts === undefined || statementsQuery === undefined) return null

	return (
		<>
			<PageContent className="gap-2 md:gap-6">
				<PageHeader
					title="Statements"
					subtitle="Review imported and pending statements with their allocated records."
					description="Account activity"
					icon="lucide:credit-card"
					back={latest ?? undefined}
				/>

				<StatementTabs active="statements" />

				<PaginatedDataTable
					paginated={paginated}
					columns={columns}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search descriptions...",
						filters: (
							<FilterBar>
								<FilterSelect
									name="account"
									icon="lucide:landmark"
									value={accountId === "all" ? null : accountId}
									onValueChange={value => updateFilters({ account_id: value })}
								>
									<SelectItem value="all">All Accounts</SelectItem>
									{accounts.map(account => (
										<SelectItem key={account.id} value={account.id}>
											{account.name}
										</SelectItem>
									))}
								</FilterSelect>
								<FilterSelect
									name="status"
									icon="lucide:circle-check-big"
									value={isPending}
									onValueChange={value => updateFilters({ is_pending: value })}
								>
									<SelectItem value="all">Any status</SelectItem>
									<SelectItem value="true">Pending</SelectItem>
									<SelectItem value="false">Imported</SelectItem>
								</FilterSelect>
								<FilterSelect
									name="allocation"
									icon="lucide:circle-check-big"
									value={isUnallocated}
									onValueChange={value =>
										updateFilters({ is_unallocated: value })
									}
								>
									<SelectItem value="all">Any allocation</SelectItem>
									<SelectItem value="true">Unallocated</SelectItem>
									<SelectItem value="false">Allocated</SelectItem>
								</FilterSelect>
								<FilterField
									name="date"
									active={!!(startDate ?? endDate)}
									onClear={() =>
										updateFilters({ start_date: null, end_date: null })
									}
								>
									<DateRange
										id="statements_date_range"
										value={{ start: startDate, end: endDate }}
										triggerClassName={filterControlClass(
											!!(startDate ?? endDate),
										)}
										onChange={value =>
											updateFilters({
												start_date: value.start,
												end_date: value.end,
											})
										}
									/>
								</FilterField>
								<AmountFilter
									value={{ min: minAmount, max: maxAmount }}
									onChange={value =>
										updateFilters({
											min_amount: value.min,
											max_amount: value.max,
										})
									}
								/>
								<ClearFiltersButton
									count={activeFilterCount}
									onClear={clearFilters}
								/>
							</FilterBar>
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
						summary: `Showing ${paginated.data.length} of ${pluralize(paginated.total, "statement")}.`,
					}}
					mobileRow={mobileRow}
					groupBy={byDay<Statement>("Statement")}
					emptyMessage="No statements found."
					loading={statementsQuery === undefined}
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
