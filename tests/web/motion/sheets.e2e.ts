import { expectVisibleBackdrop } from "../support/assertions"
import { deleted, imported, kept, pending } from "../support/editors"
import { expect, test } from "../support/fixtures"
import { expectPopupEntrance, sampleVisibleRowAnimations } from "../support/motion"
import { openReplacementSheet } from "../support/sheets"

test("review sheets: replacement and duplicate reviews enter as a whole", {
	tag: ["@reduced-motion"],
}, async ({ page, workspace }) => {
	void workspace
	await test.step("replacement review: review enters through intermediate opacity", async () => {
		void workspace
		const sheet = await openReplacementSheet(page)
		await expectVisibleBackdrop(page)
		await expect(sheet).toContainText(imported.description)
		await sheet
			.getByRole("searchbox", { name: "Search pending Statements" })
			.fill(pending.description)
		const choice = sheet.getByRole("button").filter({ hasText: pending.description })
		// Sample only the newly opened review; the confirmation sheet is already visible.
		const entrance = await sampleVisibleRowAnimations(
			page,
			'[data-slot="dialog-content"]',
			() => choice.click(),
		)
		expect(entrance.length).toBe(1)
		if (!(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches))) {
			expect(
				entrance[0]?.frames.some(frame => frame.opacity > 0.01 && frame.opacity < 0.99),
				"Replacement review must animate through intermediate opacity",
			).toBe(true)
		}
	})
	await test.step("Duplicate Statement review: popup enters as a whole", async () => {
		void workspace
		await page.goto("/allocator/duplicates")
		// Review stays disabled until both a kept and a deleted Statement are chosen.
		await expect(
			page.getByRole("button", { name: "Review deletion", exact: true }).first(),
		).toBeDisabled()
		await page.getByRole("radio", { name: `Keep ${kept.description}`, exact: true }).click()
		await page
			.getByRole("radio", { name: `Delete ${deleted.description}`, exact: true })
			.click()
		const trigger = page.getByRole("button", { name: "Review deletion", exact: true }).first()
		await expectPopupEntrance(page, () => trigger.click())
	})
})
