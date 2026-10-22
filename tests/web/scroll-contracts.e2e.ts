import { expectDropdownPreservesScroll, expectPointerCursor } from "./support/assertions"
import { expect, test } from "./support/fixtures"

test.use({ workspaceScenario: "dense" })
test.beforeEach(async ({ workspace }) => {
	void workspace
})

// One dense seed for all scroll contracts. The harness SelectField step needs
// no seed but shares the context harmlessly; every step navigates fresh, so
// open popups never leak between filters.
test("scroll contracts share one seed", async ({ page }) => {
	await test.step("scroll.real SelectField preserves the page scrollbar while open", async () => {
		await page.goto("http://127.0.0.1:5174/?section=forms")
		// The composed harness uses the same SelectField as all editors.
		const trigger = page.locator("#harness-direction")
		await expectPointerCursor(trigger)
		await expectDropdownPreservesScroll(page, () => trigger.click())
		await page.keyboard.press("Escape")
		await expect(page.getByRole("listbox")).toHaveCount(0)
		await expect(trigger).toBeFocused()
		await trigger.press("Enter")
		await page.getByRole("option", { name: "Income", exact: true }).click()
		await expect(page.getByTestId("direction-value")).toHaveText("Direction value: income")
	})
	for (const label of ["Any monthly budget", "Any treatment", "Any status"] as const) {
		await test.step(`scroll.real records filter ${label} preserves the page scrollbar while open`, async () => {
			// Each app filter is a distinct combobox consumer on the dense records
			// route; the shared harness case above covers the editor SelectField.
			await page.goto("/records?per_page=100")
			const filter = page.getByRole("combobox").filter({ hasText: label })
			await expect(filter).toBeVisible()
			await expectDropdownPreservesScroll(page, () => filter.click())
			await page.keyboard.press("Escape")
			await expect(filter).toBeFocused()
		})
	}
})
