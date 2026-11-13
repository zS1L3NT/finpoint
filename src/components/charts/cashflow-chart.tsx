import { DateTime } from "luxon"
import TrendChart from "@/components/charts/trend-chart"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import { useRecordsSheet } from "@/hooks/use-records-sheet"
import { dayTicks } from "@/lib/chart-days"
import { themeColor } from "@/lib/palette"
import type { getPaceView } from "@/logic/dashboard"

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
	forecast,
	month,
	year,
	amount,
	amountLabel,
	showProjection,
	recordFilters,
}: {
	data: CashflowPoint[]
	forecast: Awaited<ReturnType<typeof getPaceView>>["forecast"]
	month: string
	year: number
	recordFilters?: Record<string, string | undefined>
	amount: number | null
	amountLabel: string | null
	showProjection: boolean
}) {
	const sheet = useRecordsSheet()
	const length = data.length
	const openDay = (index: number) => {
		if (index >= data.length) return
		const selected = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
			.set({ day: index + 1 })
			.toFormat("yyyy-MM-dd")
		sheet.open({ start_date: selected, end_date: selected, ...recordFilters })
	}

	return (
		<div
			className="flex min-h-0 flex-1 flex-col gap-4"
			aria-label="Cumulative income, spending, and surplus"
		>
			<div className="flex min-h-0 flex-1 flex-col">
				<p className="mb-2 text-xs font-medium text-muted-foreground">
					Cumulative spending · SGD
				</p>
				<TrendChart
					label="Cumulative spending by day"
					className="h-52 w-full min-w-0 sm:h-64 xl:h-auto xl:min-h-64 xl:flex-1"
					labels={Array.from({ length }, (_, index) => `${month} ${index + 1}`)}
					ticks={dayTicks(length).map(day => ({ index: day - 1, label: String(day) }))}
					split={amount ?? undefined}
					reference={
						amount === null
							? null
							: {
									value: amount,
									label: `${amountLabel ?? "Monthly"} budget`,
									color: forecast.some(b => b.id === "total")
										? "var(--foreground)"
										: undefined,
								}
					}
					sortByValue
					series={[
						...forecast.filter(b => b.id !== "total"),
						...forecast.filter(b => b.id === "total"),
					].flatMap(budget => [
						...(budget.previous
							? [
									{
										key: `${budget.id}-previous`,
										label: budget.name,
										color: themeColor(budget.color),
										dash: "2 4",
										opacity: 0.6,
										comparison: true,
										values: Array.from(
											{ length },
											(_, index) => budget.previous?.spending[index] ?? null,
										),
									},
								]
							: []),
						{
							key: `${budget.id}-projection`,
							label: budget.name,
							color: themeColor(budget.color),
							dash: "7 5",
							fill: 0.12,
							values: budget.points.map(p => p.projected_spending),
							readoutFallback: true,
							readoutPriority: budget.id === "total" ? 1 : 0,
							valuePill: budget.id === "total",
						},
						{
							key: budget.id,
							fill: budget.id === "total" ? 0.1 : 0.3,
							label: budget.name,
							color: themeColor(budget.color),
							values: budget.points.map(p => p.spending),
							readoutPriority: budget.id === "total" ? 1 : 0,
							valuePill: budget.id === "total",
						},
					])}
					introKey={`${month}-${year}`}
					onSelect={openDay}
				/>
			</div>

			<div data-slot="forecast-legend" className="flex flex-wrap gap-1.5">
				{forecast.map(b => (
					<MonthlyBudgetBadge key={b.id} name={b.name} color={b.color} />
				))}
			</div>
			<p className="text-xs text-muted-foreground">
				Each colour shows a Monthly Budget's cumulative spending.
				{showProjection
					? " Dashed lines extend each budget's gross spending pace and include scheduled Records."
					: ""}
				Hold or hover over a day to read it, and click it to open its Records.
			</p>
		</div>
	)
}
