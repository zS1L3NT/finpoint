"use client"

import { useId, useState } from "react"
import SelectField from "@/components/form/select-field"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { FILTER_CONTROL_CLASS } from "@/components/table/filter-bar"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn, formatCurrency } from "@/lib/utils"

export type AmountRange = { min: string | null; max: string | null }
type Draft = {
	direction: "paid" | "received" | "both"
	comparison: "least" | "most" | "exact" | "between"
	from: string
	to: string
}

function readRange(value: AmountRange): Draft {
	const min = value.min === null ? null : Number(value.min)
	const max = value.max === null ? null : Number(value.max)
	if (min === null && max === null) {
		return { direction: "paid", comparison: "least", from: "", to: "" }
	}
	if ((max !== null && max < 0) || (min !== null && min > 0)) {
		const paid = max !== null && max < 0
		const from = Math.abs(Number(paid ? max : min))
		const upper = paid ? min : max
		const to = upper === null ? null : Math.abs(upper)
		return {
			direction: paid ? "paid" : "received",
			comparison:
				from === to ? "exact" : to === null ? "least" : from === 0.01 ? "most" : "between",
			from: `${from === 0.01 && to !== null && from !== to ? to : from}`,
			to: to === null ? "" : `${to}`,
		}
	}
	return {
		direction: "both",
		comparison: "between",
		from: min === null ? "" : `${Math.abs(min)}`,
		to: max === null ? "" : `${Math.abs(max)}`,
	}
}

function describe(draft: Draft) {
	const from = formatCurrency(Number(draft.from))
	const to = formatCurrency(Number(draft.to))
	if (draft.direction === "both") {
		return `Paid${draft.from ? ` ≤ ${from}` : ""} · Received${draft.to ? ` ≤ ${to}` : ""}`
	}
	const direction = draft.direction === "paid" ? "Paid" : "Received"
	return `${direction} ${draft.comparison === "between" ? `${from} – ${to}` : `${{ least: "≥", most: "≤", exact: "=" }[draft.comparison]} ${from}`}`
}

export default function AmountFilter({
	value,
	onChange,
}: {
	value: AmountRange
	onChange: (value: AmountRange) => void
}) {
	const id = useId()
	const [open, setOpen] = useState(false)
	const [draft, setDraft] = useState(() => readRange(value))
	const selected = value.min !== null || value.max !== null
	const both = draft.direction === "both"
	const range = both || draft.comparison === "between"
	const valid = [draft.from, ...(range ? [draft.to] : [])].every(
		amount =>
			(both && amount === "") ||
			(/^\d*(?:\.\d{1,2})?$/.test(amount) &&
				amount !== "" &&
				Number.isFinite(Number(amount))),
	)
	const reversed =
		!both && range && !!draft.from && !!draft.to && Number(draft.from) > Number(draft.to)
	const zero =
		!both &&
		valid &&
		(draft.comparison === "least"
			? false
			: Number(draft.comparison === "between" ? draft.to : draft.from) === 0)

	const changeOpen = (next: boolean) => {
		if (next) setDraft(readRange(value))
		setOpen(next)
	}
	const changeAmount = (field: "from" | "to", amount: string) => {
		if (/^\d*(?:\.\d{0,2})?$/.test(amount)) setDraft({ ...draft, [field]: amount })
	}
	const apply = () => {
		if (!valid || reversed || zero) return
		if (both) {
			onChange({
				min: draft.from ? `${-Number(draft.from)}` : null,
				max: draft.to ? `${Number(draft.to)}` : null,
			})
		} else {
			const from = `${Math.max(0.01, Number(draft.from))}`
			const to = `${Number(draft.to)}`
			const min = draft.comparison === "most" ? "0.01" : from
			const max =
				draft.comparison === "least"
					? null
					: draft.comparison === "between"
						? to
						: `${Number(draft.from)}`
			onChange(
				draft.direction === "paid"
					? { min: max === null ? null : `${-Number(max)}`, max: `${-Number(min)}` }
					: { min, max },
			)
		}
		setOpen(false)
	}
	const clear = () => {
		onChange({ min: null, max: null })
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={changeOpen}>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant="outline"
						className={cn(
							"grid w-full grid-cols-[1rem_minmax(0,1fr)_1rem] items-center sm:w-44",
							FILTER_CONTROL_CLASS,
						)}
					/>
				}
			>
				<IconifyIcon icon="lucide:dollar-sign" className="justify-self-start" />
				<span
					className="truncate text-center"
					title={selected ? describe(readRange(value)) : undefined}
				>
					{selected ? describe(readRange(value)) : "Any amount"}
				</span>
				<IconifyIcon icon="lucide:chevron-down" className="justify-self-end" />
			</PopoverTrigger>
			<PopoverContent
				align="start"
				variant="filter"
				className="w-[min(20rem,calc(100vw-1rem))] overflow-hidden"
			>
				<form
					onSubmit={event => {
						event.preventDefault()
						apply()
					}}
				>
					<FieldGroup className="gap-3 px-3 py-3">
						<Field>
							<FieldLabel id={`${id}-direction`}>Money</FieldLabel>
							<ToggleGroup
								type="single"
								value={draft.direction}
								aria-labelledby={`${id}-direction`}
								className="w-full"
								onValueChange={direction => {
									if (direction === "paid" || direction === "received")
										setDraft({ ...draft, direction })
								}}
							>
								<ToggleGroupItem value="paid" className="flex-1">
									Paid
								</ToggleGroupItem>
								<ToggleGroupItem value="received" className="flex-1">
									Received
								</ToggleGroupItem>
								{both ? (
									<ToggleGroupItem value="both" className="flex-1">
										Both
									</ToggleGroupItem>
								) : null}
							</ToggleGroup>
						</Field>
						{!both ? (
							<SelectField
								id={`${id}-comparison`}
								label="Amount"
								value={draft.comparison}
								items={[
									{ value: "least", label: "At least" },
									{ value: "most", label: "At most" },
									{ value: "exact", label: "Exactly" },
									{ value: "between", label: "Between" },
								]}
								onChange={comparison =>
									setDraft({
										...draft,
										comparison: comparison as Draft["comparison"],
									})
								}
							/>
						) : null}
						<FieldGroup className={cn("gap-2.5", range && "grid grid-cols-2")}>
							{(range ? (["from", "to"] as const) : (["from"] as const)).map(
								field => (
									<Field key={field} data-invalid={reversed || zero}>
										<FieldLabel htmlFor={`${id}-${field}`}>
											{both
												? field === "from"
													? "Paid up to"
													: "Received up to"
												: range
													? field === "from"
														? "From"
														: "To"
													: "Value"}
										</FieldLabel>
										<InputGroup>
											<InputGroupAddon>$</InputGroupAddon>
											<InputGroupInput
												id={`${id}-${field}`}
												type="text"
												inputMode="decimal"
												placeholder={both ? "Any amount" : "50.00"}
												value={draft[field]}
												aria-invalid={reversed || zero}
												aria-describedby={
													reversed || zero ? `${id}-error` : undefined
												}
												onChange={event =>
													changeAmount(field, event.target.value)
												}
											/>
										</InputGroup>
									</Field>
								),
							)}
						</FieldGroup>
						{reversed || zero ? (
							<p id={`${id}-error`} role="alert" className="text-xs text-destructive">
								{reversed
									? "The second amount must be at least the first."
									: "Enter an amount greater than zero."}
							</p>
						) : (
							<p className="text-xs text-muted-foreground">
								{both
									? "This range includes payments and receipts. Leave either amount blank for no limit."
									: `Show money ${draft.direction === "paid" ? "paid out" : "received"}. ${range ? "Both amounts are included." : "Enter a positive amount."}`}
							</p>
						)}
					</FieldGroup>
					<Separator />
					<div className="flex items-center justify-between gap-2 px-3 py-2">
						<Button type="button" variant="ghost" disabled={!selected} onClick={clear}>
							Clear
						</Button>
						<Button type="submit" disabled={!valid || reversed || zero}>
							Apply
						</Button>
					</div>
				</form>
			</PopoverContent>
		</Popover>
	)
}
