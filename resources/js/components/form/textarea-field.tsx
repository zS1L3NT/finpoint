import { FormField, type FormFieldProps } from "@/components/form/field"
import { Textarea } from "@/components/ui/textarea"

type Props = FormFieldProps & {
	value: string
	placeholder?: string
	onChange: (value: string) => void
}

export default function TextareaField({ value, placeholder, onChange, ...props }: Props) {
	const { id, disabled, errors } = props

	return (
		<FormField {...props}>
			<Textarea
				id={id}
				name={id}
				value={value}
				placeholder={placeholder}
				disabled={disabled}
				onChange={e => onChange(e.target.value)}
				aria-invalid={!!errors?.length}
			/>
		</FormField>
	)
}
