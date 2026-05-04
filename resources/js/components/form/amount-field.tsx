import type { ReactNode } from "react"
import { FormField, type FormFieldProps } from "@/components/form/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = FormFieldProps & {
	value: number
	placeholder?: string
	step?: number
	min?: number
	max?: number
	suffix?: ReactNode
	onChange: (value: number) => void
}

export default function AmountField({
	value,
	placeholder,
	step = 0.01,
	min,
	max,
	suffix,
	onChange,
	...props
}: Props) {
	const { id, disabled, errors } = props
	const invalid = !!errors?.length

	return (
		<FormField {...props}>
			<div className="relative flex items-center gap-2">
				<span className="absolute left-2.5">$</span>
				<Input
					id={id}
					name={id}
					type="number"
					placeholder={placeholder}
					step={step}
					min={min}
					max={max}
					value={value}
					onChange={e => {
						const next = Number(e.target.value)
						onChange(Number.isNaN(next) ? 0 : next)
					}}
					aria-invalid={invalid}
					disabled={disabled}
					className={cn("flex-1 pl-6", invalid ? "border-destructive" : null)}
				/>
				{suffix ? <span>{suffix}</span> : null}
			</div>
		</FormField>
	)
}
