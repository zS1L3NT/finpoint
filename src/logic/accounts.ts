// Mirrors `Api\AccountController` + `Account::appQuery`.

import { DateTime } from "luxon"
import { db } from "@/data/db"
import { round2 } from "@/logic/shared"
import { Validator } from "@/logic/validate"
import type { Account } from "@/types"

export type AccountActivity = {
	statements_count: number
	unallocated_count: number
	pending_count: number
	last_activity: string | null
	inflow_30d: number
	outflow_30d: number
}

/** Per-account activity, in one pass over statements and allocations. */
async function accountActivity(accountId?: string): Promise<Map<string, AccountActivity>> {
	const statements = accountId
		? await db.statements.where("account_id").equals(accountId).toArray()
		: await db.statements.toArray()
	const allocated = new Set((await db.allocations.toArray()).map(a => a.statement_id))
	const since = DateTime.now().minus({ days: 30 }).toFormat("yyyy-MM-dd")
	const map = new Map<string, AccountActivity>()
	for (const statement of statements) {
		const entry = map.get(statement.account_id) ?? {
			statements_count: 0,
			unallocated_count: 0,
			pending_count: 0,
			last_activity: null,
			inflow_30d: 0,
			outflow_30d: 0,
		}
		entry.statements_count++
		if (!allocated.has(statement.id)) entry.unallocated_count++
		if (statement.is_pending === 1) entry.pending_count++
		if (!entry.last_activity || statement.datetime > entry.last_activity)
			entry.last_activity = statement.datetime
		if (statement.datetime.slice(0, 10) >= since) {
			if (statement.amount > 0) entry.inflow_30d = round2(entry.inflow_30d + statement.amount)
			else entry.outflow_30d = round2(entry.outflow_30d - statement.amount)
		}
		map.set(statement.account_id, entry)
	}
	return map
}

const NO_ACTIVITY: AccountActivity = {
	statements_count: 0,
	unallocated_count: 0,
	pending_count: 0,
	last_activity: null,
	inflow_30d: 0,
	outflow_30d: 0,
}

export async function listAccounts(query?: string): Promise<(Account & AccountActivity)[]> {
	const q = (query ?? "").trim().toLowerCase()
	const accounts = await db.accounts.toArray()
	const activity = await accountActivity()
	return accounts
		.filter(
			account =>
				!q ||
				account.name.toLowerCase().includes(q) ||
				account.bank.toLowerCase().includes(q) ||
				account.id.toLowerCase().includes(q),
		)
		.sort((a, b) => a.bank.localeCompare(b.bank) || a.name.localeCompare(b.name))
		.map(account => ({ ...account, ...(activity.get(account.id) ?? NO_ACTIVITY) }))
}

export async function getAccount(id: string) {
	const account = await db.accounts.get(id)
	if (!account) throw new Error("Account not found.")
	const activity = (await accountActivity(id)).get(id) ?? NO_ACTIVITY

	return { ...account, ...activity }
}

export async function updateAccount(id: string, input: { name: string }) {
	const v = new Validator()
	const name = v.text(input.name, "name")
	v.throwIfInvalid()

	await db.accounts.update(id, { name })
	const updated = await db.accounts.get(id)
	if (!updated) throw new Error("Account not found.")

	return updated
}

export async function ensureAccount(id: string, name: string, bank: string) {
	const existing = await db.accounts.get(id)
	if (!existing) {
		await db.accounts.add({ id, name, balance: 0, bank })
	}
}
