import { db, type StatementRow } from "@/data/db"
import { newId, TREATMENT_VALUES } from "@/logic/shared"
import { listStatements } from "@/logic/statements"
import { ValidationError, Validator } from "@/logic/validate"
import type { RuleCondition, RuleDataset, RuleField, RuleRun, StatementRule } from "@/types"

export const RULE_FIELDS: { value: RuleField; label: string }[] = [
	{ value: "title", label: "Title" },
	{ value: "location", label: "Location" },
	{ value: "category_id", label: "Category" },
	{ value: "analytics_treatment", label: "Treatment" },
	{ value: "monthly_budget_id", label: "Monthly budget" },
]
export const RULE_OPERATORS: { value: RuleCondition["operator"]; label: string }[] = [
	{ value: "contains", label: "contains" },
	{ value: "not_contains", label: "doesn't contain" },
	{ value: "starts_with", label: "starts with" },
	{ value: "equals", label: "is exactly" },
]
export const RULE_DATASETS: { value: RuleDataset; label: string }[] = [
	{ value: "both", label: "All" },
	{ value: "existing", label: "Existing only" },
	{ value: "new", label: "New only" },
]

export function matchesStatement(
	rule: Pick<StatementRule, "conditions">,
	statement: Pick<StatementRow, "description">,
): boolean {
	const description = statement.description.toLowerCase()
	const results = rule.conditions.items.map(({ operator, value }) => {
		const needle = value.trim().toLowerCase()
		if (!needle) return false
		switch (operator) {
			case "contains":
				return description.includes(needle)
			case "not_contains":
				return !description.includes(needle)
			case "starts_with":
				return description.startsWith(needle)
			case "equals":
				return description === needle
		}
	})
	return (
		results.length > 0 &&
		(rule.conditions.mode === "all" ? results.every(Boolean) : results.some(Boolean))
	)
}

/** Statements in a dataset; without a run every current Statement counts as existing. */
function inDataset<T extends { id: string }>(
	statements: T[],
	run: RuleRun | undefined,
	dataset: RuleDataset,
) {
	const known = new Set(run?.known_statement_ids ?? statements.map(s => s.id))
	return statements.filter(
		s => dataset === "both" || (dataset === "existing") === known.has(s.id),
	)
}

const byCreation = (a: StatementRule, b: StatementRule) =>
	a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id)

export async function listStatementRules() {
	const [rules, runs, statements] = await Promise.all([
		db.statement_rules.toArray(),
		db.statement_rule_runs.toArray(),
		db.statements.toArray(),
	])
	return rules.sort(byCreation).map(rule => {
		const run = runs.find(r => r.rule_id === rule.id)
		const dataset = run?.dataset ?? "both"
		return {
			...rule,
			dataset,
			matches: inDataset(statements, run, dataset).filter(s => matchesStatement(rule, s))
				.length,
		}
	})
}

export type RuleInput = Omit<StatementRule, "id" | "created_at" | "updated_at">
export async function saveStatementRule(input: RuleInput, dataset: RuleDataset, id?: string) {
	const v = new Validator()
	const name = v.text(input.name, "name", "Name this rule.")
	if (typeof input.enabled !== "boolean") v.reject("enabled", "Choose whether this rule is on.")
	v.oneOf(dataset, "dataset", ["existing", "new", "both"])
	v.oneOf(input.conditions?.mode, "conditions.mode", ["all", "any"])
	if (!Array.isArray(input.conditions?.items) || !input.conditions.items.length)
		v.reject("conditions", "Add at least one condition.")
	for (const [i, condition] of (input.conditions?.items ?? []).entries()) {
		v.oneOf(
			condition.operator,
			`conditions.items.${i}.operator`,
			RULE_OPERATORS.map(o => o.value),
		)
		v.text(condition.value, `conditions.items.${i}.value`, "Enter text to look for.")
	}
	if (!Object.keys(input.actions ?? {}).length)
		v.reject("actions", "Fill in at least one record field.")
	for (const [field, action] of Object.entries(input.actions ?? {})) {
		v.oneOf(
			field,
			"actions",
			RULE_FIELDS.map(f => f.value),
		)
		v.oneOf(action?.mode, `actions.${field}.mode`, ["suggest", "autofill"])
		if (!(field === "monthly_budget_id" && action?.value === null))
			v.text(action?.value, `actions.${field}.value`, "Enter a value.")
		if (field === "analytics_treatment")
			v.oneOf(action?.value, `actions.${field}.value`, TREATMENT_VALUES)
	}
	v.throwIfInvalid()

	return db.transaction(
		"rw",
		[
			db.statement_rules,
			db.statement_rule_runs,
			db.statements,
			db.categories,
			db.monthly_budgets,
		],
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
			// "New" stays relative to the Statements known when the rule was first saved.
			const run = await db.statement_rule_runs.get(rule.id)
			await db.statement_rule_runs.put({
				rule_id: rule.id,
				dataset,
				known_statement_ids:
					run?.known_statement_ids ?? (await db.statements.toCollection().primaryKeys()),
				ran_at: new Date().toISOString(),
			})
			return rule
		},
	)
}

export async function setStatementRuleEnabled(id: string, enabled: boolean) {
	await db.statement_rules.update(id, { enabled, updated_at: new Date().toISOString() })
}

export async function deleteStatementRule(id: string) {
	await db.transaction("rw", [db.statement_rules, db.statement_rule_runs], async () => {
		await db.statement_rules.delete(id)
		await db.statement_rule_runs.delete(id)
	})
}

export async function previewStatementRule(
	rule: Pick<StatementRule, "conditions">,
	id: string | undefined,
	dataset: RuleDataset,
) {
	const run = id ? await db.statement_rule_runs.get(id) : undefined
	return inDataset(await listStatements(), run, dataset).filter(s => matchesStatement(rule, s))
}

export type RuleRecommendation = {
	rule_id: string
	rule_name: string
	field: RuleField
	mode: "suggest" | "autofill"
	value: string | null
}
/** Earlier rules win autofill conflicts; every suggestion stays available. */
export async function statementRecommendations(
	statementIds: string[],
): Promise<RuleRecommendation[]> {
	if (!statementIds.length) return []
	const statements = (await db.statements.bulkGet(statementIds)).filter(s => s !== undefined)
	const runs = await db.statement_rule_runs.toArray()
	const result: RuleRecommendation[] = []
	for (const rule of (await db.statement_rules.toArray()).sort(byCreation)) {
		if (!rule.enabled) continue
		const run = runs.find(r => r.rule_id === rule.id)
		if (
			!inDataset(statements, run, run?.dataset ?? "both").some(s => matchesStatement(rule, s))
		)
			continue
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
