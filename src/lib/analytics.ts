import { AnalyticsTreatment } from "@/types"

export function treatmentLabel(treatment: AnalyticsTreatment | null | undefined) {
	return {
		income: "Income",
		spending: "Spending",
		saving_investment: "Saving/investment",
		neutral: "Transfer/neutral",
		automatic: "Automatic by direction",
	}[treatment ?? "automatic"]
}
