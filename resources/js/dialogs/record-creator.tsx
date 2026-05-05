import { router } from "@inertiajs/react"
import { useForm, useStore } from "@tanstack/react-form"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangleIcon, CreditCardIcon, PlusIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useState } from "react"
import AmountField from "@/components/form/amount-field"
import ComboboxField from "@/components/form/combobox-field"
import DatetimeField from "@/components/form/datetime-field"
import TextField from "@/components/form/text-field"
import TextareaField from "@/components/form/textarea-field"
import Icon from "@/components/icon"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { FieldGroup } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { cn, formatCurrency, formatDatetime, parseDatetime, round2dp } from "@/lib/utils"
import { CategoryWithChildren, Statement } from "@/types"
import { recordStoreApiRoute } from "@/wayfinder/routes"

export default function RecordCreatorDialog({
	statements,
	categories,
	titles,
	locations,
	peoples,
	clear,
}: {
	statements: Statement[]
	categories: CategoryWithChildren[]
	titles: string[]
	locations: string[]
	peoples: string[]
	clear: () => void
}) {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const categoriesFlat = categories.flatMap(category => [category, ...category.children])

	const form = useForm({
		defaultValues: {
			title: "",
			people: "",
			location: "",
			datetime: inferAllocatorDatetime(statements),
			amount: round2dp(
				statements.reduce((acc, statement) => acc + statement.allocable_amount, 0),
			),
			category_id: "",
			description: "",
			statements: statements.map(statement => ({
				id: statement.id,
				amount: round2dp(statement.allocable_amount),
			})),
		},
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("title", value.title)
			formData.append("people", value.people)
			formData.append("location", value.location)
			formData.append("datetime", value.datetime)
			formData.append("amount", `${value.amount}`)
			formData.append("category_id", value.category_id)
			formData.append("description", value.description)

			statements.forEach((statement, index) => {
				formData.append(`statements[${index}][id]`, `${value.statements[index].id}`)
				formData.append(`statements[${index}][amount]`, `${value.statements[index].amount}`)
			})

			const response = await fetch(recordStoreApiRoute.url(), {
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

	const isPendingAmount = useStore(
		form.store,
		state =>
			round2dp(state.values.statements.reduce((acc, el) => acc + el.amount, 0)) !==
			round2dp(state.values.amount),
	)

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
					<Button>
						<PlusIcon /> Create Record
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
										label="Date & Time"
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
										errors={mergeErrors(field.state.meta.errors, field.name)}
										onChange={value => {
											field.handleChange(value)
											clearApiError(field.name)
										}}
									/>
								)}
							</form.Field>
							<AnimatePresence>
								{isPendingAmount && (
									<motion.div
										layout="position"
										initial={{ opacity: 0, height: 0, marginTop: -16 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0, marginTop: -16 }}
									>
										<Alert className="mt-4 max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
											<AlertTriangleIcon />
											<AlertTitle>
												Amount does not match the sum of Allocation Amounts
											</AlertTitle>
											<AlertDescription>
												This transaction will be marked as pending until the
												record amount matches the sum of allocated statement
												amounts.
											</AlertDescription>
										</Alert>
									</motion.div>
								)}
							</AnimatePresence>
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
						<p className="text-sm font-semibold">Statements Attached</p>

						<ScrollArea className="h-fit max-h-200">
							<div className="space-y-2">
								{statements.map((statement, index) => (
									<div key={statement.id} className="p-0.5">
										<form.Field name={`statements[${index}].amount` as const}>
											{field => {
												const errors = mergeErrors(
													field.state.meta.errors,
													field.name,
												)
												const allocable = statement.allocable_amount

												const percent =
													allocable === 0
														? 0
														: (field.state.value / allocable) * 100

												return (
													<Card
														className={cn(
															errors.length
																? "border-destructive/50"
																: null,
														)}
													>
														<CardHeader>
															<CardTitle className="text-sm leading-5">
																{statement.description}
															</CardTitle>
															<CardDescription>
																{formatDatetime(statement.datetime)}
															</CardDescription>
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
																	form.setFieldValue(
																		"amount",
																		round2dp(
																			form
																				.getFieldValue(
																					"statements",
																				)
																				.reduce(
																					(acc, el, i) =>
																						acc +
																						el.amount,
																					0,
																				),
																		),
																	)
																	clearApiError(field.name)
																}}
															/>
															<Progress
																value={percent}
																className={cn(
																	percent > 100
																		? "text-red-400"
																		: null,
																)}
															/>
														</CardContent>
													</Card>
												)
											}}
										</form.Field>
									</div>
								))}
							</div>

							{!statements.length && (
								<Empty className="border border-dashed">
									<EmptyHeader>
										<EmptyMedia variant="icon">
											<CreditCardIcon />
										</EmptyMedia>
										<EmptyTitle>No Statements</EmptyTitle>
										<EmptyDescription>
											No statements selected for allocation.
										</EmptyDescription>
									</EmptyHeader>
								</Empty>
							)}
						</ScrollArea>
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
						Create Record
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function inferAllocatorDatetime(statements: Statement[]) {
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
