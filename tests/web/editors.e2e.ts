import type { Locator, Page } from "@playwright/test"
import {
	expectPointerCursor,
	expectPopupEntrance,
	expectVisibleBackdrop,
	sampleVisibleRowAnimations,
} from "./support/assertions"
import { getScenario, IDS } from "./support/data"
import { expect, seedWorkspace, test } from "./support/fixtures"

const data = getScenario("populated").tables
function fixtureRow<T extends { id: string }>(rows: T[], id: string): T {
	const row = rows.find(row => row.id === id)
	if (!row) throw new Error(`Missing editor fixture ${id}`)
	return row
}

const account = fixtureRow(data.accounts, IDS.accounts.dbs)
const budget = fixtureRow(data.budgets, IDS.budgets.manual)
const record = fixtureRow(data.records, IDS.records.nulls)
const pending = fixtureRow(data.statements, IDS.statements.pending)
const kept = fixtureRow(data.statements, IDS.statements.duplicatePair[0])
const deleted = fixtureRow(data.statements, IDS.statements.duplicatePair[1])
const imported = fixtureRow(data.statements, "t1-s-free-2")
const longText = "Editor café 日本語 — ".repeat(12)

// Each opening is its own step in the shared entrance test below: a motion
// failure aborts later openings fail-fast, so entrance regressions surface
// one editor at a time in step order.
const editors = [
	{
		name: "account update",
		route: "/accounts",
		trigger: `Rename ${account.name}`,
		title: "Edit Account",
		field: "Name",
		value: account.name,
	},
	{
		name: "budget create",
		route: "/budgets",
		trigger: "New Budget",
		title: "Create Budget",
		field: "Name",
		value: "",
	},
	{
		name: "budget update",
		route: `/budgets/${budget.id}`,
		trigger: "Edit Budget",
		title: "Edit Budget",
		field: "Name",
		value: budget.name,
	},
	{
		name: "category create",
		route: "/categories",
		trigger: "Create Category",
		title: "Create Category",
		field: "Name",
		value: "",
	},
	{
		name: "category update",
		route: "/categories",
		trigger: "Edit Groceries",
		title: "Edit Category",
		field: "Name",
		value: "Groceries",
	},
	{
		name: "monthly budget create",
		route: "/?month=October&year=2026",
		trigger: "New",
		title: "Create monthly budget",
		field: "Name",
		value: "",
	},
	{
		name: "monthly budget update",
		route: "/?month=October&year=2026",
		trigger: "Edit Daily",
		title: "Edit Daily",
		field: "Name",
		value: "Daily",
	},
	{
		name: "pending statement create",
		route: "/statements",
		trigger: "Create Pending Statement",
		title: "Create Pending Statement",
		field: "Description",
		value: "",
	},
	{
		name: "pending statement update",
		route: `/statements/${pending.id}`,
		trigger: "Edit Pending Statement",
		title: "Edit Pending Statement",
		field: "Description",
		value: pending.description,
	},
	{
		name: "record create",
		route: "/records",
		trigger: "Create Pending Record",
		title: "Create New Record",
		field: "Title",
		value: "",
	},
	{
		name: "record update",
		route: `/records/${record.id}`,
		trigger: "Edit Record",
		title: "Edit Record",
		field: "Title",
		value: record.title,
	},
]

test("editor popup entrances share one seed", async ({ page, workspace }) => {
	test.setTimeout(150_000)
	void workspace
	for (const editor of editors) {
		await test.step(`${editor.name}: popup entrance, backdrop and keyboard reopen`, async () => {
			void workspace
			await page.goto(editor.route)
			const trigger = page.getByRole("button", { name: editor.trigger, exact: true })
			await expectPointerCursor(trigger)
			const children = await sampleVisibleRowAnimations(
				page,
				'[data-slot="dialog-content"] [data-slot="field"], [data-slot="dialog-content"] div.overflow-hidden',
				() => expectPopupEntrance(page, () => trigger.click()),
			)
			for (const child of children) {
				expect(
					Math.min(...child.frames.map(frame => frame.opacity)),
					`${child.text}: initial fields must not separately fade`,
				).toBeGreaterThan(0.99)
			}
			const dialog = page.getByRole("dialog", { name: editor.title, exact: true })
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

async function sampleWarningCollapse(page: Page, dialog: Locator) {
	await expect(
		dialog.locator("div.overflow-hidden").filter({ hasText: "Amount does not match" }).first(),
	).toHaveCSS("opacity", "1")
	const recorder = await page.evaluateHandle(() => ({
		done: new Promise<{ opacity: number; height: number }[]>(resolve => {
			const frames: { opacity: number; height: number }[] = []
			let count = 0
			const tick = () => {
				const target = [
					...document.querySelectorAll(
						'[data-slot="dialog-content"] div.overflow-hidden',
					),
				].find(element => element.textContent?.includes("Amount does not match"))
				frames.push(
					target
						? {
								opacity: Number(getComputedStyle(target).opacity),
								height: target.getBoundingClientRect().height,
							}
						: { opacity: 0, height: 0 },
				)
				if (++count < 24) requestAnimationFrame(tick)
				else resolve(frames)
			}
			tick()
		}),
	}))
	await dialog.getByLabel("Amount", { exact: true }).fill("0")
	try {
		return await recorder.evaluate(state => state.done)
	} finally {
		await recorder.dispose()
	}
}

async function openEditor(page: Page, route: string, trigger: string, title: string) {
	await page.goto(route)
	await page.getByRole("button", { name: trigger, exact: true }).click()
	const dialog = page.getByRole("dialog", { name: title, exact: true })
	await expect(dialog).toBeVisible()
	await expectVisibleBackdrop(page)
	return dialog
}

async function select(page: Page, dialog: Locator, label: string, option: string) {
	// Centre the trigger: edge-aligned auto-scrolls fight sticky dialog chrome.
	// No Escape here: with no popup open it would close the dialog under test.
	const trigger = dialog.getByLabel(label, { exact: true })
	await trigger.evaluate(element => element.scrollIntoView({ block: "center" }))
	await trigger.click()
	const choice = page.getByRole("option", { name: option, exact: true })
	await expect(choice).toBeVisible()
	await choice.click()
}

async function chooseCategory(page: Page, dialog: Locator, name = "Groceries") {
	await dialog.getByLabel("Category", { exact: true }).fill(name)
	await page.getByRole("option", { name, exact: true }).click()
}

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

test("account: required name, unicode rename persists after reload", async ({
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

test("budget editor journeys share one seed", async ({ page, workspace }) => {
	void workspace
	await test.step("budget creator: blank name/range errors, negative rejected, zero and single-day range persist", async () => {
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
	await test.step("budget editor: prepopulated period and amount, clearing range fails, long name and zero persist", async () => {
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

test("category editor journeys share one seed", async ({ page, workspace }) => {
	void workspace
	await test.step("category: spending default budget, archived options absent, income clears budget, blank validation", async () => {
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
	await test.step("category creator: required identity and valid colour/defaults persist", async () => {
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
		await page.getByRole("option", { name: "apple", exact: true }).click()
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

test("monthly budget editor journeys share one seed", async ({ page, workspace }) => {
	void workspace
	await test.step("monthly budget creator: blank errors, zero amount and null are distinct persisted values", async () => {
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
	await test.step("monthly budget editor: inherited amount reveals smoothly only after override action", async () => {
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
		const samples = await sampleVisibleRowAnimations(
			page,
			'[data-slot="dialog-content"] div.overflow-hidden:has(#monthly-budget-amount)',
			() => select(page, dialog, "Amount rule", "Override one month"),
		)
		await expect(dialog.getByLabel("Monthly amount", { exact: true })).toBeVisible()
		expect(samples.length).toBe(1)
		const frames = samples[0]?.frames ?? []
		expect(
			frames.length,
			"Conditional amount wrapper is sampled over multiple frames",
		).toBeGreaterThan(2)
		if (!(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches))) {
			expect(
				Math.min(...frames.map(frame => frame.opacity)),
				"Newly revealed amount fades in after action",
			).toBeLessThan(0.95)
			expect(frames.at(-1)?.opacity).toBeGreaterThan(0.99)
		}
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

test("pending statement editor journeys share one seed", async ({ page, workspace }) => {
	void workspace
	await test.step("pending statement creator: required account/description and negative amount persist", async () => {
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
	await test.step("pending statement editor: original description, allocations protect delete, zero fails and negative persists", async () => {
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

test("record creator journeys share one seed", async ({ page, workspace }) => {
	test.setTimeout(90_000)
	void workspace
	for (const amount of ["-12.34", "0"]) {
		await test.step(`record creator: required fields, category defaults, amount ${amount} and long text persist`, async () => {
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
			const expectWarningReveal = async (value: string) => {
				const samples = await sampleVisibleRowAnimations(
					page,
					'[data-slot="dialog-content"] div.overflow-hidden',
					() => dialog.getByLabel("Amount", { exact: true }).fill(value),
				)
				const warning = samples.find(sample =>
					sample.text.includes("Amount does not match"),
				)
				expect(warning, "Conditional warning wrapper is sampled").toBeDefined()
				const frames = warning?.frames ?? []
				expect(
					frames.length,
					"Conditional warning is sampled over multiple frames",
				).toBeGreaterThan(2)
				if (
					!(await page.evaluate(
						() => matchMedia("(prefers-reduced-motion: reduce)").matches,
					))
				) {
					expect(
						Math.min(...frames.map(frame => frame.opacity)),
						"Newly revealed warning fades in after action",
					).toBeLessThan(0.95)
					expect(frames.at(-1)?.opacity).toBeGreaterThan(0.99)
				}
			}
			const expectWarningHide = async () => {
				const frames = await sampleWarningCollapse(page, dialog)
				await expect(mismatch).toHaveCount(0)
				if (
					!(await page.evaluate(
						() => matchMedia("(prefers-reduced-motion: reduce)").matches,
					))
				) {
					expect(
						frames.length,
						"Collapse is sampled over multiple frames",
					).toBeGreaterThan(2)
					const first = frames[0]
					const last = frames.at(-1)
					expect(first?.opacity ?? Number.NaN).toBeGreaterThan(0.5)
					expect(
						(last?.opacity ?? 1) < (first?.opacity ?? 0) ||
							(last?.height ?? 0) < (first?.height ?? 0),
						"Collapsing warning shrinks instead of replaying an entrance",
					).toBe(true)
				}
			}
			if (amount === "0") {
				await expect(mismatch).toHaveCount(0)
				await expectWarningReveal("-12.34")
				await expect(mismatch).toBeVisible()
				await expectWarningHide()
			} else {
				await expect(mismatch).toBeVisible()
				await expectWarningHide()
				await expectWarningReveal(amount)
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
	await test.step("record creator: clearing the selected date shows date validation and archived budgets stay unavailable", async () => {
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
		await page.getByRole("option", { name: "Daily", exact: true }).click()
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

test("record editor and search sheets share one seed", async ({ page, workspace }) => {
	void workspace
	await test.step("statement search sheet: filter, allocate, Done returns to editor, unsaved allocation cancelled", async () => {
		void workspace
		const dialog = await openEditor(page, `/records/${record.id}`, "Edit Record", "Edit Record")
		await dialog.getByRole("button", { name: "Allocate statement", exact: true }).click()
		const sheet = page.getByRole("dialog", {
			name: "Allocate statements to record",
			exact: true,
		})
		await expectVisibleBackdrop(page)
		await sheet.getByRole("searchbox", { name: "Search statements" }).fill(imported.description)
		await sheet.getByRole("button").filter({ hasText: imported.description }).click()
		await sheet.getByRole("button", { name: "Done", exact: true }).click()
		await expect(sheet).not.toBeVisible()
		await expect(dialog).toContainText(imported.description)
		await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
		await expect(page.getByRole("dialog")).toHaveCount(0)
		// The cancelled allocation was never saved to the Record.
		await expect(page.locator("main")).not.toContainText(imported.description)
		await page.getByRole("button", { name: "Edit Record", exact: true }).click()
		const reopened = page.getByRole("dialog", { name: "Edit Record" })
		await expect(reopened).toBeVisible()
		await expect(
			reopened.getByRole("button", { name: "Allocate statement", exact: true }),
		).toBeVisible()
		await expect(reopened).not.toContainText(imported.description)
	})
	await test.step("record search sheet: query miss and hit, attach persists, Escape/reopen", async () => {
		void workspace
		await page.goto(`/budgets/${budget.id}`)
		const trigger = page.getByRole("button", { name: "Attach Record", exact: true })
		await trigger.click()
		const sheet = page.getByRole("dialog", { name: "Attach record to budget", exact: true })
		await expectVisibleBackdrop(page)
		await sheet.getByRole("searchbox", { name: "Search records" }).fill("no-such-record-999")
		await expect(sheet).toContainText("No matching Records.")
		await sheet.getByRole("searchbox", { name: "Search records" }).fill(record.title)
		await sheet.getByRole("button").filter({ hasText: record.title }).click()
		await expect(sheet).not.toBeVisible()
		await page.reload()
		await expect(page.getByRole("main")).toContainText(record.title)
		await trigger.click()
		await page.keyboard.press("Escape")
		await expect(sheet).not.toBeVisible()
		await trigger.click()
		await expect(sheet).toBeVisible()
	})
	await test.step("record editor: null optional fields, long title, sign and penny keyboard steps persist", async () => {
		void workspace
		const dialog = await openEditor(page, `/records/${record.id}`, "Edit Record", "Edit Record")
		await expect(dialog.getByLabel("Title", { exact: true })).toHaveValue(record.title)
		await expect(dialog.getByLabel("People", { exact: true })).toHaveValue(record.people ?? "")
		await expect(dialog.getByLabel("Location", { exact: true })).toHaveValue(
			record.location ?? "",
		)
		await dialog.getByLabel("Title", { exact: true }).fill(longText)
		const amount = dialog.getByLabel("Amount", { exact: true }).first()
		await amount.fill("0")
		await amount.press("ArrowDown")
		await expect(amount).toHaveValue("-0.01")
		await dialog
			.getByRole("button", { name: "Make amount positive", exact: true })
			.first()
			.click()
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
})

async function openReplacementSheet(page: Page) {
	await page.goto("/allocator")
	await page
		.getByRole("checkbox", { name: `Select statement ${imported.id}`, exact: true })
		.check()
	await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
	return page.getByRole("dialog", { name: "Replace a pending Statement", exact: true })
}

test("replacement and duplicate review sheets share one seed", async ({ page, workspace }) => {
	void workspace
	await test.step("pending confirmation sheet and replacement review: selected descriptions, cancel restores sheet", async () => {
		void workspace
		const sheet = await openReplacementSheet(page)
		await expectVisibleBackdrop(page)
		await expect(sheet).toContainText(imported.description)
		await sheet
			.getByRole("searchbox", { name: "Search pending Statements" })
			.fill(pending.description)
		const choice = sheet.getByRole("button").filter({ hasText: pending.description })
		// Sample only the newly opened review; the confirmation sheet is already visible.
		const entrance = await sampleVisibleRowAnimations(
			page,
			'[data-slot="dialog-content"]',
			() => choice.click(),
		)
		expect(entrance.length).toBe(1)
		if (!(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches))) {
			expect(
				entrance[0]?.frames.some(frame => frame.opacity > 0.01 && frame.opacity < 0.99),
				"Replacement review must animate through intermediate opacity",
			).toBe(true)
		}
		await expectVisibleBackdrop(page)
		const review = page.getByRole("dialog", {
			name: "Review Statement replacement",
			exact: true,
		})
		await expect(review).toContainText(pending.description)
		await expect(review).toContainText(imported.description)
		await expect(
			review.getByRole("button", { name: "Replace pending Statement", exact: true }),
		).toBeEnabled()
		await review.getByRole("button", { name: "Cancel", exact: true }).click()
		await expect(sheet).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(sheet).not.toBeVisible()
	})
	await test.step("duplicate review: explicit keep/delete, backdrop, cancel and reopen retain choices", async () => {
		void workspace
		await page.goto("/allocator/duplicates")
		// Review stays disabled until both a kept and a deleted Statement are chosen.
		await expect(
			page.getByRole("button", { name: "Review deletion", exact: true }).first(),
		).toBeDisabled()
		await page.getByRole("radio", { name: `Keep ${kept.description}`, exact: true }).click()
		await page
			.getByRole("radio", { name: `Delete ${deleted.description}`, exact: true })
			.click()
		const trigger = page.getByRole("button", { name: "Review deletion", exact: true }).first()
		await expectPopupEntrance(page, () => trigger.click())
		const dialog = page.getByRole("dialog", {
			name: "Delete duplicate Statements",
			exact: true,
		})
		await expect(dialog).toContainText(kept.description)
		await expect(dialog).toContainText(deleted.description)
		await expect(
			dialog.getByRole("button", { name: "Delete 1 Statement", exact: true }),
		).toBeEnabled()
		await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
		await expect(dialog).not.toBeVisible()
		await trigger.click()
		await expect(dialog).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(dialog).not.toBeVisible()
	})
})

test("empty workspace: category creation remains available and record category shows no options", async ({
	page,
}) => {
	await seedWorkspace(page, "empty")
	const dialog = await openEditor(page, "/records", "Create Pending Record", "Create New Record")
	await dialog.getByLabel("Category", { exact: true }).click()
	await expect(page.getByText("No categories found.", { exact: true })).toBeVisible()
	await page.keyboard.press("Escape")
	await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
	await page.goto("/categories")
	await expect(page.getByRole("button", { name: "Create Category", exact: true })).toBeEnabled()
})
