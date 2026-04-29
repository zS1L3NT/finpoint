import { PencilIcon, PlusIcon, TagIcon } from "lucide-react"
import { useState } from "react"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CategoryDialog from "@/dialogs/category"
import { Category } from "@/types"

type CategoryNode = Category & {
	children?: CategoryNode[] | null
	can_delete: boolean
}

type CategoryDialogState = { mode: "create" } | { mode: "edit"; category: CategoryNode } | null

export default function CategoriesPage({ categories }: { categories: CategoryNode[] }) {
	const [dialogState, setDialogState] = useState<CategoryDialogState>(null)

	return (
		<>
			<AppHeader title="Categories" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Categories"
					subtitle="Manage top-level categories and their nested children."
					description="Category map"
					icon={TagIcon}
					actions={
						<Button type="button" onClick={() => setDialogState({ mode: "create" })}>
							<PlusIcon /> Create Category
						</Button>
					}
				/>

				<Card>
					<CardHeader>
						<CardTitle>Category Tree</CardTitle>
						<CardDescription>Click a category to edit it.</CardDescription>
					</CardHeader>
					<CardContent className="px-0">
						{categories.length ? (
							<CategoryTree
								categories={categories}
								onEdit={category => setDialogState({ mode: "edit", category })}
							/>
						) : (
							<div className="px-4 py-8 text-center text-muted-foreground">
								No categories found.
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<CategoryDialog
				open={dialogState !== null}
				mode={dialogState?.mode ?? "create"}
				category={dialogState?.mode === "edit" ? dialogState.category : null}
				categories={categories}
				onOpenChange={open => {
					if (!open) {
						setDialogState(null)
					}
				}}
			/>
		</>
	)
}

function CategoryTree({
	categories,
	onEdit,
}: {
	categories: CategoryNode[]
	onEdit: (category: CategoryNode) => void
}) {
	return (
		<div className="flex flex-col divide-y">
			{categories.map(category => (
				<CategoryTreeItem key={category.id} category={category} onEdit={onEdit} />
			))}
		</div>
	)
}

function CategoryTreeItem({
	category,
	onEdit,
}: {
	category: CategoryNode
	onEdit: (category: CategoryNode) => void
}) {
	return (
		<div className="flex flex-col">
			<button
				type="button"
				className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
				onClick={() => onEdit(category)}
			>
				<Icon {...category} size={14} />
				<div className="min-w-0 flex-1">
					<p className="truncate font-medium">{category.name}</p>
					<p className="truncate text-xs text-muted-foreground">{category.id}</p>
				</div>
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					{category.children?.length ? (
						<span>
							{category.children.length} child
							{category.children.length === 1 ? "" : "ren"}
						</span>
					) : null}
					<PencilIcon className="size-3.5" />
				</div>
			</button>

			{category.children?.length ? (
				<div className="ml-6 border-l border-border/60">
					<CategoryTree categories={category.children} onEdit={onEdit} />
				</div>
			) : null}
		</div>
	)
}
