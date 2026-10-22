import type { Locator } from "@playwright/test"
import { expect, seedWorkspace, test } from "./support/fixtures"

test.use({ baseURL: "http://127.0.0.1:5174" })

test.beforeEach(async ({ page }, testInfo) => {
	if (
		/^\[UI-GAP-(?:WORKFLOW|RECORD-CELLS|SPARKLINE)\]|^app gap journeys share one seed/.test(
			testInfo.title,
		)
	)
		return
	await page.goto("/?section=primitives", { waitUntil: "commit" })
	await expect(page.getByTestId("harness-primitives")).toBeVisible()
})

async function bounds(locator: Locator) {
	const box = await locator.boundingBox()
	if (!box) throw new Error("Expected visible component geometry")
	return box
}

async function contained(parent: Locator, children: Locator) {
	const outer = await bounds(parent)
	expect(outer).not.toBeNull()
	for (const child of await children.all()) {
		await expect(child).toBeVisible()
		const inner = await bounds(child)
		expect(inner).not.toBeNull()
		expect(inner.x).toBeGreaterThanOrEqual(outer.x - 1)
		expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width + 1)
	}
}

test("harness gap primitives share one page", async ({ page, isMobile }) => {
	await test.step("[UI-GAP-ITEM] item composition keeps media, description, footer and actions within each item", async () => {
		await page.goto("/?section=primitives", { waitUntil: "commit" })
		await expect(page.getByTestId("harness-primitives")).toBeVisible()
		const section = page.getByTestId("primitive-item")
		const list = section.getByRole("list")
		const items = list.locator('[data-slot="item"]')
		await expect(items).toHaveCount(2)
		const first = items.first()
		await expect(first.locator('[data-slot="item-header"]')).toHaveText("Dinner record")
		await expect(first.locator('[data-slot="item-description"]')).toHaveText(
			"Dining · Spending · 14 Sep 2026",
		)
		await expect(first.locator('[data-slot="item-footer"]')).toHaveText("$12.50")
		await expect(first.locator('[data-slot="item-media"]')).toHaveText("◌")
		await contained(
			first,
			first.locator(
				'[data-slot="item-content"], [data-slot="item-media"], [data-slot="item-actions"]',
			),
		)
		const title = await bounds(first.locator('[data-slot="item-title"]'))
		const footer = await bounds(first.locator('[data-slot="item-footer"]'))
		expect(footer.y).toBeGreaterThan(title.y)
		const separator = list.locator('[data-slot="item-separator"]')
		await expect(separator).toHaveAttribute("data-orientation", "horizontal")
		const line = await bounds(separator)
		const second = await bounds(items.last())
		expect(line.y).toBeLessThan(second.y)
		await expect(items.last()).toContainText("Second item")
		// The harness Open button has no callback; this verifies its wrapper layout, not a fabricated action.
	})
	await test.step("[UI-GAP-TABLE] table caption, column headers and footer preserve numeric row meaning", async () => {
		await page.goto("/?section=primitives", { waitUntil: "commit" })
		await expect(page.getByTestId("harness-primitives")).toBeVisible()
		const table = page.getByTestId("primitive-table").getByRole("table")
		await expect(table.locator("caption")).toHaveText("Demo spending by payee.")
		await expect(table.getByRole("columnheader")).toHaveText(["Payee", "Amount"])
		await expect(table.locator("tbody tr")).toHaveCount(2)
		await expect(table.locator("tbody tr").first().getByRole("cell")).toHaveText([
			"Makan place",
			"$12.50",
		])
		await expect(table.locator("tbody tr").last().getByRole("cell")).toHaveText([
			"Groceries",
			"$48.20",
		])
		const amounts = await table.locator("tbody tr td:last-child").allTextContents()
		const sum = amounts.reduce(
			(total, amount) => total + Math.round(Number(amount.replace(/[^\d.]/g, "")) * 100),
			0,
		)
		await expect(table.locator("tfoot").getByRole("cell")).toHaveText([
			"Total",
			`$${(sum / 100).toFixed(2)}`,
		])
	})
	await test.step("[UI-GAP-CARD-EMPTY] card and empty wrappers preserve content order and contained controls", async () => {
		await page.goto("/?section=primitives", { waitUntil: "commit" })
		await expect(page.getByTestId("harness-primitives")).toBeVisible()
		const card = page.getByTestId("primitive-card").locator('[data-slot="card"]')
		await expect(card.locator('[data-slot="card-title"]')).toHaveText("Spending summary")
		await expect(card.locator('[data-slot="card-description"]')).toHaveText(
			"September totals across budgets.",
		)
		await expect(card.locator('[data-slot="card-content"]')).toContainText(
			"Card body with enough copy to wrap on narrow screens.",
		)
		await contained(
			card,
			card.locator(
				'[data-slot="card-header"], [data-slot="card-content"], [data-slot="card-footer"], [data-slot="card-action"]',
			),
		)
		const header = await bounds(card.locator('[data-slot="card-header"]'))
		const content = await bounds(card.locator('[data-slot="card-content"]'))
		const footer = await bounds(card.locator('[data-slot="card-footer"]'))
		expect(content.y).toBeGreaterThan(header.y)
		expect(footer.y).toBeGreaterThan(content.y)
		const empty = page.getByTestId("primitive-empty").locator('[data-slot="empty"]')
		await expect(empty.locator('[data-slot="empty-icon"]')).toHaveText("◌")
		await expect(empty.locator('[data-slot="empty-title"]')).toHaveText("No records yet")
		await expect(empty.locator('[data-slot="empty-description"]')).toHaveText(
			"Add the first record to populate this view.",
		)
		await contained(
			empty,
			empty.locator('[data-slot="empty-header"], [data-slot="empty-content"]'),
		)
		await expect(
			empty
				.locator('[data-slot="empty-content"]')
				.getByRole("button", { name: "Add record" }),
		).toBeEnabled()
	})
	await test.step("[UI-GAP-FIELD] field labels focus inputs and legends group horizontal checkbox copy and errors", async () => {
		await page.goto("/?section=primitives", { waitUntil: "commit" })
		await expect(page.getByTestId("harness-primitives")).toBeVisible()
		const section = page.getByTestId("primitive-field")
		await section.getByText("Field label", { exact: true }).click()
		await expect(section.getByLabel("Field label", { exact: true })).toBeFocused()
		await section.getByLabel("Field label", { exact: true }).fill("café 日本語")
		await expect(section.getByLabel("Field label", { exact: true })).toHaveValue("café 日本語")
		await expect(section.getByRole("alert")).toHaveText("Demo error text")
		await expect(section.locator("fieldset legend")).toHaveText("Fieldset legend")
		await expect(section.locator('[data-slot="field-separator"]')).toHaveText("or")
		const fieldset = section.locator("fieldset")
		await expect(fieldset.locator('[data-slot="field-content"]')).toContainText("Field title")
		await expect(fieldset.locator('[data-slot="field-content"]')).toContainText(
			"Horizontal field copy.",
		)
		const checkbox = fieldset.getByRole("checkbox", { name: "Field checkbox" })
		await checkbox.focus()
		await checkbox.press("Space")
		await expect(checkbox).toBeChecked()
		await contained(
			section,
			section.locator('[data-slot="field-group"], [data-slot="field-content"]'),
		)
	})
	await test.step("[UI-GAP-CHART] composed chart legend and keyboard tooltip preserve series values and configured colours", async () => {
		await page.goto("/?section=primitives", { waitUntil: "commit" })
		await expect(page.getByTestId("harness-primitives")).toBeVisible()
		const section = page.getByTestId("primitive-chart")
		const chart = section.locator('[data-slot="chart"]')
		await expect(section.getByText("Spending", { exact: true })).toBeVisible()
		await expect(section.getByText("Income", { exact: true })).toBeVisible()
		const style = await chart.evaluate(element => ({
			spend: getComputedStyle(element).getPropertyValue("--color-spend").trim(),
			income: getComputedStyle(element).getPropertyValue("--color-income").trim(),
		}))
		expect(style.spend).not.toBe("")
		expect(style.income).not.toBe("")
		expect(style.spend).not.toBe(style.income)
		const surface = chart.getByRole("application")
		await surface.scrollIntoViewIfNeeded()
		await surface.focus()
		const tooltip = chart.locator(".recharts-tooltip-wrapper")
		await expect(tooltip).toContainText("Spending")
		await expect(tooltip).toContainText("Income")
		await expect(tooltip).toContainText("Aug")
		await expect(tooltip).toContainText("120")
		await expect(tooltip).toContainText("200")
		await surface.press("ArrowRight")
		await expect(tooltip).toContainText("Sep")
		await expect(tooltip).toContainText("180")
		await expect(tooltip).toContainText("160")
	})
	await test.step("[UI-GAP-SKELETON] standalone and menu skeletons reserve visible bounded geometry", async () => {
		await page.goto("/?section=primitives", { waitUntil: "commit" })
		await expect(page.getByTestId("harness-primitives")).toBeVisible()
		const section = page.getByTestId("primitive-sidebar")
		const standalone = section.getByTestId("standalone-skeleton")
		await expect(standalone).toBeVisible()
		const appearance = await standalone.evaluate(element => {
			const box = element.getBoundingClientRect()
			const style = getComputedStyle(element)
			return {
				width: box.width,
				height: box.height,
				background: style.backgroundColor,
				radius: parseFloat(style.borderRadius),
			}
		})
		expect(appearance.width).toBe(128)
		expect(appearance.height).toBe(16)
		expect(appearance.background).not.toBe("rgba(0, 0, 0, 0)")
		expect(appearance.radius).toBeGreaterThan(0)
		if (isMobile) {
			await section.getByRole("button", { name: "Toggle Sidebar", exact: true }).click()
			await expect(page.getByRole("dialog", { name: "Sidebar", exact: true })).toBeVisible()
		}
		const menu = page.locator('[data-slot="sidebar-menu-skeleton"]')
		await expect(menu).toBeVisible()
		await expect(menu.locator('[data-slot="skeleton"]')).toHaveCount(2)
		// The mobile sheet is still sliding in; re-measure until its layout settles.
		await expect(async () => {
			await contained(menu, menu.locator('[data-slot="skeleton"]'))
		}).toPass()
	})
})

test("harness gap modals share one page", async ({ page }) => {
	for (const modal of [
		{
			name: "dialog",
			trigger: "Open dialog",
			title: "Harness dialog",
			description: "Dialog description for backdrop checks.",
			close: "Close dialog",
			role: "dialog",
		},
		{
			name: "sheet",
			trigger: "Open sheet",
			title: "Harness sheet",
			description: "Sheet description for backdrop checks.",
			close: "Close sheet",
			role: "dialog",
		},
		{
			name: "alert",
			trigger: "Delete workspace",
			title: "Delete workspace?",
			description: "This removes local demo data only.",
			close: "Cancel",
			role: "alertdialog",
		},
	] as const) {
		await test.step(`[UI-GAP-MODAL-${modal.name}] modal header description and footer remain readable and close restores trigger`, async () => {
			const trigger = page.getByRole("button", { name: modal.trigger, exact: true })
			await trigger.click()
			const popup = page.getByRole(modal.role, { name: modal.title, exact: true })
			await expect(popup.getByText(modal.description, { exact: true })).toBeVisible()
			// Sheet slides in from the side; measure containment only after it settles,
			// otherwise outer/inner boxes captured mid-slide disagree by the travel distance.
			await page.evaluate(async () => {
				await Promise.all(
					document
						.getAnimations()
						.filter(
							animation =>
								(animation.playState === "running" || animation.pending) &&
								Number.isFinite(animation.effect?.getComputedTiming().endTime),
						)
						.map(animation => animation.finished.catch(() => undefined)),
				)
			})
			const descriptionId = await popup.getAttribute("aria-describedby")
			expect(descriptionId).toBeTruthy()
			await expect(page.locator(`[id="${descriptionId}"]`)).toHaveText(modal.description)
			await contained(popup, popup.locator('[data-slot$="-header"], [data-slot$="-footer"]'))
			await popup.getByRole("button", { name: modal.close, exact: true }).click()
			await expect(popup).not.toBeVisible()
			await expect(trigger).toBeFocused()
		})
	}
})

test.describe("real workflow navigation", () => {
	test.use({ baseURL: "http://localhost:5173" })
	test("app gap journeys share one seed", async ({ page }) => {
		await seedWorkspace(page)
		await test.step("[UI-GAP-WORKFLOW] workflow tabs navigate by keyboard and Allocate retains default date filter", async () => {
			await page.goto("/allocator")
			const tabs = page.getByRole("navigation", { name: "Workflow views" })
			await tabs.getByRole("link", { name: "Replace Pending", exact: true }).focus()
			await page.keyboard.press("Enter")
			await expect(page).toHaveURL(/\/allocator\/pending$/)
			await expect(
				page.getByRole("heading", { name: "Pending Statements", exact: true }),
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
		await test.step("[UI-GAP-RECORD-CELLS] rendered Record rows preserve zero, negative amounts and pending reasons", async () => {
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
		await test.step("[UI-GAP-SPARKLINE] sparkline keeps finite data marks and its endpoint follows changed month values", async () => {
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
})
