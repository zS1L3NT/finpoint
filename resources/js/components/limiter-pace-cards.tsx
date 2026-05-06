import { DateTime } from "luxon"
import DetailCard from "@/components/detail-card"
import { Progress } from "@/components/ui/progress"
import { cn, formatCurrency, parseDatetime, round2dp } from "@/lib/utils"
import { Record } from "@/types"

type LimitAggregations = {
	elapsedSpending: number
	elapsedPercent: number
	projectedSpending: number
	limiterPace: number
	currentPace: number
	idealPace: number
}

export const getLimitAggregations = (
	records: Record[],
	startDate: DateTime,
	endDate: DateTime,
	limit: number,
): LimitAggregations => {
	let elapsedSpending = records
		.filter(r => parseDatetime(r.datetime) < startDate)
		.reduce((acc, el) => acc - el.amount, 0)
	let elapsedDays = 0

	const dates: DateTime[] = []

	for (let i = 0; i <= endDate.diff(startDate, "days").days; i++) {
		const date = startDate.plus({ days: i })
		dates.push(date)

		if (DateTime.now().endOf("day") >= date.endOf("day")) {
			const amount = round2dp(
				records
					.filter(r => parseDatetime(r.datetime).hasSame(date, "day"))
					.reduce((acc, el) => acc - el.amount, 0),
			)

			elapsedSpending = round2dp(elapsedSpending + amount)
			elapsedDays += 1
		}
	}

	const remainingSpending = round2dp(limit - elapsedSpending)
	const remainingDays = dates.length - elapsedDays

	const limiterPace = round2dp(limit / dates.length)
	const currentPace = elapsedDays > 0 ? round2dp(elapsedSpending / elapsedDays) : 0
	const idealPace = remainingDays > 0 ? round2dp(remainingSpending / remainingDays) : 0

	return {
		elapsedSpending,
		elapsedPercent: round2dp((elapsedSpending / limit) * 100),
		projectedSpending: elapsedSpending + currentPace * remainingDays,
		limiterPace,
		currentPace,
		idealPace,
	}
}

export default function LimiterPaceCards({
	name,
	limit,
	elapsedSpending,
	elapsedPercent,
	projectedSpending,
	limiterPace,
	currentPace,
	idealPace,
}: { name: string; limit: number } & LimitAggregations) {
	const capitalisedName = name[0].toUpperCase() + name.slice(1)

	return (
		<div className="grid gap-4 grid-cols-4">
			<DetailCard
				label={`${capitalisedName} Usage`}
				value={
					<div className="space-y-2">
						<div className="space-y-0.5">
							<p
								className={cn(
									elapsedSpending > limit ? "text-destructive" : "text-creative",
								)}
							>
								{formatCurrency(elapsedSpending)}
							</p>
							<p className="text-xs text-muted-foreground">{`${elapsedPercent}% of ${formatCurrency(limit)}`}</p>
						</div>
						<Progress value={elapsedPercent} className="h-2" />
					</div>
				}
			/>
			<DetailCard
				label="Usage Projection"
				value={
					<div className="space-y-0.5">
						<p
							className={cn(
								idealPace === 0 || currentPace < idealPace
									? ""
									: elapsedSpending > limit
										? "text-destructive"
										: "text-orange-500",
							)}
						>
							{formatCurrency(projectedSpending)}
						</p>
						<p className="text-xs text-muted-foreground">
							{formatCurrency(Math.abs(limit - projectedSpending))}{" "}
							{projectedSpending > limit ? "over" : "under"} the {name}
						</p>
					</div>
				}
			/>
			<DetailCard
				label="Usage Pace"
				value={
					<div className="space-y-0.5">
						<p>{formatCurrency(currentPace)} / day</p>
						<p className="text-xs text-muted-foreground">
							{capitalisedName} target is {formatCurrency(limiterPace)} / day
						</p>
					</div>
				}
			/>
			<DetailCard
				label="Recommended Pace"
				value={
					<div className="space-y-0.5">
						<p>{formatCurrency(idealPace)} / day</p>
						<p className="text-xs text-muted-foreground">
							{idealPace > limiterPace
								? `You can spend more than current pace and still stay within the ${name}`
								: `You need to spend less than current pace to stay within the ${name}`}
						</p>
					</div>
				}
			/>
		</div>
	)
}
