"use client"

import { type ReactNode, useId, useState } from "react"
import { formatChartCurrency } from "@/lib/chart-currency"
import { cn, formatCurrency } from "@/lib/utils"

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
	onSelect,
	edit,
}: {
	budgets: MonthlyBudgetUsageItem[]
	unbudgeted: number
	selected: string | null
	onSelect: (id: string) => void
	edit: (budget: MonthlyBudgetUsageItem) => ReactNode
}) {
	const id = useId().replaceAll(":", "")
	const [hovered, setHovered] = useState<string | null>(null)
	const active = budgets.some(budget => budget.id === (hovered ?? selected))
		? (hovered ?? selected)
		: null
	const item = budgets.find(budget => budget.id === active)
	const planned = budgets.reduce((sum, budget) => sum + Math.max(budget.amount ?? 0, 0), 0)
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
	let angle = -90
	const segments = budgets
		.filter(budget => (budget.amount ?? 0) > 0)
		.map(budget => {
			const sweep = ((budget.amount ?? 0) / planned) * 360
			const gap = Math.min(3.5, sweep * 0.2)
			const start = angle + gap / 2
			const end = angle + sweep - gap / 2
			angle += sweep
			return { budget, start, end }
		})
	const select = (budgetId: string) => {
		onSelect(budgetId)
	}

	return (
		<div className="@container flex h-full flex-col gap-4">
			<div className="grid content-start gap-5 @[34rem]:grid-cols-[11rem_1fr] @[34rem]:items-start">
				<div className="relative mx-auto size-52 shrink-0 @[34rem]:size-44">
					<svg
						viewBox="0 0 240 240"
						className="size-full overflow-visible"
						aria-label="Monthly budget usage: segment sizes show planned shares; fill shows spending"
						role="group"
					>
						<defs>
							{segments.map(({ budget }) => (
								<linearGradient
									key={budget.id}
									id={`${id}-${budget.id}`}
									x1="0"
									y1="0"
									x2="1"
									y2="1"
								>
									<stop
										offset="0%"
										stopColor={`color-mix(in oklab, ${budget.color} 75%, white)`}
									/>
									<stop offset="100%" stopColor={budget.color} />
								</linearGradient>
							))}
						</defs>
						{!planned ? (
							<circle
								cx="120"
								cy="120"
								r="91"
								fill="none"
								stroke="var(--muted)"
								strokeWidth="25"
							/>
						) : null}
						{segments.map(({ budget, start, end }) => {
							const usage = Math.max(
								0,
								Math.min(1, budget.spending / (budget.amount ?? 1)),
							)
							return (
								<g
									key={budget.id}
									className={cn(
										"transition-opacity duration-150 motion-reduce:transition-none",
										active && active !== budget.id && "opacity-40",
									)}
								>
									<path
										d={arc(start, end, 91)}
										fill="none"
										stroke={budget.color}
										strokeOpacity="0.13"
										strokeWidth="25"
									/>
									{usage > 0 ? (
										<path
											d={arc(start, start + (end - start) * usage, 91)}
											fill="none"
											stroke={`url(#${id}-${budget.id})`}
											strokeWidth="25"
											className="drop-shadow-xs"
										/>
									) : null}
									{budget.spending > (budget.amount ?? 0) ? (
										<path
											d={arc(start, end, 109)}
											fill="none"
											stroke="var(--destructive)"
											strokeWidth="3"
											strokeLinecap="round"
										/>
									) : null}
									<path
										d={arc(start, end, 91)}
										fill="none"
										stroke="transparent"
										strokeWidth="35"
										role="button"
										tabIndex={0}
										aria-label={`${budget.name}: ${formatCurrency(budget.spending)} spent of ${formatCurrency(budget.amount ?? 0)} planned${budget.spending > (budget.amount ?? 0) ? `, ${formatCurrency(budget.spending - (budget.amount ?? 0))} over` : ""}`}
										aria-pressed={selected === budget.id}
										className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:stroke-foreground/20"
										onMouseEnter={() => setHovered(budget.id)}
										onMouseLeave={() => setHovered(null)}
										onFocus={() => setHovered(budget.id)}
										onBlur={() => setHovered(null)}
										onClick={() => select(budget.id)}
										onKeyDown={event => {
											if (event.key === "Enter" || event.key === " ") {
												event.preventDefault()
												select(budget.id)
											}
										}}
									/>
								</g>
							)
						})}
					</svg>
					<div
						className="pointer-events-none absolute inset-[18%] flex min-w-0 flex-col items-center justify-center text-center"
						aria-live="polite"
					>
						<p className="max-w-[5.5rem] truncate text-[11px] text-muted-foreground">
							{item?.name ?? "Monthly plan"}
						</p>
						<p
							className="mt-1 max-w-full text-lg font-semibold tracking-tight tabular-nums"
							aria-label={
								item?.amount === null
									? "No planned amount"
									: `${formatCurrency(item?.amount ?? planned)} planned`
							}
						>
							{item?.amount === null ? "—" : centerCurrency(item?.amount ?? planned)}
						</p>
						<p className="mt-1 text-[11px] text-muted-foreground">
							{item?.amount === null ? "No planned amount" : "planned"}
						</p>
						<p
							className="mt-1 max-w-full text-xs tabular-nums"
							aria-label={`${formatCurrency(item?.spending ?? spending)} spent`}
						>
							{centerCurrency(item?.spending ?? spending)} spent
						</p>
					</div>
				</div>
				<div className="grid content-start gap-2">
					{budgets.map(budget => (
						<div
							key={budget.id}
							className={cn(
								"min-w-0 rounded-lg border border-border/70 bg-muted/20 px-3 py-2 transition-colors motion-reduce:transition-none",
								active === budget.id && "border-border bg-muted/50",
							)}
							onMouseEnter={() => setHovered(budget.id)}
							onMouseLeave={() => setHovered(null)}
						>
							<div className="flex items-center justify-between gap-2">
								<button
									type="button"
									aria-pressed={selected === budget.id}
									onClick={() => select(budget.id)}
									onFocus={() => setHovered(budget.id)}
									onBlur={() => setHovered(null)}
									className="flex min-h-8 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								>
									<span
										className="size-2 shrink-0 rounded-full"
										style={{ backgroundColor: budget.color }}
									/>
									<span className="truncate">{budget.name}</span>
								</button>
								{edit(budget)}
							</div>

							<div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
								<p className="min-w-0 text-muted-foreground tabular-nums">
									<span className="font-medium text-foreground">
										{formatCurrency(budget.spending)}
									</span>{" "}
									{budget.amount === null
										? "used · no plan"
										: budget.spending < 0
											? "net refund"
											: `of ${formatCurrency(budget.amount)}`}
								</p>
								{budget.remaining !== null ? (
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
						<p className="text-sm text-muted-foreground">
							Create a monthly budget to plan your spending.
						</p>
					) : null}
				</div>
			</div>
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

function centerCurrency(value: number) {
	return Math.abs(value) >= 10000 ? formatChartCurrency(value) : formatCurrency(value)
}

function arc(start: number, end: number, radius: number) {
	const point = (angle: number) => {
		const radians = (angle * Math.PI) / 180
		return `${120 + radius * Math.cos(radians)} ${120 + radius * Math.sin(radians)}`
	}
	const sweep = Math.min(end - start, 359.999)
	return `M ${point(start)} A ${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 1 ${point(start + sweep)}`
}
