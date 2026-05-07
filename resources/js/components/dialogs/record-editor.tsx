import { router } from "@inertiajs/react"
import { useForm, useStore } from "@tanstack/react-form"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangleIcon, CreditCardIcon, Link2Icon, Trash2Icon, TrashIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import AmountField from "@/components/form/amount-field"
import ComboboxField from "@/components/form/combobox-field"
import DatetimeField from "@/components/form/datetime-field"
import TextField from "@/components/form/text-field"
import TextareaField from "@/components/form/textarea-field"
import Icon from "@/components/icon"
import StatementSearch from "@/components/statement-search"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty"
import { FieldGroup } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useHistory } from "@/history"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { useFetch } from "@/hooks/use-fetch"
import { cn, formatCurrency, formatDatetime, round2dp, withMethod } from "@/lib/utils"
import { Allocation, CategoryWithChildren, Record, RecordCompletions, Statement } from "@/types"
import {
	completionsRecordsApiRoute,
	recordDestroyApiRoute,
	recordsWebRoute,
	recordUpdateApiRoute,
} from "@/wayfinder/routes"

export default function RecordEditorDialog({
	record,
	statements,
	categories,
	isOpen,
	setIsOpen,
	trigger,
}: {
	record: Record
	statements: (Statement & { pivot?: Allocation })[]
	categories: CategoryWithChildren[]
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
}) {
	const { handleClear } = useHistory()

	const completions = useFetch<RecordCompletions>(completionsRecordsApiRoute.url())

	const [statementCache, setStatementCache] = useState<(Statement & { pivot?: Allocation })[]>([])
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	useEffect(() => {
		setStatementCache(statements)
	}, [statements])

	const categoriesFlat = categories.flatMap(category => [category, ...category.children])

	const form = useForm({
		defaultValues: {
			title: record.title,
			people: record.people ?? "",
			location: record.location ?? "",
			datetime: record.datetime.replace(" ", "T"),
			amount: record.amount,
			category_id: record.category.id,
			description: record.description ?? "",
			statements: statements.map(statement => ({
				id: statement.id,
				amount: statement.pivot?.amount ?? statement.allocable_amount,
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
			value.statements.forEach((statement, index) => {
				formData.append(`statements[${index}][id]`, statement.id)
				formData.append(`statements[${index}][amount]`, `${statement.amount}`)
			})

			const response = await fetch(recordUpdateApiRoute.url({ record }), {
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
				setIsOpen(false)
				router.reload()
			}
		},
	})

	const handleDelete = async () => {
		const response = await fetch(recordDestroyApiRoute.url({ record }), {
			method: "POST",
			body: withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			setIsOpen(false)
			handleClear()
			router.visit(
				recordsWebRoute.url({ query: { end_date: DateTime.now().toFormat("yyyy-MM-dd") } }),
			)
		}
	}

	const isPendingAmount = useStore(
		form.store,
		state =>
			round2dp(state.values.statements.reduce((acc, el) => acc + el.amount, 0)) !==
			round2dp(state.values.amount),
	)

	const formStatements = useStore(form.store, state => state.values.statements)

	const attachStatementsButton = (
		<StatementSearch
			title="Attach statements to record"
			placeholder="Search unattached statements..."
			filters={{
				is_allocable: "true",
				exclude_ids: formStatements.map(s => s.id).join(","),
			}}
			trigger={
				<Button variant="outline">
					<Link2Icon />
					Attach statement
				</Button>
			}
			handler={async statement => {
				setStatementCache(prev => [...prev, statement])
				form.setFieldValue("statements", [
					...form.getFieldValue("statements"),
					{ id: statement.id, amount: statement.allocable_amount },
				])
			}}
		/>
	)

	return (
		<Dialog
			open={isOpen}
			onOpenChange={isOpen => {
				setIsOpen(isOpen)
				if (isOpen) {
					form.reset()
					resetApiErrors()
				}
			}}
		>
			{trigger && <DialogTrigger render={trigger} />}
			<DialogContent className="sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle>Edit Record</DialogTitle>
					<DialogDescription>
						Update the record details and its statement allocations.
					</DialogDescription>
				</DialogHeader>

				<form
					id="record-editor-form"
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
										suggestions={completions?.titles}
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
										suggestions={completions?.peoples}
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
										suggestions={completions?.locations}
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
						<div className="flex justify-between">
							<p className="text-sm font-semibold">Statements Attached</p>

							{!!formStatements.length && attachStatementsButton}
						</div>

						<div className="flex flex-col gap-2">
							<ScrollArea className="h-fit max-h-200">
								<div className="space-y-2">
									{formStatements.map(({ id }, index) => (
										<div key={id} className="p-0.5">
											<form.Field
												name={`statements[${index}].amount` as const}
											>
												{field => {
													// biome-ignore lint/style/noNonNullAssertion: All full statement objects must be cached
													const statement = statementCache.find(
														s => s.id === id,
													)!

													const errors = mergeErrors(
														field.state.meta.errors,
														field.name,
													)
													const allocable = round2dp(
														statement.allocable_amount +
															(statement.pivot?.amount ?? 0),
													)

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
																	{formatDatetime(
																		statement.datetime,
																	)}
																</CardDescription>
																<CardAction className="text-sm font-semibold">
																	<Button
																		variant="destructive"
																		onClick={() => {
																			form.setFieldValue(
																				"statements",
																				form
																					.getFieldValue(
																						"statements",
																					)
																					.filter(
																						s =>
																							s.id !==
																							id,
																					),
																			)
																		}}
																	>
																		<TrashIcon />
																	</Button>
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
							</ScrollArea>

							{!formStatements.length && (
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
									<EmptyContent>{attachStatementsButton}</EmptyContent>
								</Empty>
							)}
						</div>
					</div>
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
					<Button type="submit" form="record-editor-form">
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
