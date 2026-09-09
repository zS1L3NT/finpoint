import { Icon as IconifyIcon } from "@iconify/react"
import { router, usePage } from "@inertiajs/react"
import { useState } from "react"
import PendingStatementDialog from "@/components/dialogs/pending-statement"
import DateField from "@/components/form/date-field"
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
	const [editingStatement, setEditingStatement] = useState<Statement | null>(null)
	const page = usePage()
	const pageUrl = new URL(page.url, "http://localhost")
	const isPending = pageUrl.searchParams.get("is_pending")
	const startDate = pageUrl.searchParams.get("start_date")
	const endDate = pageUrl.searchParams.get("end_date")
	const updateFilters = (changes: { [key: string]: string | null }) => {
		const url = new URL(page.url, "http://localhost")
		for (const [key, value] of Object.entries(changes)) {
			if (value) url.searchParams.set(key, value)
			else url.searchParams.delete(key)
		}
		url.searchParams.delete("page")
		router.visit(url.pathname + url.search, { preserveState: true, preserveScroll: true })
	}
	const activeFilterCount = [
		pageUrl.searchParams.get("query"),
		isPending,
		startDate,
		endDate,
	].filter(Boolean).length
	const clearFilters = () =>
		router.visit(
			statementsWebRoute({
				query: { per_page: pageUrl.searchParams.get("per_page") || undefined },
			}),
			{ preserveState: true, preserveScroll: true },
		)

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query =>
			statementsWebRoute({
				query: {
					...query,
					start_date: startDate || undefined,
					end_date: endDate || undefined,
					is_pending: isPending || undefined,
				},
			}).url,
	})
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
					paginated={statements}
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
