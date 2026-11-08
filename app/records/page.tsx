"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
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
	FILTER_CONTROL_CLASS,
	FilterBar,
	FilterField,
	filterControlClass,
} from "@/components/table/filter-bar"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { byDay } from "@/components/table/row-groups"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { MonthPicker } from "@/components/ui/monthpicker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useMonthParams } from "@/hooks/use-month-params"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { TREATMENTS } from "@/lib/analytics"
import { themeColor } from "@/lib/palette"
import { cn, pluralize } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { listRecords } from "@/logic/records"
import type { CategoryWithChildren, MonthlyBudget, Record } from "@/types"

export default function RecordsPage() {
	const searchParams = useSearchParams()
	const { month, year, date } = useMonthParams()
	const selectedDay = searchParams.get("day")
	const selectedMonth = searchParams.get("month")
	const selectedYear = searchParams.get("year")
	const sort = searchParams.get("sort") ?? "date"
	const startDate = searchParams.get("start_date")
	const endDate = searchParams.get("end_date")
	const minAmount = searchParams.get("min_amount")
	const maxAmount = searchParams.get("max_amount")
	const isAllocated = searchParams.get("is_allocated")
	const monthlyBudgetId = searchParams.get("monthly_budget_id")
	const showUnbudgeted = ["1", "true"].includes(searchParams.get("show_unbudgeted") ?? "")
	const treatment = searchParams.get("treatment")
	const measure = searchParams.get("measure")
	const effectiveSpending = searchParams.get("effective_spending") === "true"
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
				day: null,
				start_date: null,
				end_date: null,
				min_amount: null,
				max_amount: null,
				is_allocated: null,
				category_ids: null,
				monthly_budget_id: null,
				show_unbudgeted: null,
				treatment: null,
				measure: null,
				effective_spending: null,
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
	].filter(Boolean).length

	const recordsQuery = useLiveQuery(
		() =>
			listRecords({
				day: selectedDay,
				month: selectedMonth,
				year: selectedYear,
				sort,
				query: query || null,
				measure,
				effective_spending: effectiveSpending,
				start_date: startDate,
				end_date: endDate,
				min_amount: minAmount,
				max_amount: maxAmount,
				is_allocated: isAllocated,
				category_ids: categoryIds.length ? categoryIds : null,
				monthly_budget_id: monthlyBudgetId,
				show_unbudgeted: showUnbudgeted,
				treatment,
			}),
		[
			selectedDay,
			selectedMonth,
			selectedYear,
			sort,
			query,
			measure,
			effectiveSpending,
			startDate,
			endDate,
			minAmount,
			maxAmount,
			isAllocated,
			categoryIdsParam,
			monthlyBudgetId,
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
		grouped: sort === "date",
	})
	const mobileRow = useRecordMobileRow<Record>({
		pageName: "Records",
		onEdit: handleEdit,
		grouped: sort === "date",
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
					sort={sort}
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
			sort,
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

	const changeMonth = (next: DateTime) =>
		setParams({
			month: next.toFormat("MMMM"),
			year: String(next.year),
			day: null,
			start_date: null,
			end_date: null,
			page: null,
		})

	if (recordsQuery === undefined) return null

	return (
		<>
			<PageContent>
				<PageHeader
					title="Records"
					subtitle={
						selectedMonth
							? `Records for ${month} ${year}.`
							: "Browse and manage your financial records. Choose a month to narrow the list."
					}
					description="Ledger view"
					icon="lucide:receipt-text"
					actions={
						<ButtonGroup className="w-full sm:w-fit">
							<Button
								variant="outline"
								aria-label="Previous month"
								onClick={() => changeMonth(date.minus({ month: 1 }))}
							>
								<IconifyIcon icon="lucide:arrow-left" />
							</Button>
							<Popover>
								<PopoverTrigger
									render={<Button variant="outline" className="flex-1 sm:w-32" />}
								>
									<IconifyIcon icon="lucide:calendar" />
									{selectedMonth ? date.toFormat("MMM yyyy") : "All months"}
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<MonthPicker
										selectedMonth={date.toJSDate()}
										onMonthSelect={value =>
											changeMonth(DateTime.fromJSDate(value))
										}
									/>
								</PopoverContent>
							</Popover>
							<Button
								variant="outline"
								aria-label="Next month"
								onClick={() => changeMonth(date.plus({ month: 1 }))}
							>
								<IconifyIcon icon="lucide:arrow-right" />
							</Button>
						</ButtonGroup>
					}
				/>

				<PaginatedDataTable
					paginated={paginated}
					columns={columns}
					header={tableHeader}
					footer={tableFooter}
					mobileRow={mobileRow}
					groupBy={sort === "date" ? byDay<Record>("Record") : undefined}
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
	sort,
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
	sort: string
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
	const activeMonthlyBudgets = monthlyBudgets.filter(monthlyBudget => !monthlyBudget.archived)

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
			<Select
				value={sort}
				onValueChange={value => onChange({ sort: value === "date" ? null : value })}
			>
				<SelectTrigger
					aria-label="Sort Records"
					className={cn("w-full h-9", FILTER_CONTROL_CLASS)}
				>
					<IconifyIcon icon="lucide:arrow-up-down" />
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="date">Newest first</SelectItem>
					<SelectItem value="amount_desc">Amount: largest first</SelectItem>
					<SelectItem value="amount_asc">Amount: smallest first</SelectItem>
				</SelectContent>
			</Select>
			<CategoryFilter
				categories={categories}
				selectedIds={categoryIds}
				onChange={ids => onChange({ category_ids: ids.join(",") || null })}
			/>

			<FilterField
				name="budget"
				active={monthlyBudgetScope !== "all"}
				onClear={() => changeMonthlyBudgetScope("all")}
			>
				<Select value={monthlyBudgetScope} onValueChange={changeMonthlyBudgetScope}>
					<SelectTrigger
						className={cn("w-full", filterControlClass(monthlyBudgetScope !== "all"))}
					>
						<IconifyIcon icon="lucide:wallet-cards" />
						<SelectValue />
					</SelectTrigger>
					<SelectContent align="start" variant="filter">
						<SelectGroup>
							<SelectItem value="all">
								<span className="size-2 rounded-full bg-foreground" />
								All budgets
							</SelectItem>
							{activeMonthlyBudgets.map(monthlyBudget => (
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

			<FilterField
				name="treatment"
				active={!!treatment}
				onClear={() => onChange({ treatment: null })}
			>
				<Select
					value={treatment ?? "all"}
					onValueChange={value => onChange({ treatment: value === "all" ? null : value })}
				>
					<SelectTrigger className={cn("w-full", filterControlClass(!!treatment))}>
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
			</FilterField>

			<FilterField
				name="status"
				active={!!isAllocated}
				onClear={() => onChange({ is_allocated: null })}
			>
				<Select
					value={isAllocated ?? "all"}
					onValueChange={value =>
						onChange({ is_allocated: value === "all" ? null : value })
					}
				>
					<SelectTrigger className={cn("w-full", filterControlClass(!!isAllocated))}>
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
			</FilterField>

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
