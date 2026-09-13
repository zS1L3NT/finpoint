import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import RecordAmount from "@/components/record-amount"
import SelectionBar from "@/components/selection-bar"
import CategoryFilter from "@/components/table/category-filter"
import { ClearFiltersButton, FILTER_CONTROL_CLASS, FilterBar } from "@/components/table/filter-bar"
import { Badge } from "@/components/ui/badge"
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
import { cn, formatCurrency, formatDatetime } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { getMonthlyRecords } from "@/logic/monthly"
import { ConflictError, getRecord, updateRecordBuckets } from "@/logic/records"
import { ValidationError } from "@/logic/validate"
import { pathImporter, pathRecord } from "@/routes"
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
	day?: string | number
}

export default function MonthlyRecordsPage() {
	const [searchParams, setSearchParams] = useSearchParams()
	const now = DateTime.now()
	const month = searchParams.get("month") ?? now.toFormat("MMMM")
	const yearParam = searchParams.get("year")
	const year =
		yearParam !== null && Number.isFinite(Number(yearParam)) ? Number(yearParam) : now.year
	const categoryIdsParam = searchParams.get("category_ids")
	const isAllocated = searchParams.get("is_allocated")
	const bucketId = searchParams.get("bucket_id")
	const bucketGroup = searchParams.get("bucket_group")
	const showUnbucketedParam = searchParams.get("show_unbucketed")
	const showUnbucketed = showUnbucketedParam === "1" || showUnbucketedParam === "true"
	const treatment = searchParams.get("treatment")
	const dayParam = searchParams.get("day")
	const day =
		dayParam !== null && dayParam !== "" && Number.isFinite(Number(dayParam))
			? Number(dayParam)
			: null
	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
	const animateContent = useTabTransition()

	const filterKey = JSON.stringify([
		categoryIdsParam,
		isAllocated,
		bucketId,
		bucketGroup,
		showUnbucketedParam,
		treatment,
		dayParam,
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
				day,
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
	if (dayParam) filters.day = dayParam

	const visit = (changes: Partial<Filters> = {}, nextDate = date) => {
		const merged: Partial<Filters> = { ...filters, ...changes }
		const next = new URLSearchParams(searchParams)
		next.set("month", nextDate.toFormat("MMMM"))
		next.set("year", String(nextDate.year))
		for (const key of [
			"category_ids",
			"is_allocated",
			"bucket_id",
			"bucket_group",
			"show_unbucketed",
			"treatment",
			"day",
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
					animateContent && "animate-in fade-in duration-200",
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
						<div className="flex items-center justify-between gap-3">
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
						<PeriodFooter summary={summary} date={date} period={period} />
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
		filters.day,
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
			<div className="flex flex-wrap items-start justify-between gap-2">
				<div>
					<h3 id="monthly-record-filters" className="text-sm font-medium">
						Filter this month
					</h3>
					<p className="text-xs text-muted-foreground">
						{filters.day
							? `Showing ${date.set({ day: Number(filters.day) }).toFormat("d LLL")}. `
							: ""}
						The list and totals update together.
					</p>
				</div>
				{filters.day ? <Badge variant="secondary">Day {filters.day}</Badge> : null}
			</div>
			<FilterBar>
				<CategoryFilter
					categories={categories}
					selectedIds={categoryIds}
					onChange={ids => onChange({ category_ids: ids.join(",") || undefined })}
				/>

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
	const income = records.reduce((sum, record) => sum + contribution(record).income, 0)
	const spending = records.reduce((sum, record) => sum + contribution(record).spending, 0)
	const allSelected = records.every(record => selected.includes(record.id))
	return (
		<Card className="gap-0 py-0">
			<div className="flex flex-col gap-2 bg-muted/35 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
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
					<div>
						<p className="font-medium">
							{DateTime.fromISO(date).toFormat("cccc, d MMMM")}
						</p>
						<p className="text-xs text-muted-foreground">
							{records.length} Record{records.length === 1 ? "" : "s"}
						</p>
					</div>
				</div>
				<p className="text-xs text-muted-foreground tabular-nums">
					{income ? `Income ${formatCurrency(income)} · ` : ""}Spending{" "}
					{formatCurrency(spending)} · Net {formatCurrency(income - spending)}
				</p>
			</div>
			<div className="divide-y">
				{records.map(record => (
					<div key={record.id} className="flex items-start gap-3 px-4 py-3.5">
						{selectable ? (
							<Checkbox
								className="mt-1"
								aria-label={`Select ${record.title}`}
								checked={selected.includes(record.id)}
								onCheckedChange={value =>
									setSelected(current =>
										value === true
											? [...current, record.id]
											: current.filter(id => id !== record.id),
									)
								}
							/>
						) : null}
						<Icon {...record.category} size={14} />
						<div className="grid min-w-0 flex-1 gap-1">
							<p className="font-medium leading-5">
								{record.is_pending ? (
									<Badge variant="warning" className="mr-1">
										Pending
									</Badge>
								) : null}
								{record.title}
							</p>
							{record.subtitle ? (
								<p className="truncate text-sm text-foreground/75">
									{record.subtitle}
								</p>
							) : null}
							<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
								<IconifyIcon icon="lucide:calendar-clock" className="size-3.5" />
								{formatDatetime(record.datetime)}
							</p>
							<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
								<IconifyIcon icon="lucide:tag" className="size-3.5" />
								{`${treatmentLabel(record.analytics_treatment)} · ${record.bucket?.name ?? "No bucket"}`}
							</p>
						</div>
						<div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
							<RecordAmount record={record} />
							<div className="flex gap-1.5">
								<Button
									variant="outline"
									size="sm"
									aria-busy={loadingRecordId === record.id}
									onClick={() => {
										if (!loadingRecordId) void onEdit(record)
									}}
									className="w-[4.25rem]"
								>
									<IconifyIcon icon="lucide:pencil" />
									Edit
								</Button>
								<Button variant="outline" size="sm" asChild>
									<Link
										to={pathRecord(record.id)}
										onClick={handlePush("Monthly Records")}
									>
										Open
									</Link>
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</Card>
	)
}

function PeriodFooter({
	summary,
	date,
	period,
}: {
	summary: AnalyticsSummary
	date: DateTime
	period: { is_current: boolean; is_future: boolean; through: string | null }
}) {
	const activeDays = summary.daily.filter(day => day.spending > 0).length
	const elapsedDays =
		period.is_current && period.through
			? DateTime.fromISO(period.through).day
			: date.daysInMonth
	return (
		<div className="grid gap-3 rounded-lg border bg-muted/20 p-4 sm:grid-cols-4">
			<Metric label="Income" value={formatCurrency(summary.income)} />
			<Metric label="Net spending" value={formatCurrency(summary.spending)} />
			<Metric
				label="Per active spending day"
				value={activeDays ? formatCurrency(summary.spending / activeDays) : "—"}
			/>
			<Metric
				label="Per calendar day"
				value={elapsedDays ? formatCurrency(summary.spending / elapsedDays) : "—"}
			/>
		</div>
	)
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="font-semibold tabular-nums">{value}</p>
		</div>
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
					<Link to={pathImporter()}>Import Statements</Link>
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
