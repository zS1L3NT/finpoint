import { useLiveQuery } from "dexie-react-hooks"
import { getSettings } from "@/logic/settings"

export function useSettings() {
	return useLiveQuery(() => getSettings(), [])
}

export function useDefaultFilterStartDate(): string | null {
	return useSettings()?.default_filter_start_date ?? null
}

export function useDefaultFilterEndDateToday(): boolean {
	return useSettings()?.default_filter_end_date_today ?? false
}
