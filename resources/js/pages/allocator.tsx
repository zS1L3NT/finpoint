import { Link, router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { LinkIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useState } from "react"
import AllocateBar from "@/components/allocate-bar"
import DetailCard from "@/components/detail-card"
import AmountField from "@/components/form/amount-field"
import ComboboxField from "@/components/form/combobox-field"
import DatetimeField from "@/components/form/datetime-field"
import TextField from "@/components/form/text-field"
import TextareaField from "@/components/form/textarea-field"
import Icon from "@/components/icon"
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
import { FieldGroup } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import {
	classForCurrency,
	cn,
	formatCurrency,
	formatDatetime,
	parseDatetime,
	round2dp,
} from "@/lib/utils"
import { Account, Category, Paginated, Statement } from "@/types"
import { allocatorApiRoute, allocatorWebRoute, statementWebRoute } from "@/wayfinder/routes"

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
	titles,
	locations,
	peoples,
}: {
	statements: Paginated<Statement & StatementExtra>
	categories: (Category & CategoryExtra)[]
	titles: string[]
	locations: string[]
	peoples: string[]
}) {
	const [selected, setSelected] = useState<(Statement & StatementExtra)[]>([])
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: statements,
		buildUrl: query => allocatorWebRoute({ query }).url,
	})

	const selectedAmount = selected.reduce(
		(sum, statement) => sum + (statement.amount - (statement.allocations_sum_amount ?? 0)),
		0,
	)

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

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<DetailCard label="Pending Statements" value={statements.total} />
					<DetailCard label="Selected Statements" value={selected.length} />
					<DetailCard
						label="Selected Amount"
						value={formatCurrency(selectedAmount)}
						valueClassName={classForCurrency(selectedAmount)}
					/>
				</div>

				<PaginatedDataTable
					paginated={statements}
					columns={[
						{
							id: "select",
							meta: { width: TABLE_WIDTHS.CHECKBOX },
							cell: ({ row }) => (
								<div className="flex items-center justify-center">
									<Checkbox
										checked={!!selected.find(s => s.id === row.original.id)}
										onCheckedChange={value =>
											setSelected(prev =>
												value
													? [...prev, row.original]
													: prev.filter(s => s.id !== row.original.id),
											)
										}
										aria-label={`Select statement ${row.original.id}`}
									/>
								</div>
							),
						},
						{
							header: "Account",
							meta: { width: TABLE_WIDTHS.ACCOUNT },
							cell: ({ row }) => row.original.account.id,
						},
						{
							header: "Date & Time",
							meta: { width: TABLE_WIDTHS.DATETIME },
							cell: ({ row }) => (
								<span className="text-muted-foreground">
									{formatDatetime(row.original.datetime)}
								</span>
							),
						},
						{
							header: "Amount",
							meta: { width: TABLE_WIDTHS.AMOUNT_BAR },
							cell: ({ row }) => (
								<AllocateBar
									title="Allocable"
									value={round2dp(
										row.original.amount -
											(row.original.allocations_sum_amount ?? 0),
									)}
									total={row.original.amount}
								/>
							),
						},
						{
							header: "Description",
							// Expand width to maximum for statements
							cell: ({ row }) => (
								<div className="truncate text-muted-foreground">
									{row.original.description}
								</div>
							),
						},
						{
							id: "actions",
							meta: { width: TABLE_WIDTHS.ACTIONS_OPEN },
							cell: ({ row }) => (
								<Button variant="outline" size="sm" asChild>
									<Link href={statementWebRoute.url({ statement: row.original })}>
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
								statements={selected ? Object.values(selected) : []}
								categories={categories}
								titles={titles}
								locations={locations}
								peoples={peoples}
								clear={() => setSelected([])}
							/>
						),
					}}
					footer={{
						summary: `${Object.values(selected).filter(Boolean).length} selected. Showing ${statements.data.length} of ${statements.total} statements.`,
					}}
					emptyMessage="No statements found."
				/>
			</div>
		</>
	)
}

function AllocateRecordDialog({
	statements,
	categories,
	titles,
	locations,
	peoples,
	clear,
}: {
	statements: (Statement & StatementExtra)[]
	categories: (Category & CategoryExtra)[]
	titles: string[]
	locations: string[]
	peoples: string[]
	clear: () => void
}) {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const categoriesFlat = categories.flatMap(category => [category, ...category.children])
	const initialValues = {
		title: "",
		people: "",
		location: "",
		datetime: inferAllocatorDatetime(statements),
		category_id: "",
		description: "",
		statements: statements.map(statement => ({
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

			statements.forEach((statement, index) => {
				formData.append(`statements[${index}][id]`, `${value.statements[index].id}`)
				formData.append(`statements[${index}][amount]`, `${value.statements[index].amount}`)
			})

			const response = await fetch(allocatorApiRoute.url(), {
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
					<Button disabled={!statements.length}>
						<LinkIcon /> Create Record
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle>Create New Record</DialogTitle>
					<DialogDescription>
						Allocate {statements.length} selected statement(s) to a new record.
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
							<form.Field name="title">
								{field => (
									<TextField
										id={field.name}
										label="Title"
										value={field.state.value}
										suggestions={titles}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
							<form.Field name="people">
								{field => (
									<TextField
										id={field.name}
										label="People"
										value={field.state.value}
										suggestions={peoples}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
							<form.Field name="location">
								{field => (
									<TextField
										id={field.name}
										label="Location"
										value={field.state.value}
										suggestions={locations}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
							<form.Field name="datetime">
								{field => (
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
							</form.Field>
							<form.Field name="category_id">
								{field => (
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
							</form.Field>
							<form.Field name="description">
								{field => (
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
							</form.Field>
						</FieldGroup>
					</div>

					<div className="flex flex-col gap-4">
						<p className="text-sm font-semibold">Allocation Amounts</p>

						<div className="flex flex-col gap-2">
							{statements.map((statement, index) => (
								<form.Field
									key={statement.id}
									name={`statements[${index}].amount` as const}
								>
									{field => {
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
														{formatDatetime(statement.datetime)}
													</CardDescription>
													<CardAction className="text-sm font-semibold">
														{formatCurrency(statement.amount)}
													</CardAction>
												</CardHeader>
												<CardContent className="flex flex-col gap-4">
													<AmountField
														id={field.name}
														label="Amount"
														value={field.state.value}
														errors={errors}
														suffix={`of ${formatCurrency(allocable)}`}
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
								</form.Field>
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

function inferAllocatorDatetime(statements: (Statement & StatementExtra)[]) {
	const DESCRIPTION_DATE_REGEX = /\b\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/

	const describedDates = statements.flatMap(statement => {
		const match = statement.description.match(DESCRIPTION_DATE_REGEX)?.[0]
		if (!match) {
			return []
		}

		const statementDate = parseDatetime(statement.datetime)
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
				const statementDate = parseDatetime(statement.datetime)
				return statementDate.isValid ? [statementDate] : []
			})
			.sort((a, b) => a.toMillis() - b.toMillis())[0]

	return earliestDate ? earliestDate.toFormat("yyyy-MM-dd'T'HH:mm") : ""
}
