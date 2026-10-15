import {
	expectPointerCursor,
	expectReducedRowMovement,
	expectVisibleRowCascade,
	sampleVisibleRowAnimations,
} from "./support/assertions"
import { IDS } from "./support/data"
import { expect, seedWorkspace, test } from "./support/fixtures"

for (const [route, title] of [
	["/", "Dashboard"],
	["/records", "Records"],
	["/statements", "Statements"],
	["/accounts", "Accounts"],
	["/budgets", "Budgets"],
	["/categories", "Categories"],
	["/allocator", "Workflows"],
	["/allocator/pending", "Workflows"],
	["/allocator/duplicates", "Workflows"],
	["/importer", "Importer"],
	["/settings", "Settings"],
	["/sync", "Data"],
	["/privacy", "Privacy Policy"],
	["/terms", "Terms of Service"],
	["/records/monthly?month=October&year=2026", "Monthly Records"],
	["/accounts/t1-acc-dbs", "Account"],
	["/budgets/t1-b-manual", "Budget"],
	["/records/t1-r-partial", "Record"],
	["/statements/t1-s-pending", "Statement"],
] as const) {
	test(`route.layout ${route} keeps populated content and enabled controls inside the viewport`, async ({
		page,
		workspace,
	}) => {
		void workspace
		await page.goto(route)
		await expect(page.locator("main h2").first()).toBeVisible()
		await expect(page.locator("header h1")).toHaveText(title)
		await expect(page.locator("header h1")).toBeVisible()
		// These labels are rendered only after the relevant live queries resolve.
		if (route === "/records")
			await expect(
				page.getByRole("link", { name: "Open FairPrice Run", exact: true }),
			).toBeVisible()
		if (route === "/statements" || route === "/allocator")
			await expect(page.getByRole("link", { name: "Open statement" }).first()).toBeVisible()
		if (["/accounts", "/budgets", "/categories"].includes(route))
			await expect(page.locator("main article").first()).toBeVisible()
		if (route === "/")
			await expect(
				page.locator("div.min-h-24.bg-card", { hasText: "Total spending" }),
			).toBeVisible()
		await expect(page).toHaveTitle(/ · Finpoint$/)
		await expect(page.locator("html")).toHaveClass(
			test.info().project.name === "dark" ? /dark/ : /^(?!.*\bdark\b)/,
		)
		const main = page.locator("main")
		expect(
			await main.evaluate(element => element.scrollWidth - element.clientWidth),
			route,
		).toBeLessThanOrEqual(1)
		const controls = main.locator(
			'button:visible:not(:disabled), [role="button"]:visible:not([aria-disabled="true"])',
		)
		for (const control of await controls.all()) {
			await expect(control).toHaveCSS("cursor", "pointer")
			const box = await control.boundingBox()
			if (!box) throw new Error("Visible control needs a layout box")
			expect(box.x, route).toBeGreaterThanOrEqual(-1)
			expect(box.x + box.width, route).toBeLessThanOrEqual(
				(page.viewportSize()?.width ?? 0) + 1,
			)
		}
	})
}

for (const [route, empty] of [
	["/allocator", "No statements found.", "Workflows"],
	["/allocator/pending", "No pending Statements", "Workflows"],
	["/allocator/duplicates", "No duplicates found", "Workflows"],
] as const) {
	test(`route.empty ${route} resolves without premature loading copy`, async ({ page }) => {
		await seedWorkspace(page, "empty")
		await page.goto(route)
		await expect(page.getByText(empty, { exact: true }).filter({ visible: true })).toBeVisible()
		await expect(page.getByText(/^(Loading|Please wait)/)).toHaveCount(0)
	})
}

for (const [route, store, action] of [
	["/accounts", "accounts", "Rename"],
	["/budgets", "budgets", "Edit"],
	["/categories", "categories", "Edit"],
] as const) {
	test(`route.long ${route} keeps all oversized names and editor buttons reachable by pointer`, async ({
		page,
	}) => {
		await seedWorkspace(page)
		await page.evaluate(async store => {
			const database = await new Promise<IDBDatabase>((resolve, reject) => {
				const open = indexedDB.open("finpoint")
				open.onsuccess = () => resolve(open.result)
				open.onerror = () => reject(open.error)
			})
			await new Promise<void>((resolve, reject) => {
				const transaction = database.transaction(store, "readwrite")
				transaction.oncomplete = () => {
					database.close()
					resolve()
				}
				transaction.onabort = () => {
					database.close()
					reject(transaction.error)
				}
				const rows = transaction.objectStore(store).getAll()
				rows.onsuccess = () =>
					rows.result.forEach((row, index) =>
						transaction
							.objectStore(store)
							.put({ ...row, name: `${index} café 早餐 ${"Long name ".repeat(22)}` }),
					)
			})
		}, store)
		await page.goto(route)
		await expect(page.locator("main article").first()).toBeVisible()
		const button = page.getByRole("button", { name: new RegExp(`^${action} 0 café`) })
		await expectPointerCursor(button)
		expect(
			await page
				.locator("main")
				.evaluate(element => element.scrollWidth - element.clientWidth),
		).toBeLessThanOrEqual(1)
		await button.click()
		await expect(page.getByRole("dialog")).toBeVisible()
		await expect(
			page.getByRole("dialog").getByRole("textbox", { name: /Name/ }).first(),
		).toHaveValue(/^0 café 早餐 Long name/)
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).toHaveCount(0)
	})
}

for (const route of ["/records", "/statements"] as const) {
	test(`route.refilter ${route} reveals every visible result with an entrance`, async ({
		page,
	}) => {
		await seedWorkspace(page, "dense")
		await page.goto(`${route}?query=missing-ui-result&per_page=100`)
		await expect(
			page
				.getByText(route === "/records" ? "No records found." : "No statements found.", {
					exact: true,
				})
				.filter({ visible: true }),
		).toBeVisible()
		const samples = await sampleVisibleRowAnimations(
			page,
			'tbody tr:has(a[aria-label^="Open "]), div.grid-cols-subgrid:has(a[aria-label^="Open "])',
			async () => {
				await page
					.getByPlaceholder(
						route === "/records"
							? "Search title, people, location, description..."
							: "Search descriptions...",
					)
					.fill("")
			},
		)
		if (test.info().project.name === "reduced-motion") expectReducedRowMovement(samples)
		else expectVisibleRowCascade(samples)
	})
}

test("route.selection multiple selections retain values after cancelling keyboard creation", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto("/allocator")
	await expect(
		page.getByRole("checkbox", {
			name: `Select statement ${IDS.statements.unallocated[2]}`,
			exact: true,
		}),
	).toBeVisible()
	const row = page.getByRole("checkbox", {
		name: `Select statement ${IDS.statements.unallocated[2]}`,
		exact: true,
	})
	await expect(page.getByRole("button", { name: "Create Record", exact: true })).toHaveCount(0)
	await row.click()
	await expect(page.locator("aside strong")).toContainText("1 selected")
	await page
		.getByRole("checkbox", {
			name: `Select statement ${IDS.statements.unallocated[3]}`,
			exact: true,
		})
		.click()
	await expect(page.locator("aside strong")).toContainText("2 selected")
	const create = page.getByRole("button", { name: "Create Record", exact: true })
	await expectPointerCursor(create)
	await create.focus()
	await page.keyboard.press("Enter")
	await expect(page.getByRole("dialog", { name: "Create New Record" })).toBeVisible()
	await page.keyboard.press("Escape")
	await expect(page.getByRole("dialog")).toHaveCount(0)
	await expect(row).toBeChecked()
	const second = page.getByRole("checkbox", {
		name: `Select statement ${IDS.statements.unallocated[3]}`,
		exact: true,
	})
	await expect(second).toBeChecked()
	await expect(page.locator("aside strong")).toContainText("-$59.20")
	const clear = page.locator("aside").getByRole("button", { name: "Clear", exact: true })
	await expectPointerCursor(clear)
	await expect(clear).toBeInViewport()
	const rect = await clear.boundingBox()
	if (!rect) throw new Error("Clear selection must have a hit target")
	expect(
		await clear.evaluate(
			(element, box) =>
				element.contains(
					document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2),
				),
			rect,
		),
	).toBe(true)
	const retainedRow = row.locator(
		'xpath=ancestor::*[self::tr or contains(@class,"grid-cols-subgrid")][1]',
	)
	const remaining = await retainedRow.elementHandle()
	await clear.focus()
	await page.keyboard.press("Enter")
	await expect(row).not.toBeChecked()
	await expect(second).not.toBeChecked()
	await expect(page.locator("aside")).toHaveCount(0)
	expect(await retainedRow.evaluate((element, before) => element === before, remaining)).toBe(
		true,
	)
	await remaining?.dispose()
})
