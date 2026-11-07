// Dev-only worst-case workspace for UI stress checks (break-ui). Starts from the demo
// workspace and swaps in realistic extremes: long and one-letter names, emoji, non-Latin
// text, huge amounts, a single-Record Category and an over-plan Monthly Budget.
// Field lengths are unbounded in validation, so long values stay believable, not absurd.

import type { FinpointExport } from "@/data/export-import"
import { generateTestData } from "@/data/test-data"

const CATEGORY_NAMES: Record<string, string> = {
	groceries: "Groceries & household essentials (shared flat)",
	"dining-out": "Dining Out",
	transport: "Ō",
	"bills-utilities": "Bills, utilities & government payments",
	healthcare: "Healthcare 🏥 dental & optical",
	shopping: "Shopping — Uniqlo, IKEA, Shopee and other online marketplaces",
	entertainment: "เอนเตอร์เทนเมนต์",
}

const RECORD_TITLES = [
	"Aleksandra Wiśniewska-Kowalczyk — reimbursement for team offsite catering deposit",
	"Jo",
	"🍜",
	"NTUC FairPrice Finest @ Bukit Timah Plaza #B1-01/02 (self-checkout lane 14)",
	"bartholomew.fitzgerald@northwind-industries-holdings.example.com",
	"Grab*GrabPay SG-SINGAPORE-TXN-2026103100001842271",
	"ร้านอาหารไทยริมทาง",
	"A",
]

export function generateWorstCaseData(): FinpointExport {
	const data = generateTestData()
	// Export tables are untyped rows; these are the only fields touched here.
	const tables = data.tables as unknown as {
		categories: { id: string; name: string }[]
		monthly_budgets: { id: string; name: string }[]
		records: { title: string; amount: number }[]
	}
	tables.categories = tables.categories.map(c => ({ ...c, name: CATEGORY_NAMES[c.id] ?? c.name }))
	tables.monthly_budgets = tables.monthly_budgets.map(b =>
		b.id === "demo-irregular"
			? { ...b, name: "Irregular & annual subscriptions (insurance, renewals)" }
			: b,
	)
	// Biggest first, so the extremes land on screen in Largest Records and every drill-down.
	const byAmount = [...tables.records].sort((a, b) => a.amount - b.amount)
	byAmount.forEach((record, index) => {
		const title = RECORD_TITLES[index % RECORD_TITLES.length]
		if (index < RECORD_TITLES.length * 3 && title) record.title = title
	})
	const biggest = byAmount[0]
	if (biggest) biggest.amount = -1234567.89
	return data
}
