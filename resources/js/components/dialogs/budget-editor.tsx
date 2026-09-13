import { Icon as IconifyIcon } from "@iconify/react"
import { useForm } from "@tanstack/react-form"
import { useLocation } from "react-router-dom"
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
import { useHistory } from "@/history"
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { useDialogCloseAnimation } from "@/hooks/use-dialog-close-animation"
import { deleteBudget, updateBudget } from "@/logic/budgets"
import { ValidationError } from "@/logic/shared"
import { pathBudget, pathBudgets } from "@/routes"
import { Budget } from "@/types"

export default function BudgetEditorDialog({
	budget,
	isOpen,
	setIsOpen: onOpenChange,
	trigger,
}: {
	budget: Budget
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	trigger?: React.ReactElement
}) {
	const { open, setIsOpen, onOpenChangeComplete } = useDialogCloseAnimation(isOpen, onOpenChange)
	const { navigateBack } = useHistory()
	const location = useLocation()

	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			name: budget.name,
			amount: budget.amount,
			start_date: budget.start_date,
			end_date: budget.end_date,
			automatic: !!budget.automatic,
		},
		onSubmit: async ({ value }) => {
			try {
				await updateBudget(budget.id, {
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
				toast.error("Unable to save this budget.")
			}
		},
	})

	const handleDelete = async () => {
		try {
			await deleteBudget(budget.id)
			setIsOpen(false)

			if (location.pathname === pathBudget(budget.id)) {
				navigateBack({ name: "Budgets", url: pathBudgets() })
			}
		} catch {
			toast.error("Unable to delete this budget.")
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChangeComplete={onOpenChangeComplete}
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
					<DialogTitle>Edit Budget</DialogTitle>
					<DialogDescription>
						Update the target spend or switch between automatic and manual record
						assignment.
					</DialogDescription>
				</DialogHeader>

				<form
					id="budget-edit-form"
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
										When enabled, updates will also pull in records that fall
										inside the budget date range.
									</FieldDescription>
								</div>
							</Field>
						)}
					</form.Field>
				</form>

				<DialogFooter>
					<Button
						type="button"
						variant="destructive"
						className="mr-auto"
						onClick={handleDelete}
					>
						<IconifyIcon icon="lucide:trash-2" /> Delete
					</Button>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="budget-edit-form">
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
