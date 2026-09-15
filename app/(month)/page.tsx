"use client"

export const dynamic = "force-dynamic"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import Link from "next/link"
import { type ReactNode, useMemo } from "react"
import CashflowChart, { CashflowPoint } from "@/components/charts/cashflow-chart"
import DailySpendingChart from "@/components/charts/daily-spending-chart"
import TotalSpendingChart from "@/components/charts/total-spending-chart"
import WeekdayBars from "@/components/charts/weekday-bars"
import BucketDialog from "@/components/dialogs/bucket"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import { FILTER_CONTROL_CLASS } from "@/components/table/filter-bar"
import { Badge } from "@/components/ui/badge"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useMonthParams } from "@/hooks/use-month-params"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { useTabTransition } from "@/hooks/use-tab-transition"
import { cn, formatCurrency } from "@/lib/utils"
import { getBucketDaily, getDashboard, getPaceView } from "@/logic/dashboard"
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
}

type WeekdayStat = {
	day: string
	spending: number
	baseline: number
}

type WeekdayBreakdown = {
	stats: WeekdayStat[]
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
	const { month, year } = useMonthParams()
	const animateContent = useTabTransition()
	const data = useLiveQuery(() => getDashboard({ month, year }), [month, year]) as unknown as
		| DashboardData
		| undefined
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
	const dailyBucketId = dailyBucket?.id ?? null
	const paceData = useLiveQuery(
		() => getPaceView(month, year, dailyBucketId ?? "all"),
		[month, year, dailyBucketId],
	) as unknown as PaceData | undefined
	const bucketDailyData = useLiveQuery(
		() => getBucketDaily(month, year),
		[month, year],
	) as unknown as BucketDailyData | undefined
	const scopedBucketIds = useMemo(() => {
		if (scope === "all") return [...buckets.map(bucket => bucket.id), "unbucketed"]
		if (scope === "core" || scope === "outlier" || scope === "other") {
			return buckets.filter(bucket => bucket.group === scope).map(bucket => bucket.id)
		}
		return [scope]
	}, [scope, buckets])

	if (!data || !paceData || !bucketDailyData) {
		return (
			<div className="grid gap-7 md:gap-9">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<Card key={index}>
							<CardContent className="grid gap-2">
								<Skeleton className="h-3 w-20" />
								<Skeleton className="h-7 w-28" />
								<Skeleton className="h-3 w-24" />
							</CardContent>
						</Card>
					))}
				</div>

				<Card>
					<CardHeader className="border-b">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-80 max-w-full" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-64 w-full" />
					</CardContent>
				</Card>

				<section className="grid gap-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<div className="grid gap-2">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-40" />
						</div>
						<Skeleton className="h-9 w-full sm:w-52" />
					</div>
					<div className="grid gap-2">
						<Skeleton className="h-14 w-full" />
						<Skeleton className="h-14 w-full" />
						<Skeleton className="h-14 w-full" />
						<Skeleton className="h-14 w-full" />
					</div>
				</section>
			</div>
		)
	}
	const { period, summary, comparison, series, weekday, future_records_count } = data
	const scopedCategories = categories
		.map(category => {
			const spending = scopedBucketIds.reduce(
				(total, bucketId) => total + (category.bucket_spending[bucketId] ?? 0),
				0,
			)
			const baseline = scopedBucketIds.reduce(
				(total, bucketId) => total + (category.baseline_bucket_spending[bucketId] ?? 0),
				0,
			)
			return {
				...category,
				spending,
				comparison: comparison.count ? spending - baseline : null,
			}
		})
		.filter(category => category.spending !== 0 || category.comparison !== 0)
		.sort((a, b) => b.spending - a.spending)
	const scopedTotal = scopedCategories.reduce((total, category) => total + category.spending, 0)
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
		width: bucket.id === dailyBucketId ? 2.5 : 2,
		dashed: bucket.id === "unbucketed",
	}))
	return (
		<div
			className={cn(
				"grid gap-7 md:gap-9",
				animateContent && "animate-in fade-in slide-in-from-bottom-2 duration-500",
			)}
		>
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
					<SummaryBand summary={summary} comparison={comparison} />
					{summary.unbucketed_count ? (
						<div
							className="flex flex-wrap gap-2"
							aria-label="Records needing attention"
						>
							{summary.unbucketed_count ? (
								<Button variant="outline" size="sm" asChild>
									<Link
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
						<div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)]">
							<CategoryBreakdown
								categories={scopedCategories}
								total={scopedTotal}
								month={month}
								year={year}
								scope={scope}
								comparisonCount={comparison.count}
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

					{summary.contributions || summary.withdrawals ? (
						<InvestmentRow summary={summary} month={month} year={year} />
					) : null}
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
					All spending buckets grouped by weekday, against the 3-month usual
				</CardDescription>
			</CardHeader>
			<CardContent>
				<WeekdayBars stats={weekday.stats} />
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
	if (scope === "Total") {
		return (
			<Badge
				variant="outline"
				style={{ borderColor: "var(--foreground)", color: "var(--foreground)" }}
			>
				Total
			</Badge>
		)
	}
	const bucketColor = color ?? (scope === "Daily" ? "var(--color-emerald-500)" : null)

	return bucketColor ? (
		<Badge variant="outline" style={{ borderColor: bucketColor, color: bucketColor }}>
			{scope}
		</Badge>
	) : (
		<Badge variant="secondary">{scope}</Badge>
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
	const tone = summary.surplus > 0 ? "positive" : summary.surplus < 0 ? "negative" : "neutral"
	return (
		<Card className="gap-0 overflow-hidden py-0">
			<MetricGrid className="rounded-none border-0">
				<DashboardMetric
					icon="lucide:circle-dollar-sign"
					label="Total income"
					value={formatCurrency(summary.income)}
					detail={comparisonText(comparison.income, comparison.count)}
				/>
				<DashboardMetric
					icon="lucide:receipt-text"
					label={summary.spending < 0 ? "Total net refund" : "Total spending"}
					value={formatCurrency(Math.abs(summary.spending))}
					detail={comparisonText(comparison.spending, comparison.count)}
				/>
				<DashboardMetric
					icon="lucide:scale"
					label={`Total ${surplusLabel.toLowerCase()}`}
					value={formatCurrency(Math.abs(summary.surplus))}
					detail="Income less personal spending"
					tone={tone}
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

function CategoryBreakdown({
	categories,
	total,
	month,
	year,
	scope,
	comparisonCount,
}: {
	categories: DashboardCategory[]
	total: number
	month: string
	year: number
	scope: string
	comparisonCount: number
}) {
	const max = Math.max(
		...categories
			.slice(0, 8)
			.flatMap(category => [
				Math.abs(category.spending),
				category.comparison === null
					? 0
					: Math.abs(category.spending - category.comparison),
			]),
		1,
	)
	return (
		<Card>
			<CardHeader>
				<CardTitle>Categories</CardTitle>
				<CardDescription>
					Ranked net spending
					{comparisonCount ? ` · Change from ${comparisonCount}-month average` : ""}
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-1">
				{categories.length ? (
					categories.slice(0, 8).map(category => {
						const usual =
							category.comparison === null
								? null
								: category.spending - category.comparison
						return (
							<Link
								key={category.id}
								href={pathMonthlyRecords({
									month,
									year: String(year),
									category_ids: category.id,
									bucket_id: !["all", "core", "outlier", "other"].includes(scope)
										? scope
										: undefined,
									bucket_group: ["core", "outlier", "other"].includes(scope)
										? scope
										: undefined,
								})}
								className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<div className="min-w-0">
									<div className="flex items-center gap-2">
										<Icon {...category} size={11} />
										<span className="truncate font-medium">
											{category.name}
										</span>
									</div>
									<div className="mt-1.5 grid gap-1">
										<div
											className="h-1 overflow-hidden rounded-full bg-muted"
											title={`${formatCurrency(category.spending)} this month`}
										>
											<div
												className="h-full rounded-full bg-emerald-500"
												style={{
													width: `${(Math.abs(category.spending) / max) * 100}%`,
												}}
											/>
										</div>
										{usual === null ? null : (
											<div
												className="h-1 overflow-hidden rounded-full bg-muted"
												title={`${formatCurrency(usual)} usual`}
											>
												<div
													className="h-full rounded-full bg-muted-foreground/35"
													style={{
														width: `${(Math.abs(usual) / max) * 100}%`,
													}}
												/>
											</div>
										)}
									</div>
								</div>
								<span className="tabular-nums">
									{formatCurrency(category.spending)}
								</span>
							</Link>
						)
					})
				) : (
					<p className="py-8 text-center text-muted-foreground">
						No spending in this scope.
					</p>
				)}
				<p className="mt-3 text-xs text-muted-foreground">
					Select a Category to inspect the matching Records.
				</p>
			</CardContent>
		</Card>
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
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-3">
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
							<div className="flex items-center justify-between gap-3">
								<button
									type="button"
									aria-pressed={activeScope === bucket.id}
									onClick={() => setScope(bucket.id)}
									className="min-w-0 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								>
									<Badge
										variant="outline"
										style={{ borderColor: bucket.color, color: bucket.color }}
									>
										{bucket.name}
									</Badge>
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
							<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
								<span className="capitalize">{bucket.group}</span>
								<div className="flex items-center gap-2">
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
					<Link href={pathMonthlyRecords({ month, year: String(year) })}>
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
			className="flex h-1 w-full overflow-hidden rounded-full bg-muted"
		>
			{excess ? (
				<div
					className="h-full bg-destructive transition-[width]"
					style={{ width: `${excess}%` }}
				/>
			) : null}
			<div
				className="h-full bg-foreground/60 transition-[width]"
				style={{ width: `${withinTarget}%` }}
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
	return (
		<Card size="sm">
			<CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="font-medium">Saving and investment movements</p>
					<p className="text-xs text-muted-foreground">
						Contributions {formatCurrency(summary.contributions)} · Withdrawals{" "}
						{formatCurrency(summary.withdrawals)} · Net{" "}
						{formatCurrency(summary.contributions - summary.withdrawals)}
					</p>
				</div>
				<Button variant="outline" size="sm" asChild>
					<Link
						href={pathMonthlyRecords({
							month,
							year: String(year),
							treatment: "saving_investment",
						})}
					>
						View Records
					</Link>
				</Button>
			</CardContent>
		</Card>
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

function MetricGrid({ className, children }: { className?: string; children: ReactNode }) {
	return (
		<div
			className={cn(
				"grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4",
				className,
			)}
		>
			{children}
		</div>
	)
}

function DashboardMetric({
	icon,
	label,
	value,
	detail,
	tone = "neutral",
}: {
	icon: string
	label: string
	value: string
	detail: string
	tone?: "positive" | "negative" | "neutral"
}) {
	return (
		<div
			className={cn(
				"grid min-h-28 content-between bg-card p-4",
				tone === "positive" && "bg-emerald-950 text-emerald-50",
				tone === "negative" && "bg-red-950 text-red-50",
			)}
		>
			<div
				className={cn(
					"flex items-center gap-2 text-xs font-medium text-muted-foreground",
					tone !== "neutral" && "text-white/65",
				)}
			>
				<span
					className={cn(
						"grid size-7 place-items-center rounded-lg border bg-background text-foreground shadow-xs",
						tone !== "neutral" && "border-white/10 bg-white/10 text-white",
					)}
				>
					<IconifyIcon icon={icon} className="size-3.5" />
				</span>
				{label}
			</div>
			<div className="mt-4">
				<p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
				<p
					className={cn(
						"mt-1 text-xs text-muted-foreground",
						tone !== "neutral" && "text-white/65",
					)}
				>
					{detail}
				</p>
			</div>
		</div>
	)
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
