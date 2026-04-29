import { CalendarIcon } from "lucide-react"
import { DateTime } from "luxon"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, parseDate } from "@/lib/utils"

type ErrorItem = { message?: string }

type Props = {
	id: string
	label: string
	value: string
	errors: ErrorItem[]
	placeholder?: string
	onChange: (value: string) => void
}

export default function DateField({
	id,
	label,
	value,
	errors,
	placeholder = "Select date",
	onChange,
}: Props) {
	const selected = parseDate(value)

	return (
		<Field data-invalid={!!errors.length}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Popover>
				<PopoverTrigger
					render={
						<Button
							id={id}
							variant="outline"
							aria-invalid={!!errors.length}
							className={cn(
								"w-full justify-start text-left font-normal",
								!selected.isValid && "text-muted-foreground",
								errors.length ? "border-destructive" : null,
							)}
						>
							<CalendarIcon />
							{selected.isValid ? (
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
						defaultMonth={selected.isValid ? selected.toJSDate() : undefined}
						selected={selected.isValid ? selected.toJSDate() : undefined}
						onSelect={date => onChange(date ? DateTime.fromJSDate(date).toFormat("yyyy-MM-dd") : "")}
					/>
				</PopoverContent>
			</Popover>
			<FieldError errors={errors} />
		</Field>
	)
}
