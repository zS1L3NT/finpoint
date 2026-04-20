import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn, toCurrency } from "@/lib/utils"

type ErrorItem = { message?: string }

type Props = {
	id: string
	label: string
	value: number
	errors: ErrorItem[]
	step?: number
	min?: number
	max?: number
	onChange: (value: number) => void
}

export default function AmountField({
	id,
	label,
	value,
	errors,
	step = 0.01,
	min,
	max,
	onChange,
}: Props) {
	return (
		<Field data-invalid={!!errors.length}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<div className="relative flex items-center gap-2">
				<span className="absolute left-2.5">$</span>
				<Input
					id={id}
					name={id}
					type="number"
					step={step}
					min={min}
					max={max}
					value={value}
					onChange={e => {
						const next = Number(e.target.value)
						onChange(Number.isNaN(next) ? 0 : next)
					}}
					aria-invalid={!!errors.length}
					className={cn("flex-1 pl-6", errors.length ? "border-destructive" : null)}
				/>
				<span>of {toCurrency(value)}</span>
			</div>
			<FieldError errors={errors} />
		</Field>
	)
}
