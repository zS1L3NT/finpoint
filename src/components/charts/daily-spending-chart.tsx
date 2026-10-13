import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useChartIntro } from "@/components/charts/chart-intro"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useHistory } from "@/history"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatChartCurrency } from "@/lib/chart-currency"
import { formatCurrency } from "@/lib/utils"
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
	const intro = useChartIntro(`${month}-${year}`)
	const isMobile = useIsMobile()
	const router = useRouter()
	const { handlePush } = useHistory()
	const interval = isMobile ? Math.max(Math.floor(rows.length / 4), 0) : "preserveStartEnd"
	const openDay = (state: { activeLabel?: number | string } | null) => {
		if (!state?.activeLabel) return
		const selected = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
			.set({ day: Number(state.activeLabel) })
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
			<ChartContainer
				className="h-48 w-full min-w-0 aspect-auto [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-ring cursor-pointer sm:h-64"
				config={Object.fromEntries(
					monthlyBudgets.map(monthlyBudget => [
						monthlyBudget.id,
						{ label: monthlyBudget.name, color: monthlyBudget.color },
					]),
				)}
			>
				<BarChart
					data={rows}
					margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
					barCategoryGap={isMobile ? 1 : 3}
					onClick={openDay}
					style={{ cursor: "pointer" }}
					accessibilityLayer
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="day"
						interval={interval}
						height={24}
						tickMargin={isMobile ? 4 : 8}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						width={isMobile ? 40 : 48}
						tickFormatter={formatChartCurrency}
					/>
					<ChartTooltip
						cursor={{ fill: "var(--muted)", fillOpacity: 0.6 }}
						content={
							<ChartTooltipContent
								labelFormatter={(label, payload) =>
									`${month} ${payload[0]?.payload.day ?? label}`
								}
								formatter={(value, name, item) => (
									<div className="flex min-w-40 items-center justify-between gap-4">
										<span className="flex items-center gap-2 text-muted-foreground">
											<span
												className="size-2 shrink-0 rounded-full"
												style={{ backgroundColor: item.color }}
											/>
											{String(name)}
										</span>
										<span className="font-medium tabular-nums">
											{formatCurrency(Number(value))}
										</span>
									</div>
								)}
							/>
						}
					/>
					{monthlyBudgets.map((monthlyBudget, index) => (
						// Stacked so a day's bar height is its total outflow; the
						// 1px card-coloured stroke keeps adjacent segments apart.
						<Bar
							key={monthlyBudget.id}
							dataKey={monthlyBudget.id}
							name={monthlyBudget.name}
							stackId="day"
							fill={monthlyBudget.color}
							fillOpacity={monthlyBudget.dashed ? 0.55 : 1}
							stroke="var(--card)"
							strokeWidth={1}
							radius={index === monthlyBudgets.length - 1 ? [3, 3, 0, 0] : 0}
							{...intro}
						/>
					))}
				</BarChart>
			</ChartContainer>
		</div>
	)
}
