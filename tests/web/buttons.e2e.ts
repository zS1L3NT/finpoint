import { expectPointerCursor } from "./support/assertions"
import { expect, test } from "./support/fixtures"

const routes = [
	"/",
	"/records",
	"/records/monthly?month=October&year=2026",
	"/statements",
	"/accounts",
	"/budgets",
	"/categories",
	"/allocator",
	"/allocator/pending",
	"/allocator/duplicates",
	"/importer",
	"/settings",
	"/sync",
	"/privacy",
	"/terms",
	"/accounts/t1-acc-dbs",
	"/budgets/t1-b-manual",
	"/records/t1-r-partial",
	"/statements/t1-s-pending",
]

for (const route of routes) {
	test(`enabled visible buttons on ${route} pass a pointer, Tab-reachability and actionability audit`, async ({
		page,
		workspace,
	}) => {
		void workspace
		await page.goto(route)
		await expect(page.locator("main h2").first()).toBeVisible()
		const ready: Record<string, string> = {
			"/records": "Edit FairPrice Run",
			"/records/monthly?month=October&year=2026": "Edit FairPrice Run",
			"/accounts": "Rename Everyday Savings",
			"/budgets": "Edit October Buffer",
			"/categories": "Edit Groceries",
			"/statements": "Edit pending statement",
			"/allocator/pending": "Pasar malam snacks",
			"/allocator/duplicates": "Review deletion",
			"/accounts/t1-acc-dbs": "Edit Account",
			"/budgets/t1-b-manual": "Edit Budget",
			"/records/t1-r-partial": "Edit Record",
			"/statements/t1-s-pending": "Edit Pending Statement",
		}
		if (ready[route])
			await expect(
				page
					.getByRole("button", {
						name: ready[route],
						exact: route !== "/allocator/pending",
					})
					.filter({ visible: true })
					.first(),
			).toBeVisible()
		if (route === "/allocator")
			await expect(
				page.getByRole("checkbox", { name: "Select statement t1-s-free-2", exact: true }),
			).toBeVisible()
		const candidates = page.locator(
			'button:visible, [role="button"]:visible, a[data-slot="button"]:visible',
		)
		expect(
			await candidates.count(),
			`${route}: inspect actual enabled controls`,
		).toBeGreaterThan(0)
		const failures = await page
			.locator('button:visible, [role="button"]:visible, a[data-slot="button"]:visible')
			.evaluateAll(elements =>
				elements.flatMap(element => {
					if (element.matches(':disabled, [aria-disabled="true"]')) return []
					const item = element as HTMLElement
					const name =
						item.getAttribute("aria-label") ||
						item.textContent?.trim() ||
						item.outerHTML.slice(0, 100)
					return getComputedStyle(item).cursor !== "pointer" ||
						(item.tabIndex < 0 &&
							!item.closest(
								'[role="tablist"], [role="menu"], [role="grid"], [role="radiogroup"], [role="toolbar"], [data-slot="toggle-group"]',
							))
						? [{ name, cursor: getComputedStyle(item).cursor, tabIndex: item.tabIndex }]
						: []
				}),
			)
		expect(failures, route).toEqual([])
		for (const button of await page
			.locator(
				'main button:visible:not(:disabled), main a[data-slot="button"]:visible:not([aria-disabled="true"])',
			)
			.all())
			await button.click({ trial: true })
	})
}

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

test("month navigation and create button perform keyboard actions", async ({ page }) => {
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
})

test("header sidebar trigger supports keyboard toggle", async ({ page, isMobile }) => {
	await page.goto("/privacy")
	const toggle = page.locator('header [data-slot="sidebar-trigger"]')
	await expectPointerCursor(toggle)
	await toggle.focus()
	await page.keyboard.press("Enter")
	if (isMobile) {
		await expect(page.getByRole("dialog")).toBeVisible()
		await expect(page.getByRole("dialog").getByText("Finpoint", { exact: true })).toBeVisible()
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
			page.locator('[data-slot="sidebar"]').getByText("Local-first finance", { exact: true }),
		).toBeVisible()
	}
})

test("Account card Enter opens detail while nested Rename Enter stays in its editor", async ({
	page,
	workspace,
}) => {
	void workspace
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
