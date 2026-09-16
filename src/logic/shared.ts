// Shared pure helpers for the logic layer: ids, money math, datetime shapes.
// Validation lives in `@/logic/validate` — import ValidationError from there.

export function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
}

export function round2(value: number): number {
	return Math.round(value * 100) / 100
}

/** Exact decimal math via integer cents (mirrors PHP cents() helpers). */
export function toCents(value: number | string): number {
	const raw = String(value).trim()
	const negative = raw.startsWith("-")
	const unsigned = raw.replace(/^[-+]/, "")
	const [whole = "0", decimal = ""] = unsigned.split(".")
	return (
		(negative ? -1 : 1) *
		(parseInt(whole || "0", 10) * 100 + parseInt((decimal + "00").slice(0, 2), 10))
	)
}

export function fromCents(cents: number): number {
	return cents / 100
}

export function newId(): string {
	return crypto.randomUUID()
}

/** "yyyy-MM-ddTHH:mm" (form input) -> "yyyy-MM-dd HH:mm" (stored). */
export function inputToStored(input: string): string {
	return input.replace("T", " ")
}

/** True when the Drive copy postdates the last sync. skewMs corrects a wrong
 * device clock using server-observed time (see getClockSkewMs): positive when
 * this device runs ahead. */
export function isRemoteNewer(
	remoteModifiedTime: string,
	lastSyncAt: string | null,
	skewMs = 0,
): boolean {
	if (!lastSyncAt) return true
	return new Date(remoteModifiedTime).getTime() > new Date(lastSyncAt).getTime() - skewMs
}

/** ISO timestamp -> "just now", "5 min ago", … (locale-aware). */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
	const seconds = Math.round((new Date(iso).getTime() - now) / 1000)
	const abs = Math.abs(seconds)
	if (abs < 45) return "just now"
	const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })
	if (abs < 3600) return relative.format(Math.trunc(seconds / 60), "minute")
	if (abs < 86400) return relative.format(Math.trunc(seconds / 3600), "hour")
	return relative.format(Math.trunc(seconds / 86400), "day")
}
