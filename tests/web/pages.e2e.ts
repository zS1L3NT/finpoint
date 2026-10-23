import { getScenario, IDS } from "./support/data"
import { setDateOnly } from "./support/date-only"
import { expect, seedWorkspace, test } from "./support/fixtures"

const month = "month=October&year=2026"

test.beforeEach(async ({ page }) => {
	await setDateOnly(page, new Date("2026-10-15T12:00:00+08:00"))
})

test("pages empty states share one empty seed", async ({ page }) => {
	await seedWorkspace(page, "empty")
	for (const [route, title, empty] of [
		["/records", "Records", "No records found."],
		["/statements", "Statements", "No statements found."],
		["/accounts", "Accounts", "No accounts yet. Import a bank export to create one."],
		["/categories", "Categories", "No categories yet."],
		["/budgets", "Budgets", "No budgets yet."],
		[`/records/monthly?${month}`, "October 2026", "No Records for this month"],
	] as const) {
		await test.step(`pages.empty ${route} resolves to its useful empty state`, async () => {
			await page.goto(route)
			await expect(
				page.getByRole("heading", { name: title, exact: true }).last(),
			).toBeVisible()
			// Empty copy renders in both the card layout and the table layout.
			await expect(
				page.getByText(empty, { exact: true }).filter({ visible: true }),
			).toBeVisible()
			await expect(page.getByText(/^(Loading|Loading\.\.\.|Please wait)/)).toHaveCount(0)
		})
	}
})

test("pages directory searches share one seed", async ({ page }) => {
	await seedWorkspace(page)
	for (const [route, copy] of [
		["/accounts", "Everyday Savings"],
		["/categories", "Groceries"],
		["/budgets", "October Buffer"],
	] as const) {
		await test.step(`pages.directory ${route} searches populated data and clears no matches`, async () => {
			await page.goto(route)
			await expect(page.getByText(copy, { exact: true }).first()).toBeVisible()
			const search = page
				.getByRole("searchbox")
				.or(page.getByRole("textbox", { name: /Search/ }))
			await search.fill("no-such-ui-regression-item")
			await expect(page.getByText(/No .* match your search\./)).toBeVisible()
			await search.fill("")
			await expect(page.getByText(copy, { exact: true }).first()).toBeVisible()
		})
	}
})

test("table pagination journeys share one dense seed", {
	tag: ["@tall", "@light", "@motion"],
}, async ({ page }) => {
	test.setTimeout(90_000)
	await seedWorkspace(page, "dense")
	for (const [route, noun, search] of [
		["/records", "record", "Search title, people, location, description..."],
		["/statements", "statement", "Search descriptions..."],
	] as const) {
		await test.step(`table.pagination ${noun} keeps search in the URL and moves between pages`, async () => {
			await page.goto(`${route}?per_page=10`)
			await expect(page.getByText(new RegExp(`Showing 10 of \\d+ ${noun}s\\.`))).toBeVisible()
			await expect(page.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
				"aria-disabled",
				"true",
			)
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
	await test.step("table.pagination out-of-range page clamps to the last page with no dead links", async () => {
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

test("table.filters category selection narrows records and survives reload", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto("/records")
	await page.getByRole("button", { name: "Any category", exact: true }).click()
	await page.getByPlaceholder("Search categories...").fill("Groceries")
	await page.getByRole("option", { name: "Groceries", exact: true }).click()
	await page.keyboard.press("Escape")
	await expect(page).toHaveURL(new RegExp(`category_ids=${IDS.categories.groceries}`))
	await expect(page.getByRole("link", { name: "Open FairPrice Run", exact: true })).toBeVisible()
	await expect(page.getByRole("link", { name: "Open Monthly Salary", exact: true })).toHaveCount(
		0,
	)
	await page.reload()
	await expect(page.getByRole("button", { name: "1 category", exact: true })).toBeVisible()
	await page.getByRole("button", { name: /^Clear/ }).click()
	await expect(page).not.toHaveURL(/category_ids=/)
	await expect(page.getByRole("link", { name: "Open Monthly Salary", exact: true })).toBeVisible()
})

test("table record filter variants share one seed", async ({ page }) => {
	await seedWorkspace(page)
	await test.step("table.amount zero is a real filter, paid and received ranges retain sign", async () => {
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
	await test.step("table.groups same-day subtotal includes positive and negative Records", async () => {
		await page.goto("/records?start_date=2026-10-03&end_date=2026-10-03")
		await expect(page.getByText("Showing 2 of 2 records.", { exact: true })).toBeVisible()
		const group = page
			.getByText("Sat, 3 Oct", { exact: true })
			.filter({ visible: true })
			.locator("xpath=ancestor::*[self::tr or contains(@class, 'grid-cols-subgrid')][1]")
		await expect(group).toContainText("2 Records")
		await expect(group).toContainText("$1.40")
		await expect(page.getByRole("link", { name: "Open MRT Fare", exact: true })).toBeVisible()
		await expect(page.getByRole("link", { name: "Open Cashback", exact: true })).toBeVisible()
	})
	await test.step("table.amount-control paid zero is applied through the UI", async () => {
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

test("pages invalid IDs share one seed", async ({ page }) => {
	await seedWorkspace(page)
	for (const [route, missing] of [
		["records", "Record"],
		["statements", "Statement"],
		["accounts", "Account"],
		["budgets", "Budget"],
	] as const) {
		await test.step(`pages.invalid ${route} missing ID resolves without a loader`, async () => {
			await page.goto(`/${route}/ui-regression-missing-id`)
			await expect(page.getByText(`${missing} not found.`, { exact: true })).toBeVisible()
			await expect(page.getByText(/^Loading/)).toHaveCount(0)
		})
	}
})

for (const keys of [
	["salaryIncome", "transferExcluded", "partialPending", "pendingStatement", "zero"] as const,
	["nulls", "unicode", "split", "priorMonth", "excludedMonth"] as const,
]) {
	test(`detail record variants share one seed (${keys[0]}…${keys[keys.length - 1]})`, async ({
		page,
	}) => {
		test.setTimeout(90_000)
		await seedWorkspace(page)
		for (const key of keys) {
			await test.step(`detail.record ${key} renders amount, category, treatment and allocations`, async () => {
				const data = getScenario("populated").tables
				const record = data.records.find(row => row.id === IDS.records[key])
				if (!record) throw new Error(`Missing fixture Record ${key}`)
				await page.goto(`/records/${record.id}`)
				await expect(
					page.getByRole("heading", { name: record.title, exact: false }),
				).toBeVisible()
				await expect(
					page.getByText("Amount", { exact: true }).first().locator("..").locator(".."),
				).toContainText(
					new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD" }).format(
						record.amount,
					),
				)
				await expect(
					page.getByText("Category", { exact: true }).locator("..").locator(".."),
				).toContainText(
					data.categories.find(row => row.id === record.category_id)?.name ??
						"Missing category fixture",
				)
				// Independent expectation, not the product's own label lookup.
				const treatment = {
					income: "Income",
					spending: "Spending",
					saving_investment: "Saving / investment",
					neutral: "Transfer / excluded",
					automatic: "Automatic by direction",
				}[record.analytics_treatment ?? "automatic"]
				await expect(page.getByText(/Treatment ·/)).toHaveText(`Treatment · ${treatment}`)
				await expect(page.getByText(/Monthly budget ·/)).toContainText(
					record.monthly_budget_id
						? (data.monthly_budgets.find(row => row.id === record.monthly_budget_id)
								?.name ?? "Missing monthly budget fixture")
						: "Unbudgeted",
				)
				const allocations = data.allocations.filter(row => row.record_id === record.id)
				if (!allocations.length)
					await expect(
						page
							.getByText("No statements found.", { exact: true })
							.filter({ visible: true }),
					).toBeVisible()
				else
					for (const allocation of allocations)
						await expect(
							page
								.getByRole("link", { name: "Open statement" })
								.and(
									page.locator(`[href="/statements/${allocation.statement_id}"]`),
								),
						).toBeVisible()
				if (key === "partialPending")
					await expect(
						page
							.getByText("Amount", { exact: true })
							.first()
							.locator("..")
							.locator(".."),
					).toContainText("[-$25.00]")
			})
		}
	})
}

test("detail related rows share one seed", async ({ page }) => {
	await seedWorkspace(page)
	for (const [route, heading, content] of [
		[`/accounts/${IDS.accounts.dbs}`, "Everyday Savings", "Showing"],
		[`/statements/${IDS.statements.pending}`, "Pasar malam snacks", "Pasar Malam"],
		[`/budgets/${IDS.budgets.manual}`, "October Buffer", "FairPrice Run"],
	] as const) {
		await test.step(`detail.related ${route} renders real related rows`, async () => {
			await page.goto(route)
			await expect(page.getByRole("heading", { name: heading, exact: false })).toBeVisible()
			// Related content renders in both card and table layouts; one copy may be hidden.
			await expect
				.poll(() =>
					page.getByText(content, { exact: false }).evaluateAll(
						elements =>
							elements.filter(element => {
								const box = element.getBoundingClientRect()
								return box.width > 0 && box.height > 0
							}).length,
					),
				)
				.toBeGreaterThan(0)
		})
	}
})

test("monthly.shell header and tabs retain DOM identity across tab switches", async ({
	page,
	isMobile,
}) => {
	await seedWorkspace(page)
	await page.goto(`/?${month}`)
	const heading = await page
		.getByRole("heading", { name: "October 2026", exact: true })
		.elementHandle()
	const tabs = await page
		.getByRole("navigation", { name: "Monthly finance views" })
		.elementHandle()
	await page
		.getByRole("navigation", { name: "Monthly finance views" })
		.getByRole("link", { name: "Monthly Records", exact: true })
		.click()
	await expect(page.getByRole("heading", { name: "Recorded activity" })).toBeVisible()
	await expect(page.getByRole("link", { name: "Open FairPrice Run", exact: true })).toBeVisible()
	// Compact record rows omit the desktop budget column; the filter exposes
	// the same Monthly budgets at every viewport size.
	await page.getByRole("combobox").filter({ hasText: "Any monthly budget" }).click()
	await expect(page.getByRole("option", { name: "Daily", exact: true })).toBeVisible()
	await page.keyboard.press("Escape")
	if (!isMobile)
		await expect(
			page.getByText("Daily", { exact: true }).filter({ visible: true }).first(),
		).toBeVisible()
	await expect.poll(() => heading?.evaluate(node => node.isConnected)).toBe(true)
	await expect.poll(() => tabs?.evaluate(node => node.isConnected)).toBe(true)
	await page
		.getByRole("navigation", { name: "Monthly finance views" })
		.getByRole("link", { name: "Overview", exact: true })
		.click()
	await expect(page.getByText("Total income", { exact: false }).first()).toBeVisible()
	await expect.poll(() => heading?.evaluate(node => node.isConnected)).toBe(true)
})

test("pages static and not-found routes need no seed", async ({ page }) => {
	for (const route of ["privacy", "terms"] as const) {
		await test.step(`pages.static ${route} is readable`, async () => {
			await page.goto(`/${route}`)
			await expect(page.getByRole("heading").first()).toBeVisible()
			await expect(page.locator("main")).toContainText(
				route === "privacy" ? /privacy/i : /terms/i,
			)
		})
	}
	await test.step("pages.not-found unmatched route offers working Records destination", async () => {
		await page.goto("/ui-regression-unmatched-route")
		await expect(
			page.getByRole("heading", { name: "Page not found", level: 2, exact: true }),
		).toBeVisible()
		await page.getByRole("link", { name: "Browse Records", exact: true }).click()
		await expect(page).toHaveURL(/\/records$/)
		await expect(
			page.getByRole("heading", { name: "Records", exact: true }).last(),
		).toBeVisible()
	})
})

test("detail statement variants share one seed", async ({ page }) => {
	await seedWorkspace(page)
	await test.step("detail.statement split allocation shows its assigned amount and confirmed account", async () => {
		await page.goto(`/statements/${IDS.statements.splitPair[0]}`)
		await expect(
			page.getByRole("heading", { name: /Uniqlo Basics · Contactless 1001/ }),
		).toBeVisible()
		await expect(page.getByText("One Card", { exact: true }).first()).toBeVisible()
		await expect(
			page.getByRole("link", { name: "Open Uniqlo Basics", exact: true }),
		).toBeVisible()
		await expect(
			page.getByText("Amount", { exact: true }).first().locator("..").locator(".."),
		).toContainText("-$60.00")
	})
	await test.step("detail.statement unallocated confirmed Statement shows resolved empty Records", async () => {
		await page.goto(`/statements/${IDS.statements.unallocated[0]}`)
		await expect(
			page.getByRole("heading", { name: /DON DON DONKI PURCHASE 8821/ }),
		).toBeVisible()
		await expect(
			page.getByText("No records found.", { exact: true }).filter({ visible: true }),
		).toBeVisible()
		await expect(
			page.getByRole("button", { name: "Edit Pending Statement", exact: true }),
		).toHaveCount(0)
	})
})

test("detail.budget manual and automatic membership sums reconcile", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(`/budgets/${IDS.budgets.manual}`)
	await expect(
		page.getByText("Spent", { exact: true }).locator("..").locator(".."),
	).toContainText("$117.53")
	await expect(
		page.getByText("Remaining", { exact: true }).locator("..").locator(".."),
	).toContainText("$382.47")
	await expect(
		page.locator('[data-slot="card-title"]').filter({ hasText: "Attached Records" }),
	).toContainText("2")
	await page.goto(`/budgets/${IDS.budgets.automatic}`)
	await expect(
		page.getByText("Spent", { exact: true }).locator("..").locator(".."),
	).toContainText("$158.70")
	await expect(
		page.locator('[data-slot="card-title"]').filter({ hasText: "Attached Records" }),
	).toContainText("3")
})
