import { card, overview } from "../support/charts"
import { expect, seedWorkspace, test } from "../support/fixtures"

test("day drill-down: docking animates the main column width", { tag: "@desktop-only" }, async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const calendar = card(page, "Spending calendar")
	const day = calendar.getByRole("button", { name: /^5 October:/ })
	await day.scrollIntoViewIfNeeded()
	const sampler = await calendar.evaluateHandle(element => {
		const samples: number[] = []
		let active = true
		const sample = () => {
			samples.push(element.getBoundingClientRect().width)
			if (active) requestAnimationFrame(sample)
		}
		requestAnimationFrame(sample)
		return {
			samples,
			stop: () => {
				active = false
				return samples
			},
		}
	})
	await day.click()
	await expect(page.getByTestId("drill-total")).toBeVisible()
	await page.waitForTimeout(1000)
	const widths = await sampler.evaluate(s => s.stop())
	expect(Math.max(...widths) - Math.min(...widths)).toBeGreaterThan(50)
	expect(new Set(widths.map(w => Math.round(w))).size).toBeGreaterThan(4)
})
