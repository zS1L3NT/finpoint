// Mirrors `Api\AccountController` + `Account::appQuery`.

import { db } from "@/data/db"
import { Validator } from "@/logic/validate"
import type { Account } from "@/types"

export async function listAccounts(query?: string): Promise<Account[]> {
	const q = (query ?? "").trim().toLowerCase()
	const accounts = await db.accounts.toArray()
	const counts = new Map<string, number>()
	await db.statements.each(statement => {
		counts.set(statement.account_id, (counts.get(statement.account_id) ?? 0) + 1)
	})
	return accounts
		.filter(
			account =>
				!q ||
				account.name.toLowerCase().includes(q) ||
				account.bank.toLowerCase().includes(q) ||
				account.id.toLowerCase().includes(q),
		)
		.sort((a, b) => a.bank.localeCompare(b.bank) || a.name.localeCompare(b.name))
		.map(account => ({ ...account, statements_count: counts.get(account.id) ?? 0 }))
}

export async function getAccount(id: string) {
	const account = await db.accounts.get(id)
	if (!account) throw new Error("Account not found.")
	const statements_count = await db.statements.where("account_id").equals(id).count()
	return { ...account, statements_count }
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
