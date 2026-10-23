import type { Page } from "@playwright/test"
import { IDS } from "./support/data"
import { setDateOnly } from "./support/date-only"
import { expect, seedWorkspace, test } from "./support/fixtures"

const overview = "/?month=October&year=2026"

function card(page: Page, title: string) {
	return page
		.locator('[data-slot="card"]')
		.filter({ has: page.locator('[data-slot="card-title"]').filter({ hasText: title }) })
}

function metric(page: Page, label: string) {
	// "Total surplus" is a prefix of "Total surplus rate"; exclude the rate tile.
	if (label === "Total surplus")
		return page.locator("div.min-h-24.bg-card", { hasText: /Total surplus(?! rate)/ })
	return page.locator("div.min-h-24.bg-card", { hasText: label })
}

test.beforeEach(async ({ page }) => {
	await setDateOnly(page, new Date("2026-10-15T12:00:00+08:00"))
})

// Six populated overview journeys share one seed. Every step navigates back to
// the overview first, so scope params or record-list drills from an earlier
// step never leak into the next one.
test("charts populated overview journeys share one seed", { tag: ["@motion"] }, async ({
	page,
	isMobile,
}) => {
	test.setTimeout(120_000)
	await seedWorkspace(page)
	await test.step("charts.summary income, refunds and exclusions reconcile across metrics and category mix", async () => {
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
	await test.step("charts.calendar daily amount, zero and refund days drill into exact Records", async () => {
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
		await expect(page).toHaveURL(/start_date=2026-10-05/)
		await expect(page).toHaveURL(/end_date=2026-10-05/)
		await expect(
			page.getByRole("link", { name: "Open FairPrice Run", exact: true }),
		).toBeVisible()
		await expect(
			page.getByRole("link", { name: "Open Monthly Salary", exact: true }),
		).toHaveCount(0)
	})
	await test.step("charts.budgets null amount and zero plan remain distinct when scope changes", async () => {
		await page.goto(overview)
		const budgets = card(page, "Monthly budgets")
		await expect(budgets.getByRole("button", { name: "Daily", exact: true })).toBeVisible()
		await expect(budgets).toContainText("$192.03")
		await budgets.getByRole("button", { name: "Daily", exact: true }).click()
		await expect(page).toHaveURL(new RegExp(`scope=${IDS.monthlyBudgets.daily}`))
		await expect(budgets.getByRole("button", { name: "Daily", exact: true })).toHaveAttribute(
			"aria-pressed",
			"true",
		)
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
	await test.step("charts.mix category drilldown carries treatment and category filters", async () => {
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
	await test.step("charts.movers category change title and drilldown reconcile with previous month", async () => {
		await page.goto(overview)
		const housing = card(page, "Biggest changes").getByRole("link", { name: /Housing/ })
		await expect(housing).toHaveAttribute("title", "Housing: $0.00 vs $1,400.00 average")
		await expect(housing).toContainText("−$1,400.00")
		await housing.click()
		await expect(page).toHaveURL(new RegExp(`category_ids=${IDS.categories.rent}`))
		await expect(page.getByText("No matching Records", { exact: true })).toBeVisible()
	})
	await test.step("charts.value-swap month change updates metrics and accessible sparkline period", async () => {
		await page.goto(overview)
		await expect(metric(page, "Total spending")).toContainText("$286.63")
		if (!isMobile)
			await expect(page.getByRole("img", { name: /^Total spending, .*last/ })).toBeVisible()
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

test("charts calendar month lengths share one empty seed", async ({ page }) => {
	await seedWorkspace(page, "empty")
	for (const [month, year, days] of [
		["February", 2024, 29],
		["February", 2025, 28],
		["April", 2026, 30],
		["September", 2026, 30],
	] as const) {
		await test.step(`charts.calendar ${month} ${year} has exactly ${days} valid dates`, async () => {
			await page.goto(`/?month=${month}&year=${year}`)
			const calendar = card(page, "Spending calendar")
			await expect(calendar.getByRole("button")).toHaveCount(days)
			await expect(
				calendar.getByRole("button", {
					name: new RegExp(`^${days} ${month}: \\$0\\.00 spent$`),
				}),
			).toBeVisible()
			await calendar.getByRole("button", { name: new RegExp(`^${days} ${month}:`) }).click()
			const date = `${year}-${month === "February" ? "02" : month === "April" ? "04" : "09"}-${days}`
			await expect(page).toHaveURL(new RegExp(`start_date=${date}`))
			await expect(page.getByText("No matching Records", { exact: true })).toBeVisible()
		})
	}
})

test("charts tooltip keyboard sweeps share one seed", async ({ page }) => {
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
		await test.step(`charts.tooltip ${title} keyboard navigation exposes actual numeric values`, async () => {
			await page.goto(
				title === "Spending over time" ? `/budgets/${IDS.budgets.manual}` : overview,
			)
			const chart = card(page, title)
			const surface = chart.getByRole("application").first()
			await surface.scrollIntoViewIfNeeded()
			await surface.focus()
			const tooltip = chart.locator(".recharts-tooltip-wrapper")
			if (title === "Category trend") {
				for (let index = 0; index < 12; index++) {
					await surface.press("ArrowRight")
					await page.evaluate(() => new Promise(requestAnimationFrame))
				}
				await expect(tooltip).toContainText("selected month")
				await expect(tooltip).toContainText("$100.00")
				await expect(tooltip).toContainText("$117.53")
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

test("charts.empty no history gives zero metrics and useful chart explanations", async ({
	page,
}) => {
	await seedWorkspace(page, "empty")
	await page.goto(overview)
	await expect(metric(page, "Total income")).toContainText("$0.00")
	await expect(metric(page, "Total spending")).toContainText("$0.00")
	await expect(metric(page, "Total balance")).toContainText("$0.00")
	await expect(metric(page, "Total surplus rate")).toContainText("—")
	await expect(metric(page, "Total surplus rate")).toContainText("No positive net income")
	await expect(card(page, "Category trend")).toContainText("No spending in the available months.")
	await expect(card(page, "Biggest changes")).toContainText(
		"Not enough history to compare categories yet.",
	)
	await expect(card(page, "Spending by weekday")).toContainText(
		"No comparison history available.",
	)
	await expect(card(page, "Spending calendar")).toContainText("0 spending days · $0.00")
})

test("charts.refund net refund, long category name and excluded treatment retain numeric meaning", async ({
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
					const transaction = database.transaction(["records", "categories"], "readwrite")
					transaction.oncomplete = () => resolve()
					transaction.onabort = () => reject(transaction.error)
					const record = transaction.objectStore("records").get("t1-r-refund")
					record.onsuccess = () =>
						transaction.objectStore("records").put({ ...record.result, amount: 400 })
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
	await expect(page.getByRole("link", { name: "Open FairPrice Run", exact: true })).toBeVisible()
})

test("charts.dense zero and null plan rows never display invalid percentages", async ({ page }) => {
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
