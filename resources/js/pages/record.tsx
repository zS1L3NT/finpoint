import { Link, router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { PencilIcon, ReceiptTextIcon, Trash2Icon } from "lucide-react"
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
import { FieldGroup } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { cn, currencyClass, toCurrency, toDate, toDatetime, withMethod } from "@/lib/utils"
import { Account, Allocation, Category, Record, Statement } from "@/types"
import {
	recordDestroyApiRoute,
	recordsWebRoute,
	recordUpdateApiRoute,
	statementWebRoute,
} from "@/wayfinder/routes"

type RecordExtra = {
	category: Category & CategoryExtra
	statements: (Statement & { account: Account } & { pivot: Allocation })[]
}

type CategoryExtra = {
	children: Category[]
}

export default function RecordPage({
	record,
	categories,
}: {
	record: Record & RecordExtra
	categories: (Category & CategoryExtra)[]
}) {
	return (
		<>
			<AppHeader title="Record" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title={
						<div className="flex items-center gap-2">
							{record.title}
							<p className="text-xl text-muted-foreground">
								{[
									record.people ? `w/ ${record.people}` : null,
									record.location ? `@ ${record.location}` : null,
								]
									.filter(Boolean)
									.join(" ")}
							</p>
						</div>
					}
					subtitle={record.description}
					description="Record details"
					icon={ReceiptTextIcon}
					actions={<RecordEditorDialog record={record} categories={categories} />}
					back={{
						name: "Back to records",
						url: recordsWebRoute.url(),
					}}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					<DetailCard
						label="Category"
						value={
							<div className="flex items-center gap-2">
								<Icon {...record.category} size={16} />
								<span>{record.category.name}</span>
							</div>
						}
					/>
					<DetailCard
						label="Amount"
						value={toCurrency(record.amount)}
						valueClassName={cn(currencyClass(record.amount), "text-base")}
					/>
					<DetailCard label="Date & Time" value={toDatetime(record.datetime)} />
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Statements</CardTitle>
						<CardDescription>
							Allocated statements attached to this record.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-hidden rounded-lg border bg-card">
							<Table className="table-fixed">
								<TableHeader>
									<TableRow>
										<TableHead className="w-32">Account</TableHead>
										<TableHead className="w-32">Date</TableHead>
										<TableHead className="w-64">Amount</TableHead>
										<TableHead>Description</TableHead>
										<TableHead className="w-16" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{record.statements.length ? (
										record.statements.map(statement => (
											<TableRow key={statement.id}>
												<TableCell>{statement.account.id}</TableCell>
												<TableCell>{toDate(statement.date)}</TableCell>
												<TableCell>
													<AllocateBar
														title="Allocated"
														value={statement.pivot.amount}
														total={statement.amount}
													/>
												</TableCell>
												<TableCell className="max-w-0 truncate text-muted-foreground">
													{statement.description}
												</TableCell>
												<TableCell>
													<Button variant="outline" size="sm" asChild>
														<Link
															href={statementWebRoute.url({
																statement,
															})}
														>
															Open
														</Link>
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={6}
												className="h-24 text-center text-muted-foreground"
											>
												No statements found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	)
}

function RecordEditorDialog({
	record,
	categories,
}: {
	record: Record & RecordExtra
	categories: (Category & CategoryExtra)[]
}) {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const categoriesFlat = categories.flatMap(category => [category, ...category.children])
	const initialValues = {
		title: record.title,
		people: record.people ?? "",
		location: record.location ?? "",
		datetime: record.datetime.replace(" ", "T"),
		category_id: record.category.id,
		description: record.description ?? "",
		statements: record.statements.map(statement => ({
			id: statement.id,
			amount: statement.pivot.amount,
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
				setOpen(false)
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
			setOpen(false)
			router.visit(recordsWebRoute.url())
		}
	}

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
					<Button>
						<PencilIcon /> Edit
					</Button>
				}
			/>
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
							{record.statements.map((statement, index) => (
								<form.Field
									key={statement.id}
									name={`statements[${index}].amount` as const}
									children={field => {
										const errors = mergeErrors(
											field.state.meta.errors,
											field.name,
										)
										const allocable = Math.abs(statement.amount)

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
																			(Math.abs(
																				field.state.value,
																			) /
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
