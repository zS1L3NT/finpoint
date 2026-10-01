"use client"

import { useState } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { FILTER_CONTROL_CLASS } from "@/components/table/filter-bar"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatCurrency } from "@/lib/utils"

export type AmountRange = { min: string | null; max: string | null }

export default function AmountFilter({
	value,
	onChange,
}: {
	value: AmountRange
	onChange: (value: AmountRange) => void
}) {
	const [open, setOpen] = useState(false)
	const [draft, setDraft] = useState({ min: value.min ?? "", max: value.max ?? "" })
	const [mirrored, setMirrored] = useState<"min" | "max" | null>(null)
	const valid = [draft.min, draft.max].every(
		amount => amount === "" || /^-?\d+(?:\.\d{1,2})?$/.test(amount),
	)
	const reversed = !!draft.min && !!draft.max && Number(draft.min) > Number(draft.max)
	const selected = !!(value.min || value.max)
	const label =
		value.min && value.max
			? value.min === value.max
				? formatCurrency(Number(value.min))
				: `${formatCurrency(Number(value.min))} – ${formatCurrency(Number(value.max))}`
			: value.min
				? `From ${formatCurrency(Number(value.min))}`
				: value.max
					? `Up to ${formatCurrency(Number(value.max))}`
					: "Any amount"

	const changeOpen = (next: boolean) => {
		if (next) {
			setDraft({ min: value.min ?? "", max: value.max ?? "" })
			setMirrored(null)
		}
		setOpen(next)
	}
	const changeAmount = (bound: "min" | "max", amount: string) => {
		if (!/^-?\d*(?:\.\d{0,2})?$/.test(amount)) return
		const other = bound === "min" ? "max" : "min"
		const shouldMirror = draft[other] === "" || mirrored === other
		setDraft({ ...draft, [bound]: amount, ...(shouldMirror ? { [other]: amount } : {}) })
		setMirrored(shouldMirror && amount ? other : null)
	}
	const apply = () => {
		onChange({ min: draft.min || null, max: draft.max || null })
		setOpen(false)
	}
	const clear = () => {
		onChange({ min: null, max: null })
		setDraft({ min: "", max: "" })
		setMirrored(null)
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
							"grid w-full grid-cols-[1rem_minmax(0,1fr)_1rem] items-center sm:w-40",
							FILTER_CONTROL_CLASS,
						)}
					/>
				}
			>
				<IconifyIcon icon="lucide:dollar-sign" className="justify-self-start" />
				<span className="truncate text-center">{label}</span>
				<IconifyIcon icon="lucide:chevron-down" className="justify-self-end" />
			</PopoverTrigger>
			<PopoverContent
				align="start"
				variant="filter"
				className="w-[min(18rem,calc(100vw-1rem))] overflow-hidden"
			>
				<div className="grid grid-cols-2 gap-2.5 px-3 py-3">
					<Field data-invalid={reversed}>
						<FieldLabel htmlFor="min_amount">Lower bound</FieldLabel>
						<Input
							id="min_amount"
							type="text"
							inputMode="decimal"
							placeholder="−50.00"
							value={draft.min}
							aria-invalid={reversed}
							onChange={event => changeAmount("min", event.target.value)}
						/>
					</Field>
					<Field data-invalid={reversed}>
						<FieldLabel htmlFor="max_amount">Upper bound</FieldLabel>
						<Input
							id="max_amount"
							type="text"
							inputMode="decimal"
							placeholder="50.00"
							value={draft.max}
							aria-invalid={reversed}
							onChange={event => changeAmount("max", event.target.value)}
						/>
					</Field>
					{reversed ? (
						<p className="col-span-2 text-xs text-destructive">
							Lower bound must not exceed upper bound.
						</p>
					) : null}
				</div>
				<div className="flex items-center justify-between gap-2 border-t px-3 py-2">
					<Button type="button" variant="ghost" disabled={!selected} onClick={clear}>
						Clear
					</Button>
					<Button type="button" disabled={!valid || reversed} onClick={apply}>
						Apply
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}
