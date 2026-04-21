import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type ErrorItem = { message?: string }

type Props = {
	id: string
	label: string
	value: string
	errors: ErrorItem[]
	placeholder?: string
	description?: string
	type?: "text" | "email" | "tel" | "url" | "search" | "password"
	onChange: (value: string) => void
}

export default function TextField({
	id,
	label,
	value,
	errors,
	placeholder,
	description,
	type = "text",
	onChange,
}: Props) {
	return (
		<Field data-invalid={!!errors.length}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			{description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
			<Input
				id={id}
				name={id}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={e => onChange(e.target.value)}
				aria-invalid={!!errors.length}
			/>
			<FieldError errors={errors} />
		</Field>
	)
}
