import { type ReactNode } from "react"
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

type Props<T> = {
	id: string
	label: string
	value: T | null
	errors: { message?: string }[]
	placeholder?: string
	emptyText?: string
	items: T[]
	getItemId: (item: T) => string
	getItemString: (item: T) => string
	renderItem: (item: T) => ReactNode
	onChange: (value: T | null) => void
}

export default function ComboboxField<T>({
	id,
	label,
	value,
	errors,
	placeholder,
	emptyText = "No items found.",
	items,
	getItemId,
	getItemString,
	renderItem,
	onChange,
}: Props<T>) {
	return (
		<Field data-invalid={!!errors.length}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Combobox
				items={items}
				itemToStringLabel={getItemString}
				itemToStringValue={getItemId}
				value={value}
				onValueChange={onChange}
			>
				<ComboboxInput
					id={id}
					placeholder={placeholder}
					aria-invalid={!!errors.length}
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
			<FieldError errors={errors} />
		</Field>
	)
}
