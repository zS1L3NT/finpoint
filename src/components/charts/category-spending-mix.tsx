import Link from "next/link"
import { UiIcon } from "@/components/icon"
import { themeColor } from "@/lib/palette"
import { formatCurrency } from "@/lib/utils"

/**
 * Where the money went: one bar split by category, then each category's spending and share as
 * rows that open its Records. The Dashboard and a Budget's detail page share it; its rows match
 * the Biggest changes list, which shows the change against the average instead of the share.
 */
export default function CategorySpendingMix({
	categories,
	recordHref,
	limit,
	footnote = "Shares exclude refunds.",
}: {
	categories: {
		id: string
		name: string
		icon?: string
		color: string
		spending: number
		outflow: number
		refunds: number
		records: number
	}[]
	recordHref: (id: string) => string
	limit?: number
	footnote?: string | null
}) {
	const total = categories.reduce((sum, category) => sum + category.outflow, 0)
	const rows = categories
		.filter(category => category.records > 0)
		.sort((a, b) => b.outflow - a.outflow)
	return (
		<div className="grid gap-0.5">
			{/* The whole at a glance: one segment per category, in the order of the rows below. */}
			{rows.length > 1 && total > 0 ? (
				<div
					aria-hidden
					className="mx-2 mb-2 flex h-2 gap-0.5 overflow-hidden rounded-full"
				>
					{rows.map(category => (
						<span
							key={category.id}
							className="h-full first:rounded-l-full last:rounded-r-full"
							style={{
								// Grow by amount, so the gaps never push the segments past the track.
								flex: `${category.outflow} 1 0`,
								backgroundColor: themeColor(category.color),
							}}
						/>
					))}
				</div>
			) : null}
			{rows.slice(0, limit).map(category => {
				const value = category.outflow
				const share = total > 0 ? (value / total) * 100 : 0
				return (
					<Link
						key={category.id}
						href={recordHref(category.id)}
						scroll={false}
						className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-lg px-2 py-1.5 transition-colors duration-150 ease-out hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<span
							aria-hidden
							className="grid size-8 place-items-center rounded-full"
							style={{ backgroundColor: themeColor(category.color) }}
						>
							{category.icon ? (
								<UiIcon icon={category.icon} className="size-4 text-white" />
							) : null}
						</span>
						<span className="grid min-w-0">
							<span className="min-w-0 truncate text-sm font-medium">
								{category.name}
							</span>
							<span className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-muted-foreground tabular-nums">
								{category.records} {category.records === 1 ? "Record" : "Records"}
								{category.refunds > 0
									? ` · ${formatCurrency(category.refunds)} refunded · ${formatCurrency(category.spending)} net`
									: ""}
							</span>
						</span>
						<span className="grid shrink-0 justify-items-end tabular-nums">
							<span className="text-sm font-medium">{formatCurrency(value)}</span>
							<span className="text-xs text-muted-foreground">{`${share.toFixed(0)}%`}</span>
						</span>
					</Link>
				)
			})}
			{!rows.length ? (
				<p className="text-xs text-muted-foreground">
					No spending or refunds recorded in this scope.
				</p>
			) : null}
			{footnote ? (
				<p className="px-2 pt-1 text-[0.6875rem] leading-relaxed text-muted-foreground">
					{footnote}
				</p>
			) : null}
		</div>
	)
}
