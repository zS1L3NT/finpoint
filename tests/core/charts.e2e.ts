import type { Page } from "@playwright/test"
import { card, chartTooltip, overview, overviewCharts, themedRgb } from "../support/charts"
import { IDS } from "../support/data"
import { setDateOnly } from "../support/date-only"
import { expect, seedWorkspace, test } from "../support/fixtures"

const cardTitles = [
	"Spending forecast",
	"Surplus / Shortfall",
	"Spending by day",
	"Category trend",
	"Categories this month",
	"Monthly budgets",
	"Spending calendar",
	"Biggest changes",
]

const overflow = (chart: ReturnType<typeof card>) =>
	chart.evaluate(element => element.scrollWidth - element.clientWidth)

function metric(page: Page, label: string) {
	return page
		.getByRole("button", { name: new RegExp(`^${label} ›`) })
		.locator("div.min-h-24.bg-card")
}

test("Budget detail: usage tooltip reconciles actual and projected spending even with a zero plan", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto("/budgets/t1-b-manual")
	const chart = page.locator('[data-slot="card"]').filter({
		has: page.locator('[data-slot="card-title"]').filter({ hasText: "Spending over time" }),
	})
	const application = chart.getByRole("application")
	await application.focus()
	for (let index = 0; index < 4; index++) await page.keyboard.press("ArrowRight")
	const tooltip = chart.locator(chartTooltip)
	await expect(tooltip).toContainText("5 Oct")
	await expect(tooltip).toContainText("$84.20")
	for (let index = 0; index < 5; index++) await page.keyboard.press("ArrowRight")
	await expect(tooltip).toContainText("10 Oct")
	await expect(tooltip).toContainText("$117.53")
	for (let index = 0; index < 21; index++) await page.keyboard.press("ArrowRight")
	await expect(tooltip).toContainText("31 Oct")
	await expect(tooltip).toContainText("Usage (projection)")
	await expect(tooltip).toContainText("$242.90")
	await page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
			open.onerror = () => reject(open.error)
		})
		await new Promise<void>((resolve, reject) => {
			const transaction = database.transaction("budgets", "readwrite")
			transaction.oncomplete = () => {
				database.close()
				resolve()
			}
			transaction.onabort = () => reject(transaction.error)
			const request = transaction.objectStore("budgets").get("t1-b-manual")
			request.onsuccess = () =>
				transaction.objectStore("budgets").put({ ...request.result, amount: 0 })
		})
	})
	await page.reload()
	// With a zero plan, the spent amount and every usage value are unchanged.
	const spent = page.getByText("Spent", { exact: true }).locator("..")
	await expect(spent).toContainText("$117.53")
	await expect(spent).toContainText("$0.00")
	await expect(page.locator("main")).not.toContainText(/NaN|Infinity/)
	await application.focus()
	for (let index = 0; index < 4; index++) await page.keyboard.press("ArrowRight")
	await expect(tooltip).toContainText("5 Oct")
	await expect(tooltip).toContainText("$84.20")
	for (let index = 0; index < 5; index++) await page.keyboard.press("ArrowRight")
	await expect(tooltip).toContainText("10 Oct")
	await expect(tooltip).toContainText("$117.53")
	for (let index = 0; index < 21; index++) await page.keyboard.press("ArrowRight")
	await expect(tooltip).toContainText("31 Oct")
	await expect(tooltip).toContainText("$242.90")
	// Every plotted path stays finite.
	const paths = await chart
		.locator("svg path")
		.evaluateAll(elements => elements.map(element => element.getAttribute("d") ?? ""))
	expect(paths.length).toBeGreaterThan(0)
	for (const path of paths) expect(path).not.toMatch(/NaN|Infinity/)
})

test("overview charts: every dense chart fits the viewport with usable graph surfaces", {
	tag: ["@tall"],
}, async ({ page }) => {
	await seedWorkspace(page, "dense")
	await page.goto("/?month=October&year=2026")
	for (const title of [
		...overviewCharts,
		"Categories this month",
		"Monthly budgets",
		"Spending calendar",
		"Biggest changes",
	]) {
		const card = page
			.locator('[data-slot="card"]')
			.filter({ has: page.locator('[data-slot="card-title"]').filter({ hasText: title }) })
		await expect(card).toBeVisible()
		expect(
			await card.evaluate(element => element.scrollWidth - element.clientWidth),
			title,
		).toBeLessThanOrEqual(1)
		await expect(card).not.toContainText(/NaN|Infinity/)
		if (overviewCharts.includes(title)) {
			await card.getByRole("application").focus()
			await page.keyboard.press("ArrowRight")
			await expect(card.locator(chartTooltip)).toBeVisible()
			if (title === "Category trend") await card.getByRole("application").press("End")
		}
	}
})

test("dense overview: cards render values and fit, and a long Category name stays truncated and readable", {
	tag: ["@tall"],
}, async ({ page }) => {
	test.setTimeout(150_000)
	await seedWorkspace(page, "dense")
	await test.step("dense overview cards: every card renders values and fits the viewport", async () => {
		await page.goto(overview)
		for (const title of cardTitles) {
			const chart = card(page, title)
			await expect(chart, title).toBeVisible()
			// Wait for rendered numbers before the negative checks, so they cannot pass on an empty card.
			await expect(chart, `${title}: renders values`).toContainText(/\d/)
			await expect
				.poll(() => overflow(chart), `${title}: no horizontal overflow`)
				.toBeLessThanOrEqual(1)
			await expect(chart, `${title}: finite values`).not.toContainText(/NaN|Infinity/)
		}
		await page.goto("/budgets/t1-d-b-01")
		const progress = card(page, "Spending over time")
		await expect(progress).toBeVisible()
		expect(
			await progress.evaluate(element => element.scrollWidth - element.clientWidth),
			"Spending over time (budget-progress-chart.tsx): no horizontal overflow",
		).toBeLessThanOrEqual(1)
		await expect(progress).not.toContainText(/NaN|Infinity/)
	})
	await test.step("Category mix: a dense long Category name stays truncated and readable", async () => {
		const name = `Dense ${"早餐 café ☕ ".repeat(12).trim()}`
		await page.evaluate(
			async ({ categoryId, name }) => {
				const database = await new Promise<IDBDatabase>((resolve, reject) => {
					const open = indexedDB.open("finpoint")
					open.onsuccess = () => resolve(open.result)
					open.onerror = () => reject(open.error)
				})
				try {
					await new Promise<void>((resolve, reject) => {
						const transaction = database.transaction("categories", "readwrite")
						transaction.oncomplete = () => resolve()
						transaction.onabort = () => reject(transaction.error)
						const request = transaction.objectStore("categories").get(categoryId)
						request.onsuccess = () =>
							transaction.objectStore("categories").put({ ...request.result, name })
					})
				} finally {
					database.close()
				}
			},
			{ categoryId: "t1-d-cat-01", name },
		)
		await page.goto(overview)
		const mix = card(page, "Categories this month")
		const row = mix.getByRole("button", { name: /^Dense 早餐/ })
		await expect(row).toBeVisible()
		const label = row.locator("span.truncate")
		await expect(label).toHaveCSS("text-overflow", "ellipsis")
		expect(
			await label.evaluate(element => element.scrollWidth > element.clientWidth),
			"long category name is cut off with an ellipsis",
		).toBe(true)
		expect(
			await row.evaluate(element => element.scrollWidth - element.clientWidth),
			"the row itself does not overflow",
		).toBeLessThanOrEqual(1)
		// The amount column stays fully visible beside the truncated name.
		const amount = row.locator("span.shrink-0")
		await expect(amount).toBeVisible()
		expect(await amount.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(
			true,
		)
		for (const title of ["Biggest changes", "Spending calendar", "Monthly budgets"]) {
			const chart = card(page, title)
			await expect(chart).toBeVisible()
			expect(
				await chart.evaluate(element => element.scrollWidth - element.clientWidth),
				`${title}: fits with dense long-name data`,
			).toBeLessThanOrEqual(1)
		}
	})
})

test("touch charts: a hold reads and follows the finger, and lifting or cancelling clears it without navigating", async ({
	page,
	isMobile,
	browserName,
}) => {
	// Raw touch input goes through the Chrome DevTools Protocol, so only Chromium phones run it.
	test.skip(!isMobile || browserName !== "chromium", "needs Chromium touch input")
	await seedWorkspace(page)
	await page.goto(overview)
	const chart = card(page, "Spending forecast")
	const surface = chart.getByRole("application")
	await surface.scrollIntoViewIfNeeded()
	const box = await surface.boundingBox()
	if (!box) throw new Error("Spending forecast surface missing")
	const at = { x: box.x + box.width * 0.4, y: box.y + box.height / 2 }
	const tooltip = chart.locator(chartTooltip)
	const touch = await page.context().newCDPSession(page)
	const send = (
		type: "touchStart" | "touchMove" | "touchEnd" | "touchCancel",
		points: { x: number; y: number }[],
	) => touch.send("Input.dispatchTouchEvent", { type, touchPoints: points })
	const url = page.url()
	await test.step("touch chart: a quick tap neither reads nor opens Records", async () => {
		await send("touchStart", [at])
		await send("touchEnd", [])
		await page.waitForTimeout(400)
		await expect(tooltip).toHaveCount(0)
		expect(page.url()).toBe(url)
	})
	await test.step("touch chart: a hold reads and the reading follows the finger", async () => {
		await send("touchStart", [at])
		// Past the 120ms hold.
		await page.waitForTimeout(300)
		await expect(tooltip).toBeVisible()
		const first = await tooltip.textContent()
		await send("touchMove", [{ x: at.x + box.width * 0.3, y: at.y }])
		await expect(tooltip).not.toHaveText(first ?? "")
	})
	await test.step("touch chart: lifting the finger clears the reading and stays on the page", async () => {
		await send("touchEnd", [])
		await expect(tooltip).toHaveCount(0)
		await page.waitForTimeout(400)
		expect(page.url()).toBe(url)
		await expect(tooltip).toHaveCount(0)
	})
	await test.step("touch chart: a cancelled hold clears the reading", async () => {
		await send("touchStart", [at])
		await page.waitForTimeout(300)
		await expect(tooltip).toBeVisible()
		await send("touchCancel", [])
		await expect(tooltip).toHaveCount(0)
		expect(page.url()).toBe(url)
	})
})

test("populated charts: tooltips stay numeric, drills work by keyboard and a Record save updates the mover amount", {
	tag: ["@tall", "@light"],
}, async ({ page }) => {
	test.setTimeout(150_000)
	await seedWorkspace(page)
	await test.step("chart tooltips: stay numeric and inside every viewport", async () => {
		await page.goto(overview)
		const viewport = page.viewportSize()
		for (const title of [
			"Spending forecast",
			"Surplus / Shortfall",
			"Spending by day",
			"Category trend",
		]) {
			const chart = card(page, title)
			const surface = chart.getByRole("application").first()
			await surface.scrollIntoViewIfNeeded()
			await surface.focus()
			for (let index = 0; index < 4; index++) {
				await surface.press("ArrowRight")
				await page.evaluate(() => new Promise(requestAnimationFrame))
			}
			const tooltip = chart.locator(chartTooltip)
			await expect(tooltip, `${title}: tooltip opens by keyboard`).toBeVisible()
			await expect(tooltip, `${title}: tooltip carries a value`).toContainText(/\$/)
			const box = await tooltip.boundingBox()
			expect(box, `${title}: tooltip is laid out`).not.toBeNull()
			if (box && viewport) {
				expect(box.x, `${title}: tooltip inside the left edge`).toBeGreaterThanOrEqual(-8)
				expect(
					box.x + box.width,
					`${title}: tooltip inside the right edge`,
				).toBeLessThanOrEqual(viewport.width + 8)
			}
		}
		await page.goto(`/budgets/${IDS.budgets.manual}`)
		const progress = card(page, "Spending over time")
		const surface = progress.getByRole("application")
		await surface.scrollIntoViewIfNeeded()
		await surface.focus()
		for (let index = 0; index < 4; index++) {
			await surface.press("ArrowRight")
			await page.evaluate(() => new Promise(requestAnimationFrame))
		}
		const tooltip = progress.locator(chartTooltip)
		await expect(tooltip).toBeVisible()
		await expect(tooltip).toContainText("5 Oct")
		await expect(tooltip).toContainText("$84.20")
	})
	await test.step("calendar and movers: day and mover drills work by keyboard", async () => {
		await page.goto(overview)
		const calendar = card(page, "Spending calendar")
		const day = calendar.getByRole("button", { name: /^5 October:/ })
		await day.scrollIntoViewIfNeeded()
		await day.focus()
		await page.keyboard.press("Enter")
		await expect(calendar).toContainText("Mon 5 Oct · $84.20 · 2 Records")
		await page.getByRole("link", { name: "Open in Records", exact: true }).click()
		await expect(page).toHaveURL(/start_date=2026-10-05/)
		await expect(page).toHaveURL(/end_date=2026-10-05/)
		await page.goto(overview)
		const mover = card(page, "Biggest changes").getByRole("button", { name: /Housing/ })
		await mover.scrollIntoViewIfNeeded()
		await mover.focus()
		await page.keyboard.press("Enter")
		await page.getByRole("link", { name: "Open in Records", exact: true }).click()
		await expect(page).toHaveURL(new RegExp(`category_ids=${IDS.categories.rent}`))
	})
	await test.step("biggest changes: a saved Record amount updates the mover row and keeps its drill link and row node", async () => {
		// Baseline comparators: September spending for daily-budget categories so the
		// Groceries mover row exists with a comparison before the live update (same
		// raw-IDB pattern as charts.refund). The update stays in the same scope so
		// the card keeps its keys: scope navigation remounts rows, which cannot
		// prove a bar-scale transition.
		await page.evaluate(async () => {
			const database = await new Promise<IDBDatabase>((resolve, reject) => {
				const open = indexedDB.open("finpoint")
				open.onsuccess = () => resolve(open.result)
				open.onerror = () => reject(open.error)
			})
			try {
				await new Promise<void>((resolve, reject) => {
					const transaction = database.transaction("records", "readwrite")
					transaction.oncomplete = () => resolve()
					transaction.onabort = () => reject(transaction.error)
					const store = transaction.objectStore("records")
					for (const [id, title, datetime, amount, category] of [
						[
							"t1-x-sep-groceries",
							"September Groceries",
							"2026-09-15 18:00",
							-50,
							"t1-cat-groceries",
						],
						[
							"t1-x-sep-dining",
							"September Dinner",
							"2026-09-16 19:30",
							-30,
							"t1-cat-dining",
						],
					] as const) {
						store.put({
							id,
							title,
							people: null,
							location: null,
							description: null,
							datetime,
							amount,
							category_id: category,
							treatment_choice: { kind: "category" },
							monthly_budget_choice: { kind: "category" },
							revision: 1,
						})
					}
				})
			} finally {
				database.close()
			}
		})
		await page.goto(overview)
		const movers = card(page, "Biggest changes")
		const row = movers.getByRole("button", { name: /^Groceries/ })
		await expect(row).toBeVisible()
		const name = await row.textContent()
		const rowHandle = await row.elementHandle()
		if (!rowHandle) throw new Error("Groceries mover row missing")
		// A second page in the same context drives a real editor save: raw
		// indexedDB writes bypass the app's live Dexie subscriptions (Dexie
		// re-fires live queries only for Dexie-originated commits), so only an
		// actual UI save handler propagates live. The first page keeps the same
		// chart/bar DOM throughout; no remount, no fake motion or data state.
		const editor = await page.context().newPage()
		try {
			await setDateOnly(editor, new Date("2026-10-15T12:00:00+08:00"))
			await editor.goto("/records/t1-r-groceries")
			await editor.getByRole("button", { name: "Edit Record", exact: true }).click()
			const dialog = editor.getByRole("dialog", { name: "Edit Record", exact: true })
			await expect(dialog).toBeVisible()
			await dialog.locator("#amount").fill("-142.75")
			await page.bringToFront()
			// Evaluate-click keeps the first page foreground so its rAF keeps
			// ticking while the second page saves.
			const save = await dialog.getByRole("button", { name: "Save changes" }).elementHandle()
			if (!save) throw new Error("editor Save missing")
			await save.evaluate(element => (element as HTMLElement).click())
			await save.dispose()
			// Completion mark only after the committed money lands in the first
			// page. The row aggregates its category (FairPrice −142.75 plus Kōpi
			// −33.33), so the row shows $176.08, not the single-record amount.
			await expect(row).toContainText("$176.08")
		} finally {
			await editor.close()
		}
		await expect(row).toContainText("$176.08")
		expect(await row.textContent()).not.toBe(name)
		expect(
			await rowHandle.evaluate(element => element.isConnected),
			"row node persists (keys kept)",
		).toBe(true)
		await rowHandle.dispose()
	})
})

test.describe("pinned overview date", () => {
	test.beforeEach(async ({ page }) => {
		await setDateOnly(page, new Date("2026-10-15T12:00:00+08:00"))
	})

	// Six populated overview journeys share one seed. Every step navigates back to
	// the overview first, so scope params or record-list drills from an earlier
	// step never leak into the next one.
	test("overview: summary, calendar, Budgets, Category mix, movers and month change reconcile", {
		tag: ["@reduced-motion"],
	}, async ({ page, isMobile }) => {
		test.setTimeout(120_000)
		await seedWorkspace(page)
		await test.step("overview summary: income, refunds and exclusions reconcile across metrics and Category mix", async () => {
			await page.goto(overview)
			await expect(metric(page, "Income")).toContainText("$5,203.50")
			await expect(metric(page, "Spent")).toContainText("$286.63")
			await expect(metric(page, "Left over")).toContainText("$4,916.87")
			await expect(metric(page, "Left over")).toContainText("94.5%")
			for (const label of ["Spent", "Income", "Left over", "Saved this month"]) {
				await page
					.getByRole("button", { name: new RegExp(`^${label}`) })
					.first()
					.click()
				await expect(
					page.getByRole("link", { name: "Open in Records", exact: true }),
				).toBeVisible()
				await page.keyboard.press("Escape")
			}
			const mix = card(page, "Categories this month")
			await expect(mix).toContainText("$306.63 expenses · $20.00 refunds")
			await expect(mix.getByRole("button", { name: /Shopping/ })).toContainText("$100.00")
			await expect(mix.getByRole("button", { name: /Shopping/ })).toContainText(
				"$20.00 refunded · $80.00 net",
			)
			await expect(mix.getByRole("button", { name: /Transfer|Income|Savings/ })).toHaveCount(
				0,
			)
			await expect(card(page, "Biggest changes")).toContainText("Against the 1-month average")
		})
		await test.step("spending calendar: daily amount, zero and refund days drill into exact Records", async () => {
			await page.goto(overview)
			const calendar = card(page, "Spending calendar")
			await expect(calendar.getByRole("button")).toHaveCount(31)
			await expect(
				calendar.getByRole("button", {
					name: "5 October: $84.20 spent across 2 Records",
					exact: true,
				}),
			).toBeVisible()
			await expect(
				calendar.getByRole("button", { name: /^4 October: \$0\.00 spent/ }),
			).toBeVisible()
			await expect(
				calendar.getByRole("button", { name: /^7 October: \$0\.00 spent/ }),
			).toBeVisible()
			await expect(
				calendar.getByRole("button", { name: "16 October: upcoming", exact: true }),
			).toBeDisabled()
			await calendar.getByRole("button", { name: /^5 October:/ }).click()
			await page.getByRole("link", { name: "Open in Records", exact: true }).click()
			await expect(page).toHaveURL(/start_date=2026-10-05/)
			await expect(page).toHaveURL(/end_date=2026-10-05/)
			await expect(
				page.getByRole("link", { name: "Open FairPrice Run", exact: true }),
			).toBeVisible()
			await expect(
				page.getByRole("link", { name: "Open Monthly Salary", exact: true }),
			).toHaveCount(0)
		})
		await test.step("Monthly Budget card: null amount and zero plan remain distinct when scope changes", async () => {
			await page.goto(overview)
			const budgets = card(page, "Monthly budgets")
			await expect(budgets.getByRole("button", { name: "Daily", exact: true })).toBeVisible()
			await expect(budgets).toContainText("$192.03")
			await budgets.getByRole("button", { name: "Daily", exact: true }).click()
			await page
				.getByRole("button", { name: "Show the dashboard for Daily only", exact: true })
				.click()
			await expect(page).toHaveURL(new RegExp(`scope=${IDS.monthlyBudgets.daily}`))
			await page.getByRole("button", { name: "Close drill-down", exact: true }).click()
			await expect(
				budgets.getByRole("button", { name: "Daily", exact: true }),
			).toHaveAttribute("aria-pressed", "true")
			await expect(budgets).toContainText("no plan")
			await expect(card(page, "Categories this month")).toContainText(
				"$192.03 expenses · $0.00 refunds",
			)
			await budgets.getByRole("button", { name: "Recurring", exact: true }).click()
			await page
				.getByRole("button", { name: "Show the dashboard for Recurring only", exact: true })
				.click()
			await expect(page).toHaveURL(new RegExp(`scope=${IDS.monthlyBudgets.recurring}`))
			await page.getByRole("button", { name: "Close drill-down", exact: true }).click()
			await expect(budgets).toContainText("of $0.00")
			await expect(card(page, "Categories this month")).toContainText(
				"No spending or refunds recorded in this scope.",
			)
			await budgets.getByRole("button", { name: "Recurring", exact: true }).click()
			await page
				.getByRole("button", { name: "Show the dashboard for Recurring only", exact: true })
				.click()
			await page.getByRole("button", { name: "Close drill-down", exact: true }).click()
			await page.goto(overview)
			await expect(
				card(page, "Categories this month").getByRole("button", { name: /Shopping/ }),
			).toBeVisible()
		})
		await test.step("Category mix: drilldown carries Treatment and Category filters", async () => {
			await page.goto(overview)
			await card(page, "Categories this month")
				.getByRole("button", { name: /Groceries/ })
				.click()
			await page.getByRole("link", { name: "Open in Records", exact: true }).click()
			await expect(page).toHaveURL(new RegExp(`category_ids=${IDS.categories.groceries}`))
			await expect(page).toHaveURL(/effective_spending=true/)
			await expect(
				page.getByRole("link", { name: "Open FairPrice Run", exact: true }),
			).toBeVisible()
			await expect(
				page.getByRole("link", { name: "Open Monthly Salary", exact: true }),
			).toHaveCount(0)
		})
		await test.step("biggest changes: Category change title and drilldown reconcile with the previous month", async () => {
			await page.goto(overview)
			const housing = card(page, "Biggest changes").getByRole("button", { name: /Housing/ })
			await expect(housing).toContainText("$0.00")
			await expect(housing).toContainText("vs $1,400.00 average")
			await expect(housing).toContainText("▼ $1,400.00")
			await housing.click()
			await page.getByRole("link", { name: "Open in Records", exact: true }).click()
			await expect(page).toHaveURL(new RegExp(`category_ids=${IDS.categories.rent}`))
			await expect(
				page.getByText("No records found.", { exact: true }).filter({ visible: true }),
			).toBeVisible()
		})
		await test.step("overview metrics: month change updates values and the accessible sparkline period", async () => {
			await page.goto(overview)
			await expect(metric(page, "Spent")).toContainText("$286.63")
			if (!isMobile)
				await expect(page.getByRole("img", { name: /^Spent ›, .*last/ })).toBeVisible()
			await page.getByRole("button", { name: "Previous month", exact: true }).click()
			await expect(
				page.getByRole("heading", { name: "September 2026", exact: true }),
			).toBeVisible()
			await expect(metric(page, "Spent")).toContainText("$1,400.00")
			await expect(metric(page, "Left over")).toContainText("-$1,400.00")
			await expect(metric(page, "Left over")).toContainText("Income less personal spending")
			await page.getByRole("button", { name: "Next month", exact: true }).click()
			await expect(metric(page, "Spent")).toContainText("$286.63")
		})
	})

	test("Monthly Budget cards: drill first, scope explicitly and edit independently", async ({
		page,
	}) => {
		await seedWorkspace(page)
		await page.goto(overview)
		const budgets = card(page, "Monthly budgets")
		await expect(budgets.locator("svg[role=group]")).toHaveCount(0)
		await expect(
			budgets.getByRole("button", { name: "New Monthly Budget", exact: true }),
		).toBeVisible()
		await budgets.getByRole("button", { name: "Daily", exact: true }).click()
		await expect(page).not.toHaveURL(/scope=/)
		await expect(page.getByTestId("drill-total")).toHaveText("$192.03")
		await page
			.getByRole("button", { name: "Show the dashboard for Daily only", exact: true })
			.click()
		await expect(page).toHaveURL(new RegExp(`scope=${IDS.monthlyBudgets.daily}`))
		await page.getByRole("button", { name: "Close drill-down", exact: true }).click()
		await budgets.getByRole("button", { name: "Edit Daily", exact: true }).click()
		await expect(page.getByRole("dialog", { name: "Edit Daily" })).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(page.getByTestId("drill-total")).toHaveCount(0)
	})

	test("spending calendar: month lengths show exactly their valid dates on an empty workspace", async ({
		page,
	}) => {
		await seedWorkspace(page, "empty")
		for (const [month, year, days] of [
			["February", 2024, 29],
			["February", 2025, 28],
			["April", 2026, 30],
			["September", 2026, 30],
		] as const) {
			await test.step(`spending calendar: ${month} ${year} has exactly ${days} valid dates`, async () => {
				await page.goto(`/?month=${month}&year=${year}`)
				const calendar = card(page, "Spending calendar")
				await expect(calendar.getByRole("button")).toHaveCount(days)
				await expect(
					calendar.getByRole("button", {
						name: new RegExp(`^${days} ${month}: \\$0\\.00 spent$`),
					}),
				).toBeVisible()
				await calendar
					.getByRole("button", { name: new RegExp(`^${days} ${month}:`) })
					.click()
				await page.getByRole("link", { name: "Open in Records", exact: true }).click()
				const date = `${year}-${month === "February" ? "02" : month === "April" ? "04" : "09"}-${days}`
				await expect(page).toHaveURL(new RegExp(`start_date=${date}`))
				await expect(
					page.getByText("No records found.", { exact: true }).filter({ visible: true }),
				).toBeVisible()
			})
		}
	})

	test("chart tooltips: keyboard sweeps expose actual numeric values", async ({ page }) => {
		test.setTimeout(120_000)
		await seedWorkspace(page)
		for (const title of [
			"Spending forecast",
			"Surplus / Shortfall",
			"Spending by day",
			"Category trend",
			"Spending over time",
		]) {
			await test.step(`chart tooltips: ${title} keyboard navigation exposes actual numeric values`, async () => {
				await page.goto(
					title === "Spending over time" ? `/budgets/${IDS.budgets.manual}` : overview,
				)
				const chart = card(page, title)
				const surface = chart.getByRole("application").first()
				await surface.scrollIntoViewIfNeeded()
				await surface.focus()
				const tooltip = chart.locator(chartTooltip)
				if (title === "Category trend") {
					// Reading a month updates the shared category list beside the chart.
					const breakdown = page.getByRole("group", { name: /^Categories in / })
					await surface.press("Home")
					await expect(tooltip).toBeVisible()
					const first = (await tooltip.locator("span").first().textContent()) ?? ""
					expect(first, "readout names the first month").toMatch(/^[A-Z][a-z]{2} \d{4}$/)
					await expect(breakdown, "list follows the read month").toHaveAccessibleName(
						`Categories in ${first}`,
					)
					await surface.press("End")
					await expect(tooltip).toContainText("Total $")
					await expect(breakdown).toContainText("selected month")
					await expect(breakdown).toContainText("$100.00")
					await expect(breakdown).toContainText("$117.53")
				} else {
					for (let index = 0; index < 3; index++) {
						await surface.press("ArrowRight")
						await page.evaluate(() => new Promise(requestAnimationFrame))
					}
					await expect(tooltip).toBeVisible()
					if (title === "Spending by day") {
						await expect(tooltip).toContainText("October 4")
						await expect(tooltip).toContainText("-$20.00")
						await surface.press("ArrowRight")
						await expect(tooltip).toContainText("October 5")
						await expect(tooltip).toContainText("$84.20")
					} else if (title === "Spending forecast") {
						await surface.press("ArrowRight")
						await expect(tooltip).toContainText("October 5")
						await expect(
							tooltip.getByText("Daily", { exact: true }).locator(".."),
						).toContainText("$84.20")
						await expect(
							tooltip.getByText("Unbudgeted", { exact: true }).locator(".."),
						).toContainText("-$17.90")
						await expect(tooltip.getByText("Total", { exact: true })).toHaveCount(1)
						await expect(
							tooltip.getByText("Total", { exact: true }).locator(".."),
						).toContainText("$66.30")
						await expect(
							card(page, title).getByRole("button", { name: "Daily", exact: true }),
						).toBeVisible()
					} else {
						await surface.press("ArrowRight")
						await expect(tooltip).toContainText(
							title === "Surplus / Shortfall" ? "$5,137.20" : "$84.20",
						)
					}
				}
			})
		}
	})

	test("empty overview: no history gives zero metrics and useful chart explanations", async ({
		page,
	}) => {
		await seedWorkspace(page, "empty")
		await page.goto(overview)
		await expect(metric(page, "Income")).toContainText("None recorded")
		await expect(metric(page, "Spent")).toContainText("$0.00")
		await expect(metric(page, "Left over")).toContainText("Income less personal spending")
		await expect(metric(page, "Left over")).toContainText("$0.00")
		await expect(page.getByRole("button", { name: /^Saved this month/ })).toContainText("$0.00")
		await expect(card(page, "Category trend")).toContainText(
			"No spending in the available months.",
		)
		await expect(card(page, "Biggest changes")).toContainText(
			"Not enough history to compare categories yet.",
		)
		await expect(card(page, "Spending calendar")).toContainText("0 spending days · $0.00")
	})

	test("empty overview: the demo offer loads demo data and then goes away", async ({ page }) => {
		await seedWorkspace(page, "empty")
		await page.goto(overview)
		await expect(page.getByText("New to Finpoint?")).toBeVisible()
		await expect(page.getByRole("link", { name: "Import statements" })).toHaveAttribute(
			"href",
			"/importer",
		)

		await page.getByRole("button", { name: "Try demo data" }).click()
		await expect(page.getByText("Demo workspace loaded.")).toBeVisible()
		await expect(page.getByText("New to Finpoint?")).toBeHidden()
	})

	test("net refund: long Category name and excluded Treatment retain numeric meaning", async ({
		page,
	}) => {
		await seedWorkspace(page)
		const name = `Groceries ${"早餐 café ☕ ".repeat(20)}`
		await page.evaluate(
			async ({ categoryId, name }) => {
				const database = await new Promise<IDBDatabase>((resolve, reject) => {
					const open = indexedDB.open("finpoint")
					open.onsuccess = () => resolve(open.result)
					open.onerror = () => reject(open.error)
				})
				try {
					await new Promise<void>((resolve, reject) => {
						const transaction = database.transaction(
							["records", "categories"],
							"readwrite",
						)
						transaction.oncomplete = () => resolve()
						transaction.onabort = () => reject(transaction.error)
						const record = transaction.objectStore("records").get("t1-r-refund")
						record.onsuccess = () =>
							transaction
								.objectStore("records")
								.put({ ...record.result, amount: 400 })
						const category = transaction.objectStore("categories").get(categoryId)
						category.onsuccess = () =>
							transaction.objectStore("categories").put({ ...category.result, name })
					})
				} finally {
					database.close()
				}
			},
			{ categoryId: IDS.categories.groceries, name },
		)
		await page.goto(overview)
		await expect(metric(page, "Total net refund")).toContainText("$93.37")
		await expect(metric(page, "Left over")).toContainText("$5,296.87")
		const mix = card(page, "Categories this month")
		await expect(mix.getByRole("button", { name: /Shopping/ })).toContainText(
			"$400.00 refunded · -$300.00 net",
		)
		await expect(mix.getByRole("button", { name: new RegExp("^Groceries") })).toContainText(
			name.trim(),
		)
		const size = await mix.evaluate(element => ({
			width: element.clientWidth,
			scroll: element.scrollWidth,
		}))
		expect(size.scroll).toBeLessThanOrEqual(size.width + 1)
		await expect(
			card(page, "Spending calendar").getByRole("button", { name: /^4 October:/ }),
		).toHaveAttribute("aria-label", /\$0\.00 spent/)
		await mix.getByRole("button", { name: /^Groceries/ }).click()
		await page.getByRole("link", { name: "Open in Records", exact: true }).click()
		await expect(page).toHaveURL(new RegExp(`category_ids=${IDS.categories.groceries}`))
		await expect(
			page.getByRole("link", { name: "Open FairPrice Run", exact: true }),
		).toBeVisible()
	})

	test("Monthly Budget rows: zero and null plans never display invalid percentages", async ({
		page,
	}) => {
		await seedWorkspace(page, "dense")
		await page.goto(overview)
		const budgets = card(page, "Monthly budgets")
		await expect(budgets.getByRole("button", { name: "Daily", exact: true })).toBeVisible()
		await expect(budgets).toContainText("no plan")
		await expect(budgets.getByRole("button", { name: "Recurring", exact: true })).toBeVisible()
		await expect(budgets).not.toContainText(/NaN|Infinity/)
		await expect(card(page, "Categories this month")).not.toContainText(/NaN|Infinity/)
		await expect(card(page, "Spending by day").getByRole("application")).toBeVisible()
	})
})

test("Spending forecast: retains gradient backdrops and comparison lines", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto(overview)
	const chart = card(page, "Spending forecast")
	await expect(chart.locator('[data-series="total"][fill="none"]')).toHaveAttribute("d", /.+/)
	for (const path of await chart.locator("[data-series]").all()) {
		await expect(path).toHaveAttribute("d", /.+/)
		const fill = await path.getAttribute("fill")
		const series = await path.getAttribute("data-series")
		if (fill?.startsWith("url(#")) {
			const id = fill.slice(5, -1)
			await expect(chart.locator(`linearGradient[id="${id}"]`)).toHaveCount(1)
			if (!series?.endsWith("-projection"))
				await expect(path).toHaveAttribute(
					"fill-opacity",
					series === "total" ? "0.1" : "0.3",
				)
		}
		if (series?.endsWith("-projection") && fill === "none")
			await expect(path).toHaveAttribute("stroke-dasharray", "7 5")
	}
	await expect(chart.locator('[data-series="total-previous"]')).toHaveAttribute(
		"stroke-dasharray",
		"2 4",
	)
	await page.goto(`${overview}&scope=${IDS.monthlyBudgets.daily}`)
	await expect(
		card(page, "Spending forecast").locator('[data-series$="-previous"]'),
	).toHaveAttribute("stroke-dasharray", "2 4")
})

test("Spending forecast: preserves scope and legend semantics", { tag: ["@light"] }, async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto(overview)
	const chart = card(page, "Spending forecast")
	const legend = chart.locator('[data-slot="forecast-legend"]')
	await expect(legend.getByRole("button").first()).toHaveText("Total")
	await expect(legend.getByRole("button")).toHaveCount(4)
	const dot = legend.getByRole("button").first().locator("span.size-2")
	expect(await dot.evaluate(element => getComputedStyle(element).backgroundColor)).toBe(
		await themedRgb(page, "var(--foreground)"),
	)
	await expect(chart.getByText("Total budget", { exact: true })).toBeVisible()
	await page.getByRole("combobox", { name: "Spending scope", exact: true }).click()
	await expect(page.getByRole("option", { name: "All budgets", exact: true })).toBeVisible()
	await expect(page.getByRole("option")).toHaveText(["All budgets", "Daily", "Recurring"])
	await expect(page.locator('[data-slot="select-separator"]')).toHaveCount(0)

	await expect(page.getByRole("option", { name: "All spending", exact: true })).toHaveCount(0)
	await page.getByRole("option", { name: "Recurring", exact: true }).click()
	await expect(chart.getByText("Recurring budget", { exact: true })).toBeVisible()
})

test("overview: forecast fills XL card and category hover preserves bars", async ({
	page,
	isMobile,
}) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const forecast = card(page, "Spending forecast")
	if (!isMobile) {
		for (const width of [1440, 1920, 2560]) {
			await page.setViewportSize({ width, height: 1080 })
			await expect
				.poll(async () => {
					const content = await forecast
						.locator('[data-slot="card-content"]')
						.boundingBox()
					const summary = await forecast
						.locator('[data-slot="card-content"]')
						.locator(":scope > :last-child")
						.boundingBox()
					return content && summary
						? content.y + content.height - summary.y - summary.height
						: 999
				})
				.toBeLessThan(2)
		}
	}
	const surface = card(page, "Category trend").getByRole("application")
	await surface.scrollIntoViewIfNeeded()
	const marks = surface.locator('[data-slot="chart-mark"]')
	const paths = await marks.evaluateAll(elements =>
		elements.map(element => element.getAttribute("d")),
	)
	await surface.focus()
	await surface.press("End")
	await expect(card(page, "Category trend").locator(chartTooltip)).toBeVisible()
	await expect
		.poll(() =>
			marks.evaluateAll(elements => elements.map(element => element.getAttribute("d"))),
		)
		.toEqual(paths)
	const dimmed = surface.locator("g.opacity-65").first()
	await expect
		.poll(() => dimmed.evaluate(element => Number(getComputedStyle(element).opacity)))
		.toBeGreaterThanOrEqual(0.6)
	await expect(page.getByText("Spending by weekday", { exact: true })).toHaveCount(0)
})

test("category trend: one shared list follows the read month and keeps its links reachable", async ({
	page,
	isMobile,
}) => {
	await seedWorkspace(page)
	await page.goto(overview)
	const chart = card(page, "Category trend")
	const surface = chart.getByRole("application")
	const list = page.getByRole("group", { name: /^Categories in / })
	await expect(list).toHaveAccessibleName("Categories in Oct 2026")
	await expect(list).toContainText("$20.00 refunded")
	await expect(chart.getByRole("group", { name: /^Categories in / })).toHaveCount(0)
	await surface.scrollIntoViewIfNeeded()
	await surface.focus()
	await surface.press("Home")
	await expect(list).toHaveAccessibleName("Categories in Jun 2026")
	await surface.press("ArrowRight")
	await surface.press("ArrowRight")
	await surface.press("ArrowRight")
	await expect(list).toHaveAccessibleName("Categories in Sep 2026")
	await expect(list.getByRole("button").first()).toBeVisible()
	if (!isMobile) {
		const box = await surface.boundingBox()
		if (!box) throw new Error("Category trend surface missing")
		await surface.hover({ position: { x: box.width * 0.7, y: 80 } })
		await list.hover()
		await expect(list).toHaveAccessibleName("Categories in Sep 2026")
	}
	await surface.focus()
	await surface.press("End")
	await expect(list).toHaveAccessibleName("Categories in Oct 2026")
	await expect(card(page, "Categories this month")).toContainText("$20.00 refunded")
})

test("category cards: cap five rows and keep equal XL heights when expanding", async ({
	page,
	isMobile,
}) => {
	await setDateOnly(page, new Date("2026-11-01T12:00:00+08:00"))
	await seedWorkspace(page, "dense")
	await page.goto(overview)
	if (!isMobile) await page.setViewportSize({ width: 1920, height: 1080 })
	const categories = card(page, "Categories this month")
	const chart = card(page, "Category trend")
	const toggle = categories.getByRole("button", { name: /more categories/ })
	await expect(categories.locator("button.group")).toHaveCount(5)
	await expect(toggle).toHaveAttribute("aria-expanded", "false")
	for (const expanded of [false, true, false]) {
		if (expanded) await toggle.click()
		else if (await categories.getByRole("button", { name: "Show fewer categories" }).count())
			await categories.getByRole("button", { name: "Show fewer categories" }).click()
		if (expanded) expect(await categories.locator("button.group").count()).toBeGreaterThan(5)
		else await expect(categories.locator("button.group")).toHaveCount(5)
		if (!isMobile) {
			await expect
				.poll(async () => {
					const left = await categories.boundingBox()
					const right = await chart.boundingBox()
					return left && right ? Math.abs(left.height - right.height) : 999
				})
				.toBeLessThan(2)
		}
	}
})

test("category cards: reading different months keeps the XL row and chart height stable", async ({
	page,
	isMobile,
}) => {
	test.skip(isMobile, "Cards share a row at XL widths")
	await setDateOnly(page, new Date("2026-11-01T12:00:00+08:00"))
	await seedWorkspace(page, "dense")
	await page.setViewportSize({ width: 1920, height: 1080 })
	await page.goto(overview)
	const chart = card(page, "Category trend")
	const surface = chart.getByRole("application")
	await surface.focus()
	await surface.press("End")
	const height = await chart.evaluate(element => element.getBoundingClientRect().height)
	const chartHeight = await surface.evaluate(element => element.getBoundingClientRect().height)
	for (const key of ["Home", "ArrowRight", "ArrowRight", "ArrowRight", "End"]) {
		await surface.press(key)
		await expect
			.poll(() => chart.evaluate(element => element.getBoundingClientRect().height))
			.toBe(height)
		await expect
			.poll(() => surface.evaluate(element => element.getBoundingClientRect().height))
			.toBe(chartHeight)
	}
})
