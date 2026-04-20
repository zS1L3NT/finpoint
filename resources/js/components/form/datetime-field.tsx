import { ChevronDownIcon } from "lucide-react"
import { DateTime } from "luxon"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type ErrorItem = { message?: string }

type Props = {
	id: string
	label?: string
	timeInputId?: string
	value: string
	errors: ErrorItem[]
	placeholder?: string
	onChange: (value: string) => void
}

export default function DatetimeField({
	id,
	label = "Datetime",
	placeholder = "Select date",
	timeInputId,
	value,
	errors,
	onChange,
}: Props) {
	const selected = value ? DateTime.fromISO(value) : null
	const selectedDate = selected ? selected.toJSDate() : undefined
	const selectedTime = selected ? selected.toFormat("HH:mm") : ""
	const selectedDateLabel = selected ? selected.toFormat("DDD") : ""

	const updateDate = (date: Date | undefined) => {
		if (!date) {
			onChange("")
			return
		}

		const source = selected ?? DateTime.now().startOf("day")
		const next = source.set({
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
		})

		onChange(next.toISO() ?? "")
	}

	const updateTime = (time: string) => {
		const [hours, minutes] = time.split(":").map(Number)
		const source = selected ?? DateTime.now()
		const next = source.set({
			hour: Number.isNaN(hours) ? 0 : hours,
			minute: Number.isNaN(minutes) ? 0 : minutes,
			second: 0,
			millisecond: 0,
		})

		onChange(next.toISO() ?? "")
	}

	return (
		<Field data-invalid={!!errors.length}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<div className="grid grid-cols-2 gap-2">
				<Popover>
					<PopoverTrigger
						render={
							<Button
								id={id}
								variant="outline"
								aria-invalid={!!errors.length}
								className={cn(
									"w-full justify-between font-normal",
									!selectedDate && "text-muted-foreground",
									errors.length ? "border-destructive" : null,
								)}
							>
								{selectedDate ? selectedDateLabel : placeholder}
								<ChevronDownIcon className="size-4 opacity-50" />
							</Button>
						}
					/>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar mode="single" selected={selectedDate} onSelect={updateDate} />
					</PopoverContent>
				</Popover>
				<Input
					id={timeInputId ?? `${id}-time`}
					type="time"
					value={selectedTime}
					onChange={e => updateTime(e.target.value)}
					aria-invalid={!!errors.length}
					className={cn(errors.length ? "border-destructive" : null)}
				/>
			</div>
			<FieldError errors={errors} />
		</Field>
	)
}
