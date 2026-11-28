"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import RecordCreatorDialog from "@/components/dialogs/record-creator"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import DateRange from "@/components/form/date-range"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import AmountFilter from "@/components/table/amount-filter"
import CategoryFilter from "@/components/table/category-filter"
import {
	ClearFiltersButton,
	FilterBar,
	FilterField,
	FilterSelect,
	filterControlClass,
} from "@/components/table/filter-bar"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { byDay } from "@/components/table/row-groups"
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
import { useRecordEditor } from "@/hooks/use-record-editor"
import { TREATMENTS } from "@/lib/analytics"
import { themeColor } from "@/lib/palette"
import { cn, pluralize, selectableMonthlyBudgets } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { listRecords, parseRecordFilters } from "@/logic/records"
import type { CategoryWithChildren, MonthlyBudget, Record } from "@/types"

export default function RecordsPage() {
	const searchParams = useSearchParams()
	const startDate = searchParams.get("start_date")
	const endDate = searchParams.get("end_date")
	const minAmount = searchParams.get("min_amount")
	const maxAmount = searchParams.get("max_amount")
	const isAllocated = searchParams.get("is_allocated")
	const monthlyBudgetId = searchParams.get("monthly_budget_id")
	const treatment = searchParams.get("treatment")
	const categoryIdsParam = searchParams.get("category_ids") ?? ""
	const filters = parseRecordFilters(searchParams)
	const showUnbudgeted = !!filters.show_unbudgeted
	const categoryIds = filters.category_ids ?? []

	const categories = useLiveQuery(() => listCategories(), []) ?? []
	const monthlyBudgets = useLiveQuery(() => listMonthlyBudgets(), []) ?? []
	const { editingRecord, handleEdit, setEditingRecord } = useRecordEditor()
	const { query, page, pageSize, handleQueryChange, handlePageSizeChange, setParams } =
		usePaginatedTableState()
	const updateFilters = useCallback(
		(changes: { [key: string]: string | null }) => {
			setParams({ ...changes, page: null })
		},
		[setParams],
	)
	const clearFilters = useCallback(
		() =>
			setParams({
				query: null,
				start_date: null,
				end_date: null,
				min_amount: null,
				max_amount: null,
				is_allocated: null,
				category_ids: null,
				monthly_budget_id: null,
				show_unbudgeted: null,
				treatment: null,
				effective_income: null,
				effective_spending: null,
				effective_contributions: null,
				effective_withdrawals: null,
				page: null,
			}),
		[setParams],
	)
	const activeFilterCount = [
		searchParams.get("query"),
		startDate ?? endDate,
		minAmount ?? maxAmount,
		isAllocated,
		categoryIds.length ? "categories" : null,
		monthlyBudgetId ?? (showUnbudgeted ? "unbudgeted" : null),
		treatment,
		filters.effective_income ? "income" : null,
		filters.effective_spending ? "spending" : null,
		filters.effective_contributions ? "contributions" : null,
		filters.effective_withdrawals ? "withdrawals" : null,
	].filter(Boolean).length

	const recordsQuery = useLiveQuery(
		() => listRecords({ ...filters, query: query || null }),
		[
			query,
			startDate,
			endDate,
			minAmount,
			maxAmount,
			isAllocated,
			categoryIdsParam,
			monthlyBudgetId,
			showUnbudgeted,
			treatment,
			filters.effective_income,
			filters.effective_spending,
			filters.effective_contributions,
			filters.effective_withdrawals,
		],
	)
	const records = recordsQuery ?? []
	const paginated = useMemo(
		() => paginateItems(records, parsePage(page), parsePageSize(pageSize)),
		[records, page, pageSize],
	)
	const columns = useRecordColumns<Record>({ onOpen: handleEdit, grouped: true })
	const mobileRow = useRecordMobileRow<Record>({ onOpen: handleEdit, grouped: true })
	const tableHeader = useMemo(
		() => ({
			query,
			onQueryChange: handleQueryChange,
			pageSize,
			onPageSizeChange: handlePageSizeChange,
			searchPlaceholder: "Search title, people, location, description...",
			filters: (
				<RecordFilters
					categories={categories}
					categoryIds={categoryIds}
					monthlyBudgets={monthlyBudgets}
					startDate={startDate}
					endDate={endDate}
					minAmount={minAmount}
					maxAmount={maxAmount}
					isAllocated={isAllocated}
					monthlyBudgetId={monthlyBudgetId}
					showUnbudgeted={showUnbudgeted}
					treatment={treatment}
					activeFilterCount={activeFilterCount}
					onChange={updateFilters}
					onClear={clearFilters}
				/>
			),
			actions: <RecordCreatorHost categories={categories} />,
		}),
		[
			query,
			handleQueryChange,
			pageSize,
			handlePageSizeChange,
			categories,
			categoryIds,
			monthlyBudgets,
			startDate,
			endDate,
			minAmount,
			maxAmount,
			isAllocated,
			monthlyBudgetId,
			showUnbudgeted,
			treatment,
			activeFilterCount,
			updateFilters,
			clearFilters,
		],
	)
	const tableFooter = useMemo(
		() => ({
			summary: `Showing ${paginated.data.length} of ${pluralize(paginated.total, "record")}.`,
		}),
		[paginated],
	)

	if (recordsQuery === undefined) return null

	return (
		<>
			<PageContent>
				<PageHeader
					title="Records"
					subtitle="Browse and manage your financial records."
					description="Ledger view"
					icon="lucide:receipt-text"
				/>
				<PaginatedDataTable
					paginated={paginated}
					columns={columns}
					header={tableHeader}
					footer={tableFooter}
					mobileRow={mobileRow}
					groupBy={byDay<Record>("Record")}
					onRowClick={handleEdit}
					emptyMessage="No records found."
					loading={recordsQuery === undefined}
				/>
			</PageContent>

			{editingRecord ? (
				<RecordEditorDialog
					record={editingRecord}
					statements={editingRecord.statements}
					categories={categories}
					isOpen
					setIsOpen={isOpen => {
						if (!isOpen) setEditingRecord(null)
					}}
				/>
			) : null}
		</>
	)
}

function RecordCreatorHost({ categories }: { categories: CategoryWithChildren[] }) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<RecordCreatorDialog
			statements={[]}
			categories={categories}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			trigger={
				<Button className="w-full sm:w-auto">
					<IconifyIcon icon="lucide:plus" /> Create Pending Record
				</Button>
			}
		/>
	)
}

function RecordFilters({
	categories,
	categoryIds,
	monthlyBudgets,
	startDate,
	endDate,
	minAmount,
	maxAmount,
	isAllocated,
	monthlyBudgetId,
	showUnbudgeted,
	treatment,
	activeFilterCount,
	onChange,
	onClear,
}: {
	categories: CategoryWithChildren[]
	categoryIds: string[]
	monthlyBudgets: MonthlyBudget[]
	startDate: string | null
	endDate: string | null
	minAmount: string | null
	maxAmount: string | null
	isAllocated: string | null
	monthlyBudgetId: string | null
	showUnbudgeted: boolean
	treatment: string | null
	activeFilterCount: number
	onChange: (changes: { [key: string]: string | null }) => void
	onClear: () => void
}) {
	const monthlyBudgetScope = showUnbudgeted
		? "unbudgeted"
		: monthlyBudgetId
			? `monthlyBudget:${monthlyBudgetId}`
			: "all"
	const shownMonthlyBudgets = selectableMonthlyBudgets(monthlyBudgets, monthlyBudgetId)

	const changeMonthlyBudgetScope = (scope: string) => {
		const changes: { [key: string]: string | null } = {
			monthly_budget_id: null,
			show_unbudgeted: null,
		}

		if (scope === "unbudgeted") changes.show_unbudgeted = "1"
		else if (scope.startsWith("monthlyBudget:"))
			changes.monthly_budget_id = scope.slice("monthlyBudget:".length)

		onChange(changes)
	}

	return (
		<FilterBar>
			<CategoryFilter
				categories={categories}
				selectedIds={categoryIds}
				onChange={ids => onChange({ category_ids: ids.join(",") || null })}
			/>

			<FilterField
				name="monthly budget"
				active={monthlyBudgetScope !== "all"}
				onClear={() => changeMonthlyBudgetScope("all")}
			>
				<Select value={monthlyBudgetScope} onValueChange={changeMonthlyBudgetScope}>
					<SelectTrigger
						className={cn("w-full", filterControlClass(monthlyBudgetScope !== "all"))}
					>
						<IconifyIcon icon="lucide:wallet-cards" />
						<SelectValue className="flex-1 text-left" />
					</SelectTrigger>
					<SelectContent align="start" variant="filter">
						<SelectGroup>
							<SelectItem value="all">
								<span className="size-2 rounded-full bg-foreground" />
								All budgets
							</SelectItem>
							{shownMonthlyBudgets.map(monthlyBudget => (
								<SelectItem
									key={monthlyBudget.id}
									value={`monthlyBudget:${monthlyBudget.id}`}
								>
									<span
										className="size-2 rounded-full"
										style={{ backgroundColor: themeColor(monthlyBudget.color) }}
									/>
									{monthlyBudget.name}
								</SelectItem>
							))}
							<SelectItem value="unbudgeted">
								<span className="size-2 rounded-full bg-muted-foreground" />
								Unbudgeted
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</FilterField>

			<FilterSelect
				name="treatment"
				icon="lucide:chart-no-axes-combined"
				value={treatment}
				onValueChange={value => onChange({ treatment: value })}
			>
				<SelectItem value="all">Any treatment</SelectItem>
				{TREATMENTS.map(item => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</FilterSelect>

			<FilterSelect
				name="status"
				icon="lucide:circle-check-big"
				value={isAllocated}
				onValueChange={value => onChange({ is_allocated: value })}
			>
				<SelectItem value="all">Any status</SelectItem>
				<SelectItem value="true">Complete</SelectItem>
				<SelectItem value="false">Pending</SelectItem>
			</FilterSelect>

			<FilterField
				name="date"
				active={!!(startDate ?? endDate)}
				onClear={() => onChange({ start_date: null, end_date: null })}
			>
				<DateRange
					id="records_date_range"
					value={{ start: startDate, end: endDate }}
					triggerClassName={filterControlClass(!!(startDate ?? endDate))}
					onChange={value => onChange({ start_date: value.start, end_date: value.end })}
				/>
			</FilterField>

			<AmountFilter
				value={{ min: minAmount, max: maxAmount }}
				onChange={value => onChange({ min_amount: value.min, max_amount: value.max })}
			/>

			<ClearFiltersButton count={activeFilterCount} onClear={onClear} />
		</FilterBar>
	)
}
