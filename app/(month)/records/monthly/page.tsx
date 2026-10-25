"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import DateRange from "@/components/form/date-range"
import { UiIcon as IconifyIcon } from "@/components/icon"
import AmountFilter from "@/components/table/amount-filter"
import CategoryFilter from "@/components/table/category-filter"
import DataTable from "@/components/table/data-table"
import { ClearFiltersButton, FILTER_CONTROL_CLASS, FilterBar } from "@/components/table/filter-bar"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { byDay } from "@/components/table/row-groups"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { STALE_MONTH_CLASS, useMonthTransition } from "@/hooks/use-month-transition"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { TREATMENTS } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { getMonthlyRecords } from "@/logic/monthly"
import { pathImporter, pathRecords } from "@/routes"
import type { CategoryWithChildren, MonthlyBudget, Record } from "@/types"

type Filters = {
	query?: string
	category_ids?: string
	is_allocated?: string
	monthly_budget_id?: string
	monthly_budget_group?: string
	show_unbudgeted?: string | boolean
	effective_spending?: string
	treatment?: string
	start_date?: string
	end_date?: string
	min_amount?: string
	max_amount?: string
}

const FILTER_KEYS = [
	"query",
	"category_ids",
	"is_allocated",
	"monthly_budget_id",
	"monthly_budget_group",
	"show_unbudgeted",
	"effective_spending",
	"treatment",
	"start_date",
	"end_date",
	"min_amount",
	"max_amount",
] as const

const byRecordDay = byDay<Record>("Record")

export default function MonthlyRecordsPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const pushParams = (next: URLSearchParams, replace = false) => {
		const suffix = next.toString()
		const href = suffix ? pathname + "?" + suffix : pathname
		if (replace) router.replace(href, { scroll: false })
		else router.push(href, { scroll: false })
	}
	const setSearchParams = (
		init: URLSearchParams | globalThis.Record<string, string>,
		replace = false,
	) => {
		if (init instanceof URLSearchParams) {
			pushParams(init, replace)
			return
		}
		const next = new URLSearchParams()
		for (const [key, value] of Object.entries(init)) {
			if (value !== undefined && value !== "") next.set(key, value)
		}
		pushParams(next)
	}
	const now = DateTime.now()
	const month = searchParams.get("month") ?? now.toFormat("MMMM")
	const yearParam = searchParams.get("year")
	const year =
		yearParam !== null && Number.isFinite(Number(yearParam)) ? Number(yearParam) : now.year
	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
	const query = searchParams.get("query")
	const categoryIdsParam = searchParams.get("category_ids")
	const isAllocated = searchParams.get("is_allocated")
	const monthlyBudgetId = searchParams.get("monthly_budget_id")
	const monthlyBudgetGroup = searchParams.get("monthly_budget_group")
	const showUnbudgetedParam = searchParams.get("show_unbudgeted")
	const showUnbudgeted = showUnbudgetedParam === "1" || showUnbudgetedParam === "true"
	const effectiveSpending = searchParams.get("effective_spending")
	const treatment = searchParams.get("treatment")
	const legacyDay = Number(searchParams.get("day"))
	const legacyDate =
		Number.isInteger(legacyDay) && legacyDay >= 1 && legacyDay <= (date.daysInMonth ?? 0)
			? date.set({ day: legacyDay }).toFormat("yyyy-MM-dd")
			: null
	const startDate = searchParams.get("start_date") ?? legacyDate
	const endDate = searchParams.get("end_date") ?? legacyDate
	const minAmount = searchParams.get("min_amount")
	const maxAmount = searchParams.get("max_amount")
	const contentRef = useRef<HTMLDivElement>(null)

	const filterKey = JSON.stringify([
		query,
		categoryIdsParam,
		isAllocated,
		monthlyBudgetId,
		monthlyBudgetGroup,
		showUnbudgetedParam,
		effectiveSpending,
		treatment,
		startDate,
		endDate,
		minAmount,
		maxAmount,
	])
	const data = useLiveQuery(
		() =>
			getMonthlyRecords(month, year, {
				query,
				category_ids: categoryIdsParam,
				is_allocated: isAllocated,
				monthly_budget_id: monthlyBudgetId,
				monthly_budget_group: monthlyBudgetGroup,
				show_unbudgeted: showUnbudgeted,
				effective_spending: ["1", "true"].includes(effectiveSpending ?? ""),
				treatment,
				start_date: startDate,
				end_date: endDate,
				min_amount: minAmount,
				max_amount: maxAmount,
			}).catch(() => null),
		[month, year, filterKey],
	)
	const categories = useLiveQuery(() => listCategories(), []) ?? []
	const { editingRecord, handleEdit, setEditingRecord } = useRecordEditor()
	const columns = useRecordColumns<Record>({
		pageName: "Monthly Records",
		onEdit: handleEdit,
		grouped: true,
		showMonthlyBudget: true,
	})
	const mobileRow = useRecordMobileRow<Record>({
		pageName: "Monthly Records",
		onEdit: handleEdit,
		grouped: true,
	})
	// Until the new month's query lands, the live query keeps the previous month's data.
	const dataKey = data ? `${data.month}-${data.year}` : null
	const stale = dataKey !== null && dataKey !== `${month}-${year}`
	useMonthTransition(contentRef, dataKey)
	const records = data?.records ?? []
	const futureRecords = data?.future_records ?? []

	const filters: Filters = {}
	if (query) filters.query = query
	if (categoryIdsParam) filters.category_ids = categoryIdsParam
	if (isAllocated) filters.is_allocated = isAllocated
	if (monthlyBudgetId) filters.monthly_budget_id = monthlyBudgetId
	if (monthlyBudgetGroup) filters.monthly_budget_group = monthlyBudgetGroup
	if (showUnbudgetedParam) filters.show_unbudgeted = showUnbudgetedParam
	if (["1", "true"].includes(effectiveSpending ?? "")) filters.effective_spending = "true"
	if (treatment) filters.treatment = treatment
	if (startDate) filters.start_date = startDate
	if (endDate) filters.end_date = endDate
	if (minAmount) filters.min_amount = minAmount
	if (maxAmount) filters.max_amount = maxAmount

	/** `replace` edits the current history entry, for refinements like typing in search. */
	const visit = (changes: Partial<Filters> = {}, replace = false) => {
		const merged: Partial<Filters> = { ...filters, ...changes }
		const next = new URLSearchParams(searchParams.toString())
		next.delete("day")
		next.set("month", date.toFormat("MMMM"))
		next.set("year", String(date.year))
		for (const key of FILTER_KEYS) {
			const value = merged[key]
			if (value === "" || value === false || value === undefined || value === null) {
				next.delete(key)
			} else {
				next.set(key, key === "show_unbudgeted" && value === true ? "1" : String(value))
			}
		}
		setSearchParams(next, replace)
	}

	const clearFilters = () => setSearchParams({ month, year: String(year) })

	if (data === undefined) return null

	if (data === null) {
		return <p className="text-xs text-muted-foreground">Monthly records not found.</p>
	}

	const { monthlyBudgets, period } = data

	return (
		<>
			<div
				ref={contentRef}
				aria-busy={stale}
				className={cn("reveal grid gap-5 md:gap-7", stale && STALE_MONTH_CLASS)}
			>
				<MonthlyRecordFilters
					date={date}
					categories={categories}
					monthlyBudgets={monthlyBudgets}
					filters={filters}
					onChange={visit}
					onClear={clearFilters}
				/>

				{records.length ? (
					<section className="grid gap-4" aria-labelledby="actual-records">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div>
								<h3 id="actual-records" className="text-sm font-semibold">
									{period.is_future
										? "Future-dated Records"
										: "Recorded activity"}
								</h3>
								<p className="text-xs text-muted-foreground">
									{records.length} Record
									{records.length === 1 ? "" : "s"}
								</p>
							</div>
							<Button variant="outline" size="sm" asChild>
								<Link
									href={pathRecords({
										start_date: date.startOf("month").toISODate() ?? undefined,
										end_date: date.endOf("month").toISODate() ?? undefined,
									})}
								>
									Open in Records <IconifyIcon icon="lucide:arrow-up-right" />
								</Link>
							</Button>
						</div>
						<DataTable
							data={records}
							columns={columns}
							mobileRow={mobileRow}
							groupBy={byRecordDay}
						/>
					</section>
				) : futureRecords.length ? null : (
					<EmptyRecords
						filtered={Object.keys(filters).length > 0}
						future={period.is_future}
						onClear={clearFilters}
					/>
				)}

				{futureRecords.length ? (
					<section className="grid gap-4">
						<div>
							<h3 className="text-sm font-semibold">Later this month</h3>
							<p className="text-xs text-muted-foreground">
								Excluded from actual totals.
							</p>
						</div>
						<div className="opacity-80">
							<DataTable
								data={futureRecords}
								columns={columns}
								mobileRow={mobileRow}
								groupBy={byRecordDay}
							/>
						</div>
					</section>
				) : null}
			</div>
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

function MonthlyRecordFilters({
	date,
	categories,
	monthlyBudgets,
	filters,
	onChange,
	onClear,
}: {
	date: DateTime
	categories: CategoryWithChildren[]
	monthlyBudgets: MonthlyBudget[]
	filters: Filters
	onChange: (changes: Partial<Filters>, replace?: boolean) => void
	onClear: () => void
}) {
	const categoryIds = filters.category_ids?.split(",").filter(Boolean) ?? []
	const monthlyBudgetScope =
		filters.show_unbudgeted === true ||
		filters.show_unbudgeted === "1" ||
		filters.show_unbudgeted === "true"
			? "unbudgeted"
			: filters.monthly_budget_id
				? `monthlyBudget:${filters.monthly_budget_id}`
				: filters.monthly_budget_group
					? `group:${filters.monthly_budget_group}`
					: "all"
	const [query, setQuery] = useState(filters.query ?? "")
	useEffect(() => setQuery(filters.query ?? ""), [filters.query])
	const activeFilterCount = [
		filters.query,
		categoryIds.length ? "category" : null,
		filters.is_allocated,
		monthlyBudgetScope === "all" ? null : monthlyBudgetScope,
		filters.effective_spending ?? filters.treatment,
		filters.start_date ?? filters.end_date,
		filters.min_amount ?? filters.max_amount,
	].filter(Boolean).length

	const changeMonthlyBudgetScope = (scope: string) => {
		const changes: Partial<Filters> = {
			monthly_budget_id: undefined,
			monthly_budget_group: undefined,
			show_unbudgeted: undefined,
		}
		if (scope === "unbudgeted") changes.show_unbudgeted = true
		else if (scope.startsWith("monthlyBudget:"))
			changes.monthly_budget_id = scope.slice("monthlyBudget:".length)
		else if (scope.startsWith("group:")) changes.monthly_budget_group = scope.slice(6)
		onChange(changes)
	}

	// Phones drop the card and put search beside the Filters button.
	return (
		<section
			className="flex items-center gap-2 sm:flex-col sm:items-stretch sm:gap-3 sm:rounded-lg sm:border sm:bg-muted/20 sm:p-3"
			aria-labelledby="monthly-record-filters"
		>
			<div className="max-sm:sr-only">
				<h3 id="monthly-record-filters" className="text-sm font-semibold">
					Filter this month
				</h3>
				<p className="text-xs text-muted-foreground">
					Search and narrow down this month's Records.
				</p>
			</div>
			<div className="relative w-full min-w-0 md:w-sm">
				<IconifyIcon
					icon="lucide:search"
					className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					type="search"
					aria-label="Search Records"
					className="border-border bg-input/20 pl-8 dark:bg-input/30"
					placeholder="Search title, people, location, description..."
					value={query}
					onChange={event => {
						setQuery(event.target.value)
						// The first keystroke starts a search (one Back undoes it);
						// refining it edits that entry instead of piling up history.
						onChange({ query: event.target.value || undefined }, !!filters.query)
					}}
				/>
			</div>
			<FilterBar count={activeFilterCount} className="sm:flex sm:flex-wrap">
				<CategoryFilter
					categories={categories}
					selectedIds={categoryIds}
					onChange={ids => onChange({ category_ids: ids.join(",") || undefined })}
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
						{monthlyBudgets.length ? <SelectSeparator /> : null}
						{monthlyBudgets.length ? (
							<SelectGroup>
								<SelectLabel>Specific monthly budget</SelectLabel>
								{monthlyBudgets.map(monthlyBudget => (
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
					value={
						filters.effective_spending
							? "effective_spending"
							: (filters.treatment ?? "all")
					}
					onValueChange={value =>
						onChange({
							treatment:
								value === "all" || value === "effective_spending"
									? undefined
									: value,
							effective_spending: value === "effective_spending" ? "true" : undefined,
						})
					}
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
						{/* Only set by the Overview's links, so the list matches the total clicked. */}
						<SelectSeparator />
						<SelectItem value="effective_spending" disabled>
							Counted as spending
						</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={filters.is_allocated ?? "all"}
					onValueChange={value =>
						onChange({ is_allocated: value === "all" ? undefined : value })
					}
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
					id="monthly_records_date_range"
					value={{
						start: filters.start_date ?? null,
						end: filters.end_date ?? null,
					}}
					minimum={date.startOf("month").toFormat("yyyy-MM-dd")}
					maximum={date.endOf("month").toFormat("yyyy-MM-dd")}
					className="sm:w-40"
					triggerClassName={FILTER_CONTROL_CLASS}
					onChange={value =>
						onChange({
							start_date: value.start ?? undefined,
							end_date: value.end ?? undefined,
						})
					}
				/>
				<AmountFilter
					value={{ min: filters.min_amount ?? null, max: filters.max_amount ?? null }}
					onChange={value =>
						onChange({
							min_amount: value.min ?? undefined,
							max_amount: value.max ?? undefined,
						})
					}
				/>
				<ClearFiltersButton count={activeFilterCount} onClear={onClear} />
			</FilterBar>
		</section>
	)
}

function EmptyRecords({
	filtered,
	future,
	onClear,
}: {
	filtered: boolean
	future: boolean
	onClear: () => void
}) {
	if (filtered) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No matching Records</CardTitle>
					<CardDescription>Try changing or clearing the current filters.</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant="outline" onClick={onClear}>
						Clear filters
					</Button>
				</CardContent>
			</Card>
		)
	}

	if (future) {
		// Same framing as the Overview tab for a month that has not started.
		return (
			<Card>
				<CardHeader>
					<CardTitle>Future-dated Records</CardTitle>
					<CardDescription>
						No Records have been entered for this month. Actual results and comparisons
						begin when the month starts.
					</CardDescription>
				</CardHeader>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>No Records for this month</CardTitle>
				<CardDescription>
					This does not confirm zero spending; import coverage may be incomplete.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button variant="outline" asChild>
					<Link href={pathImporter()}>Import Statements</Link>
				</Button>
			</CardContent>
		</Card>
	)
}
