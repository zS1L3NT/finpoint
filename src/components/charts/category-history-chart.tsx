"use client"

import { DateTime } from "luxon"
import Link from "next/link"
import { type ComponentProps, useState } from "react"
import BarChart from "@/components/charts/bar-chart"
import CategorySpendingMix from "@/components/charts/category-spending-mix"
import { UiIcon } from "@/components/icon"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { themeColor } from "@/lib/palette"
import { cn, formatCurrency } from "@/lib/utils"
import { BREAKDOWN_MONTHS, type SpendingHistoryMonth } from "@/logic/dashboard"

type SpendingSeries = SpendingHistoryMonth["categories"][number]
type ChartSeries = SpendingSeries & { key: string; members: SpendingSeries[]; total: number }
type ChartMonth = SpendingHistoryMonth & {
	seriesValues: Record<string, number>
	seriesDetails: Record<string, SpendingSeries[]>
}

const visibleCategoryLimit = 5
const visibleSeriesLimit = 8
const otherColor = "var(--muted-foreground)"

export default function CategoryHistoryChart({
	months,
	categories,
	through,
	monthlyBudgetIds,
	recordHref,
	badge,
}: {
	months: SpendingHistoryMonth[]
	categories: ComponentProps<typeof CategorySpendingMix>["categories"]
	through: string | null
	monthlyBudgetIds: string[] | null
	recordHref: (ids: string, at: DateTime) => string
	badge: React.ReactNode
}) {
	// The breakdown shows the last month selected, so reading another month never swaps it.
	// Kept by month, not position: the months shift when the displayed month changes.
	const [picked, setPicked] = useState<string | null>(null)
	const [expanded, setExpanded] = useState<string | null>(null)
	const scopedMonths = months.map(month => ({
		...month,
		categories: month.categories
			.map(category => ({
				...category,
				spending:
					monthlyBudgetIds === null
						? category.spending
						: monthlyBudgetIds.reduce(
								(sum, id) => sum + (category.monthly_budget_spending[id] ?? 0),
								0,
							),
				records:
					monthlyBudgetIds === null
						? category.records
						: monthlyBudgetIds.reduce(
								(sum, id) => sum + (category.monthly_budget_records[id] ?? 0),
								0,
							),
			}))
			.filter(category => category.spending > 0),
	}))
	const allSeries = aggregateSeries(scopedMonths.filter(month => month.included))
	const series = prepareSeries(allSeries)
	const chartData = prepareMonths(scopedMonths, series)
	const totalSpending = chartData.reduce(
		(sum, month) =>
			sum +
			Object.values(month.seriesValues).reduce((subtotal, value) => subtotal + value, 0),
		0,
	)
	const config = Object.fromEntries(
		series.map(item => [item.key, { label: item.name, color: themeColor(item.color) }]),
	)
	const unavailable = chartData.filter(month => !month.included)
	const selected = chartData.find(month => month.current)
	const shown = chartData.find(month => month.month === picked) ?? selected
	const categoryCount = shown?.current
		? categories.filter(category => category.records > 0).length
		: Object.values(shown?.seriesValues ?? {}).filter(value => value > 0).length
	const limit = expanded === shown?.month ? undefined : visibleCategoryLimit
	const selectedEmpty =
		selected && Object.values(selected.seriesValues).every(value => value === 0)

	return (
		<div
			className={cn(
				"grid items-start gap-5 xl:items-stretch xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]",
				limit !== undefined && "xl:h-[28rem]",
			)}
		>
			<Card className="order-2 min-h-0 min-w-0 xl:order-1">
				<CardHeader>
					<CardTitle className="flex flex-wrap items-center gap-2">
						{shown?.current
							? "Categories this month"
							: `Categories in ${shown?.month ?? "this month"}`}
						{badge}
					</CardTitle>
					{/* The scope is in the badge beside the title, so the line only describes amounts. */}
					<CardDescription className="tabular-nums">
						{shown?.current
							? `${formatCurrency(categories.reduce((sum, category) => sum + category.outflow, 0))} expenses · ${formatCurrency(categories.reduce((sum, category) => sum + category.refunds, 0))} refunds · shares exclude refunds`
							: "Gross spending · refunds excluded"}
					</CardDescription>
				</CardHeader>
				<CardContent className="min-h-0 overflow-y-auto">
					{shown?.current ? (
						<div
							role="group"
							aria-label={`Categories in ${shown.month}`}
							aria-live="polite"
						>
							<p className="mb-2 flex justify-between gap-4 px-2 text-xs font-medium">
								<span>{shown.month} · selected month</span>
								<span className="tabular-nums">
									{formatCurrency(
										categories.reduce(
											(sum, category) => sum + category.outflow,
											0,
										),
									)}
								</span>
							</p>
							<CategorySpendingMix
								categories={categories}
								footnote={null}
								limit={limit}
								recordHref={id =>
									recordHref(id, DateTime.fromFormat(shown.month, "MMM yyyy"))
								}
							/>
						</div>
					) : shown ? (
						<MonthBreakdown
							month={shown}
							config={config}
							recordHref={recordHref}
							limit={limit}
						/>
					) : null}
					{categoryCount > visibleCategoryLimit && (
						<button
							type="button"
							aria-expanded={limit === undefined}
							onClick={() =>
								setExpanded(limit === undefined ? null : (shown?.month ?? null))
							}
							className="mt-2 px-2 text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							{limit === undefined
								? "Show fewer categories"
								: `… ${categoryCount - visibleCategoryLimit} more categories`}
						</button>
					)}
				</CardContent>
			</Card>
			<Card className="order-1 min-h-0 min-w-0 xl:order-2">
				<CardHeader>
					<CardTitle className="flex flex-wrap items-center gap-2">
						Category trend
						{badge}
					</CardTitle>
					<CardDescription>
						Share of gross spending vs previous {BREAKDOWN_MONTHS} months · refunds
						excluded
						{through &&
							` · selected days 1–${Number(through.slice(-2))}; prior months in full`}
						. Select a month to update the category list.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col gap-3">
					{totalSpending > 0 ? (
						<>
							<BarChart
								label="Category trend"
								className="h-60 w-full sm:h-72 xl:h-auto xl:min-h-60 xl:flex-1"
								labels={chartData.map(month => month.month)}
								layout="share"
								series={series.map(item => ({
									key: item.key,
									label: item.name,
									color: themeColor(item.color),
									opacity: 0.88,
									values: chartData.map(
										month => month.seriesValues[item.key] ?? 0,
									),
								}))}
								bottom={54}
								tick={index => <MonthTick month={chartData[index]} />}
								readout={index => {
									const month = chartData[index]
									if (!month) return null
									return (
										<>
											<span className="font-medium">{month.month}</span>
											<span className="text-muted-foreground tabular-nums">
												{month.included
													? `Total ${formatCurrency(monthTotal(month))}`
													: "Unavailable"}
											</span>
										</>
									)
								}}
								onSelect={index => setPicked(chartData[index]?.month ?? null)}
								introKey={months.find(month => month.current)?.month}
							/>
						</>
					) : (
						<p className="py-10 text-center text-xs text-muted-foreground">
							No spending in the available months.
						</p>
					)}

					{selectedEmpty && totalSpending > 0 && (
						<p className="text-xs text-muted-foreground">
							No spending recorded for {selected.month} in this scope
							{through ? ` through day ${Number(through.slice(-2))}` : ""}.
							{through && " Later-dated Records are excluded."}
						</p>
					)}

					{unavailable.length > 0 && (
						<details className="text-xs text-muted-foreground">
							<summary className="cursor-pointer select-none">
								{unavailable.length} {unavailable.length === 1 ? "month" : "months"}{" "}
								unavailable
							</summary>
							<div className="mt-2 grid gap-1 pl-3">
								{unavailable.map(month => (
									<p key={month.month}>
										<span className="font-medium text-foreground">
											{month.month}:
										</span>{" "}
										{month.reason}
									</p>
								))}
							</div>
						</details>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

function aggregateSeries(months: SpendingHistoryMonth[]): (SpendingSeries & { total: number })[] {
	const unique = new Map<string, SpendingSeries & { total: number }>()
	for (const month of months) {
		for (const item of month.categories) {
			const previous = unique.get(item.id)
			unique.set(item.id, { ...item, total: (previous?.total ?? 0) + item.spending })
		}
	}
	return [...unique.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
}

function prepareSeries(items: (SpendingSeries & { total: number })[]): ChartSeries[] {
	const ranked: ChartSeries[] = items.slice(0, visibleSeriesLimit).map((item, index) => ({
		...item,
		key: `series-${index}`,
		members: [item],
	}))
	const other = items.slice(visibleSeriesLimit)
	if (other.length) {
		const total = other.reduce((sum, item) => sum + item.total, 0)
		ranked.push({
			id: "other",
			name: `Other (${other.length})`,
			icon: "",
			color: otherColor,
			spending: total,
			monthly_budget_spending: {},
			records: other.reduce((sum, item) => sum + item.records, 0),
			monthly_budget_records: {},
			total,
			key: "series-other",
			members: other,
		})
	}
	return ranked
}

function prepareMonths(months: SpendingHistoryMonth[], series: ChartSeries[]): ChartMonth[] {
	return months.map(month => {
		const items = month.categories
		const seriesValues: Record<string, number> = {}
		const seriesDetails: Record<string, SpendingSeries[]> = {}
		for (const item of series) {
			const matches = month.included
				? items.filter(value => item.members.some(member => member.id === value.id))
				: []
			seriesValues[item.key] = matches.reduce((sum, match) => sum + match.spending, 0)
			seriesDetails[item.key] = matches
		}
		return { ...month, seriesValues, seriesDetails }
	})
}

function MonthTick({ month }: { month?: ChartMonth }) {
	if (!month) return null
	return (
		<text textAnchor="middle" className="fill-foreground">
			<tspan x={0} dy="1em">
				{month.month}
			</tspan>
			{month.current && (
				<tspan x={0} dy="1.2em" className="fill-primary">
					Selected
				</tspan>
			)}
			{month.included && Object.values(month.seriesValues).every(value => value === 0) && (
				<tspan x={0} dy="1.2em" className="fill-muted-foreground">
					No spending
				</tspan>
			)}
			{!month.included && (
				<tspan x={0} dy="1.2em" className="fill-muted-foreground">
					Unavailable
				</tspan>
			)}
		</text>
	)
}

function monthTotal(month: ChartMonth) {
	return Object.values(month.seriesValues).reduce((sum, value) => sum + value, 0)
}

// Like Revolut's Analytics breakdown, each row opens that month's Records for its Categories.
function MonthBreakdown({
	month,
	config,
	recordHref,
	limit,
}: {
	month: ChartMonth
	config: Record<string, { label: string; color: string }>
	recordHref: (ids: string, at: DateTime) => string
	limit?: number
}) {
	const total = monthTotal(month)
	const entries = Object.entries(month.seriesValues)
		.filter(([, value]) => value > 0)
		.sort(([, a], [, b]) => b - a)
	const share = (value: number) => (total ? `${((value / total) * 100).toFixed(0)}%` : "0%")

	return (
		<div
			role="group"
			aria-label={`Categories in ${month.month}`}
			className="grid gap-0.5"
			aria-live="polite"
		>
			<p className="mb-2 flex justify-between gap-4 px-2 text-xs font-medium">
				<span>
					{month.month}
					{month.current ? " · selected month" : ""}
				</span>
				{month.included ? (
					<span className="tabular-nums">{formatCurrency(total)}</span>
				) : null}
			</p>
			{!month.included ? (
				<p className="text-xs text-muted-foreground">Unavailable: {month.reason}</p>
			) : entries.length === 0 ? (
				<p className="text-xs text-muted-foreground">
					No spending recorded in this period.
				</p>
			) : (
				<>
					{/* One bar split by category, as in the selected month's list. */}
					{entries.length > 1 ? (
						<div
							aria-hidden
							className="mx-2 mb-2 flex h-2 gap-0.5 overflow-hidden rounded-full"
						>
							{entries.map(([key, value]) => (
								<span
									key={key}
									className="h-full first:rounded-l-full last:rounded-r-full"
									style={{
										flex: `${value} 1 0`,
										backgroundColor: config[key]?.color,
									}}
								/>
							))}
						</div>
					) : null}
					{entries.slice(0, limit).map(([key, value]) => {
						const details = month.seriesDetails[key] ?? []
						// One category shows its icon; a group of several lists them beneath.
						const icon = details.length === 1 ? details[0]?.icon : undefined
						return (
							<Link
								key={key}
								href={recordHref(
									details.map(item => item.id).join(","),
									DateTime.fromFormat(month.month, "MMM yyyy"),
								)}
								scroll={false}
								className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-lg px-2 py-1.5 transition-colors duration-150 ease-out hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<span
									aria-hidden
									className="grid size-8 place-items-center rounded-full"
									style={{ backgroundColor: config[key]?.color }}
								>
									{icon ? (
										<UiIcon icon={icon} className="size-4 text-white" />
									) : null}
								</span>
								<span className="grid min-w-0">
									<span className="min-w-0 truncate text-sm font-medium">
										{config[key]?.label ?? key}
									</span>
									<span className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-muted-foreground tabular-nums">
										{recordCount(details)}
										{details.length > 1
											? ` · ${details.length} categories`
											: ""}
									</span>
								</span>
								<span className="grid shrink-0 justify-items-end tabular-nums">
									<span className="text-sm font-medium">
										{formatCurrency(value)}
									</span>
									<span className="text-xs text-muted-foreground">
										{share(value)}
									</span>
								</span>
								{limit === undefined && details.length > 1
									? details.map(item => (
											<span
												key={item.id}
												className="col-span-2 col-start-2 grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 text-xs text-muted-foreground"
											>
												<span
													className="size-2 rounded-full"
													style={{
														backgroundColor: themeColor(item.color),
													}}
												/>
												<span className="truncate">{item.name}</span>
												<span className="tabular-nums">
													{formatCurrency(item.spending)}
												</span>
												<span className="w-12 text-right tabular-nums">
													{share(item.spending)}
												</span>
											</span>
										))
									: null}
							</Link>
						)
					})}
				</>
			)}
		</div>
	)
}

const recordCount = (details: SpendingSeries[]) => {
	const records = details.reduce((sum, item) => sum + item.records, 0)
	return `${records} ${records === 1 ? "Record" : "Records"}`
}
