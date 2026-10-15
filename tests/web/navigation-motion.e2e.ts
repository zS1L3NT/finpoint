import {
	expectReducedRowMovement,
	expectVisibleRowCascade,
	sampleVisibleRowAnimations,
} from "./support/assertions"
import { expect, test } from "./support/fixtures"

test.describe("page and item entrances", () => {
	test.use({ workspaceScenario: "dense" })
	for (const height of [1440, 2160]) {
		test(`every visible row cascades at 1920x${height}`, async ({ page, workspace }) => {
			void workspace
			await page.setViewportSize({ width: 1920, height })
			await page.goto("/accounts")
			await expect(page.locator("main article").first()).toBeVisible()
			const samples = await sampleVisibleRowAnimations(
				page,
				'tbody tr:has(a[aria-label^="Open "])',
				async () => {
					await page.getByRole("link", { name: "Records", exact: true }).click()
				},
			)
			if (test.info().project.name === "reduced-motion") expectReducedRowMovement(samples, 13)
			else expectVisibleRowCascade(samples, 13)
			await test.info().attach("row-timing", {
				body: JSON.stringify(samples),
				contentType: "application/json",
			})
		})
	}

	test("visible card grid items cascade beyond twelve", async ({ page, workspace }) => {
		void workspace
		await page.setViewportSize({ width: 1920, height: 2160 })
		await page.goto("/records")
		await expect(page.locator("tbody tr").first()).toBeVisible()
		const samples = await sampleVisibleRowAnimations(
			page,
			"main div:has(> article)",
			async () => {
				await page.locator('[data-sidebar="menu-button"][href="/accounts"]').click()
			},
		)
		if (test.info().project.name === "reduced-motion") expectReducedRowMovement(samples, 13)
		else expectVisibleRowCascade(samples, 13)
		await test.info().attach("card-timing", {
			body: JSON.stringify(samples),
			contentType: "application/json",
		})
	})

	test("page fades during client navigation", async ({ page }) => {
		await page.goto("/privacy")
		const samples = await sampleVisibleRowAnimations(
			page,
			'main > .animate-in:has(a[href="/privacy"])',
			async () => {
				await page.getByRole("link", { name: "Terms of Service", exact: true }).click()
			},
		)
		expect(samples.length).toBe(1)
		for (const sample of samples) {
			expect(Math.min(...sample.frames.map(frame => frame.opacity))).toBeLessThan(0.95)
			expect(sample.frames.at(-1)?.opacity).toBe(1)
			expect(new Set(sample.frames.map(frame => frame.transform)).size).toBe(1)
		}
	})
})

test.describe("navigation history", () => {
	test("category drill and nested detail return to exact filtered origins", async ({
		page,
		workspace,
	}) => {
		void workspace
		await page.goto("/categories?query=Groceries")
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
		test(`direct ${name} detail has a working fallback`, async ({ page, workspace }) => {
			void workspace
			await page.goto(route)
			await page.getByRole("button", { name: new RegExp(`^Back to ${name}$`, "i") }).click()
			await expect(page).toHaveURL(new RegExp(`${fallback}(\\?|$)`))
		})
	}

	test("ordinary static-page links preserve nested back history", async ({ page }) => {
		await page.goto("/sync")
		await page.getByRole("link", { name: "Privacy Policy", exact: true }).click()
		await expect(page.getByRole("button", { name: /^Back to / })).toBeVisible()
		await page.getByRole("link", { name: "Terms of Service", exact: true }).click()
		await page.getByRole("button", { name: /^Back to / }).click()
		await expect(page).toHaveURL(/\/privacy$/)
		await page.getByRole("button", { name: /^Back to / }).click()
		await expect(page).toHaveURL(/\/sync$/)
	})
})

test("cancelled ordinary links do not add a back destination", async ({ page }) => {
	await page.goto("/privacy")
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

test("sidebar and month tabs clear drill history", async ({ page, isMobile }) => {
	await page.goto("/privacy")
	await page.getByRole("link", { name: "Terms of Service", exact: true }).click()
	await expect(page.getByRole("button", { name: /^Back to / })).toBeVisible()
	if (isMobile) await page.locator('header [data-slot="sidebar-trigger"]').click()
	// Desktop and mobile sidebars both render a Dashboard link; only one is visible.
	await page
		.getByRole("link", { name: "Dashboard", exact: true })
		.filter({ visible: true })
		.click()
	await expect(page.getByRole("button", { name: /^Back to / })).toHaveCount(0)
	await page
		.getByRole("navigation", { name: "Monthly finance views" })
		.getByRole("link", { name: "Monthly Records", exact: true })
		.click()
	await expect(page).toHaveURL(/\/records\/monthly/)
	await expect(page.getByRole("button", { name: /^Back to / })).toHaveCount(0)
})

test("chart drill and nested Record return through filtered overview", async ({
	page,
	workspace,
}) => {
	void workspace
	const origin = "/?month=October&year=2026&scope=all"
	await page.goto(origin)
	await page.getByRole("button", { name: /^5 October: \$84.20 spent/ }).click()
	await expect(page).toHaveURL(/start_date=2026-10-05/)
	const back = page.getByRole("button", { name: /^Back to overview$/i })
	await expect(back).toBeVisible()
	const backBox = await back.boundingBox()
	const headingBox = await page
		.getByRole("heading", { name: "October 2026", level: 2 })
		.boundingBox()
	if (!backBox || !headingBox) throw new Error("Back and month heading must have layout boxes")
	expect(backBox.y + backBox.height).toBeLessThan(headingBox.y)
	const monthly = page.url()
	await page.getByRole("link", { name: "Open FairPrice Run", exact: true }).click()
	await page.getByRole("button", { name: /^Back to / }).click()
	await expect(page).toHaveURL(monthly)
	await back.click()
	await expect(page).toHaveURL(origin)
})

test("detaching a budget Record preserves the remaining row without replaying its entrance", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.setViewportSize({ width: 1920, height: 1440 })
	await page.goto("/budgets/t1-b-manual")
	const selector = 'tbody tr:has(a[href="/records/t1-r-unicode"])'
	const kept = page.locator(selector).filter({ visible: true })
	await expect(kept).toHaveCSS("opacity", "1")
	await expect(kept).toHaveCSS("transform", "none")
	const original = await kept.elementHandle()
	if (!original) throw new Error("Expected the retained budget Record")
	const samples = await sampleVisibleRowAnimations(page, selector, async () => {
		await page.getByRole("button", { name: "Detach FairPrice Run", exact: true }).click()
		await expect(
			page.getByRole("button", { name: "Detach FairPrice Run", exact: true }),
		).toHaveCount(0)
	})
	expect(await original.evaluate(element => element.isConnected)).toBe(true)
	expect(samples.length).toBe(1)
	for (const sample of samples) {
		expect(
			sample.frames.every(frame => frame.opacity === 1 && frame.transform === "none"),
		).toBe(true)
	}
	await page.reload()
	await expect(page.getByRole("link", { name: /^Open Kōpi/ })).toBeVisible()
	await expect(
		page.getByRole("button", { name: "Detach FairPrice Run", exact: true }),
	).toHaveCount(0)
})
