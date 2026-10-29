import timeline from "../../src/lib/guide-video-timeline.json" with { type: "json" }
import { stageHtml } from "../../video/scripts/stage"
import { expect, test } from "../support/fixtures"

for (const route of ["resume", "chapter"]) {
	const chapter = route === "chapter" ? timeline.chapters[2] : null
	test(`guide video ${route}: pause preserves playback and chapters seek explicitly`, async ({
		page,
	}) => {
		await page.goto(`/help/video${chapter ? `?chapter=${chapter.id}` : ""}`)
		const video = page.locator("video")
		const initial = (chapter?.startFrame ?? 0) / timeline.fps
		await expect
			.poll(() => video.evaluate((el: HTMLVideoElement) => el.readyState))
			.toBeGreaterThanOrEqual(2)
		await expect
			.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
			.toBeCloseTo(initial, 2)
		await video.evaluate(async (el: HTMLVideoElement) => {
			el.muted = true
			el.currentTime += 2
			await el.play()
		})
		await expect
			.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
			.toBeGreaterThan(initial + 2.2)
		const paused = await video.evaluate((el: HTMLVideoElement) => {
			const events: { type: string; time: number }[] = []
			for (const type of ["emptied", "loadstart", "seeking", "timeupdate"]) {
				el.addEventListener(type, () => events.push({ type, time: el.currentTime }))
			}
			Object.assign(el, { pauseEvents: events })
			el.pause()
			return el.currentTime
		})
		// Allow the IndexedDB live query to deliver the persisted pause back to the parent.
		await expect
			.poll(() =>
				page.evaluate(async () => {
					const db = await new Promise<IDBDatabase>((resolve, reject) => {
						const request = indexedDB.open("finpoint")
						request.onsuccess = () => resolve(request.result)
						request.onerror = () => reject(request.error)
					})
					try {
						return await new Promise<number | null>((resolve, reject) => {
							const request = db
								.transaction("learning")
								.objectStore("learning")
								.getAll()
							request.onsuccess = () =>
								resolve(
									JSON.parse(request.result[0]?.value ?? "{}").videoFrame ?? null,
								)
							request.onerror = () => reject(request.error)
						})
					} finally {
						db.close()
					}
				}),
			)
			.toBe(Math.round(paused * timeline.fps))
		await page.waitForTimeout(300)
		const state = await video.evaluate((el: HTMLVideoElement) => ({
			time: el.currentTime,
			src: el.getAttribute("src"),
			events: (el as HTMLVideoElement & { pauseEvents: { type: string; time: number }[] })
				.pauseEvents,
		}))
		expect(Math.abs(state.time - paused)).toBeLessThanOrEqual(1 / timeline.fps)
		expect(state.events.filter(event => event.type !== "timeupdate")).toEqual([])
		expect(state.events.every(event => Math.abs(event.time - paused) <= 1 / timeline.fps)).toBe(
			true,
		)
		expect(state.src).toBe("/guide/finpoint-guide.mp4")
		// Resume without a chapter parameter; a chapter deep link intentionally overrides resume.
		if (chapter) await page.goto("/help/video")
		else await page.reload()
		await expect
			.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
			.toBeCloseTo(Math.round(paused * timeline.fps) / timeline.fps, 2)
		await expect(video).toHaveJSProperty("paused", true)

		const selected = timeline.chapters[1]
		if (!selected) throw new Error("Missing chapter fixture")
		const link = page
			.getByRole("navigation", { name: "Video chapters" })
			.getByRole("link")
			.nth(1)
		await link.click()
		await expect
			.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
			.toBeCloseTo(selected.startFrame / timeline.fps, 2)
		await video.evaluate(async (el: HTMLVideoElement) => {
			el.currentTime += 2
			await el.play()
		})
		await expect
			.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
			.toBeGreaterThan(selected.startFrame / timeline.fps + 2)
		await link.click()
		await expect(video).toHaveJSProperty("paused", true)
		await expect
			.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
			.toBeCloseTo(selected.startFrame / timeline.fps, 2)
		await video.evaluate((el: HTMLVideoElement) => el.play())
		await page
			.getByRole("navigation", { name: "Video chapters" })
			.getByRole("link")
			.nth(3)
			.click()
		await expect(video).toHaveJSProperty("paused", true)
		await expect
			.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
			.toBeCloseTo((timeline.chapters[3]?.startFrame ?? 0) / timeline.fps, 2)
	})
}

test("guide rings: clipping and lifetime audits include hidden and detached targets", async ({
	page,
}) => {
	await page.route("**/__ring-stage", route =>
		route.fulfill({ contentType: "text/html", body: stageHtml("/__ring-app") }),
	)
	await page.route("**/__ring-app", route =>
		route.fulfill({
			contentType: "text/html",
			body: `
		<style>body { margin:0 } #clip { position:relative; margin:30px; width:200px; height:100px; border:10px solid; padding:10px; overflow:clip }
		#target { width:300px; height:80px } #footer { position:sticky; bottom:0; height:30px; background:white }</style>
		<div id="clip"><div id="target">Target</div><div id="footer">Footer</div></div>`,
		}),
	)
	await page.setViewportSize({ width: 1920, height: 1080 })
	await page.goto("/__ring-stage")
	const app = page.frame({ name: "app" })
	if (!app) throw new Error("Missing app frame")
	await app.locator("#target").waitFor()
	await page.evaluate(() => {
		const stage = (window as unknown as { guideStage: { startAudit: (name: string) => void } })
			.guideStage
		stage.startAudit("fixture")
	})
	await app.locator("#target").evaluate(el => {
		Object.assign(window, {
			__guideTargets: new Map([
				["control", { el, mode: "control" }],
				["region", { el, mode: "region" }],
			]),
		})
	})
	await expect(page.locator(".ring")).toHaveCount(2)
	await expect(page.locator(".ring").first()).toHaveCSS("box-sizing", "border-box")
	await expect
		.poll(() =>
			page
				.locator(".ring")
				.first()
				.evaluate(el => el.parentElement?.style.clipPath),
		)
		.toContain("path(")
	// The target overflows #clip, so its ring is pulled inside #clip's padding box, whole.
	const fit = await page.evaluate(() => {
		const frame = document.querySelector("iframe") as HTMLIFrameElement
		const outer = frame.getBoundingClientRect()
		const scale = outer.width / frame.offsetWidth
		const clip = frame.contentDocument?.querySelector("#clip") as HTMLElement
		const box = clip.getBoundingClientRect()
		const room = {
			left: outer.left + (box.left + clip.clientLeft) * scale,
			top: outer.top + (box.top + clip.clientTop) * scale,
			right: outer.left + (box.left + clip.clientLeft + clip.clientWidth) * scale,
			bottom: outer.top + (box.top + clip.clientTop + clip.clientHeight) * scale,
		}
		const ring = (document.querySelector(".ring") as HTMLElement).getBoundingClientRect()
		return [
			ring.left - room.left,
			ring.top - room.top,
			room.right - ring.right,
			room.bottom - ring.bottom,
		]
	})
	for (const gap of fit) expect(gap).toBeGreaterThanOrEqual(-0.5)
	await page.waitForTimeout(80)
	await app.locator("#target").evaluate(el => {
		;(el as HTMLElement).style.display = "none"
	})
	await page.waitForTimeout(80)
	await app.locator("#target").evaluate(el => el.remove())
	await page.waitForTimeout(80)
	const audits = await page.evaluate(() =>
		(
			window as unknown as {
				guideStage: {
					drainAudit: (reason: string) => import("../../video/scripts/stage").RingAudit[]
				}
			}
		).guideStage.drainAudit("finish"),
	)
	for (const audit of audits) {
		expect(audit.minVisibility).toBe(0)
		expect(audit.belowMs).toBeGreaterThan(100)
		expect(audit.hiddenIntervals).toHaveLength(1)
		expect(audit.detachedIntervals).toHaveLength(1)
		for (const interval of audit.detachedIntervals)
			expect(interval.to).toBeGreaterThan(interval.from)
		expect(audit.reason).toBe("finish")
	}
})

test("help menu: lists the section's guides and opens one in the side panel", async ({ page }) => {
	await page.goto("/allocator")
	await page.getByRole("button", { name: "Help" }).first().click()
	const menu = page.getByRole("menu")
	await expect(menu.getByRole("menuitem")).toHaveText([
		"Workflows",
		"One to one: your first Record",
		"One to many: splitting a payment",
		"Many to one: combining payments",
		"Pending Records",
		"Watch this in the video guide",
		"All help topics",
	])
	await menu.getByRole("menuitem", { name: "One to many: splitting a payment" }).click()
	const panel = page.getByRole("dialog")
	await expect(
		panel.getByRole("heading", { name: "One to many: splitting a payment" }),
	).toBeVisible()
	await expect(panel.getByRole("combobox", { name: "Related guides" })).toHaveText(
		"One to many: splitting a payment",
	)
})
