import { expectPointerCursor } from "./support/assertions"
import { expect, test } from "./support/fixtures"

// Per-route button audits now run as the second step of each route sweep in
// route-contracts.e2e.ts (one navigation serves both the layout and the audit).
// This file keeps the chrome-level keyboard flows, which share one populated
// seed and touch different routes without persisting anything.
test("chrome keyboard flows share one seed", async ({ page, workspace, isMobile }) => {
	void workspace
	await test.step("month navigation and create button perform keyboard actions", async () => {
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
	await test.step("header sidebar trigger supports keyboard toggle", async () => {
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
	await test.step("Account card Enter opens detail while nested Rename Enter stays in its editor", async () => {
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

test("sidebar rail responds to Enter and Space", async ({ page, isMobile }) => {
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
