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
	await expect(panel.getByTestId("drill-total")).not.toContainText("-$")
	await expect(panel.getByTestId("drill-body")).toContainText("-$84.20")
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

test("edit from drill returns focus and updates the live total", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=day:2026-10-05`)
	await page.getByTestId("drill-body").locator("button[aria-expanded]").first().click()
	const edit = page.getByRole("button", { name: "Edit Record", exact: true })
	await edit.click()
	const dialog = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await expect(dialog).toBeVisible()
	await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
	await expect(edit).toBeFocused()
	await edit.click()
	const amount = dialog.locator("input#amount")
	const original = Number(await amount.inputValue())
	await amount.fill(String(original + 1))
	await dialog.getByRole("button", { name: "Save changes", exact: true }).click()
	await expect(edit).toBeFocused()
	await expect(page.getByTestId("drill-total")).toHaveText("$85.20")
})

test("Largest Records opens a sorted drill and preserves sort into Records", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const largest = card(page, "Largest Records")
	await expect(largest.locator("button")).toHaveCount(6)
	await largest.getByRole("button", { name: "See all", exact: true }).click()
	await expect(page).toHaveURL(/drill=largest/)
	await expect(
		page.getByTestId("drill-body").locator("button[aria-expanded]").first(),
	).toContainText("Uniqlo Basics")
	await page.getByRole("link", { name: "Open in Records" }).click()
	await expect(page).toHaveURL(/sort=amount_desc/)
	await expect(page.getByRole("combobox", { name: "Sort Records" })).toContainText(
		"Amount: largest first",
	)
	await page.reload()
	await expect(page.getByRole("combobox", { name: "Sort Records" })).toContainText(
		"Amount: largest first",
	)
})

test("Biggest changes compares named periods and preserves the month through reload and Back", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const mover = card(page, "Biggest changes").getByRole("button", {
		name: /Housing.*less than your/,
	})
	await expect(mover).toContainText("less than your 1-month average")
	await expect(card(page, "Biggest changes")).toContainText("Sep 2026")
	await mover.click()
	await expect(page).toHaveURL(/drill=compare/)
	const comparison = page.getByTestId("drill-comparison")
	await expect(comparison).toContainText("$1,400.00")
	await expect(comparison).toContainText("Only in comparison")
	await expect(comparison.locator("section")).toHaveCount(2)
	await page.reload()
	await expect(comparison).toBeVisible()
	await expect(page.getByTestId("drill-total")).toHaveText("$0.00")
	await page.getByRole("button", { name: "Close drill-down" }).click()
	await expect(page).not.toHaveURL(/drill=/)
	await expect(comparison).toHaveCount(0)
	await page.goBack()
	await expect(comparison).toBeVisible()
	await page.getByRole("link", { name: "Open in Records", exact: true }).click()
	await expect(page).toHaveURL(/category_ids=t1-cat-rent/)
})

test("headline and Attention replace review chips with ranked work links", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(overview)
	await expect(page.getByLabel("Month headline")).toContainText("You've spent")
	await expect(page.getByLabel("Month headline")).toContainText("16 days left.")
	await expect(page.getByLabel("Review this month")).toHaveCount(0)
	const attention = page.getByLabel("Attention", { exact: true })
	await expect(attention.locator("li")).toHaveCount(3)
	await attention.getByRole("link", { name: /Pending Record/ }).click()
	await expect(page).toHaveURL(/is_allocated=false/)
})

test("Monthly budgets explain unbudgeted spending and link to custom-period Budgets", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const budgets = card(page, "Monthly budgets")
	await expect(budgets).toContainText("incl. $94.60 not in any Monthly Budget")
	await expect(budgets).toContainText("Amounts are after refunds")
	await budgets.getByRole("link", { name: /Custom-period Budgets/ }).click()
	await expect(page).toHaveURL(/\/budgets$/)
})
