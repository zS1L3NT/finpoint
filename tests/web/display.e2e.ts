import { expect, test } from "@playwright/test"
import { expectPointerCursor, sampleVisibleRowAnimations } from "./support/assertions"

test.use({ baseURL: "http://127.0.0.1:5174" })
test.beforeEach(async ({ page }) => {
	await page.goto("/display.html", { waitUntil: "commit" })
	await expect(page.getByRole("heading", { name: "Display components" })).toBeVisible()
})

// Read-only primitive checks share one page load: no step mutates the page.
test("display static primitives share one page", async ({ page }) => {
	await test.step("display.allocation zero negative full excess and opposite signs remain finite and bounded", async () => {
		for (const [title, percent, amount] of [
			["Zero", 0, "$0.00 / $0.00"],
			["Partial negative", 40, "-$10.00 / -$25.00"],
			["Full", 100, "$25.00 / $25.00"],
			["Excess", 100, "-$75.00 / -$50.00"],
			["Opposite sign", 0, "$10.00 / -$25.00"],
		] as const) {
			const bar = page.getByTestId(`allocation-${title}`)
			await expect(bar).toContainText(amount)
			await expect(bar.getByRole("progressbar")).toHaveAttribute(
				"aria-valuenow",
				String(percent),
			)
			const scale = await bar
				.getByRole("progressbar")
				.locator(":scope > div")
				.first()
				.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)
			expect(scale).toBeCloseTo(percent / 100, 2)
		}
		await expect(
			page.getByTestId("allocation-Excess").getByRole("progressbar").locator(":scope > div"),
		).toHaveCount(2)
	})
	await test.step("display.sparkline missing flat negative mixed and dense values have correct finite endpoints", async () => {
		for (const name of ["Empty", "Single"])
			await expect(page.getByTestId(`sparkline-${name}`).locator("svg")).toHaveCount(0)
		for (const [name, count, lastY, zeroLine] of [
			["Zero", 3, 25, false],
			["Negative", 3, 7.4, false],
			["Mixed", 3, 3, true],
			["Dense", 100, 3 + (1 - (-200 + 300) / 600) * 22, true],
		] as const) {
			const svg = page.getByRole("img", { name, exact: true })
			const serialized = await svg.locator("polyline").getAttribute("points")
			if (!serialized) throw new Error(`${name}: no data marks`)
			const points = serialized.split(" ").map(point => point.split(",").map(Number))
			expect(points).toHaveLength(count)
			expect(points.flat().every(Number.isFinite)).toBe(true)
			expect(points.at(-1)?.[0]).toBe(93)
			expect(points.at(-1)?.[1]).toBeCloseTo(lastY, 2)
			await expect(svg.locator("circle")).toHaveAttribute("cx", "93")
			await expect(svg.locator("line")).toHaveCount(zeroLine ? 1 : 0)
			const box = await svg.boundingBox()
			expect(box?.width).toBe(96)
			expect(box?.height).toBe(28)
		}
	})
	await test.step("display.amount and badge optional states preserve signs pending values and colour fallback", async () => {
		await expect(page.getByTestId("pending-amount")).toHaveText("-$25.00[-$10.00]")
		await expect(page.getByTestId("confirmed-amount")).toHaveText("$20.00")
		await expect(page.getByTestId("zero-amount")).toHaveText("$0.00")
		const badges = page.getByRole("region", { name: "Budget badges" })
		for (const label of ["Unbudgeted", "No colour"])
			await expect(badges.getByText(label).locator(":scope > span")).toHaveCSS(
				"border-top-style",
				"solid",
			)
		const colour = badges.locator("span[title]")
		await expect(colour.locator(":scope > span").first()).toHaveCSS(
			"background-color",
			"rgb(56, 189, 248)",
		)
		await expect(colour).toHaveAttribute("title", /早餐/)
		const overflow = await badges.evaluate(element => element.scrollWidth - element.clientWidth)
		expect(overflow).toBeLessThanOrEqual(1)
	})
	await test.step("display.icons missing invalid prefixed and dynamic icons retain real SVG output and reserved size", async () => {
		await expect(page.getByTestId("empty-icon").locator("svg")).toHaveCount(0)
		for (const name of ["Known icon", "Dynamic icon", "Fallback icon"])
			await expect(page.locator(`svg[aria-label="${name}"] path`)).not.toHaveCount(0)
		await expect(page.locator('svg[aria-label="Fallback icon"]')).toHaveClass(
			/lucide-circle-question-mark/,
		)
		const coloured = page.getByTestId("colour-icon").locator("div")
		await expect(coloured).toHaveCSS("width", "32px")
		await expect(coloured).toHaveCSS("background-color", "rgb(239, 108, 0)")
		await expect(coloured.locator("svg")).toHaveAttribute("width", "16")
	})
	await test.step("display.sparkline fixtures fit narrow viewports with visible strokes", async () => {
		const viewport = page.viewportSize()
		for (const name of ["Zero", "Negative", "Mixed", "Dense"]) {
			const svg = page.getByRole("img", { name, exact: true })
			await expect(svg, `${name}: sparkline renders`).toBeVisible()
			const box = await svg.boundingBox()
			expect(box, `${name}: sparkline is laid out`).not.toBeNull()
			if (box && viewport) {
				expect(box.x, `${name}: inside the left edge`).toBeGreaterThanOrEqual(-1)
				expect(box.x + box.width, `${name}: inside the right edge`).toBeLessThanOrEqual(
					viewport.width + 1,
				)
			}
			const paint = await svg.locator("polyline").evaluate(element => {
				const alpha = (color: string) => {
					const canvas = document.createElement("canvas")
					canvas.width = canvas.height = 1
					const context = canvas.getContext("2d")
					if (!context) throw new Error("Canvas is required to resolve colours")
					context.fillStyle = "rgba(0,0,0,0)"
					context.fillStyle = color
					context.fillRect(0, 0, 1, 1)
					return [...context.getImageData(0, 0, 1, 1).data]
				}
				let backdrop = "rgba(0, 0, 0, 0)"
				for (
					let node: Element | null = element.parentElement;
					node;
					node = node.parentElement
				) {
					const color = getComputedStyle(node).backgroundColor
					if ((alpha(color)[3] ?? 0) > 0) {
						backdrop = color
						break
					}
				}
				const style = getComputedStyle(element)
				return {
					stroke: alpha(style.stroke),
					backdrop: alpha(backdrop),
					width: Number.parseFloat(style.strokeWidth),
					opacity: Number(style.strokeOpacity) * Number(style.opacity),
				}
			})
			expect(paint.stroke[3], `${name}: stroke colour is opaque`).toBeGreaterThan(0)
			expect(paint.width, `${name}: stroke has width`).toBeGreaterThan(0)
			expect(paint.opacity, `${name}: stroke is not faded out`).toBeGreaterThan(0.5)
			expect(
				paint.stroke.slice(0, 3),
				`${name}: stroke differs from its backdrop`,
			).not.toEqual(paint.backdrop.slice(0, 3))
		}
		const region = page.getByRole("region", { name: "Sparkline boundaries", exact: true })
		await expect(region).toBeVisible()
		expect(
			await region.evaluate(element => element.scrollWidth - element.clientWidth),
		).toBeLessThanOrEqual(1)
	})
})

// Motion steps each reveal content, so the page reloads between them: the
// polyline sampler must observe the pre-mount state, which a revealed trend
// from the entrance step would destroy.
test("display motion primitives share one page with reloads", async ({ page }) => {
	await test.step("display.sparkline entrance respects reduced motion and draws the final data endpoint", async () => {
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
			expect(frames.every(frame => frame.opacity === 1 && frame.transform === "none")).toBe(
				true,
			)
		else expect(Math.min(...frames.map(frame => frame.opacity))).toBeLessThan(0.95)
		await expect(
			page.getByRole("img", { name: "New trend" }).locator("circle"),
		).toHaveAttribute("cy", "3")
	})
	await page.reload()
	await expect(page.getByRole("heading", { name: "Display components" })).toBeVisible()
	await test.step("display.sparkline polyline draws progressively then settles", async () => {
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
			const finished = new Promise<{ time: number; dasharray: string; dashoffset: string }[]>(
				(resolve, reject) => {
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
				},
			)
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
		await expect(
			page.getByRole("img", { name: "New trend" }).locator("circle"),
		).toHaveAttribute("cy", "3")
	})
	await test.step("display.summary long and missing values fit each viewport and changing values settle after keyboard action", async () => {
		const summary = page.getByRole("region", { name: "Detail summary" })
		await expect(summary).toContainText("Allocated -$10.00")
		await expect(summary).toContainText("Missing optional values remain readable")
		await expect(summary).toContainText("早餐")
		expect(
			await summary.evaluate(element => element.scrollWidth - element.clientWidth),
		).toBeLessThanOrEqual(1)
		const button = page.getByRole("button", { name: "Change value" })
		await expectPointerCursor(button)
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
			expect(Math.min(...(entered?.frames.map(frame => frame.opacity) ?? []))).toBeLessThan(
				0.95,
			)
		await expect(
			page.getByRole("region", { name: "Changing value" }).locator("span").first(),
		).toHaveText("-$25.00")
	})
})
