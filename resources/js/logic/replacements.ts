// Port of `App\Support\StatementReplacement` (PHP -> TypeScript, same rules).

import { fromCents, toCents } from "@/logic/shared"

export type ReplacementStatement = {
	id: string
	account_id: string
	amount: number
	datetime: string
	is_pending: boolean
}

export type ReplacementAllocation = { amount: number }

export function replacementReason(
	statement: ReplacementStatement,
	pendingStatement: ReplacementStatement,
	pendingAllocations: ReplacementAllocation[],
	statementAllocations: ReplacementAllocation[] = [],
): string | null {
	if (statement.is_pending) return "Choose an imported statement as the replacement."
	if (!pendingStatement.is_pending) return "Choose a pending statement to replace."
	if (statement.account_id !== pendingStatement.account_id) {
		return "The imported and pending statements must belong to the same account."
	}
	if (statementAllocations.length > 0) {
		return "The imported statement must be fully unallocated."
	}
	if (pendingAllocations.length === 0) return null

	const amount = toCents(statement.amount)
	const allocations = pendingAllocations.map(a => toCents(a.amount))
	const wrongSign = amount > 0 ? allocations.some(a => a <= 0) : allocations.some(a => a >= 0)
	if (wrongSign) {
		return "The pending allocations and imported statement must have the same direction."
	}

	const allocated = allocations.reduce((sum, a) => sum + a, 0)
	if ((amount > 0 && allocated > amount) || (amount < 0 && allocated < amount)) {
		return "The imported statement does not have enough capacity for the pending allocations."
	}
	return null
}

export function ensureCanReplace(
	statement: ReplacementStatement,
	pendingStatement: ReplacementStatement,
	pendingAllocations: ReplacementAllocation[],
	statementAllocations: ReplacementAllocation[] = [],
): void {
	const reason = replacementReason(
		statement,
		pendingStatement,
		pendingAllocations,
		statementAllocations,
	)
	if (reason) throw new Error(reason)
}

export function dayDifference(a: string, b: string): number {
	const startOfDay = (value: string) => {
		const [date] = value.split(" ")
		const [y, m, d] = date.split("-").map(Number)
		return Date.UTC(y, m - 1, d)
	}
	return Math.round((startOfDay(a) - startOfDay(b)) / 86400000)
}

export function replacementComparison(
	statement: ReplacementStatement,
	pendingStatement: ReplacementStatement,
	allocations: ReplacementAllocation[],
) {
	const statementAmount = toCents(statement.amount)
	const pendingAmount = toCents(pendingStatement.amount)
	const allocated = allocations.reduce((sum, a) => sum + toCents(a.amount), 0)
	return {
		amount_difference: Math.abs(statementAmount - pendingAmount) / 100,
		day_difference: dayDifference(statement.datetime, pendingStatement.datetime),
		is_exact_amount: statementAmount === pendingAmount,
		allocated_amount: allocated / 100,
		remaining_allocable_amount: (statementAmount - allocated) / 100,
	}
}

export function sameDirection(a: ReplacementStatement, b: ReplacementStatement): boolean {
	return toCents(a.amount) > 0 === toCents(b.amount) > 0
}

export function maskDescription(description: string): string {
	return description.replace(/\b\d{4}-\d{4}-\d{4}-(\d{4})\b/, "XXXX-XXXX-XXXX-$1")
}

export { fromCents }
