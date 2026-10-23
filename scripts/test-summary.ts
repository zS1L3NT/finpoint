// Summarises Playwright JSON reports for the pull request: counts, duration and
// every failure with its location and the start of its error.
import { existsSync, readFileSync } from "node:fs"

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
	failures: { project: string; location: string; title: string; error: string }[]
}

const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g")

function specs(suite: Suite, path: string[]): { spec: Spec; path: string[] }[] {
	const here = (suite.specs ?? []).map(spec => ({ spec, path }))
	const nested = (suite.suites ?? []).flatMap(child => specs(child, [...path, child.title]))
	return [...here, ...nested]
}

export function summarise(phase: string, file: string): PhaseSummary {
	if (!existsSync(file))
		return { phase, ran: false, passed: 0, failed: 0, flaky: 0, minutes: 0, failures: [] }
	const report = JSON.parse(readFileSync(file, "utf8")) as Report
	const failures: PhaseSummary["failures"] = []
	for (const suite of report.suites)
		for (const { spec, path } of specs(suite, [])) {
			for (const test of spec.tests) {
				if (test.status !== "unexpected") continue
				const result = test.results.at(-1)
				const message = (result?.errors[0]?.message ?? "no error message").replace(ANSI, "")
				failures.push({
					project: test.projectName,
					location: `tests/web/${spec.file}:${spec.line}`,
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
		failures,
	}
}

export function describe(summary: PhaseSummary): string {
	if (!summary.ran) return `${summary.phase}: did not run`
	const total = summary.passed + summary.failed + summary.flaky
	return `${summary.phase}: ${summary.passed}/${total} passed${summary.failed ? `, ${summary.failed} failed` : ""} in ${summary.minutes} min`
}

export function markdown(head: string, mode: string, phases: PhaseSummary[]): string {
	const lines = [
		"<!-- test-web-signoff -->",
		`### Browser tests: \`${mode}\` on \`${head.slice(0, 7)}\``,
		"",
		...phases.map(phase => `- ${phase.failed || !phase.ran ? "❌" : "✅"} ${describe(phase)}`),
	]
	for (const phase of phases)
		for (const failure of phase.failures)
			lines.push(
				"",
				`<details><summary>❌ [${failure.project}] ${failure.title}</summary>`,
				"",
				`\`${failure.location}\` (${phase.phase})`,
				"",
				"```",
				failure.error,
				"```",
				"</details>",
			)
	return lines.join("\n")
}
