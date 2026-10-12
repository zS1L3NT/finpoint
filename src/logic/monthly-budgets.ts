// Mirrors `Api\MonthlyBudgetController` + monthly_budget target/default handling.

import { DateTime } from "luxon"
import { db } from "@/data/db"
import { newId } from "@/logic/shared"
import { Validator } from "@/logic/validate"

const GROUPS = ["core", "outlier", "other"] as const
const PACE_KINDS = ["daily", "recurring", "none"] as const

export async function listMonthlyBudgets() {
	const month = DateTime.now().toFormat("yyyy-MM-01")
	const rows = (await db.monthly_budgets.toArray()).sort(
		(a, b) => a.display_order - b.display_order,
	)
	return Promise.all(
		rows.map(async row => {
			const defaults = await db.monthly_budget_defaults
				.where("monthly_budget_id")
				.equals(row.id)
				.toArray()
			const default_amount =
				defaults
					.filter(d => d.effective_month <= month)
					.sort((a, b) => b.effective_month.localeCompare(a.effective_month))[0]
					?.amount ?? null
			return { ...row, default_amount, amount: await amountFor(row.id, month) }
		}),
	)
}

export async function createMonthlyBudget(input: {
	name: string
	color: string
	group: string
	pace_kind: string
}) {
	const v = new Validator()
	const name = v.text(input.name, "name")
	const color = v.text(input.color, "color")
	const group = v.oneOf(input.group, "group", GROUPS, "Invalid group.")
	const pace_kind = v.oneOf(input.pace_kind, "pace_kind", PACE_KINDS, "Invalid pace.")
	v.throwIfInvalid()

	if (await db.monthly_budgets.where("name").equals(name).first()) {
		v.reject("name", "This monthly budget name is already taken.")
		v.throwIfInvalid()
	}
	const max = (await db.monthly_budgets.toArray()).reduce(
		(m, b) => Math.max(m, b.display_order),
		0,
	)
	const row = {
		id: newId(),
		name,
		color,
		group: group ?? "other",
		pace_kind: group === "outlier" ? "none" : (pace_kind ?? "none"),
		display_order: max + 10,
		archived: false,
	}
	await db.monthly_budgets.add(row)

	return row
}

export async function updateMonthlyBudget(
	id: string,
	input: { name: string; color: string; group: string; pace_kind: string; archived: boolean },
) {
	const existing = await db.monthly_budgets.get(id)
	if (!existing) throw new Error("Monthly budget not found.")

	const v = new Validator()
	const name = v.text(input.name, "name")
	const color = v.text(input.color, "color")
	v.throwIfInvalid()

	const clash = await db.monthly_budgets.where("name").equals(name).first()
	if (clash && clash.id !== id) {
		v.reject("name", "This monthly budget name is already taken.")
		v.throwIfInvalid()
	}
	const group = v.oneOf(input.group, "group", GROUPS) ?? existing.group
	let pace_kind = v.oneOf(input.pace_kind, "pace_kind", PACE_KINDS) ?? existing.pace_kind
	v.throwIfInvalid()
	if (group === "outlier") pace_kind = "none"

	await db.monthly_budgets.update(id, {
		name,
		color,
		group,
		pace_kind,
		archived: !!input.archived,
	})
	const saved = await db.monthly_budgets.get(id)
	if (!saved) throw new Error("Monthly budget not found.")

	return saved
}

export async function setMonthlyBudgetAmount(
	monthlyBudgetId: string,
	input: { month: string; amount: unknown; scope: string },
) {
	const v = new Validator()
	const month = v.date(input.month, "month", "Invalid month.")
	const date = DateTime.fromISO(month)
	if (!date.isValid || date.day !== 1) v.reject("month", "Choose the first day of a valid month.")
	const scope = v.oneOf(input.scope, "scope", ["month", "default"] as const, "Invalid scope.")
	const amount =
		input.amount === null || input.amount === undefined || input.amount === ""
			? null
			: v.amount(input.amount, "amount", "Amount must be zero or more.")
	if (amount !== null && amount < 0) v.reject("amount", "Amount must be zero or more.")
	if (!(await db.monthly_budgets.get(monthlyBudgetId)))
		v.reject("monthly_budget_id", "Monthly budget not found.")
	v.throwIfInvalid()

	if (scope === "month") {
		await db.monthly_budget_amounts.put({ monthly_budget_id: monthlyBudgetId, month, amount })
	} else {
		await db.transaction(
			"rw",
			db.monthly_budget_defaults,
			db.monthly_budget_amounts,
			async () => {
				await db.monthly_budget_defaults.put({
					monthly_budget_id: monthlyBudgetId,
					effective_month: month,
					amount,
				})
				await db.monthly_budget_amounts.delete([monthlyBudgetId, month])
			},
		)
	}
}

export async function amountFor(monthlyBudgetId: string, month: string): Promise<number | null> {
	const override = await db.monthly_budget_amounts.get([monthlyBudgetId, month])
	if (override) return override.amount

	const defaults = await db.monthly_budget_defaults
		.where("monthly_budget_id")
		.equals(monthlyBudgetId)
		.toArray()
	const eligible = defaults
		.filter(d => d.effective_month <= month)
		.sort((a, b) => (a.effective_month < b.effective_month ? 1 : -1))

	return eligible[0]?.amount ?? null
}

export async function upsertMonthlyBudget(input: {
	id?: string
	name: string
	color: string
	group: string
	pace_kind: string
	archived?: boolean
	month: string
	amount: unknown
	scope: string
}) {
	const v = new Validator()
	v.text(input.name, "name")
	v.text(input.color, "color")
	v.oneOf(input.group, "group", GROUPS)
	v.oneOf(input.pace_kind, "pace_kind", PACE_KINDS)
	const month = v.date(input.month, "month", "Invalid month.")
	const date = DateTime.fromISO(month)
	if (!date.isValid || date.day !== 1) v.reject("month", "Choose the first day of a valid month.")
	v.oneOf(input.scope, "scope", ["month", "default"] as const)
	const amount =
		input.amount === null || input.amount === undefined || input.amount === ""
			? null
			: v.amount(input.amount, "amount", "Amount must be zero or more.")
	if (amount !== null && amount < 0) v.reject("amount", "Amount must be zero or more.")
	v.throwIfInvalid()

	const saved = await db.transaction(
		"rw",
		db.monthly_budgets,
		db.monthly_budget_defaults,
		db.monthly_budget_amounts,
		async () => {
			const row = input.id
				? await updateMonthlyBudget(input.id, {
						...input,
						archived: input.archived ?? false,
					})
				: await createMonthlyBudget(input)
			await setMonthlyBudgetAmount(row.id, { month, amount, scope: input.scope })
			return row
		},
	)

	return saved
}
