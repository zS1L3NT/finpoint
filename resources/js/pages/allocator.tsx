import { Link, router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { LinkIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import AppHeader from "@/components/app-header"
import DataTable from "@/components/data-table"
import AmountField from "@/components/form/amount-field"
import ComboboxField from "@/components/form/combobox-field"
import DatetimeField from "@/components/form/datetime-field"
import TextField from "@/components/form/text-field"
import TextareaField from "@/components/form/textarea-field"
import Icon from "@/components/icon"
import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { cn, round2dp, toCurrency, toDate } from "@/lib/utils"
import { Account, Category, Paginated, Statement } from "@/types"
import { allocator, statement } from "@/wayfinder/routes"
import { store } from "@/wayfinder/routes/records"

type StatementExtra = {
	account: Account
	allocations_sum_amount: number | null
}

type CategoryExtra = {
	children: Category[]
}

export default function Allocator({
	statements,
	categories,
}: {
	statements: Paginated<Statement & StatementExtra>
	categories: (Category & CategoryExtra)[]
}) {
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query => allocator({ query }).url,
	})

	useEffect(() => {
		setRowSelection(currentSelection =>
			Object.fromEntries(
				statements.data
					.filter(statement => currentSelection[statement.id])
					.map(statement => [statement.id, true]),
			),
		)
	}, [statements.data])

	return (
		<>
			<AppHeader title="Allocator" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Allocator"
					subtitle="Allocate bank statements to app records."
					description="Allocation workspace"
					icon={LinkIcon}
				/>

				<DataTable
					data={statements}
					columns={[
						{
							id: "select",
							meta: { width: "3rem" },
							cell: ({ row }) => (
								<div className="flex items-center justify-center">
									<Checkbox
										checked={row.getIsSelected()}
										onCheckedChange={value => row.toggleSelected(!!value)}
										aria-label={`Select statement ${row.original.id}`}
									/>
								</div>
							),
						},
						{
							header: "Account",
							meta: { width: "8rem" },
							cell: ({ row }) => row.original.account.id,
						},
						{
							header: "Date",
							meta: { width: "8rem" },
							cell: ({ row }) => (
								<span className="text-muted-foreground">
									{toDate(row.original.date)}
								</span>
							),
						},
						{
							header: "Amount",
							meta: { width: "16rem" },
							cell: ({ row }) => {
								const total = row.original.amount
								const allocable = round2dp(
									total - (row.original.allocations_sum_amount ?? 0),
								)

								return (
									<Field className="w-full max-w-sm">
										<FieldLabel>
											<span>Allocable</span>
											<div className="ml-auto">
												<span
													className={cn(
														"text-muted-foreground",
														allocable < 0
															? "text-red-500"
															: allocable > 0
																? "text-green-500"
																: "text-foreground",
													)}
												>
													{toCurrency(allocable)}
												</span>
												{" / "}
												<span
													className={cn(
														"font-bold",
														total < 0
															? "text-red-500"
															: total > 0
																? "text-green-500"
																: "text-foreground",
													)}
												>
													{toCurrency(total)}
												</span>
											</div>
										</FieldLabel>
										<Progress
											value={total === 0 ? 0 : (allocable / total) * 100}
										/>
									</Field>
								)
							},
						},
						{
							header: "Description",
							cell: ({ row }) => (
								<div className="truncate text-muted-foreground">
									{row.original.description}
								</div>
							),
						},
						{
							id: "actions",
							meta: { width: "4rem" },
							cell: ({ row }) => (
								<Button variant="outline" size="sm" asChild>
									<Link href={statement.url({ statement: row.original })}>
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
						searchPlaceholder: "Filter statements...",
						children: (
							<AllocateRecordDialog
								statements={statements.data}
								rowSelection={rowSelection}
								categories={categories}
								clear={() => setRowSelection({})}
							/>
						),
					}}
					footer={{
						summary: `${Object.values(rowSelection).filter(Boolean).length} selected. Showing ${statements.data.length} of ${statements.total} statements.`,
					}}
					emptyMessage="No statements found."
					getRowId={row => row.id}
					rowSelection={rowSelection}
					setRowSelection={setRowSelection}
				/>
			</div>
		</>
	)
}

function AllocateRecordDialog({
	statements,
	rowSelection,
	categories,
	clear,
}: {
	statements: (Statement & StatementExtra)[]
	rowSelection: Record<string, boolean>
	categories: (Category & CategoryExtra)[]
	clear: () => void
}) {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()
	const selected = statements.filter(statement => rowSelection[statement.id])

	const categoriesFlat = categories.flatMap(category => [category, ...category.children])
	const initialValues = {
		title: "",
		people: "",
		location: "",
		datetime: inferAllocatorDatetime(selected),
		category_id: "",
		description: "",
		statements: selected.map(statement => ({
			id: statement.id,
			amount: round2dp(statement.amount - (statement.allocations_sum_amount ?? 0)),
		})),
	}

	const form = useForm({
		defaultValues: initialValues,
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("title", value.title)
			formData.append("people", value.people)
			formData.append("location", value.location)
			formData.append("datetime", value.datetime)
			formData.append("category_id", value.category_id)
			formData.append("description", value.description)

			value.statements.forEach((statement, index) => {
				formData.append(`statements[${index}][id]`, statement.id)
				formData.append(`statements[${index}][amount]`, `${statement.amount}`)
			})

			const response = await fetch(store.url(), {
				method: "POST",
				body: formData,
				headers: { Accept: "application/json" },
			})

			if (response.status === 422) {
				const data = await response.json().catch(() => null)
				setApiErrors((data?.errors ?? {}) as globalThis.Record<string, string[]>)
				return
			}

			if (response.status === 201) {
				setOpen(false)
				clear()
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
					form.reset(initialValues)
					resetApiErrors()
				}
			}}
		>
			<DialogTrigger
				render={
					<Button disabled={!selected.length}>
						<LinkIcon /> Create Record
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle>Create New Record</DialogTitle>
					<DialogDescription>
						Allocate {selected.length} selected statement(s) to a new record.
					</DialogDescription>
				</DialogHeader>

				<form
					id="allocate-record-form"
					className="grid gap-8 lg:grid-cols-2"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<div className="flex flex-col gap-4">
						<p className="text-sm font-semibold">Record Information</p>

						<FieldGroup>
							<form.Field
								name="title"
								children={field => (
									<TextField
										id={field.name}
										label="Title"
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
								name="people"
								children={field => (
									<TextField
										id={field.name}
										label="People"
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
								name="location"
								children={field => (
									<TextField
										id={field.name}
										label="Location"
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
								name="datetime"
								children={field => (
									<DatetimeField
										id={field.name}
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
								name="category_id"
								children={field => (
									<ComboboxField
										id={field.name}
										label="Category"
										value={
											categoriesFlat.find(
												category => category.id === field.state.value,
											) ?? null
										}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										placeholder="Select category"
										emptyText="No categories found."
										items={categoriesFlat}
										getItemId={category => category.id}
										getItemString={category => category.name}
										renderItem={category => (
											<div
												className={cn(
													"flex items-center gap-1",
													category.parent_category_id ? "pl-2" : null,
												)}
											>
												<Icon {...category} size={10} />
												{category.name}
											</div>
										)}
										onChange={value => {
											field.handleChange(value?.id ?? "")
											clearApiError(field.name)
										}}
									/>
								)}
							/>
							<form.Field
								name="description"
								children={field => (
									<TextareaField
										id={field.name}
										label="Description"
										value={field.state.value}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							/>
						</FieldGroup>
					</div>

					<div className="flex flex-col gap-4">
						<p className="text-sm font-semibold">Allocation Amounts</p>

						<div className="flex flex-col gap-2">
							{selected.map((statement, index) => (
								<form.Field
									key={statement.id}
									name={`statements[${index}].amount` as const}
									children={field => {
										const errors = mergeErrors(
											field.state.meta.errors,
											field.name,
										)
										const allocable = round2dp(
											statement.amount -
												(statement.allocations_sum_amount ?? 0),
										)

										return (
											<Card
												className={cn(
													errors.length ? "border-destructive/50" : null,
												)}
											>
												<CardHeader>
													<CardTitle className="text-sm leading-5">
														{statement.description}
													</CardTitle>
													<CardDescription>
														{toDate(statement.date)}
													</CardDescription>
													<CardAction className="text-sm font-semibold">
														{toCurrency(statement.amount)}
													</CardAction>
												</CardHeader>
												<CardContent className="flex flex-col gap-4">
													<AmountField
														id={field.name}
														label="Amount"
														value={field.state.value}
														errors={errors}
														suffix={`of ${toCurrency(allocable)}`}
														onChange={value => {
															field.handleChange(value)
															clearApiError(field.name)
														}}
													/>
													<Progress
														value={
															allocable === 0
																? 0
																: Math.max(
																		0,
																		Math.min(
																			(field.state.value /
																				allocable) *
																				100,
																			100,
																		),
																	)
														}
													/>
												</CardContent>
											</Card>
										)
									}}
								/>
							))}
						</div>
					</div>
				</form>

				<DialogFooter>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="allocate-record-form">
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const DESCRIPTION_DATE_REGEX = /\b\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/

function inferAllocatorDatetime(statements: (Statement & StatementExtra)[]) {
	const describedDates = statements.flatMap(statement => {
		const match = statement.description.match(DESCRIPTION_DATE_REGEX)?.[0]
		if (!match) {
			return []
		}

		const statementDate = DateTime.fromFormat(statement.date, "yyyy-MM-dd")
		if (!statementDate.isValid) {
			return []
		}

		let describedDate = DateTime.fromFormat(
			`${statementDate.year}-${match.slice(0, 2)}${match.slice(2).toLowerCase()}`,
			"yyyy-ddMMM",
		).startOf("day")

		if (!describedDate.isValid) {
			return []
		}

		if (describedDate.toMillis() > statementDate.endOf("day").toMillis()) {
			describedDate = describedDate.minus({ years: 1 })
		}

		return [describedDate]
	})

	const earliestDate =
		[...describedDates].sort((a, b) => a.toMillis() - b.toMillis())[0] ??
		statements
			.flatMap(statement => {
				const statementDate = DateTime.fromFormat(statement.date, "yyyy-MM-dd").startOf(
					"day",
				)
				return statementDate.isValid ? [statementDate] : []
			})
			.sort((a, b) => a.toMillis() - b.toMillis())[0]

	return earliestDate ? earliestDate.toFormat("yyyy-MM-dd'T'HH:mm") : ""
}
