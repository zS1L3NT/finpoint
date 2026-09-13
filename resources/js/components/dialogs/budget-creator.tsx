import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import AmountField from "@/components/form/amount-field"
import DateField from "@/components/form/date-field"
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { createBudget } from "@/logic/budgets"
import { ValidationError } from "@/logic/shared"

export default function BudgetCreatorDialog({
	isOpen,
	setIsOpen,
	trigger,
}: {
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
}) {
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			name: "",
			amount: 0,
			start_date: "",
			end_date: "",
			automatic: true,
		},
		onSubmit: async ({ value }) => {
			try {
				await createBudget({
					name: value.name,
					amount: value.amount,
					start_date: value.start_date,
					end_date: value.end_date,
					automatic: value.automatic,
				})
				setIsOpen(false)
			} catch (cause) {
				if (cause instanceof ValidationError) {
					setApiErrors(cause.errors)
					return
				}
				toast.error("Unable to create this budget.")
			}
		},
	})

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
			<DialogContent className="md:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Create Budget</DialogTitle>
					<DialogDescription>
						Set a target amount and date window. Records can be auto-attached when they
						land inside the budget period.
					</DialogDescription>
				</DialogHeader>

				<form
					id="budget-create-form"
					className="grid gap-6"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<FieldGroup className="grid gap-4 md:grid-cols-2">
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
						<form.Field name="amount">
							{field => (
								<AmountField
									id={field.name}
									label="Amount"
									value={field.state.value}
									min={0}
									errors={mergeErrors(field.state.meta.errors, field.name)}
									onChange={value => {
										field.handleChange(value)
										clearApiError(field.name)
									}}
								/>
							)}
						</form.Field>
						<form.Field name="start_date">
							{field => (
								<DateField
									id={field.name}
									label="Start date"
									value={field.state.value}
									errors={mergeErrors(field.state.meta.errors, field.name)}
									onChange={value => {
										field.handleChange(value)
										clearApiError(field.name)
									}}
								/>
							)}
						</form.Field>
						<form.Field name="end_date">
							{field => (
								<DateField
									id={field.name}
									label="End date"
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

					<form.Field name="automatic">
						{field => (
							<Field orientation="horizontal">
								<Checkbox
									checked={field.state.value}
									onCheckedChange={checked =>
										field.handleChange(checked === true)
									}
									id={field.name}
								/>
								<div className="space-y-1">
									<FieldLabel htmlFor={field.name}>Automatic attach</FieldLabel>
									<FieldDescription>
										Attach records that land inside the date range as soon as
										the budget is created.
									</FieldDescription>
								</div>
							</Field>
						)}
					</form.Field>
				</form>

				<DialogFooter>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="budget-create-form">
						Create budget
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
