import { useEffect, useRef, useState } from "react"
import { FormField, type FormFieldProps } from "@/components/form/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn, round2dp } from "@/lib/utils"

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
	const canBeNegative = min === undefined || min < 0
	const commitText = (raw: string) => {
		if (!canBeNegative && raw.startsWith("-")) {
			return
		}

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
	}
	const stepValue = (direction: -1 | 1) => {
		const next = Math.min(
			max ?? Number.POSITIVE_INFINITY,
			Math.max(min ?? Number.NEGATIVE_INFINITY, round2dp((Number(text) || 0) + direction)),
		)
		setText(`${next}`)
		onChange(next)
	}

	useEffect(() => {
		if (committed.current !== value) {
			committed.current = value
			setText(`${value}`)
		}
	}, [value])

	return (
		<FormField {...props}>
			<div className="flex min-w-0 items-center gap-2">
				<div className="relative min-w-0 flex-1">
					<span
						className={cn(
							"absolute top-1/2 left-2.5 -translate-y-1/2",
							disabled ? "text-muted-foreground" : null,
						)}
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
						onChange={e => commitText(e.target.value)}
						onKeyDown={e => {
							if (e.key === "ArrowUp" || e.key === "ArrowDown") {
								e.preventDefault()
								stepValue(e.key === "ArrowUp" ? 1 : -1)
							}
						}}
						aria-invalid={invalid}
						disabled={disabled}
						className={cn(
							"pl-6",
							canBeNegative ? "pr-10" : null,
							invalid ? "border-destructive" : null,
						)}
					/>
					{canBeNegative ? (
						<Button
							type="button"
							variant="ghost"
							size="xs"
							className="absolute top-1/2 right-1 h-5 px-1.5 font-mono text-[0.625rem] -translate-y-1/2"
							aria-label={negative ? "Make amount positive" : "Make amount negative"}
							title={negative ? "Make amount positive" : "Make amount negative"}
							disabled={disabled}
							onClick={() => {
								const raw = negative
									? text.slice(1)
									: text === "" || text === "0"
										? "-"
										: `-${text}`
								commitText(raw)
							}}
						>
							+/-
						</Button>
					) : null}
				</div>
				{suffix ? <span className="shrink-0 whitespace-nowrap">{suffix}</span> : null}
			</div>
		</FormField>
	)
}
