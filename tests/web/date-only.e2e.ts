import { expect, test } from "@playwright/test"
import { installDateOnly, setDateOnly } from "./support/date-only"
import { test as workspaceTest } from "./support/fixtures"

const october = new Date("2026-10-15T12:00:00+08:00").getTime()
const september = new Date("2026-09-15T12:00:00+08:00").getTime()

test("date-only preserves Date semantics and native animation/timer clocks", async ({ page }) => {
	const native = await page.evaluateHandle(() => ({
		Date,
		performance,
		now: performance.now,
		origin: performance.timeOrigin,
		setTimeout,
		clearTimeout,
		setInterval,
		clearInterval,
		requestAnimationFrame,
		cancelAnimationFrame,
	}))
	try {
		await setDateOnly(page, october)
		const semantics = await native.evaluate((native, epoch) => {
			class Child extends Date {}
			const child = new Child()
			return {
				noArgs: +new Date() === epoch,
				now: Date.now() === epoch && (0, Date.now)() === epoch,
				call: Date() === new native.Date(epoch).toString(),
				callIgnoresArguments: Reflect.apply(Date, {}, [Symbol()]) === Date(),
				explicitUndefined: Number.isNaN(+new Date(undefined as unknown as number)),
				explicitZero: +new Date(0) === 0,
				explicitISO: +new Date("2026-10-15T04:00:00Z") === epoch,
				copy: +new Date(new native.Date(1234)) === 1234,
				components: +new Date(2026, 9, 15, 12) === +new native.Date(2026, 9, 15, 12),
				invalid: Number.isNaN(+new Date("not a date")),
				statics:
					Date.UTC === native.Date.UTC &&
					Date.parse === native.Date.parse &&
					Date.UTC(2026, 9, 15, 4) === epoch &&
					Date.parse("2026-10-15T04:00:00Z") === epoch,
				instances:
					new Date() instanceof Date &&
					new Date() instanceof native.Date &&
					new native.Date() instanceof Date,
				subclass:
					child instanceof Child &&
					child instanceof Date &&
					child.constructor === Child &&
					+child === epoch,
				prototype: Date.prototype === native.Date.prototype,
				brand: Object.prototype.toString.call(new Date()) === "[object Date]",
				performance:
					performance === native.performance &&
					performance.now === native.now &&
					performance.timeOrigin === native.origin,
				timers:
					setTimeout === native.setTimeout &&
					clearTimeout === native.clearTimeout &&
					setInterval === native.setInterval &&
					clearInterval === native.clearInterval,
				animationFrames:
					requestAnimationFrame === native.requestAnimationFrame &&
					cancelAnimationFrame === native.cancelAnimationFrame,
			}
		}, october)
		for (const [name, passed] of Object.entries(semantics)) expect(passed, name).toBe(true)

		const frames = await page.evaluate(async () => {
			const frames: { time: number; timeline: number | null; now: number }[] = []
			for (let index = 0; index < 3; index++) {
				await new Promise<void>(resolve => {
					requestAnimationFrame(time => {
						const timeline = document.timeline.currentTime
						frames.push({
							time,
							timeline: typeof timeline === "number" ? timeline : null,
							now: performance.now(),
						})
						resolve()
					})
				})
			}
			return frames
		})
		expect(frames.length).toBe(3)
		for (const frame of frames) {
			expect(frame.timeline).not.toBeNull()
			expect(Math.abs(frame.time - Number(frame.timeline))).toBeLessThan(1)
			expect(frame.now).toBeGreaterThanOrEqual(frame.time)
		}
		expect(frames.at(-1)?.time).toBeGreaterThan(frames[0]?.time ?? Infinity)

		const timers = await page.evaluate(async () => {
			const started = performance.now()
			let ticks = 0
			await new Promise<void>(resolve => {
				const interval = setInterval(() => {
					if (++ticks !== 3) return
					clearInterval(interval)
					setTimeout(resolve, 10)
				}, 10)
			})
			return { ticks, elapsed: performance.now() - started, date: Date.now() }
		})
		expect(timers.ticks).toBe(3)
		expect(timers.elapsed).toBeGreaterThanOrEqual(20)
		expect(timers.date).toBe(october)
	} finally {
		await native.dispose()
	}
})

workspaceTest(
	"date-only default and September override survive navigation and reload",
	async ({ page }) => {
		expect(await page.evaluate(() => Date.now())).toBe(october)
		await page.goto("/privacy")
		expect(await page.evaluate(() => Date.now())).toBe(october)
		const saved = await page.evaluateHandle(() => ({ Date, now: Date.now }))
		try {
			await setDateOnly(page, september)
			expect(
				await saved.evaluate(saved => ({ same: saved.Date === Date, now: saved.now() })),
			).toEqual({ same: true, now: september })
		} finally {
			await saved.dispose()
		}
		await page.goto("/terms")
		expect(await page.evaluate(() => +new Date())).toBe(september)
		await page.reload()
		expect(await page.evaluate(() => Date.now())).toBe(september)

		// The chart editor opens a second page; pinning it must not reset its sibling.
		const editor = await page.context().newPage()
		try {
			await setDateOnly(editor, october)
			await editor.goto("/privacy")
			expect(await editor.evaluate(() => Date.now())).toBe(october)
			expect(await page.evaluate(() => Date.now())).toBe(september)
		} finally {
			await editor.close()
		}
	},
)

test("date-only init script replay keeps the newest override in every order", async ({
	context,
}) => {
	for (const order of [
		[1, 2],
		[2, 1],
		[2, 1, 2],
	]) {
		const page = await context.newPage()
		try {
			const versions = order.map(revision => ({
				time: revision === 1 ? october : september,
				revision,
			}))
			// Separate Playwright init scripts have unspecified order. Replay their
			// actual serialised installer explicitly to guarantee both orderings.
			await page.addInitScript({
				content: `(() => {
				const install = ${installDateOnly.toString()};
				for (const version of ${JSON.stringify(versions)}) install(version);
			})();`,
			})
			await page.goto("/privacy")
			expect(await page.evaluate(() => Date.now()), `order ${order}`).toBe(september)
			await page.reload()
			expect(await page.evaluate(() => +new Date()), `reload order ${order}`).toBe(september)
		} finally {
			await page.close()
		}
	}
})
