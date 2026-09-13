import { FormField, type FormFieldProps } from "@/components/form/field"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

type Props = FormFieldProps & {
	value: string
	placeholder?: string
	items: { value: string; label: string }[]
	onChange: (value: string) => void
}

export default function SelectField({
	id,
	label,
	description,
	errors,
	disabled,
	className,
	value,
	placeholder,
	items,
	onChange,
}: Props) {
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
			<Select value={value} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger className="w-full" id={id} aria-invalid={invalid}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{items.map(item => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</FormField>
	)
}
