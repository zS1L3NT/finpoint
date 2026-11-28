// Files kept with a Record (receipts, invoices, tickets). Metadata syncs like any other row;
// the bytes are stored once per SHA-256 in `file_blobs` and travel separately.

import { db, type RecordFileRow } from "@/data/db"
import { missingFileHashes, pruneFileBlobs, sha256Hex } from "@/data/files"
import { shrinkImage } from "@/lib/images"
import { newId } from "@/logic/shared"
import { ValidationError } from "@/logic/validate"

const MAX_FILE_BYTES = 15 * 1024 * 1024
const FILE_TYPE_PATTERN = /^(image\/.+|application\/pdf)$/

export type RecordFile = RecordFileRow & {
	/** False when the bytes have not reached this browser yet (Drive sync still pending). */
	available: boolean
}

export async function listRecordFiles(recordId: string): Promise<RecordFile[]> {
	const rows = await db.record_files.where("record_id").equals(recordId).sortBy("created_at")
	const missing = new Set(await missingFileHashes(rows))

	return rows.map(row => ({ ...row, available: !missing.has(row.sha256) }))
}

/** The file's bytes, or null when this browser has none. */
export async function getRecordFileBlob(file: Pick<RecordFileRow, "sha256" | "type">) {
	const blob = await db.file_blobs.get(file.sha256)

	return blob ? new Blob([blob.data], { type: file.type }) : null
}

export async function attachRecordFiles(recordId: string, files: File[]) {
	const rejected = files.find(file => !FILE_TYPE_PATTERN.test(file.type))
	if (rejected) throw new ValidationError({ files: `${rejected.name} is not an image or PDF.` })
	const prepared = await Promise.all(
		files.map(async file => {
			const blob = await shrinkImage(file)
			const data = await blob.arrayBuffer()
			if (data.byteLength > MAX_FILE_BYTES)
				throw new ValidationError({ files: `${file.name} is larger than 15 MB.` })
			return {
				// A re-encoded photo keeps its name with the extension of what is stored.
				name: blob === file ? file.name : `${file.name.replace(/\.[^.]+$/, "")}.webp`,
				type: blob.type,
				data,
				sha256: await sha256Hex(data),
			}
		}),
	)

	return db.transaction("rw", [db.records, db.record_files, db.file_blobs], async () => {
		if (!(await db.records.get(recordId))) throw new Error("Record not found.")
		const created_at = new Date().toISOString()
		await db.file_blobs.bulkPut(prepared.map(({ sha256, data }) => ({ sha256, data })))
		const rows = prepared.map(({ name, type, data, sha256 }) => ({
			id: newId(),
			record_id: recordId,
			name,
			type,
			size: data.byteLength,
			sha256,
			created_at,
		}))
		await db.record_files.bulkAdd(rows)

		return rows
	})
}

export async function deleteRecordFile(id: string) {
	await db.transaction("rw", [db.record_files, db.file_blobs], async () => {
		await db.record_files.delete(id)
		await pruneFileBlobs()
	})
}
