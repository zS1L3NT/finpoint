import { Link, router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { CalendarSyncIcon, LoaderCircleIcon, PlusIcon } from "lucide-react"
import { useState } from "react"
import DetailCard from "@/components/detail-card"
import AmountField from "@/components/form/amount-field"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
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
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { cn, currencyClass, round2dp, toCurrency } from "@/lib/utils"
import { Paginated, Recurrence } from "@/types"
import {
	recurrenceStoreApiRoute,
	recurrencesWebRoute,
	recurrenceWebRoute,
} from "@/wayfinder/routes"

type RecurrenceOverview = Recurrence & {
	records_count: number
}

type BreakdownSlice = RecurrenceOverview & {
	monthlyAmount: number
	percentage: number
	stroke: string
	dasharray: string
	dashoffset: string
}

const RECURRENCE_COLORS = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)",
]

export default function RecurrencesPage({
	recurrences,
	breakdown,
}: {
	recurrences: Paginated<RecurrenceOverview>
	breakdown: RecurrenceOverview[]
}) {
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: recurrences,
		buildUrl: query => recurrencesWebRoute({ query }).url,
	})

	const slices = buildBreakdownSlices(breakdown)
	const monthlyTotal = slices.reduce((sum, recurrence) => sum + recurrence.monthlyAmount, 0)
	const yearlyTotal = monthlyTotal * 12
	const linkedRecordCount = breakdown.reduce(
		(sum, recurrence) => sum + recurrence.records_count,
		0,
	)

	return (
		<>
			<AppHeader title="Recurrences" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Recurrences"
					subtitle="See your recurring commitments as a monthly breakdown, then dive into the records that support each pattern."
					description="Recurring spend map"
					icon={CalendarSyncIcon}
					actions={<RecurrenceCreateDialog />}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<DetailCard label="Recurrences" value={breakdown.length} />
					<DetailCard label="Monthly run-rate" value={toCurrency(monthlyTotal)} />
					<DetailCard label="Annualised" value={toCurrency(yearlyTotal)} />
					<DetailCard label="Linked records" value={linkedRecordCount} />
				</div>

				<Card className="border border-border/70 bg-linear-to-br from-card via-card to-muted/30 py-0">
					<CardHeader className="border-b py-4">
						<CardDescription>Monthly breakdown</CardDescription>
						<CardTitle>Where your money is going</CardTitle>
						<CardAction className="text-sm text-muted-foreground">
							{toCurrency(monthlyTotal)} / month
						</CardAction>
					</CardHeader>

					<CardContent className="grid gap-6 py-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
						<RecurrencePieChart slices={slices} monthlyTotal={monthlyTotal} />

						<div className="flex flex-col gap-3">
							{slices.length ? (
								slices.map(slice => (
									<div
										key={slice.id}
										className="rounded-lg bg-background/70 p-3 ring-1 ring-border/70"
									>
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<div className="flex items-center gap-2">
													<span
														className="size-2.5 rounded-full"
														style={{
															backgroundColor: slice.stroke,
														}}
													/>
													<p className="truncate font-medium">
														{slice.name}
													</p>
												</div>
												<p className="mt-1 text-xs text-muted-foreground">
													{formatRecurrencePeriod(slice.period)} •{" "}
													{slice.records_count} linked record
													{slice.records_count === 1 ? "" : "s"}
												</p>
											</div>
											<div className="text-right">
												<p className="font-semibold">
													{toCurrency(slice.monthlyAmount)}
												</p>
												<p className="text-xs text-muted-foreground">
													{slice.percentage.toFixed(1)}%
												</p>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="rounded-lg border border-dashed border-border/70 bg-background/60 p-6 text-center text-sm text-muted-foreground">
									Create a recurrence to see your monthly breakdown.
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="flex flex-col gap-1">
					<h3 className="text-xl font-semibold tracking-tight">Recurring items</h3>
					<p className="text-sm text-muted-foreground">
						Open a recurrence to inspect and attach records.
					</p>
				</div>

				<PaginatedDataTable
					paginated={recurrences}
					columns={[
						{
							header: "Recurrence",
							meta: { width: "20rem" },
							cell: ({ row }) => (
								<div className="flex items-center gap-2">
									<p className="truncate font-medium">{row.original.name}</p>
								</div>
							),
						},
						{
							header: "Monthly",
							meta: { width: "6rem" },
							cell: ({ row }) => (
								<span className={cn(currencyClass(row.original.amount), row.original.period === "year" ? "opacity-50" : null)}>
									{toCurrency(
										round2dp(
											row.original.period === "month"
												? row.original.amount
												: row.original.amount / 12,
										),
									)}
								</span>
							),
						},
						{
							header: "Yearly",
							meta: { width: "6rem" },
							cell: ({ row }) => (
								<span className={cn(currencyClass(row.original.amount), row.original.period === "month" ? "opacity-50" : null)}>
									{toCurrency(
										round2dp(
											row.original.period === "year"
												? row.original.amount
												: row.original.amount * 12,
										),
									)}
								</span>
							),
						},
						{
							id: "actions",
							cell: ({ row }) => (
								<div className="flex justify-end">
									<Button variant="outline" size="sm" asChild>
										<Link
											href={recurrenceWebRoute.url({
												recurrence: row.original,
											})}
										>
											Open
										</Link>
									</Button>
								</div>
							),
						},
					]}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search recurrences...",
					}}
					footer={{
						summary: `Showing ${recurrences.data.length} of ${recurrences.total} recurrences.`,
					}}
					emptyMessage="No recurrences found."
				/>
			</div>
		</>
	)
}

function RecurrencePieChart({
	slices,
	monthlyTotal,
}: {
	slices: BreakdownSlice[]
	monthlyTotal: number
}) {
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="relative flex size-72 items-center justify-center">
				<svg viewBox="0 0 120 120" className="size-full -rotate-90">
					<circle
						cx="60"
						cy="60"
						r="42"
						fill="none"
						stroke="color-mix(in oklch, var(--color-border) 65%, transparent)"
						strokeWidth="14"
					/>
					{slices.map(slice => (
						<circle
							key={slice.id}
							cx="60"
							cy="60"
							r="42"
							fill="none"
							stroke={slice.stroke}
							strokeWidth="14"
							strokeLinecap="round"
							strokeDasharray={slice.dasharray}
							strokeDashoffset={slice.dashoffset}
						/>
					))}
				</svg>

				<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
					<p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
						Monthly total
					</p>
					<p className="mt-2 text-2xl font-semibold">{toCurrency(monthlyTotal)}</p>
				</div>
			</div>

			<p className="max-w-xs text-center text-sm text-muted-foreground">
				Weekly and yearly recurrences are normalized into a monthly view so you can compare
				them side by side.
			</p>
		</div>
	)
}

function RecurrenceCreateDialog() {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			name: "",
			amount: 0,
			period: "month" as Recurrence["period"],
		},
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("name", value.name)
			formData.append("amount", `${value.amount}`)
			formData.append("period", value.period)

			const response = await fetch(recurrenceStoreApiRoute.url(), {
				method: "POST",
				body: formData,
				headers: { Accept: "application/json" },
			})

			if (response.status === 422) {
				const data = await response.json().catch(() => null)
				setApiErrors((data?.errors ?? {}) as Record<string, string[]>)
				return
			}

			if (response.ok) {
				setOpen(false)
				router.reload()
			}
		},
	})

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
						<PlusIcon /> New Recurrence
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Create Recurrence</DialogTitle>
					<DialogDescription>
						Add a recurring expense or income stream so it appears in the monthly
						breakdown.
					</DialogDescription>
				</DialogHeader>

				<form
					id="recurrence-create-form"
					className="grid gap-6"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<FieldGroup>
						<form.Field
							name="name"
							children={field => (
								<Field
									data-invalid={
										!!mergeErrors(field.state.meta.errors, field.name).length
									}
								>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<Input
										id={field.name}
										value={field.state.value}
										onChange={event => {
											field.handleChange(event.target.value)
											clearApiError(field.name)
										}}
										aria-invalid={
											!!mergeErrors(field.state.meta.errors, field.name)
												.length
										}
									/>
								</Field>
							)}
						/>

						<form.Field
							name="amount"
							children={field => (
								<AmountField
									id={field.name}
									label="Amount"
									value={field.state.value}
									errors={mergeErrors(field.state.meta.errors, field.name)}
									onChange={value => {
										field.handleChange(value)
										clearApiError(field.name)
									}}
								/>
							)}
						/>

						<form.Field
							name="period"
							children={field => (
								<Field>
									<FieldLabel htmlFor={field.name}>Period</FieldLabel>
									<Select
										value={field.state.value}
										onValueChange={value => {
											field.handleChange(value as Recurrence["period"])
											clearApiError(field.name)
										}}
									>
										<SelectTrigger id={field.name} className="w-full">
											<SelectValue placeholder="Select period" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="week">Weekly</SelectItem>
												<SelectItem value="month">Monthly</SelectItem>
												<SelectItem value="year">Yearly</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
									<FieldDescription>
										Used to convert the recurrence into a comparable monthly
										amount.
									</FieldDescription>
								</Field>
							)}
						/>
					</FieldGroup>
				</form>

				<DialogFooter>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="recurrence-create-form">
						<form.Subscribe
							selector={state => state.isSubmitting}
							children={isSubmitting =>
								isSubmitting ? <LoaderCircleIcon className="animate-spin" /> : null
							}
						/>
						Create recurrence
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function buildBreakdownSlices(recurrences: RecurrenceOverview[]) {
	const monthlyTotal = recurrences.reduce(
		(sum, recurrence) => sum + toMonthlyAmount(recurrence.amount, recurrence.period),
		0,
	)

	let offset = 0

	return recurrences.map((recurrence, index) => {
		const monthlyAmount = round2dp(toMonthlyAmount(recurrence.amount, recurrence.period))
		const percentage = monthlyTotal === 0 ? 0 : (monthlyAmount / monthlyTotal) * 100
		const circumference = 2 * Math.PI * 42
		const segmentLength = (percentage / 100) * circumference

		const slice = {
			...recurrence,
			monthlyAmount,
			percentage,
			stroke: RECURRENCE_COLORS[index % RECURRENCE_COLORS.length],
			dasharray: `${segmentLength} ${circumference - segmentLength}`,
			dashoffset: `${-offset}`,
		}

		offset += segmentLength
		return slice
	})
}

function toMonthlyAmount(amount: number, period: Recurrence["period"]) {
	switch (period) {
		case "week":
			return (amount * 52) / 12
		case "year":
			return amount / 12
		default:
			return amount
	}
}

function formatRecurrencePeriod(period: Recurrence["period"]) {
	return period === "week" ? "Weekly" : period === "year" ? "Yearly" : "Monthly"
}
