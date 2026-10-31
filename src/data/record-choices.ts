import type { AnalyticsTreatment, MonthlyBudgetChoice, TreatmentChoice } from "@/types"

/** Shared by IndexedDB upgrades and legacy backup conversion. */
export function migrateRecordChoices(row: Record<string, unknown>, categoryExists: boolean) {
	const {
		analytics_treatment,
		analytics_treatment_source,
		monthly_budget_id,
		monthly_budget_source,
		...record
	} = row
	const treatment_choice: TreatmentChoice =
		analytics_treatment_source === "category"
			? { kind: "category" }
			: {
					kind: "explicit",
					value: (analytics_treatment ?? "automatic") as AnalyticsTreatment,
				}
	const monthly_budget_choice: MonthlyBudgetChoice =
		monthly_budget_source === "category"
			? { kind: "category" }
			: monthly_budget_id
				? { kind: "explicit", id: String(monthly_budget_id) }
				: monthly_budget_source === "manual" || !categoryExists
					? { kind: "unbudgeted" }
					: { kind: "category" }
	return {
		...record,
		treatment_choice: record.treatment_choice ?? treatment_choice,
		monthly_budget_choice: record.monthly_budget_choice ?? monthly_budget_choice,
	}
}
