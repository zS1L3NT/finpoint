// JSON export / import (nusmods-style data management, backed by IndexedDB).
//
// Export: downloads one versioned JSON file containing every table.
// Import: replaces the whole database from such a file (validated first).
// Sessions persist automatically in IndexedDB — no manual save step.
// Record file bytes ride along as base64 in `files` for backup files only; Drive
// snapshots leave them out and sync them as separate Drive files.

import { DateTime } from "luxon"
import { db, withoutActionModes } from "@/data/db"
import { fromBase64, pruneFileBlobs, SHA256_PATTERN, sha256Hex, toBase64 } from "@/data/files"
import { migrateRecordChoices } from "@/data/record-choices"
import {
	DEFAULT_SETTINGS,
	type FinpointSettings,
	readSettings,
	replaceSettings,
} from "@/data/settings"

export const EXPORT_VERSION = 9

type TableName =
	| "statement_rules"
	| "accounts"
	| "statements"
	| "duplicate_dismissals"
	| "categories"
	| "records"
	| "allocations"
	| "record_files"
	| "budgets"
	| "budget_records"
	| "monthly_budgets"
	| "monthly_budget_defaults"
	| "monthly_budget_amounts"
	| "analytics_months"

export const TABLES: TableName[] = [
	"statement_rules",
	"accounts",
	"statements",
	"duplicate_dismissals",
	"categories",
	"records",
	"allocations",
	"record_files",
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
	/** Record file bytes as base64 by SHA-256; only in backup files. */
	files?: Record<string, string>
}

/** The workspace for a backup file: the snapshot plus every Record file's bytes. */
export async function exportBackup(): Promise<FinpointExport> {
	const data = await exportData()
	const blobs = await db.file_blobs.toArray()
	return {
		...data,
		files: Object.fromEntries(blobs.map(blob => [blob.sha256, toBase64(blob.data)])),
	}
}

export async function exportData(): Promise<FinpointExport> {
	const tables = {} as Record<TableName, unknown[]>
	for (const table of TABLES) {
		tables[table] = await db.table(table).toArray()
	}
	tables.monthly_budgets = (tables.monthly_budgets as Record<string, unknown>[]).map(
		monthlyBudgetFields,
	)
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
	const originalVersion = parsed?.version
	if (parsed && [1, 2, 3].includes(parsed.version ?? 0) && parsed.tables) {
		parsed.tables.duplicate_dismissals ??= []
		if (parsed.version === 3) parsed.version = 7
	}
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
		parsed.version = 7
	}
	if (parsed && parsed.tables && [1, 2, 3, 4].includes(originalVersion ?? 0)) {
		parsed.tables.statement_rules = []
		if (parsed.version === 4) parsed.version = 7
	}
	if (parsed?.version === 5 && Array.isArray(parsed.tables?.statement_rules)) {
		parsed.tables.statement_rules = parsed.tables.statement_rules.map(value => {
			const rule = value as { actions: Record<string, { value: unknown }> }
			return { ...rule, actions: withoutActionModes(rule.actions) }
		})
		parsed.version = 7
	}
	if (parsed?.version === 6) parsed.version = 7
	if (parsed?.version === 7) parsed.version = 8
	if (parsed?.version === 8 && parsed.tables) {
		parsed.tables.record_files = []
		parsed.version = 9
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
	// Keep only current Monthly Budget fields from backups and hand-edited files.
	parsed.tables.monthly_budgets = (
		parsed.tables.monthly_budgets as Record<string, unknown>[]
	).map(monthlyBudgetFields)
	const categoryIds = new Set((parsed.tables.categories as { id: string }[]).map(c => c.id))
	if ((originalVersion ?? 0) < 7)
		parsed.tables.records = (parsed.tables.records as Record<string, unknown>[]).map(row =>
			migrateRecordChoices(row, categoryIds.has(String(row.category_id))),
		)
	for (const row of parsed.tables.records as Record<string, unknown>[]) {
		const treatment = row.treatment_choice as Record<string, unknown> | undefined
		const budget = row.monthly_budget_choice as Record<string, unknown> | undefined
		const validTreatment =
			treatment &&
			((treatment.kind === "category" && Object.keys(treatment).length === 1) ||
				(treatment.kind === "explicit" &&
					Object.keys(treatment).length === 2 &&
					typeof treatment.value === "string" &&
					["automatic", "income", "spending", "saving_investment", "neutral"].includes(
						treatment.value,
					)))
		const validBudget =
			budget &&
			(((budget.kind === "category" || budget.kind === "unbudgeted") &&
				Object.keys(budget).length === 1) ||
				(budget.kind === "explicit" &&
					Object.keys(budget).length === 2 &&
					typeof budget.id === "string" &&
					budget.id.length > 0))
		if (
			!validTreatment ||
			!validBudget ||
			[
				"analytics_treatment",
				"analytics_treatment_source",
				"monthly_budget_id",
				"monthly_budget_source",
			].some(key => key in row)
		)
			throw new Error("This backup contains an invalid Record choice.")
	}
	for (const row of parsed.tables.record_files as Record<string, unknown>[]) {
		if (
			!["id", "record_id", "name", "type", "created_at"].every(
				key => typeof row[key] === "string",
			) ||
			typeof row.size !== "number" ||
			!SHA256_PATTERN.test(String(row.sha256))
		)
			throw new Error("This backup contains an invalid Record file.")
	}
	if (
		parsed.files != null &&
		(typeof parsed.files !== "object" ||
			Object.entries(parsed.files).some(
				([hash, data]) => !SHA256_PATTERN.test(hash) || typeof data !== "string",
			))
	)
		throw new Error("This backup contains an invalid Record file.")
	const startDate = parsed.settings?.default_filter_start_date
	if (startDate != null && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
		throw new Error("This backup contains an invalid default filter date.")
	}
	const endDateToday = parsed.settings?.default_filter_end_date_today
	if (endDateToday != null && typeof endDateToday !== "boolean") {
		throw new Error("This backup contains an invalid default end-date setting.")
	}
	const statementIds = new Set((parsed.tables.statements as { id?: unknown }[]).map(s => s.id))
	const dismissals = new Map<string, { statement_id: string; other_statement_id: string }>()
	for (const row of parsed.tables.duplicate_dismissals as Record<string, unknown>[]) {
		const { statement_id: a, other_statement_id: b } = row
		if (typeof a !== "string" || typeof b !== "string" || a === b) continue
		if (!statementIds.has(a) || !statementIds.has(b)) continue
		// Dismissals are keyed by the ordered pair, so restore that order for hand-edited backups.
		const [statement_id, other_statement_id] = a < b ? [a, b] : [b, a]
		dismissals.set(JSON.stringify([statement_id, other_statement_id]), {
			statement_id,
			other_statement_id,
		})
	}
	const broken = brokenReferences(parsed.tables)
	if (broken.length)
		throw new Error(
			`This backup refers to rows that are not in it: ${broken.slice(0, 3).join("; ")}${broken.length > 3 ? `; and ${broken.length - 3} more` : ""}. Nothing was changed.`,
		)
	return {
		...(parsed as Omit<FinpointExport, "settings">),
		tables: {
			...parsed.tables,
			categories: (parsed.tables.categories as Record<string, unknown>[]).map(category => ({
				...category,
				analytics_treatment: category.analytics_treatment ?? "automatic",
			})),
			duplicate_dismissals: [...dismissals.values()],
		},
		settings: {
			default_filter_start_date: startDate ?? DEFAULT_SETTINGS.default_filter_start_date,
			default_filter_end_date_today:
				endDateToday ?? DEFAULT_SETTINGS.default_filter_end_date_today,
		},
	}
}

/** Each stored id a row points at that no row in the backup has, as readable lines. */
function brokenReferences(tables: Record<TableName, unknown[]>): string[] {
	const rows = (table: TableName) => tables[table] as Record<string, unknown>[]
	const ids = (table: TableName) => new Set(rows(table).map(row => row.id))
	const accounts = ids("accounts")
	const statements = ids("statements")
	const categories = ids("categories")
	const records = ids("records")
	const budgets = ids("budgets")
	const monthlyBudgets = ids("monthly_budgets")
	const lines: string[] = []
	const check = (
		table: TableName,
		label: string,
		field: (row: Record<string, unknown>) => unknown,
		parents: Set<unknown>,
		parent: string,
	) => {
		const count = rows(table).filter(row => {
			const value = field(row)
			return value != null && !parents.has(value)
		}).length
		if (count) lines.push(`${count} ${label} with a missing ${parent}`)
	}
	check("statements", "Statements", r => r.account_id, accounts, "Account")
	check("records", "Records", r => r.category_id, categories, "Category")
	check(
		"records",
		"Records",
		r => (r.monthly_budget_choice as { id?: unknown } | undefined)?.id,
		monthlyBudgets,
		"Monthly Budget",
	)
	check("categories", "Categories", r => r.parent_category_id, categories, "parent Category")
	check(
		"categories",
		"Categories",
		r => r.default_monthly_budget_id,
		monthlyBudgets,
		"default Monthly Budget",
	)
	check("allocations", "allocations", r => r.statement_id, statements, "Statement")
	check("allocations", "allocations", r => r.record_id, records, "Record")
	check("record_files", "Record files", r => r.record_id, records, "Record")
	check("budget_records", "Budget links", r => r.budget_id, budgets, "Budget")
	check("budget_records", "Budget links", r => r.record_id, records, "Record")
	for (const table of ["monthly_budget_defaults", "monthly_budget_amounts"] as const)
		check(
			table,
			"Monthly Budget amounts",
			r => r.monthly_budget_id,
			monthlyBudgets,
			"Monthly Budget",
		)
	const action = (key: string) => (r: Record<string, unknown>) =>
		(r.actions as Record<string, { value?: unknown } | undefined> | undefined)?.[key]?.value
	check("statement_rules", "Statement Rules", action("category_id"), categories, "Category")
	check(
		"statement_rules",
		"Statement Rules",
		action("monthly_budget_id"),
		monthlyBudgets,
		"Monthly Budget",
	)
	return lines
}

/**
 * Replaces the whole database. Returns it as stored, read in the same transaction, so a
 * caller can fingerprint exactly what it wrote and nothing written after.
 */
export async function importData(data: FinpointExport): Promise<FinpointExport> {
	data = parseImportFile(JSON.stringify(data))
	const blobs = await Promise.all(
		Object.entries(data.files ?? {}).map(async ([sha256, text]) => {
			const bytes = fromBase64(text)
			if ((await sha256Hex(bytes)) !== sha256)
				throw new Error("This backup contains a damaged Record file. Nothing was changed.")
			return { sha256, data: bytes }
		}),
	)
	return db.transaction(
		"rw",
		[...TABLES.map(table => db.table(table)), db.file_blobs, db.settings, db.meta],
		async () => {
			for (const table of TABLES) {
				await db.table(table).clear()
				const rows = data.tables[table]
				if (rows.length) await db.table(table).bulkAdd(rows)
			}
			// Bytes already here (a Drive pull fetches them first) stay unless nothing uses them.
			await db.file_blobs.bulkPut(blobs)
			await pruneFileBlobs()
			await replaceSettings(data.settings)
			await db.meta.put({ key: "seeded_v1", value: "1" })
			await db.meta.put({ key: "seeded_v2", value: "1" })
			return exportData()
		},
	)
}

export async function clearAllData(): Promise<void> {
	await db.transaction(
		"rw",
		[...TABLES.map(table => db.table(table)), db.file_blobs, db.meta],
		async () => {
			for (const table of TABLES) {
				await db.table(table).clear()
			}
			await db.file_blobs.clear()
			await db.meta.delete("seeded_v1")
			await db.meta.delete("seeded_v2")
		},
	)
}

export async function tableCounts(): Promise<Record<TableName, number>> {
	const counts = {} as Record<TableName, number>
	for (const table of TABLES) {
		counts[table] = await db.table(table).count()
	}
	return counts
}

function monthlyBudgetFields({
	id,
	name,
	color,
	display_order,
	archived,
}: Record<string, unknown>) {
	return { id, name, color, display_order, archived }
}
