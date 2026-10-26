import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import TrendChart from "@/components/charts/trend-chart"
import { useHistory } from "@/history"
import { dayTicks } from "@/lib/chart-days"
import type { CashflowHistoryMonth } from "@/logic/dashboard"
import { pathMonthlyRecords } from "@/routes"

type SurplusPoint = { day: number; surplus: number | null }

export default function TotalSpendingChart({
	data,
	history,
	month,
	year,
}: {
	data: SurplusPoint[]
	history: CashflowHistoryMonth[]
	month: string
	year: number
}) {
	const router = useRouter()
	const { handlePush } = useHistory()
	// Last month only, as a faint dashed comparison line.
	const previous = history.find(item => item.offset === 1)
	// Last month's extra days are dropped: the chart has no dates past this month's end.
	const length = data.length
	const openDay = (index: number) => {
		if (index >= data.length) return
		const selected = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
			.set({ day: index + 1 })
			.toFormat("yyyy-MM-dd")
		handlePush("overview")()
		void router.push(
			pathMonthlyRecords({
				month,
				year: String(year),
				start_date: selected,
				end_date: selected,
			}),
		)
	}

	return (
		<div className="grid gap-2">
			<TrendChart
				label="Surplus / shortfall by day"
				className="h-52 w-full min-w-0 sm:h-64 xl:h-72"
				labels={Array.from({ length }, (_, index) => `${month} ${index + 1}`)}
				ticks={dayTicks(length).map(day => ({ index: day - 1, label: String(day) }))}
				split={0}
				series={[
					...(previous
						? [
								{
									key: "previous",
									label: previous.month,
									values: Array.from(
										{ length },
										(_, index) => previous.surplus[index] ?? null,
									),
									color: "var(--foreground)",
									dash: "4 4",
									opacity: 0.6,
								},
							]
						: []),
					{
						key: "surplus",
						label: "Surplus / Shortfall",
						values: Array.from({ length }, (_, index) => data[index]?.surplus ?? null),
						color: "var(--color-rose-500)",
						over: "var(--color-emerald-500)",
						fill: 0.3,
					},
				]}
				introKey={`${month}-${year}`}
				onSelect={openDay}
			/>
			<p className="text-xs text-muted-foreground">
				Green is a surplus and red a shortfall.
				{previous ? " The faint dashed line shows last month by day of month." : ""} Hold or
				hover over a day to read it, and click it to open its Records.
			</p>
		</div>
	)
}
