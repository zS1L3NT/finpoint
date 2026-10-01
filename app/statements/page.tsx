"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import DateRange from "@/components/form/date-range"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import AmountFilter from "@/components/table/amount-filter"
import { ClearFiltersButton, FILTER_CONTROL_CLASS, FilterBar } from "@/components/table/filter-bar"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useStatementColumns, useStatementMobileRow } from "@/components/table/statement-columns"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { cn } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { listStatements } from "@/logic/statements"
import type { Statement } from "@/types"

export default function StatementsPage() {
	const [isCreatingStatement, setIsCreatingStatement] = useState(false)
	const [editingStatement, setEditingStatement] = useState<Statement | null>(null)
	const searchParams = useSearchParams()
	const accountId = searchParams.get("account_id") ?? "all"
	const isPending = searchParams.get("is_pending")
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
		startDate ?? endDate,
		minAmount ?? maxAmount,
	].filter(Boolean).length
	const clearFilters = () =>
		setParams({
			query: null,
			account_id: null,
			is_pending: null,
			start_date: null,
			end_date: null,
			min_amount: null,
			max_amount: null,
			page: null,
		})

	const accounts = useLiveQuery(() => listAccounts(), []) ?? []
	const statementsQuery = useLiveQuery(
		() =>
			listStatements({
				query: query || null,
				account_id: accountId === "all" ? null : accountId,
				is_pending: isPending,
				start_date: startDate,
				end_date: endDate,
				min_amount: minAmount,
				max_amount: maxAmount,
			}),
		[query, accountId, isPending, startDate, endDate, minAmount, maxAmount],
	)
	const statements = statementsQuery ?? []
	const paginated = useMemo(
		() => paginateItems(statements, parsePage(page), parsePageSize(pageSize)),
		[statements, page, pageSize],
	)
	const columns = useStatementColumns<Statement>({
		pageName: "Statements",
		onEdit: setEditingStatement,
	})
	const mobileRow = useStatementMobileRow<Statement>({
		pageName: "Statements",
		onEdit: setEditingStatement,
	})

	return (
		<>
			<PageContent>
				<PageHeader
					title="Statements"
					subtitle="Review imported and handwritten pending statements with their allocated records."
					description="Account activity"
					icon="lucide:credit-card"
				/>

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
								<Select
									value={accountId}
									onValueChange={value =>
										updateFilters({
											account_id: value === "all" ? null : value,
										})
									}
								>
									<SelectTrigger
										className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}
									>
										<IconifyIcon icon="lucide:landmark" />
										<SelectValue />
									</SelectTrigger>
									<SelectContent align="start" variant="filter">
										<SelectGroup>
											<SelectItem value="all">All Accounts</SelectItem>
											{accounts.map(account => (
												<SelectItem key={account.id} value={account.id}>
													{account.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								<Select
									value={isPending ?? "all"}
									onValueChange={value =>
										updateFilters({
											is_pending: value === "all" ? null : value,
										})
									}
								>
									<SelectTrigger
										className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}
									>
										<IconifyIcon icon="lucide:circle-check-big" />
										<SelectValue />
									</SelectTrigger>
									<SelectContent align="start" variant="filter">
										<SelectGroup>
											<SelectItem value="all">Any status</SelectItem>
											<SelectItem value="true">Pending</SelectItem>
											<SelectItem value="false">Imported</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<DateRange
									id="statements_date_range"
									value={{ start: startDate, end: endDate }}
									className="sm:w-40"
									triggerClassName={FILTER_CONTROL_CLASS}
									onChange={value =>
										updateFilters({
											start_date: value.start,
											end_date: value.end,
										})
									}
								/>
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
						summary: `Showing ${paginated.data.length} of ${paginated.total} statements.`,
					}}
					mobileRow={mobileRow}
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
