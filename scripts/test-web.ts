#!/usr/bin/env bun
// Two-tier browser runner: builds frozen bundles once, then runs the gate
// phase and (for `full`) the motion phase under PLAYWRIGHT_SERVER=production.
// Ad-hoc runs stay on `bun run test:web` / `bun run test:web:motion`.
import { spawn, spawnSync, type ChildProcess } from "node:child_process"
import { releaseLock, takeLock } from "./suite-lock"

type Mode = "gate" | "full"

const PROJECTS = ["desktop", "mobile", "tall-desktop", "light", "reduced-motion"]

function usage(): never {
	console.error(
		"usage: bun scripts/test-web.ts gate|full [--workers=N] [--grep=PATTERN] [--grep-invert=PATTERN] [--project=NAME]... [--signoff | --signoff-dry-run]",
	)
	process.exit(2)
}

function runSync(command: string, args: string[]): string {
	const result = spawnSync(command, args, { encoding: "utf8" })
	if (result.status !== 0)
		throw new Error(
			`failed: ${command} ${args.join(" ")}${result.stderr ? `\n${result.stderr}` : ""}`,
		)
	return result.stdout
}

let current: ChildProcess | undefined
let signaled = false
function killCurrent(signal: NodeJS.Signals): void {
	const child = current
	if (!child?.pid) return
	try {
		// Children are spawned detached, so each leads its own process group;
		// signalling the group reaches Playwright and the webServer bundles too.
		process.kill(-child.pid, signal)
	} catch {
		try {
			child.kill(signal)
		} catch {
			// already exited
		}
	}
}
for (const signal of ["SIGINT", "SIGTERM"] as const) {
	process.on(signal, () => {
		signaled = true
		killCurrent(signal)
	})
}

function groupAlive(pgid: number): boolean {
	try {
		process.kill(-pgid, 0)
		return true
	} catch (error) {
		return (error as NodeJS.ErrnoException)?.code === "EPERM"
	}
}

// Waits for every process in the group to exit: up to 10 s after a polite
// SIGTERM, then SIGKILL and up to 5 s more.
async function awaitGroupExit(pgid: number): Promise<void> {
	const waitUntil = async (ms: number) => {
		for (const deadline = Date.now() + ms; Date.now() < deadline; ) {
			if (!groupAlive(pgid)) return true
			await new Promise(resolve => setTimeout(resolve, 100))
		}
		return !groupAlive(pgid)
	}
	if (await waitUntil(1_000)) return
	for (const [signal, ms] of [
		["SIGTERM", 10_000],
		["SIGKILL", 5_000],
	] as const) {
		try {
			process.kill(-pgid, signal)
		} catch {
			return
		}
		if (await waitUntil(ms)) return
	}
	console.error(`process group ${pgid} did not exit; the suite lock is released anyway`)
}

function runAsync(command: string, args: string[], env: NodeJS.ProcessEnv): Promise<number> {
	return new Promise(resolve => {
		const child = spawn(command, args, { stdio: "inherit", env, detached: true })
		current = child
		// The direct child can exit while its process group (Playwright, the
		// webServer bundles) is still shutting down, so resolve only once the
		// whole group is gone; the lock is released after that.
		child.on("exit", async (code, signal) => {
			current = undefined
			if (child.pid) await awaitGroupExit(child.pid)
			resolve(signal ? 130 : (code ?? 1))
		})
		child.on("error", error => {
			current = undefined
			console.error(`failed to start ${command}: ${String(error)}`)
			resolve(1)
		})
	})
}

// Next rewrites next-env.d.ts when switching between `next dev` and `next build`
// (the production build restores the committed form), so it never counts as dirty.
function gitStatus(): string {
	return runSync("git", ["status", "--porcelain"])
		.split("\n")
		.filter(line => line.trim() !== "" && line.slice(3) !== "next-env.d.ts")
		.join("\n")
}

// Real sign-off preflight: non-fatal, returns the recorded HEAD or null.
function preflightSignoff(): string | null {
	let extensions: string
	try {
		extensions = runSync("gh", ["extension", "list"])
	} catch {
		console.error("sign-off needs the gh CLI with the gh-signoff extension installed")
		return null
	}
	if (!extensions.includes("basecamp/gh-signoff")) {
		console.error("sign-off needs the gh-signoff extension (basecamp/gh-signoff)")
		return null
	}
	let status: string
	try {
		status = gitStatus()
	} catch {
		console.error("sign-off needs a git tree it can inspect")
		return null
	}
	if (status.trim() !== "") {
		console.error("sign-off refuses a dirty tree: commit or stash first")
		return null
	}
	try {
		return runSync("git", ["rev-parse", "HEAD"]).trim()
	} catch {
		console.error("sign-off needs a git HEAD it can record")
		return null
	}
}

// Dry-run preflight: never refuses, so it works without gh-signoff installed.
// Prints each check result plus the commands a real run would execute.
function dryRunPreflight(mode: Mode): number {
	let extensions = ""
	try {
		extensions = runSync("gh", ["extension", "list"])
	} catch {
		// gh absent: reported below, not fatal
	}
	const hasExtension = extensions.includes("basecamp/gh-signoff")
	let status = ""
	let statusOk = false
	try {
		status = gitStatus()
		statusOk = true
	} catch {
		// reported below
	}
	let head = ""
	try {
		head = runSync("git", ["rev-parse", "HEAD"]).trim()
	} catch {
		// reported below
	}
	console.log(
		`[dry-run] gh-signoff extension (basecamp/gh-signoff): ${hasExtension ? "present" : "MISSING — sign-off would refuse to start without it"}`,
	)
	console.log(
		statusOk
			? `[dry-run] git tree: ${status.trim() === "" ? "clean" : "DIRTY — sign-off would refuse; commit or stash first"}`
			: "[dry-run] git tree: could not inspect it",
	)
	console.log(`[dry-run] HEAD: ${head || "unknown"}`)
	console.log("[dry-run] on pass: gh signoff --commit <HEAD> gate")
	if (mode === "full") console.log("[dry-run] on pass: gh signoff --commit <HEAD> full")
	console.log("[dry-run] on failure: gh signoff fail --commit <HEAD> <context> (red status)")
	return 0
}

function cleanTreeUnchanged(head: string): boolean {
	let status: string
	let current: string
	try {
		status = gitStatus()
		current = runSync("git", ["rev-parse", "HEAD"]).trim()
	} catch {
		console.error("could not verify a clean tree: not signing")
		return false
	}
	if (status.trim() !== "") {
		console.error("tree changed during the run: not signing")
		return false
	}
	if (current !== head) {
		console.error("HEAD changed during the run: not signing")
		return false
	}
	return true
}

// Posts one commit status per context on the commit recorded before the run.
// A pass becomes a green sign-off only when the tree is still clean at that
// commit; a failure is posted red (`gh signoff fail`) so a required check never
// sits pending after a failed run.
async function report(head: string, results: [string, boolean][]): Promise<number> {
	const clean = results.some(([, passed]) => passed) ? cleanTreeUnchanged(head) : true
	for (const [context, passed] of results) {
		if (signaled) return 130
		const args = passed
			? ["signoff", "--commit", head, context]
			: ["signoff", "fail", "--commit", head, "--description", `${context} tests failed`, context]
		if (passed && !clean) continue
		const code = await runAsync("gh", args, process.env)
		if (code !== 0) return code
	}
	return clean ? 0 : 1
}

async function main(): Promise<number> {
	const [mode, ...rest] = process.argv.slice(2)
	if (mode !== "gate" && mode !== "full") usage()
	const typed = mode as Mode

	let workers = "50%"
	let workersOverridden = false
	let signoff = false
	let dryRun = false
	const filterArgs: string[] = []
	const userProjects: string[] = []
	for (let index = 0; index < rest.length; index++) {
		const arg = rest[index] ?? ""
		if (arg === "--signoff") {
			signoff = true
		} else if (arg === "--signoff-dry-run") {
			dryRun = true
		} else if (arg === "--workers" || arg.startsWith("--workers=")) {
			const value =
				arg === "--workers" ? (rest[++index] ?? usage()) : arg.slice("--workers=".length)
			if (!value) usage()
			workers = value
			workersOverridden = true
		} else if (arg === "--grep" || arg === "--grep-invert" || arg === "--project") {
			const value = rest[++index] ?? usage()
			if (arg === "--project") userProjects.push(value)
			else filterArgs.push(arg, value)
		} else if (arg.startsWith("--grep=") || arg.startsWith("--grep-invert=")) {
			filterArgs.push(arg)
		} else if (arg.startsWith("--project=")) {
			userProjects.push(arg.slice("--project=".length))
		} else {
			console.error(`refused pass-through argument: ${arg}`)
			usage()
		}
	}
	if (signoff && dryRun) {
		console.error("use only one of --signoff and --signoff-dry-run")
		process.exit(2)
	}
	if ((signoff || dryRun) && (filterArgs.length > 0 || userProjects.length > 0 || workersOverridden)) {
		console.error("sign-off runs only complete runs: no pass-through arguments allowed")
		process.exit(2)
	}

	if (dryRun) return dryRunPreflight(typed)

	let head = ""
	if (signoff) {
		const recorded = preflightSignoff()
		if (!recorded) return 1
		head = recorded
	}

	takeLock()
	try {
		const build = await runAsync("bun", ["run", "build"], process.env)
		if (signaled) return 130
		if (build !== 0) return build
		const harness = await runAsync("bun", ["run", "test:web:harness:build"], process.env)
		if (signaled) return 130
		if (harness !== 0) return harness

		const baseEnv: NodeJS.ProcessEnv = { ...process.env }
		baseEnv.PLAYWRIGHT_SERVER = "production"
		delete baseEnv.PLAYWRIGHT_EXTERNAL_SERVERS
		delete baseEnv.PLAYWRIGHT_FULL_MATRIX
		delete baseEnv.PLAYWRIGHT_BROWSERS
		delete baseEnv.PLAYWRIGHT_MOTION
		// Each phase declares its own environment explicitly: gate stays
		// motion-free, phase two opts into motion.
		const gateEnv: NodeJS.ProcessEnv = { ...baseEnv }
		const motionEnv: NodeJS.ProcessEnv = { ...baseEnv, PLAYWRIGHT_MOTION: "1" }

		const gateProjects =
			userProjects.length > 0 ? userProjects : typed === "full" ? PROJECTS : ["desktop", "mobile"]
		const output = typed === "gate" ? "test-results/gate" : "test-results/full-gate"
		const gate: string[] = ["playwright", "test", "tests/web/gate"]
		for (const project of gateProjects) gate.push(`--project=${project}`)
		gate.push(`--workers=${workers}`, `--output=${output}`, ...filterArgs)
		const gateCode = await runAsync("bunx", gate, {
			...gateEnv,
			PLAYWRIGHT_HTML_REPORT:
				typed === "gate" ? "playwright-report/gate" : "playwright-report/full-gate",
		})
		if (signaled) return 130

		if (typed === "gate") {
			if (signoff) {
				const posted = await report(head, [["gate", gateCode === 0]])
				if (posted !== 0) return posted
			}
			return gateCode
		}

		const motion: string[] = [
			"playwright",
			"test",
			"tests/web/motion",
			"--workers=1",
			"--output=test-results/full-motion",
		]
		const motionProjects = userProjects.length > 0 ? userProjects : PROJECTS
		for (const project of motionProjects) motion.push(`--project=${project}`)
		motion.push(...filterArgs)
		const motionCode = await runAsync("bunx", motion, {
			...motionEnv,
			PLAYWRIGHT_HTML_REPORT: "playwright-report/full-motion",
		})
		if (signaled) return 130
		if (signoff) {
			// Full's gate phase covers every gate project, so it also decides signoff/gate.
			const posted = await report(head, [
				["gate", gateCode === 0],
				["full", gateCode === 0 && motionCode === 0],
			])
			if (posted !== 0) return posted
		}
		return gateCode !== 0 || motionCode !== 0 ? 1 : 0
	} finally {
		releaseLock()
	}
}

process.exit(await main())
