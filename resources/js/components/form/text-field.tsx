import { FormField, type FormFieldProps } from "@/components/form/field"
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
	value,
	placeholder,
	suggestions,
	type = "text",
	onChange,
	...props
}: Props) {
	const { id, disabled, errors } = props
	const invalid = !!errors?.length

	return (
		<FormField {...props}>
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
				/>
			)}
		</FormField>
	)
}
