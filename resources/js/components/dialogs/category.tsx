import { Icon as IconifyIcon } from "@iconify/react"
import { router } from "@inertiajs/react"
import { useEffect, useState } from "react"
import ComboboxField from "@/components/form/combobox-field"
import SelectField from "@/components/form/select-field"
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
import { useApiFormErrors } from "@/hooks/use-api-form-errors"
import { useFetch } from "@/hooks/use-fetch"
import { treatmentLabel } from "@/lib/analytics"
import { cn, withMethod } from "@/lib/utils"
import { AnalyticsTreatment, Bucket, Category, CategoryWithChildren } from "@/types"
import {
	bucketIndexApiRoute,
	categoryDestroyApiRoute,
	categoryStoreApiRoute,
	categoryUpdateApiRoute,
} from "@/wayfinder/routes"

type CategoryFormValues = {
	name: string
	icon: string
	color: string
	parent_category_id: string
	analytics_treatment: AnalyticsTreatment | ""
	default_bucket_id: string
}

const NO_DEFAULT = "no_default"

function isChildCategory(category: Category | CategoryWithChildren | null) {
	return category?.parent_category_id !== null
}

const EMPTY_FORM_VALUES: CategoryFormValues = {
	name: "",
	icon: "",
	color: "",
	parent_category_id: "",
	analytics_treatment: "",
	default_bucket_id: "",
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
	category: Category | CategoryWithChildren | null
	categories: (Category | CategoryWithChildren)[]
	onOpenChange: (open: boolean) => void
}) {
	const isEditing = mode === "edit" && category !== null
	const buckets = useFetch<Bucket[]>(bucketIndexApiRoute.url(), [])
	const canEditParentCategory = !isEditing || isChildCategory(category)
	const [values, setValues] = useState<CategoryFormValues>(EMPTY_FORM_VALUES)
	const { getApiFieldErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()
	const parentOptions = categories.filter(option => option.id !== category?.id)
	const defaultBucketName = values.default_bucket_id
		? (buckets.find(bucket => bucket.id === values.default_bucket_id)?.name ??
			category?.default_bucket?.name ??
			"Default bucket")
		: "No default bucket"

	useEffect(() => {
		if (!open) {
			return
		}

		setValues(
			category
				? {
						name: category.name,
						icon: category.icon,
						color: category.color,
						parent_category_id: category.parent_category_id ?? "",
						analytics_treatment: category.analytics_treatment ?? "",
						default_bucket_id: category.default_bucket_id ?? "",
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
		formData.append("name", values.name)
		formData.append("icon", values.icon)
		formData.append("color", values.color)
		if (!isEditing || isChildCategory(category)) {
			formData.append("parent_category_id", values.parent_category_id)
		}
		formData.append("analytics_treatment", values.analytics_treatment)
		formData.append("default_bucket_id", values.default_bucket_id)

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
			<DialogContent className="md:max-w-lg">
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
							id="name"
							label="Name"
							value={values.name}
							errors={getApiFieldErrors("name")}
							onChange={value => setValue("name", value)}
						/>
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

					<Card size="sm" className="bg-muted/30 ring-0">
						<CardContent className="flex items-start gap-3 py-1">
							<Icon {...values} size={14} />
							<div className="grid min-w-0 gap-1">
								<p
									className={cn(
										"truncate font-medium",
										!values.name && "text-muted-foreground",
									)}
								>
									{values.name || "Category preview"}
								</p>
								<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
									<IconifyIcon icon="lucide:tag" className="size-3.5" />
									<span className="truncate">
										{`${values.analytics_treatment ? treatmentLabel(values.analytics_treatment) : "No default treatment"} · ${defaultBucketName}`}
									</span>
								</p>
							</div>
						</CardContent>
					</Card>

					<div className="grid gap-4 rounded-lg border p-4">
						<p className="text-sm font-semibold">Analytics defaults</p>
						<SelectField
							id="analytics_treatment"
							label="Treatment"
							value={values.analytics_treatment || NO_DEFAULT}
							items={[
								{ value: NO_DEFAULT, label: "No default treatment" },
								{ value: "income", label: "Income" },
								{ value: "spending", label: "Spending" },
								{ value: "saving_investment", label: "Saving/investment" },
								{ value: "neutral", label: "Transfer/neutral" },
								{ value: "automatic", label: "Automatic by direction" },
							]}
							errors={getApiFieldErrors("analytics_treatment")}
							onChange={value =>
								setValue(
									"analytics_treatment",
									value === NO_DEFAULT ? "" : (value as AnalyticsTreatment),
								)
							}
						/>
						<SelectField
							id="default_bucket_id"
							label="Spending bucket"
							value={values.default_bucket_id || NO_DEFAULT}
							items={[
								{ value: NO_DEFAULT, label: "No default bucket" },
								...buckets
									.filter(bucket => !bucket.archived)
									.map(bucket => ({ value: bucket.id, label: bucket.name })),
							]}
							errors={getApiFieldErrors("default_bucket_id")}
							onChange={value =>
								setValue("default_bucket_id", value === NO_DEFAULT ? "" : value)
							}
						/>
					</div>
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
							<IconifyIcon icon="lucide:trash-2" /> Delete
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
