import { UiIcon } from "@/components/icon"
import { themeColor } from "@/lib/palette"
import { formatCurrency } from "@/lib/utils"
import type { Selection } from "@/logic/drilldown"

export default function CategorySpendingMix({
	categories,
	onDrill,
	limit,
}: {
	categories: {
		id: string
		name: string
		color: string
		spending: number
		outflow: number
		refunds: number
		records: number
	}[]
	onDrill: (selection: Selection) => void
	limit?: number
}) {
	const total = categories.reduce((sum, category) => sum + category.outflow, 0)
	const rows = categories
		.filter(category => category.records > 0)
		.sort((a, b) => b.outflow - a.outflow)
	return (
		<div className="grid gap-4">
			{rows.slice(0, limit).map(category => {
				const value = category.outflow
				const share = total > 0 ? (value / total) * 100 : 0
				return (
					<button
						type="button"
						key={category.id}
						onClick={() => onDrill({ kind: "category-gross", value: category.id })}
						className="cursor-pointer group grid min-w-0 gap-1.5 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<div className="flex min-w-0 items-center justify-between gap-3 text-xs">
							<span className="min-w-0 truncate font-medium group-hover:underline">
								{category.name}{" "}
								<UiIcon
									icon="lucide:chevron-right"
									className="inline size-3 opacity-60"
								/>
							</span>
							<span className="shrink-0 tabular-nums">
								{formatCurrency(value)}{" "}
								<span className="ml-1 text-muted-foreground">
									{`${share.toFixed(0)}%`}
								</span>
							</span>
						</div>
						<div className="h-1.5 overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full"
								style={{
									width: `${share}%`,
									backgroundColor: themeColor(category.color),
								}}
							/>
						</div>
						{category.refunds > 0 ? (
							<p className="text-[0.6875rem] text-muted-foreground">
								{formatCurrency(category.refunds)} refunded ·{" "}
								{formatCurrency(category.spending)} net
							</p>
						) : null}
					</button>
				)
			})}
			{!rows.length ? (
				<p className="text-xs text-muted-foreground">
					No spending or refunds recorded in this scope.
				</p>
			) : null}
			<p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
				Shares exclude refunds.
			</p>
		</div>
	)
}
