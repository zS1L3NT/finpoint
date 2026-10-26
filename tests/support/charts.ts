import type { Page } from "@playwright/test"
import { themeColor } from "@/lib/palette"

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

export const chartTooltip = '[data-slot="chart-tooltip"]'

/** The rgb() a picked hex renders as after `themeColor`, in the page's colour scheme. */
export function themedRgb(page: Page, hex: string) {
	return page.evaluate(color => {
		const probe = document.createElement("span")
		probe.style.color = color
		document.body.append(probe)
		const value = getComputedStyle(probe).color
		probe.remove()
		return value
	}, themeColor(hex))
}
