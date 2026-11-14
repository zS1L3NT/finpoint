// The enriched Statement shape shared by the Statement list and a Record's attached
// Statements. Imports neither `records.ts` nor `statements.ts`, so both can use it.

import type { AccountRow, AllocationRow, StatementRow } from "@/data/db"
import { maskDescription } from "@/logic/replacements"
import { round2 } from "@/logic/shared"

export type StatementTotals = Map<string, { sum: number; count: number }>

export function tallyStatementAllocations(allocations: AllocationRow[]): StatementTotals {
	const totals: StatementTotals = new Map()
	for (const allocation of allocations) {
		const entry = totals.get(allocation.statement_id) ?? { sum: 0, count: 0 }
		entry.sum = round2(entry.sum + allocation.amount)
		entry.count++
		totals.set(allocation.statement_id, entry)
	}
	return totals
}

export function enrichStatement(
	statement: StatementRow,
	totals: StatementTotals,
	duplicates: Set<string>,
	accounts: Map<string, AccountRow>,
) {
	const entry = totals.get(statement.id) ?? { sum: 0, count: 0 }
	return {
		id: statement.id,
		datetime: statement.datetime,
		index: statement.index,
		description: maskDescription(statement.description),
		amount: statement.amount,
		allocable_amount: round2(statement.amount - entry.sum),
		allocation_count: entry.count,
		is_pending: statement.is_pending === 1,
		is_unallocated: entry.count === 0,
		is_duplicate: duplicates.has(statement.id),
		account: accounts.get(statement.account_id) ?? {
			id: statement.account_id,
			name: statement.account_id,
			balance: 0,
			bank: "",
		},
	}
}

export function compareStatements(
	a: { datetime: string; index: number; amount: number; description: string },
	b: { datetime: string; index: number; amount: number; description: string },
) {
	return (
		b.datetime.localeCompare(a.datetime) ||
		b.index - a.index ||
		a.amount - b.amount ||
		a.description.localeCompare(b.description)
	)
}
