// Whole-workspace operations behind the Data page: backup, restore, reset, demo data.

import { db } from "@/data/db"
import {
	clearAllData,
	downloadExport,
	exportData,
	importData,
	parseImportFile,
	tableCounts,
} from "@/data/export-import"
import { seedIfEmpty } from "@/data/seed"
import { generateTestData } from "@/data/test-data"

export async function countWorkspaceRows() {
	// Re-run whenever any table changes by depending on a cheap aggregate.
	await db.statements.toCollection().count()
	return tableCounts()
}

/** False until the user has accounts, Statements, or Records: the Overview then offers demo data. */
export async function hasWorkspaceActivity() {
	const counts = await Promise.all([
		db.accounts.count(),
		db.statements.count(),
		db.records.count(),
	])
	return counts.some(Boolean)
}

export async function exportWorkspace() {
	downloadExport(await exportData())
}

export async function importWorkspace(text: string) {
	await importData(parseImportFile(text))
}

export async function clearWorkspace() {
	await clearAllData()
	await seedIfEmpty()
}

export async function loadDemoWorkspace() {
	await importData(generateTestData())
}
