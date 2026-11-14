// Background sync engine: debounced push on local writes plus checks on
// boot, focus, visibility, and reconnect. Manual controls stay authoritative:
// auto never pulls into a dirty browser and never resolves conflicts.

import { db } from "@/data/db"
import { SYNC_TABLES } from "@/data/export-import"
import {
	AuthNeededError,
	ensureDriveTokenSilent,
	findBackupFile,
	getClockSkewMs,
	getFileMeta,
	hasFreshDriveToken,
	isDriveConfigured,
} from "@/data/google-drive"
import {
	type DriveSyncResult,
	driveLocalDirty,
	driveStatus,
	markDriveChecked,
	pullDrive,
	pushDrive,
} from "@/logic/drive-sync"
import { isRemoteNewer } from "@/logic/shared"

export type SyncActivity = "checking" | "pushing" | "pulling" | null

export type SyncKind =
	| "unconfigured"
	| "never-synced"
	| "up-to-date"
	| "local-changes"
	| "conflict"
	| "needs-auth"
	| "offline"
	| "error"

export type SyncSnapshot = {
	configured: boolean
	kind: SyncKind
	activity: SyncActivity
	activityStartedAt: number | null
	lastSyncAt: string | null
	remoteModifiedTime: string | null
	lastCheckAt: string | null
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
	activityStartedAt: null,
	lastSyncAt: null,
	remoteModifiedTime: null,
	lastCheckAt: null,
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
		a.activityStartedAt === b.activityStartedAt &&
		a.lastSyncAt === b.lastSyncAt &&
		a.remoteModifiedTime === b.remoteModifiedTime &&
		a.lastCheckAt === b.lastCheckAt &&
		a.localDirty === b.localDirty &&
		a.conflictAt === b.conflictAt &&
		a.error === b.error
	)
}

function set(patch: Partial<SyncSnapshot>): void {
	const next = { ...snapshot, ...patch }
	if (patch.activity !== undefined && !("activityStartedAt" in patch)) {
		next.activityStartedAt =
			patch.activity == null
				? null
				: snapshot.activity == null
					? Date.now()
					: snapshot.activityStartedAt
	}
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
let writeSeq = 0
let pushTimer: number | null = null
let lastCycleAt = 0

function armPushTimer(): void {
	if (pushTimer) clearTimeout(pushTimer)
	pushTimer = window.setTimeout(() => {
		pushTimer = null
		void cycle("dirty")
	}, PUSH_DEBOUNCE_MS)
}

function markDirty(): void {
	pendingPush = true
	writeSeq++
	armPushTimer()
	if (snapshot.configured && !snapshot.localDirty) {
		// Only a settled display changes kind: states that need the user stay put.
		set({
			localDirty: true,
			...(snapshot.kind === "up-to-date" && {
				kind: snapshot.lastSyncAt ? "local-changes" : "never-synced",
			}),
		})
	}
}

type Locks = {
	request: <R>(
		name: string,
		options: { ifAvailable: boolean },
		callback: (lock: unknown) => Promise<R>,
	) => Promise<R>
}

/**
 * The one way Drive work runs: under the cross-tab lock and this tab's `running` flag, so
 * two pieces of work never write the Drive keys together. Resolves "skipped" when work is
 * already running in this tab, or in another tab unless `wait` is set. Work that succeeds
 * settles the pending push: only a write made after it started still needs one.
 */
async function exclusive<R>(wait: boolean, work: () => Promise<R>): Promise<R | "skipped"> {
	const guarded = async () => {
		if (running) return "skipped" as const
		running = true
		const seenWrites = writeSeq
		try {
			const result = await work()
			pendingPush = writeSeq !== seenWrites
			if (pendingPush) armPushTimer()
			return result
		} finally {
			running = false
		}
	}
	const locks = (navigator as Navigator & { locks?: Locks }).locks
	if (!locks) return guarded()
	return locks.request(LOCK_NAME, { ifAvailable: !wait }, lock =>
		lock ? guarded() : Promise.resolve("skipped" as const),
	)
}

async function refreshTimes(): Promise<{
	lastSyncAt: string | null
	remote: string | null
	check: string | null
}> {
	try {
		const status = await driveStatus()
		return {
			lastSyncAt: status.lastSyncAt,
			remote: status.remoteModifiedTime,
			check: status.lastCheckAt,
		}
	} catch {
		return {
			lastSyncAt: snapshot.lastSyncAt,
			remote: snapshot.remoteModifiedTime,
			check: snapshot.lastCheckAt,
		}
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
		snapshot.kind === "conflict" || snapshot.kind === "needs-auth" || snapshot.kind === "error"
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
		lastCheckAt: times.check,
		error: kind === "error" ? snapshot.error : null,
	})
}

async function finishCycle(outcome: DriveSyncResult, announced: boolean): Promise<void> {
	lastCycleAt = Date.now()
	await markDriveChecked().catch(() => undefined)
	const times = await refreshTimes()
	if (outcome.outcome === "pushed") {
		set({
			kind: "up-to-date",
			localDirty: false,
			lastSyncAt: times.lastSyncAt,
			remoteModifiedTime: times.remote,
			lastCheckAt: times.check,
			conflictAt: null,
			error: null,
		})
	} else if (outcome.outcome === "pulled") {
		set({
			kind: "up-to-date",
			localDirty: false,
			lastSyncAt: times.lastSyncAt,
			remoteModifiedTime: times.remote,
			lastCheckAt: times.check,
			conflictAt: null,
			error: null,
		})
		if (announced) {
			emit({
				key: `pulled-${times.lastSyncAt}`,
				title: "Restored from Drive.",
			})
		}
	} else if (outcome.outcome === "conflict") {
		set({
			kind: "conflict",
			localDirty: true,
			lastSyncAt: times.lastSyncAt,
			remoteModifiedTime: times.remote,
			lastCheckAt: times.check,
			conflictAt: outcome.remoteModifiedTime ?? times.remote,
			error: null,
		})
		if (announced) {
			emit({
				key: `conflict-${outcome.remoteModifiedTime}`,
				title: "Both sides changed — choose which to keep.",
				detail: "Open Data and choose which copy to keep.",
			})
		}
	} else {
		set({
			kind: times.lastSyncAt ? "up-to-date" : "never-synced",
			localDirty: outcome.outcome === "empty" ? false : snapshot.localDirty,
			lastSyncAt: times.lastSyncAt,
			remoteModifiedTime: times.remote,
			lastCheckAt: times.check,
			conflictAt: null,
			error: null,
		})
	}
}

/**
 * Run a manual Drive operation the way a background cycle runs, waiting for one in another
 * tab to finish. Its result feeds the shared display; the page keeps its own toasts.
 */
export async function runManualDrive(
	activity: Exclude<SyncActivity, null>,
	operation: () => Promise<DriveSyncResult>,
): Promise<DriveSyncResult> {
	const result = await exclusive(true, async () => {
		set({ activity, error: null })
		try {
			const result = await operation()
			await finishCycle(result, false)
			await refreshSyncDisplay()
			return result
		} finally {
			set({ activity: null })
		}
	})
	if (result === "skipped")
		throw new Error("Google Drive is busy syncing. Try again in a moment.")
	return result
}

/** Forget Drive state on this device (after disconnect). */
export async function resetSyncDisplay(): Promise<void> {
	pendingPush = false
	set({
		activity: null,
		activityStartedAt: null,
		...(snapshot.kind === "error" && { kind: "up-to-date", error: null }),
	})
	await refreshSyncDisplay()
}

/** An early return must not clear the activity of a cycle that is still running. */
const idle = () => (running ? {} : { activity: null })

async function cycle(reason: "boot" | "dirty" | "focus" | "online"): Promise<void> {
	if (!isDriveConfigured()) {
		set({ configured: false, kind: "unconfigured", error: null, ...idle() })
		return
	}
	if (!navigator.onLine) {
		set({ configured: true, kind: "offline", error: null, ...idle() })
		return
	}
	if (typeof document !== "undefined" && document.hidden && reason !== "boot") return
	if (!pendingPush && Date.now() - lastCycleAt < MIN_CYCLE_GAP_MS && reason !== "boot") {
		await refreshSyncDisplay()
		return
	}
	let outcome: DriveSyncResult | "skipped"
	try {
		outcome = await exclusive(false, async (): Promise<DriveSyncResult> => {
			set({ configured: true, activity: "checking", error: null })
			const token = await ensureDriveTokenSilent()
			const [status, localDirty] = await Promise.all([driveStatus(), driveLocalDirty()])
			let remote =
				status.fileId != null
					? await getFileMeta(token, status.fileId).catch(() => null)
					: null
			remote ??= await findBackupFile(token)
			if (!remote) {
				if (!localDirty) return { outcome: "up-to-date" }
				set({ activity: "pushing" })
				await pushDrive()
				return { outcome: "pushed" }
			}
			const remoteDirty = isRemoteNewer(
				remote.modifiedTime,
				status.lastSyncAt,
				getClockSkewMs(),
			)
			if (!localDirty && !remoteDirty) return { outcome: "up-to-date" }
			if (localDirty && remoteDirty)
				return { outcome: "conflict", remoteModifiedTime: remote.modifiedTime }
			if (remoteDirty) {
				// The restore's own writes count as writes here, so one more check follows.
				set({ activity: "pulling" })
				await pullDrive()
				return { outcome: "pulled", remoteModifiedTime: remote.modifiedTime }
			}
			set({ activity: "pushing" })
			await pushDrive()
			return { outcome: "pushed" }
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
	if (outcome === "skipped") {
		if (pendingPush) armPushTimer()
		return
	}
	await finishCycle(outcome, true)
	set({ activity: null })
}

function flushOnHide(): void {
	if (
		running ||
		!pendingPush ||
		!navigator.onLine ||
		!hasFreshDriveToken() ||
		!isDriveConfigured()
	)
		return
	try {
		void pushDrive().catch(() => undefined)
	} catch {
		// Best effort: the pending flag survives for the next visit.
	}
}

export function startAutoSync(): void {
	if (started || typeof window === "undefined") return
	started = true
	for (const table of SYNC_TABLES) {
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
