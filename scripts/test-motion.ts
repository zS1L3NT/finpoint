#!/usr/bin/env bun
// Ad-hoc motion runner: collects tests/web/motion only and always runs it
// serially. Any appended --workers flag is dropped and --workers=1 is forced
// last, so callers can never parallelise motion by accident. Playwright ORs
// positional paths, so a requested path replaces the motion folder instead of
// joining it, and any path outside tests/web/motion is refused.
import { spawnSync } from "node:child_process"

const MOTION = "tests/web/motion"
// Flags whose value is the next argument, so that value is not read as a path.
const VALUE_FLAGS = new Set([
	"--grep",
	"-g",
	"--grep-invert",
	"--project",
	"--reporter",
	"--repeat-each",
	"--timeout",
	"--max-failures",
])

const flags: string[] = []
const paths: string[] = []
const rest = process.argv.slice(2)
for (let index = 0; index < rest.length; index++) {
	const arg = rest[index] ?? ""
	if (arg === "--workers") {
		index++
		continue
	}
	if (arg.startsWith("--workers=")) continue
	if (VALUE_FLAGS.has(arg)) {
		flags.push(arg, rest[++index] ?? "")
		continue
	}
	if (arg.startsWith("-")) {
		flags.push(arg)
		continue
	}
	const path = arg.replace(/^\.\//, "")
	if (path !== MOTION && !path.startsWith(`${MOTION}/`)) {
		console.error(`refused: ${arg} is outside ${MOTION}; use bun run test:web for gate tests`)
		process.exit(2)
	}
	paths.push(path)
}

const result = spawnSync(
	"bunx",
	["playwright", "test", ...(paths.length > 0 ? paths : [MOTION]), ...flags, "--workers=1"],
	{ stdio: "inherit", env: { ...process.env, PLAYWRIGHT_MOTION: "1" } },
)
process.exit(result.status ?? 1)
