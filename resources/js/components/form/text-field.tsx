import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type ErrorItem = { message?: string }

type Props = {
	id: string
	label: string
	value: string
	errors: ErrorItem[]
	placeholder?: string
	suggestions?: string[]
	type?: "text" | "email" | "tel" | "url" | "search" | "password"
	onChange: (value: string) => void
}

export default function TextField({
	id,
	label,
	value,
	errors,
	placeholder,
	suggestions,
	type = "text",
	onChange,
}: Props) {
	return (
		<Field data-invalid={!!errors.length}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			{suggestions ? (
				<Combobox
					items={[...new Set(value.trim() ? [value, ...suggestions] : suggestions)]}
					value={value}
					onValueChange={e => onChange(e ?? "")}
					autoHighlight
				>
					<ComboboxInput
						id={id}
						name={id}
						type={type}
						placeholder={placeholder}
						onChange={e => onChange(e.target.value)}
						aria-invalid={!!errors.length}
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
					onChange={e => onChange(e.target.value)}
					aria-invalid={!!errors.length}
				/>
			)}
			<FieldError errors={errors} />
		</Field>
	)
}
