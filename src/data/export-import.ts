// JSON export / import (nusmods-style data management, backed by IndexedDB).
//
// Export: downloads one versioned JSON file containing every table.
// Import: replaces the whole database from such a file (validated first).
// Sessions persist automatically in IndexedDB — no manual save step.

import { DateTime } from "luxon"
import { db } from "@/data/db"

export const EXPORT_VERSION = 1

type TableName =
	| "accounts"
	| "statements"
	| "categories"
	| "records"
	| "allocations"
	| "budgets"
	| "budget_records"
	| "buckets"
	| "bucket_defaults"
	| "bucket_targets"
	| "analytics_months"

export const TABLES: TableName[] = [
	"accounts",
	"statements",
	"categories",
	"records",
	"allocations",
	"budgets",
	"budget_records",
	"buckets",
	"bucket_defaults",
	"bucket_targets",
	"analytics_months",
]

export type FinpointExport = {
	app: "finpoint"
	version: number
	exported_at: string
	tables: Record<TableName, unknown[]>
}

export async function exportData(): Promise<FinpointExport> {
	const tables = {} as Record<TableName, unknown[]>
	for (const table of TABLES) {
		tables[table] = await db.table(table).toArray()
	}
	return {
		app: "finpoint",
		version: EXPORT_VERSION,
		exported_at: new Date().toISOString(),
		tables,
	}
}

export function downloadExport(data: FinpointExport): void {
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
	const url = URL.createObjectURL(blob)
	const anchor = document.createElement("a")
	anchor.href = url
	anchor.download = `finpoint-backup-${DateTime.now().setZone("Asia/Singapore").toFormat("yyyyLLdd-HHmmss")}.json`
	document.body.appendChild(anchor)
	anchor.click()
	anchor.remove()
	URL.revokeObjectURL(url)
}

export function parseImportFile(text: string): FinpointExport {
	const parsed = JSON.parse(text) as Partial<FinpointExport>
	if (parsed?.app !== "finpoint" || typeof parsed !== "object" || !parsed.tables) {
		throw new Error("This file is not a Finpoint backup.")
	}
	if ((parsed.version ?? 0) > EXPORT_VERSION) {
		throw new Error("This backup was made by a newer Finpoint version.")
	}
	for (const table of TABLES) {
		if (!Array.isArray(parsed.tables?.[table])) {
			throw new Error("This backup file looks incomplete.")
		}
	}
	return parsed as FinpointExport
}

export async function importData(data: FinpointExport): Promise<void> {
	await db.transaction("rw", [...TABLES.map(table => db.table(table)), db.meta], async () => {
		for (const table of TABLES) {
			await db.table(table).clear()
			const rows = data.tables[table]
			if (rows.length) await db.table(table).bulkAdd(rows)
		}
		await db.meta.put({ key: "seeded_v1", value: "1" })
	})
}

export async function clearAllData(): Promise<void> {
	await db.transaction("rw", [...TABLES.map(table => db.table(table))], async () => {
		for (const table of TABLES) {
			await db.table(table).clear()
		}
	})
}

export async function tableCounts(): Promise<Record<TableName, number>> {
	const counts = {} as Record<TableName, number>
	for (const table of TABLES) {
		counts[table] = await db.table(table).count()
	}
	return counts
}
