"use client"

import { DateTime } from "luxon"
import { useState } from "react"
import type { DateRange as CalendarRange, Matcher } from "react-day-picker"
import { FormField, type FormFieldProps } from "@/components/form/field"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, parseDate } from "@/lib/utils"

export type DateRangeValue = {
	start: string | null
	end: string | null
}

type Props = FormFieldProps & {
	value: DateRangeValue
	minimum?: string
	maximum?: string
	triggerClassName?: string
	placeholder?: string
	onChange: (value: DateRangeValue) => void
}

export default function DateRange({
	id,
	label,
	description,
	errors,
	disabled,
	className,
	value,
	minimum,
	maximum,
	triggerClassName,
	placeholder = "Any date",
	onChange,
}: Props) {
	const selected = rangeFromValue(value)
	const minimumDate = parseDate(minimum ?? "")
	const maximumDate = parseDate(maximum ?? "")
	const [open, setOpen] = useState(false)
	const [draft, setDraft] = useState<CalendarRange | undefined>(selected)
	const disabledDates: Matcher[] = [
		...(minimumDate.isValid ? [{ before: minimumDate.toJSDate() }] : []),
		...(maximumDate.isValid ? [{ after: maximumDate.toJSDate() }] : []),
	]
	const invalid = !!errors?.length

	const changeOpen = (next: boolean) => {
		if (next) setDraft(selected)
		setOpen(next)
	}
	const apply = () => {
		if (!draft?.from) return
		const start = DateTime.fromJSDate(draft.from).toFormat("yyyy-MM-dd")
		const end = DateTime.fromJSDate(draft.to ?? draft.from).toFormat("yyyy-MM-dd")
		onChange({ start, end })
		setOpen(false)
	}
	const clear = () => {
		onChange({ start: null, end: null })
		setOpen(false)
	}

	return (
		<FormField
			id={id}
			label={label}
			description={description}
			errors={errors}
			disabled={disabled}
			className={cn("min-w-0", className)}
		>
			<Popover open={open} onOpenChange={changeOpen}>
				<PopoverTrigger
					render={
						<Button
							id={id}
							type="button"
							variant="outline"
							disabled={disabled}
							aria-invalid={invalid}
							className={cn(
								"relative w-full justify-center text-center font-normal",
								!selected && "text-muted-foreground",
								invalid ? "border-destructive" : null,
								triggerClassName,
							)}
						>
							<IconifyIcon
								icon="lucide:calendar-range"
								className="absolute left-2"
								data-icon="inline-start"
							/>
							<span className="w-full truncate px-5 text-center">
								{selected?.from ? formatRange(selected) : placeholder}
							</span>
						</Button>
					}
				/>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="range"
						defaultMonth={
							draft?.from ??
							(minimumDate.isValid ? minimumDate.toJSDate() : undefined)
						}
						selected={draft}
						disabled={disabledDates}
						startMonth={minimumDate.isValid ? minimumDate.toJSDate() : undefined}
						endMonth={maximumDate.isValid ? maximumDate.toJSDate() : undefined}
						resetOnSelect
						onSelect={setDraft}
					/>
					<div className="flex items-center justify-between gap-2 border-t p-2.5">
						<Button type="button" variant="ghost" disabled={!selected} onClick={clear}>
							Clear
						</Button>
						<Button type="button" disabled={!draft?.from} onClick={apply}>
							Apply
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</FormField>
	)
}

function rangeFromValue(value: DateRangeValue): CalendarRange | undefined {
	const from = parseDate(value.start ?? "")
	if (!from.isValid) return undefined
	const to = parseDate(value.end ?? "")
	return { from: from.toJSDate(), to: to.isValid ? to.toJSDate() : undefined }
}

function formatRange(range: CalendarRange): string {
	const from = DateTime.fromJSDate(range.from as Date)
	const to = range.to ? DateTime.fromJSDate(range.to) : from
	if (from.hasSame(to, "day")) return from.toFormat("d MMM yyyy")
	if (from.hasSame(to, "month")) return `${from.toFormat("d")}–${to.toFormat("d MMM yyyy")}`
	if (from.hasSame(to, "year")) {
		return `${from.toFormat("d MMM")} – ${to.toFormat("d MMM yyyy")}`
	}
	return `${from.toFormat("d MMM yyyy")} – ${to.toFormat("d MMM yyyy")}`
}
