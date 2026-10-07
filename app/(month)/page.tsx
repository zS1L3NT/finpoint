"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type ReactNode, useMemo, useRef } from "react"
import BucketBadge from "@/components/bucket-badge"
import CashflowChart, { CashflowPoint } from "@/components/charts/cashflow-chart"
import CategoryHistoryChart from "@/components/charts/category-history-chart"
import CategoryMovers from "@/components/charts/category-movers"
import DailySpendingChart from "@/components/charts/daily-spending-chart"
import SpendingCalendar from "@/components/charts/spending-calendar"
import TotalSpendingChart from "@/components/charts/total-spending-chart"
import WeekdayBars from "@/components/charts/weekday-bars"
import BucketDialog from "@/components/dialogs/bucket"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Metric as DashboardMetric, type Delta, MetricGrid } from "@/components/metric"
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
import { useHistory } from "@/history"
import { useMonthParams } from "@/hooks/use-month-params"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { useSettings } from "@/hooks/use-settings"
import { armTabTransition, useMonthTransition } from "@/hooks/use-tab-transition"
import { cn, formatCurrency } from "@/lib/utils"
import { getDashboardView, type SpendingHistoryMonth, type TrendMonth } from "@/logic/dashboard"
import { pathMonthlyRecords } from "@/routes"
import { AnalyticsSummary, Bucket } from "@/types"

type DashboardBucket = Bucket & {
	spending: number
	target: number | null
	remaining: number | null
	comparison: number | null
}

type DashboardCategory = AnalyticsSummary["categories"][number] & {
	share: number | null
	comparison: number | null
	baseline_bucket_spending: { [bucketId: string]: number }
}

type Comparison = {
	count: number
	income: ComparisonValue
	spending: ComparisonValue
	surplus: ComparisonValue
	surplus_rate: ComparisonValue
}

type ComparisonValue = { average: number | null; difference: number | null }

type Projection = {
	available: boolean
	daily_spending: number | null
	projected_spending: number | null
	scheduled_spending: number
	remaining_days: number
	bucket: {
		name: string
		spent: number
		target: number
		projected: number
		usage_pace: number
		target_pace: number
		recommended_pace: number | null
	} | null
}

type DashboardData = {
	month: string
	year: number
	period: { is_current: boolean; is_future: boolean; through: string | null; label: string }
	summary: AnalyticsSummary
	comparison: Comparison
	series: CashflowPoint[]
	projection: Projection
	buckets: DashboardBucket[]
	categories: DashboardCategory[]
	weekday: WeekdayBreakdown
	future_records_count: number
	comparison_months: number
	comparison_history: SpendingHistoryMonth[]
}

type WeekdayStat = {
	day: string
	spending: number | null
	baseline: number | null
	days: number
	baseline_days: number
}

type WeekdayBreakdown = {
	stats: WeekdayStat[]
	comparison_count: number
}

type PaceData = {
	series: CashflowPoint[]
	projection: Projection
	paceBucket: { id: string; name: string; target: number | null } | null
	completedMonth: {
		spending: number
		spending_per_day: number
		target: number | null
		target_difference: number | null
	} | null
	highestSpendingDay: { date: string; spending: number } | null
}

type BucketDailyData = {
	rows: Record<string, number | null>[]
	buckets: { id: string; name: string; color: string }[]
}

export default function DashboardPage() {
	const { handlePush } = useHistory()
	const { month, year } = useMonthParams()
	const contentRef = useRef<HTMLDivElement>(null)
	useMonthTransition(contentRef, `${month}-${year}`)
	const settings = useSettings()
	const router = useRouter()
	const comparisonMonths = settings?.dashboard_comparison_months ?? 3
	// One live query, one table load: the three separate queries this replaced
	// each re-scanned every table whenever anything changed.
	const view = useLiveQuery(
		() => getDashboardView({ month, year, comparison_months: comparisonMonths }),
		[month, year, comparisonMonths],
	)
	const data = view?.dashboard as unknown as DashboardData | undefined
	const buckets = data?.buckets ?? []
	const categories = data?.categories ?? []
	const [storedScope, setScope] = usePersistentState("finpoint.dashboard.scope", "all")
	const validScope = (value: string) =>
		value === "all" ||
		value === "core" ||
		value === "outlier" ||
		value === "other" ||
		buckets.some(bucket => bucket.id === value)
			? value
			: "all"
	const scope = validScope(storedScope)
	const dailyBucket =
		buckets.find(bucket => bucket.pace_kind === "daily") ??
		buckets.find(bucket => bucket.name.toLowerCase() === "daily") ??
		null
	const paceData = view?.pace as unknown as PaceData | undefined
	const bucketDailyData = view?.bucketDaily as unknown as BucketDailyData | undefined
	const trend = view?.trend ?? []
	const scopedBucketIds = useMemo(() => {
		if (scope === "all") return [...buckets.map(bucket => bucket.id), "unbucketed"]
		if (scope === "core" || scope === "outlier" || scope === "other") {
			return buckets.filter(bucket => bucket.group === scope).map(bucket => bucket.id)
		}
		return [scope]
	}, [scope, buckets])

	if (!data || !paceData || !bucketDailyData) return null
	const { period, summary, comparison, series, weekday, future_records_count } = data
	const scopedTotal = categories.reduce(
		(total, category) =>
			total +
			scopedBucketIds.reduce(
				(sum, bucketId) => sum + (category.bucket_spending[bucketId] ?? 0),
				0,
			),
		0,
	)
	const scopeLabel = ["all", "core", "outlier", "other"].includes(scope)
		? scope === "all"
			? "All spending"
			: scope.charAt(0).toUpperCase() + scope.slice(1)
		: (buckets.find(bucket => bucket.id === scope)?.name ?? "Bucket")
	const scopeColor = buckets.find(bucket => bucket.id === scope)?.color
	const paceSeries = paceData.series
	const paceProjection = paceData.projection
	const paceTarget = paceData.paceBucket
	const completedMonth = paceData.completedMonth
	const highestSpendingDay = paceData.highestSpendingDay
	const dailyLines = bucketDailyData.buckets.map(bucket => ({
		...bucket,
		dashed: bucket.id === "unbucketed",
	}))
	const openDay = (date: string) => {
		armTabTransition()
		handlePush("overview")()
		router.push(
			pathMonthlyRecords({ month, year: String(year), start_date: date, end_date: date }),
		)
	}
	return (
		<div ref={contentRef} className={cn("reveal grid gap-7 md:gap-9")}>
			{period.is_future ? (
				<Card>
					<CardHeader>
						<CardTitle>Future-dated Records</CardTitle>
						<CardDescription>
							{future_records_count
								? `${future_records_count} Record${future_records_count === 1 ? "" : "s"} have been entered for this month.`
								: "No Records have been entered for this month."}{" "}
							Actual results and comparisons begin when the month starts.
						</CardDescription>
					</CardHeader>
				</Card>
			) : (
				<>
					<SummaryBand summary={summary} comparison={comparison} trend={trend} />
					{summary.unbucketed_count ? (
						<div
							className="flex flex-wrap gap-2"
							aria-label="Records needing attention"
						>
							{summary.unbucketed_count ? (
								<Button variant="outline" size="sm" asChild>
									<Link
										onClick={() => {
											armTabTransition()
											handlePush("overview")()
										}}
										href={pathMonthlyRecords({
											month,
											year: String(year),
											show_unbucketed: "true",
										})}
									>
										<IconifyIcon icon="lucide:inbox" />{" "}
										{summary.unbucketed_count} unbucketed spending Record
										{summary.unbucketed_count === 1 ? "" : "s"}
									</Link>
								</Button>
							) : null}
						</div>
					) : null}

					<Card>
						<CardHeader className="border-b">
							<ScopedCardTitle scope="Daily" color={dailyBucket?.color}>
								Spending pace
							</ScopedCardTitle>
							<CardDescription>
								{paceProjection.available
									? "Daily-bucket spending against its monthly target, with projected month-end usage."
									: "Completed Daily-bucket spending against its monthly target."}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CashflowChart
								data={paceSeries}
								month={month}
								year={year}
								target={paceTarget?.target ?? null}
								targetLabel={paceTarget?.name ?? null}
								showProjection={paceProjection.available}
							/>
							<PaceSummary
								projection={paceProjection}
								completedMonth={completedMonth}
								highestSpendingDay={highestSpendingDay}
							/>
						</CardContent>
					</Card>

					<section className="grid gap-4" aria-labelledby="spending-breakdown-title">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<div className="flex items-center gap-2">
									<h3
										id="spending-breakdown-title"
										className="text-lg font-semibold"
									>
										Spending breakdown
									</h3>
									<ScopeLabel
										scope={scope === "all" ? "Total" : scopeLabel}
										color={scopeColor}
									/>
								</div>
								<p className="text-sm text-muted-foreground">
									{scopeLabel} · {formatCurrency(scopedTotal)}
								</p>
							</div>
							<ScopeSelect
								value={scope}
								buckets={buckets}
								onChange={value => setScope(value ?? "all")}
							/>
						</div>
						<div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] 2xl:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)]">
							<CategoryHistoryChart
								months={data.comparison_history}
								comparisonMonths={comparisonMonths}
								through={period.through}
								bucketIds={scope === "all" ? null : scopedBucketIds}
							/>
							<BucketStatus
								buckets={buckets}
								month={month}
								year={year}
								activeScope={scope}
								setScope={setScope}
							/>
						</div>
					</section>

					<div className="grid gap-5 lg:grid-cols-2">
						<Card className="min-w-0">
							<CardHeader>
								<ScopedCardTitle scope="Total">Spending calendar</ScopedCardTitle>
								<CardDescription>
									Stronger colour means more spending. Select a day to open its
									Records.
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

					<Card>
						<CardHeader className="border-b">
							<ScopedCardTitle scope="Total">Spending by day</ScopedCardTitle>
							<CardDescription>
								All spending buckets, split into daily outflow. Select a day to open
								its Records.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<DailySpendingChart
								rows={bucketDailyData.rows}
								buckets={dailyLines}
								month={month}
								year={year}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<ScopedCardTitle scope="Total">Surplus / Shortfall</ScopedCardTitle>
							<CardDescription>
								Cumulative income minus personal spending across every bucket
							</CardDescription>
						</CardHeader>
						<CardContent>
							<TotalSpendingChart data={series} month={month} year={year} />
						</CardContent>
					</Card>

					<WeekdayCard weekday={weekday} />

					<InvestmentRow summary={summary} month={month} year={year} />
				</>
			)}
		</div>
	)
}

function ScopeSelect({
	value,
	buckets,
	onChange,
}: {
	value: string
	buckets: DashboardBucket[]
	onChange: (value: string) => void
}) {
	return (
		<Select value={value} onValueChange={item => onChange(item ?? "all")}>
			<SelectTrigger className={cn("w-full sm:w-52", FILTER_CONTROL_CLASS)}>
				<IconifyIcon icon="lucide:wallet-cards" />
				<SelectValue />
			</SelectTrigger>
			<SelectContent variant="filter">
				<SelectGroup>
					<SelectItem value="all">All spending</SelectItem>
				</SelectGroup>
				<SelectSeparator />
				<SelectGroup>
					<SelectLabel>Bucket groups</SelectLabel>
					<SelectItem value="core">Core</SelectItem>
					<SelectItem value="outlier">Outlier</SelectItem>
					<SelectItem value="other">Other</SelectItem>
				</SelectGroup>
				{buckets.length ? <SelectSeparator /> : null}
				{buckets.length ? (
					<SelectGroup>
						<SelectLabel>Specific bucket</SelectLabel>
						{buckets.map(bucket => (
							<SelectItem key={bucket.id} value={bucket.id}>
								<span
									className="size-2 rounded-full"
									style={{ backgroundColor: bucket.color }}
								/>
								{bucket.name}
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
			</CardContent>
		</Card>
	)
}

function ScopedCardTitle({
	scope,
	color,
	children,
}: {
	scope: "Daily" | "Total"
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
	if (scope === "Total") return <BucketBadge name="Total" color="var(--foreground)" />
	return (
		<BucketBadge
			name={scope}
			color={color ?? (scope === "Daily" ? "var(--color-emerald-500)" : null)}
		/>
	)
}

function SummaryBand({
	summary,
	comparison,
	trend,
}: {
	summary: AnalyticsSummary
	comparison: Comparison
	trend: TrendMonth[]
}) {
	const surplusLabel =
		summary.surplus > 0 ? "Surplus" : summary.surplus < 0 ? "Shortfall" : "Balance"
	const tone = summary.surplus > 0 ? "positive" : summary.surplus < 0 ? "negative" : "neutral"
	return (
		<Card className="gap-0 overflow-hidden py-0">
			<MetricGrid className="rounded-none border-0">
				<DashboardMetric
					icon="lucide:circle-dollar-sign"
					label="Total income"
					value={formatCurrency(summary.income)}
					detail={comparisonText(comparison.income, comparison.count)}
					delta={deltaOf(comparison.income, comparison.count, "up")}
					spark={trend.map(month => month.income)}
					sparkColor="var(--income)"
				/>
				<DashboardMetric
					icon="lucide:receipt-text"
					label={summary.spending < 0 ? "Total net refund" : "Total spending"}
					value={formatCurrency(Math.abs(summary.spending))}
					detail={comparisonText(comparison.spending, comparison.count)}
					delta={deltaOf(comparison.spending, comparison.count, "down")}
					spark={trend.map(month => month.spending)}
					sparkColor="var(--spending)"
				/>
				<DashboardMetric
					icon="lucide:scale"
					label={`Total ${surplusLabel.toLowerCase()}`}
					value={formatCurrency(Math.abs(summary.surplus))}
					detail="Income less personal spending"
					tone={tone}
					delta={deltaOf(comparison.surplus, comparison.count, "up")}
					spark={trend.map(month => month.surplus)}
					sparkColor="var(--foreground)"
				/>
				<DashboardMetric
					icon="lucide:percent"
					label="Total surplus rate"
					value={
						summary.surplus_rate === null ? "—" : `${summary.surplus_rate.toFixed(1)}%`
					}
					detail={
						summary.surplus_rate === null
							? "No positive net income"
							: comparisonRateText(comparison.surplus_rate, comparison.count)
					}
					tone={tone}
				/>
			</MetricGrid>
			{summary.pending_count > 0 ? (
				<div className="grid gap-3 border-t bg-amber-500/5 px-4 py-3 sm:grid-cols-[minmax(12rem,1.2fr)_repeat(3,minmax(0,1fr))] sm:items-center">
					<div className="flex items-start gap-2.5">
						<span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
							<IconifyIcon icon="lucide:circle-dashed" className="size-3.5" />
						</span>
						<div>
							<p className="text-xs font-medium">Pending amounts included</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Full Record values awaiting complete allocation
							</p>
						</div>
					</div>
					<PendingValue label="Income" value={summary.pending_income} />
					<PendingValue label="Spending" value={summary.pending_gross_spending} />
					<PendingValue label="Refunds" value={summary.pending_refunds} />
				</div>
			) : null}
		</Card>
	)
}

function PendingValue({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-lg border bg-background/70 px-3 py-2">
			<p className="text-[0.6875rem] font-medium text-muted-foreground">{label}</p>
			<p className="mt-0.5 font-semibold tabular-nums">{formatCurrency(value)}</p>
		</div>
	)
}

function BucketStatus({
	buckets,
	month,
	year,
	activeScope,
	setScope,
}: {
	buckets: DashboardBucket[]
	month: string
	year: number
	activeScope: string
	setScope: (scope: string) => void
}) {
	const { handlePush } = useHistory()
	return (
		<Card className="min-w-0">
			<CardHeader>
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<CardTitle>Buckets</CardTitle>
						<CardDescription>Persistent groups · Monthly targets</CardDescription>
					</div>
					<BucketDialog
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
			<CardContent className="grid gap-3">
				{buckets.map(bucket => {
					const usage =
						bucket.target && bucket.target > 0
							? (bucket.spending / bucket.target) * 100
							: null
					return (
						<div
							key={bucket.id}
							className={cn(
								"grid gap-2 rounded-md border px-3 py-3 transition-colors",
								activeScope === bucket.id &&
									"bg-muted/60 ring-1 ring-foreground/20",
							)}
						>
							<div className="flex flex-wrap items-center justify-between gap-2">
								<button
									type="button"
									aria-pressed={activeScope === bucket.id}
									onClick={() => setScope(bucket.id)}
									className="min-w-0 cursor-pointer rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								>
									<BucketBadge name={bucket.name} color={bucket.color} />
								</button>
								<span className="font-medium tabular-nums">
									{formatCurrency(bucket.spending)}
									{bucket.target !== null
										? ` / ${formatCurrency(bucket.target)}`
										: ""}
								</span>
							</div>
							{usage !== null ? (
								<BucketUsageBar name={bucket.name} usage={usage} />
							) : null}
							<div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
								<span className="capitalize">{bucket.group}</span>
								<div className="flex flex-wrap items-center gap-2">
									<span>
										{bucket.target === null
											? "No target"
											: bucket.remaining !== null && bucket.remaining >= 0
												? `${formatCurrency(bucket.remaining)} remaining`
												: `Over by ${formatCurrency(Math.abs(bucket.remaining ?? 0))}`}
									</span>
									<BucketDialog
										bucket={bucket}
										month={month}
										year={year}
										trigger={
											<Button variant="ghost" size="xs">
												Edit
											</Button>
										}
									/>
								</div>
							</div>
						</div>
					)
				})}
				<Button variant="outline" size="sm" asChild>
					<Link
						onClick={() => {
							armTabTransition()
							handlePush("overview")()
						}}
						href={pathMonthlyRecords({ month, year: String(year) })}
					>
						Manage monthly Records
					</Link>
				</Button>
			</CardContent>
		</Card>
	)
}

function BucketUsageBar({ name, usage }: { name: string; usage: number }) {
	const displayedUsage = Math.max(usage, 0)
	const scale = Math.max(displayedUsage, 100)
	const withinTarget = (Math.min(displayedUsage, 100) / scale) * 100
	const excess = (Math.max(displayedUsage - 100, 0) / scale) * 100

	return (
		<div
			role="progressbar"
			aria-label={`${name} target usage`}
			aria-valuemin={0}
			aria-valuenow={Math.round(usage)}
			className="relative h-1 w-full overflow-hidden rounded-full bg-muted"
		>
			{excess ? (
				<div
					className="absolute inset-0 origin-left bg-destructive transition-transform duration-300 ease-out"
					style={{ transform: `scaleX(${excess / 100})` }}
				/>
			) : null}
			<div
				className="absolute inset-0 origin-right bg-foreground/60 transition-transform duration-300 ease-out"
				style={{ transform: `scaleX(${withinTarget / 100})` }}
			/>
		</div>
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
						onClick={() => {
							armTabTransition()
							handlePush("overview")()
						}}
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
}: {
	projection: Projection
	completedMonth: PaceData["completedMonth"]
	highestSpendingDay: PaceData["highestSpendingDay"]
}) {
	if (!projection.available) {
		if (!completedMonth) return null

		const targetDifference = completedMonth.target_difference

		return (
			<MetricGrid className="mt-3">
				<DashboardMetric
					icon="lucide:receipt-text"
					label="Final month spending"
					value={formatCurrency(completedMonth.spending)}
					detail="Final Daily-bucket total"
				/>
				<DashboardMetric
					icon="lucide:circle-check-big"
					label="Final target result"
					value={
						targetDifference === null
							? "No target"
							: Math.abs(targetDifference) < 0.005
								? "On target"
								: `${formatCurrency(Math.abs(targetDifference))} ${targetDifference > 0 ? "under" : "over"}`
					}
					detail={
						completedMonth.target === null
							? "No Daily target was set"
							: `Against ${formatCurrency(completedMonth.target)} target`
					}
				/>
				<DashboardMetric
					icon="lucide:calendar-days"
					label="Spending per day"
					value={`${formatCurrency(completedMonth.spending_per_day)} / day`}
					detail="Full-month total ÷ calendar days"
				/>
				<DashboardMetric
					icon="lucide:flame"
					label="Highest-spend day"
					value={highestSpendingDay ? formatCurrency(highestSpendingDay.spending) : "—"}
					detail={
						highestSpendingDay
							? DateTime.fromISO(highestSpendingDay.date).toFormat("d MMMM")
							: "No spending recorded"
					}
				/>
			</MetricGrid>
		)
	}
	const bucket = projection.bucket
	const daysLeft = `${projection.remaining_days} day${projection.remaining_days === 1 ? "" : "s"} left`
	return (
		<MetricGrid className="mt-3">
			<DashboardMetric
				icon="lucide:chart-no-axes-combined"
				label="Projected month-end"
				value={formatCurrency(projection.projected_spending ?? 0)}
				detail={`${formatCurrency(projection.daily_spending ?? 0)} daily pace${projection.scheduled_spending ? ` + ${formatCurrency(projection.scheduled_spending)} scheduled` : ""}`}
			/>
			<DashboardMetric
				icon="lucide:gauge"
				label={bucket ? `${bucket.name} usage pace` : "Usage pace"}
				value={bucket ? `${formatCurrency(bucket.usage_pace)} / day` : "No paced bucket"}
				detail={
					bucket
						? `Projected ${formatCurrency(bucket.projected)}`
						: "Add a target to a daily-paced bucket"
				}
			/>
			<DashboardMetric
				icon="lucide:circle-gauge"
				label="Recommended pace"
				value={
					bucket?.recommended_pace === null || !bucket
						? "—"
						: `${formatCurrency(bucket.recommended_pace)} / day`
				}
				detail={
					bucket
						? `${daysLeft} · To finish within ${formatCurrency(bucket.target)}`
						: `${daysLeft} · No target available`
				}
			/>
			<DashboardMetric
				icon="lucide:flame"
				label="Highest-spend day"
				value={highestSpendingDay ? formatCurrency(highestSpendingDay.spending) : "—"}
				detail={
					highestSpendingDay
						? DateTime.fromISO(highestSpendingDay.date).toFormat("d MMMM")
						: "No spending yet"
				}
			/>
		</MetricGrid>
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
	return `${formatCurrency(Math.abs(value.difference))} ${value.difference > 0 ? "above" : "below"} ${count}-month average`
}

function comparisonRateText(value: ComparisonValue, count: number) {
	if (!count || value.difference === null) return "No comparison history"
	if (Math.abs(value.difference) < 0.05) return `Same as ${count}-month average`
	return `${Math.abs(value.difference).toFixed(1)} points ${value.difference > 0 ? "above" : "below"} average`
}
