// The director: drives the real app inside the stage and films one continuous take per run of demo
// beats. The narration is the clock. A take starts where its first beat starts in the chapter, and
// the story waits for spoken words (`t.at("create", "Create")`) before acting, so the picture
// always lands on the word without any cutting, holding or speeding up afterwards.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import type { CDPSession, Frame, Locator, Page } from "@playwright/test"
import { APP, type RingAudit, STAGE } from "./stage"
import { root, runFfmpeg } from "./tools"

export const fps = 30
export const takesDir = resolve(root, "video/assets/takes")
export const takesFile = resolve(root, "video/takes.json")

type Segment = { id: string; text: string; from: number; durationInFrames: number; audio: string }
type Chapter = { id: string; startFrame: number; durationInFrames: number; segments: Segment[] }
const timeline: { chapters: Chapter[] } = JSON.parse(
	readFileSync(resolve(root, "src/lib/guide-video-timeline.json"), "utf8"),
)
const cues: Record<string, number[]> = JSON.parse(
	readFileSync(resolve(root, "src/lib/guide-video-cues.json"), "utf8"),
)

/** A recorded take: which beats it covers and where it starts in its chapter, in seconds. */
export type TakeInfo = { chapter: string; beats: string[]; start: number; duration: number }

/** Seconds of picture before the first word and after the last, so a take settles in and out. */
const LEAD = 0.6
const TAIL = 0.8

const words = (text: string) => text.split(/\s+/).filter(Boolean)
const bare = (word: string) => word.toLowerCase().replace(/[^\p{L}\p{N}$.%]/gu, "").replace(/\.$/, "")

export class Take {
	private frames: { t: number; file: string }[] = []
	private cdp: CDPSession | null = null
	private t0 = 0
	readonly ringAudits: RingAudit[] = []
	private dir: string
	readonly chapter: Chapter
	readonly start: number
	readonly end: number

	constructor(
		readonly page: Page,
		readonly name: string,
		chapter: string,
		readonly beats: string[],
		work: string,
		readonly recording: boolean,
	) {
		const found = timeline.chapters.find(item => item.id === chapter)
		if (!found) throw new Error(`No narration for chapter ${chapter}. Run narrate first.`)
		this.chapter = found
		const segments = beats.map(id => this.segment(id))
		const first = segments[0]
		const last = segments[segments.length - 1]
		if (!first || !last) throw new Error(`${name}: a take needs at least one beat`)
		this.start = Math.max(0, first.from / fps - LEAD)
		this.end = (last.from + last.durationInFrames) / fps + TAIL
		this.dir = resolve(work, name)
		mkdirSync(this.dir, { recursive: true })
	}

	get app(): Frame {
		const frame = this.page.frame({ name: "app" })
		if (!frame) throw new Error("The stage has no app frame.")
		return frame
	}

	private segment(id: string) {
		const segment = this.chapter.segments.find(item => item.id === id)
		if (!segment) throw new Error(`${this.name}: no beat ${this.chapter.id}/${id}`)
		return segment
	}

	/** Seconds since the take started. */
	now() {
		return Date.now() / 1000 - this.t0
	}

	/**
	 * Seconds into the take when `word` (the nth match, case and punctuation ignored) is spoken in
	 * `beat`. Without a word, the beat's first word.
	 */
	cue(beat: string, word?: string, nth = 0) {
		const segment = this.segment(beat)
		const times = cues[segment.audio] ?? []
		let index = 0
		if (word) {
			const target = words(word).map(bare)
			const spoken = words(segment.text).map(bare)
			const hits = spoken
				.map((_, i) => i)
				.filter(i => target.every((part, k) => spoken[i + k] === part))
			const hit = hits[nth]
			if (hit === undefined) throw new Error(`${this.name}: "${word}" is not said in ${beat}`)
			index = hit
		}
		return (segment.from + (times[index] ?? 0)) / fps - this.start
	}

	/**
	 * Waits for the narration to reach `word` in `beat`, less `early` seconds so the action that
	 * follows lands on the word. Warns when the picture runs late. Takes that are only played
	 * through to reach a later one don't wait at all.
	 */
	async at(beat: string, word?: string, { nth = 0, early = 0.4 } = {}) {
		if (!this.recording) return
		const target = this.cue(beat, word, nth) - early
		const wait = target - this.now()
		if (process.env.TAKE_LOG)
			console.log(`    ${this.now().toFixed(1)}s → "${word ?? beat}" at ${target.toFixed(1)}s`)
		if (wait > 0) await this.page.waitForTimeout(wait * 1000)
		else if (wait < -0.4 && this.recording)
			console.warn(`  ! ${this.name}: ${(-wait).toFixed(1)}s late for "${word ?? beat}"`)
	}

	async begin() {
		await this.page.evaluate(
			([name, live]) => {
				;(window as unknown as { guideStage: { startAudit: (name: string, live: boolean) => void } }).guideStage.startAudit(name, live)
			},
			[this.name, this.recording] as const,
		)
		this.t0 = Date.now() / 1000
		if (!this.recording) return
		this.cdp = await this.page.context().newCDPSession(this.page)
		this.cdp.on("Page.screencastFrame", async event => {
			const file = resolve(this.dir, `${String(this.frames.length).padStart(5, "0")}.jpg`)
			writeFileSync(file, Buffer.from(event.data, "base64"))
			this.frames.push({ t: event.metadata.timestamp ?? Date.now() / 1000, file })
			await this.cdp?.send("Page.screencastFrameAck", { sessionId: event.sessionId }).catch(() => {})
		})
		await this.cdp.send("Page.startScreencast", {
			format: "jpeg",
			quality: 92,
			maxWidth: STAGE.width,
			maxHeight: STAGE.height,
			everyNthFrame: 1,
		})
		await nudge(this.page)
		await this.page.waitForTimeout(150)
		this.t0 = this.frames[0]?.t ?? this.t0
	}

	/** Stops a take that failed part-way, so the next one starts clean. */
	async abort() {
		await this.auditRings("abort")
		await this.cdp?.send("Page.stopScreencast").catch(() => {})
		await this.cdp?.detach().catch(() => {})
		this.cdp = null
	}

	/** Holds until the last beat's narration has finished, then encodes the take. */
	async finish(): Promise<TakeInfo | null> {
		const duration = this.end - this.start
		const wait = this.recording ? duration - this.now() : 0
		if (this.recording && wait < -0.4)
			console.warn(`  ! ${this.name}: the story overran its narration by ${(-wait).toFixed(1)}s`)
		if (wait > 0) await this.page.waitForTimeout(wait * 1000)
		await this.auditRings("finish")
		if (!this.recording) return null
		await this.cdp?.send("Page.stopScreencast").catch(() => {})
		await this.cdp?.detach().catch(() => {})
		// Pin the take to exactly its narration span: hold the last frame to the end.
		const end = this.t0 + Math.max(duration, this.now())
		const list = this.frames
			.map((frame, index) => {
				const next = this.frames[index + 1]?.t ?? end
				return `file '${frame.file}'\nduration ${Math.max(0.001, next - frame.t).toFixed(4)}`
			})
			.join("\n")
		const listFile = resolve(this.dir, "frames.txt")
		writeFileSync(listFile, `${list}\nfile '${this.frames[this.frames.length - 1]?.file}'\n`)
		mkdirSync(takesDir, { recursive: true })
		const encode = runFfmpeg([
			"-hide_banner",
			"-loglevel",
			"error",
			"-y",
			"-f",
			"concat",
			"-safe",
			"0",
			"-i",
			listFile,
			"-t",
			duration.toFixed(3),
			"-r",
			String(fps),
			"-vf",
			`scale=${STAGE.width}:${STAGE.height}:flags=lanczos`,
			"-pix_fmt",
			"yuv420p",
			"-c:v",
			"libx264",
			"-preset",
			"slow",
			"-crf",
			"18",
			"-movflags",
			"+faststart",
			resolve(takesDir, `${this.name}.mp4`),
		])
		if (encode.status !== 0) throw new Error(`ffmpeg: ${encode.stderr}`)
		rmSync(this.dir, { recursive: true, force: true })
		console.log(`  ${this.name}: ${this.frames.length} frames, ${duration.toFixed(1)}s`)
		return { chapter: this.chapter.id, beats: this.beats, start: this.start, duration }
	}

	// ─── Camera and highlights ─────────────────────────────────────────────────────────────

	/** Eases the camera onto `target` (or back to the whole screen), zooming at most `zoom`×. */
	async focus(target: Locator | null, { zoom = 1.9, ms = 900, reveal = true } = {}) {
		let box: { x: number; y: number; w: number; h: number } | null = null
		if (target) {
			if (reveal) await revealTarget(target)
			box = await target.first().evaluate(el => {
				const r = el.getBoundingClientRect()
				return { x: r.left, y: r.top, w: r.width, h: r.height }
			})
		}
		// The camera eases on its own while the hand carries on, as an editor's camera would.
		await this.page.evaluate(
			([box, zoom, ms]) => {
				void (window as unknown as { guideStage: { frameBox: (...a: unknown[]) => Promise<void> } }).guideStage.frameBox(
					box,
					zoom,
					ms,
				)
			},
			[box, zoom, ms] as const,
		)
	}

	wide(ms = 900) {
		return this.focus(null, { ms })
	}

	/** Explicitly reveal before a narration cue, then re-measure and settle the camera. */
	async reveal(target: Locator, { zoom = 1.9, ms = 900 } = {}) {
		await this.focus(target, { zoom, ms })
		await this.page.waitForTimeout(ms)
	}

	/** Ringing never scrolls or reframes the camera; reveal controls before their cue. */
	async ring(key: string, target: Locator, { mode = "control" }: { mode?: "control" | "region" } = {}) {
		await target.first().waitFor({ state: "attached" })
		await target.first().evaluate((el, { key, mode }) => {
			const win = window as unknown as { __guideTargets?: Map<string, { el: Element; mode: string }> }
			win.__guideTargets ??= new Map()
			win.__guideTargets.set(key, { el, mode })
			;(window.parent as unknown as { guideStage: { sync: () => void } }).guideStage.sync()
		}, { key, mode })
	}

	async unring(key?: string) {
		await this.app.evaluate(key => {
			const map = (window as unknown as { __guideTargets?: Map<string, unknown> }).__guideTargets
			// Sample before removal as well, including changes since the last animation frame.
			const stage = (window.parent as unknown as { guideStage: { sync: () => void } }).guideStage
			stage.sync()
			if (key) map?.delete(key)
			else map?.clear()
			stage.sync()
		}, key)
	}

	private async auditRings(reason: string) {
		const reports = await this.page.evaluate(reason =>
			(window as unknown as { guideStage: { drainAudit: (reason: string) => RingAudit[] } }).guideStage.drainAudit(reason), reason)
		this.ringAudits.push(...reports)
		for (const report of reports) {
			console.log(`  ring ${this.name}/${report.key} #${report.occurrence} (${report.mode}): min ${(report.minVisibility * 100).toFixed(2)}%, below ${(report.belowMs / 1000).toFixed(3)}s, detached ${JSON.stringify(report.detachedIntervals)}, hidden ${JSON.stringify(report.hiddenIntervals)}, worst ${(report.worstMs / 1000).toFixed(3)}s: ${report.cause} [${report.reason}]`)
		}
	}

}

// ─── Hands ─────────────────────────────────────────────────────────────────────────────────

let mouse: [number, number] = [STAGE.width * 0.9, STAGE.height * 0.85]

async function nudge(page: Page) {
	await page.mouse.move(mouse[0] + 1, mouse[1])
	await page.mouse.move(...mouse)
}

/**
 * How long the hand takes, as a fraction of a relaxed pace. Takes whose narration moves fast set
 * it lower (`TakeScript.tempo`), so the picture keeps up without cutting.
 */
let tempo = 1
export const setTempo = (value: number) => {
	tempo = value
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/** Scroll nested containers from inside out, preserving an already visible control. */
async function revealTarget(target: Locator) {
	await target.first().waitFor({ state: "visible" })
	await target.first().evaluate(async el => {
		// Already fully in view of every scroll area and the app's window: leave the page alone.
		const inside = (r: DOMRect, box: { left: number; top: number; right: number; bottom: number }) =>
			r.left >= box.left - 1 && r.top >= box.top - 1 && r.right <= box.right + 1 && r.bottom <= box.bottom + 1
		const own = el.getBoundingClientRect()
		let shown = inside(own, { left: 0, top: 0, right: innerWidth, bottom: innerHeight })
		for (let p = el.parentElement; shown && p; p = p.parentElement) {
			const css = getComputedStyle(p)
			if (!/(auto|scroll|hidden|clip)/.test(css.overflowX + css.overflowY)) continue
			const box = p.getBoundingClientRect()
			const left = box.left + p.clientLeft
			const top = box.top + p.clientTop
			shown = inside(own, { left, top, right: left + p.clientWidth, bottom: top + p.clientHeight })
		}
		if (shown) return
		const containers: Element[] = []
		for (let p = el.parentElement; p; p = p.parentElement) {
			const css = getComputedStyle(p)
			if (/(auto|scroll|hidden)/.test(css.overflowX + css.overflowY)) containers.push(p)
		}
		if (document.scrollingElement && !containers.includes(document.scrollingElement)) containers.push(document.scrollingElement)
		for (const container of containers) {
			const root = container === document.scrollingElement
			const box = container.getBoundingClientRect()
			const r = el.getBoundingClientRect()
			let left = root ? 0 : box.left + container.clientLeft
			let top = root ? 0 : box.top + container.clientTop
			let right = root ? innerWidth : left + container.clientWidth
			let bottom = root ? innerHeight : top + container.clientHeight
			// Reserve the occupied edge of sticky/fixed overlays in this scroll container.
			for (const overlay of container.querySelectorAll("*")) {
				if (overlay.contains(el) || el.contains(overlay)) continue
				if (!/^(sticky|fixed)$/.test(getComputedStyle(overlay).position)) continue
				const o = overlay.getBoundingClientRect()
				if (!o.width || !o.height || o.right <= left || o.left >= right || o.bottom <= top || o.top >= bottom) continue
				// A layer as big as the view (a toast region, a backdrop) isn't a bar along one edge.
				if (o.width >= (right - left) / 2 && o.height >= (bottom - top) / 2) continue
				if (o.width >= (right - left) / 2) {
					if (o.top <= top) top = Math.max(top, o.bottom)
					else if (o.bottom >= bottom) bottom = Math.min(bottom, o.top)
				} else if (o.height >= (bottom - top) / 2) {
					if (o.left <= left) left = Math.max(left, o.right)
					else if (o.right >= right) right = Math.min(right, o.left)
				}
			}
			const dx = r.left < left ? r.left - left - 12 : r.right > right ? r.right - right + 12 : 0
			const dy = r.top < top ? r.top - top - 12 : r.bottom > bottom ? r.bottom - bottom + 12 : 0
			if (!dx && !dy) continue
			const x = container.scrollLeft, y = container.scrollTop, start = performance.now()
			await new Promise<void>(done => {
				const step = (now: number) => {
					const t = Math.min(1, (now - start) / Math.min(1400, 500 + Math.hypot(dx, dy) * 0.8))
					const k = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2
					container.scrollTo({ left: x + dx * k, top: y + dy * k, behavior: "instant" })
					if (t < 1) requestAnimationFrame(step)
					else done()
				}
				requestAnimationFrame(step)
			})
		}
	})
}

/** Where on the stage `target` sits right now, at the fraction `dx`, `dy` of its box. */
async function spot(target: Locator, dx: number, dy: number): Promise<[number, number]> {
	const box = await target.first().boundingBox()
	if (!box) throw new Error("glide: target not visible")
	return [box.x + box.width * dx, box.y + box.height * dy]
}

/**
 * Glides the pointer to `target` on an ease, like a person would, hovering along the way. The
 * target is re-measured every step, so the hand follows it while the camera is still moving.
 */
export async function glide(page: Page, target: Locator, { ms = 480 * tempo, dx = 0.5, dy = 0.5 } = {}) {
	await target.first().waitFor({ state: "visible" })
	const from = mouse
	const steps = Math.max(8, Math.round(ms / 16))
	const started = Date.now()
	for (let i = 1; i <= steps; i++) {
		const k = ease(i / steps)
		const to = await spot(target, dx, dy)
		mouse = [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k]
		await page.mouse.move(...mouse)
		const due = started + (ms * i) / steps - Date.now()
		if (due > 0) await page.waitForTimeout(due)
	}
}

export async function press(page: Page, target: Locator, options?: { ms?: number; dx?: number; dy?: number }) {
	const visible = await target.first().evaluate(el =>
		(window.parent as unknown as { guideStage: { measure: (el: Element) => { fraction: number } } }).guideStage.measure(el).fraction >= 0.999)
	if (!visible) {
		// Scroll it into view; only if the camera still crops it, ease back to the whole screen.
		await revealTarget(target)
		await target.first().evaluate(async el => {
			const stage = (window.parent as unknown as {
				guideStage: { measure: (el: Element) => { fraction: number }; frameBox: (box: null, zoom: number, ms: number) => Promise<void> }
			}).guideStage
			if (stage.measure(el).fraction < 0.999) await stage.frameBox(null, 1, 700)
		})
	}
	await glide(page, target, options)
	await page.waitForTimeout(80 * tempo)
	// The camera may still be easing: land on where the target is now, not where it was.
	mouse = await spot(target, options?.dx ?? 0.5, options?.dy ?? 0.5)
	await page.mouse.move(...mouse)
	// A ring on what's pressed has done its job: the click may close or replace it.
	await target
		.first()
		.evaluate(el => (window.parent as unknown as { guideStage: { release: (el: Element) => void } }).guideStage.release(el))
		.catch(() => {})
	await page.mouse.down()
	await page.waitForTimeout(70)
	await page.mouse.up()
	await page.waitForTimeout(220 * tempo)
}

export async function type(page: Page, text: string, delay = 45 * tempo) {
	await page.keyboard.type(text, { delay })
	await page.waitForTimeout(150 * tempo)
}

/** Clears a field and types a new value into it, the way a person would. */
export async function retype(page: Page, field: Locator, value: string) {
	await press(page, field)
	await page.keyboard.press("ControlOrMeta+a")
	await type(page, value)
}

/** Opens a combobox, types to filter, then picks the option. */
export async function pick(page: Page, frame: Frame, field: Locator, query: string, option: RegExp | string) {
	await press(page, field)
	await type(page, query)
	await press(page, frame.getByRole("option", { name: option }).first())
}

/** Scrolls the app gently until `target`'s middle sits at `middle` of its screen. */
export async function scrollTo(frame: Frame, target: Locator, { middle = 0.55 } = {}) {
	const box = await target.first().evaluate(el => {
		const r = el.getBoundingClientRect()
		return { y: r.top, h: r.height }
	})
	const distance = box.y + box.h / 2 - APP.height * middle
	if (Math.abs(distance) < 40) return
	await frame.evaluate(
		([dy, ms]) =>
			(window as unknown as { guideScroll: (...a: number[]) => Promise<void> }).guideScroll(dy, ms),
		[distance, Math.min(1400, 500 + Math.abs(distance) * 0.8)] as const,
	)
	await frame.page().waitForTimeout(250)
}
