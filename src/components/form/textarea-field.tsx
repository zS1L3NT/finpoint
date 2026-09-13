import { FormField, type FormFieldProps } from "@/components/form/field"
import { Textarea } from "@/components/ui/textarea"

type Props = FormFieldProps & {
	value: string
	placeholder?: string
	onChange: (value: string) => void
}

export default function TextareaField({
	id,
	label,
	description,
	errors,
	disabled,
	className,
	value,
	placeholder,
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
			<Textarea
				id={id}
				name={id}
				value={value}
				placeholder={placeholder}
				disabled={disabled}
				onChange={e => onChange(e.target.value)}
				aria-invalid={invalid}
			/>
		</FormField>
	)
}
