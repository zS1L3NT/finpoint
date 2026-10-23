import { expectVisibleRowCascade, sampleVisibleRowAnimations } from "./support/assertions"
import { expect, seedWorkspace, test } from "./support/fixtures"

// The related table starts below the chart; the tall project exposes its initial rows.
test("motion.consumer Budget Records animates its initially visible related rows", {
	tag: ["@tall"],
}, async ({ page }) => {
	await seedWorkspace(page)
	await page.goto("/budgets")
	await expect(page.getByRole("heading", { name: "October Buffer", exact: true })).toBeVisible()
	const samples = await sampleVisibleRowAnimations(
		page,
		'tbody tr:has(a[href^="/records/"])',
		() => page.getByRole("heading", { name: "October Buffer", exact: true }).click(),
	)
	expectVisibleRowCascade(samples, 2)
})
