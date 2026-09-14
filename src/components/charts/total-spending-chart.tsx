import { useNavigate } from "react-router-dom"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatCurrency } from "@/lib/utils"
import { pathMonthlyRecords } from "@/routes"

export default function TotalSpendingChart({
	data,
	month,
	year,
}: {
	data: { day: number; surplus: number | null }[]
	month: string
	year: number
}) {
	const isMobile = useIsMobile()
	const navigate = useNavigate()
	const interval = isMobile ? Math.max(Math.floor(data.length / 4), 0) : "preserveStartEnd"
	const openDay = (state: { activeLabel?: number | string } | null) => {
		if (!state?.activeLabel) return
		void navigate(
			pathMonthlyRecords({
				month,
				year: String(year),
				day: String(Number(state.activeLabel)),
			}),
		)
	}

	return (
		<ChartContainer
			className="h-64 w-full aspect-auto cursor-crosshair sm:h-72"
			config={{ surplus: { label: "Surplus", color: "var(--foreground)" } }}
		>
			<LineChart data={data} onClick={openDay} accessibilityLayer>
				<CartesianGrid vertical={false} />
				<XAxis dataKey="day" interval={interval} tickMargin={8} />
				<YAxis
					width={isMobile ? 44 : 64}
					tickFormatter={value => formatCurrency(Number(value)).replace(/\.00$/, "")}
				/>
				<ReferenceLine y={0} stroke="var(--border)" />
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={label => `${month} ${label}`}
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
				<Line
					dataKey="surplus"
					name="Surplus"
					stroke="var(--color-surplus)"
					strokeWidth={2.5}
					dot={false}
					isAnimationActive={false}
				/>
			</LineChart>
		</ChartContainer>
	)
}
