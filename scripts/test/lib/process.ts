// Child processes for the test runners: synchronous helpers, and detached
// asynchronous runs that Ctrl+C stops as a whole process group.
import { type ChildProcess, spawn, spawnSync } from "node:child_process"

export function runSync(command: string, args: string[]): string {
	const result = spawnSync(command, args, { encoding: "utf8" })
	if (result.status !== 0)
		throw new Error(
			`failed: ${command} ${args.join(" ")}${result.stderr ? `\n${result.stderr}` : ""}`,
		)
	return result.stdout
}

let current: ChildProcess | undefined
let signaled = false
/** True once SIGINT or SIGTERM arrived; runners stop at their next step. */
export const wasSignaled = () => signaled

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

export function runAsync(
	command: string,
	args: string[],
	env: NodeJS.ProcessEnv = process.env,
): Promise<number> {
	return new Promise<number>(finish => {
		const child = spawn(command, args, { stdio: "inherit", env, detached: true })
		current = child
		// The direct child can exit while its process group (Playwright, the
		// webServer bundles) is still shutting down, so finish only once the
		// whole group is gone; the lock is released after that.
		child.on("exit", (code, signal) => {
			current = undefined
			const exit = signal ? 130 : (code ?? 1)
			if (!child.pid) return finish(exit)
			awaitGroupExit(child.pid).then(
				() => finish(exit),
				() => finish(exit),
			)
		})
		child.on("error", error => {
			current = undefined
			console.error(`failed to start ${command}: ${String(error)}`)
			// Biome misreads the executor's resolve as a Promise.
			void finish(1)
		})
	})
}
