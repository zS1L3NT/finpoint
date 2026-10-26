import { expect, test } from "../support/fixtures"
import { sampleVisibleRowAnimations } from "../support/motion"
import { HARNESS_URL } from "../support/urls"

test.describe("harness facets section", () => {
	test.use({ baseURL: HARNESS_URL })
	test("facet skeleton: pulse animates through frames without moving the placeholder", {
		tag: ["@light"],
	}, async ({ page }) => {
		await test.step("facet skeleton: pulse changes opacity through frames while placeholder geometry stays stable", async () => {
			await page.goto("/?section=primitives")
			await page.goto("/?section=primitives")
			const skeleton = page.getByTestId("standalone-skeleton")
			await skeleton.scrollIntoViewIfNeeded()
			const start = await skeleton.boundingBox()
			const samples = await skeleton.evaluate(async element => {
				const values: string[] = []
				const start = performance.now()
				while (performance.now() - start < 2200) {
					values.push(getComputedStyle(element).opacity)
					await new Promise(requestAnimationFrame)
				}
				return values
			})
			expect(new Set(samples).size).toBeGreaterThan(2)
			expect(await skeleton.boundingBox()).toEqual(start)
		})
	})
})

test.describe("harness display section", () => {
	test.use({ baseURL: HARNESS_URL })
	test.beforeEach(async ({ page }) => {
		await page.goto("/display.html", { waitUntil: "commit" })
		await expect(page.getByRole("heading", { name: "Display components" })).toBeVisible()
	})

	// Motion steps each reveal content, so the page reloads between them: the
	// polyline sampler must observe the pre-mount state, which a revealed trend
	// from the entrance step would destroy.
	test("sparkline and summary: entrances, polyline draw and changing values animate through frames", {
		tag: ["@reduced-motion"],
	}, async ({ page }) => {
		await test.step("sparkline entrance: respects reduced motion and fades in through frames", async () => {
			const button = page.getByRole("button", { name: "Show trend" })
			await button.scrollIntoViewIfNeeded()
			const samples = await sampleVisibleRowAnimations(
				page,
				'section[aria-label="Trend entrance"] svg circle',
				() => button.click(),
			)
			expect(samples).toHaveLength(1)
			const frames = samples[0]?.frames ?? []
			expect(frames.at(-1)?.opacity).toBe(1)
			if (test.info().project.name === "reduced-motion")
				expect(
					frames.every(frame => frame.opacity === 1 && frame.transform === "none"),
				).toBe(true)
			else expect(Math.min(...frames.map(frame => frame.opacity))).toBeLessThan(0.95)
		})
		await page.reload()
		await expect(page.getByRole("heading", { name: "Display components" })).toBeVisible()
		await test.step("sparkline polyline: draws progressively then settles", async () => {
			const reduced = test.info().project.name === "reduced-motion"
			const button = page.getByRole("button", { name: "Show trend" })
			await button.scrollIntoViewIfNeeded()
			// Sample from before the click until 800ms after the polyline first mounts, so slow
			// action scheduling cannot use up the window.
			const sampler = await page.evaluateHandle(() => {
				const values: { time: number; dasharray: string; dashoffset: string }[] = []
				let markReady = () => undefined as void
				const ready = new Promise<void>(resolve => {
					markReady = resolve
				})
				const finished = new Promise<
					{ time: number; dasharray: string; dashoffset: string }[]
				>((resolve, reject) => {
					const start = performance.now()
					let mountedAt: number | null = null
					const tick = (now: number) => {
						const line = document.querySelector(
							'section[aria-label="Trend entrance"] svg polyline',
						)
						values.push({
							time: now - start,
							dasharray: line?.getAttribute("stroke-dasharray") ?? "gone",
							dashoffset: line?.getAttribute("stroke-dashoffset") ?? "gone",
						})
						markReady()
						if (line && mountedAt === null) mountedAt = now
						if (mountedAt !== null && now - mountedAt > 800) resolve(values)
						else if (now - start > 10_000)
							reject(new Error("Trend polyline never mounted"))
						else requestAnimationFrame(tick)
					}
					requestAnimationFrame(tick)
				})
				return { ready, finished }
			})
			await sampler.evaluate(state => state.ready)
			await button.click()
			let samples: { time: number; dasharray: string; dashoffset: string }[]
			try {
				samples = await sampler.evaluate(state => state.finished)
			} finally {
				await sampler.dispose()
			}
			expect(samples.length).toBeGreaterThan(5)
			const arrays = samples.map(sample => sample.dasharray)
			expect(arrays.includes("gone"), "sampler captures the pre-mount reveal").toBe(true)
			const mounted = arrays.filter(entry => entry !== "gone")
			expect(mounted.length, "polyline mounts").toBeGreaterThan(5)
			const first = Number(mounted[0]?.split(" ")[0])
			const last = Number(mounted.at(-1)?.split(" ")[0])
			if (reduced) expect(first, "reduced motion draws immediately").toBe(1)
			else expect(first, "polyline starts undrawn").toBeLessThan(1)
			expect(last, "polyline ends fully drawn").toBeCloseTo(1, 2)
			const tail = mounted.slice(-3).map(entry => Number(entry.split(" ")[0]))
			expect(new Set(tail).size, "polyline stroke settles").toBe(1)
			if (reduced)
				expect(new Set(mounted).size, "reduced motion stays drawn").toBeLessThanOrEqual(2)
			else expect(new Set(mounted).size, "polyline stroke progresses").toBeGreaterThan(2)
		})
		await test.step("detail summary: changed value settles through frames after keyboard action", async () => {
			const button = page.getByRole("button", { name: "Change value" })
			await button.focus()
			const samples = await sampleVisibleRowAnimations(
				page,
				'section[aria-label="Changing value"] > span > span:has(> span[data-value="-$25.00"])',
				async () => {
					await page.keyboard.press("Enter")
				},
			)
			const entered = samples.find(sample => sample.text === "SPAN -$25.00")
			expect(entered).toBeDefined()
			expect(entered?.frames.at(-1)?.opacity).toBe(1)
			if (test.info().project.name === "reduced-motion")
				expect(new Set(entered?.frames.map(frame => frame.transform)).size).toBe(1)
			else
				expect(
					Math.min(...(entered?.frames.map(frame => frame.opacity) ?? [])),
				).toBeLessThan(0.95)
		})
	})
})
