// Mirrors `Api\BudgetController` + `Api\BudgetRecordController` + `Budget::appQuery`.

import { db } from "@/data/db"
import { newId, round2, ValidationError } from "@/logic/shared"

export type BudgetFilters = { query?: string | null }

export async function listBudgets(filters: BudgetFilters = {}) {
	let rows = await db.budgets.toArray()
	const q = (filters.query ?? "").trim().toLowerCase()
	if (q) {
		rows = rows.filter(
			budget => budget.name.toLowerCase().includes(q) || String(budget.amount).includes(q),
		)
	}
	const links = await db.budget_records.toArray()
	const recordIdsByBudget = new Map<string, string[]>()
	for (const link of links) {
		const list = recordIdsByBudget.get(link.budget_id) ?? []
		list.push(link.record_id)
		recordIdsByBudget.set(link.budget_id, list)
	}
	const records = await db.records.toArray()
	const amountByRecord = new Map(records.map(r => [r.id, r.amount]))
	const enriched = rows.map(budget => ({
		...budget,
		used_amount: round2(
			(recordIdsByBudget.get(budget.id) ?? []).reduce(
				(sum, id) => sum + (amountByRecord.get(id) ?? 0),
				0,
			),
		),
	}))
	enriched.sort((a, b) => b.start_date.localeCompare(a.start_date))
	return enriched
}

export async function getBudget(id: string) {
	const budget = await db.budgets.get(id)
	if (!budget) throw new Error("Budget not found.")
	const links = await db.budget_records.where("budget_id").equals(id).toArray()
	const records = links.length
		? await db.records
				.where("id")
				.anyOf(links.map(l => l.record_id))
				.toArray()
		: []
	const categories = new Map((await db.categories.toArray()).map(c => [c.id, c]))
	const buckets = new Map((await db.buckets.toArray()).map(b => [b.id, b]))
	return {
		...budget,
		used_amount: round2(records.reduce((sum, r) => sum + r.amount, 0)),
		records: records.map(record => ({
			...record,
			category: categories.get(record.category_id) ?? null,
			bucket: record.bucket_id ? (buckets.get(record.bucket_id) ?? null) : null,
		})),
	}
}

function validateBudget(input: {
	name: string
	amount: number
	start_date: string
	end_date: string
}) {
	const errors: Record<string, string[]> = {}
	if (!input.name?.trim()) errors.name = ["The name field is required."]
	const amount = Number(input.amount)
	if (!Number.isFinite(amount)) errors.amount = ["Enter a valid amount."]
	if (!/^\d{4}-\d{2}-\d{2}$/.test(input.start_date))
		errors.start_date = ["Enter a valid start date."]
	if (!/^\d{4}-\d{2}-\d{2}$/.test(input.end_date)) errors.end_date = ["Enter a valid end date."]
	else if (input.start_date && input.end_date <= input.start_date) {
		errors.end_date = ["The end date must be after the start date."]
	}
	if (Object.keys(errors).length) throw new ValidationError(errors)
	return { name: input.name.trim(), amount: round2(amount) }
}

export async function createBudget(input: {
	name: string
	amount: number
	start_date: string
	end_date: string
	automatic?: boolean
}) {
	const dto = validateBudget(input)
	const automatic = !!input.automatic
	return db.transaction("rw", [db.budgets, db.records, db.budget_records], async () => {
		const id = newId()
		await db.budgets.add({
			id,
			...dto,
			start_date: input.start_date,
			end_date: input.end_date,
			automatic,
		})
		if (automatic) {
			const records = (await db.records.toArray()).filter(
				r =>
					input.start_date <= r.datetime.slice(0, 10) &&
					r.datetime.slice(0, 10) <= input.end_date,
			)
			for (const record of records) {
				await db.budget_records.put({ budget_id: id, record_id: record.id })
			}
		}
		const created = await db.budgets.get(id)
		if (!created) throw new Error("Budget not found.")
		return created
	})
}

export async function updateBudget(
	id: string,
	input: {
		name: string
		amount: number
		start_date: string
		end_date: string
		automatic?: boolean
	},
) {
	const dto = validateBudget(input)
	await db.budgets.update(id, {
		...dto,
		start_date: input.start_date,
		end_date: input.end_date,
		automatic: !!input.automatic,
	})
	const updated = await db.budgets.get(id)
	if (!updated) throw new Error("Budget not found.")
	return updated
}

export async function deleteBudget(id: string) {
	await db.transaction("rw", [db.budgets, db.budget_records], async () => {
		await db.budget_records.where("budget_id").equals(id).delete()
		await db.budgets.delete(id)
	})
}

export async function attachBudgetRecord(budgetId: string, recordId: string) {
	await db.budget_records.put({ budget_id: budgetId, record_id: recordId })
}

export async function detachBudgetRecord(budgetId: string, recordId: string) {
	await db.budget_records.delete([budgetId, recordId])
}
