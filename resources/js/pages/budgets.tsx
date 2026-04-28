import { Link, router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { PiggyBankIcon, PlusIcon, SparklesIcon, WrenchIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useState } from "react"
import AmountField from "@/components/form/amount-field"
import TextField from "@/components/form/text-field"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { Badge } from "@/components/ui/badge"
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
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { formatCurrency, parseDate } from "@/lib/utils"
import { Budget, Paginated } from "@/types"
import { budgetStoreApiRoute, budgetsWebRoute, budgetWebRoute } from "@/wayfinder/routes"

type BudgetExtra = {
	records_sum_amount: number | null
}

export default function BudgetsPage({ budgets }: { budgets: Paginated<Budget & BudgetExtra> }) {
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: budgets,
		buildUrl: query => budgetsWebRoute({ query }).url,
	})

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

				<PaginatedDataTable
					paginated={budgets}
					columns={[
						{
							header: "Budget",
							meta: { width: TABLE_WIDTHS.BUDGET },
							cell: ({ row }) => {
								const budget = row.original

								const now = DateTime.now()
								const start = parseDate(budget.start_date).startOf("day")
								const end = parseDate(budget.end_date).endOf("day")

								return (
									<div className="flex items-center gap-2">
										<p className="truncate font-medium">{budget.name}</p>
										<Badge
											variant={
												now >= start && now <= end ? "default" : "secondary"
											}
										>
											{now <= start
												? "Upcoming"
												: now >= end
													? "Passed"
													: "Active"}
										</Badge>
									</div>
								)
							},
						},
						{
							header: "Usage",
							meta: { width: TABLE_WIDTHS.BUDGET_USAGE },
							cell: ({ row }) => {
								const budget = row.original

								const spent = Math.abs(Math.min(budget.records_sum_amount ?? 0, 0))
								const usage =
									budget.amount === 0
										? 0
										: Math.min((spent / budget.amount) * 100, 100)

								return (
									<div className="w-full max-w-xs space-y-2 pe-8">
										<div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
											<span>{Math.round(usage)}% used</span>
											<span>
												{formatCurrency(spent)}
												{" / "}
												{formatCurrency(budget.amount)}
											</span>
										</div>
										<Progress value={usage} className="h-2" />
									</div>
								)
							},
						},
						{
							header: "Window",
							meta: { width: TABLE_WIDTHS.BUDGET_WINDOW },
							cell: ({ row }) => (
								<span className="text-muted-foreground pe-8">
									{formatBudgetDateWindow(row.original)}
								</span>
							),
						},
						{
							header: "Type",
							meta: { width: TABLE_WIDTHS.BUDGET_TYPE },
							cell: ({ row }) => (
								<div className="flex items-center gap-2 text-muted-foreground pe-8">
									{row.original.automatic ? (
										<SparklesIcon className="size-4" />
									) : (
										<WrenchIcon className="size-4" />
									)}
									<span>{row.original.automatic ? "Automatic" : "Manual"}</span>
								</div>
							),
						},
						{
							id: "actions",
							cell: ({ row }) => (
								<div className="flex justify-end">
									<Button variant="outline" size="sm" asChild>
										<Link href={budgetWebRoute.url({ budget: row.original })}>
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

			const response = await fetch(budgetStoreApiRoute.url(), {
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
						<form.Field name="start_date">
							{field => (
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
						</form.Field>
						<form.Field name="end_date">
							{field => (
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
						</form.Field>
					</FieldGroup>

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
										Attach records that land inside the date range as soon as
										the budget is created.
									</FieldDescription>
								</div>
							</Field>
						)}
					</form.Field>
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
						Create budget
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function formatBudgetDateWindow(budget: Budget) {
	const start = parseDate(budget.start_date)
	const end = parseDate(budget.end_date)

	return start.isValid && end.isValid
		? `${start.toFormat("d MMM yyyy")} to ${end.toFormat("d MMM yyyy")}`
		: "No time range set"
}
