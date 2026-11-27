import { expect, type Locator, type Page } from "@playwright/test"

export type MotionConsumer = {
	name: string
	origin: string
	action: "nav" | "sheet" | "workflow" | "heading" | "link" | "statement" | "view" | "pending"
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
