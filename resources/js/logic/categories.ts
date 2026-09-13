// Mirrors `Api\CategoryController` (index/store/update/destroy).

import { db } from "@/data/db"
import { slug, ValidationError } from "@/logic/shared"
import type { AnalyticsTreatment } from "@/types"

const TREATMENTS = ["income", "spending", "saving_investment", "neutral", "automatic"] as const

export type CategoryInput = {
	name: string
	icon: string
	color: string
	parent_category_id?: string | null
	analytics_treatment?: string | null
	default_bucket_id?: string | null
}

function validate(input: CategoryInput, currentId?: string) {
	const errors: Record<string, string[]> = {}
	const name = input.name?.trim()
	if (!name) errors.name = ["The name field is required."]
	if (!input.icon?.trim()) errors.icon = ["The icon field is required."]
	if (!input.color?.trim()) errors.color = ["The color field is required."]
	if (
		input.parent_category_id &&
		currentId === undefined &&
		input.parent_category_id === slug(name ?? "")
	) {
		errors.parent_category_id = ["A category cannot be its own parent."]
	}
	if (
		input.analytics_treatment &&
		!TREATMENTS.includes(input.analytics_treatment as (typeof TREATMENTS)[number])
	) {
		errors.analytics_treatment = ["Invalid treatment."]
	}
	if (Object.keys(errors).length) throw new ValidationError(errors)
}

export async function listCategories() {
	const categories = await db.categories.toArray()
	const buckets = await db.buckets.toArray()
	const bucketById = new Map(buckets.map(b => [b.id, b]))
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
		default_bucket: category.default_bucket_id
			? (bucketById.get(category.default_bucket_id) ?? null)
			: null,
	}))
	const childrenByParent = new Map<string, typeof withMeta>()
	for (const category of withMeta) {
		if (!category.parent_category_id) continue
		const list = childrenByParent.get(category.parent_category_id) ?? []
		list.push(category)
		childrenByParent.set(category.parent_category_id, list)
	}
	return withMeta
		.filter(category => !category.parent_category_id)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map(category => ({
			...category,
			children: (childrenByParent.get(category.id) ?? []).sort((a, b) =>
				a.name.localeCompare(b.name),
			),
		}))
}

export async function createCategory(input: CategoryInput) {
	validate(input)
	const id = slug(input.name)
	if (await db.categories.get(id)) {
		throw new ValidationError({ name: ["A category with a similar name already exists."] })
	}
	if (input.parent_category_id) {
		const parent = await db.categories.get(input.parent_category_id)
		if (!parent || parent.parent_category_id) {
			throw new ValidationError({ parent_category_id: ["Invalid parent category."] })
		}
	}
	if (input.default_bucket_id && !(await db.buckets.get(input.default_bucket_id))) {
		throw new ValidationError({ default_bucket_id: ["Invalid bucket."] })
	}
	const row = {
		id,
		name: input.name.trim(),
		icon: input.icon.trim(),
		color: input.color.trim(),
		parent_category_id: input.parent_category_id ?? null,
		analytics_treatment: (input.analytics_treatment ?? null) as AnalyticsTreatment | null,
		default_bucket_id: input.default_bucket_id ?? null,
	}
	await db.categories.add(row)
	return row
}

export async function updateCategory(currentId: string, input: CategoryInput) {
	validate(input, currentId)
	const current = await db.categories.get(currentId)
	if (!current) throw new Error("Category not found.")
	const id = slug(input.name)
	if (id !== currentId && (await db.categories.get(id))) {
		throw new ValidationError({ name: ["A category with a similar name already exists."] })
	}
	if (input.parent_category_id === id || input.parent_category_id === currentId) {
		throw new ValidationError({ parent_category_id: ["A category cannot be its own parent."] })
	}
	// Top-level categories keep their position (mirrors Laravel guard).
	const parent_category_id =
		current.parent_category_id === null
			? current.parent_category_id
			: (input.parent_category_id ?? null)
	if (parent_category_id) {
		const parent = await db.categories.get(parent_category_id)
		if (!parent || parent.parent_category_id) {
			throw new ValidationError({ parent_category_id: ["Invalid parent category."] })
		}
		if (parent.id === id && id !== currentId) {
			throw new ValidationError({
				parent_category_id: ["A category cannot be its own parent."],
			})
		}
	}

	return db.transaction("rw", [db.categories, db.records], async () => {
		if (id !== currentId) {
			await db.categories.add({
				id,
				name: input.name.trim(),
				icon: input.icon.trim(),
				color: input.color.trim(),
				parent_category_id,
				analytics_treatment: (input.analytics_treatment ??
					null) as AnalyticsTreatment | null,
				default_bucket_id: input.default_bucket_id ?? null,
			})
			await db.categories
				.where("parent_category_id")
				.equals(currentId)
				.modify({ parent_category_id: id })
			await db.records.where("category_id").equals(currentId).modify({ category_id: id })
			await db.categories.delete(currentId)
			const renamed = await db.categories.get(id)
			if (!renamed) throw new Error("Category not found.")
			return renamed
		}
		await db.categories.update(currentId, {
			name: input.name.trim(),
			icon: input.icon.trim(),
			color: input.color.trim(),
			parent_category_id,
			analytics_treatment: (input.analytics_treatment ?? null) as AnalyticsTreatment | null,
			default_bucket_id: input.default_bucket_id ?? null,
		})
		const saved = await db.categories.get(currentId)
		if (!saved) throw new Error("Category not found.")
		return saved
	})
}

export async function deleteCategory(id: string) {
	const records = await db.records.where("category_id").equals(id).count()
	const children = await db.categories.where("parent_category_id").equals(id).count()
	if (records > 0 || children > 0) {
		throw new ValidationError({ category: ["This category is still in use."] })
	}
	await db.categories.delete(id)
}
