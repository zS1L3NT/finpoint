"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import { use, useMemo, useState } from "react"
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
import { formatCurrency, parseDate, parseDatetime, round2dp } from "@/lib/utils"
import { attachBudgetRecord, detachBudgetRecord, getBudget } from "@/logic/budgets"
import { listCategories } from "@/logic/categories"
import { pathBudgets } from "@/routes"
import type { Budget, CategoryWithChildren, Record } from "@/types"

export default function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const data = useLiveQuery(
		() => (id ? getBudget(id).catch(() => null) : Promise.resolve(null)),
		[id],
	)
	const categories =
		useLiveQuery(() => listCategories() as unknown as Promise<CategoryWithChildren[]>, []) ?? []
	const [isEditingBudget, setIsEditingBudget] = useState(false)
	const [isAttachingRecord, setIsAttachingRecord] = useState(false)
	const { editingRecord, handleEdit, setEditingRecord } = useRecordEditor()
	const budget = (data ?? null) as Budget | null
	const records = useMemo(() => (data?.records ?? []) as unknown as Record[], [data])
	const budgetStart = parseDate(budget?.start_date ?? "2000-01-01")
	const budgetEnd = parseDate(budget?.end_date ?? "2000-01-01")
	const now = DateTime.now()
	const budgetAsOf =
		now < budgetStart.startOf("day")
			? budgetStart.minus({ days: 1 })
			: now > budgetEnd.endOf("day")
				? budgetEnd
				: now
	const analytics = getBudgetAnalytics(
		records,
		budgetStart,
		budgetEnd,
		budget?.amount ?? 0,
		budgetAsOf,
	)
	const categoryData = useMemo(
		() => getCategoryData(records, categories, budgetStart, budgetEnd),
		[records, categories, budgetStart, budgetEnd],
	)

	const attach = async (record: Record) => {
		if (!budget) return
		await attachBudgetRecord(budget.id, record.id)
		setIsAttachingRecord(false)
	}

	const detach = async (record: Record) => {
		if (!budget) return
		await detachBudgetRecord(budget.id, record.id)
	}

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
				onClick={() => detach(record)}
			>
				<IconifyIcon icon="lucide:link-2-off" />
			</Button>
		),
	})

	if (!budget) {
		return (
			<>
				<PageContent>
					<p className="text-sm text-muted-foreground">Budget not found.</p>
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
						value={formatCurrency(analytics.spent)}
						detail={`${analytics.elapsedPercent}% of ${formatCurrency(budget.amount)}`}
						tone={analytics.spent > budget.amount ? "negative" : "neutral"}
					/>
					<Metric
						icon="lucide:scale"
						label={analytics.spent > budget.amount ? "Over budget" : "Remaining"}
						value={formatCurrency(Math.abs(budget.amount - analytics.spent))}
						detail={
							analytics.remainingDays
								? `${analytics.remainingDays} day${analytics.remainingDays === 1 ? "" : "s"} left in window`
								: "Window complete"
						}
						tone={analytics.spent > budget.amount ? "negative" : "positive"}
					/>
					<Metric
						icon="lucide:chart-no-axes-combined"
						label="Projected"
						value={formatCurrency(analytics.projectedSpending)}
						detail={`${formatCurrency(Math.abs(budget.amount - analytics.projectedSpending))} ${analytics.projectedSpending > budget.amount ? "over" : "under"} limit`}
						tone={analytics.projectedSpending > budget.amount ? "negative" : "neutral"}
						delta={
							analytics.remainingDays
								? {
										text:
											analytics.projectedSpending > budget.amount
												? "Over pace"
												: "On pace",
										good: analytics.projectedSpending <= budget.amount,
									}
								: undefined
						}
					/>
					<Metric
						icon="lucide:gauge"
						label={
							analytics.recommendedPace === null ? "Daily pace" : "Recommended pace"
						}
						value={`${formatCurrency(analytics.recommendedPace ?? analytics.currentPace)} / day`}
						detail={`Now ${formatCurrency(analytics.currentPace)} / day · target ${formatCurrency(analytics.targetPace)}`}
					/>
				</MetricGrid>

				<div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
					<Card>
						<CardHeader className="border-b">
							<CardTitle className="text-base">Spending over time</CardTitle>
							<CardDescription>
								Cumulative usage against the budget limit, including the current
								pace projection.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<BudgetProgressChart
								records={records}
								start={budgetStart}
								end={budgetEnd}
								limit={budget.amount}
								asOf={budgetAsOf}
							/>
							<div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
								<Legend color="bg-emerald-500" label="Usage" />
								<Legend color="bg-rose-500" label="Exceed" />
								<Legend color="bg-amber-400" label="Projection" />
								<Legend color="bg-orange-500" label="Projected exceed" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="border-b">
							<CardTitle className="text-base">Spending by category</CardTitle>
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
													className="h-full rounded-full"
													style={{
														width: `${category.share}%`,
														backgroundColor: category.color,
													}}
												/>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="py-10 text-center text-sm text-muted-foreground">
									No outgoing Records in this budget.
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">
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

function getBudgetAnalytics(
	records: Record[],
	start: DateTime,
	end: DateTime,
	limit: number,
	asOf: DateTime,
) {
	const dayCount =
		Math.max(Math.floor(end.startOf("day").diff(start.startOf("day"), "days").days), 0) + 1
	const elapsedDays = Math.min(
		Math.max(Math.floor(asOf.startOf("day").diff(start.startOf("day"), "days").days) + 1, 0),
		dayCount,
	)
	const spent = round2dp(
		records
			.filter(record => {
				const date = parseDatetime(record.datetime)
				return date >= start.startOf("day") && date <= asOf.endOf("day")
			})
			.reduce((total, record) => total - record.amount, 0),
	)
	const remainingDays = dayCount - elapsedDays
	const currentPace = elapsedDays ? round2dp(spent / elapsedDays) : 0
	const projectedSpending = round2dp(spent + currentPace * remainingDays)
	const recommendedPace = remainingDays
		? round2dp(Math.max(limit - spent, 0) / remainingDays)
		: null

	return {
		spent,
		elapsedPercent: limit ? round2dp((spent / limit) * 100) : 0,
		projectedSpending,
		currentPace,
		targetPace: dayCount ? round2dp(limit / dayCount) : 0,
		recommendedPace,
		remainingDays,
	}
}

function getCategoryData(
	records: Record[],
	categories: CategoryWithChildren[],
	start: DateTime,
	end: DateTime,
) {
	const data = categories
		.map(category => {
			const matching = records.filter(record => {
				const date = parseDatetime(record.datetime)
				return (
					record.amount < 0 &&
					date >= start.startOf("day") &&
					date <= end.endOf("day") &&
					(record.category.id === category.id ||
						record.category.parent_category_id === category.id)
				)
			})
			return {
				...category,
				records: matching.length,
				amount: round2dp(matching.reduce((total, record) => total - record.amount, 0)),
			}
		})
		.filter(category => category.records > 0)
		.sort((a, b) => b.amount - a.amount)
	const maximum = Math.max(...data.map(category => category.amount), 0)
	return data.map(category => ({
		...category,
		share: maximum ? Math.max((category.amount / maximum) * 100, 2) : 0,
	}))
}
