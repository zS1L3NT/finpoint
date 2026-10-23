import type { Page } from "@playwright/test"
import {
	expectReducedRowMovement,
	expectVisibleRowCascade,
	sampleVisibleRowAnimations,
} from "./support/assertions"
import { setDateOnly } from "./support/date-only"
import { expect, seedWorkspace, test } from "./support/fixtures"

// The sidebar reads its mobile detection in a mount effect: a trigger tap
// before hydration toggles the invisible desktop state instead of opening the
// sheet, and a tap swallowed under load does the same visibly-nothing thing.
// History hydration commits in the same mount pass (its provider wraps the
// sidebar's), so wait for its localStorage marker first, then retry the tap
// boundedly. The visible dialog below stays the strict proof: a genuinely
// broken sheet still fails there.
async function openMobileSidebar(page: Page) {
	await expect.poll(() => page.evaluate(() => localStorage.getItem("history"))).not.toBeNull()
	const trigger = page.locator('header [data-slot="sidebar-trigger"]')
	for (let attempt = 0; attempt < 3; attempt++) {
		await trigger.click()
		await page.waitForTimeout(500)
		if ((await page.getByRole("dialog").count()) > 0) break
	}
	await expect(page.getByRole("dialog")).toBeVisible()
}

const recordRows =
	'main table:has(a[href^="/records/"]) tbody tr:has(a[href^="/records/"]), main div:has(> div.grid-cols-subgrid a[href^="/records/"]) > div.grid-cols-subgrid:has(a[href^="/records/"])'
const statementRows =
	'main table:has(a[href^="/statements/"]) tbody tr:has(a[href^="/statements/"]), main div:has(> div.grid-cols-subgrid a[href^="/statements/"]) > div.grid-cols-subgrid:has(a[href^="/statements/"])'

type MotionConsumer = {
	name: string
	origin: string
	action:
		| "sidebar"
		| "month-tab"
		| "workflow"
		| "heading"
		| "link"
		| "statement"
		| "view"
		| "pending"
	target: string
	selector: string
	dense: boolean
	future?: boolean
}

const denseConsumers: MotionConsumer[] = [
	{
		name: "Records",
		origin: "/accounts",
		action: "sidebar",
		target: "Records",
		selector: recordRows,
		dense: true,
	},
	{
		name: "Statements",
		origin: "/accounts",
		action: "sidebar",
		target: "Statements",
		selector: statementRows,
		dense: true,
	},
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
	{
		name: "Monthly Records",
		origin: "/?month=October&year=2026",
		action: "month-tab",
		target: "Monthly Records",
		selector:
			'main section[aria-labelledby="actual-records"] tbody tr:has(a[href^="/records/"]), main section[aria-labelledby="actual-records"] div.grid-cols-subgrid:has(a[href^="/records/"])',
		dense: true,
	},
	{
		name: "Future Monthly Records",
		origin: "/?month=October&year=2026",
		action: "month-tab",
		target: "Monthly Records",
		selector:
			'main section:not([aria-labelledby]) tbody tr:has(a[href^="/records/"]), main section:not([aria-labelledby]) div.grid-cols-subgrid:has(a[href^="/records/"])',
		dense: true,
		future: true,
	},
	{
		name: "Pending queue",
		origin: "/allocator",
		action: "workflow",
		target: "Replace Pending",
		selector: 'main [data-slot="pending-queue-item"]',
		dense: true,
	},
	// Allocate last: its step inserts 24 extra statements into the shared
	// dense seed, which later steps would otherwise sample.
	{
		name: "Allocate",
		origin: "/accounts",
		action: "sidebar",
		target: "Workflows",
		selector: statementRows,
		dense: true,
	},
] as const

const populatedConsumers: MotionConsumer[] = [
	{
		name: "Account Statements",
		origin: "/accounts",
		action: "heading",
		target: "Everyday Savings",
		selector: statementRows,
		dense: false,
	},
	{
		name: "Record Statements",
		origin: "/records",
		action: "link",
		target: "Open Hawker Dinner",
		selector: statementRows,
		dense: false,
	},
	{
		name: "Statement Records",
		origin: "/statements",
		action: "statement",
		target: "t1-s-pending",
		selector: recordRows,
		dense: false,
	},
	{
		name: "Duplicate groups",
		origin: "/allocator",
		action: "workflow",
		target: "Fix Duplicates",
		selector: 'main [data-slot="duplicate-group-item"]',
		dense: false,
	},
	{
		name: "Separate pairs",
		origin: "/allocator/duplicates",
		action: "view",
		target: "Marked separate",
		selector: 'main section[data-slot="duplicate-group-item"]',
		dense: false,
	},
	{
		name: "Replacement candidates",
		origin: "/allocator/pending",
		action: "pending",
		target: "Pasar malam snacks",
		selector: 'main [data-slot="pending-candidate-item"]',
		dense: false,
	},
] as const

test("motion dense consumers share one dense seed", {
	tag: ["@tall", "@light", "@motion"],
}, async ({ page, isMobile }) => {
	test.setTimeout(180000)
	await seedWorkspace(page, "dense")
	for (const consumer of denseConsumers) {
		await test.step(`motion.consumer ${consumer.name} animates every visible item in the actual viewport`, async () => {
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
				await openMobileSidebar(page)
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

test("motion populated consumers share one populated seed", { tag: ["@tall", "@motion"] }, async ({
	page,
	isMobile,
}) => {
	test.setTimeout(150000)
	await seedWorkspace(page, "populated")
	for (const consumer of populatedConsumers) {
		await test.step(`motion.consumer ${consumer.name} animates every visible item in the actual viewport`, async () => {
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
				await openMobileSidebar(page)
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
