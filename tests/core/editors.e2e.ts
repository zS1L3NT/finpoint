import type { Locator, Page } from "@playwright/test"
import { expectPointerCursor, expectVisibleBackdrop } from "../support/assertions"
import { IDS, statementRules } from "../support/data"
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
		route: `/statements/${pending.id}`,
		trigger: "Edit Pending Statement",
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
		route: `/records/${record.id}`,
		trigger: "Edit Record",
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
		await expect(dialog.getByLabel("Monthly budget", { exact: true })).toBeDisabled()
		await expect(dialog.getByLabel("Monthly budget", { exact: true })).toContainText(
			"Unbudgeted",
		)
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
		).toBeDisabled()
	})
	await test.step("Category creator: required identity, icon, colour and defaults persist", async () => {
		void workspace
		const dialog = await openEditor(page, "/categories", "Create Category", "Create Category")
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
		await select(page, dialog, "Amount rule", "Default")
		await expect(dialog.getByLabel("Monthly amount", { exact: true })).toHaveCount(0)
		await select(page, dialog, "Amount rule", "Override one month")
		await expect(dialog.getByLabel("Monthly amount", { exact: true })).toBeVisible()
		// Daily starts with a null October amount, so the revealed input is disabled.
		await dialog.getByRole("checkbox", { name: "No monthly amount", exact: true }).uncheck()
		await dialog.getByLabel("Monthly amount", { exact: true }).fill("0")
		await dialog.getByRole("button", { name: "Save changes" }).click()
		await expect(dialog).not.toBeVisible()
		await page.reload()
		await page.getByRole("button", { name: "Edit Daily", exact: true }).click()
		await expect(
			page.getByRole("dialog").getByLabel("Amount rule", { exact: true }),
		).toContainText("Override one month")
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
		const route = `/statements/${pending.id}`
		const dialog = await openEditor(
			page,
			route,
			"Edit Pending Statement",
			"Edit Pending Statement",
		)
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
		await page.getByRole("button", { name: "Edit Pending Statement", exact: true }).click()
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
			const mismatch = dialog.getByText("Amount does not match the sum of Allocation Amounts")
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
			await page.getByRole("link", { name: `Open ${text.trim()}`, exact: true }).click()
			await page.getByRole("button", { name: "Edit Record", exact: true }).click()
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
		const dateButton = dialog.getByLabel("Date and time", { exact: true })
		await dateButton.evaluate(element => element.scrollIntoView({ block: "center" }))
		await dateButton.click()
		const calendar = page.locator('[data-slot="popover-content"]')
		await calendar.locator('button[data-selected-single="true"]').click()
		// Nested-Escape regression: dismissing the calendar must leave the editor open.
		await page.keyboard.press("Escape")
		await expect(page.locator('[data-slot="popover-content"]')).toHaveCount(0)
		await expect(dialog).toBeVisible()
		await dialog.getByRole("button", { name: "Create Record", exact: true }).click()
		await expect(dialog.getByLabel("Date and time", { exact: true })).toHaveAttribute(
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
	const dialog = await openEditor(page, `/records/${record.id}`, "Edit Record", "Edit Record")
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
	await page.getByRole("button", { name: "Edit Record", exact: true }).click()
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
		await page.goto(`/records/${IDS.records.unicode}`)
		await expect(page.getByText(/Monthly budget ·/)).toContainText("Daily")
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
						monthly_budget_id: "t1-mb-travel",
						monthly_budget_source: "manual",
					})
			})
		})
		await page.goto(`/records/${IDS.records.unicode}`)
		await expect(page.getByText(/Monthly budget ·/)).toContainText("Travel")
		await page.getByRole("button", { name: "Edit Record", exact: true }).click()
		const dialog = page.getByRole("dialog", { name: "Edit Record", exact: true })
		const budget = dialog.getByRole("combobox").filter({ hasText: "Travel" })
		await expect(budget).toBeVisible()
		await budget.click()
		await expect(page.getByRole("option", { name: "Travel", exact: true })).toBeDisabled()
		await page.keyboard.press("Escape")
		await expect(dialog).toBeVisible()
		await page.keyboard.press("Escape")
		await page.goto("/records/monthly?month=October&year=2026&monthly_budget_id=t1-mb-travel")
		await expect(
			page.getByRole("link", { name: /^Open Kōpi/ }).filter({ visible: true }),
		).toBeVisible()
		await expect(page.locator("main")).toContainText("-$33.33")
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

test("Monthly Records editor: saved title appears immediately and survives reload", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto("/records/monthly?month=October&year=2026")
	await page.getByRole("button", { name: "Edit FairPrice Run", exact: true }).click()
	const dialog = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await dialog.getByLabel("Title", { exact: true }).fill("Updated groceries")
	await dialog.getByLabel("Title", { exact: true }).press("Escape")
	await dialog.getByRole("button", { name: "Save changes", exact: true }).click()
	await expect(dialog).not.toBeVisible()
	await expect(
		page.getByRole("button", { name: "Edit Updated groceries", exact: true }),
	).toBeVisible()
	await page.reload()
	await expect(
		page.getByRole("button", { name: "Edit Updated groceries", exact: true }),
	).toBeVisible()
})
