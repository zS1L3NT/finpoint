// Mirrors `Api\BucketController` + bucket target/default handling.

import { db } from "@/data/db"
import { newId, round2, ValidationError } from "@/logic/shared"

const GROUPS = ["core", "outlier", "other"] as const
const PACE_KINDS = ["daily", "recurring", "none"] as const

export async function listBuckets() {
	return (await db.buckets.toArray()).sort((a, b) => a.display_order - b.display_order)
}

export async function createBucket(input: {
	name: string
	color: string
	group: string
	pace_kind: string
}) {
	const errors: Record<string, string[]> = {}
	const name = input.name?.trim()
	if (!name) errors.name = ["The name field is required."]
	if (!input.color?.trim()) errors.color = ["The color field is required."]
	if (!GROUPS.includes(input.group as (typeof GROUPS)[number])) errors.group = ["Invalid group."]
	if (!PACE_KINDS.includes(input.pace_kind as (typeof PACE_KINDS)[number]))
		errors.pace_kind = ["Invalid pace."]
	if (Object.keys(errors).length) throw new ValidationError(errors)
	if (await db.buckets.where("name").equals(name).first()) {
		throw new ValidationError({ name: ["This bucket name is already taken."] })
	}
	const max = (await db.buckets.toArray()).reduce((m, b) => Math.max(m, b.display_order), 0)
	const row = {
		id: newId(),
		name,
		color: input.color.trim(),
		group: input.group as (typeof GROUPS)[number],
		pace_kind: input.pace_kind as (typeof PACE_KINDS)[number],
		display_order: max + 10,
		archived: false,
	}
	await db.buckets.add(row)
	return row
}

export async function updateBucket(
	id: string,
	input: { name: string; color: string; group: string; pace_kind: string; archived: boolean },
) {
	const existing = await db.buckets.get(id)
	if (!existing) throw new Error("Bucket not found.")
	const name = input.name?.trim()
	if (!name) throw new ValidationError({ name: ["The name field is required."] })
	const clash = await db.buckets.where("name").equals(name).first()
	if (clash && clash.id !== id) {
		throw new ValidationError({ name: ["This bucket name is already taken."] })
	}
	const group = GROUPS.includes(input.group as (typeof GROUPS)[number])
		? input.group
		: existing.group
	let pace_kind = PACE_KINDS.includes(input.pace_kind as (typeof PACE_KINDS)[number])
		? input.pace_kind
		: existing.pace_kind
	if (group === "outlier") pace_kind = "none"
	await db.buckets.update(id, {
		name,
		color: input.color.trim(),
		group: group as typeof existing.group,
		pace_kind: pace_kind as typeof existing.pace_kind,
		archived: !!input.archived,
	})
	const saved = await db.buckets.get(id)
	if (!saved) throw new Error("Bucket not found.")
	return saved
}

export async function setBucketTarget(
	bucketId: string,
	input: { month: string; amount: number | null; scope: "month" | "default" },
) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(input.month)) {
		throw new ValidationError({ month: ["Invalid month."] })
	}
	if (!["month", "default"].includes(input.scope)) {
		throw new ValidationError({ scope: ["Invalid scope."] })
	}
	const amount =
		input.amount === null ||
		input.amount === undefined ||
		input.amount === ("" as unknown as null)
			? null
			: round2(Number(input.amount))
	if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
		throw new ValidationError({ amount: ["Amount must be zero or more."] })
	}
	if (input.scope === "month") {
		await db.bucket_targets.put({ bucket_id: bucketId, month: input.month, amount })
	} else {
		await db.bucket_defaults.put({ bucket_id: bucketId, effective_month: input.month, amount })
	}
}

export async function targetFor(bucketId: string, month: string): Promise<number | null> {
	const override = await db.bucket_targets.get([bucketId, month])
	if (override) return override.amount
	const defaults = await db.bucket_defaults.where("bucket_id").equals(bucketId).toArray()
	const eligible = defaults
		.filter(d => d.effective_month <= month)
		.sort((a, b) => (a.effective_month < b.effective_month ? 1 : -1))
	return eligible[0]?.amount ?? null
}
