import { expect, type Page, test } from "@playwright/test"
import {
	expectDropdownPreservesScroll,
	expectVisibleBackdrop,
	scrollWithInput,
} from "./support/assertions"
import { setDateOnly } from "./support/date-only"

// Isolated widget harness (TEST ONLY, no app workspace fixture). Served by the
// second Playwright webServer on :5174 (see playwright.config.ts).
test.use({ baseURL: "http://127.0.0.1:5174" })

// Mirror the domain suites' fixedClock: pin wall time so calendar/today
// rendering is deterministic. Same instant as tests/web/support/fixtures.ts.
test.beforeEach(async ({ page }) => {
	await setDateOnly(page, new Date("2026-10-15T12:00:00+08:00"))
})

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

test.describe("form fields", () => {
	test("amount commits typed value, rejects invalid text and 3dp", async ({ page }) => {
		await gotoForms(page)
		const input = page.locator("#harness-amount")
		await input.fill("99.99")
		await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 99.99")
		await input.fill("abc")
		await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 99.99")
		await input.fill("1.234")
		await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 99.99")
	})

	test("amount ArrowUp/ArrowDown step by 0.01", async ({ page }) => {
		await gotoForms(page)
		await page.locator("#harness-amount").click()
		await page.keyboard.press("ArrowUp")
		await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 12.51")
		await page.keyboard.press("ArrowDown")
		await expect(page.getByTestId("amount-value")).toHaveText("Amount value: 12.5")
	})

	test("amount sign toggle flips sign; min=0 field hides toggle and rejects minus", async ({
		page,
	}) => {
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

	test("text field types; suggestions filter and select", async ({ page }) => {
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

	test("textarea records long values", async ({ page }) => {
		await gotoForms(page)
		const long = `note ${"x".repeat(200)}`
		await page.getByLabel("Notes").fill(long)
		await expect(page.getByTestId("notes-value")).toHaveText(`Notes length: ${long.length}`)
		await expect(page.getByLabel("Notes")).toHaveValue(long)
	})

	test("select picks an option; disabled option stays unselected", async ({ page }) => {
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

	test("select opens and closes from the keyboard", async ({ page }) => {
		await gotoForms(page)
		await page.locator("#harness-direction").focus()
		await page.keyboard.press("Enter")
		await expect(page.getByRole("listbox")).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(page.getByRole("listbox")).toBeHidden()
	})

	test("combobox field filters, picks, clears and shows empty text", async ({ page }) => {
		await gotoForms(page)
		await page.locator("#harness-payee").click()
		await page.locator("#harness-payee").type("Gro")
		const option = page.getByRole("option", { name: "Groceries" })
		await expect(option).toBeVisible()
		await option.click()
		await expect(page.getByTestId("payee-value")).toHaveText("Payee value: Groceries")

		await page.locator('[data-slot="combobox-clear"]').click()
		await expect(page.getByTestId("payee-value")).toHaveText("Payee value: none")

		await page.locator("#harness-payee").click()
		await page.locator("#harness-payee").type("zzz")
		await expect(page.getByText("No payees found.")).toBeVisible()
	})

	test("date field picks a day from the calendar and clears", async ({ page }) => {
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

	test("date range applies a day and clears back to null", async ({ page }) => {
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

	test("datetime field edits time and picks a new date", async ({ page }) => {
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

	test("record analytics treatment gates the monthly budget control", async ({ page }) => {
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

	test("field validation errors render as alerts", async ({ page }) => {
		await gotoForms(page)
		await expect(page.getByTestId("harness-forms").getByRole("alert")).toContainText(
			"Enter a title",
		)
	})
})

test.describe("buttons, groups, checkbox, toggle", () => {
	test("enabled buttons count clicks, work from keyboard and show pointer cursor", async ({
		page,
	}) => {
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

	test("disabled button stays disabled and ignores programmatic clicks", async ({ page }) => {
		await gotoPrimitives(page)
		const disabled = page.getByRole("button", { name: "Disabled action" })
		await expect(disabled).toBeDisabled()
		await disabled.evaluate(element => (element as HTMLButtonElement).click())
		await expect(page.getByTestId("button-clicks")).toHaveText("Button clicks: 0")
	})

	test("button group exposes a group role with separator and label", async ({ page }) => {
		await gotoPrimitives(page)
		const group = page.getByTestId("primitive-button-group")
		await expect(group.getByRole("group")).toBeVisible()
		await expect(group.getByText("Group label")).toBeVisible()
		const left = group.getByRole("button", { name: "Left" })
		await left.evaluate(element => element.scrollIntoView({ block: "center" }))
		await left.click()
		await expect(page.getByTestId("button-clicks")).toHaveText("Button clicks: 1")
	})

	test("checkbox toggles by label and Space; disabled stays off", async ({ page }) => {
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

	test("toggle group selects a value; disabled item stays disabled", async ({ page }) => {
		await gotoPrimitives(page)
		const week = page.getByRole("radio", { name: "Week view" })
		await week.evaluate(element => element.scrollIntoView({ block: "center" }))
		await week.click()
		await expect(page.getByTestId("toggle-value")).toHaveText("Toggle: week")
		await expect(page.getByRole("radio", { name: "Archived view" })).toBeDisabled()
	})
})

test.describe("calendar, month picker, command", () => {
	test("calendar selects a day and navigates months", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-calendar")
		await section.getByRole("button", { name: /September 21st, 2026/ }).click()
		await expect(page.getByTestId("calendar-value")).toContainText("Sep 21 2026")
		await section.getByRole("button", { name: /next month/i }).click()
		await expect(section.getByText("October 2026")).toBeVisible()
	})

	test("month picker selects a month; bounded picker disables out-of-range months", async ({
		page,
	}) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-monthpicker")
		await section.getByRole("button", { name: "Oct", exact: true }).first().click()
		await expect(page.getByTestId("monthpicker-value")).toHaveText("Selected month: Oct 2026")

		const bounded = page.locator('[aria-label="Bounded month picker"]')
		await bounded.getByRole("button").nth(1).click()
		await expect(bounded).toContainText("2027")
		await expect(bounded.getByRole("button", { name: "Jan" })).toBeDisabled()
	})

	test("command filters, selects and reports an empty state", async ({ page }) => {
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

	test("command highlights an item from the keyboard", async ({ page }) => {
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

	test("command dialog opens and closes from an item", async ({ page }) => {
		await gotoPrimitives(page)
		await page.getByRole("button", { name: "Open command dialog" }).click()
		await expect(page.getByRole("dialog")).toBeVisible()
		await expectPopupInViewport(page, page.getByRole("dialog"))
		await page.getByRole("option", { name: "Close dialog" }).click()
		await expect(page.getByRole("dialog")).toBeHidden()
	})
})

test.describe("tooltip, popover, select, combobox", () => {
	test("tooltip appears on hover and on focus", async ({ page }) => {
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

	test("popover opens, keeps page overflow intact and closes on Escape", async ({ page }) => {
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

	test("select primitive picks a value and marks disabled items", async ({ page }) => {
		await gotoPrimitives(page)
		await page.locator("#harness-select").click()
		// Scope to the open popup: the always-mounted command list also exposes
		// role=option items with overlapping names.
		const content = page.locator('[data-slot="select-content"]')
		await content.getByRole("option", { name: "Banana", exact: true }).click()
		await expect(page.getByTestId("select-value")).toHaveText("Select value: banana")

		await page.locator("#harness-select").click()
		await expect(content.getByRole("option", { name: "Durian (unavailable)" })).toHaveAttribute(
			"data-disabled",
			"",
		)
		// A keyboard attempt must not select the disabled option.
		await page.keyboard.press("End")
		await page.keyboard.press("Enter")
		await expect(page.getByTestId("select-value")).toHaveText("Select value: banana")
		await page.keyboard.press("Escape")
		await expect(page.getByTestId("select-value")).toHaveText("Select value: banana")
	})

	test("combobox primitive filters, selects and clears", async ({ page }) => {
		await gotoPrimitives(page)
		// "Fruit combobox" is a substring of the grouped/collection labels,
		// so scope to the exact accessible name.
		const input = page.getByLabel("Fruit combobox", { exact: true })
		await input.click()
		await input.type("Ban")
		await page.getByRole("option", { name: "Banana" }).click()
		await expect(page.getByTestId("combobox-value")).toHaveText("Combobox value: Banana")
	})

	test("combobox collection renders the filtered items", async ({ page }) => {
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

	test("multi combobox chips accumulate picks", async ({ page }) => {
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

test.describe("dropdown menu", () => {
	test("items, checkbox, radio and sub-menu all act on state", async ({ page }) => {
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

	test("dropdown closes on Escape and leaves page scroll intact", async ({ page }) => {
		await gotoPrimitives(page)
		const overflowBefore = await page.evaluate(() => getComputedStyle(document.body).overflow)
		await page.getByRole("button", { name: "Open menu" }).click()
		await expect(page.getByRole("menu")).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(page.getByRole("menu")).toBeHidden()

		const overflowAfter = await page.evaluate(() => getComputedStyle(document.body).overflow)
		expect(overflowAfter).toBe(overflowBefore)
		const scrolled = await page.evaluate(() => {
			window.scrollTo(0, 120)
			return window.scrollY
		})
		expect(scrolled).toBeGreaterThan(0)
	})
})

test.describe("modal layers and backdrops", () => {
	test("alert dialog confirms and cancels with a visible backdrop", async ({ page }) => {
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

	test("dialog opens with backdrop and closes on Escape with scroll restored", async ({
		page,
	}) => {
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

	test("sheet opens with backdrop and closes from its close button", async ({ page }) => {
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

	test("alerts render both variants with title, description and action", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-alert")
		await expect(section.getByRole("alert").first()).toBeVisible()
		await expect(section.getByText("Heads up")).toBeVisible()
		await expect(section.getByText("Something needs attention")).toBeVisible()
		await section.getByRole("button", { name: "Review" }).click()
	})
})

test.describe("display primitives", () => {
	test("badge, card and empty render their content", async ({ page }) => {
		await gotoPrimitives(page)
		await expect(page.getByTestId("primitive-badge").getByText("Over budget")).toBeVisible()
		await expect(page.getByTestId("primitive-badge").getByText("Pending")).toBeVisible()
		const card = page.getByTestId("primitive-card")
		await expect(card.getByText("Spending summary")).toBeVisible()
		await card.getByRole("button", { name: "View" }).click()
		const empty = page.getByTestId("primitive-empty")
		await expect(empty.getByText("No records yet")).toBeVisible()
		await expect(empty.getByText("Add the first record to populate this view.")).toBeVisible()
	})

	test("progress clamps its base bar and flags only values above 100", async ({ page }) => {
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
			await expect(page.getByTestId("progress-value")).toHaveText(`Progress value: ${value}`)
			await expect
				.poll(() => base.evaluate(element => element.style.transform))
				.toBe(transform)
			await expect(excess).toHaveCount(hasExcess ? 1 : 0)
		}
		await expect
			.poll(() => excess.evaluate(element => element.style.transform))
			.toBe("translateX(-50%)")
	})

	test("scroll area scrolls its viewport", async ({ page }) => {
		await gotoPrimitives(page)
		const viewport = page.locator('[data-slot="scroll-area-viewport"]').first()
		await expect(page.getByText("Scrollable row 20")).toBeAttached()
		const top = await viewport.evaluate(element => {
			element.scrollTop = 60
			return element.scrollTop
		})
		expect(top).toBe(60)
	})

	test("separators render in both orientations", async ({ page }) => {
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

	test("table shows caption, rows and footer totals", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-table")
		await expect(section.getByText("Demo spending by payee.")).toBeVisible()
		await expect(section.getByText("$60.70")).toBeVisible()
		await expect(section.getByText("Total")).toBeVisible()
	})

	test("pagination marks the active page and labels navigation", async ({ page }) => {
		await gotoPrimitives(page)
		const nav = page.getByRole("navigation", { name: "pagination" })
		await expect(nav).toBeVisible()
		await expect(nav.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page")
		await expect(nav.getByRole("link", { name: "Go to previous page" })).toBeVisible()
		await expect(nav.getByRole("link", { name: "Go to next page" })).toBeVisible()
	})

	test("input group types, clears and shows addon content", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-input-group")
		await section.getByLabel("Grouped amount").fill("42")
		await expect(page.getByTestId("input-group-value")).toHaveText("Group value: 42")
		await section.getByRole("button", { name: "Clear" }).click()
		await expect(page.getByTestId("input-group-value")).toHaveText("Group value: empty")
		await expect(section.getByText("Note")).toBeVisible()
		await expect(section.getByLabel("Grouped notes")).toBeVisible()
	})

	test("item group renders titles, descriptions and actions", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-item")
		await expect(section.getByRole("list")).toBeVisible()
		await expect(section.getByText("Dinner record")).toBeVisible()
		await expect(section.getByText("$12.50")).toBeVisible()
		await expect(section.getByText("Second item")).toBeVisible()
		await section.getByRole("button", { name: "Open" }).click()
		await expect(page.getByTestId("item-opens")).toHaveText("Item opens: 1")
	})

	test("label focuses its control and mirrors textarea state", async ({ page }) => {
		await gotoPrimitives(page)
		await page.getByText("Atom label").click()
		await expect(page.locator("#primitive-label-input")).toBeFocused()
		await page.getByLabel("Mirror notes").fill("hello")
		await expect(page.getByTestId("label-value")).toHaveText("Label input: hello")
	})

	test("field primitives render label, error, legend and separator copy", async ({ page }) => {
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

// The mobile Sidebar renders in a Sheet that starts closed; open it and scope to the dialog.
const sidebarScope = async (page: Page, isMobile: boolean) => {
	const section = page.getByTestId("primitive-sidebar")
	if (!isMobile) return section
	await section.getByRole("button", { name: "Toggle Sidebar", exact: true }).click()
	const dialog = page.getByRole("dialog", { name: "Sidebar", exact: true })
	await expect(dialog).toBeVisible()
	return dialog
}

test.describe("sidebar primitives", () => {
	test("menu and sub-menu buttons report selection", async ({ page, isMobile }) => {
		await gotoPrimitives(page)
		const section = await sidebarScope(page, isMobile)
		await section.getByRole("button", { name: "Statements", exact: true }).click()
		await expect(page.getByTestId("sidebar-value")).toContainText("choice: statements")
		// The sub button renders an href-less anchor (no link role); target its slot.
		await section.locator('[data-slot="sidebar-menu-sub-button"]').click()
		await expect(page.getByTestId("sidebar-value")).toContainText("choice: monthly")
	})

	test("badge, skeleton, input, group action and menu action behave", async ({
		page,
		isMobile,
	}) => {
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

	test("trigger collapses on desktop and sheets on mobile", async ({ page }) => {
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

test.describe("chart, sonner, theme, layout", () => {
	test("chart container renders axes and legend entries", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-chart")
		await expect(section.locator('[data-slot="chart"] svg')).toBeVisible()
		await expect(section.getByText("Aug")).toBeVisible()
		await expect(section.getByText("Spending")).toBeVisible()
	})

	test("sonner shows success and error toasts", async ({ page }) => {
		await gotoPrimitives(page)
		await page.getByRole("button", { name: "Show success toast" }).click()
		await expect(page.getByText("Saved demo record")).toBeVisible()
		await page.getByRole("button", { name: "Show error toast" }).click()
		await expect(page.getByText("Demo import failed")).toBeVisible()
	})

	test("dark theme toggle keeps content readable", async ({ page }) => {
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

	test("harness sections fit the viewport width", async ({ page }) => {
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

test.describe("select subexports and long list", () => {
	test("group label and separator render with the options", async ({ page }) => {
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

	test("long list exposes scroll buttons and selects a far item", async ({ page }) => {
		await gotoPrimitives(page)
		await page.locator("#harness-select-long").click()
		const content = page.locator('[data-slot="select-content"]')
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
		await expect(page.getByTestId("select-long-value")).toHaveText("Long select value: long-40")
		await expect(page.locator("#harness-select-long")).toContainText("Long item 40")
	})

	test("long list selects a far item by tap opening and keyboard jump on touch", async ({
		page,
		hasTouch,
	}) => {
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
})

test.describe("combobox subexports, trigger, clear and chips", () => {
	test("trigger opens the list and clear resets the value", async ({ page }) => {
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

	test("grouped combobox shows its label and separator", async ({ page }) => {
		await gotoPrimitives(page)
		await page.getByLabel("Grouped fruit combobox").click()
		await expect(page.getByText("Grouped fruit")).toBeVisible()
		await expect(page.locator('[data-slot="combobox-separator"]')).toHaveCount(1)
		await page.keyboard.press("Escape")
	})

	test("chip remove drops only that pick", async ({ page }) => {
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

	test("combobox field selects the highlighted match from the keyboard", async ({ page }) => {
		await gotoForms(page)
		await page.locator("#harness-payee").click()
		await page.locator("#harness-payee").type("Gro")
		await page.keyboard.press("ArrowDown")
		await page.keyboard.press("Enter")
		await expect(page.getByTestId("payee-value")).toHaveText("Payee value: Groceries")
	})
})

test.describe("command structure and keyboard", () => {
	test("groups, separator and shortcuts render with accessible names", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-command")
		await expect(section.getByText("Fruit", { exact: true })).toBeVisible()
		await expect(section.getByText("More", { exact: true })).toBeVisible()
		await expect(section.locator('[data-slot="command-separator"]')).toHaveCount(1)
		await expect(section.locator('[data-slot="command-shortcut"]')).toHaveCount(5)
	})

	test("ArrowDown highlights the first enabled item", async ({ page }) => {
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

test.describe("widget keyboard and cursor edges", () => {
	test("toggle activates from the keyboard and keeps the disabled item unselected", async ({
		page,
	}) => {
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

	test("disabled checkbox ignores label clicks", async ({ page }) => {
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

	test("button group separator orientation and pointer cursors", async ({ page }) => {
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

	test("calendar arrow keys move focus and Home/End jump", async ({ page }) => {
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

test.describe("modal dismissal semantics", () => {
	test("alert dialog dismisses on Escape without deciding; actions record decisions", async ({
		page,
	}) => {
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

	test("sheet dismisses from Escape", async ({ page }) => {
		await gotoPrimitives(page)
		await page.getByRole("button", { name: "Open sheet" }).click()
		await expect(page.getByRole("dialog", { name: "Harness sheet" })).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog", { name: "Harness sheet" })).toBeHidden()
	})

	test("dialog dismisses from its footer close button", async ({ page }) => {
		await gotoPrimitives(page)
		await page.getByRole("button", { name: "Open dialog" }).click()
		await expect(page.getByRole("dialog", { name: "Harness dialog" })).toBeVisible()
		await page.getByRole("button", { name: "Close dialog" }).click()
		await expect(page.getByTestId("dialog-value")).toHaveText("Dialog open: no")
	})

	test("popover exposes its description copy", async ({ page }) => {
		await gotoPrimitives(page)
		await page.getByRole("button", { name: "Open popover" }).click()
		await expect(page.getByText("Popover description text.")).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(page.getByText("Popover title")).toBeHidden()
	})
})

test.describe("display primitive edges", () => {
	test("alerts expose both variants and a pointer action", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-alert")
		await expect(section.getByRole("alert")).toHaveCount(2)
		const cursor = await section
			.getByRole("button", { name: "Review" })
			.evaluate(element => getComputedStyle(element).cursor)
		expect(cursor).toBe("pointer")
	})

	test("field groups and fieldset carry group semantics", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-field")
		await expect(section.getByRole("group")).toHaveCount(3)
		await expect(section.getByRole("group", { name: "Fieldset legend" })).toBeVisible()
	})

	test("item separator and action cursor", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-item")
		await expect(section.locator('[data-slot="item-separator"]')).toHaveCount(1)
		const cursor = await section
			.getByRole("button", { name: "Open" })
			.evaluate(element => getComputedStyle(element).cursor)
		expect(cursor).toBe("pointer")
	})

	test("scroll area exposes scrollbar and thumb while scrolling", async ({ page }) => {
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

	test("pagination exposes its ellipsis", async ({ page }) => {
		await gotoPrimitives(page)
		const section = page.getByTestId("primitive-pagination")
		await expect(section.locator('[data-slot="pagination-ellipsis"]')).toHaveCount(1)
	})

	test("sidebar readonly display renders badge, footer, label and separator", async ({
		page,
		isMobile,
	}) => {
		await gotoPrimitives(page)
		const section = await sidebarScope(page, isMobile)
		await expect(section.getByText("Workspace")).toBeVisible()
		await expect(section.getByText("Harness footer")).toBeVisible()
		await expect(section.locator('[data-slot="sidebar-separator"]')).toHaveCount(1)
		await expect(section.locator('[data-slot="sidebar-group-content"]')).toHaveCount(1)
	})

	test("sonner toast dismisses from its close button", async ({ page }) => {
		await gotoPrimitives(page)
		await page.getByRole("button", { name: "Show success toast" }).click()
		await expect(page.getByText("Saved demo record")).toBeVisible()
		await page.getByRole("button", { name: "Close toast" }).first().click()
		await expect(page.getByText("Saved demo record")).toBeHidden()
	})

	test("date picker preserves page scroll while open and dismisses with Escape", async ({
		page,
	}) => {
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

	test("combobox field preserves page scroll while open and dismisses with Escape", async ({
		page,
	}) => {
		await gotoForms(page)
		// The shared dropdown helper asserts overflow and real wheel scrolling
		// while the intended listbox is open, not after it closes.
		await expectDropdownPreservesScroll(page, () => page.locator("#harness-payee").click())
		await expect(page.getByRole("listbox")).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(page.getByRole("listbox")).toHaveCount(0)
	})

	test("date range preserves page scroll while open and dismisses with Escape", async ({
		page,
	}) => {
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

	test("form picker triggers open from the keyboard and close with Escape", async ({ page }) => {
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
		const datePopover = page.locator('[data-slot="popover-content"]').filter({ visible: true })
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
		await expect(page.getByTestId("direction-value")).toHaveText("Direction value: spending")
		await expect(page.getByTestId("date-value")).toHaveText("Date value: 2026-09-15")
	})

	test("record analytics selects preserve page scroll while open and dismiss with Escape", async ({
		page,
	}) => {
		await gotoForms(page)
		await expectDropdownPreservesScroll(page, () =>
			page.locator("#analytics_treatment").click(),
		)
		await page.keyboard.press("Escape")
		await expectDropdownPreservesScroll(page, () => page.locator("#monthly_budget_id").click())
		await page.keyboard.press("Escape")
		await expect(page.getByTestId("analytics-value")).toContainText(
			"Treatment: category-default",
		)
	})

	test("form labels activate their controls and invalid input links its error", async ({
		page,
	}) => {
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
		const selectPopup = page.locator('[data-slot="select-content"]').filter({ visible: true })
		await expect(selectPopup).toHaveCount(1)
		await expectPopupInViewport(page, selectPopup)
		await page.keyboard.press("Escape")
		for (const id of ["harness-date", "harness-range", "harness-datetime"] as const) {
			await page.locator(`label[for="${id}"]`).click()
			// Closed popovers stay mounted hidden; scope to the visible one.
			const popover = page.locator('[data-slot="popover-content"]').filter({ visible: true })
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

	test("long field values stay inside the viewport width", async ({ page }) => {
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

	test("disabled form fields stay disabled and keep their values", async ({ page }) => {
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

	test("long optional select shows empty placeholder, fits popup and picks", async ({ page }) => {
		await gotoForms(page)
		await expect(page.getByTestId("choice-value")).toHaveText("Choice value: none")
		await expect(page.locator("#harness-choice")).toContainText("Choose an option")
		await expectDropdownPreservesScroll(page, () => page.locator("#harness-choice").click())
		const content = page.locator('[data-slot="select-content"]').filter({ visible: true })
		await expect(content).toHaveCount(1)
		await expectPopupInViewport(page, content)
		await content.getByRole("option", { name: /Sabbatical/ }).click()
		await expect(page.getByTestId("choice-value")).toHaveText("Choice value: long")
		await expect(page.locator("#harness-choice")).toContainText("Sabbatical")
	})
})
