import { useLiveQuery } from "dexie-react-hooks"
import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import DateField from "@/components/form/date-field"
import { UiIcon as IconifyIcon } from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
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
	const [searchParams] = useSearchParams()
	const isPending = searchParams.get("is_pending")
	const startDate = searchParams.get("start_date")
	const endDate = searchParams.get("end_date")

	const { query, page, pageSize, handleQueryChange, handlePageSizeChange, setParams } =
		usePaginatedTableState()
	const updateFilters = (changes: { [key: string]: string | null }) => {
		setParams({ ...changes, page: null })
	}
	const activeFilterCount = [searchParams.get("query"), isPending, startDate, endDate].filter(
		Boolean,
	).length
	const clearFilters = () =>
		setParams({ query: null, is_pending: null, start_date: null, end_date: null, page: null })

	const accounts = useLiveQuery(() => listAccounts(), []) ?? []
	const statementsQuery = useLiveQuery(
		() =>
			listStatements({
				query: query || null,
				is_pending: isPending,
				start_date: startDate,
				end_date: endDate,
			}),
		[query, isPending, startDate, endDate],
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
			<AppHeader title="Statements" />

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
						searchPlaceholder: "Search all statements...",
						filters: (
							<FilterBar>
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
								<DateField
									id="statements_start_date"
									value={startDate ?? ""}
									className="min-w-0 sm:w-40"
									triggerClassName={FILTER_CONTROL_CLASS}
									placeholder="Start date"
									onChange={date => updateFilters({ start_date: date || null })}
								/>
								<DateField
									id="statements_end_date"
									value={endDate ?? ""}
									className="min-w-0 sm:w-40"
									triggerClassName={FILTER_CONTROL_CLASS}
									placeholder="End date"
									onChange={date => updateFilters({ end_date: date || null })}
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
