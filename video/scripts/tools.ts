// Shared helpers for the video scripts: FFmpeg from PATH, Chromium from Playwright or a system
// browser, and the app served from the latest production build when no URL is given.
import { type ChildProcess, spawn, spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")

/** The FFmpeg command: `FFMPEG`, else `ffmpeg` on PATH (HyperFrames needs it there too). */
export function ffmpeg(): string[] {
	if (process.env.FFMPEG) return [process.env.FFMPEG]
	if (spawnSync("ffmpeg", ["-version"]).status === 0) return ["ffmpeg"]
	throw new Error("FFmpeg not found. Install it on PATH, or set FFMPEG.")
}

export function runFfmpeg(args: string[]) {
	const [command = "ffmpeg", ...prefix] = ffmpeg()
	return spawnSync(command, [...prefix, ...args], { encoding: "utf8" })
}

const systemChromium = () =>
	["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"].find(path =>
		existsSync(path),
	)

/** A Chromium for Playwright: `CHROMIUM`, Playwright's own download, or a system install. */
export function chromiumPath(bundled: string): string | undefined {
	if (process.env.CHROMIUM) return process.env.CHROMIUM
	if (existsSync(bundled)) return undefined
	return systemChromium()
}

/**
 * Serves the production build on `port` unless `FINPOINT_URL` points elsewhere. Returns the base
 * URL and a function that stops the server again.
 */
export async function serveApp(port = 5174): Promise<{ base: string; stop: () => void }> {
	if (process.env.FINPOINT_URL) return { base: process.env.FINPOINT_URL, stop: () => {} }
	if (!existsSync(resolve(root, ".next/BUILD_ID")))
		throw new Error("No production build. Run `bun run build` first (or `bun run video:build`).")
	const base = `http://localhost:${port}`
	const server: ChildProcess = spawn(
		resolve(root, "node_modules/.bin/next"),
		["start", "--port", String(port)],
		{ cwd: root, stdio: "ignore" },
	)
	for (let attempt = 0; attempt < 120; attempt++) {
		const ok = await fetch(base)
			.then(response => response.ok)
			.catch(() => false)
		if (ok) return { base, stop: () => server.kill() }
		await new Promise(done => setTimeout(done, 500))
	}
	server.kill()
	throw new Error(`Finpoint did not start on ${base}.`)
}
