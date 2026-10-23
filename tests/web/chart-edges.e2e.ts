import type { Page } from "@playwright/test"
import { IDS } from "./support/data"
import { setDateOnly } from "./support/date-only"
import { expect, seedWorkspace, test } from "./support/fixtures"

// Chart edge coverage: responsive containment and readability per card,
// keyboard drills, and the three real DOM CSS transitions (movers scale,
// donut dim, calendar heat). Category mix bars have no transition, so no
// motion test exists for them.

const overview = "/?month=October&year=2026"

// Every rendered Overview card.
const cardTitles = [
	"Spending forecast",
	"Surplus / Shortfall",
	"Spending by day",
	"Spending by weekday",
	"Category trend",
	"Categories this month",
	"Monthly budgets",
	"Spending calendar",
	"Biggest changes",
]

const overflow = (chart: ReturnType<typeof card>) =>
	chart.evaluate(element => element.scrollWidth - element.clientWidth)

function card(page: Page, title: string) {
	return page
		.locator('[data-slot="card"]')
		.filter({ has: page.locator('[data-slot="card-title"]').filter({ hasText: title }) })
}

function distinct(values: string[]) {
	return new Set(values).size
}

function tailStable(values: string[], count = 3) {
	return values.length >= count && new Set(values.slice(-count)).size === 1
}

test("chart-edges dense journeys share one dense seed", { tag: ["@tall", "@motion"] }, async ({
	page,
}) => {
	test.setTimeout(150_000)
	await seedWorkspace(page, "dense")
	await test.step("chart-edges containment: every dense card renders values and fits", async () => {
		await page.goto(overview)
		for (const title of cardTitles) {
			const chart = card(page, title)
			await expect(chart, title).toBeVisible()
			// Wait for rendered numbers before the negative checks, so they cannot pass on an empty card.
			await expect(chart, `${title}: renders values`).toContainText(/\d/)
			await expect
				.poll(() => overflow(chart), `${title}: no horizontal overflow`)
				.toBeLessThanOrEqual(1)
			await expect(chart, `${title}: finite values`).not.toContainText(/NaN|Infinity/)
		}
		await page.goto("/budgets/t1-d-b-01")
		const progress = card(page, "Spending over time")
		await expect(progress).toBeVisible()
		expect(
			await progress.evaluate(element => element.scrollWidth - element.clientWidth),
			"Spending over time (budget-progress-chart.tsx): no horizontal overflow",
		).toBeLessThanOrEqual(1)
		await expect(progress).not.toContainText(/NaN|Infinity/)
	})
	await test.step("chart-edges dense long category name stays truncated and readable", async () => {
		const name = `Dense ${"早餐 café ☕ ".repeat(12).trim()}`
		await page.evaluate(
			async ({ categoryId, name }) => {
				const database = await new Promise<IDBDatabase>((resolve, reject) => {
					const open = indexedDB.open("finpoint")
					open.onsuccess = () => resolve(open.result)
					open.onerror = () => reject(open.error)
				})
				try {
					await new Promise<void>((resolve, reject) => {
						const transaction = database.transaction("categories", "readwrite")
						transaction.oncomplete = () => resolve()
						transaction.onabort = () => reject(transaction.error)
						const request = transaction.objectStore("categories").get(categoryId)
						request.onsuccess = () =>
							transaction.objectStore("categories").put({ ...request.result, name })
					})
				} finally {
					database.close()
				}
			},
			{ categoryId: "t1-d-cat-01", name },
		)
		await page.goto(overview)
		const mix = card(page, "Categories this month")
		const row = mix.getByRole("link", { name: /^Dense 早餐/ })
		await expect(row).toBeVisible()
		const label = row.locator("span.truncate")
		await expect(label).toHaveCSS("text-overflow", "ellipsis")
		expect(
			await label.evaluate(element => element.scrollWidth > element.clientWidth),
			"long category name is cut off with an ellipsis",
		).toBe(true)
		expect(
			await row.evaluate(element => element.scrollWidth - element.clientWidth),
			"the row itself does not overflow",
		).toBeLessThanOrEqual(1)
		// The amount column stays fully visible beside the truncated name.
		const amount = row.locator("span.shrink-0")
		await expect(amount).toBeVisible()
		expect(await amount.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(
			true,
		)
		for (const title of ["Biggest changes", "Spending calendar", "Monthly budgets"]) {
			const chart = card(page, title)
			await expect(chart).toBeVisible()
			expect(
				await chart.evaluate(element => element.scrollWidth - element.clientWidth),
				`${title}: fits with dense long-name data`,
			).toBeLessThanOrEqual(1)
		}
	})
	await test.step("chart-edges monthly budget donut dims siblings smoothly on focus", async () => {
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
		await page.locator('header [data-slot="sidebar-trigger"]').focus()
		await expect
			.poll(() => groupElement.evaluate(element => getComputedStyle(element).opacity))
			.toBe("1")
		await groupElement.dispose()
	})
})

test("chart-edges populated journeys share one seed", {
	tag: ["@tall", "@light", "@motion"],
}, async ({ page }) => {
	test.setTimeout(150_000)
	await seedWorkspace(page)
	await test.step("chart-edges tooltips stay numeric and inside every viewport", async () => {
		await page.goto(overview)
		const viewport = page.viewportSize()
		for (const title of [
			"Spending forecast",
			"Surplus / Shortfall",
			"Spending by day",
			"Spending by weekday",
			"Category trend",
		]) {
			const chart = card(page, title)
			const surface = chart.getByRole("application").first()
			await surface.scrollIntoViewIfNeeded()
			await surface.focus()
			for (let index = 0; index < 4; index++) {
				await surface.press("ArrowRight")
				await page.evaluate(() => new Promise(requestAnimationFrame))
			}
			const tooltip = chart.locator(".recharts-tooltip-wrapper")
			await expect(tooltip, `${title}: tooltip opens by keyboard`).toBeVisible()
			await expect(tooltip, `${title}: tooltip carries a value`).toContainText(/\$/)
			const box = await tooltip.boundingBox()
			expect(box, `${title}: tooltip is laid out`).not.toBeNull()
			if (box && viewport) {
				expect(box.x, `${title}: tooltip inside the left edge`).toBeGreaterThanOrEqual(-8)
				expect(
					box.x + box.width,
					`${title}: tooltip inside the right edge`,
				).toBeLessThanOrEqual(viewport.width + 8)
			}
		}
		await page.goto(`/budgets/${IDS.budgets.manual}`)
		const progress = card(page, "Spending over time")
		const surface = progress.getByRole("application")
		await surface.scrollIntoViewIfNeeded()
		await surface.focus()
		for (let index = 0; index < 4; index++) {
			await surface.press("ArrowRight")
			await page.evaluate(() => new Promise(requestAnimationFrame))
		}
		const tooltip = progress.locator(".recharts-tooltip-wrapper")
		await expect(tooltip).toBeVisible()
		await expect(tooltip).toContainText("5 Oct")
		await expect(tooltip).toContainText("$84.20")
	})
	await test.step("chart-edges calendar and movers drills work by keyboard", async () => {
		await page.goto(overview)
		const calendar = card(page, "Spending calendar")
		const day = calendar.getByRole("button", { name: /^5 October:/ })
		await day.scrollIntoViewIfNeeded()
		await day.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(/start_date=2026-10-05/)
		await expect(page).toHaveURL(/end_date=2026-10-05/)
		await page.goto(overview)
		const mover = card(page, "Biggest changes").getByRole("link", { name: /Housing/ })
		await mover.scrollIntoViewIfNeeded()
		await mover.focus()
		await page.keyboard.press("Enter")
		await expect(page).toHaveURL(new RegExp(`category_ids=${IDS.categories.rent}`))
	})
	await test.step("chart-edges calendar heat fades in place on month change", async () => {
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
	await test.step("chart-edges movers liveRecordamount bar transitions on record update", async () => {
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
		const href = await row.getAttribute("href")
		const rowHandle = await row.elementHandle()
		if (!rowHandle) throw new Error("Groceries mover row missing")
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
		await expect(row).toHaveAttribute("title", /176\.08/)
		expect(await row.getAttribute("href"), "drill link identity retained").toBe(href)
		expect(
			await rowHandle.evaluate(element => element.isConnected),
			"row node persists (keys kept)",
		).toBe(true)
		await rowHandle.dispose()
	})
})
