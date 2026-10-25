import type { Page } from "@playwright/test"

export const overview = "/?month=October&year=2026"

export const overviewCharts = [
	"Spending forecast",
	"Surplus / Shortfall",
	"Spending by day",
	"Spending by weekday",
	"Category trend",
]

export function card(page: Page, title: string) {
	return page
		.locator('[data-slot="card"]')
		.filter({ has: page.locator('[data-slot="card-title"]').filter({ hasText: title }) })
}

// Recharts charts and the custom trend chart expose their readouts differently.
export const chartTooltip = '.recharts-tooltip-wrapper, [data-slot="chart-tooltip"]'
