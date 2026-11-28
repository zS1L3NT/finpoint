// Plaintext snapshot sync to the user's own Google Drive appDataFolder. Manual JSON
// backup/restore stays untouched.

import { db, type RecordFileRow } from "@/data/db"
import { exportData, importData, parseImportFile } from "@/data/export-import"
import {
	completeDriveRedirect,
	type DriveAction,
	disconnectDrive,
	downloadBackupFile,
	downloadRecordFile,
	ensureDriveToken,
	findBackupFile,
	getClockSkewMs,
	getFileMeta,
	isDriveConfigured,
	listRecordFileIds,
	uploadBackupFile,
	uploadRecordFile,
} from "@/data/google-drive"
import { SEED_HASH_KEY } from "@/data/seed"
import { hashSnapshot } from "@/data/snapshot-hash"
import { pullRecordFiles, pushRecordFiles, type RecordFileStore } from "@/logic/record-file-sync"
import { isRemoteNewer } from "@/logic/shared"

export {
	AuthRedirectError,
	type DriveAction,
	takeDriveRedirectCallback,
	wasVaultProven,
} from "@/data/google-drive"

const FILE_ID_KEY = "drive_file_id"
const LAST_SYNC_KEY = "drive_last_sync_at"
const LAST_HASH_KEY = "drive_last_hash"
const REMOTE_TIME_KEY = "drive_remote_time"
const LAST_CHECK_KEY = "drive_last_check_at"
const PAUSED_KEY = "drive_sync_paused"

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

export async function driveStatus(): Promise<DriveStatus> {
	const [fileId, lastSyncAt, remoteModifiedTime, lastCheckAt] = await Promise.all([
		metaGet(FILE_ID_KEY),
		metaGet(LAST_SYNC_KEY),
		metaGet(REMOTE_TIME_KEY),
		metaGet(LAST_CHECK_KEY),
	])
	return { configured: isDriveConfigured(), fileId, lastSyncAt, remoteModifiedTime, lastCheckAt }
}

/** Whether background sync is paused in this browser. Manual operations still run. */
export async function driveSyncPaused(): Promise<boolean> {
	return (await metaGet(PAUSED_KEY)) === "1"
}

export async function setDriveSyncPaused(paused: boolean): Promise<void> {
	if (paused) await db.meta.put({ key: PAUSED_KEY, value: "1" })
	else await db.meta.delete(PAUSED_KEY)
}

/** Stamp a completed Drive round trip (data moved or not). */
export async function markDriveChecked(): Promise<void> {
	await db.meta.put({ key: LAST_CHECK_KEY, value: new Date().toISOString() })
}

/** The hash local changes are measured from: the last sync, else the untouched starter rows. */
async function baselineHash(): Promise<string | null> {
	return (await metaGet(LAST_HASH_KEY)) ?? (await metaGet(SEED_HASH_KEY))
}

export async function driveLocalDirty(): Promise<boolean> {
	const snapshot = await exportData()
	const baseline = await baselineHash()
	if (!baseline) {
		return (
			snapshot.settings.default_filter_start_date != null ||
			snapshot.settings.default_filter_end_date_today ||
			Object.values(snapshot.tables).some(rows => Array.isArray(rows) && rows.length > 0)
		)
	}
	return (await hashSnapshot(snapshot)) !== baseline
}

export async function syncDrive(): Promise<DriveSyncResult> {
	if (!isDriveConfigured()) throw new Error("Google Drive is not set up yet (missing client ID).")

	const token = await ensureDriveToken("sync")
	const snapshot = await exportData()
	const localHash = await hashSnapshot(snapshot)

	const [storedFileId, lastSyncAt, baseline] = await Promise.all([
		metaGet(FILE_ID_KEY),
		metaGet(LAST_SYNC_KEY),
		baselineHash(),
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
		if (
			!total &&
			snapshot.settings.default_filter_start_date == null &&
			!snapshot.settings.default_filter_end_date_today
		) {
			return { outcome: "empty" }
		}
		await pushRecordFiles(
			driveFileStore(token),
			snapshot.tables.record_files as RecordFileRow[],
		)
		const uploaded = await uploadBackupFile(token, JSON.stringify(snapshot), null)
		const now = new Date().toISOString()
		await Promise.all([
			db.meta.put({ key: FILE_ID_KEY, value: uploaded.id }),
			db.meta.put({ key: LAST_SYNC_KEY, value: now }),
			db.meta.put({ key: LAST_HASH_KEY, value: localHash }),
		])
		return { outcome: "pushed" }
	}

	const localDirty = baseline ? localHash !== baseline : true
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

	const token = await ensureDriveToken("push")
	const snapshot = await exportData()
	const localHash = await hashSnapshot(snapshot)

	const storedFileId = await metaGet(FILE_ID_KEY)
	let fileId = storedFileId
	if (!fileId) fileId = (await findBackupFile(token))?.id ?? null
	await pushRecordFiles(driveFileStore(token), snapshot.tables.record_files as RecordFileRow[])
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

	const token = await ensureDriveToken("pull")
	const storedFileId = await metaGet(FILE_ID_KEY)
	const fileId = storedFileId ?? (await findBackupFile(token))?.id
	if (!fileId) throw new Error("No backup found in Google Drive yet.")

	const remote = parseImportFile(await downloadBackupFile(token, fileId))
	await pullRecordFiles(driveFileStore(token), remote.tables.record_files as RecordFileRow[])
	// Hash what the restore stored, not a later read: an edit made while the rest of this
	// function runs must still differ from the baseline and be pushed.
	const localHash = await hashSnapshot(await importData(remote))
	const meta = await getFileMeta(token, fileId).catch(() => null)
	const now = new Date().toISOString()
	await Promise.all([
		db.meta.put({ key: FILE_ID_KEY, value: fileId }),
		db.meta.put({ key: LAST_SYNC_KEY, value: now }),
		db.meta.put({ key: LAST_HASH_KEY, value: localHash }),
		db.meta.put({ key: REMOTE_TIME_KEY, value: meta?.modifiedTime ?? now }),
	])
}

export async function resumeDriveRedirect(
	code: string,
	action: DriveAction,
): Promise<DriveSyncResult> {
	await completeDriveRedirect(code)
	if (action === "push") {
		await pushDrive()
		return { outcome: "pushed" }
	}
	if (action === "pull") {
		await pullDrive()
		return { outcome: "pulled" }
	}
	return syncDrive()
}

export async function disconnectDriveSync(): Promise<void> {
	await disconnectDrive()
	await Promise.all([
		db.meta.delete(FILE_ID_KEY),
		db.meta.delete(LAST_SYNC_KEY),
		db.meta.delete(LAST_HASH_KEY),
		db.meta.delete(REMOTE_TIME_KEY),
		db.meta.delete(PAUSED_KEY),
	])
}

function driveFileStore(token: string): RecordFileStore {
	return {
		list: () => listRecordFileIds(token),
		upload: (sha256, data, type) => uploadRecordFile(token, sha256, data, type),
		download: id => downloadRecordFile(token, id),
	}
}
