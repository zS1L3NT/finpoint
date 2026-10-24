// Starter data for fresh workspaces, plus a one-time repair for workspaces
// where the original seed skipped both lists after finding either one populated.

import { db } from "@/data/db"
import { DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS } from "@/data/defaults"
import { exportData, tableCounts } from "@/data/export-import"
import { hashSnapshot } from "@/data/snapshot-hash"
import { slugify } from "@/logic/shared"

// Hash of the starter rows as first seeded into an empty workspace. Drive sync
// treats a workspace still matching it as untouched, so it never overrides a
// Drive copy. Migrations that rewrite starter rows leave it stale, which only
// falls back to counting the workspace as changed.
export const SEED_HASH_KEY = "seed_hash"

export async function seedIfEmpty(): Promise<void> {
	const fresh =
		!(await db.meta.get("seeded_v2")) &&
		Object.values(await tableCounts()).every(count => count === 0)

	// The marker makes repair one-time, so users can later remove all starter
	// categories or monthlyBudgets without having them recreated on every visit.
	await db.transaction("rw", [db.meta, db.monthly_budgets, db.categories], async () => {
		if (await db.meta.get("seeded_v2")) return

		const existingMonthlyBudgets = await db.monthly_budgets.toArray()
		const monthlyBudgetsByName = new Map(
			existingMonthlyBudgets.map(monthly_budget => [monthly_budget.name, monthly_budget.id]),
		)
		const legacyHoliday = existingMonthlyBudgets.find(
			monthly_budget =>
				monthly_budget.name === "Holiday" &&
				monthly_budget.color === "#fb7185" &&
				monthly_budget.group === "outlier" &&
				monthly_budget.pace_kind === "none" &&
				monthly_budget.display_order === 40,
		)
		if (!monthlyBudgetsByName.has("Travel") && legacyHoliday) {
			await db.monthly_budgets.update(legacyHoliday.id, { name: "Travel" })
			monthlyBudgetsByName.set("Travel", legacyHoliday.id)
		}
		for (const monthly_budget of DEFAULT_MONTHLY_BUDGETS) {
			if (monthlyBudgetsByName.has(monthly_budget.name)) continue
			const id = crypto.randomUUID()
			await db.monthly_budgets.add({ id, ...monthly_budget, archived: false })
			monthlyBudgetsByName.set(monthly_budget.name, id)
		}

		if ((await db.categories.count()) === 0) {
			for (const category of DEFAULT_CATEGORIES) {
				await db.categories.add({
					id: slugify(category.name),
					name: category.name,
					icon: category.icon,
					color: category.color,
					parent_category_id: null,
					analytics_treatment: category.treatment,
					default_monthly_budget_id: category.monthly_budget
						? (monthlyBudgetsByName.get(category.monthly_budget) ?? null)
						: null,
				})
			}
		}

		await db.meta.put({ key: "seeded_v2", value: "1" })
	})

	if (fresh) {
		await db.meta.put({ key: SEED_HASH_KEY, value: await hashSnapshot(await exportData()) })
	}
}
