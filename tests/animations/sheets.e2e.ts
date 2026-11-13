import { expectVisibleBackdrop } from "../support/assertions"
import { budget, deleted, imported, kept, pending, record } from "../support/editors"
import { expect, test } from "../support/fixtures"
import {
	expectModalEntrance,
	expectModalExit,
	expectPopupEntrance,
	sampleVisibleRowAnimations,
} from "../support/motion"
import { openReplacementSheet } from "../support/sheets"

test("review sheets: replacement and duplicate reviews enter as a whole", {
	tag: ["@reduced-motion"],
}, async ({ page, workspace }) => {
	void workspace
	await test.step("replacement review: review enters through intermediate opacity", async () => {
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
	})
	await test.step("Duplicate Statement review: popup enters as a whole", async () => {
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
	})
})

test("search sheets: every sheet animates in and out on dismissal and completion", {
	tag: ["@reduced-motion"],
}, async ({ page, workspace }) => {
	test.setTimeout(90_000)
	void workspace
	await test.step("Record search sheet: attach and Escape preserve the exit", async () => {
		await page.goto(`/budgets/${budget.id}`)
		const trigger = page.getByRole("button", { name: "Attach Record", exact: true })
		await expectModalEntrance(page, '[data-slot="sheet-content"]', () => trigger.click())
		await expectModalExit(page, '[data-slot="sheet-content"]', () =>
			page.keyboard.press("Escape"),
		)
		await expectModalEntrance(page, '[data-slot="sheet-content"]', () => trigger.click())
		const sheet = page.getByRole("dialog", { name: "Attach record to budget", exact: true })
		await sheet.getByRole("searchbox", { name: "Search records" }).fill(record.title)
		await expectModalExit(page, '[data-slot="sheet-content"]', () =>
			sheet.getByRole("button").filter({ hasText: record.title }).click(),
		)
	})
	await test.step("Statement search sheet: Done and Escape preserve the exit", async () => {
		await page.goto(`/records/${record.id}`)
		await page.getByRole("button", { name: "Edit Record", exact: true }).click()
		const editor = page.getByRole("dialog", { name: "Edit Record", exact: true })
		const trigger = editor.getByRole("button", { name: "Allocate statement", exact: true })
		await expectModalEntrance(page, '[data-slot="sheet-content"]', () => trigger.click())
		const sheet = page.getByRole("dialog", {
			name: "Allocate statements to record",
			exact: true,
		})
		await sheet.getByRole("searchbox", { name: "Search statements" }).fill(imported.description)
		await sheet.getByRole("button").filter({ hasText: imported.description }).click()
		await expectModalExit(page, '[data-slot="sheet-content"]', () =>
			sheet.getByRole("button", { name: "Done", exact: true }).click(),
		)
		await expectModalEntrance(page, '[data-slot="sheet-content"]', () => trigger.click())
		await expectModalExit(page, '[data-slot="sheet-content"]', () =>
			page.keyboard.press("Escape"),
		)
		await expect(editor).toBeVisible()
	})
	await test.step("Pending Statement confirmation: Escape preserves the exit", async () => {
		await page.goto("/allocator")
		await page
			.getByRole("checkbox", { name: `Select statement ${imported.id}`, exact: true })
			.check()
		await expectModalEntrance(page, '[data-slot="sheet-content"]', () =>
			page.getByRole("button", { name: "Replace Pending", exact: true }).click(),
		)
		await expectModalExit(page, '[data-slot="sheet-content"]', () =>
			page.keyboard.press("Escape"),
		)
	})
})

for (const action of ["Cancel", "Replace pending Statement"] as const) {
	test(`Statement replacement review: ${action} animates the exit before removal`, {
		tag: ["@reduced-motion"],
	}, async ({ page, workspace }) => {
		void workspace
		const sheet = await openReplacementSheet(page)
		await sheet
			.getByRole("searchbox", { name: "Search pending Statements" })
			.fill(pending.description)
		await expectPopupEntrance(page, () =>
			sheet.getByRole("button").filter({ hasText: pending.description }).click(),
		)
		const review = page.getByRole("dialog", {
			name: "Review Statement replacement",
			exact: true,
		})
		await expectModalExit(page, '[data-slot="dialog-content"]', () =>
			review.getByRole("button", { name: action, exact: true }).click(),
		)
		if (action === "Cancel") await expect(sheet).toBeVisible()
		else await expect(page.getByRole("dialog")).toHaveCount(0)
	})
}

test("Records sheet: animates in and out when closed by Escape and by its close button", {
	tag: ["@reduced-motion"],
}, async ({ page, workspace }) => {
	void workspace
	await page.goto("/?month=October&year=2026")
	const day = page.getByRole("button", { name: /^5 October:/ })
	const open = () =>
		expectModalEntrance(page, '[data-slot="sheet-content"]', async () => {
			await day.click()
		})
	await open()
	await expectModalExit(page, '[data-slot="sheet-content"]', () => page.keyboard.press("Escape"))
	await open()
	await expectModalExit(page, '[data-slot="sheet-content"]', () =>
		page
			.getByRole("dialog", { name: "Records", exact: true })
			.getByRole("button", { name: "Close", exact: true })
			.click(),
	)
})

test("mobile modal sheets: sidebar and amount filter animate in and out", {
	tag: ["@reduced-motion"],
}, async ({ page, workspace }) => {
	void workspace
	await page.setViewportSize({ width: 390, height: 844 })
	await page.goto("/allocator")
	await expect.poll(() => page.evaluate(() => localStorage.getItem("history"))).not.toBeNull()
	await test.step("sidebar: trigger and Escape retain the sheet exit", async () => {
		const trigger = page.locator('header [data-slot="sidebar-trigger"]')
		await expectModalEntrance(page, '[data-slot="sidebar"][data-mobile="true"]', () =>
			trigger.click(),
		)
		await expectModalExit(page, '[data-slot="sidebar"][data-mobile="true"]', () =>
			page.keyboard.press("Escape"),
		)
	})
	await test.step("amount filter: trigger and close retain the sheet exit", async () => {
		const trigger = page.getByRole("button", { name: "Any amount", exact: true })
		await expectModalEntrance(page, '[data-slot="sheet-content"]', () => trigger.click())
		await expectModalExit(page, '[data-slot="sheet-content"]', () =>
			page.keyboard.press("Escape"),
		)
	})
})
