// Starter data for fresh workspaces, plus a one-time repair for workspaces
// where the original seed skipped both lists after finding either one populated.

import { db } from "@/data/db"
import { DEFAULT_BUCKETS, DEFAULT_CATEGORIES } from "@/data/defaults"
import { slugify } from "@/logic/shared"

export async function seedIfEmpty(): Promise<void> {
	// The marker makes repair one-time, so users can later remove all starter
	// categories or buckets without having them recreated on every visit.
	return db.transaction("rw", [db.meta, db.buckets, db.categories], async () => {
		if (await db.meta.get("seeded_v2")) return

		const existingBuckets = await db.buckets.toArray()
		const bucketsByName = new Map(existingBuckets.map(bucket => [bucket.name, bucket.id]))
		const legacyHoliday = existingBuckets.find(
			bucket =>
				bucket.name === "Holiday" &&
				bucket.color === "#fb7185" &&
				bucket.group === "outlier" &&
				bucket.pace_kind === "none" &&
				bucket.display_order === 40,
		)
		if (!bucketsByName.has("Travel") && legacyHoliday) {
			await db.buckets.update(legacyHoliday.id, { name: "Travel" })
			bucketsByName.set("Travel", legacyHoliday.id)
		}
		for (const bucket of DEFAULT_BUCKETS) {
			if (bucketsByName.has(bucket.name)) continue
			const id = crypto.randomUUID()
			await db.buckets.add({ id, ...bucket, archived: false })
			bucketsByName.set(bucket.name, id)
		}

		if ((await db.categories.count()) === 0) {
			for (const category of DEFAULT_CATEGORIES) {
				await db.categories.add({
					id: slugify(category.name),
					name: category.name,
					icon: category.icon,
					color: category.color,
					parent_category_id: null,
					analytics_treatment: category.treatment,
					default_bucket_id: category.bucket
						? (bucketsByName.get(category.bucket) ?? null)
						: null,
				})
			}
		}

		await db.meta.put({ key: "seeded_v2", value: "1" })
	})
}
