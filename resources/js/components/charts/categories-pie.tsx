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
	return (
		<ChartContainer
			config={Object.fromEntries([
				...categories.map(c => [c.id, { label: c.name, color: c.color }]),
				...categories.flatMap(c =>
					c.children.map(({ id }) => [id, { label: c.name, color: c.color }]),
				),
			])}
			className={cn("aspect-square", className)}
		>
			<PieChart>
				<Pie
					data={categories.map(c => ({
						id: c.id,
						category: c.name,
						amount: round2dp(
							records
								.filter(
									r =>
										r.category.id === c.id ||
										r.category.parent_category_id === c.id,
								)
								.reduce((acc, el) => acc - el.amount, 0),
						),
						fill: c.color,
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
							if (viewBox && "cx" in viewBox && "cy" in viewBox) {
								const { cx, cy } = viewBox
								return (
									<g
										transform={`translate(${cx}, ${cy - 40 + 4})`} // Approximate vertical height of the text
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
					data={categories
						.flatMap(c => [c, ...c.children])
						.map(c => ({
							id: c.id,
							category: c.name,
							amount: round2dp(
								records
									.filter(r => r.category.id === c.id)
									.reduce((acc, el) => acc - el.amount, 0),
							),
							fill: c.color,
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
					content={<ChartLegendContent nameKey="id" className="flex-wrap gap-2" />}
				/>
			</PieChart>
		</ChartContainer>
	)
}
