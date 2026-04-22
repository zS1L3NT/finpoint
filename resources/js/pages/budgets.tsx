import { Link, router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { LoaderCircleIcon, PiggyBankIcon, PlusIcon, SparklesIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useState } from "react"
import AppHeader from "@/components/app-header"
import DataTable from "@/components/data-table"
import DetailCard from "@/components/detail-card"
import AmountField from "@/components/form/amount-field"
import TextField from "@/components/form/text-field"
import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { cn, currencyClass, round2dp, toCurrency } from "@/lib/utils"
import { Budget, Paginated } from "@/types"
import { budget as budgetRoute, budgets as budgetsRoute } from "@/wayfinder/routes"
import { store as storeBudget } from "@/wayfinder/routes/budgets"

type BudgetOverview = Budget & {
	records_sum_amount: number | null
	records_count: number
}

export default function BudgetsPage({
	budgets,
	overview,
}: {
	budgets: Paginated<BudgetOverview>
	overview: BudgetOverview[]
}) {
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: budgets,
		buildUrl: query => budgetsRoute({ query }).url,
	})

	const totalBudgeted = overview.reduce((sum, budget) => sum + budget.amount, 0)
	const totalSpent = overview.reduce(
		(sum, budget) => sum + Math.abs(Math.min(budget.records_sum_amount ?? 0, 0)),
		0,
	)
	const activeBudgetCount = overview.filter(budget => isBudgetActive(budget)).length

	return (
		<>
			<AppHeader title="Budgets" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Budgets"
					subtitle="Track fixed spending windows, monitor how much has already been consumed, and jump straight into the records inside each budget."
					description="Budget planner"
					icon={PiggyBankIcon}
					actions={<BudgetCreateDialog />}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<DetailCard label="Budgets" value={overview.length} />
					<DetailCard label="Active Now" value={activeBudgetCount} />
					<DetailCard label="Planned Spend" value={toCurrency(totalBudgeted)} />
					<DetailCard
						label="Tracked Spend"
						value={toCurrency(-Math.abs(totalSpent))}
						valueClassName={currencyClass(-Math.abs(totalSpent))}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="text-xl font-semibold tracking-tight">Budget library</h3>
					<p className="text-sm text-muted-foreground">
						Open a budget to inspect records, adjust rules, or attach extra entries.
					</p>
				</div>

				<DataTable
					data={budgets}
					columns={[
						{
							header: "Budget",
							cell: ({ row }) => {
								const budget = row.original

								return (
									<div className="min-w-0">
										<div className="flex items-center gap-2">
											<p className="truncate font-medium">{budget.name}</p>
											<span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
												{isBudgetActive(budget) ? "Active" : "Planned"}
											</span>
										</div>
										<p className="truncate text-muted-foreground">
											{budget.automatic
												? "Auto-attaches in-range records"
												: "Manual record assignment"}
										</p>
									</div>
								)
							},
						},
						{
							header: "Window",
							meta: { width: "16rem" },
							cell: ({ row }) => (
								<span className="text-muted-foreground">
									{formatBudgetDateWindow(row.original)}
								</span>
							),
						},
						{
							header: "Usage",
							meta: { width: "18rem" },
							cell: ({ row }) => {
								const spent = Math.abs(
									Math.min(row.original.records_sum_amount ?? 0, 0),
								)
								const usage =
									row.original.amount === 0
										? 0
										: Math.min((spent / row.original.amount) * 100, 100)

								return (
									<div className="w-full max-w-xs space-y-2">
										<div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
											<span>{Math.round(usage)}% used</span>
											<span>
												{toCurrency(-spent)} of{" "}
												{toCurrency(row.original.amount)}
											</span>
										</div>
										<Progress value={usage} className="h-2" />
									</div>
								)
							},
						},
						{
							header: "Remaining",
							meta: { width: "8rem" },
							cell: ({ row }) => {
								const spent = Math.abs(
									Math.min(row.original.records_sum_amount ?? 0, 0),
								)
								const remaining = round2dp(row.original.amount - spent)

								return (
									<span
										className={cn(
											"font-medium",
											remaining < 0 ? "text-destructive" : "text-foreground",
										)}
									>
										{toCurrency(remaining)}
									</span>
								)
							},
						},
						{
							header: "Records",
							meta: { width: "6rem" },
							cell: ({ row }) => (
								<span className="text-muted-foreground">
									{row.original.records_count}
								</span>
							),
						},
						{
							header: "Mode",
							meta: { width: "8rem" },
							cell: ({ row }) => (
								<div className="flex items-center gap-2 text-muted-foreground">
									{row.original.automatic ? (
										<SparklesIcon className="size-3.5" />
									) : null}
									<span>{row.original.automatic ? "Automatic" : "Manual"}</span>
								</div>
							),
						},
						{
							id: "actions",
							meta: { width: "4rem" },
							cell: ({ row }) => (
								<Button variant="outline" size="sm" asChild>
									<Link href={budgetRoute.url({ budget: row.original })}>
										Open
									</Link>
								</Button>
							),
						},
					]}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search budgets...",
					}}
					footer={{
						summary: `Showing ${budgets.data.length} of ${budgets.total} budgets.`,
					}}
					emptyMessage="No budgets found."
				/>
			</div>
		</>
	)
}

function BudgetCreateDialog() {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			name: "",
			amount: 0,
			start_date: "",
			end_date: "",
			automatic: true,
		},
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("name", value.name)
			formData.append("amount", `${value.amount}`)
			formData.append("start_date", value.start_date)
			formData.append("end_date", value.end_date)
			if (value.automatic) {
				formData.append("automatic", "on")
			}

			const response = await fetch(storeBudget.url(), {
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
						<PlusIcon /> New Budget
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Create Budget</DialogTitle>
					<DialogDescription>
						Set a target amount and date window. Records can be auto-attached when they
						land inside the budget period.
					</DialogDescription>
				</DialogHeader>

				<form
					id="budget-create-form"
					className="grid gap-6"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<FieldGroup className="grid gap-4 md:grid-cols-2">
						<form.Field
							name="name"
							children={field => (
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
						/>
						<form.Field
							name="amount"
							children={field => (
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
						/>
						<form.Field
							name="start_date"
							children={field => (
								<Field
									data-invalid={
										!!mergeErrors(field.state.meta.errors, field.name).length
									}
								>
									<FieldLabel htmlFor={field.name}>Start date</FieldLabel>
									<Input
										id={field.name}
										type="date"
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
							name="end_date"
							children={field => (
								<Field
									data-invalid={
										!!mergeErrors(field.state.meta.errors, field.name).length
									}
								>
									<FieldLabel htmlFor={field.name}>End date</FieldLabel>
									<Input
										id={field.name}
										type="date"
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
					</FieldGroup>

					<form.Field
						name="automatic"
						children={field => (
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
										Attach records that land inside the date range as soon as
										the budget is created.
									</FieldDescription>
								</div>
							</Field>
						)}
					/>
				</form>

				<DialogFooter>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="budget-create-form">
						<form.Subscribe
							selector={state => state.isSubmitting}
							children={isSubmitting =>
								isSubmitting ? <LoaderCircleIcon className="animate-spin" /> : null
							}
						/>
						Create budget
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function isBudgetActive(budget: Budget) {
	const now = DateTime.now()
	const start = DateTime.fromFormat(budget.start_date, "yyyy-MM-dd").startOf("day")
	const end = DateTime.fromFormat(budget.end_date, "yyyy-MM-dd").endOf("day")

	return start.isValid && end.isValid && now >= start && now <= end
}

function formatBudgetDateWindow(budget: Budget) {
	const start = DateTime.fromFormat(budget.start_date, "yyyy-MM-dd")
	const end = DateTime.fromFormat(budget.end_date, "yyyy-MM-dd")

	return start.isValid && end.isValid
		? `${start.toFormat("d MMM yyyy")} to ${end.toFormat("d MMM yyyy")}`
		: "No time range set"
}
