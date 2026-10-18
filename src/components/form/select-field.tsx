import { AUTOPOPULATED_BORDER, FormField, type FormFieldProps } from "@/components/form/field"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Props = FormFieldProps & {
	value: string
	placeholder?: string
	items: { value: string; label: string; disabled?: boolean }[]
	onChange: (value: string) => void
}

export default function SelectField({
	id,
	label,
	description,
	autopopulated,
	errors,
	disabled,
	className,
	value,
	placeholder,
	items,
	onChange,
}: Props) {
	const invalid = !!errors?.length
	const hinted = !!autopopulated && !invalid

	return (
		<FormField
			id={id}
			label={label}
			description={description}
			autopopulated={autopopulated}
			errors={errors}
			disabled={disabled}
			className={className}
		>
			<Select value={value} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger
					className={cn("w-full", hinted && AUTOPOPULATED_BORDER)}
					id={id}
					aria-invalid={invalid}
					aria-describedby={hinted ? `${id}-autopopulated` : undefined}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{items.map(item => (
							<SelectItem
								key={item.value}
								value={item.value}
								disabled={item.disabled}
							>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</FormField>
	)
}
