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

test("drill pivot: Statement and Back travel in opposite directions", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=day:2026-10-05`)
	await page.getByTestId("drill-body").locator("button[aria-expanded]").first().click()
	const sample = async (action: () => Promise<void>) => {
		const sampler = await page.evaluateHandle(() => {
			const xs: number[] = []
			let active = true
			const tick = () => {
				const body = document.querySelector('[data-testid="drill-body"]')
				if (body) xs.push(new DOMMatrix(getComputedStyle(body).transform).m41)
				if (active) requestAnimationFrame(tick)
			}
			requestAnimationFrame(tick)
			return {
				stop: () => {
					active = false
					return xs
				},
			}
		})
		await action()
		await page.waitForTimeout(650)
		return sampler.evaluate(s => s.stop())
	}
	const forward = await sample(() =>
		page.getByTestId("allocation-rows").getByRole("button").first().click(),
	)
	expect(forward.find(x => Math.abs(x) > 2)).toBeLessThan(-2)
	expect(Math.min(...forward)).toBeLessThan(-2)
	expect(Math.max(...forward)).toBeGreaterThan(2)
	const back = await sample(() => page.getByRole("button", { name: "← Back" }).click())
	expect(back.find(x => Math.abs(x) > 2)).toBeGreaterThan(2)
	expect(Math.min(...back)).toBeLessThan(-2)
	expect(Math.max(...back)).toBeGreaterThan(2)
	expect(back.at(-1)).toBe(0)
})
