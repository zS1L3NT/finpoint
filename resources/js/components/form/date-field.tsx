import { CalendarIcon, XIcon } from "lucide-react"
import { DateTime } from "luxon"
import { FormField, type FormFieldProps } from "@/components/form/field"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, parseDate } from "@/lib/utils"

type Props = FormFieldProps & {
	value: string
	placeholder?: string
	onChange: (value: string) => void
}

export default function DateField({
	id,
	label,
	description,
	errors,
	disabled,
	className,
	value,
	placeholder = "Select date",
	onChange,
}: Props) {
	const selected = parseDate(value)
	const invalid = !!errors?.length

	return (
		<FormField
			id={id}
			label={label}
			description={description}
			errors={errors}
			disabled={disabled}
			className={className}
		>
			<div className="relative">
				<Popover>
					<PopoverTrigger
						render={
							<Button
								id={id}
								variant="outline"
								disabled={disabled}
								aria-invalid={invalid}
								className={cn(
									"w-full justify-start text-left font-normal",
									selected.isValid && "pr-8",
									!selected.isValid && "text-muted-foreground",
									invalid ? "border-destructive" : null,
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
							onSelect={date =>
								onChange(
									date ? DateTime.fromJSDate(date).toFormat("yyyy-MM-dd") : "",
								)
							}
						/>
					</PopoverContent>
				</Popover>

				{selected.isValid ? (
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						className="absolute top-1/2 right-1 -translate-y-1/2"
						aria-label="Clear date"
						disabled={disabled}
						onClick={() => onChange("")}
					>
						<XIcon />
					</Button>
				) : null}
			</div>
		</FormField>
	)
}
