// Shared helpers for the logic layer (domain operations).
// Mirrors small Laravel conveniences (Str::slug, validation errors, cents math).

export class ValidationError extends Error {
	errors: Record<string, string[]>

	constructor(errors: Record<string, string[] | string>) {
		super(Object.values(errors).flat().join(" "))
		this.name = "ValidationError"
		this.errors = Object.fromEntries(
			Object.entries(errors).map(([key, value]) => [
				key,
				Array.isArray(value) ? value : [value],
			]),
		)
	}
}

export function slug(value: string): string {
	const out = value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
	if (!out) throw new ValidationError({ name: ["The name must contain letters or numbers."] })
	return out
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

export function requireNonZeroAmount(amount: number): void {
	if (round2(amount) === 0) {
		throw new ValidationError({ amount: ["Amount must not be zero."] })
	}
}

export function isValidDatetimeInput(value: string): boolean {
	return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
}

/** "yyyy-MM-ddTHH:mm" (form input) -> "yyyy-MM-dd HH:mm" (stored). */
export function inputToStored(input: string): string {
	return input.replace("T", " ")
}

/** "yyyy-MM-dd HH:mm" (stored) -> "yyyy-MM-ddTHH:mm" (form input). */
export function storedToInput(stored: string): string {
	return stored.replace(" ", "T").slice(0, 16)
}

export function todayDate(): string {
	const now = new Date()
	const pad = (n: number) => String(n).padStart(2, "0")
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}
