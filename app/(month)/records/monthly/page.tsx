"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import DateRange from "@/components/form/date-range"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import { Metric, MetricGrid } from "@/components/metric"
import SelectionBar from "@/components/selection-bar"
import AmountFilter from "@/components/table/amount-filter"
import CategoryFilter from "@/components/table/category-filter"
import { ClearFiltersButton, FILTER_CONTROL_CLASS, FilterBar } from "@/components/table/filter-bar"
import { formatRowTime, PendingBadge, RecordAmountCell } from "@/components/table/record-columns"
import { dayLabel, isInteractiveTarget } from "@/components/table/row-groups"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useHistory } from "@/history"
import { useFetch } from "@/hooks/use-fetch"
import { useTabTransition } from "@/hooks/use-tab-transition"
import { treatmentLabel } from "@/lib/analytics"
import { cn, formatCurrency } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { getMonthlyRecords } from "@/logic/monthly"
import { ConflictError, getRecord, updateRecordBuckets } from "@/logic/records"
import { ValidationError } from "@/logic/validate"
import { pathImporter, pathRecord, pathRecords } from "@/routes"
import {
	Allocation,
	AnalyticsSummary,
	Bucket,
	CategoryWithChildren,
	Record,
	Statement,
} from "@/types"

type EditableRecord = Record & { statements: (Statement & { pivot?: Allocation })[] }

type Filters = {
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
	const [selected, setSelected] = useState<string[]>([])
	const [destination, setDestination] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const [editingRecord, setEditingRecord] = useState<EditableRecord | null>(null)
	const [loadingRecordId, setLoadingRecordId] = useState<string | null>(null)
	const records = useMemo(() => data?.records ?? [], [data])
	const futureRecords = useMemo(() => data?.future_records ?? [], [data])
	const actualGroups = useMemo(() => groupRecords(records), [records])
	const futureGroups = useMemo(() => groupRecords(futureRecords), [futureRecords])
	const selectedRecords = records.filter(record => selected.includes(record.id))
	const ineligible = selectedRecords.filter(record => !canUseBucket(record))

	useEffect(() => {
		setSelected(current => current.filter(id => records.some(record => record.id === id)))
	}, [records])

	const filters: Filters = {}
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
		for (const key of [
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
		] as const) {
			const value = merged[key]
			if (value === "" || value === false || value === undefined || value === null) {
				next.delete(key)
			} else {
				next.set(key, key === "show_unbucketed" && value === true ? "1" : String(value))
			}
		}
		setSearchParams(next)
	}

	const assign = async (targetBucketId: string | null) => {
		if (!selectedRecords.length) return
		setSubmitting(true)
		try {
			await updateRecordBuckets(
				selectedRecords.map(record => ({ id: record.id, revision: record.revision })),
				targetBucketId,
			)
			toast.success(
				`${selectedRecords.length} Record${selectedRecords.length === 1 ? "" : "s"} updated.`,
			)
			setSelected([])
		} catch (cause) {
			if (cause instanceof ValidationError || cause instanceof ConflictError) {
				toast.error(cause.message)
			} else {
				toast.error("Unable to update the selected Records.")
			}
		} finally {
			setSubmitting(false)
		}
	}

	const clearFilters = () => setSearchParams({ month, year: String(year) })
	const toggleAll = (checked: boolean) =>
		setSelected(checked ? records.map(record => record.id) : [])
	const editRecord = async (record: Record) => {
		setLoadingRecordId(record.id)
		try {
			const detail = await getRecord(record.id)
			setEditingRecord(detail as unknown as EditableRecord)
		} catch {
			toast.error("Unable to open this Record for editing.")
		} finally {
			setLoadingRecordId(null)
		}
	}

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

	const { summary, buckets, period } = data

	return (
		<>
			<div
				className={cn(
					"grid gap-5 md:gap-7",
					animateContent && "animate-in fade-in slide-in-from-bottom-2 duration-500",
				)}
			>
				{!period.is_future && records.length ? (
					<PeriodSummary
						summary={summary}
						date={date}
						period={period}
						count={records.length}
					/>
				) : null}

				<MonthlyRecordFilters
					date={date}
					categories={categories}
					buckets={buckets}
					filters={filters}
					onChange={changes => visit(changes)}
					onClear={clearFilters}
				/>

				<SelectionBar
					open={selected.length > 0}
					summary={`${selected.length} selected`}
					message={
						ineligible.length ? (
							<p className="text-amber-700 dark:text-amber-400">
								{ineligible.length} selected Record
								{ineligible.length === 1 ? "" : "s"} must be classified as spending
								before assigning a bucket. Edit the Record and choose a Treatment
								override first.
							</p>
						) : undefined
					}
				>
					<Select
						value={destination}
						disabled={ineligible.length > 0}
						onValueChange={value => setDestination(value ?? "")}
					>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Choose bucket" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{buckets.map(bucket => (
									<SelectItem key={bucket.id} value={bucket.id}>
										{bucket.name}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button
						disabled={!destination || submitting || ineligible.length > 0}
						onClick={() => void assign(destination)}
					>
						Assign bucket
					</Button>
					<Button
						variant="outline"
						disabled={submitting}
						onClick={() => void assign(null)}
					>
						Remove bucket
					</Button>
					<Button variant="ghost" onClick={() => setSelected([])}>
						Clear
					</Button>
				</SelectionBar>
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
							<div className="flex flex-wrap items-center gap-3">
								<Button variant="outline" size="sm" asChild>
									<Link
										href={pathRecords({
											start_date:
												date.startOf("month").toISODate() ?? undefined,
											end_date: date.endOf("month").toISODate() ?? undefined,
										})}
									>
										Open in Records <IconifyIcon icon="lucide:arrow-up-right" />
									</Link>
								</Button>
								<label className="flex items-center gap-2 text-sm">
									<Checkbox
										checked={
											selected.length === records.length && records.length > 0
												? true
												: selected.length
													? "indeterminate"
													: false
										}
										onCheckedChange={value => toggleAll(value === true)}
									/>{" "}
									Select all
								</label>
							</div>
						</div>
						<div className="overflow-hidden rounded-lg border bg-card">
							{Object.entries(actualGroups).map(([day, dayRecords]) => (
								<DayGroup
									key={day}
									date={day}
									records={dayRecords}
									selected={selected}
									setSelected={setSelected}
									onEdit={editRecord}
									loadingRecordId={loadingRecordId}
								/>
							))}
						</div>
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
						<div className="overflow-hidden rounded-lg border bg-card opacity-80">
							{Object.entries(futureGroups).map(([day, dayRecords]) => (
								<DayGroup
									key={day}
									date={day}
									records={dayRecords}
									selected={[]}
									setSelected={() => undefined}
									onEdit={editRecord}
									loadingRecordId={loadingRecordId}
									selectable={false}
								/>
							))}
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
	const activeFilterCount = [
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
					The list and totals update together.
				</p>
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

function DayGroup({
	date,
	records,
	selected,
	setSelected,
	onEdit,
	loadingRecordId,
	selectable = true,
}: {
	date: string
	records: Record[]
	selected: string[]
	setSelected: React.Dispatch<React.SetStateAction<string[]>>
	onEdit: (record: Record) => Promise<void>
	loadingRecordId: string | null
	selectable?: boolean
}) {
	const { handlePush } = useHistory()
	const router = useRouter()
	const income = records.reduce((sum, record) => sum + contribution(record).income, 0)
	const spending = records.reduce((sum, record) => sum + contribution(record).spending, 0)
	const allSelected = records.every(record => selected.includes(record.id))
	const toggle = (record: Record, value: boolean) =>
		setSelected(current =>
			value ? [...current, record.id] : current.filter(id => id !== record.id),
		)
	return (
		<div role="rowgroup" className="border-b last:border-b-0">
			<div className="flex items-center gap-3 bg-muted/40 px-3 py-1.5 text-xs">
				{selectable ? (
					<Checkbox
						aria-label={`Select Records on ${date}`}
						checked={
							allSelected
								? true
								: records.some(record => selected.includes(record.id))
									? "indeterminate"
									: false
						}
						onCheckedChange={value =>
							setSelected(current =>
								value === true
									? [
											...new Set([
												...current,
												...records.map(record => record.id),
											]),
										]
									: current.filter(
											id => !records.some(record => record.id === id),
										),
							)
						}
					/>
				) : null}
				<span className="font-medium">{dayLabel(date)}</span>
				<span className="ml-auto flex gap-3 text-muted-foreground tabular-nums">
					{income ? (
						<span className="text-creative">+{formatCurrency(income)}</span>
					) : null}
					{spending ? (
						<span className="text-destructive">{formatCurrency(-spending)}</span>
					) : null}
				</span>
			</div>
			<ul className="divide-y">
				{records.map(record => {
					const time = formatRowTime(record.datetime, true)
					const checked = selected.includes(record.id)
					return (
						<li
							key={record.id}
							data-state={checked ? "selected" : undefined}
							onClick={event => {
								if (isInteractiveTarget(event.target)) return
								handlePush("Monthly Records")()
								router.push(pathRecord(record.id))
							}}
							className="flex min-w-0 cursor-pointer items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/40 data-[state=selected]:bg-muted"
						>
							{selectable ? (
								<Checkbox
									aria-label={`Select ${record.title}`}
									checked={checked}
									onCheckedChange={value => toggle(record, value === true)}
								/>
							) : null}
							<Icon {...record.category} size={14} />
							<div className="min-w-0 flex-1">
								<p className="flex items-center gap-1.5">
									<span className="min-w-0 truncate font-medium">
										{record.title}
									</span>
									<PendingBadge record={record} />
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{[record.category.name, record.subtitle, time]
										.filter(Boolean)
										.join(" · ")}
								</p>
							</div>
							<span
								className="hidden shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs text-muted-foreground md:flex"
								title={treatmentLabel(record.analytics_treatment)}
							>
								<span
									className="size-2 rounded-full"
									style={{
										backgroundColor: record.bucket?.color ?? "var(--border)",
									}}
								/>
								{record.bucket?.name ??
									(canUseBucket(record)
										? "No bucket"
										: treatmentLabel(record.analytics_treatment))}
							</span>
							<span className="shrink-0 sm:w-28">
								<RecordAmountCell
									record={record}
									value={record.amount}
									showAllocated={record.is_pending}
								/>
							</span>
							<div className="flex shrink-0 items-center gap-0.5">
								<Button
									variant="ghost"
									size="icon-sm"
									title="Edit"
									aria-label={`Edit ${record.title}`}
									aria-busy={loadingRecordId === record.id}
									onClick={() => {
										if (!loadingRecordId) void onEdit(record)
									}}
								>
									<IconifyIcon
										icon={
											loadingRecordId === record.id
												? "lucide:loader-circle"
												: "lucide:pencil"
										}
									/>
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									title="Open"
									className="hidden sm:inline-flex"
									asChild
								>
									<Link
										href={pathRecord(record.id)}
										aria-label={`Open ${record.title}`}
										onClick={handlePush("Monthly Records")}
									>
										<IconifyIcon icon="lucide:chevron-right" />
									</Link>
								</Button>
							</div>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

function PeriodSummary({
	summary,
	date,
	period,
	count,
}: {
	summary: AnalyticsSummary
	date: DateTime
	period: { is_current: boolean; is_future: boolean; through: string | null }
	count: number
}) {
	const activeDays = summary.daily.filter(day => day.spending > 0).length
	const elapsedDays =
		period.is_current && period.through
			? DateTime.fromISO(period.through).day
			: date.daysInMonth
	return (
		<MetricGrid>
			<Metric
				icon="lucide:circle-dollar-sign"
				label="Income"
				value={formatCurrency(summary.income)}
				detail={`${count} Record${count === 1 ? "" : "s"} shown`}
			/>
			<Metric
				icon="lucide:receipt-text"
				label="Net spending"
				value={formatCurrency(summary.spending)}
				detail={
					summary.refunds
						? `After ${formatCurrency(summary.refunds)} refunds`
						: "No refunds"
				}
			/>
			<Metric
				icon="lucide:flame"
				label="Per spending day"
				value={activeDays ? formatCurrency(summary.spending / activeDays) : "—"}
				detail={`${activeDays} day${activeDays === 1 ? "" : "s"} with spending`}
			/>
			<Metric
				icon="lucide:calendar-days"
				label="Per calendar day"
				value={elapsedDays ? formatCurrency(summary.spending / elapsedDays) : "—"}
				detail={`${elapsedDays ?? 0} day${elapsedDays === 1 ? "" : "s"} so far`}
			/>
		</MetricGrid>
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

function groupRecords(records: Record[]) {
	return records.reduce<{ [date: string]: Record[] }>((groups, record) => {
		const date = record.datetime.slice(0, 10)
		groups[date] ??= []
		groups[date].push(record)
		return groups
	}, {})
}

function contribution(record: Record) {
	if (record.analytics_treatment === "income") return { income: record.amount, spending: 0 }
	if (record.analytics_treatment === "spending") return { income: 0, spending: -record.amount }
	if (record.analytics_treatment === "automatic")
		return { income: Math.max(record.amount, 0), spending: Math.max(-record.amount, 0) }
	return { income: 0, spending: 0 }
}

function canUseBucket(record: Record) {
	return (
		record.analytics_treatment === "spending" ||
		(record.analytics_treatment === "automatic" && record.amount < 0)
	)
}
