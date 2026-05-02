import { DateTime } from "luxon"
import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, Line, ReferenceLine, XAxis, YAxis } from "recharts"
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { parseDatetime, round2dp } from "@/lib/utils"
import { Category, Record } from "@/types"

type RecordExtra = {
	category: Category
}

export default function UsageAreaChart({
	className,
	records,
	limit,
	start,
	end,
}: {
	className?: string
	records: (Record & RecordExtra)[]
	limit: number
	start: DateTime
	end: DateTime
}) {
	const data = useMemo(() => {
		let elapsedSpending = records
			.filter(r => parseDatetime(r.datetime) < start)
			.reduce((acc, el) => acc - el.amount, 0)
		let elapsedDays = 0

		const dates: DateTime[] = []
		const elapsedValues: (number | null)[] = []
		const projectedValues: (number | null)[] = []

		const data: {
			[date: string]: { ein?: number; eout?: number; pin?: number; pout?: number }
		} = {}

		// Calculate values for all dates
		for (let i = 0; i <= end.diff(start, "days").days; i++) {
			const date = start.plus({ days: i })
			dates.push(date)
			data[date.toFormat("d MMM y")] = {}

			elapsedValues[i] = null
			projectedValues[i] = null

			if (DateTime.now().endOf("day") >= date.endOf("day")) {
				const amount = round2dp(
					records
						.filter(r => parseDatetime(r.datetime).hasSame(date, "day"))
						.reduce((acc, el) => acc - el.amount, 0),
				)

				elapsedSpending = round2dp(elapsedSpending + amount)
				elapsedDays += 1

				if (i === 0) {
					elapsedValues[i] = amount
				} else {
					// biome-ignore lint/style/noNonNullAssertion: Previous values are always non-null
					elapsedValues[i] = round2dp(elapsedValues[i - 1]! + amount)
				}
			}

			if (DateTime.now().startOf("day") <= date.startOf("day")) {
				const currentPace = elapsedDays > 0 ? round2dp(elapsedSpending / elapsedDays) : 0

				projectedValues[i] = round2dp(elapsedSpending + currentPace * (i + 1 - elapsedDays))
			}
		}

		// Determine in-budget and out-of-budget segments for elapsed dates
		for (let i = 0; i < dates.length; i++) {
			const date = dates[i]
			const key = date.toFormat("d MMM y")

			const elapsedValue = elapsedValues[i]
			if (elapsedValue === null) continue

			if (elapsedValue <= limit) {
				data[key].ein = elapsedValue

				// Currently doesn't exceed budget, but will exceed on next day
				const nextElapsedValue = elapsedValues[i + 1]
				if (nextElapsedValue !== null && nextElapsedValue > limit) {
					data[key].eout = elapsedValue
				}
			} else {
				data[key].eout = elapsedValue
			}
		}

		// Determine in-budget and out-of-budget segments for projected dates
		for (let i = 0; i < dates.length; i++) {
			const date = dates[i]
			const key = date.toFormat("d MMM y")

			const projectedValue = projectedValues[i]
			if (projectedValue === null) continue

			if (projectedValue <= limit) {
				data[key].pin = projectedValue

				// Currently doesn't exceed budget, but will exceed on next day
				const nextProjectedValue = projectedValues[i + 1]
				if (nextProjectedValue !== null && nextProjectedValue > limit) {
					data[key].pout = projectedValue

					// Condition to skip setting projected in-budget
					const previousProjectedValue = projectedValues[i - 1]
					if (previousProjectedValue === null) {
						delete data[key].pin
					}
				}
			} else {
				data[key].pout = projectedValue
			}
		}

		return Object.entries(data).map(([date, { ein, eout, pin, pout }]) => ({
			date,
			ein,
			eout,
			pin,
			pout,
		}))
	}, [records, limit, start, end])

	return (
		<ChartContainer
			className={className}
			config={{
				ein: { label: "Usage" },
				eout: { label: "Exceed" },
				pin: { label: "Usage (Projection)" },
				pout: { label: "Exceed (Projection)" },
			}}
		>
			<AreaChart data={data}>
				<CartesianGrid />
				<XAxis dataKey="date" />
				<YAxis
				// ticks={Array.from(
				// 	{
				// 		length:
				// 			Math.floor(Math.max(projectedSpending, budget.amount) / 100) + 1,
				// 	},
				// 	(_, i) => i * 100,
				// )}
				/>

				<Area
					dataKey="ein"
					fill="var(--color-green-600)"
					fillOpacity={0.1}
					stroke="var(--color-green-600)"
					strokeWidth={2}
				/>
				<Area
					dataKey="eout"
					fill="var(--color-red-500)"
					fillOpacity={0.1}
					stroke="var(--color-red-500)"
					strokeWidth={2}
				/>

				<Line
					dataKey="pin"
					fill="var(--foreground)"
					fillOpacity={0.1}
					stroke="var(--foreground)"
					strokeWidth={2}
					dot={false}
					animationBegin={1000}
				/>
				<Line
					dataKey="pout"
					fill="var(--color-orange-500)"
					fillOpacity={0.1}
					stroke="var(--color-orange-500)"
					strokeWidth={2}
					dot={false}
					animationBegin={1000}
				/>

				<ReferenceLine label="Limit" y={limit} />

				<ChartTooltip cursor={false} content={<ChartTooltipContent className="w-50" />} />

				<ChartLegend content={<ChartLegendContent />} />
			</AreaChart>
		</ChartContainer>
	)
}
