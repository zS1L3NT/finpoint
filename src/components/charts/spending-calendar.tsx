"use client"

import { DateTime } from "luxon"
import { cn, formatCurrency } from "@/lib/utils"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const STEPS = 5
const LEVELS = Array.from({ length: STEPS + 1 }, (_, level) => level)
// Ink per heat step: light steps 3+ are dark fills; in dark mode the ramp
// inverts, so only the brightest step needs dark ink.
const INK = [
	"text-muted-foreground",
	"text-foreground",
	"text-foreground dark:text-white",
	"text-white",
	"text-white",
	"text-white dark:text-zinc-950",
]

function compact(value: number) {
	if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
	return `$${Math.round(value)}`
}

/**
 * Month-as-calendar heatmap of daily spending. Rhythm (weekends, paydays,
 * one-off spikes) reads at a glance in a way a 31-point line cannot.
 */
export default function SpendingCalendar({
	month,
	year,
	daily,
	through,
	onSelect,
}: {
	month: string
	year: number
	daily: { date: string; spending: number; records: number }[]
	through: string | null
	onSelect: (date: string) => void
}) {
	const start = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy").startOf("month")
	const days = start.daysInMonth ?? 30
	const byDate = new Map(daily.map(day => [day.date, day]))
	const max = Math.max(...daily.map(day => day.spending), 0)
	const leading = start.weekday - 1
	// Quantile steps over the month's spending days, so one large purchase
	// does not flatten every other day into the lowest shade.
	const sorted = daily
		.map(day => day.spending)
		.filter(value => value > 0)
		.sort((a, b) => a - b)
	const thresholds = LEVELS.slice(1, STEPS).map(
		level => sorted[Math.floor((level / STEPS) * sorted.length)] ?? 0,
	)
	const step = (value: number) =>
		value <= 0 ? 0 : 1 + thresholds.filter(threshold => value >= threshold).length
	const spendDays = daily.filter(day => day.spending > 0).length
	const total = daily.reduce((sum, day) => sum + Math.max(day.spending, 0), 0)

	return (
		<div className="grid gap-3">
			<div className="grid grid-cols-7 gap-1 text-center text-[0.6875rem] font-medium text-muted-foreground">
				{WEEKDAYS.map(day => (
					<span key={day}>{day}</span>
				))}
			</div>
			<div className="grid grid-cols-7 gap-1">
				{Array.from({ length: leading }).map((_, index) => (
					<span key={`pad-${index}`} aria-hidden />
				))}
				{Array.from({ length: days }).map((_, index) => {
					const date = start.set({ day: index + 1 })
					const key = date.toFormat("yyyy-MM-dd")
					const entry = byDate.get(key)
					const spending = Math.max(entry?.spending ?? 0, 0)
					const future = through !== null && key > through
					const level = future ? 0 : step(spending)
					const label = future
						? `${date.toFormat("d MMMM")}: upcoming`
						: `${date.toFormat("d MMMM")}: ${formatCurrency(spending)} spent${entry?.records ? ` across ${entry.records} Record${entry.records === 1 ? "" : "s"}` : ""}`
					return (
						<button
							// Keyed by day number so a month change fades the heat colour in place.
							key={index}
							type="button"
							title={label}
							aria-label={label}
							disabled={future}
							onClick={() => onSelect(key)}
							className={cn(
								"group relative flex aspect-square min-h-9 cursor-pointer flex-col justify-between rounded-md p-1 text-left transition-[background-color,box-shadow,transform] duration-150 ease-out hover:z-10 hover:scale-[1.04] hover:shadow-md active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none disabled:active:scale-100 sm:p-1.5",
								INK[level],
								future && "border border-dashed bg-transparent",
							)}
							style={future ? undefined : { backgroundColor: `var(--heat-${level})` }}
						>
							<span className="text-[0.625rem] leading-none font-medium tabular-nums opacity-80 sm:text-[0.6875rem]">
								{index + 1}
							</span>
							{level > 0 ? (
								<span className="hidden text-[0.625rem] leading-none font-semibold tabular-nums sm:block">
									{compact(spending)}
								</span>
							) : null}
						</button>
					)
				})}
			</div>
			<div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
				<span>
					{spendDays} spending day{spendDays === 1 ? "" : "s"} · {formatCurrency(total)}
				</span>
				<span className="flex items-center gap-1.5">
					$0
					{LEVELS.map(level => (
						<span
							key={level}
							className="size-3 rounded-sm"
							style={{ backgroundColor: `var(--heat-${level})` }}
						/>
					))}
					{max > 0 ? compact(max) : "—"}
				</span>
			</div>
		</div>
	)
}
