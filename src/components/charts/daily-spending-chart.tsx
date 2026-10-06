import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import BucketBadge from "@/components/bucket-badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useHistory } from "@/history"
import { useIsMobile } from "@/hooks/use-mobile"
import { armTabTransition } from "@/hooks/use-tab-transition"
import { formatCurrency } from "@/lib/utils"
import { pathMonthlyRecords } from "@/routes"

export type BucketLine = {
	id: string
	name: string
	color: string
	width?: number
	dashed?: boolean
}

export default function DailySpendingChart({
	rows,
	buckets,
	month,
	year,
}: {
	rows: Record<string, number | null>[]
	buckets: BucketLine[]
	month: string
	year: number
}) {
	const isMobile = useIsMobile()
	const router = useRouter()
	const { handlePush } = useHistory()
	const interval = isMobile ? Math.max(Math.floor(rows.length / 4), 0) : "preserveStartEnd"
	const openDay = (state: { activeLabel?: number | string } | null) => {
		if (!state?.activeLabel) return
		const selected = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
			.set({ day: Number(state.activeLabel) })
			.toFormat("yyyy-MM-dd")
		armTabTransition()
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
				{buckets.map(bucket => (
					<BucketBadge key={bucket.id} name={bucket.name} color={bucket.color} />
				))}
			</div>
			<ChartContainer
				className="h-64 w-full aspect-auto cursor-pointer sm:h-72"
				config={Object.fromEntries(
					buckets.map(bucket => [bucket.id, { label: bucket.name, color: bucket.color }]),
				)}
			>
				<BarChart
					data={rows}
					barCategoryGap={isMobile ? 1 : 3}
					onClick={openDay}
					style={{ cursor: "pointer" }}
					accessibilityLayer
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="day"
						interval={interval}
						tickMargin={8}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						width={isMobile ? 44 : 64}
						tickFormatter={value => formatCurrency(Number(value)).replace(/\.00$/, "")}
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
					{buckets.map((bucket, index) => (
						// Stacked so a day's bar height is its total outflow; the
						// 1px card-coloured stroke keeps adjacent segments apart.
						<Bar
							key={bucket.id}
							dataKey={bucket.id}
							name={bucket.name}
							stackId="day"
							fill={bucket.color}
							fillOpacity={bucket.dashed ? 0.55 : 1}
							stroke="var(--card)"
							strokeWidth={1}
							radius={index === buckets.length - 1 ? [3, 3, 0, 0] : 0}
							isAnimationActive={false}
						/>
					))}
				</BarChart>
			</ChartContainer>
		</div>
	)
}
