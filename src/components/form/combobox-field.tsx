import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { useState } from "react"
import { AUTOPOPULATED_BORDER, FormField, type FormFieldProps } from "@/components/form/field"
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
	limit?: number
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
	autopopulated,
	errors,
	disabled,
	className,
	value,
	placeholder,
	emptyText = "No items found.",
	limit,
	items,
	getItemId,
	getItemString,
	renderItem,
	onChange,
}: Props<T>) {
	const invalid = !!errors?.length
	const hinted = !!autopopulated && !invalid
	// Filter here instead of in Base UI: Base UI 1.4 freezes the typed query while the
	// popup exits after a pick, but only unfreezes it once the popup unmounts, so
	// reopening during that exit kept filtering by the old query whatever was typed.
	// This mirror freezes on a pick the same way and unfreezes whenever it reopens.
	const { contains } = ComboboxPrimitive.useFilter()
	const [query, setQuery] = useState(() => (value === null ? "" : getItemString(value)))
	const [frozenQuery, setFrozenQuery] = useState<string | null>(null)
	const activeQuery = frozenQuery ?? query.trim()
	const matches =
		activeQuery === ""
			? items
			: items.filter(item => contains(item, activeQuery, getItemString))
	const filteredItems = limit === undefined ? matches : matches.slice(0, limit)

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
			<Combobox
				items={items}
				itemToStringLabel={getItemString}
				itemToStringValue={getItemId}
				value={value}
				onValueChange={onChange}
				filteredItems={filteredItems}
				onInputValueChange={(next, details) => {
					if (details.reason === "item-press") setFrozenQuery(query.trim())
					setQuery(next)
				}}
				onOpenChange={open => {
					if (open) setFrozenQuery(null)
				}}
				disabled={disabled}
				limit={limit}
				autoHighlight
			>
				<ComboboxInput
					id={id}
					placeholder={placeholder}
					disabled={disabled}
					aria-invalid={invalid}
					aria-describedby={hinted ? `${id}-autopopulated` : undefined}
					className={hinted ? AUTOPOPULATED_BORDER : undefined}
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
