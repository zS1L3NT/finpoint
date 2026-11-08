"use client"

import { DateTime } from "luxon"
import { type ComponentProps, useState } from "react"
import BarChart from "@/components/charts/bar-chart"
import CategorySpendingMix from "@/components/charts/category-spending-mix"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { themeColor } from "@/lib/palette"
import { cn, formatCurrency } from "@/lib/utils"
import { BREAKDOWN_MONTHS, type SpendingHistoryMonth } from "@/logic/dashboard"
import type { Selection } from "@/logic/drilldown"

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
	scopeLabel,
	through,
	monthlyBudgetIds,
	onDrill,
	badge,
	compact = false,
}: {
	months: SpendingHistoryMonth[]
	categories: ComponentProps<typeof CategorySpendingMix>["categories"]
	scopeLabel: string
	through: string | null
	monthlyBudgetIds: string[] | null
	onDrill: (selection: Selection) => void
	compact?: boolean
	badge: React.ReactNode
}) {
	// The breakdown keeps the last month read, so its links stay reachable after the pointer leaves.
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
				"grid gap-5",
				// Side by side the cards stretch to one height. The floor keeps the row from changing
				// height as months with fewer categories shorten the list.
				!compact &&
					"@min-[860px]/dashboard:min-h-[27rem] @min-[860px]/dashboard:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]",
			)}
		>
			<Card className="order-2 min-h-0 min-w-0 @min-[600px]/dashboard:order-1">
				<CardHeader>
					<CardTitle className="flex flex-wrap items-center gap-2">
						{shown?.current
							? "Categories this month"
							: `Categories in ${shown?.month ?? "this month"}`}
						{badge}
					</CardTitle>
					<CardDescription className="tabular-nums">
						{scopeLabel} ·{" "}
						{shown?.current
							? `${formatCurrency(categories.reduce((sum, category) => sum + category.outflow, 0))} expenses · ${formatCurrency(categories.reduce((sum, category) => sum + category.refunds, 0))} refunds = ${formatCurrency(categories.reduce((sum, category) => sum + category.spending, 0))} spending`
							: "Gross spending · refunds excluded"}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col overflow-y-auto">
					{shown?.current ? (
						<div
							role="group"
							aria-label={`Categories in ${shown.month}`}
							aria-live="polite"
						>
							<p className="mb-3 text-xs font-medium">
								{shown.month} · selected month
							</p>
							<CategorySpendingMix
								categories={categories}
								limit={limit}
								onDrill={onDrill}
							/>
						</div>
					) : shown ? (
						<MonthBreakdown
							month={shown}
							config={config}
							onDrill={onDrill}
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
							className="cursor-pointer mt-auto self-start pt-3 text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							{limit === undefined
								? "Show fewer categories"
								: `… ${categoryCount - visibleCategoryLimit} more categories`}
						</button>
					)}
				</CardContent>
			</Card>
			<Card className="order-1 min-h-0 min-w-0 @min-[600px]/dashboard:order-2">
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
						. Hold, hover or focus a month to update the category list.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col gap-3">
					{totalSpending > 0 ? (
						<>
							<BarChart
								label="Category trend"
								onSelect={index => {
									const m = chartData[index]
									if (m?.included)
										onDrill({
											kind: "month",
											value: DateTime.fromFormat(
												m.month,
												"MMM yyyy",
											).toFormat("yyyy-MM"),
										})
								}}
								className="h-60 w-full sm:h-72 @min-[600px]/dashboard:h-auto @min-[600px]/dashboard:min-h-60 @min-[600px]/dashboard:flex-1"
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
								onActive={index => {
									if (index !== null) setPicked(chartData[index]?.month ?? null)
								}}
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
			color: otherColor,
			spending: total,
			monthly_budget_spending: {},
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
		<text textAnchor="middle" className="overflow-visible fill-foreground">
			<tspan x={0} dy="1em">
				{month.month.split(" ")[0]}
			</tspan>
			{month.current && (
				<tspan x={0} dy="1.2em" className="fill-primary">
					{month.month.split(" ")[1]}
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
	onDrill,
	limit,
}: {
	month: ChartMonth
	config: Record<string, { label: string; color: string }>
	onDrill: (selection: Selection) => void
	limit?: number
}) {
	const total = monthTotal(month)
	const entries = Object.entries(month.seriesValues)
		.filter(([, value]) => value > 0)
		.sort(([, a], [, b]) => b - a)
	const share = (value: number) => (total ? `${((value / total) * 100).toFixed(1)}%` : "0%")

	return (
		<div
			role="group"
			aria-label={`Categories in ${month.month}`}
			className="grid gap-4 text-xs"
			aria-live="polite"
		>
			<p className="flex justify-between gap-4 pb-1 font-medium">
				<span>
					{month.month}
					{month.current ? " · selected month" : ""}
				</span>
				{month.included ? (
					<span className="tabular-nums">{formatCurrency(total)}</span>
				) : null}
			</p>
			{!month.included ? (
				<p className="text-muted-foreground">Unavailable: {month.reason}</p>
			) : entries.length === 0 ? (
				<p className="text-muted-foreground">No spending recorded in this period.</p>
			) : (
				entries.slice(0, limit).map(([key, value]) => {
					const details = month.seriesDetails[key] ?? []
					return (
						<div key={key} className="grid gap-1.5">
							<button
								type="button"
								onClick={() =>
									onDrill({
										kind: "category-gross",
										value: details.map(item => item.id).join(","),
										at: DateTime.fromFormat(month.month, "MMM yyyy").toFormat(
											"yyyy-MM",
										),
									})
								}
								className="cursor-pointer group grid min-w-0 gap-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3">
									<span
										className="size-2.5 rounded-full"
										style={{ backgroundColor: config[key]?.color }}
									/>
									<span className="truncate">{config[key]?.label ?? key}</span>
									<span className="font-medium tabular-nums">
										{formatCurrency(value)}
									</span>
									<span className="w-12 text-right text-muted-foreground tabular-nums">
										{share(value)}
									</span>
								</div>
								<div className="h-1.5 overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full"
										style={{
											width: share(value),
											backgroundColor: config[key]?.color,
										}}
									/>
								</div>
							</button>
							{limit === undefined &&
								details.length > 1 &&
								details.map(item => (
									<button
										type="button"
										onClick={() =>
											onDrill({
												kind: "category-gross",
												value: item.id,
												at: DateTime.fromFormat(
													month.month,
													"MMM yyyy",
												).toFormat("yyyy-MM"),
											})
										}
										key={item.id}
										className="cursor-pointer group grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 rounded pl-5 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
									>
										<span
											className="size-2 rounded-full"
											style={{ backgroundColor: themeColor(item.color) }}
										/>
										<span className="truncate">{item.name}</span>
										<span className="tabular-nums">
											{formatCurrency(item.spending)}
										</span>
										<span className="w-12 text-right tabular-nums">
											{share(item.spending)}
										</span>
									</button>
								))}
						</div>
					)
				})
			)}
		</div>
	)
}
