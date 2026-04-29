import { router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import AmountField from "@/components/form/amount-field"
import ComboboxField from "@/components/form/combobox-field"
import DatetimeField from "@/components/form/datetime-field"
import TextField from "@/components/form/text-field"
import TextareaField from "@/components/form/textarea-field"
import Icon from "@/components/icon"
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
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { cn, formatCurrency, formatDatetime, round2dp, withMethod } from "@/lib/utils"
import { Account, Allocation, Category, Record, Statement } from "@/types"
import { recordDestroyApiRoute, recordsWebRoute, recordUpdateApiRoute } from "@/wayfinder/routes"

type RecordExtra = {
	category: Category & CategoryExtra
	statements: (Statement & StatementExtra)[]
}

type StatementExtra = {
	allocations_sum_amount: number
	account: Account
	pivot: Allocation
}

type CategoryExtra = {
	children: Category[]
}

export default function RecordEditorDialog({
	record,
	categories,
	titles,
	locations,
	peoples,
}: {
	record: Record & RecordExtra
	categories: (Category & CategoryExtra)[]
	titles: string[]
	locations: string[]
	peoples: string[]
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
				formData.append(`statements[${index}][id]`, `${value.statements[index].id}`)
				formData.append(`statements[${index}][amount]`, `${value.statements[index].amount}`)
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
							{record.statements.map((statement, index) => (
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
												statement.allocations_sum_amount +
												statement.pivot.amount,
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
								</form.Field>
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
