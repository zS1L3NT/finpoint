import { router } from "@inertiajs/react"
import { useForm, useStore } from "@tanstack/react-form"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import AmountField from "@/components/form/amount-field"
import TextField from "@/components/form/text-field"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { withMethod } from "@/lib/utils"
import { Quota } from "@/types"
import { quotaDestroyApiRoute, quotaUpdateApiRoute } from "@/wayfinder/routes"

export default function QuotaEditorDialog({ quota }: { quota: Quota }) {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const initialValues = {
		name: quota.name,
		color: quota.color,
		amount: quota.amount ?? 0,
		unlimited: quota.amount === null,
	}

	const form = useForm({
		defaultValues: initialValues,
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("name", value.name)
			formData.append("color", value.color)
			if (!value.unlimited) {
				formData.append("amount", `${value.amount}`)
			}

			const response = await fetch(quotaUpdateApiRoute.url({ quota }), {
				method: "POST",
				body: withMethod(formData, "PUT"),
				headers: { Accept: "application/json" },
			})

			if (response.status === 422) {
				const data = await response.json().catch(() => null)
				setApiErrors(data?.errors ?? {})
				return
			}

			if (response.ok) {
				setOpen(false)
				router.reload()
			}
		},
	})

	const handleDelete = async () => {
		const response = await fetch(quotaDestroyApiRoute.url({ quota }), {
			method: "POST",
			body: withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			setOpen(false)
			router.reload()
		}
	}

	const isUnlimited = useStore(form.store, state => state.values.unlimited)

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
					<Button variant="outline" size="sm">
						<PencilIcon /> Edit
					</Button>
				}
			/>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit Quota</DialogTitle>
					<DialogDescription>
						Update the quota for {quota.month} {quota.year}.
					</DialogDescription>
				</DialogHeader>

				<form
					id="quota-edit-form"
					className="grid gap-6"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<FieldGroup>
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

						<form.Field name="color">
							{field => (
								<TextField
									id={field.name}
									label="Color"
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
									min={0.01}
									disabled={isUnlimited}
									errors={mergeErrors(field.state.meta.errors, field.name)}
									onChange={value => {
										field.handleChange(value)
										clearApiError(field.name)
									}}
								/>
							)}
						</form.Field>

						<form.Field name="unlimited">
							{field => (
								<Field orientation="horizontal">
									<Checkbox
										checked={field.state.value}
										onCheckedChange={checked => {
											field.handleChange(checked === true)
											clearApiError("amount")
										}}
										id={field.name}
									/>
									<FieldLabel htmlFor={field.name}>No limit</FieldLabel>
								</Field>
							)}
						</form.Field>
					</FieldGroup>
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
					<Button type="submit" form="quota-edit-form">
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
