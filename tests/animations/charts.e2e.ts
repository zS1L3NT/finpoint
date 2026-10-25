import type { Page } from "@playwright/test"
import { card, overview, overviewCharts } from "../support/charts"
import { setDateOnly } from "../support/date-only"
import { expect, seedWorkspace, test } from "../support/fixtures"
import { mobileMenu } from "../support/tables"

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

function distinct(values: string[]) {
	return new Set(values).size
}

function tailStable(values: string[], count = 3) {
	return values.length >= count && new Set(values.slice(-count)).size === 1
}

test("chart intro: overview and Budget charts grow once and hover or resize never replays the grow-in", {
	tag: ["@tall", "@light", "@reduced-motion"],
}, async ({ page, isMobile }) => {
	test.setTimeout(150_000)
	await seedWorkspace(page)
	for (const destination of ["overview", "budget"] as const) {
		await test.step(`chart intro: ${destination} charts grow real graph marks once and respect reduced motion`, async () => {
			await page.goto(destination === "overview" ? "/records" : "/budgets")
			// Before hydration the trigger does nothing, so retry until the sheet is open.
			if (destination === "overview" && isMobile)
				await expect(async () => {
					await mobileMenu(page).click()
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

test("Monthly Budget donut: focus dims sibling segments in a smooth transition", {
	tag: ["@tall", "@reduced-motion"],
}, async ({ page }) => {
	test.setTimeout(150_000)
	await seedWorkspace(page, "dense")
	await test.step("Monthly Budget donut: sibling segments dim smoothly on focus", async () => {
		const reduced = test.info().project.name === "reduced-motion"
		await page.goto(overview)
		const budgets = card(page, "Monthly budgets")
		const segments = budgets.locator('svg path[role="button"]')
		await expect(segments).toHaveCount(2)
		// The wrapping g carries the dimming transition; closest() in-page avoids
		// xpath context-node semantics entirely (a bare ancestor:: axis never matches
		// from the document root and hangs element resolution).
		const secondHandle = await segments.nth(1).elementHandle()
		if (!secondHandle) throw new Error("donut second segment missing")
		const groupHandle = await secondHandle.evaluateHandle(element => element.closest("g"))
		await secondHandle.dispose()
		expect(
			await groupHandle.evaluate(element => element?.tagName ?? "missing"),
			"sibling segment wraps in a g",
		).toBe("g")
		const groupElement = groupHandle.asElement()
		if (!groupElement) throw new Error("donut sibling segment missing")
		// Settle the page before sampling (intros/cascades/live ticks starve rAF
		// exactly when the 150ms transition runs), park the pointer away from the
		// card, and take a synchronous baseline: it needs no frames, so starvation
		// cannot erase the pre-action pose.
		await page.waitForTimeout(1200)
		await page.mouse.move(0, 0)
		expect(
			await groupElement.evaluate(element => getComputedStyle(element).opacity),
			"sibling starts undimmed",
		).toBe("1")
		const sampler = await page.evaluateHandle(element => {
			const values: { time: number; value: string }[] = []
			let completed = 0
			const finished = new Promise<{ time: number; value: string }[]>((resolve, reject) => {
				const start = performance.now()
				const tick = (now: number) => {
					values.push({
						time: now - start,
						value: element.isConnected ? getComputedStyle(element).opacity : "gone",
					})
					const recent = values.filter(entry => entry.time > now - start - 300)
					const stable =
						recent.length > 0 && new Set(recent.map(entry => entry.value)).size === 1
					// Deadline runs from the completion mark (focus applied), with a
					// stable-tail gate instead of a fixed startup window.
					if (completed && now - completed >= 700 && stable) resolve(values)
					else if (!completed && now - start > 30000)
						reject(new Error("donut sampler never completed"))
					else if (completed && now - completed > 8000)
						reject(
							new Error(
								`donut opacity never settled: ${JSON.stringify(values.slice(-5))}`,
							),
						)
					else requestAnimationFrame(tick)
				}
				requestAnimationFrame(tick)
			})
			return {
				finished,
				complete: () => {
					completed = performance.now()
				},
			}
		}, groupElement)
		let samples: { time: number; value: string }[]
		try {
			await segments.nth(0).focus()
			await sampler.evaluate(state => state.complete())
			samples = await sampler.evaluate(state => state.finished)
		} finally {
			await sampler.dispose()
		}
		expect(samples.length).toBeGreaterThanOrEqual(5)
		const values = samples.map(sample => sample.value)
		expect(values.at(-1), "sibling settles dimmed").toBe("0.4")
		expect(tailStable(values), "sibling opacity settles").toBe(true)
		if (reduced)
			expect(distinct(values), "reduced motion dims immediately").toBeLessThanOrEqual(2)
		else expect(distinct(values), "sibling opacity transitions").toBeGreaterThan(2)
		expect(await groupElement.evaluate(element => getComputedStyle(element).opacity)).toBe(
			"0.4",
		)
		// Park the pointer off the card first: a cursor left hovering the segment
		// would keep it dimmed through mouse hover even after blur. Then move focus
		// to a real focusable control outside the card: document.activeElement is an
		// SVGElement here, which instanceof HTMLElement excludes, so an HTML-only
		// blur predicate would leave the path focused and dimmed.
		await page.mouse.move(0, 0)
		// Phones swap the header trigger for the tab bar's Menu; either is a focusable outside the card.
		await page
			.locator('header [data-slot="sidebar-trigger"], nav[aria-label="Primary"] button')
			.filter({ visible: true })
			.first()
			.focus()
		await expect
			.poll(() => groupElement.evaluate(element => getComputedStyle(element).opacity))
			.toBe("1")
		await groupElement.dispose()
	})
})

test("populated charts: calendar heat and mover bars transition in place", {
	tag: ["@tall", "@light", "@reduced-motion"],
}, async ({ page }) => {
	test.setTimeout(150_000)
	await seedWorkspace(page)
	await test.step("spending calendar: day heat fades in place on month change", async () => {
		const reduced = test.info().project.name === "reduced-motion"
		await page.goto(overview)
		const calendar = card(page, "Spending calendar")
		const day = calendar.getByRole("button", { name: /^5 October:/ })
		await day.scrollIntoViewIfNeeded()
		const handle = await day.elementHandle()
		if (!handle) throw new Error("October day 5 button missing")
		const sampler = await page.evaluateHandle(element => {
			const values: { time: number; value: string }[] = []
			let completed = 0
			const finished = new Promise<{ time: number; value: string }[]>((resolve, reject) => {
				const start = performance.now()
				const tick = (now: number) => {
					values.push({
						time: now - start,
						value: element.isConnected
							? getComputedStyle(element).backgroundColor
							: "gone",
					})
					const recent = values.filter(entry => entry.time > now - start - 300)
					const stable =
						recent.length > 0 && new Set(recent.map(entry => entry.value)).size === 1
					// The deadline runs from the completion mark (September rendered),
					// never from sampler start: month navigation routinely takes >1s.
					if (completed && now - completed >= 900 && stable) resolve(values)
					else if (!completed && now - start > 30000)
						reject(new Error("calendar sampler never completed"))
					else if (completed && now - completed > 10000)
						reject(
							new Error(
								`day heat never settled: ${JSON.stringify(values.slice(-5))}`,
							),
						)
					else requestAnimationFrame(tick)
				}
				requestAnimationFrame(tick)
			})
			return {
				finished,
				complete: () => {
					completed = performance.now()
				},
			}
		}, handle)
		let samples: { time: number; value: string }[]
		try {
			await page.getByRole("button", { name: "Previous month", exact: true }).click()
			// Completion mark only after the September result renders.
			await expect(calendar.getByRole("button", { name: /^5 September:/ })).toBeVisible()
			await sampler.evaluate(state => state.complete())
			samples = await sampler.evaluate(state => state.finished)
		} finally {
			await sampler.dispose()
		}
		await handle.dispose()
		const values = samples.map(sample => sample.value)
		// Density only (rAF can starve under parallel workers); motion proof below.
		expect(values.length).toBeGreaterThanOrEqual(5)
		expect(values.includes("gone"), "day node persists across the month change").toBe(false)
		expect(tailStable(values), "day heat settles").toBe(true)
		if (reduced)
			expect(distinct(values), "reduced motion recolors immediately").toBeLessThanOrEqual(2)
		else expect(distinct(values), "day heat transitions in place").toBeGreaterThan(2)
	})
	await test.step("biggest changes: the mover bar scale transitions on Record update", async () => {
		const reduced = test.info().project.name === "reduced-motion"
		// Baseline comparators: September spending for daily-budget categories so the
		// Groceries mover row exists with a comparison before the live update (same
		// raw-IDB pattern as charts.refund). The update stays in the same scope so
		// the card keeps its keys: scope navigation remounts rows, which cannot
		// prove a bar-scale transition.
		await page.evaluate(async () => {
			const database = await new Promise<IDBDatabase>((resolve, reject) => {
				const open = indexedDB.open("finpoint")
				open.onsuccess = () => resolve(open.result)
				open.onerror = () => reject(open.error)
			})
			try {
				await new Promise<void>((resolve, reject) => {
					const transaction = database.transaction("records", "readwrite")
					transaction.oncomplete = () => resolve()
					transaction.onabort = () => reject(transaction.error)
					const store = transaction.objectStore("records")
					for (const [id, title, datetime, amount, category] of [
						[
							"t1-x-sep-groceries",
							"September Groceries",
							"2026-09-15 18:00",
							-50,
							"t1-cat-groceries",
						],
						[
							"t1-x-sep-dining",
							"September Dinner",
							"2026-09-16 19:30",
							-30,
							"t1-cat-dining",
						],
					] as const) {
						store.put({
							id,
							title,
							people: null,
							location: null,
							description: null,
							datetime,
							amount,
							category_id: category,
							analytics_treatment: "spending",
							analytics_treatment_source: "category",
							monthly_budget_id: "t1-mb-daily",
							monthly_budget_source: "category",
							revision: 1,
						})
					}
				})
			} finally {
				database.close()
			}
		})
		await page.goto(overview)
		const movers = card(page, "Biggest changes")
		const row = movers.getByRole("link", { name: /^Groceries/ })
		await expect(row).toBeVisible()
		const frames = await page.evaluateHandle(() => {
			const root = [...document.querySelectorAll('[data-slot="card"]')].find(card =>
				card
					.querySelector('[data-slot="card-title"]')
					?.textContent?.includes("Biggest changes"),
			)
			const snapshot = () => {
				const link = [...(root?.querySelectorAll("a") ?? [])].find(link =>
					(link.getAttribute("title") ?? "").startsWith("Groceries:"),
				)
				const bar = link?.querySelector("span.transition-transform")
				return bar ? getComputedStyle(bar).transform : "gone"
			}
			const samples: { time: number; transform: string }[] = []
			let completed = 0
			const finished = new Promise<{ time: number; transform: string }[]>(
				(resolve, reject) => {
					const start = performance.now()
					const tick = (now: number) => {
						samples.push({ time: now - start, transform: snapshot() })
						// The deadline runs from the completion mark (committed money
						// landed), never from sampler start.
						if (completed && now - completed > 1500) resolve(samples)
						else if (!completed && now - start > 30000)
							reject(new Error("movers sampler never completed"))
						else requestAnimationFrame(tick)
					}
					requestAnimationFrame(tick)
				},
			)
			return {
				finished,
				complete: () => {
					completed = performance.now()
				},
			}
		})
		let samples: { time: number; transform: string }[]
		// A second page in the same context drives a real editor save: raw
		// indexedDB writes bypass the app's live Dexie subscriptions (Dexie
		// re-fires live queries only for Dexie-originated commits), so only an
		// actual UI save handler propagates live. The first page keeps the same
		// chart/bar DOM throughout; no remount, no fake motion or data state.
		const editor = await page.context().newPage()
		try {
			await setDateOnly(editor, new Date("2026-10-15T12:00:00+08:00"))
			await editor.goto("/records/t1-r-groceries")
			await editor.getByRole("button", { name: "Edit Record", exact: true }).click()
			const dialog = editor.getByRole("dialog", { name: "Edit Record", exact: true })
			await expect(dialog).toBeVisible()
			await dialog.locator("#amount").fill("-142.75")
			await page.bringToFront()
			// Evaluate-click keeps the first page foreground so its rAF keeps
			// ticking while the second page saves.
			const save = await dialog.getByRole("button", { name: "Save changes" }).elementHandle()
			if (!save) throw new Error("editor Save missing")
			await save.evaluate(element => (element as HTMLElement).click())
			await save.dispose()
			// Completion mark only after the committed money lands in the first
			// page. The row aggregates its category (FairPrice −142.75 plus Kōpi
			// −33.33), so the title shows $176.08, not the single-record amount.
			await expect(row).toHaveAttribute("title", /176\.08/)
			await frames.evaluate(state => state.complete())
			samples = await frames.evaluate(state => state.finished)
		} finally {
			await frames.dispose()
			await editor.close()
		}
		// Frame counts only prove observation density (rAF can starve under parallel
		// workers); the motion proof is in the distinct/settled assertions below.
		expect(samples.length).toBeGreaterThanOrEqual(5)
		const series = samples.map(frame => frame.transform)
		expect(series.includes("gone"), "Groceries bar persists through the update").toBe(false)
		const endTime = samples.at(-1)?.time ?? 0
		const tail = samples
			.filter(frame => frame.time > endTime - 300)
			.map(frame => frame.transform)
		expect(new Set(tail).size, "Groceries bar transform settles").toBe(1)
		if (reduced)
			expect(
				distinct(series),
				"reduced motion applies the new scale immediately",
			).toBeLessThanOrEqual(2)
		else {
			expect(distinct(series), "Groceries bar scale transitions").toBeGreaterThan(2)
			expect(series[0], "bar scale actually changes").not.toBe(series.at(-1))
		}
	})
})
