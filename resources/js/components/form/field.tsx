import type { ReactNode } from "react"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

export type FieldErrorItem = { message?: string }

export type FormFieldProps = {
	id: string
	label?: ReactNode
	errors?: FieldErrorItem[]
	className?: string
	description?: ReactNode
	disabled?: boolean
}

export function FormField({
	id,
	label,
	errors,
	description,
	disabled,
	children,
	...props
}: FormFieldProps & { children: ReactNode }) {
	return (
		<Field data-invalid={!!errors?.length} data-disabled={disabled || undefined} {...props}>
			{label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
			{description ? <FieldDescription>{description}</FieldDescription> : null}
			{children}
			<FieldError errors={errors} />
		</Field>
	)
}
