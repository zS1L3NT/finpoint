import { router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import AmountField from "@/components/form/amount-field"
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { Recurrence } from "@/types"
import { recurrenceStoreApiRoute } from "@/wayfinder/routes"

export default function RecurrenceCreatorDialog() {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			name: "",
			amount: 0,
			period: "month" as Recurrence["period"],
		},
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("name", value.name)
			formData.append("amount", `${value.amount}`)
			formData.append("period", value.period)

			const response = await fetch(recurrenceStoreApiRoute.url(), {
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
						<PlusIcon /> New Recurrence
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Create Recurrence</DialogTitle>
					<DialogDescription>
						Add a recurring expense or income stream so it appears in the monthly
						breakdown.
					</DialogDescription>
				</DialogHeader>

				<form
					id="recurrence-create-form"
					className="grid gap-6"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<FieldGroup>
						<form.Field name="name">
							{field => (
								<Field
									data-invalid={
										!!mergeErrors(field.state.meta.errors, field.name).length
									}
								>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<Input
										id={field.name}
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
						<form.Field name="period">
							{field => (
								<Field>
									<FieldLabel htmlFor={field.name}>Period</FieldLabel>
									<Select
										value={field.state.value}
										onValueChange={value => {
											field.handleChange(value as Recurrence["period"])
											clearApiError(field.name)
										}}
									>
										<SelectTrigger id={field.name} className="w-full">
											<SelectValue placeholder="Select period" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="month">Monthly</SelectItem>
												<SelectItem value="year">Yearly</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
									<FieldDescription>
										Used to convert the recurrence into a comparable monthly
										amount.
									</FieldDescription>
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
					<Button type="submit" form="recurrence-create-form">
						Create recurrence
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
