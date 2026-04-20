import { router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { LinkIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import AllocationAmountCard from "@/components/allocate-amount-card"
import ComboboxField from "@/components/form/combobox-field"
import DatetimeField from "@/components/form/datetime-field"
import TextField from "@/components/form/text-field"
import TextareaField from "@/components/form/textarea-field"
import { Button } from "@/components/ui/button"
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
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { cn, round2dp } from "@/lib/utils"
import { Category, Statement } from "@/types"
import { store } from "@/wayfinder/routes/records"
import Icon from "./icon"

type StatementExtra = {
	allocations_sum_amount: number | null
}

type CategoryExtra = {
	children: Category[]
}

export default function AllocateRecordDialog({
	statements,
	categories,
	clear,
}: {
	statements: (Statement & StatementExtra)[]
	categories: (Category & CategoryExtra)[]
	clear: () => void
}) {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			title: "",
			people: "",
			location: "",
			datetime: "",
			category_id: "",
			description: "",
			statements: statements.map(statement => ({
				id: statement.id,
				amount: round2dp(statement.amount - (statement.allocations_sum_amount ?? 0)),
			})),
		},
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("title", value.title)
			formData.append("people", value.people)
			formData.append("location", value.location)
			formData.append("datetime", value.datetime.slice(0, "YYYY-MM-DDTHH:mm".length))
			formData.append("category_id", value.category_id)
			formData.append("description", value.description)

			value.statements.forEach((statement, index) => {
				formData.append(`statements[${index}][id]`, statement.id)
				formData.append(`statements[${index}][amount]`, `${statement.amount}`)
			})

			const res = await fetch(store.url(), {
				method: "POST",
				body: formData,
				headers: { Accept: "application/json" },
			})

			if (res.status === 422) {
				const data = await res.json().catch(() => null)
				setApiErrors((data?.errors ?? {}) as Record<string, string[]>)
			}

			if (res.status === 201) {
				router.reload()
				setOpen(false)
				clear()
			}
		},
	})

	/**
	 * Reset all forms and api errors when statement selection changes
	 */
	useEffect(() => {
		form.reset()
		resetApiErrors()
	}, [statements])

	/**
	 * Scans all transactions for the unique date format like 09APR,
	 * these dates best reflect when the transactions was made.
	 * If it is found, use the earliest one, if not use the earliest
	 * date from the statements
	 */
	useEffect(() => {
		const textDateRegex = /\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/
		const textDate = statements
			.map(s => s.description.match(textDateRegex)?.[0])
			.filter(s => !!s)
			// biome-ignore lint/style/noNonNullAssertion: Filtered above
			.map(s => DateTime.fromFormat(s!.slice(0, 3) + s!.slice(3, 5).toLowerCase(), "ddMMM"))
			.filter(d => d.isValid)
			.toSorted((a, b) => a.toMillis() - b.toMillis())[0]

		if (textDate) {
			form.setFieldValue("datetime", textDate.startOf("day").toISO())
		} else {
			const date = DateTime.fromFormat(
				statements.map(s => s.date).toSorted()[0] ?? "",
				"y-MM-dd",
			) as DateTime<true>

			form.setFieldValue("datetime", date.startOf("day").toISO())
		}
	}, [statements])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button disabled={!statements.length}>
						<LinkIcon /> Create Record
					</Button>
				}
			/>
			<DialogContent className="min-w-4xl">
				<DialogHeader>
					<DialogTitle>Create New Record</DialogTitle>
					<DialogDescription>
						Allocate {statements.length} selected statement(s) to a new record.
					</DialogDescription>
				</DialogHeader>
				<form className="flex gap-8">
					<div className="flex flex-col flex-1 gap-4">
						<p className="text-sm font-semibold">Record Information</p>

						<FieldGroup className="flex-1">
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
											categories
												.flatMap(c => [c, ...c.children])
												.find(c => c.id === field.state.value) ?? null
										}
										errors={mergeErrors(field.state.meta.errors, field.name)}
										placeholder="Select category"
										emptyText="No categories found."
										items={categories.flatMap(category => [
											category,
											...category.children,
										])}
										getItemId={c => c.id}
										getItemString={c => c.name}
										renderItem={c => (
											<div
												className={cn(
													"flex items-center gap-1",
													c.parent_category_id ? "pl-2" : null,
												)}
											>
												<Icon {...c} size={10} />
												{c.name}
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

					<div className="flex flex-col flex-1 gap-4">
						<p className="text-sm font-semibold">Allocation Amounts</p>

						<div className="flex flex-col gap-2">
							{statements.map((statement, i) => (
								<form.Field
									key={statement.id}
									name={`statements[${i}].amount` as const}
									children={field => (
										<AllocationAmountCard
											fieldName={field.name}
											description={statement.description}
											date={statement.date}
											totalAmount={statement.amount}
											allocableAmount={round2dp(
												statement.amount -
													(statement.allocations_sum_amount ?? 0),
											)}
											value={field.state.value}
											errors={mergeErrors(
												field.state.meta.errors,
												field.name,
											)}
											onChange={value => {
												field.handleChange(value)
												clearApiError(field.name)
											}}
										/>
									)}
								/>
							))}
						</div>
					</div>
				</form>
				<DialogFooter>
					<DialogClose render={<Button variant="outline">Cancel</Button>} />
					<Button type="button" onClick={() => form.handleSubmit()}>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
