import { useEffect, useMemo, useRef, useState } from "react"
import { Label, Pie, PieChart } from "recharts"
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { cn, formatCurrency, round2dp } from "@/lib/utils"
import { Category, Record } from "@/types"

type RecordExtra = {
	category: Category
}

type CategoryExtra = {
	children: Category[]
}

export default function CategoriesPieChart({
	className,
	records,
	categories,
	limit,
}: {
	className?: string
	records: (Record & RecordExtra)[]
	categories: (Category & CategoryExtra)[]
	limit?: number
}) {
	const containerRef = useRef<HTMLDivElement>(null)
	const legendRef = useRef<HTMLDivElement>(null)

	const [textBoxY, setTextBoxY] = useState<number>()

	const categoryData = useMemo(
		() =>
			categories
				.flatMap(c => c)
				.map(c => {
					const categoryRecords = records
						.filter(r => r.amount < 0)
						.filter(
							r => r.category.id === c.id || r.category.parent_category_id === c.id,
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
					const subcategoryRecords = records
						.filter(r => r.amount < 0)
						.filter(r => r.category.id === c.id)

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

	useEffect(() => {
		setTimeout(() => {
			// Height of the pie chart
			const pieChartHeight = containerRef.current?.children.item(1)?.clientHeight ?? 0

			const legendHeight = (legendRef.current?.clientHeight ?? 0) + 12

			const MANUAL_SHIFT = 4

			setTextBoxY((pieChartHeight - legendHeight) / 2 + MANUAL_SHIFT)
		})
	}, [categoryData, subcategoryData])

	return (
		<ChartContainer
			ref={containerRef}
			className={cn("aspect-square", className)}
			config={Object.fromEntries([
				...categories.map(c => [c.id, { label: c.name, color: c.color }]),
				...categories.flatMap(c =>
					c.children.map(({ id }) => [id, { label: c.name, color: c.color }]),
				),
			])}
		>
			<PieChart>
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
				>
					<Label
						content={({ viewBox }) => {
							if (viewBox && "cx" in viewBox && textBoxY !== undefined) {
								return (
									<g
										transform={`translate(${viewBox.cx}, ${textBoxY})`} // Approximate vertical height of the text
									>
										<text
											textAnchor="middle"
											className="fill-foreground text-xl font-bold"
										>
											{formatCurrency(
												records.reduce((acc, r) => acc - r.amount, 0),
											)}
										</text>
										<text
											y={20}
											textAnchor="middle"
											className="fill-muted-foreground"
										>
											{limit ? `of ${formatCurrency(limit)}` : "No limit"}
										</text>
									</g>
								)
							}
						}}
					/>
				</Pie>

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

				<ChartTooltip cursor={false} content={<ChartTooltipContent className="w-48" />} />

				<ChartLegend
					payloadUniqBy={p =>
						categories.find(c => c.name === p.value)?.id ??
						categories.find(c => c.children.some(c => c.name === p.value))?.id
					}
					content={
						<ChartLegendContent
							ref={legendRef}
							nameKey="id"
							className="flex-wrap gap-2"
						/>
					}
				/>
			</PieChart>
		</ChartContainer>
	)
}
