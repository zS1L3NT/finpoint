import Link from "next/link"
import { useHistory } from "@/history"
import { formatCurrency } from "@/lib/utils"

export default function CategorySpendingMix({
	categories,
	recordHref,
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
	recordHref: (id: string) => string
}) {
	const { handlePush } = useHistory()
	const total = categories.reduce((sum, category) => sum + category.outflow, 0)
	const rows = categories
		.filter(category => category.records > 0)
		.sort((a, b) => b.outflow - a.outflow)
	return (
		<div className="grid gap-4">
			{rows.map(category => {
				const value = category.outflow
				const share = total > 0 ? (value / total) * 100 : 0
				return (
					<Link
						key={category.id}
						href={recordHref(category.id)}
						onClick={handlePush("overview")}
						className="group grid gap-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<div className="flex items-center justify-between gap-3 text-xs">
							<span className="truncate font-medium group-hover:underline">
								{category.name}
							</span>
							<span className="shrink-0 tabular-nums">
								{formatCurrency(value)}{" "}
								<span className="ml-1 text-muted-foreground">
									{`${share.toFixed(0)}% of expenses`}
								</span>
							</span>
						</div>
						<div className="h-1.5 overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full"
								style={{ width: `${share}%`, backgroundColor: category.color }}
							/>
						</div>
						{category.refunds > 0 ? (
							<p className="text-[11px] text-muted-foreground">
								{formatCurrency(category.refunds)} refunded ·{" "}
								{formatCurrency(category.spending)} net
							</p>
						) : null}
					</Link>
				)
			})}
			{!rows.length ? (
				<p className="text-sm text-muted-foreground">
					No spending or refunds recorded in this scope.
				</p>
			) : null}
			<p className="text-[11px] leading-relaxed text-muted-foreground">
				Shares show expenses before refunds. Refunds are shown separately; every category
				with spending or refunds appears. Select a category to review its Records.
			</p>
		</div>
	)
}
