import { Icon as IconifyIcon } from "@iconify/react"
import { router } from "@inertiajs/react"
import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import BudgetProgressChart from "@/components/charts/budget-progress-chart"
import BudgetEditorDialog from "@/components/dialogs/budget-editor"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import RecordSearchSheet from "@/components/sheets/record-search"
import DataTable from "@/components/table/data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useFetch } from "@/hooks/use-fetch"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { cn, formatCurrency, parseDate, parseDatetime, round2dp, withMethod } from "@/lib/utils"
import type { Budget, CategoryWithChildren, Record } from "@/types"
import {
	budgetRecordAttachApiRoute,
	budgetRecordDetachApiRoute,
	budgetsWebRoute,
	categoryIndexApiRoute,
} from "@/wayfinder/routes"

export default function BudgetPage({ budget, records }: { budget: Budget; records: Record[] }) {
	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])
	const [isEditingBudget, setIsEditingBudget] = useState(false)
	const [isAttachingRecord, setIsAttachingRecord] = useState(false)
	const budgetStart = parseDate(budget.start_date)
	const budgetEnd = parseDate(budget.end_date)
	const now = DateTime.now()
	const budgetAsOf =
		now < budgetStart.startOf("day")
			? budgetStart.minus({ days: 1 })
			: now > budgetEnd.endOf("day")
				? budgetEnd
				: now
	const analytics = getBudgetAnalytics(records, budgetStart, budgetEnd, budget.amount, budgetAsOf)
	const categoryData = useMemo(
		() => getCategoryData(records, categories, budgetStart, budgetEnd),
		[records, categories, budgetStart, budgetEnd],
	)

	const attach = async (record: Record) => {
		const response = await fetch(budgetRecordAttachApiRoute.url({ budget, record }), {
			method: "POST",
			headers: { Accept: "application/json" },
		})

		if (response.ok) router.reload()
	}

	const detach = async (record: Record) => {
		const response = await fetch(budgetRecordDetachApiRoute.url({ budget, record }), {
			method: "POST",
			body: withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) router.reload()
	}

	const recordColumns = useRecordColumns<Record>({
		pageName: `Budget ${budget.id}`,
		actionWidth: TABLE_WIDTH_CLASSNAMES.ACTIONS_OPEN_DETACH,
		extraActions: record => (
			<Button variant="destructive" size="sm" onClick={() => detach(record)}>
				<IconifyIcon icon="lucide:link-2-off" /> Detach
			</Button>
		),
	})
	const recordMobileRow = useRecordMobileRow<Record>({
		pageName: `Budget ${budget.id}`,
		extraActions: record => (
			<Button variant="destructive" size="sm" onClick={() => detach(record)}>
				<IconifyIcon icon="lucide:link-2-off" /> Detach
			</Button>
		),
	})

	return (
		<>
			<AppHeader title="Budget" />

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
					back={{ name: "Back to budgets", url: budgetsWebRoute.url() }}
				/>

				<Card className="gap-0 overflow-hidden py-0">
					<div className="grid sm:grid-cols-2 xl:grid-cols-4">
						<BudgetMetric
							icon="lucide:wallet-cards"
							label="Budget usage"
							value={formatCurrency(analytics.spent)}
							detail={`${analytics.elapsedPercent}% of ${formatCurrency(budget.amount)}`}
							tone={analytics.spent > budget.amount ? "negative" : "positive"}
						/>
						<BudgetMetric
							icon="lucide:chart-no-axes-combined"
							label="Projected usage"
							value={formatCurrency(analytics.projectedSpending)}
							detail={`${formatCurrency(Math.abs(budget.amount - analytics.projectedSpending))} ${analytics.projectedSpending > budget.amount ? "over" : "under"} limit`}
							tone={
								analytics.projectedSpending > budget.amount ? "negative" : "neutral"
							}
						/>
						<BudgetMetric
							icon="lucide:gauge"
							label="Daily usage pace"
							value={`${formatCurrency(analytics.currentPace)} / day`}
							detail={`Target pace ${formatCurrency(analytics.targetPace)} / day`}
						/>
						<BudgetMetric
							icon="lucide:route"
							label="Recommended pace"
							value={
								analytics.recommendedPace === null
									? "Window complete"
									: `${formatCurrency(analytics.recommendedPace)} / day`
							}
							detail={
								analytics.remainingDays
									? `${analytics.remainingDays} day${analytics.remainingDays === 1 ? "" : "s"} remaining`
									: "Final usage shown"
							}
						/>
					</div>
				</Card>

				<div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
					<Card>
						<CardHeader className="border-b">
							<CardTitle>Spending over time</CardTitle>
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
						<CardTitle>Attached records</CardTitle>
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
							emptyMessage="No records found."
						/>
					</CardContent>
				</Card>
			</PageContent>
		</>
	)
}

function BudgetMetric({
	icon,
	label,
	value,
	detail,
	tone = "neutral",
}: {
	icon: string
	label: string
	value: string
	detail: string
	tone?: "positive" | "negative" | "neutral"
}) {
	return (
		<div
			className={cn(
				"min-w-0 border-b p-5 last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 xl:border-r xl:border-b-0 xl:last:border-r-0",
				tone === "positive" && "bg-emerald-950/35",
				tone === "negative" && "bg-rose-950/40",
			)}
		>
			<div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
				<IconifyIcon icon={icon} className="size-4" />
				{label}
			</div>
			<p className="mt-3 text-xl font-semibold tracking-tight tabular-nums">{value}</p>
			<p className="mt-1 text-xs text-muted-foreground">{detail}</p>
		</div>
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
