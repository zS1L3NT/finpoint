// Mirrors `Api\BucketController` + bucket target/default handling.

import { db } from "@/data/db"
import { newId } from "@/logic/shared"
import { ValidationError, Validator } from "@/logic/validate"

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
	const v = new Validator()
	const name = v.text(input.name, "name")
	const color = v.text(input.color, "color")
	const group = v.oneOf(input.group, "group", GROUPS, "Invalid group.")
	const pace_kind = v.oneOf(input.pace_kind, "pace_kind", PACE_KINDS, "Invalid pace.")
	v.throwIfInvalid()

	if (await db.buckets.where("name").equals(name).first()) {
		throw new ValidationError({ name: ["This bucket name is already taken."] })
	}
	const max = (await db.buckets.toArray()).reduce((m, b) => Math.max(m, b.display_order), 0)
	const row = {
		id: newId(),
		name,
		color,
		group: group ?? "other",
		pace_kind: pace_kind ?? "none",
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

	const v = new Validator()
	const name = v.text(input.name, "name")
	const color = v.text(input.color, "color")
	v.throwIfInvalid()

	const clash = await db.buckets.where("name").equals(name).first()
	if (clash && clash.id !== id) {
		throw new ValidationError({ name: ["This bucket name is already taken."] })
	}
	const group = v.oneOf(input.group, "group", GROUPS) ?? existing.group
	let pace_kind = v.oneOf(input.pace_kind, "pace_kind", PACE_KINDS) ?? existing.pace_kind
	v.throwIfInvalid()
	if (group === "outlier") pace_kind = "none"

	await db.buckets.update(id, {
		name,
		color,
		group,
		pace_kind,
		archived: !!input.archived,
	})
	const saved = await db.buckets.get(id)
	if (!saved) throw new Error("Bucket not found.")

	return saved
}

export async function setBucketTarget(
	bucketId: string,
	input: { month: string; amount: unknown; scope: string },
) {
	const v = new Validator()
	const month = v.date(input.month, "month", "Invalid month.")
	const scope = v.oneOf(input.scope, "scope", ["month", "default"] as const, "Invalid scope.")
	const amount =
		input.amount === null || input.amount === undefined || input.amount === ""
			? null
			: v.amount(input.amount, "amount", "Amount must be zero or more.")
	if (amount !== null && amount < 0) v.reject("amount", "Amount must be zero or more.")
	v.throwIfInvalid()

	if (scope === "month") {
		await db.bucket_targets.put({ bucket_id: bucketId, month, amount })
	} else {
		await db.bucket_defaults.put({ bucket_id: bucketId, effective_month: month, amount })
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
