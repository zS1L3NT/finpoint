import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import { FilterField, filterControlClass } from "@/components/table/filter-bar"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { CategoryWithChildren } from "@/types"

export default function CategoryFilter({
	categories,
	selectedIds,
	onChange,
}: {
	categories: CategoryWithChildren[]
	selectedIds: string[]
	onChange: (ids: string[]) => void
}) {
	const categoriesFlat = categories.flatMap(category => [category, ...category.children])

	const toggle = (id: string) =>
		onChange(
			selectedIds.includes(id)
				? selectedIds.filter(selectedId => selectedId !== id)
				: [...selectedIds, id],
		)

	return (
		<FilterField name="category" active={!!selectedIds.length} onClear={() => onChange([])}>
			<Popover>
				<PopoverTrigger
					render={
						<Button
							type="button"
							variant="outline"
							className={cn(
								"grid w-full grid-cols-[1rem_minmax(0,1fr)_1rem] items-center",
								filterControlClass(!!selectedIds.length),
							)}
						/>
					}
				>
					<IconifyIcon icon="lucide:tags" className="justify-self-start" />
					<span className="truncate text-center">
						{selectedIds.length
							? `${selectedIds.length} categor${selectedIds.length === 1 ? "y" : "ies"}`
							: "Any category"}
					</span>
					<IconifyIcon
						icon="lucide:chevron-down"
						data-filter-chevron
						className="justify-self-end"
					/>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					variant="filter"
					className="w-[calc(100vw-2rem)] overflow-hidden sm:w-72"
				>
					<Command
						filter={(value, search) =>
							value.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0
						}
					>
						<div className="relative">
							<CommandInput
								placeholder="Search categories..."
								className={selectedIds.length ? "pr-6" : undefined}
							/>
							{selectedIds.length ? (
								<Button
									type="button"
									variant="ghost"
									size="icon-xs"
									className="absolute top-2.5 right-2.5 z-10"
									aria-label="Clear categories"
									onClick={() => onChange([])}
								>
									<IconifyIcon icon="lucide:x" />
								</Button>
							) : null}
						</div>
						<CommandList>
							<CommandEmpty>No categories found.</CommandEmpty>
							<CommandGroup>
								{categoriesFlat.map(category => (
									<CategoryFilterItem
										key={category.id}
										category={category}
										checked={selectedIds.includes(category.id)}
										onSelect={() => toggle(category.id)}
									/>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</FilterField>
	)
}

function CategoryFilterItem({
	category,
	checked,
	onSelect,
}: {
	category: CategoryWithChildren["children"][number] | CategoryWithChildren
	checked: boolean
	onSelect: () => void
}) {
	return (
		<CommandItem
			value={category.name}
			data-checked={checked}
			variant="filter"
			onSelect={onSelect}
		>
			<div
				className={cn(
					"flex min-w-0 items-center gap-1",
					category.parent_category_id ? "pl-2" : null,
				)}
			>
				<Icon {...category} size={10} />
				<span className="truncate">{category.name}</span>
			</div>
		</CommandItem>
	)
}
