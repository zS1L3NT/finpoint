import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Palette } from "lucide-react"
import { DateTime } from "luxon"
import { useState } from "react"
import { toast } from "sonner"
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
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { COLLAPSE_MOTION } from "@/lib/motion"
import { formatCurrency } from "@/lib/utils"
import { getMonthlyBudgetAmountSource, upsertMonthlyBudget } from "@/logic/monthly-budgets"
import { ValidationError } from "@/logic/validate"
import type { MonthlyBudget } from "@/types"

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
	const [amount, setAmount] = useState(monthlyBudget?.amount ?? 0)
	const [noAmount, setNoAmount] = useState(monthlyBudget?.amount === null)
	const [amountScope, setAmountScope] = useState<string | null>(null)
	const [archived, setArchived] = useState(monthlyBudget?.archived ?? false)
	const { apiErrors, getApiFieldErrors, resetApiErrors, setApiErrors } = useApiFormErrors()
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
		setAmount(monthlyBudget?.amount ?? 0)
		setNoAmount(monthlyBudget?.amount === null)
		setAmountScope(null)
		setArchived(monthlyBudget?.archived ?? false)
		resetApiErrors()
	}

	const submit = async () => {
		setSubmitting(true)
		resetApiErrors()
		try {
			await upsertMonthlyBudget({
				id: monthlyBudget?.id,
				name,
				color,
				archived,
				month: selectedMonth.toISODate() ?? "",
				amount: noAmount ? null : amount,
				scope,
			})

			setOpen(false)
		} catch (cause) {
			if (cause instanceof ValidationError) {
				setApiErrors(cause.errors)
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
			{!monthlyBudget || source !== undefined ? (
				<DialogContent className="md:max-w-xl">
					<DialogHeader>
						<DialogTitle>
							{monthlyBudget ? `Edit ${monthlyBudget.name}` : "Create monthly budget"}
						</DialogTitle>
						<DialogDescription>
							Name and colour apply to every month. The amount can differ by month.
						</DialogDescription>
					</DialogHeader>
					{!monthlyBudget || source ? (
						<form
							className="grid gap-4"
							onSubmit={event => {
								event.preventDefault()
								void submit()
							}}
						>
							<FieldGroup className="grid gap-4">
								<TextField
									id="monthly-budget-name"
									label="Name"
									value={name}
									errors={getApiFieldErrors("name")}
									onChange={setName}
								/>
								<Field>
									<FieldLabel htmlFor="monthly-budget-color">Colour</FieldLabel>
									<div className="flex flex-wrap items-center gap-2">
										{COLOURS.map(([label, value]) => (
											<button
												key={value}
												type="button"
												aria-label={label}
												aria-pressed={color === value}
												onClick={() => setColor(value)}
												className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-foreground/10 outline-offset-2 focus-visible:outline-2"
												style={{
													backgroundColor: value,
													color:
														value === "#64748b" ? "white" : "#0f172a",
												}}
											>
												{color === value ? (
													<Check className="size-4" strokeWidth={3} />
												) : null}
											</button>
										))}
										<label className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-muted has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2">
											{COLOURS.some(([, value]) => value === color) ? (
												<Palette className="size-4" />
											) : (
												<span
													className="size-4 rounded-full"
													style={{ backgroundColor: color }}
												/>
											)}
											<input
												id="monthly-budget-color"
												aria-label="Custom colour"
												type="color"
												value={color}
												onChange={event => setColor(event.target.value)}
												className="absolute inset-0 size-full cursor-pointer opacity-0"
											/>
										</label>
									</div>
								</Field>
							</FieldGroup>
							<FieldGroup className="gap-3 border-t pt-4">
								<p className="text-sm font-medium">Amount for {monthLabel}</p>
								<fieldset
									className="grid gap-2 sm:grid-cols-3"
									aria-label="Amount rule"
								>
									{[
										...(monthlyBudget
											? [
													{
														value: "inherit",
														label: "Default",
														description: source?.previousDefault
															? `Uses ${source.previousDefault.amount === null ? "No monthly amount" : formatCurrency(source.previousDefault.amount)} from ${DateTime.fromISO(source.previousDefault.effective_month).toFormat("MMMM yyyy")}`
															: "No earlier default",
														disabled: !source?.previousDefault,
													},
												]
											: []),
										{
											value: "month",
											label: "Override one month",
											description: `${monthLabel} only`,
											disabled: false,
										},
										{
											value: "default",
											label: "Override default",
											description: `From ${monthLabel} onward${source?.nextDefault ? ` until ${DateTime.fromISO(source.nextDefault.effective_month).toFormat("MMMM yyyy")}` : ""}`,
											disabled: false,
										},
									].map(option => (
										<label
											key={option.value}
											className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 has-[:checked]:border-ring has-[:checked]:bg-muted/50 has-[:disabled]:cursor-default has-[:disabled]:opacity-50"
										>
											<input
												type="radio"
												name="monthly-budget-amount-scope"
												aria-label={option.label}
												checked={scope === option.value}
												disabled={option.disabled}
												onChange={() => setAmountScope(option.value)}
												className="accent-primary"
											/>
											<span>
												<span className="block text-xs font-medium">
													{option.label}
												</span>
												<span className="block text-xs text-muted-foreground">
													{option.description}
												</span>
											</span>
										</label>
									))}
								</fieldset>
								{defaultRemovalDescription && (
									<p className="text-xs text-muted-foreground">
										{defaultRemovalDescription}
									</p>
								)}

								<AnimatePresence initial={false}>
									{(scope === "month" || scope === "default") && (
										<motion.div
											className="overflow-hidden"
											{...COLLAPSE_MOTION}
										>
											<FieldGroup className="gap-2">
												<div className="flex items-center justify-between gap-2">
													<FieldLabel
														className="shrink-0"
														htmlFor="monthly-budget-amount"
													>
														Monthly amount
													</FieldLabel>
													<Field
														orientation="horizontal"
														className="w-auto"
													>
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
												</div>
												<AmountField
													id="monthly-budget-amount"
													value={amount}
													min={0}
													disabled={noAmount}
													errors={getApiFieldErrors("amount")}
													onChange={setAmount}
												/>
											</FieldGroup>
										</motion.div>
									)}
								</AnimatePresence>
							</FieldGroup>
							{monthlyBudget ? (
								<Field orientation="horizontal" className="border-t pt-4">
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
							{Object.values(apiErrors).flat().length ? (
								<p
									className="fade-in slide-in-from-top-1 animate-in text-sm text-destructive duration-150 ease-out"
									role="alert"
								>
									{Object.values(apiErrors).flat().join(" ")}
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
			) : null}
		</Dialog>
	)
}

const COLOURS = [
	["Slate", "#64748b"],
	["Sky", "#38bdf8"],
	["Teal", "#14b8a6"],
	["Green", "#84cc16"],
	["Amber", "#f59e0b"],
	["Rose", "#f43f5e"],
	["Violet", "#8b5cf6"],
	["Pink", "#ec4899"],
] as const
