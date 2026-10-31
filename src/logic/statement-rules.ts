import { db, type StatementRow } from "@/data/db"
import { newId, TREATMENT_VALUES } from "@/logic/shared"
import { listStatements } from "@/logic/statements"
import { ValidationError, Validator } from "@/logic/validate"
import type { RuleCondition, RuleField, StatementRule } from "@/types"

export const RULE_FIELDS: { value: RuleField; label: string }[] = [
	{ value: "title", label: "Title" },
	{ value: "people", label: "People" },
	{ value: "location", label: "Location" },
	{ value: "category_id", label: "Category" },
	{ value: "analytics_treatment", label: "Treatment" },
	{ value: "monthly_budget_id", label: "Monthly budget" },
]
export const RULE_OPERATORS: { value: RuleCondition["operator"]; label: string }[] = [
	{ value: "contains", label: "contains" },
	{ value: "equals", label: "is exactly" },
	{ value: "regex", label: "matches regex" },
]

/** Case-insensitive pattern for a condition; null while it is blank or an invalid regex. */
export function conditionPattern({ operator, value }: RuleCondition) {
	const text = value.trim()
	if (!text) return null
	const literal = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
	try {
		return new RegExp(
			operator === "regex" ? text : operator === "equals" ? `^${literal}$` : literal,
			"i",
		)
	} catch {
		return null
	}
}

export function matchesStatement(
	rule: Pick<StatementRule, "conditions">,
	statement: Pick<StatementRow, "description">,
): boolean {
	const results = rule.conditions.items.map(
		condition => conditionPattern(condition)?.test(statement.description) ?? false,
	)
	return (
		results.length > 0 &&
		(rule.conditions.mode === "all" ? results.every(Boolean) : results.some(Boolean))
	)
}

const NAME_ORDER = new Intl.Collator(undefined, { sensitivity: "base", numeric: true })
const byCreation = (a: StatementRule, b: StatementRule) =>
	a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id)

export async function listStatementRules() {
	const [rules, statements] = await Promise.all([
		db.statement_rules.toArray(),
		db.statements.toArray(),
	])
	// Listed by name so a long list reads like an index; matching still follows creation order.
	return rules
		.sort((a, b) => NAME_ORDER.compare(a.name, b.name) || byCreation(a, b))
		.map(rule => ({
			...rule,
			matches: statements.filter(s => matchesStatement(rule, s)).length,
		}))
}

export type RuleInput = Omit<StatementRule, "id" | "created_at" | "updated_at">
export async function saveStatementRule(input: RuleInput, id?: string) {
	const v = new Validator()
	const name = v.text(input.name, "name", "Name this rule.")
	if (typeof input.enabled !== "boolean") v.reject("enabled", "Choose whether this rule is on.")
	v.oneOf(input.conditions?.mode, "conditions.mode", ["all", "any"])
	if (!Array.isArray(input.conditions?.items) || !input.conditions.items.length)
		v.reject("conditions", "Add at least one condition.")
	for (const [i, condition] of (input.conditions?.items ?? []).entries()) {
		v.oneOf(
			condition.operator,
			`conditions.items.${i}.operator`,
			RULE_OPERATORS.map(o => o.value),
		)
		if (
			v.text(condition.value, `conditions.items.${i}.value`, "Enter text to look for.") &&
			condition.operator === "regex" &&
			!conditionPattern(condition)
		)
			v.reject(`conditions.items.${i}.value`, "Enter a valid regular expression.")
	}
	if (!Object.keys(input.actions ?? {}).length)
		v.reject("actions", "Fill in at least one record field.")
	for (const [field, action] of Object.entries(input.actions ?? {})) {
		v.oneOf(
			field,
			"actions",
			RULE_FIELDS.map(f => f.value),
		)
		if (!(field === "monthly_budget_id" && action?.value === null))
			v.text(action?.value, `actions.${field}.value`, "Enter a value.")
		if (field === "analytics_treatment")
			v.oneOf(action?.value, `actions.${field}.value`, TREATMENT_VALUES)
	}
	v.throwIfInvalid()

	return db.transaction(
		"rw",
		[db.statement_rules, db.categories, db.monthly_budgets],
		async () => {
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
				id: id ?? newId(),
				name,
				enabled: input.enabled,
				conditions: input.conditions,
				actions: input.actions,
				created_at: existing?.created_at ?? new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}
			await db.statement_rules.put(rule)
			return rule
		},
	)
}

export async function setStatementRuleEnabled(id: string, enabled: boolean) {
	await db.statement_rules.update(id, { enabled, updated_at: new Date().toISOString() })
}

export async function deleteStatementRule(id: string) {
	await db.statement_rules.delete(id)
}

export async function previewStatementRule(rule: Pick<StatementRule, "conditions">) {
	const ids = new Set(
		(await db.statements.toArray()).filter(s => matchesStatement(rule, s)).map(s => s.id),
	)
	return (await listStatements()).filter(s => ids.has(s.id))
}

export type RuleRecommendation = {
	rule_id: string
	rule_name: string
	field: RuleField
	value: string | null
}
/** Earlier rules win autofill conflicts. */
export async function statementRecommendations(
	statementIds: string[],
): Promise<RuleRecommendation[]> {
	if (!statementIds.length) return []
	const statements = (await db.statements.bulkGet(statementIds)).filter(s => s !== undefined)
	const result: RuleRecommendation[] = []
	for (const rule of (await db.statement_rules.toArray()).sort(byCreation)) {
		if (!rule.enabled) continue
		if (!statements.some(s => matchesStatement(rule, s))) continue
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
	for (const item of recommendations) if (!(item.field in values)) values[item.field] = item.value
	return values
}
