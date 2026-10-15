import { expect, seedWorkspace, test } from "./support/fixtures"

for (const [route, ready] of [
	["/records", "FairPrice Run"],
	["/statements", "Pasar malam snacks"],
	["/allocator", "STARBUCKS 4455"],
	["/allocator/pending", "Pasar malam snacks"],
	["/accounts/t1-acc-dbs", "Everyday Savings"],
	["/budgets/t1-b-manual", "October Buffer"],
	["/statements/t1-s-pending", "Pasar malam snacks"],
	["/accounts", "Everyday Savings"],
	["/categories", "Groceries"],
	["/budgets", "October Buffer"],
	["/records/t1-r-partial", "Hawker Dinner"],
] as const) {
	test(`loading.local ${route} stays silent while the database is opening then reveals actual data`, async ({
		page,
	}) => {
		await seedWorkspace(page)
		await page.addInitScript(() => {
			const open = indexedDB.open.bind(indexedDB)
			const waiting: (() => void)[] = []
			Object.defineProperty(window, "__pendingDatabaseOpen", { get: () => waiting.length })
			Object.defineProperty(window, "__resumeDatabase", {
				value: () => {
					indexedDB.open = open
					for (const resume of waiting.splice(0)) resume()
				},
			})
			indexedDB.open = (...args: Parameters<IDBFactory["open"]>) => {
				const request = open(...args)
				if (args[0] !== "finpoint") return request
				let callback: IDBOpenDBRequest["onsuccess"] = null
				Object.defineProperty(request, "onsuccess", {
					get: () => callback,
					set: handler => {
						callback = handler
					},
				})
				request.addEventListener("success", event =>
					waiting.push(() => callback?.call(request, event)),
				)
				return request
			}
		})
		await page.goto(route)
		await expect(page.locator("header h1")).toBeVisible()
		await expect
			.poll(() => page.evaluate(() => Reflect.get(window, "__pendingDatabaseOpen")))
			.toBeGreaterThan(0)
		await expect(
			page.getByText(
				/^(Loading|Please wait|No records found\.|No accounts yet\.|No categories yet\.|No budgets yet\.|Record not found\.)/,
			),
		).toHaveCount(0)
		await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0)
		await expect(page.getByText(ready, { exact: false }).filter({ visible: true })).toHaveCount(
			0,
		)
		await page.evaluate(() => Reflect.get(window, "__resumeDatabase")())
		await expect(
			page.getByText(ready, { exact: false }).filter({ visible: true }).first(),
		).toBeVisible()
	})
}
