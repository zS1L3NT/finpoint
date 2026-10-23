import type { Page } from "@playwright/test"
import { expect, seedWorkspace, test } from "./support/fixtures"

const overviewCharts = [
	"Spending forecast",
	"Surplus / Shortfall",
	"Spending by day",
	"Spending by weekday",
	"Category trend",
]
const marks =
	".recharts-area-curve, .recharts-line-curve, .recharts-rectangle, clipPath[id^=animationClipPath] rect"

async function chartFrames(page: Page, titles: string[], open: () => Promise<void>) {
	const sampler = await page.evaluateHandle(
		({ selector, titles }) => {
			const frames: Record<string, { time: number; geometry: string }[]> = {}
			const first: Record<string, number> = {}
			let completed = 0
			const done = new Promise<typeof frames>((resolve, reject) => {
				const sample = (now: number) => {
					for (const card of document.querySelectorAll('[data-slot="card"]')) {
						const titleNode = card.querySelector('[data-slot="card-title"]')
						const title = titleNode
							? [...titleNode.childNodes]
									.filter(node => node.nodeType === Node.TEXT_NODE)
									.map(node => node.textContent)
									.join("")
									.trim()
							: ""
						const svg = card.querySelector("svg.recharts-surface")
						if (
							!title ||
							!svg?.querySelector(
								".recharts-area-curve, .recharts-line-curve, .recharts-rectangle",
							)
						)
							continue
						const geometry = JSON.stringify(
							[...svg.querySelectorAll(selector)].map(mark => {
								const style = getComputedStyle(mark)
								return [
									mark.tagName,
									...["d", "x", "y", "width", "height"].map(name =>
										mark.getAttribute(name),
									),
									style.strokeDasharray,
									style.strokeDashoffset,
								]
							}),
						)
						if (first[title] === undefined) first[title] = now
						frames[title] ??= []
						frames[title].push({ time: now, geometry })
					}
					// Every requested chart gets its own full intro window: late mounts
					// must also show intermediates and reach a stable tail before the
					// sampler ends, instead of cutting off 1200ms after the first chart.
					const settled = (title: string) => {
						const samples = frames[title] ?? []
						if (samples.length < 4) return false
						if (now - (first[title] ?? now) < 700) return false
						const recent = samples.filter(frame => frame.time > now - 200)
						return (
							recent.length > 0 &&
							new Set(recent.map(frame => frame.geometry)).size === 1
						)
					}
					if (completed && titles.every(settled)) resolve(frames)
					else if (
						completed &&
						now - completed > 5000 &&
						titles.every(title => !(frames[title] ?? []).length)
					)
						reject(new Error("No chart geometry appeared"))
					else if (completed && now - completed > 15000)
						reject(
							new Error(
								`Charts never settled: ${titles.filter(title => !settled(title)).join(", ")}`,
							),
						)
					else requestAnimationFrame(sample)
				}
				requestAnimationFrame(sample)
			})
			return {
				done,
				complete: () => {
					completed = performance.now()
				},
			}
		},
		{ selector: marks, titles },
	)
	await open()
	await page.mouse.move(0, 0)
	try {
		return await sampler.evaluate(state => {
			state.complete()
			return state.done
		})
	} finally {
		await sampler.dispose()
	}
}

test("charts intro journeys share one seed", { tag: ["@tall", "@light", "@motion"] }, async ({
	page,
	isMobile,
}) => {
	test.setTimeout(150_000)
	await seedWorkspace(page)
	for (const destination of ["overview", "budget"] as const) {
		await test.step(`charts.intro ${destination} grows real graph marks once and respects reduced motion`, async () => {
			await page.goto(destination === "overview" ? "/records" : "/budgets")
			// Before hydration the trigger does nothing, so retry until the sheet is open.
			if (destination === "overview" && isMobile)
				await expect(async () => {
					await page.locator('header [data-slot="sidebar-trigger"]').click()
					await expect(
						page.getByRole("dialog", { name: "Sidebar", exact: true }),
					).toBeVisible({
						timeout: 2000,
					})
				}).toPass()
			const titles = destination === "overview" ? overviewCharts : ["Spending over time"]
			const frames = await chartFrames(page, titles, async () => {
				if (destination === "overview")
					await page
						.getByRole("link", { name: "Dashboard", exact: true })
						.filter({ visible: true })
						.click()
				else
					await page.getByRole("heading", { name: "October Buffer", exact: true }).click()
			})
			await test.info().attach("graph-frame-counts", {
				body: JSON.stringify(
					Object.fromEntries(
						Object.entries(frames).map(([title, samples]) => [
							title,
							{
								frames: samples.length,
								distinct: new Set(samples.map(frame => frame.geometry)).size,
							},
						]),
					),
				),
				contentType: "application/json",
			})
			const reduced = await page.evaluate(
				() => matchMedia("(prefers-reduced-motion: reduce)").matches,
			)
			for (const title of titles) {
				const samples = frames[title] ?? []
				expect(samples.length, `${title}: actual plotted frames`).toBeGreaterThan(3)
				expect(
					samples.every(frame => !/NaN|Infinity/.test(frame.geometry)),
					title,
				).toBe(true)
				const unique = new Set(samples.map(frame => frame.geometry))
				if (reduced)
					expect(unique.size, `${title}: reduced motion avoids graph growth`).toBe(1)
				else
					expect(
						unique.size,
						`${title}: intermediate graph geometry before settling`,
					).toBeGreaterThan(2)
				const settled = samples.filter(
					frame => frame.time > (samples.at(-1)?.time ?? 0) - 200,
				)
				expect(
					new Set(settled.map(frame => frame.geometry)).size,
					`${title}: graph settles`,
				).toBe(1)
			}
			// Hover and sidebar resize may update geometry; they must not restart the grow-in clip.
			const chart = page
				.locator('[data-slot="card"]')
				.filter({
					has: page.locator('[data-slot="card-title"]').filter({ hasText: titles[0] }),
				})
				.getByRole("application")
			// Observe from before the interaction, so a replay that finishes quickly is still caught.
			const watcher = await page.evaluateHandle(() => {
				const state = { replayed: false, stop: () => undefined as void }
				const check = () => {
					if (document.querySelector('clipPath[id^="animationClipPath"]'))
						state.replayed = true
				}
				const observer = new MutationObserver(check)
				observer.observe(document.body, {
					subtree: true,
					childList: true,
					attributes: true,
				})
				state.stop = () => observer.disconnect()
				return state
			})
			await chart.hover()
			// Intro animations start within a frame; 600ms covers a delayed restart.
			await page.waitForTimeout(600)
			if (!isMobile) {
				const viewport = page.viewportSize()
				// Wide viewports cap content width (container mx-auto), which absorbs
				// the sidebar toggle before it reaches the chart. Narrow below the
				// cap first so the toggle genuinely resizes the chart; restoring
				// afterwards is a second observed resize, not silent cleanup.
				const narrowed = viewport !== null && viewport.width > 1600
				if (narrowed && viewport)
					await page.setViewportSize({ width: 1500, height: viewport.height })
				const width = await chart.evaluate(element => element.getBoundingClientRect().width)
				await page.locator('header [data-slot="sidebar-trigger"]').click()
				await expect
					.poll(() => chart.evaluate(element => element.getBoundingClientRect().width))
					.not.toBe(width)
				await page.waitForTimeout(600)
				if (narrowed && viewport)
					await page.setViewportSize({ width: viewport.width, height: viewport.height })
				await page.waitForTimeout(600)
			}
			const replayed = await watcher.evaluate(state => {
				state.stop()
				return state.replayed
			})
			await watcher.dispose()
			expect(replayed, "hover and resize never restart the grow-in").toBe(false)
		})
	}
})

test("charts.progress budget usage tooltip reconciles actual and projected spending even with a zero plan", async ({
	page,
}) => {
	await seedWorkspace(page)
	await page.goto("/budgets/t1-b-manual")
	const chart = page.locator('[data-slot="card"]').filter({
		has: page.locator('[data-slot="card-title"]').filter({ hasText: "Spending over time" }),
	})
	const application = chart.getByRole("application")
	await application.focus()
	for (let index = 0; index < 4; index++) await page.keyboard.press("ArrowRight")
	const tooltip = chart.locator(".recharts-tooltip-wrapper")
	await expect(tooltip).toContainText("5 Oct")
	await expect(tooltip).toContainText("$84.20")
	for (let index = 0; index < 5; index++) await page.keyboard.press("ArrowRight")
	await expect(tooltip).toContainText("10 Oct")
	await expect(tooltip).toContainText("$117.53")
	for (let index = 0; index < 21; index++) await page.keyboard.press("ArrowRight")
	await expect(tooltip).toContainText("31 Oct")
	await expect(tooltip).toContainText("Usage (projection)")
	await expect(tooltip).toContainText("$242.90")
	await page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
			open.onerror = () => reject(open.error)
		})
		await new Promise<void>((resolve, reject) => {
			const transaction = database.transaction("budgets", "readwrite")
			transaction.oncomplete = () => {
				database.close()
				resolve()
			}
			transaction.onabort = () => reject(transaction.error)
			const request = transaction.objectStore("budgets").get("t1-b-manual")
			request.onsuccess = () =>
				transaction.objectStore("budgets").put({ ...request.result, amount: 0 })
		})
	})
	await page.reload()
	// With a zero plan, the spent amount and every usage value are unchanged.
	const spent = page.getByText("Spent", { exact: true }).locator("..")
	await expect(spent).toContainText("$117.53")
	await expect(spent).toContainText("$0.00")
	await expect(page.locator("main")).not.toContainText(/NaN|Infinity/)
	await application.focus()
	for (let index = 0; index < 4; index++) await page.keyboard.press("ArrowRight")
	await expect(tooltip).toContainText("5 Oct")
	await expect(tooltip).toContainText("$84.20")
	for (let index = 0; index < 5; index++) await page.keyboard.press("ArrowRight")
	await expect(tooltip).toContainText("10 Oct")
	await expect(tooltip).toContainText("$117.53")
	for (let index = 0; index < 21; index++) await page.keyboard.press("ArrowRight")
	await expect(tooltip).toContainText("31 Oct")
	await expect(tooltip).toContainText("$242.90")
	// Every plotted path stays finite.
	const paths = await chart
		.locator("svg path")
		.evaluateAll(elements => elements.map(element => element.getAttribute("d") ?? ""))
	expect(paths.length).toBeGreaterThan(0)
	for (const path of paths) expect(path).not.toMatch(/NaN|Infinity/)
})

test("charts.containment every dense chart fits the viewport with usable graph surfaces", {
	tag: ["@tall"],
}, async ({ page }) => {
	await seedWorkspace(page, "dense")
	await page.goto("/?month=October&year=2026")
	for (const title of [
		...overviewCharts,
		"Categories this month",
		"Monthly budgets",
		"Spending calendar",
		"Biggest changes",
	]) {
		const card = page
			.locator('[data-slot="card"]')
			.filter({ has: page.locator('[data-slot="card-title"]').filter({ hasText: title }) })
		await expect(card).toBeVisible()
		expect(
			await card.evaluate(element => element.scrollWidth - element.clientWidth),
			title,
		).toBeLessThanOrEqual(1)
		await expect(card).not.toContainText(/NaN|Infinity/)
		if (overviewCharts.includes(title)) {
			await card.getByRole("application").focus()
			await page.keyboard.press("ArrowRight")
			await expect(card.locator(".recharts-tooltip-wrapper")).toBeVisible()
		}
	}
})
