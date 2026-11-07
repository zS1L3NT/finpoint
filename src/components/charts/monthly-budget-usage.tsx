"use client"

import { themeColor } from "@/lib/palette"
import { cn, formatCurrency } from "@/lib/utils"
import type { Selection } from "@/logic/drilldown"

export type MonthlyBudgetUsageItem = {
	id: string
	name: string
	color: string
	spending: number
	amount: number | null
	remaining: number | null
}

export default function MonthlyBudgetUsage({
	budgets,
	unbudgeted,
	selected,
	onDrill,
	edit,
}: {
	budgets: MonthlyBudgetUsageItem[]
	unbudgeted: number
	selected: string | null
	onDrill: (selection: Selection) => void
	edit: (budget: MonthlyBudgetUsageItem) => React.ReactNode
}) {
	const spending = budgets.reduce((sum, budget) => sum + budget.spending, 0)
	const withoutAmount = budgets.reduce(
		(sum, budget) => sum + (budget.amount === null ? budget.spending : 0),
		0,
	)
	const overspend = budgets.reduce(
		(sum, budget) =>
			sum + (budget.amount === null ? 0 : Math.max(budget.spending - budget.amount, 0)),
		0,
	)
	const select = (value: string) => onDrill({ kind: "budget", value })

	return (
		<div className="@container flex h-full flex-col gap-4">
			<div className="grid content-start gap-2">
				{budgets.map(budget => (
					<div
						key={budget.id}
						className={cn(
							"relative min-w-0 cursor-pointer rounded-lg border border-border/70 bg-muted/20 px-3 py-2 transition-colors duration-150 ease-out hover:bg-muted/50 motion-reduce:transition-none",
							selected === budget.id && "border-border bg-muted/50",
						)}
						style={
							selected === budget.id
								? {
										borderColor: themeColor(budget.color),
										boxShadow: `0 0 0 1px ${themeColor(budget.color)}`,
									}
								: undefined
						}
					>
						<div className="flex items-baseline justify-between gap-2">
							<button
								type="button"
								aria-pressed={selected === budget.id}
								onClick={() => select(budget.id)}
								className="flex min-h-8 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded text-left text-sm font-medium after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
							>
								<span
									className="size-2 shrink-0 rounded-full"
									style={{ backgroundColor: themeColor(budget.color) }}
								/>
								<span className="truncate">{budget.name}</span>
							</button>
							<div className="relative">{edit(budget)}</div>
						</div>

						{budget.amount !== null && budget.amount > 0 ? (
							<div className="my-2 h-1.5 overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full"
									style={{
										width: `${Math.max(0, Math.min(100, (budget.spending / budget.amount) * 100))}%`,
										backgroundColor: themeColor(budget.color),
									}}
								/>
							</div>
						) : null}

						<div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
							<p className="min-w-0 text-muted-foreground tabular-nums">
								<span className="font-medium text-foreground">
									{formatCurrency(budget.spending)}
								</span>{" "}
								{budget.amount === null || budget.amount === 0
									? "used · no plan"
									: budget.spending < 0
										? "net refund"
										: `of ${formatCurrency(budget.amount)}`}
							</p>
							{budget.amount !== 0 && budget.remaining !== null ? (
								<p
									className={cn(
										"shrink-0 tabular-nums text-muted-foreground",
										budget.remaining < 0 && "font-medium text-destructive",
									)}
								>
									{formatCurrency(Math.abs(budget.remaining))}{" "}
									{budget.remaining < 0 ? "over" : "left"}
								</p>
							) : null}
						</div>
					</div>
				))}
				{!budgets.length ? (
					<p className="text-xs text-muted-foreground">
						Create a monthly budget to plan your spending.
					</p>
				) : null}
			</div>
			<p className="text-xs text-muted-foreground tabular-nums">
				Total spending {formatCurrency(spending + unbudgeted)} · incl.{" "}
				{formatCurrency(unbudgeted)} not in any Monthly Budget. Amounts are after refunds.
			</p>
			<p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 rounded-lg border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
				<span>
					Budgeted{" "}
					<strong className="font-medium text-foreground tabular-nums">
						{formatCurrency(spending)}
					</strong>
				</span>
				<span>
					Unbudgeted{" "}
					<strong className="font-medium text-foreground tabular-nums">
						{formatCurrency(unbudgeted)}
					</strong>
				</span>
				{withoutAmount !== 0 ? (
					<span>
						No plan{" "}
						<strong className="font-medium text-foreground tabular-nums">
							{formatCurrency(withoutAmount)}
						</strong>
					</span>
				) : null}
				{overspend > 0 ? (
					<span className="text-destructive">Over by {formatCurrency(overspend)}</span>
				) : null}
			</p>
		</div>
	)
}
