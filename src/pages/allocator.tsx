import { Icon as IconifyIcon } from "@iconify/react"
import { useLiveQuery } from "dexie-react-hooks"
import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import AllocatorTabs from "@/components/allocator-tabs"
import RecordCreatorDialog from "@/components/dialogs/record-creator"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import DateField from "@/components/form/date-field"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import SelectionBar from "@/components/selection-bar"
import PendingStatementConfirmationSheet from "@/components/sheets/pending-statement-confirmation"
import RecordSearchSheet from "@/components/sheets/record-search"
import { ClearFiltersButton, FILTER_CONTROL_CLASS, FilterBar } from "@/components/table/filter-bar"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useStatementColumns, useStatementMobileRow } from "@/components/table/statement-columns"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { START_DATE } from "@/constants"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { cn, formatCurrency } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import { listCategories } from "@/logic/categories"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { getRecord } from "@/logic/records"
import { listStatements } from "@/logic/statements"
import { CategoryWithChildren, Record, Statement } from "@/types"

export default function AllocatorPage() {
	const [searchParams] = useSearchParams()
	const accountId = searchParams.get("account_id") ?? "all"
	const startDate = searchParams.get("start_date")
	const endDate = searchParams.get("end_date")

	const { query, page, pageSize, handleQueryChange, handlePageSizeChange, setParams } =
		usePaginatedTableState()

	const accounts = useLiveQuery(() => listAccounts(), []) ?? []
	const categories =
		useLiveQuery(() => listCategories() as unknown as Promise<CategoryWithChildren[]>, []) ?? []
	const statements =
		useLiveQuery(
			() =>
				listStatements({
					query: query || null,
					account_id: accountId === "all" ? null : accountId,
					start_date: startDate,
					end_date: endDate,
					is_allocable: "true",
				}),
			[query, accountId, startDate, endDate],
		) ?? []
	const paginated = useMemo(
		() => paginateItems(statements, parsePage(page), parsePageSize(pageSize)),
		[statements, page, pageSize],
	)

	const [selectedStatements, setSelectedStatements] = useState<Statement[]>([])
	const [isCreatingRecord, setIsCreatingRecord] = useState(false)
	const [isAttachingRecord, setIsAttachingRecord] = useState(false)
	const [isReplacingPendingStatement, setIsReplacingPendingStatement] = useState(false)
	const [editingRecord, setEditingRecord] = useState<
		(Record & { statements: Statement[] }) | null
	>(null)
	const updateFilters = (changes: { [key: string]: string | null }) => {
		setParams({ ...changes, page: null })
	}
	const activeFilterCount = [
		searchParams.get("query"),
		accountId === "all" ? "" : accountId,
		startDate,
		endDate,
	].filter(Boolean).length
	const clearFilters = () =>
		setParams({
			query: null,
			account_id: null,
			start_date: null,
			end_date: null,
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
	})
	const statementMobileRow = useStatementMobileRow<Statement>({
		amount: "allocable",
		pageName: "Allocator",
		leading: statement => (
			<Checkbox
				checked={!!selectedStatements.find(s => s.id === statement.id)}
				onCheckedChange={value =>
					setSelectedStatements(prev =>
						value ? [...prev, statement] : prev.filter(s => s.id !== statement.id),
					)
				}
				aria-label={`Select statement ${statement.id}`}
			/>
		),
	})

	return (
		<>
			<AppHeader title="Allocator" />

			<PageContent>
				<PageHeader
					title="Allocator"
					subtitle="Allocate statements to records and replace handwritten pending statements."
					description="Allocation workspace"
					icon="lucide:link"
				/>

				<AllocatorTabs active="allocate" />

				<PaginatedDataTable
					paginated={paginated}
					columns={[
						{
							id: "select",
							meta: { width: TABLE_WIDTH_CLASSNAMES.CHECKBOX },
							cell: ({ row }) => (
								<div className="flex items-center justify-center">
									<Checkbox
										checked={
											!!selectedStatements.find(s => s.id === row.original.id)
										}
										onCheckedChange={value =>
											setSelectedStatements(prev =>
												value
													? [...prev, row.original]
													: prev.filter(s => s.id !== row.original.id),
											)
										}
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
						searchPlaceholder: "Search unallocated statements...",
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
								<DateField
									id="allocator_start_date"
									value={startDate ?? ""}
									className="min-w-0 sm:w-40"
									triggerClassName={FILTER_CONTROL_CLASS}
									placeholder="Start date"
									onChange={date => updateFilters({ start_date: date || null })}
								/>

								<DateField
									id="allocator_end_date"
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
					}}
					footer={{
						summary: `${selectedStatements.length} selected. Showing ${paginated.data.length} of ${paginated.total} statements.`,
					}}
					selectedIds={selectedStatements.map(s => s.id)}
					mobileRow={statementMobileRow}
					emptyMessage="No statements found."
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
					clear={() => setSelectedStatements([])}
				/>
				<RecordSearchSheet
					title="Attach to pending record"
					placeholder="Search pending records..."
					filters={{ start_date: START_DATE, is_allocated: "false" }}
					isOpen={isAttachingRecord}
					setIsOpen={setIsAttachingRecord}
					handler={async record => {
						const data = await getRecord(record.id)
						setEditingRecord(data as unknown as Record & { statements: Statement[] })
						setIsAttachingRecord(false)
					}}
					trigger={
						<Button className="w-full sm:w-auto">
							<IconifyIcon icon="lucide:link-2" /> Attach to Record
						</Button>
					}
				/>
				<PendingStatementConfirmationSheet
					statement={replacementStatement}
					isOpen={isReplacingPendingStatement}
					setIsOpen={setIsReplacingPendingStatement}
					onConfirmed={() => setSelectedStatements([])}
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
				<Button variant="ghost" onClick={() => setSelectedStatements([])}>
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
							setSelectedStatements([])
						}
					}}
				/>
			) : null}
		</>
	)
}
