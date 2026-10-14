import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion } from "framer-motion"
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
import { SPRING, TRANSITION } from "@/lib/motion"
import { formatCurrency } from "@/lib/utils"
import { getMonthlyBudgetAmountSource, upsertMonthlyBudget } from "@/logic/monthly-budgets"
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
	const [amountScope, setAmountScope] = useState<string | null>(null)
	const [archived, setArchived] = useState(monthlyBudget?.archived ?? false)
	const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
	const [submitting, setSubmitting] = useState(false)

	const source = useLiveQuery(
		() =>
			monthlyBudget
				? getMonthlyBudgetAmountSource(monthlyBudget.id, selectedMonth.toISODate() ?? "")
				: null,
		[monthlyBudget?.id, month, year],
	)
	const monthLabel = `${month} ${year}`
	const scope =
		amountScope ??
		(!monthlyBudget
			? "default"
			: source?.override
				? "month"
				: source?.ownDefault
					? "default"
					: source?.previousDefault
						? "inherit"
						: "month")
	const defaultRemovalDescription =
		source?.ownDefault && scope !== "default"
			? source.previousDefault
				? ` Later months use the default from ${DateTime.fromISO(source.previousDefault.effective_month).toFormat("MMMM yyyy")} instead.`
				: source.nextDefault
					? ` Later months have no amount until ${DateTime.fromISO(source.nextDefault.effective_month).toFormat("MMMM yyyy")}.`
					: " Later months have no amount."
			: ""

	const reset = () => {
		setName(monthlyBudget?.name ?? "")
		setColor(monthlyBudget?.color ?? "#64748b")
		setGroup(monthlyBudget?.group ?? "core")
		setPaceKind(monthlyBudget?.pace_kind ?? "none")
		setAmount(monthlyBudget?.amount ?? 0)
		setNoAmount(monthlyBudget?.amount === null)
		setAmountScope(null)
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
				scope,
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
						Name, colour, group and forecast settings apply across all months. Choose
						separately how the amount applies to {monthLabel}.
					</DialogDescription>
				</DialogHeader>
				{!monthlyBudget || source ? (
					<form
						className="grid gap-5"
						onSubmit={event => {
							event.preventDefault()
							void submit()
						}}
					>
						<FieldGroup className="grid grid-cols-[minmax(0,1fr)_auto]">
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
								className="col-span-2"
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
								label="Spending forecast"
								className="col-span-2"
								value={group === "outlier" ? "none" : paceKind}
								disabled={group === "outlier"}
								description={
									group === "outlier"
										? "Outlier monthly budgets use recorded amounts only."
										: paceKind === "daily"
											? "Use this budget’s daily spending average to estimate its month-end total."
											: paceKind === "recurring"
												? "Use recorded and future-dated spending only. This does not create recurring Records."
												: "Show recorded spending without a daily estimate for this budget."
								}
								items={[
									{ value: "none", label: "Recorded amounts only" },
									{ value: "daily", label: "Estimate from daily spending" },
									{ value: "recurring", label: "Recurring / scheduled spending" },
								]}
								errors={fieldErrors(errors.pace_kind)}
								onChange={value => setPaceKind(value as MonthlyBudget["pace_kind"])}
							/>
						</FieldGroup>
						<FieldGroup className="rounded-lg border bg-muted/20 p-3">
							<p className="text-sm font-medium">Amount for {monthLabel}</p>
							<SelectField
								id="monthly-budget-amount-scope"
								label="Amount rule"
								value={scope}
								items={[
									...(monthlyBudget
										? [
												{
													value: "inherit",
													label: "Default",
													disabled: source?.previousDefault === null,
												},
											]
										: []),
									{ value: "month", label: "Override one month" },
									{ value: "default", label: "Override default" },
								]}
								description={
									(scope === "inherit" && source?.previousDefault
										? `Use the default from ${DateTime.fromISO(source.previousDefault.effective_month).toFormat("MMMM yyyy")}: ${source.previousDefault.amount === null ? "No monthly amount" : formatCurrency(source.previousDefault.amount)}.`
										: scope === "month"
											? `Change ${monthLabel} only. Other months skip this when looking back for the default.`
											: `Set the default from ${monthLabel} onward. Earlier defaults stop applying from here.${source?.nextDefault ? ` It applies until ${DateTime.fromISO(source.nextDefault.effective_month).toFormat("MMMM yyyy")}, when the next default starts.` : ""}`) +
									defaultRemovalDescription
								}
								onChange={setAmountScope}
							/>
							<AnimatePresence initial={false}>
								{(scope === "month" || scope === "default") && (
									<motion.div
										className="overflow-hidden"
										initial={{ opacity: 0, height: 0, marginTop: -16 }}
										animate={{ opacity: 1, height: "auto", marginTop: 0 }}
										exit={{
											opacity: 0,
											height: 0,
											marginTop: -16,
											transition: TRANSITION.fast,
										}}
										transition={{
											height: SPRING.smooth,
											marginTop: SPRING.smooth,
											opacity: TRANSITION.base,
										}}
									>
										<FieldGroup>
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
													onCheckedChange={value =>
														setNoAmount(value === true)
													}
												/>
												<FieldLabel htmlFor="monthly-budget-no-amount">
													No monthly amount
												</FieldLabel>
											</Field>
										</FieldGroup>
									</motion.div>
								)}
							</AnimatePresence>
						</FieldGroup>
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
				) : null}
			</DialogContent>
		</Dialog>
	)
}
