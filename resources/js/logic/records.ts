// Mirrors `Api\RecordController`, `Api\RecordBucketController`,
// `Api\CompletionsController`, and `Record::appQuery`.

import { db } from "@/data/db"
import { inputToStored, newId, round2, ValidationError } from "@/logic/shared"
import type { AnalyticsTreatment } from "@/types"

export type RecordFilters = {
	query?: string | null
	exclude_budget_id?: string | null
	start_date?: string | null
	end_date?: string | null
	is_allocated?: string | null
	category_ids?: string[] | null
	bucket_id?: string | null
	bucket_group?: string | null
	show_unbucketed?: boolean
	treatment?: string | null
}

export class ConflictError extends Error {
	stale_ids?: string[]
	constructor(message: string, stale_ids?: string[]) {
		super(message)
		this.name = "ConflictError"
		this.stale_ids = stale_ids
	}
}

function subtitle(people: string | null, location: string | null): string | null {
	let out = ""
	if (people) out += `w/ ${people}`
	if (location) out += out ? ` @ ${location}` : `@ ${location}`
	return out || null
}

async function enrich(
	rows: {
		id: string
		title: string
		people: string | null
		location: string | null
		description: string | null
		datetime: string
		amount: number
		category_id: string
		analytics_treatment: AnalyticsTreatment
		analytics_treatment_source: "category" | "manual"
		bucket_id: string | null
		bucket_source: "category" | "manual" | null
		revision: number
	}[],
) {
	const categories = new Map((await db.categories.toArray()).map(c => [c.id, c]))
	const buckets = new Map((await db.buckets.toArray()).map(b => [b.id, b]))
	const allocations = await db.allocations.toArray()
	const byRecord = new Map<string, { sum: number; count: number }>()
	for (const allocation of allocations) {
		const entry = byRecord.get(allocation.record_id) ?? { sum: 0, count: 0 }
		entry.sum = round2(entry.sum + allocation.amount)
		entry.count++
		byRecord.set(allocation.record_id, entry)
	}
	return rows.map(row => {
		const entry = byRecord.get(row.id) ?? { sum: 0, count: 0 }
		const allocated_amount = entry.sum
		const category = categories.get(row.category_id)
		return {
			...row,
			allocated_amount,
			statement_count: entry.count,
			is_pending: allocated_amount !== row.amount || entry.count === 0,
			subtitle: subtitle(row.people, row.location),
			category: category
				? {
						...category,
						analytics_treatment: category.analytics_treatment as
							| import("@/types").AnalyticsTreatment
							| null,
						can_delete: false,
						records_count: 0,
						default_bucket: category.default_bucket_id
							? (buckets.get(category.default_bucket_id) ?? null)
							: null,
					}
				: {
						id: row.category_id,
						name: row.category_id,
						icon: "circle-question-mark",
						color: "#9E9E9E",
						parent_category_id: null,
						analytics_treatment: null,
						default_bucket_id: null,
						can_delete: false,
						records_count: 0,
						default_bucket: null,
					},
			bucket: row.bucket_id ? (buckets.get(row.bucket_id) ?? null) : null,
		}
	})
}

async function expandCategoryIds(ids: string[]): Promise<string[]> {
	if (!ids.length) return ids
	const categories = await db.categories.toArray()
	const childrenByParent = new Map<string, string[]>()
	for (const category of categories) {
		if (category.parent_category_id) {
			const list = childrenByParent.get(category.parent_category_id) ?? []
			list.push(category.id)
			childrenByParent.set(category.parent_category_id, list)
		}
	}
	const expanded = new Set(ids)
	for (const id of ids) {
		for (const child of childrenByParent.get(id) ?? []) expanded.add(child)
	}
	return [...expanded]
}

export async function listRecords(filters: RecordFilters = {}) {
	let rows = await db.records.toArray()

	const q = (filters.query ?? "").trim().toLowerCase()
	if (q) {
		rows = rows.filter(
			record =>
				record.title.toLowerCase().includes(q) ||
				(record.people ?? "").toLowerCase().includes(q) ||
				(record.location ?? "").toLowerCase().includes(q) ||
				(record.description ?? "").toLowerCase().includes(q) ||
				String(record.amount).includes(q),
		)
	}
	const { start_date, end_date } = filters
	if (start_date) rows = rows.filter(r => r.datetime.slice(0, 10) >= start_date)
	if (end_date) rows = rows.filter(r => r.datetime.slice(0, 10) <= end_date)
	if (filters.category_ids?.length) {
		const expanded = new Set(await expandCategoryIds(filters.category_ids))
		rows = rows.filter(r => expanded.has(r.category_id))
	}
	if (filters.bucket_id) rows = rows.filter(r => r.bucket_id === filters.bucket_id)
	if (filters.bucket_group) {
		const buckets = new Map((await db.buckets.toArray()).map(b => [b.id, b]))
		rows = rows.filter(
			r => r.bucket_id && buckets.get(r.bucket_id)?.group === filters.bucket_group,
		)
	}
	if (filters.show_unbucketed) rows = rows.filter(r => r.bucket_id === null)
	if (filters.treatment) rows = rows.filter(r => r.analytics_treatment === filters.treatment)
	if (filters.exclude_budget_id) {
		const attached = new Set(
			(
				await db.budget_records
					.where("budget_id")
					.equals(filters.exclude_budget_id)
					.toArray()
			).map(r => r.record_id),
		)
		rows = rows.filter(r => !attached.has(r.id))
	}

	let enriched = await enrich(rows)

	if (filters.is_allocated === "1" || filters.is_allocated === "true") {
		enriched = enriched.filter(r => r.allocated_amount === r.amount && r.statement_count > 0)
	} else if (
		filters.is_allocated === "0" ||
		filters.is_allocated === "false" ||
		filters.is_allocated === "false"
	) {
		enriched = enriched.filter(r => !(r.allocated_amount === r.amount && r.statement_count > 0))
	}

	enriched.sort(
		(a, b) =>
			b.datetime.localeCompare(a.datetime) ||
			a.amount - b.amount ||
			a.title.localeCompare(b.title) ||
			(a.people ?? "").localeCompare(b.people ?? "") ||
			(a.location ?? "").localeCompare(b.location ?? "") ||
			(a.description ?? "").localeCompare(b.description ?? ""),
	)
	return enriched
}

export async function getRecord(id: string) {
	const row = await db.records.get(id)
	if (!row) throw new Error("Record not found.")
	const [enriched] = await enrich([row])
	const allocations = await db.allocations.where("record_id").equals(id).toArray()
	const statementIds = allocations.map(a => a.statement_id)
	const statements = statementIds.length
		? await db.statements.where("id").anyOf(statementIds).toArray()
		: []
	const amountByStatement = new Map(allocations.map(a => [a.statement_id, a.amount]))
	const accounts = new Map((await db.accounts.toArray()).map(a => [a.id, a]))
	return {
		...enriched,
		statements: statements.map(statement => ({
			...statement,
			is_pending: statement.is_pending === 1,
			pivot: { amount: amountByStatement.get(statement.id) ?? 0 },
			account: accounts.get(statement.account_id) ?? null,
		})),
	}
}

export type RecordStatementInput = { id: string; amount: number }

export type RecordInput = {
	title: string
	people?: string | null
	location?: string | null
	description?: string | null
	datetime: string
	amount: number
	category_id: string
	analytics_treatment?: string | null
	bucket_id?: string | null
	bucket_source?: string | null
	statements?: RecordStatementInput[]
}

const TREATMENTS = ["income", "spending", "saving_investment", "neutral", "automatic"]

function validateRecordInput(input: RecordInput) {
	const errors: Record<string, string[]> = {}
	if (!input.title?.trim()) errors.title = ["The title field is required."]
	if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input.datetime)) {
		errors.datetime = ["Enter a valid date and time."]
	}
	const amount = Number(input.amount)
	if (!Number.isFinite(amount)) errors.amount = ["Enter a valid amount."]
	if (!input.category_id) errors.category_id = ["Select a category."]
	if (input.analytics_treatment && !TREATMENTS.includes(input.analytics_treatment)) {
		errors.analytics_treatment = ["Invalid treatment."]
	}
	if (Object.keys(errors).length) throw new ValidationError(errors)
	return { ...input, amount: round2(amount) }
}

async function analyticsValues(
	input: RecordInput,
	category: { id: string; analytics_treatment: string | null; default_bucket_id: string | null },
	existingBucketId: string | null = null,
): Promise<{
	analytics_treatment: AnalyticsTreatment
	analytics_treatment_source: "category" | "manual"
	bucket_id: string | null
	bucket_source: "category" | "manual" | null
}> {
	const explicitTreatment = input.analytics_treatment || null
	const treatment = (explicitTreatment ??
		category.analytics_treatment ??
		"automatic") as AnalyticsTreatment
	const eligible =
		treatment === "spending" || (treatment === "automatic" && Number(input.amount) < 0)
	const requestedBucket =
		"bucket_id" in input
			? input.bucket_id || null
			: (existingBucketId ?? category.default_bucket_id)
	const bucketId = eligible ? requestedBucket : null
	const requestedSource = input.bucket_source ?? null
	const bucketSource = !bucketId
		? null
		: requestedSource === "category" && bucketId === category.default_bucket_id
			? "category"
			: "manual"
	return {
		analytics_treatment: treatment,
		analytics_treatment_source: explicitTreatment ? "manual" : "category",
		bucket_id: bucketId,
		bucket_source: bucketSource as "category" | "manual" | null,
	}
}

async function validateAllocations(
	statements: RecordStatementInput[],
	existing: Map<string, number> = new Map(),
) {
	const errors: Record<string, string[]> = {}
	const ids = statements.map(s => s.id)
	const rows = ids.length ? await db.statements.where("id").anyOf(ids).toArray() : []
	const byId = new Map(rows.map(r => [r.id, r]))
	const allAllocations = await db.allocations.toArray()
	const sums = new Map<string, number>()
	for (const allocation of allAllocations) {
		sums.set(
			allocation.statement_id,
			round2((sums.get(allocation.statement_id) ?? 0) + allocation.amount),
		)
	}
	statements.forEach((item, index) => {
		const statement = byId.get(item.id)
		if (!statement) {
			errors[`statements.${index}.id`] = ["Invalid statement."]
			return
		}
		const amount = round2(Number(item.amount))
		if (!Number.isFinite(amount)) {
			errors[`statements.${index}.amount`] = ["Enter a valid amount."]
			return
		}
		const prior = existing.get(item.id) ?? 0
		const allocable = round2(statement.amount - (sums.get(item.id) ?? 0) + prior)
		if (statement.amount > 0) {
			if (amount <= 0) errors[`statements.${index}.amount`] = ["The amount must be positive."]
			else if (round2(allocable - amount) < 0) {
				errors[`statements.${index}.amount`] = [
					"This amount exceeds what can be allocated.",
				]
			}
		} else if (statement.amount < 0) {
			if (amount >= 0) errors[`statements.${index}.amount`] = ["The amount must be negative."]
			else if (round2(allocable - amount) > 0) {
				errors[`statements.${index}.amount`] = [
					"This amount exceeds what can be allocated.",
				]
			}
		}
	})
	if (Object.keys(errors).length) throw new ValidationError(errors)
}

function budgetCovers(budget: { start_date: string; end_date: string }, datetime: string): boolean {
	const day = datetime.slice(0, 10)
	return budget.start_date <= day && day <= budget.end_date
}

export async function createRecord(input: RecordInput) {
	const dto = validateRecordInput(input)
	const category = await db.categories.get(dto.category_id)
	if (!category) throw new ValidationError({ category_id: ["Select a category."] })
	const statements = dto.statements ?? []
	await validateAllocations(statements)

	return db.transaction(
		"rw",
		[db.records, db.allocations, db.budgets, db.budget_records],
		async () => {
			const analytics = await analyticsValues(dto, category)
			const id = newId()
			await db.records.add({
				id,
				title: dto.title.trim(),
				people: dto.people?.trim() || null,
				location: dto.location?.trim() || null,
				description: dto.description?.trim() || null,
				datetime: inputToStored(dto.datetime),
				amount: dto.amount,
				category_id: dto.category_id,
				...analytics,
				revision: 1,
			})
			for (const item of statements) {
				await db.allocations.add({
					statement_id: item.id,
					record_id: id,
					amount: round2(Number(item.amount)),
				})
			}
			const stored = await db.records.get(id)
			if (!stored) throw new Error("Record not found.")
			const budgets = (await db.budgets.toArray()).filter(
				b => b.automatic && budgetCovers(b, stored.datetime),
			)
			for (const budget of budgets) {
				await db.budget_records.put({ budget_id: budget.id, record_id: id })
			}
			return stored
		},
	)
}

export async function updateRecord(id: string, input: RecordInput & { revision?: number }) {
	const dto = validateRecordInput(input)
	const existing = await db.records.get(id)
	if (!existing) throw new Error("Record not found.")
	if (input.revision !== undefined && Number(input.revision) !== existing.revision) {
		throw new ConflictError("This Record changed while you were editing it.")
	}
	const category = await db.categories.get(dto.category_id)
	if (!category) throw new ValidationError({ category_id: ["Select a category."] })
	const statements = dto.statements ?? []
	const currentAllocations = await db.allocations.where("record_id").equals(id).toArray()
	const prior = new Map(currentAllocations.map(a => [a.statement_id, a.amount]))
	await validateAllocations(statements, prior)

	return db.transaction("rw", [db.records, db.allocations], async () => {
		const analytics = await analyticsValues(dto, category, existing.bucket_id)
		await db.records.update(id, {
			title: dto.title.trim(),
			people: dto.people?.trim() || null,
			location: dto.location?.trim() || null,
			description: dto.description?.trim() || null,
			datetime: inputToStored(dto.datetime),
			amount: dto.amount,
			category_id: dto.category_id,
			...analytics,
			revision: existing.revision + 1,
		})
		await db.allocations.where("record_id").equals(id).delete()
		for (const item of statements) {
			await db.allocations.add({
				statement_id: item.id,
				record_id: id,
				amount: round2(Number(item.amount)),
			})
		}
		const updated = await db.records.get(id)
		if (!updated) throw new Error("Record not found.")
		return updated
	})
}

export async function deleteRecord(id: string) {
	await db.transaction("rw", [db.records, db.allocations, db.budget_records], async () => {
		await db.allocations.where("record_id").equals(id).delete()
		await db.budget_records.where("record_id").equals(id).delete()
		await db.records.delete(id)
	})
}

export async function updateRecordBuckets(
	items: { id: string; revision: number }[],
	bucketId: string | null,
) {
	if (!items.length) throw new ValidationError({ records: ["Select at least one record."] })
	if (bucketId) {
		const bucket = await db.buckets.get(bucketId)
		if (!bucket) throw new ValidationError({ bucket_id: ["Invalid bucket."] })
		if (bucket.archived)
			throw new ValidationError({ bucket_id: ["Archived buckets cannot receive Records."] })
	}
	return db.transaction("rw", [db.records], async () => {
		const rows = await db.records
			.where("id")
			.anyOf(items.map(i => i.id))
			.toArray()
		const byId = new Map(rows.map(r => [r.id, r]))
		const stale = items.filter(item => (byId.get(item.id)?.revision ?? -1) !== item.revision)
		if (stale.length) {
			throw new ConflictError(
				"Some Records changed while you were working.",
				stale.map(s => s.id),
			)
		}
		if (bucketId) {
			const ineligible = rows.filter(
				record =>
					record.analytics_treatment !== "spending" &&
					!(record.analytics_treatment === "automatic" && record.amount < 0),
			)
			if (ineligible.length) {
				throw new ValidationError({
					records: [
						`${ineligible.length} selected Record(s) are not classified as spending.`,
					],
				})
			}
		}
		for (const record of rows) {
			await db.records.update(record.id, {
				bucket_id: bucketId,
				bucket_source: bucketId ? "manual" : null,
				revision: record.revision + 1,
			})
		}
		return { updated: rows.length }
	})
}

export async function recordCompletions() {
	const records = await db.records.toArray()
	const unique = (values: (string | null)[]) =>
		[...new Set(values.filter((v): v is string => !!v?.trim()))].sort((a, b) =>
			a.localeCompare(b),
		)
	return {
		titles: unique(records.map(r => r.title)),
		locations: unique(records.map(r => r.location)),
		peoples: unique(records.map(r => r.people)),
	}
}
