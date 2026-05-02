import { router } from "@inertiajs/react"
import { useForm, useStore } from "@tanstack/react-form"
import { PlusIcon } from "lucide-react"
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
import { quotaStoreApiRoute } from "@/wayfinder/routes"

export default function QuotaCreatorDialog({ month, year }: { month: string; year: number }) {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			name: "",
			color: "",
			amount: 0,
			unlimited: false,
		},
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("name", value.name)
			formData.append("color", value.color)
			formData.append("month", month)
			formData.append("year", `${year}`)
			if (!value.unlimited) {
				formData.append("amount", `${value.amount}`)
			}

			const response = await fetch(quotaStoreApiRoute.url(), {
				method: "POST",
				body: formData,
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

	const isUnlimited = useStore(form.store, state => state.values.unlimited)

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
					<Button size="sm">
						<PlusIcon /> Create Quota
					</Button>
				}
			/>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Create Quota</DialogTitle>
					<DialogDescription>
						Create a quota for {month} {year}.
					</DialogDescription>
				</DialogHeader>

				<form
					id="quota-create-form"
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
									<div className="space-y-1">
										<FieldLabel htmlFor={field.name}>No limit</FieldLabel>
									</div>
								</Field>
							)}
						</form.Field>
					</FieldGroup>
				</form>

				<DialogFooter>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="quota-create-form">
						Create quota
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
