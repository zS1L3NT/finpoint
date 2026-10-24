import { AnimatePresence, motion } from "framer-motion"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { DURATION, EASE_OUT, TRANSITION } from "@/lib/motion"

/** Border for an input whose value was filled in for the user. */
export const AUTOPOPULATED_BORDER = "border-emerald-600 dark:border-emerald-400"

const MotionFieldDescription = motion.create(FieldDescription)

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
			{/* A note present when the field mounts rides its form's entrance; one that
			    arrives later (a rule autofill) rises in on its own. */}
			<AnimatePresence initial={false}>
				{autopopulated && !errors?.length ? (
					<MotionFieldDescription
						key="autopopulated"
						id={`${id}-autopopulated`}
						className="text-emerald-700 dark:text-emerald-400"
						initial={{ opacity: 0, y: -3 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{
							opacity: 0,
							transition: { duration: DURATION.instant, ease: EASE_OUT },
						}}
						transition={TRANSITION.fast}
					>
						{autopopulated}
					</MotionFieldDescription>
				) : null}
			</AnimatePresence>
			<FieldError errors={errors} />
		</Field>
	)
}
