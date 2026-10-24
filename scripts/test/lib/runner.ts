// Shared runner for test:web:core, test:web:extra and test:web:full: builds frozen
// bundles once, then runs each tier under PLAYWRIGHT_SERVER=production and, with
// --signoff, signs each tier as soon as it finishes.
import { rmSync } from "node:fs"
import { releaseLock, takeLock } from "./lock"
import { runAsync, wasSignaled } from "./process"
import { dryRunPreflight, preflightSignoff, signTier } from "./signoff"
import { type PhaseSummary, summarise } from "./summary"

export type TierName = "core" | "extra"
export type Mode = TierName | "full"

const ALL_PROJECTS = ["desktop", "mobile", "tall-desktop", "light", "reduced-motion"]

type Tier = {
	folder: string
	/** Projects when none are given: core alone is desktop and mobile; in full, everything. */
	projects: (mode: Mode) => string[]
	/** Core runs in parallel; extra samples animation frames, so it always runs alone. */
	parallel: boolean
	env: NodeJS.ProcessEnv
}

const TIERS: Record<TierName, Tier> = {
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
}

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
	const tier = TIERS[name]
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
 * does not stop later ones; each is signed as soon as it finishes. */
export async function run(mode: Mode, tiers: TierName[]): Promise<number> {
	const options = parse(mode, process.argv.slice(2))
	if (options.dryRun) return dryRunPreflight(tiers)

	let head = ""
	if (options.signoff) {
		const recorded = preflightSignoff()
		if (!recorded) return 1
		head = recorded
	}

	takeLock()
	try {
		const built = await build()
		if (built !== 0) return built

		const phases: PhaseSummary[] = []
		let failed = false
		for (const [index, name] of tiers.entries()) {
			const code = await runTier(name, mode, options)
			if (wasSignaled()) return 130
			failed ||= code !== 0
			phases.push(summarise(name, `test-results/${name}-results.json`))
			if (options.signoff) {
				const signed = await signTier(
					head,
					mode,
					phases,
					tiers.slice(index + 1),
					name,
					code === 0,
				)
				if (wasSignaled()) return 130
				if (signed !== 0) return signed
			}
		}
		return failed ? 1 : 0
	} finally {
		releaseLock()
	}
}
