import {
	DRILL_MODES,
	type DrillMode,
	type FinpointSettings,
	readDrillMode,
	readSettings,
	replaceSettings,
	writeDrillMode,
} from "@/data/settings"
import { Validator } from "@/logic/validate"

export type { DrillMode }

export async function getDrillMode(): Promise<DrillMode> {
	return readDrillMode()
}

export async function setDrillMode(mode: DrillMode): Promise<void> {
	const v = new Validator()
	const valid = v.oneOf(
		mode,
		"drill_mode",
		DRILL_MODES,
		"Choose side peek, center peek or full page.",
	)
	v.throwIfInvalid()

	await writeDrillMode(valid as DrillMode)
}

export async function getSettings(): Promise<FinpointSettings> {
	return readSettings()
}

export async function updateSettings(settings: FinpointSettings): Promise<void> {
	const v = new Validator()
	const date = settings.default_filter_start_date
		? v.date(settings.default_filter_start_date, "default_filter_start_date")
		: null
	if (date) {
		const [year = 0, month = 0, day = 0] = date.split("-").map(Number)
		const parsed = new Date(Date.UTC(year, month - 1, day))
		if (
			parsed.getUTCFullYear() !== year ||
			parsed.getUTCMonth() !== month - 1 ||
			parsed.getUTCDate() !== day
		) {
			v.reject("default_filter_start_date", "Enter a valid date.")
		}
	}
	v.throwIfInvalid()

	await replaceSettings({
		default_filter_start_date: date,
		default_filter_end_date_today: settings.default_filter_end_date_today,
	})
}
