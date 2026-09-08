import { DateTime } from "luxon"
import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatCurrency, parseDatetime, round2dp } from "@/lib/utils"
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
	const isMobile = useIsMobile()
	const data = useMemo(() => buildSeries(records, start, end, asOf), [records, start, end, asOf])
	const interval = isMobile ? Math.max(Math.floor(data.length / 3), 0) : "preserveStartEnd"
	const usageChange = colorChange(data, "usage", limit)
	const projectionChange = colorChange(data, "projection", limit)

	return (
		<ChartContainer
			className="h-72 w-full aspect-auto sm:h-80"
			config={{
				usage: { label: "Usage", color: "var(--color-emerald-500)" },
				projection: { label: "Usage (projection)", color: "var(--color-amber-400)" },
			}}
		>
			<AreaChart data={data} accessibilityLayer>
				<defs>
					<linearGradient id="budget-usage-line" x1="0" y1="0" x2="1" y2="0">
						<stop offset={`${usageChange}%`} stopColor="var(--color-emerald-500)" />
						<stop offset={`${usageChange}%`} stopColor="var(--color-rose-500)" />
					</linearGradient>
					<linearGradient id="budget-usage-fill" x1="0" y1="0" x2="1" y2="0">
						<stop
							offset={`${usageChange}%`}
							stopColor="var(--color-emerald-500)"
							stopOpacity={0.18}
						/>
						<stop
							offset={`${usageChange}%`}
							stopColor="var(--color-rose-500)"
							stopOpacity={0.18}
						/>
					</linearGradient>
					<linearGradient id="budget-projection-line" x1="0" y1="0" x2="1" y2="0">
						<stop offset={`${projectionChange}%`} stopColor="var(--color-amber-400)" />
						<stop offset={`${projectionChange}%`} stopColor="var(--color-orange-500)" />
					</linearGradient>
				</defs>

				<CartesianGrid strokeDasharray="3 3" vertical />
				<XAxis dataKey="date" interval={interval} tickMargin={8} />
				<YAxis
					width={isMobile ? 44 : 64}
					domain={[0, (dataMax: number) => Math.max(dataMax, limit) * 1.05]}
					tickFormatter={compactCurrency}
				/>
				<ReferenceLine
					y={limit}
					stroke="var(--muted-foreground)"
					strokeDasharray="4 4"
					label={{
						value: "Budget limit",
						position: "insideTopRight",
						fill: "var(--muted-foreground)",
						fontSize: 11,
					}}
				/>
				<ChartTooltip
					content={
						<ChartTooltipContent
							formatter={(value, name) => (
								<div className="flex min-w-40 items-center justify-between gap-4">
									<span className="text-muted-foreground">{String(name)}</span>
									<span className="font-medium tabular-nums">
										{formatCurrency(Number(value))}
									</span>
								</div>
							)}
						/>
					}
				/>
				<Area
					dataKey="usage"
					name="Usage"
					stroke="url(#budget-usage-line)"
					fill="url(#budget-usage-fill)"
					strokeWidth={2.5}
					dot={false}
				/>
				<Area
					dataKey="projection"
					name="Usage (projection)"
					stroke="url(#budget-projection-line)"
					fill="transparent"
					strokeWidth={2.5}
					strokeDasharray="7 5"
					dot={false}
					connectNulls
				/>
			</AreaChart>
		</ChartContainer>
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
		spendingByDay.set(key, round2dp((spendingByDay.get(key) ?? 0) - record.amount))
	}

	let cumulative = 0
	const actual: Array<number | null> = []
	for (let index = 0; index < dayCount; index += 1) {
		const date = start.plus({ days: index })
		if (index < elapsedDayCount) {
			cumulative = round2dp(cumulative + (spendingByDay.get(date.toISODate() ?? "") ?? 0))
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
			usage: actual[index],
			projection: showProjection
				? round2dp(cumulative + dailyPace * (index + 1 - elapsedDayCount))
				: null,
		}
	})
}

function colorChange(data: BudgetProgressPoint[], field: "usage" | "projection", limit: number) {
	const index = data.findIndex(point => point[field] !== null && point[field] > limit)
	return index < 0 ? 100 : (index / Math.max(data.length - 1, 1)) * 100
}

function compactCurrency(value: number) {
	if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}k`
	return `$${value}`
}
