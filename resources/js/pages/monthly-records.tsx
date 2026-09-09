import { Icon as IconifyIcon } from "@iconify/react"
import { Link, router } from "@inertiajs/react"
import { DateTime } from "luxon"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import RecordAmount from "@/components/record-amount"
import SelectionBar from "@/components/selection-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MonthPicker } from "@/components/ui/monthpicker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useHistory } from "@/history"
import { useFetch } from "@/hooks/use-fetch"
import { treatmentLabel } from "@/lib/analytics"
import { formatCurrency, formatDatetime } from "@/lib/utils"
import {
	Allocation,
	AnalyticsSummary,
	Bucket,
	CategoryWithChildren,
	Record,
	Statement,
} from "@/types"
import {
	categoryIndexApiRoute,
	dashboardWebRoute,
	monthlyRecordsWebRoute,
	recordBucketUpdateApiRoute,
	recordShowApiRoute,
	recordWebRoute,
} from "@/wayfinder/routes"

type EditableRecord = Record & { statements: (Statement & { pivot?: Allocation })[] }

export default function MonthlyRecordsPage({
	month,
	year,
	period,
	records,
	future_records,
	summary,
	buckets,
}: {
	month: string
	year: number
	period: { is_current: boolean; is_future: boolean; through: string | null }
	records: Record[]
	future_records: Record[]
	summary: AnalyticsSummary
	buckets: Bucket[]
}) {
	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])
	const [selected, setSelected] = useState<string[]>([])
	const [destination, setDestination] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const [editingRecord, setEditingRecord] = useState<EditableRecord | null>(null)
	const [loadingRecordId, setLoadingRecordId] = useState<string | null>(null)
	const actualGroups = useMemo(() => groupRecords(records), [records])
	const futureGroups = useMemo(() => groupRecords(future_records), [future_records])
	const selectedRecords = records.filter(record => selected.includes(record.id))
	const ineligible = selectedRecords.filter(record => !canUseBucket(record))

	useEffect(() => {
		setSelected(current => current.filter(id => records.some(record => record.id === id)))
	}, [records])

	const visit = (nextDate = date) => {
		router.visit(
			monthlyRecordsWebRoute({
				query: { month: nextDate.toFormat("MMMM"), year: nextDate.year },
			}),
			{ preserveState: true, preserveScroll: true },
		)
	}

	const assign = async (bucketId: string | null) => {
		if (!selectedRecords.length) return
		setSubmitting(true)
		const response = await fetch(recordBucketUpdateApiRoute.url(), {
			method: "PATCH",
			headers: { Accept: "application/json", "Content-Type": "application/json" },
			body: JSON.stringify({
				records: selectedRecords.map(record => ({
					id: record.id,
					revision: record.revision,
				})),
				bucket_id: bucketId,
			}),
		})
		const data = await response.json().catch(() => null)
		if (response.ok) {
			toast.success(
				`${selectedRecords.length} Record${selectedRecords.length === 1 ? "" : "s"} updated.`,
			)
			setSelected([])
			router.reload()
		} else {
			toast.error(
				data?.message ??
					Object.values(data?.errors ?? {})
						.flat()
						.join(" ") ??
					"Unable to update the selected Records.",
			)
		}
		setSubmitting(false)
	}

	const toggleAll = (checked: boolean) =>
		setSelected(checked ? records.map(record => record.id) : [])
	const editRecord = async (record: Record) => {
		setLoadingRecordId(record.id)
		try {
			const response = await fetch(recordShowApiRoute.url({ record }), {
				headers: { Accept: "application/json" },
			})
			const data = await response.json().catch(() => null)
			if (response.ok) {
				setEditingRecord(data as EditableRecord)
				return
			}
			toast.error(data?.message ?? "Unable to open this Record for editing.")
		} finally {
			setLoadingRecordId(null)
		}
	}

	return (
		<>
			<AppHeader title="Monthly Records" />
			<PageContent className="gap-5 md:gap-7">
				<header className="grid gap-5">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
								Monthly Records
							</p>
							<h2 className="mt-1 text-3xl font-semibold tracking-tight">
								{month} {year}
							</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								{period.is_current && period.through
									? `Actuals through ${DateTime.fromISO(period.through).toFormat("d MMM")}`
									: period.is_future
										? "Future-dated Records"
										: "Full month"}
							</p>
						</div>
						<ButtonGroup className="w-full sm:w-fit">
							<Button
								variant="outline"
								aria-label="Previous month"
								onClick={() => visit(date.minus({ month: 1 }))}
							>
								<IconifyIcon icon="lucide:arrow-left" />
							</Button>
							<Popover>
								<PopoverTrigger
									render={<Button variant="outline" className="flex-1 sm:w-32" />}
								>
									<IconifyIcon icon="lucide:calendar" />{" "}
									{date.toFormat("MMM yyyy")}
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<MonthPicker
										selectedMonth={date.toJSDate()}
										onMonthSelect={value => visit(DateTime.fromJSDate(value))}
									/>
								</PopoverContent>
							</Popover>
							<Button
								variant="outline"
								aria-label="Next month"
								onClick={() => visit(date.plus({ month: 1 }))}
							>
								<IconifyIcon icon="lucide:arrow-right" />
							</Button>
						</ButtonGroup>
					</div>
					<nav className="flex border-b" aria-label="Monthly finance views">
						<Link
							className="border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
							href={dashboardWebRoute({ query: { month, year } })}
						>
							Overview
						</Link>
						<Link
							className="border-b-2 border-foreground px-4 py-2 text-sm font-medium"
							href={monthlyRecordsWebRoute({ query: { month, year } })}
						>
							Monthly Records
						</Link>
					</nav>
				</header>

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
							{buckets.map(bucket => (
								<SelectItem key={bucket.id} value={bucket.id}>
									{bucket.name}
								</SelectItem>
							))}
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
					<EmptyRecords />
				) : null}

				{future_records.length ? (
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
										href={recordWebRoute({ record })}
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

function EmptyRecords() {
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
					<Link href="/importer">Import Statements</Link>
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
