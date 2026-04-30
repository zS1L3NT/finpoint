import { Link, router } from "@inertiajs/react"
import { Link2Icon, Link2OffIcon, PiggyBankIcon, SparklesIcon, WrenchIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useMemo } from "react"
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
import BudgetEditorDialog from "@/dialogs/budget-editor"
import { useHistory } from "@/history"
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
	budgetRecordAttachApiRoute,
	budgetRecordDetachApiRoute,
	budgetsWebRoute,
	recordWebRoute,
} from "@/wayfinder/routes"

type BudgetExtra = {
	records: (Record & RecordExtra)[]
}

type RecordExtra = {
	category: Category
}

type CategoryExtra = {
	children: Category[]
}

const getAggregations = (budget: Budget & BudgetExtra) => {
	const startDate = parseDate(budget.start_date)
	const endDate = parseDate(budget.end_date)

	let elapsedSpending = budget.records
		.filter(r => parseDatetime(r.datetime) < startDate)
		.reduce((acc, el) => acc - el.amount, 0)
	let elapsedDays = 0

	const dates: DateTime[] = []
	const elapsedValues: (number | null)[] = []
	const projectedValues: (number | null)[] = []

	for (let i = 0; i <= endDate.diff(startDate, "days").days; i++) {
		const date = startDate.plus({ days: i })
		dates.push(date)

		elapsedValues[i] = null
		projectedValues[i] = null

		if (DateTime.now().endOf("day") >= date.endOf("day")) {
			const amount = round2dp(
				budget.records
					.filter(r => parseDatetime(r.datetime).hasSame(date, "day"))
					.reduce((acc, el) => acc - el.amount, 0),
			)

			elapsedSpending = round2dp(elapsedSpending + amount)
			elapsedDays += 1

			if (i === 0) {
				elapsedValues[i] = amount
			} else {
				// biome-ignore lint/style/noNonNullAssertion: Previous values are always non-null
				elapsedValues[i] = round2dp(elapsedValues[i - 1]! + amount)
			}
		}

		if (DateTime.now().startOf("day") <= date.startOf("day")) {
			const currentPace = elapsedDays > 0 ? round2dp(elapsedSpending / elapsedDays) : 0

			projectedValues[i] = round2dp(elapsedSpending + currentPace * (i + 1 - elapsedDays))
		}
	}

	const remainingSpending = round2dp(budget.amount - elapsedSpending)
	const remainingDays = dates.length - elapsedDays

	const budgetPace = round2dp(budget.amount / dates.length)
	const currentPace = elapsedDays > 0 ? round2dp(elapsedSpending / elapsedDays) : 0
	const idealPace = remainingDays > 0 ? round2dp(remainingSpending / remainingDays) : 0

	return {
		dates,
		elapsedValues,
		projectedValues,
		elapsedSpending,
		projectedSpending: projectedValues.at(-1) ?? elapsedSpending,
		budgetPace,
		currentPace,
		idealPace,
	}
}

export default function BudgetPage({
	budget,
	categories,
}: {
	budget: Budget & BudgetExtra
	categories: (Category & CategoryExtra)[]
}) {
	const { handlePush } = useHistory()

	const attach = async (record: Record) => {
		const response = await fetch(budgetRecordAttachApiRoute.url({ budget, record }), {
			method: "POST",
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			router.reload()
		}
	}

	const detach = async (record: Record) => {
		const response = await fetch(budgetRecordDetachApiRoute.url({ budget, record }), {
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
		elapsedValues,
		projectedValues,
		elapsedSpending,
		projectedSpending,
		budgetPace,
		currentPace,
		idealPace,
	} = useMemo(() => getAggregations(budget), [budget])

	const areaChartData = useMemo(() => {
		const data: {
			[date: string]: { ein?: number; eout?: number; pin?: number; pout?: number }
		} = {}

		for (const date of dates) {
			const key = date.toFormat("d MMM y")
			data[key] = {}
		}

		for (let i = 0; i < elapsedValues.length; i++) {
			const date = dates[i]
			const key = date.toFormat("d MMM y")

			const elapsedValue = elapsedValues[i]
			if (elapsedValue === null) continue

			if (elapsedValue <= budget.amount) {
				data[key].ein = elapsedValue

				// Currently doesn't exceed budget, but will exceed on next day
				const nextElapsedValue = elapsedValues[i + 1]
				if (nextElapsedValue !== null && nextElapsedValue > budget.amount) {
					data[key].eout = elapsedValue
				}
			} else {
				data[key].eout = elapsedValue
			}
		}

		for (let i = 0; i < projectedValues.length; i++) {
			const date = dates[i]
			const key = date.toFormat("d MMM y")

			const projectedValue = projectedValues[i]
			if (projectedValue === null) continue

			if (projectedValue <= budget.amount) {
				data[key].pin = projectedValue

				// Currently doesn't exceed budget, but will exceed on next day
				const nextProjectedValue = projectedValues[i + 1]
				if (nextProjectedValue !== null && nextProjectedValue > budget.amount) {
					data[key].pout = projectedValue

					// Condition to skip setting projected in-budget
					const previousProjectedValue = projectedValues[i - 1]
					if (previousProjectedValue === null) {
						delete data[key].pin
					}
				}
			} else {
				data[key].pout = projectedValue
			}
		}

		return Object.entries(data).map(([date, { ein, eout, pin, pout }]) => ({
			date,
			ein,
			eout,
			pin,
			pout,
		}))
	}, [budget.amount, dates, elapsedValues, projectedValues])

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
												budget.records
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
													budget.records
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
									ein: { label: "Usage" },
									eout: { label: "Exceed" },
									pin: { label: "Usage (Projection)" },
									pout: { label: "Exceed (Projection)" },
								}}
							>
								<AreaChart data={areaChartData}>
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
										dataKey="ein"
										fill="var(--color-green-600)"
										fillOpacity={0.1}
										stroke="var(--color-green-600)"
										strokeWidth={2}
									/>
									<Area
										dataKey="eout"
										fill="var(--color-red-500)"
										fillOpacity={0.1}
										stroke="var(--color-red-500)"
										strokeWidth={2}
									/>

									<Line
										dataKey="pin"
										fill="var(--foreground)"
										fillOpacity={0.1}
										stroke="var(--foreground)"
										strokeWidth={2}
										dot={false}
										animationBegin={1000}
									/>
									<Line
										dataKey="pout"
										fill="var(--color-orange-500)"
										fillOpacity={0.1}
										stroke="var(--color-orange-500)"
										strokeWidth={2}
										dot={false}
										animationBegin={1000}
									/>

									<ReferenceLine label="Budget" y={budget.amount} />

									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent className="w-50" />}
									/>

									<ChartLegend content={<ChartLegendContent />} />
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
							<RecordSearch
								title="Attach record to budget"
								filters={{ exclude_budget_id: budget.id }}
								handler={attach}
								trigger={
									<Button>
										<Link2Icon /> Attach record
									</Button>
								}
							/>
						</CardAction>
					</CardHeader>
					<CardContent>
						<DataTable
							data={budget.records}
							columns={[
								{
									header: "Record",
									meta: { width: TABLE_WIDTHS.RECORD },
									cell: ({ row }) => (
										<div className="flex items-center gap-3">
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
										<span className={classForCurrency(row.original.amount)}>
											{formatCurrency(row.original.amount)}
										</span>
									),
								},
								{
									header: "Date & Time",
									meta: { width: TABLE_WIDTHS.DATETIME },
									cell: ({ row }) => formatDatetime(row.original.datetime),
								},
								{
									header: "Description",
									meta: { width: TABLE_WIDTHS.DESCRIPTION },
									cell: ({ row }) => (
										<div className="truncate text-muted-foreground">
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
													onClick={handlePush(`Budget ${budget.id}`)}
												>
													Open
												</Link>
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => detach(row.original)}
											>
												<Link2OffIcon /> Detach
											</Button>
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
