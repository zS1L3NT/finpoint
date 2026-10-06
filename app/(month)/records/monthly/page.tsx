"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useFetch } from "@/hooks/use-fetch"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { useTabTransition } from "@/hooks/use-tab-transition"
import { cn } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { getMonthlyRecords } from "@/logic/monthly"
import { pathImporter, pathRecords } from "@/routes"
import { Bucket, CategoryWithChildren, Record } from "@/types"

type Filters = {
	query?: string
	category_ids?: string
	is_allocated?: string
	bucket_id?: string
	bucket_group?: string
	show_unbucketed?: string | boolean
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
	"bucket_id",
	"bucket_group",
	"show_unbucketed",
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
	const pushParams = (next: URLSearchParams) => {
		const suffix = next.toString()
		router.push(suffix ? pathname + "?" + suffix : pathname, { scroll: false })
	}
	const setSearchParams = (init: URLSearchParams | globalThis.Record<string, string>) => {
		if (init instanceof URLSearchParams) {
			pushParams(init)
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
	const bucketId = searchParams.get("bucket_id")
	const bucketGroup = searchParams.get("bucket_group")
	const showUnbucketedParam = searchParams.get("show_unbucketed")
	const showUnbucketed = showUnbucketedParam === "1" || showUnbucketedParam === "true"
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
	const animateContent = useTabTransition()

	const filterKey = JSON.stringify([
		query,
		categoryIdsParam,
		isAllocated,
		bucketId,
		bucketGroup,
		showUnbucketedParam,
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
				bucket_id: bucketId,
				bucket_group: bucketGroup,
				show_unbucketed: showUnbucketed,
				treatment,
				start_date: startDate,
				end_date: endDate,
				min_amount: minAmount,
				max_amount: maxAmount,
			}).catch(() => null),
		[month, year, filterKey],
	)
	const categories = useFetch(() => listCategories(), [])
	const { editingRecord, handleEdit, setEditingRecord } = useRecordEditor()
	const columns = useRecordColumns<Record>({
		pageName: "Monthly Records",
		onEdit: handleEdit,
		grouped: true,
		showBucket: true,
	})
	const mobileRow = useRecordMobileRow<Record>({
		pageName: "Monthly Records",
		onEdit: handleEdit,
		grouped: true,
	})
	const records = data?.records ?? []
	const futureRecords = data?.future_records ?? []

	const filters: Filters = {}
	if (query) filters.query = query
	if (categoryIdsParam) filters.category_ids = categoryIdsParam
	if (isAllocated) filters.is_allocated = isAllocated
	if (bucketId) filters.bucket_id = bucketId
	if (bucketGroup) filters.bucket_group = bucketGroup
	if (showUnbucketedParam) filters.show_unbucketed = showUnbucketedParam
	if (treatment) filters.treatment = treatment
	if (startDate) filters.start_date = startDate
	if (endDate) filters.end_date = endDate
	if (minAmount) filters.min_amount = minAmount
	if (maxAmount) filters.max_amount = maxAmount

	const visit = (changes: Partial<Filters> = {}, nextDate = date) => {
		const merged: Partial<Filters> = { ...filters, ...changes }
		const next = new URLSearchParams(searchParams.toString())
		next.delete("day")
		next.set("month", nextDate.toFormat("MMMM"))
		next.set("year", String(nextDate.year))
		for (const key of FILTER_KEYS) {
			const value = merged[key]
			if (value === "" || value === false || value === undefined || value === null) {
				next.delete(key)
			} else {
				next.set(key, key === "show_unbucketed" && value === true ? "1" : String(value))
			}
		}
		setSearchParams(next)
	}

	const clearFilters = () => setSearchParams({ month, year: String(year) })

	if (data === undefined) {
		return (
			<div className="grid gap-5 md:gap-7">
				<div className="flex min-w-0 flex-col gap-2 md:flex-row md:flex-wrap">
					<Skeleton className="h-10 w-full md:w-sm" />
					<div className="flex gap-2">
						<Skeleton className="h-9 w-32" />
						<Skeleton className="h-9 w-32" />
						<Skeleton className="hidden h-9 w-32 sm:block" />
					</div>
				</div>

				<div className="overflow-hidden rounded-lg border bg-card">
					<div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b px-4 py-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="hidden h-4 w-24 sm:block" />
						<Skeleton className="hidden h-4 w-20 sm:block" />
						<Skeleton className="h-4 w-16" />
					</div>
					{Array.from({ length: 6 }).map((_, index) => (
						<div
							key={index}
							className="grid grid-cols-[1fr_auto] items-center gap-3 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[2fr_1fr_1fr_auto]"
						>
							<div className="grid gap-1.5">
								<Skeleton className="h-4 w-2/3" />
								<Skeleton className="h-3 w-1/3" />
							</div>
							<Skeleton className="hidden h-4 w-24 sm:block" />
							<Skeleton className="hidden h-4 w-20 sm:block" />
							<Skeleton className="h-8 w-16" />
						</div>
					))}
				</div>
			</div>
		)
	}

	if (data === null) {
		return <p className="text-sm text-muted-foreground">Monthly records not found.</p>
	}

	const { buckets, period } = data

	return (
		<>
			<div
				className={cn(
					"grid gap-5 md:gap-7",
					animateContent && "animate-in fade-in slide-in-from-bottom-2 duration-500",
				)}
			>
				<MonthlyRecordFilters
					date={date}
					categories={categories}
					buckets={buckets}
					filters={filters}
					onChange={changes => visit(changes)}
					onClear={clearFilters}
				/>

				{records.length ? (
					<section className="grid gap-4" aria-labelledby="actual-records">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div>
								<h3 id="actual-records" className="text-lg font-semibold">
									{period.is_future
										? "Future-dated Records"
										: "Recorded activity"}
								</h3>
								<p className="text-sm text-muted-foreground">
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
				) : !period.is_future ? (
					<EmptyRecords
						filtered={Object.keys(filters).length > 0}
						onClear={clearFilters}
					/>
				) : null}

				{futureRecords.length ? (
					<section className="grid gap-4">
						<div>
							<h3 className="text-lg font-semibold">Later this month</h3>
							<p className="text-sm text-muted-foreground">
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
	buckets,
	filters,
	onChange,
	onClear,
}: {
	date: DateTime
	categories: CategoryWithChildren[]
	buckets: Bucket[]
	filters: Filters
	onChange: (changes: Partial<Filters>) => void
	onClear: () => void
}) {
	const categoryIds = filters.category_ids?.split(",").filter(Boolean) ?? []
	const bucketScope = filters.show_unbucketed
		? "unbucketed"
		: filters.bucket_id
			? `bucket:${filters.bucket_id}`
			: filters.bucket_group
				? `group:${filters.bucket_group}`
				: "all"
	const [query, setQuery] = useState(filters.query ?? "")
	useEffect(() => setQuery(filters.query ?? ""), [filters.query])
	const activeFilterCount = [
		filters.query,
		categoryIds.length ? "category" : null,
		filters.is_allocated,
		bucketScope === "all" ? null : bucketScope,
		filters.treatment,
		filters.start_date ?? filters.end_date,
		filters.min_amount ?? filters.max_amount,
	].filter(Boolean).length

	const changeBucketScope = (scope: string) => {
		const changes: Partial<Filters> = {
			bucket_id: undefined,
			bucket_group: undefined,
			show_unbucketed: undefined,
		}
		if (scope === "unbucketed") changes.show_unbucketed = true
		else if (scope.startsWith("bucket:")) changes.bucket_id = scope.slice(7)
		else if (scope.startsWith("group:")) changes.bucket_group = scope.slice(6)
		onChange(changes)
	}

	return (
		<section
			className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3"
			aria-labelledby="monthly-record-filters"
		>
			<div>
				<h3 id="monthly-record-filters" className="text-sm font-medium">
					Filter this month
				</h3>
				<p className="text-xs text-muted-foreground">
					Search and narrow down this month's Records.
				</p>
			</div>
			<div className="relative w-full md:w-sm">
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
						onChange({ query: event.target.value || undefined })
					}}
				/>
			</div>
			<FilterBar className="sm:flex sm:flex-wrap">
				<CategoryFilter
					categories={categories}
					selectedIds={categoryIds}
					onChange={ids => onChange({ category_ids: ids.join(",") || undefined })}
				/>

				<Select value={bucketScope} onValueChange={changeBucketScope}>
					<SelectTrigger className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}>
						<IconifyIcon icon="lucide:wallet-cards" />
						<SelectValue />
					</SelectTrigger>
					<SelectContent align="start" variant="filter">
						<SelectGroup>
							<SelectItem value="all">Any bucket</SelectItem>
							<SelectItem value="unbucketed">No bucket</SelectItem>
						</SelectGroup>
						<SelectSeparator />
						<SelectGroup>
							<SelectLabel>Bucket groups</SelectLabel>
							<SelectItem value="group:core">Core</SelectItem>
							<SelectItem value="group:outlier">Outlier</SelectItem>
							<SelectItem value="group:other">Other</SelectItem>
						</SelectGroup>
						{buckets.length ? <SelectSeparator /> : null}
						{buckets.length ? (
							<SelectGroup>
								<SelectLabel>Specific bucket</SelectLabel>
								{buckets.map(bucket => (
									<SelectItem key={bucket.id} value={`bucket:${bucket.id}`}>
										<span
											className="size-2 rounded-full"
											style={{ backgroundColor: bucket.color }}
										/>
										{bucket.name}
									</SelectItem>
								))}
							</SelectGroup>
						) : null}
					</SelectContent>
				</Select>

				<Select
					value={filters.treatment ?? "all"}
					onValueChange={value =>
						onChange({ treatment: value === "all" ? undefined : value })
					}
				>
					<SelectTrigger className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}>
						<IconifyIcon icon="lucide:chart-no-axes-combined" />
						<SelectValue />
					</SelectTrigger>
					<SelectContent align="start" variant="filter">
						<SelectGroup>
							<SelectItem value="all">Any treatment</SelectItem>
							<SelectItem value="income">Income</SelectItem>
							<SelectItem value="spending">Spending</SelectItem>
							<SelectItem value="saving_investment">Saving / investment</SelectItem>
							<SelectItem value="neutral">Excluded</SelectItem>
							<SelectItem value="automatic">Automatic</SelectItem>
						</SelectGroup>
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

function EmptyRecords({ filtered, onClear }: { filtered: boolean; onClear: () => void }) {
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
