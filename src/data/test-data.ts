// Abundant deterministic demo workspace for new users.
// Generates ~4-5 months of accounts, statements, records, allocations,
// budgets, buckets, and targets, then loads via importData (replaces all).
// Dates are relative to today so dashboards and comparisons look alive;
// the RNG is seeded so every load produces the same workspace.

import { DateTime } from "luxon"
import type { FinpointExport } from "@/data/export-import"

function mulberry32(seed: number) {
	let state = seed
	return () => {
		state |= 0
		state = (state + 0x6d2b79f5) | 0
		let t = Math.imul(state ^ (state >>> 15), 1 | state)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

const rand = mulberry32(20260914)

function pick<T>(items: T[]): T {
	const item = items[Math.floor(rand() * items.length)]
	if (item === undefined) throw new Error("Empty demo pool.")
	return item
}

function between(min: number, max: number): number {
	return Math.round((min + rand() * (max - min)) * 100) / 100
}

function pad(n: number): string {
	return String(n).padStart(2, "0")
}

function stamp(day: DateTime, hour: number, minute: number): string {
	return `${day.toFormat("yyyy-MM-dd")} ${pad(hour)}:${pad(minute)}`
}

type DemoCategory = {
	id: string
	name: string
	icon: string
	color: string
	parent: string | null
	treatment: "income" | "spending" | "saving_investment" | "neutral" | "automatic"
}

const CATEGORIES: DemoCategory[] = [
	{
		id: "salary",
		name: "Salary",
		icon: "dollar-sign",
		color: "#01BFA5",
		parent: "transfer",
		treatment: "income",
	},
	{
		id: "transfer",
		name: "Transfer",
		icon: "arrow-left-right",
		color: "#01BFA5",
		parent: null,
		treatment: "neutral",
	},
	{
		id: "investment",
		name: "Investment",
		icon: "chart-candlestick",
		color: "#01BFA5",
		parent: "transfer",
		treatment: "saving_investment",
	},
	{
		id: "gift",
		name: "Gift",
		icon: "gift",
		color: "#64DD17",
		parent: "leisure-hobby",
		treatment: "automatic",
	},
	{
		id: "restaurant",
		name: "Restaurant",
		icon: "soup",
		color: "#F44336",
		parent: "food-drinks",
		treatment: "spending",
	},
	{
		id: "coffee",
		name: "Coffee",
		icon: "coffee",
		color: "#F44336",
		parent: "food-drinks",
		treatment: "spending",
	},
	{
		id: "grocery",
		name: "Grocery",
		icon: "apple",
		color: "#F44336",
		parent: "food-drinks",
		treatment: "spending",
	},
	{
		id: "food-drinks",
		name: "Food & Drinks",
		icon: "utensils",
		color: "#F44336",
		parent: null,
		treatment: "spending",
	},
	{
		id: "train-bus",
		name: "Train & Bus",
		icon: "train-front",
		color: "#AB47BD",
		parent: "transport",
		treatment: "spending",
	},
	{
		id: "taxi",
		name: "Taxi",
		icon: "car-taxi-front",
		color: "#AB47BD",
		parent: "transport",
		treatment: "spending",
	},
	{
		id: "transport",
		name: "Transport",
		icon: "navigation",
		color: "#AB47BD",
		parent: null,
		treatment: "spending",
	},
	{
		id: "membership",
		name: "Membership",
		icon: "id-card",
		color: "#64DD17",
		parent: "leisure-hobby",
		treatment: "spending",
	},
	{
		id: "multimedia",
		name: "Multimedia",
		icon: "folder-code",
		color: "#546CFE",
		parent: "electronics-software",
		treatment: "spending",
	},
	{
		id: "electronics-software",
		name: "Electronics & Software",
		icon: "cpu",
		color: "#546CFE",
		parent: null,
		treatment: "spending",
	},
	{
		id: "clothes",
		name: "Clothes",
		icon: "shirt",
		color: "#4FC3F7",
		parent: "clothing-footwear",
		treatment: "spending",
	},
	{
		id: "clothing-footwear",
		name: "Clothing & Footwear",
		icon: "shopping-bag",
		color: "#4FC3F7",
		parent: null,
		treatment: "spending",
	},
	{
		id: "healthcare",
		name: "Healthcare",
		icon: "hospital",
		color: "#FFB300",
		parent: "health-personal-care",
		treatment: "spending",
	},
	{
		id: "health-personal-care",
		name: "Health & Personal Care",
		icon: "heart-pulse",
		color: "#FFB300",
		parent: null,
		treatment: "spending",
	},
	{
		id: "movie",
		name: "Movie",
		icon: "film",
		color: "#64DD17",
		parent: "leisure-hobby",
		treatment: "spending",
	},
	{
		id: "leisure-hobby",
		name: "Leisure & Hobby",
		icon: "party-popper",
		color: "#64DD17",
		parent: null,
		treatment: "spending",
	},
	{
		id: "airplane",
		name: "Airplane",
		icon: "plane",
		color: "#AB47BD",
		parent: "transport",
		treatment: "spending",
	},
	{
		id: "other",
		name: "Other",
		icon: "circle-question-mark",
		color: "#9E9E9E",
		parent: null,
		treatment: "spending",
	},
]

const BUCKETS = [
	{
		id: "demo-daily",
		name: "Daily",
		color: "#38bdf8",
		group: "core",
		pace_kind: "daily",
		display_order: 10,
	},
	{
		id: "demo-recurring",
		name: "Recurring",
		color: "#a78bfa",
		group: "core",
		pace_kind: "recurring",
		display_order: 20,
	},
	{
		id: "demo-irregular",
		name: "Irregular",
		color: "#fbbf24",
		group: "outlier",
		pace_kind: "none",
		display_order: 30,
	},
	{
		id: "demo-holiday",
		name: "Holiday",
		color: "#fb7185",
		group: "outlier",
		pace_kind: "none",
		display_order: 40,
	},
] as const

type Meal = {
	category: string
	titles: string[]
	amount: [number, number]
	people: string[]
	locations: string[]
	bucket: string
	account: string
}

const DAILY: Meal[] = [
	{
		category: "restaurant",
		titles: [
			"Din Tai Fung",
			"Sushi Express",
			"Cai Fan Stall",
			"Ramen Hitoyoshi",
			"Stuff'd",
			"Hawker Dinner",
		],
		amount: [6, 42],
		people: ["Rong Xin", "Jia Le", "Wei Ming", ""],
		locations: ["Bugis", "Tampines Mall", "Maxwell Food Centre", "Orchard", ""],
		bucket: "demo-daily",
		account: "demo-uob-card",
	},
	{
		category: "coffee",
		titles: ["Flash Coffee", "Luckin Coffee", "Kopi Uncle", "Starbucks"],
		amount: [2.5, 8.5],
		people: ["", "Jia Le"],
		locations: ["Raffles Place", "Guoco Tower", ""],
		bucket: "demo-daily",
		account: "demo-uob-card",
	},
	{
		category: "grocery",
		titles: ["FairPrice Run", "Sheng Siong Top-up", "CS Fresh", "Don Don Donki"],
		amount: [12, 95],
		people: ["", "Rong Xin"],
		locations: ["Bedok", "Paya Lebar", ""],
		bucket: "demo-daily",
		account: "demo-dbs-savings",
	},
	{
		category: "train-bus",
		titles: ["MRT Top-up", "SimplyGo Bus", "MRT Fare"],
		amount: [1.1, 10],
		people: [""],
		locations: [""],
		bucket: "demo-daily",
		account: "demo-dbs-savings",
	},
	{
		category: "taxi",
		titles: ["Grab Ride", "Gojek Ride", "Tada Ride"],
		amount: [8, 32],
		people: ["Rong Xin", ""],
		locations: ["Changi", "CBD", "Jurong", ""],
		bucket: "demo-daily",
		account: "demo-uob-card",
	},
]

const RECURRING: Meal[] = [
	{
		category: "membership",
		titles: ["Anytime Fitness", "Spotify Family", "iCloud+ 200GB"],
		amount: [4.9, 58],
		people: [""],
		locations: [""],
		bucket: "demo-recurring",
		account: "demo-uob-card",
	},
	{
		category: "multimedia",
		titles: ["Steam Game", "App Store", "Notion Plus"],
		amount: [6, 45],
		people: [""],
		locations: [""],
		bucket: "demo-recurring",
		account: "demo-revolut",
	},
	{
		category: "healthcare",
		titles: ["GP Visit", "Dental Scaling", "Pharmacy"],
		amount: [15, 120],
		people: [""],
		locations: ["Bedok Polyclinic", "Guardian", ""],
		bucket: "demo-irregular",
		account: "demo-dbs-savings",
	},
	{
		category: "clothes",
		titles: ["Uniqlo Basics", "Shopee Haul", "Charles & Keith"],
		amount: [19, 150],
		people: ["", "Jia Le"],
		locations: ["Orchard", "Online", ""],
		bucket: "demo-irregular",
		account: "demo-uob-card",
	},
	{
		category: "movie",
		titles: ["GV Movie Night", "Cathay Cineplex", "Netflix Top-up"],
		amount: [11, 32],
		people: ["Rong Xin", "Wei Ming", ""],
		locations: ["Bugis+", "Suntec", ""],
		bucket: "demo-daily",
		account: "demo-uob-card",
	},
]

const BANK_BLURB: Record<string, string[]> = {
	"demo-dbs-savings": ["PayNow Transfer", "FAST Transfer", "SGD"],
	"demo-uob-card": ["UOB ONE", "Contactless", "SGD"],
	"demo-revolut": ["Revolut", "Exchange", "SGD"],
}

export function generateTestData(): FinpointExport {
	const today = DateTime.now().startOf("day")
	const tables = {
		accounts: [
			{ id: "demo-dbs-savings", name: "Everyday Savings", balance: 12480.55, bank: "DBS" },
			{ id: "demo-uob-card", name: "One Card", balance: -842.2, bank: "UOB" },
			{ id: "demo-revolut", name: "Vault", balance: 2310.0, bank: "Revolut" },
		],
		statements: [] as {
			id: string
			account_id: string
			datetime: string
			description: string
			amount: number
			index: number
			is_pending: number
		}[],
		categories: CATEGORIES.map(c => ({
			id: c.id,
			name: c.name,
			icon: c.icon,
			color: c.color,
			parent_category_id: c.parent,
			analytics_treatment: c.treatment,
			default_bucket_id: null as string | null,
		})),
		records: [] as {
			id: string
			title: string
			people: string | null
			location: string | null
			description: string | null
			datetime: string
			amount: number
			category_id: string
			analytics_treatment: DemoCategory["treatment"]
			analytics_treatment_source: "category" | "manual"
			bucket_id: string | null
			bucket_source: "category" | "manual" | null
			revision: number
		}[],
		allocations: [] as { statement_id: string; record_id: string; amount: number }[],
		budgets: [] as {
			id: string
			name: string
			amount: number
			start_date: string
			end_date: string
			automatic: boolean
		}[],
		budget_records: [] as { budget_id: string; record_id: string }[],
		buckets: BUCKETS.map(b => ({ ...b, archived: false })),
		bucket_defaults: [] as {
			bucket_id: string
			effective_month: string
			amount: number | null
		}[],
		bucket_targets: [] as { bucket_id: string; month: string; amount: number | null }[],
		analytics_months: [] as {
			month: string
			coverage: string
			covered_through: string | null
			excluded_from_comparisons: boolean
		}[],
	}

	let records = 0
	let statements = 0
	const dayIndex = new Map<string, number>()
	const statementId = () => {
		statements += 1
		return `demo-s-${String(statements).padStart(4, "0")}`
	}
	const recordId = () => {
		records += 1
		return `demo-r-${String(records).padStart(4, "0")}`
	}

	const addStatement = (
		account: string,
		day: DateTime,
		description: string,
		amount: number,
		pending = false,
	) => {
		const key = `${account}|${day.toFormat("yyyy-MM-dd")}`
		const index = (dayIndex.get(key) ?? 0) + 1
		dayIndex.set(key, index)
		const id = statementId()
		tables.statements.push({
			id,
			account_id: account,
			datetime: stamp(day, 8 + Math.floor(rand() * 12), Math.floor(rand() * 60)),
			description,
			amount,
			index,
			is_pending: pending ? 1 : 0,
		})
		return id
	}

	const addRecord = (input: {
		title: string
		people: string
		location: string
		description: string
		day: DateTime
		amount: number
		category: string
		bucket: string | null
		allocate: "full" | "partial" | "none"
		account: string
	}) => {
		const id = recordId()
		const category = CATEGORIES.find(c => c.id === input.category)
		if (!category) throw new Error(`Unknown demo category ${input.category}.`)
		tables.records.push({
			id,
			title: input.title,
			people: input.people || null,
			location: input.location || null,
			description: input.description || null,
			datetime: stamp(input.day, 8 + Math.floor(rand() * 13), Math.floor(rand() * 60)),
			amount: input.amount,
			category_id: input.category,
			analytics_treatment: category.treatment,
			analytics_treatment_source: "category",
			bucket_id: input.bucket,
			bucket_source: input.bucket ? "manual" : null,
			revision: 1,
		})

		const blurb = pick(BANK_BLURB[input.account] ?? ["SGD"])
		const describe = () => `${input.title} · ${blurb} ${1000 + Math.floor(rand() * 9000)}`
		if (input.allocate !== "none") {
			const shares =
				input.allocate === "partial"
					? [Math.round((input.amount / 2) * 100) / 100]
					: input.allocate === "full" && rand() < 0.12
						? (() => {
								const first = Math.round(input.amount * 0.6 * 100) / 100
								return [first, Math.round((input.amount - first) * 100) / 100]
							})()
						: [input.amount]
			for (const share of shares) {
				if (share === 0) continue
				const statement = addStatement(input.account, input.day, describe(), share)
				tables.allocations.push({ statement_id: statement, record_id: id, amount: share })
			}
		}
		return id
	}

	const addMeal = (meal: Meal, day: DateTime) => {
		const title = pick(meal.titles)
		addRecord({
			title,
			people: pick(meal.people),
			location: pick(meal.locations),
			description:
				rand() < 0.25
					? pick(["Team lunch", "Weekend treat", "Monthly restock", "Late night"])
					: "",
			day,
			amount: -between(meal.amount[0], meal.amount[1]),
			category: meal.category,
			bucket: meal.bucket,
			allocate: rand() < 0.88 ? "full" : rand() < 0.5 ? "partial" : "none",
			account: meal.account,
		})
	}

	// 150 days of daily life
	for (let back = 149; back >= 0; back--) {
		const day = today.minus({ days: back })
		const meals = 2 + (rand() < 0.35 ? 1 : 0)
		for (let i = 0; i < meals; i++) addMeal(pick(DAILY), day)
		if (rand() < 0.3) addMeal(pick(RECURRING), day)

		if (day.day === 25) {
			addRecord({
				title: "Monthly Salary",
				people: "",
				location: "",
				description: "Payroll credit",
				day,
				amount: between(4200, 5200),
				category: "salary",
				bucket: null,
				allocate: "full",
				account: "demo-dbs-savings",
			})
		}
		if (day.day === 5) {
			addRecord({
				title: "StashAway Deposit",
				people: "",
				location: "",
				description: "Auto-invest",
				day,
				amount: -500,
				category: "investment",
				bucket: null,
				allocate: "full",
				account: "demo-dbs-savings",
			})
		}
	}

	// Holiday trip cluster two months back
	const trip = today.minus({ months: 2 }).set({ day: 12 })
	const holiday: [string, string, [number, number], string][] = [
		["Scoot to Tokyo", "airplane", [380, 460], "demo-uob-card"],
		["Shibuya Hotel", "other", [520, 640], "demo-uob-card"],
		["Ichiran Ramen", "restaurant", [18, 35], "demo-revolut"],
		["Don Quijote Haul", "clothes", [90, 210], "demo-revolut"],
		["TeamLab Tickets", "movie", [45, 60], "demo-revolut"],
	]
	holiday.forEach(([title, category, range, account], i) => {
		addRecord({
			title,
			people: i < 2 ? "Rong Xin" : "",
			location: "Tokyo",
			description: "Autumn trip",
			day: trip.plus({ days: i }),
			amount: -between(range[0], range[1]),
			category,
			bucket: "demo-holiday",
			allocate: "full",
			account,
		})
	})

	// Extra unallocated imports for the allocator queue
	for (let i = 0; i < 40; i++) {
		const meal = pick(DAILY)
		const day = today.minus({ days: Math.floor(rand() * 30) })
		addStatement(
			meal.account,
			day,
			`${pick(meal.titles)} · ${pick(BANK_BLURB[meal.account] ?? ["SGD"])} ${1000 + Math.floor(rand() * 9000)}`,
			-between(meal.amount[0], meal.amount[1]),
		)
	}

	// Replace-pending demo: handwritten placeholder + matching import
	const pendingDay = today.minus({ days: 3 })
	const pendingId = addStatement(
		"demo-dbs-savings",
		pendingDay,
		"Pasar malam snacks",
		-14.5,
		true,
	)
	const pendingRecord = addRecord({
		title: "Pasar Malam",
		people: "Jia Le",
		location: "Bedok",
		description: "",
		day: pendingDay,
		amount: -14.5,
		category: "restaurant",
		bucket: "demo-daily",
		allocate: "none",
		account: "demo-dbs-savings",
	})
	tables.allocations.push({ statement_id: pendingId, record_id: pendingRecord, amount: -14.5 })
	addStatement(
		"demo-dbs-savings",
		pendingDay.plus({ days: 1 }),
		"Pasar Malam Stall · SGD 8821",
		-14.5,
	)

	// Budgets: one manual trip budget, one automatic monthly budget
	const tripStart = trip.toFormat("yyyy-MM-dd")
	tables.budgets.push({
		id: "demo-budget-trip",
		name: "Tokyo Trip",
		amount: 2200,
		start_date: tripStart,
		end_date: trip.plus({ days: 6 }).toFormat("yyyy-MM-dd"),
		automatic: false,
	})
	for (const record of tables.records.filter(r => r.bucket_id === "demo-holiday").slice(0, 5)) {
		tables.budget_records.push({ budget_id: "demo-budget-trip", record_id: record.id })
	}
	const autoMonth = today.minus({ months: 1 }).startOf("month")
	tables.budgets.push({
		id: "demo-budget-daily",
		name: `${autoMonth.toFormat("MMMM")} Daily`,
		amount: 900,
		start_date: autoMonth.toFormat("yyyy-MM-dd"),
		end_date: autoMonth.endOf("month").toFormat("yyyy-MM-dd"),
		automatic: true,
	})
	for (const record of tables.records.filter(
		r =>
			r.bucket_id === "demo-daily" &&
			r.datetime.slice(0, 10) >= autoMonth.toFormat("yyyy-MM-dd") &&
			r.datetime.slice(0, 10) <= autoMonth.endOf("month").toFormat("yyyy-MM-dd"),
	)) {
		tables.budget_records.push({ budget_id: "demo-budget-daily", record_id: record.id })
	}

	// Bucket targets for recent months + defaults
	const monthKeys: string[] = []
	for (let back = 4; back >= 0; back--) {
		monthKeys.push(today.minus({ months: back }).startOf("month").toFormat("yyyy-MM-dd"))
	}
	const monthlyTarget: Record<string, number> = {
		"demo-daily": 950,
		"demo-recurring": 220,
		"demo-irregular": 400,
		"demo-holiday": 0,
	}
	for (const key of monthKeys) {
		for (const bucket of BUCKETS) {
			tables.bucket_targets.push({
				bucket_id: bucket.id,
				month: key,
				amount: monthlyTarget[bucket.id] ?? null,
			})
		}
	}
	const firstMonth = monthKeys[0]
	if (firstMonth) {
		tables.bucket_defaults.push({
			bucket_id: "demo-daily",
			effective_month: firstMonth,
			amount: 950,
		})
	}

	// Mark full past months complete so comparisons light up
	for (let back = 4; back >= 1; back--) {
		const monthStart = today.minus({ months: back }).startOf("month")
		if (monthStart.endOf("month") <= today) {
			tables.analytics_months.push({
				month: monthStart.toFormat("yyyy-MM-dd"),
				coverage: "complete",
				covered_through: monthStart.endOf("month").toFormat("yyyy-MM-dd"),
				excluded_from_comparisons: false,
			})
		}
	}

	return {
		app: "finpoint",
		version: 1,
		exported_at: new Date().toISOString(),
		tables,
	}
}
