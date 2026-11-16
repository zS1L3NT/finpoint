// Parses list filters out of URL search params. Each list owns one parser beside its filter
// type; these helpers keep the encodings (`"true"`/`"false"`, comma-joined ids, numbers) in one place.

/** URLSearchParams, or any map of the same params. */
export type ParamSource = { get(name: string): string | null | undefined }

/** `"true"` is true, `"false"` is false, anything else is no filter. */
export function flagParam(value: string | null | undefined): boolean | undefined {
	return value === "true" ? true : value === "false" ? false : undefined
}

/** As `flagParam`, also reading `"1"` as true and `"0"` as false. */
export function looseFlagParam(value: string | null | undefined): boolean | undefined {
	return value === "true" || value === "1"
		? true
		: value === "false" || value === "0"
			? false
			: undefined
}

/** A comma-joined id list; absent when nothing is named. */
export function listParam(value: string | null | undefined): string[] | undefined {
	const ids = (value ?? "").split(",").filter(Boolean)
	return ids.length ? ids : undefined
}

/** A finite number; absent when empty or not numeric. */
export function numberParam(value: string | null | undefined): number | undefined {
	if (!value) return undefined
	const number = Number(value)
	return Number.isFinite(number) ? number : undefined
}

/** Text; absent when empty. */
export function textParam(value: string | null | undefined): string | undefined {
	return value || undefined
}
