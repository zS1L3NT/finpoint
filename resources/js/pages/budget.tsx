import { Link, router } from "@inertiajs/react"
import { Link2Icon, Link2OffIcon, PiggyBankIcon, SparklesIcon, WrenchIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useMemo } from "react"
import CategoriesPieChart from "@/components/charts/categories-pie"
import UsageAreaChart from "@/components/charts/usage-area"
import DetailCard from "@/components/detail-card"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import RecordSearch from "@/components/record-search"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import BudgetEditorDialog from "@/dialogs/budget-editor"
import { useHistory } from "@/history"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import {
	classForCurrency,
	cn,
	formatCurrency,
	formatDatetime,
	parseDate,
	parseDatetime,
	round2dp,
	withMethod,
} from "@/lib/utils"
import { Budget, Category, Record } from "@/types"
import {
	budgetRecordAttachApiRoute,
	budgetRecordDetachApiRoute,
	budgetsWebRoute,
	recordWebRoute,
} from "@/wayfinder/routes"

type BudgetExtra = {
	records: (Record & RecordExtra)[]
}

type RecordExtra = {
	category: Category
}

type CategoryExtra = {
	children: Category[]
}

const getAggregations = (budget: Budget & BudgetExtra) => {
	const startDate = parseDate(budget.start_date)
	const endDate = parseDate(budget.end_date)

	let elapsedSpending = budget.records
		.filter(r => parseDatetime(r.datetime) < startDate)
		.reduce((acc, el) => acc - el.amount, 0)
	let elapsedDays = 0

	const dates: DateTime[] = []

	for (let i = 0; i <= endDate.diff(startDate, "days").days; i++) {
		const date = startDate.plus({ days: i })
		dates.push(date)

		if (DateTime.now().endOf("day") >= date.endOf("day")) {
			const amount = round2dp(
				budget.records
					.filter(r => parseDatetime(r.datetime).hasSame(date, "day"))
					.reduce((acc, el) => acc - el.amount, 0),
			)

			elapsedSpending = round2dp(elapsedSpending + amount)
			elapsedDays += 1
		}
	}

	const remainingSpending = round2dp(budget.amount - elapsedSpending)
	const remainingDays = dates.length - elapsedDays

	const budgetPace = round2dp(budget.amount / dates.length)
	const currentPace = elapsedDays > 0 ? round2dp(elapsedSpending / elapsedDays) : 0
	const idealPace = remainingDays > 0 ? round2dp(remainingSpending / remainingDays) : 0

	return {
		elapsedSpending,
		projectedSpending: elapsedSpending + currentPace * remainingDays,
		budgetPace,
		currentPace,
		idealPace,
	}
}

export default function BudgetPage({
	budget,
	categories,
}: {
	budget: Budget & BudgetExtra
	categories: (Category & CategoryExtra)[]
}) {
	const { handlePush } = useHistory()

	const attach = async (record: Record) => {
		const response = await fetch(budgetRecordAttachApiRoute.url({ budget, record }), {
			method: "POST",
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			router.reload()
		}
	}

	const detach = async (record: Record) => {
		const response = await fetch(budgetRecordDetachApiRoute.url({ budget, record }), {
			method: "POST",
			body: withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			router.reload()
		}
	}

	const { elapsedSpending, projectedSpending, budgetPace, currentPace, idealPace } = useMemo(
		() => getAggregations(budget),
		[budget],
	)

	return (
		<>
			<AppHeader title="Budget" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title={budget.name}
					subtitle={
						<div className="flex items-center gap-1 text-muted-foreground">
							{budget.automatic ? (
								<SparklesIcon className="size-4" />
							) : (
								<WrenchIcon className="size-4" />
							)}
							<span>
								{budget.automatic ? "Automatic" : "Manual"} record attachment
							</span>
						</div>
					}
					description="Budget details"
					icon={PiggyBankIcon}
					actions={<BudgetEditorDialog budget={budget} />}
					back={{ name: "Back to budgets", url: budgetsWebRoute.url() }}
				/>

				<div className="grid gap-4 grid-cols-4">
					<DetailCard
						label="Budget Usage"
						value={
							<div className="space-y-2">
								<div className="space-y-0.5">
									<p
										className={cn(
											elapsedSpending > budget.amount
												? "text-destructive"
												: "text-creative",
										)}
									>
										{formatCurrency(elapsedSpending)}
									</p>
									<p className="text-xs text-muted-foreground">{`${Math.ceil((elapsedSpending / budget.amount) * 100)}% of ${formatCurrency(budget.amount)}`}</p>
								</div>
								<Progress
									value={(elapsedSpending / budget.amount) * 100}
									className="h-2"
								/>
							</div>
						}
					/>
					<DetailCard
						label="Usage Projection"
						value={
							<div className="space-y-0.5">
								<p
									className={cn(
										idealPace === 0 || currentPace < idealPace
											? ""
											: elapsedSpending > budget.amount
												? "text-destructive"
												: "text-orange-500",
									)}
								>
									{formatCurrency(projectedSpending)}
								</p>
								<p className="text-xs text-muted-foreground">
									{formatCurrency(Math.abs(budget.amount - projectedSpending))}{" "}
									{projectedSpending > budget.amount ? "over" : "under"} budget
								</p>
							</div>
						}
					/>
					<DetailCard
						label="Usage Pace"
						value={
							<div className="space-y-0.5">
								<p>{formatCurrency(currentPace)} / day</p>
								<p className="text-xs text-muted-foreground">
									Budget target is {formatCurrency(budgetPace)} / day
								</p>
							</div>
						}
					/>
					<DetailCard
						label="Recommended Pace"
						value={
							<div className="space-y-0.5">
								<p>{formatCurrency(idealPace)} / day</p>
								<p className="text-xs text-muted-foreground">
									{idealPace > budgetPace
										? "You can spend more than current pace and still stay within budget"
										: "You need to spend less than current pace to stay within budget"}
								</p>
							</div>
						}
					/>
				</div>

				<div className="flex gap-6">
					<Card className="flex-1">
						<CardHeader>
							<CardTitle>Spending by Category</CardTitle>
						</CardHeader>
						<CardContent className="my-auto">
							<CategoriesPieChart
								categories={categories}
								records={budget.records}
								limit={budget.amount}
							/>
						</CardContent>
					</Card>
					<Card className="flex-2">
						<CardHeader>
							<CardTitle>Spending over Time</CardTitle>
						</CardHeader>
						<CardContent>
							<UsageAreaChart
								records={budget.records}
								start={parseDate(budget.start_date)}
								end={parseDate(budget.end_date)}
								maxY={Math.max(projectedSpending, budget.amount) * 1.1}
								limit={budget.amount}
							/>
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
							<RecordSearch
								title="Attach record to budget"
								filters={{ exclude_budget_id: budget.id }}
								handler={attach}
								trigger={
									<Button>
										<Link2Icon /> Attach record
									</Button>
								}
							/>
						</CardAction>
					</CardHeader>
					<CardContent>
						<DataTable
							data={budget.records}
							columns={[
								{
									header: "Record",
									meta: { width: TABLE_WIDTHS.RECORD },
									cell: ({ row }) => (
										<div className="flex items-center gap-3">
											<Icon {...row.original.category} size={16} />
											<div className="flex-1 overflow-hidden">
												<p className="truncate font-medium">
													{row.original.title}
												</p>
												<p className="truncate text-muted-foreground">
													{row.original.subtitle || "No extra context"}
												</p>
											</div>
										</div>
									),
								},
								{
									header: "Amount",
									meta: { width: TABLE_WIDTHS.AMOUNT },
									cell: ({ row }) => (
										<span className={classForCurrency(row.original.amount)}>
											{formatCurrency(row.original.amount)}
										</span>
									),
								},
								{
									header: "Date & Time",
									meta: { width: TABLE_WIDTHS.DATETIME },
									cell: ({ row }) => formatDatetime(row.original.datetime),
								},
								{
									header: "Description",
									meta: { width: TABLE_WIDTHS.DESCRIPTION },
									cell: ({ row }) => (
										<div className="truncate text-muted-foreground">
											{row.original.description || "-"}
										</div>
									),
								},
								{
									id: "actions",
									cell: ({ row }) => (
										<div className="flex justify-end gap-2">
											<Button variant="outline" size="sm" asChild>
												<Link
													href={recordWebRoute.url({
														record: row.original,
													})}
													onClick={handlePush(`Budget ${budget.id}`)}
												>
													Open
												</Link>
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => detach(row.original)}
											>
												<Link2OffIcon /> Detach
											</Button>
										</div>
									),
								},
							]}
							emptyMessage="No records found."
						/>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
