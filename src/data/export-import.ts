// JSON export / import (nusmods-style data management, backed by IndexedDB).
//
// Export: downloads one versioned JSON file containing every table.
// Import: replaces the whole database from such a file (validated first).
// Sessions persist automatically in IndexedDB — no manual save step.

import { DateTime } from "luxon"
import { db } from "@/data/db"
import {
	DEFAULT_SETTINGS,
	type FinpointSettings,
	readSettings,
	replaceSettings,
} from "@/data/settings"

export const EXPORT_VERSION = 3

type TableName =
	| "accounts"
	| "statements"
	| "categories"
	| "records"
	| "allocations"
	| "budgets"
	| "budget_records"
	| "monthly_budgets"
	| "monthly_budget_defaults"
	| "monthly_budget_amounts"
	| "analytics_months"

export const TABLES: TableName[] = [
	"accounts",
	"statements",
	"categories",
	"records",
	"allocations",
	"budgets",
	"budget_records",
	"monthly_budgets",
	"monthly_budget_defaults",
	"monthly_budget_amounts",
	"analytics_months",
]

export const SYNC_TABLES = [...TABLES, "settings"] as const

export type FinpointExport = {
	app: "finpoint"
	version: number
	exported_at: string
	settings: FinpointSettings
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
		settings: await readSettings(),
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
	if (parsed && (parsed.version === 1 || parsed.version === 2) && parsed.tables) {
		const legacy = parsed.tables as Record<string, unknown[]>
		for (const [old, current] of [
			["buckets", "monthly_budgets"],
			["bucket_defaults", "monthly_budget_defaults"],
			["bucket_targets", "monthly_budget_amounts"],
		] as const) {
			if (!Array.isArray(legacy[old])) throw new Error("This backup file looks incomplete.")
			legacy[current] = legacy[old].map(value => {
				const { bucket_id, ...row } = value as Record<string, unknown>
				return old === "buckets" ? row : { ...row, monthly_budget_id: bucket_id }
			})
			delete legacy[old]
		}
		if (Array.isArray(legacy.records))
			legacy.records = legacy.records.map(value => {
				const { bucket_id, bucket_source, ...row } = value as Record<string, unknown>
				return {
					...row,
					monthly_budget_id: bucket_id ?? null,
					monthly_budget_source: bucket_source ?? null,
				}
			})
		if (Array.isArray(legacy.categories))
			legacy.categories = legacy.categories.map(value => {
				const { default_bucket_id, ...row } = value as Record<string, unknown>
				return { ...row, default_monthly_budget_id: default_bucket_id ?? null }
			})
		parsed.version = EXPORT_VERSION
	}
	if (parsed?.app !== "finpoint" || typeof parsed !== "object" || !parsed.tables) {
		throw new Error("This file is not a Finpoint backup.")
	}
	if ((parsed.version ?? 0) > EXPORT_VERSION) {
		throw new Error("This backup was made by a newer Finpoint version.")
	}
	if (parsed.version !== EXPORT_VERSION) throw new Error("Unsupported backup version.")
	for (const table of TABLES) {
		if (!Array.isArray(parsed.tables?.[table])) {
			throw new Error("This backup file looks incomplete.")
		}
	}
	const startDate = parsed.settings?.default_filter_start_date
	if (startDate != null && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
		throw new Error("This backup contains an invalid default filter date.")
	}
	const endDateToday = parsed.settings?.default_filter_end_date_today
	if (endDateToday != null && typeof endDateToday !== "boolean") {
		throw new Error("This backup contains an invalid default end-date setting.")
	}
	return {
		...(parsed as Omit<FinpointExport, "settings">),
		settings: {
			default_filter_start_date: startDate ?? DEFAULT_SETTINGS.default_filter_start_date,
			default_filter_end_date_today:
				endDateToday ?? DEFAULT_SETTINGS.default_filter_end_date_today,
		},
	}
}

export async function importData(data: FinpointExport): Promise<void> {
	data = parseImportFile(JSON.stringify(data))
	await db.transaction(
		"rw",
		[...TABLES.map(table => db.table(table)), db.settings, db.meta],
		async () => {
			for (const table of TABLES) {
				await db.table(table).clear()
				const rows = data.tables[table]
				if (rows.length) await db.table(table).bulkAdd(rows)
			}
			await replaceSettings(data.settings)
			await db.meta.put({ key: "seeded_v1", value: "1" })
			await db.meta.put({ key: "seeded_v2", value: "1" })
		},
	)
}

export async function clearAllData(): Promise<void> {
	await db.transaction("rw", [...TABLES.map(table => db.table(table)), db.meta], async () => {
		for (const table of TABLES) {
			await db.table(table).clear()
		}
		await db.meta.delete("seeded_v1")
		await db.meta.delete("seeded_v2")
	})
}

export async function tableCounts(): Promise<Record<TableName, number>> {
	const counts = {} as Record<TableName, number>
	for (const table of TABLES) {
		counts[table] = await db.table(table).count()
	}
	return counts
}
