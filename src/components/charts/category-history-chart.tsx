"use client"

import { DateTime } from "luxon"
import Link from "next/link"
import { useState } from "react"
import BarChart from "@/components/charts/bar-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useHistory } from "@/history"
import { formatCurrency } from "@/lib/utils"
import { BREAKDOWN_MONTHS, type SpendingHistoryMonth } from "@/logic/dashboard"

type SpendingSeries = SpendingHistoryMonth["categories"][number]
type ChartSeries = SpendingSeries & { key: string; members: SpendingSeries[]; total: number }
type ChartMonth = SpendingHistoryMonth & {
	seriesValues: Record<string, number>
	seriesDetails: Record<string, SpendingSeries[]>
}

const visibleSeriesLimit = 8
const otherColor = "var(--muted-foreground)"

export default function CategoryHistoryChart({
	months,
	through,
	monthlyBudgetIds,
	recordHref,
	badge,
}: {
	months: SpendingHistoryMonth[]
	through: string | null
	monthlyBudgetIds: string[] | null
	recordHref: (ids: string, at: DateTime) => string
	badge: React.ReactNode
}) {
	const [active, setActive] = useState<number | null>(null)
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
		series.map(item => [item.key, { label: item.name, color: item.color }]),
	)
	const unavailable = chartData.filter(month => !month.included)
	const selected = chartData.find(month => month.current)
	// The list follows the month being read, and rests on the selected month.
	const shown = (active === null ? undefined : chartData[active]) ?? selected
	const selectedEmpty =
		selected && Object.values(selected.seriesValues).every(value => value === 0)

	return (
		<Card className="h-full min-w-0">
			<CardHeader>
				<CardTitle className="flex flex-wrap items-center gap-2">
					Category trend
					{badge}
				</CardTitle>
				<CardDescription>
					Share of gross spending vs previous {BREAKDOWN_MONTHS} months · refunds excluded
					{through &&
						` · selected days 1–${Number(through.slice(-2))}; prior months in full`}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex min-h-0 flex-1 flex-col gap-3">
				{totalSpending > 0 ? (
					<>
						<BarChart
							label="Category trend"
							className="min-h-60 w-full flex-1 sm:min-h-72"
							labels={chartData.map(month => month.month)}
							layout="share"
							series={series.map(item => ({
								key: item.key,
								label: item.name,
								color: item.color,
								opacity: 0.88,
								values: chartData.map(month => month.seriesValues[item.key] ?? 0),
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
							onActive={setActive}
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

				{shown && totalSpending > 0 ? (
					<MonthBreakdown month={shown} config={config} recordHref={recordHref} />
				) : null}
				{allSeries.length > visibleSeriesLimit && (
					<details className="text-xs text-muted-foreground">
						<summary className="cursor-pointer select-none">
							View all {allSeries.length} categories
						</summary>
						<div className="mt-2 flex flex-wrap gap-x-3 gap-y-2">
							{allSeries.map(item => (
								<span key={item.id} className="flex items-center gap-1.5">
									<span
										className="size-2 rounded-sm"
										style={{ backgroundColor: item.color }}
									/>
									{item.name}
								</span>
							))}
						</div>
					</details>
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
}: {
	month: ChartMonth
	config: Record<string, { label: string; color: string }>
	recordHref: (ids: string, at: DateTime) => string
}) {
	const { handlePush } = useHistory()
	const total = monthTotal(month)
	const entries = Object.entries(month.seriesValues)
		.filter(([, value]) => value > 0)
		.sort(([, a], [, b]) => b - a)
	const share = (value: number) => (total ? `${((value / total) * 100).toFixed(1)}%` : "0%")

	return (
		<div className="grid gap-1 text-xs" aria-live="polite">
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
				entries.map(([key, value]) => {
					const details = month.seriesDetails[key] ?? []
					return (
						<Link
							key={key}
							href={recordHref(
								details.map(item => item.id).join(","),
								DateTime.fromFormat(month.month, "MMM yyyy"),
							)}
							onClick={handlePush("overview")}
							className="grid gap-1 rounded-lg bg-muted/40 px-3 py-2 transition-colors duration-150 ease-out hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
							{details.length > 1 &&
								details.map(item => (
									<div
										key={item.id}
										className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 pl-5 text-muted-foreground"
									>
										<span
											className="size-2 rounded-full"
											style={{ backgroundColor: item.color }}
										/>
										<span className="truncate">{item.name}</span>
										<span className="tabular-nums">
											{formatCurrency(item.spending)}
										</span>
										<span className="w-12 text-right tabular-nums">
											{share(item.spending)}
										</span>
									</div>
								))}
						</Link>
					)
				})
			)}
		</div>
	)
}
