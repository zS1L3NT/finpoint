import { useEffect, useRef, useState } from "react"
import { FormField, type FormFieldProps } from "@/components/form/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = FormFieldProps & {
	value: number
	placeholder?: string
	min?: number
	max?: number
	suffix?: React.ReactNode
	onChange: (value: number) => void
}

export default function AmountField({
	value,
	placeholder,
	min,
	max,
	suffix,
	onChange,
	...props
}: Props) {
	const { id, disabled, errors } = props
	const invalid = !!errors?.length
	const [text, setText] = useState(() => `${value}`)
	const committed = useRef(value)

	useEffect(() => {
		if (committed.current !== value) {
			committed.current = value
			setText(`${value}`)
		}
	}, [value])

	return (
		<FormField {...props}>
			<div className="relative flex items-center gap-2">
				<span
					className={cn("absolute left-2.5", disabled ? "text-muted-foreground" : null)}
				>
					$
				</span>
				<Input
					id={id}
					name={id}
					type="text"
					inputMode="decimal"
					placeholder={placeholder}
					min={min}
					max={max}
					value={text}
					onChange={e => {
						const raw = e.target.value
						if (raw === "" || raw === "-") {
							setText(raw)
							return
						}

						if (/^-?\d*\.?\d{0,2}$/.test(raw)) {
							setText(raw)
							const next = Number(raw)
							if (!Number.isNaN(next)) {
								onChange(next)
							}
						}
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
