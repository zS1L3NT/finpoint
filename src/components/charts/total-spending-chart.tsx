import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import TrendChart from "@/components/charts/trend-chart"
import { useHistory } from "@/history"
import { dayTicks } from "@/lib/chart-days"
import { cn } from "@/lib/utils"
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
	const historyLines = history.map(item => ({
		...item,
		key: `previous_${item.offset}`,
		opacity: item.offset === 1 ? 0.6 : 0.3,
		dash: item.offset === 1 ? "4 4" : "1 5",
	}))
	const length = Math.max(data.length, ...history.map(item => item.surplus.length))
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
					...historyLines.map(item => ({
						key: item.key,
						label: item.month,
						values: Array.from({ length }, (_, index) => item.surplus[index] ?? null),
						color: "var(--foreground)",
						dash: item.dash,
						opacity: item.opacity,
					})),
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
			<div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
				{historyLines.map(item => (
					<span key={item.key} className="flex items-center gap-1.5">
						<svg width="20" height="4" aria-hidden="true">
							<line
								x1="1"
								y1="2"
								x2="19"
								y2="2"
								stroke="var(--foreground)"
								strokeOpacity={item.opacity}
								strokeWidth={2}
								strokeDasharray={item.dash}
								strokeLinecap="round"
							/>
						</svg>
						{item.month}
					</span>
				))}
				<LegendItem color="bg-emerald-500" label="Surplus above $0" />
				<LegendItem color="bg-rose-500" label="Shortfall below $0" />
			</div>
		</div>
	)
}

function LegendItem({ color, label }: { color: "bg-emerald-500" | "bg-rose-500"; label: string }) {
	return (
		<span className="flex items-center gap-1.5">
			<span className={cn("size-2 rounded-sm", color)} />
			{label}
		</span>
	)
}
