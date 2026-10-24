import { statementRules } from "../support/data"
import { setDateOnly } from "../support/date-only"
import { expect, seedWorkspace, test } from "../support/fixtures"
import {
	expectReducedRowMovement,
	expectVisibleRowCascade,
	sampleVisibleRowAnimations,
} from "../support/motion"
import { type MotionConsumer, openMobileSidebarFromConsumerMotion } from "../support/tables"

const denseCardConsumers: MotionConsumer[] = [
	{
		name: "Accounts",
		origin: "/records",
		action: "sidebar",
		target: "Accounts",
		selector: "main div:has(> article)",
		dense: true,
	},
	{
		name: "Budgets",
		origin: "/records",
		action: "sidebar",
		target: "Budgets",
		selector: "main div:has(> article)",
		dense: true,
	},
	{
		name: "Categories",
		origin: "/records",
		action: "sidebar",
		target: "Categories",
		selector: "main div:has(> article)",
		dense: true,
	},
] as const

test("card grids: Accounts, Budgets and Categories enter as a cascade in the viewport", {
	tag: ["@tall", "@light", "@reduced-motion"],
}, async ({ page, isMobile }) => {
	test.setTimeout(180000)
	await seedWorkspace(page, "dense")
	for (const consumer of denseCardConsumers) {
		await test.step(`${consumer.name}: every visible item animates in the actual viewport`, async () => {
			if (consumer.name === "Allocate") {
				await page.evaluate(async () => {
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
						for (let index = 0; index < 24; index++)
							transaction.objectStore("statements").put({
								id: `t1-motion-unallocated-${index}`,
								account_id: "t1-d-acc-01",
								datetime: `2026-10-15 12:${String(index).padStart(2, "0")}`,
								description: `Unallocated imported purchase ${index}`,
								amount: -20 - index,
								index: index + 1,
								is_pending: 0,
							})
					})
				})
			}
			if ("future" in consumer && consumer.future)
				await setDateOnly(page, new Date("2026-09-15T12:00:00+08:00"))
			await page.goto(consumer.origin)
			await expect(page.locator("main h2").first()).toBeVisible()
			if (consumer.action === "sidebar" && isMobile) {
				await openMobileSidebarFromConsumerMotion(page)
			}
			const samples = await sampleVisibleRowAnimations(page, consumer.selector, async () => {
				if (consumer.action === "sidebar")
					await page
						.getByRole("link", { name: consumer.target, exact: true })
						.filter({ visible: true })
						.click()
				else if (consumer.action === "month-tab")
					await page
						.getByRole("navigation", { name: "Monthly finance views" })
						.getByRole("link", { name: consumer.target, exact: true })
						.click()
				else if (consumer.action === "workflow")
					await page
						.getByRole("navigation", { name: "Workflow views" })
						.getByRole("link", { name: consumer.target, exact: true })
						.click()
				else if (consumer.action === "heading")
					await page.getByRole("heading", { name: consumer.target, exact: true }).click()
				else if (consumer.action === "statement")
					await page
						.getByRole("link", { name: "Open statement" })
						.and(page.locator(`[href="/statements/${consumer.target}"]`))
						.click()
				else if (consumer.action === "view") {
					await page.getByRole("combobox", { name: "Duplicate view" }).click()
					await page.getByRole("option", { name: consumer.target, exact: true }).click()
				} else if (consumer.action === "pending") {
					await page
						.getByRole("button", { name: new RegExp(`^${consumer.target}`) })
						.click()
					await page
						.getByRole("combobox")
						.filter({ hasText: "Suggested replacements" })
						.click()
					await page
						.getByRole("option", { name: "All unallocated imports", exact: true })
						.click()
				} else await page.getByRole("link", { name: consumer.target, exact: true }).click()
			})
			const visibleCount = await page.locator(consumer.selector).evaluateAll(
				elements =>
					elements.filter(element => {
						const rect = element.getBoundingClientRect()
						const style = getComputedStyle(element)
						return (
							rect.width > 0 &&
							rect.height > 0 &&
							rect.bottom > 0 &&
							rect.top < innerHeight &&
							style.visibility !== "hidden" &&
							style.display !== "none"
						)
					}).length,
			)
			expect(samples.length, "Every rendered viewport item must be sampled").toBe(
				visibleCount,
			)
			expect(
				visibleCount,
				"Fixture must render the intended consumer",
			).toBeGreaterThanOrEqual(consumer.dense ? 2 : 1)
			if (
				test.info().project.name === "tall-desktop" &&
				["Records", "Statements", "Allocate", "Accounts", "Budgets", "Categories"].includes(
					consumer.name,
				)
			)
				expect(
					visibleCount,
					"Tall fixture exposes the former twelve-item cutoff",
				).toBeGreaterThan(12)
			if (await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches))
				expectReducedRowMovement(samples, visibleCount)
			else expectVisibleRowCascade(samples, visibleCount)
			await test.info().attach("consumer-frames", {
				body: JSON.stringify(samples),
				contentType: "application/json",
			})
			// The future-month step pins September; restore October so later
			// steps sample the same calendar state as a fresh test would.
			if ("future" in consumer && consumer.future)
				await setDateOnly(page, new Date("2026-10-15T12:00:00+08:00"))
		})
	}
})

test("route entrances: page fades during client navigation and visible cards cascade beyond twelve", {
	tag: ["@desktop-only", "@reduced-motion"],
}, async ({ page }) => {
	await seedWorkspace(page, "dense")
	await test.step("page transition: fades in during client navigation", async () => {
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
	await test.step("card grid: visible items cascade beyond twelve", async () => {
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
})

test("Statement rules: cards enter as a cascade in the viewport", {
	tag: ["@tall", "@light", "@reduced-motion"],
}, async ({ page, isMobile }) => {
	await seedWorkspace(page, "populated", { statement_rules: statementRules() })
	await page.goto("/records")
	await expect(page.locator("main h2").first()).toBeVisible()
	if (isMobile) {
		await openMobileSidebarFromConsumerMotion(page)
	}
	const selector = "main div:has(> article)"
	const samples = await sampleVisibleRowAnimations(page, selector, async () => {
		await page
			.getByRole("link", { name: "Rules", exact: true })
			.filter({ visible: true })
			.click()
	})
	const visibleCount = await page.locator(selector).evaluateAll(
		elements =>
			elements.filter(element => {
				const rect = element.getBoundingClientRect()
				const style = getComputedStyle(element)
				return (
					rect.width > 0 &&
					rect.height > 0 &&
					rect.bottom > 0 &&
					rect.top < innerHeight &&
					style.visibility !== "hidden" &&
					style.display !== "none"
				)
			}).length,
	)
	expect(samples.length, "Every rendered viewport card must be sampled").toBe(visibleCount)
	expect(visibleCount, "Seeded rule cards render").toBeGreaterThanOrEqual(2)
	if (await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches))
		expectReducedRowMovement(samples, visibleCount)
	else expectVisibleRowCascade(samples, visibleCount)
	await test.info().attach("rule-cards", {
		body: JSON.stringify(samples),
		contentType: "application/json",
	})
})
