import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import TrendChart from "@/components/charts/trend-chart"
import { useHistory } from "@/history"
import { dayTicks } from "@/lib/chart-days"
import { formatCurrency } from "@/lib/utils"
import type { CashflowHistoryMonth } from "@/logic/dashboard"
import { pathMonthlyRecords } from "@/routes"

export type CashflowPoint = {
	day: number
	income: number | null
	spending: number | null
	projected_spending: number | null
	surplus: number | null
	average_spending: number | null
}

export default function CashflowChart({
	data,
	history,
	month,
	year,
	amount,
	amountLabel,
	showProjection,
	recordFilters,
}: {
	data: CashflowPoint[]
	history: CashflowHistoryMonth[]
	month: string
	year: number
	recordFilters?: Record<string, string | undefined>
	amount: number | null
	amountLabel: string | null
	showProjection: boolean
}) {
	const router = useRouter()
	const { handlePush } = useHistory()
	const historyLines = history.map(item => ({
		...item,
		key: `previous_${item.offset}`,
		opacity: item.offset === 1 ? 0.6 : 0.3,
		dash: item.offset === 1 ? "4 4" : "1 5",
	}))
	const length = Math.max(data.length, ...history.map(item => item.spending.length))
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
				...recordFilters,
			}),
		)
	}
	const values = (field: "spending" | "projected_spending") =>
		Array.from({ length }, (_, index) => data[index]?.[field] ?? null)

	return (
		<div className="grid gap-4" aria-label="Cumulative income, spending, and surplus">
			<div>
				<p className="mb-2 text-xs font-medium text-muted-foreground">
					Cumulative spending · SGD
				</p>
				<TrendChart
					label="Cumulative spending by day"
					className="h-52 w-full min-w-0 sm:h-64"
					labels={Array.from({ length }, (_, index) => `${month} ${index + 1}`)}
					ticks={dayTicks(length).map(day => ({ index: day - 1, label: String(day) }))}
					split={amount ?? undefined}
					reference={
						amount === null
							? null
							: { value: amount, label: `${amountLabel ?? "Monthly"} amount` }
					}
					series={[
						...historyLines.map(item => ({
							key: item.key,
							label: item.month,
							values: Array.from(
								{ length },
								(_, index) => item.spending[index] ?? null,
							),
							color: "var(--foreground)",
							dash: item.dash,
							opacity: item.opacity,
						})),
						...(showProjection
							? [
									{
										key: "projected_spending",
										label: "Usage (projection)",
										values: values("projected_spending"),
										color: "var(--color-amber-400)",
										over: "var(--color-orange-500)",
										dash: "7 5",
										fill: 0.12,
									},
								]
							: []),
						{
							key: "spending",
							label: "Usage",
							values: values("spending"),
							color: "var(--color-emerald-500)",
							over: "var(--color-rose-500)",
							fill: 0.3,
						},
					]}
					introKey={`${month}-${year}`}
					onSelect={openDay}
				/>
				<div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
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
					<LegendItem color="bg-emerald-500" label="Usage" />
					<LegendItem color="bg-rose-500" label="Exceed" />
					{showProjection ? (
						<>
							<LegendItem color="bg-amber-400" label="Usage (projection)" />
							<LegendItem color="bg-orange-500" label="Exceed (projection)" />
						</>
					) : null}
				</div>
			</div>

			<details className="rounded-md border px-3 py-2 text-xs">
				<summary className="cursor-pointer font-medium">Daily chart data</summary>
				<div className="mt-2 overflow-x-auto">
					<table className="w-full min-w-120 border-collapse text-right tabular-nums">
						<thead className="text-muted-foreground">
							<tr>
								<th className="border-b py-1 text-left font-medium">Day</th>
								<th className="border-b py-1 font-medium">Income</th>
								<th className="border-b py-1 font-medium">Spending</th>
								{showProjection ? (
									<th className="border-b py-1 font-medium">Projected</th>
								) : null}
								<th className="border-b py-1 font-medium">Surplus</th>
								<th className="border-b py-1 font-medium">Average spending</th>
							</tr>
						</thead>
						<tbody>
							{data.map(point => (
								<tr key={point.day}>
									<th className="border-b py-1 text-left font-normal">
										{point.day}
									</th>
									<td className="border-b py-1">
										{currencyOrDash(point.income)}
									</td>
									<td className="border-b py-1">
										{currencyOrDash(point.spending)}
									</td>
									{showProjection ? (
										<td className="border-b py-1">
											{currencyOrDash(point.projected_spending)}
										</td>
									) : null}
									<td className="border-b py-1">
										{currencyOrDash(point.surplus)}
									</td>
									<td className="border-b py-1">
										{point.average_spending === null
											? "—"
											: formatCurrency(point.average_spending)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</details>
			<p className="text-xs text-muted-foreground">
				{showProjection
					? "The dashed line extends the current gross spending pace and includes later-dated Records already entered. Select a day to open its Records."
					: "The solid line shows recorded spending. Select a day to open its Records."}
				{history.length
					? " Faint dashed and dotted lines show the previous two months by day of month."
					: ""}
			</p>
		</div>
	)
}

function LegendItem({ color, label }: { color: string; label: string }) {
	return (
		<span className="flex items-center gap-1.5">
			<span className={`size-2 rounded-sm ${color}`} />
			{label}
		</span>
	)
}

function currencyOrDash(value: number | null) {
	return value === null ? "—" : formatCurrency(value)
}
