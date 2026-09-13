import { UiIcon as IconifyIcon } from "@/components/icon"
import { Card } from "@/components/ui/card"
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
		<Card className="gap-0 py-0">
			<div
				className={cn(
					"grid divide-y sm:divide-x sm:divide-y-0",
					columns === 2 && "sm:grid-cols-2",
					columns === 3 && "sm:grid-cols-3",
					columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
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
			<p className="flex items-center gap-2 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
				<IconifyIcon icon={icon} className="size-3.5" />
				{label}
			</p>
			<div className="mt-2 min-w-0 text-base font-semibold tracking-tight">{value}</div>
			{detail ? <div className="mt-1 text-xs text-muted-foreground">{detail}</div> : null}
		</div>
	)
}
