// Mirrors `Api\BudgetController` + `Api\BudgetRecordController` + `Budget::appQuery`.

import { db } from "@/data/db"
import { newId, round2 } from "@/logic/shared"
import { Validator } from "@/logic/validate"

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
	const v = new Validator()
	const name = v.text(input.name, "name")
	const amount = v.amount(input.amount, "amount")
	const start_date = v.date(input.start_date, "start_date", "Enter a valid start date.")
	const end_date = v.date(input.end_date, "end_date", "Enter a valid end date.")
	if (start_date && end_date && end_date <= start_date) {
		v.reject("end_date", "The end date must be after the start date.")
	}
	v.throwIfInvalid()
	return { name, amount, start_date, end_date }
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
		await db.budgets.add({ id, ...dto, automatic })
		if (automatic) {
			const records = (await db.records.toArray()).filter(
				r =>
					dto.start_date <= r.datetime.slice(0, 10) &&
					r.datetime.slice(0, 10) <= dto.end_date,
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
	await db.budgets.update(id, { ...dto, automatic: !!input.automatic })
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
