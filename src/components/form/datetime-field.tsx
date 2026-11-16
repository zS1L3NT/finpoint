import { DateTime } from "luxon"
import { AUTOPOPULATED_BORDER, FormField, type FormFieldProps } from "@/components/form/field"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Props = Omit<FormFieldProps, "label" | "description" | "autopopulated"> & {
	value: string
	/** Labels for the two inputs, which are edited and marked separately. */
	label?: string
	timeLabel?: string
	/** A note per input whose value was filled in for the user. */
	autopopulated?: { date?: string; time?: string }
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
	label = "Date",
	timeLabel = "Time",
	autopopulated,
	errors,
	disabled,
	className,
	value,
	placeholder = "Select date",
	onChange,
}: Props) {
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
		<div
			className={cn(
				"grid w-full min-w-0 grid-cols-1 items-start gap-x-2 gap-y-4 sm:grid-cols-[minmax(0,1fr)_8.5rem]",
				className,
			)}
		>
			<FormField
				id={id}
				label={label}
				autopopulated={autopopulated?.date}
				errors={errors}
				disabled={disabled}
			>
				<Popover>
					<PopoverTrigger
						render={
							<Button
								id={id}
								variant="outline"
								disabled={disabled}
								aria-invalid={invalid}
								aria-describedby={
									autopopulated?.date && !invalid
										? `${id}-autopopulated`
										: undefined
								}
								className={cn(
									"w-full min-w-0 justify-start border-input text-left text-sm font-normal md:text-xs/relaxed",
									!selected && "text-muted-foreground",
									invalid
										? "border-destructive"
										: autopopulated?.date
											? AUTOPOPULATED_BORDER
											: null,
								)}
							>
								<IconifyIcon icon="lucide:calendar" />
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
			</FormField>
			{/* The date field already reports the shared datetime errors. */}
			<FormField
				id={`${id}-time`}
				label={timeLabel}
				autopopulated={invalid ? undefined : autopopulated?.time}
				disabled={disabled}
			>
				<Input
					id={`${id}-time`}
					type="time"
					step="60"
					value={selectedTime}
					disabled={disabled}
					onChange={event => updateTime(event.target.value)}
					aria-invalid={invalid}
					aria-describedby={
						autopopulated?.time && !invalid ? `${id}-time-autopopulated` : undefined
					}
					className={cn(
						"min-w-0 max-w-full appearance-none [max-inline-size:100%] [min-inline-size:0]",
						invalid
							? "border-destructive"
							: autopopulated?.time
								? AUTOPOPULATED_BORDER
								: null,
					)}
				/>
			</FormField>
		</div>
	)
}
