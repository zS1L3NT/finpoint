import { db, type StatementRow } from "@/data/db"
import { newId, TREATMENT_VALUES } from "@/logic/shared"
import { listStatements } from "@/logic/statements"
import { ValidationError, Validator } from "@/logic/validate"
import type { RuleCondition, RuleDataset, RuleField, StatementRule } from "@/types/statement-rules"

export const RULE_FIELDS: { value: RuleField; label: string }[] = [
	{ value: "title", label: "Title" },
	{ value: "location", label: "Location" },
	{ value: "category_id", label: "Category" },
	{ value: "analytics_treatment", label: "Treatment" },
	{ value: "monthly_budget_id", label: "Monthly budget" },
]
export const CONDITION_FIELDS: { value: RuleCondition["field"]; label: string }[] = [
	{ value: "description", label: "Description" },
	{ value: "amount", label: "Amount" },
	{ value: "date", label: "Date" },
	{ value: "is_pending", label: "Pending status" },
]
export function conditionOperators(field: RuleCondition["field"]): RuleCondition["operator"][] {
	return field === "description"
		? ["contains", "not_contains", "equals", "starts_with"]
		: field === "is_pending"
			? ["equals"]
			: ["equals", "gte", "lte"]
}
export function matchesStatement(
	rule: Pick<StatementRule, "account_ids" | "conditions">,
	statement: StatementRow,
): boolean {
	if (rule.account_ids.length && !rule.account_ids.includes(statement.account_id)) return false
	if (!rule.conditions.items.length) return false
	const results = rule.conditions.items.map(condition => {
		const value = condition.value.trim().toLowerCase()
		if (!value || !conditionOperators(condition.field).includes(condition.operator))
			return false
		const actual =
			condition.field === "description"
				? statement.description.toLowerCase()
				: condition.field === "amount"
					? statement.amount
					: condition.field === "date"
						? statement.datetime.slice(0, 10)
						: String(statement.is_pending === 1)
		const expected = condition.field === "amount" ? Number(value) : value
		switch (condition.operator) {
			case "contains":
				return String(actual).includes(value)
			case "not_contains":
				return !String(actual).includes(value)
			case "starts_with":
				return String(actual).startsWith(value)
			case "equals":
				return actual === expected
			case "gte":
				return actual >= expected
			case "lte":
				return actual <= expected
		}
	})
	return rule.conditions.mode === "all" ? results.every(Boolean) : results.some(Boolean)
}

export async function listStatementRules() {
	return (await db.statement_rules.toArray()).sort(
		(a, b) => a.priority - b.priority || a.id.localeCompare(b.id),
	)
}

export type RuleInput = Omit<StatementRule, "id" | "created_at" | "updated_at">
export async function saveStatementRule(input: RuleInput, id?: string) {
	const v = new Validator()
	const name = v.text(input.name, "name")
	if (typeof input.enabled !== "boolean")
		v.reject("enabled", "Choose whether this rule is enabled.")
	if (!Number.isSafeInteger(input.priority) || input.priority < 0)
		v.reject("priority", "Enter a non-negative whole number.")
	v.oneOf(input.conditions?.mode, "conditions.mode", ["all", "any"])
	if (!Array.isArray(input.conditions?.items) || !input.conditions.items.length)
		v.reject("conditions", "Add at least one condition.")
	for (const [i, condition] of (Array.isArray(input.conditions?.items)
		? input.conditions.items
		: []
	).entries()) {
		const field = `conditions.items.${i}`
		v.oneOf(
			condition.field,
			`${field}.field`,
			CONDITION_FIELDS.map(f => f.value),
		)
		v.oneOf(condition.operator, `${field}.operator`, conditionOperators(condition.field))
		v.text(condition.value, `${field}.value`)
		if (condition.field === "amount" && !Number.isFinite(Number(condition.value)))
			v.reject(`${field}.value`, "Enter a valid amount.")
		if (condition.field === "date") v.date(condition.value, `${field}.value`)
		if (condition.field === "is_pending")
			v.oneOf(condition.value, `${field}.value`, ["true", "false"])
	}
	if (!Object.keys(input.actions ?? {}).length)
		v.reject("actions", "Choose at least one field to suggest or autofill.")
	for (const [field, action] of Object.entries(input.actions ?? {})) {
		v.oneOf(
			field,
			"actions",
			RULE_FIELDS.map(f => f.value),
		)
		v.oneOf(action?.mode, `actions.${field}.mode`, ["suggest", "autofill"])
		if (!(field === "monthly_budget_id" && action?.value === null))
			v.text(action?.value, `actions.${field}.value`)
		if (field === "analytics_treatment")
			v.oneOf(action?.value, `actions.${field}.value`, TREATMENT_VALUES)
	}
	if (!Array.isArray(input.account_ids) || input.account_ids.some(id => typeof id !== "string"))
		v.reject("account_ids", "Select valid accounts.")
	v.throwIfInvalid()

	return db.transaction(
		"rw",
		[
			db.statement_rules,
			db.statement_rule_runs,
			db.statements,
			db.accounts,
			db.categories,
			db.monthly_budgets,
		],
		async () => {
			for (const accountId of input.account_ids)
				if (!(await db.accounts.get(accountId)))
					v.reject("account_ids", "Select an existing account.")
			if (
				input.actions.category_id &&
				!(await db.categories.get(input.actions.category_id.value))
			)
				v.reject("actions.category_id.value", "Select an existing category.")
			if (input.actions.monthly_budget_id?.value) {
				const budget = await db.monthly_budgets.get(input.actions.monthly_budget_id.value)
				if (!budget || budget.archived)
					v.reject("actions.monthly_budget_id.value", "Select an active Monthly Budget.")
			}
			v.throwIfInvalid()
			const existing = id ? await db.statement_rules.get(id) : undefined
			if (id && !existing)
				throw new ValidationError({ name: ["This rule no longer exists."] })
			const rule: StatementRule = {
				...input,
				name,
				id: id ?? newId(),
				created_at: existing?.created_at ?? new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}
			await db.statement_rules.put(rule)
			const run = await db.statement_rule_runs.get(rule.id)
			await db.statement_rule_runs.put({
				rule_id: rule.id,
				known_statement_ids:
					run?.known_statement_ids ?? (await db.statements.toCollection().primaryKeys()),
				matched_statement_ids: [],
				ran_at: null,
			})
			return rule
		},
	)
}

export async function deleteStatementRule(id: string) {
	await db.transaction("rw", [db.statement_rules, db.statement_rule_runs], async () => {
		await db.statement_rules.delete(id)
		await db.statement_rule_runs.delete(id)
	})
}

async function datasetStatements(ruleId: string | undefined, dataset: RuleDataset) {
	const statements = await db.statements.toArray()
	const run = ruleId ? await db.statement_rule_runs.get(ruleId) : undefined
	const known = new Set(run?.known_statement_ids ?? statements.map(s => s.id))
	return statements.filter(
		s => dataset === "both" || (dataset === "existing" ? known.has(s.id) : !known.has(s.id)),
	)
}

export async function previewStatementRule(
	rule: RuleInput,
	id: string | undefined,
	dataset: RuleDataset,
	query = "",
) {
	const rows = (await datasetStatements(id, dataset)).filter(s => matchesStatement(rule, s))
	const ids = new Set(rows.map(s => s.id))
	return (await listStatements({ query })).filter(s => ids.has(s.id))
}

export async function runStatementRule(id: string, dataset: RuleDataset) {
	const v = new Validator()
	v.oneOf(dataset, "dataset", ["existing", "new", "both"])
	v.throwIfInvalid()
	return db.transaction(
		"rw",
		[db.statement_rules, db.statement_rule_runs, db.statements],
		async () => {
			const rule = await db.statement_rules.get(id)
			if (!rule?.enabled)
				throw new ValidationError({ rule: ["Enable this rule before running it."] })
			const rows = await datasetStatements(id, dataset)
			const selected = new Set(rows.map(s => s.id))
			const run = await db.statement_rule_runs.get(id)
			const matches = rows.filter(s => matchesStatement(rule, s)).map(s => s.id)
			await db.statement_rule_runs.put({
				rule_id: id,
				known_statement_ids: [
					...new Set([...(run?.known_statement_ids ?? []), ...selected]),
				],
				matched_statement_ids: [
					...new Set([
						...(run?.matched_statement_ids ?? []).filter(id => !selected.has(id)),
						...matches,
					]),
				],
				ran_at: new Date().toISOString(),
			})
			return { scanned: rows.length, matched: matches.length }
		},
	)
}

export type RuleRecommendation = {
	rule_id: string
	rule_name: string
	field: RuleField
	mode: "suggest" | "autofill"
	value: string | null
}
export async function statementRecommendations(
	statementIds: string[],
): Promise<RuleRecommendation[]> {
	if (!statementIds.length) return []
	const selected = new Set(statementIds)
	const statements = await db.statements.bulkGet(statementIds)
	const runs = new Map((await db.statement_rule_runs.toArray()).map(run => [run.rule_id, run]))
	const result: RuleRecommendation[] = []
	for (const rule of await listStatementRules()) {
		if (!rule.enabled) continue
		const eligible = new Set(
			runs.get(rule.id)?.matched_statement_ids.filter(id => selected.has(id)) ?? [],
		)
		if (!statements.some(s => s && eligible.has(s.id) && matchesStatement(rule, s))) continue
		for (const { value: field } of RULE_FIELDS) {
			const action = rule.actions[field]
			if (!action) continue
			if (field === "category_id" && !(await db.categories.get(action.value ?? ""))) continue
			if (field === "monthly_budget_id" && action.value) {
				const budget = await db.monthly_budgets.get(action.value)
				if (!budget || budget.archived) continue
			}
			result.push({ rule_id: rule.id, rule_name: rule.name, field, ...action })
		}
	}
	return result
}

export function recommendationAutofill(
	recommendations: RuleRecommendation[],
): Partial<Record<RuleField, string | null>> {
	const values: Partial<Record<RuleField, string | null>> = {}
	for (const item of recommendations)
		if (item.mode === "autofill" && !(item.field in values)) values[item.field] = item.value
	return values
}
