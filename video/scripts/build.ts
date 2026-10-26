// Rebuilds the whole guide film from source, so it follows the app after any UI, colour or copy
// change: builds Finpoint, speaks the narration, films the takes against it, composes the
// HyperFrames film, renders it and publishes it to `public/guide`.
//   bun run video:build                       everything
//   bun run video:build --skip=app,narrate    skip any of: app, narrate, record, compose, render, publish
import { spawnSync } from "node:child_process"
import { resolve } from "node:path"
import { root } from "./tools"

const skip = new Set(
	process.argv.filter(arg => arg.startsWith("--skip=")).flatMap(arg => arg.slice("--skip=".length).split(",")),
)
const video = resolve(root, "video")

const steps: [string, string, string[], string][] = [
	["app", "bun", ["run", "build"], root],
	["narrate", "bun", [resolve(video, "scripts/narrate.ts")], root],
	["record", "bun", [resolve(video, "scripts/record.ts")], root],
	["compose", "bun", [resolve(video, "scripts/compose.ts")], root],
	["render", "npx", ["--yes", "hyperframes@0.8.203", "render", "--quality", "delivery", "--output", "renders/finpoint-guide.mp4"], video],
	["publish", "bun", [resolve(video, "scripts/publish.ts")], root],
]

for (const [name, command, args, cwd] of steps) {
	if (skip.has(name)) continue
	console.log(`\n▸ ${name}`)
	const result = spawnSync(command, args, { cwd, stdio: "inherit" })
	if (result.status !== 0) {
		console.error(`✗ ${name} failed`)
		process.exit(result.status ?? 1)
	}
}
console.log("\nGuide film rebuilt.")
