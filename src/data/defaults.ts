import type { AnalyticsTreatment } from "@/types"

export const DEFAULT_MONTHLY_BUDGETS = [
	{ name: "Daily", color: "#38bdf8", group: "core", pace_kind: "daily", display_order: 10 },
	{
		name: "Recurring",
		color: "#a78bfa",
		group: "core",
		pace_kind: "recurring",
		display_order: 20,
	},
	{ name: "Irregular", color: "#fbbf24", group: "outlier", pace_kind: "none", display_order: 30 },
	{ name: "Travel", color: "#fb7185", group: "outlier", pace_kind: "none", display_order: 40 },
] as const

export const DEFAULT_CATEGORIES: {
	name: string
	icon: string
	color: string
	treatment: AnalyticsTreatment
	monthly_budget: string | null
}[] = [
	{
		name: "Housing",
		icon: "house",
		color: "#5C6BC0",
		treatment: "spending",
		monthly_budget: "Recurring",
	},
	{
		name: "Bills & Utilities",
		icon: "receipt",
		color: "#7986CB",
		treatment: "spending",
		monthly_budget: "Recurring",
	},
	{
		name: "Groceries",
		icon: "apple",
		color: "#EF6C00",
		treatment: "spending",
		monthly_budget: "Daily",
	},
	{
		name: "Dining Out",
		icon: "utensils",
		color: "#F44336",
		treatment: "spending",
		monthly_budget: "Daily",
	},
	{
		name: "Transport",
		icon: "navigation",
		color: "#AB47BD",
		treatment: "spending",
		monthly_budget: "Daily",
	},
	{
		name: "Healthcare",
		icon: "heart-pulse",
		color: "#FFB300",
		treatment: "spending",
		monthly_budget: "Irregular",
	},
	{
		name: "Insurance",
		icon: "shield-check",
		color: "#26A69A",
		treatment: "spending",
		monthly_budget: "Recurring",
	},
	{
		name: "Shopping",
		icon: "shopping-bag",
		color: "#4FC3F7",
		treatment: "spending",
		monthly_budget: "Irregular",
	},
	{
		name: "Entertainment",
		icon: "party-popper",
		color: "#64DD17",
		treatment: "spending",
		monthly_budget: "Irregular",
	},
	{
		name: "Gifts & Donations",
		icon: "gift",
		color: "#EC407A",
		treatment: "spending",
		monthly_budget: "Irregular",
	},
	{
		name: "Travel",
		icon: "plane",
		color: "#FB7185",
		treatment: "spending",
		monthly_budget: "Travel",
	},
	{
		name: "Income",
		icon: "dollar-sign",
		color: "#01BFA5",
		treatment: "income",
		monthly_budget: null,
	},
	{
		name: "Savings & Investments",
		icon: "chart-candlestick",
		color: "#26A69A",
		treatment: "saving_investment",
		monthly_budget: null,
	},
	{
		name: "Transfer",
		icon: "arrow-left-right",
		color: "#78909C",
		treatment: "neutral",
		monthly_budget: null,
	},
	{
		name: "Other",
		icon: "circle-question-mark",
		color: "#9E9E9E",
		treatment: "spending",
		monthly_budget: null,
	},
]
