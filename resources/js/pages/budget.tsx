import { Link, router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { PencilIcon, PiggyBankIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import {
	Area,
	AreaChart,
	CartesianGrid,
	Label,
	Pie,
	PieChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts"
import DetailCard from "@/components/detail-card"
import AmountField from "@/components/form/amount-field"
import TextField from "@/components/form/text-field"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import {
	classForCurrency,
	formatCurrency,
	formatDatetime,
	parseDate,
	parseDatetime,
	round2dp,
	withMethod,
} from "@/lib/utils"
import { Budget, Category, Record } from "@/types"
import {
	budgetDestroyApiRoute,
	budgetRecordDestroyApiRoute,
	budgetRecordUpdateApiRoute,
	budgetsWebRoute,
	budgetUpdateApiRoute,
	recordWebRoute,
} from "@/wayfinder/routes"

/**
 * Show a line for current pace & recommended pace
 * Add more details into the details cards
 */

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
	const cumulated: number[] = []

	for (let i = 0; i <= endDate.diff(startDate, "days").days; i++) {
		const date = startDate.plus({ days: i })
		dates.push(date)

		const amountForDate = round2dp(
			budget.records
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

	const currentPace = elapsedDays > 0 ? round2dp(elapsedSpending / elapsedDays) : 0
	const idealPace = remainingDays > 0 ? round2dp(remainingSpending / remainingDays) : 0

	const projectedSpending = round2dp(currentPace * dates.length)
	const projectedExceedDate =
		currentPace * dates.length > budget.amount
			? startDate.plus({ days: Math.ceil(budget.amount / currentPace) })
			: null

	return {
		dates,
		cumulated,
		elapsedSpending,
		remainingSpending,
		elapsedDays,
		remainingDays,
		currentPace,
		idealPace,
		projectedSpending,
		projectedExceedDate,
	}
}

export default function BudgetPage({
	budget,
	categories,
}: {
	budget: Budget & BudgetExtra
	categories: (Category & CategoryExtra)[]
}) {
	const {
		dates,
		cumulated,
		elapsedSpending,
		remainingSpending,
		elapsedDays,
		currentPace,
		idealPace,
		projectedSpending,
		projectedExceedDate,
	} = useMemo(() => getAggregations(budget), [budget])

	console.log("Average daily spend:", formatCurrency(currentPace))
	console.log("Recommended daily spend for remaining days:", formatCurrency(idealPace))

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

	return (
		<>
			<AppHeader title="Budget" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title={budget.name}
					description="Budget details"
					icon={PiggyBankIcon}
					actions={<BudgetEditorDialog budget={budget} />}
					back={{ name: "Back to budgets", url: budgetsWebRoute.url() }}
				/>

				<div className="grid gap-4 md:grid-cols-4 xl:grid-cols-5">
					<DetailCard
						label="Budget Usage"
						value={
							<div className="space-y-2">
								<div>
									<p className="text-sm">{formatCurrency(elapsedSpending)}</p>
									<p className="text-muted-foreground">{`${Math.ceil((elapsedSpending / budget.amount) * 100)}% of ${formatCurrency(budget.amount)}`}</p>
								</div>
								<Progress
									value={(elapsedSpending / budget.amount) * 100}
									className="h-2"
								/>
							</div>
						}
					/>
					<DetailCard
						label="Usage Pace"
						value={
							<div>
								<p className="text-sm">{formatCurrency(currentPace)} / day</p>
								{/* <p className="text-muted-foreground">
									Spend {toCurrency(idealPace)} / day or less to stay on track
								</p> */}
							</div>
						}
					/>
					<DetailCard
						label="Recommended Pace"
						value={
							<div>
								<p className="text-sm">{formatCurrency(idealPace)} / day</p>
								{/* <p className="text-muted-foreground">
									Spend {toCurrency(idealPace)} / day or less to stay on track
								</p> */}
							</div>
						}
					/>
					<DetailCard
						label="Usage Projection"
						value={
							<div>
								<p className="text-sm">{formatCurrency(projectedSpending)}</p>
								<p className="text-muted-foreground">
									{projectedExceedDate
										? projectedExceedDate > DateTime.now()
											? `Will exceed on ${projectedExceedDate.toFormat("d MMM y")}`
											: `Exceeded on ${projectedExceedDate.toFormat("d MMM y")}`
										: "On track to stay within budget"}
								</p>
							</div>
						}
						valueClassName={remainingSpending < 0 ? "text-destructive" : undefined}
					/>
					<DetailCard
						label="Mode"
						value={budget.automatic ? "Automatic attach" : "Manual attach"}
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
										})),
										...dates.slice(elapsedDays).map((d, i) => ({
											date: d.toFormat("d MMM y"),
										})),
									]}
								>
									<CartesianGrid />
									<XAxis dataKey="date" />
									<YAxis min={budget.amount} />

									<Area
										dataKey="within"
										fill="var(--color-green-600)"
										fillOpacity={0.25}
										stroke="var(--color-green-600)"
									/>
									<Area
										dataKey="exceed"
										fill="var(--color-red-500)"
										fillOpacity={0.25}
										stroke="var(--color-red-500)"
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
							<RecordSearch
								title="Attach record to budget"
								excluded={budget.records}
								handler={attach}
								trigger={
									<Button>
										<PlusIcon /> Attach record
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
												>
													Open
												</Link>
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => detach(row.original)}
											>
												<Trash2Icon /> Remove
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

function BudgetEditorDialog({ budget }: { budget: Budget }) {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			name: budget.name,
			amount: budget.amount,
			automatic: budget.automatic,
		},
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("name", value.name)
			formData.append("amount", `${value.amount}`)
			if (value.automatic) {
				formData.append("automatic", "on")
			}

			const response = await fetch(budgetUpdateApiRoute.url({ budget }), {
				method: "POST",
				body: withMethod(formData, "PUT"),
				headers: { Accept: "application/json" },
			})

			if (response.status === 422) {
				const data = await response.json().catch(() => null)
				setApiErrors((data?.errors ?? {}) as globalThis.Record<string, string[]>)
				return
			}

			if (response.ok) {
				setOpen(false)
				router.reload()
			}
		},
	})

	const handleDelete = async () => {
		const response = await fetch(budgetDestroyApiRoute.url({ budget }), {
			method: "POST",
			body: withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			setOpen(false)
			router.visit(budgetsWebRoute.url())
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={nextOpen => {
				setOpen(nextOpen)
				if (nextOpen) {
					form.reset()
					resetApiErrors()
				}
			}}
		>
			<DialogTrigger
				render={
					<Button size="lg">
						<PencilIcon /> Edit budget
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Edit Budget</DialogTitle>
					<DialogDescription>
						Update the target spend or switch between automatic and manual record
						assignment.
					</DialogDescription>
				</DialogHeader>

				<form
					id="budget-edit-form"
					className="grid gap-6"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<div className="grid gap-4 md:grid-cols-2">
						<form.Field name="name">
							{field => (
								<TextField
									id={field.name}
									label="Name"
									value={field.state.value}
									errors={mergeErrors(field.state.meta.errors, field.name)}
									onChange={value => {
										field.handleChange(value)
										clearApiError(field.name)
									}}
								/>
							)}
						</form.Field>
						<form.Field name="amount">
							{field => (
								<AmountField
									id={field.name}
									label="Amount"
									value={field.state.value}
									min={0}
									errors={mergeErrors(field.state.meta.errors, field.name)}
									onChange={value => {
										field.handleChange(value)
										clearApiError(field.name)
									}}
								/>
							)}
						</form.Field>
					</div>

					<form.Field name="automatic">
						{field => (
							<Field orientation="horizontal">
								<Checkbox
									checked={field.state.value}
									onCheckedChange={checked =>
										field.handleChange(checked === true)
									}
									id={field.name}
								/>
								<div className="space-y-1">
									<FieldLabel htmlFor={field.name}>Automatic attach</FieldLabel>
									<FieldDescription>
										When enabled, updates will also pull in records that fall
										inside the budget date range.
									</FieldDescription>
								</div>
							</Field>
						)}
					</form.Field>
				</form>

				<DialogFooter>
					<Button
						type="button"
						variant="destructive"
						className="mr-auto"
						onClick={handleDelete}
					>
						<Trash2Icon /> Delete
					</Button>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="budget-edit-form">
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
