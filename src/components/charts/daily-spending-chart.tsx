import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import BarChart from "@/components/charts/bar-chart"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import { useHistory } from "@/history"
import { dayTicks } from "@/lib/chart-days"
import { themeColor } from "@/lib/palette"
import { pathMonthlyRecords } from "@/routes"

export type MonthlyBudgetLine = {
	id: string
	name: string
	color: string
	width?: number
	dashed?: boolean
}

export default function DailySpendingChart({
	rows,
	monthlyBudgets,
	month,
	year,
}: {
	rows: Record<string, number | null>[]
	monthlyBudgets: MonthlyBudgetLine[]
	month: string
	year: number
}) {
	const router = useRouter()
	const { handlePush } = useHistory()
	const openDay = (index: number) => {
		const selected = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
			.set({ day: Number(rows[index]?.day ?? index + 1) })
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
		<div className="grid gap-3">
			<div className="flex flex-wrap gap-1.5">
				{monthlyBudgets.map(monthlyBudget => (
					<MonthlyBudgetBadge
						key={monthlyBudget.id}
						name={monthlyBudget.name}
						color={monthlyBudget.color}
					/>
				))}
			</div>
			<BarChart
				label="Spending by day"
				className="h-48 w-full min-w-0 sm:h-64"
				labels={rows.map(row => `${month} ${row.day}`)}
				layout="stack"
				// Stacked so a day's bar height is its total outflow.
				series={monthlyBudgets.map(monthlyBudget => ({
					key: monthlyBudget.id,
					label: monthlyBudget.name,
					color: themeColor(monthlyBudget.color),
					opacity: monthlyBudget.dashed ? 0.55 : 1,
					values: rows.map(row => row[monthlyBudget.id] ?? 0),
				}))}
				ticks={dayTicks(rows.length).map(day => day - 1)}
				tick={index => (
					<text textAnchor="middle" dy="1em">
						{rows[index]?.day}
					</text>
				)}
				introKey={`${month}-${year}`}
				onSelect={openDay}
			/>
		</div>
	)
}
