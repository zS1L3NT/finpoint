// Mirrors a DriveSyncController: plaintext snapshot sync to the user's own
// Google Drive appDataFolder. Manual JSON backup/restore stays untouched.

import { db } from "@/data/db"
import { exportData, importData, parseImportFile } from "@/data/export-import"
import {
	disconnectDrive,
	downloadBackupFile,
	ensureDriveToken,
	findBackupFile,
	getClockSkewMs,
	getFileMeta,
	isDriveConfigured,
	uploadBackupFile,
} from "@/data/google-drive"
import { isRemoteNewer } from "@/logic/shared"

export { wasVaultProven } from "@/data/google-drive"

const FILE_ID_KEY = "drive_file_id"
const LAST_SYNC_KEY = "drive_last_sync_at"
const LAST_HASH_KEY = "drive_last_hash"
const REMOTE_TIME_KEY = "drive_remote_time"
const LAST_CHECK_KEY = "drive_last_check_at"

export type DriveSyncOutcome = "up-to-date" | "pushed" | "pulled" | "conflict" | "empty"

export type DriveSyncResult = {
	outcome: DriveSyncOutcome
	remoteModifiedTime?: string | null
}

export type DriveStatus = {
	configured: boolean
	fileId: string | null
	lastSyncAt: string | null
	remoteModifiedTime: string | null
	lastCheckAt: string | null
}

async function metaGet(key: string): Promise<string | null> {
	return (await db.meta.get(key))?.value ?? null
}

async function hashTables(tables: unknown): Promise<string> {
	// Sort rows so the hash survives an export -> import -> export round trip
	// (IndexedDB returns rows in key order, not insertion order).
	const normalized: Record<string, unknown[]> = {}
	for (const [key, rows] of Object.entries(tables as Record<string, unknown[]>)) {
		normalized[key] = [...rows].sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1))
	}
	const bytes = new TextEncoder().encode(JSON.stringify(normalized))
	const digest = await crypto.subtle.digest("SHA-256", bytes)
	return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function driveStatus(): Promise<DriveStatus> {
	const [fileId, lastSyncAt, remoteModifiedTime, lastCheckAt] = await Promise.all([
		metaGet(FILE_ID_KEY),
		metaGet(LAST_SYNC_KEY),
		metaGet(REMOTE_TIME_KEY),
		metaGet(LAST_CHECK_KEY),
	])
	return { configured: isDriveConfigured(), fileId, lastSyncAt, remoteModifiedTime, lastCheckAt }
}

/** Stamp a completed Drive round trip (data moved or not). */
export async function markDriveChecked(): Promise<void> {
	await db.meta.put({ key: LAST_CHECK_KEY, value: new Date().toISOString() })
}

export async function driveLocalDirty(): Promise<boolean> {
	const snapshot = await exportData()
	const lastHash = await metaGet(LAST_HASH_KEY)
	if (!lastHash) {
		return Object.values(snapshot.tables).some(rows => Array.isArray(rows) && rows.length > 0)
	}
	return (await hashTables(snapshot.tables)) !== lastHash
}

export async function syncDrive(): Promise<DriveSyncResult> {
	if (!isDriveConfigured()) throw new Error("Google Drive is not set up yet (missing client ID).")

	const token = await ensureDriveToken()
	const snapshot = await exportData()
	const localHash = await hashTables(snapshot.tables)

	const [storedFileId, lastSyncAt, lastHash] = await Promise.all([
		metaGet(FILE_ID_KEY),
		metaGet(LAST_SYNC_KEY),
		metaGet(LAST_HASH_KEY),
	])

	let fileId = storedFileId
	let remoteMeta = fileId ? await getFileMeta(token, fileId).catch(() => null) : null
	if (!remoteMeta) {
		remoteMeta = await findBackupFile(token)
		fileId = remoteMeta?.id ?? null
	}
	if (!remoteMeta || !fileId) {
		const total = Object.values(snapshot.tables).reduce(
			(sum, rows) => sum + (Array.isArray(rows) ? rows.length : 0),
			0,
		)
		if (!total) return { outcome: "empty" }
		const uploaded = await uploadBackupFile(token, JSON.stringify(snapshot), null)
		const now = new Date().toISOString()
		await Promise.all([
			db.meta.put({ key: FILE_ID_KEY, value: uploaded.id }),
			db.meta.put({ key: LAST_SYNC_KEY, value: now }),
			db.meta.put({ key: LAST_HASH_KEY, value: localHash }),
		])
		return { outcome: "pushed" }
	}

	const localDirty = lastHash ? localHash !== lastHash : true
	const remoteDirty = isRemoteNewer(remoteMeta.modifiedTime, lastSyncAt, getClockSkewMs())
	await db.meta.put({ key: REMOTE_TIME_KEY, value: remoteMeta.modifiedTime })
	if (!localDirty && !remoteDirty) return { outcome: "up-to-date" }
	if (localDirty && remoteDirty) {
		return { outcome: "conflict", remoteModifiedTime: remoteMeta.modifiedTime }
	}
	if (remoteDirty) {
		await pullDrive()
		return { outcome: "pulled", remoteModifiedTime: remoteMeta.modifiedTime }
	}

	await pushDrive()
	return { outcome: "pushed" }
}

export async function pushDrive(): Promise<void> {
	if (!isDriveConfigured()) throw new Error("Google Drive is not set up yet (missing client ID).")

	const token = await ensureDriveToken()
	const snapshot = await exportData()
	const localHash = await hashTables(snapshot.tables)

	const storedFileId = await metaGet(FILE_ID_KEY)
	let fileId = storedFileId
	if (!fileId) fileId = (await findBackupFile(token))?.id ?? null
	const uploaded = await uploadBackupFile(token, JSON.stringify(snapshot), fileId)
	const meta = await getFileMeta(token, uploaded.id).catch(() => null)
	const now = new Date().toISOString()
	await Promise.all([
		db.meta.put({ key: FILE_ID_KEY, value: uploaded.id }),
		db.meta.put({ key: LAST_SYNC_KEY, value: now }),
		db.meta.put({ key: LAST_HASH_KEY, value: localHash }),
		db.meta.put({ key: REMOTE_TIME_KEY, value: meta?.modifiedTime ?? now }),
	])
}

export async function pullDrive(): Promise<void> {
	if (!isDriveConfigured()) throw new Error("Google Drive is not set up yet (missing client ID).")

	const token = await ensureDriveToken()
	const storedFileId = await metaGet(FILE_ID_KEY)
	const fileId = storedFileId ?? (await findBackupFile(token))?.id
	if (!fileId) throw new Error("No backup found in Google Drive yet.")

	const text = await downloadBackupFile(token, fileId)
	const snapshot = parseImportFile(text)
	await importData(snapshot)
	const meta = await getFileMeta(token, fileId).catch(() => null)
	const now = new Date().toISOString()
	await Promise.all([
		db.meta.put({ key: FILE_ID_KEY, value: fileId }),
		db.meta.put({ key: LAST_SYNC_KEY, value: now }),
		db.meta.put({ key: LAST_HASH_KEY, value: await hashTables(snapshot.tables) }),
		db.meta.put({ key: REMOTE_TIME_KEY, value: meta?.modifiedTime ?? now }),
	])
}

export async function disconnectDriveSync(): Promise<void> {
	await disconnectDrive().catch(() => undefined)
	await Promise.all([
		db.meta.delete(FILE_ID_KEY),
		db.meta.delete(LAST_SYNC_KEY),
		db.meta.delete(LAST_HASH_KEY),
		db.meta.delete(REMOTE_TIME_KEY),
	])
}
