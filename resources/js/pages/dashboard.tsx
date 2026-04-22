import { Link } from "@inertiajs/react"
import {
	ArrowDownRightIcon,
	ArrowRightIcon,
	ArrowUpRightIcon,
	CircleDollarSignIcon,
	ImportIcon,
	LinkIcon,
	ReceiptTextIcon,
	SparklesIcon,
} from "lucide-react"
import { DateTime } from "luxon"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { cn, currencyClass, round2dp, toCurrency, toDate, toDatetime } from "@/lib/utils"
import { Account, Budget, Category, Record, Recurrence, Statement } from "@/types"
import {
	allocatorWebRoute,
	budgetsWebRoute,
	budgetWebRoute,
	importerWebRoute,
	recordsWebRoute,
	recordWebRoute,
	recurrenceWebRoute,
	statementWebRoute,
} from "@/wayfinder/routes"

type DashboardSummary = {
	periodLabel: string
	netThisMonth: number
	incomeThisMonth: number
	expensesThisMonth: number
	recordsThisMonth: number
	totalRecords: number
	totalStatements: number
	totalCategories: number
	pendingStatements: number
	allocatorBacklog: number
	activeBudgets: number
	activeBudgetPlanned: number
	activeBudgetSpent: number
	totalBudgets: number
	monthlyRecurring: number
	linkedRecurrenceRecords: number
	totalRecurrences: number
}

type TrendPoint = {
	key: string
	label: string
	month: string
	income: number
	expenses: number
	net: number
	recordCount: number
}

type BudgetSpotlight = Budget & {
	records_sum_amount: number | null
	records_count: number
}

type RecurrenceSpotlight = Recurrence & {
	records_count: number
}

type PendingStatement = Statement & {
	account: Account
	allocations_sum_amount: number | null
}

type RecentRecord = Record & {
	category: Category
}

type CategoryPulse = {
	category: Category
	spent: number
	records_count: number
}

const RECURRENCE_COLORS = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)",
]

export default function DashboardPage({
	summary,
	monthlyTrend,
	budgetSpotlight,
	recurrenceSpotlight,
	pendingStatements,
	recentRecords,
	categoryPulse,
}: {
	summary: DashboardSummary
	monthlyTrend: TrendPoint[]
	budgetSpotlight: BudgetSpotlight[]
	recurrenceSpotlight: RecurrenceSpotlight[]
	pendingStatements: PendingStatement[]
	recentRecords: RecentRecord[]
	categoryPulse: CategoryPulse[]
}) {
	const activeBudgetUsage =
		summary.activeBudgetPlanned === 0
			? 0
			: Math.min((summary.activeBudgetSpent / summary.activeBudgetPlanned) * 100, 100)
	const strongestMonth = monthlyTrend.reduce<TrendPoint | null>(
		(best, point) => (best === null || point.net > best.net ? point : best),
		null,
	)
	const roughestMonth = monthlyTrend.reduce<TrendPoint | null>(
		(worst, point) => (worst === null || point.net < worst.net ? point : worst),
		null,
	)

	return (
		<>
			<AppHeader title="Dashboard" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Dashboard"
					subtitle="Watch allocator pressure, active budget burn, recurring load, and recent ledger movement from one place."
					description="Financial control tower"
					icon={CircleDollarSignIcon}
					actions={
						<>
							<Button size="lg" asChild>
								<Link href={allocatorWebRoute.url()}>
									<LinkIcon /> Open allocator
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href={importerWebRoute.url()}>
									<ImportIcon /> Import statements
								</Link>
							</Button>
						</>
					}
				/>

				<div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
					<Card className="relative overflow-hidden border border-border/70 bg-gradient-to-br from-emerald-500/[0.18] via-card via-45% to-sky-500/[0.12] py-0">
						<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.36),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_36%)]" />
						<CardHeader className="relative border-b border-border/60 py-6">
							<CardDescription className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
								<SparklesIcon className="size-3.5" />
								Financial Control Tower
							</CardDescription>
							<CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
								Money map for {summary.periodLabel}
							</CardTitle>
							<CardDescription className="max-w-2xl text-sm text-muted-foreground">
								Watch allocator pressure, active budget burn, recurring load, and
								recent ledger movement from one place.
							</CardDescription>
						</CardHeader>

						<CardContent className="relative grid gap-6 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
							<div className="space-y-6">
								<div className="flex flex-wrap gap-3">
									<Button size="lg" asChild>
										<Link href={allocatorWebRoute.url()}>
											<LinkIcon /> Open allocator
										</Link>
									</Button>
									<Button size="lg" variant="outline" asChild>
										<Link href={importerWebRoute.url()}>
											<ImportIcon /> Import statements
										</Link>
									</Button>
									<Button size="lg" variant="outline" asChild>
										<Link href={recordsWebRoute.url()}>
											<ReceiptTextIcon /> Browse records
										</Link>
									</Button>
								</div>

								<div className="grid gap-3 sm:grid-cols-3">
									<HeroStat
										label="Records"
										value={summary.totalRecords}
										helper={`${summary.recordsThisMonth} booked this month`}
									/>
									<HeroStat
										label="Statements"
										value={summary.totalStatements}
										helper={`${summary.pendingStatements} still unresolved`}
									/>
									<HeroStat
										label="Categories"
										value={summary.totalCategories}
										helper={`${summary.totalBudgets} budgets in play`}
									/>
								</div>
							</div>

							<div className="rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm backdrop-blur">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
											Net this month
										</p>
										<p
											className={cn(
												"mt-3 text-4xl font-semibold tracking-tight",
												currencyClass(summary.netThisMonth),
											)}
										>
											{toCurrency(summary.netThisMonth)}
										</p>
									</div>

									<div className="flex size-12 items-center justify-center rounded-full bg-muted/80 ring-1 ring-border">
										{summary.netThisMonth >= 0 ? (
											<ArrowUpRightIcon className="size-5 text-green-600" />
										) : (
											<ArrowDownRightIcon className="size-5 text-red-500" />
										)}
									</div>
								</div>

								<div className="mt-6 space-y-3">
									<MetricRow label="Income" amount={summary.incomeThisMonth} />
									<MetricRow
										label="Expenses"
										amount={-summary.expensesThisMonth}
									/>
								</div>

								<div className="mt-6 rounded-xl border border-border/70 bg-muted/35 p-4">
									<div className="flex items-center justify-between text-xs text-muted-foreground">
										<span>Active budget burn</span>
										<span>{Math.round(activeBudgetUsage)}%</span>
									</div>
									<Progress value={activeBudgetUsage} className="mt-3 h-2.5" />
									<div className="mt-3 flex items-center justify-between gap-3 text-xs">
										<span className="text-muted-foreground">
											{toCurrency(summary.activeBudgetSpent)} tracked
										</span>
										<span>
											{toCurrency(summary.activeBudgetPlanned)} planned
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="py-0">
						<CardHeader className="border-b py-4">
							<CardDescription>Category pulse</CardDescription>
							<CardTitle>Last 90 days of spend</CardTitle>
							<CardAction className="text-sm text-muted-foreground">
								{categoryPulse.length} hotspot
								{categoryPulse.length === 1 ? "" : "s"}
							</CardAction>
						</CardHeader>

						<CardContent className="flex flex-col gap-4 py-6">
							{categoryPulse.length ? (
								categoryPulse.map(item => (
									<CategoryPulseRow
										key={item.category.id}
										item={item}
										max={categoryPulse[0]?.spent ?? 0}
									/>
								))
							) : (
								<EmptyPanelMessage message="Add records with categories to surface spending hotspots here." />
							)}
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<SpotlightMetric
						icon={TriangleAlertIcon}
						label="Allocator backlog"
						value={`${summary.pendingStatements} statements`}
						detail={`${toCurrency(summary.allocatorBacklog)} unresolved`}
						href={allocatorWebRoute.url()}
						accentClassName="from-amber-500/[0.16] to-amber-500/[0.05]"
					/>
					<SpotlightMetric
						icon={ReceiptTextIcon}
						label="Records this month"
						value={summary.recordsThisMonth}
						detail={`${toCurrency(summary.incomeThisMonth)} in / ${toCurrency(-summary.expensesThisMonth)} out`}
						href={recordsWebRoute.url()}
						accentClassName="from-sky-500/[0.16] to-sky-500/[0.05]"
					/>
					<SpotlightMetric
						icon={ChartPieIcon}
						label="Active budgets"
						value={summary.activeBudgets}
						detail={`${toCurrency(summary.activeBudgetSpent)} tracked of ${toCurrency(summary.activeBudgetPlanned)}`}
						href={budgetsWebRoute.url()}
						accentClassName="from-fuchsia-500/[0.16] to-fuchsia-500/[0.05]"
					/>
					<SpotlightMetric
						icon={CalendarSyncIcon}
						label="Recurring load"
						value={toCurrency(summary.monthlyRecurring)}
						detail={`${summary.totalRecurrences} items, ${summary.linkedRecurrenceRecords} linked records`}
						href={recurrencesWebRoute.url()}
						accentClassName="from-emerald-500/[0.16] to-emerald-500/[0.05]"
					/>
				</div>

				<div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
					<Card className="py-0">
						<CardHeader className="border-b py-4">
							<CardDescription>Six-month ledger pulse</CardDescription>
							<CardTitle>Income versus expenses</CardTitle>
							<CardAction>
								<Button variant="outline" size="sm" asChild>
									<Link href={recordsWebRoute.url()}>View records</Link>
								</Button>
							</CardAction>
						</CardHeader>

						<CardContent className="grid gap-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
							<LedgerPulseChart points={monthlyTrend} />

							<div className="space-y-4">
								<TrendInsightCard
									label="Strongest month"
									point={strongestMonth}
									emptyMessage="No record activity yet."
								/>
								<TrendInsightCard
									label="Softest month"
									point={roughestMonth}
									emptyMessage="No record activity yet."
								/>

								<div className="rounded-xl border border-border/70 bg-muted/25 p-4">
									<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
										Reading the chart
									</p>
									<div className="mt-3 space-y-3 text-sm text-muted-foreground">
										<div className="flex items-center gap-3">
											<span className="size-3 rounded-full bg-green-600/75" />
											<span>Income booked into records</span>
										</div>
										<div className="flex items-center gap-3">
											<span className="size-3 rounded-full bg-red-500/75" />
											<span>
												Expense outflow normalized as positive height
											</span>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="flex flex-col gap-6">
						<Card className="py-0">
							<CardHeader className="border-b py-4">
								<CardDescription>Budget radar</CardDescription>
								<CardTitle>Where pressure is building</CardTitle>
								<CardAction>
									<Button variant="outline" size="sm" asChild>
										<Link href={budgetsWebRoute.url()}>All budgets</Link>
									</Button>
								</CardAction>
							</CardHeader>

							<CardContent className="flex flex-col gap-4 py-6">
								{budgetSpotlight.length ? (
									budgetSpotlight.map(budget => (
										<BudgetWatchRow key={budget.id} budget={budget} />
									))
								) : (
									<EmptyPanelMessage message="Create budgets to track date-based spending here." />
								)}
							</CardContent>
						</Card>

						<Card className="py-0">
							<CardHeader className="border-b py-4">
								<CardDescription>Recurring load</CardDescription>
								<CardTitle>Monthly commitments snapshot</CardTitle>
								<CardAction className="text-sm text-muted-foreground">
									{toCurrency(summary.monthlyRecurring)} / month
								</CardAction>
							</CardHeader>

							<CardContent className="flex flex-col gap-4 py-6">
								{recurrenceSpotlight.length ? (
									recurrenceSpotlight.map((recurrence, index) => (
										<RecurrenceLoadRow
											key={recurrence.id}
											recurrence={recurrence}
											max={summary.monthlyRecurring}
											color={
												RECURRENCE_COLORS[index % RECURRENCE_COLORS.length]
											}
										/>
									))
								) : (
									<EmptyPanelMessage message="Add recurrences to compare normalized monthly commitments." />
								)}
							</CardContent>
						</Card>
					</div>
				</div>

				<div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
					<Card className="py-0">
						<CardHeader className="border-b py-4">
							<CardDescription>Allocator queue</CardDescription>
							<CardTitle>Statements still needing attention</CardTitle>
							<CardAction>
								<Button variant="outline" size="sm" asChild>
									<Link href={allocatorWebRoute.url()}>
										Open allocator
										<ArrowRightIcon />
									</Link>
								</Button>
							</CardAction>
						</CardHeader>

						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-28">Date</TableHead>
										<TableHead className="w-24">Account</TableHead>
										<TableHead>Description</TableHead>
										<TableHead className="w-28">Amount</TableHead>
										<TableHead className="w-28">Unresolved</TableHead>
										<TableHead className="w-16">Open</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pendingStatements.length ? (
										pendingStatements.map(statement => {
											const unresolved =
												getStatementUnresolvedAmount(statement)

											return (
												<TableRow key={statement.id}>
													<TableCell className="text-muted-foreground">
														{toDate(statement.date)}
													</TableCell>
													<TableCell className="text-muted-foreground">
														{statement.account.id}
													</TableCell>
													<TableCell className="max-w-0 truncate text-muted-foreground">
														{statement.description}
													</TableCell>
													<TableCell
														className={currencyClass(statement.amount)}
													>
														{toCurrency(statement.amount)}
													</TableCell>
													<TableCell
														className={currencyClass(unresolved)}
													>
														{toCurrency(unresolved)}
													</TableCell>
													<TableCell>
														<Button variant="ghost" size="sm" asChild>
															<Link
																href={statementWebRoute.url({
																	statement,
																})}
															>
																View
															</Link>
														</Button>
													</TableCell>
												</TableRow>
											)
										})
									) : (
										<TableRow>
											<TableCell
												colSpan={6}
												className="h-24 text-center text-muted-foreground"
											>
												Allocator queue is clear.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					<Card className="py-0">
						<CardHeader className="border-b py-4">
							<CardDescription>Recent ledger activity</CardDescription>
							<CardTitle>Latest records</CardTitle>
							<CardAction>
								<Button variant="outline" size="sm" asChild>
									<Link href={recordsWebRoute.url()}>
										All records
										<ArrowRightIcon />
									</Link>
								</Button>
							</CardAction>
						</CardHeader>

						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-40">Date &amp; Time</TableHead>
										<TableHead className="w-28">Amount</TableHead>
										<TableHead>Record</TableHead>
										<TableHead className="w-32">Category</TableHead>
										<TableHead className="w-16">Open</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentRecords.length ? (
										recentRecords.map(record => (
											<TableRow key={record.id}>
												<TableCell className="text-muted-foreground">
													{toDatetime(record.datetime)}
												</TableCell>
												<TableCell className={currencyClass(record.amount)}>
													{toCurrency(record.amount)}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-3">
														<Icon {...record.category} size={16} />
														<div className="min-w-0">
															<p className="truncate font-medium">
																{record.title}
															</p>
															<p className="truncate text-muted-foreground">
																{[
																	record.people
																		? `w/ ${record.people}`
																		: null,
																	record.location
																		? `@ ${record.location}`
																		: null,
																]
																	.filter(Boolean)
																	.join(" ") ||
																	record.description ||
																	"No extra context"}
															</p>
														</div>
													</div>
												</TableCell>
												<TableCell className="text-muted-foreground">
													{record.category.name}
												</TableCell>
												<TableCell>
													<Button variant="ghost" size="sm" asChild>
														<Link href={recordWebRoute.url({ record })}>
															View
														</Link>
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={5}
												className="h-24 text-center text-muted-foreground"
											>
												No records found yet.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	)
}

function HeroStat({ label, value, helper }: { label: string; value: number; helper: string }) {
	return (
		<div className="rounded-xl border border-border/60 bg-background/70 p-4 backdrop-blur">
			<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
				{label}
			</p>
			<p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
			<p className="mt-1 text-xs text-muted-foreground">{helper}</p>
		</div>
	)
}

function MetricRow({ label, amount }: { label: string; amount: number }) {
	return (
		<div className="flex items-center justify-between gap-3 rounded-lg bg-muted/35 px-3 py-2">
			<span className="text-sm text-muted-foreground">{label}</span>
			<span className={currencyClass(amount)}>{toCurrency(amount)}</span>
		</div>
	)
}

function SpotlightMetric({
	icon: IconComponent,
	label,
	value,
	detail,
	href,
	accentClassName,
}: {
	icon: typeof TriangleAlertIcon
	label: string
	value: number | string
	detail: string
	href: string
	accentClassName: string
}) {
	return (
		<Card
			className={cn(
				"overflow-hidden border border-border/70 py-0",
				`bg-gradient-to-br ${accentClassName}`,
			)}
		>
			<CardContent className="flex h-full flex-col gap-4 py-5">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
							{label}
						</p>
						<p className="text-2xl font-semibold tracking-tight">{value}</p>
						<p className="text-xs text-muted-foreground">{detail}</p>
					</div>

					<div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background/80 ring-1 ring-border/70">
						<IconComponent className="size-5 text-foreground" />
					</div>
				</div>

				<Button variant="outline" size="sm" className="mt-auto w-fit" asChild>
					<Link href={href}>
						Open
						<ArrowRightIcon />
					</Link>
				</Button>
			</CardContent>
		</Card>
	)
}

function CategoryPulseRow({ item, max }: { item: CategoryPulse; max: number }) {
	const width = max === 0 ? 0 : Math.max((item.spent / max) * 100, 10)

	return (
		<div className="rounded-xl border border-border/70 bg-muted/20 p-4">
			<div className="flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<div className="flex size-9 items-center justify-center rounded-full bg-background ring-1 ring-border">
						<Icon {...item.category} size={16} />
					</div>
					<div className="min-w-0">
						<p className="truncate font-medium">{item.category.name}</p>
						<p className="text-xs text-muted-foreground">
							{item.records_count} record{item.records_count === 1 ? "" : "s"}
						</p>
					</div>
				</div>

				<div className="text-right">
					<p className={currencyClass(-item.spent)}>{toCurrency(-item.spent)}</p>
				</div>
			</div>

			<div className="mt-4 h-2 rounded-full bg-background/80">
				<div
					className="h-full rounded-full"
					style={{
						width: `${width}%`,
						backgroundColor: item.category.color,
					}}
				/>
			</div>
		</div>
	)
}

function LedgerPulseChart({ points }: { points: TrendPoint[] }) {
	const maxValue = Math.max(...points.flatMap(point => [point.income, point.expenses]), 1)

	return (
		<div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
			<div className="grid grid-cols-6 gap-3">
				{points.map(point => {
					const incomeHeight = Math.max(
						(point.income / maxValue) * 100,
						point.income ? 10 : 4,
					)
					const expenseHeight = Math.max(
						(point.expenses / maxValue) * 100,
						point.expenses ? 10 : 4,
					)

					return (
						<div key={point.key} className="flex flex-col items-center gap-3">
							<div className="flex h-56 w-full items-end justify-center gap-2 rounded-xl bg-background/80 px-2 py-3 ring-1 ring-border/60">
								<div
									className="w-4 rounded-full bg-green-600/80"
									style={{ height: `${incomeHeight}%` }}
								/>
								<div
									className="w-4 rounded-full bg-red-500/80"
									style={{ height: `${expenseHeight}%` }}
								/>
							</div>

							<div className="space-y-1 text-center">
								<p className="font-medium">{point.label}</p>
								<p className={cn("text-[11px]", currencyClass(point.net))}>
									{toCurrency(point.net)}
								</p>
								<p className="text-[11px] text-muted-foreground">
									{point.recordCount} record{point.recordCount === 1 ? "" : "s"}
								</p>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

function TrendInsightCard({
	label,
	point,
	emptyMessage,
}: {
	label: string
	point: TrendPoint | null
	emptyMessage: string
}) {
	return (
		<div className="rounded-xl border border-border/70 bg-muted/25 p-4">
			<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
				{label}
			</p>

			{point ? (
				<div className="mt-3 space-y-2">
					<div className="flex items-center justify-between gap-3">
						<p className="font-medium">{point.month}</p>
						<p className={currencyClass(point.net)}>{toCurrency(point.net)}</p>
					</div>
					<p className="text-sm text-muted-foreground">
						{toCurrency(point.income)} in and {toCurrency(-point.expenses)} out across{" "}
						{point.recordCount} record
						{point.recordCount === 1 ? "" : "s"}.
					</p>
				</div>
			) : (
				<p className="mt-3 text-sm text-muted-foreground">{emptyMessage}</p>
			)}
		</div>
	)
}

function BudgetWatchRow({ budget }: { budget: BudgetSpotlight }) {
	const usage = getBudgetUsage(budget)
	const remaining = getBudgetRemaining(budget)
	const status = getBudgetStatus(budget)

	return (
		<div className="rounded-xl border border-border/70 bg-muted/20 p-4">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 space-y-1">
					<div className="flex items-center gap-2">
						<p className="truncate font-medium">{budget.name}</p>
						<span className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border/70">
							{status}
						</span>
					</div>
					<p className="truncate text-xs text-muted-foreground">
						{toDate(budget.start_date)} to {toDate(budget.end_date)}
					</p>
					<p className="text-xs text-muted-foreground">
						{budget.records_count} linked record{budget.records_count === 1 ? "" : "s"}
						{budget.automatic ? " • auto" : " • manual"}
					</p>
				</div>

				<Button variant="outline" size="sm" asChild>
					<Link href={budgetWebRoute.url({ budget })}>Open</Link>
				</Button>
			</div>

			<div className="mt-4 space-y-2">
				<div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
					<span>{Math.round(usage)}% used</span>
					<span>
						{toCurrency(-getBudgetSpent(budget))} of {toCurrency(budget.amount)}
					</span>
				</div>
				<Progress value={usage} className="h-2.5" />
				<div className="flex items-center justify-between gap-3 text-xs">
					<span className="text-muted-foreground">Remaining</span>
					<span
						className={cn(
							"font-medium",
							remaining < 0 ? "text-destructive" : "text-foreground",
						)}
					>
						{toCurrency(remaining)}
					</span>
				</div>
			</div>
		</div>
	)
}

function RecurrenceLoadRow({
	recurrence,
	max,
	color,
}: {
	recurrence: RecurrenceSpotlight
	max: number
	color: string
}) {
	const monthlyAmount = round2dp(toMonthlyAmount(recurrence.amount, recurrence.period))
	const width = max === 0 ? 0 : Math.max((monthlyAmount / max) * 100, 12)

	return (
		<div className="rounded-xl border border-border/70 bg-muted/20 p-4">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 space-y-1">
					<p className="truncate font-medium">{recurrence.name}</p>
					<p className="text-xs text-muted-foreground">
						{formatRecurrencePeriod(recurrence.period)} cadence •{" "}
						{recurrence.records_count} linked record
						{recurrence.records_count === 1 ? "" : "s"}
					</p>
				</div>

				<Button variant="outline" size="sm" asChild>
					<Link href={recurrenceWebRoute.url({ recurrence })}>Open</Link>
				</Button>
			</div>

			<div className="mt-4 h-2 rounded-full bg-background/80">
				<div
					className="h-full rounded-full"
					style={{
						width: `${width}%`,
						backgroundColor: color,
					}}
				/>
			</div>

			<div className="mt-3 flex items-center justify-between gap-3 text-xs">
				<span className="text-muted-foreground">Normalized monthly load</span>
				<span className={currencyClass(-monthlyAmount)}>{toCurrency(-monthlyAmount)}</span>
			</div>
		</div>
	)
}

function EmptyPanelMessage({ message }: { message: string }) {
	return (
		<div className="rounded-xl border border-dashed border-border/70 bg-muted/10 px-4 py-10 text-center text-sm text-muted-foreground">
			{message}
		</div>
	)
}

function getStatementUnresolvedAmount(statement: PendingStatement) {
	return round2dp(statement.amount - (statement.allocations_sum_amount ?? 0))
}

function getBudgetSpent(budget: BudgetSpotlight) {
	return Math.abs(Math.min(budget.records_sum_amount ?? 0, 0))
}

function getBudgetRemaining(budget: BudgetSpotlight) {
	return round2dp(budget.amount - getBudgetSpent(budget))
}

function getBudgetUsage(budget: BudgetSpotlight) {
	return budget.amount === 0 ? 0 : Math.min((getBudgetSpent(budget) / budget.amount) * 100, 100)
}

function getBudgetStatus(budget: Budget) {
	const today = DateTime.now().startOf("day")
	const start = DateTime.fromFormat(budget.start_date, "yyyy-MM-dd").startOf("day")
	const end = DateTime.fromFormat(budget.end_date, "yyyy-MM-dd").endOf("day")

	if (!start.isValid || !end.isValid) {
		return "Unscheduled"
	}

	if (today < start) {
		return "Upcoming"
	}

	if (today > end) {
		return "Ended"
	}

	return "Active"
}

function toMonthlyAmount(amount: number, period: Recurrence["period"]) {
	switch (period) {
		case "week":
			return (amount * 52) / 12
		case "year":
			return amount / 12
		default:
			return amount
	}
}

function formatRecurrencePeriod(period: Recurrence["period"]) {
	return period === "week" ? "Weekly" : period === "year" ? "Yearly" : "Monthly"
}
