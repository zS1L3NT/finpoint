// First-run seed. Mirrors `database/seeders/DatabaseSeeder.php` plus the
// quota -> bucket backfill from migration 0020 so a fresh browser starts with
// the same categories, treatments, and core buckets a fresh Laravel install had.

import { db } from "@/data/db"
import { slugify as slug } from "@/logic/shared"
import type { AnalyticsTreatment } from "@/types"

function treatmentFor(id: string): AnalyticsTreatment {
	if (["salary", "interest"].includes(id)) return "income"
	if (["investments", "investment"].includes(id)) return "saving_investment"
	if (["transfer", "claim", "loan"].includes(id)) return "neutral"
	if (["gift", "class", "classes"].includes(id)) return "automatic"
	return "spending"
}

type SeedChild = { name: string; icon: string }
type SeedCategory = { name: string; icon: string; color: string; children?: SeedChild[] }

const CATEGORIES: SeedCategory[] = [
	{
		name: "Electronics & Software",
		icon: "cpu",
		color: "#546CFE",
		children: [
			{ name: "Device", icon: "monitor-smartphone" },
			{ name: "SIM Card", icon: "card-sim" },
			{ name: "ESIM Card", icon: "card-sim" },
			{ name: "Multimedia", icon: "folder-code" },
		],
	},
	{ name: "Other", icon: "circle-question-mark", color: "#9E9E9E" },
	{
		name: "Transfer",
		icon: "arrow-left-right",
		color: "#01BFA5",
		children: [
			{ name: "Salary", icon: "dollar-sign" },
			{ name: "Claim", icon: "hand-coins" },
			{ name: "Gift", icon: "gift" },
			{ name: "Investment", icon: "chart-candlestick" },
			{ name: "Loan", icon: "handshake" },
		],
	},
	{
		name: "Transport",
		icon: "navigation",
		color: "#AB47BD",
		children: [
			{ name: "Airplane", icon: "plane" },
			{ name: "Bicycle", icon: "bike" },
			{ name: "Taxi", icon: "car-taxi-front" },
			{ name: "Train & Bus", icon: "train-front" },
		],
	},
	{
		name: "Health & Personal Care",
		icon: "heart-pulse",
		color: "#FFB300",
		children: [
			{ name: "Cosmetic", icon: "mirror-round" },
			{ name: "Haircut", icon: "scissors" },
			{ name: "Healthcare", icon: "hospital" },
		],
	},
	{
		name: "Clothing & Footwear",
		icon: "shopping-bag",
		color: "#4FC3F7",
		children: [
			{ name: "Accessories", icon: "hat-glasses" },
			{ name: "Clothes", icon: "shirt" },
			{ name: "Shoes", icon: "footprints" },
		],
	},
	{
		name: "Food & Drinks",
		icon: "utensils",
		color: "#F44336",
		children: [
			{ name: "Grocery", icon: "apple" },
			{ name: "Coffee", icon: "coffee" },
			{ name: "Restaurant", icon: "soup" },
			{ name: "Alcohol", icon: "wine" },
			{ name: "Dessert", icon: "ice-cream-bowl" },
			{ name: "Sweet Drink", icon: "cup-soda" },
		],
	},
	{
		name: "Leisure & Hobby",
		icon: "party-popper",
		color: "#64DD17",
		children: [
			{ name: "Venue Rental", icon: "warehouse" },
			{ name: "Class", icon: "book-open" },
			{ name: "Concert", icon: "ticket" },
			{ name: "Equipment", icon: "toolbox" },
			{ name: "Instrument", icon: "guitar" },
			{ name: "Membership", icon: "id-card" },
			{ name: "Merchandise", icon: "heart" },
			{ name: "Movie", icon: "film" },
		],
	},
]

const BUCKETS = [
	{ name: "Daily", color: "#38bdf8", group: "core", pace_kind: "daily", display_order: 10 },
	{
		name: "Recurring",
		color: "#a78bfa",
		group: "core",
		pace_kind: "recurring",
		display_order: 20,
	},
	{ name: "Irregular", color: "#fbbf24", group: "outlier", pace_kind: "none", display_order: 30 },
	{ name: "Holiday", color: "#fb7185", group: "outlier", pace_kind: "none", display_order: 40 },
] as const

export async function seedIfEmpty(): Promise<void> {
	// One transaction: the emptiness check and the writes must be atomic,
	// otherwise a concurrent import (or second tab) can slip rows in between
	// and the adds below collide with them.
	return db.transaction("rw", [db.meta, db.buckets, db.categories], async () => {
		if (await db.meta.get("seeded_v1")) return
		if ((await db.categories.count()) > 0 || (await db.buckets.count()) > 0) {
			await db.meta.put({ key: "seeded_v1", value: "1" })
			return
		}

		for (const bucket of BUCKETS) {
			await db.buckets.add({
				id: crypto.randomUUID(),
				name: bucket.name,
				color: bucket.color,
				group: bucket.group,
				pace_kind: bucket.pace_kind,
				display_order: bucket.display_order,
				archived: false,
			})
		}

		for (const category of CATEGORIES) {
			const id = slug(category.name)
			await db.categories.add({
				id,
				name: category.name,
				icon: category.icon,
				color: category.color,
				parent_category_id: null,
				analytics_treatment: treatmentFor(id),
				default_bucket_id: null,
			})
			for (const child of category.children ?? []) {
				const childId = slug(child.name)
				await db.categories.add({
					id: childId,
					name: child.name,
					icon: child.icon,
					color: category.color,
					parent_category_id: id,
					analytics_treatment: treatmentFor(childId),
					default_bucket_id: null,
				})
			}
		}

		await db.meta.put({ key: "seeded_v1", value: "1" })
	})
}
