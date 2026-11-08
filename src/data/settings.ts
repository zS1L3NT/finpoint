import { db } from "@/data/db"

export type FinpointSettings = {
	default_filter_start_date: string | null
	default_filter_end_date_today: boolean
}

export const DEFAULT_SETTINGS: FinpointSettings = {
	default_filter_start_date: null,
	default_filter_end_date_today: false,
}

/** How a drill-down opens: a side sheet, a centred dialog, or its own page. */
export const DRILL_MODES = ["side", "center", "full"] as const
export type DrillMode = (typeof DRILL_MODES)[number]

const DRILL_MODE_KEY = "drill_mode"
const DEFAULT_FILTER_START_DATE_KEY = "default_filter_start_date"
const DEFAULT_FILTER_END_DATE_TODAY_KEY = "default_filter_end_date_today"

export async function readSettings(): Promise<FinpointSettings> {
	const [startDate, endDateToday] = await Promise.all([
		db.settings.get(DEFAULT_FILTER_START_DATE_KEY),
		db.settings.get(DEFAULT_FILTER_END_DATE_TODAY_KEY),
	])
	return {
		default_filter_start_date: startDate?.value ?? null,
		default_filter_end_date_today: endDateToday?.value === "true",
	}
}

export async function readDrillMode(): Promise<DrillMode> {
	const row = await db.settings.get(DRILL_MODE_KEY)
	return DRILL_MODES.find(mode => mode === row?.value) ?? "side"
}

export async function writeDrillMode(mode: DrillMode): Promise<void> {
	await db.settings.put({ key: DRILL_MODE_KEY, value: mode })
}

export async function replaceSettings(settings: FinpointSettings): Promise<void> {
	await db.transaction("rw", db.settings, async () => {
		// Only the filter defaults are replaced: interface preferences such as the drill mode
		// live in the same table and are not part of the synced settings.
		await db.settings.bulkDelete([
			DEFAULT_FILTER_START_DATE_KEY,
			DEFAULT_FILTER_END_DATE_TODAY_KEY,
		])
		if (settings.default_filter_start_date) {
			await db.settings.put({
				key: DEFAULT_FILTER_START_DATE_KEY,
				value: settings.default_filter_start_date,
			})
		}
		if (settings.default_filter_end_date_today) {
			await db.settings.put({
				key: DEFAULT_FILTER_END_DATE_TODAY_KEY,
				value: "true",
			})
		}
	})
}
