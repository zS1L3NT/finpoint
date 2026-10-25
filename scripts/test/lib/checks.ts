// GitHub Check Runs posted as a GitHub App from a local machine. Knows nothing
// about this repository's tests: it reads the app from ~/.config/local-ci/config.json
// (`{ "appId": 123, "keyPath": "~/.config/local-ci/app.pem" }`), finds the app's
// installation on the origin repository, and creates and completes check runs on it.
import { spawnSync } from "node:child_process"
import { createSign } from "node:crypto"
import { existsSync, readFileSync, statSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { runSync } from "./process"

export type Annotation = { path: string; line: number; title: string; message: string }
export type Conclusion = "success" | "failure" | "cancelled"
export type Outcome = {
	conclusion: Conclusion
	title: string
	summary: string
	text?: string
	annotations?: Annotation[]
}
export type Check = {
	/** queued → in_progress; nothing for a check started in progress. */
	begin(): Promise<void>
	finish(outcome: Outcome): Promise<void>
}

const API = "https://api.github.com"
const CONFIG = join(homedir(), ".config/local-ci/config.json")
// GitHub's limits: 65,535 characters per output field, 50 annotations per request.
const FIELD_LIMIT = 65_535
const ANNOTATION_BATCH = 50

type Config = { appId: number; keyPath: string }
type Client = {
	request(method: string, path: string, body?: unknown): Promise<{ id: number; html_url: string }>
}

const expand = (path: string) => path.replace(/^~(?=\/)/, homedir())

/** Problems with the local app config, or none; never reads the key itself. */
export function configProblems(): string[] {
	if (!existsSync(CONFIG)) return [`no app config at ${CONFIG}`]
	let config: Partial<Config>
	try {
		config = JSON.parse(readFileSync(CONFIG, "utf8"))
	} catch {
		return [`${CONFIG} is not valid JSON`]
	}
	const problems: string[] = []
	if (typeof config.appId !== "number") problems.push(`${CONFIG} needs a numeric appId`)
	if (typeof config.keyPath !== "string") problems.push(`${CONFIG} needs a keyPath`)
	else if (!existsSync(expand(config.keyPath)))
		problems.push(`no private key at ${expand(config.keyPath)}`)
	else if ((statSync(expand(config.keyPath)).mode & 0o077) !== 0)
		problems.push(`${expand(config.keyPath)} is readable by others: chmod 600 it`)
	return problems
}

/** owner/repo of the origin remote (https or ssh URL). */
export function originRepo(): string {
	const url = runSync("git", ["remote", "get-url", "origin"]).trim()
	const match = url.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/)
	if (!match?.[1]) throw new Error(`origin is not a GitHub repository: ${url}`)
	return match[1]
}

async function call(method: string, path: string, token: string, body?: unknown) {
	const response = await fetch(`${API}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
		},
		body: body === undefined ? undefined : JSON.stringify(body),
	})
	if (!response.ok)
		throw new Error(
			`${method} ${path}: ${response.status} ${(await response.text()).slice(0, 300)}`,
		)
	return response.json()
}

// A JWT signed with the app key, valid for 9 minutes (backdated 60 s for clock drift).
function appJwt(config: Config): string {
	const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url")
	const now = Math.floor(Date.now() / 1000)
	const body = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iat: now - 60, exp: now + 540, iss: String(config.appId) })}`
	const signature = createSign("RSA-SHA256")
		.update(body)
		.sign(readFileSync(expand(config.keyPath)), "base64url")
	return `${body}.${signature}`
}

// Installation tokens last an hour; one is renewed when under 5 minutes remain.
async function realClient(repo: string): Promise<Client> {
	const config = JSON.parse(readFileSync(CONFIG, "utf8")) as Config
	const installation = await call("GET", `/repos/${repo}/installation`, appJwt(config)).catch(
		() => {
			throw new Error(`the GitHub App ${config.appId} is not installed on ${repo}`)
		},
	)
	let token = ""
	let expires = 0
	return {
		async request(method, path, body) {
			if (Date.now() > expires - 5 * 60_000) {
				const issued = await call(
					"POST",
					`/app/installations/${installation.id}/access_tokens`,
					appJwt(config),
				)
				token = issued.token
				expires = Date.parse(issued.expires_at)
			}
			return call(method, path, token, body)
		},
	}
}

function dryClient(): Client {
	let id = 0
	return {
		async request(method, path, body) {
			const shown = JSON.stringify(body, (key, value) =>
				key === "annotations"
					? `[${value.length} annotations]`
					: typeof value === "string" && value.length > 80
						? `${value.slice(0, 77)}...`
						: value,
			)
			console.log(`[dry-run] ${method} ${path}${shown ? ` ${shown}` : ""}`)
			return { id: ++id, html_url: "" }
		},
	}
}

const trim = (text: string) =>
	text.length <= FIELD_LIMIT
		? text
		: `${text.slice(0, FIELD_LIMIT - 40)}\n\n…trimmed to fit GitHub's limit`

/** Connects to the origin repository; `dryRun` prints each call instead of sending it. */
export async function connect(dryRun: boolean) {
	const repo = originRepo()
	const client = dryRun ? dryClient() : await realClient(repo)
	const open = new Set<() => Promise<void>>()

	return {
		/** Creates a check run on `sha`: in progress now, or queued until `begin`. */
		async start(name: string, sha: string, queued = false): Promise<Check> {
			const created = await client.request("POST", `/repos/${repo}/check-runs`, {
				name,
				head_sha: sha,
				status: queued ? "queued" : "in_progress",
				...(queued ? {} : { started_at: new Date().toISOString() }),
			})
			const path = `/repos/${repo}/check-runs/${created.id}`
			if (created.html_url) console.log(`${name}: ${created.html_url}`)
			const finish = async ({
				conclusion,
				title,
				summary,
				text,
				annotations = [],
			}: Outcome) => {
				open.delete(cancel)
				const lines = annotations.map(({ path, line, title, message }) => ({
					path,
					start_line: line,
					end_line: line,
					annotation_level: "failure",
					title: title.slice(0, 255),
					message: message.slice(0, FIELD_LIMIT),
				}))
				const output = {
					title,
					summary: trim(summary),
					...(text ? { text: trim(text) } : {}),
				}
				await client.request("PATCH", path, {
					status: "completed",
					conclusion,
					completed_at: new Date().toISOString(),
					output: { ...output, annotations: lines.slice(0, ANNOTATION_BATCH) },
				})
				for (let index = ANNOTATION_BATCH; index < lines.length; index += ANNOTATION_BATCH)
					await client.request("PATCH", path, {
						output: {
							...output,
							annotations: lines.slice(index, index + ANNOTATION_BATCH),
						},
					})
			}
			const cancel = () =>
				finish({
					conclusion: "cancelled",
					title: "Cancelled",
					summary: "The run was interrupted.",
				})
			open.add(cancel)
			return {
				begin: async () => {
					if (queued)
						await client.request("PATCH", path, {
							status: "in_progress",
							started_at: new Date().toISOString(),
						})
				},
				finish,
			}
		},

		/** Completes every unfinished check as cancelled, so none is left in progress. */
		async cancelOpen(): Promise<void> {
			for (const cancel of [...open])
				await cancel().catch(error => console.error(`could not cancel a check: ${error}`))
		},
	}
}

export type Checks = Awaited<ReturnType<typeof connect>>

/** Makes the default branch's ruleset require exactly these checks, each from this
 * app, so a status or check posted by anyone else cannot satisfy them. Needs a `gh`
 * login with admin rights on the repository; the app itself has no such permission. */
export function requireChecks(names: string[], dryRun: boolean): number {
	const repo = originRepo()
	const { appId } = JSON.parse(readFileSync(CONFIG, "utf8")) as Config
	type Rule = { type: string; parameters?: { required_status_checks?: unknown[] } }
	type Ruleset = { id: number; name: string; rules: Rule[] }
	const rulesets = JSON.parse(
		runSync("gh", ["api", `repos/${repo}/rulesets?targets=branch`]),
	) as { id: number }[]
	const target = rulesets
		.map(
			({ id }) =>
				JSON.parse(runSync("gh", ["api", `repos/${repo}/rulesets/${id}`])) as Ruleset,
		)
		.find(ruleset => ruleset.rules.some(rule => rule.type === "required_status_checks"))
	if (!target) {
		console.error(`no branch ruleset on ${repo} has required status checks to update`)
		return 1
	}
	const rules = target.rules.map(rule =>
		rule.type === "required_status_checks"
			? {
					...rule,
					parameters: {
						...rule.parameters,
						required_status_checks: names.map(context => ({
							context,
							integration_id: appId,
						})),
					},
				}
			: rule,
	)
	const body = JSON.stringify({ rules })
	if (dryRun) {
		console.log(`[dry-run] PUT repos/${repo}/rulesets/${target.id} (${target.name}) ${body}`)
		return 0
	}
	const result = spawnSync(
		"gh",
		["api", "-X", "PUT", `repos/${repo}/rulesets/${target.id}`, "--input", "-", "--silent"],
		{ encoding: "utf8", input: body, stdio: ["pipe", "inherit", "inherit"] },
	)
	if (result.status === 0)
		console.log(`${target.name} now requires ${names.join(", ")} from app ${appId}`)
	return result.status ?? 1
}
