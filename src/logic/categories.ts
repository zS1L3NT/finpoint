// Mirrors `Api\CategoryController` (index/store/update/destroy).

import { db } from "@/data/db"
import { TREATMENT_VALUES } from "@/logic/shared"
import { ValidationError, Validator } from "@/logic/validate"
import type { CategoryWithChildren } from "@/types"

export type CategoryInput = {
	name: string
	icon: string
	color: string
	parent_category_id?: string | null
	analytics_treatment?: string | null
	default_monthly_budget_id?: string | null
}

function cleanInput(input: CategoryInput) {
	const v = new Validator()
	const dto = {
		name: v.text(input.name, "name"),
		icon: v.text(input.icon, "icon"),
		color: v.text(input.color, "color"),
		parent_category_id: input.parent_category_id ?? null,
		analytics_treatment:
			v.oneOf(
				input.analytics_treatment || "automatic",
				"analytics_treatment",
				TREATMENT_VALUES,
				"Invalid treatment.",
			) ?? "automatic",
		default_monthly_budget_id: input.default_monthly_budget_id ?? null,
	}
	const id = v.slug(dto.name)
	v.throwIfInvalid()
	return { ...dto, id }
}

export async function listCategoryIconNames() {
	return [...new Set((await db.categories.toArray()).map(category => category.icon))]
}

export async function listCategories(): Promise<CategoryWithChildren[]> {
	const categories = await db.categories.toArray()
	const monthlyBudgets = await db.monthly_budgets.toArray()
	const monthlyBudgetById = new Map(monthlyBudgets.map(b => [b.id, b]))
	const counts = new Map<string, number>()
	await db.records.each(record => {
		counts.set(record.category_id, (counts.get(record.category_id) ?? 0) + 1)
	})
	const childCounts = new Map<string, number>()
	for (const category of categories) {
		if (category.parent_category_id) {
			childCounts.set(
				category.parent_category_id,
				(childCounts.get(category.parent_category_id) ?? 0) + 1,
			)
		}
	}
	const withMeta = categories.map(category => ({
		...category,
		records_count: counts.get(category.id) ?? 0,
		children_count: childCounts.get(category.id) ?? 0,
		can_delete:
			(counts.get(category.id) ?? 0) === 0 && (childCounts.get(category.id) ?? 0) === 0,
		default_monthly_budget: category.default_monthly_budget_id
			? (monthlyBudgetById.get(category.default_monthly_budget_id) ?? null)
			: null,
	}))
	const childrenByParent = new Map<string, typeof withMeta>()
	for (const category of withMeta) {
		if (!category.parent_category_id) continue
		const list = childrenByParent.get(category.parent_category_id) ?? []
		list.push(category)
		childrenByParent.set(category.parent_category_id, list)
	}
	const tree = withMeta
		.filter(category => !category.parent_category_id)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map(category => ({
			...category,
			children: (childrenByParent.get(category.id) ?? []).sort((a, b) =>
				a.name.localeCompare(b.name),
			),
		}))

	return tree
}

export async function createCategory(input: CategoryInput) {
	const { id, ...dto } = cleanInput(input)
	if (dto.parent_category_id === id) {
		throw new ValidationError({ parent_category_id: ["A category cannot be its own parent."] })
	}

	return db.transaction("rw", [db.categories, db.monthly_budgets], async () => {
		if (await db.categories.get(id)) {
			throw new ValidationError({ name: ["A category with a similar name already exists."] })
		}
		await checkReferences(dto.parent_category_id, dto.default_monthly_budget_id)
		const row = { id, ...dto }
		await db.categories.add(row)

		return row
	})
}

export async function updateCategory(currentId: string, input: CategoryInput) {
	const { id, ...dto } = cleanInput(input)
	if (dto.parent_category_id === id || dto.parent_category_id === currentId) {
		throw new ValidationError({ parent_category_id: ["A category cannot be its own parent."] })
	}

	return db.transaction("rw", [db.categories, db.records, db.monthly_budgets], async () => {
		const current = await db.categories.get(currentId)
		if (!current) throw new Error("Category not found.")
		if (id !== currentId && (await db.categories.get(id))) {
			throw new ValidationError({ name: ["A category with a similar name already exists."] })
		}
		// Top-level categories keep their position.
		const parent_category_id =
			current.parent_category_id === null ? null : dto.parent_category_id
		await checkReferences(parent_category_id, dto.default_monthly_budget_id)

		if (id !== currentId) {
			await db.categories.add({ id, ...dto, parent_category_id })
			await db.categories
				.where("parent_category_id")
				.equals(currentId)
				.modify({ parent_category_id: id })
			await db.records.where("category_id").equals(currentId).modify({ category_id: id })
			await db.categories.delete(currentId)
		} else await db.categories.update(currentId, { ...dto, parent_category_id })
		const saved = await db.categories.get(id)
		if (!saved) throw new Error("Category not found.")

		return saved
	})
}

/** Runs inside the write's transaction, so what it checks cannot change before the write. */
async function checkReferences(parentId: string | null, monthlyBudgetId: string | null) {
	if (parentId) {
		const parent = await db.categories.get(parentId)
		if (!parent || parent.parent_category_id) {
			throw new ValidationError({ parent_category_id: ["Invalid parent category."] })
		}
	}
	if (monthlyBudgetId && !(await db.monthly_budgets.get(monthlyBudgetId))) {
		throw new ValidationError({ default_monthly_budget_id: ["Monthly budget not found."] })
	}
}

export async function deleteCategory(id: string) {
	await db.transaction("rw", [db.categories, db.records], async () => {
		const records = await db.records.where("category_id").equals(id).count()
		const children = await db.categories.where("parent_category_id").equals(id).count()
		if (records > 0 || children > 0) {
			throw new ValidationError({ category: ["This category is still in use."] })
		}

		await db.categories.delete(id)
	})
}
