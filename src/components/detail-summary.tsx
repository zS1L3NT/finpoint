import { UiIcon as IconifyIcon } from "@/components/icon"
import { Card } from "@/components/ui/card"
import ValueSwap from "@/components/value-swap"
import { cn } from "@/lib/utils"

export function DetailSummary({
	children,
	footer,
	columns = 3,
}: {
	children: React.ReactNode
	footer?: React.ReactNode
	columns?: 2 | 3 | 4
}) {
	return (
		<Card className="@container/summary gap-0 py-0">
			<div
				className={cn(
					"grid divide-y",
					columns === 2 &&
						"@xl/summary:grid-cols-2 @xl/summary:divide-x @xl/summary:divide-y-0",
					columns === 3 &&
						"@3xl/summary:grid-cols-3 @3xl/summary:divide-x @3xl/summary:divide-y-0",
					columns === 4 &&
						"@xl/summary:grid-cols-2 @xl/summary:divide-x @xl/summary:divide-y-0 @5xl/summary:grid-cols-4",
				)}
			>
				{children}
			</div>
			{footer ? (
				<div className="border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
					{footer}
				</div>
			) : null}
		</Card>
	)
}

export function DetailSummaryItem({
	icon,
	label,
	value,
	detail,
}: {
	icon: string
	label: string
	value: React.ReactNode
	detail?: React.ReactNode
}) {
	return (
		<div className="min-w-0 p-4 sm:p-5">
			<p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
				<IconifyIcon icon={icon} className="size-3.5" />
				{label}
			</p>
			<div className="mt-2 min-w-0 text-base font-semibold tracking-tight">
				{typeof value === "string" || typeof value === "number" ? (
					<ValueSwap value={value} />
				) : (
					value
				)}
			</div>
			{detail ? <div className="mt-1 text-xs text-muted-foreground">{detail}</div> : null}
		</div>
	)
}
