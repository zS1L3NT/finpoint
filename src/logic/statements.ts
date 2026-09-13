// Mirrors `Api\StatementController`, `Api\StatementReplacementController`,
// and `Statement::appQuery` (filters, ordering, derived amounts).

import { asPending, db } from "@/data/db"
import {
	dayDifference,
	ensureCanReplace,
	maskDescription,
	replacementComparison,
	replacementReason,
} from "@/logic/replacements"
import { inputToStored, newId, round2, toCents } from "@/logic/shared"
import { ValidationError, Validator } from "@/logic/validate"

export type StatementFilters = {
	query?: string | null
	account_id?: string | null
	exclude_ids?: string | null
	start_date?: string | null
	end_date?: string | null
	is_allocable?: string | null
	is_pending?: string | null
	is_unallocated?: string | null
}

export function paginate<T>(items: T[], page: number, perPage: number) {
	const total = items.length
	const current_page = Math.max(1, page)
	const safePerPage = Math.min(Math.max(1, perPage), 250)
	const data = items.slice((current_page - 1) * safePerPage, current_page * safePerPage)
	return {
		data,
		total,
		per_page: safePerPage,
		current_page,
		last_page: Math.max(1, Math.ceil(total / safePerPage)),
		links: [] as { active: boolean; label: string; url: string | null }[],
	}
}

async function enrich(
	statements: {
		id: string
		account_id: string
		datetime: string
		description: string
		amount: number
		index: number
		is_pending: number
	}[],
) {
	const accounts = new Map((await db.accounts.toArray()).map(a => [a.id, a]))
	const allocations = await db.allocations.toArray()
	const byStatement = new Map<string, { sum: number; count: number }>()
	for (const allocation of allocations) {
		const entry = byStatement.get(allocation.statement_id) ?? { sum: 0, count: 0 }
		entry.sum = round2(entry.sum + allocation.amount)
		entry.count++
		byStatement.set(allocation.statement_id, entry)
	}
	return statements.map(statement => {
		const entry = byStatement.get(statement.id) ?? { sum: 0, count: 0 }
		const allocable_amount = round2(statement.amount - entry.sum)
		return {
			id: statement.id,
			datetime: statement.datetime,
			index: statement.index,
			description: maskDescription(statement.description),
			amount: statement.amount,
			allocable_amount,
			allocation_count: entry.count,
			is_pending: statement.is_pending === 1,
			is_unallocated: entry.count === 0,
			account: accounts.get(statement.account_id) ?? {
				id: statement.account_id,
				name: statement.account_id,
				balance: 0,
				bank: "",
			},
		}
	})
}

export async function listStatements(filters: StatementFilters = {}) {
	let rows = await db.statements.toArray()

	const q = (filters.query ?? "").trim().toLowerCase()
	if (q) {
		const accounts = new Map((await db.accounts.toArray()).map(a => [a.id, a]))
		rows = rows.filter(statement => {
			const account = accounts.get(statement.account_id)
			return (
				statement.description.toLowerCase().includes(q) ||
				String(statement.amount).includes(q) ||
				(account?.id.toLowerCase().includes(q) ?? false) ||
				(account?.name.toLowerCase().includes(q) ?? false)
			)
		})
	}
	if (filters.account_id) rows = rows.filter(s => s.account_id === filters.account_id)
	if (filters.exclude_ids) {
		const excluded = new Set(filters.exclude_ids.split(",").filter(Boolean))
		rows = rows.filter(s => !excluded.has(s.id))
	}
	const { start_date, end_date } = filters
	if (start_date) rows = rows.filter(s => s.datetime.slice(0, 10) >= start_date)
	if (end_date) rows = rows.filter(s => s.datetime.slice(0, 10) <= end_date)
	if (filters.is_pending === "true") rows = rows.filter(s => s.is_pending === 1)
	if (filters.is_pending === "false") rows = rows.filter(s => s.is_pending === 0)

	let enriched = await enrich(rows)

	if (filters.is_allocable === "true") enriched = enriched.filter(s => s.allocable_amount !== 0)
	if (filters.is_allocable === "false") enriched = enriched.filter(s => s.allocable_amount === 0)
	if (filters.is_unallocated === "true") enriched = enriched.filter(s => s.allocation_count === 0)
	if (filters.is_unallocated === "false")
		enriched = enriched.filter(s => s.allocation_count !== 0)

	enriched.sort(
		(a, b) =>
			b.datetime.localeCompare(a.datetime) ||
			b.index - a.index ||
			a.amount - b.amount ||
			a.description.localeCompare(b.description),
	)

	return enriched
}

export type StatementInput = {
	account_id: string
	datetime: string
	amount: number
	description: string
}

function validateStatement(input: StatementInput) {
	const v = new Validator()
	const account_id = v.text(input.account_id, "account_id", "Select an account.")
	const datetime = v.datetime(input.datetime, "datetime")
	const amount = v.amount(input.amount, "amount")
	if (amount === 0 && v.errors.amount === undefined) {
		v.reject("amount", "Amount must not be zero.")
	}
	const description = v.text(input.description, "description", "Enter a description.")
	v.throwIfInvalid()
	return { ...input, account_id, datetime, amount, description }
}

export async function createPendingStatement(input: StatementInput) {
	const dto = validateStatement(input)

	if (!(await db.accounts.get(dto.account_id))) {
		throw new ValidationError({ account_id: ["Select an account."] })
	}
	const row = {
		id: newId(),
		account_id: dto.account_id,
		datetime: inputToStored(dto.datetime),
		description: dto.description,
		amount: dto.amount,
		index: 0,
		is_pending: asPending(true),
	}
	await db.statements.add(row)

	return row
}

export async function updatePendingStatement(id: string, input: StatementInput) {
	const existing = await db.statements.get(id)
	if (!existing) throw new Error("Statement not found.")
	if (existing.is_pending !== 1) {
		throw new ValidationError({ statement: ["Imported statements are read-only."] })
	}
	const dto = validateStatement(input)

	const allocations = await db.allocations.where("statement_id").equals(id).toArray()
	ensureAllocationsFit(
		dto.amount,
		allocations.map(a => a.amount),
	)
	await db.statements.update(id, {
		account_id: dto.account_id,
		datetime: inputToStored(dto.datetime),
		description: dto.description,
		amount: dto.amount,
	})
	const saved = await db.statements.get(id)
	if (!saved) throw new Error("Statement not found.")

	return saved
}

export async function deletePendingStatement(id: string) {
	const existing = await db.statements.get(id)
	if (!existing) throw new Error("Statement not found.")
	if (existing.is_pending !== 1) {
		throw new ValidationError({ statement: ["Imported statements are read-only."] })
	}
	if ((await db.allocations.where("statement_id").equals(id).count()) > 0) {
		throw new ValidationError({
			statement: ["Remove every allocation before deleting this pending statement."],
		})
	}

	await db.statements.delete(id)
}

function ensureAllocationsFit(amount: number, allocations: number[]) {
	if (!allocations.length) return
	const allocated = round2(allocations.reduce((sum, a) => sum + a, 0))
	const wrongSign = amount > 0 ? allocations.some(a => a <= 0) : allocations.some(a => a >= 0)
	const overallocated = amount > 0 ? allocated > amount : allocated < amount
	if (wrongSign || overallocated) {
		throw new ValidationError({ amount: ["The amount would over-allocate this statement."] })
	}
}

export async function getStatement(id: string) {
	const row = await db.statements.get(id)
	if (!row) throw new Error("Statement not found.")
	const enriched = (await enrich([row]))[0]
	if (!enriched) throw new Error("Statement not found.")
	const allocations = await db.allocations.where("statement_id").equals(id).toArray()
	const recordIds = allocations.map(a => a.record_id)
	const records = recordIds.length ? await db.records.where("id").anyOf(recordIds).toArray() : []
	const amountByRecord = new Map(allocations.map(a => [a.record_id, a.amount]))

	return {
		...enriched,
		records: records.map(record => ({
			...record,
			pivot: { amount: amountByRecord.get(record.id) ?? 0 },
		})),
	}
}

export async function replacePendingStatement(statementId: string, pendingId: string) {
	return db.transaction("rw", [db.statements, db.allocations], async () => {
		const statement = await db.statements.get(statementId)
		const pending = await db.statements.get(pendingId)
		if (!statement || !pending) throw new Error("Statement not found.")
		const statementAllocations = await db.allocations
			.where("statement_id")
			.equals(statementId)
			.toArray()
		const pendingAllocations = await db.allocations
			.where("statement_id")
			.equals(pendingId)
			.toArray()
		ensureCanReplace(
			{ ...statement, is_pending: statement.is_pending === 1 },
			{ ...pending, is_pending: pending.is_pending === 1 },
			pendingAllocations,
			statementAllocations,
		)

		await db.allocations
			.where("statement_id")
			.equals(pendingId)
			.modify({ statement_id: statementId })
		await db.statements.delete(pendingId)
		const replacement = await db.statements.get(statementId)
		if (!replacement) throw new Error("Statement not found.")

		return replacement
	})
}

export async function replacementCandidates(
	pendingId: string,
	options: { query?: string; scope?: "suggested" | "all"; page?: number; per_page?: number } = {},
) {
	const pending = await db.statements.get(pendingId)
	if (!pending) throw new Error("Statement not found.")
	if (pending.is_pending !== 1)
		throw new ValidationError({ pending_statement: ["Choose a pending statement to replace."] })

	const scope = options.scope ?? "suggested"
	const pendingAllocations = await db.allocations
		.where("statement_id")
		.equals(pendingId)
		.toArray()

	let rows = await db.statements.where("account_id").equals(pending.account_id).toArray()
	rows = rows.filter(s => s.is_pending === 0)
	const allocatedIds = new Set((await db.allocations.toArray()).map(a => a.statement_id))
	rows = rows.filter(s => !allocatedIds.has(s.id))

	if (scope === "suggested") {
		rows = rows.filter(s => (pending.amount > 0 ? s.amount > 0 : s.amount < 0))
		rows = rows.filter(s => Math.abs(dayDifference(s.datetime, pending.datetime)) <= 7)
	}
	if (options.query?.trim()) {
		const q = options.query.trim().toLowerCase()
		rows = rows.filter(
			s => s.description.toLowerCase().includes(q) || String(s.amount).includes(q),
		)
	}

	const pendingShape = { ...pending, is_pending: true }

	let candidates = (await enrich(rows)).map(candidate => {
		const reason = replacementReason(
			{ ...candidate, account_id: pending.account_id, is_pending: false },
			pendingShape,
			pendingAllocations,
			[],
		)
		return {
			...candidate,
			...replacementComparison(
				{ ...candidate, account_id: pending.account_id, is_pending: false },
				pendingShape,
				pendingAllocations,
			),
			can_replace: reason === null,
			disabled_reason: reason,
		}
	})

	if (scope === "suggested") {
		candidates = candidates.filter(c => c.can_replace && c.amount_difference <= 5)
	}
	candidates.sort(
		(a, b) =>
			Number(b.is_exact_amount) - Number(a.is_exact_amount) ||
			a.amount_difference - b.amount_difference ||
			Math.abs(a.day_difference) - Math.abs(b.day_difference) ||
			a.id.localeCompare(b.id),
	)

	const page = options.page ?? 1
	const perPage = Math.min(Math.max(1, options.per_page ?? 25), 100)

	return paginate(candidates, page, perPage)
}

export async function replacementReview(pendingId: string, statementId: string) {
	const pending = await db.statements.get(pendingId)
	const statement = await db.statements.get(statementId)
	if (!pending || !statement) throw new Error("Statement not found.")
	if (pending.is_pending !== 1) {
		throw new ValidationError({ pending_statement: ["Choose a pending statement to replace."] })
	}
	const pendingAllocations = await db.allocations
		.where("statement_id")
		.equals(pendingId)
		.toArray()
	const statementAllocations = await db.allocations
		.where("statement_id")
		.equals(statementId)
		.toArray()

	const reason = replacementReason(
		{ ...statement, is_pending: statement.is_pending === 1 },
		{ ...pending, is_pending: true },
		pendingAllocations,
		statementAllocations,
	)
	const pendingEnriched = (await enrich([pending]))[0]
	const statementEnriched = (await enrich([statement]))[0]
	if (!pendingEnriched || !statementEnriched) throw new Error("Statement not found.")
	const recordIds = pendingAllocations.map(a => a.record_id)
	const records = recordIds.length ? await db.records.where("id").anyOf(recordIds).toArray() : []
	const amountByRecord = new Map(pendingAllocations.map(a => [a.record_id, a.amount]))

	return {
		pending_statement: pendingEnriched,
		statement: statementEnriched,
		allocations: records.map(record => ({
			...record,
			allocation_amount: amountByRecord.get(record.id) ?? 0,
		})),
		...replacementComparison(
			{ ...statement, is_pending: statement.is_pending === 1 },
			{ ...pending, is_pending: true },
			pendingAllocations,
		),
		can_replace: reason === null,
		disabled_reason: reason,
	}
}

export { toCents }
