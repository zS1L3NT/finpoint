// Shared runner for test:web:core, test:web:extra and test:web:full: builds frozen
// bundles once, then runs each tier under PLAYWRIGHT_SERVER=production and, with
// --signoff, reports each tier as its own GitHub check run, named after the tier.
import { rmSync } from "node:fs"
import { releaseLock, takeLock } from "./lock"
import { runAsync, wasSignaled } from "./process"
import { dryRunSignoff, failOpen, finishTier, type Signoff, startSignoff } from "./signoff"
import { summarise } from "./summary"

const ALL_PROJECTS = ["desktop", "mobile", "tall-desktop", "light", "reduced-motion"]

type Tier = {
	folder: string
	/** Projects when none are given: core alone is desktop and mobile; in full, everything. */
	projects: (mode: Mode) => string[]
	/** Core runs in parallel; extra samples animation frames, so it always runs alone. */
	parallel: boolean
	env: NodeJS.ProcessEnv
}

// Every tier is one check run, `full` runs them all in this order, and
// `bun run test:web:ruleset` requires each of them for merging. Adding a tier here
// (plus a scripts/test/<tier>.ts entry point to run it alone) is all a new suite needs.
const TIERS = {
	core: {
		folder: "tests/web/core",
		projects: mode => (mode === "full" ? ALL_PROJECTS : ["desktop", "mobile"]),
		parallel: true,
		env: {},
	},
	extra: {
		folder: "tests/web/extra",
		projects: () => ALL_PROJECTS,
		parallel: false,
		env: { PLAYWRIGHT_EXTRA: "1" },
	},
} satisfies Record<string, Tier>

export type TierName = keyof typeof TIERS
export type Mode = TierName | "full"
export const TIER_NAMES = Object.keys(TIERS) as TierName[]

type Options = {
	workers: string
	workersOverridden: boolean
	signoff: boolean
	dryRun: boolean
	filters: string[]
	projects: string[]
}

function usage(mode: Mode): never {
	console.error(
		`usage: bun run test:web:${mode} [--workers=N] [--grep=PATTERN] [--grep-invert=PATTERN] [--project=NAME]... [--signoff | --signoff-dry-run]`,
	)
	process.exit(2)
}

function parse(mode: Mode, args: string[]): Options {
	const options: Options = {
		workers: "50%",
		workersOverridden: false,
		signoff: false,
		dryRun: false,
		filters: [],
		projects: [],
	}
	for (let index = 0; index < args.length; index++) {
		const arg = args[index] ?? ""
		if (arg === "--signoff") {
			options.signoff = true
		} else if (arg === "--signoff-dry-run") {
			options.dryRun = true
		} else if (arg === "--workers" || arg.startsWith("--workers=")) {
			const value =
				arg === "--workers"
					? (args[++index] ?? usage(mode))
					: arg.slice("--workers=".length)
			if (!value) usage(mode)
			options.workers = value
			options.workersOverridden = true
		} else if (arg === "--grep" || arg === "--grep-invert" || arg === "--project") {
			const value = args[++index] ?? usage(mode)
			if (arg === "--project") options.projects.push(value)
			else options.filters.push(arg, value)
		} else if (arg.startsWith("--grep=") || arg.startsWith("--grep-invert=")) {
			options.filters.push(arg)
		} else if (arg.startsWith("--project=")) {
			options.projects.push(arg.slice("--project=".length))
		} else {
			console.error(`refused pass-through argument: ${arg}`)
			usage(mode)
		}
	}
	if (options.signoff && options.dryRun) {
		console.error("use only one of --signoff and --signoff-dry-run")
		process.exit(2)
	}
	if (
		(options.signoff || options.dryRun) &&
		(options.filters.length > 0 || options.projects.length > 0 || options.workersOverridden)
	) {
		console.error("sign-off runs only complete runs: no pass-through arguments allowed")
		process.exit(2)
	}
	return options
}

async function build(): Promise<number> {
	const app = await runAsync("bun", ["run", "build"])
	if (wasSignaled() || app !== 0) return wasSignaled() ? 130 : app
	return runAsync("bunx", ["vite", "build", "--config", "tests/web/harness/vite.config.ts"])
}

async function runTier(name: TierName, mode: Mode, options: Options): Promise<number> {
	const tier: Tier = TIERS[name]
	const env: NodeJS.ProcessEnv = { ...process.env, PLAYWRIGHT_SERVER: "production" }
	delete env.PLAYWRIGHT_EXTERNAL_SERVERS
	delete env.PLAYWRIGHT_FULL_MATRIX
	delete env.PLAYWRIGHT_BROWSERS
	delete env.PLAYWRIGHT_EXTRA
	const json = `test-results/${name}-results.json`
	rmSync(json, { force: true })
	const projects = options.projects.length > 0 ? options.projects : tier.projects(mode)
	return runAsync(
		"bunx",
		[
			"playwright",
			"test",
			tier.folder,
			...projects.map(project => `--project=${project}`),
			`--workers=${tier.parallel ? options.workers : 1}`,
			`--output=test-results/${name}`,
			...options.filters,
		],
		{
			...env,
			...tier.env,
			PLAYWRIGHT_JSON_OUTPUT_FILE: json,
			PLAYWRIGHT_HTML_REPORT: `playwright-report/${name}`,
		},
	)
}

/** Runs the given tiers in order and returns the process exit code. A failed tier
 * does not stop later ones; each check completes as soon as its tier finishes, and
 * an interrupted run completes every open check as cancelled. */
export async function run(mode: Mode, tiers: TierName[]): Promise<number> {
	const options = parse(mode, process.argv.slice(2))
	if (options.dryRun) return dryRunSignoff(tiers)

	let signoff: Signoff | undefined
	if (options.signoff) {
		const started = await startSignoff(tiers)
		if (!started) return 1
		signoff = started
	}

	takeLock()
	try {
		const built = await build()
		if (wasSignaled()) return 130
		if (built !== 0) {
			if (signoff) await failOpen(signoff, "Build failed")
			return built
		}

		let failed = false
		for (const name of tiers) {
			await signoff?.tiers.get(name)?.begin()
			const code = await runTier(name, mode, options)
			if (wasSignaled()) return 130
			failed ||= code !== 0
			const summary = summarise(name, `test-results/${name}-results.json`)
			if (signoff) await finishTier(signoff, name, mode, summary, code === 0)
		}
		return failed ? 1 : 0
	} finally {
		await signoff?.checks.cancelOpen()
		releaseLock()
	}
}
