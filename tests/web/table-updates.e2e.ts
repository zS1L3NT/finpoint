import {
	expectReducedRowMovement,
	expectVisibleRowCascade,
	sampleVisibleRowAnimations,
} from "./support/assertions"
import { expect, seedWorkspace, test } from "./support/fixtures"

for (const route of ["/records", "/statements"] as const) {
	test(`table.refilter ${route} settled results reveal a different nonempty set`, async ({
		page,
	}) => {
		await seedWorkspace(page, "dense")
		const query = route === "/records" ? "Dense Record 1" : "Dense Record 1"
		await page.goto(`${route}?query=${encodeURIComponent(query)}&per_page=100`)
		const search = page.getByPlaceholder(
			route === "/records"
				? "Search title, people, location, description..."
				: "Search descriptions...",
		)
		const selector = `tbody tr:has(a[href^="${route}/"]), div.grid-cols-subgrid:has(a[href^="${route}/"])`
		await expect(page.locator(selector).filter({ visible: true }).first()).toBeVisible()
		// Cross the documented entrance-settle window before changing the result set.
		await page.waitForTimeout(1000)
		const existing = await page
			.locator(`${selector} a[href^="${route}/"]`)
			.evaluateAll(elements => elements.map(element => element.getAttribute("href")))
		const fresh = selector
			.split(", ")
			.map(part => part + existing.map(href => `:not(:has(a[href="${href}"]))`).join(""))
			.join(", ")
		const samples = await sampleVisibleRowAnimations(page, fresh, () =>
			search.fill(query.replace("1", "2")),
		)
		expect(samples.length).toBeGreaterThan(1)
		if (test.info().project.name === "reduced-motion") expectReducedRowMovement(samples, 2)
		else expectVisibleRowCascade(samples, 2)
		await expect(page).toHaveURL(/query=Dense\+.*\+2/)
	})

	test(`table.paging-motion ${route} new page fades without restarting the rise`, async ({
		page,
	}) => {
		await seedWorkspace(page, "dense")
		await page.goto(`${route}?per_page=5`)
		const rows = `tbody tr:has(a[href^="${route}/"]), div.grid-cols-subgrid:has(a[href^="${route}/"])`
		await expect(page.locator(rows).filter({ visible: true })).toHaveCount(5)
		const oldLinks = await page
			.locator(`main a[href^="${route}/"]`)
			.evaluateAll(elements => elements.map(element => element.getAttribute("href")))
		const fresh = rows
			.split(", ")
			.map(part => part + oldLinks.map(href => `:not(:has(a[href="${href}"]))`).join(""))
			.join(", ")
		const samples = await sampleVisibleRowAnimations(page, fresh, () =>
			page.getByRole("link", { name: "Go to next page" }).click(),
		)
		expect(samples).toHaveLength(5)
		for (const sample of samples) {
			expect(sample.frames.at(-1)?.opacity).toBe(1)
			expect(
				new Set(
					sample.frames.map(
						frame =>
							`${frame.transform}|${frame.translate}|${frame.scale}|${frame.rotate}`,
					),
				),
			).toEqual(new Set(["none|none|none|none"]))
			if (test.info().project.name !== "reduced-motion")
				expect(sample.frames[0]?.opacity).toBeLessThan(0.95)
			else
				expect(
					sample.frames[0]?.layoutHeight,
					"First frame occupies its final layout",
				).toBeGreaterThan(0)
		}
		await expect(page).toHaveURL(/page=2/)
	})
}

test("table.groups visible day headers enter with their grouped Records", async ({
	page,
	isMobile,
}) => {
	await seedWorkspace(page, "dense")
	await page.goto("/accounts")
	if (isMobile) await page.locator('header [data-slot="sidebar-trigger"]').click()
	const samples = await sampleVisibleRowAnimations(
		page,
		'tbody tr:not(:has(a[href^="/records/"])), div.grid-cols-subgrid:not(:has(a[href^="/records/"]))',
		() =>
			page
				.getByRole("link", { name: "Records", exact: true })
				.filter({ visible: true })
				.click(),
	)
	if (test.info().project.name === "reduced-motion") expectReducedRowMovement(samples, 2)
	else expectVisibleRowCascade(samples, 2)
})
