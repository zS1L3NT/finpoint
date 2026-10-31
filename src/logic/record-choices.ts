import type { CategoryRow, RecordRow } from "@/data/db"
import { canUseDefaultMonthlyBudget, canUseMonthlyBudget } from "@/lib/analytics"

/** Resolved fields are read models only; choices remain the sole persisted truth. */
export function resolveRecordChoices(row: RecordRow, category?: CategoryRow) {
	const analytics_treatment =
		row.treatment_choice.kind === "explicit"
			? row.treatment_choice.value
			: (category?.analytics_treatment ?? "automatic")
	const monthly_budget_id = canUseMonthlyBudget(analytics_treatment, row.amount)
		? row.monthly_budget_choice.kind === "explicit"
			? row.monthly_budget_choice.id
			: row.monthly_budget_choice.kind === "category" &&
					canUseDefaultMonthlyBudget(category?.analytics_treatment)
				? (category?.default_monthly_budget_id ?? null)
				: null
		: null
	return {
		...row,
		analytics_treatment,
		analytics_treatment_source:
			row.treatment_choice.kind === "explicit" ? ("manual" as const) : ("category" as const),
		monthly_budget_id,
		monthly_budget_source:
			row.monthly_budget_choice.kind === "category"
				? ("category" as const)
				: ("manual" as const),
	}
}
