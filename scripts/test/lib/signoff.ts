// Sign-off for the test runners: preflight checks, then one GitHub check run per
// tier, named after the tier, posted by the local-ci GitHub App (see checks.ts).
import { type Check, type Checks, configProblems, connect } from "./checks"
import { runSync } from "./process"
import { outcome, type PhaseSummary } from "./summary"

// Next rewrites next-env.d.ts when switching between `next dev` and `next build`
// (the production build restores the committed form), so it never counts as dirty.
function gitStatus(): string {
	return runSync("git", ["status", "--porcelain"])
		.split("\n")
		.filter(line => line.trim() !== "" && line.slice(3) !== "next-env.d.ts")
		.join("\n")
}

export type Signoff = {
	head: string
	checks: Checks
	tiers: Map<string, Check>
}

/** Checks the app config and a clean tree, records HEAD, and creates every tier's
 * check run on it: the first in progress, the rest queued. Creating them doubles as
 * the remaining preflight, since GitHub refuses an unpushed commit or a missing
 * installation. Returns null after printing why it refused. */
export async function startSignoff(tiers: string[], dryRun = false): Promise<Signoff | null> {
	const problems = configProblems()
	let status: string | undefined
	let head = ""
	try {
		status = gitStatus()
		head = runSync("git", ["rev-parse", "HEAD"]).trim()
	} catch {
		problems.push("sign-off needs a git tree and HEAD it can inspect")
	}
	if (status) problems.push("sign-off refuses a dirty tree: commit or stash first")
	if (dryRun) {
		console.log(`[dry-run] HEAD: ${head || "unknown"}`)
		for (const problem of problems) console.log(`[dry-run] a real run would refuse: ${problem}`)
	} else if (problems.length > 0) {
		for (const problem of problems) console.error(problem)
		return null
	}

	try {
		const checks = await connect(dryRun)
		const started = new Map<string, Check>()
		for (const [index, tier] of tiers.entries())
			started.set(tier, await checks.start(tier, head || "<HEAD>", index > 0))
		return { head, checks, tiers: started }
	} catch (error) {
		console.error(
			`could not create the check runs: ${error instanceof Error ? error.message : error}`,
		)
		console.error("is HEAD pushed, and is the app installed on this repository?")
		return null
	}
}

function cleanTreeUnchanged(head: string): string | undefined {
	try {
		if (gitStatus() !== "") return "The tree changed during the run."
		if (runSync("git", ["rev-parse", "HEAD"]).trim() !== head)
			return "HEAD changed during the run."
	} catch {
		return "Could not verify a clean tree after the run."
	}
}

/** Completes one tier's check. A pass concludes success only when the tree is still
 * clean at the recorded commit; otherwise failure, never neutral, because a required
 * check accepts neutral as passing. */
export async function finishTier(
	signoff: Signoff,
	tier: string,
	mode: string,
	summary: PhaseSummary,
	passed: boolean,
): Promise<void> {
	const check = signoff.tiers.get(tier)
	if (!check) return
	const result = outcome(summary, signoff.head, mode)
	const changed = passed ? cleanTreeUnchanged(signoff.head) : undefined
	if (changed) console.error(`${changed} The ${tier} check is marked failed.`)
	await check.finish({
		...result,
		conclusion: passed && !changed ? "success" : "failure",
		...(changed
			? { title: `Not signed: ${changed}`, summary: `${changed}\n\n${result.summary}` }
			: {}),
	})
}

/** Fails every check still open, for a run that stopped before its tests (a failed build). */
export async function failOpen(signoff: Signoff, reason: string): Promise<void> {
	for (const check of signoff.tiers.values())
		await check.finish({
			conclusion: "failure",
			title: reason,
			summary: `${reason}: no tests ran.`,
		})
}

/** Dry run: never refuses and sends nothing; prints the preflight results and the
 * check-run calls a real run would make for these tiers. */
export async function dryRunSignoff(tiers: string[]): Promise<number> {
	const signoff = await startSignoff(tiers, true)
	if (!signoff) return 1
	for (const [index, [tier, check]] of [...signoff.tiers].entries()) {
		console.log(`[dry-run] when ${tier} starts:`)
		if (index > 0) await check.begin()
		console.log(`[dry-run] when ${tier} finishes (success or failure):`)
		await check.finish({
			conclusion: "success",
			title: `<${tier} counts>`,
			summary: "<per-project table>",
		})
	}
	return 0
}
