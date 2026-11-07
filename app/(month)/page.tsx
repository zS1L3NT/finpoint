"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { DateTime } from "luxon"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import CashflowChart from "@/components/charts/cashflow-chart"
import CategoryHistoryChart from "@/components/charts/category-history-chart"
import CategoryMovers from "@/components/charts/category-movers"
import LargestRecords from "@/components/charts/largest-records"
import MonthlyBudgetUsage from "@/components/charts/monthly-budget-usage"
import SpendingCalendar from "@/components/charts/spending-calendar"
import MonthlyBudgetDialog from "@/components/dialogs/monthly-budget"
import { DrillPanel } from "@/components/drill/panel"
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
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useHistory } from "@/history"
import { useDrill } from "@/hooks/use-drill"
import { useMonthParams } from "@/hooks/use-month-params"
import { STALE_MONTH_CLASS, useMonthTransition } from "@/hooks/use-month-transition"
import { useStagedMount } from "@/hooks/use-staged-mount"
import { SPRING, TRANSITION } from "@/lib/motion"
import { themeColor } from "@/lib/palette"
import { cn, formatCurrency, pluralize } from "@/lib/utils"
import {
	buildAttention,
	findLatestRecordMonth,
	getDashboardView,
	type TrendMonth,
} from "@/logic/dashboard"
import { hasWorkspaceActivity, loadDemoWorkspace } from "@/logic/workspace"
import { pathBudgets, pathDashboard, pathImporter, pathMonthlyRecords } from "@/routes"
import type { AnalyticsSummary } from "@/types"

type DashboardView = Awaited<ReturnType<typeof getDashboardView>>
type DashboardData = DashboardView["dashboard"]
type DashboardMonthlyBudget = DashboardData["monthlyBudgets"][number]
type Comparison = DashboardData["comparison"]
type ComparisonValue = Comparison["income"]

export default function DashboardPage() {
	const drill = useDrill()
	const reduced = useReducedMotion()
	const [desktop, setDesktop] = useState(false)
	useEffect(() => {
		const media = matchMedia("(min-width: 1280px)")
		const update = () => setDesktop(media.matches)
		update()
		media.addEventListener("change", update)
		return () => media.removeEventListener("change", update)
	}, [])
	const { handlePush } = useHistory()
	const { month, year } = useMonthParams()
	const contentRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const searchParams = useSearchParams()
	const storedScope = searchParams.get("scope") ?? "all"
	const active = useLiveQuery(() => hasWorkspaceActivity(), [])
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
	const setScope = (value: string) => {
		const params = Object.fromEntries(searchParams.entries())
		if (value === "all") delete params.scope
		else params.scope = value
		router.replace(pathDashboard(params), { scroll: false })
	}
	const paceData = view?.pace
	// The summary and pace chart paint first; the sections below the fold then mount one per
	// frame. Mounting every chart in one commit blocked arrival for ~300ms in production.
	const stage = useStagedMount(2, !!data && !!paceData)
	if (active === undefined || !view || !data || !paceData) return null
	if (active === false) return <DemoOffer />
	const {
		scope,
		scopedBudgetIds,
		scopedCategories,
		scopedComparisonCount,
		scopedDaily,
		scopeLabel,
		scopeColor,
	} = view
	const { period, summary, future_records_count } = data
	// Everything below shows the loaded data, so it takes the data's own month: while the next
	// month loads, labels and links stay with the numbers on screen.
	const dataMonth = data.month ?? month
	const dataYear = data.year
	const comparison = data.comparison
	const paceSeries = paceData.series
	const paceProjection = paceData.projection
	const paceAmount = paceData.paceMonthlyBudget
	const openDay = (date: string) => drill.open({ kind: "day", value: date })
	return (
		<motion.div
			className="grid items-start"
			initial={false}
			animate={{
				gridTemplateColumns: desktop
					? `minmax(0,1fr) ${drill.selection ? 420 : 0}px`
					: "minmax(0,1fr)",
				columnGap: desktop && drill.selection ? 24 : 0,
			}}
			transition={reduced ? TRANSITION.fast : SPRING.smooth}
		>
			<div
				ref={contentRef}
				aria-busy={stale}
				className={cn(
					"reveal @container/dashboard min-w-0 grid gap-5 md:gap-6",
					stale && STALE_MONTH_CLASS,
				)}
			>
				{!period.is_future && data.record_count === 0 ? (
					<EmptyMonthNotice month={dataMonth} year={dataYear} />
				) : null}
				<p
					className="text-base font-medium text-pretty leading-relaxed"
					aria-label="Month headline"
				>
					{view.headline}
				</p>
				{!period.is_future ? (
					<AttentionList
						data={data}
						month={dataMonth}
						year={dataYear}
						onDrill={drill.open}
					/>
				) : null}
				{period.is_future ? (
					<div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-muted/20 p-4">
						<div>
							<p className="text-sm font-semibold">
								Plan for {dataMonth} {dataYear}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Set your monthly amounts below. Spending results begin on 1{" "}
								{dataMonth}.
							</p>
						</div>
						<Button variant="outline" size="sm" asChild>
							<Link
								onClick={handlePush("overview")}
								href={pathMonthlyRecords({
									month: dataMonth,
									year: String(dataYear),
								})}
							>
								{future_records_count
									? `Review ${pluralize(future_records_count, "future-dated Record")}`
									: "Plan Records"}
								<IconifyIcon icon="lucide:arrow-up-right" />
							</Link>
						</Button>
					</div>
				) : (
					<SummaryBand
						summary={summary}
						incomeHistory={view.incomeHistory}
						comparison={comparison}
						trend={view.trend}
						through={period.through}
						onDrill={value => drill.open({ kind: "metric", value })}
					/>
				)}
				<div className="flex flex-wrap items-center justify-between gap-2">
					<ScopeSelect value={scope} budgets={budgets} onChange={setScope} />
				</div>
				<div
					className={cn(
						"grid gap-5",
						!period.is_future &&
							"items-start @min-[860px]/dashboard:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
					)}
				>
					{!period.is_future ? (
						<Card className="min-w-0">
							<CardHeader className="border-b">
								<ScopedCardTitle scope={scopeLabel} color={scopeColor}>
									Spending forecast
								</ScopedCardTitle>
								<CardDescription>
									{paceProjection.available
										? paceProjection.history_remaining !== null
											? `You usually spend ${formatCurrency(paceProjection.history_remaining)} more after ${DateTime.fromISO(period.through ?? "").toFormat("d MMMM")}, plus any scheduled Records.`
											: "At your typical daily pace, plus scheduled Records."
										: "Recorded spending against the monthly plan."}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex min-h-0 flex-1 flex-col">
								<CashflowChart
									data={paceSeries}
									forecast={paceData.forecast}
									month={dataMonth}
									year={dataYear}
									amount={paceAmount?.amount ?? null}
									amountLabel={
										paceData.singleBudget ? (paceAmount?.name ?? null) : "Total"
									}
									showProjection={paceProjection.available}
									onDrill={drill.open}
								/>
								<p className="mt-4 text-sm text-muted-foreground">
									{paceProjection.available
										? `At this pace, spending may reach ${formatCurrency(paceProjection.projected_spending ?? 0)} this month.`
										: `${formatCurrency(paceData.spending)} spent this month.`}
								</p>
							</CardContent>
						</Card>
					) : null}
					<Card className="min-w-0">
						<CardHeader>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<CardTitle>Monthly budgets</CardTitle>
									<CardDescription className="mt-1">
										Spending against each monthly plan
									</CardDescription>
								</div>
								<MonthlyBudgetDialog
									month={dataMonth}
									year={dataYear}
									trigger={
										<Button variant="outline" size="sm">
											<IconifyIcon icon="lucide:plus" /> New Monthly Budget
										</Button>
									}
								/>
							</div>
						</CardHeader>
						<CardContent className="flex flex-1 flex-col">
							<MonthlyBudgetUsage
								budgets={budgets}
								unbudgeted={data.spendingTotals.unbudgeted}
								selected={
									budgets.some(budget => budget.id === scope) ? scope : null
								}
								onDrill={drill.open}
								edit={budget => (
									<MonthlyBudgetDialog
										monthlyBudget={budgets.find(item => item.id === budget.id)}
										month={dataMonth}
										year={dataYear}
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
							<Link
								href={pathBudgets()}
								className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs text-muted-foreground underline underline-offset-4"
							>
								<IconifyIcon icon="lucide:calendar-range" /> Custom-period Budgets ·
								View Budgets
							</Link>
						</CardContent>
					</Card>
				</div>
				{!period.is_future ? (
					<>
						{stage > 0 ? (
							<CategoryHistoryChart
								compact={false}
								key={`${dataMonth}-${dataYear}`}
								categories={scopedCategories}
								scopeLabel={scopeLabel}
								months={data.comparison_history}
								through={period.through}
								monthlyBudgetIds={scope === "all" ? null : scopedBudgetIds}
								onDrill={drill.open}
								badge={
									<ScopeLabel
										scope={scope === "all" ? "All budgets" : scopeLabel}
										color={scopeColor}
									/>
								}
							/>
						) : null}
						{stage > 1 ? (
							<div
								className={
									"grid items-start gap-5 @min-[860px]/dashboard:grid-cols-3"
								}
							>
								<LargestRecords
									month={dataMonth}
									year={dataYear}
									scope={scope}
									onDrill={drill.open}
								/>
								<Card className="min-w-0">
									<CardHeader>
										<ScopedCardTitle
											scope={scope === "all" ? "All budgets" : scopeLabel}
											color={scopeColor}
										>
											Spending calendar
										</ScopedCardTitle>
										<CardDescription>
											Stronger colour means more spending. Select a day to see
											its total and open its Records.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<SpendingCalendar
											month={dataMonth}
											year={dataYear}
											daily={scopedDaily}
											through={period.through}
											onSelect={openDay}
										/>
									</CardContent>
								</Card>
								<Card className="min-w-0">
									<CardHeader>
										<ScopedCardTitle
											scope={scope === "all" ? "All budgets" : scopeLabel}
											color={scopeColor}
										>
											Biggest changes
										</ScopedCardTitle>
										<CardDescription>
											Categories that moved most against your usual spending.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<CategoryMovers
											categories={scopedCategories}
											comparisonCount={scopedComparisonCount}
											comparisonMonths={view.scopedComparisonMonths}
											period={
												data.period.is_current
													? `Days 1–${data.period.through?.slice(-2)}`
													: "Full months"
											}
											onDrill={drill.open}
										/>
									</CardContent>
								</Card>
							</div>
						) : null}
					</>
				) : null}
			</div>
			<AnimatePresence>
				{drill.selection ? (
					<DrillPanel
						selection={drill.selection}
						focus={drill.focus}
						pivot={drill.pivot}
						month={dataMonth}
						year={dataYear}
						scope={scope}
						onScope={setScope}
						close={drill.close}
					/>
				) : null}
			</AnimatePresence>
		</motion.div>
	)
}

function DemoOffer() {
	const [loading, setLoading] = useState(false)

	const handleDemo = async () => {
		setLoading(true)
		try {
			await loadDemoWorkspace()
			toast.success("Demo workspace loaded.")
		} catch {
			toast.error("Could not load demo data.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="reveal mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
			<span className="flex size-12 items-center justify-center rounded-full bg-muted">
				<IconifyIcon icon="lucide:wallet" className="size-6 text-muted-foreground" />
			</span>
			<h2 className="text-lg font-semibold">Start with your bank statements</h2>
			<p className="text-sm text-muted-foreground">
				Import a statement file and Finpoint builds your Records, budgets and charts from
				it. Or explore first with demo data: 3 accounts and 5 months of Records. Reset it
				any time from Data.
			</p>
			<div className="flex flex-wrap justify-center gap-2">
				<Button asChild>
					<Link href={pathImporter()}>
						<IconifyIcon icon="lucide:upload" />
						Import statements
					</Link>
				</Button>
				<Button variant="outline" disabled={loading} onClick={() => void handleDemo()}>
					<IconifyIcon icon="lucide:sparkles" />
					{loading ? "Loading…" : "Try demo data"}
				</Button>
			</div>
		</div>
	)
}

function EmptyMonthNotice({ month, year }: { month: string; year: number }) {
	const { setSearchParams } = useMonthParams()
	const latest = useLiveQuery(() => findLatestRecordMonth({ month, year }), [month, year])

	return (
		<div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-muted/20 p-4">
			<p className="text-sm">Nothing recorded in {month} yet.</p>
			{latest ? (
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setSearchParams(previous => ({
							month: latest.month,
							year: String(latest.year),
							scope: previous.get("scope") ?? undefined,
						}))
					}
				>
					Go to {latest.month}
					<IconifyIcon icon="lucide:arrow-left" />
				</Button>
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
					<SelectItem value="all">
						<span className="size-2 rounded-full bg-foreground" />
						All budgets
					</SelectItem>
					{budgets.map(budget => (
						<SelectItem key={budget.id} value={budget.id}>
							<span
								className="size-2 rounded-full"
								style={{ backgroundColor: themeColor(budget.color) }}
							/>
							{budget.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

function ScopedCardTitle({
	scope,
	color,
	children,
}: {
	scope: string
	color?: string
	children: React.ReactNode
}) {
	return (
		<CardTitle className="flex items-center gap-2">
			{children}
			<ScopeLabel scope={scope} color={color} />
		</CardTitle>
	)
}

function ScopeLabel({ scope, color }: { scope: string; color?: string }) {
	if (scope === "All budgets")
		return <MonthlyBudgetBadge name="All budgets" color="var(--foreground)" />
	return (
		<MonthlyBudgetBadge
			name={scope}
			color={color ?? (scope === "Daily" ? "var(--color-emerald-500)" : null)}
		/>
	)
}

function SummaryBand({
	summary,
	incomeHistory,
	comparison,
	trend,
	through,
	onDrill,
}: {
	summary: AnalyticsSummary
	incomeHistory: DashboardView["incomeHistory"]
	comparison: Comparison
	trend: TrendMonth[]
	through: string | null
	onDrill: (value: string) => void
}) {
	const sparkPeriod = through ? `days 1–${DateTime.fromISO(through).day}` : undefined
	const waiting = through !== null && summary.income === 0

	return (
		<Card className="@container gap-0 overflow-hidden py-0">
			<MetricGrid className="grid-cols-1 rounded-none border-0 lg:grid-cols-1 @min-[600px]:grid-cols-3 @min-[600px]:lg:grid-cols-3">
				{[
					{
						key: "spent",
						label: "Spent",
						icon: "lucide:receipt-text",
						value: formatCurrency(summary.spending),
						detail:
							comparison.count && comparison.spending.difference !== null
								? `${formatCurrency(Math.abs(comparison.spending.difference))} ${comparison.spending.difference >= 0 ? "more" : "less"} than usual${through ? " so far" : ""}`
								: "No comparison history",
						spark: trend.map(m => m.spending),
					},
					{
						key: "income",
						label: "Income",
						icon: "lucide:circle-dollar-sign",
						value:
							summary.income === 0
								? incomeHistory
									? "None yet"
									: "None recorded"
								: formatCurrency(summary.income),
						detail:
							summary.income === 0
								? incomeHistory
									? `Usually ~${formatCurrency(incomeHistory.amount)} by day ${incomeHistory.day}`
									: "Add income ›"
								: comparisonText(comparison.income, comparison.count),
						spark: trend.map(m => m.income),
					},
					{
						key: "leftover",
						label: "Left over",
						icon: "lucide:scale",
						value: waiting ? "—" : formatCurrency(summary.surplus),
						detail: waiting
							? "Waiting for income"
							: summary.surplus_rate === null
								? "Income less personal spending"
								: `${summary.surplus_rate.toFixed(1)}% of income`,
						spark: trend.map(m => m.surplus),
					},
				].map(m => (
					<DashboardMetric
						key={m.key}
						icon={m.icon}
						label={m.label}
						value={m.value}
						detail={m.detail}
						spark={m.spark}
						sparkPeriod={sparkPeriod}
						delta={
							through
								? undefined
								: deltaOf(
										m.key === "income"
											? comparison.income
											: m.key === "spent"
												? comparison.spending
												: comparison.surplus,
										comparison.count,
										m.key === "spent" ? "down" : "up",
									)
						}
						onSelect={() => onDrill(m.key)}
						sparkColor={
							m.key === "income"
								? "var(--income)"
								: m.key === "spent"
									? "var(--spending)"
									: "var(--foreground)"
						}
						tone={
							m.key === "leftover" && !waiting
								? summary.surplus > 0
									? "positive"
									: summary.surplus < 0
										? "negative"
										: "neutral"
								: "neutral"
						}
					/>
				))}
			</MetricGrid>
			<button
				type="button"
				onClick={() => onDrill("saved")}
				className="transition-colors duration-150 ease-out hover:bg-muted/40 active:bg-muted/60 flex min-h-11 cursor-pointer items-center justify-between border-t px-4 py-3 text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
			>
				<span>Saved this month</span>
				<span className="tabular-nums">
					{formatCurrency(summary.contributions - summary.withdrawals)}{" "}
					<IconifyIcon icon="lucide:chevron-right" className="inline size-4" />
				</span>
			</button>
		</Card>
	)
}

function AttentionList({
	data,
	month,
	year,
	onDrill,
}: {
	data: DashboardData
	month: string
	year: number
	onDrill: (selection: import("@/logic/drilldown").Selection) => void
}) {
	const rows = buildAttention(data, month, year)
	if (!rows.length) return null
	return (
		<Card className="gap-0 overflow-hidden py-0" aria-label="Attention">
			<ul className="divide-y">
				{rows.map((row, index) => {
					const content = (
						<>
							<IconifyIcon
								icon={row.icon}
								className={cn(
									"size-4 shrink-0",
									index === 0
										? "text-amber-600 dark:text-amber-400"
										: "text-muted-foreground",
								)}
							/>
							<span className="min-w-0 flex-1">
								<span className="block font-medium">{row.label}</span>
								<span className="block text-xs text-muted-foreground">
									{row.detail}
								</span>
							</span>
							<IconifyIcon
								icon="lucide:chevron-right"
								className="size-4 shrink-0 text-muted-foreground"
							/>
						</>
					)
					const style =
						"flex min-h-11 w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors duration-150 ease-out hover:bg-muted/40 active:bg-muted/60"
					return (
						<li key={row.label}>
							{row.selection ? (
								<button
									type="button"
									className={style}
									onClick={() => row.selection && onDrill(row.selection)}
								>
									{content}
								</button>
							) : (
								<Link className={style} href={row.href ?? ""}>
									{content}
								</Link>
							)}
						</li>
					)
				})}
			</ul>
		</Card>
	)
}

function comparisonText(value: ComparisonValue, count: number) {
	if (!count || value.difference === null) return "No comparison history"
	if (Math.abs(value.difference) < 0.005) return `Same as ${count}-month average`
	return `${formatCurrency(Math.abs(value.difference))} ${value.difference > 0 ? "above" : "below"} ${count}-mo avg`
}

function deltaOf(value: ComparisonValue, count: number, better: "up" | "down"): Delta | undefined {
	if (!count || value.difference === null || Math.abs(value.difference) < 0.005) return undefined
	const up = value.difference > 0
	return {
		text: `${up ? "↑" : "↓"} ${formatCurrency(Math.abs(value.difference)).replace(/\.\d\d$/, "")}`,
		good: up === (better === "up"),
	}
}
