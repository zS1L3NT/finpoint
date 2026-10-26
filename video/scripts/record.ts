// Films the guide's real-app takes. Each take is one continuous recording of the stage (the app in
// an iframe, with the camera and highlights around it), paced by the narration so it lines up with
// the voice without any editing. Run after `narrate` (the clock) and `bun run build`:
//   bun video/scripts/record.ts                  every take
//   bun video/scripts/record.ts lunch split      only these takes (the story still plays through)
//   bun video/scripts/record.ts --headed lunch   watch it happen, to author a take
// Serves the build on port 5174 (FINPOINT_URL to use a running app); CHROMIUM picks a browser.
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { resolve } from "node:path"
import { chromium } from "@playwright/test"
import { Take, type TakeInfo, takesFile } from "./director"
import { installCursor, STAGE, stageHtml, stagePath } from "./stage"
import { story } from "./story"
import { chromiumPath, serveApp } from "./tools"

/** The guide's fictional month. The browser's calendar is shifted here; time keeps running. */
const now = new Date("2026-10-20T10:30:00+08:00")

const args = process.argv.slice(2)
const headed = args.includes("--headed")
const only = args.filter(arg => !arg.startsWith("--"))
const unknown = only.filter(name => !story.some(take => take.name === name))
if (unknown.length) throw new Error(`No take named ${unknown.join(", ")}`)

const takes: Record<string, TakeInfo> = existsSync(takesFile) && only.length ? JSON.parse(readFileSync(takesFile, "utf8")) : {}
const work = mkdtempSync(resolve(tmpdir(), "finpoint-record-"))
const server = await serveApp()
const browser = await chromium.launch({ executablePath: chromiumPath(chromium.executablePath()), headless: !headed })
const context = await browser.newContext({
	viewport: STAGE,
	deviceScaleFactor: 1,
	timezoneId: "Asia/Singapore",
	locale: "en-SG",
	colorScheme: "dark",
	acceptDownloads: false,
})
// Keep third-party analytics out of the takes (and out of a sandbox's network).
await context.route(/vercel|vitals|googleapis|google\.com/, route => route.abort())
await context.route(`${server.base}${stagePath}*`, route =>
	route.fulfill({ contentType: "text/html", body: stageHtml(new URL(route.request().url()).searchParams.get("app") ?? "/") }),
)
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
await page.goto(`${server.base}${stagePath}?app=${encodeURIComponent("/")}`)
await page.waitForTimeout(2500)

try {
	for (const script of story) {
		const recording = !only.length || only.includes(script.name)
		const take = new Take(page, script.name, script.chapter, script.beats, work, recording)
		console.log(`${recording ? "●" : "○"} ${script.name}`)
		try {
			await script.setup?.(take)
			await take.wide(1)
			await take.unring()
			await take.begin()
			await script.play(take)
			const info = await take.finish()
			if (info) takes[script.name] = info
		} catch (error) {
			console.warn(`  ! ${script.name} failed: ${(error as Error).message.split("\n")[0]}`)
			await page.keyboard.press("Escape").catch(() => {})
		}
	}
	writeFileSync(takesFile, `${JSON.stringify(takes, null, "\t")}\n`)
} finally {
	await browser.close()
	server.stop()
	rmSync(work, { recursive: true, force: true })
}
console.log(`Recorded ${Object.keys(takes).length} takes into video/assets/takes.`)
