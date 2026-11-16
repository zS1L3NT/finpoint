import { ValidationError } from "@/logic/validate"

/** The reason the logic layer gave for refusing a delete, or the dialog's own fallback. */
export const deleteFailureMessage = (cause: unknown, fallback: string) =>
	cause instanceof ValidationError ? (Object.values(cause.errors)[0]?.[0] ?? fallback) : fallback
