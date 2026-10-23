#!/usr/bin/env bun
// Portable suite lock for scripts/test-web.ts. No side effects on import so the
// logic can be exercised without running browsers.
import { closeSync, mkdirSync, openSync, readFileSync, rmSync, writeSync } from "node:fs"

export const LOCK_DIR = "test-results/.suite-lock"
const LOCK_PID = `${LOCK_DIR}/pid`
const CLEAR_HINT = "if no suite run is active, clear it with: rm -rf test-results/.suite-lock"

function refuse(reason: string): never {
	console.error(reason)
	console.error(CLEAR_HINT)
	process.exit(1)
}

// The pid file is created with O_EXCL, so exactly one contender wins it; the
// mkdir below only ensures the parent exists and never decides ownership. A
// competing pid file is never reclaimed automatically: two runners could both
// judge the same dead pid stale and both take the lock. A stale lock is
// reported with its holder's state and cleared by hand.
export function takeLock(): void {
	mkdirSync(LOCK_DIR, { recursive: true })
	let fd: number
	try {
		fd = openSync(LOCK_PID, "wx", 0o644)
	} catch (error) {
		if ((error as NodeJS.ErrnoException)?.code !== "EEXIST") throw error
		refuse(describeHolder())
	}
	writeSync(fd, String(process.pid))
	closeSync(fd)
}

function readHolder(): number | null {
	try {
		const pid = Number(readFileSync(LOCK_PID, "utf8").trim())
		return Number.isInteger(pid) && pid > 0 ? pid : null
	} catch {
		return null
	}
}

function describeHolder(): string {
	const pid = readHolder()
	if (pid === null) return "the suite lock is held, but its pid file is missing or unreadable"
	try {
		process.kill(pid, 0)
		return `another suite run holds the lock (pid ${pid})`
	} catch (error) {
		return (error as NodeJS.ErrnoException)?.code === "ESRCH"
			? `the suite lock is stale: its holder (pid ${pid}) has exited`
			: `another suite run may hold the lock (pid ${pid})`
	}
}

// Releases only a lock this process owns, so a run never deletes another's.
export function releaseLock(): void {
	if (readHolder() === process.pid) rmSync(LOCK_PID, { force: true })
}
