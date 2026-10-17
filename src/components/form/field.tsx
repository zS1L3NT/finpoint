import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

export type FieldErrorItem = { message?: string }

export type FormFieldProps = {
	id: string
	label?: React.ReactNode
	description?: React.ReactNode
	autopopulated?: string
	errors?: FieldErrorItem[]
	disabled?: boolean
	className?: string
}

export function FormField({
	id,
	label,
	description,
	autopopulated,
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
			{autopopulated && !errors?.length ? (
				<FieldDescription
					id={`${id}-autopopulated`}
					className="text-emerald-700 dark:text-emerald-400"
				>
					{autopopulated}
				</FieldDescription>
			) : null}
			<FieldError errors={errors} />
		</Field>
	)
}
