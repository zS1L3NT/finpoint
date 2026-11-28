// Record file bytes, stored once per content hash so copies and restores never duplicate them.

import { db } from "@/data/db"

export const SHA256_PATTERN = /^[0-9a-f]{64}$/

export async function sha256Hex(data: ArrayBuffer): Promise<string> {
	const digest = await crypto.subtle.digest("SHA-256", data)
	return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("")
}

export function toBase64(data: ArrayBuffer): string {
	const bytes = new Uint8Array(data)
	let binary = ""
	// Chunked: spreading a whole photo into fromCharCode overflows the call stack.
	for (let i = 0; i < bytes.length; i += 0x8000)
		binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
	return btoa(binary)
}

export function fromBase64(text: string): ArrayBuffer {
	const binary = atob(text)
	const bytes = new Uint8Array(binary.length)
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
	return bytes.buffer
}

/** Content hashes some Record file points at that this browser has no bytes for. */
export async function missingFileHashes(rows: { sha256: string }[]): Promise<string[]> {
	const hashes = [...new Set(rows.map(r => r.sha256))]
	const present = await db.file_blobs.where("sha256").anyOf(hashes).primaryKeys()
	return hashes.filter(hash => !present.includes(hash))
}

/** Drops bytes no Record file points at any more. Call inside a transaction over both tables. */
export async function pruneFileBlobs(): Promise<void> {
	const used = new Set(await db.record_files.orderBy("sha256").uniqueKeys())
	const stored = await db.file_blobs.toCollection().primaryKeys()
	await db.file_blobs.bulkDelete(stored.filter(hash => !used.has(hash)))
}
