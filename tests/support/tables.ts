import { expect, type Locator, type Page } from "@playwright/test"

// Mobile sidebar taps race hydration: useIsMobile() starts false and flips in
// a mount effect, so a tap before that commit toggles the invisible desktop
// state and nothing opens. localStorage.history survives reloads and gotos, so
// a pre-existing marker proves nothing about the current mount — clear it and
// reload first; the rewritten marker then proves THIS document hydrated (the
// history provider wraps the sidebar's, so both mount effects commit in the
// same pass). Retry the tap boundedly for swallowed taps under load. The
// visible dialog below stays the strict proof: a genuinely broken sheet still
// fails there, and single-tap reliability stays covered by the header-trigger
// keyboard test.
/** Phones open the sidebar from the tab bar's Menu; the header trigger is desktop-only. */
export const mobileMenu = (page: Page) =>
	page
		.getByRole("navigation", { name: "Primary" })
		.getByRole("button", { name: "Menu", exact: true })

/** Phones fold table filters behind one Filters button and sheet; wider screens show them inline. */
export async function openTableFilters(page: Page, isMobile: boolean) {
	if (isMobile) await page.getByRole("button", { name: /^Filters/ }).click()
}

/** The open sheet is modal: close it before asserting on or clicking the list behind it. */
export async function closeTableFilters(page: Page, isMobile: boolean) {
	if (isMobile) await page.getByRole("button", { name: "Done", exact: true }).click()
}

export async function openMobileSidebarFromConsumerMotion(page: Page) {
	await page.evaluate(() => localStorage.removeItem("history"))
	await page.reload()
	await expect.poll(() => page.evaluate(() => localStorage.getItem("history"))).not.toBeNull()
	const trigger = mobileMenu(page)
	for (let attempt = 0; attempt < 3; attempt++) {
		await trigger.click()
		await page.waitForTimeout(500)
		if ((await page.getByRole("dialog").count()) > 0) break
	}
	await expect(page.getByRole("dialog")).toBeVisible()
}

export type MotionConsumer = {
	name: string
	origin: string
	action:
		| "sidebar"
		| "month-tab"
		| "workflow"
		| "heading"
		| "link"
		| "statement"
		| "view"
		| "pending"
	target: string
	selector: string
	dense: boolean
	future?: boolean
}

export async function patchRows(
	page: Page,
	store: string,
	rows: { id?: string; month?: string; [key: string]: unknown }[],
) {
	await page.evaluate(
		async ({ store, rows }) => {
			const database = await new Promise<IDBDatabase>((resolve, reject) => {
				const open = indexedDB.open("finpoint")
				open.onsuccess = () => resolve(open.result)
				open.onerror = () => reject(open.error)
			})
			try {
				await new Promise<void>((resolve, reject) => {
					const transaction = database.transaction(store, "readwrite")
					transaction.oncomplete = () => resolve()
					transaction.onabort = () => reject(transaction.error)
					const table = transaction.objectStore(store)
					for (const row of rows) {
						const request = table.get(row.id ?? row.month ?? "")
						request.onsuccess = () => table.put({ ...request.result, ...row })
					}
				})
			} finally {
				database.close()
			}
		},
		{ store, rows },
	)
}

export async function fits(page: Page, element: Locator) {
	await expect(element).toBeVisible()
	const box = await element.boundingBox()
	if (!box) throw new Error("Expected visible geometry")
	expect(box.x).toBeGreaterThanOrEqual(-1)
	expect(box.x + box.width).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + 1)
	expect(
		await page.locator("main").evaluate(el => el.scrollWidth - el.clientWidth),
	).toBeLessThanOrEqual(1)
}

export function statementRow(page: Page, id: string) {
	return page
		.locator(`main a[href="/statements/${id}"]`)
		.filter({ visible: true })
		.locator('xpath=ancestor::*[self::tr or contains(@class,"grid-cols-subgrid")][1]')
}
