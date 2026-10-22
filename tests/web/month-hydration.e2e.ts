import { expect, test } from "@playwright/test"
import { setDateOnly } from "./support/date-only"

test("monthly headers hydrate with a browser date different from the server", async ({ page }) => {
	const errors: string[] = []
	page.on("pageerror", error => errors.push(error.message))
	page.on("console", message => {
		if (message.type() === "error") errors.push(message.text())
	})
	await setDateOnly(page, new Date("2001-01-15T12:00:00+08:00"))
	for (const [route, heading, subtitle] of [
		["/", "January 2001", "Through 15 Jan · SGD · Based on Record dates"],
		["/records/monthly", "January 2001", "Actuals through 15 Jan"],
		["/?month=December&year=2000", "December 2000", "Full month · SGD · Based on Record dates"],
	] as const) {
		await test.step(route, async () => {
			await page.goto(route)
			await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible()
			await expect(page.getByText(subtitle, { exact: true })).toBeVisible()
			await expect(page.getByRole("button", { name: "Next month" })).toBeEnabled()
			expect(errors.filter(error => /hydrat|server rendered/i.test(error))).toEqual([])
		})
	}
})
