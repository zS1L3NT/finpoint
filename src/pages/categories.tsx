import { useLiveQuery } from "dexie-react-hooks"
import { useState } from "react"
import { Link } from "react-router-dom"
import CategoryDialog from "@/components/dialogs/category"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useHistory } from "@/history"
import { treatmentLabel } from "@/lib/analytics"
import { listCategories } from "@/logic/categories"
import { pathRecords } from "@/routes"
import { Category, CategoryWithChildren } from "@/types"

type CategoryDialogState =
	| { mode: "create" }
	| { mode: "edit"; category: Category | CategoryWithChildren }
	| null

export default function CategoriesPage() {
	const [dialogState, setDialogState] = useState<CategoryDialogState>(null)
	const { handlePush } = useHistory()
	const categories = useLiveQuery(() => listCategories(), []) ?? []

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
							Review each category’s defaults, edit it, or open its Records.
						</CardDescription>
					</CardHeader>
					<CardContent className="px-0">
						{categories.length ? (
							<CategoryTree
								categories={categories}
								onFindRecords={handlePush("Categories")}
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
	onFindRecords,
	onEdit,
}: {
	categories: (Category | CategoryWithChildren)[]
	onFindRecords: () => void
	onEdit: (category: Category | CategoryWithChildren) => void
}) {
	return (
		<div className="flex flex-col divide-y">
			{categories.map(category => (
				<CategoryTreeItem
					key={category.id}
					category={category}
					onFindRecords={onFindRecords}
					onEdit={onEdit}
				/>
			))}
		</div>
	)
}

function CategoryTreeItem({
	category,
	onFindRecords,
	onEdit,
}: {
	category: Category | CategoryWithChildren
	onFindRecords: () => void
	onEdit: (category: Category | CategoryWithChildren) => void
}) {
	return (
		<div className="flex flex-col">
			<div className="group flex flex-col gap-2.5 px-4 py-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:gap-3">
				<div className="flex w-full min-w-0 flex-1 items-center gap-3">
					<Icon {...category} size={14} />
					<div className="grid min-w-0 flex-1 gap-1">
						<p className="truncate font-medium">{category.name}</p>
						<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<IconifyIcon icon="lucide:tag" className="size-3.5" />
							<span className="truncate">
								{`${category.analytics_treatment ? treatmentLabel(category.analytics_treatment) : "No default treatment"} · ${category.default_bucket?.name ?? "No default bucket"}`}
							</span>
						</p>
						<p className="text-xs text-muted-foreground">
							{category.records_count}{" "}
							{category.records_count === 1 ? "Record" : "Records"}
						</p>
					</div>
					{"children" in category ? (
						<span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
							{category.children.length} child
							{category.children.length === 1 ? "" : "ren"}
						</span>
					) : null}
				</div>

				<div className="flex shrink-0 justify-end gap-1.5 self-end sm:self-auto">
					<Button variant="outline" size="sm" onClick={() => onEdit(category)}>
						<IconifyIcon icon="lucide:pencil" /> Edit
					</Button>
					<Button variant="outline" size="sm" asChild>
						<Link
							to={pathRecords({ category_ids: category.id })}
							aria-label={`Open records for ${category.name}`}
							onClick={onFindRecords}
						>
							Open in records
						</Link>
					</Button>
				</div>
			</div>

			{"children" in category ? (
				<div className="ml-6 border-l border-border/60">
					<CategoryTree
						categories={category.children}
						onFindRecords={onFindRecords}
						onEdit={onEdit}
					/>
				</div>
			) : null}
		</div>
	)
}
