"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import { use, useMemo, useState } from "react"
import { toast } from "sonner"
import BudgetProgressChart from "@/components/charts/budget-progress-chart"
import BudgetEditorDialog from "@/components/dialogs/budget-editor"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Metric, MetricGrid } from "@/components/metric"
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
import { themeColor } from "@/lib/palette"
import { formatCurrency, parseDate, pluralize, round2 } from "@/lib/utils"
import {
	attachBudgetRecord,
	budgetProgress,
	budgetSpent,
	detachBudgetRecord,
	getBudget,
} from "@/logic/budgets"
import { listCategories } from "@/logic/categories"
import { pathBudgets } from "@/routes"
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
		pageName: `Budget ${budget?.id ?? ""}`,
		onEdit: handleEdit,
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
		pageName: `Budget ${budget?.id ?? ""}`,
		onEdit: handleEdit,
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
						detail={`${limit ? round2((spent / limit) * 100) : 0}% of ${formatCurrency(limit)}${progress.scheduled ? ` · ${formatCurrency(progress.scheduled)} scheduled` : ""}`}
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
						<CardHeader className="border-b">
							<CardTitle>Spending over time</CardTitle>
							<CardDescription>
								Cumulative usage against the budget limit. The projection extends
								the current pace and steps up on days with scheduled Records.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<BudgetProgressChart points={progress.points} limit={limit} />
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
						<CardHeader className="border-b">
							<CardTitle>Spending by category</CardTitle>
							<CardDescription>
								Where this budget’s outgoing Records went.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{categoryData.length ? (
								<div className="grid gap-4">
									{categoryData.map(category => (
										<div key={category.id} className="grid gap-2">
											<div className="flex items-center gap-3">
												<Icon
													icon={category.icon}
													color={category.color}
													size={14}
												/>
												<div className="min-w-0 flex-1">
													<p className="truncate text-sm font-medium">
														{category.name}
													</p>
													<p className="text-xs text-muted-foreground">
														{category.records} Record
														{category.records === 1 ? "" : "s"}
													</p>
												</div>
												<p className="text-sm font-medium tabular-nums">
													{formatCurrency(category.amount)}
												</p>
											</div>
											<div className="ml-10 h-1.5 overflow-hidden rounded-full bg-muted">
												<div
													className="h-full origin-left rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none"
													style={{
														transform: `scaleX(${category.share / 100})`,
														backgroundColor: themeColor(category.color),
													}}
												/>
											</div>
										</div>
									))}
								</div>
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
								filters={{ exclude_budget_id: budget.id }}
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
							emptyMessage="No records found."
						/>
					</CardContent>
				</Card>
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

function Legend({ color, label }: { color: string; label: string }) {
	return (
		<span className="flex items-center gap-1.5">
			<span className={`size-2 rounded-sm ${color}`} />
			{label}
		</span>
	)
}

function getCategoryData(records: Record[], categories: CategoryWithChildren[]) {
	const data = categories
		.map(category => {
			const matching = records.filter(
				record =>
					budgetSpent([record]) !== 0 &&
					(record.category.id === category.id ||
						record.category.parent_category_id === category.id),
			)
			return { ...category, records: matching.length, amount: budgetSpent(matching) }
		})
		.filter(category => category.records > 0)
		.sort((a, b) => b.amount - a.amount)
	const maximum = Math.max(...data.map(category => category.amount), 0)
	return data.map(category => ({
		...category,
		share: maximum ? Math.max((category.amount / maximum) * 100, 2) : 0,
	}))
}
