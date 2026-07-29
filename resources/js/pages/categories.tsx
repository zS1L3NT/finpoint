import { Icon as IconifyIcon } from "@iconify/react"
import { Link } from "@inertiajs/react"
import { useState } from "react"
import CategoryDialog from "@/components/dialogs/category"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useHistory } from "@/history"
import { Category, CategoryWithChildren } from "@/types"
import { recordsWebRoute } from "@/wayfinder/routes"

type CategoryDialogState =
	| { mode: "create" }
	| { mode: "edit"; category: Category | CategoryWithChildren }
	| null

export default function CategoriesPage({ categories }: { categories: CategoryWithChildren[] }) {
	const [dialogState, setDialogState] = useState<CategoryDialogState>(null)
	const { handlePush } = useHistory()

	return (
		<>
			<AppHeader title="Categories" />

			<PageContent>
				<PageHeader
					title="Categories"
					subtitle="Manage top-level categories and their nested children."
					description="Category map"
					icon="lucide:tag"
					actions={
						<Button
							type="button"
							className="w-full sm:w-auto"
							onClick={() => setDialogState({ mode: "create" })}
						>
							<IconifyIcon icon="lucide:plus" /> Create Category
						</Button>
					}
				/>

				<Card>
					<CardHeader>
						<CardTitle>Category Tree</CardTitle>
						<CardDescription>
							Open a category's records, or use Edit to manage it.
						</CardDescription>
					</CardHeader>
					<CardContent className="px-0">
						{categories.length ? (
							<CategoryTree
								categories={categories}
								onOpen={handlePush("Categories")}
								onEdit={category => setDialogState({ mode: "edit", category })}
							/>
						) : (
							<div className="px-4 py-8 text-center text-muted-foreground">
								No categories found.
							</div>
						)}
					</CardContent>
				</Card>
			</PageContent>

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
	onOpen,
	onEdit,
}: {
	categories: (Category | CategoryWithChildren)[]
	onOpen: () => void
	onEdit: (category: Category | CategoryWithChildren) => void
}) {
	return (
		<div className="flex flex-col divide-y">
			{categories.map(category => (
				<CategoryTreeItem
					key={category.id}
					category={category}
					onOpen={onOpen}
					onEdit={onEdit}
				/>
			))}
		</div>
	)
}

function CategoryTreeItem({
	category,
	onOpen,
	onEdit,
}: {
	category: Category | CategoryWithChildren
	onOpen: () => void
	onEdit: (category: Category | CategoryWithChildren) => void
}) {
	return (
		<div className="flex flex-col">
			<div className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
				<Link
					href={recordsWebRoute.url({ query: { category_ids: category.id } })}
					className="flex min-w-0 flex-1 items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
					onClick={onOpen}
				>
					<Icon {...category} size={14} />
					<div className="min-w-0 flex-1">
						<p className="truncate font-medium">{category.name}</p>
						<p className="truncate text-xs text-muted-foreground">
							{category.records_count}{" "}
							{category.records_count === 1 ? "record" : "records"}
						</p>
					</div>
					{"children" in category ? (
						<span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
							{category.children.length} child
							{category.children.length === 1 ? "" : "ren"}
						</span>
					) : null}
				</Link>

				<Button
					type="button"
					variant="outline"
					size="sm"
					className="shrink-0"
					onClick={() => onEdit(category)}
				>
					Edit
				</Button>
			</div>

			{"children" in category ? (
				<div className="ml-6 border-l border-border/60">
					<CategoryTree categories={category.children} onOpen={onOpen} onEdit={onEdit} />
				</div>
			) : null}
		</div>
	)
}
