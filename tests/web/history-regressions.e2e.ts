import type { Page } from "@playwright/test"
import { expect, test } from "./support/fixtures"

async function expectBackAboveHeading(page: Page, backName: string) {
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

test.describe("history regressions", () => {
	test("a fresh Account root drops its persisted self-target without a dead Back click", async ({
		page,
		workspace,
	}) => {
		void workspace
		await gotoReady(page, "/accounts?query=Everyday")
		await page.getByRole("heading", { name: "Everyday Savings", exact: true }).click()
		await expect(page).toHaveURL(/\/accounts\/t1-acc-dbs$/)
		await expectBackAboveHeading(page, "Back to Accounts")
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

	test("an ordinary link cycle preserves the latest distinct origin across browser traversal", async ({
		page,
	}) => {
		await gotoReady(page, "/terms")
		await page
			.locator("main")
			.getByRole("link", { name: "Privacy Policy", exact: true })
			.click()
		await expect(page).toHaveURL(/\/privacy$/)
		await page
			.locator("main")
			.getByRole("link", { name: "Terms of Service", exact: true })
			.click()
		await expect(page).toHaveURL(/\/terms$/)
		await expectBackAboveHeading(page, "Back to Privacy Policy")
		await page.goBack()
		await expect(page).toHaveURL(/\/privacy$/)
		await expectBackAboveHeading(page, "Back to Terms of Service")
		await page.goForward()
		await expect(page).toHaveURL(/\/terms$/)
		await expectBackAboveHeading(page, "Back to Privacy Policy")
		await page.getByRole("button", { name: "Back to Privacy Policy", exact: true }).click()
		await expect(page).toHaveURL(/\/privacy$/)
	})

	test("browser Back returns to the Account root without a self-target and Forward restores its exact origin", async ({
		page,
		workspace,
	}) => {
		void workspace
		await gotoReady(page, "/accounts?query=Everyday")
		const origin = page.url()
		await page.getByRole("heading", { name: "Everyday Savings", exact: true }).click()
		await expect(page).toHaveURL(/\/accounts\/t1-acc-dbs$/)
		const detail = page.url()
		await expectBackAboveHeading(page, "Back to Accounts")
		await page.goBack()
		await expect(page).toHaveURL(origin)
		await expectNoBack(page)
		await page.goForward()
		await expect(page).toHaveURL(detail)
		await expectBackAboveHeading(page, "Back to Accounts")
		await page.getByRole("button", { name: "Back to Accounts", exact: true }).click()
		await expect(page).toHaveURL(origin)
		await expectNoBack(page)
	})

	test("browser traversal rejects malformed snapshot URLs and retains the valid filtered origin", async ({
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
		await expectBackAboveHeading(page, "Back to Records")
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
		await expectBackAboveHeading(page, "Back to Records")
		await page.getByRole("button", { name: "Back to Records", exact: true }).click()
		await expect(page).toHaveURL(origin)
		expect(errors).toEqual([])
	})

	test("browser Back and Forward restore a nested filtered drill with usable exact Back controls", async ({
		page,
		workspace,
	}) => {
		void workspace
		await gotoReady(page, "/categories?query=Groceries")
		const origin = page.url()
		await page.getByRole("link", { name: "Open Records for Groceries", exact: true }).click()
		await expect(page).toHaveURL(/\/records\?category_ids=t1-cat-groceries/)
		await expectBackAboveHeading(page, "Back to Categories")
		const records = page.url()
		await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
		await expect(page).toHaveURL(/\/records\/t1-r-groceries$/)
		const detail = page.url()
		await expectBackAboveHeading(page, "Back to Records")
		await page.goBack()
		await expect(page).toHaveURL(records)
		await expectBackAboveHeading(page, "Back to Categories")
		await expect(
			page.getByRole("button", { name: "Back to Records", exact: true }),
		).toHaveCount(0)
		await page.goBack()
		await expect(page).toHaveURL(origin)
		await expectNoBack(page)
		await page.goForward()
		await expect(page).toHaveURL(records)
		await expectBackAboveHeading(page, "Back to Categories")
		await page.goForward()
		await expect(page).toHaveURL(detail)
		await expectBackAboveHeading(page, "Back to Records")
		await page.getByRole("button", { name: "Back to Records", exact: true }).click()
		await expect(page).toHaveURL(records)
		await expectBackAboveHeading(page, "Back to Categories")
		await page.getByRole("button", { name: "Back to Categories", exact: true }).click()
		await expect(page).toHaveURL(origin)
		await expectNoBack(page)
	})

	test("browser traversal distinguishes the same detail URL entered from two filtered origins", async ({
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
		await expectBackAboveHeading(page, "Back to Records")
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
		await expectBackAboveHeading(page, "Back to Records")
		await page.goBack()
		await expect(page).toHaveURL(secondOrigin)
		await expectNoBack(page)
		await page.goBack()
		await expect(page).toHaveURL(firstOrigin)
		await page.goBack()
		await expect(page).toHaveURL(detail)
		await expectBackAboveHeading(page, "Back to Records")
		await page.goForward()
		await expect(page).toHaveURL(firstOrigin)
		await page.goForward()
		await expect(page).toHaveURL(secondOrigin)
		await page.goForward()
		await expect(page).toHaveURL(detail)
		await expectBackAboveHeading(page, "Back to Records")
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
		await expectBackAboveHeading(page, "Back to Records")
		await page.getByRole("button", { name: "Back to Records", exact: true }).click()
		await expect(page).toHaveURL(firstOrigin)
	})

	test("browser Back removes the month-shell self-target and Forward restores its chart origin", async ({
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
		await expectBackAboveHeading(page, "Back to overview")
		await page.goBack()
		await expect(page).toHaveURL(origin)
		await expectNoBack(page)
		await page.goForward()
		await expect(page).toHaveURL(records)
		await expectBackAboveHeading(page, "Back to overview")
		await page.getByRole("button", { name: "Back to overview", exact: true }).click()
		await expect(page).toHaveURL(origin)
		await expectNoBack(page)
	})

	test("delayed ordinary navigation survives an intervening inert click", async ({ page }) => {
		await gotoReady(page, "/privacy")
		await expectNoBack(page)
		// Dispatch both clicks in one task so the paragraph click lands before
		// the route arrival commits the pending origin.
		await page.evaluate(() => {
			const link = document.querySelector('main a[href="/terms"]')
			const paragraph = document.querySelector("main p")
			if (!(link instanceof HTMLAnchorElement) || !(paragraph instanceof Element))
				throw new Error("Expected the Terms link and body copy")
			link.dispatchEvent(
				new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
			)
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

	test("delayed ordinary navigation survives an intervening modified click", async ({ page }) => {
		await gotoReady(page, "/privacy")
		await expectNoBack(page)
		await page.evaluate(() => {
			const link = document.querySelector('main a[href="/terms"]')
			if (!(link instanceof HTMLAnchorElement)) throw new Error("Expected the Terms link")
			link.dispatchEvent(
				new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
			)
			link.dispatchEvent(
				new MouseEvent("click", {
					bubbles: true,
					cancelable: true,
					button: 0,
					ctrlKey: true,
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

	test("workflow tabs do not capture history", async ({ page }) => {
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

	test("an established ordinary origin clears across workflow tabs", async ({ page }) => {
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

	test("malformed stored history never crashes and exposes no Back entry", async ({ page }) => {
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

	test("valid stored entries survive alongside invalid ones", async ({ page }) => {
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

	test("a reloaded detail keeps its Back origin", async ({ page, workspace }) => {
		void workspace
		await gotoReady(page, "/records")
		await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
		// Reload only after the detail URL commits, or the reload lands on the list.
		await expect(page).toHaveURL(/\/records\/t1-r-groceries$/)
		await expect(
			page.getByRole("button", { name: "Back to Records", exact: true }),
		).toBeVisible()
		await page.reload()
		await expect(
			page.getByRole("button", { name: "Back to Records", exact: true }),
		).toBeVisible()
		await page.getByRole("button", { name: "Back to Records", exact: true }).click()
		await expect(page).toHaveURL(/\/records(\?|$)/)
	})

	test("a multifilter Unicode origin returns exactly after reload", async ({
		page,
		workspace,
	}) => {
		void workspace
		await gotoReady(
			page,
			"/records?query=K%C5%8Dpi&category_ids=t1-cat-groceries&start_date=2026-10-01&end_date=2026-10-31",
		)
		const origin = page.url()
		await page.getByRole("link", { name: /^Open Kōpi/ }).click()
		await expect(page).toHaveURL(/\/records\/t1-r-/)
		await expect(
			page.getByRole("button", { name: "Back to Records", exact: true }),
		).toBeVisible()
		await page.reload()
		await expect(
			page.getByRole("button", { name: "Back to Records", exact: true }),
		).toBeVisible()
		await expectBackAboveHeading(page, "Back to Records")
		await page.getByRole("button", { name: "Back to Records", exact: true }).click()
		await expect(page).toHaveURL(origin)
	})

	test("rapid Back clicks pop exactly once while navigation is pending", async ({
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
		await expect(
			page.getByRole("button", { name: "Back to Records", exact: true }),
		).toBeVisible()
		// Two synchronous activations: the second lands while the first
		// navigation is still pending and must be ignored.
		await page.getByRole("button", { name: "Back to Records", exact: true }).evaluate(back => {
			back.dispatchEvent(
				new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
			)
			back.dispatchEvent(
				new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
			)
		})
		await expect(page).toHaveURL(origin)
		await expect(
			page.getByRole("button", { name: "Back to Categories", exact: true }),
		).toBeVisible()
		await expect(page.getByRole("button", { name: /^Back to / })).toHaveCount(1)
	})

	test("every detail fallback keeps Back above its heading", async ({ page, workspace }) => {
		void workspace
		for (const [route, backName] of [
			["/accounts/t1-acc-dbs", "Back to Accounts"],
			["/budgets/t1-b-manual", "Back to Budgets"],
			["/records/t1-r-partial", "Back to Records"],
			["/statements/t1-s-pending", "Back to Statements"],
		] as const) {
			await gotoReady(page, route)
			await expectBackAboveHeading(page, backName)
		}
	})
})

test("Back pops an equivalent encoded URL without becoming stuck disabled", async ({
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

test("ordinary navigation keeps its captured origin across an intervening filter URL update", async ({
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
