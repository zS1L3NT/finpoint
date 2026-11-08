import type { Locator, Page } from "@playwright/test"
import { card, chartTooltip, overview } from "../support/charts"
import { expect, seedWorkspace, test } from "../support/fixtures"

test("day drill-down: totals, Back, close, Escape, focus and invalid URLs", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const calendar = card(page, "Spending calendar")
	const day = calendar.getByRole("button", { name: /^5 October:/ })
	await day.focus()
	await day.press("Enter")
	await expect(page).toHaveURL(/drill=day(%3A|:)2026-10-05/)
	const panel = page.getByRole("dialog", { name: /Spending on/ })
	await expect(panel.getByTestId("drill-total")).toHaveText("$84.20")
	await expect(panel.getByTestId("drill-total")).not.toContainText("-$")
	await expect(panel.getByTestId("drill-body")).toContainText("-$84.20")
	await page.goBack()
	await expect(panel).toHaveCount(0)
	await expect(day).toBeFocused()
	await day.press("Enter")
	await panel.getByRole("button", { name: "Close drill-down" }).click()
	await expect(day).toBeFocused()
	await day.press("Enter")
	await expect(panel).toBeVisible()
	await page.keyboard.press("Escape")
	await expect(panel).toHaveCount(0)
	await expect(day).toBeFocused()
	await page.goto(`${overview}&drill=day:2026-02-30`)
	await expect(page.getByTestId("drill-total")).toHaveCount(0)
	await page.goto(`${overview}&drill=day:2026-10-05`)
	await expect(page.getByTestId("drill-total")).toHaveText("$84.20")
	await page.getByRole("link", { name: "Open in Records" }).click()
	await expect(page).toHaveURL(/start_date=2026-10-05/)
	await expect(page).toHaveURL(/end_date=2026-10-05/)
})

test("drill pivot: URL expansion, Statement breadcrumb and browser Back survive reload", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=day:2026-10-05`)
	const row = page.getByTestId("drill-body").locator("button[aria-expanded]").first()
	const amount = await row.getByTestId("drill-row-amount").innerText()
	await row.click()
	await expect(page).toHaveURL(/focus=record%3A/)
	await page.getByTestId("allocation-rows").getByRole("button").first().click()
	await expect(page).toHaveURL(/focus=statement%3A/)
	await expect(page.getByTestId("drill-total")).toHaveText(amount)
	await expect(page.locator("#drill-title").locator("..")).toContainText("Statement ·")
	await expect(page.locator("#drill-title").locator("..")).toContainText(/Funds \d+ Records?/)
	await expect(page.locator("#drill-title").locator("..")).not.toContainText("refunds subtracted")
	await expect(page.getByRole("navigation", { name: "Drill-down breadcrumb" })).toBeVisible()
	await expect(page.getByRole("button", { name: "← Back" })).toBeVisible()
	await expect(page.locator("#drill-title").locator("..")).toContainText("5 Oct 2026, 18:26")
	await expect(page.getByTestId("drill-body")).toContainText(
		"Everyday Savings · 5 Oct 2026, 18:26",
	)
	const body = await page.getByTestId("drill-body").boundingBox()
	const back = await page.getByRole("button", { name: "← Back" }).boundingBox()
	if (!back || !body) throw new Error("Expected visible pivot body and Back button")
	expect(back.y - body.y).toBeGreaterThanOrEqual(12)
	await page.reload()
	await expect(page.getByText("Records allocated to this Statement")).toBeVisible()
	await page.goBack()
	await expect(page).toHaveURL(/focus=record%3A/)
	await expect(row).toHaveAttribute("aria-expanded", "true")
	await page.goForward()
	await page.getByRole("button", { name: "← Back" }).click()
	await expect(page.getByText("Records allocated to this Statement")).toHaveCount(0)
	await page.goto(`${overview}&drill=day:2026-10-05&focus=invalid`)
	await expect(page.getByTestId("drill-total")).toHaveCount(0)
})

test("category, trend and budget selections retain the Dashboard and reconcile their visible amounts", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const mix = card(page, "Categories this month")
	const groceries = mix.getByRole("button", { name: /^Groceries/ })
	await groceries.click()
	await expect(page).toHaveURL(/drill=category-gross/)
	await expect(page.getByTestId("drill-total")).toHaveText("$117.53")
	await page.getByRole("button", { name: "Close drill-down" }).click()
	await expect(page.getByTestId("drill-total")).toHaveCount(0)
	const trend = card(page, "Category trend").getByRole("application")
	await trend.focus()
	await trend.press("End")
	await trend.press("Enter")
	await expect(page).toHaveURL(/drill=month%3A2026-10/)
	await expect(page.getByTestId("drill-total")).toHaveText("$306.63")
	await page.getByRole("button", { name: "Close drill-down" }).click()
	await expect(page.getByTestId("drill-total")).toHaveCount(0)
	const legend = card(page, "Spending forecast").locator('[data-slot="forecast-legend"]')
	await legend.getByRole("button", { name: "Daily", exact: true }).click()
	await expect(page).toHaveURL(/drill=budget/)
	await expect(page.getByTestId("drill-total")).toHaveText("$192.03")
	await expect(page).not.toHaveURL(/scope=/)
	await page.getByRole("button", { name: "Close drill-down" }).click()
	await expect(page.getByTestId("drill-total")).toHaveCount(0)
	const forecast = card(page, "Spending forecast").getByRole("application")
	await forecast.focus()
	await forecast.press("Home")
	await expect(card(page, "Spending forecast").locator(chartTooltip)).toContainText("October 1")
	for (let day = 1; day < 5; day++) {
		await forecast.press("ArrowRight")
		await expect(card(page, "Spending forecast").locator(chartTooltip)).toContainText(
			`October ${day + 1}`,
		)
	}
	await forecast.press("Enter")
	await expect(page).toHaveURL(/drill=day(%3A|:)2026-10-05/)
	await expect(page.getByTestId("drill-total")).toHaveText("$84.20")
})

test("edit from drill returns focus and updates the live total", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=day:2026-10-05`)
	await page.getByTestId("drill-body").locator("button[aria-expanded]").first().click()
	const edit = page.getByRole("button", { name: "Edit Record", exact: true })
	await edit.click()
	const dialog = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await expect(dialog).toBeVisible()
	await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
	await expect(edit).toBeFocused()
	await edit.click()
	const amount = dialog.locator("input#amount")
	const original = Number(await amount.inputValue())
	await amount.fill(String(original + 1))
	await dialog.getByRole("button", { name: "Save changes", exact: true }).click()
	await expect(edit).toBeFocused()
	await expect(page.getByTestId("drill-total")).toHaveText("$85.20")
})

test("Largest Records opens a sorted drill and preserves sort into Records", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const largest = card(page, "Largest Records")
	await expect(largest.locator("button")).toHaveCount(6)
	await largest.getByRole("button", { name: "See all", exact: true }).click()
	await expect(page).toHaveURL(/drill=largest/)
	await expect(
		page.getByTestId("drill-body").locator("button[aria-expanded]").first(),
	).toContainText("Uniqlo Basics")
	await page.getByRole("link", { name: "Open in Records" }).click()
	await expect(page).toHaveURL(/sort=amount_desc/)
	await expect(page.getByRole("combobox", { name: "Sort Records" })).toContainText(
		"Amount: largest first",
	)
	await page.reload()
	await expect(page.getByRole("combobox", { name: "Sort Records" })).toContainText(
		"Amount: largest first",
	)
})

test("Biggest changes compares named periods and preserves the month through reload and Back", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const mover = card(page, "Biggest changes").getByRole("button", {
		name: /Housing.*less than your/,
	})
	await expect(mover).toContainText("less than your 1-month average")
	await expect(card(page, "Biggest changes")).toContainText("Sep 2026")
	await mover.click()
	await expect(page).toHaveURL(/drill=compare/)
	const comparison = page.getByTestId("drill-comparison")
	await expect(comparison).toContainText("$1,400.00")
	await expect(comparison).toContainText("$1,400.00 ÷ 1 month")
	await expect(page.locator("#drill-title").locator("..")).toContainText(
		"$1,400.00 less than your 1-month average",
	)
	await expect(comparison).toContainText("Only in comparison")
	await expect(comparison.locator("section")).toHaveCount(2)
	await page.reload()
	await expect(comparison).toBeVisible()
	await expect(page.getByTestId("drill-total")).toHaveText("$0.00")
	await page.getByRole("button", { name: "Close drill-down" }).click()
	await expect(page).not.toHaveURL(/drill=/)
	await expect(comparison).toHaveCount(0)
	await page.goBack()
	await expect(comparison).toBeVisible()
	await page.getByRole("link", { name: "Open in Records", exact: true }).click()
	await expect(page).toHaveURL(/category_ids=t1-cat-rent/)
})

test("headline and Attention replace review chips with ranked work links", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(overview)
	await expect(page.getByLabel("Month headline")).toContainText("You've spent")
	await expect(page.getByLabel("Month headline")).toContainText("16 days left.")
	await expect(page.getByLabel("Review this month")).toHaveCount(0)
	const attention = page.getByLabel("Attention", { exact: true })
	await expect(attention.locator("li")).toHaveCount(3)
	await attention.getByRole("link", { name: /Pending Record/ }).click()
	await expect(page).toHaveURL(/is_allocated=false/)
})

test("Monthly budgets explain unbudgeted spending and link to custom-period Budgets", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const budgets = card(page, "Monthly budgets")
	await expect(budgets).toContainText("incl. $94.60 not in any Monthly Budget")
	await expect(budgets).toContainText("Amounts are after refunds")
	await budgets.getByRole("link", { name: /Custom-period Budgets/ }).click()
	await expect(page).toHaveURL(/\/budgets$/)
})

test("mobile sheet toggles between two detents with the grab handle and closes with Escape", async ({
	page,
	isMobile,
}) => {
	test.skip(!isMobile, "bottom sheet is the mobile surface")
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=day:2026-10-05`)
	const sheet = page.getByRole("dialog")
	const body = sheet.getByTestId("drill-sheet-body")
	const grab = sheet.getByTestId("drill-grab")
	await expect(body).toHaveAttribute("data-detent", "half")
	await expect(sheet.getByTestId("drill-total").locator("+ p")).toHaveText("1 Record · Spending")
	await expect(grab).toHaveAccessibleName("Expand drill-down")
	await expect(page.locator('[data-slot="sheet-overlay"]')).toHaveCSS(
		"background-color",
		"rgba(0, 0, 0, 0)",
	)
	await expect(sheet.getByText("Total", { exact: true })).toHaveCount(0)
	const height = async () => (await sheet.boundingBox())?.height ?? 0
	await expect.poll(height).toBeGreaterThan(0)
	const half = await height()
	await grab.focus()
	await grab.press("Enter")
	await expect(body).toHaveAttribute("data-detent", "full")
	await expect(grab).toHaveAccessibleName("Collapse drill-down")
	await expect(page.locator('[data-slot="sheet-overlay"]')).not.toHaveCSS(
		"background-color",
		"rgba(0, 0, 0, 0)",
	)
	await expect.poll(height).toBeGreaterThan(half + 100)
	await grab.click()
	await expect(body).toHaveAttribute("data-detent", "half")
	await page.keyboard.press("Escape")
	await expect(sheet).toHaveCount(0)
})

test("Pending drill rows explain their reason before expanding without duplicate captions", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=metric:spent`)
	const body = page.getByTestId("drill-body")
	const row = body.getByRole("button", { name: /Hawker Dinner/ })
	await expect(row).toContainText("$35.00 not allocated yet")
	await row.click()
	const expansion = row.locator("..").getByTestId("allocation-rows")
	await expect(expansion).not.toContainText("allocated")
	await expect(expansion).toContainText("$35.00 remaining to allocate")
})

test("Spending drill labels and signs refunds and reconciles its caption", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=metric:spent`)
	const refund = page.getByTestId("drill-body").getByRole("button", { name: /Returned Kettle/ })
	await expect(refund).toContainText("Refund")
	await expect(refund).toContainText("+$20.00")
	await expect(refund.getByText("+$20.00", { exact: true })).toHaveClass(/text-creative/)
	await expect(page.locator("#drill-title").locator("..")).toContainText(
		"$306.63 spent − $20.00 refunds",
	)
})

test("past empty month shows one dated message and no empty charts", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto("/?month=January&year=2025")
	await expect(page.getByLabel("Month headline")).toHaveText("No Records in January 2025.")
	await expect(page.getByText(/Nothing recorded/)).toHaveCount(0)
	await expect(page.getByRole("application")).toHaveCount(0)
	await expect(page.getByRole("link", { name: "Import statements", exact: true })).toBeVisible()
	await expect(page.getByRole("button", { name: /Spent/ })).toHaveCount(0)
})

test("Spent drill groups Records with net category subtotals", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=metric:spent`)
	const body = page.getByTestId("drill-body")
	await expect(
		body.getByRole("heading", { name: "Groceries $117.53", exact: true }),
	).toBeVisible()
	await expect(body.getByRole("heading", { name: "Shopping $80.00", exact: true })).toBeVisible()
	await expect(page.getByTestId("drill-total")).toHaveText("$286.63")
})

test("comparison rows show Pending reasons without opening another page", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=compare:t1-cat-dining`)
	const record = page
		.getByTestId("drill-comparison")
		.locator("section")
		.first()
		.getByRole("link", { name: /Hawker Dinner/ })
	await expect(record).toContainText("Pending")
	await expect(record).toContainText("$35.00 not allocated yet")
})

const dashboardCards = (page: Page) =>
	page.locator('[data-slot="card"]').evaluateAll(cards =>
		cards.map(card => {
			const box = card.getBoundingClientRect()
			return [box.x, box.y + window.scrollY, box.width, box.height].map(Math.round)
		}),
	)

async function chooseMode(page: Page, label: string) {
	await page.getByRole("button", { name: /^Open as:/ }).click()
	await page.getByRole("menuitemradio", { name: label }).click()
	await expect(page.getByRole("menu")).toHaveCount(0)
}

test("opening and closing a drill moves no Dashboard card", async ({ page }) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const day = card(page, "Spending calendar").getByRole("button", { name: /^5 October:/ })
	await day.scrollIntoViewIfNeeded()
	await expect(page.locator('[data-slot="card"]').first()).toBeVisible()
	await page.waitForTimeout(800)
	const before = await dashboardCards(page)
	await day.click()
	await expect(page.getByTestId("drill-total")).toBeVisible()
	await page.waitForTimeout(500)
	expect(await dashboardCards(page)).toEqual(before)
	await page.getByRole("button", { name: "Close drill-down" }).click()
	await expect(page.getByTestId("drill-total")).toHaveCount(0)
	await page.waitForTimeout(500)
	expect(await dashboardCards(page)).toEqual(before)
})

test("drill opens as side peek, centre peek or full page, switches live and persists", async ({
	page,
	isMobile,
}) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=day:2026-10-05`)
	const dialog = page.getByRole("dialog", { name: /Spending on/ })
	const viewport = page.viewportSize()?.width ?? 0
	const box = async () => (await dialog.boundingBox()) ?? { x: 0, y: 0, width: 0, height: 0 }
	await expect(dialog).toBeVisible()
	await expect.poll(async () => (await box()).width).toBeGreaterThan(0)
	if (isMobile) {
		// Phones keep one peek, the bottom sheet, and still allow the full page.
		await page.getByRole("button", { name: /^Open as:/ }).click()
		await expect(page.getByRole("menuitemradio")).toHaveText(["Peek", "Full page"])
		await page.getByRole("menuitemradio", { name: "Full page" }).click()
	} else {
		await expect.poll(async () => Math.round((await box()).width)).toBe(480)
		expect((await box()).x).toBeGreaterThan(900)
		await chooseMode(page, "Center peek")
		await expect(page).toHaveURL(/drill=day(%3A|:)2026-10-05/)
		await expect.poll(async () => Math.round((await box()).width)).toBe(720)
		expect(Math.abs((await box()).x * 2 + (await box()).width - viewport)).toBeLessThan(20)
		await page.reload()
		await expect(dialog).toBeVisible()
		await expect.poll(async () => Math.round((await box()).width)).toBe(720)
	}
	if (!isMobile) await chooseMode(page, "Full page")
	await expect(page).toHaveURL(/\/drill\?.*drill=day%3A2026-10-05/)
	await expect(page.getByTestId("drill-total")).toHaveText("$84.20")
	await expect(page.getByRole("dialog")).toHaveCount(0)
	await page.reload()
	await expect(page.getByTestId("drill-total")).toHaveText("$84.20")
	// The preference is full page now: a Dashboard link with a drill opens the page.
	await page.goto(`${overview}&drill=day:2026-10-05`)
	await expect(page).toHaveURL(/\/drill\?/)
	await chooseMode(page, isMobile ? "Peek" : "Side peek")
	await expect(page).not.toHaveURL(/\/drill/)
	await expect(dialog).toBeVisible()
})

test("Escape and Back restore scroll and focus in every mode", async ({ page, isMobile }) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const calendar = card(page, "Spending calendar")
	const day = calendar.getByRole("button", { name: /^5 October:/ })
	await day.scrollIntoViewIfNeeded()
	const scrolled = await page.evaluate(() => window.scrollY)
	expect(scrolled).toBeGreaterThan(100)
	const peeks = isMobile ? ["Peek"] : ["Side peek", "Center peek"]
	for (const peek of peeks) {
		await day.focus()
		await day.press("Enter")
		await expect(page.getByTestId("drill-total")).toBeVisible()
		await chooseMode(page, peek)
		await expect(
			page.locator(
				`[data-slot="sheet-content"][data-side="${isMobile ? "bottom" : peek.startsWith("Side") ? "right" : "center"}"]`,
			),
		).toBeVisible()
		await expect(page.locator("#drill-title")).toBeFocused()
		// The pointer rests on the new layout: a hovered tooltip would take the first Escape.
		await page.mouse.move(2, 2)
		await expect(page.getByRole("tooltip")).toHaveCount(0)
		await page.keyboard.press("Escape")
		await expect(page.getByTestId("drill-total")).toHaveCount(0)
		await expect(day).toBeFocused()
		expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrolled)).toBeLessThan(3)
	}
	await day.focus()
	await day.press("Enter")
	await chooseMode(page, "Full page")
	await expect(page).toHaveURL(/\/drill\?/)
	await page.getByRole("button", { name: "Back to Dashboard" }).click()
	await expect(page).not.toHaveURL(/\/drill/)
	await expect(day).toBeFocused()
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrolled - 3)
	expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrolled)).toBeLessThan(3)
	await day.press("Enter")
	await expect(page).toHaveURL(/\/drill\?/)
	await page.keyboard.press("Escape")
	await expect(page).not.toHaveURL(/\/drill/)
	await expect(day).toBeFocused()
	await day.press("Enter")
	await expect(page).toHaveURL(/\/drill\?/)
	await page.goBack()
	await expect(page).not.toHaveURL(/\/drill/)
	await expect(day).toBeFocused()
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrolled - 3)
})

test("drill rows: only clickable rows react, hover fills sit inset and nothing shifts", async ({
	page,
	isMobile,
}) => {
	await seedWorkspace(page)
	await page.goto(`${overview}&drill=metric:spent`)
	const body = page.getByTestId("drill-body")
	const row = body.locator("button[aria-expanded]").first()
	const heading = body.getByRole("heading", { name: /^Groceries/ })
	const fill = (locator: Locator) =>
		locator.evaluate(element => getComputedStyle(element).backgroundColor)
	await expect(row).toBeVisible()
	// Let the body's entrance settle so the boxes below are final.
	await page.waitForTimeout(600)
	await body.evaluate(element => element.scrollTo(0, 0))
	const before = await row.boundingBox()
	const area = await body.boundingBox()
	if (!before || !area) throw new Error("Drill rows are not on screen")
	// The fill clears the text: the row sits inside the body's padding, not against its edge.
	expect(before.x).toBeGreaterThan(area.x + 4)
	expect(before.x + before.width).toBeLessThan(area.x + area.width - 4)
	expect(await fill(row)).toBe("rgba(0, 0, 0, 0)")
	if (!isMobile) {
		await row.hover()
		await expect.poll(() => fill(row)).not.toBe("rgba(0, 0, 0, 0)")
		expect(await row.boundingBox()).toEqual(before)
		await heading.hover()
		expect(await fill(heading)).toBe("rgba(0, 0, 0, 0)")
		await expect(heading).toHaveCSS("cursor", "auto")
	}
	await row.focus()
	await page.keyboard.press("Shift+Tab")
	await page.keyboard.press("Tab")
	await expect(row).toBeFocused()
	await expect(row).not.toHaveCSS("box-shadow", "none")
	await expect(row).toHaveCSS("border-radius", "10px")
})

for (const width of [1440, 1024]) {
	test(`Dashboard cards sharing a row have equal heights at ${width}px`, {
		tag: "@desktop-only",
	}, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 })
		await seedWorkspace(page)
		await page.goto(overview)
		await expect(card(page, "Largest Records")).toBeVisible()
		await expect(card(page, "Biggest changes")).toBeVisible()
		await page.waitForTimeout(800)
		const rows = await page.locator('[data-slot="card"]').evaluateAll(cards => {
			const byTop = new Map<number, number[]>()
			for (const element of cards) {
				const box = element.getBoundingClientRect()
				const top = Math.round(box.top + window.scrollY)
				byTop.set(top, [...(byTop.get(top) ?? []), box.height])
			}
			return [...byTop.values()].filter(heights => heights.length > 1)
		})
		// Wide layouts put cards side by side; every shared row must end at one height.
		if (width >= 1440) expect(rows.length).toBeGreaterThanOrEqual(3)
		for (const heights of rows)
			expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1)
	})
}
