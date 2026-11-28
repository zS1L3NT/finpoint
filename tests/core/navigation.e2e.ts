import type { Page } from "@playwright/test"
import { expect, test } from "../support/fixtures"

async function expectBackAboveHeadingFromHistoryRegressions(page: Page, backName: string) {
	const back = page.getByRole("button", { name: backName, exact: true })
	await expect(back).toBeVisible()
	// Poll: the heading may still be in its entrance animation.
	await expect
		.poll(async () => {
			const backBox = await back.boundingBox()
			const headingBox = await page.locator("main h2").first().boundingBox()
			if (!backBox || !headingBox) return Number.NaN
			return headingBox.y - (backBox.y + backBox.height)
		}, "Back sits above the heading")
		.toBeGreaterThan(0)
}

// The history provider writes localStorage once it has loaded, which proves hydration:
// before then link clicks are plain browser navigations and record no origin.
async function gotoReady(page: Page, url: string) {
	await page.goto(url)
	await expect.poll(() => page.evaluate(() => localStorage.getItem("history"))).not.toBeNull()
}

// An absent Back control must stay absent: a bare count of zero passes before a late commit.
async function expectNoBack(page: Page) {
	await expect(page.getByRole("button", { name: /^Back to / })).toHaveCount(0)
	const appeared = await page.evaluate(
		() =>
			new Promise<boolean>(resolve => {
				const end = performance.now() + 300
				const check = () => {
					const found = [...document.querySelectorAll("button")].some(button =>
						button.textContent?.trim().startsWith("Back to"),
					)
					if (found || performance.now() > end) resolve(found)
					else requestAnimationFrame(check)
				}
				check()
			}),
	)
	expect(appeared, "No Back control appears after the page settles").toBe(false)
}

async function expectBackAboveHeadingFromKeyboardNavigation(page: Page, name: string) {
	const back = page.getByRole("button", { name, exact: true })
	await expect(back).toBeVisible()
	const backBox = await back.boundingBox()
	const headingBox = await page.locator("main h2").first().boundingBox()
	if (!backBox || !headingBox) throw new Error("Back and heading need layout boxes")
	expect(backBox.y + backBox.height).toBeLessThan(headingBox.y)
}

async function keyboardBack(page: Page, name: string, url: RegExp | string) {
	const back = page.getByRole("button", { name, exact: true })
	await expectBackAboveHeadingFromKeyboardNavigation(page, name)
	await back.focus()
	await page.keyboard.press("Enter")
	await expect(page).toHaveURL(url)
}

// Steps that assert history behaviour reset the provider first: clearing
// localStorage then navigating starts each step with the empty history a
// fresh context would have, so earlier steps never pollute later origins.
async function resetHistory(page: Page, url: string) {
	await page.evaluate(() => localStorage.clear())
	await page.goto(url)
	await expect.poll(() => page.evaluate(() => localStorage.getItem("history"))).not.toBeNull()
}

test("Account root: fresh root drops persisted self-target without a dead Back click", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/accounts?query=Everyday")
	await page.getByRole("heading", { name: "Everyday Savings", exact: true }).click()
	await expect(page).toHaveURL(/\/accounts\/t1-acc-dbs$/)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Accounts")
	await expect
		.poll(() => page.evaluate(() => localStorage.getItem("history")))
		.toContain("/accounts?query=Everyday")
	await gotoReady(page, "/accounts?query=Everyday")
	await expect(
		page.locator("main").getByRole("heading", { name: "Accounts", level: 2, exact: true }),
	).toBeVisible()
	await expect.poll(() => page.evaluate(() => localStorage.getItem("history"))).toBe("[]")
	await expectNoBack(page)
})

test("ordinary link: cycle preserves the latest distinct origin across browser traversal", async ({
	page,
}) => {
	await gotoReady(page, "/terms")
	await page.locator("main").getByRole("link", { name: "Privacy Policy", exact: true }).click()
	await expect(page).toHaveURL(/\/privacy$/)
	await page.locator("main").getByRole("link", { name: "Terms of Service", exact: true }).click()
	await expect(page).toHaveURL(/\/terms$/)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Privacy Policy")
	await page.goBack()
	await expect(page).toHaveURL(/\/privacy$/)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Terms of Service")
	await page.goForward()
	await expect(page).toHaveURL(/\/terms$/)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Privacy Policy")
	await page.getByRole("button", { name: "Back to Privacy Policy", exact: true }).click()
	await expect(page).toHaveURL(/\/privacy$/)
})

test("Account root: browser Back returns without a self-target and Forward restores its exact origin", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/accounts?query=Everyday")
	const origin = page.url()
	await page.getByRole("heading", { name: "Everyday Savings", exact: true }).click()
	await expect(page).toHaveURL(/\/accounts\/t1-acc-dbs$/)
	const detail = page.url()
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Accounts")
	await page.goBack()
	await expect(page).toHaveURL(origin)
	await expectNoBack(page)
	await page.goForward()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Accounts")
	await page.getByRole("button", { name: "Back to Accounts", exact: true }).click()
	await expect(page).toHaveURL(origin)
	await expectNoBack(page)
})

test("browser traversal: rejects malformed snapshot URLs and retains the valid filtered origin", async ({
	page,
	workspace,
}) => {
	void workspace
	const errors: string[] = []
	page.on("pageerror", error => errors.push(error.message))
	await gotoReady(page, "/statements?query=FairPrice")
	const origin = page.url()
	await page.locator('a[href="/statements/t1-s-groceries"]').filter({ visible: true }).click()
	await expect(page).toHaveURL(/\/statements\/t1-s-groceries$/)
	const detail = page.url()
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Statements")
	await page.evaluate(origin => {
		const url = new URL(origin)
		history.replaceState(
			{
				...history.state,
				finpointHistory: [
					{ name: "Invalid", url: "//[" },
					{ name: "Statements", url: url.pathname + url.search },
				],
			},
			"",
		)
	}, origin)
	await page.goBack()
	await expect(page).toHaveURL(origin)
	await page.goForward()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Statements")
	await page.getByRole("button", { name: "Back to Statements", exact: true }).click()
	await expect(page).toHaveURL(origin)
	expect(errors).toEqual([])
})

test("nested drill: browser Back and Forward restore filtered drill with usable exact Back controls", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/accounts?query=Everyday")
	const origin = page.url()
	await page.getByRole("heading", { name: "Everyday Savings", exact: true }).click()
	await expect(page).toHaveURL(/\/accounts\/t1-acc-dbs$/)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Accounts")
	const records = page.url()
	await page.locator('a[href="/statements/t1-s-groceries"]').filter({ visible: true }).click()
	await expect(page).toHaveURL(/\/statements\/t1-s-groceries$/)
	const detail = page.url()
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Account Everyday Savings")
	await page.goBack()
	await expect(page).toHaveURL(records)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Accounts")
	await expect(
		page.getByRole("button", { name: "Back to Account Everyday Savings", exact: true }),
	).toHaveCount(0)
	await page.goBack()
	await expect(page).toHaveURL(origin)
	await expectNoBack(page)
	await page.goForward()
	await expect(page).toHaveURL(records)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Accounts")
	await page.goForward()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Account Everyday Savings")
	await page
		.getByRole("button", { name: "Back to Account Everyday Savings", exact: true })
		.click()
	await expect(page).toHaveURL(records)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Accounts")
	await page.getByRole("button", { name: "Back to Accounts", exact: true }).click()
	await expect(page).toHaveURL(origin)
	await expectNoBack(page)
})

test("browser traversal: distinguishes the same detail URL entered from two filtered origins", async ({
	page,
	workspace,
}) => {
	void workspace
	// Starting a search pushes an entry; refining an existing query replaces
	// it. Keep the first origin category-only so both browser entries exist.
	await gotoReady(page, "/statements?account_id=t1-acc-dbs")
	const firstOrigin = page.url()
	await page.locator('a[href="/statements/t1-s-groceries"]').filter({ visible: true }).click()
	await expect(page).toHaveURL(/\/statements\/t1-s-groceries$/)
	const detail = page.url()
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Statements")
	await page.getByRole("button", { name: "Back to Statements", exact: true }).click()
	await expect(page).toHaveURL(firstOrigin)
	await page.getByPlaceholder("Search descriptions...").fill("FairPrice Run")
	await expect(page).toHaveURL(/query=FairPrice\+Run/)
	const secondOrigin = page.url()
	expect(secondOrigin).not.toBe(firstOrigin)
	await page.locator('a[href="/statements/t1-s-groceries"]').filter({ visible: true }).click()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Statements")
	await page.goBack()
	await expect(page).toHaveURL(secondOrigin)
	await expectNoBack(page)
	await page.goBack()
	await expect(page).toHaveURL(firstOrigin)
	await page.goBack()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Statements")
	await page.goForward()
	await expect(page).toHaveURL(firstOrigin)
	await page.goForward()
	await expect(page).toHaveURL(secondOrigin)
	await page.goForward()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Statements")
	await page.getByRole("button", { name: "Back to Statements", exact: true }).click()
	await expect(page).toHaveURL(secondOrigin)
	// Return to the first detail entry again and use its Back, rather than
	// merely accepting the label shared by both origins.
	await page.goBack()
	await expect(page).toHaveURL(detail)
	await page.goBack()
	await expect(page).toHaveURL(secondOrigin)
	await page.goBack()
	await expect(page).toHaveURL(firstOrigin)
	await page.goBack()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Statements")
	await page.getByRole("button", { name: "Back to Statements", exact: true }).click()
	await expect(page).toHaveURL(firstOrigin)
})

test("Records sheet: a chart drill adds no Back, browser Back closes it and Forward reopens it", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/?month=October&year=2026")
	const origin = page.url()
	const sheet = page.getByRole("dialog", { name: "Groceries", exact: true })
	await page
		.locator('[data-slot="card"]')
		.filter({
			has: page
				.locator('[data-slot="card-title"]')
				.filter({ hasText: "Categories this month" }),
		})
		.getByRole("link", { name: /Groceries/ })
		.click()
	await expect(page).toHaveURL(/category_ids=t1-cat-groceries/)
	const records = page.url()
	await expect(sheet).toBeVisible()
	await expectNoBack(page)
	await page.goBack()
	await expect(page).toHaveURL(origin)
	await expect(sheet).toHaveCount(0)
	await page.goForward()
	await expect(page).toHaveURL(records)
	await expect(sheet).toBeVisible()
	// Closing pops the entry the drill pushed, so no duplicate Dashboard entry is left behind.
	await page.keyboard.press("Escape")
	await expect(page).toHaveURL(origin)
	await expect(sheet).toHaveCount(0)
	await expectNoBack(page)
	await page.goForward()
	await expect(page).toHaveURL(records)
	await expect(sheet).toBeVisible()
})

test("delayed navigation: ordinary navigation survives an intervening inert click", async ({
	page,
}) => {
	await gotoReady(page, "/privacy")
	await expectNoBack(page)
	// Dispatch both clicks in one task so the paragraph click lands before
	// the route arrival commits the pending origin.
	await page.evaluate(() => {
		const link = document.querySelector('main a[href="/terms"]')
		const paragraph = document.querySelector("main p")
		if (!(link instanceof HTMLAnchorElement) || !(paragraph instanceof Element))
			throw new Error("Expected the Terms link and body copy")
		link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }))
		paragraph.dispatchEvent(
			new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
		)
	})
	await expect(page).toHaveURL(/\/terms$/)
	await expect(
		page.getByRole("button", { name: "Back to Privacy Policy", exact: true }),
	).toBeVisible()
	await page.getByRole("button", { name: "Back to Privacy Policy", exact: true }).click()
	await expect(page).toHaveURL(/\/privacy$/)
	await expectNoBack(page)
})

test("delayed navigation: ordinary navigation survives an intervening modified click", async ({
	page,
}) => {
	await gotoReady(page, "/privacy")
	await expectNoBack(page)
	await page.evaluate(() => {
		const link = document.querySelector('main a[href="/terms"]')
		if (!(link instanceof HTMLAnchorElement)) throw new Error("Expected the Terms link")
		link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }))
		const modifier = /Mac/.test(navigator.platform) ? { metaKey: true } : { ctrlKey: true }
		link.dispatchEvent(
			new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
				button: 0,
				...modifier,
			}),
		)
	})
	await expect(page).toHaveURL(/\/terms$/)
	await expect(
		page.getByRole("button", { name: "Back to Privacy Policy", exact: true }),
	).toBeVisible()
	await page.getByRole("button", { name: "Back to Privacy Policy", exact: true }).click()
	await expect(page).toHaveURL(/\/privacy$/)
	await expectNoBack(page)
})

test("scroll strip: on phones the chevrons reveal hidden pages and keep the active one in view", {
	tag: ["@mobile-only"],
}, async ({ page, workspace }) => {
	void workspace
	await gotoReady(page, "/budgets")
	const nav = page.getByRole("navigation", { name: "Main" })
	await expect(nav.getByRole("link", { name: "Budgets", exact: true })).toBeInViewport({
		ratio: 0.95,
	})
	const earlier = nav.getByRole("button", { name: "Show earlier items", exact: true })
	const later = nav.getByRole("button", { name: "Show later items", exact: true })
	await expect(later).toBeHidden()
	const dashboard = nav.getByRole("link", { name: "Dashboard", exact: true })
	await expect(dashboard).not.toBeInViewport()
	// Each press scrolls part of the strip; keep pressing until the start is reached.
	await expect(async () => {
		if (await earlier.isVisible()) await earlier.click()
		await expect(dashboard).toBeInViewport({ ratio: 0.95, timeout: 500 })
	}).toPass()
	await expect(earlier).toBeHidden()
	await expect(later).toBeVisible()
	await test.step("Settings sections: the active section stays in view", async () => {
		await gotoReady(page, "/sync")
		const sections = page.getByRole("navigation", { name: "Settings sections" })
		await expect(sections.getByRole("link", { name: "Data", exact: true })).toBeInViewport({
			ratio: 0.95,
		})
		await expect(
			sections.getByRole("button", { name: "Show earlier items", exact: true }),
		).toBeVisible()
	})
})

test("workflow tabs: do not capture history", async ({ page }) => {
	await gotoReady(page, "/allocator")
	await expectNoBack(page)
	const tabs = page.getByRole("navigation", { name: "Workflow views" })
	await tabs.getByRole("link", { name: "Replace Pending", exact: true }).click()
	await expect(page).toHaveURL(/\/allocator\/pending/)
	await expectNoBack(page)
	await tabs.getByRole("link", { name: "Fix Duplicates", exact: true }).click()
	await expect(page).toHaveURL(/\/allocator\/duplicates/)
	await expectNoBack(page)
	await tabs.getByRole("link", { name: "Allocate to Records", exact: true }).click()
	await expect(page).toHaveURL(/\/allocator(\?|$)/)
	await expectNoBack(page)
})

test("workflow tabs: established ordinary origin clears across tabs", async ({ page }) => {
	await gotoReady(page, "/privacy")
	await page.getByRole("link", { name: "Terms of Service", exact: true }).click()
	await expect(
		page.getByRole("button", { name: "Back to Privacy Policy", exact: true }),
	).toBeVisible()
	await gotoReady(page, "/allocator")
	await expect(
		page.getByRole("button", { name: "Back to Privacy Policy", exact: true }),
	).toBeVisible()
	await page
		.getByRole("navigation", { name: "Workflow views" })
		.getByRole("link", { name: "Replace Pending", exact: true })
		.click()
	await expect(page).toHaveURL(/\/allocator\/pending/)
	await expectNoBack(page)
})

test("stored history: malformed entries never crash and expose no Back entry", async ({ page }) => {
	const payloads = [
		"not-json{",
		"null",
		"{}",
		"[{}]",
		'[{"name":"","url":"/privacy"}]',
		'[{"name":"x","url":"https://evil.com/"}]',
		'[{"name":"x","url":"not-a-path"}]',
		JSON.stringify([{ name: "x", url: "//evil.com/" }]),
		JSON.stringify([{ name: "x", url: String.fromCharCode(47, 92) + "evil.com/" }]),
	]
	for (const payload of payloads) {
		await gotoReady(page, "/terms")
		await page.evaluate(stored => localStorage.setItem("history", stored), payload)
		await page.reload()
		await expect(page.locator("main h2").first()).toBeVisible()
		await expectNoBack(page)
	}
})

test("stored history: valid entries survive alongside invalid ones", async ({ page }) => {
	await gotoReady(page, "/terms")
	await page.evaluate(() =>
		localStorage.setItem(
			"history",
			JSON.stringify([
				{ name: "Privacy Policy", url: "/privacy" },
				{ junk: 1 },
				{ name: "Malformed", url: "//[" },
			]),
		),
	)
	await page.reload()
	await page.getByRole("button", { name: "Back to Privacy Policy", exact: true }).click()
	await expect(page).toHaveURL(/\/privacy$/)
})

test("reloaded detail: keeps its Back origin", async ({ page, workspace }) => {
	void workspace
	await gotoReady(page, "/statements")
	await page.locator('a[href="/statements/t1-s-groceries"]').filter({ visible: true }).click()
	// Reload only after the detail URL commits, or the reload lands on the list.
	await expect(page).toHaveURL(/\/statements\/t1-s-groceries$/)
	await expect(
		page.getByRole("button", { name: "Back to Statements", exact: true }),
	).toBeVisible()
	await page.reload()
	await expect(
		page.getByRole("button", { name: "Back to Statements", exact: true }),
	).toBeVisible()
	await page.getByRole("button", { name: "Back to Statements", exact: true }).click()
	await expect(page).toHaveURL(/\/statements(\?|$)/)
})

test("multifilter Unicode origin: returns exactly after reload", async ({ page, workspace }) => {
	void workspace
	await gotoReady(
		page,
		"/statements?query=K%C5%8Dpi&account_id=t1-acc-revolut&start_date=2026-10-01&end_date=2026-10-31",
	)
	const origin = page.url()
	await page.locator('a[href="/statements/t1-s-unicode"]').filter({ visible: true }).click()
	await expect(page).toHaveURL(/\/statements\/t1-s-/)
	await expect(
		page.getByRole("button", { name: "Back to Statements", exact: true }),
	).toBeVisible()
	await page.reload()
	await expect(
		page.getByRole("button", { name: "Back to Statements", exact: true }),
	).toBeVisible()
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Statements")
	await page.getByRole("button", { name: "Back to Statements", exact: true }).click()
	await expect(page).toHaveURL(origin)
})

test("rapid Back clicks: pop exactly once while navigation is pending", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/accounts?query=Everyday")
	await page.getByRole("heading", { name: "Everyday Savings", exact: true }).click()
	await expect(page).toHaveURL(/\/accounts\/t1-acc-dbs$/)
	await expect(page.getByRole("button", { name: "Back to Accounts", exact: true })).toBeVisible()
	const origin = page.url()
	await page.locator('a[href="/statements/t1-s-groceries"]').filter({ visible: true }).click()
	await expect(page).toHaveURL(/\/statements\/t1-s-groceries$/)
	await expect(
		page.getByRole("button", { name: "Back to Account Everyday Savings", exact: true }),
	).toBeVisible()
	// Two synchronous activations: the second lands while the first
	// navigation is still pending and must be ignored.
	await page
		.getByRole("button", { name: "Back to Account Everyday Savings", exact: true })
		.evaluate(back => {
			back.dispatchEvent(
				new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
			)
			back.dispatchEvent(
				new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
			)
		})
	await expect(page).toHaveURL(origin)
	await expect(page.getByRole("button", { name: "Back to Accounts", exact: true })).toBeVisible()
	await expect(page.getByRole("button", { name: /^Back to / })).toHaveCount(1)
})

test("detail fallback: keeps Back above its heading", async ({ page, workspace }) => {
	void workspace
	for (const [route, backName] of [
		["/accounts/t1-acc-dbs", "Back to Accounts"],
		["/budgets/t1-b-manual", "Back to Budgets"],
		["/records/t1-r-partial", "Back to Records"],
		["/statements/t1-s-pending", "Back to Statements"],
	] as const) {
		await gotoReady(page, route)
		await expectBackAboveHeadingFromHistoryRegressions(page, backName)
	}
})

test("encoded URL: Back pops an equivalent URL without becoming stuck disabled", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/statements?query=FairPrice+Run")
	// Exercise the runtime equal-target guard through a validated traversal
	// snapshot; fresh loads now discard their trailing self entries earlier.
	await expect(
		page.locator('a[href="/statements/t1-s-groceries"]').filter({ visible: true }),
	).toBeVisible()
	await page.evaluate(() => {
		window.dispatchEvent(
			new PopStateEvent("popstate", {
				state: {
					...history.state,
					finpointHistory: [
						{ name: "Privacy Policy", url: "/privacy" },
						{ name: "Statements", url: "/statements?query=FairPrice%20Run" },
					],
				},
			}),
		)
	})
	await page.getByRole("button", { name: "Back to Statements", exact: true }).click()
	const back = page.getByRole("button", { name: "Back to Privacy Policy", exact: true })
	await expect(back).toBeEnabled()
	await back.click()
	await expect(page).toHaveURL(/\/privacy$/)
})

test("ordinary navigation: keeps its captured origin across an intervening filter URL update", async ({
	page,
}) => {
	await gotoReady(page, "/privacy?query=before")
	await page.locator('main a[href="/terms"]').evaluate(link => {
		link.addEventListener(
			"click",
			() => window.history.replaceState(null, "", "/privacy?query=after"),
			{ once: true },
		)
	})
	await page.getByRole("link", { name: "Terms of Service", exact: true }).click()
	await expect(page).toHaveURL(/\/terms$/)
	await page.getByRole("button", { name: "Back to Privacy Policy", exact: true }).click()
	await expect(page).toHaveURL(/\/privacy\?query=before$/)
})

// Origin drills share one seed but reset the history provider between steps:
// each drill asserts an exact origin that a previous drill's entries would
// otherwise pollute. Clearing localStorage then navigating starts each drill
// with the same empty history a fresh context would have.
test("keyboard origins: Records, Statements, Accounts, Budgets and Categories drills keep exact origins", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	const reset = async (origin: string) => {
		await page.evaluate(() => localStorage.clear())
		await page.goto(origin)
	}
	await test.step("Records list: keyboard opens the Record editor over the filtered list", async () => {
		const origin =
			"/records?query=FairPrice+Run&page=1&per_page=5&start_date=2026-10-01&end_date=2026-10-31&min_amount=-100&max_amount=0"
		await reset(origin)
		const open = page
			.getByRole("link", { name: "Open FairPrice Run", exact: true })
			.filter({ visible: true })
			.first()
		await expect(open).toBeVisible()
		await open.focus()
		await page.keyboard.press("Enter")
		// The Record opens over its list: nothing navigates, so there is no origin to lose.
		const editor = page.getByRole("dialog", { name: "Record", exact: true })
		await expect(editor).toBeVisible()
		await expect(editor).toContainText("FairPrice Run")
		// The preview opens on Edit, so the keyboard can go straight on to the form.
		await expect(editor.getByRole("button", { name: "Edit", exact: true })).toBeFocused()
		await expect(page).toHaveURL(origin)
		await page.keyboard.press("Escape")
		await expect(editor).toHaveCount(0)
		await expect(page).toHaveURL(origin)
		await expect(open).toBeFocused()
	})
	await test.step("Statements list: keyboard filtered list to detail to Back keeps exact origin", async () => {
		const origin =
			"/statements?query=STARBUCKS&page=1&per_page=5&start_date=2026-10-01&end_date=2026-10-31&min_amount=-10&max_amount=0"
		await reset(origin)
		// The description renders in both the mobile list and the desktop table;
		// exactly one is visible per viewport.
		await expect(
			page.locator("main").getByText("STARBUCKS 4455").filter({ visible: true }).first(),
		).toBeVisible()
		const open = page.locator('a[href^="/statements/"]').filter({ visible: true }).first()
		await expect(open).toBeVisible()
		await open.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/\/statements\/t1-s-free-1/)
		await keyboardBack(page, "Back to Statements", origin)
	})
	await test.step("Account card: keyboard card to detail to Back keeps exact origin", async () => {
		const origin = "/accounts?query=One+Card"
		await reset(origin)
		const card = page
			.locator("article", { has: page.getByRole("heading", { name: "One Card" }) })
			.first()
		await expect(card).toBeVisible()
		await card.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/\/accounts\/t1-acc-uob/)
		await keyboardBack(page, "Back to Accounts", origin)
	})
	await test.step("Budget card: keyboard card Enter to detail to Back keeps exact origin", async () => {
		const origin = "/budgets?query=October+Buffer"
		await reset(origin)
		const card = page.locator("article", { hasText: "October Buffer" }).first()
		await expect(card).toBeVisible()
		await card.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/\/budgets\/t1-b-manual/)
		await keyboardBack(page, "Back to Budgets", origin)
	})
	await test.step("Budget drill: keyboard opens a Record over the Budget and Back returns to Budgets", async () => {
		await reset("/budgets?query=October+Buffer")
		const card = page.locator("article", { hasText: "October Buffer" }).first()
		await expect(card).toBeVisible()
		await card.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/\/budgets\/t1-b-manual/)
		const budgetUrl = page.url()
		await expect(
			page.getByRole("button", { name: "Back to Budgets", exact: true }),
		).toBeVisible()
		const open = page
			.getByRole("link", { name: "Open FairPrice Run", exact: true })
			.filter({ visible: true })
			.first()
		await open.focus()
		await page.keyboard.press("Enter")
		// The Record opens over the Budget, so Budgets stays the only origin.
		const editor = page.getByRole("dialog", { name: "Record", exact: true })
		await expect(editor).toBeVisible()
		await expect(page).toHaveURL(budgetUrl)
		await page.keyboard.press("Escape")
		await expect(editor).toHaveCount(0)
		await keyboardBack(page, "Back to Budgets", /\/budgets(\?|$)/)
	})
})

test("navigation history: Budget drill, fallbacks and static links preserve history", async ({
	page,
	workspace,
}) => {
	void workspace
	await test.step("Budget drill: a Record opens over the Budget and Back returns to Budgets", async () => {
		void workspace
		await resetHistory(page, "/budgets?query=October+Buffer")
		await page.locator("article", { hasText: "October Buffer" }).first().click()
		await expect(page).toHaveURL(/\/budgets\/t1-b-manual$/)
		await expect(
			page.getByRole("button", { name: "Back to Budgets", exact: true }),
		).toBeVisible()
		const origin = page.url()
		const back = await page
			.getByRole("button", { name: "Back to Budgets", exact: true })
			.boundingBox()
		const heading = await page
			.getByRole("heading", { name: "October Buffer", level: 2, exact: true })
			.boundingBox()
		if (!back || !heading) throw new Error("Back button and heading must have layout boxes")
		expect(back.y + back.height).toBeLessThan(heading.y)
		// A Record opens over the Budget, so the drill stack still ends at Budgets.
		await page
			.getByRole("link", { name: "Open FairPrice Run", exact: true })
			.filter({ visible: true })
			.first()
			.click()
		const editor = page.getByRole("dialog", { name: "Record", exact: true })
		await expect(editor).toBeVisible()
		await expect(page).toHaveURL(origin)
		await page.keyboard.press("Escape")
		await expect(editor).toHaveCount(0)
		await expect(page).toHaveURL(origin)
		await page.getByRole("button", { name: "Back to Budgets", exact: true }).click()
		await expect(page).toHaveURL(/\/budgets\?query=October\+Buffer$/)
	})
	for (const [route, name, fallback] of [
		["/accounts/t1-acc-dbs", "Accounts", "/accounts"],
		["/budgets/t1-b-manual", "Budgets", "/budgets"],
		["/records/t1-r-partial", "Records", "/records"],
		["/statements/t1-s-pending", "Statements", "/statements"],
	] as const) {
		await test.step(`direct ${name} detail: has a working fallback`, async () => {
			await resetHistory(page, route)
			await page.getByRole("button", { name: new RegExp(`^Back to ${name}$`, "i") }).click()
			await expect(page).toHaveURL(new RegExp(`${fallback}(\\?|$)`))
		})
	}
	await test.step("static-page links: preserve nested back history", async () => {
		await resetHistory(page, "/sync")
		await page.getByRole("link", { name: "Privacy Policy", exact: true }).click()
		await expect(page.getByRole("button", { name: /^Back to / })).toBeVisible()
		await page.getByRole("link", { name: "Terms of Service", exact: true }).click()
		// Privacy's own Back matches /^Back to / until Terms commits: wait for Terms.
		await expect(page).toHaveURL(/\/terms$/)
		await page.getByRole("button", { name: "Back to Privacy Policy", exact: true }).click()
		await expect(page).toHaveURL(/\/privacy$/)
		// A successful Back unmounts its own button mid-tap on touch
		// viewports while the navigation still commits, hanging the tap on
		// the detached target. Bound the tap and keep the strict URL proof.
		// TODO: the hang mechanism is inferred from a completion-less trace, not
		// proven (e.g. actionability retry vs post-action wait). If a real mobile
		// Back defect ever hides behind this catch, split tap and navigation
		// proof instead.
		await page
			.getByRole("button", { name: /^Back to / })
			.click({ timeout: 5000 })
			.catch(() => undefined)
		await expect(page).toHaveURL(/\/sync$/)
	})
})

test("history clearing: cancelled links, top navigation and chart drills clear or preserve history", async ({
	page,
	workspace,
}) => {
	void workspace
	await test.step("cancelled links: do not add a back destination", async () => {
		await resetHistory(page, "/privacy")
		const link = page.getByRole("link", { name: "Terms of Service", exact: true })
		await link.evaluate(element =>
			element.addEventListener("click", event => event.preventDefault(), { once: true }),
		)
		await link.click()
		await expect(page).toHaveURL(/\/privacy$/)
		await expect(page.getByRole("button", { name: /^Back to / })).toHaveCount(0)
		// A subsequent real navigation must record exactly one origin.
		await link.click()
		await page.getByRole("button", { name: "Back to Privacy Policy", exact: true }).click()
		await expect(page).toHaveURL(/\/privacy$/)
		await expect(page.getByRole("button", { name: /^Back to / })).toHaveCount(0)
	})
	await test.step("top navigation: clears drill history", async () => {
		await resetHistory(page, "/privacy")
		await page.getByRole("link", { name: "Terms of Service", exact: true }).click()
		await expect(page.getByRole("button", { name: /^Back to / })).toBeVisible()
		await page
			.getByRole("navigation", { name: "Main", exact: true })
			.getByRole("link", { name: "Dashboard", exact: true })
			.click()
		// The navigation clears history at once, so Terms can lose its Back before Dashboard commits.
		await expect(page).toHaveURL(/\/(\?|$)/)
		await expect(page.getByRole("button", { name: /^Back to / })).toHaveCount(0)
	})
	await test.step("chart drill: a Record opens over the Records sheet and closes back to it", async () => {
		const origin = "/?month=October&year=2026&scope=all"
		await resetHistory(page, origin)
		await page.getByRole("button", { name: /^5 October: \$84.20 spent/ }).click()
		await expect(page).toHaveURL(/start_date=2026-10-05/)
		const sheet = page.getByRole("dialog", { name: "Records", exact: true })
		await expect(sheet).toBeVisible()
		await expectNoBack(page)
		const drilled = page.url()
		await sheet.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
		const editor = page.getByRole("dialog", { name: "Record", exact: true })
		await expect(editor).toBeVisible()
		await expect(page).toHaveURL(drilled)
		// Escape closes the Record first and leaves the sheet it was opened from.
		await page.keyboard.press("Escape")
		await expect(editor).toHaveCount(0)
		await expect(sheet).toBeVisible()
		await expect(page).toHaveURL(drilled)
		await expectNoBack(page)
		await page.keyboard.press("Escape")
		await expect(page).toHaveURL(origin)
	})
})

test("Back button: returns to its origin when pressed as soon as a drilled Statement appears", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/statements?account_id=t1-acc-dbs")
	const origin = page.url()
	await expect(
		page.locator('a[href="/statements/t1-s-groceries"]').filter({ visible: true }),
	).toBeVisible()
	// Click Back from inside the page on the first frame it exists, before the drill's URL
	// commits: the drill must not override the back navigation.
	await page.evaluate(() => {
		const link = document.querySelector('a[href="/statements/t1-s-groceries"]')
		if (!(link instanceof HTMLElement))
			throw new Error("Expected the FairPrice Run Statement link")
		link.click()
		const pressBack = () => {
			const back = [...document.querySelectorAll("button")].find(button =>
				button.textContent?.trim().startsWith("Back to Statements"),
			)
			if (!back) {
				requestAnimationFrame(pressBack)
				return
			}
			back.click()
			Reflect.set(window, "__pressedBack", true)
		}
		requestAnimationFrame(pressBack)
	})
	// The origin URL holds before the drill commits too: prove Back was pressed first.
	await expect.poll(() => page.evaluate(() => Reflect.get(window, "__pressedBack"))).toBe(true)
	await expect(page).toHaveURL(origin)
	await page.waitForTimeout(1000)
	await expect(page).toHaveURL(origin)
	await expect(
		page.locator('a[href="/statements/t1-s-groceries"]').filter({ visible: true }),
	).toBeVisible()
})

test("Back button: the outgoing page's Back cancels a drill link that is still loading", async ({
	page,
	workspace,
}) => {
	void workspace
	await resetHistory(page, "/accounts?query=Everyday")
	const origin = page.url()
	await page.getByRole("heading", { name: "Everyday Savings", exact: true }).click()
	await expect(page).toHaveURL(/\/accounts\/t1-acc-dbs$/)
	const back = page.getByRole("button", { name: "Back to Accounts", exact: true })
	await expect(back).toBeEnabled()
	// Hold the Statement route so the drill is still loading when Back is pressed.
	const { promise: held, resolve: release } = Promise.withResolvers<void>()
	let requested = false
	await page.route(/\/statements\/t1-s-groceries/, async route => {
		requested = true
		await held
		await route.continue()
	})
	await page
		.locator('a[href="/statements/t1-s-groceries"]')
		.filter({ visible: true })
		.click({ noWaitAfter: true })
	await expect.poll(() => requested).toBe(true)
	await back.click()
	release()
	await expect(page).toHaveURL(origin)
	await expect(page.getByRole("heading", { name: "Everyday Savings", exact: true })).toBeVisible()
	await page.unrouteAll({ behavior: "wait" })
	await expect(page).toHaveURL(origin)
	await expect(page.getByRole("heading", { name: "FairPrice Run" })).toHaveCount(0)
})

test("Back button: a history restore while a drill link loads keeps its restored entries", async ({
	page,
	workspace,
}) => {
	void workspace
	await resetHistory(page, "/accounts?query=Everyday")
	await page.getByRole("heading", { name: "Everyday Savings", exact: true }).click()
	await expect(page).toHaveURL(/\/accounts\/t1-acc-dbs$/)
	const records = new URL(page.url())
	const { promise: held, resolve: release } = Promise.withResolvers<void>()
	let requested = false
	await page.route(/\/statements\/t1-s-groceries/, async route => {
		requested = true
		await held
		await route.continue()
	})
	await page
		.locator('a[href="/statements/t1-s-groceries"]')
		.filter({ visible: true })
		.click({ noWaitAfter: true })
	await expect.poll(() => requested).toBe(true)
	// A same-URL restore lands while the drill is pending: its equivalent-URL entry is
	// visible and must consume exactly one Back click, like any restored entry.
	await page.evaluate(self => {
		window.dispatchEvent(
			new PopStateEvent("popstate", {
				state: {
					...history.state,
					finpointHistory: [
						{ name: "Privacy Policy", url: "/privacy" },
						{ name: "Records", url: self },
					],
				},
			}),
		)
	}, records.pathname + records.search)
	await page.getByRole("button", { name: "Back to Records", exact: true }).click()
	await expect(
		page.getByRole("button", { name: "Back to Privacy Policy", exact: true }),
	).toBeVisible()
	release()
	await page.unrouteAll({ behavior: "wait" })
})

test("month navigation: two fast clicks on Next month advance two months", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto("/?month=October&year=2026")
	const next = page.getByRole("button", { name: "Next month", exact: true })
	await expect(page.getByRole("heading", { name: "October 2026" })).toBeVisible()
	// The second click lands once the first navigation has rendered (the heading shows the
	// optimistic month) or a frame has passed, and it must find the URL still on October: the
	// first navigation has not committed.
	const urlAtSecondClick = await next.evaluate(
		(button: HTMLButtonElement) =>
			new Promise<string>(resolve => {
				let clicked = false
				const clickAgain = () => {
					if (clicked) return
					clicked = true
					observer.disconnect()
					const url = location.search
					button.click()
					resolve(url)
				}
				const observer = new MutationObserver(() => {
					const rendered = [...document.querySelectorAll("h1, h2, h3")].some(heading =>
						heading.textContent?.includes("November 2026"),
					)
					if (rendered) clickAgain()
				})
				observer.observe(document.body, {
					childList: true,
					subtree: true,
					characterData: true,
				})
				button.click()
				requestAnimationFrame(() => requestAnimationFrame(clickAgain))
			}),
	)
	expect(urlAtSecondClick).toContain("month=October")
	await expect(page).toHaveURL(/month=December&year=2026/)
	await expect(page.getByRole("heading", { name: "December 2026" })).toBeVisible()
})

test("duplicates search: typing filters the list and one Back undoes the search", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto("/allocator/duplicates?view=all")
	const search = page.getByRole("textbox", { name: "Search statement descriptions" })
	await expect(page.getByText("GRAB RIDE 7712").first()).toBeVisible()
	const entries = await page.evaluate(() => history.length)
	await search.pressSequentially("DONKI", { delay: 40 })
	await expect(search).toHaveValue("DONKI")
	await expect(page).toHaveURL(/query=DONKI$/)
	await expect(page.getByText("GRAB RIDE 7712")).toHaveCount(0)
	await expect(page.getByText("DON DON DONKI PURCHASE 8821").first()).toBeVisible()
	expect(await page.evaluate(() => history.length)).toBe(entries + 1)
	await page.goBack()
	await expect(page).not.toHaveURL(/query=/)
	await expect(search).toHaveValue("")
	await expect(page.getByText("GRAB RIDE 7712").first()).toBeVisible()
})

test.describe("pending queue URL state", () => {
	test.use({ workspaceScenario: "dense" })
	const queueSearch = (page: Page) =>
		page
			.locator('section[aria-label="Pending statements"]')
			.getByPlaceholder("Search descriptions...")

	test("pending queue: a row chosen while an Account filter is pending keeps that filter", async ({
		page,
		workspace,
	}) => {
		void workspace
		await page.goto("/allocator/pending")
		const queue = page.locator('section[aria-label="Pending statements"]')
		const row = queue.locator("button[aria-pressed]").first()
		await expect(row).toBeVisible()
		const account = (await row.innerText()).match(/Dense Account \d+/)?.[0] ?? ""
		expect(account).not.toBe("")
		await queue.locator('[data-slot="select-trigger"]').first().click()
		const option = page.getByRole("option", { name: account, exact: true })
		await expect(async () => {
			await option.hover({ position: { x: 8, y: 8 } })
			await expect(option).toHaveAttribute("data-highlighted", "", { timeout: 250 })
		}).toPass({ timeout: 5000 })
		// The row is chosen after the filter's optimistic render but before its navigation
		// commits: a microtask later, in the same task.
		await page.evaluate(async () => {
			document.querySelector<HTMLElement>('[role="option"][data-highlighted]')?.click()
			await Promise.resolve()
			document
				.querySelector<HTMLElement>(
					'section[aria-label="Pending statements"] button[aria-pressed]',
				)
				?.click()
		})
		await expect(page).toHaveURL(/pending_statement_id=/)
		await expect(page).toHaveURL(/account_id=t1-d-acc-\d+/)
	})

	test("pending queue: one Back undoes a search and restores the URL and the box", async ({
		page,
		workspace,
	}) => {
		void workspace
		await page.goto("/allocator/pending")
		const search = queueSearch(page)
		await expect(search).toBeVisible()
		const entries = await page.evaluate(() => history.length)
		await search.pressSequentially("Dense pending 2", { delay: 40 })
		await expect(search).toHaveValue("Dense pending 2")
		await expect(page).toHaveURL(/query=Dense\+pending\+2$/)
		expect(await page.evaluate(() => history.length)).toBe(entries + 1)
		await page.goBack()
		await expect(page).not.toHaveURL(/query=/)
		await expect(search).toHaveValue("")
		await page.goForward()
		await expect(page).toHaveURL(/query=Dense\+pending\+2$/)
		await expect(search).toHaveValue("Dense pending 2")
	})

	test("pending queue: Back pressed right after typing restores the URL and the box", async ({
		page,
		workspace,
	}) => {
		void workspace
		await page.goto("/allocator/pending")
		const search = queueSearch(page)
		await expect(search).toBeVisible()
		await search.fill("Dense pending 1")
		await expect(page).toHaveURL(/query=Dense\+pending\+1$/)
		// Type and press Back in one task, before the typed search commits.
		await page.evaluate(() => {
			const input = document.querySelector<HTMLInputElement>(
				'section[aria-label="Pending statements"] input[placeholder="Search descriptions..."]',
			)
			const setValue = Object.getOwnPropertyDescriptor(
				HTMLInputElement.prototype,
				"value",
			)?.set
			setValue?.call(input, "Dense pending 12")
			input?.dispatchEvent(new Event("input", { bubbles: true }))
			history.back()
		})
		await expect(page).not.toHaveURL(/query=/)
		await expect(search).toHaveValue("")
		await page.waitForTimeout(650)
		await expect(page).not.toHaveURL(/query=/)
		await expect(search).toHaveValue("")
	})
})
