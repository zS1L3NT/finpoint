type Snapshot = {
	settings: { default_filter_start_date: string | null; default_filter_end_date_today: boolean }
	tables: Record<string, unknown[]>
}

export async function hashSnapshot(snapshot: Snapshot): Promise<string> {
	// Sort rows so the hash survives an export -> import -> export round trip
	// (IndexedDB returns rows in key order, not insertion order).
	const normalized: Record<string, unknown[]> = {}
	const synced =
		snapshot.settings.default_filter_start_date ||
		snapshot.settings.default_filter_end_date_today
			? { ...snapshot.tables, __settings__: [snapshot.settings] }
			: snapshot.tables
	for (const [key, rows] of Object.entries(synced).sort(([a], [b]) => a.localeCompare(b))) {
		normalized[key] = rows
			.map(row =>
				Object.fromEntries(
					Object.entries(row as Record<string, unknown>).sort(([a], [b]) =>
						a.localeCompare(b),
					),
				),
			)
			.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
	}
	return digestSnapshot(normalized)
}

/** Preserve main's table/property ordering when checking the pre-upgrade baseline. */
export async function hashLegacySnapshot(snapshot: Snapshot): Promise<string> {
	const normalized: Record<string, unknown[]> = {}
	const synced =
		snapshot.settings.default_filter_start_date ||
		snapshot.settings.default_filter_end_date_today
			? { ...snapshot.tables, __settings__: [snapshot.settings] }
			: snapshot.tables
	for (const [key, rows] of Object.entries(synced)) {
		normalized[key] = [...rows].sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1))
	}
	return digestSnapshot(normalized)
}

async function digestSnapshot(normalized: Record<string, unknown[]>): Promise<string> {
	const bytes = new TextEncoder().encode(JSON.stringify(normalized))
	const digest = await crypto.subtle.digest("SHA-256", bytes)
	return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("")
}
