import { expect, seedWorkspace, test } from "./support/fixtures"

// Every empty, missing or loading message these routes can show. None may appear
// while the database is still opening, because the data has not been read yet.
const PREMATURE = [
	"Loading",
	"Please wait",
	"No records found.",
	"No matching Records",
	"No statements found.",
	"No Statements",
	"No pending Statements",
	"No unallocated imports",
	"No accounts yet.",
	"No categories yet.",
	"No categories found.",
	"No budgets yet.",
	"No Allocations",
	"No statements allocated yet",
	"Account not found.",
	"Budget not found.",
	"Record not found.",
	"Statement not found.",
	"Page not found",
]

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
		// Watch every frame of a held interval, not a single moment.
		const seen = await page.evaluate(
			premature =>
				new Promise<string[]>(resolve => {
					const found = new Set<string>()
					const end = performance.now() + 500
					const check = () => {
						const text = document.body.innerText
						for (const message of premature)
							if (text.includes(message)) found.add(message)
						if (
							document.querySelector(
								'[data-slot="skeleton"], [role="progressbar"], [aria-busy="true"]',
							)
						)
							found.add("loading indicator")
						if (performance.now() > end) resolve([...found])
						else requestAnimationFrame(check)
					}
					check()
				}),
			PREMATURE,
		)
		expect(seen, "nothing premature renders while the database is opening").toEqual([])
		expect(
			await page.evaluate(() => Reflect.get(window, "__pendingDatabaseOpen")),
		).toBeGreaterThan(0)
		await expect(page.getByText(ready, { exact: false }).filter({ visible: true })).toHaveCount(
			0,
		)
		await page.evaluate(() => Reflect.get(window, "__resumeDatabase")())
		await expect(
			page.getByText(ready, { exact: false }).filter({ visible: true }).first(),
		).toBeVisible()
	})
}
