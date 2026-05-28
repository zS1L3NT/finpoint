import { router } from "@inertiajs/react"
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
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import LimiterPaceCards, { getLimitAggregations } from "@/components/limiter-pace-cards"
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
import { parseDate, withMethod } from "@/lib/utils"
import { Budget, CategoryWithChildren, Record } from "@/types"
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

	const recordColumns = useRecordColumns<Record>({
		pageName: `Budget ${budget.id}`,
		actionWidth: TABLE_WIDTH_CLASSNAMES.ACTIONS_OPEN_DETACH,
		extraActions: record => (
			<Button variant="destructive" size="sm" onClick={() => detach(record)}>
				<Link2OffIcon /> Detach
			</Button>
		),
	})
	const recordMobileRow = useRecordMobileRow<Record>({
		pageName: `Budget ${budget.id}`,
		extraActions: record => (
			<Button variant="destructive" size="sm" onClick={() => detach(record)}>
				<Link2OffIcon /> Detach
			</Button>
		),
	})

	const limitAggregations = getLimitAggregations(
		records,
		parseDate(budget.start_date),
		parseDate(budget.end_date),
		budget.amount,
	)

	return (
		<>
			<AppHeader title="Budget" />

			<PageContent>
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
								<Button className="w-full sm:w-auto">
									<PencilIcon /> Edit Budget
								</Button>
							}
						/>
					}
					back={{ name: "Back to budgets", url: budgetsWebRoute.url() }}
				/>

				<LimiterPaceCards name="budget" limit={budget.amount} {...limitAggregations} />

				<div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
					<Card>
						<CardHeader>
							<CardTitle>Spending by Category</CardTitle>
						</CardHeader>
						<CardContent className="flex h-full items-center">
							<CategoriesPieChart
								className="mx-auto aspect-square w-full max-w-72 px-2 md:max-w-none md:px-4"
								categories={categories}
								records={records}
								limit={budget.amount}
							/>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Spending over Time</CardTitle>
						</CardHeader>
						<CardContent>
							<UsageAreaChart
								className="h-64 aspect-auto md:h-auto md:aspect-video"
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
									<Button className="w-full sm:w-auto">
										<Link2Icon /> Attach Record
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
