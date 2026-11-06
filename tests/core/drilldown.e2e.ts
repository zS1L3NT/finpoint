import { card, overview } from "../support/charts"
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
