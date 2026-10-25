import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import TrendChart from "@/components/charts/trend-chart"
import { useHistory } from "@/history"
import { dayTicks } from "@/lib/chart-days"
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
	// Last month only, as a faint dashed comparison line.
	const previous = history.find(item => item.offset === 1)
	const length = Math.max(data.length, previous?.spending.length ?? 0)
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
						...(previous
							? [
									{
										key: "previous",
										label: previous.month,
										values: Array.from(
											{ length },
											(_, index) => previous.spending[index] ?? null,
										),
										color: "var(--foreground)",
										dash: "4 4",
										opacity: 0.6,
									},
								]
							: []),
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
			</div>

			<p className="text-xs text-muted-foreground">
				{showProjection
					? "The dashed line extends the current gross spending pace and includes later-dated Records already entered. Select a day to open its Records."
					: "The solid line shows recorded spending. Select a day to open its Records."}
				{previous ? " The faint dashed line shows last month by day of month." : ""}
			</p>
		</div>
	)
}
