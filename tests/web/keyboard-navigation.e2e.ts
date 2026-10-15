// Keyboard navigation + representative keyboard actions for the 11 pending
// route.navigation gaps (notes/muse-41-gaps.json). No independent review:
// this file is Muse-written and unreviewed; counts below are Chromium-only
// evidence unless the full matrix run is quoted.
//
// Honest applicability:
// - Categories has no detail route: the drill is categories list -> filtered
//   Records (keyboard) -> Record detail (keyboard) -> Back x2 (keyboard).
// - Account cards are keyboard-operable from app13 (tabIndex + Enter parity
//   with BudgetCard); the accounts case drives fully by keyboard.
// - The allocator has no select-all header control; that facet is not claimed.

import type { Page } from "@playwright/test"
import { IDS } from "./support/data"
import { expect, test } from "./support/fixtures"

async function expectBackAboveHeading(page: Page, name: string) {
	const back = page.getByRole("button", { name, exact: true })
	await expect(back).toBeVisible()
	const backBox = await back.boundingBox()
	const headingBox = await page.locator("main h2").first().boundingBox()
	if (!backBox || !headingBox) throw new Error("Back and heading need layout boxes")
	expect(backBox.y + backBox.height).toBeLessThan(headingBox.y)
}

async function keyboardBack(page: Page, name: string, url: RegExp | string) {
	const back = page.getByRole("button", { name, exact: true })
	await expectBackAboveHeading(page, name)
	await back.focus()
	await page.keyboard.press("Enter")
	await expect(page).toHaveURL(url)
}

test("records keyboard filtered list to detail to Back keeps exact origin", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	const origin =
		"/records?query=FairPrice+Run&page=1&per_page=5&start_date=2026-10-01&end_date=2026-10-31&min_amount=-100&max_amount=0"
	await page.goto(origin)
	const open = page
		.getByRole("link", { name: "Open FairPrice Run", exact: true })
		.filter({ visible: true })
		.first()
	await expect(open).toBeVisible()
	await open.focus()
	await page.keyboard.press("Enter")
	await expect(page).toHaveURL(/\/records\/t1-r-groceries/)
	await keyboardBack(page, "Back to Records", origin)
})

test("statements keyboard filtered list to detail to Back keeps exact origin", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	const origin =
		"/statements?query=STARBUCKS&page=1&per_page=5&start_date=2026-10-01&end_date=2026-10-31&min_amount=-10&max_amount=0"
	await page.goto(origin)
	// The description renders in both the mobile list and the desktop table;
	// exactly one is visible per viewport.
	await expect(
		page.locator("main").getByText("STARBUCKS 4455").filter({ visible: true }).first(),
	).toBeVisible()
	const open = page
		.getByRole("link", { name: "Open statement", exact: true })
		.filter({ visible: true })
		.first()
	await expect(open).toBeVisible()
	await open.focus()
	await page.keyboard.press("Enter")
	await expect(page).toHaveURL(/\/statements\/t1-s-free-1/)
	await keyboardBack(page, "Back to Statements", origin)
})

test("accounts keyboard card to detail to Back keeps exact origin", async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	const origin = "/accounts?query=One+Card"
	await page.goto(origin)
	const card = page
		.locator("article", { has: page.getByRole("heading", { name: "One Card" }) })
		.first()
	await expect(card).toBeVisible()
	await card.focus()
	await page.keyboard.press("Enter")
	await expect(page).toHaveURL(/\/accounts\/t1-acc-uob/)
	await keyboardBack(page, "Back to Accounts", origin)
})

test("budgets keyboard card Enter to detail to Back keeps exact origin", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	const origin = "/budgets?query=October+Buffer"
	await page.goto(origin)
	const card = page.locator("article", { hasText: "October Buffer" }).first()
	await expect(card).toBeVisible()
	await card.focus()
	await page.keyboard.press("Enter")
	await expect(page).toHaveURL(/\/budgets\/t1-b-manual/)
	await keyboardBack(page, "Back to Budgets", origin)
})

test("categories nested keyboard drill returns through exact origins", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	// No /categories/[id] route exists: drill into filtered Records instead.
	await page.goto("/categories?query=Groceries")
	await expect(page.getByRole("button", { name: "Edit Groceries", exact: true })).toBeVisible()
	const drill = page.getByRole("link", { name: "Open Records for Groceries", exact: true })
	await drill.focus()
	await page.keyboard.press("Enter")
	const recordsOrigin = new RegExp("/records\\?category_ids=t1-cat-groceries")
	await expect(page).toHaveURL(recordsOrigin)
	const recordsUrl = page.url()
	await expect(
		page.getByRole("button", { name: "Back to Categories", exact: true }),
	).toBeVisible()
	const open = page
		.getByRole("link", { name: "Open FairPrice Run", exact: true })
		.filter({ visible: true })
		.first()
	await open.focus()
	await page.keyboard.press("Enter")
	await expect(page).toHaveURL(/\/records\/t1-r-groceries/)
	await keyboardBack(page, "Back to Records", recordsUrl)
	await keyboardBack(page, "Back to Categories", /\/categories(\?|$)/)
})

test("allocator keyboard selection, dialog, and clear", async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	await page.goto("/allocator")
	const box = page.getByRole("checkbox", {
		name: `Select statement ${IDS.statements.unallocated[2]}`,
		exact: true,
	})
	await expect(box).toBeVisible()
	await box.focus()
	await page.keyboard.press("Space")
	await expect(box).toBeChecked()
	await expect(page.locator("aside strong")).toContainText("1 selected")
	const create = page.getByRole("button", { name: "Create Record", exact: true })
	await create.focus()
	await page.keyboard.press("Enter")
	await expect(page.getByRole("dialog", { name: "Create New Record" })).toBeVisible()
	await page.keyboard.press("Escape")
	await expect(page.getByRole("dialog")).toHaveCount(0)
	await expect(box).toBeChecked()
	const clear = page.locator("aside").getByRole("button", { name: "Clear", exact: true })
	await clear.focus()
	await page.keyboard.press("Enter")
	await expect(box).not.toBeChecked()
	await expect(page.locator("aside")).toHaveCount(0)
})

test("duplicates keyboard keep, delete, review, and cancel", async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	await page.goto("/allocator/duplicates")
	const keep = page.getByRole("radio", {
		name: `Keep ${"DON DON DONKI 8821 PURCHASE"}`,
		exact: true,
	})
	await keep.focus()
	await page.keyboard.press("Space")
	const del = page.getByRole("radio", {
		name: `Delete ${"DON DON DONKI PURCHASE 8821"}`,
		exact: true,
	})
	await expect(del).toBeEnabled()
	await del.focus()
	await page.keyboard.press("Space")
	const reviewTrigger = page.getByRole("button", { name: "Review deletion", exact: true })
	await expect(reviewTrigger).toBeEnabled()
	await reviewTrigger.focus()
	await page.keyboard.press("Enter")
	const review = page.getByRole("dialog", { name: "Delete duplicate Statements" })
	await expect(review).toBeVisible()
	await expect(review.getByText("DON DON DONKI 8821 PURCHASE")).toBeVisible()
	await page.keyboard.press("Escape")
	await expect(review).toHaveCount(0)
})

test("pending keyboard queue, replace, and confirm", async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	await page.goto("/allocator/pending")
	const queue = page.locator("section[aria-labelledby='pending-queue-title']")
	await queue.getByPlaceholder("Search descriptions...").fill("Pasar malam")
	const pick = page.getByRole("button", { name: /Pasar malam/ })
	await expect(pick).toBeVisible()
	await pick.focus()
	await page.keyboard.press("Enter")
	await expect(page.getByText("Replacing pending Statement")).toBeVisible()
	const scope = page.locator("button").filter({ hasText: "Suggested replacements" }).first()
	await scope.focus()
	await page.keyboard.press("Enter")
	const all = page.getByRole("option", { name: "All unallocated imports" })
	await all.focus()
	await page.keyboard.press("Enter")
	const candidateSection = page.locator("section[aria-labelledby='candidate-title']")
	await candidateSection.getByPlaceholder("Search descriptions...").fill("SHENG SIONG")
	const replace = page.getByRole("button", { name: "Replace", exact: true })
	await replace.focus()
	await page.keyboard.press("Enter")
	const review = page.getByRole("dialog", { name: "Review Statement replacement" })
	await expect(review).toBeVisible()
	const confirm = review.getByRole("button", { name: "Replace pending Statement" })
	await confirm.focus()
	await page.keyboard.press("Enter")
	await expect(review).toHaveCount(0)
	await expect(page.getByText("Pending Statement replaced.")).toBeVisible()
	await page.goto(`/records/${IDS.records.pendingStatement}`)
	await expect(
		page.locator("main").getByText("SHENG SIONG 9902").filter({ visible: true }).first(),
	).toBeVisible()
})

test("settings keyboard save persists across reload", async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	await page.goto("/settings")
	const save = page.getByRole("button", { name: "Save default filters" })
	await expect(save).toBeDisabled()
	const trigger = page.locator("#default_filter_end_date")
	await trigger.focus()
	await page.keyboard.press("Enter")
	const today = page.getByRole("option", { name: "Today", exact: true })
	await expect(today).toBeVisible()
	await today.focus()
	await page.keyboard.press("Enter")
	await expect(save).toBeEnabled()
	await save.focus()
	await page.keyboard.press("Enter")
	await expect(page.getByText("Default filters saved.")).toBeVisible()
	await page.reload()
	await expect(page.locator("#default_filter_end_date")).toContainText("Today")
})

test("sync keyboard clear cancelled preserves data", async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	await page.goto("/sync")
	const clear = page.getByRole("button", { name: "Clear all data" })
	await clear.focus()
	await page.keyboard.press("Enter")
	const confirm = page.getByRole("button", { name: "Yes, clear everything" })
	await expect(confirm).toBeVisible()
	// AlertDialogs block Escape; keyboard users dismiss via Cancel.
	const cancel = page.getByRole("button", { name: "Cancel", exact: true })
	await cancel.focus()
	await page.keyboard.press("Enter")
	await expect(page.getByRole("button", { name: "Clear all data" })).toBeVisible()
	await page.goto("/records")
	// The title renders in both the mobile list and the desktop table;
	// exactly one is visible per viewport.
	await expect(
		page.locator("main").getByText("Monthly Salary", { exact: true }).filter({ visible: true }),
	).toBeVisible()
})

test("importer keyboard bank select and invalid rejection", async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	await page.goto("/importer")
	const dbs = page.getByRole("radio", { name: /DBS/ })
	await dbs.focus()
	await page.keyboard.press("Space")
	await expect(dbs).toHaveAttribute("aria-checked", "true")
	const drop = page.getByRole("button", { name: /Drop.*here/ })
	await drop.focus()
	const [chooser] = await Promise.all([
		page.waitForEvent("filechooser"),
		page.keyboard.press("Enter"),
	])
	await chooser.setFiles([
		{ name: "broken.csv", mimeType: "text/csv", buffer: Buffer.from("nope,not,bank\n1,2\n") },
	])
	const importButton = page.getByRole("button", { name: /Import 1 file/ })
	await importButton.focus()
	await page.keyboard.press("Enter")
	await expect(page.getByText("Account details are missing from this export.")).toBeVisible()
})

test("selection bar disabled replace action is honestly disabled", async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	await page.goto("/allocator")
	// Two selections cannot map to one pending replacement: the action stays
	// disabled through the real UI rather than a class assertion.
	for (const id of [IDS.statements.unallocated[2], IDS.statements.unallocated[3]]) {
		await page.getByRole("checkbox", { name: `Select statement ${id}`, exact: true }).click()
	}
	await expect(page.locator("aside strong")).toContainText("2 selected")
	const replace = page.locator("aside").getByRole("button", { name: "Replace Pending" })
	await expect(replace).toBeDisabled()
	const create = page.getByRole("button", { name: "Create Record", exact: true })
	await expect(create).toBeEnabled()
})

test("selection bar on small viewport keeps clear reachable by keyboard", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await page.setViewportSize({ width: 390, height: 844 })
	await page.goto("/allocator")
	const box = page.getByRole("checkbox", {
		name: `Select statement ${IDS.statements.unallocated[3]}`,
		exact: true,
	})
	await expect(box).toBeVisible()
	await box.click()
	const bar = page.locator("aside")
	await expect(bar).toBeVisible()
	const clear = bar.getByRole("button", { name: "Clear", exact: true })
	await expect(clear).toBeInViewport()
	await clear.focus()
	await page.keyboard.press("Enter")
	await expect(box).not.toBeChecked()
	await expect(bar).toHaveCount(0)
})
