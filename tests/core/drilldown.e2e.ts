import { card, chartTooltip, overview } from "../support/charts"
import { expect, seedWorkspace, test } from "../support/fixtures"

test("day drill-down: totals, retarget, Back, close, focus and invalid URLs", async ({
	page,
	isMobile,
}) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const calendar = card(page, "Spending calendar")
	const day = calendar.getByRole("button", { name: /^5 October:/ })
	await day.focus()
	await day.press("Enter")
	await expect(page).toHaveURL(/drill=day%3A2026-10-05/)
	const panel = isMobile
		? page.getByRole("dialog")
		: page.getByRole("region", { name: /Spending on/ })
	await expect(panel.getByTestId("drill-total")).toHaveText("$84.20")
	await expect(panel).not.toContainText("-$")
	await page.goBack()
	await expect(panel).toHaveCount(0)
	await expect(day).toBeFocused()
	await day.press("Enter")
	await panel.getByRole("button", { name: "Close drill-down" }).click()
	await expect(day).toBeFocused()
	if (!isMobile) {
		await day.press("Enter")
		await calendar.getByRole("button", { name: /^6 October:/ }).hover()
		await expect(calendar).toContainText("Mon 5 Oct · $84.20 · 2 Records")
		await calendar.getByRole("button", { name: /^6 October:/ }).click()
		await expect(panel).toHaveCount(1)
		await expect(panel).toContainText("Spending on Tue 6 Oct")
		await page.keyboard.press("Escape")
		await expect(calendar.getByRole("button", { name: /^6 October:/ })).toBeFocused()
	}
	await page.goto(`${overview}&drill=day:2026-02-30`)
	await expect(page.getByTestId("drill-total")).toHaveCount(0)
	await page.goto(`${overview}&drill=day:2026-10-05`)
	await expect(page.getByTestId("drill-total")).toHaveText("$84.20")
	await page.getByRole("link", { name: "Open in Records" }).click()
	await expect(page).toHaveURL(/start_date=2026-10-05/)
	await expect(page).toHaveURL(/end_date=2026-10-05/)
})

test("drill pivot: URL expansion, Statement breadcrumb and browser Back survive reload", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=day:2026-10-05`)
	const row = page.getByTestId("drill-body").locator("button[aria-expanded]").first()
	await row.click()
	await expect(page).toHaveURL(/focus=record%3A/)
	await page.getByTestId("allocation-rows").getByRole("button").first().click()
	await expect(page).toHaveURL(/focus=statement%3A/)
	await expect(page.getByRole("navigation", { name: "Drill-down breadcrumb" })).toBeVisible()
	await expect(page.getByRole("button", { name: "← Back" })).toBeVisible()
	await page.reload()
	await expect(page.getByText("Records allocated to this Statement")).toBeVisible()
	await page.goBack()
	await expect(page).toHaveURL(/focus=record%3A/)
	await expect(row).toHaveAttribute("aria-expanded", "true")
	await page.goForward()
	await page.getByRole("button", { name: "← Back" }).click()
	await expect(page.getByText("Records allocated to this Statement")).toHaveCount(0)
	await page.goto(`${overview}&drill=day:2026-10-05&focus=invalid`)
	await expect(page.getByTestId("drill-total")).toHaveCount(0)
})

test("category, trend and budget selections retain the Dashboard and reconcile their visible amounts", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const mix = card(page, "Categories this month")
	const groceries = mix.getByRole("button", { name: /^Groceries/ })
	await groceries.click()
	await expect(page).toHaveURL(/drill=category-gross/)
	await expect(page.getByTestId("drill-total")).toHaveText("$117.53")
	await page.getByRole("button", { name: "Close drill-down" }).click()
	const trend = card(page, "Category trend").getByRole("application")
	await trend.focus()
	await trend.press("End")
	await trend.press("Enter")
	await expect(page).toHaveURL(/drill=month%3A2026-10/)
	await expect(page.getByTestId("drill-total")).toHaveText("$306.63")
	await page.getByRole("button", { name: "Close drill-down" }).click()
	const legend = card(page, "Spending forecast").locator('[data-slot="forecast-legend"]')
	await legend.getByRole("button", { name: "Daily", exact: true }).click()
	await expect(page).toHaveURL(/drill=budget/)
	await expect(page.getByTestId("drill-total")).toHaveText("$192.03")
	await expect(page).not.toHaveURL(/scope=/)
	await page.getByRole("button", { name: "Close drill-down" }).click()
	const forecast = card(page, "Spending forecast").getByRole("application")
	await forecast.focus()
	await forecast.press("Home")
	await expect(card(page, "Spending forecast").locator(chartTooltip)).toContainText("October 1")
	for (let day = 1; day < 5; day++) {
		await forecast.press("ArrowRight")
		await expect(card(page, "Spending forecast").locator(chartTooltip)).toContainText(
			`October ${day + 1}`,
		)
	}
	await forecast.press("Enter")
	await expect(page).toHaveURL(/drill=day%3A2026-10-05/)
	await expect(page.getByTestId("drill-total")).toHaveText("$84.20")
})
