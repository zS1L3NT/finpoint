import { Link, router } from "@inertiajs/react"
import {
	EyeIcon,
	EyeOffIcon,
	PiggyBankIcon,
	PlusIcon,
	SparklesIcon,
	Trash2Icon,
	WrenchIcon,
} from "lucide-react"
import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import {
	Area,
	AreaChart,
	CartesianGrid,
	Label,
	Line,
	Pie,
	PieChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts"
import DetailCard from "@/components/detail-card"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import RecordSearch from "@/components/record-search"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Toggle } from "@/components/ui/toggle"
import BudgetEditorDialog from "@/dialogs/budget-editor"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import {
	classForCurrency,
	cn,
	formatCurrency,
	formatDatetime,
	parseDate,
	parseDatetime,
	round2dp,
	withMethod,
} from "@/lib/utils"
import { Budget, Category, Record } from "@/types"
import {
	budgetRecordDestroyApiRoute,
	budgetRecordUpdateApiRoute,
	budgetsWebRoute,
	recordWebRoute,
} from "@/wayfinder/routes"

type RecordExtra = {
	category: Category
	excluded: boolean
}

type CategoryExtra = {
	children: Category[]
}

const getAggregations = (budget: Budget, records: (Record & RecordExtra)[]) => {
	const startDate = parseDate(budget.start_date)
	const endDate = parseDate(budget.end_date)

	let elapsedSpending = records
		.filter(r => parseDatetime(r.datetime) < startDate)
		.reduce((acc, el) => acc - el.amount, 0)
	let elapsedDays = 0
	const dates: DateTime[] = []
	const cumulated: number[] = []

	for (let i = 0; i <= endDate.diff(startDate, "days").days; i++) {
		const date = startDate.plus({ days: i })
		dates.push(date)

		const amountForDate = round2dp(
			records
				.filter(r => parseDatetime(r.datetime).hasSame(date, "day"))
				.reduce((acc, el) => acc - el.amount, 0),
		)

		if (date.startOf("day") < DateTime.now()) {
			elapsedSpending = round2dp(elapsedSpending + amountForDate)
			elapsedDays += 1
		}

		if (i === 0) {
			cumulated.push(amountForDate)
		} else {
			cumulated.push(round2dp(cumulated[i - 1] + amountForDate))
		}
	}

	const remainingSpending = round2dp(budget.amount - elapsedSpending)
	const remainingDays = dates.length - elapsedDays

	const budgetPace = round2dp(budget.amount / dates.length)
	const currentPace = elapsedDays > 0 ? round2dp(elapsedSpending / elapsedDays) : 0
	const idealPace = remainingDays > 0 ? round2dp(remainingSpending / remainingDays) : 0

	const projectedSpending = elapsedSpending + round2dp(currentPace * remainingDays)

	return {
		dates,
		cumulated,
		elapsedSpending,
		remainingSpending,
		elapsedDays,
		remainingDays,
		budgetPace,
		currentPace,
		idealPace,
		projectedSpending,
	}
}

export default function BudgetPage({
	budget,
	records,
	categories,
}: {
	budget: Budget
	records: (Record & RecordExtra)[]
	categories: (Category & CategoryExtra)[]
}) {
	const [showingExcluded, setShowingExcluded] = useState(false)

	const attach = async (record: Record) => {
		const response = await fetch(budgetRecordUpdateApiRoute.url({ budget, record }), {
			method: "POST",
			body: withMethod(new FormData(), "PUT"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			router.reload()
		}
	}

	const detach = async (record: Record) => {
		const response = await fetch(budgetRecordDestroyApiRoute.url({ budget, record }), {
			method: "POST",
			body: withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			router.reload()
		}
	}

	const {
		dates,
		cumulated,
		elapsedSpending,
		elapsedDays,
		budgetPace,
		currentPace,
		idealPace,
		projectedSpending,
	} = useMemo(
		() =>
			getAggregations(
				budget,
				records.filter(r => !r.excluded),
			),
		[budget, records],
	)

	return (
		<>
			<AppHeader title="Budget" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title={budget.name}
					subtitle={
						<div className="flex items-center gap-1 text-muted-foreground">
							{budget.automatic ? (
								<SparklesIcon className="size-4" />
							) : (
								<WrenchIcon className="size-4" />
							)}
							<span>
								{budget.automatic ? "Automatic" : "Manual"} record attachment
							</span>
						</div>
					}
					description="Budget details"
					icon={PiggyBankIcon}
					actions={<BudgetEditorDialog budget={budget} />}
					back={{ name: "Back to budgets", url: budgetsWebRoute.url() }}
				/>

				<div className="grid gap-4 grid-cols-4">
					<DetailCard
						label="Budget Usage"
						value={
							<div className="space-y-2">
								<div className="space-y-0.5">
									<p
										className={cn(
											elapsedSpending > budget.amount
												? "text-destructive"
												: "text-creative",
										)}
									>
										{formatCurrency(elapsedSpending)}
									</p>
									<p className="text-xs text-muted-foreground">{`${Math.ceil((elapsedSpending / budget.amount) * 100)}% of ${formatCurrency(budget.amount)}`}</p>
								</div>
								<Progress
									value={(elapsedSpending / budget.amount) * 100}
									className="h-2"
								/>
							</div>
						}
					/>
					<DetailCard
						label="Usage Projection"
						value={
							<div className="space-y-0.5">
								<p
									className={cn(
										idealPace === 0 || currentPace < idealPace
											? ""
											: elapsedSpending > budget.amount
												? "text-destructive"
												: "text-orange-500",
									)}
								>
									{formatCurrency(projectedSpending)}
								</p>
								<p className="text-xs text-muted-foreground">
									{formatCurrency(Math.abs(budget.amount - projectedSpending))}{" "}
									{projectedSpending > budget.amount ? "over" : "under"} budget
								</p>
							</div>
						}
					/>
					<DetailCard
						label="Usage Pace"
						value={
							<div className="space-y-0.5">
								<p>{formatCurrency(currentPace)} / day</p>
								<p className="text-xs text-muted-foreground">
									Budget target is {formatCurrency(budgetPace)} / day
								</p>
							</div>
						}
					/>
					<DetailCard
						label="Recommended Pace"
						value={
							<div className="space-y-0.5">
								<p>{formatCurrency(idealPace)} / day</p>
								<p className="text-xs text-muted-foreground">
									{idealPace > budgetPace
										? "You can spend more than current pace and still stay within budget"
										: "You need to spend less than current pace to stay within budget"}
								</p>
							</div>
						}
					/>
				</div>

				<div className="flex gap-6">
					<Card className="flex-1">
						<CardHeader>
							<CardTitle>Spending by Category</CardTitle>
						</CardHeader>
						<CardContent className="my-auto">
							<ChartContainer
								config={Object.fromEntries([
									...categories.map(c => [
										c.id,
										{ label: c.name, color: c.color },
									]),
									...categories.flatMap(c =>
										c.children.map(({ id }) => [
											id,
											{ label: c.name, color: c.color },
										]),
									),
								])}
								className="aspect-square"
							>
								<PieChart>
									<Pie
										data={categories.map(c => ({
											id: c.id,
											category: c.name,
											amount: round2dp(
												records
													.filter(r => !r.excluded)
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
																{formatCurrency(elapsedSpending)}
															</text>
															<text
																y={20}
																textAnchor="middle"
																className="fill-muted-foreground"
															>
																{`of ${formatCurrency(budget.amount)}`}
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
														.filter(r => !r.excluded)
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

									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent className="w-48" />}
									/>

									<ChartLegend
										payloadUniqBy={p =>
											categories.find(c => c.name === p.value)?.id ??
											categories.find(c =>
												c.children.some(c => c.name === p.value),
											)?.id
										}
										content={
											<ChartLegendContent
												nameKey="id"
												className="flex-wrap gap-2"
											/>
										}
									/>
								</PieChart>
							</ChartContainer>
						</CardContent>
					</Card>
					<Card className="flex-2">
						<CardHeader>
							<CardTitle>Spending over Time</CardTitle>
						</CardHeader>
						<CardContent>
							<ChartContainer
								config={{
									within: { label: "Within budget" },
									exceed: { label: "Exceeding budget" },
									projected: { label: "Projected spend" },
								}}
							>
								<AreaChart
									data={[
										...dates.slice(0, elapsedDays).map((d, i) => ({
											date: d.toFormat("d MMM y"),
											within:
												cumulated[i] < budget.amount
													? cumulated[i]
													: undefined,
											exceed:
												cumulated[i] > budget.amount ||
												(cumulated[i] < budget.amount &&
													cumulated[i + 1] > budget.amount)
													? cumulated[i]
													: undefined,
											projected:
												i === elapsedDays - 1 ? elapsedSpending : undefined,
										})),
										...dates.slice(elapsedDays).map((d, i) => ({
											date: d.toFormat("d MMM y"),
											projected: round2dp(
												elapsedSpending + currentPace * (i + 1),
											),
										})),
									]}
								>
									<CartesianGrid />
									<XAxis dataKey="date" />
									<YAxis
										ticks={Array.from(
											{
												length:
													Math.floor(
														Math.max(projectedSpending, budget.amount) /
															100,
													) + 1,
											},
											(_, i) => i * 100,
										)}
									/>

									<Area
										dataKey="within"
										fill="var(--color-green-600)"
										fillOpacity={0.1}
										stroke="var(--color-green-600)"
										strokeWidth={2}
									/>
									<Area
										dataKey="exceed"
										fill="var(--color-red-500)"
										fillOpacity={0.1}
										stroke="var(--color-red-500)"
										strokeWidth={2}
									/>

									<Line
										dataKey="projected"
										fill={
											currentPace < idealPace
												? "var(--foreground)"
												: elapsedSpending > budget.amount
													? "var(--color-red-500)"
													: "var(--color-orange-500)"
										}
										fillOpacity={0.1}
										stroke={
											currentPace < idealPace
												? "var(--foreground)"
												: elapsedSpending > budget.amount
													? "var(--color-red-500)"
													: "var(--color-orange-500)"
										}
										strokeWidth={2}
										dot={false}
										animationBegin={1000}
									/>

									<ReferenceLine label="Budget" y={budget.amount} />

									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent className="w-50" />}
									/>
								</AreaChart>
							</ChartContainer>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Attached records</CardTitle>
						<CardDescription>
							Records that currently contribute to this budget.
						</CardDescription>
						<CardAction>
							<div className="flex items-center gap-2">
								<Toggle
									pressed={showingExcluded}
									onPressedChange={setShowingExcluded}
								>
									{showingExcluded ? <EyeIcon /> : <EyeOffIcon />}
									Show Excluded
								</Toggle>

								<RecordSearch
									title="Attach record to budget"
									filters={{ exclude_budget_id: budget.id }}
									handler={attach}
									trigger={
										<Button>
											<PlusIcon /> Attach record
										</Button>
									}
								/>
							</div>
						</CardAction>
					</CardHeader>
					<CardContent>
						<DataTable
							data={records.filter(r => showingExcluded || !r.excluded)}
							columns={[
								{
									header: "Record",
									meta: { width: TABLE_WIDTHS.RECORD },
									cell: ({ row }) => (
										<div
											className={cn(
												"flex items-center gap-3",
												row.original.excluded && "opacity-25",
											)}
										>
											<Icon {...row.original.category} size={16} />
											<div className="flex-1 overflow-hidden">
												<p className="truncate font-medium">
													{row.original.title}
												</p>
												<p className="truncate text-muted-foreground">
													{[
														row.original.people
															? `w/ ${row.original.people}`
															: null,
														row.original.location
															? `@ ${row.original.location}`
															: null,
													]
														.filter(Boolean)
														.join(" ") || "No extra context"}
												</p>
											</div>
										</div>
									),
								},
								{
									header: "Amount",
									meta: { width: TABLE_WIDTHS.AMOUNT },
									cell: ({ row }) => (
										<span
											className={cn(
												classForCurrency(row.original.amount),
												row.original.excluded && "opacity-25",
											)}
										>
											{formatCurrency(row.original.amount)}
										</span>
									),
								},
								{
									header: "Date & Time",
									meta: { width: TABLE_WIDTHS.DATETIME },
									cell: ({ row }) => (
										<span className={cn(row.original.excluded && "opacity-25")}>
											{formatDatetime(row.original.datetime)}
										</span>
									),
								},
								{
									header: "Description",
									meta: { width: TABLE_WIDTHS.DESCRIPTION },
									cell: ({ row }) => (
										<div
											className={cn(
												"truncate text-muted-foreground",
												row.original.excluded && "opacity-25",
											)}
										>
											{row.original.description || "-"}
										</div>
									),
								},
								{
									id: "actions",
									cell: ({ row }) => (
										<div className="flex justify-end gap-2">
											<Button variant="outline" size="sm" asChild>
												<Link
													href={recordWebRoute.url({
														record: row.original,
													})}
												>
													Open
												</Link>
											</Button>
											{row.original.excluded ? (
												<Button
													size="sm"
													variant="creative"
													onClick={() => attach(row.original)}
												>
													<PlusIcon /> Attach
												</Button>
											) : (
												<Button
													variant="destructive"
													size="sm"
													onClick={() => detach(row.original)}
												>
													<Trash2Icon /> Detach
												</Button>
											)}
										</div>
									),
								},
							]}
							emptyMessage="No records found."
						/>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
