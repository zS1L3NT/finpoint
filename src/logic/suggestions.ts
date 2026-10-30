// Learned Record suggestions. Every Allocation pairs a bank description with the Record made
// from it, so the workspace already holds labelled examples of how the user titles,
// categorises and budgets each kind of account activity. Nothing is stored: the model is
// rebuilt from IndexedDB on each read, so edits, deletes and Drive pulls apply at once, and
// every suggestion can name the past Records behind it.

import { DateTime } from "luxon"
import {
	type AllocationRow,
	type CategoryRow,
	db,
	type MonthlyBudgetRow,
	type RecordRow,
	type StatementRow,
} from "@/data/db"
import { parseDatetime, pluralize, round2 } from "@/lib/utils"
import { maskDescription } from "@/logic/replacements"
import { matchesStatement } from "@/logic/statement-rules"
import { listStatements } from "@/logic/statements"
import type { RuleActions, RuleField, StatementRule } from "@/types"

/** Descriptions less alike than this read as different merchants. */
const MIN_SIMILARITY = 0.5
/** Statements this alike are the same kind of activity, so one Record shape fits them all. */
const SAME_ACTIVITY = 0.8
/** Older decisions fade: a Record this many days old counts half as much. */
const HALF_LIFE_DAYS = 180
/** A value needs this share of all matching evidence to become a chip, so a field the
 * similar Records mostly left empty stays without one. */
const MIN_SHARE = 0.25
/** A suggested rule needs this many agreeing Statements and this share of its matches. */
const RULE_SUPPORT = 3
const RULE_PURITY = 0.9

type Tables = {
	statements: StatementRow[]
	records: RecordRow[]
	allocations: AllocationRow[]
	categories: CategoryRow[]
	monthlyBudgets: MonthlyBudgetRow[]
}

type Example = { statement: StatementRow; record: RecordRow; tokens: string[] }

export type RecordSuggestion = { field: RuleField; value: string; reason: string }

export type RecurringCharge = {
	key: string
	label: string
	query: string
	amount: number
	last: string
	expected: string
	overdue: boolean
}

export type RuleSuggestion = {
	key: string
	name: string
	conditions: StatementRule["conditions"]
	actions: RuleActions
	matches: number
	agreeing: number
}

export type SuggestionAccuracy = {
	records: number
	fields: { field: RuleField; hits: number; total: number }[]
}

const FIELD_VALUES: Record<RuleField, (record: RecordRow) => string | null> = {
	title: r => r.title,
	people: r => r.people,
	location: r => r.location,
	category_id: r => r.category_id,
	// Category defaults already supply these; only the user's own exceptions teach anything.
	analytics_treatment: r =>
		r.analytics_treatment_source === "manual" ? r.analytics_treatment : null,
	monthly_budget_id: r => (r.monthly_budget_source === "manual" ? r.monthly_budget_id : null),
}
const CHIP_LIMIT: Record<RuleField, number> = {
	title: 3,
	people: 2,
	location: 2,
	category_id: 2,
	analytics_treatment: 1,
	monthly_budget_id: 1,
}

/** Lower-case words of a bank description; reference codes (anything with a digit) drop out. */
export function descriptionTokens(description: string): string[] {
	return [
		...new Set(
			description
				.toLowerCase()
				.split(/[^a-z0-9]+/)
				.filter(token => token.length > 1 && !/\d/.test(token)),
		),
	]
}

async function loadTables(): Promise<Tables> {
	const [statements, records, allocations, categories, monthlyBudgets] = await Promise.all([
		db.statements.toArray(),
		db.records.toArray(),
		db.allocations.toArray(),
		db.categories.toArray(),
		db.monthly_budgets.toArray(),
	])
	return { statements, records, allocations, categories, monthlyBudgets }
}

/**
 * Words weigh by how rare they are across every Statement (inverse document frequency), so
 * bank boilerplate shared by many merchants ("SGD", "Contactless", "Singapore") counts for
 * little while merchant names decide. A word seen once carries nothing to learn from.
 */
function createModel({ statements, records, allocations }: Tables) {
	const frequency = new Map<string, number>()
	const tokensOf = new Map<string, string[]>()
	for (const statement of statements) {
		const tokens = descriptionTokens(statement.description)
		tokensOf.set(statement.id, tokens)
		for (const token of tokens) frequency.set(token, (frequency.get(token) ?? 0) + 1)
	}
	const weight = (token: string) => {
		const count = frequency.get(token) ?? 0
		return count < 2 ? 0 : Math.log(1 + statements.length / count)
	}
	const norm = (tokens: string[]) => tokens.reduce((sum, token) => sum + weight(token), 0)
	const similarity = (a: string[], b: string[]) => {
		const other = new Set(b)
		const shared = a.reduce((sum, token) => sum + (other.has(token) ? weight(token) : 0), 0)
		const scale = Math.sqrt(norm(a) * norm(b))
		return scale ? shared / scale : 0
	}
	// Index examples by their most telling words; a close match must share one of them.
	const keyTokens = (tokens: string[]) =>
		tokens
			.filter(token => weight(token))
			.sort((a, b) => weight(b) - weight(a))
			.slice(0, 3)

	const statementsById = new Map(statements.map(s => [s.id, s]))
	const recordsById = new Map(records.map(r => [r.id, r]))
	const examples: Example[] = []
	const postings = new Map<string, Example[]>()
	for (const allocation of allocations) {
		const statement = statementsById.get(allocation.statement_id)
		const record = recordsById.get(allocation.record_id)
		if (!statement || !record) continue
		const example = { statement, record, tokens: tokensOf.get(statement.id) ?? [] }
		examples.push(example)
		for (const token of keyTokens(example.tokens)) {
			const list = postings.get(token)
			if (list) list.push(example)
			else postings.set(token, [example])
		}
	}

	const neighbours = (tokens: string[], threshold = MIN_SIMILARITY) => {
		const seen = new Set<Example>()
		const result: { example: Example; similarity: number }[] = []
		for (const token of keyTokens(tokens))
			for (const example of postings.get(token) ?? []) {
				if (seen.has(example)) continue
				seen.add(example)
				const score = similarity(tokens, example.tokens)
				if (score >= threshold) result.push({ example, similarity: score })
			}
		return result
	}

	return { tokensOf, weight, similarity, keyTokens, neighbours, examples }
}
type Model = ReturnType<typeof createModel>

function age(record: RecordRow, now: DateTime) {
	const days = now.diff(parseDatetime(record.datetime), "days").days
	return 0.5 ** (Math.max(0, days) / HALF_LIFE_DAYS)
}

/** Same-direction activity of a similar size, day type and hour counts for more. */
function context(query: StatementRow, example: Example) {
	if (Math.sign(query.amount) !== Math.sign(example.statement.amount)) return 0
	const ratio =
		query.amount && example.statement.amount
			? Math.abs(Math.log(query.amount / example.statement.amount))
			: 1
	const at = parseDatetime(query.datetime)
	const then = parseDatetime(example.record.datetime)
	return (
		2 -
		Math.min(1, ratio) +
		(at.weekday > 5 === then.weekday > 5 ? 0.25 : 0) +
		// Indexed Statements keep date-only bank order, so only index zero carries a real time.
		(query.index === 0 && Math.abs(at.hour - then.hour) <= 2 ? 0.5 : 0)
	)
}

type Tally = Map<
	RuleField,
	Map<string, { weight: number; records: Set<string>; latest: RecordRow; byTitle: number }>
>

function tally(target: Tally, record: RecordRow, weight: number, byTitle: boolean) {
	for (const field of Object.keys(FIELD_VALUES) as RuleField[]) {
		if (byTitle && field === "title") continue
		const value = FIELD_VALUES[field](record)
		if (!value) continue
		const values = target.get(field) ?? new Map()
		target.set(field, values)
		const entry = values.get(value) ?? {
			weight: 0,
			records: new Set(),
			latest: record,
			byTitle: 0,
		}
		entry.weight += weight
		if (byTitle) entry.byTitle += weight
		entry.records.add(record.id)
		if (record.datetime > entry.latest.datetime) entry.latest = record
		values.set(value, entry)
	}
}

/**
 * Ranks every field value the matching past Records used. Records allocated to similar
 * Statements are the main evidence; Records with the typed title add theirs, so a manual
 * Record still learns its Category, people and place.
 */
function suggest(
	model: Model,
	{ categories, monthlyBudgets, statements: allStatements }: Tables,
	input: { statements: StatementRow[]; title?: string; before?: string; exclude?: string },
) {
	const now = input.before
		? parseDatetime(input.before)
		: DateTime.max(
				DateTime.now(),
				...input.statements.map(s => parseDatetime(s.datetime)).filter(d => d.isValid),
			)
	const usable = (record: RecordRow) =>
		record.id !== input.exclude && (!input.before || record.datetime < input.before)
	const counts: Tally = new Map()
	let evidence = 0

	for (const statement of input.statements) {
		const tokens = model.tokensOf.get(statement.id) ?? descriptionTokens(statement.description)
		for (const { example, similarity } of model.neighbours(tokens)) {
			if (!usable(example.record)) continue
			const weight = similarity ** 2 * age(example.record, now) * context(statement, example)
			evidence += weight
			if (weight) tally(counts, example.record, weight, false)
		}
	}
	const title = input.title?.trim().toLowerCase()
	if (title)
		for (const example of model.examples)
			if (usable(example.record) && example.record.title.toLowerCase() === title) {
				evidence += age(example.record, now)
				tally(counts, example.record, age(example.record, now), true)
			}

	const active = new Set(monthlyBudgets.filter(b => !b.archived).map(b => b.id))
	const known = new Set(categories.map(c => c.id))
	const chips: RecordSuggestion[] = []
	const ranked = { title: [] as string[], people: [] as string[], location: [] as string[] }
	for (const [field, values] of counts) {
		const sorted = [...values.entries()]
			.filter(([value]) =>
				field === "category_id"
					? known.has(value)
					: field === "monthly_budget_id"
						? active.has(value)
						: true,
			)
			.sort(([, a], [, b]) => b.weight - a.weight)
		if (field === "title" || field === "people" || field === "location")
			ranked[field] = sorted.map(([value]) => value)
		for (const [value, entry] of sorted.slice(0, CHIP_LIMIT[field])) {
			if (entry.weight / evidence < MIN_SHARE) continue
			const count = pluralize(entry.records.size, "past Record")
			chips.push({
				field,
				value,
				reason:
					entry.byTitle * 2 > entry.weight
						? `Learned from ${count} titled “${entry.latest.title}”`
						: `Learned from ${count} like “${entry.latest.title}”`,
			})
		}
	}

	// A charge that repeats monthly belongs with the recurring Monthly Budget.
	const recurringBudget = monthlyBudgets.find(b => !b.archived && b.pace_kind === "recurring")
	const groups =
		recurringBudget && !input.before && !chips.some(c => c.field === "monthly_budget_id")
			? recurringGroups(model, allStatements, now)
			: []
	if (recurringBudget && input.statements.some(s => groups.some(g => g.ids.has(s.id))))
		chips.push({
			field: "monthly_budget_id",
			value: recurringBudget.id,
			reason: "Charged every month",
		})

	return { chips, ranked }
}

export async function recordSuggestions(input: { statementIds: string[]; title?: string }) {
	const tables = await loadTables()
	const ids = new Set(input.statementIds)
	return suggest(createModel(tables), tables, {
		statements: tables.statements.filter(s => ids.has(s.id)),
		title: input.title,
	})
}

/** Other allocable Statements that look like the same activity as the selection. */
export async function similarStatements(statementIds: string[]) {
	if (!statementIds.length) return []
	const tables = await loadTables()
	const model = createModel(tables)
	const selected = tables.statements.filter(s => statementIds.includes(s.id))
	const ids = new Set(
		tables.statements
			.filter(
				candidate =>
					!statementIds.includes(candidate.id) &&
					selected.some(
						s =>
							Math.sign(s.amount) === Math.sign(candidate.amount) &&
							model.similarity(
								model.tokensOf.get(s.id) ?? [],
								model.tokensOf.get(candidate.id) ?? [],
							) >= SAME_ACTIVITY,
					),
			)
			.map(s => s.id),
	)
	if (!ids.size) return []
	// A Duplicate Statement repeats activity that already has its own Record.
	return (await listStatements({ is_allocable: "true" }))
		.filter(s => ids.has(s.id) && !s.is_duplicate)
		.slice(0, 20)
}

/**
 * Groups outgoing Statements by their two most telling words, then keeps groups charged in
 * consecutive months for a steady amount.
 */
function recurringGroups(model: Model, statements: StatementRow[], today: DateTime) {
	const groups = new Map<string, StatementRow[]>()
	for (const statement of statements) {
		if (statement.amount >= 0) continue
		const key = model
			.keyTokens(model.tokensOf.get(statement.id) ?? [])
			.slice(0, 2)
			.join(" ")
		if (!key) continue
		const group = groups.get(key)
		if (group) group.push(statement)
		else groups.set(key, [statement])
	}
	return [...groups.entries()].flatMap(([key, rows]) => {
		const sorted = rows.sort((a, b) => a.datetime.localeCompare(b.datetime))
		const months = [...new Map(sorted.map(s => [s.datetime.slice(0, 7), s])).values()]
		const recent = months.slice(-4)
		if (recent.length < 3) return []
		const dates = recent.map(s => parseDatetime(s.datetime))
		const monthly = dates.slice(1).every((date, i) => {
			const gap = date.diff(dates[i] ?? date, "days").days
			return gap >= 20 && gap <= 40
		})
		const amounts = recent.map(s => Math.abs(s.amount)).sort((a, b) => a - b)
		const median = amounts[Math.floor(amounts.length / 2)] ?? 0
		const steady = amounts.every(amount => Math.abs(amount - median) <= median * 0.2)
		const last = dates.at(-1)
		if (!monthly || !steady || !last || today.diff(last, "days").days > 70) return []
		return [{ key, ids: new Set(rows.map(s => s.id)), median, last, latest: recent.at(-1) }]
	})
}

/** Monthly charges whose next Statement has not arrived within five days of its usual date. */
export async function recurringCharges(): Promise<RecurringCharge[]> {
	const tables = await loadTables()
	const model = createModel(tables)
	const today = DateTime.now().startOf("day")
	const titles = new Map<string, string>()
	for (const example of model.examples) titles.set(example.statement.id, example.record.title)
	return recurringGroups(model, tables.statements, today)
		.map(group => {
			const expected = group.last.plus({ months: 1 })
			const label =
				[...group.ids].map(id => titles.get(id)).findLast(Boolean) ??
				maskDescription(group.latest?.description ?? group.key)
			return {
				key: group.key,
				label,
				// The most telling word finds the group's Statements in the Statements search.
				query: group.key.split(" ")[0] ?? group.key,
				amount: -round2(group.median),
				last: group.last.toISODate() ?? "",
				expected: expected.toISODate() ?? "",
				overdue: today > expected.plus({ days: 5 }),
			}
		})
		.sort((a, b) => a.expected.localeCompare(b.expected))
}

/**
 * Proposes autofill rules from repeated decisions: a phrase from the bank descriptions
 * qualifies when enough labelled Statements contain it and nearly all went to one Category.
 * Each proposal carries its own dry run (matches and agreeing Statements) as evidence.
 */
export async function suggestedStatementRules(): Promise<RuleSuggestion[]> {
	const tables = await loadTables()
	const model = createModel(tables)
	const rules = await db.statement_rules.toArray()
	const labelled = new Map<string, RecordRow>()
	for (const example of model.examples) labelled.set(example.statement.id, example.record)

	const phrases = new Set<string>()
	for (const example of model.examples) {
		const tokens = example.tokens.filter(token => model.weight(token))
		for (const [i, token] of tokens.entries()) {
			// Short words also match inside longer ones ("din" in "dinner").
			if (token.length >= 4) phrases.add(token)
			const next = tokens[i + 1]
			if (next) phrases.add(`${token} ${next}`)
		}
	}

	// Same test as a case-insensitive "contains" condition, without a RegExp per Statement.
	const descriptions = tables.statements.map(s => s.description.toLowerCase())
	const candidates = [...phrases].flatMap(phrase => {
		const matched = tables.statements.filter((_, i) => descriptions[i]?.includes(phrase))
		const records = matched.flatMap(s => labelled.get(s.id) ?? [])
		if (records.length < RULE_SUPPORT) return []
		const consensus = (field: RuleField) => {
			const counts = new Map<string, number>()
			for (const record of records) {
				const value = FIELD_VALUES[field](record)
				if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
			}
			const [value, count] = [...counts.entries()].sort(([, a], [, b]) => b - a)[0] ?? []
			return value && (count ?? 0) / records.length >= RULE_PURITY
				? { value, count: count ?? 0 }
				: null
		}
		const category = consensus("category_id")
		if (!category) return []
		return [{ phrase, matched, category, consensus }]
	})

	// A longer phrase that keeps nearly all of a word's agreeing Statements is the clearer rule.
	const specific = candidates.filter(
		candidate =>
			!candidates.some(
				other =>
					other.phrase.length > candidate.phrase.length &&
					other.phrase.includes(candidate.phrase) &&
					other.category.value === candidate.category.value &&
					other.category.count >= candidate.category.count * 0.9,
			),
	)
	const covered = new Set<string>()
	const suggestions: RuleSuggestion[] = []
	for (const candidate of specific.sort(
		(a, b) =>
			b.category.count - a.category.count ||
			// Prefer the more specific phrase when two cover the same Statements.
			b.phrase.length - a.phrase.length,
	)) {
		const ids = candidate.matched.map(s => s.id)
		if (ids.filter(id => covered.has(id)).length * 2 >= ids.length) continue
		const ruled = candidate.matched.filter(s => rules.some(rule => matchesStatement(rule, s)))
		if (ruled.length * 2 >= ids.length) continue
		for (const id of ids) covered.add(id)

		const actions: RuleActions = { category_id: { value: candidate.category.value } }
		for (const field of ["title", "people", "location", "monthly_budget_id"] as const) {
			const agreed = candidate.consensus(field)
			if (agreed) actions[field] = { value: agreed.value }
		}
		const sample = candidate.matched[0]?.description ?? candidate.phrase
		const start = sample.toLowerCase().indexOf(candidate.phrase)
		const text =
			start >= 0 ? sample.slice(start, start + candidate.phrase.length) : candidate.phrase
		suggestions.push({
			key: candidate.phrase,
			name:
				actions.title?.value ??
				text.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()),
			conditions: { mode: "all", items: [{ operator: "contains", value: text }] },
			actions,
			matches: candidate.matched.length,
			agreeing: candidate.category.count,
		})
	}
	return suggestions.slice(0, 6)
}

/**
 * Replays the workspace in date order: each Record with allocated Statements is predicted
 * from earlier Records only, as if it were being created then, and the top chip per field
 * is scored against what the user actually chose.
 */
export async function suggestionAccuracy(): Promise<SuggestionAccuracy> {
	const tables = await loadTables()
	const model = createModel(tables)
	const statements = new Map(tables.statements.map(s => [s.id, s]))
	const allocated = new Map<string, StatementRow[]>()
	for (const allocation of tables.allocations) {
		const statement = statements.get(allocation.statement_id)
		if (statement)
			allocated.set(allocation.record_id, [
				...(allocated.get(allocation.record_id) ?? []),
				statement,
			])
	}
	const fields = ["category_id", "title", "people", "location"] as const
	const score = Object.fromEntries(fields.map(field => [field, { hits: 0, total: 0 }]))
	const replayed = tables.records
		.filter(record => allocated.has(record.id))
		.sort((a, b) => a.datetime.localeCompare(b.datetime))
	for (const record of replayed) {
		const { chips } = suggest(model, tables, {
			statements: allocated.get(record.id) ?? [],
			before: record.datetime,
			exclude: record.id,
		})
		for (const field of fields) {
			const actual = FIELD_VALUES[field](record)
			if (!actual) continue
			const entry = score[field]
			if (!entry) continue
			entry.total++
			if (chips.find(chip => chip.field === field)?.value === actual) entry.hits++
		}
	}
	return {
		records: replayed.length,
		fields: fields.map(field => ({ field, ...(score[field] ?? { hits: 0, total: 0 }) })),
	}
}
