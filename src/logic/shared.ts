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
