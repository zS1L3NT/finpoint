import type { AnalyticsTreatment } from "@/types"

export type RuleCondition = {
	field: "description" | "amount" | "date" | "is_pending"
	operator: "contains" | "not_contains" | "equals" | "starts_with" | "gte" | "lte"
	value: string
}
export type RuleMode = "suggest" | "autofill"
export type RuleActions = {
	title?: { mode: RuleMode; value: string }
	location?: { mode: RuleMode; value: string }
	category_id?: { mode: RuleMode; value: string }
	analytics_treatment?: { mode: RuleMode; value: AnalyticsTreatment }
	monthly_budget_id?: { mode: RuleMode; value: string | null }
}
export type RuleField = keyof RuleActions
export type StatementRule = {
	id: string
	name: string
	enabled: boolean
	priority: number
	account_ids: string[]
	conditions: { mode: "all" | "any"; items: RuleCondition[] }
	actions: RuleActions
	created_at: string
	updated_at: string
}
export type RuleRun = {
	rule_id: string
	known_statement_ids: string[]
	matched_statement_ids: string[]
	ran_at: string | null
}
export type RuleDataset = "existing" | "new" | "both"
