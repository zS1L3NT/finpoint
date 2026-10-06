import Sparkline from "@/components/charts/sparkline"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { cn } from "@/lib/utils"

export type Delta = { text: string; good: boolean }

/** Stat tiles shared by the dashboard and detail pages: hairline-separated cells. */
export function MetricGrid({
	className,
	children,
}: {
	className?: string
	children: React.ReactNode
}) {
	return (
		<div
			className={cn(
				"grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4",
				className,
			)}
		>
			{children}
		</div>
	)
}

export function Metric({
	icon,
	label,
	value,
	detail,
	tone = "neutral",
	delta,
	spark,
	sparkColor,
}: {
	icon: string
	label: string
	value: string
	detail: string
	tone?: "positive" | "negative" | "neutral"
	delta?: Delta
	spark?: number[]
	sparkColor?: string
}) {
	return (
		<div
			className={cn(
				"relative grid min-h-28 min-w-0 content-between bg-card p-3 sm:p-4",
				tone !== "neutral" &&
					"before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:content-['']",
				tone === "positive" && "before:bg-emerald-500",
				tone === "negative" && "before:bg-red-500",
			)}
		>
			<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground">
				<span className="hidden size-7 place-items-center rounded-lg border bg-background text-foreground shadow-xs sm:grid">
					<IconifyIcon icon={icon} className="size-3.5" />
				</span>
				{label}
				{delta ? (
					<span
						title={delta.good ? "Better than average" : "Worse than average"}
						className={cn(
							"ml-auto rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap tabular-nums",
							delta.good
								? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
								: "bg-red-500/10 text-red-700 dark:text-red-400",
						)}
					>
						{delta.text}
					</span>
				) : null}
			</div>
			<div className="mt-4 flex items-end justify-between gap-3">
				<div className="min-w-0">
					<p
						className={cn(
							"text-xl font-semibold tracking-tight tabular-nums sm:text-2xl",
							tone === "positive" && "text-emerald-700 dark:text-emerald-400",
							tone === "negative" && "text-red-700 dark:text-red-400",
						)}
					>
						{value}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">{detail}</p>
				</div>
				{spark && spark.length > 1 ? (
					<Sparkline
						values={spark}
						color={sparkColor}
						label={`${label}, last ${spark.length} months`}
						className="mb-1 hidden shrink-0 text-muted-foreground xl:block"
					/>
				) : null}
			</div>
		</div>
	)
}
