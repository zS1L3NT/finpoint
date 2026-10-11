import { db } from "@/data/db"

export type FinpointSettings = {
	default_filter_start_date: string | null
	default_filter_end_date_today: boolean
}

export const DEFAULT_SETTINGS: FinpointSettings = {
	default_filter_start_date: null,
	default_filter_end_date_today: false,
}

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

export async function replaceSettings(settings: FinpointSettings): Promise<void> {
	await db.transaction("rw", db.settings, async () => {
		await db.settings.clear()
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
