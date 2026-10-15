// Playwright fixture + helper seeding the REAL IndexedDB app on the browser context.
//
// Flow: go to `/`, wait for app boot (shell `header` attached AND
// `meta.seeded_v2` present, so we never race background `seedIfEmpty()`),
// replace the workspace through RAW IndexedDB (existing store names only,
// no version change, no new migrations), reload, then verify row counts.
// No production `@/data/*` runtime imports here — test support may touch raw
// IndexedDB, but never through the app data layer.
// Assumes the Playwright config (Astra) sets `baseURL` to the dev server.
//
// Viewports: boot waits on the shell `header` (always mounted, including the
// mobile layout where the sidebar stays closed), never on sidebar visibility.
// Browser functions below take all values via `page.evaluate`/`waitForFunction`
// args — they must stay self-contained with no module-closure references.

import { test as base, expect, type Page } from "@playwright/test"
import { getScenario, type ScenarioName, type WorkspaceDataset } from "./data"
import { setDateOnly } from "./date-only"

export type { ScenarioName, WorkspaceDataset }
export { expect }

type WorkspaceFixtures = {
	fixedClock: void
	/** Scenario used when a test requests the `workspace` fixture. */
	workspaceScenario: ScenarioName
	/** Opt-in fixture: seeds the context, then yields the scenario name. */
	workspace: ScenarioName
}

export const test = base.extend<WorkspaceFixtures>({
	fixedClock: [
		async ({ page }, use) => {
			await setDateOnly(page, new Date("2026-10-15T12:00:00+08:00"))
			await use()
		},
		{ auto: true },
	],
	workspaceScenario: ["populated", { option: true }],
	workspace: async ({ page, workspaceScenario }, use) => {
		await seedWorkspace(page, workspaceScenario)
		await use(workspaceScenario)
	},
})

const BOOT_TIMEOUT_MS = 30_000
const DB_NAME = "finpoint"
// Mirror of the existing stores in `src/data/db.ts` (v5). Passed into the
// browser as an evaluate arg; schema changes go through Dexie versioned
// migrations in the app — never from test support.
const STORE_NAMES = [
	"accounts",
	"statements",
	"duplicate_dismissals",
	"categories",
	"records",
	"allocations",
	"budgets",
	"budget_records",
	"monthly_budgets",
	"monthly_budget_defaults",
	"monthly_budget_amounts",
	"analytics_months",
	"settings",
	"meta",
]

export async function seedWorkspace(
	page: Page,
	scenario: ScenarioName = "populated",
): Promise<void> {
	const dataset = getScenario(scenario)
	await page.goto("/")
	await waitForBoot(page)
	await page.evaluate(seedInBrowser, { dbName: DB_NAME, stores: STORE_NAMES, dataset })
	await page.reload()
	await waitForBoot(page)
	await assertSeeded(page, dataset)
}

async function waitForBoot(page: Page): Promise<void> {
	// `attached`, not visible: the sidebar stays closed on mobile viewports.
	await page.waitForSelector("header", { state: "attached", timeout: BOOT_TIMEOUT_MS })
	// expect.poll awaits each probe's value. Do NOT use waitForFunction with an
	// async predicate here: its rAF poll can resolve early on the pending Promise
	// object, letting the raw open below create an empty v1 database before the
	// app finishes booting (observed as version-1/zero-store reads).
	await expect
		.poll(() => page.evaluate(checkSeededMarker, { dbName: DB_NAME, stores: STORE_NAMES }), {
			timeout: BOOT_TIMEOUT_MS,
		})
		.toBe(true)
}

async function assertSeeded(page: Page, dataset: WorkspaceDataset): Promise<void> {
	const actual = await page.evaluate(countStore, { dbName: DB_NAME, store: "records" })
	const want = dataset.tables.records.length
	if (actual !== want) {
		throw new Error(`Seed verification failed: records has ${actual} rows, want ${want}.`)
	}
}

// Runs in the browser. Self-contained: values arrive only via the arg.
// Reports ready only when the seed marker AND every expected store exist, so
// seeding never races a half-migrated database.
async function checkSeededMarker(input: { dbName: string; stores: string[] }): Promise<boolean> {
	const { dbName, stores } = input
	try {
		if (typeof indexedDB.databases !== "function") return false
		const databases = await indexedDB.databases()
		if (!databases.some(database => database.name === dbName)) return false
	} catch {
		return false
	}
	const database = await new Promise<IDBDatabase | null>(resolve => {
		try {
			const open = indexedDB.open(dbName)
			open.onsuccess = () => resolve(open.result)
			open.onerror = () => resolve(null)
			open.onblocked = () => resolve(null)
		} catch {
			resolve(null)
		}
	})
	if (!database) return false
	try {
		const present = new Set([...database.objectStoreNames])
		if (!stores.every(store => present.has(store))) return false
		const marker = await new Promise<{ value?: string } | null>(resolve => {
			try {
				const request = database
					.transaction("meta", "readonly")
					.objectStore("meta")
					.get("seeded_v2")
				request.onsuccess = () =>
					resolve((request.result as { value?: string } | undefined) ?? null)
				request.onerror = () => resolve(null)
			} catch {
				resolve(null)
			}
		})
		return marker?.value === "1"
	} catch {
		return false
	} finally {
		database.close()
	}
}

// Runs in the browser. Self-contained: values arrive only via the arg.
async function seedInBrowser(input: {
	dbName: string
	stores: string[]
	dataset: WorkspaceDataset
}): Promise<void> {
	const { dbName, stores, dataset } = input
	const settingsRows: { key: string; value: string }[] = []
	if (dataset.settings.default_filter_start_date) {
		settingsRows.push({
			key: "default_filter_start_date",
			value: dataset.settings.default_filter_start_date,
		})
	}
	if (dataset.settings.default_filter_end_date_today) {
		settingsRows.push({ key: "default_filter_end_date_today", value: "true" })
	}
	const payload: Record<string, Record<string, unknown>[]> = {
		...(dataset.tables as unknown as Record<string, Record<string, unknown>[]>),
		settings: settingsRows,
		meta: [
			{ key: "seeded_v1", value: "1" },
			{ key: "seeded_v2", value: "1" },
		],
	}
	const database = await new Promise<IDBDatabase>((resolve, reject) => {
		const open = indexedDB.open(dbName)
		open.onsuccess = () => resolve(open.result)
		open.onerror = () => reject(open.error ?? new Error("Unable to open finpoint database."))
		open.onblocked = () => reject(new Error("Seed blocked: finpoint database is in use."))
	})
	try {
		const present = new Set([...database.objectStoreNames])
		const missing = stores.filter(store => !present.has(store))
		if (missing.length > 0) {
			throw new Error(
				`Seed blocked: database is at version ${database.version} and lacks stores: ${missing.join(", ")}.`,
			)
		}
		await new Promise<void>((resolve, reject) => {
			const transaction = database.transaction([...stores], "readwrite")
			transaction.oncomplete = () => resolve()
			transaction.onerror = () =>
				reject(transaction.error ?? new Error("Unable to seed finpoint database."))
			transaction.onabort = () =>
				reject(transaction.error ?? new Error("Seed transaction aborted."))
			for (const store of stores) {
				const objectStore = transaction.objectStore(store)
				objectStore.clear()
				for (const row of payload[store] ?? []) objectStore.put(row)
			}
		})
	} finally {
		database.close()
	}
}

// Runs in the browser. Self-contained: values arrive only via the arg.
async function countStore(input: { dbName: string; store: string }): Promise<number> {
	const { dbName, store } = input
	const database = await new Promise<IDBDatabase>((resolve, reject) => {
		const open = indexedDB.open(dbName)
		open.onsuccess = () => resolve(open.result)
		open.onerror = () => reject(open.error ?? new Error("Unable to open finpoint database."))
	})
	try {
		return await new Promise<number>((resolve, reject) => {
			const request = database.transaction(store, "readonly").objectStore(store).count()
			request.onsuccess = () => resolve(request.result)
			request.onerror = () => reject(request.error ?? new Error(`Unable to count ${store}.`))
		})
	} finally {
		database.close()
	}
}
