// Single validation surface for the logic layer.
//
// Every domain module validates with Validator and throws ValidationError.
// UI catches it and feeds setApiErrors, so error shapes stay
// Laravel-compatible ({ field: string[] }).

import { round2, slugify } from "@/logic/shared"

export type FieldErrors = Record<string, string[]>

export class ValidationError extends Error {
	errors: FieldErrors

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

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

export class Validator {
	errors: FieldErrors = {}

	reject(field: string, message: string): void {
		const list = this.errors[field]
		if (list) list.push(message)
		else this.errors[field] = [message]
	}

	/** Required trimmed text; "" when missing. */
	text(value: unknown, field: string, message?: string): string {
		const out = typeof value === "string" ? value.trim() : ""
		if (!out) this.reject(field, message ?? `The ${field} field is required.`)
		return out
	}

	nullableText(value: unknown): string | null {
		const out = typeof value === "string" ? value.trim() : ""
		return out || null
	}

	/** Finite number rounded to 2dp; 0 when invalid. */
	amount(value: unknown, field: string, message = "Enter a valid amount."): number {
		const out = Number(value)
		if (!Number.isFinite(out)) {
			this.reject(field, message)
			return 0
		}
		return round2(out)
	}

	/** "yyyy-MM-dd"; "" when invalid. */
	date(value: unknown, field: string, message = "Enter a valid date."): string {
		const out = typeof value === "string" ? value : ""
		if (!DATE_PATTERN.test(out)) {
			this.reject(field, message)
			return ""
		}
		return out
	}

	/** "yyyy-MM-ddTHH:mm"; "" when invalid. */
	datetime(value: unknown, field: string, message = "Enter a valid date and time."): string {
		const out = typeof value === "string" ? value : ""
		if (!DATETIME_PATTERN.test(out)) {
			this.reject(field, message)
			return ""
		}
		return out
	}

	/** Membership in a fixed set; null when invalid. */
	oneOf<T extends string>(
		value: unknown,
		field: string,
		allowed: readonly T[],
		message = "Invalid value.",
	): T | null {
		if (typeof value === "string" && (allowed as readonly string[]).includes(value)) {
			return value as T
		}
		this.reject(field, message)
		return null
	}

	/** URL-style slug; "" when the name has no letters or numbers. */
	slug(value: unknown, field = "name"): string {
		const out = slugify(String(value ?? ""))
		if (!out) this.reject(field, "The name must contain letters or numbers.")
		return out
	}

	throwIfInvalid(): void {
		if (Object.keys(this.errors).length) throw new ValidationError(this.errors)
	}
}
