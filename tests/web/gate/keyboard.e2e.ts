import { expectPointerCursor } from "../support/assertions"
import { IDS } from "../support/data"
import { expect, test } from "../support/fixtures"

test("chrome buttons: keyboard month navigation and create button, sidebar trigger toggle, Account card Enter opens detail", {
	tag: ["@reduced-motion"],
}, async ({ page, workspace, isMobile }) => {
	void workspace
	await test.step("month navigation: keyboard previous-month and create Record actions work", async () => {
		await page.goto("/?month=October&year=2026")
		await page.getByRole("button", { name: "Previous month", exact: true }).focus()
		await page.keyboard.press("Enter")
		await expect(page.getByRole("heading", { name: "September 2026", level: 2 })).toBeVisible()
		await page.goto("/records")
		const create = page.getByRole("button", { name: /create pending record/i }).first()
		await expectPointerCursor(create)
		await create.focus()
		await page.keyboard.press("Space")
		await expect(page.getByRole("dialog")).toBeVisible()
		// Leave the dialog closed so later steps start from a clean page.
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).toHaveCount(0)
	})
	await test.step("sidebar trigger: keyboard toggle opens and closes the sidebar", async () => {
		await page.goto("/privacy")
		const toggle = page.locator('header [data-slot="sidebar-trigger"]')
		await expectPointerCursor(toggle)
		await toggle.focus()
		await page.keyboard.press("Enter")
		if (isMobile) {
			await expect(page.getByRole("dialog")).toBeVisible()
			await expect(
				page.getByRole("dialog").getByText("Finpoint", { exact: true }),
			).toBeVisible()
			await expect(
				page.getByRole("dialog").getByText("Local-first finance", { exact: true }),
			).toBeVisible()
			await page.keyboard.press("Escape")
			await expect(page.getByRole("dialog")).toHaveCount(0)
			await expect(toggle).toBeFocused()
		} else {
			await expect(page.locator('[data-slot="sidebar"]').first()).toHaveAttribute(
				"data-state",
				"collapsed",
			)
			await toggle.focus()
			await page.keyboard.press("Space")
			await expect(page.locator('[data-slot="sidebar"]').first()).toHaveAttribute(
				"data-state",
				"expanded",
			)
			await expect(
				page.locator('[data-slot="sidebar"]').getByText("Finpoint", { exact: true }),
			).toBeVisible()
			await expect(
				page
					.locator('[data-slot="sidebar"]')
					.getByText("Local-first finance", { exact: true }),
			).toBeVisible()
		}
	})
	await test.step("Account card: Enter opens detail while nested Rename Enter stays in its editor", async () => {
		await page.goto("/accounts?query=One+Card")
		const card = page.locator("article", { hasText: "One Card" })
		await expect(card).toBeVisible()
		const rename = card.getByRole("button", { name: "Rename One Card", exact: true })
		await rename.focus()
		await page.keyboard.press("Enter")
		await expect(page.getByRole("dialog", { name: "Edit Account", exact: true })).toBeVisible()
		await expect(page).toHaveURL(/\/accounts\?query=One\+Card$/)
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).toHaveCount(0)
		await card.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/\/accounts\/t1-acc-uob$/)
		const back = page.getByRole("button", { name: "Back to Accounts", exact: true })
		await back.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/\/accounts\?query=One\+Card$/)
	})
})

test("sidebar rail: Enter collapses and Space expands the sidebar", {
	tag: ["@desktop-only"],
}, async ({ page, isMobile }) => {
	test.skip(isMobile, "Sidebar rail is desktop only; mobile has a separate trigger")
	await page.goto("/records")
	const rail = page.locator('[data-slot="sidebar-rail"]')
	await expectPointerCursor(rail)
	await rail.focus()
	await page.keyboard.press("Enter")
	await expect(page.locator('[data-slot="sidebar"]').first()).toHaveAttribute(
		"data-state",
		"collapsed",
	)
	await rail.focus()
	await page.keyboard.press("Space")
	await expect(page.locator('[data-slot="sidebar"]').first()).toHaveAttribute(
		"data-state",
		"expanded",
	)
})

// Allocator keyboard flows share one seed: none of them persist (dialogs and
// reviews are cancelled, selections are cleared), so step order is free. The
// small-viewport step runs last because it resizes the viewport for the rest
// of the test.
test("allocator keyboard flows: selection and dialog, duplicate review, disabled replace action and small-viewport clear", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await test.step("allocator: keyboard selection opens Create Record and Clear removes the selection", async () => {
		await page.goto("/allocator")
		const box = page.getByRole("checkbox", {
			name: `Select statement ${IDS.statements.unallocated[2]}`,
			exact: true,
		})
		await expect(box).toBeVisible()
		await box.focus()
		await page.keyboard.press("Space")
		await expect(box).toBeChecked()
		await expect(page.locator("aside strong")).toContainText("1 selected")
		const create = page.getByRole("button", { name: "Create Record", exact: true })
		await create.focus()
		await page.keyboard.press("Enter")
		await expect(page.getByRole("dialog", { name: "Create New Record" })).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).toHaveCount(0)
		await expect(box).toBeChecked()
		const clear = page.locator("aside").getByRole("button", { name: "Clear", exact: true })
		await clear.focus()
		await page.keyboard.press("Enter")
		await expect(box).not.toBeChecked()
		await expect(page.locator("aside")).toHaveCount(0)
	})
	await test.step("duplicates: keyboard keep, delete, review and cancel work", async () => {
		await page.goto("/allocator/duplicates")
		const keep = page.getByRole("radio", {
			name: `Keep ${"DON DON DONKI 8821 PURCHASE"}`,
			exact: true,
		})
		await keep.focus()
		await page.keyboard.press("Space")
		const del = page.getByRole("radio", {
			name: `Delete ${"DON DON DONKI PURCHASE 8821"}`,
			exact: true,
		})
		await expect(del).toBeEnabled()
		await del.focus()
		await page.keyboard.press("Space")
		const reviewTrigger = page.getByRole("button", { name: "Review deletion", exact: true })
		await expect(reviewTrigger).toBeEnabled()
		await reviewTrigger.focus()
		await page.keyboard.press("Enter")
		const review = page.getByRole("dialog", { name: "Delete duplicate Statements" })
		await expect(review).toBeVisible()
		await expect(review.getByText("DON DON DONKI 8821 PURCHASE")).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(review).toHaveCount(0)
	})
	await test.step("selection bar: replace action stays disabled for two selections", async () => {
		await page.goto("/allocator")
		// Two selections cannot map to one pending replacement: the action stays
		// disabled through the real UI rather than a class assertion.
		for (const id of [IDS.statements.unallocated[2], IDS.statements.unallocated[3]]) {
			await page
				.getByRole("checkbox", { name: `Select statement ${id}`, exact: true })
				.click()
		}
		await expect(page.locator("aside strong")).toContainText("2 selected")
		const replace = page.locator("aside").getByRole("button", { name: "Replace Pending" })
		await expect(replace).toBeDisabled()
		const create = page.getByRole("button", { name: "Create Record", exact: true })
		await expect(create).toBeEnabled()
	})
	await test.step("selection bar: Clear stays reachable by keyboard on a small viewport", async () => {
		await page.setViewportSize({ width: 390, height: 844 })
		await page.goto("/allocator")
		const box = page.getByRole("checkbox", {
			name: `Select statement ${IDS.statements.unallocated[3]}`,
			exact: true,
		})
		await expect(box).toBeVisible()
		await box.click()
		const bar = page.locator("aside")
		await expect(bar).toBeVisible()
		const clear = bar.getByRole("button", { name: "Clear", exact: true })
		await expect(clear).toBeInViewport()
		await clear.focus()
		await page.keyboard.press("Enter")
		await expect(box).not.toBeChecked()
		await expect(bar).toHaveCount(0)
	})
})

test("pending queue: keyboard replace and confirm replace the Pending Statement", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await page.goto("/allocator/pending")
	const queue = page.locator("section[aria-labelledby='pending-queue-title']")
	await queue.getByPlaceholder("Search descriptions...").fill("Pasar malam")
	const pick = page.getByRole("button", { name: /Pasar malam/ })
	await expect(pick).toBeVisible()
	await pick.focus()
	await page.keyboard.press("Enter")
	await expect(page.getByText("Replacing pending Statement")).toBeVisible()
	const scope = page.locator("button").filter({ hasText: "Suggested replacements" }).first()
	await scope.focus()
	await page.keyboard.press("Enter")
	const all = page.getByRole("option", { name: "All unallocated imports" })
	await all.focus()
	await page.keyboard.press("Enter")
	const candidateSection = page.locator("section[aria-labelledby='candidate-title']")
	await candidateSection.getByPlaceholder("Search descriptions...").fill("SHENG SIONG")
	const replace = page.getByRole("button", { name: "Replace", exact: true })
	await replace.focus()
	await page.keyboard.press("Enter")
	const review = page.getByRole("dialog", { name: "Review Statement replacement" })
	await expect(review).toBeVisible()
	const confirm = review.getByRole("button", { name: "Replace pending Statement" })
	await confirm.focus()
	await page.keyboard.press("Enter")
	await expect(review).toHaveCount(0)
	await expect(page.getByText("Pending Statement replaced.")).toBeVisible()
	await page.goto(`/records/${IDS.records.pendingStatement}`)
	await expect(
		page.locator("main").getByText("SHENG SIONG 9902").filter({ visible: true }).first(),
	).toBeVisible()
})

test("settings: keyboard save of default filters persists across reload", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await page.goto("/settings")
	const save = page.getByRole("button", { name: "Save default filters" })
	await expect(save).toBeDisabled()
	const trigger = page.locator("#default_filter_end_date")
	await trigger.focus()
	await page.keyboard.press("Enter")
	const today = page.getByRole("option", { name: "Today", exact: true })
	await expect(today).toBeVisible()
	await today.focus()
	await page.keyboard.press("Enter")
	await expect(save).toBeEnabled()
	await save.focus()
	await page.keyboard.press("Enter")
	await expect(page.getByText("Default filters saved.")).toBeVisible()
	await page.reload()
	await expect(page.locator("#default_filter_end_date")).toContainText("Today")
})

// Sync cancel and importer rejection share one seed: neither mutates the
// workspace (the clear is cancelled, the bad file is rejected), and they
// touch different routes, so one navigation each keeps them independent.
test("sync and importer: cancelled clear keeps data, keyboard bank select and invalid file rejection work", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await test.step("sync: keyboard cancel of clear all data preserves the workspace", async () => {
		await page.goto("/sync")
		const clear = page.getByRole("button", { name: "Clear all data" })
		await clear.focus()
		await page.keyboard.press("Enter")
		const confirm = page.getByRole("button", { name: "Yes, clear everything" })
		await expect(confirm).toBeVisible()
		// AlertDialogs block Escape; keyboard users dismiss via Cancel.
		const cancel = page.getByRole("button", { name: "Cancel", exact: true })
		await cancel.focus()
		await page.keyboard.press("Enter")
		await expect(page.getByRole("button", { name: "Clear all data" })).toBeVisible()
		await page.goto("/records")
		// The title renders in both the mobile list and the desktop table;
		// exactly one is visible per viewport.
		await expect(
			page
				.locator("main")
				.getByText("Monthly Salary", { exact: true })
				.filter({ visible: true }),
		).toBeVisible()
	})
	await test.step("importer: keyboard bank select and invalid file rejection work", async () => {
		await page.goto("/importer")
		const dbs = page.getByRole("radio", { name: /DBS/ })
		await dbs.focus()
		await page.keyboard.press("Space")
		await expect(dbs).toHaveAttribute("aria-checked", "true")
		const drop = page.getByRole("button", { name: /Drop.*here/ })
		await drop.focus()
		const [chooser] = await Promise.all([
			page.waitForEvent("filechooser"),
			page.keyboard.press("Enter"),
		])
		await chooser.setFiles([
			{
				name: "broken.csv",
				mimeType: "text/csv",
				buffer: Buffer.from("nope,not,bank\n1,2\n"),
			},
		])
		const importButton = page.getByRole("button", { name: /Import 1 file/ })
		await importButton.focus()
		await page.keyboard.press("Enter")
		await expect(page.getByText("Account details are missing from this export.")).toBeVisible()
	})
})
