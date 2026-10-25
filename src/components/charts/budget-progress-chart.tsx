import { DateTime } from "luxon"
import { useMemo } from "react"
import TrendChart from "@/components/charts/trend-chart"
import { parseDatetime, round2 } from "@/lib/utils"
import type { Record } from "@/types"

type BudgetProgressPoint = {
	date: string
	usage: number | null
	projection: number | null
}

export default function BudgetProgressChart({
	records,
	start,
	end,
	limit,
	asOf,
}: {
	records: Record[]
	start: DateTime
	end: DateTime
	limit: number
	asOf: DateTime
}) {
	const data = useMemo(() => buildSeries(records, start, end, asOf), [records, start, end, asOf])
	const last = data.length - 1

	return (
		<div className="grid gap-2">
			<p className="text-xs font-medium text-muted-foreground">Cumulative spending · SGD</p>
			<TrendChart
				label="Cumulative budget spending by day"
				className="h-72 w-full sm:h-80"
				labels={data.map(point => point.date)}
				ticks={[...new Set([0, Math.round(last / 3), Math.round((last * 2) / 3), last])]
					.filter(index => index >= 0)
					.map(index => ({ index, label: data[index]?.date ?? "" }))}
				split={limit}
				reference={{ value: limit, label: "Budget limit" }}
				series={[
					{
						key: "projection",
						label: "Usage (projection)",
						values: data.map(point => point.projection),
						color: "var(--color-amber-400)",
						over: "var(--color-orange-500)",
						dash: "7 5",
						fill: 0.12,
					},
					{
						key: "usage",
						label: "Usage",
						values: data.map(point => point.usage),
						color: "var(--color-emerald-500)",
						over: "var(--color-rose-500)",
						fill: 0.3,
					},
				]}
			/>
		</div>
	)
}

function buildSeries(records: Record[], start: DateTime, end: DateTime, asOf: DateTime) {
	const dayCount =
		Math.max(Math.floor(end.startOf("day").diff(start.startOf("day"), "days").days), 0) + 1
	const elapsedDayCount = Math.min(
		Math.max(Math.floor(asOf.startOf("day").diff(start.startOf("day"), "days").days) + 1, 0),
		dayCount,
	)
	const spendingByDay = new Map<string, number>()

	for (const record of records) {
		const date = parseDatetime(record.datetime)
		if (record.amount >= 0 || date < start.startOf("day") || date > end.endOf("day")) continue
		const key = date.toISODate()
		if (!key) continue
		spendingByDay.set(key, round2((spendingByDay.get(key) ?? 0) - record.amount))
	}

	let cumulative = 0
	const actual: Array<number | null> = []
	for (let index = 0; index < dayCount; index += 1) {
		const date = start.plus({ days: index })
		if (index < elapsedDayCount) {
			cumulative = round2(cumulative + (spendingByDay.get(date.toISODate() ?? "") ?? 0))
			actual.push(cumulative)
		} else {
			actual.push(null)
		}
	}

	const dailyPace = elapsedDayCount ? cumulative / elapsedDayCount : 0
	return Array.from({ length: dayCount }, (_, index): BudgetProgressPoint => {
		const showProjection =
			elapsedDayCount > 0 && index >= elapsedDayCount - 1 && elapsedDayCount < dayCount
		return {
			date: start.plus({ days: index }).toFormat("d MMM"),
			usage: actual[index] ?? null,
			projection: showProjection
				? round2(cumulative + dailyPace * (index + 1 - elapsedDayCount))
				: null,
		}
	})
}
