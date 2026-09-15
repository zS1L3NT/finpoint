import { useRouter } from "next/navigation"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
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
	const interval = isMobile ? Math.max(Math.floor(rows.length / 4), 0) : "preserveStartEnd"
	const openDay = (state: { activeLabel?: number | string } | null) => {
		if (!state?.activeLabel) return
		void router.push(
			pathMonthlyRecords({
				month,
				year: String(year),
				day: String(Number(state.activeLabel)),
			}),
		)
	}

	return (
		<div className="grid gap-3">
			<div className="flex flex-wrap gap-x-4 gap-y-1.5">
				{buckets.map(bucket => (
					<span
						key={bucket.id}
						className="flex items-center gap-1.5 text-xs text-muted-foreground"
					>
						<span
							className="size-2 rounded-full"
							style={{ backgroundColor: bucket.color }}
						/>
						{bucket.name}
					</span>
				))}
			</div>
			<ChartContainer
				className="h-64 w-full aspect-auto cursor-crosshair sm:h-72"
				config={Object.fromEntries(
					buckets.map(bucket => [bucket.id, { label: bucket.name, color: bucket.color }]),
				)}
			>
				<LineChart data={rows} onClick={openDay} accessibilityLayer>
					<CartesianGrid vertical={false} />
					<XAxis dataKey="day" interval={interval} tickMargin={8} />
					<YAxis
						width={isMobile ? 44 : 64}
						tickFormatter={value => formatCurrency(Number(value)).replace(/\.00$/, "")}
					/>
					<ChartTooltip
						content={
							<ChartTooltipContent
								labelFormatter={label => `${month} ${label}`}
								formatter={(value, name) => (
									<div className="flex min-w-40 items-center justify-between gap-4">
										<span className="text-muted-foreground">
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
					{buckets.map(bucket => (
						<Line
							key={bucket.id}
							dataKey={bucket.id}
							name={bucket.name}
							stroke={bucket.color}
							strokeWidth={bucket.width ?? 2}
							strokeDasharray={bucket.dashed ? "4 4" : undefined}
							dot={false}
							isAnimationActive={false}
						/>
					))}
				</LineChart>
			</ChartContainer>
		</div>
	)
}
