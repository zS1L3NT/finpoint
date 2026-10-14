import type { AnalyticsTreatment } from "@/types"

export function canUseDefaultMonthlyBudget(treatment: AnalyticsTreatment | null | undefined) {
	return treatment === "spending" || treatment === "automatic" || treatment == null
}

export function canUseMonthlyBudget(treatment: AnalyticsTreatment, amount: number) {
	return treatment === "spending" || (treatment === "automatic" && amount < 0)
}

/** The one set of treatment names every form, filter, and list shows. */
export const TREATMENTS: { value: AnalyticsTreatment; label: string }[] = [
	{ value: "income", label: "Income" },
	{ value: "spending", label: "Spending" },
	{ value: "saving_investment", label: "Saving / investment" },
	{ value: "neutral", label: "Transfer / excluded" },
	{ value: "automatic", label: "Automatic by direction" },
]

export function treatmentLabel(treatment: AnalyticsTreatment | null | undefined) {
	return TREATMENTS.find(item => item.value === (treatment ?? "automatic"))?.label ?? ""
}
