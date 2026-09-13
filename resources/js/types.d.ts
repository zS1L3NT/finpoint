export type Appearance = "light" | "dark" | "system"

export type SharedPageProps = {
	appearance: Appearance
	sidebarOpen: boolean
}

export type PaginatedLink = {
	active: boolean
	label: string
	url: string | null
}

export type Paginated<T> = {
	data: T[]
	links: PaginatedLink[]
	total: number
	per_page: number
	current_page: number
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

export type StatementReplacementReview = {
	pending_statement: Statement
	statement: Statement
	allocations: Array<Record & { allocation_amount: number }>
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
	category: Category
	analytics_treatment: AnalyticsTreatment
	analytics_treatment_source: "category" | "manual"
	revision: number
	bucket_id: string | null
	bucket_source: "category" | "manual" | null
	bucket?: Bucket | null
}

export type AnalyticsTreatment =
	| "income"
	| "spending"
	| "saving_investment"
	| "neutral"
	| "automatic"

export type RecordCompletions = {
	titles: string[]
	locations: string[]
	peoples: string[]
}

export type Category = {
	id: string
	name: string
	icon: string
	color: string
	parent_category_id: string | null
	can_delete: boolean
	records_count: number
	analytics_treatment: AnalyticsTreatment | null
	default_bucket_id: string | null
	default_bucket?: Bucket | null
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

export type Bucket = {
	id: string
	name: string
	color: string
	group: "core" | "outlier" | "other"
	pace_kind: "daily" | "recurring" | "none"
	display_order: number
	archived: boolean
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
	unbucketed_count: number
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
		records: number
		bucket_spending: { [bucketId: string]: number }
	}>
	buckets: Array<Bucket & { spending: number; records: number }>
}
