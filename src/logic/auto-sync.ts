// Background sync engine: debounced push on local writes plus checks on
// boot, focus, visibility, and reconnect. Manual controls stay authoritative:
// auto never pulls into a dirty browser and never resolves conflicts.

import { db } from "@/data/db"
import { TABLES } from "@/data/export-import"
import {
	AuthNeededError,
	ensureDriveTokenSilent,
	findBackupFile,
	getFileMeta,
	hasFreshDriveToken,
	isDriveConfigured,
} from "@/data/google-drive"
import {
	type DriveSyncResult,
	driveLocalDirty,
	driveStatus,
	pullDrive,
	pushDrive,
} from "@/logic/drive-sync"

export type SyncActivity = "checking" | "pushing" | "pulling" | null

export type SyncKind =
	| "unconfigured"
	| "never-synced"
	| "up-to-date"
	| "local-changes"
	| "remote-newer"
	| "conflict"
	| "needs-auth"
	| "offline"
	| "error"

export type SyncSnapshot = {
	configured: boolean
	kind: SyncKind
	activity: SyncActivity
	lastSyncAt: string | null
	remoteModifiedTime: string | null
	localDirty: boolean
	conflictAt: string | null
	error: string | null
}

export type SyncEvent = { key: string; title: string; detail?: string }

const PUSH_DEBOUNCE_MS = 20_000
const MIN_CYCLE_GAP_MS = 30_000
const LOCK_NAME = "finpoint-drive-sync"

let snapshot: SyncSnapshot = {
	configured: false,
	kind: "unconfigured",
	activity: null,
	lastSyncAt: null,
	remoteModifiedTime: null,
	localDirty: false,
	conflictAt: null,
	error: null,
}

const snapshotListeners = new Set<() => void>()
const eventListeners = new Set<(event: SyncEvent) => void>()

function sameSnapshot(a: SyncSnapshot, b: SyncSnapshot): boolean {
	return (
		a.configured === b.configured &&
		a.kind === b.kind &&
		a.activity === b.activity &&
		a.lastSyncAt === b.lastSyncAt &&
		a.remoteModifiedTime === b.remoteModifiedTime &&
		a.localDirty === b.localDirty &&
		a.conflictAt === b.conflictAt &&
		a.error === b.error
	)
}

function set(patch: Partial<SyncSnapshot>): void {
	const next = { ...snapshot, ...patch }
	if (sameSnapshot(snapshot, next)) return
	snapshot = next
	for (const listener of snapshotListeners) listener()
}

function emit(event: SyncEvent): void {
	for (const listener of eventListeners) listener(event)
}

export function subscribeSync(listener: () => void): () => void {
	snapshotListeners.add(listener)
	return () => {
		snapshotListeners.delete(listener)
	}
}

export function getSyncSnapshot(): SyncSnapshot {
	return snapshot
}

export function subscribeSyncEvents(listener: (event: SyncEvent) => void): () => void {
	eventListeners.add(listener)
	return () => {
		eventListeners.delete(listener)
	}
}

let started = false
let running = false
let pendingPush = false
let pushTimer: number | null = null
let lastCycleAt = 0

function markDirty(): void {
	pendingPush = true
	if (pushTimer) clearTimeout(pushTimer)
	pushTimer = window.setTimeout(() => {
		pushTimer = null
		void cycle("dirty")
	}, PUSH_DEBOUNCE_MS)
	if (snapshot.configured && !snapshot.localDirty) {
		set({ localDirty: true, kind: snapshot.lastSyncAt ? "local-changes" : "never-synced" })
	}
}

async function withSyncLock(
	run: () => Promise<DriveSyncResult | "skipped" | undefined>,
): Promise<DriveSyncResult | "skipped" | undefined> {
	const locks = (
		navigator as Navigator & {
			locks?: {
				request: <R>(
					name: string,
					options: { ifAvailable: boolean },
					callback: (lock: { name: string } | null) => Promise<R>,
				) => Promise<R>
			}
		}
	).locks
	if (!locks) return run()
	return locks.request(LOCK_NAME, { ifAvailable: true }, lock =>
		lock ? run() : Promise.resolve("skipped" as const),
	)
}

async function refreshTimes(): Promise<{ lastSyncAt: string | null; remote: string | null }> {
	try {
		const status = await driveStatus()
		return { lastSyncAt: status.lastSyncAt, remote: status.remoteModifiedTime }
	} catch {
		return { lastSyncAt: snapshot.lastSyncAt, remote: snapshot.remoteModifiedTime }
	}
}

/** Cheap local-only refresh: no network, safe to call after any write burst. */
export async function refreshSyncDisplay(): Promise<void> {
	if (!isDriveConfigured()) {
		set({
			configured: false,
			kind: "unconfigured",
			activity: null,
			localDirty: false,
			error: null,
		})
		return
	}
	const [times, dirty] = await Promise.all([
		refreshTimes(),
		driveLocalDirty().catch(() => snapshot.localDirty),
	])
	const kind =
		snapshot.kind === "conflict" ||
		snapshot.kind === "remote-newer" ||
		snapshot.kind === "needs-auth"
			? snapshot.kind
			: !times.lastSyncAt
				? "never-synced"
				: dirty
					? "local-changes"
					: "up-to-date"
	set({
		configured: true,
		kind,
		localDirty: dirty,
		lastSyncAt: times.lastSyncAt,
		remoteModifiedTime: times.remote,
		error: null,
	})
}

async function finishCycle(outcome: DriveSyncResult, announced: boolean): Promise<void> {
	pendingPush = false
	lastCycleAt = Date.now()
	const times = await refreshTimes()
	if (outcome.outcome === "pushed") {
		set({
			kind: "up-to-date",
			localDirty: false,
			lastSyncAt: times.lastSyncAt,
			remoteModifiedTime: times.remote,
			conflictAt: null,
			error: null,
		})
	} else if (outcome.outcome === "pulled") {
		set({
			kind: "up-to-date",
			localDirty: false,
			lastSyncAt: times.lastSyncAt,
			remoteModifiedTime: times.remote,
			conflictAt: null,
			error: null,
		})
		if (announced) {
			emit({
				key: `pulled-${times.lastSyncAt}`,
				title: "Updated from Google Drive.",
			})
		}
	} else if (outcome.outcome === "conflict") {
		set({
			kind: "conflict",
			localDirty: true,
			lastSyncAt: times.lastSyncAt,
			remoteModifiedTime: times.remote,
			conflictAt: outcome.remoteModifiedTime ?? times.remote,
			error: null,
		})
		if (announced) {
			emit({
				key: `conflict-${outcome.remoteModifiedTime}`,
				title: "Both sides changed — choose which to keep.",
				detail: "Open Sync to pick a winner.",
			})
		}
	} else if (outcome.outcome === "remote-newer") {
		const dirty = await driveLocalDirty().catch(() => true)
		set({
			kind: "remote-newer",
			localDirty: dirty,
			lastSyncAt: times.lastSyncAt,
			remoteModifiedTime: outcome.remoteModifiedTime ?? times.remote,
			conflictAt: outcome.remoteModifiedTime ?? times.remote,
			error: null,
		})
		if (announced) {
			emit({
				key: `remote-${outcome.remoteModifiedTime}`,
				title: "Google Drive has a newer copy.",
				detail: "Open Sync to read it or keep yours.",
			})
		}
	} else {
		set({
			kind: times.lastSyncAt ? "up-to-date" : "never-synced",
			localDirty: outcome.outcome === "empty" ? false : snapshot.localDirty,
			lastSyncAt: times.lastSyncAt,
			remoteModifiedTime: times.remote,
			conflictAt: null,
			error: null,
		})
	}
}

/** Feed a manual result into the shared display (page keeps its own toasts). */
export async function ingestManualResult(result: DriveSyncResult): Promise<void> {
	await finishCycle(result, false)
	await refreshSyncDisplay()
}

/** Forget Drive state on this device (after disconnect). */
export async function resetSyncDisplay(): Promise<void> {
	pendingPush = false
	await refreshSyncDisplay()
}

async function cycle(reason: "boot" | "dirty" | "focus" | "online"): Promise<void> {
	if (!isDriveConfigured()) {
		set({ configured: false, kind: "unconfigured", activity: null, error: null })
		return
	}
	if (!navigator.onLine) {
		set({ configured: true, kind: "offline", activity: null, error: null })
		return
	}
	if (typeof document !== "undefined" && document.hidden && reason !== "boot") return
	if (!pendingPush && Date.now() - lastCycleAt < MIN_CYCLE_GAP_MS && reason !== "boot") {
		await refreshSyncDisplay()
		return
	}
	let outcome: DriveSyncResult | "skipped" | undefined
	try {
		outcome = await withSyncLock(async () => {
			if (running) return "skipped" as const
			running = true
			try {
				set({ configured: true, activity: "checking", error: null })
				const token = await ensureDriveTokenSilent()
				const [status, localDirty] = await Promise.all([driveStatus(), driveLocalDirty()])
				let remote =
					status.fileId != null
						? await getFileMeta(token, status.fileId).catch(() => null)
						: null
				remote ??= await findBackupFile(token)
				if (!remote) {
					if (!localDirty) return { outcome: "up-to-date" } as DriveSyncResult
					set({ activity: "pushing" })
					await pushDrive()
					return { outcome: "pushed" } as DriveSyncResult
				}
				const remoteDirty = status.lastSyncAt
					? new Date(remote.modifiedTime) > new Date(status.lastSyncAt)
					: true
				if (!localDirty && !remoteDirty) return { outcome: "up-to-date" } as DriveSyncResult
				if (localDirty && remoteDirty)
					return {
						outcome: "conflict",
						remoteModifiedTime: remote.modifiedTime,
					} as DriveSyncResult
				if (remoteDirty) {
					// Boot with a clean browser is the only auto-pull: nothing to lose.
					if (reason === "boot") {
						set({ activity: "pulling" })
						await pullDrive()
						return {
							outcome: "pulled",
							remoteModifiedTime: remote.modifiedTime,
						} as DriveSyncResult
					}
					return {
						outcome: "remote-newer",
						remoteModifiedTime: remote.modifiedTime,
					} as DriveSyncResult
				}
				set({ activity: "pushing" })
				await pushDrive()
				return { outcome: "pushed" } as DriveSyncResult
			} finally {
				running = false
			}
		})
	} catch (cause) {
		lastCycleAt = Date.now()
		if (cause instanceof AuthNeededError) {
			const status = await driveStatus().catch(() => null)
			const dirty = await driveLocalDirty().catch(() => snapshot.localDirty)
			set({
				configured: true,
				activity: null,
				kind: status?.lastSyncAt ? "needs-auth" : "never-synced",
				localDirty: dirty,
				lastSyncAt: status?.lastSyncAt ?? snapshot.lastSyncAt,
				remoteModifiedTime: status?.remoteModifiedTime ?? snapshot.remoteModifiedTime,
				error: null,
			})
		} else if (!navigator.onLine) {
			set({ configured: true, kind: "offline", activity: null, error: null })
		} else {
			set({
				configured: true,
				kind: "error",
				activity: null,
				error: cause instanceof Error ? cause.message : "Sync failed.",
			})
		}
		return
	}
	if (outcome === "skipped" || outcome === undefined) return
	lastCycleAt = Date.now()
	await finishCycle(outcome, true)
	set({ activity: null })
}

function flushOnHide(): void {
	if (!pendingPush || !navigator.onLine || !hasFreshDriveToken() || !isDriveConfigured()) return
	try {
		void pushDrive().catch(() => undefined)
	} catch {
		// Best effort: the pending flag survives for the next visit.
	}
}

export function startAutoSync(): void {
	if (started || typeof window === "undefined") return
	started = true
	for (const table of TABLES) {
		db.table(table).hook("creating", () => markDirty())
		db.table(table).hook("updating", () => markDirty())
		db.table(table).hook("deleting", () => markDirty())
	}
	window.addEventListener("online", () => void cycle("online"))
	window.addEventListener("focus", () => void cycle("focus"))
	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) void cycle("focus")
	})
	window.addEventListener("pagehide", flushOnHide)
	void refreshSyncDisplay()
	window.setTimeout(() => void cycle("boot"), 4000)
}
