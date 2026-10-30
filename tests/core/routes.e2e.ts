import type { Page } from "@playwright/test"
import { expectPointerCursor } from "../support/assertions"
import { chartTooltip } from "../support/charts"
import { getScenario, IDS, statementRules } from "../support/data"
import { setDateOnly } from "../support/date-only"
import { openEditor, pickOption } from "../support/editors"
import { expect, seedWorkspace, test } from "../support/fixtures"
import { fits, patchRows, statementRow } from "../support/tables"

const month = "month=October&year=2026"

const titles: Record<string, string> = {
	"/": "Dashboard",
	"/records": "Records",
	"/statements": "Statements",
	"/accounts": "Accounts",
	"/budgets": "Budgets",
	"/categories": "Categories",
	"/allocator": "Workflows",
	"/allocator/pending": "Workflows",
	"/allocator/duplicates": "Workflows",
	"/importer": "Importer",
	"/settings": "Settings",
	"/sync": "Data",
	"/privacy": "Privacy Policy",
	"/terms": "Terms of Service",
	"/records/monthly?month=October&year=2026": "Monthly Records",
	"/accounts/t1-acc-dbs": "Account",
	"/budgets/t1-b-manual": "Budget",
	"/records/t1-r-partial": "Record",
	"/statements/t1-s-pending": "Statement",
}

const routeReady: Record<string, string> = {
	"/records": "Edit FairPrice Run",
	"/records/monthly?month=October&year=2026": "Edit FairPrice Run",
	"/accounts": "Rename Everyday Savings",
	"/budgets": "Edit October Buffer",
	"/categories": "Edit Groceries",
	"/statements": "Edit pending statement",
	"/allocator/pending": "Pasar malam snacks",
	"/allocator/duplicates": "Review deletion",
	"/accounts/t1-acc-dbs": "Edit Account",
	"/budgets/t1-b-manual": "Edit Budget",
	"/records/t1-r-partial": "Edit Record",
	"/statements/t1-s-pending": "Edit Pending Statement",
}

async function expectRouteLayout(page: Page, route: string, title: string) {
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
		test.info().project.use.colorScheme === "light" ? /^(?!.*\bdark\b)/ : /dark/,
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
		expect(box.x + box.width, route).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + 1)
	}
}

async function expectRouteButtons(page: Page, route: string) {
	await expect(page.locator("main h2").first()).toBeVisible()
	if (routeReady[route])
		await expect(
			page
				.getByRole("button", {
					name: routeReady[route],
					exact: route !== "/allocator/pending",
				})
				.filter({ visible: true })
				.first(),
		).toBeVisible()
	if (route === "/allocator")
		await expect(
			page.getByRole("checkbox", { name: "Select statement t1-s-free-2", exact: true }),
		).toBeVisible()
	const candidates = page.locator(
		'button:visible, [role="button"]:visible, a[data-slot="button"]:visible',
	)
	expect(await candidates.count(), `${route}: inspect actual enabled controls`).toBeGreaterThan(0)
	const failures = await page
		.locator('button:visible, [role="button"]:visible, a[data-slot="button"]:visible')
		.evaluateAll(elements =>
			elements.flatMap(element => {
				if (element.matches(':disabled, [aria-disabled="true"]')) return []
				const item = element as HTMLElement
				const name =
					item.getAttribute("aria-label") ||
					item.textContent?.trim() ||
					item.outerHTML.slice(0, 100)
				return getComputedStyle(item).cursor !== "pointer" ||
					(item.tabIndex < 0 &&
						!item.closest(
							'[role="tablist"], [role="menu"], [role="grid"], [role="radiogroup"], [role="toolbar"], [data-slot="toggle-group"]',
						))
					? [{ name, cursor: getComputedStyle(item).cursor, tabIndex: item.tabIndex }]
					: []
			}),
		)
	expect(failures, route).toEqual([])
	for (const button of await page
		.locator(
			'main button:visible:not(:disabled), main a[data-slot="button"]:visible:not([aria-disabled="true"])',
		)
		.all())
		await button.click({ trial: true })
}

test("workflow tabs and sparkline: tabs navigate by keyboard, Allocate keeps its default date filter, sparkline endpoint follows changed month values", async ({
	page,
}) => {
	await seedWorkspace(page)
	await test.step("workflow tabs: navigate by keyboard and Allocate keeps the default date filter", async () => {
		await page.goto("/allocator")
		const tabs = page.getByRole("navigation", { name: "Workflow views" })
		await tabs.getByRole("link", { name: "Replace Pending", exact: true }).focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/\/allocator\/pending$/)
		await expect(
			page.getByRole("region", { name: "Pending statements", exact: true }),
		).toBeVisible()
		await page
			.getByRole("navigation", { name: "Workflow views" })
			.getByRole("link", { name: "Fix Duplicates", exact: true })
			.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/\/allocator\/duplicates$/)
		await page
			.getByRole("navigation", { name: "Workflow views" })
			.getByRole("link", { name: "Allocate to Records", exact: true })
			.click()
		await expect(page).toHaveURL(/\/allocator\?start_date=2026-10-01/)
		await expect(
			page.getByRole("checkbox", { name: "Select statement t1-s-free-1", exact: true }),
		).toBeVisible()
	})
	await test.step("total spending sparkline: keeps finite data marks and its endpoint follows changed month values", async () => {
		await page.goto("/?month=October&year=2026")
		const spark = page.locator('svg[role="img"][aria-label^="Total spending,"]').first()
		await expect(spark).toBeAttached()
		const points = await spark.locator("polyline").getAttribute("points")
		expect(points).toBeTruthy()
		if (!points) throw new Error("Expected plotted sparkline coordinates")
		const coordinates = points.split(" ").map(point => point.split(",").map(Number))
		expect(coordinates.length).toBeGreaterThan(1)
		for (const [x, y] of coordinates) {
			expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true)
			expect(x).toBeGreaterThanOrEqual(3)
			expect(x).toBeLessThanOrEqual(93)
			expect(y).toBeGreaterThanOrEqual(3)
			expect(y).toBeLessThanOrEqual(25)
		}
		expect(new Set(coordinates.map(point => point[1])).size).toBeGreaterThan(1)
		const last = coordinates.at(-1)
		expect(Number(await spark.locator("circle").getAttribute("cx"))).toBeCloseTo(
			last?.[0] ?? NaN,
		)
		expect(Number(await spark.locator("circle").getAttribute("cy"))).toBeCloseTo(
			last?.[1] ?? NaN,
		)
		await page.getByRole("button", { name: "Previous month", exact: true }).click()
		await expect(
			page.getByRole("heading", { name: "September 2026", exact: true }),
		).toBeVisible()
		await expect(spark.locator("polyline")).not.toHaveAttribute("points", points ?? "")
	})
})

test("Statement rules page: empty, populated and paused rules show conditions, actions and match counts", async ({
	page,
}) => {
	await seedWorkspace(page, "empty")
	await page.goto("/statement-rules")
	await expect(page.getByText("No rules yet", { exact: true })).toBeVisible()
	await page.getByRole("button", { name: "Create a rule", exact: true }).click()
	await expect(page.getByRole("dialog", { name: "New rule", exact: true })).toBeVisible()
	await page.keyboard.press("Escape")

	await seedWorkspace(page, "populated", { statement_rules: statementRules() })
	await page.goto("/statement-rules")
	const cards = page.locator("main article")
	await expect(cards).toHaveCount(5)
	const names = [
		"Starbucks coffee",
		"Raffles coffee",
		"Groceries",
		"Grab rides",
		"Archived travel",
	]
	for (const [index, name] of names.entries())
		await expect(
			cards.nth(index).getByRole("button", { name: `Edit ${name}`, exact: true }),
		).toBeVisible()

	const starbucks = cards.nth(0)
	await expect(starbucks.getByText("contains", { exact: true })).toBeVisible()
	await expect(starbucks.getByText("starbucks", { exact: true })).toBeVisible()
	await expect(starbucks.getByText("1 matching Statement", { exact: true })).toBeVisible()
	await expect(starbucks.getByText("Morning coffee", { exact: true })).toBeVisible()
	await expect(starbucks.getByText("Dining Out", { exact: true })).toBeVisible()

	await expect(cards.nth(1).getByText("1 matching Statement", { exact: true })).toBeVisible()
	await expect(cards.nth(2).getByText("or", { exact: true })).toBeVisible()
	await expect(cards.nth(2).getByText("2 matching Statements", { exact: true })).toBeVisible()

	const grab = cards.nth(3)
	await expect(grab.getByText("Paused", { exact: true })).toBeVisible()
	await expect(grab.getByRole("button", { name: "Resume Grab rides", exact: true })).toBeVisible()
	await expect(grab.getByText("matching Statement")).toHaveCount(0)

	const archived = cards.nth(4)
	await expect(archived.getByText("Monthly budget", { exact: true })).toBeVisible()
	await expect(archived.getByText("Travel", { exact: true })).toBeVisible()
	await expect(archived.getByText("1 matching Statement", { exact: true })).toBeVisible()

	for (let index = 0; index < 5; index++) await fits(page, cards.nth(index))
})

test("Statement rules page: the Plan Rules link opens it and pause, resume and delete persist after reload", async ({
	page,
	isMobile,
}) => {
	await seedWorkspace(page, "populated", { statement_rules: statementRules() })
	await page.goto("/records")
	// Tap at once: the mobile flag settles in a mount effect, and a tap before it
	// must still open the mobile sheet rather than collapse the desktop sidebar.
	if (isMobile) await page.locator('header [data-slot="sidebar-trigger"]').click()
	await page.getByRole("link", { name: "Rules", exact: true }).filter({ visible: true }).click()
	await expect(page).toHaveURL(/\/statement-rules$/)
	await expect(page.locator("header h1")).toHaveText("Statement rules")

	const starbucks = page.locator("main article").filter({ hasText: "Starbucks coffee" })
	await page.getByRole("button", { name: "Pause Starbucks coffee", exact: true }).click()
	await expect(starbucks.getByText("Paused", { exact: true })).toBeVisible()
	await page.reload()
	await expect(starbucks.getByText("Paused", { exact: true })).toBeVisible()
	await page.getByRole("button", { name: "Resume Starbucks coffee", exact: true }).click()
	await expect(starbucks.getByText("1 matching Statement", { exact: true })).toBeVisible()
	await page.reload()
	await expect(starbucks.getByText("1 matching Statement", { exact: true })).toBeVisible()

	await page.getByRole("button", { name: "Edit Groceries", exact: true }).click()
	const dialog = page.getByRole("dialog", { name: "Edit rule", exact: true })
	await dialog.getByRole("button", { name: "Delete", exact: true }).click()
	await expect(dialog).not.toBeVisible()
	await page.reload()
	await expect(page.getByRole("button", { name: "Edit Groceries", exact: true })).toHaveCount(0)
	await expect(page.locator("main article")).toHaveCount(4)
})

// One populated seed per sweep. Each route navigates once; the layout step
// owns the navigation and the button-audit step reuses the same page, so the
// audit sees exactly the layout-verified DOM. Trial clicks never navigate.
for (const [group, routes, tags] of [
	[
		"core",
		["/", "/records", "/statements", "/accounts", "/budgets", "/categories"],
		["@tall", "@reduced-motion", "@light"],
	],
	[
		"workflows",
		[
			"/allocator",
			"/allocator/pending",
			"/allocator/duplicates",
			"/importer",
			"/settings",
			"/sync",
		],
		["@tall", "@reduced-motion"],
	],
	[
		"details",
		[
			"/records/monthly?month=October&year=2026",
			"/accounts/t1-acc-dbs",
			"/budgets/t1-b-manual",
			"/records/t1-r-partial",
			"/statements/t1-s-pending",
			"/privacy",
			"/terms",
		],
		["@tall", "@reduced-motion"],
	],
] as [string, string[], string[]][]) {
	test(`${group} pages: layout fits the viewport and enabled buttons pass the pointer and Tab audit`, {
		tag: tags,
	}, async ({ page, workspace }) => {
		test.setTimeout(120_000)
		void workspace
		for (const route of routes) {
			await test.step(`${route} page: populated content and enabled controls stay inside the viewport`, async () => {
				await page.goto(route)
				const title = titles[route]
				if (!title) throw new Error(`Missing layout title for ${route}`)
				await expectRouteLayout(page, route, title)
			})
			await test.step(`${route} page: enabled visible buttons pass a pointer, Tab-reachability and actionability audit`, async () => {
				await expectRouteButtons(page, route)
			})
		}
	})
}

test("allocator empty states: Statements, pending and duplicate lists resolve without loading copy", async ({
	page,
}) => {
	await seedWorkspace(page, "empty")
	for (const [route, empty] of [
		["/allocator", "No statements found.", "Workflows"],
		["/allocator/pending", "No pending Statements", "Workflows"],
		["/allocator/duplicates", "No duplicates found", "Workflows"],
	] as const) {
		await test.step(`${route} page: empty state resolves without premature loading copy`, async () => {
			await page.goto(route)
			await expect(
				page.getByText(empty, { exact: true }).filter({ visible: true }),
			).toBeVisible()
			await expect(page.getByText(/^(Loading|Please wait)/)).toHaveCount(0)
		})
	}
})

test("long names: oversized Account, Budget and Category names keep editor buttons reachable", async ({
	page,
}) => {
	test.setTimeout(90_000)
	await seedWorkspace(page)
	for (const [route, store, action] of [
		["/accounts", "accounts", "Rename"],
		["/budgets", "budgets", "Edit"],
		["/categories", "categories", "Edit"],
	] as const) {
		await test.step(`${route} page: oversized names and editor buttons stay reachable by pointer`, async () => {
			// Each step rewrites a different store, so earlier oversized names
			// never affect the later steps' routes.
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
							transaction.objectStore(store).put({
								...row,
								name: `${index} café 早餐 ${"Long name ".repeat(22)}`,
							}),
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
})

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
	test(`${route} page: stays silent while the database opens, then reveals its data`, async ({
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

test.describe("pinned 15 October 2026 date", () => {
	test.beforeEach(async ({ page }) => {
		await setDateOnly(page, new Date("2026-10-15T12:00:00+08:00"))
	})
	test("empty pages: Records, Statements, Accounts, Categories, Budgets and monthly views resolve to useful copy", async ({
		page,
	}) => {
		await seedWorkspace(page, "empty")
		for (const [route, title, empty] of [
			["/records", "Records", "No records found."],
			["/statements", "Statements", "No statements found."],
			["/accounts", "Accounts", "No accounts yet. Import a bank export to create one."],
			["/categories", "Categories", "No categories yet."],
			["/budgets", "Budgets", "No budgets yet."],
			[`/records/monthly?${month}`, "October 2026", "No Records for this month"],
		] as const) {
			await test.step(`${route} page: resolves to its useful empty state`, async () => {
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
	test("directory pages: search narrows Accounts, Categories and Budgets and clearing restores them", async ({
		page,
	}) => {
		await seedWorkspace(page)
		for (const [route, copy] of [
			["/accounts", "Everyday Savings"],
			["/categories", "Groceries"],
			["/budgets", "October Buffer"],
		] as const) {
			await test.step(`${route} page: search finds populated data and clears no-match copy`, async () => {
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
	test("missing detail IDs: Record, Statement, Account and Budget pages resolve to not-found copy", async ({
		page,
	}) => {
		await seedWorkspace(page)
		for (const [route, missing] of [
			["records", "Record"],
			["statements", "Statement"],
			["accounts", "Account"],
			["budgets", "Budget"],
		] as const) {
			await test.step(`${route} page: missing ID resolves to not-found copy without a loader`, async () => {
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
		test(`Record detail: variants ${keys[0]}…${keys[keys.length - 1]} render amount, Category, Treatment and Allocations`, async ({
			page,
		}) => {
			test.setTimeout(90_000)
			await seedWorkspace(page)
			for (const key of keys) {
				await test.step(`Record detail ${key}: renders amount, Category, Treatment and Allocations`, async () => {
					const data = getScenario("populated").tables
					const record = data.records.find(row => row.id === IDS.records[key])
					if (!record) throw new Error(`Missing fixture Record ${key}`)
					await page.goto(`/records/${record.id}`)
					await expect(
						page.getByRole("heading", { name: record.title, exact: false }),
					).toBeVisible()
					await expect(
						page
							.getByText("Amount", { exact: true })
							.first()
							.locator("..")
							.locator(".."),
					).toContainText(
						new Intl.NumberFormat("en-SG", {
							style: "currency",
							currency: "SGD",
						}).format(record.amount),
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
					await expect(page.getByText(/Treatment ·/)).toHaveText(
						`Treatment · ${treatment}`,
					)
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
										page.locator(
											`[href="/statements/${allocation.statement_id}"]`,
										),
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
	test("detail pages: related rows render real content for Account, Statement and Budget details", async ({
		page,
	}) => {
		await seedWorkspace(page)
		for (const [route, heading, content] of [
			[`/accounts/${IDS.accounts.dbs}`, "Everyday Savings", "Showing"],
			[`/statements/${IDS.statements.pending}`, "Pasar malam snacks", "Pasar Malam"],
			[`/budgets/${IDS.budgets.manual}`, "October Buffer", "FairPrice Run"],
		] as const) {
			await test.step(`${route} detail: renders real related rows`, async () => {
				await page.goto(route)
				await expect(
					page.getByRole("heading", { name: heading, exact: false }),
				).toBeVisible()
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
	test("monthly shell: header and tabs keep DOM identity across tab switches", async ({
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
		await expect(
			page.getByRole("link", { name: "Open FairPrice Run", exact: true }),
		).toBeVisible()
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
	test("static and not-found routes: static pages are readable and unmatched routes offer Records", async ({
		page,
	}) => {
		for (const route of ["privacy", "terms"] as const) {
			await test.step(`${route} page: heading and content are readable`, async () => {
				await page.goto(`/${route}`)
				await expect(page.getByRole("heading").first()).toBeVisible()
				await expect(page.locator("main")).toContainText(
					route === "privacy" ? /privacy/i : /terms/i,
				)
			})
		}
		await test.step("not-found page: offers a working Records destination", async () => {
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
	test("Statement detail: variants show split Allocations and unallocated empty Records", async ({
		page,
	}) => {
		await seedWorkspace(page)
		await test.step("Statement detail: split Allocation shows its assigned amount and confirmed Account", async () => {
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
		await test.step("Statement detail: unallocated confirmed Statement shows resolved empty Records", async () => {
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
	test("Budget detail: manual and automatic membership sums reconcile", async ({ page }) => {
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
})

test("monthly headers: hydrate with a browser date different from the server", async ({ page }) => {
	const errors: string[] = []
	page.on("pageerror", error => errors.push(error.message))
	page.on("console", message => {
		if (message.type() === "error") errors.push(message.text())
	})
	await setDateOnly(page, new Date("2001-01-15T12:00:00+08:00"))
	for (const [route, heading, subtitle] of [
		["/", "January 2001", "Through 15 Jan · SGD · Based on Record dates"],
		["/records/monthly", "January 2001", "Actuals through 15 Jan"],
		["/?month=December&year=2000", "December 2000", "Full month · SGD · Based on Record dates"],
	] as const) {
		await test.step(`${route} header: hydrates with the browser date and reports no hydration errors`, async () => {
			await page.goto(route)
			await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible()
			await expect(page.getByText(subtitle, { exact: true })).toBeVisible()
			await expect(page.getByRole("button", { name: "Next month" })).toBeEnabled()
			expect(errors.filter(error => /hydrat|server rendered/i.test(error))).toEqual([])
		})
	}
})

test("Record facets: long Monthly Budget option picks and clears, Category history separates unavailable months", async ({
	page,
}) => {
	await seedWorkspace(page)
	await test.step("Record editor: long Monthly Budget option can be picked, cleared and disabled by Treatment", async () => {
		const name = `Daily 早餐 café ${"long plan ".repeat(7)}`.trim()
		await patchRows(page, "monthly_budgets", [{ id: "t1-mb-daily", name }])
		await page.goto("/records/t1-r-groceries")
		await page.getByRole("button", { name: "Edit Record", exact: true }).click()
		const dialog = page.getByRole("dialog", { name: "Edit Record", exact: true })
		const budget = dialog.locator("#monthly_budget_id")
		await budget.click()
		const option = page.getByRole("option", { name, exact: true })
		await expect(option).toHaveText(name)
		await fits(page, page.getByRole("listbox"))
		await pickOption(option)
		await expect(budget).toContainText(name)
		await fits(page, budget)
		await budget.click()
		await pickOption(page.getByRole("option", { name: "Unbudgeted", exact: true }))
		await expect(budget).toContainText("Unbudgeted")
		await dialog.locator("#analytics_treatment").click()
		await pickOption(page.getByRole("option", { name: "Income", exact: true }))
		await expect(budget).toBeDisabled()
		await dialog.locator("#analytics_treatment").click()
		await pickOption(page.getByRole("option", { name: "Spending", exact: true }))
		await expect(budget).toBeEnabled()
		await expect(budget).toContainText("Unbudgeted")
	})
	await test.step("Category trend chart: unavailable months are distinguished from recorded zero spending", async () => {
		await patchRows(page, "analytics_months", [
			{
				month: "2026-07-01",
				coverage: "complete",
				covered_through: "2026-07-31",
				excluded_from_comparisons: false,
			},
		])
		await page.goto("/?month=October&year=2026")
		const chart = page.locator('[data-slot="card"]').filter({
			has: page.locator('[data-slot="card-title"]').filter({ hasText: "Category trend" }),
		})
		await expect(chart.getByText("Unavailable", { exact: true }).first()).toBeVisible()
		await expect(chart.getByText("No spending", { exact: true })).toBeVisible()
		await chart.getByText(/months unavailable$/).click()
		await expect(chart).toContainText("No recorded activity; coverage unknown")
		await page.goto("/?month=October&year=2026&scope=other")
		await expect(chart).toContainText("No spending in the available months.")
	})
})

test("Statement detail: long pending description stays readable on list and detail with confirmation state", async ({
	page,
}) => {
	await seedWorkspace(page)
	const description = `Pending café 早餐 ${"description ".repeat(22)}`.trim()
	await patchRows(page, "statements", [{ id: IDS.statements.pending, description }])
	await page.goto("/statements?per_page=100")
	const row = statementRow(page, IDS.statements.pending)
	await expect(row).toContainText(description)
	await expect(row.getByText("Pending", { exact: true })).toBeVisible()
	await fits(page, row)
	await row.getByRole("link", { name: "Open statement", exact: true }).click()
	await expect(page.locator("main h2")).toContainText(description)
	await expect(page.getByText("Status · Pending Statement", { exact: true })).toBeVisible()
	await fits(page, page.locator("main h2"))
	await fits(page, page.getByRole("button", { name: "Edit Pending Statement", exact: true }))
	await expect(page.getByRole("link", { name: "Open Pasar Malam", exact: true })).toBeVisible()
	await page.goto(`/statements/${IDS.statements.splitPair[0]}`)
	await expect(page.getByText("Imported day index · 1", { exact: true })).toBeVisible()
	await expect(page.getByText("Status · Pending Statement", { exact: true })).toHaveCount(0)
	await expect(
		page.getByRole("button", { name: "Edit Pending Statement", exact: true }),
	).toHaveCount(0)
})

test("Spending by weekday: no comparison history renders zero spending without a fabricated baseline", async ({
	page,
}) => {
	await seedWorkspace(page, "empty")
	await page.goto("/?month=October&year=2026")
	const chart = page.locator('[data-slot="card"]').filter({
		has: page.locator('[data-slot="card-title"]').filter({ hasText: "Spending by weekday" }),
	})
	await expect(chart).toContainText("No comparison history available.")
	await chart.getByRole("application").focus()
	const tooltip = chart.locator(chartTooltip)
	await expect(tooltip).toContainText("Average per Monday")
	await expect(tooltip).toContainText("$0.00")
	await expect(tooltip).not.toContainText("Previous")
	await expect(chart).not.toContainText(/NaN|Infinity/)
})

test("narrow desktop: pages stack by available width and popups keep side margins", {
	tag: ["@desktop-only"],
}, async ({ page }) => {
	await page.setViewportSize({ width: 900, height: 800 })
	await seedWorkspace(page, "populated", { statement_rules: statementRules() })
	await test.step("pending queue: shows only the queue until a Pending Statement is selected", async () => {
		await page.goto("/allocator/pending")
		const queue = page.getByRole("region", { name: "Pending statements", exact: true })
		const candidate = page.locator('section[aria-labelledby="candidate-title"]')
		await expect(queue).toBeVisible()
		await expect(candidate).toBeHidden()
		await page.getByRole("button", { name: /^Pasar malam snacks/ }).click()
		await expect(queue).toBeHidden()
		await expect(candidate).toBeVisible()
		await expect(
			page.getByRole("button", { name: "Back to pending Statements", exact: true }),
		).toBeVisible()
	})
	await test.step("Account, Budget, Category and rule pages: content does not overflow horizontally", async () => {
		for (const route of ["/accounts", "/budgets", "/categories", "/statement-rules"]) {
			await page.goto(route)
			await expect(page.locator("main article").first()).toBeVisible()
			expect(
				await page.evaluate(
					() =>
						document.documentElement.scrollWidth - document.documentElement.clientWidth,
				),
				route,
			).toBeLessThanOrEqual(1)
		}
	})
	await test.step("Record creator: keeps at least 8px of side margin at 800px wide", async () => {
		await page.setViewportSize({ width: 800, height: 800 })
		const dialog = await openEditor(
			page,
			"/records",
			"Create Pending Record",
			"Create New Record",
		)
		const box = await dialog.boundingBox()
		if (!box) throw new Error("Expected the Record creator to have layout")
		expect(box.x).toBeGreaterThanOrEqual(8)
		expect(box.x + box.width).toBeLessThanOrEqual(800 - 8)
	})
})
