import { Icon as IconifyIcon } from "@iconify/react"
import { router, usePage } from "@inertiajs/react"
import { useState } from "react"
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
import { START_DATE } from "@/constants"
import { useFetch } from "@/hooks/use-fetch"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { formatCurrency } from "@/lib/utils"
import { CategoryWithChildren, Paginated, Record, Statement } from "@/types"
import { allocatorWebRoute, categoryIndexApiRoute, recordShowApiRoute } from "@/wayfinder/routes"

export default function AllocatorPage({ statements }: { statements: Paginated<Statement> }) {
	const page = usePage()
	const pageUrl = new URL(page.url, "http://localhost")
	const startDate = pageUrl.searchParams.get("start_date")
	const endDate = pageUrl.searchParams.get("end_date")
	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])

	const [selectedStatements, setSelectedStatements] = useState<Statement[]>([])
	const [isCreatingRecord, setIsCreatingRecord] = useState(false)
	const [isAttachingRecord, setIsAttachingRecord] = useState(false)
	const [isReplacingPendingStatement, setIsReplacingPendingStatement] = useState(false)
	const [editingRecord, setEditingRecord] = useState<
		(Record & { statements: Statement[] }) | null
	>(null)
	const updateFilters = (changes: { [key: string]: string | null }) => {
		const url = new URL(page.url, "http://localhost")
		for (const [key, value] of Object.entries(changes)) {
			if (value) url.searchParams.set(key, value)
			else url.searchParams.delete(key)
		}
		url.searchParams.delete("page")
		router.visit(url.pathname + url.search, { preserveState: true, preserveScroll: true })
	}
	const activeFilterCount = [pageUrl.searchParams.get("query"), startDate, endDate].filter(
		Boolean,
	).length
	const clearFilters = () =>
		router.visit(
			allocatorWebRoute({
				query: { per_page: pageUrl.searchParams.get("per_page") || undefined },
			}),
			{ preserveState: true, preserveScroll: true },
		)

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query =>
			allocatorWebRoute({
				query: {
					...query,
					start_date: startDate || undefined,
					end_date: endDate || undefined,
				},
			}).url,
	})

	const selectedAmount = selectedStatements.reduce(
		(sum, statement) => sum + statement.allocable_amount,
		0,
	)
	const replacementStatement =
		selectedStatements.length === 1 &&
		!selectedStatements[0].is_pending &&
		selectedStatements[0].is_unallocated
			? selectedStatements[0]
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

				<PaginatedDataTable
					paginated={statements}
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
						summary: `${selectedStatements.length} selected. Showing ${statements.data.length} of ${statements.total} statements.`,
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
						setEditingRecord(
							await fetch(recordShowApiRoute.url({ record })).then(res => res.json()),
						)
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
