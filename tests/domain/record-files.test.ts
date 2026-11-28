import { afterAll, beforeEach, expect, test } from "bun:test"
import Dexie from "dexie"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
const { db } = await import("@/data/db")
const { clearAllData, exportBackup, exportData, importData, parseImportFile } = await import(
	"@/data/export-import"
)
const { attachRecordFiles, deleteRecordFile, getRecordFileBlob, listRecordFiles } = await import(
	"@/logic/record-files"
)
const { deleteRecord } = await import("@/logic/records")
const { pullDrive, pushDrive } = await import("@/logic/drive-sync")

const realFetch = globalThis.fetch
const realClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "test-client"
Object.defineProperty(globalThis, "navigator", { value: { onLine: true }, configurable: true })

afterAll(() => {
	globalThis.fetch = realFetch
	process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = realClientId
})

const receipt = (name = "receipt.pdf", text = "%PDF receipt") =>
	new File([text], name, { type: "application/pdf" })

beforeEach(async () => {
	for (const table of db.tables) await table.clear()
	await db.categories.add({
		id: "c",
		name: "c",
		icon: "x",
		color: "#000000",
		parent_category_id: null,
		analytics_treatment: "automatic",
		default_monthly_budget_id: null,
	})
	for (const id of ["r", "other"])
		await db.records.add({
			id,
			title: "Coffee",
			amount: -10,
			datetime: "2026-10-03 12:00",
			category_id: "c",
			people: null,
			location: null,
			description: null,
			treatment_choice: { kind: "category" },
			monthly_budget_choice: { kind: "category" },
			revision: 0,
		})
})

test("an attached file lists with its bytes available", async () => {
	await attachRecordFiles("r", [receipt()])

	const [file] = await listRecordFiles("r")
	expect(file).toMatchObject({ name: "receipt.pdf", type: "application/pdf", available: true })
	expect(await (await getRecordFileBlob(file as never))?.text()).toBe("%PDF receipt")
})

test("only images and PDFs are accepted", async () => {
	const text = new File(["x"], "notes.txt", { type: "text/plain" })
	await expect(attachRecordFiles("r", [text])).rejects.toThrow("notes.txt is not an image or PDF.")
	expect(await db.file_blobs.count()).toBe(0)
})

test("identical bytes are stored once and kept while any Record uses them", async () => {
	const [first] = await attachRecordFiles("r", [receipt()])
	await attachRecordFiles("other", [receipt("copy.pdf")])
	expect(await db.file_blobs.count()).toBe(1)

	await deleteRecordFile(first?.id as string)
	expect(await db.file_blobs.count()).toBe(1)

	await deleteRecord("other")
	expect(await db.record_files.count()).toBe(0)
	expect(await db.file_blobs.count()).toBe(0)
})

test("a backup file carries the bytes and restores them", async () => {
	await attachRecordFiles("r", [receipt()])
	const backup = JSON.stringify(await exportBackup())
	await clearAllData()

	await importData(parseImportFile(backup))

	const [file] = await listRecordFiles("r")
	expect(file?.available).toBe(true)
	expect(await (await getRecordFileBlob(file as never))?.text()).toBe("%PDF receipt")
})

test("a backup with damaged bytes changes nothing", async () => {
	await attachRecordFiles("r", [receipt()])
	const backup = await exportBackup()
	const [hash] = Object.keys(backup.files ?? {})
	backup.files = { [hash as string]: btoa("tampered") }
	await db.records.delete("other")

	await expect(importData(backup)).rejects.toThrow("damaged Record file")
	expect(await db.records.count()).toBe(1)
})

test("a backup whose file points at a missing Record is rejected", async () => {
	await attachRecordFiles("r", [receipt()])
	const backup = await exportData()
	backup.tables.records = (backup.tables.records as { id: string }[]).filter(r => r.id !== "r")

	expect(() => parseImportFile(JSON.stringify(backup))).toThrow(
		"1 Record files with a missing Record",
	)
})

test("a version 8 backup restores with no files", async () => {
	const backup = await exportData()
	const { record_files: _, ...tables } = backup.tables
	const parsed = parseImportFile(JSON.stringify({ ...backup, version: 8, tables }))

	expect(parsed.version).toBe(9)
	expect(parsed.tables.record_files).toEqual([])
})

test("the Drive snapshot leaves bytes out and Drive stores each file once", async () => {
	await attachRecordFiles("r", [receipt()])
	const stored = new Map<string, Blob>()
	let snapshot = ""
	globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const url = String(input)
		const json = (body: unknown) => new Response(JSON.stringify(body))
		if (url.endsWith("/api/auth/token")) return json({ access_token: "t", expires_in: 3600 })
		if (url.includes("name%20contains"))
			return json({ files: [...stored.keys()].map(name => ({ id: name, name })) })
		if (url.includes("uploadType=multipart") && init?.body instanceof Blob) {
			const name = /"name":"([^"]+)"/.exec(await init.body.text())?.[1] as string
			stored.set(name, init.body)
			return json({ id: name })
		}
		if (url.includes("uploadType")) {
			snapshot = String(init?.body)
			return json({ id: "snapshot" })
		}
		return json({ id: "snapshot", modifiedTime: "2026-01-01T00:00:00Z" })
	}) as typeof fetch

	await pushDrive()
	await pushDrive()

	expect(stored.size).toBe(1)
	expect(snapshot).not.toContain("%PDF")
	expect(JSON.parse(snapshot).files).toBeUndefined()
})

test("a Drive pull fetches the bytes this browser lacks", async () => {
	const [file] = await attachRecordFiles("r", [receipt()])
	const snapshot = JSON.stringify(await exportData())
	await db.file_blobs.clear()
	globalThis.fetch = (async (input: RequestInfo | URL) => {
		const url = String(input)
		const json = (body: unknown) => new Response(JSON.stringify(body))
		if (url.endsWith("/api/auth/token")) return json({ access_token: "t", expires_in: 3600 })
		if (url.includes("name%20contains"))
			return json({ files: [{ id: "bytes", name: `finpoint-file-${file?.sha256}` }] })
		if (url.includes("/files/bytes?alt=media")) return new Response("%PDF receipt")
		if (url.includes("alt=media")) return new Response(snapshot)
		return json({ id: "snapshot", modifiedTime: "2026-01-01T00:00:00Z" })
	}) as typeof fetch
	await db.meta.put({ key: "drive_file_id", value: "snapshot" })

	await pullDrive()

	expect((await listRecordFiles("r"))[0]?.available).toBe(true)
})
