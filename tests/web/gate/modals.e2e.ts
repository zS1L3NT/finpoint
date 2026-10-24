import {
	expectDropdownPreservesScroll,
	expectVisibleBackdrop,
	settledOverlayAlpha,
} from "../support/assertions"
import { getScenario, IDS } from "../support/data"
import { expect, test } from "../support/fixtures"

// App modal surfaces share one populated seed. None of them persists: dialogs
// are escaped, reviews are cancelled, and sheets only reopen. Every step
// navigates fresh.
test("app modal surfaces: show backdrops, restore focus and reopen after Escape", async ({
	page,
	workspace,
}) => {
	void workspace
	await test.step("Category editor: focus returns and repeated reopening works", async () => {
		await page.goto("/categories", { waitUntil: "domcontentloaded" })
		const trigger = page.getByRole("button", { name: "Create Category", exact: true })
		await expect(trigger).toBeVisible()
		await trigger.click()
		await expect(page.getByRole("dialog")).toBeVisible()
		await expectVisibleBackdrop(page)
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).toHaveCount(0)
		await expect(trigger).toBeFocused()
		for (let cycle = 0; cycle < 3; cycle++) {
			await trigger.click()
			await expect(page.getByRole("dialog")).toBeVisible()
			await page.keyboard.press("Escape")
			await trigger.click()
			await expect(page.getByRole("dialog")).toHaveCount(1)
			await expectVisibleBackdrop(page)
			await page.keyboard.press("Escape")
			await expect(page.getByRole("dialog")).toHaveCount(0)
		}
	})
	await test.step("Record editor: pending warning content and Escape close work", async () => {
		await page.goto(`/records/${IDS.records.partialPending}`, { waitUntil: "domcontentloaded" })
		const trigger = page.getByRole("button", { name: "Edit Record", exact: true })
		await expect(trigger).toBeVisible()
		await trigger.click()
		await expect(page.getByRole("dialog")).toBeVisible()
		await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
			"Amount does not match the sum of Allocation Amounts",
		)
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).toHaveCount(0)
	})
	await test.step("Statement replacement review: selected content, backdrop and cancel restore sheet", async () => {
		await page.goto("/allocator")
		await page
			.getByRole("checkbox", {
				name: `Select statement ${IDS.statements.unallocated[3]}`,
				exact: true,
			})
			.check()
		await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
		const sheet = page.getByRole("dialog", { name: "Replace a pending Statement", exact: true })
		await expect(sheet).toBeVisible()
		await sheet
			.getByRole("searchbox", { name: "Search pending Statements" })
			.fill("Pasar malam")
		const choice = sheet.getByRole("button").filter({ hasText: "Pasar malam" })
		await choice.click()
		const review = page.getByRole("dialog", {
			name: "Review Statement replacement",
			exact: true,
		})
		await expect(review).toBeVisible()
		await expect(review).toContainText("Pasar malam")
		await expectVisibleBackdrop(page)
		await review.getByRole("button", { name: "Cancel", exact: true }).click()
		await expect(sheet).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(sheet).not.toBeVisible()
	})
})

for (const action of ["Cancel", "Fix"] as const) {
	test(`Duplicate Statement review: exit removes popup and reopen shows new pair${action === "Fix" ? " after Fix" : ""}`, async ({
		page,
		workspace,
	}) => {
		void workspace
		const tables = getScenario("populated").tables
		const keptDescription =
			tables.statements.find(s => s.id === IDS.statements.duplicatePair[0])?.description ?? ""
		const deletedDescription =
			tables.statements.find(s => s.id === IDS.statements.duplicatePair[1])?.description ?? ""
		// Second pair, seeded raw below with primitive literals only: distinct IDs
		// and reworded-but-matching descriptions, same account/day/amount.
		const secondKeepId = "t1-s-dupexit-a"
		const secondDeleteId = "t1-s-dupexit-b"
		const secondKeepDescription = "QUICKEXIT PROBE 5511 SECONDARY"
		const secondDeleteDescription = "SECONDARY 5511 QUICKEXIT PROBE"
		await page.evaluate(
			async ({ keepId, deleteId, keepDescription, deleteDescription }) => {
				const database = await new Promise<IDBDatabase>((resolve, reject) => {
					const open = indexedDB.open("finpoint")
					open.onsuccess = () => resolve(open.result)
					open.onerror = () => reject(open.error)
				})
				try {
					await new Promise<void>((resolve, reject) => {
						const transaction = database.transaction("statements", "readwrite")
						transaction.oncomplete = () => resolve()
						transaction.onabort = () => reject(transaction.error)
						const table = transaction.objectStore("statements")
						table.add({
							id: keepId,
							account_id: "t1-acc-revolut",
							datetime: "2026-10-06 09:14",
							description: keepDescription,
							amount: -28.9,
							index: 3,
							is_pending: 0,
						})
						table.add({
							id: deleteId,
							account_id: "t1-acc-revolut",
							datetime: "2026-10-06 09:14",
							description: deleteDescription,
							amount: -28.9,
							index: 4,
							is_pending: 0,
						})
					})
				} finally {
					database.close()
				}
			},
			{
				keepId: secondKeepId,
				deleteId: secondDeleteId,
				keepDescription: secondKeepDescription,
				deleteDescription: secondDeleteDescription,
			},
		)
		await page.goto("/allocator/duplicates")
		await page.getByRole("radio", { name: `Keep ${keptDescription}`, exact: true }).click()
		await page.getByRole("radio", { name: `Delete ${deletedDescription}`, exact: true }).click()
		const trigger = page.getByRole("button", { name: "Review deletion", exact: true }).first()
		await trigger.click()
		const dialog = page.getByRole("dialog", {
			name: "Delete duplicate Statements",
			exact: true,
		})
		await expect(dialog).toBeVisible()
		await expectVisibleBackdrop(page)
		await dialog
			.getByRole("button", {
				name: action === "Fix" ? /^Delete \d+ Statements?$/ : "Cancel",
			})
			.click()
		await expect(page.getByRole("dialog")).toHaveCount(0)
		await expect(page.locator('[data-slot="dialog-overlay"]')).toHaveCount(0)
		// Reopen with the OTHER seeded pair: the dialog must gate on the new
		// input and show only its rows, proving the latched close content did
		// not leak a stale row. (Reopening the same pair could not distinguish
		// fresh content from a stale latch, so it proves nothing here.)
		const secondCard = page.locator("section", { hasText: secondKeepDescription })
		await secondCard
			.getByRole("radio", { name: `Keep ${secondKeepDescription}`, exact: true })
			.click()
		await secondCard
			.getByRole("radio", { name: `Delete ${secondDeleteDescription}`, exact: true })
			.click()
		await secondCard.getByRole("button", { name: "Review deletion", exact: true }).click()
		await expect(dialog).toBeVisible()
		await expect(dialog).toContainText(secondKeepDescription)
		await expect(dialog).toContainText(secondDeleteDescription)
		await expect(dialog.getByText(keptDescription, { exact: true })).toHaveCount(0)
		await expect(dialog.getByText(deletedDescription, { exact: true })).toHaveCount(0)
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).toHaveCount(0)
	})
}

test.describe("dense workspace", () => {
	test.use({ workspaceScenario: "dense" })
	test.beforeEach(async ({ workspace }) => {
		void workspace
	})

	// One dense seed for all scroll contracts. Every step navigates fresh, so
	// open popups never leak between filters. The harness SelectField case
	// lives in gate/components.
	test("Records filters: preserve the page scrollbar while open", async ({ page }) => {
		for (const label of ["Any monthly budget", "Any treatment", "Any status"] as const) {
			await test.step(`Records filter ${label}: preserves the page scrollbar while open`, async () => {
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
})

test("Record creator: a tall form scrolls its body between a pinned header and footer", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.setViewportSize({ width: 390, height: 600 })
	await page.goto("/allocator")
	await page
		.getByRole("checkbox", {
			name: `Select statement ${IDS.statements.unallocated[2]}`,
			exact: true,
		})
		.click()
	await page
		.getByRole("checkbox", {
			name: `Select statement ${IDS.statements.unallocated[3]}`,
			exact: true,
		})
		.click()
	await page.getByRole("button", { name: "Create Record", exact: true }).click()
	const dialog = page.getByRole("dialog", { name: "Create New Record" })
	await expect(dialog).toBeVisible()
	// Let the popup's finite entrance settle before measuring, so the
	// header/footer comparison below captures scrolling rather than entrance motion.
	await expect
		.poll(() => page.evaluate(() => document.getAnimations().length), {
			message: "popup entrance animations settle",
		})
		.toBe(0)
	const viewport = dialog.locator('[data-slot="dialog-body"] > [data-radix-scroll-area-viewport]')
	await expect
		.poll(() => viewport.evaluate(element => element.scrollHeight - element.clientHeight), {
			message: "tall creator body overflows its viewport",
		})
		.toBeGreaterThan(0)
	const header = dialog.locator('[data-slot="dialog-header"]')
	const footer = dialog.locator('[data-slot="dialog-footer"]')
	const chrome = () =>
		dialog.evaluate(dialogElement => {
			const rect = (slot: string) => {
				const node = dialogElement.querySelector(`[data-slot="${slot}"]`)
				return node?.getBoundingClientRect().toJSON() ?? null
			}
			return { header: rect("dialog-header"), footer: rect("dialog-footer") }
		})
	const before = await chrome()
	await viewport.evaluate(element => {
		element.scrollTop = element.scrollHeight
	})
	await expect
		.poll(() => viewport.evaluate(element => element.scrollTop), {
			message: "scrolling the body changes scrollTop",
		})
		.toBeGreaterThan(0)
	expect(await chrome()).toEqual(before)
	const save = footer.getByRole("button", { name: "Create Record", exact: true })
	const cancel = footer.getByRole("button", { name: "Cancel", exact: true })
	await expect(save).toBeVisible()
	await expect(save).toBeInViewport()
	await expect(cancel).toBeVisible()
	await expect(cancel).toBeInViewport()
	await expect(header).toBeInViewport()
})

test("app modal surfaces: backdrops darken the page at half opacity", {
	tag: ["@light"],
}, async ({ page, workspace }) => {
	void workspace
	await test.step("dialog overlay: settled colour alpha reads half", async () => {
		await page.goto("/categories", { waitUntil: "domcontentloaded" })
		await page.getByRole("button", { name: "Create Category", exact: true }).click()
		await expect(page.getByRole("dialog")).toBeVisible()
		const alpha = await settledOverlayAlpha(page, "dialog-overlay")
		expect(alpha).toBeGreaterThan(0.48)
		expect(alpha).toBeLessThan(0.52)
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).toHaveCount(0)
	})
	await test.step("sheet overlay: settled colour alpha reads half", async () => {
		await page.goto("/allocator")
		await page
			.getByRole("checkbox", {
				name: `Select statement ${IDS.statements.unallocated[3]}`,
				exact: true,
			})
			.check()
		await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
		const sheet = page.getByRole("dialog", { name: "Replace a pending Statement", exact: true })
		await expect(sheet).toBeVisible()
		const alpha = await settledOverlayAlpha(page, "sheet-overlay")
		expect(alpha).toBeGreaterThan(0.48)
		expect(alpha).toBeLessThan(0.52)
		await page.keyboard.press("Escape")
		await expect(sheet).not.toBeVisible()
	})
})
