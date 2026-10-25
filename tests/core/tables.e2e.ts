import { expectPointerCursor } from "../support/assertions"
import { getScenario, IDS } from "../support/data"
import { setDateOnly } from "../support/date-only"
import { pickOption } from "../support/editors"
import { expect, seedWorkspace, test } from "../support/fixtures"
import { fits, patchRows, statementRow } from "../support/tables"

test("Records table: rendered Records keep zero, negative amounts and pending reasons", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto("/records")
	const zero = page
		.getByRole("link", { name: "Open Rounding Adjustment", exact: true })
		.locator("xpath=ancestor::*[self::tr or contains(@class, 'grid-cols-subgrid')][1]")
	await expect(zero).toContainText("$0.00")
	const partial = page
		.getByRole("link", { name: "Open Hawker Dinner", exact: true })
		.locator("xpath=ancestor::*[self::tr or contains(@class, 'grid-cols-subgrid')][1]")
	await expect(partial).toContainText("-$60.00")
	await expect(partial.getByText("Pending", { exact: true })).toHaveAttribute(
		"title",
		"-$25.00 of -$60.00 allocated",
	)
	const groceries = page
		.getByRole("link", { name: "Open FairPrice Run", exact: true })
		.locator("xpath=ancestor::*[self::tr or contains(@class, 'grid-cols-subgrid')][1]")
	await expect(groceries).toContainText("-$84.20")
	await expect(groceries.getByText("Pending", { exact: true })).toHaveCount(0)
})

test("table refilter: settled search results keep their query in the URL", {
	tag: ["@tall", "@light"],
}, async ({ page }) => {
	await seedWorkspace(page, "dense")
	for (const route of ["/records", "/statements"] as const) {
		await test.step(`table refilter ${route}: settled search keeps the query in the URL`, async () => {
			const query = route === "/records" ? "Dense Record 1" : "Dense Record 1"
			await page.goto(`${route}?query=${encodeURIComponent(query)}&per_page=100`)
			const search = page.getByPlaceholder(
				route === "/records"
					? "Search title, people, location, description..."
					: "Search descriptions...",
			)
			const selector = `tbody tr:has(a[href^="${route}/"]), div.grid-cols-subgrid:has(a[href^="${route}/"])`
			await expect(page.locator(selector).filter({ visible: true }).first()).toBeVisible()
			await search.fill(query.replace("1", "2"))
			await expect(page).toHaveURL(/query=Dense\+.*\+2/)
		})
	}
})

test("table paging: first page shows five rows and next page moves the URL to page 2", {
	tag: ["@tall", "@light"],
}, async ({ page }) => {
	await seedWorkspace(page, "dense")
	for (const route of ["/records", "/statements"] as const) {
		await test.step(`table paging ${route}: first page shows five rows and next page moves the URL to page 2`, async () => {
			await page.goto(`${route}?per_page=5`)
			const rows = `tbody tr:has(a[href^="${route}/"]), div.grid-cols-subgrid:has(a[href^="${route}/"])`
			await expect(page.locator(rows).filter({ visible: true })).toHaveCount(5)
			await page.getByRole("link", { name: "Go to next page" }).click()
			await expect(page).toHaveURL(/page=2/)
		})
	}
})

test("allocator selection: multiple selections retain their values after cancelling keyboard creation", async ({
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

test("Budget detail: detaching a Record keeps the remaining row node and persists the detachment", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.setViewportSize({ width: 1920, height: 1440 })
	await page.goto("/budgets/t1-b-manual")
	const selector = 'tbody tr:has(a[href="/records/t1-r-unicode"])'
	const kept = page.locator(selector).filter({ visible: true })
	const original = await kept.elementHandle()
	if (!original) throw new Error("Expected the retained budget Record")
	await page.getByRole("button", { name: "Detach FairPrice Run", exact: true }).click()
	await expect(
		page.getByRole("button", { name: "Detach FairPrice Run", exact: true }),
	).toHaveCount(0)
	expect(await original.evaluate(element => element.isConnected)).toBe(true)
	await page.reload()
	await expect(page.getByRole("link", { name: /^Open Kōpi/ })).toBeVisible()
	await expect(
		page.getByRole("button", { name: "Detach FairPrice Run", exact: true }),
	).toHaveCount(0)
})

test.describe("pinned 15 October 2026 date", () => {
	test.beforeEach(async ({ page }) => {
		await setDateOnly(page, new Date("2026-10-15T12:00:00+08:00"))
	})
	test("table pagination: search stays in the URL, pages move and out-of-range pages clamp", async ({
		page,
	}) => {
		test.setTimeout(90_000)
		await seedWorkspace(page, "dense")
		for (const [route, noun, search, subject] of [
			[
				"/records",
				"record",
				"Search title, people, location, description...",
				"Records table",
			],
			["/statements", "statement", "Search descriptions...", "Statements table"],
		] as const) {
			await test.step(`${subject}: keeps search in the URL and moves between pages`, async () => {
				await page.goto(`${route}?per_page=10`)
				await expect(
					page.getByText(new RegExp(`Showing 10 of \\d+ ${noun}s\\.`)),
				).toBeVisible()
				await expect(
					page.getByRole("link", { name: "Go to previous page" }),
				).toHaveAttribute("aria-disabled", "true")
				const first = await page
					.getByRole("link", {
						name: noun === "record" ? /^Open Dense Record/ : "Open statement",
					})
					.first()
					.getAttribute("href")
				await page.getByRole("link", { name: "Go to next page" }).click()
				await expect(page).toHaveURL(/page=2/)
				await expect(
					page
						.getByRole("link", {
							name: noun === "record" ? /^Open Dense Record/ : "Open statement",
						})
						.first(),
				).not.toHaveAttribute("href", first ?? "")
				await page.getByPlaceholder(search).fill("Dense Record 1")
				await expect(page).toHaveURL(/query=Dense(?:\+|%20)Record(?:\+|%20)1/)
				await expect(page).not.toHaveURL(/page=2/)
				await page.reload()
				await expect(page.getByPlaceholder(search)).toHaveValue("Dense Record 1")
			})
		}
		await test.step("Records table: an out-of-range page clamps to the last page with no dead links", async () => {
			await page.goto("/records?per_page=10&page=999")
			await expect(page.getByText("Showing 10 of 60 records.", { exact: true })).toBeVisible()
			await expect(page.getByRole("link", { name: "Go to next page" })).toHaveAttribute(
				"aria-disabled",
				"true",
			)
			await expect(page.getByRole("link", { name: "Go to next page" })).toHaveAttribute(
				"href",
				/page=6/,
			)
			await expect(page.locator('[aria-current="page"]')).toHaveText("6")
			await page.getByRole("link", { name: "Go to previous page" }).click()
			await expect(page).toHaveURL(/page=5/)
			await expect(page.getByText("Showing 10 of 60 records.", { exact: true })).toBeVisible()
		})
	})
	test("Records table: Category selection narrows Records and survives reload", async ({
		page,
	}) => {
		await seedWorkspace(page)
		await page.goto("/records")
		await page.getByRole("button", { name: "Any category", exact: true }).click()
		await page.getByPlaceholder("Search categories...").fill("Groceries")
		await pickOption(page.getByRole("option", { name: "Groceries", exact: true }))
		await page.keyboard.press("Escape")
		await expect(page).toHaveURL(new RegExp(`category_ids=${IDS.categories.groceries}`))
		await expect(
			page.getByRole("link", { name: "Open FairPrice Run", exact: true }),
		).toBeVisible()
		await expect(
			page.getByRole("link", { name: "Open Monthly Salary", exact: true }),
		).toHaveCount(0)
		await page.reload()
		await expect(page.getByRole("button", { name: "1 category", exact: true })).toBeVisible()
		await page.getByRole("button", { name: /^Clear/ }).click()
		await expect(page).not.toHaveURL(/category_ids=/)
		await expect(
			page.getByRole("link", { name: "Open Monthly Salary", exact: true }),
		).toBeVisible()
	})
	test("Records table: zero and signed amount filters apply, same-day subtotal and paid zero work", async ({
		page,
	}) => {
		await seedWorkspace(page)
		await test.step("Records table: zero is a real amount filter and paid and received ranges retain sign", async () => {
			await page.goto("/records?min_amount=0&max_amount=0")
			await expect(
				page.getByRole("link", { name: "Open Rounding Adjustment", exact: true }),
			).toBeVisible()
			await expect(page.getByText("Showing 1 of 1 record.", { exact: true })).toBeVisible()
			await page.goto("/records?min_amount=-100&max_amount=-80")
			await expect(
				page.getByRole("link", { name: "Open FairPrice Run", exact: true }),
			).toBeVisible()
			await expect(
				page.getByRole("link", { name: "Open Uniqlo Basics", exact: true }),
			).toBeVisible()
			await expect(
				page.getByRole("link", { name: "Open Returned Kettle", exact: true }),
			).toHaveCount(0)
			await page.goto("/records?min_amount=20&max_amount=20")
			await expect(
				page.getByRole("link", { name: "Open Returned Kettle", exact: true }),
			).toBeVisible()
			await expect(page.getByText("Showing 1 of 1 record.", { exact: true })).toBeVisible()
		})
		await test.step("Records table: same-day subtotal includes positive and negative Records", async () => {
			await page.goto("/records?start_date=2026-10-03&end_date=2026-10-03")
			await expect(page.getByText("Showing 2 of 2 records.", { exact: true })).toBeVisible()
			const group = page
				.getByText("Sat, 3 Oct", { exact: true })
				.filter({ visible: true })
				.locator("xpath=ancestor::*[self::tr or contains(@class, 'grid-cols-subgrid')][1]")
			await expect(group).toContainText("2 Records")
			await expect(group).toContainText("$1.40")
			await expect(
				page.getByRole("link", { name: "Open MRT Fare", exact: true }),
			).toBeVisible()
			await expect(
				page.getByRole("link", { name: "Open Cashback", exact: true }),
			).toBeVisible()
		})
		await test.step("amount control: paid zero is applied through the UI", async () => {
			await page.goto("/records")
			await page.getByRole("button", { name: "Any amount", exact: true }).click()
			await page.getByRole("radio", { name: "Paid", exact: true }).click()
			await page.getByRole("radio", { name: "Exactly", exact: true }).click()
			await page.getByLabel("Value", { exact: true }).fill("0")
			await page.getByRole("button", { name: "Apply", exact: true }).click()
			await expect(page).toHaveURL(/min_amount=0/)
			await expect(page).toHaveURL(/max_amount=0/)
			await expect(page.getByText("Showing 1 of 1 record.", { exact: true })).toBeVisible()
			await expect(
				page.getByRole("link", { name: "Open Rounding Adjustment", exact: true }),
			).toBeVisible()
		})
	})
})

test("Records lists: later and future Records keep amounts and drills, long Record values survive reload", async ({
	page,
}) => {
	await seedWorkspace(page)
	await test.step("Monthly Records: later and future Records keep amounts and working drills", async () => {
		await patchRows(page, "records", [
			{ id: IDS.records.unicode, datetime: "2026-11-10 13:20" },
			{ id: "t1-r-refund", datetime: "2026-10-20 11:10" },
		])
		await page.goto("/records/monthly?month=October&year=2026")
		const later = page
			.locator("section")
			.filter({ has: page.getByRole("heading", { name: "Later this month", exact: true }) })
		await expect(later).toContainText("Excluded from actual totals.")
		await expect(
			later
				.getByRole("link", { name: "Open Returned Kettle", exact: true })
				.filter({ visible: true }),
		).toBeVisible()
		await expect(later).toContainText("$20.00")
		await page.goto("/records/monthly?month=November&year=2026")
		await expect(
			page.getByRole("heading", { name: "November 2026", exact: true }),
		).toBeVisible()
		const future = page.getByRole("link", { name: /^Open Kōpi/ }).filter({ visible: true })
		await fits(page, future)
		await expect(page.locator("main")).toContainText("-$33.33")
		await expect(page.getByText("No Records have been entered for this month.")).toHaveCount(0)
		await future.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(new RegExp(`/records/${IDS.records.unicode}$`))
	})
	await test.step("Records table: long title and optional Record values survive list drill and reload", async () => {
		const title = `Record 早餐 café ${"long value ".repeat(8)}`.trim()
		const people = "People café ".repeat(10).trim()
		const location = "Location 早餐 ".repeat(10).trim()
		const description = "Description café 早餐 ".repeat(20).trim()
		await patchRows(page, "records", [
			{ id: IDS.records.unicode, title, people, location, description },
		])
		await page.goto("/records?query=Record+%E6%97%A9%E9%A4%90&per_page=100")
		const open = page
			.getByRole("link", { name: `Open ${title}`, exact: true })
			.filter({ visible: true })
		await fits(page, open)
		const row = open.locator(
			'xpath=ancestor::*[self::tr or contains(@class,"grid-cols-subgrid")][1]',
		)
		await expect(row).toContainText(title)
		await expect(row).toContainText("-$33.33")
		await open.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(new RegExp(`/records/${IDS.records.unicode}$`))
		await page.reload()
		await expect(page.locator("main h2")).toContainText(title)
		for (const value of [people, location, description])
			await expect(page.locator("main")).toContainText(value)
		await fits(page, page.locator("main h2"))
		await fits(page, page.getByRole("button", { name: "Edit Record", exact: true }))
	})
})

test("Statements table: signed same-day subtotal and Account rows distinguish pending edits from imported activity", async ({
	page,
}) => {
	await seedWorkspace(page)
	await test.step("Statements table: signed same-day Statements show their exact grouped subtotal", async () => {
		await patchRows(page, "statements", [
			{ id: IDS.statements.unallocated[0], datetime: "2026-10-14 10:00", amount: -25 },
			{ id: IDS.statements.unallocated[1], datetime: "2026-10-14 11:00", amount: 10 },
		])
		await page.goto("/statements?start_date=2026-10-14&end_date=2026-10-14&per_page=100")
		await expect(statementRow(page, IDS.statements.unallocated[0])).toContainText("-$25.00")
		await expect(statementRow(page, IDS.statements.unallocated[1])).toContainText("$10.00")
		const header = page
			.locator("main tr, main div.grid-cols-subgrid")
			.filter({ hasText: "2 Statements" })
			.filter({ visible: true })
		await expect(header).toHaveCount(1)
		await expect(header).toContainText("-$15.00")
		await fits(page, header)
	})
	await test.step("Account rows: pending edits are distinguished from imported activity", async () => {
		await page.goto(`/accounts/${IDS.accounts.dbs}?per_page=100`)
		await expect(page.getByText("1 pending Statement", { exact: true })).toBeVisible()
		await expect(
			page.getByText("Imported and pending Statements", { exact: true }),
		).toBeVisible()
		const pending = statementRow(page, IDS.statements.pending)
		await expect(pending.getByText("Pending", { exact: true })).toBeVisible()
		await expect(
			pending.getByRole("button", { name: "Edit pending statement", exact: true }),
		).toBeVisible()
		const imported = statementRow(page, "t1-s-salary")
		await expect(imported).toContainText("Monthly Salary")
		await expect(imported.getByText("Pending", { exact: true })).toHaveCount(0)
		await expect(
			imported.getByRole("button", { name: "Edit pending statement", exact: true }),
		).toHaveCount(0)
		await pending.getByRole("button", { name: "Edit pending statement", exact: true }).click()
		await expect(
			page.getByRole("dialog", { name: "Edit Pending Statement", exact: true }),
		).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).toHaveCount(0)
	})
})

test("Statement cells: retain pending, Allocation, zero and signed amount meaning", async ({
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
			const transaction = database.transaction(["statements", "allocations"], "readwrite")
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
			// A Statement that is only partly allocated: -60 with -25 assigned leaves -35.
			transaction.objectStore("statements").put({
				id: "t1-s-part-alloc",
				account_id: "t1-acc-dbs",
				datetime: "2026-10-14 12:00",
				description: "Partly allocated groceries",
				amount: -60,
				index: 1,
				is_pending: 0,
			})
			transaction.objectStore("allocations").put({
				statement_id: "t1-s-part-alloc",
				record_id: "t1-r-groceries",
				amount: -25,
			})
		})
	})
	await page.goto("/statements?per_page=100")
	const data = getScenario("populated").tables
	const added: Record<string, { description: string; amount: number; is_pending: number }> = {
		"t1-s-zero": { description: "Zero imported balance row", amount: 0, is_pending: 0 },
		"t1-s-part-alloc": {
			description: "Partly allocated groceries",
			amount: -60,
			is_pending: 0,
		},
	}
	const allocations = [
		...data.allocations,
		{ statement_id: "t1-s-part-alloc", record_id: "t1-r-groceries", amount: -25 },
	]
	let partlyAllocated = 0
	for (const id of [
		IDS.statements.pending,
		"t1-s-partial",
		"t1-s-refund",
		"t1-s-zero",
		"t1-s-part-alloc",
	]) {
		const statement = added[id] ?? data.statements.find(row => row.id === id)
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
		const allocation = allocations
			.filter(item => item.statement_id === id)
			.reduce((sum, item) => sum + item.amount, 0)
		if (allocation === statement.amount && statement.amount !== 0)
			await expect(row.getByText("Unallocated", { exact: true })).toHaveCount(0)
		const remaining = Math.round((statement.amount - allocation) * 100) / 100
		if (allocation !== 0 && remaining !== 0) {
			partlyAllocated++
			await expect(row).toContainText(
				`${remaining < 0 ? "-" : ""}$${Math.abs(remaining).toFixed(2)} allocable`,
			)
		}
		await expectPointerCursor(link)
	}
	expect(partlyAllocated, "the partly allocated case was checked").toBe(1)
})

test("Duplicate badge: marks possible duplicate Statements and links to the account's duplicate review", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto("/statements?per_page=100")
	for (const id of IDS.statements.duplicatePair) {
		const badge = statementRow(page, id).getByRole("link", { name: "Duplicate?" })
		await expect(badge).toBeVisible()
		await expect(badge).toHaveAttribute(
			"title",
			"Possible duplicate statement. Review and fix duplicates.",
		)
		await expect(badge).toHaveAttribute(
			"href",
			"/allocator/duplicates?account_id=t1-acc-revolut",
		)
	}
	await expect(
		statementRow(page, IDS.statements.duplicatePair[0]).getByText("Unallocated", {
			exact: true,
		}),
	).toBeVisible()
	for (const id of IDS.statements.separatePair) {
		await expect(statementRow(page, id).getByText("Duplicate?", { exact: true })).toHaveCount(0)
	}
	await expect(
		statementRow(page, "t1-s-groceries").getByText("Duplicate?", { exact: true }),
	).toHaveCount(0)
	await statementRow(page, IDS.statements.duplicatePair[0])
		.getByRole("link", { name: "Duplicate?" })
		.click()
	await expect(page).toHaveURL("/allocator/duplicates?account_id=t1-acc-revolut")
})

test("Duplicate badge: disappears once the pair is resolved", async ({ page, workspace }) => {
	void workspace
	const data = getScenario("populated").tables
	const keptDescription =
		data.statements.find(row => row.id === IDS.statements.duplicatePair[1])?.description ?? ""
	const deletedDescription =
		data.statements.find(row => row.id === IDS.statements.duplicatePair[0])?.description ?? ""
	await page.goto("/statements?per_page=100")
	await expect(
		statementRow(page, IDS.statements.duplicatePair[0]).getByRole("link", {
			name: "Duplicate?",
		}),
	).toBeVisible()
	await page.goto("/allocator/duplicates")
	await page.getByRole("radio", { name: `Keep ${keptDescription}`, exact: true }).click()
	await page.getByRole("radio", { name: `Delete ${deletedDescription}`, exact: true }).click()
	await page.getByRole("button", { name: "Review deletion" }).click()
	const review = page.getByRole("dialog", { name: "Delete duplicate Statements" })
	await expect(review).toBeVisible()
	await review.getByRole("button", { name: "Delete 1 Statement" }).click()
	await expect(review).toHaveCount(0)
	await page.goto("/statements?per_page=100")
	// Prove the loaded post-resolution rows first: the kept row renders without
	// the badge and the deleted row is gone, before asserting the global count.
	const kept = statementRow(page, IDS.statements.duplicatePair[1])
	await expect(kept).toBeVisible()
	await expect(statementRow(page, IDS.statements.duplicatePair[0])).toHaveCount(0)
	await expect(kept.getByRole("link", { name: "Duplicate?" })).toHaveCount(0)
	await expect(page.getByText("Duplicate?", { exact: true })).toHaveCount(0)
})
