import type { Page } from "@playwright/test"
import { card, chartTooltip, overview, overviewCharts } from "../support/charts"
import { getScenario, IDS } from "../support/data"
import { setDateOnly } from "../support/date-only"
import { expect, seedWorkspace, test } from "../support/fixtures"

const cardTitles = [
	"Spending forecast",
	"Surplus / Shortfall",
	"Spending by day",
	"Spending by weekday",
	"Category trend",
	"Categories this month",
	"Monthly budgets",
	"Spending calendar",
	"Biggest changes",
]

const overflow = (chart: ReturnType<typeof card>) =>
	chart.evaluate(element => element.scrollWidth - element.clientWidth)

function metric(page: Page, label: string) {
	// "Total surplus" is a prefix of "Total surplus rate"; exclude the rate tile.
	if (label === "Total surplus")
		return page.locator("div.min-h-24.bg-card", { hasText: /Total surplus(?! rate)/ })
	return page.locator("div.min-h-24.bg-card", { hasText: label })
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
		const row = mix.getByRole("link", { name: /^Dense 早餐/ })
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
			"Spending by weekday",
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
		await calendar.getByRole("button", { name: "View Records", exact: true }).focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/start_date=2026-10-05/)
		await expect(page).toHaveURL(/end_date=2026-10-05/)
		await page.goto(overview)
		const mover = card(page, "Biggest changes").getByRole("link", { name: /Housing/ })
		await mover.scrollIntoViewIfNeeded()
		await mover.focus()
		await page.keyboard.press("Enter")
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
							analytics_treatment: "spending",
							analytics_treatment_source: "category",
							monthly_budget_id: "t1-mb-daily",
							monthly_budget_source: "category",
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
		const row = movers.getByRole("link", { name: /^Groceries/ })
		await expect(row).toBeVisible()
		const href = await row.getAttribute("href")
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
			// −33.33), so the title shows $176.08, not the single-record amount.
			await expect(row).toHaveAttribute("title", /176\.08/)
		} finally {
			await editor.close()
		}
		await expect(row).toHaveAttribute("title", /176\.08/)
		expect(await row.getAttribute("href"), "drill link identity retained").toBe(href)
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
			await expect(metric(page, "Total income")).toContainText("$5,203.50")
			await expect(metric(page, "Total spending")).toContainText("$286.63")
			await expect(metric(page, "Total surplus")).toContainText("$4,916.87")
			await expect(metric(page, "Total surplus rate")).toContainText("94.5%")
			const mix = card(page, "Categories this month")
			await expect(mix).toContainText("$306.63 expenses · $20.00 refunds")
			await expect(mix.getByRole("link", { name: /Shopping/ })).toContainText("$100.00")
			await expect(mix.getByRole("link", { name: /Shopping/ })).toContainText(
				"$20.00 refunded · $80.00 net",
			)
			await expect(mix.getByRole("link", { name: /Transfer|Income|Savings/ })).toHaveCount(0)
			await expect(card(page, "Spending by weekday")).toContainText(
				"Compared with 1 previous full months",
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
			await calendar.getByRole("button", { name: "View Records", exact: true }).click()
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
			await expect(page).toHaveURL(new RegExp(`scope=${IDS.monthlyBudgets.daily}`))
			await expect(
				budgets.getByRole("button", { name: "Daily", exact: true }),
			).toHaveAttribute("aria-pressed", "true")
			await expect(budgets).toContainText("No planned amount")
			await expect(card(page, "Categories this month")).toContainText(
				"$192.03 expenses · $0.00 refunds",
			)
			await budgets.getByRole("button", { name: "Recurring", exact: true }).click()
			await expect(page).toHaveURL(new RegExp(`scope=${IDS.monthlyBudgets.recurring}`))
			await expect(budgets.locator('[aria-label="$0.00 planned"]')).toBeVisible()
			await expect(card(page, "Categories this month")).toContainText(
				"No spending or refunds recorded in this scope.",
			)
			await budgets.getByRole("button", { name: "Recurring", exact: true }).click()
			await expect(page).not.toHaveURL(/scope=/)
			await expect(
				card(page, "Categories this month").getByRole("link", { name: /Shopping/ }),
			).toBeVisible()
		})
		await test.step("Category mix: drilldown carries Treatment and Category filters", async () => {
			await page.goto(overview)
			await card(page, "Categories this month")
				.getByRole("link", { name: /Groceries/ })
				.click()
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
			const housing = card(page, "Biggest changes").getByRole("link", { name: /Housing/ })
			await expect(housing).toHaveAttribute("title", "Housing: $0.00 vs $1,400.00 average")
			await expect(housing).toContainText("−$1,400.00")
			await housing.click()
			await expect(page).toHaveURL(new RegExp(`category_ids=${IDS.categories.rent}`))
			await expect(page.getByText("No matching Records", { exact: true })).toBeVisible()
		})
		await test.step("overview metrics: month change updates values and the accessible sparkline period", async () => {
			await page.goto(overview)
			await expect(metric(page, "Total spending")).toContainText("$286.63")
			if (!isMobile)
				await expect(
					page.getByRole("img", { name: /^Total spending, .*last/ }),
				).toBeVisible()
			await page.getByRole("button", { name: "Previous month", exact: true }).click()
			await expect(
				page.getByRole("heading", { name: "September 2026", exact: true }),
			).toBeVisible()
			await expect(metric(page, "Total spending")).toContainText("$1,400.00")
			await expect(metric(page, "Total shortfall")).toContainText("$1,400.00")
			await expect(metric(page, "Total surplus rate")).toContainText("—")
			await page.getByRole("button", { name: "Next month", exact: true }).click()
			await expect(metric(page, "Total spending")).toContainText("$286.63")
		})
	})

	test("Monthly Budget cards: hover does not select or change the donut, and a click does", {
		tag: ["@light"],
	}, async ({ page, isMobile }) => {
		test.setTimeout(120_000)
		await seedWorkspace(page)
		const budgets = getScenario("populated").tables.monthly_budgets.filter(
			budget => !budget.archived,
		)
		const toRgb = (hex: string) => {
			const parsed = hex.replace("#", "")
			const full =
				parsed.length === 3
					? parsed
							.split("")
							.map(part => part + part)
							.join("")
					: parsed
			const value = Number.parseInt(full, 16)
			return `rgb(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255})`
		}
		await test.step("Monthly Budget card: hover leaves selection and donut centre unchanged", async () => {
			await page.goto(overview)
			const cards = card(page, "Monthly budgets")
			for (const budget of budgets) {
				const scope = cards.getByRole("button", { name: budget.name, exact: true })
				await expect(scope).toBeVisible()
				const dot = scope.locator("span.size-2")
				await expect(dot).toBeVisible()
				const box = await dot.boundingBox()
				if (!box) throw new Error(`Expected a colour dot for ${budget.name}`)
				expect(box.width, `${budget.name} dot width`).toBeGreaterThan(0)
				expect(box.height, `${budget.name} dot height`).toBeGreaterThan(0)
				expect(
					Math.abs(box.width - box.height),
					`${budget.name} dot stays square`,
				).toBeLessThanOrEqual(1)
				await expect(dot).toHaveCSS("background-color", toRgb(budget.color))
			}
			const daily = cards.getByRole("button", { name: "Daily", exact: true })
			const centre = cards.locator('[aria-live="polite"]')
			const settled = await centre.textContent()
			expect(settled).toContain("Monthly plan")
			await expect(daily).toHaveAttribute("aria-pressed", "false")
			await expect(page).not.toHaveURL(/scope=/)
			if (!isMobile) {
				await daily.hover()
				await expect(daily).toHaveAttribute("aria-pressed", "false")
				await expect(page).not.toHaveURL(/scope=/)
				await expect(centre).toHaveText(settled ?? "")
			}
		})
		await test.step("Monthly Budget card: click selects, clears and edit leaves selection alone", async () => {
			await page.goto(overview)
			const budgets = card(page, "Monthly budgets")
			await expect(budgets.getByRole("button", { name: "Daily", exact: true })).toBeVisible()
			await expect(budgets).toContainText("$192.03")
			const daily = budgets.getByRole("button", { name: "Daily", exact: true })
			await daily.click()
			await expect(daily).toHaveAttribute("aria-pressed", "true")
			await expect(page).toHaveURL(new RegExp(`scope=${IDS.monthlyBudgets.daily}`))
			await expect(budgets.locator('[aria-live="polite"]')).toContainText("Daily")
			await daily.click()
			await expect(daily).toHaveAttribute("aria-pressed", "false")
			await expect(page).not.toHaveURL(/scope=/)
			await budgets.getByRole("button", { name: "Edit Daily", exact: true }).click()
			await expect(page.getByRole("dialog", { name: "Edit Daily" })).toBeVisible()
			// The open dialog inerts the page behind it, so the card's
			// selection is asserted once the dialog closes.
			await page.keyboard.press("Escape")
			await expect(page.getByRole("dialog")).toHaveCount(0)
			await expect(daily).toHaveAttribute("aria-pressed", "false")
			await expect(page).not.toHaveURL(/scope=/)
		})
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
				await calendar.getByRole("button", { name: "View Records", exact: true }).click()
				const date = `${year}-${month === "February" ? "02" : month === "April" ? "04" : "09"}-${days}`
				await expect(page).toHaveURL(new RegExp(`start_date=${date}`))
				await expect(page.getByText("No matching Records", { exact: true })).toBeVisible()
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
			"Spending by weekday",
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
					for (let index = 0; index < 12; index++) {
						await surface.press("ArrowRight")
						await page.evaluate(() => new Promise(requestAnimationFrame))
					}
					// Category amounts live in the breakdown list under the bars.
					await expect(chart).toContainText("selected month")
					await expect(chart).toContainText("$100.00")
					await expect(chart).toContainText("$117.53")
				} else if (title === "Spending by weekday") {
					await expect(tooltip).toContainText("Average per Monday")
					await expect(tooltip).toContainText("$92.10")
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
		await expect(metric(page, "Total income")).toContainText("$0.00")
		await expect(metric(page, "Total spending")).toContainText("$0.00")
		await expect(metric(page, "Total balance")).toContainText("$0.00")
		await expect(metric(page, "Total surplus rate")).toContainText("—")
		await expect(metric(page, "Total surplus rate")).toContainText("No positive net income")
		await expect(card(page, "Category trend")).toContainText(
			"No spending in the available months.",
		)
		await expect(card(page, "Biggest changes")).toContainText(
			"Not enough history to compare categories yet.",
		)
		await expect(card(page, "Spending by weekday")).toContainText(
			"No comparison history available.",
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
		await expect(metric(page, "Total surplus")).toContainText("$5,296.87")
		const mix = card(page, "Categories this month")
		await expect(mix.getByRole("link", { name: /Shopping/ })).toContainText(
			"$400.00 refunded · -$300.00 net",
		)
		await expect(mix.getByRole("link", { name: new RegExp("^Groceries") })).toContainText(
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
		await mix.getByRole("link", { name: /^Groceries/ }).click()
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
