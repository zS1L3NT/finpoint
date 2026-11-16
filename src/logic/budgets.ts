// Mirrors `Api\BudgetController` + `Api\BudgetRecordController` + `Budget::appQuery`.

import { DateTime } from "luxon"
import { db } from "@/data/db"
import { compareRecords, contribution } from "@/logic/analytics"
import { enrichRecords } from "@/logic/records"
import { fromCents, newId, round2 } from "@/logic/shared"
import { Validator } from "@/logic/validate"
import type { Record as AppRecord, Budget } from "@/types"

export type BudgetDetail = Budget & { records: AppRecord[] }

export type BudgetFilters = { query?: string | null }

/** A Budget's spent: the Dashboard's rule (Treatment-aware, refunds subtract, no clamp at zero). */
export function budgetSpent(records: Pick<AppRecord, "amount" | "analytics_treatment">[]) {
	return fromCents(
		records.reduce((sum, r) => sum + contribution(r.analytics_treatment, r.amount).spending, 0),
	)
}

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
	const enrichedRecords = await enrichRecords(await db.records.toArray())
	const recordById = new Map(enrichedRecords.map(r => [r.id, r]))
	const enriched = rows.map(budget => ({
		...budget,
		used_amount: budgetSpent(
			(recordIdsByBudget.get(budget.id) ?? []).flatMap(id => recordById.get(id) ?? []),
		),
	}))
	enriched.sort((a, b) => b.start_date.localeCompare(a.start_date))

	return enriched
}

export async function getBudget(id: string): Promise<BudgetDetail> {
	const budget = await db.budgets.get(id)
	if (!budget) throw new Error("Budget not found.")
	const links = await db.budget_records.where("budget_id").equals(id).toArray()
	const records = links.length
		? await db.records
				.where("id")
				.anyOf(links.map(l => l.record_id))
				.toArray()
		: []
	// Same read model as the Records list, so pending state and subtitles match.
	const enriched = (await enrichRecords(records)).sort(compareRecords)

	return { ...budget, used_amount: budgetSpent(enriched), records: enriched }
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
	if (amount < 0) v.reject("amount", "Amount must be zero or more.")
	const start_date = v.date(input.start_date, "start_date", "Enter a valid start date.")
	const end_date = v.date(input.end_date, "end_date", "Enter a valid end date.")
	if (start_date && end_date && end_date < start_date) {
		v.reject("end_date", "The end date must be on or after the start date.")
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
	await db.transaction("rw", [db.budgets, db.records, db.budget_records], async () => {
		if (!(await db.budgets.get(budgetId))) throw new Error("Budget not found.")
		if (!(await db.records.get(recordId))) throw new Error("Record not found.")
		await db.budget_records.put({ budget_id: budgetId, record_id: recordId })
	})
}

export async function detachBudgetRecord(budgetId: string, recordId: string) {
	await db.budget_records.delete([budgetId, recordId])
}

export type BudgetProgressPoint = {
	/** `before` and `after` gather the attached Records dated outside the Budget's window. */
	key: "before" | "after" | string
	usage: number | null
	projection: number | null
	/** Spending by Records dated after today that land on this point. */
	scheduled: number
}

/**
 * A Budget's cumulative spending by day. Records dated outside the window keep their own
 * point at either end, and Records dated after today are scheduled: they step the projection
 * up on their day, and never count towards the daily pace.
 */
export function budgetProgress(
	records: Pick<AppRecord, "amount" | "analytics_treatment" | "datetime">[],
	start: string,
	end: string,
	today: string,
) {
	const first = DateTime.fromISO(start)
	const dayCount = Math.max(Math.floor(DateTime.fromISO(end).diff(first, "days").days), 0) + 1
	const days = Array.from({ length: dayCount }, (_, index) =>
		first.plus({ days: index }).toFormat("yyyy-MM-dd"),
	)
	const elapsedDays = days.filter(day => day <= today).length
	const actual = new Map<string, number>()
	const scheduled = new Map<string, number>()
	const keys = new Set<string>(days)
	for (const record of records) {
		const day = record.datetime.slice(0, 10)
		const key = day < start ? "before" : day > end ? "after" : day
		const amounts = day > today ? scheduled : actual
		keys.add(key)
		amounts.set(key, (amounts.get(key) ?? 0) + budgetSpent([record]))
	}

	const ordered = [
		...(keys.has("before") ? ["before"] : []),
		...days,
		...(keys.has("after") ? ["after"] : []),
	]
	const reached = (key: string) =>
		key === "before" || (key === "after" ? today > end : key <= today)
	let spent = 0
	const usage = ordered.map(key => {
		if (!reached(key)) return null
		spent = round2(spent + (actual.get(key) ?? 0))
		return spent
	})
	const inWindow = round2(days.reduce((sum, day) => sum + (actual.get(day) ?? 0), 0))
	const pace = elapsedDays ? inWindow / elapsedDays : 0
	const scheduledTotal = round2([...scheduled.values()].reduce((sum, value) => sum + value, 0))

	// The projection starts on the last reached point, or on the first one before any is.
	const from = Math.max(
		usage.findLastIndex(value => value !== null),
		0,
	)
	const ahead = elapsedDays < dayCount || scheduledTotal !== 0
	let projected = spent
	const points = ordered.map((key, index): BudgetProgressPoint => {
		if (index >= from)
			projected += (scheduled.get(key) ?? 0) + (index > from && key.length === 10 ? pace : 0)
		return {
			key,
			usage: usage[index] ?? null,
			projection: ahead && index >= from ? round2(projected) : null,
			scheduled: round2(scheduled.get(key) ?? 0),
		}
	})

	return {
		points,
		dayCount,
		elapsedDays,
		remainingDays: dayCount - elapsedDays,
		spent,
		scheduled: scheduledTotal,
		pace: round2(pace),
		projected: round2(projected),
	}
}
