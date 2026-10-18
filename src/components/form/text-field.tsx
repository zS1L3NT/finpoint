import { AUTOPOPULATED_BORDER, FormField, type FormFieldProps } from "@/components/form/field"
import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"

type Props = FormFieldProps & {
	value: string
	placeholder?: string
	suggestions?: string[]
	type?: "text" | "email" | "tel" | "url" | "search" | "password"
	onChange: (value: string) => void
}

export default function TextField({
	id,
	label,
	description,
	autopopulated,
	errors,
	disabled,
	className,
	value,
	placeholder,
	suggestions,
	type = "text",
	onChange,
}: Props) {
	const invalid = !!errors?.length
	const hinted = !!autopopulated && !invalid

	return (
		<FormField
			id={id}
			label={label}
			description={description}
			autopopulated={autopopulated}
			errors={errors}
			disabled={disabled}
			className={className}
		>
			{suggestions ? (
				<Combobox
					items={[...new Set(value.trim() ? [value, ...suggestions] : suggestions)]}
					value={value}
					onValueChange={e => onChange(e ?? "")}
					disabled={disabled}
					autoHighlight
				>
					<ComboboxInput
						id={id}
						name={id}
						type={type}
						placeholder={placeholder}
						disabled={disabled}
						onChange={e => onChange(e.target.value)}
						aria-invalid={invalid}
						aria-describedby={hinted ? `${id}-autopopulated` : undefined}
						className={hinted ? AUTOPOPULATED_BORDER : undefined}
						showTrigger={false}
					/>
					<ComboboxContent className="w-fit min-w-0">
						<ComboboxList>
							{(suggestion: string) => (
								<ComboboxItem
									key={suggestion}
									value={suggestion}
									className="w-(--anchor-width)"
								>
									{suggestion}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			) : (
				<Input
					id={id}
					name={id}
					type={type}
					placeholder={placeholder}
					value={value}
					disabled={disabled}
					onChange={e => onChange(e.target.value)}
					aria-invalid={invalid}
					aria-describedby={hinted ? `${id}-autopopulated` : undefined}
					className={hinted ? AUTOPOPULATED_BORDER : undefined}
				/>
			)}
		</FormField>
	)
}
