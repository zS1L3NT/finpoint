import { CalendarIcon } from "lucide-react"
import { DateTime } from "luxon"
import { FormField, type FormFieldProps } from "@/components/form/field"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Props = FormFieldProps & {
	value: string
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
	value,
	placeholder = "Select date & time",
	onChange,
	...props
}: Props) {
	const { id, disabled, errors } = props
	const selected = parseValue(value)
	const selectedTime = selected ? selected.toFormat("HH:mm") : ""
	const invalid = !!errors?.length

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
		<FormField {...props}>
			<div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-2 overflow-hidden sm:grid-cols-[minmax(0,1fr)_7.5rem]">
				<Popover>
					<PopoverTrigger
						render={
							<Button
								id={id}
								variant="outline"
								disabled={disabled}
								aria-invalid={invalid}
								className={cn(
									"min-w-0 max-w-full justify-start text-left text-sm font-normal md:text-xs/relaxed border-input",
									!selected && "text-muted-foreground",
									invalid ? "border-destructive" : null,
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
					disabled={disabled}
					onChange={event => updateTime(event.target.value)}
					aria-invalid={invalid}
					className={cn(
						"min-w-0 max-w-full appearance-none [max-inline-size:100%] [min-inline-size:0]",
						invalid ? "border-destructive" : null,
					)}
				/>
			</div>
		</FormField>
	)
}
