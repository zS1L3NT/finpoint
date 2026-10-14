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
import { ClearFiltersButton, FILTER_CONTROL_CLASS, FilterBar } from "@/components/table/filter-bar"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { byDay } from "@/components/table/row-groups"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { TREATMENTS } from "@/lib/analytics"
import { cn, pluralize } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { listRecords } from "@/logic/records"
import type { CategoryWithChildren, MonthlyBudget, Record } from "@/types"

export default function RecordsPage() {
	const searchParams = useSearchParams()
	const startDate = searchParams.get("start_date")
	const endDate = searchParams.get("end_date")
	const minAmount = searchParams.get("min_amount")
	const maxAmount = searchParams.get("max_amount")
	const isAllocated = searchParams.get("is_allocated")
	const monthlyBudgetId = searchParams.get("monthly_budget_id")
	const monthlyBudgetGroup = searchParams.get("monthly_budget_group")
	const showUnbudgeted = ["1", "true"].includes(searchParams.get("show_unbudgeted") ?? "")
	const treatment = searchParams.get("treatment")
	const categoryIdsParam = searchParams.get("category_ids") ?? ""
	const categoryIds = useMemo(
		() => categoryIdsParam.split(",").filter(Boolean),
		[categoryIdsParam],
	)

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
				monthly_budget_group: null,
				show_unbudgeted: null,
				treatment: null,
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
		monthlyBudgetId ?? monthlyBudgetGroup ?? (showUnbudgeted ? "unbudgeted" : null),
		treatment,
	].filter(Boolean).length

	const recordsQuery = useLiveQuery(
		() =>
			listRecords({
				query: query || null,
				start_date: startDate,
				end_date: endDate,
				min_amount: minAmount,
				max_amount: maxAmount,
				is_allocated: isAllocated,
				category_ids: categoryIds.length ? categoryIds : null,
				monthly_budget_id: monthlyBudgetId,
				monthly_budget_group: monthlyBudgetGroup,
				show_unbudgeted: showUnbudgeted,
				treatment,
			}),
		[
			query,
			startDate,
			endDate,
			minAmount,
			maxAmount,
			isAllocated,
			categoryIdsParam,
			monthlyBudgetId,
			monthlyBudgetGroup,
			showUnbudgeted,
			treatment,
		],
	)
	const records = recordsQuery ?? []
	const paginated = useMemo(
		() => paginateItems(records, parsePage(page), parsePageSize(pageSize)),
		[records, page, pageSize],
	)
	const columns = useRecordColumns<Record>({
		pageName: "Records",
		onEdit: handleEdit,
		grouped: true,
	})
	const mobileRow = useRecordMobileRow<Record>({
		pageName: "Records",
		onEdit: handleEdit,
		grouped: true,
	})
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
					monthlyBudgetGroup={monthlyBudgetGroup}
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
			monthlyBudgetGroup,
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
	monthlyBudgetGroup,
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
	monthlyBudgetGroup: string | null
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
			: monthlyBudgetGroup
				? `group:${monthlyBudgetGroup}`
				: "all"
	const activeMonthlyBudgets = monthlyBudgets.filter(monthlyBudget => !monthlyBudget.archived)

	const changeMonthlyBudgetScope = (scope: string) => {
		const changes: { [key: string]: string | null } = {
			monthly_budget_id: null,
			monthly_budget_group: null,
			show_unbudgeted: null,
		}

		if (scope === "unbudgeted") changes.show_unbudgeted = "1"
		else if (scope.startsWith("monthlyBudget:"))
			changes.monthly_budget_id = scope.slice("monthlyBudget:".length)
		else if (scope.startsWith("group:")) changes.monthly_budget_group = scope.slice(6)

		onChange(changes)
	}

	return (
		<FilterBar className="sm:flex sm:flex-wrap">
			<CategoryFilter
				categories={categories}
				selectedIds={categoryIds}
				onChange={ids => onChange({ category_ids: ids.join(",") || null })}
			/>

			<Select value={monthlyBudgetScope} onValueChange={changeMonthlyBudgetScope}>
				<SelectTrigger className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}>
					<IconifyIcon icon="lucide:wallet-cards" />
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="start" variant="filter">
					<SelectGroup>
						<SelectItem value="all">Any monthly budget</SelectItem>
						<SelectItem value="unbudgeted">Unbudgeted</SelectItem>
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup>
						<SelectLabel>Monthly budget groups</SelectLabel>
						<SelectItem value="group:core">Core</SelectItem>
						<SelectItem value="group:outlier">Outlier</SelectItem>
						<SelectItem value="group:other">Other</SelectItem>
					</SelectGroup>
					{activeMonthlyBudgets.length ? <SelectSeparator /> : null}
					{activeMonthlyBudgets.length ? (
						<SelectGroup>
							<SelectLabel>Specific monthly budget</SelectLabel>
							{activeMonthlyBudgets.map(monthlyBudget => (
								<SelectItem
									key={monthlyBudget.id}
									value={`monthlyBudget:${monthlyBudget.id}`}
								>
									<span
										className="size-2 rounded-full"
										style={{ backgroundColor: monthlyBudget.color }}
									/>
									{monthlyBudget.name}
								</SelectItem>
							))}
						</SelectGroup>
					) : null}
				</SelectContent>
			</Select>

			<Select
				value={treatment ?? "all"}
				onValueChange={value => onChange({ treatment: value === "all" ? null : value })}
			>
				<SelectTrigger className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}>
					<IconifyIcon icon="lucide:chart-no-axes-combined" />
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="start" variant="filter">
					<SelectGroup>
						<SelectItem value="all">Any treatment</SelectItem>
						{TREATMENTS.map(item => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>

			<Select
				value={isAllocated ?? "all"}
				onValueChange={value => onChange({ is_allocated: value === "all" ? null : value })}
			>
				<SelectTrigger className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}>
					<IconifyIcon icon="lucide:circle-check-big" />
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="start" variant="filter">
					<SelectGroup>
						<SelectItem value="all">Any status</SelectItem>
						<SelectItem value="true">Complete</SelectItem>
						<SelectItem value="false">Pending</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>

			<DateRange
				id="records_date_range"
				value={{ start: startDate, end: endDate }}
				className="sm:w-40"
				triggerClassName={FILTER_CONTROL_CLASS}
				onChange={value => onChange({ start_date: value.start, end_date: value.end })}
			/>

			<AmountFilter
				value={{ min: minAmount, max: maxAmount }}
				onChange={value => onChange({ min_amount: value.min, max_amount: value.max })}
			/>

			<ClearFiltersButton count={activeFilterCount} onClear={onClear} />
		</FilterBar>
	)
}
