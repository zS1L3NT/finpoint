// Sign-off for the test runners: preflight checks, the pull-request summary
// comment, and one gh-signoff commit status per tier (signoff/core, signoff/extra).
import { spawnSync } from "node:child_process"
import { runAsync, runSync, wasSignaled } from "./process"
import { describe, markdown, type PhaseSummary } from "./summary"

// Next rewrites next-env.d.ts when switching between `next dev` and `next build`
// (the production build restores the committed form), so it never counts as dirty.
function gitStatus(): string {
	return runSync("git", ["status", "--porcelain"])
		.split("\n")
		.filter(line => line.trim() !== "" && line.slice(3) !== "next-env.d.ts")
		.join("\n")
}

/** Real sign-off preflight: non-fatal, returns the recorded HEAD or null. */
export function preflightSignoff(): string | null {
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

/** Dry-run preflight: never refuses, so it works without gh-signoff installed.
 * Prints each check result plus the commands a real run would execute. */
export function dryRunPreflight(tiers: string[]): number {
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
	for (const tier of tiers) {
		console.log(`[dry-run] after ${tier}, on pass: gh signoff --commit <HEAD> ${tier}`)
		console.log(`[dry-run] after ${tier}, on failure: gh signoff fail --commit <HEAD> ${tier}`)
	}
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

// Upserts one pull-request comment (found by its marker) with the run summary and
// returns its URL, or undefined when the branch has no open pull request.
function postSummary(body: string): string | undefined {
	const view = spawnSync("gh", ["pr", "view", "--json", "number"], { encoding: "utf8" })
	if (view.status !== 0) return undefined
	const number = (JSON.parse(view.stdout) as { number: number }).number
	const comments = spawnSync(
		"gh",
		[
			"api",
			"--paginate",
			`repos/{owner}/{repo}/issues/${number}/comments`,
			"--jq",
			'.[] | select(.body | startswith("<!-- test-web-signoff -->")) | .id',
		],
		{ encoding: "utf8" },
	)
	const existing = comments.stdout.trim().split("\n").filter(Boolean).at(-1)
	const write = spawnSync(
		"gh",
		existing
			? [
					"api",
					"-X",
					"PATCH",
					`repos/{owner}/{repo}/issues/comments/${existing}`,
					"-F",
					"body=@-",
					"--jq",
					".html_url",
				]
			: [
					"api",
					`repos/{owner}/{repo}/issues/${number}/comments`,
					"-F",
					"body=@-",
					"--jq",
					".html_url",
				],
		{ encoding: "utf8", input: body },
	)
	if (write.status !== 0) {
		console.error(`could not post the test summary: ${write.stderr.trim()}`)
		return undefined
	}
	return write.stdout.trim() || undefined
}

/** Signs one finished tier on the commit recorded before the run, linking to the
 * pull-request summary of every tier so far. A pass becomes a green sign-off only
 * when the tree is still clean at that commit; a failure is posted red
 * (`gh signoff fail`) so a required check never sits pending after a failed run. */
export async function signTier(
	head: string,
	mode: string,
	phases: PhaseSummary[],
	pending: string[],
	tier: string,
	passed: boolean,
): Promise<number> {
	const url = postSummary(markdown(head, mode, phases, pending))
	const link = url ? ["--url", url] : []
	if (wasSignaled()) return 130
	if (passed) {
		if (!cleanTreeUnchanged(head)) return 1
		return runAsync("gh", ["signoff", "--commit", head, ...link, tier])
	}
	const summary = phases.find(phase => phase.phase === tier)
	const description = (summary ? describe(summary) : `${tier}: failed`).slice(0, 140)
	return runAsync("gh", [
		"signoff",
		"fail",
		"--commit",
		head,
		...link,
		"--description",
		description,
		tier,
	])
}
