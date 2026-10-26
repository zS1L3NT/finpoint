// Mirrors `Api\MonthlyBudgetController` + monthly_budget amount/default handling.

import { DateTime } from "luxon"
import { db, type MonthlyBudgetDefaultRow } from "@/data/db"
import { newId } from "@/logic/shared"
import { Validator } from "@/logic/validate"

const MONTHLY_BUDGET_GROUPS = ["core", "outlier", "other"] as const
const PACE_KINDS = ["daily", "recurring", "none"] as const

export async function listMonthlyBudgets() {
	const month = DateTime.now().toFormat("yyyy-MM-01")
	const rows = (await db.monthly_budgets.toArray()).sort(
		(a, b) => a.display_order - b.display_order,
	)
	return Promise.all(rows.map(async row => ({ ...row, amount: await amountFor(row.id, month) })))
}

async function createMonthlyBudget(input: {
	name: string
	color: string
	group: string
	pace_kind: string
}) {
	const v = new Validator()
	const name = v.text(input.name, "name")
	const color = v.text(input.color, "color")
	const group = v.oneOf(input.group, "group", MONTHLY_BUDGET_GROUPS, "Invalid group.")
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

async function updateMonthlyBudget(
	id: string,
	input: { name: string; color: string; group: string; pace_kind: string; archived: boolean },
) {
	const v = new Validator()
	const name = v.text(input.name, "name")
	const color = v.text(input.color, "color")
	const group = v.oneOf(input.group, "group", MONTHLY_BUDGET_GROUPS)
	const pace_kind = v.oneOf(input.pace_kind, "pace_kind", PACE_KINDS)
	v.throwIfInvalid()

	const existing = await db.monthly_budgets.get(id)
	if (!existing) throw new Error("Monthly budget not found.")

	const clash = await db.monthly_budgets.where("name").equals(name).first()
	if (clash && clash.id !== id) {
		v.reject("name", "This monthly budget name is already taken.")
		v.throwIfInvalid()
	}

	const savedGroup = group ?? existing.group
	await db.monthly_budgets.update(id, {
		name,
		color,
		group: savedGroup,
		pace_kind: savedGroup === "outlier" ? "none" : (pace_kind ?? existing.pace_kind),
		archived: !!input.archived,
	})
	const saved = await db.monthly_budgets.get(id)
	if (!saved) throw new Error("Monthly budget not found.")

	return saved
}

async function setMonthlyBudgetAmount(
	monthlyBudgetId: string,
	input: { month: string; amount: unknown; scope: string },
) {
	const { month, scope, amount } = validateAmount(input)

	if (!(await db.monthly_budgets.get(monthlyBudgetId))) {
		const v = new Validator()
		v.reject("monthly_budget_id", "Monthly budget not found.")
		v.throwIfInvalid()
	}

	await db.transaction("rw", db.monthly_budget_defaults, db.monthly_budget_amounts, async () => {
		if (scope === "default") {
			await db.monthly_budget_defaults.put({
				monthly_budget_id: monthlyBudgetId,
				effective_month: month,
				amount,
			})
		} else {
			await db.monthly_budget_defaults.delete([monthlyBudgetId, month])
		}
		if (scope === "month") {
			await db.monthly_budget_amounts.put({
				monthly_budget_id: monthlyBudgetId,
				month,
				amount,
			})
		} else {
			await db.monthly_budget_amounts.delete([monthlyBudgetId, month])
		}
	})
}

export async function getMonthlyBudgetAmountSource(monthlyBudgetId: string, month: string) {
	const override = await db.monthly_budget_amounts.get([monthlyBudgetId, month])
	const defaults = (
		await db.monthly_budget_defaults
			.where("monthly_budget_id")
			.equals(monthlyBudgetId)
			.toArray()
	).sort((a, b) => a.effective_month.localeCompare(b.effective_month))

	return {
		override: override ?? null,
		ownDefault: defaults.find(row => row.effective_month === month) ?? null,
		previousDefault: defaults.filter(row => row.effective_month < month).at(-1) ?? null,
		nextDefault: defaults.find(row => row.effective_month > month) ?? null,
	}
}

export async function amountFor(monthlyBudgetId: string, month: string): Promise<number | null> {
	const override = await db.monthly_budget_amounts.get([monthlyBudgetId, month])
	if (override) return override.amount

	const defaults = await db.monthly_budget_defaults
		.where("monthly_budget_id")
		.equals(monthlyBudgetId)
		.toArray()
	return defaultAmountFor(defaults, monthlyBudgetId, month)
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
	v.oneOf(input.group, "group", MONTHLY_BUDGET_GROUPS)
	v.oneOf(input.pace_kind, "pace_kind", PACE_KINDS)
	const { month, amount } = validateAmount(input, v)

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

export function isMonthlyBudgetGroup(
	scope: string,
): scope is (typeof MONTHLY_BUDGET_GROUPS)[number] {
	return MONTHLY_BUDGET_GROUPS.some(group => group === scope)
}

export function defaultAmountFor(
	defaults: MonthlyBudgetDefaultRow[],
	monthlyBudgetId: string,
	month: string,
): number | null {
	return (
		defaults
			.filter(d => d.monthly_budget_id === monthlyBudgetId && d.effective_month <= month)
			.sort((a, b) => b.effective_month.localeCompare(a.effective_month))[0]?.amount ?? null
	)
}

function validateAmount(
	input: { month: string; amount: unknown; scope: string },
	v = new Validator(),
) {
	const month = v.date(input.month, "month", "Invalid month.")
	const date = DateTime.fromISO(month)
	if (!date.isValid || date.day !== 1) v.reject("month", "Choose the first day of a valid month.")
	const scope = v.oneOf(
		input.scope,
		"scope",
		["month", "default", "inherit"] as const,
		"Invalid scope.",
	)
	const amount =
		scope === "inherit" ||
		input.amount === null ||
		input.amount === undefined ||
		input.amount === ""
			? null
			: v.amount(input.amount, "amount", "Amount must be zero or more.")
	if (amount !== null && amount < 0) v.reject("amount", "Amount must be zero or more.")
	v.throwIfInvalid()
	return { month, scope, amount }
}
