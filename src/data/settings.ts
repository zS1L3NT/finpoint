import { db } from "@/data/db"

export type FinpointSettings = {
	default_filter_start_date: string | null
	default_filter_end_date_today: boolean
	dashboard_comparison_months: number
}

export const DEFAULT_SETTINGS: FinpointSettings = {
	default_filter_start_date: null,
	default_filter_end_date_today: false,
	dashboard_comparison_months: 3,
}

const DEFAULT_FILTER_START_DATE_KEY = "default_filter_start_date"
const DEFAULT_FILTER_END_DATE_TODAY_KEY = "default_filter_end_date_today"
const DASHBOARD_COMPARISON_MONTHS_KEY = "dashboard_comparison_months"

export async function readSettings(): Promise<FinpointSettings> {
	const [startDate, endDateToday, comparisonMonths] = await Promise.all([
		db.settings.get(DEFAULT_FILTER_START_DATE_KEY),
		db.settings.get(DEFAULT_FILTER_END_DATE_TODAY_KEY),
		db.settings.get(DASHBOARD_COMPARISON_MONTHS_KEY),
	])
	const storedMonths = Number(comparisonMonths?.value)
	return {
		default_filter_start_date: startDate?.value ?? null,
		default_filter_end_date_today: endDateToday?.value === "true",
		dashboard_comparison_months:
			Number.isInteger(storedMonths) && storedMonths >= 1 && storedMonths <= 24
				? storedMonths
				: DEFAULT_SETTINGS.dashboard_comparison_months,
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
		if (settings.dashboard_comparison_months !== DEFAULT_SETTINGS.dashboard_comparison_months) {
			await db.settings.put({
				key: DASHBOARD_COMPARISON_MONTHS_KEY,
				value: String(settings.dashboard_comparison_months),
			})
		}
	})
}
