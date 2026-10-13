import { db, type StatementRow } from "@/data/db"
import { removeStatementDismissals } from "@/logic/duplicate-dismissals"
import { toCents } from "@/logic/shared"
import { Validator } from "@/logic/validate"

const GENERIC = new Set(
	"fast payment othr debit purchase via to paynow uen mobile qx qxvia nets qr xx s".split(" "),
)

// Exact word bags permit bank word reordering without a fuzzy threshold.
// Numeric sequences and mixed reference IDs retain their internal order.
// Split spacing-sensitive prefix tokens consistently; retain every digit and token count.
function descriptionIdentity(description: string) {
	return (
		description
			.toLowerCase()
			.replace(/\(\s*qxvia(?=\s+paynow[-\s]+(?:mobile|uen)\b)/g, "(qx via")
			.match(/[a-z]+|\d+/g) ?? []
	).sort()
}

function descriptionAnchors(description: string) {
	return `${(description.match(/\d+/g) ?? []).join("|")}::${[
		...(description
			.toLowerCase()
			.replace(/\bs(?=\d{1,2}[/.-])/g, "s ")
			.match(/\b(?=[a-z0-9]*[a-z])(?=[a-z0-9]*\d)[a-z0-9]+\b/g) ?? []),
		...(description.match(/\d{1,4}[/.-]\d{1,2}[/.-]\d{1,4}/g) ?? []),
	]
		.sort()
		.join("|")}`
}

function strongMatch(a: string, b: string) {
	const left = descriptionIdentity(a)
	const right = descriptionIdentity(b)
	return (
		descriptionAnchors(a) === descriptionAnchors(b) &&
		left.some(token => /^[a-z]+$/.test(token) && !GENERIC.has(token)) &&
		left.length > 0 &&
		left.join("|") === right.join("|")
	)
}

function eligible(a: StatementRow, b: StatementRow) {
	return (
		a.id !== b.id &&
		a.is_pending === 0 &&
		b.is_pending === 0 &&
		a.account_id === b.account_id &&
		a.datetime.slice(0, 10) === b.datetime.slice(0, 10) &&
		toCents(a.amount) === toCents(b.amount)
	)
}

function pairIds(a: string, b: string): [string, string] {
	return a < b ? [a, b] : [b, a]
}

export type DuplicateGroup = { id: string; statements: StatementRow[]; pairs: [string, string][] }

export async function duplicateGroups(manual = false): Promise<DuplicateGroup[]> {
	const rows = (await db.statements.toArray())
		.filter(s => s.is_pending === 0)
		.sort((a, b) => a.id.localeCompare(b.id))
	const dismissed = new Set(
		(await db.duplicate_dismissals.toArray()).map(p =>
			JSON.stringify([p.statement_id, p.other_statement_id]),
		),
	)
	const buckets = new Map<string, StatementRow[]>()
	for (const row of rows) {
		const key = JSON.stringify([row.account_id, row.datetime.slice(0, 10), toCents(row.amount)])
		const bucket = buckets.get(key) ?? []
		bucket.push(row)
		buckets.set(key, bucket)
	}
	const groups: DuplicateGroup[] = []
	for (const bucket of buckets.values()) {
		const pairs: [string, string][] = []
		for (let i = 0; i < bucket.length; i++)
			for (let j = i + 1; j < bucket.length; j++) {
				const a = bucket[i]
				const b = bucket[j]
				if (
					a &&
					b &&
					(manual ||
						(!dismissed.has(JSON.stringify(pairIds(a.id, b.id))) &&
							strongMatch(a.description, b.description)))
				)
					pairs.push(pairIds(a.id, b.id))
			}
		const unseen = new Set(pairs.flat())
		while (unseen.size) {
			const first = unseen.values().next().value as string
			const connected = new Set([first])
			unseen.delete(first)
			const queue = [first]
			for (const id of queue)
				for (const [a, b] of pairs) {
					const next = a === id ? b : b === id ? a : null
					if (next && !connected.has(next)) {
						connected.add(next)
						unseen.delete(next)
						queue.push(next)
					}
				}
			groups.push({
				id: first,
				statements: bucket.filter(s => connected.has(s.id)),
				pairs: pairs.filter(([a, b]) => connected.has(a) && connected.has(b)),
			})
		}
	}
	return groups.sort((a, b) =>
		(b.statements[0]?.datetime ?? "").localeCompare(a.statements[0]?.datetime ?? ""),
	)
}

export async function dismissedDuplicatePairs() {
	const rows = new Map((await db.statements.toArray()).map(s => [s.id, s]))
	return (await db.duplicate_dismissals.toArray()).flatMap(p => {
		const a = rows.get(p.statement_id)
		const b = rows.get(p.other_statement_id)
		return a && b ? [{ statements: [a, b] as [StatementRow, StatementRow] }] : []
	})
}

export async function dismissDuplicatePair(first: string, second: string) {
	const v = new Validator()
	const a = v.text(first, "statement_id")
	const b = v.text(second, "other_statement_id")
	v.throwIfInvalid()
	await db.transaction("rw", [db.statements, db.duplicate_dismissals], async () => {
		const left = await db.statements.get(a)
		const right = await db.statements.get(b)
		if (!left || !right || !eligible(left, right))
			v.reject(
				"statements",
				"Choose two imported statements with the same account, day, and signed amount.",
			)
		v.throwIfInvalid()
		const [statement_id, other_statement_id] = pairIds(a, b)
		await db.duplicate_dismissals.put({ statement_id, other_statement_id })
	})
}

export async function restoreDuplicatePair(first: string, second: string) {
	const v = new Validator()
	const a = v.text(first, "statement_id")
	const b = v.text(second, "other_statement_id")
	v.throwIfInvalid()
	await db.duplicate_dismissals.delete(pairIds(a, b))
}

export type FixDuplicatesInput = {
	survivor_id: string
	delete_ids: string[]
	allocation_source_id?: string
}

export async function duplicateReview(ids: string[]) {
	const statements = await db.statements.bulkGet(ids)
	const allocations = await db.allocations.where("statement_id").anyOf(ids).toArray()
	const records = await db.records.bulkGet([...new Set(allocations.map(a => a.record_id))])
	return {
		statements: statements.filter((s): s is StatementRow => !!s),
		allocations,
		records: records.filter(r => !!r),
	}
}

export async function fixDuplicates(input: FixDuplicatesInput): Promise<string[]> {
	const v = new Validator()
	const survivorId = v.text(input.survivor_id, "survivor_id")
	const deletedIds = (Array.isArray(input.delete_ids) ? input.delete_ids : []).map(id =>
		v.text(id, "delete_ids"),
	)
	if (
		!deletedIds.length ||
		new Set(deletedIds).size !== deletedIds.length ||
		deletedIds.includes(survivorId)
	)
		v.reject(
			"delete_ids",
			"Select distinct duplicate statements to delete, excluding the preserved statement.",
		)
	const sourceId =
		input.allocation_source_id === undefined
			? undefined
			: v.text(input.allocation_source_id, "allocation_source_id")
	v.throwIfInvalid()

	return db.transaction(
		"rw",
		[db.statements, db.allocations, db.duplicate_dismissals],
		async () => {
			const survivor = await db.statements.get(survivorId)
			const deleted = await db.statements.bulkGet(deletedIds)
			if (!survivor || deleted.some(s => !s || !eligible(survivor, s)))
				v.reject(
					"statements",
					"Statements changed. Choose imported statements with the same account, day, and signed amount.",
				)
			v.throwIfInvalid()
			if (!survivor) throw new Error("Statement unavailable.")
			const allocations = await db.allocations
				.where("statement_id")
				.anyOf([survivorId, ...deletedIds])
				.toArray()
			const survivorAllocated = allocations.some(a => a.statement_id === survivorId)
			const sources = [
				...new Set(
					allocations.filter(a => a.statement_id !== survivorId).map(a => a.statement_id),
				),
			]
			let source = survivorAllocated
				? survivorId
				: sources.length === 1
					? sources[0]
					: sourceId
			if (
				sourceId &&
				(survivorAllocated ? sourceId !== survivorId : !sources.includes(sourceId))
			)
				v.reject(
					"allocation_source_id",
					"Choose an allocated statement from this selection.",
				)
			if (!survivorAllocated && sources.length > 1 && !sourceId)
				v.reject(
					"allocation_source_id",
					"Choose which statement's allocations to preserve.",
				)
			if (!sources.length && !survivorAllocated) source = undefined
			const moved =
				source && source !== survivorId
					? allocations.filter(a => a.statement_id === source)
					: []
			const cents = moved.map(a => toCents(a.amount))
			if (
				cents.some(
					a =>
						!Number.isFinite(a) ||
						a === 0 ||
						Math.sign(a) !== Math.sign(toCents(survivor.amount)),
				) ||
				Math.abs(cents.reduce((sum, a) => sum + a, 0)) > Math.abs(toCents(survivor.amount))
			)
				v.reject(
					"allocation_source_id",
					"The selected allocations have an invalid direction or exceed the preserved statement's capacity.",
				)
			v.throwIfInvalid()
			await db.allocations.where("statement_id").anyOf(deletedIds).delete()
			if (moved.length)
				await db.allocations.bulkAdd(moved.map(a => ({ ...a, statement_id: survivorId })))
			await removeStatementDismissals(deletedIds)
			await db.statements.bulkDelete(deletedIds)
			return [...new Set(allocations.map(a => a.record_id))].sort()
		},
	)
}
