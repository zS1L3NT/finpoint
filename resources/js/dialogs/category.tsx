import { router } from "@inertiajs/react"
import { Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import ComboboxField from "@/components/form/combobox-field"
import TextField from "@/components/form/text-field"
import Icon from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
	categoryDestroyApiRoute,
	categoryStoreApiRoute,
	categoryUpdateApiRoute,
} from "@/wayfinder/routes"

type CategoryNode = Category & {
	children?: CategoryNode[] | null
	can_delete: boolean
}

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

export default function CategoryDialog({
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
			isEditing ? categoryUpdateApiRoute.url({ category }) : categoryStoreApiRoute.url(),
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

		const response = await fetch(categoryDestroyApiRoute.url({ category }), {
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
							<Icon {...values} size={14} />
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
