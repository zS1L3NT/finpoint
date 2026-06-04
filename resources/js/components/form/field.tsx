import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

export type FieldErrorItem = { message?: string }

export type FormFieldProps = {
	id: string
	label?: React.ReactNode
	description?: React.ReactNode
	errors?: FieldErrorItem[]
	disabled?: boolean
	className?: string
}

export function FormField({
	id,
	label,
	description,
	errors,
	disabled,
	children,
	...props
}: FormFieldProps & { children: React.ReactNode }) {
	return (
		<Field data-invalid={!!errors?.length} data-disabled={disabled || undefined} {...props}>
			{label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
			{description ? <FieldDescription>{description}</FieldDescription> : null}
			{children}
			<FieldError errors={errors} />
		</Field>
	)
}
