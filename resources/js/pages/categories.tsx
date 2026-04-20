import { router } from "@inertiajs/react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import AppHeader from "@/components/app-header"
import ComboboxField from "@/components/form/combobox-field"
import TextField from "@/components/form/text-field"
import Icon from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { cn, withMethod } from "@/lib/utils"
import { Category } from "@/types"
import {
	destroy as destroyCategory,
	store as storeCategory,
	update as updateCategory,
} from "@/wayfinder/routes/categories"

type CategoryNode = Category & {
	children?: CategoryNode[] | null
	can_delete: boolean
}

type CategoryDialogState = { mode: "create" } | { mode: "edit"; category: CategoryNode } | null

type CategoryFormValues = {
	id: string
	name: string
	icon: string
	color: string
	parent_category_id: string
}

function isChildCategory(category: CategoryNode | null) {
	return category?.parent_category_id !== null
}

const EMPTY_FORM_VALUES: CategoryFormValues = {
	id: "",
	name: "",
	icon: "",
	color: "",
	parent_category_id: "",
}

export default function CategoriesPage({ categories }: { categories: CategoryNode[] }) {
	const [dialogState, setDialogState] = useState<CategoryDialogState>(null)

	return (
		<>
			<AppHeader title="Categories" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl font-semibold">Categories</h2>
						<p className="text-muted-foreground">
							Manage top-level categories and their nested children.
						</p>
					</div>

					<Button type="button" onClick={() => setDialogState({ mode: "create" })}>
						<PlusIcon /> Create Category
					</Button>
				</div>

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

function CategoryDialog({
	open,
	mode,
	category,
	categories,
	onOpenChange,
}: {
	open: boolean
	mode: "create" | "edit"
	category: CategoryNode | null
	categories: CategoryNode[]
	onOpenChange: (open: boolean) => void
}) {
	const isEditing = mode === "edit" && category !== null
	const canEditParentCategory = !isEditing || isChildCategory(category)
	const [values, setValues] = useState<CategoryFormValues>(EMPTY_FORM_VALUES)
	const { getApiFieldErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()
	const parentOptions = categories.filter(option => option.id !== category?.id)

	useEffect(() => {
		if (!open) {
			return
		}

		setValues(
			category
				? {
						id: category.id,
						name: category.name,
						icon: category.icon,
						color: category.color,
						parent_category_id: category.parent_category_id ?? "",
					}
				: EMPTY_FORM_VALUES,
		)
		resetApiErrors()
	}, [open, category, resetApiErrors])

	const setValue = <TKey extends keyof CategoryFormValues>(
		field: TKey,
		value: CategoryFormValues[TKey],
	) => {
		setValues(current => ({ ...current, [field]: value }))
		clearApiError(field)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData()
		formData.append("id", values.id)
		formData.append("name", values.name)
		formData.append("icon", values.icon)
		formData.append("color", values.color)
		if (!isEditing || isChildCategory(category)) {
			formData.append("parent_category_id", values.parent_category_id)
		}

		const response = await fetch(
			isEditing ? updateCategory.url({ category: category.id }) : storeCategory.url(),
			{
				method: "POST",
				body: isEditing ? withMethod(formData, "PUT") : formData,
				headers: { Accept: "application/json" },
			},
		)

		if (response.status === 422) {
			const data = await response.json().catch(() => null)
			setApiErrors((data?.errors ?? {}) as Record<string, string[]>)
			return
		}

		if (response.ok) {
			onOpenChange(false)
			router.reload()
		}
	}

	const handleDelete = async () => {
		if (!category) {
			return
		}

		const response = await fetch(destroyCategory.url({ category: category.id }), {
			method: "POST",
			body: withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			onOpenChange(false)
			router.reload()
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Category" : "Create Category"}</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the category details and parent assignment."
							: "Create a new top-level category or nest it under an existing one."}
					</DialogDescription>
				</DialogHeader>

				<form id="category-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<FieldGroup className="grid gap-4 md:grid-cols-2">
						<TextField
							id="id"
							label="Id"
							value={values.id}
							errors={getApiFieldErrors("id")}
							onChange={value => setValue("id", value)}
						/>
						<TextField
							id="name"
							label="Name"
							value={values.name}
							errors={getApiFieldErrors("name")}
							onChange={value => setValue("name", value)}
						/>
						<TextField
							id="icon"
							label="Icon"
							value={values.icon}
							errors={getApiFieldErrors("icon")}
							onChange={value => setValue("icon", value)}
						/>
						<TextField
							id="color"
							label="Color"
							value={values.color}
							errors={getApiFieldErrors("color")}
							onChange={value => setValue("color", value)}
						/>
					</FieldGroup>

					{canEditParentCategory ? (
						<ComboboxField
							id="parent_category_id"
							label="Parent Category"
							value={
								parentOptions.find(
									option => option.id === values.parent_category_id,
								) ?? null
							}
							errors={getApiFieldErrors("parent_category_id")}
							placeholder="Top-level category"
							emptyText="No categories found."
							items={parentOptions}
							getItemId={option => option.id}
							getItemString={option => option.name}
							renderItem={option => (
								<div className="flex items-center gap-2">
									<Icon {...option} size={10} />
									{option.name}
								</div>
							)}
							onChange={value => setValue("parent_category_id", value?.id ?? "")}
						/>
					) : null}

					<Card size="sm" className="bg-muted/30 ring-0">
						<CardContent className="flex items-center gap-3 py-1">
							<Icon icon={values.icon} color={values.color} size={14} />
							<div className="min-w-0">
								<p
									className={cn(
										"truncate font-medium",
										!values.name && "text-muted-foreground",
									)}
								>
									{values.name || "Category preview"}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{values.id || "category-id"}
								</p>
							</div>
						</CardContent>
					</Card>
				</form>

				<DialogFooter>
					{isEditing ? (
						<Button
							type="button"
							variant="destructive"
							className="mr-auto"
							onClick={handleDelete}
							disabled={!category.can_delete}
						>
							<Trash2Icon /> Delete
						</Button>
					) : null}
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="category-form">
						{isEditing ? "Save changes" : "Create category"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
