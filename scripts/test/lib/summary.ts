// Summarises Playwright JSON reports for the check runs: counts per project,
// duration and every failure with its location and the start of its error.
import { existsSync, readFileSync } from "node:fs"
import type { Annotation, Outcome } from "./checks"

type Result = { status: string; duration: number; errors: { message?: string }[] }
type Spec = {
	title: string
	file: string
	line: number
	tests: { projectName: string; status: string; results: Result[] }[]
}
type Suite = { title: string; specs?: Spec[]; suites?: Suite[] }
type Report = {
	stats: {
		duration: number
		expected: number
		unexpected: number
		flaky: number
		skipped: number
	}
	suites: Suite[]
}

export type PhaseSummary = {
	phase: string
	ran: boolean
	passed: number
	failed: number
	flaky: number
	minutes: number
	projects: Record<string, { passed: number; failed: number; flaky: number; skipped: number }>
	failures: { project: string; file: string; line: number; title: string; error: string }[]
}

const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g")

function specs(suite: Suite, path: string[]): { spec: Spec; path: string[] }[] {
	const here = (suite.specs ?? []).map(spec => ({ spec, path }))
	const nested = (suite.suites ?? []).flatMap(child => specs(child, [...path, child.title]))
	return [...here, ...nested]
}

export function summarise(phase: string, file: string): PhaseSummary {
	if (!existsSync(file))
		return {
			phase,
			ran: false,
			passed: 0,
			failed: 0,
			flaky: 0,
			minutes: 0,
			projects: {},
			failures: [],
		}
	const report = JSON.parse(readFileSync(file, "utf8")) as Report
	const projects: PhaseSummary["projects"] = {}
	const failures: PhaseSummary["failures"] = []
	for (const suite of report.suites)
		for (const { spec, path } of specs(suite, [])) {
			for (const test of spec.tests) {
				projects[test.projectName] ??= { passed: 0, failed: 0, flaky: 0, skipped: 0 }
				const counts = projects[test.projectName]
				if (test.status === "expected") counts.passed++
				else if (test.status === "unexpected") counts.failed++
				else if (test.status === "flaky") counts.flaky++
				else counts.skipped++
				if (test.status !== "unexpected") continue
				const result = test.results.at(-1)
				const message = (result?.errors[0]?.message ?? "no error message").replace(ANSI, "")
				failures.push({
					project: test.projectName,
					file: `tests/web/${spec.file}`,
					line: spec.line,
					title: [...path.filter(Boolean), spec.title].join(" › "),
					error: message.split("\n").slice(0, 12).join("\n"),
				})
			}
		}
	return {
		phase,
		ran: true,
		passed: report.stats.expected,
		failed: report.stats.unexpected,
		flaky: report.stats.flaky,
		minutes: Math.round(report.stats.duration / 6000) / 10,
		projects,
		failures,
	}
}

export function describe(summary: PhaseSummary): string {
	if (!summary.ran) return "did not run"
	return `${summary.failed ? `${summary.failed} failed, ` : ""}${summary.passed} passed${summary.flaky ? `, ${summary.flaky} flaky` : ""} in ${summary.minutes} min`
}

/** The check-run output for one tier: counts per project, then every failure,
 * and one annotation per failing spec line (listing each project it failed on). */
export function outcome(
	summary: PhaseSummary,
	head: string,
	mode: string,
): Omit<Outcome, "conclusion"> {
	const rows = Object.entries(summary.projects).map(
		([project, c]) => `| ${project} | ${c.passed} | ${c.failed} | ${c.flaky} | ${c.skipped} |`,
	)
	const annotations = new Map<string, Annotation>()
	for (const failure of summary.failures) {
		const key = `${failure.file}:${failure.line}`
		const existing = annotations.get(key)
		if (existing) existing.title = existing.title.replace("]", `, ${failure.project}]`)
		else
			annotations.set(key, {
				path: failure.file,
				line: failure.line,
				title: `[${failure.project}] ${failure.title}`,
				message: failure.error,
			})
	}
	return {
		title: describe(summary),
		summary: [
			`\`${mode}\` run on \`${head.slice(0, 7)}\`, ${summary.minutes} min.`,
			"",
			"| Project | Passed | Failed | Flaky | Skipped |",
			"| --- | --- | --- | --- | --- |",
			...rows,
		].join("\n"),
		text: summary.failures
			.map(failure =>
				[
					`### ❌ [${failure.project}] ${failure.title}`,
					"",
					`\`${failure.file}:${failure.line}\``,
					"",
					"```",
					failure.error,
					"```",
				].join("\n"),
			)
			.join("\n\n"),
		annotations: [...annotations.values()],
	}
}
