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

/** Statements this alike are the same kind of activity, so one Record shape fits them all. */
const SAME_ACTIVITY = 0.8
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
	/** Where the charge's history lives: Records by their Title, or Statements by a word. */
	source: "records" | "statements"
	query: string
	amount: number
	/** Where the charge sits in the asked month: when it was charged, or when it is expected. */
	date: string
	status: "charged" | "due" | "late"
	expected: string
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
	fields: {
		field: RuleField
		hits: number
		total: number
		unwanted: number
		/** The wrong first suggestions given most often, against what the user chose instead. */
		misses: { offered: string; actual: string; count: number }[]
		weights: Weights
	}[]
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

/** Lower-case words of a bank description in any script; numbers and reference codes drop out. */
export function descriptionTokens(description: string): string[] {
	const tokens = description
		.toLowerCase()
		.match(/[\p{L}\p{M}\p{N}]+/gu)
		?.flatMap(chunk => {
			// Digits only at the edges are part of a name ("7ELEVEN", "25JAN"); letters and
			// digits interleaved make a reference code ("AWBP8DAGWKCFAV"), which says nothing.
			const letters = chunk.match(/^\p{N}*([\p{L}\p{M}]+)\p{N}*$/u)?.[1]
			if (!letters) return []
			// Scripts written without spaces (Chinese, Japanese, Korean) compare by character pairs.
			if (
				/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(
					letters,
				)
			) {
				const chars = [...letters]
				return chars.length === 1
					? chars
					: chars.slice(1).map((char, i) => `${chars[i]}${char}`)
			}
			return letters.length > 1 ? [letters] : []
		})
	return [...new Set(tokens)]
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
 * little while merchant names decide.
 */
function createModel({ statements, records, allocations }: Tables) {
	const frequency = new Map<string, number>()
	const tokensOf = new Map<string, string[]>()
	for (const statement of statements) {
		const words = descriptionTokens(statement.description)
		// Blank descriptions (interest credits, some transfers) still resemble each other.
		const tokens = words.length ? words : ["∅"]
		tokensOf.set(statement.id, tokens)
		for (const token of tokens) frequency.set(token, (frequency.get(token) ?? 0) + 1)
	}
	// A word seen only once (a new merchant, or a reference code) cannot match anything, but it
	// still makes a description less like the others, at half the weight of the rarest shared word.
	const weight = (token: string) => {
		const count = frequency.get(token) ?? 0
		// Wording on every Statement counts for almost nothing, yet a workspace with a single
		// merchant still matches it.
		return count < 2
			? Math.log((statements.length + 1) / 2) / 2
			: Math.log(1 + (statements.length - count + 0.5) / (count + 0.5))
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
			.filter(token => (frequency.get(token) ?? 0) > 1)
			.sort((a, b) => weight(b) - weight(a))
			.slice(0, 3)

	// A Statement split across many Records (a wallet top-up, a shared bill) says little about
	// any one of them.
	const shares = new Map<string, number>()
	for (const allocation of allocations)
		shares.set(allocation.statement_id, (shares.get(allocation.statement_id) ?? 0) + 1)
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

	// Past Statements alike enough, scored twice: as the same merchant (every word counts), and as
	// the same kind of payment (only words seen elsewhere count, so a new merchant's name is set
	// aside and "TRANSFER TO <someone new>" still resembles other transfers).
	const neighbours = (tokens: string[], threshold: number) => {
		const known = tokens.filter(token => (frequency.get(token) ?? 0) > 1)
		const seen = new Set<Example>()
		const result: { example: Example; similarity: number; shape: number }[] = []
		for (const token of keyTokens(tokens))
			for (const example of postings.get(token) ?? []) {
				if (seen.has(example)) continue
				seen.add(example)
				const score = similarity(tokens, example.tokens)
				const shape = similarity(
					known,
					example.tokens.filter(t => (frequency.get(t) ?? 0) > 1),
				)
				if (Math.max(score, shape) >= threshold)
					result.push({ example, similarity: score, shape })
			}
		return result
	}

	// Records by title, for what a typed title usually comes with.
	const titled = new Map<string, RecordRow[]>()
	for (const record of records) {
		const key = record.title.toLowerCase()
		const list = titled.get(key)
		if (list) list.push(record)
		else titled.set(key, [record])
	}
	// Every People value split into its names ("Sam & Alex" → sam, alex), to spot them in bank
	// text.
	const firstUse = new Map<string, string>()
	for (const record of records)
		if (record.people && !(record.datetime >= (firstUse.get(record.people) ?? "~")))
			firstUse.set(record.people, record.datetime)
	const people = [...firstUse].map(([value, first]) => ({
		people: value,
		names: value.split(/\s*(?:[&,+/]|\band\b)\s*/i).map(descriptionTokens),
		first,
	}))

	// Each Record's time, parsed once: learning reads it tens of thousands of times. Midnight
	// stands for an unknown time.
	const times = new Map<string, { ms: number; hour: number | null }>()
	for (const record of records) {
		const at = parseDatetime(record.datetime)
		times.set(record.id, {
			ms: at.toMillis(),
			hour: record.datetime.endsWith(" 00:00") ? null : at.hour,
		})
	}

	return {
		tokensOf,
		weight,
		/** Whether a word appears in more than one Statement, so it can match anything. */
		shared: (token: string) => (frequency.get(token) ?? 0) > 1,
		similarity,
		keyTokens,
		neighbours,
		examples,
		shares,
		titled,
		people,
		times,
	}
}
type Model = ReturnType<typeof createModel>

/**
 * How much each signal counts when suggesting one field. Nothing here is tuned to one person:
 * learnWeights fits these to each workspace by replaying its own history, so a user whose
 * vending machine prices tell drinks apart gets a price boost, and a user who changes habits
 * every term gets a short memory.
 */
export type Weights = {
	/** Days after which a past Record counts half as much. */
	halfLife: number
	/** Boost for a past Statement of exactly the same amount (its square root within 15%). */
	price: number
	/** Boost for a past Record within an hour of the entered time (its square root within three
	 * hours, its inverse root further away). */
	hour: number
	/** How much Records with the typed title count against Records from similar Statements. */
	title: number
	/** How alike two bank descriptions must be to count as the same merchant. */
	threshold: number
	/** How much the same kind of payment counts when the merchant itself is new. */
	shape: number
}
export type LearnedWeights = {
	fields: Record<RuleField, Weights>
	/** Whether names in bank text have pointed to the right People in this workspace. */
	namedPeople: boolean
}

/** Neutral starting point: no signal is favoured until a workspace's own history shows it helps.
 * Also used for a field without enough history to learn from. */
export const DEFAULT_WEIGHTS: Weights = {
	halfLife: 180,
	price: 1,
	hour: 1,
	title: 1,
	threshold: 0.5,
	shape: 0,
}
const CHOICES: { [K in keyof Weights]: number[] } = {
	halfLife: [14, 30, 60, 120, 240, 480, 100_000],
	price: [1, 2, 4, 8],
	hour: [1, 2, 4],
	title: [0, 0.5, 1, 2, 4],
	threshold: [0.35, 0.5, 0.7],
	shape: [0, 0.1, 0.3, 1],
}
/** Replays needed before a field's weights move away from the defaults. */
const MIN_CASES = 20
/** Most recent Records replayed when learning; older ones still serve as history. */
const LEARN_SAMPLE = 300

/** A past Record that might inform a suggestion, with the raw signals its weight comes from. */
type Clue = {
	record: RecordRow
	similarity: number
	shape: number
	days: number
	price: "same" | "near" | "other"
	hours: number | null
	shares: number
}
type Evidence = { statements: Clue[]; titled: { record: RecordRow; days: number }[] }

/** Collects every past Record that could count, before any weights apply. */
function gather(
	model: Model,
	input: {
		statements: StatementRow[]
		title?: string
		datetime?: string
		before?: string
		exclude?: string
	},
): Evidence {
	const now = input.before
		? parseDatetime(input.before)
		: DateTime.max(
				DateTime.now(),
				...input.statements.map(s => parseDatetime(s.datetime)).filter(d => d.isValid),
			)
	const usable = (record: RecordRow) =>
		record.id !== input.exclude && (!input.before || record.datetime < input.before)
	const nowMs = now.toMillis()
	const days = (record: RecordRow) =>
		Math.max(0, (nowMs - (model.times.get(record.id)?.ms ?? nowMs)) / 86_400_000)
	// Midnight stands for an unknown time.
	const at = input.datetime ? parseDatetime(input.datetime.replace("T", " ")) : null
	const hour = at?.isValid && at.toFormat("HH:mm") !== "00:00" ? at.hour : null

	const statements: Clue[] = []
	for (const statement of input.statements) {
		const tokens = model.tokensOf.get(statement.id) ?? descriptionTokens(statement.description)
		for (const { example, similarity, shape } of model.neighbours(
			tokens,
			Math.min(...CHOICES.threshold),
		)) {
			if (!usable(example.record)) continue
			if (Math.sign(statement.amount) !== Math.sign(example.statement.amount)) continue
			const ratio =
				statement.amount && example.statement.amount
					? Math.abs(Math.log(statement.amount / example.statement.amount))
					: 1
			const then = model.times.get(example.record.id)?.hour ?? null
			const gap = hour === null || then === null ? null : Math.abs(hour - then)
			statements.push({
				record: example.record,
				similarity,
				shape,
				days: days(example.record),
				price:
					Math.abs(statement.amount - example.statement.amount) < 0.005
						? "same"
						: ratio < 0.15
							? "near"
							: "other",
				hours: gap === null ? null : Math.min(gap, 24 - gap),
				shares: model.shares.get(example.statement.id) ?? 1,
			})
		}
	}
	const titled = (model.titled.get(input.title?.trim().toLowerCase() ?? "") ?? [])
		.filter(usable)
		.map(record => ({ record, days: days(record) }))
	return { statements, titled }
}

/** Weight of one clue: likeness, age, price and hour, shared across a split Statement. */
function weigh(clue: Clue, w: Weights) {
	// The same merchant counts in full; only the same kind of payment counts as much as learned.
	const [likeness, trust] =
		clue.similarity >= w.threshold
			? [clue.similarity, 1]
			: clue.shape >= w.threshold
				? [clue.shape, w.shape]
				: [0, 0]
	if (!trust) return 0
	const price = clue.price === "same" ? w.price : clue.price === "near" ? Math.sqrt(w.price) : 1
	const hour =
		clue.hours === null
			? 1
			: clue.hours <= 1
				? w.hour
				: clue.hours <= 3
					? Math.sqrt(w.hour)
					: 1 / Math.sqrt(w.hour)
	return (likeness ** 2 * trust * 0.5 ** (clue.days / w.halfLife) * price * hour) / clue.shares
}

type Tally = {
	total: number
	values: Map<string, { weight: number; records: Set<string>; latest: RecordRow }>
}

function tally(field: RuleField, clues: { record: RecordRow; weight: number }[]): Tally {
	const result: Tally = { total: 0, values: new Map() }
	for (const { record, weight } of clues) {
		if (!weight) continue
		// Records that left the field empty still count, so a rarely filled field gets no chip.
		result.total += weight
		const value = FIELD_VALUES[field](record)
		if (!value) continue
		const entry = result.values.get(value) ?? { weight: 0, records: new Set(), latest: record }
		entry.weight += weight
		entry.records.add(record.id)
		if (record.datetime > entry.latest.datetime) entry.latest = record
		result.values.set(value, entry)
	}
	return result
}

/**
 * Ranks a field's values. Records from similar Statements are one source; Records with the
 * typed title are the other, weighted against it as learned, and stand in alone when no
 * Statement is selected.
 */
function rank(evidence: Evidence, field: RuleField, w: Weights) {
	const byStatements = tally(
		field,
		evidence.statements.map(clue => ({ record: clue.record, weight: weigh(clue, w) })),
	)
	const byTitle =
		field === "title"
			? undefined
			: tally(
					field,
					evidence.titled.map(({ record, days }) => ({
						record,
						weight: 0.5 ** (days / w.halfLife),
					})),
				)
	const sources = [
		{ tally: byStatements, weight: 1, kind: "like" },
		{ tally: byTitle, weight: byStatements.total ? w.title : 1, kind: "titled" },
	].flatMap(source =>
		source.tally?.total && source.weight ? [{ ...source, tally: source.tally }] : [],
	)
	const scale = sources.reduce((sum, source) => sum + source.weight, 0)
	const scores = new Map<string, { score: number; lead: number; reason: string }>()
	for (const source of sources)
		for (const [value, entry] of source.tally.values) {
			const share = (entry.weight / source.tally.total) * (source.weight / scale)
			const current = scores.get(value) ?? { score: 0, lead: 0, reason: "" }
			scores.set(value, {
				score: current.score + share,
				...(share > current.lead
					? {
							lead: share,
							reason: `Learned from ${pluralize(entry.records.size, "past Record")} ${source.kind} “${entry.latest.title}”`,
						}
					: { lead: current.lead, reason: current.reason }),
			})
		}
	return [...scores.entries()].sort(([, a], [, b]) => b.score - a.score)
}

/**
 * The value a field's first chip would offer, if any: the same scores as rank without the
 * reasons, since learning asks this thousands of times.
 */
function topValue(evidence: Evidence, field: RuleField, w: Weights) {
	const scores = new Map<string, number>()
	const add = (clues: { record: RecordRow; weight: number }[], share: number) => {
		const total = clues.reduce((sum, clue) => sum + clue.weight, 0)
		if (!total) return 0
		for (const { record, weight } of clues) {
			const value = FIELD_VALUES[field](record)
			if (value && weight)
				scores.set(value, (scores.get(value) ?? 0) + (weight / total) * share)
		}
		return share
	}
	const statements = evidence.statements.map(clue => ({
		record: clue.record,
		weight: weigh(clue, w),
	}))
	const titled =
		field === "title"
			? []
			: evidence.titled.map(({ record, days }) => ({
					record,
					weight: 0.5 ** (days / w.halfLife),
				}))
	const fromStatements = add(statements, 1)
	const fromTitle = add(titled, fromStatements ? w.title : 1)
	const scale = fromStatements + fromTitle
	let best: string | null = null
	let top = 0
	for (const [value, score] of scores)
		if (score > top) {
			top = score
			best = value
		}
	return best && scale && top / scale >= MIN_SHARE ? best : null
}

function allocatedStatements(tables: Tables) {
	const statements = new Map(tables.statements.map(s => [s.id, s]))
	const allocated = new Map<string, StatementRow[]>()
	for (const allocation of tables.allocations) {
		const statement = statements.get(allocation.statement_id)
		if (!statement) continue
		const list = allocated.get(allocation.record_id)
		if (list) list.push(statement)
		else allocated.set(allocation.record_id, [statement])
	}
	return allocated
}

const byDate = (records: RecordRow[]) =>
	[...records].sort((a, b) => a.datetime.localeCompare(b.datetime))

/** Records with allocated Statements, oldest first: the ones a replay can score. */
function replayable(tables: Tables, allocated: Map<string, StatementRow[]>) {
	return byDate(tables.records.filter(record => allocated.has(record.id)))
}

/**
 * The People value whose names all appear in the selected Statements' bank text (a transfer
 * "From: TAN ALEX"), naming the most people. Each name must sit within one description.
 */
function namedPeople(model: Model, statements: StatementRow[], before?: string) {
	const descriptions = statements.map(s => new Set(descriptionTokens(s.description)))
	return (
		model.people
			.filter(
				({ names, first }) =>
					(!before || first < before) &&
					names.every(
						name =>
							name.length &&
							descriptions.some(words => name.every(word => words.has(word))),
					),
			)
			.sort((a, b) => b.names.length - a.names.length)[0]?.people ?? null
	)
}

/**
 * Replays each sampled Record as if it were being created then, from earlier Records only, with
 * its title and time filled in as the creator would have them; manual Records teach the fields
 * a title leads. For every field, one weight at a time moves to whichever choice gets the most
 * first chips right on the older three quarters, and must win by two percent (and two Records).
 * The result stays only if it also does at least as well as the defaults on the newest quarter,
 * so a lucky fit does not stick.
 */
function learnWeights(
	model: Model,
	sample: RecordRow[],
	allocated: Map<string, StatementRow[]>,
): LearnedWeights {
	const cases = sample.map(record => {
		const statements = allocated.get(record.id) ?? []
		return {
			record,
			statements,
			evidence: gather(model, {
				statements,
				title: record.title,
				datetime: record.datetime,
				before: record.datetime,
				exclude: record.id,
			}),
		}
	})
	const fields = {} as Record<RuleField, Weights>
	for (const field of Object.keys(FIELD_VALUES) as RuleField[]) {
		const relevant = cases.flatMap(({ record, statements, evidence }) => {
			const actual = FIELD_VALUES[field](record)
			// A title can only be suggested from bank text.
			return actual && (field !== "title" || statements.length) ? [{ actual, evidence }] : []
		})
		const hits = (list: typeof relevant, w: Weights) =>
			list.filter(({ actual, evidence }) => topValue(evidence, field, w) === actual).length
		const train = relevant.slice(0, Math.floor(relevant.length * 0.75))
		const check = relevant.slice(train.length)
		let weights = { ...DEFAULT_WEIGHTS }
		if (train.length >= MIN_CASES) {
			let best = hits(train, weights)
			const margin = Math.max(2, train.length * 0.02)
			for (let pass = 0; pass < 2; pass++)
				for (const key of Object.keys(CHOICES) as (keyof Weights)[])
					for (const choice of CHOICES[key]) {
						const trial = { ...weights, [key]: choice }
						const score = hits(train, trial)
						if (score > best + margin) {
							best = score
							weights = trial
						}
					}
			if (hits(check, weights) < hits(check, DEFAULT_WEIGHTS))
				weights = { ...DEFAULT_WEIGHTS }
		}
		fields[field] = weights
	}

	// Names in bank text stay a signal only while they have pointed to the right People more
	// often than not; in some workspaces they are merchants or the user's own name.
	let right = 0
	let wrong = 0
	for (const { record, statements } of cases) {
		const named = namedPeople(model, statements, record.datetime)
		if (named === null) continue
		if (named === record.people) right++
		else wrong++
	}
	return { fields, namedPeople: right >= wrong }
}

// Learning replays a few hundred Records, so the result is kept until the workspace changes.
let cachedWeights: { key: string; weights: LearnedWeights } | undefined
function workspaceWeights(model: Model, tables: Tables) {
	const key = [
		tables.records.length,
		tables.allocations.length,
		tables.statements.length,
		tables.records.reduce((sum, r) => sum + r.revision, 0),
	].join(":")
	if (cachedWeights?.key !== key)
		cachedWeights = {
			key,
			weights: learnWeights(
				model,
				byDate(tables.records).slice(-LEARN_SAMPLE),
				allocatedStatements(tables),
			),
		}
	return cachedWeights.weights
}

/**
 * Ranks every field value the matching past Records used, with this workspace's learned
 * weights, and offers the leaders as chips with their reasons. Replays pass `before` and
 * `exclude` so only earlier Records count, and skip the recurring check.
 */
function suggest(
	model: Model,
	{ categories, monthlyBudgets, statements: allStatements }: Tables,
	weights: LearnedWeights,
	input: {
		statements: StatementRow[]
		title?: string
		datetime?: string
		before?: string
		exclude?: string
	},
) {
	const evidence = gather(model, input)
	const active = new Set(monthlyBudgets.filter(b => !b.archived).map(b => b.id))
	const known = new Set(categories.map(c => c.id))
	const chips: RecordSuggestion[] = []
	const ranked = { title: [] as string[], people: [] as string[], location: [] as string[] }
	for (const field of Object.keys(FIELD_VALUES) as RuleField[]) {
		const sorted = rank(evidence, field, weights.fields[field]).filter(([value]) =>
			field === "category_id"
				? known.has(value)
				: field === "monthly_budget_id"
					? active.has(value)
					: true,
		)
		if (field === "title" || field === "people" || field === "location")
			ranked[field] = sorted.map(([value]) => value)
		for (const [value, { score, reason }] of sorted.slice(0, CHIP_LIMIT[field]))
			if (score >= MIN_SHARE) chips.push({ field, value, reason })
	}

	// People named in the bank text lead, ahead of the learned guesses, where names have proved
	// reliable for this workspace.
	const named = weights.namedPeople ? namedPeople(model, input.statements, input.before) : null
	if (named) {
		const at = chips.findIndex(c => c.field === "people")
		const rest = chips.filter(c => !(c.field === "people" && c.value === named))
		rest.splice(at < 0 ? rest.length : at, 0, {
			field: "people",
			value: named,
			reason: "Named in the Statement",
		})
		chips.splice(0, chips.length, ...rest)
		ranked.people = [named, ...ranked.people.filter(p => p !== named)]
	}

	// A monthly charge goes where its earlier charges went, or else to a recurring Monthly
	// Budget.
	const group =
		input.before || chips.some(c => c.field === "monthly_budget_id")
			? undefined
			: recurringGroups(model, allStatements, DateTime.now()).find(g =>
					input.statements.some(s => g.ids.has(s.id)),
				)
	if (group) {
		const counts = new Map<string, number>()
		for (const example of model.examples)
			if (group.ids.has(example.statement.id) && example.record.monthly_budget_id)
				counts.set(
					example.record.monthly_budget_id,
					(counts.get(example.record.monthly_budget_id) ?? 0) + 1,
				)
		const usual = [...counts.entries()]
			.filter(([id]) => active.has(id))
			.sort(([, a], [, b]) => b - a)[0]?.[0]
		const value =
			usual ?? monthlyBudgets.find(b => !b.archived && b.pace_kind === "recurring")?.id
		if (value) chips.push({ field: "monthly_budget_id", value, reason: "Charged every month" })
	}

	return { chips, ranked }
}

/** Learns this workspace's weights ahead of time, so the Record creator opens without the wait. */
export async function prepareSuggestions() {
	const tables = await loadTables()
	workspaceWeights(createModel(tables), tables)
}

export async function recordSuggestions(input: {
	statementIds: string[]
	title?: string
	datetime?: string
}) {
	const tables = await loadTables()
	const model = createModel(tables)
	const ids = new Set(input.statementIds)
	return suggest(model, tables, workspaceWeights(model, tables), {
		statements: tables.statements.filter(s => ids.has(s.id)),
		title: input.title,
		datetime: input.datetime,
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

type Occurrence = { id: string; at: DateTime; amount: number }

/**
 * A monthly pattern: the last few occurrences each came about a month apart for a steady
 * amount, and the latest is recent. Every occurrence counts, so a weekly habit never passes for
 * a monthly one, and gaps rather than calendar months absorb banks posting a few days late.
 */
function monthlyPattern(occurrences: Occurrence[], today: DateTime) {
	const recent = occurrences.toSorted((a, b) => a.at.toMillis() - b.at.toMillis()).slice(-4)
	if (recent.length < 3) return null
	const monthly = recent.slice(1).every((o, i) => {
		const gap = o.at.diff(recent[i]?.at ?? o.at, "days").days
		return gap >= 20 && gap <= 40
	})
	const amounts = recent.map(o => Math.abs(o.amount)).sort((a, b) => a - b)
	const median = amounts[Math.floor(amounts.length / 2)] ?? 0
	const steady = amounts.every(amount => Math.abs(amount - median) <= median * 0.25)
	const last = recent.at(-1)?.at
	if (!monthly || !steady || !last || today.diff(last, "days").days > 70) return null
	return { median, last }
}

/** Outgoing Statements grouped by account and their two most telling words. */
function statementGroups(model: Model, statements: StatementRow[]) {
	const groups = new Map<string, StatementRow[]>()
	for (const statement of statements) {
		if (statement.amount >= 0) continue
		const words = model
			.keyTokens(model.tokensOf.get(statement.id) ?? [])
			.slice(0, 2)
			.join(" ")
		if (!words) continue
		const key = `${statement.account_id} ${words}`
		groups.set(key, [...(groups.get(key) ?? []), statement])
	}
	return groups
}

/** Statement groups with a monthly pattern, for the "Charged every month" suggestion. */
function recurringGroups(model: Model, statements: StatementRow[], today: DateTime) {
	return [...statementGroups(model, statements).entries()].flatMap(([key, rows]) => {
		const pattern = monthlyPattern(
			rows.map(s => ({ id: s.id, at: parseDatetime(s.datetime), amount: s.amount })),
			today,
		)
		return pattern ? [{ key, ids: new Set(rows.map(s => s.id)), ...pattern }] : []
	})
}

/**
 * Monthly charges and where each sits in `month` (the current month by default).
 *
 * Records come first: grouped by the user's own Title, they repeat even when the bank text
 * changes each month or one prepaid Statement covers a year of monthly Records. A Statement
 * that has arrived but is not yet recorded still counts for its Record group when it shares
 * the group's account and telling words. Statements nobody recorded form their own groups, so
 * a workspace without Records still finds its charges.
 */
export async function recurringCharges(month?: string): Promise<RecurringCharge[]> {
	const tables = await loadTables()
	const model = createModel(tables)
	const today = DateTime.now().startOf("day")
	const start = month ? DateTime.fromISO(month).startOf("month") : today.startOf("month")
	const current = start.hasSame(today, "month")

	const allocated = new Map<string, string[]>()
	for (const a of tables.allocations)
		allocated.set(a.statement_id, [...(allocated.get(a.statement_id) ?? []), a.record_id])
	const statementKey = new Map<string, string>()
	for (const [key, rows] of statementGroups(model, tables.statements))
		for (const s of rows) statementKey.set(s.id, key)
	const recordStatements = new Map<string, string[]>()
	for (const a of tables.allocations)
		recordStatements.set(a.record_id, [
			...(recordStatements.get(a.record_id) ?? []),
			a.statement_id,
		])

	const titled = new Map<string, RecordRow[]>()
	for (const record of tables.records) {
		const title = record.title.trim().toLowerCase()
		if (record.amount < 0 && title) titled.set(title, [...(titled.get(title) ?? []), record])
	}
	const charges: (Omit<RecurringCharge, "date" | "status" | "expected"> & {
		dates: DateTime[]
	})[] = []
	const covered = new Set<string>()
	for (const records of titled.values()) {
		const occurrences = records.map(r => ({
			id: r.id,
			at: parseDatetime(r.datetime),
			amount: r.amount,
		}))
		const ids = records.flatMap(r => recordStatements.get(r.id) ?? [])
		const keys = new Set(ids.flatMap(id => statementKey.get(id) ?? []))
		const newest = Math.max(...occurrences.map(o => o.at.toMillis()))
		const arrived = tables.statements
			.filter(
				s =>
					!allocated.has(s.id) &&
					keys.has(statementKey.get(s.id) ?? "") &&
					parseDatetime(s.datetime).toMillis() > newest + 15 * 86_400_000,
			)
			.map(s => ({ id: s.id, at: parseDatetime(s.datetime), amount: s.amount }))
		const pattern = monthlyPattern([...occurrences, ...arrived], today)
		if (!pattern) continue
		for (const id of [...ids, ...arrived.map(o => o.id)]) covered.add(id)
		const latest = records.toSorted((a, b) => a.datetime.localeCompare(b.datetime)).at(-1)
		charges.push({
			key: `records ${latest?.title.trim().toLowerCase()}`,
			label: latest?.title ?? "",
			source: "records",
			query: latest?.title ?? "",
			amount: -round2(pattern.median),
			dates: [...occurrences, ...arrived].map(o => o.at),
		})
	}
	for (const [key, rows] of statementGroups(
		model,
		tables.statements.filter(s => !covered.has(s.id)),
	)) {
		const occurrences = rows.map(s => ({
			id: s.id,
			at: parseDatetime(s.datetime),
			amount: s.amount,
		}))
		const pattern = monthlyPattern(occurrences, today)
		// Recorded Statements belong to their Records' groups, even when those are not monthly.
		if (rows.some(s => allocated.has(s.id)) || !pattern) continue
		const words = key.slice(key.indexOf(" ") + 1)
		const latest = rows.toSorted((a, b) => a.datetime.localeCompare(b.datetime)).at(-1)
		charges.push({
			key: `statements ${key}`,
			label: maskDescription(latest?.description ?? words),
			source: "statements",
			// The most telling word finds the group's Statements in the Statements search.
			query: words.split(" ")[0] ?? words,
			amount: -round2(pattern.median),
			dates: occurrences.map(o => o.at),
		})
	}

	return charges
		.flatMap(({ dates, ...charge }): RecurringCharge[] => {
			const sorted = dates.toSorted((a, b) => a.toMillis() - b.toMillis())
			const first = sorted[0]
			const last = sorted.at(-1)
			if (!first || !last) return []
			const expected = last.plus({ months: 1 })
			const charged = sorted.find(d => d.hasSame(start, "month"))
			const base = { ...charge, expected: expected.toISODate() ?? "" }
			if (charged) return [{ ...base, date: charged.toISODate() ?? "", status: "charged" }]
			// Months before the charge began, or after it stopped, have nothing to show.
			if (start < first.startOf("month")) return []
			if (start < today.startOf("month")) {
				if (start > last) return []
				return [
					{
						...base,
						date:
							start
								.set({ day: Math.min(last.day, start.daysInMonth ?? 28) })
								.toISODate() ?? "",
						status: "late",
					},
				]
			}
			const date = current
				? expected
				: start.set({ day: Math.min(last.day, start.daysInMonth ?? 28) })
			return [
				{
					...base,
					date: date.toISODate() ?? "",
					status:
						current && today > expected.plus({ days: 5 })
							? ("late" as const)
							: ("due" as const),
				},
			]
		})
		.sort((a, b) => a.date.localeCompare(b.date))
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

	// Bank boilerplate (card and payment-method prefixes) spreads across many Categories;
	// a phrase containing it would miss the same merchant paid by another card.
	const spread = new Map<string, Set<string>>()
	for (const example of model.examples)
		for (const token of example.tokens)
			spread.set(token, (spread.get(token) ?? new Set()).add(example.record.category_id))
	const crowded = Math.max(
		3,
		Math.ceil(new Set(model.examples.map(e => e.record.category_id)).size / 4),
	)
	const phrases = new Set<string>()
	for (const example of model.examples) {
		const tokens = example.tokens.filter(
			token => model.shared(token) && (spread.get(token)?.size ?? 0) < crowded,
		)
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

/** The workspace as it stood before `before`: earlier Records and their Allocations, and the
 * Statements imported by `through`. */
function asOf(tables: Tables, before: string, through = before): Tables {
	const records = tables.records.filter(r => r.datetime < before)
	const ids = new Set(records.map(r => r.id))
	return {
		...tables,
		records,
		allocations: tables.allocations.filter(a => ids.has(a.record_id)),
		statements: tables.statements.filter(s => s.datetime.slice(0, 10) <= through.slice(0, 10)),
	}
}

/**
 * Measures the chips the creator would have shown. Weights are learned only from Records before
 * the newest third; that third is then predicted in steps, each from a model of only what
 * existed before it (word rarity included), as if each Record were being created with its
 * title and time filled in. Chips offered for a field the user left empty count against it.
 */
export async function suggestionAccuracy(): Promise<SuggestionAccuracy> {
	const tables = await loadTables()
	const allocated = allocatedStatements(tables)
	const replayed = replayable(tables, allocated)
	const split = replayed.length >= MIN_CASES * 3 ? Math.floor((replayed.length * 2) / 3) : 0
	const history = asOf(tables, replayed[split]?.datetime ?? "")
	const weights = learnWeights(
		createModel(history),
		byDate(history.records).slice(-LEARN_SAMPLE),
		allocatedStatements(history),
	)
	const scored = replayed.slice(split)
	const fields = (["category_id", "title", "people", "location"] as const).map(field => ({
		field,
		hits: 0,
		total: 0,
		unwanted: 0,
		misses: [] as { offered: string; actual: string; count: number }[],
		weights: weights.fields[field],
	}))
	const steps = 8
	for (let step = 0; step < steps; step++) {
		const chunk = scored.slice(
			Math.floor((step * scored.length) / steps),
			Math.floor(((step + 1) * scored.length) / steps),
		)
		const [first] = chunk
		if (!first) continue
		const known = asOf(tables, first.datetime, chunk.at(-1)?.datetime)
		const model = createModel(known)
		for (const record of chunk) {
			const { chips } = suggest(model, known, weights, {
				statements: allocated.get(record.id) ?? [],
				title: record.title,
				datetime: record.datetime,
				before: record.datetime,
				exclude: record.id,
			})
			for (const entry of fields) {
				const actual = FIELD_VALUES[entry.field](record)
				const offered = chips.find(chip => chip.field === entry.field)?.value
				if (!actual) {
					if (offered) entry.unwanted++
					continue
				}
				entry.total++
				if (offered === actual) entry.hits++
				else if (offered) {
					const miss = entry.misses.find(
						m => m.offered === offered && m.actual === actual,
					)
					if (miss) miss.count++
					else entry.misses.push({ offered, actual, count: 1 })
				}
			}
		}
	}
	for (const entry of fields)
		entry.misses = entry.misses
			.filter(m => m.count > 1)
			.sort((a, b) => b.count - a.count)
			.slice(0, 2)
	return { records: scored.length, fields }
}
