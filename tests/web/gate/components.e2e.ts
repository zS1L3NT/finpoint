import type { Locator, Page } from "@playwright/test"
import {
	expectDropdownPreservesScroll,
	expectPointerCursor,
	expectVisibleBackdrop,
	scrollWithInput,
} from "../support/assertions"
import { setDateOnly } from "../support/date-only"
import { expect, test } from "../support/fixtures"
import { HARNESS_URL } from "../support/urls"

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

async function gotoForms(page: Page) {
	await page.goto("/?section=forms")
	await expect(page.getByTestId("harness-forms")).toBeVisible()
}

async function gotoPrimitives(page: Page) {
	await page.goto("/?section=primitives")
	await expect(page.getByTestId("harness-primitives")).toBeVisible()
}

// Opened popups must fit the current viewport (desktop and 390px mobile run
// the same assertion); a clipped popup fails even when the closed page fits.
async function expectPopupInViewport(page: Page, popup: import("@playwright/test").Locator) {
	await expect(popup).toBeVisible()
	const box = await popup.boundingBox()
	const viewport = page.viewportSize()
	expect(box).not.toBeNull()
	if (box && viewport) {
		expect(box.x).toBeGreaterThanOrEqual(-1)
		expect(box.y).toBeGreaterThanOrEqual(-1)
		expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1)
		expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1)
	}
}

// Real scroll input while a popover is open: the page scroll surface must
// move. This mirrors the shared dropdown helper's scroll half via the shared
// input helper (touch gesture on coarse pointers, wheel otherwise); popovers
// expose no menu/listbox role, so the menu-wait half cannot apply to them.
async function expectWheelScrollsPageWhileOpen(page: Page) {
	const scroller = page.locator("html")
	const read = () =>
		scroller.evaluate(element => ({
			top: element.scrollTop,
			max: element.scrollHeight - element.clientHeight,
		}))
	const before = await read()
	expect(before.max, "Fixture needs a genuinely scrollable page").toBeGreaterThan(20)
	const point = await scroller.evaluate(element => {
		const popup = document.querySelector('[data-slot="popover-content"]')
		const rect = element.getBoundingClientRect()
		for (const x of [
			Math.min(rect.right, innerWidth) - 20,
			Math.max(rect.left, 0) + 20,
			innerWidth / 2,
		]) {
			for (const y of [innerHeight - 60, innerHeight / 2, 100]) {
				const hit = document.elementFromPoint(x, y)
				if (
					hit &&
					element.contains(hit) &&
					!(popup && (hit === popup || popup.contains(hit)))
				)
					return { x, y }
			}
		}
		return null
	})
	expect(point, "Scrollable surface outside the popover must remain reachable").not.toBeNull()
	if (!point) throw new Error("No reachable scroll surface outside the popover")
	await scrollWithInput(page, point, before.top < before.max / 2 ? 300 : -300)
	await expect
		.poll(async () => Math.abs((await read()).top - before.top), {
			message: "Scroll input must still move the page with the popover open",
		})
		.toBeGreaterThan(10)
}

// The mobile Sidebar renders in a Sheet that starts closed; open it and scope to the dialog.
const sidebarScope = async (page: Page, isMobile: boolean) => {
	const section = page.getByTestId("primitive-sidebar")
	if (!isMobile) return section
	await section.getByRole("button", { name: "Toggle Sidebar", exact: true }).click()
	const dialog = page.getByRole("dialog", { name: "Sidebar", exact: true })
	await expect(dialog).toBeVisible()
	return dialog
}

test.describe("harness primitives section", () => {
	test.use({ baseURL: HARNESS_URL })
	test.beforeEach(async ({ page }) => {
		await page.goto("/?section=primitives", { waitUntil: "commit" })
		await expect(page.getByTestId("harness-primitives")).toBeVisible()
	})

	test("gap primitives: item, table, card and empty, field, chart and skeleton keep their content and geometry", async ({
		page,
		isMobile,
	}) => {
		await test.step("item: media, description, footer and actions stay within each item", async () => {
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
		await test.step("table: caption, column headers and footer keep numeric row meaning", async () => {
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
		await test.step("card and empty: content order and contained controls hold", async () => {
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
		await test.step("field: labels focus inputs and legends group horizontal checkbox copy and errors", async () => {
			await page.goto("/?section=primitives", { waitUntil: "commit" })
			await expect(page.getByTestId("harness-primitives")).toBeVisible()
			const section = page.getByTestId("primitive-field")
			await section.getByText("Field label", { exact: true }).click()
			await expect(section.getByLabel("Field label", { exact: true })).toBeFocused()
			await section.getByLabel("Field label", { exact: true }).fill("café 日本語")
			await expect(section.getByLabel("Field label", { exact: true })).toHaveValue(
				"café 日本語",
			)
			await expect(section.getByRole("alert")).toHaveText("Demo error text")
			await expect(section.locator("fieldset legend")).toHaveText("Fieldset legend")
			await expect(section.locator('[data-slot="field-separator"]')).toHaveText("or")
			const fieldset = section.locator("fieldset")
			await expect(fieldset.locator('[data-slot="field-content"]')).toContainText(
				"Field title",
			)
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
		await test.step("chart: legend and keyboard tooltip keep series values and configured colours", async () => {
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
		await test.step("skeleton: standalone and menu skeletons reserve visible bounded geometry", async () => {
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
				await expect(
					page.getByRole("dialog", { name: "Sidebar", exact: true }),
				).toBeVisible()
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

	test("modal primitives: header, description and footer stay readable and close restores the trigger", async ({
		page,
	}) => {
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
			await test.step(`modal primitives: ${modal.name} header, description and footer stay readable and close restores the trigger`, async () => {
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
				await contained(
					popup,
					popup.locator('[data-slot$="-header"], [data-slot$="-footer"]'),
				)
				await popup.getByRole("button", { name: modal.close, exact: true }).click()
				await expect(popup).not.toBeVisible()
				await expect(trigger).toBeFocused()
			})
		}
	})
})

test.describe("harness widgets section", () => {
	test.use({ baseURL: HARNESS_URL })
	// Mirror the domain suites' fixedClock: pin wall time so calendar/today
	// rendering is deterministic. Same instant as tests/web/support/fixtures.ts.
	test.beforeEach(async ({ page }) => {
		await setDateOnly(page, new Date("2026-10-15T12:00:00+08:00"))
	})

	test("form fields: amount, text, textarea, select, combobox, date, date range, datetime and Treatment inputs commit values and validation renders alerts", async ({
		page,
	}) => {
		test.setTimeout(150000)
		await test.step("amount input: commits a typed value and rejects invalid text and three decimal places", async () => {
			await gotoForms(page)
			const input = page.locator("#harness-amount")
			await input.fill("99.99")
			await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 99.99")
			await input.fill("abc")
			await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 99.99")
			await input.fill("1.234")
			await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 99.99")
		})

		await test.step("amount input: ArrowUp and ArrowDown step by 0.01", async () => {
			await gotoForms(page)
			await page.locator("#harness-amount").click()
			await page.keyboard.press("ArrowUp")
			await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 12.51")
			await page.keyboard.press("ArrowDown")
			await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 12.5")
		})

		await test.step("amount input: sign toggle flips the sign, and a zero minimum hides the toggle and rejects minus", async () => {
			await gotoForms(page)
			const toggle = page.getByRole("button", { name: "Make amount negative" })
			await toggle.click()
			await expect(page.getByTestId("amount-value")).toHaveText("Amount value: -12.5")
			await page.getByRole("button", { name: "Make amount positive" }).click()
			await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 12.5")

			const toggles = page
				.getByTestId("harness-forms")
				.getByRole("button", { name: /Make amount (positive|negative)/ })
			await expect(toggles).toHaveCount(1)
			await page.locator("#harness-amount-non-negative").fill("-5")
			await expect(page.getByTestId("amount-capped-value")).toHaveText("Capped value: 5")
		})

		await test.step("text field: types a value, filters suggestions and selects one", async () => {
			await gotoForms(page)
			await page.getByLabel("Title", { exact: true }).fill("Dinner")
			await expect(page.getByTestId("title-value")).toHaveText("Title value: Dinner")

			await page.locator("#harness-title-suggest").click()
			await page.locator("#harness-title-suggest").type("Des")
			const option = page.getByRole("option", { name: "Dessert" })
			await expect(option).toBeVisible()
			await option.click()
			await expect(page.getByTestId("suggested-value")).toHaveText("Suggested value: Dessert")
		})

		await test.step("textarea: records long values", async () => {
			await gotoForms(page)
			const long = `note ${"x".repeat(200)}`
			await page.getByLabel("Notes").fill(long)
			await expect(page.getByTestId("notes-value")).toHaveText(`Notes length: ${long.length}`)
			await expect(page.getByLabel("Notes")).toHaveValue(long)
		})

		await test.step("select field: picks an option and leaves a disabled option unselected", async () => {
			await gotoForms(page)
			await page.locator("#harness-direction").click()
			await page.getByRole("option", { name: "Income" }).click()
			await expect(page.getByTestId("direction-value")).toHaveText("Direction value: income")

			await page.locator("#harness-direction").click()
			const archived = page.getByRole("option", { name: "Archived" })
			await expect(archived).toHaveAttribute("data-disabled", "")
			// A keyboard attempt must not select the disabled option.
			await page.keyboard.press("End")
			await page.keyboard.press("Enter")
			await expect(page.getByTestId("direction-value")).toHaveText("Direction value: income")
			await page.keyboard.press("Escape")
			await expect(page.getByTestId("direction-value")).toHaveText("Direction value: income")
		})

		await test.step("select field: opens and closes from the keyboard", async () => {
			await gotoForms(page)
			await page.locator("#harness-direction").focus()
			await page.keyboard.press("Enter")
			await expect(page.getByRole("listbox")).toBeVisible()
			await page.keyboard.press("Escape")
			await expect(page.getByRole("listbox")).toBeHidden()
		})

		await test.step("combobox field: filters, picks, clears and shows empty text", async () => {
			await gotoForms(page)
			await page.locator("#harness-payee").click()
			await page.locator("#harness-payee").type("Gro")
			const option = page.getByRole("option", { name: "Groceries" })
			await expect(option).toBeVisible()
			await option.click()
			await expect(page.getByTestId("payee-value")).toHaveText("Payee value: Groceries")

			await page.locator('[data-slot="combobox-clear"]').click()
			await expect(page.getByTestId("payee-value")).toHaveText("Payee value: none")
			// Clearing resets Base UI's input text after the value change; on a fast host,
			// typing before that reset lands left the list filtered by the old label.
			await expect(page.locator("#harness-payee")).toHaveValue("")

			await page.locator("#harness-payee").click()
			// The reopen click opens the combobox popup (Base UI openOnInputClick), so wait
			// for its entrance animation to finish before typing.
			const payeePopup = page
				.locator('[data-slot="combobox-content"]')
				.filter({ visible: true })
			await expect(payeePopup).toHaveCount(1)
			await payeePopup.evaluate(el =>
				Promise.all(
					el
						.getAnimations({ subtree: true })
						.filter(
							a =>
								a.effect?.getComputedTiming().iterations !==
								Number.POSITIVE_INFINITY,
						)
						.map(a => a.finished.catch(() => undefined)),
				),
			)
			await page.locator("#harness-payee").type("zzz")
			await expect(page.getByText("No payees found.")).toBeVisible()
		})

		await test.step("date field: picks a day from the calendar and clears", async () => {
			await gotoForms(page)
			await page.locator("#harness-date").click()
			const popover = page.locator('[data-slot="popover-content"]')
			await expect(popover).toBeVisible()
			await popover.getByRole("button", { name: /September 20th, 2026/ }).click()
			await expect(page.getByTestId("date-value")).toHaveText("Date value: 2026-09-20")
			await page
				.locator('[data-slot="field"]')
				.filter({ has: page.locator("#harness-date") })
				.getByRole("button", { name: "Clear date", exact: true })
				.click()
			await expect(page.getByTestId("date-value")).toHaveText("Date value: empty")
		})

		await test.step("date range: applies a day and clears back to null", async () => {
			await gotoForms(page)
			await expect(page.locator("#harness-range")).toContainText("1–30 Sep 2026")
			await page.locator("#harness-range").click()
			const popover = page.locator('[data-slot="popover-content"]')
			await popover.getByRole("button", { name: /September 10th, 2026/ }).click()
			await popover.getByRole("button", { name: "Apply" }).click()
			await expect(page.getByTestId("range-value")).toHaveText(
				"Range value: 2026-09-10 to 2026-09-10",
			)

			await page.locator("#harness-range").click()
			await page
				.locator('[data-slot="popover-content"]')
				.getByRole("button", { name: "Clear" })
				.click()
			await expect(page.getByTestId("range-value")).toHaveText("Range value: null to null")
		})

		await test.step("datetime field: edits the time and picks a new date", async () => {
			await gotoForms(page)
			await page.locator("#harness-datetime-time").fill("10:45")
			await expect(page.getByTestId("datetime-value")).toHaveText(
				"Datetime value: 2026-09-14T10:45",
			)
			await page.locator("#harness-datetime").click()
			await page
				.locator('[data-slot="popover-content"]')
				.getByRole("button", { name: /September 16th, 2026/ })
				.click()
			await expect(page.getByTestId("datetime-value")).toHaveText(
				"Datetime value: 2026-09-16T10:45",
			)
		})

		await test.step("Record analytics: Treatment gates the Monthly Budget control", async () => {
			await gotoForms(page)
			await page.locator("#analytics_treatment").click()
			await page.getByRole("option", { name: "Income", exact: true }).click()
			await expect(page.getByTestId("analytics-value")).toContainText("Treatment: income")
			await expect(page.locator("#monthly_budget_id")).toBeDisabled()

			await page.locator("#analytics_treatment").click()
			await page.getByRole("option", { name: "Spending", exact: true }).click()
			await expect(page.getByTestId("analytics-value")).toContainText("Treatment: spending")
			await expect(page.locator("#monthly_budget_id")).toBeEnabled()
		})

		await test.step("field validation: errors render as alerts", async () => {
			await gotoForms(page)
			await expect(page.getByTestId("harness-forms").getByRole("alert")).toContainText(
				"Enter a title",
			)
		})
	})

	test("buttons and selection: enabled and disabled buttons, button group, checkbox and toggle group act on state", async ({
		page,
	}) => {
		await test.step("button: enabled button counts clicks, works from the keyboard and shows a pointer cursor", async () => {
			await gotoPrimitives(page)
			const counter = page.getByRole("button", { name: "Count clicks" })
			await counter.click()
			await counter.click()
			await expect(page.getByTestId("button-clicks")).toHaveText("Button clicks: 2")

			await counter.focus()
			await page.keyboard.press("Enter")
			await expect(page.getByTestId("button-clicks")).toHaveText("Button clicks: 3")

			const cursor = await counter.evaluate(element => getComputedStyle(element).cursor)
			expect(cursor).toBe("pointer")
		})

		await test.step("button: disabled button stays disabled and ignores programmatic clicks", async () => {
			await gotoPrimitives(page)
			const disabled = page.getByRole("button", { name: "Disabled action" })
			await expect(disabled).toBeDisabled()
			await disabled.evaluate(element => (element as HTMLButtonElement).click())
			await expect(page.getByTestId("button-clicks")).toHaveText("Button clicks: 0")
		})

		await test.step("button group: exposes a group role with a separator and label", async () => {
			await gotoPrimitives(page)
			const group = page.getByTestId("primitive-button-group")
			await expect(group.getByRole("group")).toBeVisible()
			await expect(group.getByText("Group label")).toBeVisible()
			const left = group.getByRole("button", { name: "Left" })
			await left.evaluate(element => element.scrollIntoView({ block: "center" }))
			await left.click()
			await expect(page.getByTestId("button-clicks")).toHaveText("Button clicks: 1")
		})

		await test.step("checkbox: toggles by label and Space, and stays off when disabled", async () => {
			await gotoPrimitives(page)
			await page.getByText("Accept terms").click()
			await expect(page.getByTestId("checkbox-value")).toHaveText("Checkbox: checked")
			await page.locator("#harness-check").focus()
			await page.keyboard.press("Space")
			await expect(page.getByTestId("checkbox-value")).toHaveText("Checkbox: unchecked")
			await expect(page.locator("#harness-check-disabled")).toBeDisabled()

			const cursor = await page
				.locator("#harness-check")
				.evaluate(element => getComputedStyle(element).cursor)
			expect(cursor).toBe("pointer")
		})

		await test.step("toggle group: selects a value and keeps the disabled item disabled", async () => {
			await gotoPrimitives(page)
			const week = page.getByRole("radio", { name: "Week view" })
			await week.evaluate(element => element.scrollIntoView({ block: "center" }))
			await week.click()
			await expect(page.getByTestId("toggle-value")).toHaveText("Toggle: week")
			await expect(page.getByRole("radio", { name: "Archived view" })).toBeDisabled()
		})
	})

	test("calendar and command: days and months select, command filters, highlights and opens a dialog", async ({
		page,
	}) => {
		await test.step("calendar: selects a day and navigates months", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-calendar")
			await section.getByRole("button", { name: /September 21st, 2026/ }).click()
			await expect(page.getByTestId("calendar-value")).toContainText("Sep 21 2026")
			await section.getByRole("button", { name: /next month/i }).click()
			await expect(section.getByText("October 2026")).toBeVisible()
		})

		await test.step("month picker: selects a month and disables out-of-range months when bounded", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-monthpicker")
			await section.getByRole("button", { name: "Oct", exact: true }).first().click()
			await expect(page.getByTestId("monthpicker-value")).toHaveText(
				"Selected month: Oct 2026",
			)

			const bounded = page.locator('[aria-label="Bounded month picker"]')
			await bounded.getByRole("button").nth(1).click()
			await expect(bounded).toContainText("2027")
			await expect(bounded.getByRole("button", { name: "Jan" })).toBeDisabled()
		})

		await test.step("command: filters, selects and reports an empty state", async () => {
			await gotoPrimitives(page)
			// cmdk renders its input with role=combobox (not textbox), so label
			// queries miss it; the accessible name is still exact.
			const search = page.getByRole("combobox", { name: "Search fruit" })
			await search.fill("Dur")
			await expect(page.getByRole("option", { name: "Apple" })).toBeHidden()
			await page.getByRole("option", { name: /Durian/ }).click()
			await expect(page.getByTestId("command-value")).toHaveText("Command choice: Durian")

			await search.fill("zzz")
			await expect(page.getByText("No fruit found.")).toBeVisible()
		})

		await test.step("command: highlights an item from the keyboard", async () => {
			await gotoPrimitives(page)
			await page.getByRole("combobox", { name: "Search fruit" }).focus()
			const selected = page.locator('[data-slot="command-item"][data-selected="true"]')
			await expect(selected).toHaveCount(1)
			const first = (await selected.textContent())?.trim()
			await page.keyboard.press("ArrowDown")
			await expect(selected).toHaveCount(1)
			await expect(selected).not.toHaveText(first ?? "")
			await page.keyboard.press("ArrowUp")
			await expect(selected).toHaveText(first ?? "")
		})

		await test.step("command dialog: opens and closes from an item", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Open command dialog" }).click()
			await expect(page.getByRole("dialog")).toBeVisible()
			await expectPopupInViewport(page, page.getByRole("dialog"))
			await page.getByRole("option", { name: "Close dialog" }).click()
			await expect(page.getByRole("dialog")).toBeHidden()
		})
	})

	test("tooltip and selection primitives: tooltip, popover, select, combobox, collection and multi combobox work", async ({
		page,
	}) => {
		test.setTimeout(120000)
		await test.step("tooltip: appears on hover and on focus", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Hover target" }).hover()
			await expect(page.getByText("Harness tooltip body")).toBeVisible()
			await expectPopupInViewport(page, page.getByText("Harness tooltip body"))
			// Leave in several steps: Radix keeps a hoverable grace area until a later pointer move.
			await page.mouse.move(0, 0, { steps: 5 })
			await page.mouse.move(5, 5)
			// The hover tooltip must close first, or focus could reuse it.
			await expect(page.getByText("Harness tooltip body")).toBeHidden()
			await page.getByRole("button", { name: "Hover target" }).focus()
			await expect(page.getByText("Harness tooltip body")).toBeVisible()
		})

		await test.step("popover: opens, keeps page overflow intact and closes on Escape", async () => {
			await gotoPrimitives(page)
			const before = await page.evaluate(() => getComputedStyle(document.body).overflow)
			await page.getByRole("button", { name: "Open popover" }).click()
			await expect(page.getByText("Popover title")).toBeVisible()
			const during = await page.evaluate(() => getComputedStyle(document.body).overflow)
			expect(during).toBe(before)
			await expectPopupInViewport(page, page.locator('[data-slot="popover-content"]'))
			await expectWheelScrollsPageWhileOpen(page)
			await page.keyboard.press("Escape")
			await expect(page.getByText("Popover title")).toBeHidden()
		})

		await test.step("select primitive: picks a value and marks disabled items", async () => {
			await gotoPrimitives(page)
			await page.locator("#harness-select").click()
			// Scope to the open popup: the always-mounted command list also exposes
			// role=option items with overlapping names.
			const content = page.locator('[data-slot="select-content"]')
			await content.getByRole("option", { name: "Banana", exact: true }).click()
			await expect(page.getByTestId("select-value")).toHaveText("Select value: banana")

			await page.locator("#harness-select").click()
			await expect(
				content.getByRole("option", { name: "Durian (unavailable)" }),
			).toHaveAttribute("data-disabled", "")
			// A keyboard attempt must not select the disabled option.
			await page.keyboard.press("End")
			await page.keyboard.press("Enter")
			await expect(page.getByTestId("select-value")).toHaveText("Select value: banana")
			await page.keyboard.press("Escape")
			await expect(page.getByTestId("select-value")).toHaveText("Select value: banana")
		})

		await test.step("combobox primitive: filters, selects and clears", async () => {
			await gotoPrimitives(page)
			// "Fruit combobox" is a substring of the grouped/collection labels,
			// so scope to the exact accessible name.
			const input = page.getByLabel("Fruit combobox", { exact: true })
			await input.click()
			await input.type("Ban")
			await page.getByRole("option", { name: "Banana" }).click()
			await expect(page.getByTestId("combobox-value")).toHaveText("Combobox value: Banana")
		})

		await test.step("combobox collection: renders the filtered items", async () => {
			await gotoPrimitives(page)
			await page.getByLabel("Collection fruit combobox").click()
			await page.getByLabel("Collection fruit combobox").type("Cher")
			const results = page.locator('[aria-label="Collection fruit results"]')
			await expect(results.getByRole("option", { name: "Cherry" })).toBeVisible()
			await results.getByRole("option", { name: "Cherry" }).click()
			await expect(page.getByTestId("combobox-collection-value")).toHaveText(
				"Collection value: Cherry",
			)
		})

		await test.step("multi combobox: chips accumulate picks", async () => {
			await gotoPrimitives(page)
			await expect(page.getByTestId("combobox-multi-value")).toHaveText("Multi value: Apple")
			await page.getByLabel("Add fruit").click()
			await page.getByLabel("Add fruit").type("Ban")
			await page.getByRole("option", { name: "Banana" }).click()
			await expect(page.getByTestId("combobox-multi-value")).toHaveText(
				"Multi value: Apple, Banana",
			)
		})
	})

	test("dropdown menu: items, checkbox, radio, sub-menu and Escape dismissal work", async ({
		page,
	}) => {
		await test.step("dropdown menu: items, checkbox, radio and sub-menu all act on state", async () => {
			await gotoPrimitives(page)
			const openMenu = async () => {
				await page.getByRole("button", { name: "Open menu" }).click()
				await expect(page.getByRole("menu")).toBeVisible()
			}
			await openMenu()
			const menu = page.getByRole("menu")
			await expect(menu.getByText("Menu label")).toBeVisible()
			await expect(menu.locator('[data-slot="dropdown-menu-separator"]')).toHaveCount(2)
			await page.getByRole("menuitem", { name: "Edit item" }).click()
			// Selection closes the menu; wait for the close animation before
			// reopening so the trigger click is never swallowed mid-transition.
			await expect(page.getByRole("menu")).toBeHidden()
			await expect(page.getByTestId("dropdown-value")).toContainText("Menu: edit")

			await openMenu()
			await page.getByRole("menuitemcheckbox", { name: "Show archived" }).click()
			await expect(page.getByRole("menu")).toBeHidden()
			await expect(page.getByTestId("dropdown-value")).toContainText("flag off")

			await openMenu()
			await page.getByRole("menuitemradio", { name: "Align right" }).click()
			await expect(page.getByRole("menu")).toBeHidden()
			await expect(page.getByTestId("dropdown-value")).toContainText("align right")

			await openMenu()
			await page.getByRole("menuitem", { name: "More actions" }).hover()
			await expect(page.getByText("⌘E")).toBeVisible()
			// Scope to the main menu popup: the open sub-menu is a second role=menu.
			await expectPopupInViewport(page, page.locator('[data-slot="dropdown-menu-content"]'))
			await page.getByRole("menuitem", { name: /Export/ }).click()
			await expect(page.getByTestId("dropdown-value")).toContainText("Menu: export")
		})

		await test.step("dropdown menu: Escape closes it and leaves page scroll intact", async () => {
			await gotoPrimitives(page)
			const overflowBefore = await page.evaluate(
				() => getComputedStyle(document.body).overflow,
			)
			await page.getByRole("button", { name: "Open menu" }).click()
			await expect(page.getByRole("menu")).toBeVisible()
			await page.keyboard.press("Escape")
			await expect(page.getByRole("menu")).toBeHidden()

			const overflowAfter = await page.evaluate(
				() => getComputedStyle(document.body).overflow,
			)
			expect(overflowAfter).toBe(overflowBefore)
			const scrolled = await page.evaluate(() => {
				window.scrollTo(0, 120)
				return window.scrollY
			})
			expect(scrolled).toBeGreaterThan(0)
		})
	})

	test("modal layers: alert dialog, dialog and sheet open with backdrops and act on state", async ({
		page,
	}) => {
		await test.step("alert dialog: confirms and cancels with a visible backdrop", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Delete workspace" }).click()
			await expect(page.getByRole("alertdialog")).toBeVisible()
			await expectPopupInViewport(page, page.getByRole("alertdialog"))
			await expectVisibleBackdrop(page)

			await page.getByRole("button", { name: "Cancel" }).click()
			await expect(page.getByTestId("alert-decision")).toHaveText("Alert decision: cancelled")

			await page.getByRole("button", { name: "Delete workspace" }).click()
			await page.getByRole("button", { name: "Confirm delete" }).click()
			await expect(page.getByTestId("alert-decision")).toHaveText("Alert decision: confirmed")
		})

		await test.step("dialog: opens with a backdrop and closes on Escape with scroll restored", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Open dialog" }).click()
			await expect(page.getByRole("dialog", { name: "Harness dialog" })).toBeVisible()
			await expectPopupInViewport(page, page.getByRole("dialog", { name: "Harness dialog" }))
			await expect(page.getByTestId("dialog-value")).toHaveText("Dialog open: yes")
			await expectVisibleBackdrop(page)

			await page.keyboard.press("Escape")
			await expect(page.getByTestId("dialog-value")).toHaveText("Dialog open: no")
			const scrolled = await page.evaluate(() => {
				window.scrollTo(0, 120)
				return window.scrollY
			})
			expect(scrolled).toBeGreaterThan(0)
		})

		await test.step("sheet: opens with a backdrop and closes from its close button", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Open sheet" }).click()
			const sheet = page.getByRole("dialog", { name: "Harness sheet" })
			await expect(sheet).toBeVisible()
			// The sheet slides in from the viewport edge; measure once the entrance
			// settles so the transition itself is not judged as overflow.
			await expect
				.poll(async () => {
					const box = await sheet.boundingBox()
					const viewport = page.viewportSize()
					return box && viewport ? box.x + box.width - viewport.width : 999
				})
				.toBeLessThanOrEqual(1)
			await expectPopupInViewport(page, sheet)
			await expectVisibleBackdrop(page)
			const overlay = page.locator('[data-slot="sheet-overlay"]')
			await expect(overlay).toBeVisible()
			await page.getByRole("button", { name: "Close sheet" }).click()
			await expect(page.getByRole("dialog", { name: "Harness sheet" })).toBeHidden()
		})

		await test.step("alerts: render both variants with title, description and action", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-alert")
			await expect(section.getByRole("alert").first()).toBeVisible()
			await expect(section.getByText("Heads up")).toBeVisible()
			await expect(section.getByText("Something needs attention")).toBeVisible()
			await section.getByRole("button", { name: "Review" }).click()
		})
	})

	test("display primitives: badge, card, empty, progress, scroll area, separators, table, pagination, input group, item, label and field render their content", async ({
		page,
	}) => {
		test.setTimeout(120000)
		await test.step("badge, card and empty: render their content", async () => {
			await gotoPrimitives(page)
			await expect(page.getByTestId("primitive-badge").getByText("Over budget")).toBeVisible()
			await expect(page.getByTestId("primitive-badge").getByText("Pending")).toBeVisible()
			const card = page.getByTestId("primitive-card")
			await expect(card.getByText("Spending summary")).toBeVisible()
			await card.getByRole("button", { name: "View" }).click()
			const empty = page.getByTestId("primitive-empty")
			await expect(empty.getByText("No records yet")).toBeVisible()
			await expect(
				empty.getByText("Add the first record to populate this view."),
			).toBeVisible()
		})

		await test.step("progress: clamps its base bar and flags only values above 100", async () => {
			await gotoPrimitives(page)
			// Scope to the dynamic bar: the harness also renders a static over-limit bar.
			const bar = page.getByRole("progressbar", { name: "Budget progress", exact: true })
			const base = bar.locator('[data-slot="progress-indicator"]')
			const excess = bar.locator('[data-slot="progress-excess-indicator"]')
			for (const [value, transform, hasExcess] of [
				[-20, "translateX(-100%)", false],
				[0, "translateX(-100%)", false],
				[50, "translateX(-50%)", false],
				[100, "translateX(0%)", false],
				[150, "translateX(0%)", true],
			] as const) {
				await page.getByRole("button", { name: `Set ${value}`, exact: true }).click()
				await expect(page.getByTestId("progress-value")).toHaveText(
					`Progress value: ${value}`,
				)
				await expect
					.poll(() => base.evaluate(element => element.style.transform))
					.toBe(transform)
				await expect(excess).toHaveCount(hasExcess ? 1 : 0)
			}
			await expect
				.poll(() => excess.evaluate(element => element.style.transform))
				.toBe("translateX(-50%)")
		})

		await test.step("scroll area: scrolls its viewport", async () => {
			await gotoPrimitives(page)
			const viewport = page.locator('[data-slot="scroll-area-viewport"]').first()
			await expect(page.getByText("Scrollable row 20")).toBeAttached()
			const top = await viewport.evaluate(element => {
				element.scrollTop = 60
				return element.scrollTop
			})
			expect(top).toBe(60)
		})

		await test.step("separator: renders in both orientations", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-separator")
			await expect(section.locator('[data-slot="separator"]')).toHaveCount(2)
			await expect(section.locator('[data-slot="separator"]').first()).toHaveAttribute(
				"data-orientation",
				"horizontal",
			)
			await expect(section.locator('[data-slot="separator"]').nth(1)).toHaveAttribute(
				"data-orientation",
				"vertical",
			)
			await expect(section.getByText("Above separator")).toBeVisible()
			await expect(section.getByText("Below separator")).toBeVisible()
		})

		await test.step("table: shows caption, rows and footer totals", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-table")
			await expect(section.getByText("Demo spending by payee.")).toBeVisible()
			await expect(section.getByText("$60.70")).toBeVisible()
			await expect(section.getByText("Total")).toBeVisible()
		})

		await test.step("pagination: marks the active page and labels navigation", async () => {
			await gotoPrimitives(page)
			const nav = page.getByRole("navigation", { name: "pagination" })
			await expect(nav).toBeVisible()
			await expect(nav.getByRole("link", { name: "2" })).toHaveAttribute(
				"aria-current",
				"page",
			)
			await expect(nav.getByRole("link", { name: "Go to previous page" })).toBeVisible()
			await expect(nav.getByRole("link", { name: "Go to next page" })).toBeVisible()
		})

		await test.step("input group: types, clears and shows addon content", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-input-group")
			await section.getByLabel("Grouped amount").fill("42")
			await expect(page.getByTestId("input-group-value")).toHaveText("Group value: 42")
			await section.getByRole("button", { name: "Clear" }).click()
			await expect(page.getByTestId("input-group-value")).toHaveText("Group value: empty")
			await expect(section.getByText("Note")).toBeVisible()
			await expect(section.getByLabel("Grouped notes")).toBeVisible()
		})

		await test.step("item group: renders titles, descriptions and actions", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-item")
			await expect(section.getByRole("list")).toBeVisible()
			await expect(section.getByText("Dinner record")).toBeVisible()
			await expect(section.getByText("$12.50")).toBeVisible()
			await expect(section.getByText("Second item")).toBeVisible()
			await section.getByRole("button", { name: "Open" }).click()
			await expect(page.getByTestId("item-opens")).toHaveText("Item opens: 1")
		})

		await test.step("label: focuses its control and mirrors textarea state", async () => {
			await gotoPrimitives(page)
			await page.getByText("Atom label").click()
			await expect(page.locator("#primitive-label-input")).toBeFocused()
			await page.getByLabel("Mirror notes").fill("hello")
			await expect(page.getByTestId("label-value")).toHaveText("Label input: hello")
		})

		await test.step("field: renders label, error, legend and separator copy", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-field")
			await expect(section.getByText("Field label")).toBeVisible()
			// Named role queries miss this alert (same Playwright quirk as the
			// forms alert: the node is present with exactly this text), so assert
			// role + text like the forms validation test does.
			await expect(section.getByRole("alert")).toHaveCount(1)
			await expect(section.getByRole("alert")).toContainText("Demo error text")
			await expect(section.getByText("Fieldset legend")).toBeVisible()
			await expect(section.getByText("Field title")).toBeVisible()
		})
	})
	test("sidebar primitives: menu selection, badge, skeleton, filter input, group and menu actions, and the trigger work", async ({
		page,
		isMobile,
	}) => {
		await test.step("sidebar menu: menu and sub-menu buttons report selection", async () => {
			await gotoPrimitives(page)
			const section = await sidebarScope(page, isMobile)
			await section.getByRole("button", { name: "Statements", exact: true }).click()
			await expect(page.getByTestId("sidebar-value")).toContainText("choice: statements")
			// The sub button renders an href-less anchor (no link role); target its slot.
			await section.locator('[data-slot="sidebar-menu-sub-button"]').click()
			await expect(page.getByTestId("sidebar-value")).toContainText("choice: monthly")
		})

		await test.step("sidebar actions: badge, skeleton, filter input, group action and menu action behave", async () => {
			await gotoPrimitives(page)
			const section = await sidebarScope(page, isMobile)
			await expect(section.getByText("12")).toBeVisible()
			await expect(section.locator('[data-slot="sidebar-menu-skeleton"]')).toBeVisible()
			await expect(page.getByTestId("standalone-skeleton")).toBeVisible()

			await section.getByLabel("Filter sidebar").fill("rec")
			await expect(page.getByTestId("sidebar-value")).toContainText("filter rec")

			await section.getByRole("button", { name: "Add group item" }).click()
			await expect(page.getByTestId("sidebar-value")).toContainText("adds 1")

			await section.getByRole("button", { name: "Pin statements" }).click()
			await expect(page.getByTestId("sidebar-value")).toContainText("pinned yes")

			const cursor = await section
				.getByRole("button", { name: "Records" })
				.evaluate(element => getComputedStyle(element).cursor)
			expect(cursor).toBe("pointer")
		})

		await test.step("sidebar trigger: collapses on desktop and opens a sheet on mobile", async () => {
			await gotoPrimitives(page)
			const wide = await page.evaluate(() => window.innerWidth >= 768)
			const trigger = page.locator('[data-slot="sidebar-trigger"]')
			if (wide) {
				const sidebar = page.locator('[data-slot="sidebar"]')
				await expect(sidebar).toHaveAttribute("data-state", "expanded")
				await trigger.click()
				await expect(sidebar).toHaveAttribute("data-state", "collapsed")
				await trigger.click()
				await expect(sidebar).toHaveAttribute("data-state", "expanded")
				const rail = page.locator('[data-slot="sidebar-rail"]')
				const cursor = await rail.evaluate(element => getComputedStyle(element).cursor)
				expect(cursor).toBe("pointer")
				await rail.click()
				await expect(sidebar).toHaveAttribute("data-state", "collapsed")
			} else {
				await trigger.click()
				await expect(page.getByRole("dialog", { name: "Sidebar" })).toBeVisible()
				await page.keyboard.press("Escape")
				await expect(page.getByRole("dialog", { name: "Sidebar" })).toBeHidden()
			}
		})
	})

	test("chart, toast, theme and layout: axes and legend, success and error toasts, dark theme and viewport fit hold", {
		tag: ["@light"],
	}, async ({ page }) => {
		await test.step("chart container: renders axes and legend entries", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-chart")
			await expect(section.locator('[data-slot="chart"] svg')).toBeVisible()
			await expect(section.getByText("Aug")).toBeVisible()
			await expect(section.getByText("Spending")).toBeVisible()
		})

		await test.step("toast: shows success and error toasts", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Show success toast" }).click()
			await expect(page.getByText("Saved demo record")).toBeVisible()
			await page.getByRole("button", { name: "Show error toast" }).click()
			await expect(page.getByText("Demo import failed")).toBeVisible()
		})

		await test.step("dark theme: keeps content readable after toggling", async () => {
			await gotoPrimitives(page)
			// The harness boots dark when the OS/project prefers it, so the dark
			// project starts with the real dark class applied.
			const prefersDark = await page.evaluate(
				() => window.matchMedia("(prefers-color-scheme: dark)").matches,
			)
			await expect(page.locator("html.dark")).toHaveCount(prefersDark ? 1 : 0)
			await page.getByRole("button", { name: "Toggle dark theme" }).click()
			await expect(page.locator("html.dark")).toHaveCount(prefersDark ? 0 : 1)
			await expect(page.getByText("Spending summary")).toBeVisible()
			await page.getByRole("button", { name: "Toggle dark theme" }).click()
			await expect(page.locator("html.dark")).toHaveCount(prefersDark ? 1 : 0)
		})

		await test.step("layout: sections fit the viewport width", async () => {
			await gotoForms(page)
			const formsOverflow = await page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth,
			)
			expect(formsOverflow).toBeLessThanOrEqual(1)
			await gotoPrimitives(page)
			const primitivesOverflow = await page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth,
			)
			expect(primitivesOverflow).toBeLessThanOrEqual(1)
		})
	})

	test("long select list: group label and separator render, and scroll buttons select a far item", async ({
		page,
	}) => {
		await test.step("select group: group label and separator render with the options", async () => {
			await gotoPrimitives(page)
			await page.locator("#harness-select").click()
			// Scope to the open popup: the page also renders a cmdk suggestion
			// listbox with role=listbox.
			const content = page.locator('[data-slot="select-content"]')
			await expect(content.getByText("Common")).toBeVisible()
			await expect(content.locator('[data-slot="select-separator"]')).toHaveCount(1)
			await page.keyboard.press("Escape")
			await expect(content).toBeHidden()
		})

		await test.step("long select list: scroll buttons appear and a far item is selected", async () => {
			await gotoPrimitives(page)
			await page.locator("#harness-select-long").click()
			const content = page.locator('[data-slot="select-content"]')
			// Wait out the popup's entrance animation before measuring or wheeling it.
			await content.evaluate(el =>
				Promise.all(
					el
						.getAnimations({ subtree: true })
						.filter(
							a =>
								a.effect?.getComputedTiming().iterations !==
								Number.POSITIVE_INFINITY,
						)
						.map(a => a.finished.catch(() => undefined)),
				),
			)
			// The opened long popup itself must fit the viewport, not just the closed page.
			await expectPopupInViewport(page, content)
			// The List (not the popup) is the real scroll container: capped at
			// 24rem with its own overflow, per the installed Base UI engine.
			const list = content.locator('[data-slot="select-viewport"]')
			await expect(list).toBeVisible()
			await expect(content.locator('[data-slot="select-scroll-down-button"]')).toBeVisible()
			await expect(content.locator('[data-slot="select-scroll-up-button"]')).toHaveCount(0)
			await expect(await list.evaluate(element => element.scrollTop)).toBe(0)
			await list.hover()
			await page.mouse.wheel(0, 1200)
			await expect(content.locator('[data-slot="select-scroll-up-button"]')).toBeVisible()
			const scrolled = await list.evaluate(element => element.scrollTop)
			expect(scrolled).toBeGreaterThan(0)
			await content.getByRole("option", { name: "Long item 40", exact: true }).click()
			await expect(page.getByTestId("select-long-value")).toHaveText(
				"Long select value: long-40",
			)
			await expect(page.locator("#harness-select-long")).toContainText("Long item 40")
		})
	})

	test("long select list: a far item is selected by tap and keyboard jump on touch", {
		tag: ["@mobile-only"],
	}, async ({ page, hasTouch }) => {
		test.skip(!hasTouch, "touch-only behaviour: hover arrows stay suppressed")
		await gotoPrimitives(page)
		await page.locator("#harness-select-long").tap()
		const content = page.locator('[data-slot="select-content"]')
		const list = content.locator('[data-slot="select-viewport"]')
		await expect(list).toBeVisible()
		// Touch opens suppress the hover-only arrows.
		await expect(content.locator('[data-slot="select-scroll-down-button"]')).toHaveCount(0)
		await expect(content.locator('[data-slot="select-scroll-up-button"]')).toHaveCount(0)
		// This proves tap opening plus keyboard scrolling only: End jumps to the
		// last option through real key handling and scrolls the List there.
		// Genuine touch-drag scrolling is not asserted here.
		await page.keyboard.press("End")
		const scrolled = await list.evaluate(element => element.scrollTop)
		expect(scrolled).toBeGreaterThan(0)
		await content.getByRole("option", { name: "Long item 40", exact: true }).tap()
		await expect(page.getByTestId("select-long-value")).toHaveText("Long select value: long-40")
	})

	test("combobox subexports: trigger, grouped label, chip removal and keyboard selection work", async ({
		page,
	}) => {
		await test.step("combobox trigger: opens the list and clear resets the value", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-combobox")
			const input = page.getByLabel("Fruit combobox", { exact: true })
			const trigger = section.locator('[data-slot="input-group-button"]').first()
			// Both trigger and clear are Tab-reachable (product tabIndex 0), so the
			// keyboard path is asserted through real Tab transit, not .focus().
			await input.click()
			await page.keyboard.press("Tab")
			await expect(trigger).toBeFocused()
			await page.keyboard.press("Enter")
			await expect(page.getByRole("option", { name: "Apple" })).toBeVisible()
			await page.keyboard.press("Escape")
			await input.click()
			await input.type("Ban")
			await page.getByRole("option", { name: "Banana" }).click()
			await expect(page.getByTestId("combobox-value")).toHaveText("Combobox value: Banana")
			await input.focus()
			await page.keyboard.press("Tab")
			const clear = page.locator('[data-slot="combobox-clear"]')
			await expect(clear).toBeFocused()
			await page.keyboard.press("Enter")
			await expect(page.getByTestId("combobox-value")).toHaveText("Combobox value: none")
		})

		await test.step("grouped combobox: shows its label and separator", async () => {
			await gotoPrimitives(page)
			await page.getByLabel("Grouped fruit combobox").click()
			await expect(page.getByText("Grouped fruit")).toBeVisible()
			await expect(page.locator('[data-slot="combobox-separator"]')).toHaveCount(1)
			await page.keyboard.press("Escape")
		})

		await test.step("combobox chip: removing one chip drops only that pick", async () => {
			await gotoPrimitives(page)
			await page.getByLabel("Add fruit").click()
			await page.getByLabel("Add fruit").type("Ban")
			await page.getByRole("option", { name: "Banana" }).click()
			await expect(page.getByTestId("combobox-multi-value")).toHaveText(
				"Multi value: Apple, Banana",
			)
			await page
				.locator('[data-slot="combobox-chip"]', { hasText: "Banana" })
				.locator('[data-slot="combobox-chip-remove"]')
				.click()
			await expect(page.getByTestId("combobox-multi-value")).toHaveText("Multi value: Apple")
		})

		await test.step("combobox field: selects the highlighted match from the keyboard", async () => {
			await gotoForms(page)
			await page.locator("#harness-payee").click()
			await page.locator("#harness-payee").type("Gro")
			await page.keyboard.press("ArrowDown")
			await page.keyboard.press("Enter")
			await expect(page.getByTestId("payee-value")).toHaveText("Payee value: Groceries")
		})
	})

	test("command structure: groups, separator, shortcuts and ArrowDown highlight work", async ({
		page,
	}) => {
		await test.step("command groups: render with separator, shortcuts and accessible names", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-command")
			await expect(section.getByText("Fruit", { exact: true })).toBeVisible()
			await expect(section.getByText("More", { exact: true })).toBeVisible()
			await expect(section.locator('[data-slot="command-separator"]')).toHaveCount(1)
			await expect(section.locator('[data-slot="command-shortcut"]')).toHaveCount(5)
		})

		await test.step("command: ArrowDown highlights the first enabled item", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-command")
			await section.getByRole("combobox", { name: "Search fruit" }).focus()
			const selected = section.locator('[data-slot="command-item"][data-selected="true"]')
			// cmdk pre-highlights the first enabled item; ArrowDown advances.
			await expect(selected).toHaveCount(1)
			await expect(selected).toContainText("Apple")
			await page.keyboard.press("ArrowDown")
			await expect(selected).toContainText("Banana")
		})
	})

	test("widget keyboard and cursor: toggle, disabled checkbox, button group, calendar keys and pointer cursors work", async ({
		page,
	}) => {
		await test.step("toggle group: activates from the keyboard and keeps the disabled item unselected", async () => {
			await gotoPrimitives(page)
			const day = page.getByRole("radio", { name: "Day view" })
			const week = page.getByRole("radio", { name: "Week view" })
			const archived = page.getByRole("radio", { name: "Archived view" })
			// Arrow-key focus travel in the single-select group proved timing
			// sensitive across runs, so keyboard selection is asserted via focus +
			// Enter, which deterministically activates the focused item.
			await week.focus()
			await page.keyboard.press("Enter")
			await expect(page.getByTestId("toggle-value")).toHaveText("Toggle: week")
			await day.focus()
			await page.keyboard.press("Enter")
			await expect(page.getByTestId("toggle-value")).toHaveText("Toggle: day")
			await expect(archived).toBeDisabled()
			const cursor = await day.evaluate(element => getComputedStyle(element).cursor)
			expect(cursor).toBe("pointer")
		})

		await test.step("checkbox: a disabled checkbox ignores label clicks", async () => {
			await gotoPrimitives(page)
			await expect(page.locator("#harness-check-disabled")).toBeDisabled()
			// Force a DOM activation like the disabled-button test does: even then
			// the disabled control must not toggle.
			await page
				.getByText("Disabled option")
				.evaluate(element => (element as HTMLElement).click())
			await expect(page.locator("#harness-check-disabled")).not.toBeChecked()
			await expect(page.getByTestId("checkbox-value")).toHaveText("Checkbox: unchecked")
		})

		await test.step("button group: separator is vertical and its buttons show pointer cursors", async () => {
			await gotoPrimitives(page)
			const group = page.getByTestId("primitive-button-group")
			await expect(group.locator('[data-slot="button-group-separator"]')).toHaveCount(1)
			await expect(group.locator('[data-slot="button-group-separator"]')).toHaveAttribute(
				"data-orientation",
				"vertical",
			)
			for (const name of ["Left", "Right"]) {
				const cursor = await group
					.getByRole("button", { name })
					.evaluate(element => getComputedStyle(element).cursor)
				expect(cursor).toBe("pointer")
			}
			await group.getByRole("button", { name: "Right" }).click()
			await expect(page.getByTestId("button-clicks")).toHaveText("Button clicks: 1")
		})

		await test.step("calendar: arrow keys move focus and Home and End jump", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-calendar")
			// Tab from a nearby control reaches the selected day through the real
			// tab order (roving tabindex: only the selected day is tabbable).
			await page.getByRole("radio", { name: "Week view" }).focus()
			let label = ""
			for (let index = 0; index < 8; index++) {
				await page.keyboard.press("Tab")
				label =
					(await page.evaluate(
						() => document.activeElement?.getAttribute("aria-label") ?? "",
					)) ?? ""
				if (label.includes("September")) break
			}
			expect(label).toContain("September 14")
			const focusedLabel = () =>
				page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "")
			// DayPicker manages day focus (product ref fix): arrows move a day,
			// Home/End jump to the week edges; focus never selects by itself.
			await page.keyboard.press("ArrowRight")
			expect(await focusedLabel()).toContain("September 15")
			await expect(page.getByTestId("calendar-value")).toContainText("Sep 14 2026")
			await page.keyboard.press("Home")
			expect(await focusedLabel()).toContain("September 13")
			await page.keyboard.press("End")
			expect(await focusedLabel()).toContain("September 19")
			await page.keyboard.press("Enter")
			await expect(page.getByTestId("calendar-value")).toContainText("Sep 19 2026")
			// Month navigation buttons activate from the keyboard as well.
			await section.getByRole("button", { name: /next month/i }).focus()
			await page.keyboard.press("Enter")
			await expect(section.getByText("October 2026")).toBeVisible()
		})
	})

	test("modal dismissal: Escape and footer actions dismiss, and popover shows its description", async ({
		page,
	}) => {
		await test.step("alert dialog: Escape dismisses without deciding and actions record decisions", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Delete workspace" }).click()
			await expect(page.getByRole("alertdialog")).toBeVisible()
			// Escape closes the dialog but records no decision, unlike Cancel.
			await page.keyboard.press("Escape")
			await expect(page.getByRole("alertdialog")).toBeHidden()
			await expect(page.getByTestId("alert-decision")).toHaveText("Alert decision: none")
			await page.getByRole("button", { name: "Delete workspace" }).click()
			await page.getByRole("button", { name: "Cancel" }).click()
			await expect(page.getByRole("alertdialog")).toBeHidden()
			await expect(page.getByTestId("alert-decision")).toHaveText("Alert decision: cancelled")
		})

		await test.step("sheet: dismisses from Escape", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Open sheet" }).click()
			await expect(page.getByRole("dialog", { name: "Harness sheet" })).toBeVisible()
			await page.keyboard.press("Escape")
			await expect(page.getByRole("dialog", { name: "Harness sheet" })).toBeHidden()
		})

		await test.step("dialog: dismisses from its footer close button", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Open dialog" }).click()
			await expect(page.getByRole("dialog", { name: "Harness dialog" })).toBeVisible()
			await page.getByRole("button", { name: "Close dialog" }).click()
			await expect(page.getByTestId("dialog-value")).toHaveText("Dialog open: no")
		})

		await test.step("popover: exposes its description copy", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Open popover" }).click()
			await expect(page.getByText("Popover description text.")).toBeVisible()
			await page.keyboard.press("Escape")
			await expect(page.getByText("Popover title")).toBeHidden()
		})
	})

	test("display primitive edges: alerts, field groups, item, scroll, pagination, sidebar, toast, pickers, forms and selects behave at their edges", async ({
		page,
		isMobile,
	}) => {
		test.setTimeout(240000)
		await test.step("alerts: expose both variants and a pointer action", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-alert")
			await expect(section.getByRole("alert")).toHaveCount(2)
			const cursor = await section
				.getByRole("button", { name: "Review" })
				.evaluate(element => getComputedStyle(element).cursor)
			expect(cursor).toBe("pointer")
		})

		await test.step("field groups: carry group semantics", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-field")
			await expect(section.getByRole("group")).toHaveCount(3)
			await expect(section.getByRole("group", { name: "Fieldset legend" })).toBeVisible()
		})

		await test.step("item: separator renders and action shows a pointer cursor", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-item")
			await expect(section.locator('[data-slot="item-separator"]')).toHaveCount(1)
			const cursor = await section
				.getByRole("button", { name: "Open" })
				.evaluate(element => getComputedStyle(element).cursor)
			expect(cursor).toBe("pointer")
		})

		await test.step("scroll area: exposes scrollbar and thumb while scrolling", async () => {
			await gotoPrimitives(page)
			// The hover-type scrollbar only mounts during hover/scroll interaction.
			const viewport = page.locator('[data-slot="scroll-area-viewport"]').first()
			await viewport.hover()
			await viewport.evaluate(element => {
				element.scrollTop = 60
			})
			const scrollbar = page.locator('[data-slot="scroll-area-scrollbar"]').first()
			await expect(scrollbar).toBeAttached()
			await expect(scrollbar).toHaveAttribute("data-orientation", "vertical")
			await expect(page.locator('[data-slot="scroll-area-thumb"]').first()).toBeAttached()
		})

		await test.step("pagination: exposes its ellipsis", async () => {
			await gotoPrimitives(page)
			const section = page.getByTestId("primitive-pagination")
			await expect(section.locator('[data-slot="pagination-ellipsis"]')).toHaveCount(1)
		})

		await test.step("sidebar display: renders badge, footer, label and separator", async () => {
			await gotoPrimitives(page)
			const section = await sidebarScope(page, isMobile)
			await expect(section.getByText("Workspace")).toBeVisible()
			await expect(section.getByText("Harness footer")).toBeVisible()
			await expect(section.locator('[data-slot="sidebar-separator"]')).toHaveCount(1)
			await expect(section.locator('[data-slot="sidebar-group-content"]')).toHaveCount(1)
		})

		await test.step("toast: dismisses from its close button", async () => {
			await gotoPrimitives(page)
			await page.getByRole("button", { name: "Show success toast" }).click()
			await expect(page.getByText("Saved demo record")).toBeVisible()
			await page.getByRole("button", { name: "Close toast" }).first().click()
			await expect(page.getByText("Saved demo record")).toBeHidden()
		})

		await test.step("date picker: preserves page scroll while open and dismisses with Escape", async () => {
			await gotoForms(page)
			const before = await page.evaluate(() => [
				getComputedStyle(document.body).overflow,
				getComputedStyle(document.documentElement).overflow,
			])
			await page.locator("#harness-date").click()
			const popover = page.locator('[data-slot="popover-content"]')
			await expect(popover).toBeVisible()
			// While open: a picker that locks the page only while open fails here;
			// before/after comparison alone cannot catch it.
			const during = await page.evaluate(() => [
				getComputedStyle(document.body).overflow,
				getComputedStyle(document.documentElement).overflow,
			])
			expect(during).toEqual(before)
			await expectPopupInViewport(page, popover)
			await expectWheelScrollsPageWhileOpen(page)
			await page.keyboard.press("Escape")
			await expect(popover).toBeHidden()
			await expect(page.getByTestId("date-value")).toHaveText("Date value: 2026-09-14")
			const after = await page.evaluate(() => [
				getComputedStyle(document.body).overflow,
				getComputedStyle(document.documentElement).overflow,
			])
			expect(after).toEqual(before)
		})

		await test.step("combobox field: preserves page scroll while open and dismisses with Escape", async () => {
			await gotoForms(page)
			// The shared dropdown helper asserts overflow and real wheel scrolling
			// while the intended listbox is open, not after it closes.
			await expectDropdownPreservesScroll(page, () => page.locator("#harness-payee").click())
			await expect(page.getByRole("listbox")).toBeVisible()
			await page.keyboard.press("Escape")
			await expect(page.getByRole("listbox")).toHaveCount(0)
		})

		await test.step("date range: preserves page scroll while open and dismisses with Escape", async () => {
			await gotoForms(page)
			const before = await page.evaluate(() => [
				getComputedStyle(document.body).overflow,
				getComputedStyle(document.documentElement).overflow,
			])
			await page.locator("#harness-range").click()
			const popover = page.locator('[data-slot="popover-content"]')
			await expect(popover).toBeVisible()
			const during = await page.evaluate(() => [
				getComputedStyle(document.body).overflow,
				getComputedStyle(document.documentElement).overflow,
			])
			expect(during).toEqual(before)
			await expectPopupInViewport(page, popover)
			await expectWheelScrollsPageWhileOpen(page)
			await page.keyboard.press("Escape")
			await expect(popover).toBeHidden()
			await expect(page.getByTestId("range-value")).toHaveText(
				"Range value: 2026-09-01 to 2026-09-30",
			)
		})

		await test.step("form pickers: triggers open from the keyboard and close with Escape", async () => {
			await gotoForms(page)
			await page.locator("#harness-direction").focus()
			await page.keyboard.press("Enter")
			await expect(
				page.locator('[data-slot="select-content"]').filter({ visible: true }),
			).toHaveCount(1)
			await page.keyboard.press("Escape")
			await page.locator("#harness-date").focus()
			await page.keyboard.press("Enter")
			await expect(
				page.locator('[data-slot="popover-content"]').filter({ visible: true }),
			).toHaveCount(1)
			const datePopover = page
				.locator('[data-slot="popover-content"]')
				.filter({ visible: true })
			await datePopover.getByRole("button", { name: /September 14th, 2026/ }).focus()
			await page.keyboard.press("ArrowRight")
			await expect(
				datePopover.getByRole("button", { name: /September 15th, 2026/ }),
			).toBeFocused()
			await page.keyboard.press("Enter")
			await expect(page.getByTestId("date-value")).toHaveText("Date value: 2026-09-15")
			await page.keyboard.press("Escape")
			await page.locator("#harness-datetime").focus()
			await page.keyboard.press("Enter")
			await expect(
				page.locator('[data-slot="popover-content"]').filter({ visible: true }),
			).toHaveCount(1)
			const datetimePopover = page
				.locator('[data-slot="popover-content"]')
				.filter({ visible: true })
			await datetimePopover.getByRole("button", { name: /September 14th, 2026/ }).focus()
			await page.keyboard.press("ArrowRight")
			await expect(
				datetimePopover.getByRole("button", { name: /September 15th, 2026/ }),
			).toBeFocused()
			await page.keyboard.press("Enter")
			await expect(page.getByTestId("datetime-value")).toHaveText(
				"Datetime value: 2026-09-15T09:30",
			)
			await page.keyboard.press("Escape")
			await expect(page.getByTestId("direction-value")).toHaveText(
				"Direction value: spending",
			)
			await expect(page.getByTestId("date-value")).toHaveText("Date value: 2026-09-15")
		})

		await test.step("Record analytics: selects preserve page scroll while open and dismiss with Escape", async () => {
			await gotoForms(page)
			await expectDropdownPreservesScroll(page, () =>
				page.locator("#analytics_treatment").click(),
			)
			await page.keyboard.press("Escape")
			await expectDropdownPreservesScroll(page, () =>
				page.locator("#monthly_budget_id").click(),
			)
			await page.keyboard.press("Escape")
			await expect(page.getByTestId("analytics-value")).toContainText(
				"Treatment: category-default",
			)
		})

		await test.step("form labels: activate their controls and invalid input links its error", async () => {
			await gotoForms(page)
			// Every field label resolves to exactly one control through htmlFor.
			for (const name of [
				"Amount",
				"Title",
				"Notes",
				"Direction",
				"Payee",
				"Date",
				"Date range",
				"Date and time",
			] as const)
				await expect(page.getByLabel(name, { exact: true })).toHaveCount(1)
			// Text controls: label click focuses the associated input.
			for (const id of [
				"harness-amount",
				"harness-title",
				"harness-notes",
				"harness-payee",
			] as const) {
				await page.locator(`label[for="${id}"]`).click()
				await expect(page.locator(`#${id}`)).toBeFocused()
				await page.keyboard.press("Escape")
			}
			// Popup triggers: label click opens the associated popup. Scope to the
			// visible popup: the page renders several closed selects/popovers.
			await page.locator('label[for="harness-direction"]').click()
			const selectPopup = page
				.locator('[data-slot="select-content"]')
				.filter({ visible: true })
			await expect(selectPopup).toHaveCount(1)
			await expectPopupInViewport(page, selectPopup)
			await page.keyboard.press("Escape")
			for (const id of ["harness-date", "harness-range", "harness-datetime"] as const) {
				await page.locator(`label[for="${id}"]`).click()
				// Closed popovers stay mounted hidden; scope to the visible one.
				const popover = page
					.locator('[data-slot="popover-content"]')
					.filter({ visible: true })
				await expect(popover).toHaveCount(1)
				await expectPopupInViewport(page, popover)
				await page.keyboard.press("Escape")
			}
			// Invalid state: the error alert lives in the same field with its message.
			await expect(page.getByLabel("Title with error", { exact: true })).toHaveAttribute(
				"aria-invalid",
				"true",
			)
			const field = page.locator('[data-slot="field"]:has(#harness-title-invalid)')
			await expect(field.getByRole("alert")).toContainText("Enter a title")
		})

		await test.step("long field values: stay inside the viewport width", async () => {
			await gotoForms(page)
			// Wrappable realistic copy: an unbroken 200-character token would
			// overflow the test-only readout paragraph itself, which proves nothing
			// about the product controls.
			const long = `${"lorem ipsum dolor sit amet ".repeat(12).trim()}`
			await page.getByLabel("Title", { exact: true }).fill(long)
			await page.getByLabel("Notes").fill(long)
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth,
			)
			expect(overflow).toBeLessThanOrEqual(1)
			await expect(page.getByTestId("title-value")).toContainText("lorem ipsum")
		})

		await test.step("disabled form fields: stay disabled and keep their values", async () => {
			await gotoForms(page)
			for (const [label, id] of [
				["Disabled date", "harness-date-disabled"],
				["Disabled payee", "harness-payee-disabled"],
				["Disabled direction", "harness-direction-disabled"],
				["Disabled date and time", "harness-datetime-disabled"],
			] as const) {
				await expect(page.getByLabel(label, { exact: true })).toHaveCount(1)
				await expect(page.locator(`#${id}`)).toBeDisabled()
			}
			// Programmatic activation like the disabled-button test: even then the
			// disabled controls must not open or change value.
			for (const id of [
				"harness-date-disabled",
				"harness-payee-disabled",
				"harness-direction-disabled",
				"harness-datetime-disabled",
			] as const)
				await page.locator(`#${id}`).evaluate(element => (element as HTMLElement).click())
			await expect(
				page.locator('[data-slot="select-content"]').filter({ visible: true }),
			).toHaveCount(0)
			await expect(
				page.locator('[data-slot="popover-content"]').filter({ visible: true }),
			).toHaveCount(0)
			await expect(page.getByRole("listbox").filter({ visible: true })).toHaveCount(0)
			// Keyboard cannot reach them either.
			await page.locator("#harness-payee").focus()
			for (let step = 0; step < 12; step++) {
				await page.keyboard.press("Tab")
				const focused = await page.evaluate(() => document.activeElement?.id ?? "")
				expect(focused).not.toMatch(/-disabled$/)
			}
			await expect(page.getByTestId("disabled-changes")).toHaveText("Disabled changes: 0")
			// Each control still shows its value (or placeholder) while disabled.
			await expect(page.locator("#harness-direction-disabled")).toContainText("Spending")
			await expect(page.locator("#harness-payee-disabled")).toHaveAttribute(
				"placeholder",
				"Choose payee",
			)
			await expect(page.locator("#harness-date-disabled")).toContainText(
				/14.*Sep.*2026|Sep.*14.*2026/,
			)
			await expect(page.locator("#harness-datetime-disabled")).toContainText(
				/14.*Sep.*2026|Sep.*14.*2026/,
			)
		})

		await test.step("long optional select: shows an empty placeholder, fits the popup and picks an option", async () => {
			await gotoForms(page)
			await expect(page.getByTestId("choice-value")).toHaveText("Choice value: none")
			await expect(page.locator("#harness-choice")).toContainText("Choose an option")
			await expectDropdownPreservesScroll(page, () => page.locator("#harness-choice").click())
			const content = page.locator('[data-slot="select-content"]').filter({ visible: true })
			await expect(content).toHaveCount(1)
			await expectPopupInViewport(page, content)
			// Base UI Select ignores a mouse click on an option that is not highlighted, and
			// after the touch swipe above the highlight can lag on a fast host; phones tap.
			const sabbatical = content.getByRole("option", { name: /Sabbatical/ })
			if (isMobile) await sabbatical.tap()
			else await sabbatical.click()
			await expect(page.getByTestId("choice-value")).toHaveText("Choice value: long")
			await expect(page.locator("#harness-choice")).toContainText("Sabbatical")
		})
	})
})

test("dropdown menu: keeps the page scrollable and supports keyboard selection after reopening", async ({
	page,
}) => {
	await page.goto(`${HARNESS_URL}/?section=primitives`, { waitUntil: "domcontentloaded" })
	const trigger = page.getByRole("button", { name: "Open menu", exact: true })
	await trigger.scrollIntoViewIfNeeded()
	await expectDropdownPreservesScroll(page, () => trigger.click())
	await page.keyboard.press("Escape")
	await expect(page.getByRole("menu")).toHaveCount(0)
	await expect(trigger).toBeFocused()
	await trigger.press("Enter")
	await expect(page.getByRole("menuitem", { name: "Edit item", exact: true })).toBeFocused()
	await page.keyboard.press("Enter")
	await expect(page.getByTestId("dropdown-value")).toContainText("Menu: edit")
	await expect(page.getByRole("menu")).toHaveCount(0)
})

test("modal focus: containment and restoration hold for dialog, sheet and alert", async ({
	page,
}) => {
	for (const modal of [
		{ trigger: "Open dialog", role: "dialog", title: "Harness dialog", close: "Close dialog" },
		{ trigger: "Open sheet", role: "dialog", title: "Harness sheet", close: "Close sheet" },
		{
			trigger: "Delete workspace",
			role: "alertdialog",
			title: "Delete workspace?",
			close: "Cancel",
		},
	] as const) {
		await test.step(`modal focus: ${modal.title} shows a backdrop, contains Tab focus and restores the trigger`, async () => {
			await page.goto(`${HARNESS_URL}/?section=primitives`, {
				waitUntil: "domcontentloaded",
			})
			const trigger = page.getByRole("button", { name: modal.trigger, exact: true })
			await trigger.focus()
			await trigger.press("Enter")
			const popup = page.getByRole(modal.role, { name: modal.title, exact: true })
			await expect(popup).toBeVisible()
			await expectVisibleBackdrop(page)
			for (let step = 0; step < 5; step++) {
				await page.keyboard.press("Tab")
				// Base UI briefly focuses an outside focus-guard before returning focus inside.
				await expect
					.poll(() => popup.evaluate(element => element.contains(document.activeElement)))
					.toBe(true)
			}
			await popup.getByRole("button", { name: modal.close, exact: true }).click()
			await expect(popup).not.toBeVisible()
			await expect(trigger).toBeFocused()
			await trigger.press("Enter")
			await expect(popup).toBeVisible()
			await page.keyboard.press("Escape")
			await expect(popup).not.toBeVisible()
			await expect(trigger).toBeFocused()
		})
	}
})

test("combobox field: reopening while the list fades out filters by the new search", async ({
	page,
}) => {
	await page.goto(`${HARNESS_URL}/?section=forms`)
	// Slow animations 20x so the 100ms exit lasts long enough to reopen inside it on any
	// host; Base UI 1.4 otherwise kept filtering by the previous search until unmount.
	const cdp = await page.context().newCDPSession(page)
	await cdp.send("Animation.enable")
	await cdp.send("Animation.setPlaybackRate", { playbackRate: 0.05 })
	const input = page.locator("#harness-payee")
	await input.click()
	await input.pressSequentially("Gro")
	await page.getByRole("option", { name: "Groceries" }).click()
	await expect(page.getByTestId("payee-value")).toHaveText("Payee value: Groceries")
	await page.locator('[data-slot="combobox-clear"]').click({ force: true })
	await input.click({ force: true })
	await input.pressSequentially("zzz")
	await expect(page.getByText("No payees found.")).toBeVisible()
	await input.fill("")
	await input.pressSequentially("Tra")
	await expect(page.getByRole("option", { name: "Transport" })).toBeVisible()
	await expect(page.getByRole("option", { name: "Groceries" })).toHaveCount(0)
})

test("select field: preserves the page scrollbar while open", async ({ page }) => {
	await page.goto(`${HARNESS_URL}/?section=forms`)
	// The composed harness uses the same SelectField as all editors.
	const trigger = page.locator("#harness-direction")
	await expectPointerCursor(trigger)
	await expectDropdownPreservesScroll(page, () => trigger.click())
	await page.keyboard.press("Escape")
	await expect(page.getByRole("listbox")).toHaveCount(0)
	await expect(trigger).toBeFocused()
	await trigger.press("Enter")
	await page.getByRole("option", { name: "Income", exact: true }).click()
	await expect(page.getByTestId("direction-value")).toHaveText("Direction value: income")
})

test.describe("harness facets section", () => {
	test.use({ baseURL: HARNESS_URL })
	test("facet primitives: grouped notes, dropdown structure, badge, scroll geometry and skeleton size hold", {
		tag: ["@light"],
	}, async ({ page }) => {
		await test.step("grouped notes: accept long unicode text and keyboard edits", async () => {
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
		await test.step("dropdown menu: label, separator geometry and submenu shortcut stay readable", async () => {
			await page.goto("/?section=primitives")
			await page.goto("/?section=primitives")
			await page.getByRole("button", { name: "Open menu", exact: true }).click()
			const menu = page.getByRole("menu")
			await expect(menu.getByText("Menu label", { exact: true })).toBeVisible()
			// Measure only after the menu's entrance animation has finished.
			await menu.evaluate(el =>
				Promise.all(
					el
						.getAnimations({ subtree: true })
						.filter(
							a =>
								a.effect?.getComputedTiming().iterations !==
								Number.POSITIVE_INFINITY,
						)
						.map(a => a.finished.catch(() => undefined)),
				),
			)
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
		await test.step("badge: status variants keep semantic colours and long content stays accessible inside the viewport", async () => {
			await page.goto("/?section=primitives")
			await page.goto("/?section=primitives")
			const badges = page.getByTestId("primitive-badge")
			const warning = badges.getByText("Pending", { exact: true })
			const destructive = badges.getByText("Over budget", { exact: true })
			await expect(warning).toBeVisible()
			await expect(destructive).toBeVisible()
			// Badges transition their colour for 150ms; read the settled value, not a mid-fade
			// one. A transition can be cancelled and replaced, so poll until none is running.
			await expect
				.poll(() =>
					page.evaluate(
						() =>
							document
								.getAnimations()
								.filter(
									animation =>
										animation.playState === "running" &&
										animation.effect?.getComputedTiming().iterations !==
											Number.POSITIVE_INFINITY,
								).length,
					),
				)
				.toBe(0)
			const warningColour = await warning.evaluate(element => getComputedStyle(element).color)
			const destructiveColour = await destructive.evaluate(
				element => getComputedStyle(element).color,
			)
			expect(warningColour).not.toBe(destructiveColour)
			for (const [badge, token] of [
				[warning, "--warning"],
				[destructive, "--destructive"],
			] as const) {
				// Normalise both colours through one canvas pixel so browsers that serialise
				// the same colour differently (oklab vs oklch on macOS) still compare equal.
				const colours = await badge.evaluate((element, token) => {
					const context = document.createElement("canvas").getContext("2d")
					if (!context) throw new Error("Canvas colour parser unavailable")
					const pixel = (colour: string) => {
						context.clearRect(0, 0, 1, 1)
						context.fillStyle = "rgba(0, 0, 0, 0)"
						context.fillStyle = colour
						context.fillRect(0, 0, 1, 1)
						return Array.from(context.getImageData(0, 0, 1, 1).data)
					}
					const style = getComputedStyle(element)
					return {
						actual: pixel(style.color),
						expected: pixel(style.getPropertyValue(token).trim()),
					}
				}, token)
				expect(colours.expected[3]).toBeGreaterThan(0)
				// The token is outside sRGB; allow small gamut-mapping rounding between the
				// computed oklab and the declared oklch.
				for (const [index, channel] of colours.actual.entries())
					expect(
						Math.abs(channel - (colours.expected[index] ?? -255)),
					).toBeLessThanOrEqual(4)
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
		await test.step("primitive geometry: scrolling exposes a painted thumb and the button separator has visible geometry", async () => {
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
		await test.step("facet skeleton: placeholder reserves 128 by 16 pixels", async () => {
			await page.goto("/?section=primitives")
			await page.goto("/?section=primitives")
			const skeleton = page.getByTestId("standalone-skeleton")
			await skeleton.scrollIntoViewIfNeeded()
			await expect(skeleton).toHaveCSS("width", "128px")
			await expect(skeleton).toHaveCSS("height", "16px")
		})
	})
})

test.describe("harness display section", () => {
	test.use({ baseURL: HARNESS_URL })
	test.beforeEach(async ({ page }) => {
		await page.goto("/display.html", { waitUntil: "commit" })
		await expect(page.getByRole("heading", { name: "Display components" })).toBeVisible()
	})

	// Read-only primitive checks share one page load: no step mutates the page.
	test("display components: Allocation, sparkline, amount, icon and narrow fit values render correctly", {
		tag: ["@light"],
	}, async ({ page }) => {
		await test.step("Allocation bar: zero, negative, full, excess and opposite-sign values stay finite and bounded", async () => {
			for (const [title, percent, amount] of [
				["Zero", 0, "$0.00 / $0.00"],
				["Partial negative", 40, "-$10.00 / -$25.00"],
				["Full", 100, "$25.00 / $25.00"],
				["Excess", 100, "-$75.00 / -$50.00"],
				["Opposite sign", 0, "$10.00 / -$25.00"],
			] as const) {
				const bar = page.getByTestId(`allocation-${title}`)
				await expect(bar).toContainText(amount)
				await expect(bar.getByRole("progressbar")).toHaveAttribute(
					"aria-valuenow",
					String(percent),
				)
				const scale = await bar
					.getByRole("progressbar")
					.locator(":scope > div")
					.first()
					.evaluate(
						element => new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
					)
				expect(scale).toBeCloseTo(percent / 100, 2)
			}
			await expect(
				page
					.getByTestId("allocation-Excess")
					.getByRole("progressbar")
					.locator(":scope > div"),
			).toHaveCount(2)
		})
		await test.step("sparkline: missing, flat, negative, mixed and dense values have correct finite endpoints", async () => {
			for (const name of ["Empty", "Single"])
				await expect(page.getByTestId(`sparkline-${name}`).locator("svg")).toHaveCount(0)
			for (const [name, count, lastY, zeroLine] of [
				["Zero", 3, 25, false],
				["Negative", 3, 7.4, false],
				["Mixed", 3, 3, true],
				["Dense", 100, 3 + (1 - (-200 + 300) / 600) * 22, true],
			] as const) {
				const svg = page.getByRole("img", { name, exact: true })
				const serialized = await svg.locator("polyline").getAttribute("points")
				if (!serialized) throw new Error(`${name}: no data marks`)
				const points = serialized.split(" ").map(point => point.split(",").map(Number))
				expect(points).toHaveLength(count)
				expect(points.flat().every(Number.isFinite)).toBe(true)
				expect(points.at(-1)?.[0]).toBe(93)
				expect(points.at(-1)?.[1]).toBeCloseTo(lastY, 2)
				await expect(svg.locator("circle")).toHaveAttribute("cx", "93")
				await expect(svg.locator("line")).toHaveCount(zeroLine ? 1 : 0)
				const box = await svg.boundingBox()
				expect(box?.width).toBe(96)
				expect(box?.height).toBe(28)
			}
		})
		await test.step("amount and badge: optional states keep signs, pending values and colour fallback", async () => {
			await expect(page.getByTestId("pending-amount")).toHaveText("-$25.00[-$10.00]")
			await expect(page.getByTestId("confirmed-amount")).toHaveText("$20.00")
			await expect(page.getByTestId("zero-amount")).toHaveText("$0.00")
			const badges = page.getByRole("region", { name: "Budget badges" })
			for (const label of ["Unbudgeted", "No colour"])
				await expect(badges.getByText(label).locator(":scope > span")).toHaveCSS(
					"border-top-style",
					"solid",
				)
			const colour = badges.locator("span[title]")
			await expect(colour.locator(":scope > span").first()).toHaveCSS(
				"background-color",
				"rgb(56, 189, 248)",
			)
			await expect(colour).toHaveAttribute("title", /早餐/)
			const overflow = await badges.evaluate(
				element => element.scrollWidth - element.clientWidth,
			)
			expect(overflow).toBeLessThanOrEqual(1)
		})
		await test.step("icons: missing, invalid, prefixed and dynamic icons keep real SVG output and reserved size", async () => {
			await expect(page.getByTestId("empty-icon").locator("svg")).toHaveCount(0)
			for (const name of ["Known icon", "Dynamic icon", "Fallback icon"])
				await expect(page.locator(`svg[aria-label="${name}"] path`)).not.toHaveCount(0)
			await expect(page.locator('svg[aria-label="Fallback icon"]')).toHaveClass(
				/lucide-circle-question-mark/,
			)
			const coloured = page.getByTestId("colour-icon").locator("div")
			await expect(coloured).toHaveCSS("width", "32px")
			await expect(coloured).toHaveCSS("background-color", "rgb(239, 108, 0)")
			await expect(coloured.locator("svg")).toHaveAttribute("width", "16")
		})
		await test.step("sparkline fixtures: fit narrow viewports with visible strokes", async () => {
			const viewport = page.viewportSize()
			for (const name of ["Zero", "Negative", "Mixed", "Dense"]) {
				const svg = page.getByRole("img", { name, exact: true })
				await expect(svg, `${name}: sparkline renders`).toBeVisible()
				const box = await svg.boundingBox()
				expect(box, `${name}: sparkline is laid out`).not.toBeNull()
				if (box && viewport) {
					expect(box.x, `${name}: inside the left edge`).toBeGreaterThanOrEqual(-1)
					expect(box.x + box.width, `${name}: inside the right edge`).toBeLessThanOrEqual(
						viewport.width + 1,
					)
				}
				const paint = await svg.locator("polyline").evaluate(element => {
					const alpha = (color: string) => {
						const canvas = document.createElement("canvas")
						canvas.width = canvas.height = 1
						const context = canvas.getContext("2d")
						if (!context) throw new Error("Canvas is required to resolve colours")
						context.fillStyle = "rgba(0,0,0,0)"
						context.fillStyle = color
						context.fillRect(0, 0, 1, 1)
						return [...context.getImageData(0, 0, 1, 1).data]
					}
					let backdrop = "rgba(0, 0, 0, 0)"
					for (
						let node: Element | null = element.parentElement;
						node;
						node = node.parentElement
					) {
						const color = getComputedStyle(node).backgroundColor
						if ((alpha(color)[3] ?? 0) > 0) {
							backdrop = color
							break
						}
					}
					const style = getComputedStyle(element)
					return {
						stroke: alpha(style.stroke),
						backdrop: alpha(backdrop),
						width: Number.parseFloat(style.strokeWidth),
						opacity: Number(style.strokeOpacity) * Number(style.opacity),
					}
				})
				expect(paint.stroke[3], `${name}: stroke colour is opaque`).toBeGreaterThan(0)
				expect(paint.width, `${name}: stroke has width`).toBeGreaterThan(0)
				expect(paint.opacity, `${name}: stroke is not faded out`).toBeGreaterThan(0.5)
				expect(
					paint.stroke.slice(0, 3),
					`${name}: stroke differs from its backdrop`,
				).not.toEqual(paint.backdrop.slice(0, 3))
			}
			const region = page.getByRole("region", { name: "Sparkline boundaries", exact: true })
			await expect(region).toBeVisible()
			expect(
				await region.evaluate(element => element.scrollWidth - element.clientWidth),
			).toBeLessThanOrEqual(1)
		})
	})

	test("sparkline and summary: final endpoints show, and the detail summary fits and keeps values after a keyboard change", async ({
		page,
	}) => {
		await test.step("sparkline entrance: reveals the final data endpoint", async () => {
			const button = page.getByRole("button", { name: "Show trend" })
			await button.scrollIntoViewIfNeeded()
			await button.click()
			await expect(
				page.getByRole("img", { name: "New trend" }).locator("circle"),
			).toHaveAttribute("cy", "3")
		})
		await test.step("sparkline endpoint: stays on the final data value after Show trend", async () => {
			const button = page.getByRole("button", { name: "Show trend" })
			await button.scrollIntoViewIfNeeded()
			await button.click()
			await expect(
				page.getByRole("img", { name: "New trend" }).locator("circle"),
			).toHaveAttribute("cy", "3")
		})
		await test.step("detail summary: long and missing values fit each viewport and a changed value keeps its final text", async () => {
			const summary = page.getByRole("region", { name: "Detail summary" })
			await expect(summary).toContainText("Allocated -$10.00")
			await expect(summary).toContainText("Missing optional values remain readable")
			await expect(summary).toContainText("早餐")
			expect(
				await summary.evaluate(element => element.scrollWidth - element.clientWidth),
			).toBeLessThanOrEqual(1)
			const button = page.getByRole("button", { name: "Change value" })
			await expectPointerCursor(button)
			await button.focus()
			await page.keyboard.press("Enter")
			await expect(
				page.getByRole("region", { name: "Changing value" }).locator("span").first(),
			).toHaveText("-$25.00")
		})
	})
})
