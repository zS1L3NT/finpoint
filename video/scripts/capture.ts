// Real Finpoint, filmed. Drives a fresh dark-mode workspace through the guide's story with
// Playwright and records each flow as one continuous take: a smooth on-screen cursor, real typing
// and the app's own animations. Every take logs markers (a moment plus the boxes of the controls
// on screen then) that the video's camera and highlights are keyed to, and a poster frame per
// marker for holds and Help article pictures.
//
// Run from the repository root against a production build:
//   bun run build && npx next start --port 5174   (in another terminal)
//   bun video/scripts/capture.ts                  (CHROMIUM=/path/to/chrome to pick a browser)
import { spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { type CDPSession, chromium, type Locator, type Page } from "playwright"
import * as XLSX from "xlsx"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const base = process.env.FINPOINT_URL ?? "http://localhost:5174"
const outDir = resolve(root, "public/guide-takes")
/** 16:9 like the video frame, so the camera never has to crop the app to fit. */
const viewport = { width: 1600, height: 900 }
/** Recorded at 1.5× so gentle camera zooms stay sharp. */
const scale = 1.5
const fps = 30
/** The guide's fictional month. The browser's calendar is shifted here; time keeps running. */
const now = new Date("2026-10-20T10:30:00+08:00")

type Box = [number, number, number, number]
type Marker = { t: number; boxes: Record<string, Box> }
const takes: Record<string, { width: number; height: number; duration: number; markers: Record<string, Marker> }> = {}

// ─── Fictional bank exports ───────────────────────────────────────────────────────────────

type Row = [string, string, number]
const ocbcRows: Row[] = [
	["01/10/2026", "SALARY ACME PTE LTD", 3000],
	["03/10/2026", "KOPI & CO RAFFLES PL", -12],
	["05/10/2026", "NTUC FAIRPRICE BEDOK", -80],
	["06/10/2026", "SISTIC CONCERT TIX", -200],
	["08/10/2026", "COLD STORAGE CENTRAL", -23.4],
	["10/10/2026", "SAKURA DINING", -90],
	["11/10/2026", "PAYNOW FROM SAM TAN", 60],
	["12/10/2026", "GRAB RIDE", -14.5],
	["14/10/2026", "NETFLIX.COM", -19.98],
	["15/10/2026", "SHOPEE SINGAPORE", -45.9],
	["17/10/2026", "SP SERVICES", -120.4],
	["18/10/2026", "TRANSFER TO UOB SAVINGS", -500],
]
const repayment: Row = ["13/10/2026", "PAYNOW FROM JO LIM", 100]
const burger: Row = ["19/10/2026", "BURGER JOINT TANJONG PAGAR", -35]

function ocbcCsv(rows: Row[]) {
	return [
		"Account details for:,OCBC 360 Account 601-234567-001",
		"Transaction History",
		"Transaction date,Value date,Description,Withdrawals(SGD),Deposits(SGD)",
		...rows.map(([date, description, amount]) =>
			[
				date,
				date,
				description,
				amount < 0 ? (-amount).toFixed(2) : "",
				amount > 0 ? amount.toFixed(2) : "",
			].join(","),
		),
	].join("\n")
}

function uobXls(path: string) {
	const sheet = XLSX.utils.aoa_to_sheet([
		["United Overseas Bank Limited"],
		["Account Transaction Details"],
		[""],
		[""],
		["Account Number:", "3021234567"],
		["Account Type:", "Uniplus Savings"],
		["Statement Period:", "01 Oct 2026 To 20 Oct 2026"],
		["Transaction Date", "Transaction Description", "Withdrawal", "Deposit"],
		["18 Oct 2026", "TRANSFER FROM OCBC 360", 0, 500],
	])
	const book = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(book, sheet, "Statement")
	XLSX.writeFile(book, path, { bookType: "xls" })
}

// ─── The on-screen cursor ─────────────────────────────────────────────────────────────────

/** Headless browsers draw no pointer, so the page draws one that follows real mouse events. */
function installCursor() {
	const draw = () => {
		if (document.getElementById("guide-cursor")) return
		const cursor = document.createElement("div")
		cursor.id = "guide-cursor"
		cursor.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24"><path d="M5 3 L5 19.5 L9.5 15.5 L12.4 21.6 L15.3 20.3 L12.5 14.3 L18.6 14.3 Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`
		Object.assign(cursor.style, {
			position: "fixed",
			left: "0",
			top: "0",
			zIndex: "2147483647",
			pointerEvents: "none",
			filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.45))",
			transformOrigin: "5px 3px",
			transition: "scale 90ms ease-out",
		})
		const saved = JSON.parse(sessionStorage.getItem("guide-cursor") ?? "[1500,840]")
		cursor.style.translate = `${saved[0] - 5}px ${saved[1] - 3}px`
		document.documentElement.appendChild(cursor)
		addEventListener(
			"mousemove",
			event => {
				cursor.style.translate = `${event.clientX - 5}px ${event.clientY - 3}px`
				sessionStorage.setItem("guide-cursor", JSON.stringify([event.clientX, event.clientY]))
			},
			true,
		)
		addEventListener(
			"mousedown",
			event => {
				cursor.style.scale = "0.85"
				const ring = document.createElement("div")
				Object.assign(ring.style, {
					position: "fixed",
					left: `${event.clientX - 22}px`,
					top: `${event.clientY - 22}px`,
					width: "44px",
					height: "44px",
					borderRadius: "999px",
					border: "3px solid rgba(165,148,255,0.95)",
					zIndex: "2147483646",
					pointerEvents: "none",
					transition: "transform 380ms ease-out, opacity 380ms ease-out",
					transform: "scale(0.3)",
				})
				document.documentElement.appendChild(ring)
				requestAnimationFrame(() => {
					ring.style.transform = "scale(1)"
					ring.style.opacity = "0"
				})
				setTimeout(() => ring.remove(), 420)
			},
			true,
		)
		addEventListener("mouseup", () => (cursor.style.scale = "1"), true)
		const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
		// Smooth moves run in the page at display rate; the driver only sets the final position.
		Object.assign(window, {
			guideGlide: (x: number, y: number, ms: number) =>
				new Promise<void>(done => {
					const [fromX, fromY] = JSON.parse(sessionStorage.getItem("guide-cursor") ?? "[1500,840]")
					const start = performance.now()
					const step = (time: number) => {
						const t = Math.min(1, (time - start) / ms)
						const k = ease(t)
						const px = fromX + (x - fromX) * k
						const py = fromY + (y - fromY) * k
						cursor.style.translate = `${px - 5}px ${py - 3}px`
						sessionStorage.setItem("guide-cursor", JSON.stringify([px, py]))
						if (t < 1) requestAnimationFrame(step)
						else done()
					}
					requestAnimationFrame(step)
				}),
			guideScroll: (dy: number, ms: number) =>
				new Promise<void>(done => {
					const from = window.scrollY
					const start = performance.now()
					const step = (time: number) => {
						const t = Math.min(1, (time - start) / ms)
						window.scrollTo(0, from + dy * ease(t))
						if (t < 1) requestAnimationFrame(step)
						else done()
					}
					requestAnimationFrame(step)
				}),
		})
	}
	if (document.readyState === "loading") addEventListener("DOMContentLoaded", draw)
	else draw()
}

// ─── Recording ────────────────────────────────────────────────────────────────────────────

class Take {
	private frames: { t: number; file: string }[] = []
	private markers: Record<string, Marker> = {}
	private t0 = 0
	private dir: string
	private cdp: CDPSession | null = null

	constructor(
		private page: Page,
		readonly name: string,
		work: string,
	) {
		this.dir = resolve(work, name)
		mkdirSync(this.dir, { recursive: true })
	}

	async start() {
		const context = this.page.context()
		this.cdp = await context.newCDPSession(this.page)
		this.cdp.on("Page.screencastFrame", async event => {
			const file = resolve(this.dir, `${String(this.frames.length).padStart(5, "0")}.jpg`)
			writeFileSync(file, Buffer.from(event.data, "base64"))
			this.frames.push({ t: event.metadata.timestamp ?? Date.now() / 1000, file })
			await this.cdp?.send("Page.screencastFrameAck", { sessionId: event.sessionId }).catch(() => {})
		})
		await this.cdp.send("Page.startScreencast", {
			format: "jpeg",
			quality: 90,
			maxWidth: viewport.width * scale,
			maxHeight: viewport.height * scale,
			everyNthFrame: 1,
		})
		// Nudge a repaint so the take has a first frame even on a still page.
		await this.page.mouse.move(...(await cursorAt(this.page)))
		await this.page.waitForTimeout(250)
		this.t0 = this.frames[0]?.t ?? Date.now() / 1000
	}

	/** Remembers this moment and where the named controls are on screen right now. */
	async mark(name: string, targets: Record<string, Locator> = {}) {
		await this.page.waitForTimeout(450)
		const boxes: Record<string, Box> = {}
		for (const [key, locator] of Object.entries(targets)) {
			const box = await locator
				.first()
				.boundingBox({ timeout: 300 })
				.catch(() => null)
			if (box) boxes[key] = [box.x, box.y, box.width, box.height].map(Math.round) as Box
			else console.warn(`  ! ${this.name}/${name}: no box for ${key}`)
		}
		this.markers[name] = { t: Date.now() / 1000 - this.t0, boxes }
		console.log(`  ${this.name}/${name} @ ${this.markers[name].t.toFixed(2)}s`)
		await this.page.waitForTimeout(250)
	}

	async stop() {
		await this.page.waitForTimeout(600)
		await this.cdp?.send("Page.stopScreencast").catch(() => {})
		await this.cdp?.detach().catch(() => {})
		const end = Date.now() / 1000
		const list = this.frames
			.map((frame, index) => {
				const next = this.frames[index + 1]?.t ?? end
				return `file '${frame.file}'\nduration ${Math.max(0.001, next - frame.t).toFixed(4)}`
			})
			.join("\n")
		const last = this.frames[this.frames.length - 1]
		const listFile = resolve(this.dir, "frames.txt")
		writeFileSync(listFile, `${list}\nfile '${last?.file}'\n`)
		const video = resolve(outDir, `${this.name}.mp4`)
		const encode = spawnSync(
			"ffmpeg",
			[
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
				"-vf",
				`fps=${fps},format=yuv420p`,
				"-c:v",
				"libx264",
				"-preset",
				"slow",
				"-crf",
				"21",
				"-tune",
				"stillimage",
				"-movflags",
				"+faststart",
				video,
			],
			{ encoding: "utf8" },
		)
		if (encode.status !== 0) throw new Error(`ffmpeg: ${encode.stderr}`)
		// Posters come from the encoded video itself, so a hold matches the playing frame exactly.
		mkdirSync(resolve(outDir, this.name), { recursive: true })
		for (const [name, marker] of Object.entries(this.markers)) {
			spawnSync("ffmpeg", [
				"-hide_banner",
				"-loglevel",
				"error",
				"-y",
				"-i",
				video,
				"-ss",
				(Math.round(marker.t * fps) / fps).toFixed(3),
				"-frames:v",
				"1",
				"-q:v",
				"3",
				resolve(outDir, this.name, `${name}.jpg`),
			])
		}
		takes[this.name] = {
			width: viewport.width,
			height: viewport.height,
			duration: end - this.t0,
			markers: this.markers,
		}
		console.log(`  ${this.name}: ${this.frames.length} frames, ${(end - this.t0).toFixed(1)}s`)
	}
}

async function cursorAt(page: Page): Promise<[number, number]> {
	return page
		.evaluate(() => JSON.parse(sessionStorage.getItem("guide-cursor") ?? "[1500,840]"))
		.catch(() => [1500, 840])
}

/** Glides the cursor to `target` on an ease, like a person would, then hovers it for real. */
async function glide(page: Page, target: Locator, { ms = 650, dx = 0.5, dy = 0.5 } = {}) {
	await target.first().waitFor({ state: "visible" })
	const box = await target.first().boundingBox()
	if (!box) throw new Error("glide: target not visible")
	const x = box.x + box.width * dx
	const y = box.y + box.height * dy
	await page.evaluate(
		([x, y, ms]) =>
			(window as unknown as { guideGlide: (...a: number[]) => Promise<void> }).guideGlide(x, y, ms),
		[x, y, ms] as const,
	)
	await page.mouse.move(x, y)
}

async function press(page: Page, target: Locator, options?: { ms?: number; dx?: number; dy?: number }) {
	await target.first().scrollIntoViewIfNeeded()
	await glide(page, target, options)
	await page.waitForTimeout(120)
	await page.mouse.down()
	await page.waitForTimeout(90)
	await page.mouse.up()
	await page.waitForTimeout(350)
}

async function type(page: Page, text: string) {
	await page.keyboard.type(text, { delay: 85 })
	await page.waitForTimeout(250)
}

/** Scrolls the page gently until `target` sits comfortably in view. */
async function scrollTo(page: Page, target: Locator) {
	const box = await target.first().boundingBox()
	if (!box) return
	const distance = box.y + box.height / 2 - viewport.height * 0.55
	if (Math.abs(distance) < 40) return
	await page.evaluate(
		([dy, ms]) =>
			(window as unknown as { guideScroll: (...a: number[]) => Promise<void> }).guideScroll(dy, ms),
		[distance, Math.min(1400, 500 + Math.abs(distance) * 0.8)] as const,
	)
	await page.waitForTimeout(300)
}

const row = (page: Page, text: string) =>
	page.locator("tr, [data-slot=mobile-row]").filter({ hasText: text }).first()
const dialog = (page: Page) => page.getByRole("dialog").last()
const selectionBar = (page: Page) =>
	page
		.getByRole("button", { name: "Create Record" })
		.locator("xpath=ancestor::*[contains(@class,'fixed') or contains(@class,'sticky')][1]")

async function go(page: Page, path: string) {
	await page.goto(`${base}${path}`, { waitUntil: "load" })
	await page.waitForTimeout(1500)
}

/** Navigates by clicking the sidebar, so a take moves between pages the way a user would. */
async function via(page: Page, label: string) {
	await press(page, page.locator("[data-sidebar=menu-button]").filter({ hasText: label }).first())
	await page.waitForTimeout(1200)
}

async function importOcbc(page: Page, file: string) {
	await go(page, "/importer")
	await page.getByRole("radio", { name: /OCBC/ }).click()
	await page.locator('input[type="file"]').setInputFiles(file)
	await page.getByRole("button", { name: /^Import/ }).click()
	await page.getByText(/new statements? imported|already here/).first().waitFor()
}

async function pick(page: Page, field: Locator, query: string, option: RegExp | string) {
	await press(page, field)
	await type(page, query)
	await press(page, page.getByRole("option", { name: option }).first())
}

async function setAmount(page: Page, field: Locator, value: string) {
	await press(page, field)
	await page.keyboard.press("ControlOrMeta+a")
	await type(page, value)
}

const creator = (page: Page) => {
	const form = dialog(page)
	return {
		dialog: form,
		title: form.locator("#title"),
		amount: form.locator("#amount"),
		category: form.locator("#category_id"),
		analytics: form.getByText("Analytics", { exact: true }).locator("xpath=.."),
		attached: form.getByText("Statements Attached").locator("xpath=.."),
		allocation: form.locator('input[inputmode="decimal"]').nth(1),
		submit: form.getByRole("button", { name: /Create Record|Save changes/ }),
		pending: form.getByText("Amount does not match").locator("xpath=ancestor::*[@role='alert'][1]"),
	}
}

async function closed(page: Page) {
	await page.getByRole("dialog").waitFor({ state: "detached" }).catch(() => {})
	await page.waitForTimeout(500)
}

// ─── The story ────────────────────────────────────────────────────────────────────────────

const work = mkdtempSync(resolve(tmpdir(), "finpoint-capture-"))
rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
const files = {
	first: resolve(work, "ocbc-october.csv"),
	second: resolve(work, "ocbc-october-2.csv"),
	third: resolve(work, "ocbc-october-3.csv"),
	uob: resolve(work, "uob-october.xls"),
}
writeFileSync(files.first, ocbcCsv(ocbcRows))
writeFileSync(files.second, ocbcCsv([...ocbcRows, repayment]))
writeFileSync(files.third, ocbcCsv([...ocbcRows, repayment, burger]))
uobXls(files.uob)

const browser = await chromium.launch({
	...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
	// Screencasts follow this flag, not the context's scale.
	args: [`--force-device-scale-factor=${scale}`],
})
const context = await browser.newContext({
	viewport,
	deviceScaleFactor: scale,
	timezoneId: "Asia/Singapore",
	locale: "en-SG",
	colorScheme: "dark",
	acceptDownloads: false,
})
// Keep third-party analytics out of the takes (and out of a sandbox's network).
await context.route(/vercel|vitals|googleapis|google\.com/, route => route.abort())
await context.addInitScript(target => {
	const RealDate = Date
	const offset = target - RealDate.now()
	class GuideDate extends RealDate {
		constructor(...args: ConstructorParameters<DateConstructor> | []) {
			if (args.length === 0) super(RealDate.now() + offset)
			else super(...(args as ConstructorParameters<DateConstructor>))
		}
		static override now() {
			return RealDate.now() + offset
		}
	}
	globalThis.Date = GuideDate as DateConstructor
}, now.getTime())
await context.addInitScript(installCursor)
const page = await context.newPage()
page.setDefaultTimeout(15000)

async function take(name: string, run: (take: Take) => Promise<void>) {
	const recording = new Take(page, name, work)
	try {
		await recording.start()
		await run(recording)
		await recording.stop()
	} catch (error) {
		console.warn(`  ! ${name} failed: ${(error as Error).message.split("\n")[0]}`)
		await page.keyboard.press("Escape").catch(() => {})
	}
}

try {
	// 3 · Importing
	await go(page, "/importer")
	await take("import", async t => {
		const ocbc = page.getByRole("radio", { name: /OCBC/ })
		await t.mark("start", {
			banks: page.getByRole("radiogroup", { name: "Bank" }),
			ocbc,
			uob: page.getByRole("radio", { name: /UOB/ }),
			card: page.getByText("Upload statements").locator("xpath=ancestor::*[@data-slot='card'][1]"),
		})
		await press(page, ocbc)
		await t.mark("bank", { banks: page.getByRole("radiogroup", { name: "Bank" }), ocbc })
		const chooser = page.waitForEvent("filechooser")
		await press(page, page.getByText(/Drop bank exports here/).first())
		await (await chooser).setFiles(files.first)
		await page.waitForTimeout(500)
		await t.mark("files", {
			files: page.getByText("ocbc-october.csv").first().locator("xpath=.."),
			submit: page.getByRole("button", { name: /^Import/ }),
			card: page.getByText("Upload statements").locator("xpath=ancestor::*[@data-slot='card'][1]"),
		})
		await press(page, page.getByRole("button", { name: /^Import/ }))
		await page.getByText(/new statements? imported/).first().waitFor()
		await t.mark("result", {
			result: page.getByText(/new statements? imported/).first().locator("xpath=ancestor::*[contains(@class,'rounded')][1]"),
			allocate: page.getByRole("link", { name: /Allocate them/ }).or(page.getByRole("button", { name: /Allocate them/ })),
		})
		await press(page, page.getByRole("link", { name: /Allocate them/ }).or(page.getByRole("button", { name: /Allocate them/ })))
		await page.waitForTimeout(1200)
		await t.mark("allocator", { list: page.locator("table").first() })
	})
	await go(page, "/importer")
	await take("revolut", async t => {
		await t.mark("start", { banks: page.getByRole("radiogroup", { name: "Bank" }) })
		await press(page, page.getByRole("radio", { name: /Revolut/ }))
		await page.waitForTimeout(500)
		await t.mark("account", {
			revolut: page.getByRole("radio", { name: /Revolut/ }),
			account: page.getByText("Account", { exact: true }).first().locator("xpath=ancestor::*[contains(@class,'space-y') or @data-slot='field'][1]"),
			banks: page.getByRole("radiogroup", { name: "Bank" }),
		})
	})
	// The UOB savings account, off camera.
	await go(page, "/importer")
	await page.getByRole("radio", { name: /UOB/ }).click()
	await page.locator('input[type="file"]').setInputFiles(files.uob)
	await page.getByRole("button", { name: /^Import/ }).click()
	await page.getByText(/new statements? imported/).first().waitFor()

	// 4 · The Allocator
	await go(page, "/allocator")
	await take("allocator", async t => {
		await t.mark("start", { list: page.locator("table").first(), heading: page.getByRole("heading", { name: "Allocator" }) })
		await glide(page, page.locator("table").first(), { dy: 0.3 })
		await scrollTo(page, row(page, "KOPI & CO"))
		await t.mark("scrolled", { list: page.locator("table").first(), amount: row(page, "NTUC FAIRPRICE").locator("td").last() })
	})

	// 5 · First purchase
	await go(page, "/allocator")
	await take("lunch", async t => {
		await t.mark("start", { list: page.locator("table").first() })
		await scrollTo(page, row(page, "KOPI & CO"))
		await t.mark("row", { lunch: row(page, "KOPI & CO") })
		await press(page, row(page, "KOPI & CO"), { dx: 0.3 })
		await t.mark("selected", { lunch: row(page, "KOPI & CO"), bar: selectionBar(page), create: page.getByRole("button", { name: "Create Record" }) })
		await press(page, page.getByRole("button", { name: "Create Record" }))
		await dialog(page).getByText("Statements Attached").waitFor()
		await t.mark("creator", creator(page))
		await press(page, creator(page).title)
		await type(page, "Lunch")
		await pick(page, creator(page).category, "Dining", "Dining Out")
		await t.mark("filled", creator(page))
		await glide(page, creator(page).analytics)
		await t.mark("analytics", creator(page))
		await press(page, creator(page).submit)
		await closed(page)
		await t.mark("saved", { list: page.locator("table").first() })
	})

	// 6 · Splitting one payment
	await take("split", async t => {
		await t.mark("start", { list: page.locator("table").first() })
		await scrollTo(page, row(page, "NTUC FAIRPRICE"))
		await press(page, row(page, "NTUC FAIRPRICE"), { dx: 0.3 })
		await press(page, page.getByRole("button", { name: "Create Record" }))
		await dialog(page).getByText("Statements Attached").waitFor()
		await t.mark("creator", creator(page))
		await press(page, creator(page).title)
		await type(page, "Groceries")
		await setAmount(page, creator(page).amount, "-50")
		await setAmount(page, creator(page).allocation, "-50")
		await pick(page, creator(page).category, "Groc", "Groceries")
		await t.mark("filled", creator(page))
		await press(page, creator(page).submit)
		await closed(page)
		await scrollTo(page, row(page, "NTUC FAIRPRICE"))
		await glide(page, row(page, "NTUC FAIRPRICE").getByText(/allocable/), { ms: 600 })
		await t.mark("left", { supermarket: row(page, "NTUC FAIRPRICE"), allocable: row(page, "NTUC FAIRPRICE").getByText(/allocable/) })
		await press(page, row(page, "NTUC FAIRPRICE"), { dx: 0.3 })
		await press(page, page.getByRole("button", { name: "Create Record" }))
		await dialog(page).getByText("Statements Attached").waitFor()
		await press(page, creator(page).title)
		await type(page, "Birthday gift")
		await pick(page, creator(page).category, "Gift", "Gifts & Donations")
		await t.mark("gift", creator(page))
		await press(page, creator(page).submit)
		await closed(page)
		await t.mark("saved", { list: page.locator("table").first() })
	})

	// 7 · Combining payments
	await take("combine", async t => {
		await t.mark("start", { list: page.locator("table").first() })
		await scrollTo(page, row(page, "SAKURA DINING"))
		await t.mark("rows", { dinner: row(page, "SAKURA DINING"), paynow: row(page, "PAYNOW FROM SAM") })
		await press(page, row(page, "SAKURA DINING"), { dx: 0.3 })
		await t.mark("dinner", { dinner: row(page, "SAKURA DINING"), paynow: row(page, "PAYNOW FROM SAM") })
		await press(page, row(page, "PAYNOW FROM SAM"), { dx: 0.3 })
		await t.mark("selected", { dinner: row(page, "SAKURA DINING"), paynow: row(page, "PAYNOW FROM SAM"), bar: selectionBar(page) })
		await press(page, page.getByRole("button", { name: "Create Record" }))
		await dialog(page).getByText("Statements Attached").waitFor()
		await press(page, creator(page).title)
		await type(page, "Dinner with Sam")
		await pick(page, creator(page).category, "Dining", "Dining Out")
		await t.mark("filled", creator(page))
		await press(page, creator(page).submit)
		await closed(page)
		await t.mark("saved", { list: page.locator("table").first() })
	})

	// The salary, off camera, so the Dashboard has income.
	await page.evaluate(() => window.scrollTo(0, 0))
	await row(page, "SALARY ACME").click()
	await page.getByRole("button", { name: "Create Record" }).click()
	await dialog(page).locator("#title").fill("Salary")
	await dialog(page).locator("#category_id").click()
	await dialog(page).locator("#category_id").fill("Income")
	await page.getByRole("option", { name: "Income" }).first().click()
	await dialog(page).getByRole("button", { name: "Create Record" }).click()
	await closed(page)

	// 8 · The Dashboard
	await go(page, "/?month=October&year=2026")
	await take("dashboard", async t => {
		await t.mark("start", {
			metrics: page.getByText("Total spending").first().locator("xpath=ancestor::*[contains(@class,'grid')][1]"),
			spending: page.getByText("Total spending").first().locator("xpath=ancestor::*[@data-slot='card'][1]"),
		})
		await glide(page, page.getByText("Total spending").first())
		await t.mark("spending", {
			metrics: page.getByText("Total spending").first().locator("xpath=ancestor::*[contains(@class,'grid')][1]"),
			spending: page.getByText("Total spending").first().locator("xpath=ancestor::*[@data-slot='card'][1]"),
		})
		await scrollTo(page, page.locator("#spending-breakdown-title"))
		await t.mark("breakdown", {
			breakdown: page.locator("#spending-breakdown-title").locator("xpath=ancestor::section[1]"),
			mix: page.getByText("Category spending mix").first().locator("xpath=ancestor::*[@data-slot='card'][1]"),
		})
	})

	// 9 · Pending Records
	await go(page, "/allocator")
	await take("pending", async t => {
		await t.mark("start", { list: page.locator("table").first() })
		await scrollTo(page, row(page, "SISTIC CONCERT"))
		await press(page, row(page, "SISTIC CONCERT"), { dx: 0.3 })
		await press(page, page.getByRole("button", { name: "Create Record" }))
		await dialog(page).getByText("Statements Attached").waitFor()
		await t.mark("creator", creator(page))
		await press(page, creator(page).title)
		await type(page, "Concert with Jo")
		await setAmount(page, creator(page).amount, "-100")
		await pick(page, creator(page).category, "Enter", "Entertainment")
		await t.mark("flag", creator(page))
		await press(page, creator(page).submit)
		await closed(page)
		await via(page, "Records")
		await t.mark("records", {
			list: page.locator("table").first(),
			concert: row(page, "Concert with Jo"),
			badge: row(page, "Concert with Jo").getByText("Pending").first(),
		})
	})
	await importOcbc(page, files.second)
	await go(page, "/allocator")
	await take("attach", async t => {
		await t.mark("start", { list: page.locator("table").first() })
		await scrollTo(page, row(page, "PAYNOW FROM JO"))
		await press(page, row(page, "PAYNOW FROM JO"), { dx: 0.3 })
		await t.mark("selected", {
			paynow: row(page, "PAYNOW FROM JO"),
			bar: selectionBar(page),
			attach: page.getByRole("button", { name: "Attach to Record" }),
		})
		await press(page, page.getByRole("button", { name: "Attach to Record" }))
		await page.getByText("Concert with Jo").first().waitFor()
		await page.waitForTimeout(500)
		const sheet = page.getByRole("dialog").last()
		await t.mark("sheet", { sheet, concert: sheet.getByText("Concert with Jo").first().locator("xpath=ancestor::*[self::button or self::a or @role='option'][1]") })
		await press(page, sheet.getByText("Concert with Jo").first())
		await page.getByText("Edit Record").first().waitFor()
		await page.waitForTimeout(700)
		await t.mark("editor", {
			...creator(page),
			attached: dialog(page).getByText("PAYNOW FROM JO").first().locator("xpath=ancestor::*[@data-slot='card'][1]"),
		})
		await press(page, creator(page).submit)
		await closed(page)
		await t.mark("saved", { list: page.locator("table").first() })
	})

	// 10 · Pending Statements
	await go(page, "/statements")
	await take("placeholder", async t => {
		await t.mark("start", { create: page.getByRole("button", { name: "Create Pending Statement" }) })
		await press(page, page.getByRole("button", { name: "Create Pending Statement" }))
		await page.waitForTimeout(500)
		const form = dialog(page)
		await press(page, form.locator("#account_id"))
		await press(page, page.getByRole("option", { name: /360 Account/ }))
		await setAmount(page, form.locator("#amount"), "-35")
		await press(page, form.locator("#description"))
		await type(page, "Burger with Mia")
		await t.mark("filled", {
			dialog: form,
			account: form.locator("#account_id"),
			amount: form.locator("#amount"),
			description: form.locator("#description"),
			fields: form.locator("form"),
			submit: form.getByRole("button", { name: "Create statement" }),
		})
		await press(page, form.getByRole("button", { name: "Create statement" }))
		await closed(page)
		await via(page, "Allocator")
		await t.mark("allocator", {
			row: row(page, "Burger with Mia"),
			badge: row(page, "Burger with Mia").getByText("Pending").first(),
		})
		await press(page, row(page, "Burger with Mia"), { dx: 0.3 })
		await press(page, page.getByRole("button", { name: "Create Record" }))
		await dialog(page).getByText("Statements Attached").waitFor()
		await press(page, creator(page).title)
		await type(page, "Burger with Mia")
		await pick(page, creator(page).category, "Dining", "Dining Out")
		await press(page, creator(page).submit)
		await closed(page)
		await t.mark("explained", { list: page.locator("table").first() })
	})
	await importOcbc(page, files.third)
	await go(page, "/allocator")
	await take("replace", async t => {
		await t.mark("start", { tabs: page.getByRole("tablist").first() })
		await press(page, page.getByRole("tab", { name: "Replace Pending" }).or(page.getByRole("link", { name: "Replace Pending" })))
		await page.waitForTimeout(900)
		await press(page, page.getByText("Burger with Mia").first())
		await page.getByRole("button", { name: "Replace", exact: true }).first().waitFor()
		await page.waitForTimeout(600)
		await t.mark("candidates", {
			pending: page.getByText("Burger with Mia").first().locator("xpath=ancestor::*[@data-slot='card' or self::button][1]"),
			candidate: page.getByText("BURGER JOINT").first().locator("xpath=ancestor::*[@data-slot='card' or contains(@class,'rounded')][1]"),
			replace: page.getByRole("button", { name: "Replace", exact: true }).first(),
		})
		await press(page, page.getByRole("button", { name: "Replace", exact: true }).first())
		await page.getByText("Review Statement replacement").waitFor()
		await page.waitForTimeout(600)
		await t.mark("review", {
			dialog: dialog(page),
			submit: dialog(page).getByRole("button", { name: "Replace pending Statement" }),
		})
		await press(page, dialog(page).getByRole("button", { name: "Replace pending Statement" }))
		await closed(page)
		await t.mark("done")
	})

	// 11 · Categories
	await go(page, "/categories")
	await take("categories", async t => {
		await t.mark("start", { grid: page.getByText("Groceries").first().locator("xpath=ancestor::section[1]") })
		await glide(page, page.getByText("Dining Out").first(), { ms: 900 })
		await t.mark("hover", { grid: page.getByText("Groceries").first().locator("xpath=ancestor::section[1]") })
		await press(page, page.getByRole("button", { name: "Edit Groceries" }))
		await page.waitForTimeout(700)
		await glide(page, dialog(page).getByText("Analytics defaults").locator("xpath=.."))
		await t.mark("defaults", {
			dialog: dialog(page),
			defaults: dialog(page).getByText("Analytics defaults").locator("xpath=.."),
		})
	})

	// 13 · Buckets and targets
	await page.keyboard.press("Escape")
	await go(page, "/?month=October&year=2026")
	await take("buckets", async t => {
		const card = page.getByText("Persistent groups").first().locator("xpath=ancestor::*[@data-slot='card'][1]")
		await scrollTo(page, card)
		await t.mark("start", { card })
		await press(page, card.getByRole("button", { name: "Edit" }).first())
		await page.waitForTimeout(700)
		const form = dialog(page)
		await press(page, form.locator("#bucket-no-target"))
		await setAmount(page, form.locator("#bucket-target"), "500")
		await t.mark("target", { dialog: form, target: form.locator("#bucket-target") })
		await press(page, form.locator("#bucket-target-scope"))
		await press(page, page.getByRole("option", { name: /onward/ }))
		await t.mark("scope", { dialog: form, applies: form.locator("#bucket-target-scope") })
		await press(page, form.getByRole("button", { name: "Save changes" }))
		await closed(page)
		await t.mark("saved", { card, daily: card.getByText("Daily", { exact: true }).first().locator("xpath=ancestor::*[contains(@class,'rounded')][1]") })
	})

	// 14 · Budgets
	await go(page, "/budgets")
	await take("budgets", async t => {
		await t.mark("start")
		await press(page, page.getByRole("button", { name: "New Budget" }))
		await page.waitForTimeout(600)
		const form = dialog(page)
		await press(page, form.locator("#name"))
		await type(page, "Bali trip")
		await setAmount(page, form.locator("#amount"), "1200")
		await glide(page, form.locator("#budget_create_date_range"))
		await t.mark("dates", { dialog: form, range: form.locator("#budget_create_date_range") })
		const automatic = form.getByText("Automatic attach").first().locator("xpath=ancestor::*[@data-slot='field'][1]")
		await glide(page, automatic)
		await t.mark("automatic", { dialog: form, automatic })
	})

	// 15 · Backups
	await page.keyboard.press("Escape")
	await go(page, "/sync")
	await take("data", async t => {
		const file = page.getByRole("button", { name: /Download backup/ }).locator("xpath=ancestor::*[@data-slot='card'][1]")
		await t.mark("start", { file })
		await glide(page, page.getByRole("button", { name: /Download backup/ }))
		await t.mark("download", { file, download: page.getByRole("button", { name: /Download backup/ }) })
	})

	writeFileSync(resolve(root, "src/lib/guide-video-takes.json"), `${JSON.stringify(takes, null, "\t")}\n`)
} finally {
	await browser.close()
	rmSync(work, { recursive: true, force: true })
}
console.log(`Recorded ${Object.keys(takes).length} takes into public/guide-takes.`)
