import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import ComboboxField from "@/components/form/combobox-field"
import SelectField from "@/components/form/select-field"
import TextField from "@/components/form/text-field"
import Icon, { ICON_NAMES, UiIcon as IconifyIcon } from "@/components/icon"
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
import { canUseDefaultMonthlyBudget, TREATMENTS, treatmentLabel } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { createCategory, deleteCategory, updateCategory } from "@/logic/categories"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import { ValidationError } from "@/logic/validate"
import type { AnalyticsTreatment, Category, CategoryWithChildren } from "@/types"

type CategoryFormValues = {
	name: string
	icon: string
	color: string
	parent_category_id: string
	analytics_treatment: AnalyticsTreatment
	default_monthly_budget_id: string
}

const NO_DEFAULT = "no_default"
const ICON_OPTION_LIMIT = 50

function iconLabel(icon: string) {
	return icon.replaceAll("-", " ")
}

function isChildCategory(category: Category | CategoryWithChildren | null) {
	return category?.parent_category_id !== null
}

const EMPTY_FORM_VALUES: CategoryFormValues = {
	name: "",
	icon: "",
	color: "",
	parent_category_id: "",
	analytics_treatment: "automatic",
	default_monthly_budget_id: "",
}

export default function CategoryDialog({
	isOpen,
	mode: modeProp,
	category: categoryProp,
	categories,
	setIsOpen,
}: {
	isOpen: boolean
	mode: "create" | "edit"
	category: Category | CategoryWithChildren | null
	categories: (Category | CategoryWithChildren)[]
	setIsOpen: (isOpen: boolean) => void
}) {
	// Parents clear mode/category the moment the dialog closes; keep the last open content
	// so the title and fields don't flip while the exit animation plays.
	const [snapshot, setSnapshot] = useState({ mode: modeProp, category: categoryProp })
	if (isOpen && (snapshot.mode !== modeProp || snapshot.category !== categoryProp)) {
		setSnapshot({ mode: modeProp, category: categoryProp })
	}
	const { mode, category } = isOpen ? { mode: modeProp, category: categoryProp } : snapshot
	const isEditing = mode === "edit" && category !== null
	const monthlyBudgets = useLiveQuery(() => listMonthlyBudgets(), [])
	const canEditParentCategory = !isEditing || isChildCategory(category)
	const [values, setValues] = useState<CategoryFormValues>(EMPTY_FORM_VALUES)
	const { getApiFieldErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()
	const parentOptions = categories.filter(option => option.id !== category?.id)
	const iconOptions =
		values.icon && !ICON_NAMES.includes(values.icon as (typeof ICON_NAMES)[number])
			? [values.icon, ...ICON_NAMES]
			: ICON_NAMES
	const monthlyBudgetEligible = canUseDefaultMonthlyBudget(values.analytics_treatment)
	const defaultMonthlyBudgetName = values.default_monthly_budget_id
		? (monthlyBudgets?.find(
				monthlyBudget => monthlyBudget.id === values.default_monthly_budget_id,
			)?.name ??
			category?.default_monthly_budget?.name ??
			"Default monthly budget")
		: "Unbudgeted"

	useEffect(() => {
		if (!isOpen) {
			return
		}

		setValues(
			category
				? {
						name: category.name,
						icon: category.icon,
						color: category.color,
						parent_category_id: category.parent_category_id ?? "",
						analytics_treatment: category.analytics_treatment,
						default_monthly_budget_id: category.default_monthly_budget_id ?? "",
					}
				: EMPTY_FORM_VALUES,
		)
		resetApiErrors()
	}, [isOpen, category, resetApiErrors])

	const setValue = <TKey extends keyof CategoryFormValues>(
		field: TKey,
		value: CategoryFormValues[TKey],
	) => {
		setValues(current => ({ ...current, [field]: value }))
		clearApiError(field)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const input = {
			name: values.name,
			icon: values.icon,
			color: values.color,
			parent_category_id: values.parent_category_id || null,
			analytics_treatment: values.analytics_treatment,
			default_monthly_budget_id: values.default_monthly_budget_id || null,
		}
		try {
			if (isEditing && category) {
				await updateCategory(category.id, input)
			} else {
				await createCategory(input)
			}
			setIsOpen(false)
		} catch (cause) {
			if (cause instanceof ValidationError) {
				setApiErrors(cause.errors)
				return
			}
			toast.error("Unable to save this category.")
		}
	}

	const handleDelete = async () => {
		if (!category) {
			return
		}
		try {
			await deleteCategory(category.id)
			setIsOpen(false)
		} catch {
			toast.error("Unable to delete this category.")
		}
	}

	if (monthlyBudgets === undefined) return null

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
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
								label="Parent category"
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
						<ComboboxField
							id="icon"
							label="Icon"
							value={iconOptions.find(icon => icon === values.icon) ?? null}
							errors={getApiFieldErrors("icon")}
							placeholder="Search Lucide icons"
							emptyText="No icons found."
							limit={ICON_OPTION_LIMIT}
							items={iconOptions}
							getItemId={icon => icon}
							getItemString={iconLabel}
							renderItem={icon => (
								<div className="flex items-center gap-2 capitalize">
									<IconifyIcon icon={icon} />
									{iconLabel(icon)}
								</div>
							)}
							onChange={value => setValue("icon", value ?? "")}
						/>
						<TextField
							id="color"
							label="Colour"
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
										{`${treatmentLabel(values.analytics_treatment)}${monthlyBudgetEligible ? ` · ${defaultMonthlyBudgetName}` : ""}`}
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
							value={values.analytics_treatment}
							items={TREATMENTS}
							errors={getApiFieldErrors("analytics_treatment")}
							onChange={value => {
								const treatment = value as AnalyticsTreatment
								setValue("analytics_treatment", treatment)
								if (!canUseDefaultMonthlyBudget(treatment)) {
									setValue("default_monthly_budget_id", "")
								}
							}}
						/>
						<SelectField
							id="default_monthly_budget_id"
							label="Monthly budget"
							disabled={!monthlyBudgetEligible}
							value={values.default_monthly_budget_id || NO_DEFAULT}
							items={[
								{ value: NO_DEFAULT, label: "Unbudgeted" },
								...monthlyBudgets
									.filter(monthlyBudget => !monthlyBudget.archived)
									.map(monthlyBudget => ({
										value: monthlyBudget.id,
										label: monthlyBudget.name,
									})),
							]}
							errors={getApiFieldErrors("default_monthly_budget_id")}
							onChange={value =>
								setValue(
									"default_monthly_budget_id",
									value === NO_DEFAULT ? "" : value,
								)
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
