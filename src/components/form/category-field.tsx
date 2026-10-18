import ComboboxField from "@/components/form/combobox-field"
import type { FormFieldProps } from "@/components/form/field"
import Icon from "@/components/icon"
import { cn } from "@/lib/utils"
import type { Category, CategoryWithChildren } from "@/types"

/** Category picker shared by record forms and statement rules; subcategories sit indented under their parent. */
export default function CategoryField({
	value,
	categories,
	placeholder = "Select category",
	onChange,
	...props
}: FormFieldProps & {
	value: string
	categories: CategoryWithChildren[]
	placeholder?: string
	onChange: (value: Category | null) => void
}) {
	const categoriesFlat = categories.flatMap(category => [category, ...category.children])
	return (
		<ComboboxField
			{...props}
			value={categoriesFlat.find(category => category.id === value) ?? null}
			placeholder={placeholder}
			emptyText="No categories found."
			items={categoriesFlat}
			getItemId={category => category.id}
			getItemString={category => category.name}
			renderItem={category => (
				<div
					className={cn(
						"flex items-center gap-1",
						category.parent_category_id ? "pl-2" : null,
					)}
				>
					<Icon {...category} size={10} />
					{category.name}
				</div>
			)}
			onChange={onChange}
		/>
	)
}
