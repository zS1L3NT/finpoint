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
	await gotoReady(page, "/records?query=FairPrice")
	const origin = page.url()
	await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
	await expect(page).toHaveURL(/\/records\/t1-r-groceries$/)
	const detail = page.url()
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Records")
	await page.evaluate(origin => {
		const url = new URL(origin)
		history.replaceState(
			{
				...history.state,
				finpointHistory: [
					{ name: "Invalid", url: "//[" },
					{ name: "Records", url: url.pathname + url.search },
				],
			},
			"",
		)
	}, origin)
	await page.goBack()
	await expect(page).toHaveURL(origin)
	await page.goForward()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Records")
	await page.getByRole("button", { name: "Back to Records", exact: true }).click()
	await expect(page).toHaveURL(origin)
	expect(errors).toEqual([])
})

test("nested drill: browser Back and Forward restore filtered drill with usable exact Back controls", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/categories?query=Groceries")
	const origin = page.url()
	await page.getByRole("link", { name: "Open Records for Groceries", exact: true }).click()
	await expect(page).toHaveURL(/\/records\?category_ids=t1-cat-groceries/)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Categories")
	const records = page.url()
	await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
	await expect(page).toHaveURL(/\/records\/t1-r-groceries$/)
	const detail = page.url()
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Records")
	await page.goBack()
	await expect(page).toHaveURL(records)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Categories")
	await expect(page.getByRole("button", { name: "Back to Records", exact: true })).toHaveCount(0)
	await page.goBack()
	await expect(page).toHaveURL(origin)
	await expectNoBack(page)
	await page.goForward()
	await expect(page).toHaveURL(records)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Categories")
	await page.goForward()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Records")
	await page.getByRole("button", { name: "Back to Records", exact: true }).click()
	await expect(page).toHaveURL(records)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Categories")
	await page.getByRole("button", { name: "Back to Categories", exact: true }).click()
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
	await gotoReady(page, "/records?category_ids=t1-cat-groceries")
	const firstOrigin = page.url()
	await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
	await expect(page).toHaveURL(/\/records\/t1-r-groceries$/)
	const detail = page.url()
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Records")
	await page.getByRole("button", { name: "Back to Records", exact: true }).click()
	await expect(page).toHaveURL(firstOrigin)
	await page
		.getByPlaceholder("Search title, people, location, description...")
		.fill("FairPrice Run")
	await expect(page).toHaveURL(/query=FairPrice\+Run/)
	const secondOrigin = page.url()
	expect(secondOrigin).not.toBe(firstOrigin)
	await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Records")
	await page.goBack()
	await expect(page).toHaveURL(secondOrigin)
	await expectNoBack(page)
	await page.goBack()
	await expect(page).toHaveURL(firstOrigin)
	await page.goBack()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Records")
	await page.goForward()
	await expect(page).toHaveURL(firstOrigin)
	await page.goForward()
	await expect(page).toHaveURL(secondOrigin)
	await page.goForward()
	await expect(page).toHaveURL(detail)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Records")
	await page.getByRole("button", { name: "Back to Records", exact: true }).click()
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
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Records")
	await page.getByRole("button", { name: "Back to Records", exact: true }).click()
	await expect(page).toHaveURL(firstOrigin)
})

test("monthly shell: browser Back removes self-target and Forward restores its chart origin", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/?month=October&year=2026")
	const origin = page.url()
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
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to overview")
	await page.goBack()
	await expect(page).toHaveURL(origin)
	await expectNoBack(page)
	await page.goForward()
	await expect(page).toHaveURL(records)
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to overview")
	await page.getByRole("button", { name: "Back to overview", exact: true }).click()
	await expect(page).toHaveURL(origin)
	await expectNoBack(page)
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
	await gotoReady(page, "/records")
	await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
	// Reload only after the detail URL commits, or the reload lands on the list.
	await expect(page).toHaveURL(/\/records\/t1-r-groceries$/)
	await expect(page.getByRole("button", { name: "Back to Records", exact: true })).toBeVisible()
	await page.reload()
	await expect(page.getByRole("button", { name: "Back to Records", exact: true })).toBeVisible()
	await page.getByRole("button", { name: "Back to Records", exact: true }).click()
	await expect(page).toHaveURL(/\/records(\?|$)/)
})

test("multifilter Unicode origin: returns exactly after reload", async ({ page, workspace }) => {
	void workspace
	await gotoReady(
		page,
		"/records?query=K%C5%8Dpi&category_ids=t1-cat-groceries&start_date=2026-10-01&end_date=2026-10-31",
	)
	const origin = page.url()
	await page.getByRole("link", { name: /^Open Kōpi/ }).click()
	await expect(page).toHaveURL(/\/records\/t1-r-/)
	await expect(page.getByRole("button", { name: "Back to Records", exact: true })).toBeVisible()
	await page.reload()
	await expect(page.getByRole("button", { name: "Back to Records", exact: true })).toBeVisible()
	await expectBackAboveHeadingFromHistoryRegressions(page, "Back to Records")
	await page.getByRole("button", { name: "Back to Records", exact: true }).click()
	await expect(page).toHaveURL(origin)
})

test("rapid Back clicks: pop exactly once while navigation is pending", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/categories?query=Groceries")
	await page.getByRole("link", { name: "Open Records for Groceries", exact: true }).click()
	await expect(page).toHaveURL(/\/records\?category_ids=t1-cat-groceries$/)
	await expect(
		page.getByRole("button", { name: "Back to Categories", exact: true }),
	).toBeVisible()
	const origin = page.url()
	await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
	await expect(page).toHaveURL(/\/records\/t1-r-groceries$/)
	await expect(page.getByRole("button", { name: "Back to Records", exact: true })).toBeVisible()
	// Two synchronous activations: the second lands while the first
	// navigation is still pending and must be ignored.
	await page.getByRole("button", { name: "Back to Records", exact: true }).evaluate(back => {
		back.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }))
		back.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }))
	})
	await expect(page).toHaveURL(origin)
	await expect(
		page.getByRole("button", { name: "Back to Categories", exact: true }),
	).toBeVisible()
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
	await gotoReady(page, "/records?query=FairPrice+Run")
	// Exercise the runtime equal-target guard through a validated traversal
	// snapshot; fresh loads now discard their trailing self entries earlier.
	await expect(page.getByRole("link", { name: "Open FairPrice Run", exact: true })).toBeVisible()
	await page.evaluate(() => {
		window.dispatchEvent(
			new PopStateEvent("popstate", {
				state: {
					...history.state,
					finpointHistory: [
						{ name: "Privacy Policy", url: "/privacy" },
						{ name: "Records", url: "/records?query=FairPrice%20Run" },
					],
				},
			}),
		)
	})
	await page.getByRole("button", { name: "Back to Records", exact: true }).click()
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
	await test.step("Records list: keyboard filtered list to detail to Back keeps exact origin", async () => {
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
		await expect(page).toHaveURL(/\/records\/t1-r-groceries/)
		await keyboardBack(page, "Back to Records", origin)
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
		const open = page
			.getByRole("link", { name: "Open statement", exact: true })
			.filter({ visible: true })
			.first()
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
	await test.step("Categories drill: nested keyboard drill returns through exact origins", async () => {
		// No /categories/[id] route exists: drill into filtered Records instead.
		await reset("/categories?query=Groceries")
		await expect(
			page.getByRole("button", { name: "Edit Groceries", exact: true }),
		).toBeVisible()
		const drill = page.getByRole("link", { name: "Open Records for Groceries", exact: true })
		await drill.focus()
		await page.keyboard.press("Enter")
		const recordsOrigin = new RegExp("/records\\?category_ids=t1-cat-groceries")
		await expect(page).toHaveURL(recordsOrigin)
		const recordsUrl = page.url()
		await expect(
			page.getByRole("button", { name: "Back to Categories", exact: true }),
		).toBeVisible()
		const open = page
			.getByRole("link", { name: "Open FairPrice Run", exact: true })
			.filter({ visible: true })
			.first()
		await open.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/\/records\/t1-r-groceries/)
		await keyboardBack(page, "Back to Records", recordsUrl)
		await keyboardBack(page, "Back to Categories", /\/categories(\?|$)/)
	})
})

test("navigation history: Category drill, fallbacks and static links preserve history", async ({
	page,
	workspace,
}) => {
	void workspace
	await test.step("Category drill: nested detail returns to exact filtered origins", async () => {
		void workspace
		await resetHistory(page, "/categories?query=Groceries")
		await page.getByRole("link", { name: "Open Records for Groceries", exact: true }).click()
		await expect(page).toHaveURL(/\/records\?category_ids=t1-cat-groceries$/)
		await expect(
			page.getByRole("button", { name: "Back to Categories", exact: true }),
		).toBeVisible()
		const origin = page.url()
		const back = await page
			.getByRole("button", { name: "Back to Categories", exact: true })
			.boundingBox()
		const heading = await page
			.getByRole("heading", { name: "Records", level: 2, exact: true })
			.boundingBox()
		if (!back || !heading) throw new Error("Back button and heading must have layout boxes")
		expect(back.y + back.height).toBeLessThan(heading.y)
		await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
		// Let the drill commit first: a Back pressed while it is still finishing can be
		// overridden by it (.scratch/ui-regression/issues/12-back-during-pending-drill.md).
		await expect(
			page.getByRole("heading", { name: "FairPrice Run", level: 2, exact: true }),
		).toBeVisible()
		await page.getByRole("button", { name: "Back to Records", exact: true }).click()
		await expect(page).toHaveURL(origin)
		await page.getByRole("button", { name: "Back to Categories", exact: true }).click()
		await expect(page).toHaveURL(/\/categories\?query=Groceries$/)
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

test("history clearing: cancelled links, sidebar, tabs and chart drills clear or preserve history", async ({
	page,
	workspace,
	isMobile,
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
	await test.step("sidebar and month tabs: clear drill history", async () => {
		await resetHistory(page, "/privacy")
		await page.getByRole("link", { name: "Terms of Service", exact: true }).click()
		await expect(page.getByRole("button", { name: /^Back to / })).toBeVisible()
		if (isMobile) await page.locator('header [data-slot="sidebar-trigger"]').click()
		// Desktop and mobile sidebars both render a Dashboard link; only one is visible.
		await page
			.getByRole("link", { name: "Dashboard", exact: true })
			.filter({ visible: true })
			.click()
		// The sidebar clears history at once, so Terms can lose its Back before Dashboard commits.
		await expect(page).toHaveURL(/\/(\?|$)/)
		await expect(page.getByRole("button", { name: /^Back to / })).toHaveCount(0)
		await page
			.getByRole("navigation", { name: "Monthly finance views" })
			.getByRole("link", { name: "Monthly Records", exact: true })
			.click()
		await expect(page).toHaveURL(/\/records\/monthly/)
		await expect(page.getByRole("button", { name: /^Back to / })).toHaveCount(0)
	})
	await test.step("chart drill: nested Record returns through filtered overview", async () => {
		const origin = "/?month=October&year=2026&scope=all"
		await resetHistory(page, origin)
		await page.getByRole("button", { name: /^5 October: \$84.20 spent/ }).click()
		await expect(page).toHaveURL(/start_date=2026-10-05/)
		const back = page.getByRole("button", { name: /^Back to overview$/i })
		await expect(back).toBeVisible()
		const backBox = await back.boundingBox()
		const headingBox = await page
			.getByRole("heading", { name: "October 2026", level: 2 })
			.boundingBox()
		if (!backBox || !headingBox)
			throw new Error("Back and month heading must have layout boxes")
		expect(backBox.y + backBox.height).toBeLessThan(headingBox.y)
		const monthly = page.url()
		await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
		// The monthly page's own Back matches /^Back to / until the Record commits.
		await expect(page).toHaveURL(/\/records\/t1-r-groceries$/)
		await page.getByRole("button", { name: "Back to Monthly Records", exact: true }).click()
		await expect(page).toHaveURL(monthly)
		await back.click()
		await expect(page).toHaveURL(origin)
	})
})

test("Back button: returns to its origin when pressed as soon as a drilled Record appears", async ({
	page,
	workspace,
}) => {
	void workspace
	await gotoReady(page, "/records?category_ids=t1-cat-groceries")
	const origin = page.url()
	await expect(page.getByRole("link", { name: "Open FairPrice Run", exact: true })).toBeVisible()
	// Click Back from inside the page on the first frame it exists, before the drill's URL
	// commits: the drill must not override the back navigation.
	await page.evaluate(() => {
		const link = document.querySelector('a[aria-label="Open FairPrice Run"]')
		if (!(link instanceof HTMLElement)) throw new Error("Expected the FairPrice Run link")
		link.click()
		const pressBack = () => {
			const back = [...document.querySelectorAll("button")].find(button =>
				button.textContent?.trim().startsWith("Back to Records"),
			)
			if (!back) return requestAnimationFrame(pressBack)
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
	await expect(page.getByRole("link", { name: "Open FairPrice Run", exact: true })).toBeVisible()
})

test("Back button: the outgoing page's Back cancels a drill link that is still loading", async ({
	page,
	workspace,
}) => {
	void workspace
	const origin = "/?month=October&year=2026&scope=all"
	await resetHistory(page, origin)
	await page.getByRole("button", { name: /^5 October: \$84.20 spent/ }).click()
	await expect(page).toHaveURL(/start_date=2026-10-05/)
	const back = page.getByRole("button", { name: "Back to overview", exact: true })
	await expect(back).toBeEnabled()
	// Hold the Record route so the drill is still loading when Back is pressed.
	const { promise: held, resolve: release } = Promise.withResolvers<void>()
	let requested = false
	await page.route(/\/records\/t1-r-groceries/, async route => {
		requested = true
		await held
		await route.continue()
	})
	await page
		.getByRole("link", { name: "Open FairPrice Run", exact: true })
		.click({ noWaitAfter: true })
	await expect.poll(() => requested).toBe(true)
	await back.click()
	release()
	await expect(page).toHaveURL(origin)
	await expect(page.getByRole("heading", { name: "October 2026", level: 2 })).toBeVisible()
	await page.unrouteAll({ behavior: "wait" })
	await expect(page).toHaveURL(origin)
	await expect(page.getByRole("heading", { name: "FairPrice Run" })).toHaveCount(0)
})

test("Back button: a history restore while a drill link loads keeps its restored entries", async ({
	page,
	workspace,
}) => {
	void workspace
	await resetHistory(page, "/?month=October&year=2026&scope=all")
	await page.getByRole("button", { name: /^5 October: \$84.20 spent/ }).click()
	await expect(page).toHaveURL(/start_date=2026-10-05/)
	const monthly = new URL(page.url())
	const { promise: held, resolve: release } = Promise.withResolvers<void>()
	let requested = false
	await page.route(/\/records\/t1-r-groceries/, async route => {
		requested = true
		await held
		await route.continue()
	})
	await page
		.getByRole("link", { name: "Open FairPrice Run", exact: true })
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
						{ name: "Monthly Records", url: self },
					],
				},
			}),
		)
	}, monthly.pathname + monthly.search)
	await page.getByRole("button", { name: "Back to Monthly Records", exact: true }).click()
	await expect(
		page.getByRole("button", { name: "Back to Privacy Policy", exact: true }),
	).toBeVisible()
	release()
	await page.unrouteAll({ behavior: "wait" })
})
