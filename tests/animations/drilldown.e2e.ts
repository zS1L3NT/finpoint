import { card, overview } from "../support/charts"
import { expect, seedWorkspace, test } from "../support/fixtures"
import { poseIsIdentity, sampleVisibleRowAnimations } from "../support/motion"

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

test("drill sheet: entrance and exit retain popup motion", { tag: ["@reduced-motion"] }, async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 })
	await seedWorkspace(page)
	await page.goto(overview)
	const day = card(page, "Spending calendar").getByRole("button", { name: /^5 October:/ })
	await day.scrollIntoViewIfNeeded()
	const samples = await sampleVisibleRowAnimations(page, '[data-slot="sheet-content"]', () =>
		day.click(),
	)
	expect(samples).toHaveLength(1)
	const frames = samples[0]!.frames
	expect(poseIsIdentity(frames.at(-1)!)).toBe(true)
	const reduced = await page.evaluate(
		() => matchMedia("(prefers-reduced-motion: reduce)").matches,
	)
	if (!reduced) expect(frames.filter(f => !poseIsIdentity(f)).length).toBeGreaterThan(1)
	else expect(frames.every(poseIsIdentity)).toBe(true)
	const recorder = await page.locator('[data-slot="sheet-content"]').evaluateHandle(element => {
		const poses: string[] = []
		const tick = () => {
			if (element.isConnected) {
				poses.push(getComputedStyle(element).transform)
				requestAnimationFrame(tick)
			}
		}
		tick()
		return { poses, removed: () => !element.isConnected }
	})
	await page.getByRole("button", { name: "Close drill-down" }).click()
	await expect.poll(() => recorder.evaluate(r => r.removed())).toBe(true)
	const poses = await recorder.evaluate(r => r.poses)
	if (!reduced) expect(new Set(poses).size).toBeGreaterThan(2)
	await expect(page.locator('[data-slot="sheet-overlay"]')).toHaveCount(0)
	await recorder.dispose()
})
