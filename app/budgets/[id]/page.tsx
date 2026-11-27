"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import { use, useMemo, useState } from "react"
import { toast } from "sonner"
import BudgetProgressChart from "@/components/charts/budget-progress-chart"
import CategorySpendingMix from "@/components/charts/category-spending-mix"
import BudgetEditorDialog from "@/components/dialogs/budget-editor"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Metric, MetricGrid } from "@/components/metric"
import BudgetRecordsSheet from "@/components/sheets/budget-records-sheet"
import RecordSearchSheet from "@/components/sheets/record-search"
import DataTable from "@/components/table/data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { byDay } from "@/components/table/row-groups"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { useSubmitLock } from "@/hooks/use-submit-lock"
import { useUrlParams } from "@/hooks/use-url-params"
import { formatCurrency, parseDate, pluralize, round2 } from "@/lib/utils"
import {
	attachBudgetRecord,
	budgetProgress,
	budgetSpent,
	detachBudgetRecord,
	getBudget,
} from "@/logic/budgets"
import { listCategories } from "@/logic/categories"
import { pathBudget, pathBudgets } from "@/routes"
import type { Budget, CategoryWithChildren, Record } from "@/types"

export default function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const data = useLiveQuery(
		() => (id ? getBudget(id).catch(() => null) : Promise.resolve(null)),
		[id],
	)
	const categories = useLiveQuery(() => listCategories(), []) ?? []
	const [isEditingBudget, setIsEditingBudget] = useState(false)
	const [isAttachingRecord, setIsAttachingRecord] = useState(false)
	const { editingRecord, handleEdit, setEditingRecord } = useRecordEditor()
	// Inline actions have no dialog to close, so each run ends unlocked.
	const detachLock = useSubmitLock(true)
	const budget = (data ?? null) as Budget | null
	const records = useMemo(() => data?.records ?? [], [data])
	const today = DateTime.now().toFormat("yyyy-MM-dd")
	const progress = useMemo(
		() =>
			budgetProgress(
				records,
				budget?.start_date ?? "2000-01-01",
				budget?.end_date ?? "2000-01-01",
				today,
			),
		[records, budget?.start_date, budget?.end_date, today],
	)
	const limit = budget?.amount ?? 0
	const spent = budget?.used_amount ?? 0
	const startsIn = Math.ceil(
		parseDate(budget?.start_date ?? today).diff(parseDate(today), "days").days,
	)
	const categoryData = useMemo(() => getCategoryData(records, categories), [records, categories])

	// Like the Dashboard, a clicked category or chart day opens its Records in a sheet whose
	// state lives in the URL (`records=1` plus `category` or `day`), so Back closes it.
	const { params: urlParams, setParams } = useUrlParams()
	const drill = urlParams.has("records")
		? { category: urlParams.get("category"), day: urlParams.get("day") }
		: null
	const openDrill = (filters: { category?: string; day?: string }) =>
		setParams({ records: "1", category: null, day: null, ...filters })
	const closeDrill = () =>
		setParams({ records: null, category: null, day: null }, { replace: true })
	const drillCategory = drill?.category
		? categories
				.flatMap(category => [category, ...category.children])
				.find(category => category.id === drill.category)
		: null
	const drillRecords = !drill
		? []
		: drill.category
			? records.filter(
					record =>
						budgetSpent([record]) !== 0 &&
						(record.category.id === drill.category ||
							record.category.parent_category_id === drill.category),
				)
			: records.filter(
					record =>
						outsideKey(
							record.datetime.slice(0, 10),
							budget?.start_date ?? "",
							budget?.end_date ?? "",
						) === drill.day,
				)
	const drillTitle = drillCategory
		? drillCategory.name
		: drill?.day === "before"
			? "Before the window"
			: drill?.day === "after"
				? "After the window"
				: drill?.day
					? DateTime.fromISO(drill.day).toFormat("cccc, d MMMM yyyy")
					: "Records"

	const attach = async (record: Record) => {
		if (!budget) return
		try {
			await attachBudgetRecord(budget.id, record.id)
			setIsAttachingRecord(false)
		} catch {
			toast.error("Unable to attach this Record.")
		}
	}

	const detach = (record: Record) =>
		detachLock.run(async () => {
			if (!budget) return false
			try {
				await detachBudgetRecord(budget.id, record.id)
			} catch {
				toast.error("Unable to detach this Record.")
			}
			return false
		})

	const recordColumns = useRecordColumns<Record>({
		grouped: true,
		onOpen: handleEdit,
		extraActions: record => (
			<Button
				variant="ghost"
				size="icon-sm"
				title="Detach from budget"
				aria-label={`Detach ${record.title}`}
				className="text-destructive hover:text-destructive"
				disabled={detachLock.locked}
				onClick={() => detach(record)}
			>
				<IconifyIcon icon="lucide:link-2-off" />
			</Button>
		),
	})
	const recordMobileRow = useRecordMobileRow<Record>({
		grouped: true,
		onOpen: handleEdit,
		extraActions: record => (
			<Button
				variant="ghost"
				size="icon-sm"
				title="Detach from budget"
				aria-label={`Detach ${record.title}`}
				className="text-destructive hover:text-destructive"
				disabled={detachLock.locked}
				onClick={() => detach(record)}
			>
				<IconifyIcon icon="lucide:link-2-off" />
			</Button>
		),
	})

	// undefined means the live query is still resolving; only null is genuinely missing.
	if (data === undefined) return null

	if (!budget) {
		return (
			<>
				<PageContent>
					<p className="text-xs text-muted-foreground">Budget not found.</p>
				</PageContent>
			</>
		)
	}

	return (
		<>
			<PageContent>
				<PageHeader
					title={budget.name}
					subtitle={
						<div className="flex items-center gap-1 text-muted-foreground">
							<IconifyIcon
								icon={budget.automatic ? "lucide:sparkles" : "lucide:wrench"}
								className="size-4"
							/>
							<span>
								{budget.automatic ? "Automatic" : "Manual"} record attachment
							</span>
						</div>
					}
					description="Budget details"
					icon="lucide:piggy-bank"
					actions={
						<BudgetEditorDialog
							budget={budget}
							isOpen={isEditingBudget}
							setIsOpen={setIsEditingBudget}
							trigger={
								<Button className="w-full sm:w-auto">
									<IconifyIcon icon="lucide:pencil" /> Edit Budget
								</Button>
							}
						/>
					}
					back={{ name: "Budgets", url: pathBudgets() }}
				/>

				<MetricGrid>
					<Metric
						icon="lucide:wallet-cards"
						label="Spent"
						value={formatCurrency(spent)}
						// With scheduled Records, the limit amount makes way for them so the line fits one row.
						detail={
							progress.scheduled
								? `${limit ? round2((spent / limit) * 100) : 0}% used · incl. ${formatCurrency(progress.scheduled)} scheduled`
								: `${limit ? round2((spent / limit) * 100) : 0}% of ${formatCurrency(limit)}`
						}
						tone={spent > limit ? "negative" : "neutral"}
					/>
					<Metric
						icon="lucide:scale"
						label={spent > limit ? "Over budget" : "Remaining"}
						value={formatCurrency(Math.abs(limit - spent))}
						detail={
							startsIn > 0
								? `Window starts in ${pluralize(startsIn, "day")}`
								: progress.remainingDays
									? `${pluralize(progress.remainingDays, "day")} left in window`
									: "Window complete"
						}
						tone={spent > limit ? "negative" : "positive"}
					/>
					<Metric
						icon="lucide:chart-no-axes-combined"
						label="Projected"
						value={formatCurrency(progress.projected)}
						detail={`${formatCurrency(Math.abs(limit - progress.projected))} ${progress.projected > limit ? "over" : "under"} limit`}
						tone={progress.projected > limit ? "negative" : "neutral"}
						delta={
							progress.remainingDays
								? {
										text: progress.projected > limit ? "Over pace" : "On pace",
										good: progress.projected <= limit,
									}
								: undefined
						}
					/>
					<Metric
						icon="lucide:gauge"
						label={progress.remainingDays ? "Recommended pace" : "Daily pace"}
						value={`${formatCurrency(progress.remainingDays ? round2(Math.max(limit - spent, 0) / progress.remainingDays) : progress.pace)} / day`}
						detail={`Now ${formatCurrency(progress.pace)} / day · target ${formatCurrency(round2(limit / progress.dayCount))}`}
					/>
				</MetricGrid>

				<div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
					<Card>
						<CardHeader>
							<CardTitle>Spending over time</CardTitle>
							<CardDescription>
								Cumulative usage against the budget limit. The projection extends
								the current pace and steps up on days with scheduled Records.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<BudgetProgressChart
								points={progress.points}
								limit={limit}
								onSelect={day => openDrill({ day })}
							/>
							<div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
								<Legend color="bg-emerald-500" label="Usage" />
								<Legend color="bg-rose-500" label="Exceed" />
								<Legend color="bg-amber-400" label="Projection" />
								<Legend color="bg-orange-500" label="Projected exceed" />
								{progress.scheduled ? (
									<span className="flex items-center gap-1.5">
										<span className="size-2 rounded-full border-[1.5px] border-amber-400" />
										Scheduled Record
									</span>
								) : null}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Spending by category</CardTitle>
							<CardDescription>
								Where this Budget’s outgoing spending went.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{categoryData.length ? (
								<CategorySpendingMix
									categories={categoryData}
									footnote={null}
									recordHref={id =>
										`${pathBudget(budget?.id ?? "")}?${new URLSearchParams({ records: "1", category: id })}`
									}
								/>
							) : (
								<p className="py-10 text-center text-xs text-muted-foreground">
									No outgoing Records in this budget.
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>
							Attached Records
							<span className="ml-2 text-sm font-normal text-muted-foreground">
								{records.length}
							</span>
						</CardTitle>
						<CardDescription>
							Records that currently contribute to this budget.
						</CardDescription>
						<CardAction>
							<RecordSearchSheet
								title="Attach record to budget"
								placeholder="Search unattached records..."
								filters={{
									exclude_budget_id: budget.id,
									start_date: budget.start_date,
									end_date: budget.end_date,
								}}
								widen="all"
								isOpen={isAttachingRecord}
								setIsOpen={setIsAttachingRecord}
								handler={attach}
								trigger={
									<Button className="w-full sm:w-auto">
										<IconifyIcon icon="lucide:link-2" /> Attach Record
									</Button>
								}
							/>
						</CardAction>
					</CardHeader>
					<CardContent>
						<DataTable
							data={records}
							columns={recordColumns}
							mobileRow={recordMobileRow}
							groupBy={byDay<Record>("Record")}
							onRowClick={handleEdit}
							emptyMessage="No records found."
						/>
					</CardContent>
				</Card>
			</PageContent>

			{budget ? (
				<BudgetRecordsSheet
					open={drill !== null}
					title={drillTitle}
					description={`${budget.name} · ${pluralize(drillRecords.length, "Record")} · ${formatCurrency(budgetSpent(drillRecords))}`}
					records={drillRecords}
					onClose={closeDrill}
				/>
			) : null}

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

/** Which chart point a Record falls on: its day, or `before` / `after` the Budget's window. */
const outsideKey = (day: string, start: string, end: string) =>
	day < start ? "before" : day > end ? "after" : day

function Legend({ color, label }: { color: string; label: string }) {
	return (
		<span className="flex items-center gap-1.5">
			<span className={`size-2 rounded-sm ${color}`} />
			{label}
		</span>
	)
}

function getCategoryData(records: Record[], categories: CategoryWithChildren[]) {
	return categories
		.map(category => {
			const matching = records.filter(
				record =>
					budgetSpent([record]) !== 0 &&
					(record.category.id === category.id ||
						record.category.parent_category_id === category.id),
			)
			const amount = budgetSpent(matching)
			return {
				id: category.id,
				name: category.name,
				icon: category.icon,
				color: category.color,
				spending: amount,
				outflow: amount,
				refunds: 0,
				records: matching.length,
			}
		})
		.filter(category => category.records > 0)
}
