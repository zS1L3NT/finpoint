// Pending Record rule, shared by every read model so lists, filters and
// dashboard totals agree on what "pending" means.

import { type AllocationRow, db } from "@/data/db"
import { round2 } from "@/logic/shared"

export type AllocationTally = {
	/** Sum of allocated amounts. */
	sum: number
	/** Number of allocated statements. */
	count: number
	/** How many of those statements are Pending Statements. */
	pending: number
}

/** Ids of Pending Statements (handwritten placeholders not yet in a bank feed). */
export async function pendingStatementIds(): Promise<Set<string>> {
	return new Set((await db.statements.where("is_pending").equals(1).primaryKeys()) as string[])
}

export function tallyAllocations(
	allocations: AllocationRow[],
	pendingStatements: Set<string>,
): Map<string, AllocationTally> {
	const map = new Map<string, AllocationTally>()
	for (const allocation of allocations) {
		const entry = map.get(allocation.record_id) ?? { sum: 0, count: 0, pending: 0 }
		entry.sum = round2(entry.sum + allocation.amount)
		entry.count++
		if (pendingStatements.has(allocation.statement_id)) entry.pending++
		map.set(allocation.record_id, entry)
	}
	return map
}

/**
 * A Record is pending until imported statements fully explain it: no
 * allocations, allocations that do not tally, or any allocated Pending
 * Statement (its real bank row has not arrived yet).
 */
export function isPendingRecord(amount: number, tally: AllocationTally | undefined): boolean {
	if (!tally || tally.count === 0) return true
	return tally.sum !== amount || tally.pending > 0
}
