// Moves Record file bytes between this browser and a remote file store, keyed by SHA-256.
// The user's Google Drive is the only store today; a Finpoint-hosted store for an
// advanced tier would implement the same three calls.

import { db, type RecordFileRow } from "@/data/db"
import { missingFileHashes, sha256Hex } from "@/data/files"

export type RecordFileStore = {
	/** Remote ids of the stored bytes, by SHA-256. */
	list: () => Promise<Map<string, string>>
	upload: (sha256: string, data: ArrayBuffer, type: string) => Promise<void>
	download: (id: string) => Promise<ArrayBuffer>
}

/** Uploads the bytes the store lacks. Run before uploading any snapshot that points at them. */
export async function pushRecordFiles(store: RecordFileStore, rows: RecordFileRow[]) {
	if (!rows.length) return
	const remote = await store.list()
	for (const row of rows) {
		if (remote.has(row.sha256)) continue
		const blob = await db.file_blobs.get(row.sha256)
		if (!blob) continue
		await store.upload(row.sha256, blob.data, row.type)
		remote.set(row.sha256, "")
	}
}

/** Fetches the bytes these rows need and this browser lacks. Run before restoring them. */
export async function pullRecordFiles(store: RecordFileStore, rows: RecordFileRow[]) {
	const missing = await missingFileHashes(rows)
	if (!missing.length) return
	const remote = await store.list()
	for (const hash of missing) {
		const id = remote.get(hash)
		if (!id) continue
		const data = await store.download(id)
		// A damaged download is skipped; the Record shows the file as missing on this device.
		if ((await sha256Hex(data)) === hash) await db.file_blobs.put({ sha256: hash, data })
	}
}
