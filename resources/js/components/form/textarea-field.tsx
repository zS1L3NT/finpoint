import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

type ErrorItem = { message?: string }

type Props = {
	id: string
	label: string
	value: string
	errors: ErrorItem[]
	placeholder?: string
	description?: string
	onChange: (value: string) => void
}

export default function TextareaField({
	id,
	label,
	value,
	errors,
	placeholder,
	description,
	onChange,
}: Props) {
	return (
		<Field data-invalid={!!errors.length}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			{description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
			<Textarea
				id={id}
				name={id}
				value={value}
				placeholder={placeholder}
				onChange={e => onChange(e.target.value)}
				aria-invalid={!!errors.length}
			/>
			<FieldError errors={errors} />
		</Field>
	)
}
