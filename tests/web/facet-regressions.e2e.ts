import type { Locator, Page } from "@playwright/test"
import { IDS } from "./support/data"
import { expect, seedWorkspace, test } from "./support/fixtures"

async function patchRows(
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

async function fits(page: Page, element: Locator) {
	await expect(element).toBeVisible()
	const box = await element.boundingBox()
	if (!box) throw new Error("Expected visible geometry")
	expect(box.x).toBeGreaterThanOrEqual(-1)
	expect(box.x + box.width).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + 1)
	expect(
		await page.locator("main").evaluate(el => el.scrollWidth - el.clientWidth),
	).toBeLessThanOrEqual(1)
}

function statementRow(page: Page, id: string) {
	return page
		.locator(`main a[href="/statements/${id}"]`)
		.filter({ visible: true })
		.locator('xpath=ancestor::*[self::tr or contains(@class,"grid-cols-subgrid")][1]')
}

test("record facet journeys share one seed", async ({ page }) => {
	await seedWorkspace(page)
	await test.step("[UI-FACET-ANALYTICS] long Monthly Budget option can be picked, cleared and disabled by treatment", async () => {
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
		await option.click()
		await expect(budget).toContainText(name)
		await fits(page, budget)
		await budget.click()
		await page.getByRole("option", { name: "Unbudgeted", exact: true }).click()
		await expect(budget).toContainText("Unbudgeted")
		await dialog.locator("#analytics_treatment").click()
		await page.getByRole("option", { name: "Income", exact: true }).click()
		await expect(budget).toBeDisabled()
		await dialog.locator("#analytics_treatment").click()
		await page.getByRole("option", { name: "Spending", exact: true }).click()
		await expect(budget).toBeEnabled()
		await expect(budget).toContainText("Unbudgeted")
	})
	await test.step("[UI-FACET-CHART-COMPARISON] category history distinguishes unavailable months from recorded zero spending", async () => {
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
	await test.step("[UI-FACET-MONTHLY-FUTURE] later current-month and future-month Records retain amounts and working drills", async () => {
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
	await test.step("[UI-FACET-RECORD-LONG] long title and optional Record values survive list drill and reload", async () => {
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

test("statement facet journeys share one seed", async ({ page }) => {
	await seedWorkspace(page)
	await test.step("[UI-FACET-STATEMENT-LONG] long pending description stays readable on list and detail with confirmation state", async () => {
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
		await expect(
			page.getByRole("link", { name: "Open Pasar Malam", exact: true }),
		).toBeVisible()
		await page.goto(`/statements/${IDS.statements.splitPair[0]}`)
		await expect(page.getByText("Imported day index · 1", { exact: true })).toBeVisible()
		await expect(page.getByText("Status · Pending Statement", { exact: true })).toHaveCount(0)
		await expect(
			page.getByRole("button", { name: "Edit Pending Statement", exact: true }),
		).toHaveCount(0)
	})
	await test.step("[UI-FACET-STATEMENT-GROUP] signed same-day Statements show their exact grouped subtotal", async () => {
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
	await test.step("[UI-FACET-ACCOUNT-STATE] account rows distinguish pending edits from imported activity", async () => {
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

test("[UI-FACET-WEEKDAY-NULL] no comparison history renders zero current spending without a fabricated baseline", async ({
	page,
}) => {
	await seedWorkspace(page, "empty")
	await page.goto("/?month=October&year=2026")
	const chart = page.locator('[data-slot="card"]').filter({
		has: page.locator('[data-slot="card-title"]').filter({ hasText: "Spending by weekday" }),
	})
	await expect(chart).toContainText("No comparison history available.")
	await chart.getByRole("application").focus()
	const tooltip = chart.locator(".recharts-tooltip-wrapper")
	await expect(tooltip).toContainText("Average per Monday")
	await expect(tooltip).toContainText("$0.00")
	await expect(tooltip).not.toContainText("Previous")
	await expect(chart).not.toContainText(/NaN|Infinity/)
})

test.describe("harness facets", () => {
	test.use({ baseURL: "http://127.0.0.1:5174" })
	test("harness facet primitives share one page", async ({ page }) => {
		await test.step("[UI-FACET-INPUT-GROUP] grouped notes accept long unicode text and keyboard edits", async () => {
			await page.goto("/?section=primitives")
			const notes = page.getByRole("textbox", { name: "Grouped notes", exact: true })
			const value = "Notes 早餐 café ".repeat(20).trim()
			await notes.fill(value)
			await expect(notes).toHaveValue(value)
			await notes.press("End")
			await notes.press("!")
			await expect(notes).toHaveValue(`${value}!`)
			const box = await notes.boundingBox()
			expect(box?.x).toBeGreaterThanOrEqual(0)
			expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(
				page.viewportSize()?.width ?? 0,
			)
		})
		await test.step("[UI-FACET-DROPDOWN-STRUCTURE] menu label, separator geometry and submenu shortcut remain readable", async () => {
			await page.goto("/?section=primitives")
			await page.goto("/?section=primitives")
			await page.getByRole("button", { name: "Open menu", exact: true }).click()
			const menu = page.getByRole("menu")
			await expect(menu.getByText("Menu label", { exact: true })).toBeVisible()
			const separators = menu.locator('[data-slot="dropdown-menu-separator"]')
			await expect(separators).toHaveCount(2)
			for (const separator of await separators.all()) {
				const box = await separator.boundingBox()
				expect(box?.height).toBeCloseTo(1, 2)
				expect(box?.width).toBeGreaterThan(10)
			}
			await menu.getByRole("menuitem", { name: "More actions", exact: true }).focus()
			await page.keyboard.press("ArrowRight")
			const shortcut = page.locator('[data-slot="dropdown-menu-shortcut"]')
			await expect(shortcut).toBeVisible()
			await expect(shortcut).toHaveText("⌘E")
			await expect(
				page.getByRole("menuitem", { name: "Export ⌘E", exact: true }),
			).toBeVisible()
		})
		await test.step("[UI-FACET-BADGE] status variants keep semantic colours and long content remains accessible inside the viewport", async () => {
			await page.goto("/?section=primitives")
			await page.goto("/?section=primitives")
			const badges = page.getByTestId("primitive-badge")
			const warning = badges.getByText("Pending", { exact: true })
			const destructive = badges.getByText("Over budget", { exact: true })
			await expect(warning).toBeVisible()
			await expect(destructive).toBeVisible()
			const warningColour = await warning.evaluate(element => getComputedStyle(element).color)
			const destructiveColour = await destructive.evaluate(
				element => getComputedStyle(element).color,
			)
			expect(warningColour).not.toBe(destructiveColour)
			for (const [badge, token] of [
				[warning, "--warning"],
				[destructive, "--destructive"],
			] as const) {
				const colours = await badge.evaluate((element, token) => {
					const context = document.createElement("canvas").getContext("2d")
					if (!context) throw new Error("Canvas colour parser unavailable")
					const style = getComputedStyle(element)
					context.fillStyle = style.color
					const actual = context.fillStyle
					context.fillStyle = "rgba(0, 0, 0, 0)"
					context.fillStyle = style.getPropertyValue(token).trim()
					return { actual, expected: context.fillStyle }
				}, token)
				expect(colours.expected).not.toBe("rgba(0, 0, 0, 0)")
				expect(colours.actual).toBe(colours.expected)
				const style = await badge.evaluate(element => {
					const style = getComputedStyle(element)
					return { color: style.color, background: style.backgroundColor }
				})
				expect(style.background).not.toBe("rgba(0, 0, 0, 0)")
				expect(style.color).not.toBe(style.background)
			}
			const long = page.getByTestId("primitive-long-badge")
			const text = `Archive — ${"早餐 café ☕ ".repeat(12).trim()}`
			await expect(long).toHaveText(text)
			await expect(long).toHaveAttribute("title", text)
			await long.scrollIntoViewIfNeeded()
			const box = await long.boundingBox()
			if (!box) throw new Error("Long badge needs layout")
			expect(box.x).toBeGreaterThanOrEqual(0)
			expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()?.width ?? 0)
			await expect(long).toHaveCSS("text-overflow", "ellipsis")
		})
		await test.step("[UI-FACET-PRIMITIVE-GEOMETRY] scrolling exposes a painted thumb and button separator has visible geometry", async () => {
			await page.goto("/?section=primitives")
			await page.goto("/?section=primitives")
			const separator = page
				.getByTestId("primitive-button-group")
				.locator('[data-slot="button-group-separator"]')
			await separator.scrollIntoViewIfNeeded()
			await expect(separator).toBeVisible()
			const line = await separator.boundingBox()
			expect(line?.width).toBeCloseTo(1, 1)
			expect(line?.height).toBeGreaterThan(8)
			const viewport = page.locator('[data-slot="scroll-area-viewport"]').first()
			await viewport.scrollIntoViewIfNeeded()
			await viewport.hover()
			await viewport.evaluate(element => {
				element.scrollTop = 60
			})
			await expect.poll(() => viewport.evaluate(element => element.scrollTop)).toBe(60)
			const scrollbar = page.locator('[data-slot="scroll-area-scrollbar"]').first()
			const thumb = page.locator('[data-slot="scroll-area-thumb"]').first()
			await expect(scrollbar).toBeVisible()
			await expect(scrollbar).toHaveCSS("opacity", "1")
			await expect(thumb).toBeVisible()
			await expect(thumb).toHaveCSS("opacity", "1")
			const track = await scrollbar.boundingBox()
			const handle = await thumb.boundingBox()
			if (!track || !handle) throw new Error("Scrollbar and thumb need layout")
			expect(handle.width).toBeGreaterThan(0)
			expect(handle.height).toBeGreaterThan(0)
			expect(handle.height).toBeLessThan(track.height)
			expect(handle.y).toBeGreaterThanOrEqual(track.y)
			expect(handle.y + handle.height).toBeLessThanOrEqual(track.y + track.height + 1)
			await expect(thumb).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
		})
		await test.step("[UI-FACET-SKELETON] placeholder geometry stays stable while pulse changes opacity", async () => {
			await page.goto("/?section=primitives")
			await page.goto("/?section=primitives")
			const skeleton = page.getByTestId("standalone-skeleton")
			await skeleton.scrollIntoViewIfNeeded()
			const start = await skeleton.boundingBox()
			const samples = await skeleton.evaluate(async element => {
				const values: string[] = []
				const start = performance.now()
				while (performance.now() - start < 2200) {
					values.push(getComputedStyle(element).opacity)
					await new Promise(requestAnimationFrame)
				}
				return values
			})
			expect(new Set(samples).size).toBeGreaterThan(2)
			await expect(skeleton).toHaveCSS("width", "128px")
			await expect(skeleton).toHaveCSS("height", "16px")
			expect(await skeleton.boundingBox()).toEqual(start)
		})
	})
})
