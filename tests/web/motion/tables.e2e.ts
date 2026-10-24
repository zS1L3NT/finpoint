import type { Page } from "@playwright/test"
import { setDateOnly } from "../support/date-only"
import { pickOption } from "../support/editors"
import { expect, seedWorkspace, test } from "../support/fixtures"
import {
	expectReducedRowMovement,
	expectVisibleRowCascade,
	poseIsIdentity,
	sampleVisibleRowAnimations,
} from "../support/motion"
import { type MotionConsumer, openMobileSidebarFromConsumerMotion } from "../support/tables"

// Mobile sidebar taps race hydration: useIsMobile() starts false and flips in
// a mount effect, so a tap before that commit toggles the invisible desktop
// state and nothing opens. localStorage.history survives reloads and gotos,
// so a pre-existing marker proves nothing about the current mount — clear it
// and reload first; the rewritten marker then proves THIS document hydrated
// (the history provider wraps the sidebar's, so both mount effects commit in
// the same pass). Retry the tap boundedly for swallowed taps under load. A
// permanently absent sheet still fails the dialog check below, and the
// subsequent visible-link wait keeps its own strict proof.
async function openMobileSidebarFromTableUpdates(page: Page) {
	await page.evaluate(() => localStorage.removeItem("history"))
	await page.reload()
	await expect.poll(() => page.evaluate(() => localStorage.getItem("history"))).not.toBeNull()
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

const denseRowConsumers: MotionConsumer[] = [
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
		name: "Monthly Records",
		origin: "/?month=October&year=2026",
		action: "month-tab",
		target: "Monthly Records",
		selector:
			'main section[aria-labelledby="actual-records"] tbody tr:has(a[href^="/records/"]), main section[aria-labelledby="actual-records"] div.grid-cols-subgrid:has(a[href^="/records/"])',
		dense: true,
	},
	{
		name: "future Monthly Records",
		origin: "/?month=October&year=2026",
		action: "month-tab",
		target: "Monthly Records",
		selector:
			'main section:not([aria-labelledby]) tbody tr:has(a[href^="/records/"]), main section:not([aria-labelledby]) div.grid-cols-subgrid:has(a[href^="/records/"])',
		dense: true,
		future: true,
	},
	{
		name: "pending queue",
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
		name: "duplicate groups",
		origin: "/allocator",
		action: "workflow",
		target: "Fix Duplicates",
		selector: 'main [data-slot="duplicate-group-item"]',
		dense: false,
	},
	{
		name: "separate pairs",
		origin: "/allocator/duplicates",
		action: "view",
		target: "Marked separate",
		selector: 'main section[data-slot="duplicate-group-item"]',
		dense: false,
	},
	{
		name: "replacement candidates",
		origin: "/allocator/pending",
		action: "pending",
		target: "Pasar malam snacks",
		selector: 'main [data-slot="pending-candidate-item"]',
		dense: false,
	},
] as const

async function expectConsumerEntrance(page: Page, consumer: MotionConsumer, isMobile: boolean) {
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
			await pickOption(page.getByRole("option", { name: consumer.target, exact: true }))
		} else if (consumer.action === "pending") {
			await page.getByRole("button", { name: new RegExp(`^${consumer.target}`) }).click()
			await page.getByRole("combobox").filter({ hasText: "Suggested replacements" }).click()
			await pickOption(
				page.getByRole("option", { name: "All unallocated imports", exact: true }),
			)
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
	expect(samples.length, "Every rendered viewport item must be sampled").toBe(visibleCount)
	expect(visibleCount, "Fixture must render the intended consumer").toBeGreaterThanOrEqual(
		consumer.dense ? 2 : 1,
	)
	if (
		test.info().project.name === "tall-desktop" &&
		["Records", "Statements", "Allocate", "Accounts", "Budgets", "Categories"].includes(
			consumer.name,
		)
	)
		expect(visibleCount, "Tall fixture exposes the former twelve-item cutoff").toBeGreaterThan(
			12,
		)
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
}

test("table refilter: changed results enter with the row entrance", {
	tag: ["@tall", "@light", "@reduced-motion"],
}, async ({ page }) => {
	await seedWorkspace(page, "dense")
	for (const route of ["/records", "/statements"] as const) {
		await test.step(`table refilter ${route}: settled results reveal a different nonempty set`, async () => {
			const query = route === "/records" ? "Dense Record 1" : "Dense Record 1"
			await page.goto(`${route}?query=${encodeURIComponent(query)}&per_page=100`)
			const search = page.getByPlaceholder(
				route === "/records"
					? "Search title, people, location, description..."
					: "Search descriptions...",
			)
			const selector = `tbody tr:has(a[href^="${route}/"]), div.grid-cols-subgrid:has(a[href^="${route}/"])`
			await expect(page.locator(selector).filter({ visible: true }).first()).toBeVisible()
			// Cross the documented entrance-settle window before changing the result set.
			await page.waitForTimeout(1000)
			const existing = await page
				.locator(`${selector} a[href^="${route}/"]`)
				.evaluateAll(elements => elements.map(element => element.getAttribute("href")))
			const fresh = selector
				.split(", ")
				.map(part => part + existing.map(href => `:not(:has(a[href="${href}"]))`).join(""))
				.join(", ")
			const samples = await sampleVisibleRowAnimations(page, fresh, () =>
				search.fill(query.replace("1", "2")),
			)
			expect(samples.length).toBeGreaterThan(1)
			if (test.info().project.name === "reduced-motion") expectReducedRowMovement(samples, 2)
			else expectVisibleRowCascade(samples, 2)
		})
	}
})

test("table refilter: rows interrupted mid-rise settle back in line", {
	tag: ["@tall", "@light", "@reduced-motion"],
}, async ({ page }) => {
	await seedWorkspace(page, "dense")
	for (const route of ["/records", "/statements"] as const) {
		await test.step(`table refilter ${route}: interrupted rows settle back in line`, async () => {
			const reduced = test.info().project.name === "reduced-motion"
			const searchName =
				route === "/records"
					? "Search title, people, location, description..."
					: "Search descriptions..."
			const emptyCopy = route === "/records" ? "No records found." : "No statements found."
			// A strict subset of the dense seed: contains-matched on both
			// routes, so narrowing to it is a pure removal that keeps the
			// discovered rows' DOM nodes alive.
			const narrow = "Dense Record 1"
			const allRows = `tbody tr:has(a[href^="${route}/"]), div.grid-cols-subgrid:has(a[href^="${route}/"])`
			const rowParts = (href: string) =>
				`tbody tr:has(a[href="${href}"]), div.grid-cols-subgrid:has(a[href="${href}"])`
			// Discover retained rows on the settled narrowed list, so they
			// are guaranteed members of the match set the refilter below
			// commits to.
			await page.goto(`${route}?query=${encodeURIComponent(narrow)}&per_page=100`)
			const fullRows = page.locator(allRows)
			await expect(fullRows.filter({ visible: true }).first()).toBeVisible()
			const hrefs = (
				await fullRows.filter({ visible: true }).evaluateAll(
					(elements, origin) =>
						elements
							.filter(element => /Dense/.test(element.textContent ?? ""))
							.slice(0, 4)
							.map(
								element =>
									element
										.querySelector(`a[href^="${origin}/"]`)
										?.getAttribute("href") ?? "",
							),
					route,
				)
			).filter((href): href is string => href.length > 0)
			expect(hrefs.length, "settled list exposes retained dense rows").toBeGreaterThanOrEqual(
				2,
			)
			const selector = hrefs.map(rowParts).join(", ")
			// Remount the full list from an empty result, then narrow back
			// to the match set while the retained rows are still rising.
			await page.goto(
				`${route}?query=${encodeURIComponent("missing-ui-result")}&per_page=100`,
			)
			await expect(
				page.getByText(emptyCopy, { exact: true }).filter({ visible: true }),
			).toBeVisible()
			const search = page.getByPlaceholder(searchName)
			const samples = await sampleVisibleRowAnimations(page, selector, async () => {
				await search.fill("")
				// Catch a retained row mid-rise and narrow in the same task:
				// the cascade settles in under a second, so any round trip
				// between the catch and the narrow risks missing the window.
				// Under reduced motion the rows snap to rest, so their
				// mounting alone establishes the retained nodes.
				const commit = await page.evaluate(
					({
						hrefSelector,
						allSelector,
						inputName,
						narrowQuery,
						reducedMotion,
						retained,
					}: {
						hrefSelector: string
						allSelector: string
						inputName: string
						narrowQuery: string
						reducedMotion: boolean
						retained: number
					}) => {
						const yOf = (row: Element) => {
							const style = getComputedStyle(row)
							let y = 0
							if (style.transform !== "none")
								y += new DOMMatrixReadOnly(style.transform).m42
							const parts =
								style.translate === "none"
									? []
									: style.translate.trim().split(/\s+/)
							if (parts.length > 1) y += Number(parts[1])
							return y
						}
						return new Promise<{
							probeY: number
							before: number
							after: number
							marked: number
							connected: number
							y: number
						}>((resolve, reject) => {
							const deadline = performance.now() + 8000
							const waitCommit = (probeY: number, before: number) => {
								const tick = () => {
									const after = document.querySelectorAll(allSelector).length
									if (after < before) {
										const marked = [
											...document.querySelectorAll('[data-probe="1"]'),
										]
										const kept = marked.filter(node => node.isConnected)
										resolve({
											probeY,
											before,
											after,
											marked: marked.length,
											connected: kept.length,
											y: kept.length
												? Math.max(...kept.map(node => Math.abs(yOf(node))))
												: 0,
										})
										return
									}
									if (performance.now() > deadline)
										reject(
											new Error(
												`refilter never committed a removal (rows stayed at ${after})`,
											),
										)
									else requestAnimationFrame(tick)
								}
								tick()
							}
							const waitRise = () => {
								const rows = [...document.querySelectorAll(hrefSelector)]
								if (rows.length >= retained) {
									// Catch the rise early (y well above rest) so the
									// removal below still lands mid-flight.
									const rising = reducedMotion
										? rows
										: rows.filter(row => Math.abs(yOf(row)) > 2)
									if (rising.length > 0) {
										for (const row of rising)
											row.setAttribute("data-probe", "1")
										const probeY = Math.max(
											...rising.map(row => Math.abs(yOf(row))),
										)
										const before = document.querySelectorAll(allSelector).length
										const input = document.querySelector(
											`input[placeholder="${CSS.escape(inputName)}"]`,
										)
										if (!(input instanceof HTMLInputElement)) {
											reject(
												new Error("search input not found for narrowing"),
											)
											return
										}
										const setter = Object.getOwnPropertyDescriptor(
											window.HTMLInputElement.prototype,
											"value",
										)?.set
										if (!setter) {
											reject(new Error("native value setter unavailable"))
											return
										}
										setter.call(input, narrowQuery)
										input.dispatchEvent(new Event("input", { bubbles: true }))
										waitCommit(probeY, before)
										return
									}
								}
								if (performance.now() > deadline)
									reject(
										new Error(
											reducedMotion
												? "retained rows never mounted"
												: "retained rows never displaced mid-rise",
										),
									)
								else requestAnimationFrame(waitRise)
							}
							waitRise()
						})
					},
					{
						hrefSelector: selector,
						allSelector: allRows,
						inputName: searchName,
						narrowQuery: narrow,
						reducedMotion: reduced,
						retained: hrefs.length,
					},
				)
				if (!reduced)
					expect(
						commit.probeY,
						"interruption catches a retained row mid-rise",
					).toBeGreaterThan(2)
				expect(commit.after, "at least one nonmatching row disappears").toBeLessThan(
					commit.before,
				)
				expect(commit.marked, "interruption marks a retained node").toBeGreaterThan(0)
				expect(commit.connected, "the retained node is the same connected node").toBe(
					commit.marked,
				)
				if (!reduced)
					expect(
						commit.y,
						"retained node still displaced at the removal boundary; the interruption window was missed",
					).toBeGreaterThan(0.5)
			})
			expect(samples.length).toBeGreaterThanOrEqual(2)
			if (reduced) {
				expectReducedRowMovement(samples, 2)
			} else {
				expectVisibleRowCascade(samples, 2)
				for (const sample of samples) {
					expect(
						sample.frames.some(frame => !poseIsIdentity(frame)),
						`${sample.text}: interrupted rise leaves a displaced frame`,
					).toBe(true)
					const last = sample.frames.at(-1)
					expect(last?.opacity, `${sample.text}: settled opacity`).toBeGreaterThan(0.99)
					expect(
						last ? poseIsIdentity(last) : false,
						`${sample.text}: settles back to an identity transform`,
					).toBe(true)
				}
			}
			// The marked nodes survive the pure-removal refilter: the same
			// connected nodes, settled back to identity.
			const probed = await page.locator('[data-probe="1"]').evaluateAll(elements =>
				elements.map(element => {
					const style = getComputedStyle(element)
					return {
						connected: element.isConnected,
						transform: style.transform,
						translate: style.translate,
						scale: style.scale,
						rotate: style.rotate,
					}
				}),
			)
			expect(probed.length, "interruption keeps a marked retained node").toBeGreaterThan(0)
			for (const node of probed) {
				expect(node.connected, "the retained node is the same connected node").toBe(true)
				expect(
					poseIsIdentity(node),
					`retained node settles back to identity (${node.transform} ${node.translate} ${node.scale} ${node.rotate})`,
				).toBe(true)
			}
			// Sweep every final visible data row, not just the marked subset.
			const final = await page.locator(allRows).evaluateAll(elements =>
				elements
					.filter(element => {
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
					})
					.map(element => {
						const style = getComputedStyle(element)
						return {
							transform: style.transform,
							translate: style.translate,
							scale: style.scale,
							rotate: style.rotate,
						}
					}),
			)
			expect(final.length, "every final visible data row is swept").toBeGreaterThanOrEqual(2)
			for (const pose of final)
				expect(
					poseIsIdentity(pose),
					`visible row settles back to an identity transform (${pose.transform} ${pose.translate} ${pose.scale} ${pose.rotate})`,
				).toBe(true)
		})
	}
})

test("table paging: new page fades without restarting the rise", {
	tag: ["@tall", "@light", "@reduced-motion"],
}, async ({ page }) => {
	await seedWorkspace(page, "dense")
	for (const route of ["/records", "/statements"] as const) {
		await test.step(`table paging ${route}: new page fades without restarting the rise`, async () => {
			await page.goto(`${route}?per_page=5`)
			const rows = `tbody tr:has(a[href^="${route}/"]), div.grid-cols-subgrid:has(a[href^="${route}/"])`
			await expect(page.locator(rows).filter({ visible: true })).toHaveCount(5)
			const oldLinks = await page
				.locator(`main a[href^="${route}/"]`)
				.evaluateAll(elements => elements.map(element => element.getAttribute("href")))
			const fresh = rows
				.split(", ")
				.map(part => part + oldLinks.map(href => `:not(:has(a[href="${href}"]))`).join(""))
				.join(", ")
			const samples = await sampleVisibleRowAnimations(page, fresh, () =>
				page.getByRole("link", { name: "Go to next page" }).click(),
			)
			expect(samples).toHaveLength(5)
			for (const sample of samples) {
				expect(sample.frames.at(-1)?.opacity).toBe(1)
				expect(
					new Set(
						sample.frames.map(
							frame =>
								`${frame.transform}|${frame.translate}|${frame.scale}|${frame.rotate}`,
						),
					),
				).toEqual(new Set(["none|none|none|none"]))
				if (test.info().project.name !== "reduced-motion")
					expect(sample.frames[0]?.opacity).toBeLessThan(0.95)
				else
					expect(
						sample.frames[0]?.layoutHeight,
						"First frame occupies its final layout",
					).toBeGreaterThan(0)
			}
		})
	}
})

test("Records table: visible day headers enter with their grouped Records", {
	tag: ["@tall", "@reduced-motion"],
}, async ({ page, isMobile }) => {
	await seedWorkspace(page, "dense")
	await page.goto("/accounts")
	if (isMobile) await openMobileSidebarFromTableUpdates(page)
	const samples = await sampleVisibleRowAnimations(
		page,
		'tbody tr:not(:has(a[href^="/records/"])), div.grid-cols-subgrid:not(:has(a[href^="/records/"]))',
		() =>
			page
				.getByRole("link", { name: "Records", exact: true })
				.filter({ visible: true })
				.click(),
	)
	if (test.info().project.name === "reduced-motion") expectReducedRowMovement(samples, 2)
	else expectVisibleRowCascade(samples, 2)
})

test("table refilter from no results: visible results enter with an entrance", {
	tag: ["@tall", "@reduced-motion"],
}, async ({ page }) => {
	await seedWorkspace(page, "dense")
	for (const route of ["/records", "/statements"] as const) {
		await test.step(`table refilter ${route} from no results: every visible result enters with an entrance`, async () => {
			await page.goto(`${route}?query=missing-ui-result&per_page=100`)
			await expect(
				page
					.getByText(
						route === "/records" ? "No records found." : "No statements found.",
						{
							exact: true,
						},
					)
					.filter({ visible: true }),
			).toBeVisible()
			const samples = await sampleVisibleRowAnimations(
				page,
				'tbody tr:has(a[aria-label^="Open "]), div.grid-cols-subgrid:has(a[aria-label^="Open "])',
				async () => {
					await page
						.getByPlaceholder(
							route === "/records"
								? "Search title, people, location, description..."
								: "Search descriptions...",
						)
						.fill("")
				},
			)
			if (test.info().project.name === "reduced-motion") expectReducedRowMovement(samples)
			else expectVisibleRowCascade(samples)
		})
	}
})

test("table rows: Records, Statements, Monthly Records, future Monthly Records, pending queue and Allocate enter as a cascade in the viewport", {
	tag: ["@tall", "@light", "@reduced-motion"],
}, async ({ page, isMobile }) => {
	test.setTimeout(180000)
	await seedWorkspace(page, "dense")
	for (const consumer of denseRowConsumers) {
		await test.step(`${consumer.name}: every visible item animates in the actual viewport`, () =>
			expectConsumerEntrance(page, consumer, isMobile))
	}
})

test("table rows: Account Statements, Record Statements, Statement Records, duplicate groups, separate pairs and replacement candidates enter as a cascade in the viewport", {
	tag: ["@tall", "@reduced-motion"],
}, async ({ page, isMobile }) => {
	test.setTimeout(150000)
	await seedWorkspace(page, "populated")
	for (const consumer of populatedConsumers) {
		await test.step(`${consumer.name}: every visible item animates in the actual viewport`, () =>
			expectConsumerEntrance(page, consumer, isMobile))
	}
})

// The related table starts below the chart; the tall project exposes its initial rows.
test("Budget detail: initially visible related Records rows animate as a cascade", {
	tag: ["@tall-only"],
}, async ({ page }) => {
	await seedWorkspace(page)
	await page.goto("/budgets")
	await expect(page.getByRole("heading", { name: "October Buffer", exact: true })).toBeVisible()
	const samples = await sampleVisibleRowAnimations(
		page,
		'tbody tr:has(a[href^="/records/"])',
		() => page.getByRole("heading", { name: "October Buffer", exact: true }).click(),
	)
	expectVisibleRowCascade(samples, 2)
})

for (const height of [1440, 2160]) {
	test(`Records table: every visible row cascades at 1920x${height}`, {
		tag: ["@desktop-only", "@reduced-motion"],
	}, async ({ page }) => {
		await seedWorkspace(page, "dense")
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

test("Budget detail: remaining row does not replay its entrance after detaching", {
	tag: ["@reduced-motion"],
}, async ({ page, workspace }) => {
	void workspace
	await page.setViewportSize({ width: 1920, height: 1440 })
	await page.goto("/budgets/t1-b-manual")
	const selector = 'tbody tr:has(a[href="/records/t1-r-unicode"])'
	const kept = page.locator(selector).filter({ visible: true })
	await expect(kept).toHaveCSS("opacity", "1")
	await expect(kept).toHaveCSS("transform", "none")
	const samples = await sampleVisibleRowAnimations(page, selector, async () => {
		await page.getByRole("button", { name: "Detach FairPrice Run", exact: true }).click()
		await expect(
			page.getByRole("button", { name: "Detach FairPrice Run", exact: true }),
		).toHaveCount(0)
	})
	expect(samples.length).toBe(1)
	for (const sample of samples) {
		expect(
			sample.frames.every(frame => frame.opacity === 1 && frame.transform === "none"),
		).toBe(true)
	}
})
