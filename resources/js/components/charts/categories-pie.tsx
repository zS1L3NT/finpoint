import { useMemo } from "react"
import { Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn, formatCurrency, round2dp } from "@/lib/utils"
import { CategoryWithChildren, Record } from "@/types"

export default function CategoriesPieChart({
	className,
	records,
	categories,
	limit,
}: {
	className?: string
	records: Record[]
	categories: CategoryWithChildren[]
	limit?: number
}) {
	const categoryData = useMemo(
		() =>
			categories
				.map(c => {
					const categoryRecords = records.filter(
						r =>
							r.amount < 0 &&
							(r.category.id === c.id || r.category.parent_category_id === c.id),
					)

					return {
						category: c,
						recordCount: categoryRecords.length,
						amount: round2dp(categoryRecords.reduce((acc, el) => acc - el.amount, 0)),
					}
				})
				.filter(d => d.recordCount > 0),
		[categories, records],
	)

	const subcategoryData = useMemo(
		() =>
			categories
				.flatMap(c => [c, ...c.children])
				.map(c => {
					const subcategoryRecords = records.filter(
						r => r.amount < 0 && r.category.id === c.id,
					)

					return {
						category: c,
						recordCount: subcategoryRecords.length,
						amount: round2dp(
							subcategoryRecords.reduce((acc, el) => acc - el.amount, 0),
						),
					}
				})
				.filter(d => d.recordCount > 0),
		[categories, records],
	)
	const total = formatCurrency(records.reduce((acc, r) => acc - r.amount, 0))
	const totalFontSize = Math.max(14, 20 - Math.max(total.length - 9, 0))
	const config = Object.fromEntries([
		...categories.map(c => [c.id, { label: c.name, color: c.color }]),
		...categories.flatMap(c =>
			c.children.map(({ id }) => [id, { label: c.name, color: c.color }]),
		),
	])

	return (
		<div className={cn("flex min-w-0 flex-col items-center gap-3", className)}>
			<div className="relative aspect-square w-full max-w-56 sm:max-w-64 xl:max-w-72">
				<ChartContainer
					className="size-full aspect-square"
					config={config}
					initialDimension={{ width: 224, height: 224 }}
				>
					<PieChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
						<Pie
							data={categoryData.map(d => ({
								id: d.category.id,
								category: d.category.name,
								amount: d.amount,
								fill: d.category.color,
							}))}
							dataKey="amount"
							nameKey="category"
							innerRadius="50%"
							outerRadius="80%"
							strokeWidth={1}
							stroke="var(--primary)"
						/>

						<Pie
							data={subcategoryData.map(d => ({
								id: d.category.id,
								category: d.category.name,
								amount: d.amount,
								fill: d.category.color,
							}))}
							dataKey="amount"
							nameKey="category"
							innerRadius="80%"
							outerRadius="100%"
							strokeWidth={1}
							stroke="var(--primary)"
						/>

						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent className="w-48" />}
						/>
					</PieChart>
				</ChartContainer>

				<div
					data-slot="chart-label"
					className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-center"
				>
					<span className="font-bold leading-none" style={{ fontSize: totalFontSize }}>
						{total}
					</span>
					<span className="text-xs leading-none text-muted-foreground">
						{limit ? `of ${formatCurrency(limit)}` : "No limit"}
					</span>
				</div>
			</div>

			{categoryData.length ? (
				<ul className="flex max-w-full flex-wrap justify-center gap-x-3 gap-y-1 text-xs">
					{categoryData.map(({ category }) => (
						<li key={category.id} className="flex min-w-0 items-center gap-1.5">
							<span
								className="size-2.5 shrink-0 rounded-[2px]"
								style={{ backgroundColor: category.color }}
							/>
							<span>{category.name}</span>
						</li>
					))}
				</ul>
			) : null}
		</div>
	)
}
