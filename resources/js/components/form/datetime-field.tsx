import { CalendarIcon } from "lucide-react"
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
	value: string
	errors: ErrorItem[]
	placeholder?: string
	onChange: (value: string) => void
}

const parseValue = (value: string) => {
	if (!value) {
		return null
	}

	const datetime = DateTime.fromFormat(value, "yyyy-MM-dd'T'HH:mm")
	return datetime.isValid ? datetime : null
}

const toInputValue = (datetime: DateTime) => datetime.toFormat("yyyy-MM-dd'T'HH:mm")

export default function DatetimeField({
	id,
	label = "Date & Time",
	value,
	errors,
	placeholder = "Select date & time",
	onChange,
}: Props) {
	const selected = parseValue(value)
	const selectedTime = selected ? selected.toFormat("HH:mm") : ""

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
			second: 0,
			millisecond: 0,
		})

		onChange(toInputValue(next))
	}

	const updateTime = (time: string) => {
		const [hours = "0", minutes = "0"] = time.split(":")
		const source = selected ?? DateTime.now().startOf("day")
		const next = source.set({
			hour: Number(hours),
			minute: Number(minutes),
			second: 0,
			millisecond: 0,
		})

		onChange(toInputValue(next))
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
									"w-full justify-start text-left font-normal",
									!selected && "text-muted-foreground",
									errors.length ? "border-destructive" : null,
								)}
							>
								<CalendarIcon />
								{selected ? (
									selected.toFormat("d MMM yyyy")
								) : (
									<span>{placeholder}</span>
								)}
							</Button>
						}
					/>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							defaultMonth={selected?.toJSDate()}
							selected={selected?.toJSDate()}
							onSelect={updateDate}
						/>
					</PopoverContent>
				</Popover>
				<Input
					id={`${id}-time`}
					type="time"
					step="60"
					value={selectedTime}
					onChange={event => updateTime(event.target.value)}
					aria-invalid={!!errors.length}
					className={cn(errors.length ? "border-destructive" : null)}
				/>
			</div>
			<FieldError errors={errors} />
		</Field>
	)
}
