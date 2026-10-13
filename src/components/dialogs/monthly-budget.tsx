import { DateTime } from "luxon"
import { useState } from "react"
import { toast } from "sonner"
import AmountField from "@/components/form/amount-field"
import SelectField from "@/components/form/select-field"
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
import { upsertMonthlyBudget } from "@/logic/monthly-budgets"
import { ValidationError } from "@/logic/validate"
import { MonthlyBudget } from "@/types"

const fieldErrors = (errors?: string[]) => errors?.map(message => ({ message }))

export default function MonthlyBudgetDialog({
	monthlyBudget,
	month,
	year,
	trigger,
}: {
	monthlyBudget?: MonthlyBudget
	month: string
	year: number
	trigger: React.ReactElement
}) {
	const selectedMonth = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy").startOf("month")
	const [open, setOpen] = useState(false)
	const [name, setName] = useState(monthlyBudget?.name ?? "")
	const [color, setColor] = useState(monthlyBudget?.color ?? "#64748b")
	const [group, setGroup] = useState(monthlyBudget?.group ?? "core")
	const [paceKind, setPaceKind] = useState(monthlyBudget?.pace_kind ?? "none")
	const [amount, setAmount] = useState(monthlyBudget?.amount ?? 0)
	const [noAmount, setNoAmount] = useState(monthlyBudget?.amount === null)
	const [amountScope, setAmountScope] = useState(monthlyBudget ? "month" : "default")
	const [archived, setArchived] = useState(monthlyBudget?.archived ?? false)
	const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
	const [submitting, setSubmitting] = useState(false)

	const reset = () => {
		setName(monthlyBudget?.name ?? "")
		setColor(monthlyBudget?.color ?? "#64748b")
		setGroup(monthlyBudget?.group ?? "core")
		setPaceKind(monthlyBudget?.pace_kind ?? "none")
		setAmount(monthlyBudget?.amount ?? 0)
		setNoAmount(monthlyBudget?.amount === null)
		setAmountScope(monthlyBudget ? "month" : "default")
		setArchived(monthlyBudget?.archived ?? false)
		setErrors({})
	}

	const submit = async () => {
		setSubmitting(true)
		setErrors({})
		try {
			await upsertMonthlyBudget({
				id: monthlyBudget?.id,
				name,
				color,
				group,
				pace_kind: group === "outlier" ? "none" : paceKind,
				archived,
				month: selectedMonth.toISODate() ?? "",
				amount: noAmount ? null : amount,
				scope: amountScope,
			})

			setOpen(false)
		} catch (cause) {
			if (cause instanceof ValidationError) {
				setErrors(cause.errors)
			} else {
				toast.error("Unable to save this monthly budget.")
			}
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={value => {
				setOpen(value)
				if (value) reset()
			}}
		>
			<DialogTrigger render={trigger} />
			<DialogContent className="md:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{monthlyBudget ? `Edit ${monthlyBudget.name}` : "Create monthly budget"}
					</DialogTitle>
					<DialogDescription>
						Monthly budgets persist across months. The amount can apply only to {month}{" "}
						{year} or become the default from that month onward.
					</DialogDescription>
				</DialogHeader>
				<form
					className="grid gap-5"
					onSubmit={event => {
						event.preventDefault()
						void submit()
					}}
				>
					<FieldGroup>
						<TextField
							id="monthly-budget-name"
							label="Name"
							value={name}
							errors={fieldErrors(errors.name)}
							onChange={setName}
						/>
						<Field>
							<FieldLabel htmlFor="monthly-budget-color">Colour</FieldLabel>
							<div className="flex items-center gap-2">
								<input
									id="monthly-budget-color"
									type="color"
									value={color}
									onChange={event => setColor(event.target.value)}
									className="h-8 w-12 cursor-pointer rounded border bg-transparent p-1"
								/>
								<span className="text-xs text-muted-foreground">{color}</span>
							</div>
						</Field>
						<SelectField
							id="monthly-budget-group"
							label="Group"
							value={group}
							items={[
								{ value: "core", label: "Core" },
								{ value: "outlier", label: "Outlier" },
								{ value: "other", label: "Other" },
							]}
							errors={fieldErrors(errors.group)}
							onChange={value => setGroup(value as MonthlyBudget["group"])}
						/>
						<SelectField
							id="monthly-budget-pace"
							label="Pacing"
							value={group === "outlier" ? "none" : paceKind}
							disabled={group === "outlier"}
							description={
								group === "outlier"
									? "Outlier monthly budgets are not paced."
									: undefined
							}
							items={[
								{ value: "none", label: "No pacing" },
								{ value: "daily", label: "Daily" },
								{ value: "recurring", label: "Recurring" },
							]}
							errors={fieldErrors(errors.pace_kind)}
							onChange={value => setPaceKind(value as MonthlyBudget["pace_kind"])}
						/>
						<AmountField
							id="monthly-budget-amount"
							label="Monthly amount"
							value={amount}
							min={0}
							disabled={noAmount}
							errors={fieldErrors(errors.amount)}
							onChange={setAmount}
						/>
						<Field orientation="horizontal">
							<Checkbox
								id="monthly-budget-no-amount"
								checked={noAmount}
								onCheckedChange={value => setNoAmount(value === true)}
							/>
							<FieldLabel htmlFor="monthly-budget-no-amount">
								No monthly amount
							</FieldLabel>
						</Field>
						<SelectField
							id="monthly-budget-amount-scope"
							label="Apply monthly amount to"
							value={amountScope}
							items={[
								{ value: "month", label: `${month} ${year} only` },
								{
									value: "default",
									label: `Default from ${month} ${year} onward`,
								},
							]}
							onChange={setAmountScope}
						/>
						{monthlyBudget ? (
							<Field orientation="horizontal">
								<Checkbox
									id="monthly-budget-archived"
									checked={archived}
									onCheckedChange={value => setArchived(value === true)}
								/>
								<div>
									<FieldLabel htmlFor="monthly-budget-archived">
										Archive monthly budget
									</FieldLabel>
									<p className="text-xs text-muted-foreground">
										Existing Record assignments remain intact.
									</p>
								</div>
							</Field>
						) : null}
					</FieldGroup>
					{Object.values(errors).flat().length ? (
						<p
							className="fade-in slide-in-from-top-1 animate-in text-sm text-destructive duration-150 ease-out"
							role="alert"
						>
							{Object.values(errors).flat().join(" ")}
						</p>
					) : null}
					<DialogFooter>
						<DialogClose
							render={
								<Button type="button" variant="outline">
									Cancel
								</Button>
							}
						/>
						<Button type="submit" disabled={submitting}>
							{submitting
								? "Saving…"
								: monthlyBudget
									? "Save changes"
									: "Create monthly budget"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
