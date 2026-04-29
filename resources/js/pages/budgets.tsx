import { Link } from "@inertiajs/react"
import { PiggyBankIcon, SparklesIcon, WrenchIcon } from "lucide-react"
import { DateTime } from "luxon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import BudgetCreatorDialog from "@/dialogs/budget-creator"
import { useHistory } from "@/history"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { formatCurrency, parseDate } from "@/lib/utils"
import { Budget, Paginated } from "@/types"
import { budgetsWebRoute, budgetWebRoute } from "@/wayfinder/routes"

type BudgetExtra = {
	records_sum_amount: number | null
}

export default function BudgetsPage({ budgets }: { budgets: Paginated<Budget & BudgetExtra> }) {
	const { handlePush } = useHistory()

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: budgets,
		buildUrl: query => budgetsWebRoute({ query }).url,
	})

	return (
		<>
			<AppHeader title="Budgets" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Budgets"
					subtitle="Track fixed spending windows, monitor how much has already been consumed, and jump straight into the records inside each budget."
					description="Budget planner"
					icon={PiggyBankIcon}
					actions={<BudgetCreatorDialog />}
				/>

				<PaginatedDataTable
					paginated={budgets}
					columns={[
						{
							header: "Budget",
							meta: { width: TABLE_WIDTHS.BUDGET },
							cell: ({ row }) => {
								const budget = row.original

								const now = DateTime.now()
								const start = parseDate(budget.start_date).startOf("day")
								const end = parseDate(budget.end_date).endOf("day")

								return (
									<div className="flex items-center gap-2">
										<p className="truncate font-medium">{budget.name}</p>
										<Badge
											variant={
												now >= start && now <= end ? "default" : "secondary"
											}
										>
											{now <= start
												? "Upcoming"
												: now >= end
													? "Passed"
													: "Active"}
										</Badge>
									</div>
								)
							},
						},
						{
							header: "Usage",
							meta: { width: TABLE_WIDTHS.BUDGET_USAGE },
							cell: ({ row }) => {
								const budget = row.original

								const spent = Math.abs(Math.min(budget.records_sum_amount ?? 0, 0))
								const usage =
									budget.amount === 0
										? 0
										: Math.min((spent / budget.amount) * 100, 100)

								return (
									<div className="w-full max-w-xs space-y-2 pe-8">
										<div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
											<span>{Math.round(usage)}% used</span>
											<span>
												{formatCurrency(spent)}
												{" / "}
												{formatCurrency(budget.amount)}
											</span>
										</div>
										<Progress value={usage} className="h-2" />
									</div>
								)
							},
						},
						{
							header: "Window",
							meta: { width: TABLE_WIDTHS.BUDGET_WINDOW },
							cell: ({ row }) => (
								<span className="text-muted-foreground pe-8">
									{formatBudgetDateWindow(row.original)}
								</span>
							),
						},
						{
							header: "Type",
							meta: { width: TABLE_WIDTHS.BUDGET_TYPE },
							cell: ({ row }) => (
								<div className="flex items-center gap-2 text-muted-foreground pe-8">
									{row.original.automatic ? (
										<SparklesIcon className="size-4" />
									) : (
										<WrenchIcon className="size-4" />
									)}
									<span>{row.original.automatic ? "Automatic" : "Manual"}</span>
								</div>
							),
						},
						{
							id: "actions",
							cell: ({ row }) => (
								<div className="flex justify-end">
									<Button variant="outline" size="sm" asChild>
										<Link
											href={budgetWebRoute.url({ budget: row.original })}
											onClick={handlePush("Budgets")}
										>
											Open
										</Link>
									</Button>
								</div>
							),
						},
					]}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search budgets...",
					}}
					footer={{
						summary: `Showing ${budgets.data.length} of ${budgets.total} budgets.`,
					}}
					emptyMessage="No budgets found."
				/>
			</div>
		</>
	)
}

function formatBudgetDateWindow(budget: Budget) {
	const start = parseDate(budget.start_date)
	const end = parseDate(budget.end_date)

	return start.isValid && end.isValid
		? `${start.toFormat("d MMM yyyy")} to ${end.toFormat("d MMM yyyy")}`
		: "No time range set"
}
