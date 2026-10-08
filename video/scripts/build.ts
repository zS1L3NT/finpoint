// Rebuilds the whole guide film from source, so it can follow the app after any UI, colour or copy
// change: builds Finpoint, films the takes, speaks the narration, then renders the MP4.
//   bun run video:build                 everything
//   bun run video:build --skip=render   any of: app, capture, narrate, render
import { spawnSync } from "node:child_process"
import { resolve } from "node:path"
import { remotionBrowser, root } from "./tools"

const skip = new Set(
	process.argv
		.filter(arg => arg.startsWith("--skip="))
		.flatMap(arg => arg.slice("--skip=".length).split(",")),
)

const steps: [string, string, string[], string][] = [
	["app", "bun", ["run", "build"], root],
	["capture", "bun", [resolve(root, "video/scripts/capture.ts")], root],
	["narrate", "bun", [resolve(root, "video/scripts/narrate.ts")], root],
	[
		"render",
		resolve(root, "video/node_modules/.bin/remotion"),
		[
			"render",
			"FinpointGuide",
			"out/finpoint-beginner-guide.mp4",
			"--codec=h264",
			"--crf=20",
			...remotionBrowser(),
		],
		resolve(root, "video"),
	],
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
