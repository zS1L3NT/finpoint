import { MinusIcon, PlusIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { FormField, type FormFieldProps } from "@/components/form/field"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group"

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
	const negative = text.startsWith("-")

	useEffect(() => {
		if (committed.current !== value) {
			committed.current = value
			setText(`${value}`)
		}
	}, [value])

	return (
		<FormField {...props}>
			<div className="flex items-center gap-2">
				<InputGroup data-disabled={disabled}>
					<InputGroupAddon>$</InputGroupAddon>
					<InputGroupInput
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
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							aria-label={negative ? "Make amount positive" : "Make amount negative"}
							title={negative ? "Make amount positive" : "Make amount negative"}
							disabled={disabled}
							onClick={() => {
								const raw = negative
									? text.slice(1)
									: text === "" || text === "0"
										? "-"
										: `-${text}`
								setText(raw)
								if (raw === "" || raw === "-") {
									return
								}

								const next = Number(raw)
								if (!Number.isNaN(next)) {
									onChange(next)
								}
							}}
						>
							{negative ? <PlusIcon /> : <MinusIcon />}
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
				{suffix ? <span>{suffix}</span> : null}
			</div>
		</FormField>
	)
}
