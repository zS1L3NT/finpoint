import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import TrendChart from "@/components/charts/trend-chart"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import { useHistory } from "@/history"
import { dayTicks } from "@/lib/chart-days"
import { themeColor } from "@/lib/palette"
import type { getPaceView } from "@/logic/dashboard"
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
	const router = useRouter()
	const { handlePush } = useHistory()
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
				...recordFilters,
			}),
		)
	}

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
					showTotal
					series={forecast.flatMap(budget => [
						{
							key: `${budget.id}-projection`,
							label: budget.name,
							color: themeColor(budget.color),
							dash: "7 5",
							values: budget.points.map(p => p.projected_spending),
						},
						{
							key: budget.id,
							label: budget.name,
							color: themeColor(budget.color),
							values: budget.points.map(p => p.spending),
						},
					])}
					introKey={`${month}-${year}`}
					onSelect={openDay}
				/>
			</div>

			<div className="flex flex-wrap gap-1.5">
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
