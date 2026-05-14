import { Link, router } from "@inertiajs/react"
import {
	Link2Icon,
	Link2OffIcon,
	PencilIcon,
	PiggyBankIcon,
	SparklesIcon,
	WrenchIcon,
} from "lucide-react"
import { useState } from "react"
import CategoriesPieChart from "@/components/charts/categories-pie"
import UsageAreaChart from "@/components/charts/usage-area"
import BudgetEditorDialog from "@/components/dialogs/budget-editor"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import LimiterPaceCards, { getLimitAggregations } from "@/components/limiter-pace-cards"
import RecordSearchSheet from "@/components/sheets/record-search"
import DataTable from "@/components/table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useHistory } from "@/history"
import { useFetch } from "@/hooks/use-fetch"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import {
	classForCurrency,
	formatCurrency,
	formatDatetime,
	parseDate,
	withMethod,
} from "@/lib/utils"
import { Budget, CategoryWithChildren, Record } from "@/types"
import {
	budgetRecordAttachApiRoute,
	budgetRecordDetachApiRoute,
	budgetsWebRoute,
	categoryIndexApiRoute,
	recordWebRoute,
} from "@/wayfinder/routes"

export default function BudgetPage({ budget, records }: { budget: Budget; records: Record[] }) {
	const { handlePush } = useHistory()

	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])
	const [isEditingBudget, setIsEditingBudget] = useState(false)
	const [isAttachingRecord, setIsAttachingRecord] = useState(false)

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

	const limitAggregations = getLimitAggregations(
		records,
		parseDate(budget.start_date),
		parseDate(budget.end_date),
		budget.amount,
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
					actions={
						<BudgetEditorDialog
							budget={budget}
							isOpen={isEditingBudget}
							setIsOpen={setIsEditingBudget}
							trigger={
								<Button>
									<PencilIcon /> Edit Budget
								</Button>
							}
						/>
					}
					back={{ name: "Back to budgets", url: budgetsWebRoute.url() }}
				/>

				<LimiterPaceCards name="budget" limit={budget.amount} {...limitAggregations} />

				<div className="flex gap-8">
					<Card className="flex-1">
						<CardHeader>
							<CardTitle>Spending by Category</CardTitle>
						</CardHeader>
						<CardContent className="h-full flex items-center">
							<CategoriesPieChart
								className="w-full aspect-square px-8"
								categories={categories}
								records={records}
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
								records={records}
								start={parseDate(budget.start_date)}
								end={parseDate(budget.end_date)}
								maxY={
									Math.max(limitAggregations.projectedSpending, budget.amount) *
									1.1
								}
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
							<RecordSearchSheet
								title="Attach record to budget"
								placeholder="Search unattached records..."
								filters={{ exclude_budget_id: budget.id }}
								isOpen={isAttachingRecord}
								setIsOpen={setIsAttachingRecord}
								handler={attach}
								trigger={
									<Button>
										<Link2Icon /> Attach Record
									</Button>
								}
							/>
						</CardAction>
					</CardHeader>
					<CardContent>
						<DataTable
							data={records}
							columns={[
								{
									header: "Record",
									meta: { width: TABLE_WIDTH_CLASSNAMES.RECORD },
									cell: ({ row }) => (
										<div className="flex items-center gap-3">
											<Icon {...row.original.category} size={16} />
											<div className="flex-1 overflow-hidden">
												<p className="truncate font-medium">
													{row.original.is_pending && (
														<Badge variant="warning" className="mr-1">
															Pending
														</Badge>
													)}
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
									meta: { width: TABLE_WIDTH_CLASSNAMES.AMOUNT },
									cell: ({ row }) => (
										<span className={classForCurrency(row.original.amount)}>
											{formatCurrency(row.original.amount)}
										</span>
									),
								},
								{
									header: "Date & Time",
									meta: { width: TABLE_WIDTH_CLASSNAMES.DATETIME },
									cell: ({ row }) => formatDatetime(row.original.datetime),
								},
								{
									header: "Description",
									meta: { width: TABLE_WIDTH_CLASSNAMES.DESCRIPTION },
									cell: ({ row }) => (
										<div className="truncate text-muted-foreground">
											{row.original.description || "-"}
										</div>
									),
								},
								{
									id: "actions",
									meta: { width: TABLE_WIDTH_CLASSNAMES.ACTIONS_OPEN_DETACH },
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
