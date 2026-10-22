import type { Locator } from "@playwright/test"
import { expectPointerCursor, expectVisibleBackdrop } from "./support/assertions"
import { IDS } from "./support/data"
import { expect, test } from "./support/fixtures"

const longName = "café 日本語 — Long description ".repeat(8).trim()

async function containedFooter(dialog: Locator) {
	await expect(dialog).toBeVisible()
	expect(
		await dialog.evaluate(element => element.scrollWidth - element.clientWidth),
	).toBeLessThanOrEqual(1)
	for (const action of await dialog.locator('[data-slot="dialog-footer"] button:visible').all()) {
		await action.scrollIntoViewIfNeeded()
		await expect(action).toBeInViewport()
		if (await action.isEnabled()) {
			await expectPointerCursor(action)
			await action.click({ trial: true })
		}
	}
	const cancel = dialog.getByRole("button", { name: "Cancel", exact: true })
	await cancel.scrollIntoViewIfNeeded()
	await expectPointerCursor(cancel)
	await expect(cancel).toBeInViewport()
	await cancel.click({ trial: true })
	await cancel.focus()
	await cancel.press("Enter")
	await expect(dialog).not.toBeVisible()
}

test.beforeEach(async ({ workspace }) => {
	void workspace
})

// Creator long-content checks share one seed: every step cancels through the
// footer, so no step persists anything for the next one.
test("editor long creator content shares one seed", async ({ page }) => {
	for (const [route, trigger, title, label] of [
		["/budgets", "New Budget", "Create Budget", "Name"],
		["/categories", "Create Category", "Create Category", "Name"],
		["/?month=October&year=2026", "New", "Create monthly budget", "Name"],
		["/statements", "Create Pending Statement", "Create Pending Statement", "Description"],
	] as const) {
		await test.step(`editor.long ${title} contains Unicode content and keeps keyboard cancellation reachable`, async () => {
			await page.goto(route)
			await page.getByRole("button", { name: trigger, exact: true }).click()
			const dialog = page.getByRole("dialog", { name: title, exact: true })
			await dialog.getByLabel(label, { exact: true }).fill(longName)
			await expect(dialog.getByLabel(label, { exact: true })).toHaveValue(longName)
			await expectVisibleBackdrop(page)
			await containedFooter(dialog)
		})
	}
})

// Review long-content checks share one seed: both steps rewrite the same four
// descriptions to the same absolute values, so the second rewrite is
// idempotent and the dialogs under test differ per step.
test("editor long review content shares one seed", async ({ page }) => {
	for (const kind of ["duplicate", "replacement"] as const) {
		await test.step(`editor.long ${kind} review contains long imported descriptions and keeps its footer usable`, async () => {
			await page.evaluate(async description => {
				const database = await new Promise<IDBDatabase>((resolve, reject) => {
					const open = indexedDB.open("finpoint")
					open.onsuccess = () => resolve(open.result)
					open.onerror = () => reject(open.error)
				})
				await new Promise<void>((resolve, reject) => {
					const transaction = database.transaction("statements", "readwrite")
					transaction.oncomplete = () => {
						database.close()
						resolve()
					}
					transaction.onabort = () => reject(transaction.error)
					const store = transaction.objectStore("statements")
					for (const id of ["t1-s-dup-a", "t1-s-dup-b", "t1-s-pending", "t1-s-free-2"]) {
						const request = store.get(id)
						request.onsuccess = () =>
							store.put({ ...request.result, description: `${description} ${id}` })
					}
				})
			}, longName)
			if (kind === "duplicate") {
				await page.goto("/allocator/duplicates?view=all")
				await page
					.getByRole("radio", { name: `Keep ${longName} t1-s-dup-a`, exact: true })
					.click()
				await page
					.getByRole("radio", { name: `Delete ${longName} t1-s-dup-b`, exact: true })
					.click()
				await page
					.getByRole("button", { name: "Review deletion", exact: true })
					.and(page.locator("button:not(:disabled)"))
					.click()
			} else {
				await page.goto("/allocator")
				await page
					.getByRole("checkbox", {
						name: `Select statement ${IDS.statements.unallocated[3]}`,
						exact: true,
					})
					.check()
				await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
				await page
					.getByRole("dialog", { name: "Replace a pending Statement", exact: true })
					.getByRole("button")
					.filter({ hasText: `${longName} t1-s-pending` })
					.click()
			}
			const dialog = page.getByRole("dialog", {
				name:
					kind === "duplicate"
						? "Delete duplicate Statements"
						: "Review Statement replacement",
				exact: true,
			})
			await expect(dialog).toContainText(longName)
			await expectVisibleBackdrop(page)
			await containedFooter(dialog)
		})
	}
})
