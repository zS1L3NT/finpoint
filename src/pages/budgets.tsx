import type { CellContext } from "@tanstack/react-table"
import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import BudgetCreatorDialog from "@/components/dialogs/budget-creator"
import BudgetEditorDialog from "@/components/dialogs/budget-editor"
import { UiIcon as IconifyIcon } from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useHistory } from "@/history"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { formatCurrency, parseDate } from "@/lib/utils"
import { listBudgets } from "@/logic/budgets"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { pathBudget } from "@/routes"
import { Budget } from "@/types"

export default function BudgetsPage() {
	const { handlePush } = useHistory()
	const [isCreatingBudget, setIsCreatingBudget] = useState(false)
	const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

	const { query, page, pageSize, handleQueryChange, handlePageSizeChange } =
		usePaginatedTableState()

	const budgets = useLiveQuery(() => listBudgets({ query: query || null }), [query]) ?? []
	const paginated = useMemo(
		() => paginateItems(budgets, parsePage(page), parsePageSize(pageSize)),
		[budgets, page, pageSize],
	)

	return (
		<>
			<AppHeader title="Budgets" />

			<PageContent>
				<PageHeader
					title="Budgets"
					subtitle="Track fixed spending windows, monitor how much has already been consumed, and jump straight into the records inside each budget."
					description="Budget planner"
					icon="lucide:piggy-bank"
				/>

				<PaginatedDataTable
					paginated={paginated}
					columns={[
						{
							header: "Budget",
							meta: { width: TABLE_WIDTH_CLASSNAMES.BUDGET },
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
							meta: { width: TABLE_WIDTH_CLASSNAMES.BUDGET_USAGE },
							cell: ({ row }) => {
								const budget = row.original

								const spent = Math.abs(Math.min(budget.used_amount, 0))
								const usage =
									budget.amount === 0 ? 0 : (spent / budget.amount) * 100

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
							meta: { width: TABLE_WIDTH_CLASSNAMES.BUDGET_WINDOW },
							cell: ({ row }) => (
								<span className="text-muted-foreground pe-8">
									{formatBudgetDateWindow(row.original)}
								</span>
							),
						},
						{
							header: "Type",
							meta: { width: TABLE_WIDTH_CLASSNAMES.BUDGET_TYPE },
							cell: ({ row }) => (
								<div className="flex items-center gap-2 text-muted-foreground pe-8">
									{row.original.automatic ? (
										<IconifyIcon icon="lucide:sparkles" className="size-4" />
									) : (
										<IconifyIcon icon="lucide:wrench" className="size-4" />
									)}
									<span>{row.original.automatic ? "Automatic" : "Manual"}</span>
								</div>
							),
						},
						{
							id: "actions",
							meta: {
								onEdit: setEditingBudget,
								width: TABLE_WIDTH_CLASSNAMES.ACTIONS_EDIT_OPEN,
							},
							cell: BudgetActionsCell,
						},
					]}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search all budgets...",
						actions: (
							<BudgetCreatorDialog
								isOpen={isCreatingBudget}
								setIsOpen={setIsCreatingBudget}
								trigger={
									<Button className="w-full sm:w-auto">
										<IconifyIcon icon="lucide:plus" /> New Budget
									</Button>
								}
							/>
						),
					}}
					footer={{
						summary: `Showing ${paginated.data.length} of ${paginated.total} budgets.`,
					}}
					mobileRow={({ original: budget }) => {
						const now = DateTime.now()
						const start = parseDate(budget.start_date).startOf("day")
						const end = parseDate(budget.end_date).endOf("day")
						const spent = Math.abs(Math.min(budget.used_amount, 0))
						const usage = budget.amount === 0 ? 0 : (spent / budget.amount) * 100
						const state = now <= start ? "Upcoming" : now >= end ? "Passed" : "Active"

						return (
							<div className="grid gap-2.5">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="font-medium break-words">{budget.name}</p>
										<p className="text-xs text-muted-foreground">
											{formatBudgetDateWindow(budget)}
										</p>
									</div>
									<Badge variant={state === "Active" ? "default" : "secondary"}>
										{state}
									</Badge>
								</div>

								<div className="grid gap-1.5 text-xs text-muted-foreground">
									<div className="flex items-center justify-between gap-3">
										<span>{Math.round(usage)}% used</span>
										<span>
											{formatCurrency(spent)}
											{" / "}
											{formatCurrency(budget.amount)}
										</span>
									</div>
									<Progress value={usage} className="h-2" />
									<div className="flex items-center justify-between gap-3">
										<span className="flex items-center gap-1">
											{budget.automatic ? (
												<IconifyIcon
													icon="lucide:sparkles"
													className="size-3.5"
												/>
											) : (
												<IconifyIcon
													icon="lucide:wrench"
													className="size-3.5"
												/>
											)}
											{budget.automatic ? "Automatic" : "Manual"}
										</span>
										<div className="flex gap-1.5">
											<Button
												variant="outline"
												size="sm"
												onClick={() => setEditingBudget(budget)}
											>
												<IconifyIcon icon="lucide:pencil" /> Edit
											</Button>
											<Button variant="outline" size="sm" asChild>
												<Link
													to={pathBudget(budget.id)}
													onClick={handlePush("Budgets")}
												>
													Open
												</Link>
											</Button>
										</div>
									</div>
								</div>
							</div>
						)
					}}
					emptyMessage="No budgets found."
				/>
			</PageContent>

			{editingBudget ? (
				<BudgetEditorDialog
					budget={editingBudget}
					isOpen
					setIsOpen={open => {
						if (!open) setEditingBudget(null)
					}}
				/>
			) : null}
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

function BudgetActionsCell({ row, column }: CellContext<Budget, unknown>) {
	const { handlePush } = useHistory()
	const { onEdit } = column.columnDef.meta as { onEdit: (value: Budget) => void }
	return (
		<div className="flex justify-end gap-1.5">
			<Button variant="outline" size="sm" onClick={() => onEdit(row.original)}>
				<IconifyIcon icon="lucide:pencil" /> Edit
			</Button>
			<Button variant="outline" size="sm" asChild>
				<Link to={pathBudget(row.original.id)} onClick={handlePush("Budgets")}>
					Open
				</Link>
			</Button>
		</div>
	)
}
