"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import { useState } from "react"
import BudgetCreatorDialog from "@/components/dialogs/budget-creator"
import BudgetEditorDialog from "@/components/dialogs/budget-editor"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import PaginationHeader from "@/components/table/pagination-header"
import { isInteractiveTarget } from "@/components/table/row-groups"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useHistory } from "@/history"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { cn, formatCurrency, parseDate } from "@/lib/utils"
import { listBudgets } from "@/logic/budgets"
import { pathBudget } from "@/routes"
import { Budget } from "@/types"

export default function BudgetsPage() {
	const [isCreatingBudget, setIsCreatingBudget] = useState(false)
	const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState()

	const budgets = useLiveQuery(() => listBudgets({ query: query || null }), [query])

	return (
		<>
			<PageContent>
				<PageHeader
					title="Budgets"
					subtitle="Track fixed spending windows, monitor how much has already been consumed, and jump straight into the records inside each budget."
					description="Budget planner"
					icon="lucide:piggy-bank"
				/>

				<PaginationHeader
					query={query}
					onQueryChange={handleQueryChange}
					pageSize={pageSize}
					onPageSizeChange={handlePageSizeChange}
					searchPlaceholder="Search all budgets..."
					actions={
						<BudgetCreatorDialog
							isOpen={isCreatingBudget}
							setIsOpen={setIsCreatingBudget}
							trigger={
								<Button className="w-full sm:w-auto">
									<IconifyIcon icon="lucide:plus" /> New Budget
								</Button>
							}
						/>
					}
				/>

				{budgets === undefined ? (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{["a", "b", "c"].map(key => (
							<Skeleton key={key} className="h-44 rounded-xl" />
						))}
					</div>
				) : budgets.length === 0 ? (
					<p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
						{query ? "No budgets match your search." : "No budgets yet."}
					</p>
				) : (
					BUDGET_STATES.map(state => {
						const items = budgets.filter(budget => budgetState(budget) === state.value)
						return items.length ? (
							<section key={state.value} className="grid gap-3">
								<h3 className="text-sm font-medium text-muted-foreground">
									{state.label} · {items.length}
								</h3>
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
									{items.map(budget => (
										<BudgetCard
											key={budget.id}
											budget={budget}
											onEdit={() => setEditingBudget(budget)}
										/>
									))}
								</div>
							</section>
						) : null
					})
				)}
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

type BudgetState = "active" | "upcoming" | "ended"

const BUDGET_STATES: { value: BudgetState; label: string }[] = [
	{ value: "active", label: "Active" },
	{ value: "upcoming", label: "Upcoming" },
	{ value: "ended", label: "Ended" },
]

function budgetState(budget: Budget): BudgetState {
	const now = DateTime.now()
	if (now < parseDate(budget.start_date).startOf("day")) return "upcoming"
	if (now > parseDate(budget.end_date).endOf("day")) return "ended"
	return "active"
}

function BudgetCard({ budget, onEdit }: { budget: Budget; onEdit: () => void }) {
	const { handlePush } = useHistory()
	const router = useRouter()
	const state = budgetState(budget)
	const start = parseDate(budget.start_date).startOf("day")
	const end = parseDate(budget.end_date).endOf("day")
	const spent = Math.abs(Math.min(budget.used_amount, 0))
	const usage = budget.amount === 0 ? 0 : (spent / budget.amount) * 100
	const remaining = budget.amount - spent
	const over = remaining < 0
	const now = DateTime.now()
	const totalDays = Math.max(end.diff(start, "days").days, 1)
	// Where spending "should" be if it were spread evenly over the window.
	const pace =
		state === "active"
			? Math.min(Math.max(now.diff(start, "days").days / totalDays, 0), 1)
			: null
	const daysLeft = Math.max(Math.ceil(end.diff(now, "days").days), 0)
	const open = () => {
		handlePush("Budgets")()
		router.push(pathBudget(budget.id))
	}

	return (
		<article
			className="group relative grid cursor-pointer gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
			onClick={event => {
				if (!isInteractiveTarget(event.target)) open()
			}}
			onKeyDown={event => {
				if (event.key === "Enter" && event.target === event.currentTarget) open()
			}}
			tabIndex={0}
		>
			<header className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h4 className="truncate font-semibold">{budget.name}</h4>
					<p className="mt-0.5 text-xs text-muted-foreground">
						{formatBudgetDateWindow(budget)}
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon-sm"
					title="Edit"
					aria-label={`Edit ${budget.name}`}
					className="-mt-1 -mr-1 opacity-60 group-hover:opacity-100"
					onClick={onEdit}
				>
					<IconifyIcon icon="lucide:pencil" />
				</Button>
			</header>

			<div className="grid gap-2">
				<div className="flex items-end justify-between gap-3">
					<p className="text-2xl font-semibold tracking-tight tabular-nums">
						{formatCurrency(spent)}
						<span className="text-sm font-normal text-muted-foreground">
							{" "}
							of {formatCurrency(budget.amount)}
						</span>
					</p>
					<span
						className={cn(
							"text-sm font-medium tabular-nums",
							over ? "text-destructive" : "text-muted-foreground",
						)}
					>
						{Math.round(usage)}%
					</span>
				</div>
				<div className="relative h-2 w-full rounded-full bg-muted">
					<div
						className={cn(
							"h-full rounded-full",
							over
								? "bg-destructive"
								: pace !== null && usage / 100 > pace + 0.05
									? "bg-amber-500"
									: "bg-foreground/70",
						)}
						style={{ width: `${Math.min(usage, 100)}%` }}
					/>
					{pace !== null ? (
						<span
							className="absolute -top-1 h-4 w-0.5 rounded-full bg-foreground"
							style={{ left: `${pace * 100}%` }}
							title="Even pace for today"
						/>
					) : null}
				</div>
			</div>

			<footer className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
				<span className={cn("font-medium", over && "text-destructive")}>
					{over
						? `${formatCurrency(-remaining)} over`
						: `${formatCurrency(remaining)} left`}
				</span>
				<span className="flex items-center gap-3">
					<span className="flex items-center gap-1">
						<IconifyIcon
							icon={budget.automatic ? "lucide:sparkles" : "lucide:hand"}
							className="size-3.5"
						/>
						{budget.automatic ? "Automatic" : "Manual"}
					</span>
					<Badge variant={state === "active" ? "default" : "secondary"}>
						{state === "active"
							? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
							: state === "upcoming"
								? `Starts ${start.toFormat("d MMM")}`
								: "Ended"}
					</Badge>
				</span>
			</footer>
		</article>
	)
}
