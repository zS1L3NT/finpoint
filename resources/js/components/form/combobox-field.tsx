import { FormField, type FormFieldProps } from "@/components/form/field"
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox"

type Props<T> = FormFieldProps & {
	value: T | null
	placeholder?: string
	emptyText?: string
	items: T[]
	getItemId: (item: T) => string
	getItemString: (item: T) => string
	renderItem: (item: T) => React.ReactNode
	onChange: (value: T | null) => void
}

export default function ComboboxField<T>({
	id,
	label,
	description,
	errors,
	disabled,
	className,
	value,
	placeholder,
	emptyText = "No items found.",
	items,
	getItemId,
	getItemString,
	renderItem,
	onChange,
}: Props<T>) {
	const invalid = !!errors?.length

	return (
		<FormField
			id={id}
			label={label}
			description={description}
			errors={errors}
			disabled={disabled}
			className={className}
		>
			<Combobox
				items={items}
				itemToStringLabel={getItemString}
				itemToStringValue={getItemId}
				value={value}
				onValueChange={onChange}
				disabled={disabled}
				autoHighlight
			>
				<ComboboxInput
					id={id}
					placeholder={placeholder}
					disabled={disabled}
					aria-invalid={invalid}
					showClear
				/>
				<ComboboxContent>
					<ComboboxEmpty>{emptyText}</ComboboxEmpty>
					<ComboboxList>
						{(item: T) => (
							<ComboboxItem key={getItemId(item)} value={item}>
								{renderItem(item)}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		</FormField>
	)
}
