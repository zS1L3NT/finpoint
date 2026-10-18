export type Appearance = "light" | "dark" | "system"

export type Paginated<T> = {
	data: T[]
	total: number
	per_page: number
	current_page: number
	last_page?: number
}

export type Account = {
	id: string
	name: string
	balance: number
	bank: string
	statements_count?: number
}

export type Statement = {
	id: string
	datetime: string
	index: number
	description: string
	amount: number
	allocable_amount: number
	allocation_count: number
	is_pending: boolean
	is_unallocated: boolean
	account: Account
}

export type PendingReplacementStatement = Statement & {
	suggestion_count: number
}

export type StatementReplacementCandidate = Statement & {
	amount_difference: number
	day_difference: number
	is_exact_amount: boolean
	allocated_amount: number
	remaining_allocable_amount: number
	can_replace: boolean
	disabled_reason: string | null
}

export type Record = {
	id: string
	datetime: string
	title: string
	subtitle: string | null
	people: string | null
	location: string | null
	description: string | null
	amount: number
	allocated_amount: number
	is_pending: boolean
	/** Allocated statements that are still Pending Statements. */
	pending_statement_count?: number
	category: Category
	analytics_treatment: AnalyticsTreatment
	analytics_treatment_source: "category" | "manual"
	revision: number
	monthly_budget_id: string | null
	monthly_budget_source: "category" | "manual" | null
	monthly_budget?: MonthlyBudget | null
}

export type AnalyticsTreatment =
	| "income"
	| "spending"
	| "saving_investment"
	| "neutral"
	| "automatic"

export type Category = {
	id: string
	name: string
	icon: string
	color: string
	parent_category_id: string | null
	can_delete: boolean
	records_count: number
	analytics_treatment: AnalyticsTreatment | null
	default_monthly_budget_id: string | null
	default_monthly_budget?: MonthlyBudget | null
}

export type CategoryWithChildren = Category & {
	children: Category[]
}

export type Allocation = {
	amount: number
}

export type Budget = {
	id: string
	name: string
	amount: number
	used_amount: number
	start_date: string
	end_date: string
	automatic: boolean
}

export type MonthlyBudget = {
	id: string
	name: string
	color: string
	group: "core" | "outlier" | "other"
	pace_kind: "daily" | "recurring" | "none"
	display_order: number
	archived: boolean
	amount?: number | null
}

export type AnalyticsSummary = {
	income: number
	spending: number
	gross_spending: number
	refunds: number
	contributions: number
	withdrawals: number
	surplus: number
	surplus_rate: number | null
	pending_income: number
	pending_spending: number
	pending_gross_spending: number
	pending_refunds: number
	pending_count: number
	unbudgeted_count: number
	daily: Array<{
		date: string
		income: number
		spending: number
		contributions: number
		withdrawals: number
		net: number
		records: number
	}>
	categories: Array<{
		id: string
		name: string
		icon: string
		color: string
		spending: number
		outflow: number
		refunds: number
		records: number
		monthly_budget_spending: { [monthlyBudgetId: string]: number }
	}>
	monthlyBudgets: Array<MonthlyBudget & { spending: number; records: number }>
}

/** Rules only read the Statement description; text comparisons ignore case. */
export type RuleCondition = {
	operator: "contains" | "equals" | "regex"
	value: string
}
export type RuleMode = "suggest" | "autofill"
export type RuleActions = {
	title?: { mode: RuleMode; value: string }
	people?: { mode: RuleMode; value: string }
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
	conditions: { mode: "all" | "any"; items: RuleCondition[] }
	actions: RuleActions
	created_at: string
	updated_at: string
}
