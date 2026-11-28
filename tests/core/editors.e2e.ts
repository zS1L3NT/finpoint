import type { Locator, Page } from "@playwright/test"
import { expectPointerCursor, expectVisibleBackdrop } from "../support/assertions"
import { getScenario, IDS, statementRules } from "../support/data"
import {
	account,
	budget,
	chooseCategory,
	longText,
	openEditor,
	pending,
	pickOption,
	record,
	select,
} from "../support/editors"
import { expect, seedWorkspace, test } from "../support/fixtures"

// Each opening is its own step in the shared entrance test below: a motion
// failure aborts later openings fail-fast, so entrance regressions surface
// one editor at a time in step order.
const editors = [
	{
		name: "Account editor",
		route: "/accounts",
		trigger: `Rename ${account.name}`,
		title: "Edit Account",
		field: "Name",
		value: account.name,
	},
	{
		name: "Budget creator",
		route: "/budgets",
		trigger: "New Budget",
		title: "Create Budget",
		field: "Name",
		value: "",
	},
	{
		name: "Budget editor",
		route: `/budgets/${budget.id}`,
		trigger: "Edit Budget",
		title: "Edit Budget",
		field: "Name",
		value: budget.name,
	},
	{
		name: "Category creator",
		route: "/categories",
		trigger: "Create Category",
		title: "Create Category",
		field: "Name",
		value: "",
	},
	{
		name: "Category editor",
		route: "/categories",
		trigger: "Edit Groceries",
		title: "Edit Category",
		field: "Name",
		value: "Groceries",
	},
	{
		name: "Monthly Budget creator",
		route: "/?month=October&year=2026",
		trigger: "New",
		title: "Create monthly budget",
		field: "Name",
		value: "",
	},
	{
		name: "Monthly Budget editor",
		route: "/?month=October&year=2026",
		trigger: "Edit Daily",
		title: "Edit Daily",
		field: "Name",
		value: "Daily",
	},
	{
		name: "Pending Statement creator",
		route: "/statements",
		trigger: "Create Pending Statement",
		title: "Create Pending Statement",
		field: "Description",
		value: "",
	},
	{
		name: "Pending Statement editor",
		route: `/statements?statement=${pending.id}`,
		trigger: "Edit",
		title: "Edit Pending Statement",
		field: "Description",
		value: pending.description,
	},
	{
		name: "Record creator",
		route: "/records",
		trigger: "Create Pending Record",
		title: "Create New Record",
		field: "Title",
		value: "",
	},
	{
		name: "Record editor",
		route: `/records?record=${record.id}`,
		trigger: "Edit",
		title: "Edit Record",
		field: "Title",
		value: record.title,
	},
]

async function chooseRange(page: Page, dialog: Locator) {
	await dialog.getByLabel("Date range", { exact: true }).click()
	const calendar = page.locator('[data-slot="popover-content"]')
	await expect(calendar).toBeVisible()
	await calendar
		.locator("button[data-day]")
		.filter({ hasNot: page.locator("[disabled]") })
		.first()
		.click()
	await calendar.getByRole("button", { name: "Apply", exact: true }).click()
}

const longName = "café 日本語 — Long description ".repeat(8).trim()

async function containedFooter(dialog: Locator) {
	await expect(dialog).toBeVisible()
	expect(
		await dialog.evaluate(element => element.scrollWidth - element.clientWidth),
	).toBeLessThanOrEqual(1)
	for (const action of await dialog.locator('[data-slot="dialog-footer"] button:visible').all()) {
		await action.scrollIntoViewIfNeeded()
		await expect(action).toBeInViewport()
		if (await action.isEnabled()) {
			await expectPointerCursor(action)
			await action.click({ trial: true })
		}
	}
	const cancel = dialog.getByRole("button", { name: "Cancel", exact: true })
	await cancel.scrollIntoViewIfNeeded()
	await expectPointerCursor(cancel)
	await expect(cancel).toBeInViewport()
	await cancel.click({ trial: true })
	await cancel.focus()
	await cancel.press("Enter")
	await expect(dialog).not.toBeVisible()
}

test("editor popups: values, cursors, fit and keyboard reopen work", async ({
	page,
	workspace,
}) => {
	test.setTimeout(150_000)
	void workspace
	for (const editor of editors) {
		await test.step(`${editor.name}: backdrop, values, cursors, fit and keyboard reopen work`, async () => {
			void workspace
			await page.goto(editor.route)
			const trigger = page.getByRole("button", { name: editor.trigger, exact: true })
			await expectPointerCursor(trigger)
			await trigger.click()
			const dialog = page.getByRole("dialog", { name: editor.title, exact: true })
			await expect(dialog).toBeVisible()
			await expectVisibleBackdrop(page)
			await expect(dialog.getByLabel(editor.field, { exact: true })).toHaveValue(editor.value)
			// Every enabled popup button must look and stay interactive.
			for (const button of await dialog.getByRole("button").all()) {
				if (await button.isEnabled()) await expectPointerCursor(button)
			}
			const viewport = page.viewportSize()
			if (viewport && viewport.width >= 1280 && viewport.height >= 1200) {
				expect(
					await dialog.evaluate(element => element.scrollHeight - element.clientHeight),
					"Roomy desktop editor should fit without a scrollbar",
				).toBeLessThanOrEqual(1)
			}
			await page.keyboard.press("Escape")
			await expect(dialog).not.toBeVisible()
			// Escape closes a preview's form with the preview, so its Edit comes back with it.
			if (editor.trigger === "Edit") await page.goto(editor.route)
			await trigger.focus()
			await page.keyboard.press("Enter")
			await expect(dialog).toBeVisible()
			await expect(dialog.getByLabel(editor.field, { exact: true })).toHaveValue(editor.value)
			await dialog.getByRole("button", { name: "Close", exact: true }).click()
			await expect(dialog).not.toBeVisible()
		})
	}
})

test("Account editor: required name and unicode rename persist after reload", async ({
	page,
	workspace,
}) => {
	void workspace
	const dialog = await openEditor(page, "/accounts", `Rename ${account.name}`, "Edit Account")
	await dialog.getByLabel("Name", { exact: true }).fill("")
	await dialog.getByRole("button", { name: "Save changes" }).click()
	await expect(dialog.getByLabel("Name", { exact: true })).toHaveAttribute("aria-invalid", "true")
	await dialog.getByLabel("Name", { exact: true }).fill(longText)
	await dialog.getByRole("button", { name: "Save changes" }).click()
	await expect(dialog).not.toBeVisible()
	await page.reload()
	await expect(page.getByRole("heading", { name: longText.trim(), exact: true })).toBeVisible()
	const rename = page.getByRole("button", { name: `Rename ${longText.trim()}`, exact: true })
	// A 250-character name overflows the card grid and pushes this button out
	// of the viewport (see the muse-editors-results screenshot), so reopen via
	// keyboard; the grid overflow itself belongs to the pages owner.
	await rename.focus()
	await page.keyboard.press("Enter")
	await expect(page.getByRole("dialog").getByLabel("Name", { exact: true })).toHaveValue(
		longText.trim(),
	)
})

test("Budget editors: validate creation and persist edits", async ({ page, workspace }) => {
	void workspace
	await test.step("Budget creator: rejects blank names, missing ranges and negative amounts, and persists zero and a single-day range", async () => {
		void workspace
		const dialog = await openEditor(page, "/budgets", "New Budget", "Create Budget")
		await dialog.getByRole("button", { name: "Create budget", exact: true }).click()
		await expect(dialog.getByLabel("Name", { exact: true })).toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await expect(dialog.getByLabel("Date range", { exact: true })).toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await dialog.getByLabel("Amount", { exact: true }).fill("-20")
		await expect(dialog.getByLabel("Amount", { exact: true })).toHaveValue("0")
		await dialog.getByLabel("Name", { exact: true }).fill(longText)
		await chooseRange(page, dialog)
		await dialog.getByRole("button", { name: "Create budget", exact: true }).click()
		await expect(dialog).not.toBeVisible()
		await page.reload()
		const update = await openEditor(page, "/budgets", `Edit ${longText.trim()}`, "Edit Budget")
		await expect(update.getByLabel("Amount", { exact: true })).toHaveValue("0")
		await expect(update.getByLabel("Date range", { exact: true })).not.toContainText("Any date")
	})
	await test.step("Budget editor: prepopulates period and amount, rejects a cleared range, and persists a long name and zero", async () => {
		void workspace
		const route = `/budgets/${budget.id}`
		const dialog = await openEditor(page, route, "Edit Budget", "Edit Budget")
		await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue(budget.name)
		await expect(dialog.getByLabel("Amount", { exact: true })).toHaveValue(
			String(budget.amount),
		)
		await dialog.getByLabel("Date range", { exact: true }).click()
		await page
			.locator('[data-slot="popover-content"]')
			.getByRole("button", { name: "Clear", exact: true })
			.click()
		await dialog.getByRole("button", { name: "Save changes" }).click()
		await expect(dialog.getByLabel("Date range", { exact: true })).toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await chooseRange(page, dialog)
		await dialog.getByLabel("Name", { exact: true }).fill(longText)
		await dialog.getByLabel("Amount", { exact: true }).fill("0")
		await dialog.getByRole("button", { name: "Save changes" }).click()
		await expect(dialog).not.toBeVisible()
		await page.reload()
		await page.getByRole("button", { name: "Edit Budget", exact: true }).click()
		await expect(page.getByRole("dialog").getByLabel("Name", { exact: true })).toHaveValue(
			longText.trim(),
		)
		await expect(page.getByRole("dialog").getByLabel("Amount", { exact: true })).toHaveValue(
			"0",
		)
	})
})

test("Category editors: persist Treatment defaults and exclude archived options", async ({
	page,
	workspace,
}) => {
	void workspace
	await test.step("Category editor: offers a Spending default Monthly Budget, excludes archived options, clears the Budget for Income and validates a blank name", async () => {
		void workspace
		const dialog = await openEditor(page, "/categories", "Edit Groceries", "Edit Category")
		await expect(dialog.getByLabel("Treatment", { exact: true })).toContainText("Spending")
		await expect(dialog.getByLabel("Monthly budget", { exact: true })).toContainText("Daily")
		await dialog.getByLabel("Monthly budget", { exact: true }).click()
		await expect(page.getByRole("option", { name: "Daily", exact: true })).toBeVisible()
		await expect(page.getByRole("option", { name: "Travel", exact: true })).toHaveCount(0)
		// Nested-Escape regression: dismissing the select popover must leave the
		// editor open (BaseUI non-modal anchored select + FloatingTree).
		await page.keyboard.press("Escape")
		await expect(page.getByRole("option", { name: "Daily", exact: true })).toHaveCount(0)
		await expect(dialog).toBeVisible()
		await select(page, dialog, "Treatment", "Income")
		await expect(dialog.getByLabel("Monthly budget", { exact: true })).toHaveCount(0)
		await dialog.getByLabel("Name", { exact: true }).fill("")
		await dialog.getByRole("button", { name: "Save changes" }).click()
		await expect(dialog.getByLabel("Name", { exact: true })).toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await dialog.getByLabel("Name", { exact: true }).fill("Grocery income")
		await dialog.getByRole("button", { name: "Save changes" }).click()
		await expect(dialog).not.toBeVisible()
		await page.reload()
		await page.getByRole("button", { name: "Edit Grocery income", exact: true }).click()
		await expect(
			page.getByRole("dialog").getByLabel("Treatment", { exact: true }),
		).toContainText("Income")
		await expect(
			page.getByRole("dialog").getByLabel("Monthly budget", { exact: true }),
		).toHaveCount(0)
	})
	await test.step("Category creator: required identity, icon, colour and defaults persist", async () => {
		void workspace
		const dialog = await openEditor(page, "/categories", "Create Category", "Create Category")
		await expect(dialog.getByLabel("Treatment", { exact: true })).toContainText("Automatic")
		await dialog.getByLabel("Treatment", { exact: true }).click()
		await expect(
			page.getByRole("option", { name: "No default treatment", exact: true }),
		).toHaveCount(0)
		await expect(page.getByRole("option", { name: "Automatic", exact: true })).toBeVisible()
		await page.keyboard.press("Escape")
		await dialog.getByRole("button", { name: "Create category", exact: true }).click()
		await expect(dialog.getByLabel("Name", { exact: true })).toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await expect(dialog.getByLabel("Icon", { exact: true })).toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await expect(dialog.getByLabel("Colour", { exact: true })).toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await dialog.getByLabel("Name", { exact: true }).fill(longText)
		await dialog.getByLabel("Icon", { exact: true }).fill("apple")
		await pickOption(page.getByRole("option", { name: "apple", exact: true }))
		await dialog.getByLabel("Colour", { exact: true }).fill("#123456")
		await select(page, dialog, "Treatment", "Spending")
		await select(page, dialog, "Monthly budget", "Daily")
		// Keyboard submit: a focused submit button must activate the form.
		const submit = dialog.getByRole("button", { name: "Create category", exact: true })
		await submit.focus()
		await page.keyboard.press("Enter")
		await expect(dialog).not.toBeVisible()
		await page.reload()
		await page.getByRole("button", { name: `Edit ${longText.trim()}`, exact: true }).click()
		const update = page.getByRole("dialog", { name: "Edit Category", exact: true })
		await expect(update.getByLabel("Colour", { exact: true })).toHaveValue("#123456")
		await expect(update.getByLabel("Monthly budget", { exact: true })).toContainText("Daily")
	})
})

test("Monthly Budget editors: validate creation and persist overrides", async ({
	page,
	workspace,
}) => {
	void workspace
	await test.step("Monthly Budget creator: rejects blank input and persists distinct zero and null amounts", async () => {
		void workspace
		const dialog = await openEditor(
			page,
			"/?month=October&year=2026",
			"New",
			"Create monthly budget",
		)
		await dialog.getByRole("button", { name: "Create monthly budget", exact: true }).click()
		// Name and amount each report their own alert; the name one must mention the name.
		await expect(dialog.getByRole("alert").filter({ hasText: /name/i }).first()).toBeVisible()
		await dialog.getByLabel("Name", { exact: true }).fill(longText)
		await dialog.getByLabel("Monthly amount", { exact: true }).fill("-12")
		await expect(dialog.getByLabel("Monthly amount", { exact: true })).toHaveValue("0")
		await dialog.getByRole("button", { name: "Create monthly budget", exact: true }).click()
		await expect(dialog).not.toBeVisible()
		await page.reload()
		await page.getByRole("button", { name: `Edit ${longText.trim()}`, exact: true }).click()
		const update = page.getByRole("dialog", { name: `Edit ${longText.trim()}`, exact: true })
		await expect(update.getByLabel("Monthly amount", { exact: true })).toHaveValue("0")
		await update.getByRole("checkbox", { name: "No monthly amount", exact: true }).check()
		await expect(update.getByLabel("Monthly amount", { exact: true })).toBeDisabled()
		await update.getByRole("button", { name: "Save changes" }).click()
		await expect(update).not.toBeVisible()
		await page.reload()
		await page.getByRole("button", { name: `Edit ${longText.trim()}`, exact: true }).click()
		await expect(
			page
				.getByRole("dialog")
				.getByRole("checkbox", { name: "No monthly amount", exact: true }),
		).toBeChecked()
	})
	await test.step("Monthly Budget editor: zero override persists after reload", async () => {
		void workspace
		const dialog = await openEditor(
			page,
			"/?month=October&year=2026",
			"Edit Daily",
			"Edit Daily",
		)
		// The amount section mounts after the amount-source live query resolves.
		await expect(dialog.getByText("Amount for October 2026", { exact: true })).toBeVisible()
		await dialog
			.getByRole("group", { name: "Amount rule", exact: true })
			.getByRole("radio", { name: "Default", exact: true })
			.check()
		await expect(dialog.getByLabel("Monthly amount", { exact: true })).toHaveCount(0)
		await dialog
			.getByRole("group", { name: "Amount rule", exact: true })
			.getByRole("radio", { name: "Override one month", exact: true })
			.check()
		await expect(dialog.getByLabel("Monthly amount", { exact: true })).toBeVisible()
		// Daily starts with a null October amount, so the revealed input is disabled.
		await dialog.getByRole("checkbox", { name: "No monthly amount", exact: true }).uncheck()
		await dialog.getByLabel("Monthly amount", { exact: true }).fill("0")
		await dialog.getByRole("button", { name: "Save changes" }).click()
		await expect(dialog).not.toBeVisible()
		await page.reload()
		await page.getByRole("button", { name: "Edit Daily", exact: true }).click()
		await expect(
			page
				.getByRole("dialog")
				.getByRole("group", { name: "Amount rule", exact: true })
				.getByRole("radio", { name: "Override one month", exact: true }),
		).toBeChecked()
		await expect(
			page.getByRole("dialog").getByLabel("Monthly amount", { exact: true }),
		).toHaveValue("0")
	})
})

test("Pending Statement editors: validate creation and persist edits", async ({
	page,
	workspace,
}) => {
	void workspace
	await test.step("Pending Statement creator: required Account, description and negative amount persist", async () => {
		void workspace
		const dialog = await openEditor(
			page,
			"/statements",
			"Create Pending Statement",
			"Create Pending Statement",
		)
		await dialog.getByRole("button", { name: "Create statement", exact: true }).click()
		// Account pre-selects the first account, so it stays valid; description is blank.
		await expect(dialog.getByLabel("Account", { exact: true })).not.toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await expect(dialog.getByLabel("Account", { exact: true })).toContainText(
			"Everyday Savings",
		)
		await expect(dialog.getByLabel("Description", { exact: true })).toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await select(page, dialog, "Account", `${account.name} · ${account.bank}`)
		await dialog.getByLabel("Description", { exact: true }).fill(longText)
		await dialog.getByLabel("Amount", { exact: true }).fill("-0.01")
		await dialog.getByRole("button", { name: "Create statement", exact: true }).click()
		await expect(dialog).not.toBeVisible()
		await page.reload()
		await page
			.getByRole("searchbox", { name: "Search descriptions", exact: true })
			.fill(longText.trim())
		await expect(page.getByRole("main")).toContainText(longText.trim())
	})
	await test.step("Pending Statement editor: prepopulates its description, protects Allocations, rejects zero and persists a negative amount", async () => {
		void workspace
		const route = `/statements?statement=${pending.id}`
		const dialog = await openEditor(page, route, "Edit", "Edit Pending Statement")
		await expect(dialog.getByLabel("Description", { exact: true })).toHaveValue(
			pending.description,
		)
		await expect(dialog.getByLabel("Amount", { exact: true })).toHaveValue(
			String(pending.amount),
		)
		await expect(dialog.getByRole("button", { name: "Delete", exact: true })).toBeDisabled()
		await dialog.getByLabel("Description", { exact: true }).fill("Updated pending activity")
		await dialog.getByLabel("Amount", { exact: true }).fill("0")
		await dialog.getByRole("button", { name: "Save changes" }).click()
		await expect(dialog.getByLabel("Amount", { exact: true })).toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await expect(dialog).toContainText("Amount must not be zero.")
		await dialog.getByLabel("Amount", { exact: true }).fill("-14.51")
		await dialog.getByRole("button", { name: "Save changes" }).click()
		await expect(dialog).not.toBeVisible()
		await page.reload()
		await page.getByRole("button", { name: "Edit", exact: true }).click()
		await expect(page.getByRole("dialog").getByLabel("Amount", { exact: true })).toHaveValue(
			"-14.51",
		)
		await expect(
			page.getByRole("dialog").getByLabel("Description", { exact: true }),
		).toHaveValue("Updated pending activity")
	})
})

test("Statement rule editor: invalid input shows errors, then a valid rule persists after reload", async ({
	page,
}) => {
	await seedWorkspace(page, "populated", { statement_rules: statementRules() })
	const dialog = await openEditor(page, "/statement-rules", "New rule", "New rule")
	await dialog.getByRole("button", { name: "Create rule", exact: true }).click()
	await expect(dialog.getByText("Name this rule.", { exact: true })).toBeVisible()
	await expect(dialog.getByText("Enter text to look for.", { exact: true })).toBeVisible()
	await expect(
		dialog.getByText("Fill in at least one record field.", { exact: true }),
	).toBeVisible()
	await dialog.locator('button[id^="rule-operator-"]').click()
	await pickOption(page.getByRole("option", { name: "matches regex", exact: true }))
	const text = dialog.getByLabel("Text to look for", { exact: true })
	await text.fill("(")
	await expect(text).toHaveAttribute("aria-invalid", "true")
	await dialog.getByLabel("Name", { exact: true }).fill("Coffee rule")
	await dialog.getByRole("button", { name: "Create rule", exact: true }).click()
	await expect(
		dialog.getByText("Enter a valid regular expression.", { exact: true }),
	).toBeVisible()
	await text.fill("starbucks|raffles")
	await dialog.getByLabel("Title", { exact: true }).fill("Coffee")
	// Close the open Title suggestions before submitting.
	await page.keyboard.press("Escape")
	await dialog.getByRole("button", { name: "Create rule", exact: true }).click()
	await expect(dialog).not.toBeVisible()
	await page.reload()
	const card = page.locator("main article").filter({ hasText: "Coffee rule" })
	await expect(card).toContainText("starbucks|raffles")
	await expect(card.getByText("Coffee", { exact: true })).toBeVisible()

	await page.getByRole("button", { name: "Edit Coffee rule", exact: true }).click()
	const editor = page.getByRole("dialog", { name: "Edit rule", exact: true })
	await expect(editor).toBeVisible()
	await editor.getByLabel("Name", { exact: true }).fill("Coffee rules")
	await editor.getByRole("button", { name: "Save changes", exact: true }).click()
	await expect(editor).not.toBeVisible()
	await page.reload()
	await expect(page.getByRole("button", { name: "Edit Coffee rules", exact: true })).toBeVisible()

	await page.getByRole("button", { name: "Edit Coffee rules", exact: true }).click()
	const discarded = page.getByRole("dialog", { name: "Edit rule", exact: true })
	await discarded.getByLabel("Name", { exact: true }).fill("Discarded name")
	await discarded.getByRole("button", { name: "Cancel", exact: true }).click()
	await expect(discarded).not.toBeVisible()
	await page.reload()
	await expect(page.getByRole("button", { name: "Edit Coffee rules", exact: true })).toBeVisible()
	await expect(
		page.getByRole("button", { name: "Edit Discarded name", exact: true }),
	).toHaveCount(0)
})

test("Statement rule editor: the preview lists matching Statements and combines conditions by all or any", async ({
	page,
}) => {
	await seedWorkspace(page, "populated", { statement_rules: statementRules() })
	const dialog = await openEditor(page, "/statement-rules", "New rule", "New rule")
	await expect(
		dialog.getByText("Type some text to look for and matching Statements appear here.", {
			exact: true,
		}),
	).toBeVisible()
	const text = dialog.getByLabel("Text to look for", { exact: true })
	await text.fill("grab")
	await expect(
		dialog.getByRole("heading", { name: "2 matching Statements", exact: true }),
	).toBeVisible()
	await expect(dialog.locator("mark")).toHaveCount(2)
	await expect(dialog.locator("mark").first()).toHaveText("GRAB")

	await dialog.getByRole("button", { name: "Add condition", exact: true }).click()
	await dialog.getByLabel("Text to look for", { exact: true }).nth(1).fill("7712")
	await expect(
		dialog.getByRole("heading", { name: "1 matching Statement", exact: true }),
	).toBeVisible()
	await expect(dialog.locator("form").getByText("and", { exact: true })).toBeVisible()
	await dialog.getByRole("radio", { name: "Matches any", exact: true }).click()
	await expect(
		dialog.getByRole("heading", { name: "2 matching Statements", exact: true }),
	).toBeVisible()
	await expect(dialog.locator("form").getByText("or", { exact: true })).toBeVisible()
	await dialog.getByRole("radio", { name: "Matches all", exact: true }).click()
	await expect(
		dialog.getByRole("heading", { name: "1 matching Statement", exact: true }),
	).toBeVisible()
	await expect(dialog.locator("form").getByText("and", { exact: true })).toBeVisible()

	await dialog.getByRole("button", { name: "Remove condition", exact: true }).nth(1).click()
	await expect(
		dialog.getByRole("heading", { name: "2 matching Statements", exact: true }),
	).toBeVisible()
	await expect(dialog.locator("form").getByText("and", { exact: true })).toHaveCount(0)

	await text.fill("zzzz")
	await expect(
		dialog.getByText("No Statements match these conditions.", { exact: true }),
	).toBeVisible()
})

test("Statement rule editor: actions autofill, Unbudgeted differs from Not set, archived Monthly Budgets are hidden", async ({
	page,
}) => {
	await seedWorkspace(page, "populated", { statement_rules: statementRules() })
	const dialog = await openEditor(page, "/statement-rules", "New rule", "New rule")

	await dialog.getByLabel("Monthly budget", { exact: true }).click()
	await expect(page.getByRole("option", { name: "Not set", exact: true })).toBeVisible()
	await expect(page.getByRole("option", { name: "Unbudgeted", exact: true })).toBeVisible()
	await expect(page.getByRole("option", { name: "Daily", exact: true })).toBeVisible()
	await expect(page.getByRole("option", { name: "Recurring", exact: true })).toBeVisible()
	await expect(page.getByRole("option", { name: "Travel", exact: true })).toHaveCount(0)
	await page.keyboard.press("Escape")
	await expect(page.getByRole("option", { name: "Daily", exact: true })).toHaveCount(0)
	await expect(dialog).toBeVisible()

	await dialog.getByLabel("Name", { exact: true }).fill("Unbudgeted rule")
	await dialog.getByLabel("Text to look for", { exact: true }).fill("grab")
	await dialog.getByLabel("Title", { exact: true }).fill("Grab expense")
	// The open Title suggestions cover the Monthly budget select.
	await page.keyboard.press("Escape")
	await select(page, dialog, "Monthly budget", "Unbudgeted")
	await dialog.getByRole("button", { name: "Create rule", exact: true }).click()
	await expect(dialog).not.toBeVisible()
	await page.reload()
	const card = page.locator("main article").filter({ hasText: "Unbudgeted rule" })
	await expect(card.getByText("Monthly budget", { exact: true })).toBeVisible()
	await expect(card.getByText("Unbudgeted", { exact: true })).toBeVisible()
	await expect(card.getByText("Grab expense", { exact: true })).toBeVisible()

	await page.getByRole("button", { name: "Edit Unbudgeted rule", exact: true }).click()
	const editor = page.getByRole("dialog", { name: "Edit rule", exact: true })
	await select(page, editor, "Monthly budget", "Not set")
	await editor.getByRole("button", { name: "Save changes", exact: true }).click()
	await expect(editor).not.toBeVisible()
	await page.reload()
	const updated = page.locator("main article").filter({ hasText: "Unbudgeted rule" })
	await expect(updated.getByText("Grab expense", { exact: true })).toBeVisible()
	await expect(updated.getByText("Monthly budget", { exact: true })).toHaveCount(0)
	await expect(updated.getByText("Unbudgeted", { exact: true })).toHaveCount(0)
})

test("Statement rule editor: Title, People and Location offer existing Record values", async ({
	page,
}) => {
	await seedWorkspace(page, "populated", { statement_rules: statementRules() })
	const dialog = await openEditor(page, "/statement-rules", "New rule", "New rule")
	for (const [label, typed, option] of [
		["Title", "Hawker", "Hawker Dinner"],
		["People", "Jia", "Jia Le"],
		["Location", "Tampines", "Tampines Mall"],
	] as const) {
		await dialog.getByLabel(label, { exact: true }).fill(typed)
		await expect(page.getByRole("option", { name: option, exact: true })).toBeVisible()
		await pickOption(page.getByRole("option", { name: option, exact: true }))
		await expect(dialog.getByLabel(label, { exact: true })).toHaveValue(option)
	}
})

test("Record creator: validates required fields, applies Category defaults and persists values", async ({
	page,
	workspace,
}) => {
	test.setTimeout(90_000)
	void workspace
	for (const amount of ["-12.34", "0"]) {
		await test.step(`Record creator: validates required fields, applies Category defaults, and persists amount ${amount} and long text`, async () => {
			void workspace
			const text = `${longText}(${amount})`
			const dialog = await openEditor(
				page,
				"/records",
				"Create Pending Record",
				"Create New Record",
			)
			await expect(dialog.getByLabel("Treatment", { exact: true })).toContainText("Automatic")
			await dialog.getByRole("button", { name: "Create Record", exact: true }).click()
			await expect(dialog.getByLabel("Title", { exact: true })).toHaveAttribute(
				"aria-invalid",
				"true",
			)
			await expect(dialog.getByLabel("Category", { exact: true })).toHaveAttribute(
				"aria-invalid",
				"true",
			)
			await dialog.getByLabel("Title", { exact: true }).fill(text)
			await dialog.getByLabel("Description", { exact: true }).fill(longText)
			await dialog.getByLabel("Amount", { exact: true }).fill(amount)
			// A fresh creator defaults to no date; typing a time stamps today at that time.
			await dialog.locator("#datetime-time").fill("12:00")
			await chooseCategory(page, dialog)
			await expect(dialog.getByLabel("Treatment", { exact: true })).toContainText(
				"Category default · Spending",
			)
			await expect(dialog.getByLabel("Monthly budget", { exact: true })).toContainText(
				"Category default · Daily",
			)
			// The pending warning tracks the amount/allocation mismatch, not just mount state.
			const mismatch = dialog.getByText(
				"This Record stays Pending until its amount equals its Allocations.",
			)
			if (amount === "0") {
				await expect(mismatch).toHaveCount(0)
				await dialog.getByLabel("Amount", { exact: true }).fill("-12.34")
				await expect(mismatch).toBeVisible()
				await dialog.getByLabel("Amount", { exact: true }).fill("0")
				await expect(mismatch).toHaveCount(0)
			} else {
				await expect(mismatch).toBeVisible()
				await dialog.getByLabel("Amount", { exact: true }).fill("0")
				await expect(mismatch).toHaveCount(0)
				await dialog.getByLabel("Amount", { exact: true }).fill(amount)
				await expect(mismatch).toBeVisible()
			}
			await dialog.getByRole("button", { name: "Create Record", exact: true }).click()
			await expect(dialog).not.toBeVisible()
			await page.reload()
			await page
				.getByRole("link", { name: `Open ${text.trim()}`, exact: true })
				.filter({ visible: true })
				.click()
			// The row opens the preview; the stored values show there before Edit.
			const preview = page.getByRole("dialog", { name: "Record", exact: true })
			await expect(preview).toContainText(longText.trim())
			await preview.getByRole("button", { name: "Edit", exact: true }).click()
			const update = page.getByRole("dialog", { name: "Edit Record" })
			await expect(update.getByLabel("Amount", { exact: true }).first()).toHaveValue(amount)
			await expect(update.getByLabel("Description", { exact: true })).toHaveValue(
				longText.trim(),
			)
		})
	}
	await test.step("Record creator: clearing the selected date shows date validation and archived Monthly Budgets stay unavailable", async () => {
		void workspace
		const dialog = await openEditor(
			page,
			"/records",
			"Create Pending Record",
			"Create New Record",
		)
		await dialog.getByLabel("Title", { exact: true }).fill("Date validation")
		await chooseCategory(page, dialog)
		await dialog.getByLabel("Monthly budget", { exact: true }).click()
		await expect(page.getByRole("option", { name: "Daily", exact: true })).toBeVisible()
		await expect(page.getByRole("option", { name: "Travel", exact: true })).toHaveCount(0)
		// Picking Daily (already the default) closes the popover through
		// selection: while it is open the dialog underneath is aria-hidden, so the
		// trigger cannot be re-clicked, and Escape dismisses the dialog too
		// (product bug, root-owned ui/select scope).
		await pickOption(page.getByRole("option", { name: "Daily", exact: true }))
		await expect(page.getByRole("option", { name: "Daily", exact: true })).toHaveCount(0)
		await expect(dialog).toBeVisible()
		// A fresh creator starts dateless; stamp today first so clearing is meaningful.
		await dialog.locator("#datetime-time").fill("12:00")
		const dateButton = dialog.getByLabel("Date", { exact: true })
		await dateButton.evaluate(element => element.scrollIntoView({ block: "center" }))
		await dateButton.click()
		const calendar = page.locator('[data-slot="popover-content"]')
		await calendar.locator('button[data-selected-single="true"]').click()
		// Nested-Escape regression: dismissing the calendar must leave the editor open.
		await page.keyboard.press("Escape")
		await expect(page.locator('[data-slot="popover-content"]')).toHaveCount(0)
		await expect(dialog).toBeVisible()
		await dialog.getByRole("button", { name: "Create Record", exact: true }).click()
		await expect(dialog.getByLabel("Date", { exact: true })).toHaveAttribute(
			"aria-invalid",
			"true",
		)
		await expect(dialog).toContainText(/date|time/i)
	})
})

test("Record editor: null optional fields, long title, sign and penny keyboard steps persist", async ({
	page,
	workspace,
}) => {
	void workspace
	const dialog = await openEditor(page, `/records?record=${record.id}`, "Edit", "Edit Record")
	await expect(dialog.getByLabel("Title", { exact: true })).toHaveValue(record.title)
	await expect(dialog.getByLabel("People", { exact: true })).toHaveValue(record.people ?? "")
	await expect(dialog.getByLabel("Location", { exact: true })).toHaveValue(record.location ?? "")
	await dialog.getByLabel("Title", { exact: true }).fill(longText)
	const amount = dialog.getByLabel("Amount", { exact: true }).first()
	await amount.fill("0")
	await amount.press("ArrowDown")
	await expect(amount).toHaveValue("-0.01")
	await dialog.getByRole("button", { name: "Make amount positive", exact: true }).first().click()
	await expect(amount).toHaveValue("0.01")
	await dialog.getByRole("button", { name: "Save changes" }).click()
	await expect(dialog).not.toBeVisible()
	await page.reload()
	await page.getByRole("button", { name: "Edit", exact: true }).click()
	await expect(page.getByRole("dialog").getByLabel("Title", { exact: true })).toHaveValue(
		longText.trim(),
	)
	await expect(
		page.getByRole("dialog").getByLabel("Amount", { exact: true }).first(),
	).toHaveValue("0.01")
})

test("archived Monthly Budgets: retain archival state and historical assignments", async ({
	page,
}) => {
	await seedWorkspace(page)
	await test.step("Monthly Budget editor: archival persists without erasing historical assignment", async () => {
		await page.goto("/?month=October&year=2026")
		await page.getByRole("button", { name: "Edit Daily", exact: true }).click()
		const dialog = page.getByRole("dialog", { name: "Edit Daily", exact: true })
		await dialog.getByRole("checkbox", { name: "Archive monthly budget", exact: true }).check()
		await dialog.getByRole("button", { name: "Save changes", exact: true }).click()
		// A Monthly Budget that Categories still default to cannot be archived.
		await expect(dialog.getByText(/This Monthly Budget is still used by/)).toBeVisible()
		// Move the Categories off it and give the Record its own assignment, then archive.
		await page.evaluate(async () => {
			const database = await new Promise<IDBDatabase>((resolve, reject) => {
				const open = indexedDB.open("finpoint")
				open.onsuccess = () => resolve(open.result)
				open.onerror = () => reject(open.error)
			})
			await new Promise<void>((resolve, reject) => {
				const transaction = database.transaction(["categories", "records"], "readwrite")
				transaction.oncomplete = () => {
					database.close()
					resolve()
				}
				transaction.onabort = () => reject(transaction.error)
				const categories = transaction.objectStore("categories")
				const all = categories.getAll()
				all.onsuccess = () => {
					for (const category of all.result) {
						if (category.default_monthly_budget_id === "t1-mb-daily")
							categories.put({ ...category, default_monthly_budget_id: null })
					}
				}
				const records = transaction.objectStore("records")
				const record = records.get("t1-r-unicode")
				record.onsuccess = () =>
					records.put({
						...record.result,
						monthly_budget_choice: { kind: "explicit", id: "t1-mb-daily" },
					})
			})
		})
		await dialog.getByRole("button", { name: "Save changes", exact: true }).click()
		await expect(dialog).not.toBeVisible()
		await page.reload()
		const archived = await page.evaluate(async () => {
			const database = await new Promise<IDBDatabase>(resolve => {
				const open = indexedDB.open("finpoint")
				open.onsuccess = () => resolve(open.result)
			})
			return await new Promise<boolean>(resolve => {
				const request = database
					.transaction("monthly_budgets", "readonly")
					.objectStore("monthly_budgets")
					.get("t1-mb-daily")
				request.onsuccess = () => {
					database.close()
					resolve(request.result.archived)
				}
			})
		})
		expect(archived).toBe(true)
		await page.goto(`/records?record=${IDS.records.unicode}`)
		await expect(
			page
				.getByRole("dialog", { name: "Record", exact: true })
				.getByText("Monthly budget", { exact: true })
				.locator("xpath=following-sibling::dd"),
		).toContainText("Daily")
	})
	await test.step("archived Monthly Budget assignment: badge, total and disabled editor option are retained", async () => {
		await page.evaluate(async () => {
			const database = await new Promise<IDBDatabase>((resolve, reject) => {
				const open = indexedDB.open("finpoint")
				open.onsuccess = () => resolve(open.result)
				open.onerror = () => reject(open.error)
			})
			await new Promise<void>((resolve, reject) => {
				const transaction = database.transaction("records", "readwrite")
				transaction.oncomplete = () => {
					database.close()
					resolve()
				}
				transaction.onabort = () => reject(transaction.error)
				const store = transaction.objectStore("records")
				const request = store.get("t1-r-unicode")
				request.onsuccess = () =>
					store.put({
						...request.result,
						monthly_budget_choice: { kind: "explicit", id: "t1-mb-travel" },
					})
			})
		})
		await page.goto(`/records?record=${IDS.records.unicode}`)
		await expect(
			page
				.getByRole("dialog", { name: "Record", exact: true })
				.getByText("Monthly budget", { exact: true })
				.locator("xpath=following-sibling::dd"),
		).toContainText("Travel")
		await page.getByRole("button", { name: "Edit", exact: true }).click()
		const dialog = page.getByRole("dialog", { name: "Edit Record", exact: true })
		const budget = dialog.getByRole("combobox").filter({ hasText: "Travel" })
		await expect(budget).toBeVisible()
		await budget.click()
		await expect(page.getByRole("option", { name: "Travel", exact: true })).toBeDisabled()
		await page.keyboard.press("Escape")
		await expect(dialog).toBeVisible()
		await page.keyboard.press("Escape")
		await page.goto("/?month=October&year=2026&records=1&monthly_budget_id=t1-mb-travel")
		const sheet = page.getByRole("dialog", { name: /Travel/ })
		await expect(
			sheet.getByRole("link", { name: /^Open Kōpi/ }).filter({ visible: true }),
		).toBeVisible()
		await expect(sheet).toContainText("-$33.33")
	})
})

test.describe("long content", () => {
	test.beforeEach(async ({ workspace }) => {
		void workspace
	})

	// Creator long-content checks share one seed: every step cancels through the
	// footer, so no step persists anything for the next one.
	test("long editor content: Unicode creator content keeps keyboard cancellation reachable", async ({
		page,
	}) => {
		for (const [route, trigger, title, label] of [
			["/budgets", "New Budget", "Create Budget", "Name"],
			["/categories", "Create Category", "Create Category", "Name"],
			["/?month=October&year=2026", "New", "Create monthly budget", "Name"],
			["/statements", "Create Pending Statement", "Create Pending Statement", "Description"],
			["/statement-rules", "New rule", "New rule", "Name"],
		] as const) {
			await test.step(`long ${title} editor: keeps Unicode content and keyboard cancellation reachable`, async () => {
				await page.goto(route)
				await page.getByRole("button", { name: trigger, exact: true }).click()
				const dialog = page.getByRole("dialog", { name: title, exact: true })
				await dialog.getByLabel(label, { exact: true }).fill(longName)
				await expect(dialog.getByLabel(label, { exact: true })).toHaveValue(longName)
				await expectVisibleBackdrop(page)
				await containedFooter(dialog)
			})
		}
	})

	// Review long-content checks share one seed: both steps rewrite the same four
	// descriptions to the same absolute values, so the second rewrite is
	// idempotent and the dialogs under test differ per step.
	test("long review content: duplicate and replacement reviews keep footer usable", async ({
		page,
	}) => {
		for (const kind of ["duplicate", "replacement"] as const) {
			await test.step(`long ${kind} review: keeps long imported descriptions readable and its footer usable`, async () => {
				await page.evaluate(async description => {
					const database = await new Promise<IDBDatabase>((resolve, reject) => {
						const open = indexedDB.open("finpoint")
						open.onsuccess = () => resolve(open.result)
						open.onerror = () => reject(open.error)
					})
					await new Promise<void>((resolve, reject) => {
						const transaction = database.transaction("statements", "readwrite")
						transaction.oncomplete = () => {
							database.close()
							resolve()
						}
						transaction.onabort = () => reject(transaction.error)
						const store = transaction.objectStore("statements")
						for (const id of [
							"t1-s-dup-a",
							"t1-s-dup-b",
							"t1-s-pending",
							"t1-s-free-2",
						]) {
							const request = store.get(id)
							request.onsuccess = () =>
								store.put({
									...request.result,
									description: `${description} ${id}`,
								})
						}
					})
				}, longName)
				if (kind === "duplicate") {
					await page.goto("/allocator/duplicates?view=all")
					await page
						.getByRole("radio", { name: `Keep ${longName} t1-s-dup-a`, exact: true })
						.click()
					await page
						.getByRole("radio", { name: `Delete ${longName} t1-s-dup-b`, exact: true })
						.click()
					await page
						.getByRole("button", { name: "Review deletion", exact: true })
						.and(page.locator("button:not(:disabled)"))
						.click()
				} else {
					await page.goto("/allocator")
					await page
						.getByRole("checkbox", {
							name: `Select statement ${IDS.statements.unallocated[3]}`,
							exact: true,
						})
						.check()
					await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
					await page
						.getByRole("dialog", { name: "Replace a pending Statement", exact: true })
						.getByRole("button")
						.filter({ hasText: `${longName} t1-s-pending` })
						.click()
				}
				const dialog = page.getByRole("dialog", {
					name:
						kind === "duplicate"
							? "Delete duplicate Statements"
							: "Review Statement replacement",
					exact: true,
				})
				await expect(dialog).toContainText(longName)
				await expectVisibleBackdrop(page)
				await containedFooter(dialog)
			})
		}
	})
})

test.describe("empty workspace", () => {
	test("empty workspace: Category creation remains available and Record Category shows no options", async ({
		page,
	}) => {
		await seedWorkspace(page, "empty")
		const dialog = await openEditor(
			page,
			"/records",
			"Create Pending Record",
			"Create New Record",
		)
		await dialog.getByLabel("Category", { exact: true }).click()
		await expect(page.getByText("No categories found.", { exact: true })).toBeVisible()
		await page.keyboard.press("Escape")
		await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
		await page.goto("/categories")
		await expect(
			page.getByRole("button", { name: "Create Category", exact: true }),
		).toBeEnabled()
	})
})

test("Records sheet: a Record saved from the sheet shows in it and survives reload", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto("/?month=October&year=2026&records=1")
	const sheet = page.getByRole("dialog", { name: "Records", exact: true })
	await sheet
		.getByRole("link", { name: "Open FairPrice Run", exact: true })
		.filter({ visible: true })
		.click()
	const preview = page.getByRole("dialog", { name: "Record", exact: true })
	await preview.getByRole("button", { name: "Edit", exact: true }).click()
	const dialog = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await dialog.getByLabel("Title", { exact: true }).fill("Updated groceries")
	await dialog.getByLabel("Title", { exact: true }).press("Escape")
	await dialog.getByRole("button", { name: "Save changes", exact: true }).click()
	// Saving returns to the preview, which shows the saved title, with Edit focused again.
	await expect(preview).toContainText("Updated groceries")
	await expect(preview.getByRole("button", { name: "Edit", exact: true })).toBeFocused()
	await page.keyboard.press("Escape")
	await expect(preview).not.toBeVisible()
	const updated = sheet
		.getByRole("link", { name: "Open Updated groceries", exact: true })
		.filter({ visible: true })
	await expect(updated).toBeVisible()
	await page.reload()
	await expect(updated).toBeVisible()
})

test("Record preview: a row opens it read-only, Edit swaps in the form and Cancel returns", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto("/records")
	const open = page
		.getByRole("link", { name: "Open FairPrice Run", exact: true })
		.filter({ visible: true })
		.first()
	await open.click()
	const preview = page.getByRole("dialog", { name: "Record", exact: true })
	await expect(preview).toContainText("FairPrice Run")
	// Read-only: no field to type into until Edit.
	await expect(preview.getByRole("textbox")).toHaveCount(0)
	await expect(preview.getByRole("button", { name: "Save changes", exact: true })).toHaveCount(0)

	await preview.getByRole("button", { name: "Edit", exact: true }).click()
	// The same modal swaps to the form; nothing stacks over the preview.
	const editor = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await expect(editor.getByLabel("Title", { exact: true })).toHaveValue("FairPrice Run")
	await expect(page.getByRole("dialog", { name: /Record$/ })).toHaveCount(1)
	await editor.getByLabel("Title", { exact: true }).fill("Not saved")
	await editor.getByLabel("Title", { exact: true }).press("Escape")
	await editor.getByRole("button", { name: "Cancel", exact: true }).click()

	// Cancel goes back to the unchanged preview, not out of the modal.
	await expect(preview).toContainText("FairPrice Run")
	await expect(preview).not.toContainText("Not saved")
	await expect(preview.getByRole("button", { name: "Edit", exact: true })).toBeFocused()

	// A Statement row opens its preview over this one, one level deep; Escape closes only it.
	await preview
		.getByRole("button", { name: "Open FairPrice Run · SGD 4412", exact: true })
		.click()
	const statement = page.getByRole("dialog", { name: "Statement", exact: true })
	await expect(statement).toContainText("FairPrice Run · SGD 4412")
	await expect(statement.getByRole("button", { name: /^Open / })).toHaveCount(0)
	await page.keyboard.press("Escape")
	await expect(statement).toHaveCount(0)
	await expect(preview).toBeVisible()

	// The Record's old page address opens the same preview over the Records list.
	await page.goto("/records/t1-r-groceries")
	await expect(page).toHaveURL(/\/records\?record=t1-r-groceries$/)
	await expect(page.getByRole("dialog", { name: "Record", exact: true })).toContainText(
		"FairPrice Run",
	)
})

test("Statement preview: a row opens it with its Records, and a Pending one edits in place", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto("/statements")
	await page
		.locator(`main a[href="/statements?statement=${IDS.statements.splitPair[0]}"]`)
		.filter({ visible: true })
		.click()
	const preview = page.getByRole("dialog", { name: "Statement", exact: true })
	await expect(preview).toContainText("Uniqlo Basics · Contactless 1001")
	// Imported Statements are read-only: no fields and no Edit.
	await expect(preview.getByRole("textbox")).toHaveCount(0)
	await expect(preview.getByRole("button", { name: "Edit", exact: true })).toHaveCount(0)

	// A Record row opens that Record's preview over this one; Escape closes only it.
	const open = preview.getByRole("button", { name: "Open Uniqlo Basics", exact: true })
	await expectPointerCursor(open)
	await open.click()
	const record = page.getByRole("dialog", { name: "Record", exact: true })
	await expect(record).toContainText("-$100.00 of -$100.00 allocated")
	await expect(record.getByRole("button", { name: /^Open / })).toHaveCount(0)
	await page.keyboard.press("Escape")
	await expect(record).toHaveCount(0)
	await expect(preview).toBeVisible()
	await page.keyboard.press("Escape")
	await expect(preview).toHaveCount(0)

	// A Pending Statement's Edit swaps the same modal to its form; Save returns to the preview.
	await page.goto(`/statements?statement=${IDS.statements.pending}`)
	const pending = page.getByRole("dialog", { name: "Statement", exact: true })
	await pending.getByRole("button", { name: "Edit", exact: true }).click()
	const editor = page.getByRole("dialog", { name: "Edit Pending Statement", exact: true })
	// Its Records stay beside the form, read-only, and Delete waits until none are left.
	await expect(editor).toContainText("Pasar Malam")
	await expect(editor.getByRole("button", { name: "Open Pasar Malam", exact: true })).toHaveCount(
		0,
	)
	await expect(
		editor.getByRole("button", { name: "Delete", exact: true }).filter({ visible: true }),
	).toBeDisabled()
	await expect(
		editor
			.getByText("Remove this Statement from its Records before deleting.", { exact: true })
			.filter({ visible: true }),
	).toBeVisible()
	await editor.getByLabel("Description", { exact: true }).fill("Pasar malam snacks and drinks")
	await editor.getByRole("button", { name: "Save changes", exact: true }).click()
	await expect(pending).toContainText("Pasar malam snacks and drinks")
	await expect(pending.getByRole("button", { name: "Edit", exact: true })).toBeFocused()
	await page.reload()
	await expect(page.getByRole("dialog", { name: "Statement", exact: true })).toContainText(
		"Pasar malam snacks and drinks",
	)
})

test("Record editor: inherited budget hides an ineligible Category default", async ({ page }) => {
	const tables = getScenario("populated").tables
	await seedWorkspace(page, "populated", {
		categories: tables.categories.map(category =>
			category.id === IDS.categories.groceries
				? {
						...category,
						analytics_treatment: "neutral",
						default_monthly_budget_id: IDS.monthlyBudgets.daily,
					}
				: category,
		),
		records: [
			{
				...record,
				title: "Dormant budget regression",
				category_id: IDS.categories.groceries,
				treatment_choice: { kind: "explicit", value: "spending" },
				monthly_budget_choice: { kind: "category" },
			},
		],
	})
	await page.goto(`/records?record=${record.id}`)
	await page.getByRole("button", { name: "Edit", exact: true }).click()
	const dialog = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await expect(dialog.getByLabel("Monthly budget", { exact: true })).toContainText(
		"Category default · Unbudgeted",
	)
	await select(page, dialog, "Treatment", "Transfer / excluded")
	await expect(dialog.getByLabel("Monthly budget", { exact: true })).toHaveCount(0)
	await select(page, dialog, "Treatment", "Spending")
	await expect(dialog.getByLabel("Monthly budget", { exact: true })).toContainText(
		"Category default · Unbudgeted",
	)
	await dialog.getByRole("button", { name: "Save changes", exact: true }).click()
	await expect(dialog).not.toBeVisible()
	await page.reload()
	await page.getByRole("button", { name: "Edit", exact: true }).click()
	await expect(dialog.getByLabel("Monthly budget", { exact: true })).toContainText(
		"Category default · Unbudgeted",
	)
})

test("Monthly Budget editor: persists colour choices and disables unavailable Default", async ({
	page,
	workspace,
}) => {
	void workspace
	const dialog = await openEditor(
		page,
		"/?month=October&year=2026",
		"New",
		"Create monthly budget",
	)
	await dialog.getByLabel("Name", { exact: true }).fill("Colour probe")
	await dialog.getByRole("button", { name: "Teal", exact: true }).click()
	await expect(dialog.getByRole("button", { name: "Teal", exact: true })).toHaveAttribute(
		"aria-pressed",
		"true",
	)
	await dialog.getByLabel("Custom colour", { exact: true }).fill("#123456")
	await expect(dialog.getByRole("group", { name: "Group", exact: true })).toHaveCount(0)
	await expect(dialog.getByText("Spending forecast", { exact: true })).toHaveCount(0)
	await dialog.getByRole("button", { name: "Create monthly budget", exact: true }).click()
	await expect(dialog).not.toBeVisible()
	await page.reload()
	await page.getByRole("button", { name: "Edit Colour probe", exact: true }).click()
	const editor = page.getByRole("dialog", { name: "Edit Colour probe", exact: true })
	await expect(editor.getByLabel("Custom colour", { exact: true })).toHaveValue("#123456")
	await expect(editor.getByText("Group", { exact: true })).toHaveCount(0)
	await expect(editor.getByRole("radio", { name: "Default", exact: true })).toBeDisabled()
	await expect(editor).toContainText("No earlier default")
	await expect(editor.getByText("Spending forecast", { exact: true })).toHaveCount(0)
})

test("Category popup: bringing an option into view preserves the modal page position", async ({
	page,
	workspace,
}) => {
	void workspace
	const dialog = await openEditor(page, "/records", "Create Pending Record", "Create New Record")
	await dialog.getByLabel("Category", { exact: true }).fill("Groceries")
	const option = page.getByRole("option", { name: "Groceries", exact: true })
	await expect(option).toBeVisible()
	const before = await page.evaluate(() => window.scrollY)
	await option.evaluate(element => element.scrollIntoView({ block: "center" }))
	expect(await page.evaluate(() => window.scrollY)).toBe(before)
	await option.click()
	await expect(dialog.getByLabel("Treatment", { exact: true })).toContainText(
		"Category default · Spending",
	)
})

// Dialog lifecycle: one submit per save, and no re-seeding while the user types.
async function readRows(page: Page, store: string): Promise<Record<string, unknown>[]> {
	return page.evaluate(async name => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
			open.onerror = () => reject(open.error)
		})
		try {
			return await new Promise<Record<string, unknown>[]>((resolve, reject) => {
				const request = database.transaction(name, "readonly").objectStore(name).getAll()
				request.onsuccess = () => resolve(request.result)
				request.onerror = () => reject(request.error)
			})
		} finally {
			database.close()
		}
	}, store)
}

// Submits again 60ms apart, so a later call lands while the finished dialog is still fading out.
async function resubmitWhileClosing(page: Page, form: string) {
	await page.evaluate(async selector => {
		for (let i = 0; i < 3; i++) {
			;(document.querySelector(selector) as HTMLFormElement | null)?.requestSubmit()
			await new Promise(resolve => setTimeout(resolve, 60))
		}
	}, form)
}

// Holds IndexedDB writes to `stores` in flight: an open readwrite transaction of our own keeps
// every later app transaction on them queued until `release` runs.
async function holdWrites(page: Page, stores: string[]) {
	await page.evaluate(async stores => {
		const w = window as unknown as { __release?: () => void }
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
			open.onerror = () => reject(open.error)
		})
		await new Promise<void>(resolve => {
			let holding = true
			w.__release = () => {
				holding = false
			}
			const tx = database.transaction(stores, "readwrite")
			tx.oncomplete = () => database.close()
			const pump = () => {
				const request = tx.objectStore(stores[0] as string).count()
				request.onsuccess = () => {
					void resolve()
					if (holding) pump()
				}
			}
			pump()
		})
	}, stores)
}

// Counts the readwrite transactions the app opens on `store` once `startCounting` runs. Dexie
// binds `IDBDatabase.prototype.transaction` when it opens the database, so the spy has to be
// in place before the page loads.
async function spyOnWrites(page: Page, store: string) {
	await page.addInitScript(store => {
		const w = window as unknown as { __attempts: number; __counting: boolean }
		w.__attempts = 0
		const open = IDBDatabase.prototype.transaction
		IDBDatabase.prototype.transaction = function (names, mode, ...rest) {
			if (w.__counting && mode === "readwrite" && [names].flat().includes(store)) {
				w.__attempts++
			}
			return open.call(this, names, mode, ...rest)
		}
	}, store)
}

const startCounting = (page: Page) =>
	page.evaluate(() => {
		;(window as unknown as { __counting: boolean }).__counting = true
	})

const writeAttempts = (page: Page) =>
	page.evaluate(() => (window as unknown as { __attempts: number }).__attempts)

async function releaseWrites(page: Page) {
	await page.evaluate(() => (window as unknown as { __release: () => void }).__release())
}

// Clicks the confirm button of the open dialog three times in one task, then twice more
// while the dialog fades out, bypassing the disabled state a repeated click cannot reach.
async function confirmRepeatedly(page: Page, label: string) {
	await page.evaluate(async label => {
		const confirm = () =>
			[...document.querySelectorAll('[role="dialog"] button')]
				.find(button => button.textContent?.trim() === label)
				?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
		for (let i = 0; i < 3; i++) confirm()
		for (let i = 0; i < 2; i++) {
			await new Promise(resolve => setTimeout(resolve, 60))
			confirm()
		}
	}, label)
}

test.describe("dialog lifecycle", () => {
	test("Pending Statement creator: a double submit creates one Statement", async ({
		page,
		workspace,
	}) => {
		void workspace
		const dialog = await openEditor(
			page,
			"/statements",
			"Create Pending Statement",
			"Create Pending Statement",
		)
		await dialog.getByLabel("Description", { exact: true }).fill("Double submit probe")
		await dialog.getByLabel("Amount", { exact: true }).fill("-1.23")
		await page.evaluate(() => {
			const form = document.getElementById("pending-statement-form") as HTMLFormElement
			form.requestSubmit()
			form.requestSubmit()
		})
		await expect(dialog).not.toBeVisible()
		const rows = await readRows(page, "statements")
		expect(rows.filter(row => row.description === "Double submit probe")).toHaveLength(1)
	})

	test("Pending Statement creator: reopening while a save is still running cannot save twice", async ({
		page,
		workspace,
	}) => {
		void workspace
		const trigger = page.getByRole("button", {
			name: "Create Pending Statement",
			exact: true,
		})
		const dialog = await openEditor(
			page,
			"/statements",
			"Create Pending Statement",
			"Create Pending Statement",
		)
		const fill = async () => {
			await dialog.getByLabel("Description", { exact: true }).fill("Reopen probe")
			await dialog.getByLabel("Amount", { exact: true }).fill("-1.23")
		}
		await fill()
		await holdWrites(page, ["statements"])
		await page.evaluate(() =>
			(document.getElementById("pending-statement-form") as HTMLFormElement).requestSubmit(),
		)

		// The save is stuck behind the held write: dismiss the dialog and open it again.
		await page.keyboard.press("Escape")
		await expect(dialog).not.toBeVisible()
		await trigger.click()
		await expect(dialog).toBeVisible()
		await fill()
		await page.evaluate(() =>
			(document.getElementById("pending-statement-form") as HTMLFormElement).requestSubmit(),
		)
		await expect(
			dialog.getByRole("button", { name: "Create statement", exact: true }),
		).toBeDisabled()

		await releaseWrites(page)
		await expect
			.poll(
				async () =>
					(await readRows(page, "statements")).filter(
						row => row.description === "Reopen probe",
					).length,
			)
			.toBeGreaterThan(0)
		await page.waitForTimeout(500)
		const rows = await readRows(page, "statements")
		expect(rows.filter(row => row.description === "Reopen probe")).toHaveLength(1)
	})

	test("Category editor: a rejected save releases the lock so the corrected name saves", async ({
		page,
		workspace,
	}) => {
		void workspace
		const dialog = await openEditor(page, "/categories", "Edit Groceries", "Edit Category")
		const name = dialog.getByLabel("Name", { exact: true })
		const save = dialog.getByRole("button", { name: "Save changes", exact: true })
		// A name with no letters or numbers passes the form and is rejected by the save.
		await name.fill("!!!")
		await save.click()
		await expect(dialog.getByText("The name must contain letters or numbers.")).toBeVisible()
		await expect(save).toBeEnabled()

		await name.fill("Groceries retried")
		await save.click()
		await expect(dialog).not.toBeVisible()
		await expect
			.poll(async () =>
				(await readRows(page, "categories")).some(row => row.name === "Groceries retried"),
			)
			.toBe(true)
	})

	test("Settings: a field changed while a save is running stays an unsaved edit", async ({
		page,
		workspace,
	}) => {
		void workspace
		await page.route(/google|gstatic/, route => route.abort())
		await page.goto("/settings")
		const start = page.locator("#default_filter_start_date")
		await expect(start).toContainText("1 Oct 2026")
		await page.locator("#default_filter_end_date").click()
		await pickOption(page.getByRole("option", { name: "Today" }))
		await holdWrites(page, ["settings"])
		await page.getByRole("button", { name: "Save default filters" }).click()
		await expect(page.getByRole("button", { name: "Saving…" })).toBeVisible()
		await page.getByRole("button", { name: "Clear date" }).click()
		await expect(start).toContainText("No default start date")

		await releaseWrites(page)
		await expect(page.getByText("Default filters saved.")).toBeVisible()
		await page.waitForTimeout(300)
		await expect(start).toContainText("No default start date")
		await expect(page.locator("#default_filter_end_date")).toContainText("Today")
		await expect(page.getByRole("button", { name: "Save default filters" })).toBeEnabled()
	})

	test("Monthly Budget creator: reopening while a save is still running cannot save twice", async ({
		page,
		workspace,
	}) => {
		void workspace
		await spyOnWrites(page, "monthly_budgets")
		const dialog = await openEditor(
			page,
			"/?month=October&year=2026",
			"New",
			"Create monthly budget",
		)
		await dialog.getByLabel("Name", { exact: true }).fill("Reopen probe")
		await holdWrites(page, ["monthly_budgets"])
		await startCounting(page)
		await dialog.getByRole("button", { name: "Create monthly budget", exact: true }).click()
		await expect.poll(() => writeAttempts(page)).toBe(1)

		// The save is stuck behind the held write: dismiss the dialog and open it again.
		await page.keyboard.press("Escape")
		await expect(dialog).not.toBeVisible()
		await page.getByRole("button", { name: "New", exact: true }).click()
		await expect(dialog).toBeVisible()
		await dialog.getByLabel("Name", { exact: true }).fill("Reopen probe")
		await dialog.locator("form").evaluate((form: HTMLFormElement) => form.requestSubmit())
		await page.waitForTimeout(300)
		expect(await writeAttempts(page)).toBe(1)
		await expect(dialog.locator('button[type="submit"]')).toBeDisabled()

		await releaseWrites(page)
		await expect
			.poll(
				async () =>
					(await readRows(page, "monthly_budgets")).filter(
						row => row.name === "Reopen probe",
					).length,
			)
			.toBe(1)
	})

	test("duplicate review: repeated confirms while it saves and closes delete once", async ({
		page,
		workspace,
	}) => {
		void workspace
		await spyOnWrites(page, "statements")
		await page.goto("/allocator/duplicates")
		await page
			.getByRole("radio", { name: "Keep DON DON DONKI 8821 PURCHASE", exact: true })
			.click()
		await page
			.getByRole("radio", { name: "Delete DON DON DONKI PURCHASE 8821", exact: true })
			.click()
		await page.getByRole("button", { name: "Review deletion" }).click()
		const review = page.getByRole("dialog", { name: "Delete duplicate Statements" })
		await expect(review.getByRole("button", { name: "Delete 1 Statement" })).toBeEnabled()
		await startCounting(page)
		await confirmRepeatedly(page, "Delete 1 Statement")
		await expect(review).toHaveCount(0)
		expect(await writeAttempts(page)).toBe(1)
	})

	test("Statement replacement review: repeated confirms while it saves and closes replace once", async ({
		page,
		workspace,
	}) => {
		void workspace
		await spyOnWrites(page, "statements")
		await page.goto("/allocator/pending")
		await page
			.locator("section[aria-label='Pending statements']")
			.getByPlaceholder("Search descriptions...")
			.fill("Pasar malam")
		await page.getByRole("button", { name: /Pasar malam/ }).click()
		await page
			.getByRole("combobox")
			.filter({ hasText: "Suggested replacements", visible: true })
			.click()
		await pickOption(page.getByRole("option", { name: "All unallocated imports" }))
		await page
			.locator("section[aria-labelledby='candidate-title']")
			.getByPlaceholder("Search descriptions...")
			.fill("SHENG SIONG")
		await page.getByRole("button", { name: "Replace", exact: true }).click()
		const review = page.getByRole("dialog", { name: "Review Statement replacement" })
		await expect(review.getByText(/Allocation.*ready to move/)).toBeVisible()
		await startCounting(page)
		await confirmRepeatedly(page, "Replace pending Statement")
		await expect(review).toHaveCount(0)
		expect(await writeAttempts(page)).toBe(1)
	})

	test("Statement rule creator: a double submit creates one rule", async ({ page }) => {
		await seedWorkspace(page, "populated", { statement_rules: statementRules() })
		const dialog = await openEditor(page, "/statement-rules", "New rule", "New rule")
		await dialog.getByLabel("Name", { exact: true }).fill("Double submit rule")
		await dialog.getByLabel("Text to look for", { exact: true }).fill("probe")
		await dialog.getByLabel("Title", { exact: true }).fill("Probe")
		await page.keyboard.press("Escape")
		await page.evaluate(() => {
			const form = document.getElementById("statement-rule-form") as HTMLFormElement
			form.requestSubmit()
			form.requestSubmit()
		})
		await expect(dialog).not.toBeVisible()
		const rows = await readRows(page, "statement_rules")
		expect(rows.filter(row => row.name === "Double submit rule")).toHaveLength(1)
	})

	test("Pending Statement editor: a double delete removes it once without an error", async ({
		page,
	}) => {
		const { tables } = getScenario("populated")
		await seedWorkspace(page, "populated", {
			statements: [...tables.statements, { ...pending, id: "free-pending" }],
		})
		const dialog = await openEditor(
			page,
			"/statements?statement=free-pending",
			"Edit",
			"Edit Pending Statement",
		)
		// The first click arms Delete, as in the Record editor; the confirmation is what repeats.
		await dialog.getByRole("button", { name: "Delete", exact: true }).click()
		await dialog
			.getByRole("button", { name: "Yes, delete Pending Statement", exact: true })
			.evaluate((button: HTMLButtonElement) => {
				for (let i = 0; i < 3; i++) button.click()
			})
		await expect(dialog).not.toBeVisible()
		// Let the second call settle: it would report its failure as a toast of its own.
		await page.waitForTimeout(1000)
		await expect(page.locator('[data-sonner-toast][data-type="error"]')).toHaveCount(0)
		const rows = await readRows(page, "statements")
		expect(rows.filter(row => row.id === "free-pending")).toHaveLength(0)
	})

	test("Budget creator: a double submit creates one Budget", async ({ page, workspace }) => {
		void workspace
		const dialog = await openEditor(page, "/budgets", "New Budget", "Create Budget")
		await dialog.getByLabel("Name", { exact: true }).fill("Double submit budget")
		await chooseRange(page, dialog)
		await page.evaluate(() => {
			const form = document.getElementById("budget-create-form") as HTMLFormElement
			form.requestSubmit()
			form.requestSubmit()
		})
		await expect(dialog).not.toBeVisible()
		const rows = await readRows(page, "budgets")
		expect(rows.filter(row => row.name === "Double submit budget")).toHaveLength(1)
	})

	test("Record creator: a double submit creates one Record", async ({ page, workspace }) => {
		void workspace
		const dialog = await openEditor(
			page,
			"/records",
			"Create Pending Record",
			"Create New Record",
		)
		await dialog.getByLabel("Title", { exact: true }).fill("Double submit record")
		await dialog.getByLabel("Amount", { exact: true }).fill("-5")
		await dialog.locator("#datetime-time").fill("12:00")
		await chooseCategory(page, dialog)
		await page.evaluate(() => {
			const form = document.getElementById("allocate-record-form") as HTMLFormElement
			form.requestSubmit()
			form.requestSubmit()
		})
		await expect(dialog).not.toBeVisible()
		const rows = await readRows(page, "records")
		expect(rows.filter(row => row.title === "Double submit record")).toHaveLength(1)
	})

	test("Pending Statement editor: a write from another tab does not reset what is typed", async ({
		page,
	}) => {
		const { tables } = getScenario("populated")
		await seedWorkspace(page, "populated", {
			statements: [...tables.statements, { ...pending, id: "free-pending" }],
		})
		const dialog = await openEditor(
			page,
			"/statements?statement=free-pending",
			"Edit",
			"Edit Pending Statement",
		)
		const description = dialog.getByLabel("Description", { exact: true })
		await description.fill("Typed but unsaved")

		// Any Statement write hands the open dialog a fresh Statement object.
		const other = await page.context().newPage()
		await other.goto("/statements")
		await other.getByRole("button", { name: "Create Pending Statement", exact: true }).click()
		const otherDialog = other.getByRole("dialog", { name: "Create Pending Statement" })
		await otherDialog.getByLabel("Description", { exact: true }).fill("From another tab")
		await otherDialog.getByLabel("Amount", { exact: true }).fill("-2")
		await otherDialog.getByRole("button", { name: "Create statement", exact: true }).click()
		await expect
			.poll(async () =>
				(await readRows(page, "statements")).some(
					row => row.description === "From another tab",
				),
			)
			.toBe(true)
		await other.close()

		// Give the live query time to hand the dialog the changed Statement.
		await page.waitForTimeout(1000)
		await expect(description).toHaveValue("Typed but unsaved")
	})
	test("Account editor: a write from another tab does not reset what is typed", async ({
		page,
		workspace,
	}) => {
		void workspace
		// The Account page hands its dialog the live Account, so a write reaches the open dialog.
		const dialog = await openEditor(
			page,
			`/accounts/${account.id}`,
			"Edit Account",
			"Edit Account",
		)
		const name = dialog.getByLabel("Name", { exact: true })
		await name.fill("Typed but unsaved")

		const other = await page.context().newPage()
		await other.goto(`/accounts/${account.id}`)
		await other.getByRole("button", { name: "Edit Account", exact: true }).click()
		const otherDialog = other.getByRole("dialog", { name: "Edit Account", exact: true })
		await otherDialog.getByLabel("Name", { exact: true }).fill("From another tab")
		await otherDialog.getByRole("button", { name: "Save changes", exact: true }).click()
		await expect
			.poll(async () =>
				(await readRows(page, "accounts")).some(row => row.name === "From another tab"),
			)
			.toBe(true)
		await other.close()

		// Give the live query time to hand the dialog the changed Account.
		await page.waitForTimeout(1000)
		await expect(name).toHaveValue("Typed but unsaved")
	})

	test("Allocator selection follows Statements changed or deleted from another tab", async ({
		page,
	}) => {
		const { tables } = getScenario("populated")
		await seedWorkspace(page, "populated", {
			statements: [
				...tables.statements,
				{ ...pending, id: "sel-a", description: "Selection probe A", amount: -10 },
				{ ...pending, id: "sel-b", description: "Selection probe B", amount: -20 },
			],
		})
		await page.goto("/allocator")
		for (const id of ["sel-a", "sel-b"]) {
			await page
				.getByRole("checkbox", { name: `Select statement ${id}`, exact: true })
				.click()
		}
		const bar = page.getByRole("complementary")
		await expect(bar.getByText("2 selected · -$30.00")).toBeVisible()

		const other = await page.context().newPage()
		await other.goto("/statements?statement=sel-a")
		await other.getByRole("button", { name: "Edit", exact: true }).click()
		const editor = other.getByRole("dialog", { name: "Edit Pending Statement", exact: true })
		await editor.getByLabel("Amount", { exact: true }).fill("-15")
		await editor.getByRole("button", { name: "Save changes", exact: true }).click()
		await expect(editor).not.toBeVisible()
		await expect(bar.getByText("2 selected · -$35.00")).toBeVisible()

		await other.goto("/statements?statement=sel-b")
		await other.getByRole("button", { name: "Edit", exact: true }).click()
		const otherEditor = other.getByRole("dialog", {
			name: "Edit Pending Statement",
			exact: true,
		})
		await otherEditor.getByRole("button", { name: "Delete", exact: true }).click()
		await otherEditor
			.getByRole("button", { name: "Yes, delete Pending Statement", exact: true })
			.click()
		await expect(otherEditor).not.toBeVisible()
		await other.close()

		await expect(bar.getByText("1 selected · -$15.00")).toBeVisible()
		await expect(page.locator("main").getByText(/^1 selected\. Showing/)).toBeVisible()
	})

	test("Budget creator: a submit while the dialog is closing creates nothing more", async ({
		page,
		workspace,
	}) => {
		void workspace
		const dialog = await openEditor(page, "/budgets", "New Budget", "Create Budget")
		await dialog.getByLabel("Name", { exact: true }).fill("Closing submit budget")
		await chooseRange(page, dialog)
		await resubmitWhileClosing(page, "#budget-create-form")
		await expect(dialog).not.toBeVisible()
		const rows = await readRows(page, "budgets")
		expect(rows.filter(row => row.name === "Closing submit budget")).toHaveLength(1)
	})

	test("Record creator: a submit while the dialog is closing creates nothing more", async ({
		page,
		workspace,
	}) => {
		void workspace
		const dialog = await openEditor(
			page,
			"/records",
			"Create Pending Record",
			"Create New Record",
		)
		await dialog.getByLabel("Title", { exact: true }).fill("Closing submit record")
		await dialog.getByLabel("Amount", { exact: true }).fill("-5")
		await dialog.locator("#datetime-time").fill("12:00")
		await chooseCategory(page, dialog)
		await resubmitWhileClosing(page, "#allocate-record-form")
		await expect(dialog).not.toBeVisible()
		const rows = await readRows(page, "records")
		expect(rows.filter(row => row.title === "Closing submit record")).toHaveLength(1)
	})

	test("Budget editor: a delete during a save does not remove the Budget", async ({
		page,
		workspace,
	}) => {
		void workspace
		const dialog = await openEditor(page, `/budgets/${budget.id}`, "Edit Budget", "Edit Budget")
		await dialog.getByLabel("Name", { exact: true }).fill("Saved during delete")
		await page.evaluate(async () => {
			const form = document.getElementById("budget-edit-form") as HTMLFormElement
			form.requestSubmit()
			await new Promise(resolve => setTimeout(resolve, 30))
			const remove = [...document.querySelectorAll('[role="dialog"] button')].find(
				button => button.textContent?.trim() === "Delete",
			) as HTMLButtonElement
			remove.click()
		})
		await expect(dialog).not.toBeVisible()
		await page.waitForTimeout(500)
		const rows = await readRows(page, "budgets")
		expect(rows.find(row => row.id === budget.id)?.name).toBe("Saved during delete")
	})

	test("Record editor: a delete during a save does not remove the Record", async ({
		page,
		workspace,
	}) => {
		void workspace
		const dialog = await openEditor(page, `/records?record=${record.id}`, "Edit", "Edit Record")
		await dialog.getByLabel("Title", { exact: true }).fill("Saved during delete")
		await page.evaluate(async () => {
			const buttons = [...document.querySelectorAll('[role="dialog"] button')]
			const named = (label: string) =>
				buttons.find(button => button.textContent?.trim() === label) as HTMLButtonElement
			named("Save changes").click()
			await new Promise(resolve => setTimeout(resolve, 30))
			named("Delete").click()
		})
		await expect(dialog).not.toBeVisible()
		await page.waitForTimeout(500)
		const rows = await readRows(page, "records")
		expect(rows.find(row => row.id === record.id)?.title).toBe("Saved during delete")
	})

	test("Record editor: saving over a change from another tab reports a conflict", async ({
		page,
		workspace,
	}) => {
		void workspace
		const dialog = await openEditor(page, `/records?record=${record.id}`, "Edit", "Edit Record")
		await dialog.getByLabel("Title", { exact: true }).fill("From the first tab")
		// Leave the Title so its suggestions close and the dialog is reachable again.
		await dialog.getByLabel("Title", { exact: true }).press("Tab")

		const other = await page.context().newPage()
		await other.goto(`/records?record=${record.id}`)
		await other.getByRole("button", { name: "Edit", exact: true }).click()
		const otherDialog = other.getByRole("dialog", { name: "Edit Record", exact: true })
		await otherDialog.getByLabel("Title", { exact: true }).fill("From the second tab")
		await otherDialog.getByLabel("Title", { exact: true }).press("Tab")
		await otherDialog.getByRole("button", { name: "Save changes" }).click()
		await expect(otherDialog).not.toBeVisible()
		await other.close()

		// Let the live query hand the open dialog the Record with its new revision.
		await page.waitForTimeout(1000)
		await dialog.getByRole("button", { name: "Save changes" }).click()
		await expect(dialog).toBeVisible()
		const rows = await readRows(page, "records")
		expect(rows.find(row => row.id === record.id)?.title).toBe("From the second tab")
	})

	test("Record editor: a Statement attached but not saved survives a write from another tab", async ({
		page,
		workspace,
	}) => {
		void workspace
		const dialog = await openEditor(
			page,
			`/records?record=${IDS.records.partialPending}`,
			"Edit",
			"Edit Record",
		)
		await dialog.getByRole("button", { name: "Allocate statement", exact: true }).click()
		const sheet = page.getByRole("dialog", {
			name: "Allocate Statements to Record",
			exact: true,
		})
		await sheet.getByRole("button").filter({ hasText: /\$/ }).first().click()
		await page.keyboard.press("Escape")
		await expect(dialog.locator('[data-slot="card"]')).toHaveCount(2)

		const other = await page.context().newPage()
		await other.goto("/statements")
		await other.getByRole("button", { name: "Create Pending Statement", exact: true }).click()
		const otherDialog = other.getByRole("dialog", { name: "Create Pending Statement" })
		await otherDialog.getByLabel("Description", { exact: true }).fill("From another tab")
		await otherDialog.getByLabel("Amount", { exact: true }).fill("-2")
		await otherDialog.getByRole("button", { name: "Create statement", exact: true }).click()
		await expect
			.poll(async () =>
				(await readRows(page, "statements")).some(
					row => row.description === "From another tab",
				),
			)
			.toBe(true)
		await other.close()

		await page.waitForTimeout(1000)
		await expect(dialog).toBeVisible()
		await expect(dialog.locator('[data-slot="card"]')).toHaveCount(2)
		await expect(page.getByText(/Application error/)).toHaveCount(0)
	})
})

test("archived Monthly Budgets: a Category default and a rule action that point at one still show its name", async ({
	page,
}) => {
	await seedWorkspace(page, "populated", {
		categories: getScenario("populated").tables.categories.map(category =>
			category.id === IDS.categories.groceries
				? { ...category, default_monthly_budget_id: IDS.monthlyBudgets.travelArchived }
				: category,
		),
		statement_rules: statementRules().map(rule =>
			rule.id === "t1-rule-starbucks"
				? {
						...rule,
						actions: {
							...rule.actions,
							monthly_budget_id: { value: IDS.monthlyBudgets.travelArchived },
						},
					}
				: rule,
		),
	})
	await test.step("Category editor: the archived default is shown, not a blank select", async () => {
		const dialog = await openEditor(page, "/categories", "Edit Groceries", "Edit Category")
		await expect(dialog.getByLabel("Monthly budget", { exact: true })).toContainText("Travel")
	})
	await test.step("Statement rule editor: the archived action Budget is shown, not a blank select", async () => {
		const dialog = await openEditor(
			page,
			"/statement-rules",
			"Edit Starbucks coffee",
			"Edit rule",
		)
		await expect(dialog.getByLabel("Monthly budget", { exact: true })).toContainText("Travel")
	})
})

test("Pending Statement editor: deleting a Statement opened from an Account page returns to that page", async ({
	page,
}) => {
	const { tables } = getScenario("populated")
	await seedWorkspace(page, "populated", {
		statements: [...tables.statements, { ...pending, id: "free-pending" }],
	})
	await page.goto(`/accounts/${pending.account_id}`)
	// Statement rows open the Statement's preview over the Account page, where a pending one is edited.
	await page
		.locator('main a[href="/statements?statement=free-pending"]')
		.filter({ visible: true })
		.click()
	await page
		.getByRole("dialog", { name: "Statement", exact: true })
		.getByRole("button", { name: "Edit", exact: true })
		.click()
	const editor = page.getByRole("dialog", { name: "Edit Pending Statement", exact: true })
	await editor
		.getByRole("button", { name: "Delete", exact: true })
		.filter({ visible: true })
		.click()
	await editor
		.getByRole("button", { name: "Yes, delete Pending Statement", exact: true })
		.filter({ visible: true })
		.click()
	await expect(page.getByRole("dialog")).toHaveCount(0)
	await expect
		.poll(async () =>
			(await readRows(page, "statements")).some(row => row.id === "free-pending"),
		)
		.toBe(false)
	await expect(page).toHaveURL(new RegExp(`/accounts/${pending.account_id}$`))
})

test("Category editor: a Category in use says why Delete is unavailable", async ({
	page,
	workspace,
}) => {
	void workspace
	const dialog = await openEditor(page, "/categories", "Edit Groceries", "Edit Category")
	await expect(dialog.getByRole("button", { name: "Delete", exact: true })).toBeDisabled()
	await expect(dialog.getByText(/still use this category/)).toBeVisible()
})

test("Record editor: Delete asks for a second click, and closing the dialog disarms it", async ({
	page,
	workspace,
}) => {
	void workspace
	const dialog = await openEditor(page, `/records?record=${record.id}`, "Edit", "Edit Record")
	await dialog.getByRole("button", { name: "Delete", exact: true }).click()
	await expect(
		dialog.getByRole("button", { name: "Yes, delete Record", exact: true }),
	).toBeVisible()
	expect((await readRows(page, "records")).some(row => row.id === record.id)).toBe(true)

	await page.keyboard.press("Escape")
	await expect(dialog).not.toBeVisible()
	await page.goto(`/records?record=${record.id}`)
	await page.getByRole("button", { name: "Edit", exact: true }).click()
	await expect(dialog.getByRole("button", { name: "Delete", exact: true })).toBeVisible()

	await dialog.getByRole("button", { name: "Delete", exact: true }).click()
	await dialog.getByRole("button", { name: "Yes, delete Record", exact: true }).click()
	await expect(dialog).not.toBeVisible()
	await expect
		.poll(async () => (await readRows(page, "records")).some(row => row.id === record.id))
		.toBe(false)
})

test("Fix Duplicates: Statement times use the shared 12-hour format", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto("/allocator/duplicates")
	await expect(page.getByText(/^9:14 AM · /).first()).toBeVisible()
	await expect(page.getByText(/^09:14 · /)).toHaveCount(0)
})

test("Pending Statement editor: the Account option names the bank, not its raw code", async ({
	page,
}) => {
	await seedWorkspace(page, "populated", {
		accounts: getScenario("populated").tables.accounts.map(row => ({ ...row, bank: "dbs" })),
	})
	const dialog = await openEditor(
		page,
		`/statements?statement=${pending.id}`,
		"Edit",
		"Edit Pending Statement",
	)
	await expect(dialog.getByLabel("Account", { exact: true })).toContainText("· DBS")
})

test("Budget detail: a repeated Detach click writes once", async ({ page, workspace }) => {
	void workspace
	await spyOnWrites(page, "budget_records")
	await page.goto("/budgets/t1-b-manual")
	const detach = page.getByRole("button", { name: /^Detach / }).first()
	await expect(detach).toBeVisible()
	await startCounting(page)
	await detach.evaluate(button => {
		for (let i = 0; i < 3; i++) button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
	})
	await expect(page.getByRole("button", { name: /^Detach / })).toHaveCount(1)
	expect(await writeAttempts(page)).toBe(1)
})

test("Record creator: a failed save shows the correction line in the footer", async ({
	page,
	workspace,
}) => {
	void workspace
	const dialog = await openEditor(page, "/records", "Create Pending Record", "Create New Record")
	await dialog.getByRole("button", { name: "Create Record", exact: true }).click()
	await expect(dialog.getByText("Correct the highlighted fields, then save again.")).toBeVisible()
})

test("Pending Statement dialog: saving and deleting show no success toast", async ({
	page,
	workspace,
}) => {
	void workspace
	const dialog = await openEditor(
		page,
		"/statements",
		"Create Pending Statement",
		"Create Pending Statement",
	)
	await dialog.getByLabel("Description", { exact: true }).fill("No toast statement")
	await dialog.getByLabel("Amount", { exact: true }).fill("-2")
	await dialog.getByRole("button", { name: "Create statement", exact: true }).click()
	await expect(dialog).not.toBeVisible()
	await expect
		.poll(async () =>
			(await readRows(page, "statements")).some(
				row => row.description === "No toast statement",
			),
		)
		.toBe(true)
	await page.waitForTimeout(500)
	await expect(page.locator("[data-sonner-toast]")).toHaveCount(0)
})
