"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { type ReactNode, useMemo, useRef } from "react"
import CashflowChart from "@/components/charts/cashflow-chart"
import CategoryHistoryChart from "@/components/charts/category-history-chart"
import CategoryMovers from "@/components/charts/category-movers"
import CategorySpendingMix from "@/components/charts/category-spending-mix"
import DailySpendingChart from "@/components/charts/daily-spending-chart"
import MonthlyBudgetUsage from "@/components/charts/monthly-budget-usage"
import SpendingCalendar from "@/components/charts/spending-calendar"
import TotalSpendingChart from "@/components/charts/total-spending-chart"
import WeekdayBars from "@/components/charts/weekday-bars"
import MonthlyBudgetDialog from "@/components/dialogs/monthly-budget"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Metric as DashboardMetric, type Delta, MetricGrid } from "@/components/metric"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import { FILTER_CONTROL_CLASS } from "@/components/table/filter-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import ValueSwap from "@/components/value-swap"
import { useHistory } from "@/history"
import { useMonthParams } from "@/hooks/use-month-params"
import { STALE_MONTH_CLASS, useMonthTransition } from "@/hooks/use-month-transition"
import { useStagedMount } from "@/hooks/use-staged-mount"
import { cn, formatCurrency } from "@/lib/utils"
import { getDashboardView } from "@/logic/dashboard"
import { pathDashboard, pathMonthlyRecords, pathStatements } from "@/routes"
import { AnalyticsSummary } from "@/types"

type DashboardView = Awaited<ReturnType<typeof getDashboardView>>
type DashboardData = DashboardView["dashboard"]
type DashboardMonthlyBudget = DashboardData["monthlyBudgets"][number]
type Comparison = DashboardData["comparison"]
type ComparisonValue = Comparison["income"]
type Projection = DashboardView["pace"]["projection"]
type PaceData = DashboardView["pace"]
type WeekdayBreakdown = DashboardData["weekday"]

export default function DashboardPage() {
	const { handlePush } = useHistory()
	const { month, year } = useMonthParams()
	const contentRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const searchParams = useSearchParams()
	const storedScope = searchParams.get("scope") ?? "all"
	// One live query, one table load: the three separate queries this replaced
	// each re-scanned every table whenever anything changed.
	const view = useLiveQuery(
		() => getDashboardView({ month, year, scope: storedScope }),
		[month, year, storedScope],
	)
	const data = view?.dashboard
	// Until the new month's query lands, the live query keeps the previous month's data.
	const dataKey = data ? `${data.month}-${data.year}` : null
	const stale = dataKey !== null && dataKey !== `${month}-${year}`
	useMonthTransition(contentRef, dataKey)
	const budgets = data?.monthlyBudgets ?? []
	const categories = data?.categories ?? []
	const setScope = (value: string) => {
		const params = Object.fromEntries(searchParams.entries())
		if (value === "all") delete params.scope
		else params.scope = value
		router.replace(pathDashboard(params), { scroll: false })
	}
	const validScope = (value: string) =>
		value === "all" ||
		value === "core" ||
		value === "outlier" ||
		value === "other" ||
		budgets.some(budget => budget.id === value)
			? value
			: "all"
	const scope = validScope(storedScope)
	const dailyBudget =
		budgets.find(budget => budget.pace_kind === "daily") ??
		budgets.find(budget => budget.name.toLowerCase() === "daily") ??
		null
	const paceData = view?.pace
	const monthlyBudgetDailyData = view?.monthlyBudgetDaily
	// The summary and pace chart paint first; the sections below the fold then mount one per
	// frame. Mounting every chart in one commit blocked arrival for ~300ms in production.
	const stage = useStagedMount(6, !!data && !!paceData && !!monthlyBudgetDailyData)
	const scopedBudgetIds = useMemo(() => {
		if (scope === "all") return [...budgets.map(budget => budget.id), "unbudgeted"]
		if (scope === "core" || scope === "outlier" || scope === "other") {
			return budgets.filter(budget => budget.group === scope).map(budget => budget.id)
		}
		return [scope]
	}, [scope, budgets])

	if (!data || !paceData || !monthlyBudgetDailyData) return null
	const { period, summary, series, weekday, future_records_count } = data
	const comparison = data.comparison
	const scopedCategories = categories.map(category => ({
		...category,
		spending: scopedBudgetIds.reduce(
			(sum, id) => sum + (category.monthly_budget_spending[id] ?? 0),
			0,
		),
		outflow: scopedBudgetIds.reduce(
			(sum, id) => sum + (category.monthly_budget_outflow[id] ?? 0),
			0,
		),
		refunds: scopedBudgetIds.reduce(
			(sum, id) => sum + (category.monthly_budget_refunds[id] ?? 0),
			0,
		),
		records: scopedBudgetIds.reduce(
			(sum, id) => sum + (category.monthly_budget_records[id] ?? 0),
			0,
		),
	}))
	const scopeLabel = ["all", "core", "outlier", "other"].includes(scope)
		? scope === "all"
			? "All spending"
			: scope.charAt(0).toUpperCase() + scope.slice(1)
		: (budgets.find(budget => budget.id === scope)?.name ?? "Monthly budget")
	const scopeColor = budgets.find(budget => budget.id === scope)?.color
	// Carried into every chart's Records link so the selected budget stays filtered.
	const scopeFilters = {
		monthly_budget_id: budgets.some(budget => budget.id === scope) ? scope : undefined,
		monthly_budget_group: ["core", "outlier", "other"].includes(scope) ? scope : undefined,
	}
	const paceSeries = paceData.series
	const paceProjection = paceData.projection
	const paceTarget = paceData.paceMonthlyBudget
	const completedMonth = paceData.completedMonth
	const highestSpendingDay = paceData.highestSpendingDay
	const dailyLines = monthlyBudgetDailyData.monthlyBudgets.map(budget => ({
		...budget,
		dashed: budget.id === "unbudgeted",
	}))
	const openDay = (date: string) => {
		handlePush("overview")()
		router.push(
			pathMonthlyRecords({
				month,
				year: String(year),
				start_date: date,
				end_date: date,
				...scopeFilters,
			}),
		)
	}
	return (
		<div
			ref={contentRef}
			aria-busy={stale}
			className={cn("reveal grid gap-5 md:gap-6", stale && STALE_MONTH_CLASS)}
		>
			{period.is_future ? (
				<div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm">
					<p className="font-medium">
						Plan for {month} {year}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						{future_records_count} future-dated Records · Actual results begin when the
						month starts. Monthly budgets remain editable.
					</p>
				</div>
			) : (
				<SummaryBand summary={summary} comparison={comparison} />
			)}
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="min-w-0 flex-1 basis-full sm:basis-auto">
					<ReviewLinks data={data} month={month} year={year} />
				</div>
				<ScopeSelect value={scope} budgets={budgets} onChange={setScope} />
			</div>
			<div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
				<Card className="min-w-0">
					<CardHeader className="border-b">
						<ScopedCardTitle
							scope={scope === "all" ? (dailyBudget?.name ?? "Total") : scopeLabel}
							color={scope === "all" ? dailyBudget?.color : scopeColor}
						>
							Spending pace
						</ScopedCardTitle>
						<CardDescription>
							{period.is_future
								? "Planned amount and future-dated spending. No recorded pace yet."
								: paceProjection.available
									? "If recorded daily spending continues, plus scheduled spending."
									: "Recorded spending against the monthly plan."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{period.is_future ? (
							<div className="grid gap-4 py-3">
								<div>
									<p className="text-xs text-muted-foreground">
										{paceTarget?.name ?? "Monthly budget"} planned amount
									</p>
									<p className="mt-2 text-2xl font-semibold tabular-nums">
										{paceTarget?.amount == null
											? "Not set"
											: formatCurrency(paceTarget.amount)}
									</p>
								</div>
								<p className="text-xs leading-relaxed text-muted-foreground">
									Recorded pace and remaining daily capacity start when the month
									begins. Review future-dated Records as you plan.
								</p>
								<Button variant="outline" size="sm" asChild>
									<Link
										onClick={handlePush("overview")}
										href={pathMonthlyRecords({ month, year: String(year) })}
									>
										Review {future_records_count} future-dated Records{" "}
										<IconifyIcon icon="lucide:arrow-up-right" />
									</Link>
								</Button>
							</div>
						) : (
							<>
								<CashflowChart
									data={paceSeries}
									history={paceData.history}
									month={month}
									year={year}
									target={paceTarget?.amount ?? null}
									targetLabel={paceTarget?.name ?? null}
									showProjection={paceProjection.available}
									recordFilters={scopeFilters}
								/>
								<PaceSummary
									projection={paceProjection}
									completedMonth={completedMonth}
									highestSpendingDay={highestSpendingDay}
									spending={paceData.spending}
									amount={paceTarget?.amount ?? null}
									remaining={paceData.remaining}
								/>
							</>
						)}
					</CardContent>
				</Card>
				<Card className="min-w-0">
					<CardHeader>
						<div className="flex items-start justify-between gap-3">
							<div>
								<CardTitle>Monthly budgets</CardTitle>
								<CardDescription className="mt-1">
									Segment size = planned share · Fill = amount used
								</CardDescription>
							</div>
							<MonthlyBudgetDialog
								month={month}
								year={year}
								trigger={
									<Button variant="outline" size="sm">
										<IconifyIcon icon="lucide:plus" /> New
									</Button>
								}
							/>
						</div>
					</CardHeader>
					<CardContent className="flex flex-1 flex-col">
						<MonthlyBudgetUsage
							budgets={budgets}
							unbudgeted={categories.reduce(
								(sum, category) =>
									sum + (category.monthly_budget_spending.unbudgeted ?? 0),
								0,
							)}
							selected={budgets.some(budget => budget.id === scope) ? scope : null}
							onSelect={setScope}
							edit={budget => (
								<MonthlyBudgetDialog
									monthlyBudget={budgets.find(item => item.id === budget.id)}
									month={month}
									year={year}
									trigger={
										<Button
											variant="ghost"
											size="sm"
											className="min-h-8"
											onClick={event => event.stopPropagation()}
											aria-label={`Edit ${budget.name}`}
										>
											Edit
										</Button>
									}
								/>
							)}
						/>
					</CardContent>
				</Card>
			</div>
			{!period.is_future ? (
				<>
					{stage > 0 ? (
						<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
							<Card className="min-w-0">
								<CardHeader>
									<ScopedCardTitle
										scope={scope === "all" ? "Total" : scopeLabel}
										color={scopeColor}
									>
										Categories this month
									</ScopedCardTitle>
									<CardDescription>
										{scopeLabel} ·{" "}
										{formatCurrency(
											scopedCategories.reduce(
												(sum, category) => sum + category.outflow,
												0,
											),
										)}{" "}
										expenses ·{" "}
										{formatCurrency(
											scopedCategories.reduce(
												(sum, category) => sum + category.refunds,
												0,
											),
										)}{" "}
										refunds
									</CardDescription>
								</CardHeader>
								<CardContent>
									<CategorySpendingMix
										categories={scopedCategories}
										recordHref={id =>
											pathMonthlyRecords({
												month,
												year: String(year),
												category_ids: id,
												effective_spending: "true",
												...scopeFilters,
											})
										}
									/>
								</CardContent>
							</Card>
							<CategoryHistoryChart
								months={data.comparison_history}
								through={period.through}
								monthlyBudgetIds={scope === "all" ? null : scopedBudgetIds}
								badge={
									<ScopeLabel
										scope={scope === "all" ? "Total" : scopeLabel}
										color={scopeColor}
									/>
								}
							/>
						</div>
					) : null}
					{stage > 1 ? (
						<div className="grid gap-5 lg:grid-cols-2">
							<Card className="min-w-0">
								<CardHeader>
									<ScopedCardTitle scope="Total">
										Spending calendar
									</ScopedCardTitle>
									<CardDescription>
										Stronger colour means more spending. Select a day to open
										its Records.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<SpendingCalendar
										month={month}
										year={year}
										daily={summary.daily}
										through={period.through}
										onSelect={openDay}
									/>
								</CardContent>
							</Card>
							<Card className="min-w-0">
								<CardHeader>
									<ScopedCardTitle scope="Total">Biggest changes</ScopedCardTitle>
									<CardDescription>
										Categories that moved most against your usual spending.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<CategoryMovers
										categories={categories}
										comparisonCount={comparison.count}
									/>
								</CardContent>
							</Card>
						</div>
					) : null}
					{stage > 2 ? (
						<Card className="min-w-0">
							<CardHeader>
								<ScopedCardTitle scope="Total">Surplus / Shortfall</ScopedCardTitle>
								<CardDescription>
									Cumulative income minus all personal spending
								</CardDescription>
							</CardHeader>
							<CardContent>
								<TotalSpendingChart
									data={series}
									history={data.history}
									month={month}
									year={year}
									recordFilters={scopeFilters}
								/>
							</CardContent>
						</Card>
					) : null}
					{stage > 3 ? (
						<Card>
							<CardHeader className="border-b">
								<ScopedCardTitle scope="Total">Spending by day</ScopedCardTitle>
								<CardDescription>
									Net daily spending across all monthly budgets, including
									refunds. Select a day to open its Records.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<DailySpendingChart
									rows={monthlyBudgetDailyData.rows}
									monthlyBudgets={dailyLines}
									month={month}
									year={year}
									recordFilters={scopeFilters}
								/>
							</CardContent>
						</Card>
					) : null}

					{stage > 4 ? <WeekdayCard weekday={weekday} /> : null}
					{stage > 5 ? (
						<InvestmentRow summary={summary} month={month} year={year} />
					) : null}
				</>
			) : null}
		</div>
	)
}

function ScopeSelect({
	value,
	budgets,
	onChange,
}: {
	value: string
	budgets: DashboardMonthlyBudget[]
	onChange: (value: string) => void
}) {
	return (
		<Select value={value} onValueChange={item => onChange(item ?? "all")}>
			<SelectTrigger
				aria-label="Spending scope"
				className={cn("w-full sm:w-52", FILTER_CONTROL_CLASS)}
			>
				<IconifyIcon icon="lucide:wallet-cards" />
				<SelectValue />
			</SelectTrigger>
			<SelectContent variant="filter">
				<SelectGroup>
					<SelectItem value="all">All spending</SelectItem>
				</SelectGroup>
				<SelectSeparator />
				<SelectGroup>
					<SelectLabel>Budget groups</SelectLabel>
					<SelectItem value="core">Core</SelectItem>
					<SelectItem value="outlier">Outlier</SelectItem>
					<SelectItem value="other">Other</SelectItem>
				</SelectGroup>
				{budgets.length ? <SelectSeparator /> : null}
				{budgets.length ? (
					<SelectGroup>
						<SelectLabel>Specific monthly budget</SelectLabel>
						{budgets.map(budget => (
							<SelectItem key={budget.id} value={budget.id}>
								<span
									className="size-2 rounded-full"
									style={{ backgroundColor: budget.color }}
								/>
								{budget.name}
							</SelectItem>
						))}
					</SelectGroup>
				) : null}
			</SelectContent>
		</Select>
	)
}

function WeekdayCard({ weekday }: { weekday: WeekdayBreakdown }) {
	return (
		<Card>
			<CardHeader>
				<ScopedCardTitle scope="Total">Spending by weekday</ScopedCardTitle>
				<CardDescription>
					Spending on each weekday ÷ its occurrences in the month, including zero-spend
					days.
					{weekday.comparison_count
						? ` Compared with ${weekday.comparison_count} previous full months, using all occurrences of the same weekday.`
						: " No comparison history available."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<WeekdayBars stats={weekday.stats} comparisonCount={weekday.comparison_count} />
				{weekday.weekend ? (
					<p className="mt-3 text-xs text-muted-foreground">
						Weekend days average {formatCurrency(weekday.weekend.weekend_average)} vs{" "}
						{formatCurrency(weekday.weekend.weekday_average)} on weekdays this month.
					</p>
				) : null}
			</CardContent>
		</Card>
	)
}

function ScopedCardTitle({
	scope,
	color,
	children,
}: {
	scope: string
	color?: string
	children: ReactNode
}) {
	return (
		<CardTitle className="flex items-center gap-2 text-base">
			{children}
			<ScopeLabel scope={scope} color={color} />
		</CardTitle>
	)
}

function ScopeLabel({ scope, color }: { scope: string; color?: string }) {
	if (scope === "Total") return <MonthlyBudgetBadge name="Total" color="var(--foreground)" />
	return (
		<MonthlyBudgetBadge
			name={scope}
			color={color ?? (scope === "Daily" ? "var(--color-emerald-500)" : null)}
		/>
	)
}

function SummaryBand({
	summary,
	comparison,
}: {
	summary: AnalyticsSummary
	comparison: Comparison
}) {
	const surplusLabel =
		summary.surplus > 0 ? "Surplus" : summary.surplus < 0 ? "Shortfall" : "Balance"
	const stats = [
		{
			label: "Income",
			value: formatCurrency(summary.income),
			detail: comparisonText(comparison.income, comparison.count),
			delta: deltaOf(comparison.income, comparison.count, "up"),
			tone: "neutral",
		},
		{
			label: summary.spending < 0 ? "Net refund" : "Spending",
			value: formatCurrency(Math.abs(summary.spending)),
			detail: comparisonText(comparison.spending, comparison.count),
			delta: deltaOf(comparison.spending, comparison.count, "down"),
			tone: "neutral",
		},
		{
			label: surplusLabel,
			value: formatCurrency(Math.abs(summary.surplus)),
			detail: "Income less personal spending",
			delta: deltaOf(comparison.surplus, comparison.count, "up"),
			tone: summary.surplus > 0 ? "positive" : summary.surplus < 0 ? "negative" : "neutral",
		},
		{
			label: "Surplus rate",
			value: summary.surplus_rate === null ? "—" : `${summary.surplus_rate.toFixed(1)}%`,
			detail:
				summary.surplus_rate === null
					? "No positive net income"
					: comparisonRateText(comparison.surplus_rate, comparison.count),
			delta: undefined,
			tone: "neutral",
		},
	]
	return (
		<Card className="gap-0 overflow-hidden py-0">
			<div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
				{stats.map(stat => (
					<div key={stat.label} className="min-w-0 bg-card px-3 py-3">
						<div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-muted-foreground">
							<span>{stat.label}</span>
							{stat.delta ? (
								<span
									className={cn(
										"rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
										stat.delta.good
											? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
											: "bg-red-500/10 text-red-700 dark:text-red-400",
									)}
								>
									<ValueSwap value={stat.delta.text} />
								</span>
							) : null}
						</div>
						<p
							className={cn(
								"mt-2 text-xl font-semibold tracking-tight tabular-nums",
								stat.tone === "positive" &&
									"text-emerald-700 dark:text-emerald-400",
								stat.tone === "negative" && "text-destructive",
							)}
						>
							<ValueSwap value={stat.value} />
						</p>
						<p className="mt-1 text-[11px] text-muted-foreground">{stat.detail}</p>
					</div>
				))}
			</div>
		</Card>
	)
}

function InvestmentRow({
	summary,
	month,
	year,
}: {
	summary: AnalyticsSummary
	month: string
	year: number
}) {
	const { handlePush } = useHistory()
	const net = Math.round((summary.withdrawals - summary.contributions) * 100) / 100
	const rate = summary.income > 0 ? (net / summary.income) * 100 : null
	return (
		<section className="grid gap-4" aria-labelledby="investment-title">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h3 id="investment-title" className="text-lg font-semibold">
						Saving and investment movements
					</h3>
					<p className="text-sm text-muted-foreground">
						Recorded contributions and withdrawals for this month
					</p>
				</div>
				<Button variant="outline" size="sm" asChild>
					<Link
						onClick={handlePush("overview")}
						href={pathMonthlyRecords({
							month,
							year: String(year),
							treatment: "saving_investment",
						})}
					>
						View Records
					</Link>
				</Button>
			</div>
			<MetricGrid>
				<DashboardMetric
					icon="lucide:arrow-up-right"
					label="Contributions"
					value={formatCurrency(summary.contributions)}
					detail="Money put into savings and investments"
				/>
				<DashboardMetric
					icon="lucide:arrow-down-left"
					label="Withdrawals"
					value={formatCurrency(summary.withdrawals)}
					detail="Money taken out of savings and investments"
				/>
				<DashboardMetric
					icon="lucide:scale"
					label="Net contributions"
					value={formatCurrency(net)}
					detail="Withdrawals less contributions"
					tone={net > 0 ? "positive" : net < 0 ? "negative" : "neutral"}
				/>
				<DashboardMetric
					icon="lucide:percent"
					label="Net contributions / income"
					value={rate === null ? "—" : `${rate.toFixed(1)}%`}
					detail={
						rate === null
							? "No positive net income"
							: "Net contributions as a share of income"
					}
				/>
			</MetricGrid>
		</section>
	)
}

function PaceSummary({
	projection,
	completedMonth,
	highestSpendingDay,
	spending,
	amount,
	remaining,
}: {
	projection: Projection
	completedMonth: PaceData["completedMonth"]
	highestSpendingDay: PaceData["highestSpendingDay"]
	spending: number
	amount: number | null
	remaining: number | null
}) {
	const budget = projection.monthly_budget
	const result = completedMonth?.amount_difference ?? null
	const stats = projection.available
		? [
				{
					label: "Highest-spend day",
					value: highestSpendingDay ? formatCurrency(highestSpendingDay.spending) : "—",
					detail: highestSpendingDay
						? DateTime.fromISO(highestSpendingDay.date).toFormat("d MMM")
						: "No spending yet",
				},
				{
					label: "Recorded usage pace",
					value: budget
						? `${formatCurrency(budget.usage_pace)} / day`
						: "No paced budget",
					detail: budget ? budget.name : "Set a daily-paced monthly budget",
				},
				{
					label: "If this pace continues",
					value: formatCurrency(projection.projected_spending ?? 0),
					detail: `${formatCurrency(projection.daily_spending ?? 0)} / recorded day${projection.scheduled_spending ? ` + ${formatCurrency(projection.scheduled_spending)} scheduled` : ""}`,
				},
				{
					label: "Recommended pace",
					value:
						budget?.recommended_pace == null
							? "—"
							: `${formatCurrency(budget.recommended_pace)} / day`,
					detail: !budget
						? "No planned amount"
						: budget.remaining < 0
							? `${formatCurrency(-budget.remaining)} over after scheduled spending`
							: budget.remaining === 0
								? "Plan exhausted"
								: `${projection.remaining_days} days left to stay within plan`,
				},
			]
		: !completedMonth
			? [
					{
						label: "Highest-spend day",
						value: highestSpendingDay
							? formatCurrency(highestSpendingDay.spending)
							: "—",
						detail: highestSpendingDay
							? DateTime.fromISO(highestSpendingDay.date).toFormat("d MMM")
							: "No spending recorded",
					},
					{
						label: "Spent so far",
						value: formatCurrency(spending),
						detail: "Recorded spending in this scope",
					},
					{
						label: "Planned",
						value: amount === null ? "Not set" : formatCurrency(amount),
						detail: "Monthly budget amount",
					},
					{
						label: remaining !== null && remaining < 0 ? "Over plan" : "Remaining",
						value: remaining === null ? "—" : formatCurrency(Math.abs(remaining)),
						detail:
							amount === null ? "No planned amount" : "Plan less recorded spending",
					},
				]
			: [
					{
						label: "Highest-spend day",
						value: highestSpendingDay
							? formatCurrency(highestSpendingDay.spending)
							: "—",
						detail: highestSpendingDay
							? DateTime.fromISO(highestSpendingDay.date).toFormat("d MMM")
							: "No spending recorded",
					},
					{
						label: "Recorded month spending",
						value: formatCurrency(completedMonth?.spending ?? 0),
						detail: "Selected pace scope",
					},
					{
						label: "Plan result",
						value:
							result === null
								? "No planned amount"
								: `${formatCurrency(Math.abs(result))} ${result >= 0 ? "remaining" : "over"}`,
						detail:
							completedMonth?.amount == null
								? "Set a monthly amount to compare"
								: `${formatCurrency(completedMonth.amount)} planned`,
					},
					{
						label: "Spending per day",
						value: `${formatCurrency(completedMonth?.spending_per_day ?? 0)} / day`,
						detail: "Full-month total ÷ calendar days",
					},
				]
	return (
		<div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3">
			{stats.map(stat => (
				<div key={stat.label} className="min-w-0">
					<p className="text-[11px] text-muted-foreground">{stat.label}</p>
					<p className="mt-1 text-sm font-semibold tracking-tight tabular-nums">
						{stat.value}
					</p>
					<p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
						{stat.detail}
					</p>
				</div>
			))}
		</div>
	)
}

function ReviewLinks({ data, month, year }: { data: DashboardData; month: string; year: number }) {
	const { handlePush } = useHistory()
	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
	const start = date.startOf("month").toISODate() ?? ""
	const end = date.endOf("month").toISODate() ?? ""
	// Keep the hit area steady: shrinking a pressed link loses clicks near its edges.
	return (
		<div className="flex flex-wrap items-center gap-2" aria-label="Review this month">
			{data.review.pending_records > 0 ? (
				<Button
					variant="outline"
					size="sm"
					className="active:not-aria-[haspopup]:scale-100"
					asChild
				>
					<Link
						onClick={handlePush("overview")}
						href={pathMonthlyRecords({
							month,
							year: String(year),
							is_allocated: "false",
						})}
					>
						<IconifyIcon icon="lucide:circle-dashed" />
						{data.review.pending_records} Pending Record
						{data.review.pending_records === 1 ? "" : "s"}
					</Link>
				</Button>
			) : null}

			{data.review.pending_statements > 0 ? (
				<Button
					variant="outline"
					size="sm"
					className="active:not-aria-[haspopup]:scale-100"
					asChild
				>
					<Link
						onClick={handlePush("overview")}
						href={pathStatements({
							start_date: start,
							end_date: end,
							is_pending: "true",
						})}
					>
						<IconifyIcon icon="lucide:circle-dashed" />
						{data.review.pending_statements} Pending Statement
						{data.review.pending_statements === 1 ? "" : "s"}
					</Link>
				</Button>
			) : null}
			{data.review.unallocated_statements > 0 ? (
				<Button
					variant="outline"
					size="sm"
					className="active:not-aria-[haspopup]:scale-100"
					asChild
				>
					<Link
						onClick={handlePush("overview")}
						href={pathStatements({
							start_date: start,
							end_date: end,
							is_unallocated: "true",
							is_pending: "false",
						})}
					>
						<IconifyIcon icon="lucide:inbox" />
						{data.review.unallocated_statements} unallocated Statement
						{data.review.unallocated_statements === 1 ? "" : "s"}
					</Link>
				</Button>
			) : null}
			{data.summary.unbudgeted_count > 0 ? (
				<Button
					variant="outline"
					size="sm"
					className="active:not-aria-[haspopup]:scale-100"
					asChild
				>
					<Link
						onClick={handlePush("overview")}
						href={pathMonthlyRecords({
							month,
							year: String(year),
							show_unbudgeted: "true",
							effective_spending: "true",
						})}
					>
						<IconifyIcon icon="lucide:wallet" />
						{data.summary.unbudgeted_count} unbudgeted spending Record
						{data.summary.unbudgeted_count === 1 ? "" : "s"}
					</Link>
				</Button>
			) : null}
			{data.summary.pending_count > 0 ? (
				<span className="basis-full text-[11px] text-muted-foreground">
					Pending Record values count in totals.
				</span>
			) : null}
		</div>
	)
}

/** Signed change vs the comparison average; `better` says which direction is good. */
function deltaOf(value: ComparisonValue, count: number, better: "up" | "down"): Delta | undefined {
	if (!count || value.difference === null || Math.abs(value.difference) < 0.005) return undefined
	const up = value.difference > 0
	return {
		text: `${up ? "↑" : "↓"} ${formatCurrency(Math.abs(value.difference)).replace(/\.\d\d$/, "")}`,
		good: up === (better === "up"),
	}
}

function comparisonText(value: ComparisonValue, count: number) {
	if (!count || value.difference === null) return "No comparison history"
	if (Math.abs(value.difference) < 0.005) return `Same as ${count}-month average`
	return `${formatCurrency(Math.abs(value.difference))} ${value.difference > 0 ? "above" : "below"} ${count}-mo avg`
}

function comparisonRateText(value: ComparisonValue, count: number) {
	if (!count || value.difference === null) return "No comparison history"
	if (Math.abs(value.difference) < 0.05) return `Same as ${count}-month average`
	return `${Math.abs(value.difference).toFixed(1)} points ${value.difference > 0 ? "above" : "below"} average`
}
