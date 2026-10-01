"use client"

import type { ReactNode } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/utils"
import type { SpendingHistoryMonth } from "@/logic/dashboard"

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
	comparisonMonths,
	through,
	bucketIds,
	label,
	control,
}: {
	months: SpendingHistoryMonth[]
	comparisonMonths: number
	through: string | null
	bucketIds: string[] | null
	label: ReactNode
	control: ReactNode
}) {
	const scopedMonths = months.map(month => ({
		...month,
		categories: month.categories
			.map(category => ({
				...category,
				spending:
					bucketIds === null
						? category.spending
						: bucketIds.reduce(
								(sum, id) => sum + (category.bucket_spending[id] ?? 0),
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
	const selectedEmpty =
		selected && Object.values(selected.seriesValues).every(value => value === 0)

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex flex-wrap items-center gap-2 text-base">
					Spending by category across months
					{label}
				</CardTitle>
				<CardDescription>
					Share of gross spending compared with the previous {comparisonMonths} months.
					Refunds are excluded.
					{through &&
						` Current and previous months include days 1–${Number(through.slice(-2))} only.`}
				</CardDescription>
				<CardAction>{control}</CardAction>
			</CardHeader>
			<CardContent className="grid gap-3">
				{totalSpending > 0 ? (
					<>
						<div className="w-full overflow-x-auto overflow-y-hidden">
							<ChartContainer
								config={config}
								className="h-80 w-full aspect-auto sm:h-[360px]"
								style={{ minWidth: Math.max(420, months.length * 78) }}
							>
								<BarChart
									data={chartData}
									margin={{ top: 8, right: 12, bottom: 8, left: 4 }}
									stackOffset="expand"
								>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="month"
										interval={0}
										height={54}
										tickLine={false}
										axisLine={false}
										tick={<MonthTick data={chartData} />}
									/>
									<YAxis
										type="number"
										domain={[0, 1]}
										width={64}
										tickLine={false}
										axisLine={false}
										tickFormatter={value =>
											`${Math.round(Number(value) * 100)}%`
										}
									/>
									<ChartTooltip
										cursor={{ fill: "var(--muted)", fillOpacity: 0.35 }}
										content={<HistoryTooltip config={config} />}
									/>
									{series.map(item => (
										<Bar
											key={item.key}
											dataKey={`seriesValues.${item.key}`}
											stackId="spending"
											name={item.name}
											fill={item.color}
											fillOpacity={0.88}
											maxBarSize={64}
											isAnimationActive={false}
										/>
									))}
								</BarChart>
							</ChartContainer>
						</div>
					</>
				) : (
					<p className="py-10 text-center text-sm text-muted-foreground">
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

				{series.length > 0 && (
					<div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-muted-foreground">
						{series.map(item => (
							<span key={item.key} className="flex items-center gap-1.5">
								<span
									className="size-2 rounded-sm"
									style={{ backgroundColor: item.color }}
								/>
								{item.name}
							</span>
						))}
					</div>
				)}
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
			bucket_spending: {},
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

function MonthTick({
	x = 0,
	y = 0,
	payload,
	data,
}: {
	x?: number
	y?: number
	payload?: { value: string }
	data: ChartMonth[]
}) {
	const month = data.find(item => item.month === payload?.value)
	return (
		<g transform={`translate(${x},${y})`}>
			<text textAnchor="middle" className="fill-foreground text-[11px]">
				<tspan x={0} dy="1em">
					{month?.month ?? payload?.value}
				</tspan>
				{month?.current && (
					<tspan x={0} dy="1.2em" className="fill-primary">
						Selected
					</tspan>
				)}
				{month?.included &&
					Object.values(month.seriesValues).every(value => value === 0) && (
						<tspan x={0} dy="1.2em" className="fill-muted-foreground">
							No spending
						</tspan>
					)}
				{month && !month.included && (
					<tspan x={0} dy="1.2em" className="fill-muted-foreground">
						Unavailable
					</tspan>
				)}
			</text>
		</g>
	)
}

function HistoryTooltip({
	active,
	payload,
	label,
	config,
}: {
	active?: boolean
	payload?: { payload?: ChartMonth }[]
	label?: string
	config: Record<string, { label: string; color: string }>
}) {
	if (!active || !payload?.length) return null
	const month = payload[0]?.payload
	if (!month) return null
	if (!month.included) {
		return (
			<div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl">
				<p className="font-medium">{label}</p>
				<p className="text-muted-foreground">Unavailable: {month.reason}</p>
			</div>
		)
	}
	const entries = Object.entries(month.seriesValues).filter(([, value]) => value > 0)
	const total = entries.reduce((sum, [, value]) => sum + value, 0)
	return (
		<div className="max-h-72 min-w-48 overflow-y-auto rounded-lg border bg-background px-3 py-2 text-xs shadow-xl">
			<p className="mb-2 font-medium">
				{label}
				{month.current ? " · selected month" : ""}
			</p>
			{entries.length === 0 && (
				<p className="text-muted-foreground">No spending recorded in this period.</p>
			)}
			{entries.map(([key, value]) => {
				const details = month.seriesDetails[key] ?? []
				return (
					<div key={key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 py-0.5">
						<span className="truncate text-muted-foreground">
							{config[key]?.label ?? key}
						</span>
						<span className="font-medium tabular-nums">
							{formatCurrency(value)} ·{" "}
							{total ? `${((value / total) * 100).toFixed(1)}%` : "0%"}
						</span>
						{details.length > 1 && (
							<div className="col-span-2 ml-2 mt-1 grid gap-0.5 border-l pl-2">
								{details.map(item => (
									<p key={item.id} className="flex justify-between gap-3">
										<span className="truncate text-muted-foreground">
											{item.name}
										</span>
										<span className="tabular-nums">
											{formatCurrency(item.spending)} ·{" "}
											{total
												? `${((item.spending / total) * 100).toFixed(1)}%`
												: "0%"}
										</span>
									</p>
								))}
							</div>
						)}
					</div>
				)
			})}
			<p className="mt-2 border-t pt-1 font-medium">Total {formatCurrency(total)}</p>
		</div>
	)
}
