import type { Page } from "@playwright/test"
import { imported } from "./editors"

export async function openReplacementSheet(page: Page) {
	await page.goto("/allocator")
	await page
		.getByRole("checkbox", { name: `Select statement ${imported.id}`, exact: true })
		.check()
	await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
	return page.getByRole("dialog", { name: "Replace a pending Statement", exact: true })
}
