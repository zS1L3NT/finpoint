"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import RecordCreatorDialog from "@/components/dialogs/record-creator"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import DateRange from "@/components/form/date-range"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import SelectionBar from "@/components/selection-bar"
import PendingStatementConfirmationSheet from "@/components/sheets/pending-statement-confirmation"
import RecordSearchSheet from "@/components/sheets/record-search"
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
import { Checkbox } from "@/components/ui/checkbox"
import { SelectItem } from "@/components/ui/select"
import WorkflowTabs from "@/components/workflow-tabs"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { useDefaultFilterEndDateToday, useDefaultFilterStartDate } from "@/hooks/use-settings"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { formatCurrency, pluralize } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import { listCategories } from "@/logic/categories"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { listStatements, parseStatementFilters } from "@/logic/statements"
import type { Statement } from "@/types"

export default function AllocatorPage() {
	const searchParams = useSearchParams()
	const defaultFilterStartDate = useDefaultFilterStartDate()
	const defaultFilterEndDateToday = useDefaultFilterEndDateToday()
	const accountId = searchParams.get("account_id") ?? "all"
	const isPending = searchParams.get("is_pending")
	const startDate = searchParams.get("start_date")
	const endDate = searchParams.get("end_date")
	const minAmount = searchParams.get("min_amount")
	const maxAmount = searchParams.get("max_amount")

	const { query, page, pageSize, handleQueryChange, handlePageSizeChange, setParams } =
		usePaginatedTableState()

	const accounts = useLiveQuery(() => listAccounts(), []) ?? []
	const categories = useLiveQuery(() => listCategories(), []) ?? []
	const statementsQuery = useLiveQuery(
		() =>
			listStatements({
				...parseStatementFilters(searchParams),
				query: query || null,
				// The Allocator has no Allocation filter in its URL.
				is_unallocated: undefined,
				is_allocable: true,
			}),
		[query, accountId, isPending, startDate, endDate, minAmount, maxAmount],
	)
	const statements = statementsQuery ?? []
	const paginated = useMemo(
		() => paginateItems(statements, parsePage(page), parsePageSize(pageSize)),
		[statements, page, pageSize],
	)

	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const selectedKey = selectedIds.join(",")
	// The result carries the key it was read for, so a result for an older selection is never
	// mistaken for the current one while the query resubscribes.
	const selectedQuery = useLiveQuery(
		async () => ({
			key: selectedKey,
			rows: selectedKey ? await listStatements({ ids: selectedIds, is_allocable: true }) : [],
		}),
		[selectedKey],
	)
	if (selectedQuery?.key === selectedKey && selectedQuery.rows.length < selectedIds.length) {
		// Rows deleted or no longer allocable fall out of the selection.
		setSelectedIds(selectedIds.filter(id => selectedQuery.rows.some(s => s.id === id)))
	}
	// A just-ticked row is known from the table before the selection query answers; once the query
	// has answered for the current ids it wins, so changed rows show their live values.
	const known = new Map(
		[
			...(selectedQuery?.rows ?? []),
			...statements,
			...(selectedQuery?.key === selectedKey ? selectedQuery.rows : []),
		].map(s => [s.id, s]),
	)
	const selectedStatements = selectedIds.flatMap(id => known.get(id) ?? [])
	const [isCreatingRecord, setIsCreatingRecord] = useState(false)
	const [isAttachingRecord, setIsAttachingRecord] = useState(false)
	const [isReplacingPendingStatement, setIsReplacingPendingStatement] = useState(false)
	const { editingRecord, handleEdit, setEditingRecord } = useRecordEditor()
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

	const selectedAmount = selectedStatements.reduce(
		(sum, statement) => sum + statement.allocable_amount,
		0,
	)
	const firstSelected = selectedStatements[0] ?? null
	const replacementStatement =
		selectedStatements.length === 1 &&
		firstSelected &&
		!firstSelected.is_pending &&
		firstSelected.is_unallocated
			? firstSelected
			: null
	const statementColumns = useStatementColumns<Statement>({
		amount: "allocable",
		pageName: "Allocator",
		grouped: true,
	})
	const toggleStatement = (statement: Statement) =>
		setSelectedIds(prev =>
			prev.includes(statement.id)
				? prev.filter(id => id !== statement.id)
				: [...prev, statement.id],
		)
	const statementMobileRow = useStatementMobileRow<Statement>({
		amount: "allocable",
		pageName: "Allocator",
		grouped: true,
		leading: statement => (
			<Checkbox
				checked={selectedIds.includes(statement.id)}
				onCheckedChange={() => toggleStatement(statement)}
				aria-label={`Select statement ${statement.id}`}
			/>
		),
	})

	return (
		<>
			<PageContent>
				<PageHeader
					title="Workflows"
					subtitle="Allocate statements to records and replace pending statements."
					description="Allocation workspace"
					icon="lucide:link"
				/>

				<WorkflowTabs active="allocate" />

				<PaginatedDataTable
					paginated={paginated}
					columns={[
						{
							id: "select",
							meta: { width: TABLE_WIDTH_CLASSNAMES.CHECKBOX },
							cell: ({ row }) => (
								<div className="flex items-center justify-center">
									<Checkbox
										checked={selectedIds.includes(row.original.id)}
										onCheckedChange={() => toggleStatement(row.original)}
										aria-label={`Select statement ${row.original.id}`}
									/>
								</div>
							),
						},
						...statementColumns,
					]}
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
								<FilterField
									name="date"
									active={!!(startDate ?? endDate)}
									onClear={() =>
										updateFilters({ start_date: null, end_date: null })
									}
								>
									<DateRange
										id="allocator_date_range"
										value={{ start: startDate, end: endDate }}
										triggerClassName={filterControlClass(
											!!(startDate ?? endDate),
										)}
										onChange={range =>
											updateFilters({
												start_date: range.start,
												end_date: range.end,
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
						className: "gap-2",
					}}
					footer={{
						summary: `${selectedStatements.length} selected. Showing ${paginated.data.length} of ${pluralize(paginated.total, "statement")}.`,
					}}
					selectedIds={selectedIds}
					mobileRow={statementMobileRow}
					groupBy={byDay<Statement>(
						"Statement",
						statement => statement.allocable_amount,
						"Left to allocate on this page",
					)}
					onRowClick={toggleStatement}
					emptyMessage="No statements found."
					loading={statementsQuery === undefined}
				/>
			</PageContent>

			<SelectionBar
				open={selectedStatements.length > 0}
				summary={`${selectedStatements.length} selected · ${formatCurrency(selectedAmount)}`}
			>
				<RecordCreatorDialog
					statements={selectedStatements}
					categories={categories}
					isOpen={isCreatingRecord}
					setIsOpen={setIsCreatingRecord}
					trigger={
						<Button className="w-full sm:w-auto">
							<IconifyIcon icon="lucide:plus" /> Create Record
						</Button>
					}
					clear={() => setSelectedIds([])}
				/>
				<RecordSearchSheet
					title="Allocate to pending record"
					placeholder="Search pending records..."
					target={selectedAmount}
					filters={{
						start_date: defaultFilterStartDate ?? undefined,
						end_date: defaultFilterEndDateToday
							? DateTime.now().toFormat("yyyy-MM-dd")
							: undefined,
						is_allocated: false,
					}}
					isOpen={isAttachingRecord}
					setIsOpen={setIsAttachingRecord}
					handler={async record => {
						await handleEdit(record)
						setIsAttachingRecord(false)
					}}
					trigger={
						<Button className="w-full sm:w-auto">
							<IconifyIcon icon="lucide:link-2" /> Allocate to record
						</Button>
					}
				/>
				<PendingStatementConfirmationSheet
					statement={replacementStatement}
					isOpen={isReplacingPendingStatement}
					setIsOpen={setIsReplacingPendingStatement}
					onConfirmed={() => setSelectedIds([])}
					trigger={
						<Button
							disabled={!replacementStatement}
							className="w-full sm:w-auto"
							title="Select one fully unallocated imported statement"
						>
							<IconifyIcon icon="lucide:replace" /> Replace Pending
						</Button>
					}
				/>
				<Button variant="ghost" onClick={() => setSelectedIds([])}>
					Clear
				</Button>
			</SelectionBar>

			{editingRecord ? (
				<RecordEditorDialog
					record={editingRecord}
					statements={[
						...editingRecord.statements,
						...selectedStatements.filter(
							ss => !editingRecord.statements.find(es => es.id === ss.id),
						),
					]}
					categories={categories}
					isOpen={!!editingRecord}
					setIsOpen={isOpen => {
						if (!isOpen) {
							setEditingRecord(null)
							setSelectedIds([])
						}
					}}
				/>
			) : null}
		</>
	)
}
