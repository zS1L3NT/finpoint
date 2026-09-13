// Shared category-expansion helper (records + monthly pages need it).

import { db } from "@/data/db"

export async function expandCategoryIdsForMonthly(ids: string[]): Promise<string[]> {
	if (!ids.length) return ids
	const categories = await db.categories.toArray()
	const childrenByParent = new Map<string, string[]>()
	for (const category of categories) {
		if (category.parent_category_id) {
			const list = childrenByParent.get(category.parent_category_id) ?? []
			list.push(category.id)
			childrenByParent.set(category.parent_category_id, list)
		}
	}
	const expanded = new Set(ids)
	for (const id of ids) {
		for (const child of childrenByParent.get(id) ?? []) expanded.add(child)
	}
	return [...expanded]
}
