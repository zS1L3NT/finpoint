// Deterministic typed workspace datasets for Playwright UI regression suites.
//
// Runtime-dependency-free: only type-only imports from the app. The seeder in
// `./fixtures` writes these rows through raw IndexedDB in the browser, so this
// module must never gain production runtime imports (no `@/data/*` values,
// no luxon, no Dexie). Months are fixed strings (2026-08/09/10) so scenarios
// stay deterministic regardless of the wall clock.

import type {
	AccountRow,
	AllocationRow,
	AnalyticsMonthRow,
	BudgetRecordRow,
	BudgetRow,
	CategoryRow,
	DuplicateDismissalRow,
	MonthlyBudgetAmountRow,
	MonthlyBudgetDefaultRow,
	MonthlyBudgetRow,
	RecordRow,
	StatementRow,
} from "@/data/db"
import type { StatementRule } from "@/types"

export type ScenarioName = "empty" | "populated" | "dense"
export const SCENARIO_NAMES: ScenarioName[] = ["empty", "populated", "dense"]

export type WorkspaceSettings = {
	default_filter_start_date: string | null
	default_filter_end_date_today: boolean
}

export type WorkspaceTables = {
	accounts: AccountRow[]
	statements: StatementRow[]
	duplicate_dismissals: DuplicateDismissalRow[]
	categories: CategoryRow[]
	records: RecordRow[]
	allocations: AllocationRow[]
	budgets: BudgetRow[]
	budget_records: BudgetRecordRow[]
	monthly_budgets: MonthlyBudgetRow[]
	monthly_budget_defaults: MonthlyBudgetDefaultRow[]
	monthly_budget_amounts: MonthlyBudgetAmountRow[]
	analytics_months: AnalyticsMonthRow[]
	statement_rules: StatementRule[]
}

export type WorkspaceDataset = {
	settings: WorkspaceSettings
	tables: WorkspaceTables
}

const PRIOR_MONTH = "2026-09-01"
const EXCLUDED_MONTH = "2026-08-01"
const CURRENT_MONTH = "2026-10-01"

function emptyTables(): WorkspaceTables {
	return {
		accounts: [],
		statements: [],
		duplicate_dismissals: [],
		categories: [],
		records: [],
		allocations: [],
		budgets: [],
		budget_records: [],
		monthly_budgets: [],
		monthly_budget_defaults: [],
		monthly_budget_amounts: [],
		analytics_months: [],
		statement_rules: [],
	}
}

const DEFAULT_SETTINGS: WorkspaceSettings = {
	default_filter_start_date: null,
	default_filter_end_date_today: false,
}

function buildEmpty(): WorkspaceDataset {
	return { settings: { ...DEFAULT_SETTINGS }, tables: emptyTables() }
}

function buildPopulated(): WorkspaceDataset {
	const tables = emptyTables()
	tables.accounts.push(
		{ id: "t1-acc-dbs", name: "Everyday Savings", balance: 12480.55, bank: "DBS" },
		{ id: "t1-acc-uob", name: "One Card", balance: -842.2, bank: "UOB" },
		{ id: "t1-acc-revolut", name: "Vault", balance: 2310, bank: "Revolut" },
	)
	tables.monthly_budgets.push(
		{
			id: "t1-mb-daily",
			name: "Daily",
			color: "#38bdf8",
			group: "core",
			pace_kind: "daily",
			display_order: 10,
			archived: false,
		},
		{
			id: "t1-mb-recurring",
			name: "Recurring",
			color: "#a78bfa",
			group: "core",
			pace_kind: "recurring",
			display_order: 20,
			archived: false,
		},
		{
			id: "t1-mb-travel",
			name: "Travel",
			color: "#fb7185",
			group: "outlier",
			pace_kind: "none",
			display_order: 40,
			archived: true,
		},
	)
	tables.categories.push(
		{
			id: "t1-cat-groceries",
			name: "Groceries",
			icon: "apple",
			color: "#EF6C00",
			parent_category_id: null,
			analytics_treatment: "spending",
			default_monthly_budget_id: "t1-mb-daily",
		},
		{
			id: "t1-cat-dining",
			name: "Dining Out",
			icon: "utensils",
			color: "#F44336",
			parent_category_id: null,
			analytics_treatment: "spending",
			default_monthly_budget_id: "t1-mb-daily",
		},
		{
			id: "t1-cat-dessert",
			name: "Dessert",
			icon: "party-popper",
			color: "#EC407A",
			parent_category_id: "t1-cat-dining",
			analytics_treatment: "spending",
			default_monthly_budget_id: null,
		},
		{
			id: "t1-cat-rent",
			name: "Housing",
			icon: "house",
			color: "#5C6BC0",
			parent_category_id: null,
			analytics_treatment: "spending",
			default_monthly_budget_id: "t1-mb-recurring",
		},
		{
			id: "t1-cat-shopping",
			name: "Shopping",
			icon: "shopping-bag",
			color: "#4FC3F7",
			parent_category_id: null,
			analytics_treatment: "spending",
			default_monthly_budget_id: null,
		},
		{
			id: "t1-cat-income",
			name: "Income",
			icon: "dollar-sign",
			color: "#01BFA5",
			parent_category_id: null,
			analytics_treatment: "income",
			default_monthly_budget_id: null,
		},
		{
			id: "t1-cat-saving",
			name: "Savings & Investments",
			icon: "chart-candlestick",
			color: "#26A69A",
			parent_category_id: null,
			analytics_treatment: "saving_investment",
			default_monthly_budget_id: null,
		},
		{
			id: "t1-cat-transfer",
			name: "Transfer",
			icon: "arrow-left-right",
			color: "#78909C",
			parent_category_id: null,
			analytics_treatment: "neutral",
			default_monthly_budget_id: null,
		},
		{
			id: "t1-cat-auto",
			name: "Auto Direction",
			icon: "navigation",
			color: "#AB47BD",
			parent_category_id: null,
			analytics_treatment: "automatic",
			default_monthly_budget_id: null,
		},
		{
			id: "t1-cat-null",
			name: "Untyped",
			icon: "circle-question-mark",
			color: "#9E9E9E",
			parent_category_id: null,
			analytics_treatment: "automatic",
			default_monthly_budget_id: null,
		},
	)
	tables.monthly_budget_defaults.push(
		{ monthly_budget_id: "t1-mb-daily", effective_month: EXCLUDED_MONTH, amount: 950 },
		{ monthly_budget_id: "t1-mb-recurring", effective_month: EXCLUDED_MONTH, amount: 1800 },
	)
	tables.monthly_budget_amounts.push(
		// Override one month: September looks at its own row, October looks back past it.
		{ monthly_budget_id: "t1-mb-daily", month: PRIOR_MONTH, amount: 1000 },
		// Explicit null: October has no comparison amount for Daily.
		{ monthly_budget_id: "t1-mb-daily", month: CURRENT_MONTH, amount: null },
		// Zero is a valid comparison amount.
		{ monthly_budget_id: "t1-mb-recurring", month: CURRENT_MONTH, amount: 0 },
		{ monthly_budget_id: "t1-mb-travel", month: PRIOR_MONTH, amount: 500 },
	)
	tables.records.push(
		{
			id: "t1-r-salary",
			title: "Monthly Salary",
			people: null,
			location: null,
			description: "Payroll credit",
			datetime: "2026-10-01 09:00",
			amount: 5200,
			category_id: "t1-cat-income",
			analytics_treatment: "income",
			analytics_treatment_source: "category",
			monthly_budget_id: null,
			monthly_budget_source: null,
			revision: 1,
		},
		{
			id: "t1-r-rent-prior",
			title: "Monthly Rent",
			people: null,
			location: null,
			description: "Housing payment",
			datetime: "2026-09-01 09:05",
			amount: -1400,
			category_id: "t1-cat-rent",
			analytics_treatment: "spending",
			analytics_treatment_source: "category",
			monthly_budget_id: "t1-mb-recurring",
			monthly_budget_source: "category",
			revision: 1,
		},
		{
			id: "t1-r-groceries",
			title: "FairPrice Run",
			people: null,
			location: "Bedok",
			description: null,
			datetime: "2026-10-05 18:24",
			amount: -84.2,
			category_id: "t1-cat-groceries",
			analytics_treatment: "spending",
			analytics_treatment_source: "category",
			monthly_budget_id: "t1-mb-daily",
			monthly_budget_source: "category",
			revision: 1,
		},
		{
			id: "t1-r-transfer",
			title: "Transfer to Vault",
			people: null,
			location: null,
			description: "Between own accounts",
			datetime: "2026-10-07 12:00",
			amount: -250,
			category_id: "t1-cat-transfer",
			analytics_treatment: "neutral",
			analytics_treatment_source: "category",
			monthly_budget_id: null,
			monthly_budget_source: null,
			revision: 1,
		},
		{
			id: "t1-r-saving",
			title: "StashAway Deposit",
			people: null,
			location: null,
			description: "Auto-invest",
			datetime: "2026-10-05 08:00",
			amount: -500,
			category_id: "t1-cat-saving",
			analytics_treatment: "saving_investment",
			analytics_treatment_source: "category",
			monthly_budget_id: null,
			monthly_budget_source: null,
			revision: 1,
		},
		{
			id: "t1-r-partial",
			title: "Hawker Dinner",
			people: "Jia Le",
			location: "Maxwell Food Centre",
			description: null,
			datetime: "2026-10-09 19:40",
			amount: -60,
			category_id: "t1-cat-dining",
			analytics_treatment: "spending",
			analytics_treatment_source: "category",
			monthly_budget_id: "t1-mb-daily",
			monthly_budget_source: "category",
			revision: 1,
		},
		{
			id: "t1-r-pending",
			title: "Pasar Malam",
			people: "Jia Le",
			location: "Bedok",
			description: null,
			datetime: "2026-10-11 20:15",
			amount: -14.5,
			category_id: "t1-cat-dining",
			analytics_treatment: "spending",
			analytics_treatment_source: "category",
			monthly_budget_id: "t1-mb-daily",
			monthly_budget_source: "category",
			revision: 1,
		},
		{
			id: "t1-r-zero",
			title: "Rounding Adjustment",
			people: null,
			location: null,
			description: null,
			datetime: "2026-10-06 10:00",
			amount: 0,
			category_id: "t1-cat-null",
			analytics_treatment: "spending",
			analytics_treatment_source: "manual",
			monthly_budget_id: null,
			monthly_budget_source: null,
			revision: 1,
		},
		{
			id: "t1-r-nulls",
			title: "Kopi Run",
			people: null,
			location: null,
			description: null,
			datetime: "2026-10-08 08:30",
			amount: -12.5,
			category_id: "t1-cat-null",
			analytics_treatment: "spending",
			analytics_treatment_source: "manual",
			monthly_budget_id: null,
			monthly_budget_source: null,
			revision: 1,
		},
		{
			id: "t1-r-unicode",
			title: "Kōpi ☕ 早餐 Gathering 🇸🇬 — مرحبا — naïve façade über alles · 寿司 · crème brûlée · pad thai phở bánh mì tacos 0123456789 ab",
			people: "Rong Xin",
			location: "Tampines Mall",
			description: "Long label stress case",
			datetime: "2026-10-10 13:20",
			amount: -33.33,
			category_id: "t1-cat-groceries",
			analytics_treatment: "spending",
			analytics_treatment_source: "category",
			monthly_budget_id: "t1-mb-daily",
			monthly_budget_source: "category",
			revision: 1,
		},
		{
			id: "t1-r-split",
			title: "Uniqlo Basics",
			people: null,
			location: "Orchard",
			description: null,
			datetime: "2026-10-12 15:05",
			amount: -100,
			category_id: "t1-cat-shopping",
			analytics_treatment: "spending",
			analytics_treatment_source: "category",
			monthly_budget_id: null,
			monthly_budget_source: null,
			revision: 1,
		},
		{
			id: "t1-r-refund",
			title: "Returned Kettle",
			people: null,
			location: null,
			description: "Refund to card",
			datetime: "2026-10-04 11:10",
			amount: 20,
			category_id: "t1-cat-shopping",
			analytics_treatment: "spending",
			analytics_treatment_source: "category",
			monthly_budget_id: null,
			monthly_budget_source: null,
			revision: 1,
		},
		{
			id: "t1-r-excluded",
			title: "August Top-up",
			people: null,
			location: null,
			description: null,
			datetime: "2026-08-15 09:33",
			amount: -45,
			category_id: "t1-cat-groceries",
			analytics_treatment: "spending",
			analytics_treatment_source: "category",
			monthly_budget_id: "t1-mb-daily",
			monthly_budget_source: "category",
			revision: 1,
		},
		{
			id: "t1-r-auto-neg",
			title: "MRT Fare",
			people: null,
			location: null,
			description: null,
			datetime: "2026-10-03 08:12",
			amount: -2.1,
			category_id: "t1-cat-auto",
			analytics_treatment: "automatic",
			analytics_treatment_source: "category",
			monthly_budget_id: null,
			monthly_budget_source: null,
			revision: 1,
		},
		{
			id: "t1-r-auto-pos",
			title: "Cashback",
			people: null,
			location: null,
			description: null,
			datetime: "2026-10-03 08:13",
			amount: 3.5,
			category_id: "t1-cat-auto",
			analytics_treatment: "automatic",
			analytics_treatment_source: "category",
			monthly_budget_id: null,
			monthly_budget_source: null,
			revision: 1,
		},
	)
	tables.statements.push(
		{
			id: "t1-s-salary",
			account_id: "t1-acc-dbs",
			datetime: "2026-10-01 09:02",
			description: "Monthly Salary · FAST Transfer 5123",
			amount: 5200,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-rent",
			account_id: "t1-acc-dbs",
			datetime: "2026-09-01 09:07",
			description: "Monthly Rent · PayNow Transfer 2201",
			amount: -1400,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-groceries",
			account_id: "t1-acc-dbs",
			datetime: "2026-10-05 18:26",
			description: "FairPrice Run · SGD 4412",
			amount: -84.2,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-transfer",
			account_id: "t1-acc-dbs",
			datetime: "2026-10-07 12:05",
			description: "Transfer to Vault · FAST 7788",
			amount: -250,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-partial",
			account_id: "t1-acc-uob",
			datetime: "2026-10-09 19:45",
			description: "Hawker Dinner · UOB ONE 3344",
			amount: -25,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-pending",
			account_id: "t1-acc-dbs",
			datetime: "2026-10-11 20:20",
			description: "Pasar malam snacks",
			amount: -14.5,
			index: 1,
			is_pending: 1,
		},
		{
			id: "t1-s-nulls",
			account_id: "t1-acc-dbs",
			datetime: "2026-10-08 08:35",
			description: "Kopi Uncle · SGD 1092",
			amount: -12.5,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-unicode",
			account_id: "t1-acc-revolut",
			datetime: "2026-10-10 13:25",
			description: "Kōpi Gathering · Revolut 5566",
			amount: -33.33,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-split-a",
			account_id: "t1-acc-uob",
			datetime: "2026-10-12 15:06",
			description: "Uniqlo Basics · Contactless 1001",
			amount: -60,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-split-b",
			account_id: "t1-acc-uob",
			datetime: "2026-10-12 15:09",
			description: "Uniqlo Basics · Contactless 1002",
			amount: -40,
			index: 2,
			is_pending: 0,
		},
		{
			id: "t1-s-refund",
			account_id: "t1-acc-uob",
			datetime: "2026-10-04 11:12",
			description: "Returned Kettle · Refund 9090",
			amount: 20,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-excluded",
			account_id: "t1-acc-dbs",
			datetime: "2026-08-15 09:36",
			description: "August Top-up · SGD 3131",
			amount: -45,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-auto-neg",
			account_id: "t1-acc-dbs",
			datetime: "2026-10-03 08:14",
			description: "MRT Fare · SimplyGo 2210",
			amount: -2.1,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-auto-pos",
			account_id: "t1-acc-dbs",
			datetime: "2026-10-03 08:15",
			description: "Cashback · SGD 2211",
			amount: 3.5,
			index: 2,
			is_pending: 0,
		},
		{
			id: "t1-s-dup-a",
			account_id: "t1-acc-revolut",
			datetime: "2026-10-06 09:14",
			description: "DON DON DONKI PURCHASE 8821",
			amount: -28.9,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-dup-b",
			account_id: "t1-acc-revolut",
			datetime: "2026-10-06 09:14",
			description: "DON DON DONKI 8821 PURCHASE",
			amount: -28.9,
			index: 2,
			is_pending: 0,
		},
		{
			id: "t1-s-sep-a",
			account_id: "t1-acc-revolut",
			datetime: "2026-10-13 10:00",
			description: "GRAB RIDE 7712",
			amount: -18,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-sep-b",
			account_id: "t1-acc-revolut",
			datetime: "2026-10-13 10:00",
			description: "GRAB RIDE 7713",
			amount: -18,
			index: 2,
			is_pending: 0,
		},
		{
			id: "t1-s-free-1",
			account_id: "t1-acc-uob",
			datetime: "2026-10-02 12:00",
			description: "STARBUCKS 4455",
			amount: -6.8,
			index: 1,
			is_pending: 0,
		},
		{
			id: "t1-s-free-2",
			account_id: "t1-acc-dbs",
			datetime: "2026-10-13 18:00",
			description: "SHENG SIONG 9902",
			amount: -52.4,
			index: 1,
			is_pending: 0,
		},
	)
	tables.allocations.push(
		{ statement_id: "t1-s-salary", record_id: "t1-r-salary", amount: 5200 },
		{ statement_id: "t1-s-rent", record_id: "t1-r-rent-prior", amount: -1400 },
		{ statement_id: "t1-s-groceries", record_id: "t1-r-groceries", amount: -84.2 },
		{ statement_id: "t1-s-transfer", record_id: "t1-r-transfer", amount: -250 },
		{ statement_id: "t1-s-partial", record_id: "t1-r-partial", amount: -25 },
		{ statement_id: "t1-s-pending", record_id: "t1-r-pending", amount: -14.5 },
		{ statement_id: "t1-s-nulls", record_id: "t1-r-nulls", amount: -12.5 },
		{ statement_id: "t1-s-unicode", record_id: "t1-r-unicode", amount: -33.33 },
		{ statement_id: "t1-s-split-a", record_id: "t1-r-split", amount: -60 },
		{ statement_id: "t1-s-split-b", record_id: "t1-r-split", amount: -40 },
		{ statement_id: "t1-s-refund", record_id: "t1-r-refund", amount: 20 },
		{ statement_id: "t1-s-excluded", record_id: "t1-r-excluded", amount: -45 },
		{ statement_id: "t1-s-auto-neg", record_id: "t1-r-auto-neg", amount: -2.1 },
		{ statement_id: "t1-s-auto-pos", record_id: "t1-r-auto-pos", amount: 3.5 },
	)
	tables.duplicate_dismissals.push({
		statement_id: "t1-s-sep-a",
		other_statement_id: "t1-s-sep-b",
	})
	tables.budgets.push(
		{
			id: "t1-b-manual",
			name: "October Buffer",
			amount: 500,
			start_date: "2026-10-01",
			end_date: "2026-10-31",
			automatic: false,
		},
		{
			id: "t1-b-auto",
			name: "October Daily",
			amount: 900,
			start_date: "2026-10-01",
			end_date: "2026-10-31",
			automatic: true,
		},
	)
	tables.budget_records.push(
		{ budget_id: "t1-b-manual", record_id: "t1-r-groceries" },
		{ budget_id: "t1-b-manual", record_id: "t1-r-unicode" },
		{ budget_id: "t1-b-auto", record_id: "t1-r-groceries" },
		{ budget_id: "t1-b-auto", record_id: "t1-r-partial" },
		{ budget_id: "t1-b-auto", record_id: "t1-r-pending" },
	)
	tables.analytics_months.push(
		{
			month: PRIOR_MONTH,
			coverage: "complete",
			covered_through: "2026-09-30",
			excluded_from_comparisons: false,
		},
		{
			month: EXCLUDED_MONTH,
			coverage: "complete",
			covered_through: "2026-08-31",
			excluded_from_comparisons: true,
		},
	)
	return {
		settings: { default_filter_start_date: "2026-10-01", default_filter_end_date_today: false },
		tables,
	}
}

function pad2(n: number): string {
	return String(n).padStart(2, "0")
}

function round2(n: number): number {
	return Math.round(n * 100) / 100
}

function cycle<T>(items: T[], i: number): T {
	const item = items[i % items.length]
	if (item === undefined) throw new Error("Empty dense pool.")
	return item
}

function buildDense(): WorkspaceDataset {
	const tables = emptyTables()
	const banks = ["DBS", "UOB", "Revolut", "OCBC"]
	for (let i = 1; i <= 32; i++) {
		tables.accounts.push({
			id: `t1-d-acc-${pad2(i)}`,
			name: `Dense Account ${i}`,
			balance: round2(i * 123.45 - 500),
			bank: cycle(banks, i - 1),
		})
	}
	const treatments = ["spending", "income", "saving_investment", "neutral", "automatic"] as const
	for (let i = 1; i <= 40; i++) {
		tables.categories.push({
			id: `t1-d-cat-${pad2(i)}`,
			name: `Dense Category ${i}`,
			icon: "circle-question-mark",
			color: "#9E9E9E",
			parent_category_id: i % 8 === 0 ? "t1-d-cat-01" : null,
			analytics_treatment: i % 13 === 0 ? "automatic" : cycle([...treatments], i - 1),
			default_monthly_budget_id: i % 5 === 0 ? "t1-d-mb-daily" : null,
		})
	}
	const monthlyBudgets: MonthlyBudgetRow[] = [
		{
			id: "t1-d-mb-daily",
			name: "Daily",
			color: "#38bdf8",
			group: "core",
			pace_kind: "daily",
			display_order: 10,
			archived: false,
		},
		{
			id: "t1-d-mb-recurring",
			name: "Recurring",
			color: "#a78bfa",
			group: "core",
			pace_kind: "recurring",
			display_order: 20,
			archived: false,
		},
		{
			id: "t1-d-mb-irregular",
			name: "Irregular",
			color: "#fbbf24",
			group: "outlier",
			pace_kind: "none",
			display_order: 30,
			archived: false,
		},
		{
			id: "t1-d-mb-travel",
			name: "Travel",
			color: "#fb7185",
			group: "outlier",
			pace_kind: "none",
			display_order: 40,
			archived: false,
		},
		{
			id: "t1-d-mb-extra-1",
			name: "Dense Extra 1",
			color: "#64DD17",
			group: "other",
			pace_kind: "none",
			display_order: 50,
			archived: false,
		},
		{
			id: "t1-d-mb-extra-2",
			name: "Dense Extra 2",
			color: "#4FC3F7",
			group: "other",
			pace_kind: "none",
			display_order: 60,
			archived: false,
		},
		{
			id: "t1-d-mb-extra-3",
			name: "Dense Extra 3",
			color: "#AB47BD",
			group: "other",
			pace_kind: "none",
			display_order: 70,
			archived: false,
		},
		{
			id: "t1-d-mb-extra-4",
			name: "Dense Archived",
			color: "#78909C",
			group: "other",
			pace_kind: "none",
			display_order: 80,
			archived: true,
		},
	]
	tables.monthly_budgets.push(...monthlyBudgets)
	monthlyBudgets.forEach((monthlyBudget, order) => {
		tables.monthly_budget_defaults.push({
			monthly_budget_id: monthlyBudget.id,
			effective_month: EXCLUDED_MONTH,
			amount: 100 * (order + 1),
		})
		tables.monthly_budget_amounts.push({
			monthly_budget_id: monthlyBudget.id,
			month: PRIOR_MONTH,
			amount: 100 * (order + 1) + 50,
		})
		tables.monthly_budget_amounts.push({
			monthly_budget_id: monthlyBudget.id,
			month: CURRENT_MONTH,
			// Null means no comparison amount; zero is a valid amount.
			amount: order % 3 === 0 ? null : order % 3 === 1 ? 0 : 100 * (order + 1),
		})
	})
	let statementSeq = 0
	const dayIndex = new Map<string, number>()
	const addStatement = (
		accountId: string,
		day: string,
		description: string,
		amount: number,
		pending: boolean,
	): string => {
		statementSeq += 1
		const key = `${accountId}|${day}`
		const index = (dayIndex.get(key) ?? 0) + 1
		dayIndex.set(key, index)
		const id = `t1-d-s-${String(statementSeq).padStart(4, "0")}`
		tables.statements.push({
			id,
			account_id: accountId,
			datetime: `${day} ${pending ? "07:30" : "12:00"}`,
			description,
			amount,
			index,
			is_pending: pending ? 1 : 0,
		})
		return id
	}
	for (let i = 1; i <= 60; i++) {
		const month = i <= 30 ? "2026-10" : i <= 50 ? "2026-09" : "2026-08"
		const day = `${month}-${pad2((i % 28) + 1)}`
		const category = cycle(tables.categories, i - 1)
		const account = cycle(tables.accounts, i - 1)
		const amount = i % 10 === 0 ? 0 : i % 9 === 0 ? round2(100 + i) : round2(-(10 + i * 1.5))
		const recordId = `t1-d-r-${pad2(i)}`
		const treatment = category.analytics_treatment ?? "spending"
		tables.records.push({
			id: recordId,
			title:
				i === 60
					? `Dense stress record ${"üñíçødé-☕-早餐-".repeat(14)} end`
					: `Dense Record ${i}`,
			people: i % 4 === 0 ? null : `Person ${i}`,
			location: i % 5 === 0 ? null : `Place ${i}`,
			description: i % 6 === 0 ? null : `Detail ${i}`,
			datetime: `${day} 12:00`,
			amount,
			category_id: category.id,
			analytics_treatment: treatment,
			analytics_treatment_source: category.analytics_treatment ? "category" : "manual",
			monthly_budget_id: category.default_monthly_budget_id,
			monthly_budget_source: category.default_monthly_budget_id ? "category" : null,
			revision: 1,
		})
		if (i % 11 === 0) continue
		if (i % 7 === 0 && amount !== 0) {
			const half = round2(amount / 2)
			const statement = addStatement(
				account.id,
				day,
				`Dense Record ${i} · SGD ${1000 + i}`,
				half,
				false,
			)
			tables.allocations.push({ statement_id: statement, record_id: recordId, amount: half })
		} else if (i % 5 === 0 && amount !== 0) {
			const first = round2(amount * 0.6)
			const second = round2(amount - first)
			const a = addStatement(
				account.id,
				day,
				`Dense Record ${i} · SGD ${2000 + i}`,
				first,
				false,
			)
			const b = addStatement(
				account.id,
				day,
				`Dense Record ${i} · SGD ${3000 + i}`,
				second,
				false,
			)
			tables.allocations.push({ statement_id: a, record_id: recordId, amount: first })
			if (second !== 0)
				tables.allocations.push({ statement_id: b, record_id: recordId, amount: second })
		} else if (i % 13 === 0) {
			const statement = addStatement(account.id, day, `Dense pending ${i}`, amount, true)
			tables.allocations.push({ statement_id: statement, record_id: recordId, amount })
		} else {
			const statement = addStatement(
				account.id,
				day,
				`Dense Record ${i} · SGD ${1000 + i}`,
				amount,
				false,
			)
			tables.allocations.push({ statement_id: statement, record_id: recordId, amount })
		}
	}
	const dupDay = "2026-10-06"
	tables.statements.push(
		{
			id: "t1-d-s-dup-a",
			account_id: "t1-d-acc-01",
			datetime: `${dupDay} 09:14`,
			description: "DENSE DUPLICATE 5544",
			amount: -28.9,
			index: 3,
			is_pending: 0,
		},
		{
			id: "t1-d-s-dup-b",
			account_id: "t1-d-acc-01",
			datetime: `${dupDay} 09:14`,
			description: "DENSE 5544 DUPLICATE",
			amount: -28.9,
			index: 4,
			is_pending: 0,
		},
		{
			id: "t1-d-s-sep-a",
			account_id: "t1-d-acc-02",
			datetime: "2026-10-13 10:00",
			description: "DENSE SEPARATE 6611",
			amount: -18,
			index: 3,
			is_pending: 0,
		},
		{
			id: "t1-d-s-sep-b",
			account_id: "t1-d-acc-02",
			datetime: "2026-10-13 10:00",
			description: "DENSE SEPARATE 6612",
			amount: -18,
			index: 4,
			is_pending: 0,
		},
	)
	tables.duplicate_dismissals.push({
		statement_id: "t1-d-s-sep-a",
		other_statement_id: "t1-d-s-sep-b",
	})
	for (let i = 1; i <= 35; i++) {
		const budgetId = `t1-d-b-${pad2(i)}`
		tables.budgets.push({
			id: budgetId,
			name: `Dense Budget ${i}`,
			amount: 100 * i,
			start_date: i % 3 === 0 ? "2026-09-01" : "2026-10-01",
			end_date: i % 3 === 0 ? "2026-09-30" : "2026-10-31",
			automatic: i % 2 === 0,
		})
		const first = cycle(tables.records, i - 1)
		const second = cycle(tables.records, i + 10)
		tables.budget_records.push({ budget_id: budgetId, record_id: first.id })
		if (second.id !== first.id)
			tables.budget_records.push({ budget_id: budgetId, record_id: second.id })
	}
	tables.analytics_months.push(
		{
			month: PRIOR_MONTH,
			coverage: "complete",
			covered_through: "2026-09-30",
			excluded_from_comparisons: false,
		},
		{
			month: EXCLUDED_MONTH,
			coverage: "complete",
			covered_through: "2026-08-31",
			excluded_from_comparisons: true,
		},
	)
	return {
		settings: { default_filter_start_date: "2026-10-01", default_filter_end_date_today: false },
		tables,
	}
}

// Stable populated-scenario ids for assertions in other suites.
export const IDS = {
	accounts: { dbs: "t1-acc-dbs", uob: "t1-acc-uob", revolut: "t1-acc-revolut" },
	monthlyBudgets: {
		daily: "t1-mb-daily",
		recurring: "t1-mb-recurring",
		travelArchived: "t1-mb-travel",
	},
	categories: {
		groceries: "t1-cat-groceries",
		dining: "t1-cat-dining",
		subcategory: "t1-cat-dessert",
		rent: "t1-cat-rent",
		income: "t1-cat-income",
		transferExcluded: "t1-cat-transfer",
		automatic: "t1-cat-auto",
		nullTreatment: "t1-cat-null",
	},
	records: {
		salaryIncome: "t1-r-salary",
		transferExcluded: "t1-r-transfer",
		partialPending: "t1-r-partial",
		pendingStatement: "t1-r-pending",
		zero: "t1-r-zero",
		nulls: "t1-r-nulls",
		unicode: "t1-r-unicode",
		split: "t1-r-split",
		priorMonth: "t1-r-rent-prior",
		excludedMonth: "t1-r-excluded",
	},
	statements: {
		pending: "t1-s-pending",
		duplicatePair: ["t1-s-dup-a", "t1-s-dup-b"] as const,
		separatePair: ["t1-s-sep-a", "t1-s-sep-b"] as const,
		splitPair: ["t1-s-split-a", "t1-s-split-b"] as const,
		unallocated: ["t1-s-dup-a", "t1-s-dup-b", "t1-s-free-1", "t1-s-free-2"] as const,
	},
	budgets: { manual: "t1-b-manual", automatic: "t1-b-auto" },
} as const

/**
 * Statement rules for the populated workspace, seeded only by the tests that need them so
 * every other Record creator keeps its blank defaults. Creation order decides autofill
 * conflicts: "Starbucks coffee" is older than "Raffles coffee".
 */
export function statementRules(): StatementRule[] {
	const rule = (
		id: string,
		name: string,
		minute: number,
		conditions: StatementRule["conditions"],
		actions: StatementRule["actions"],
		enabled = true,
	): StatementRule => ({
		id,
		name,
		enabled,
		conditions,
		actions,
		created_at: `2026-10-01T00:${pad2(minute)}:00.000Z`,
		updated_at: `2026-10-01T00:${pad2(minute)}:00.000Z`,
	})
	return [
		rule(
			"t1-rule-starbucks",
			"Starbucks coffee",
			1,
			{ mode: "all", items: [{ operator: "contains", value: "starbucks" }] },
			{
				title: { value: "Morning coffee" },
				category_id: { value: "t1-cat-dining" },
			},
		),
		rule(
			"t1-rule-raffles",
			"Raffles coffee",
			2,
			{ mode: "any", items: [{ operator: "regex", value: "4455$" }] },
			{
				category_id: { value: "t1-cat-groceries" },
			},
		),
		rule(
			"t1-rule-groceries",
			"Groceries",
			3,
			{
				mode: "any",
				items: [
					{ operator: "contains", value: "sheng siong" },
					{ operator: "contains", value: "fairprice" },
				],
			},
			{
				title: { value: "Groceries" },
				category_id: { value: "t1-cat-groceries" },
				monthly_budget_id: { value: "t1-mb-recurring" },
			},
		),
		rule(
			"t1-rule-grab",
			"Grab rides",
			4,
			{ mode: "all", items: [{ operator: "equals", value: "grab ride 7712" }] },
			{ title: { value: "Taxi" } },
			false,
		),
		rule(
			"t1-rule-archived",
			"Archived travel",
			5,
			{ mode: "all", items: [{ operator: "contains", value: "sheng" }] },
			{
				monthly_budget_id: { value: "t1-mb-travel" },
				people: { value: "Sam" },
			},
		),
	]
}

/**
 * Two past Starbucks Records for the populated workspace, so the Record creator has decisions
 * to learn from when "STARBUCKS 4455" is allocated: both went to "Coffee with team" with Alex
 * at Raffles Place.
 */
export function learnedCoffee(): Pick<WorkspaceTables, "statements" | "records" | "allocations"> {
	const { tables } = buildPopulated()
	for (const day of ["01", "02"]) {
		tables.statements.push({
			id: `t1-s-coffee-${day}`,
			account_id: "t1-acc-uob",
			datetime: `2026-09-${day} 12:00`,
			description: `STARBUCKS 30${day}`,
			amount: -7.2,
			index: 1,
			is_pending: 0,
		})
		tables.records.push({
			id: `t1-r-coffee-${day}`,
			title: "Coffee with team",
			people: "Alex",
			location: "Raffles Place",
			description: null,
			datetime: `2026-09-${day} 12:00`,
			amount: -7.2,
			category_id: "t1-cat-dining",
			analytics_treatment: "spending",
			analytics_treatment_source: "category",
			monthly_budget_id: "t1-mb-daily",
			monthly_budget_source: "category",
			revision: 1,
		})
		tables.allocations.push({
			statement_id: `t1-s-coffee-${day}`,
			record_id: `t1-r-coffee-${day}`,
			amount: -7.2,
		})
	}
	return {
		statements: tables.statements,
		records: tables.records,
		allocations: tables.allocations,
	}
}

export function getScenario(name: ScenarioName): WorkspaceDataset {
	const dataset =
		name === "empty" ? buildEmpty() : name === "dense" ? buildDense() : buildPopulated()
	return structuredClone(dataset)
}
