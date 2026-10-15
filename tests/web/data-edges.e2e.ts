import { expectPointerCursor } from "./support/assertions"
import { getScenario, IDS } from "./support/data"
import { expect, seedWorkspace, test } from "./support/fixtures"

test("data.archiving Monthly Budget editor persists archival without erasing historical assignment", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto("/?month=October&year=2026")
	await page.getByRole("button", { name: "Edit Daily", exact: true }).click()
	const dialog = page.getByRole("dialog", { name: "Edit Daily", exact: true })
	await dialog.getByRole("checkbox", { name: "Archive monthly budget", exact: true }).check()
	await dialog.getByRole("button", { name: "Save changes", exact: true }).click()
	await expect(dialog).not.toBeVisible()
	await page.reload()
	const archived = await page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>(resolve => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
		})
		return await new Promise<boolean>(resolve => {
			const request = database
				.transaction("monthly_budgets", "readonly")
				.objectStore("monthly_budgets")
				.get("t1-mb-daily")
			request.onsuccess = () => {
				database.close()
				resolve(request.result.archived)
			}
		})
	})
	expect(archived).toBe(true)
	await page.goto(`/records/${IDS.records.unicode}`)
	await expect(page.getByText(/Monthly budget ·/)).toContainText("Daily")
})

test("data.archived historical assignment retains its badge, total and disabled editor option", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
			open.onerror = () => reject(open.error)
		})
		await new Promise<void>((resolve, reject) => {
			const transaction = database.transaction("records", "readwrite")
			transaction.oncomplete = () => {
				database.close()
				resolve()
			}
			transaction.onabort = () => reject(transaction.error)
			const store = transaction.objectStore("records")
			const request = store.get("t1-r-unicode")
			request.onsuccess = () =>
				store.put({
					...request.result,
					monthly_budget_id: "t1-mb-travel",
					monthly_budget_source: "manual",
				})
		})
	})
	await page.goto(`/records/${IDS.records.unicode}`)
	await expect(page.getByText(/Monthly budget ·/)).toContainText("Travel")
	await page.getByRole("button", { name: "Edit Record", exact: true }).click()
	const dialog = page.getByRole("dialog", { name: "Edit Record", exact: true })
	const budget = dialog.getByRole("combobox").filter({ hasText: "Travel" })
	await expect(budget).toBeVisible()
	await budget.click()
	await expect(page.getByRole("option", { name: "Travel", exact: true })).toBeDisabled()
	await page.keyboard.press("Escape")
	await expect(dialog).toBeVisible()
	await page.keyboard.press("Escape")
	await page.goto("/records/monthly?month=October&year=2026&monthly_budget_id=t1-mb-travel")
	await expect(
		page.getByRole("link", { name: /^Open Kōpi/ }).filter({ visible: true }),
	).toBeVisible()
	await expect(page.locator("main")).toContainText("-$33.33")
})

test("data.statement cells retain pending, allocation, zero and signed amount meaning", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>(resolve => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
		})
		await new Promise<void>((resolve, reject) => {
			const transaction = database.transaction("statements", "readwrite")
			transaction.oncomplete = () => {
				database.close()
				resolve()
			}
			transaction.onabort = () => reject(transaction.error)
			transaction.objectStore("statements").put({
				id: "t1-s-zero",
				account_id: "t1-acc-dbs",
				datetime: "2026-10-15 12:00",
				description: "Zero imported balance row",
				amount: 0,
				index: 1,
				is_pending: 0,
			})
		})
	})
	await page.goto("/statements?per_page=100")
	const data = getScenario("populated").tables
	for (const id of [IDS.statements.pending, "t1-s-partial", "t1-s-refund", "t1-s-zero"]) {
		const statement =
			id === "t1-s-zero"
				? { description: "Zero imported balance row", amount: 0, is_pending: 0 }
				: data.statements.find(row => row.id === id)
		if (!statement) throw new Error(`Missing fixture ${id}`)
		const link = page
			.getByRole("link", { name: "Open statement", exact: true })
			.and(page.locator(`[href="/statements/${id}"]`))
			.filter({ visible: true })
		const row = link.locator(
			'xpath=ancestor::*[self::tr or contains(@class,"grid-cols-subgrid")][1]',
		)
		await expect(row).toContainText(statement.description)
		const money = `${statement.amount < 0 ? "-" : ""}$${Math.abs(statement.amount).toFixed(2)}`
		await expect(row).toContainText(money)
		if (statement.is_pending)
			await expect(row.getByText("Pending", { exact: true })).toBeVisible()
		else await expect(row.getByText("Pending", { exact: true })).toHaveCount(0)
		const allocation = data.allocations
			.filter(item => item.statement_id === id)
			.reduce((sum, item) => sum + item.amount, 0)
		if (allocation === statement.amount && statement.amount !== 0)
			await expect(row.getByText("Unallocated", { exact: true })).toHaveCount(0)
		const remaining = Math.round((statement.amount - allocation) * 100) / 100
		if (allocation !== 0 && remaining !== 0)
			await expect(row).toContainText(
				`${remaining < 0 ? "-" : ""}$${Math.abs(remaining).toFixed(2)} allocable`,
			)
		await expectPointerCursor(link)
	}
})
