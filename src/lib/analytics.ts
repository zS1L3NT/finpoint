import type { AnalyticsTreatment } from "@/types"

export function canUseDefaultBucket(treatment: AnalyticsTreatment | null | undefined) {
	return treatment === "spending" || treatment === "automatic" || treatment == null
}

export function treatmentLabel(treatment: AnalyticsTreatment | null | undefined) {
	return {
		income: "Income",
		spending: "Spending",
		saving_investment: "Saving/investment",
		neutral: "Transfer/neutral",
		automatic: "Automatic by direction",
	}[treatment ?? "automatic"]
}
