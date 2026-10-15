// Sheet loading readiness (director D2): held actual reads after a
// mounted-closed period and across reopening prove no false empty or old
// selection, then resolve correct data. Silent while unresolved: no loading
// copy and no skeleton. Sheets render null until the live query for the
// CURRENT opening resolves; within one opening, prior rows stay mounted and
// dimmed while a new query or filter read resolves (no blank, no remount).
import type { Locator, Page } from "@playwright/test"
import { IDS } from "./support/data"
import { expect, test } from "./support/fixtures"

async function installReadHold(page: Page) {
	// Scheduler-level hold: while holding, an open readwrite keeper transaction
	// on every domain store blocks the app's later IndexedDB transactions behind
	// it, so held reads genuinely stay pending. This does not depend on
	// intercepting Dexie's per-request event handlers.
	await page.evaluate(() => {
		const w = window as unknown as Record<string, unknown>
		if (w.__sheetHoldInstalled) return
		w.__sheetHoldInstalled = true
		const stores = [
			"accounts",
			"statements",
			"categories",
			"records",
			"allocations",
			"budgets",
			"budget_records",
			"monthly_budgets",
			"monthly_budget_amounts",
			"monthly_budget_defaults",
		]
		const keeper = {
			conn: null as IDBDatabase | null,
			holding: false,
			pumps: 0,
			error: null as string | null,
		}
		w.__sheetKeeper = keeper
		const reads: { store: string; request: IDBRequest }[] = []
		w.__sheetAppReads = reads
		const getAll = IDBObjectStore.prototype.getAll
		IDBObjectStore.prototype.getAll = function (...args) {
			const request = getAll.apply(this, args)
			if (keeper.holding && this.transaction.db !== keeper.conn)
				reads.push({ store: this.name, request })
			return request
		}
		const ensureConn = async (): Promise<IDBDatabase> => {
			if (keeper.conn) return keeper.conn
			keeper.conn = await new Promise<IDBDatabase>((resolve, reject) => {
				const open = indexedDB.open("finpoint")
				open.onsuccess = () => resolve(open.result)
				open.onerror = () => reject(open.error ?? new Error("Unable to open database."))
			})
			return keeper.conn
		}
		// Resolve only once the keeper is active. Failure is fatal to this fixture;
		// silently restarting would let consumer reads escape between transactions.
		const hold = async () => {
			const conn = await ensureConn()
			reads.length = 0
			keeper.holding = true
			keeper.error = null
			await new Promise<void>((resolve, reject) => {
				const tx = conn.transaction(stores, "readwrite")
				tx.onerror = tx.onabort = () => {
					keeper.error = tx.error?.message ?? "Keeper transaction failed."
					reject(new Error(keeper.error))
				}
				tx.oncomplete = () => {
					if (keeper.holding) keeper.error = "Keeper completed before release."
				}
				const pump = () => {
					const request = tx.objectStore("accounts").count()
					request.onsuccess = () => {
						keeper.pumps += 1
						resolve()
						if (keeper.holding) pump()
					}
				}
				pump()
			})
		}
		w.__holdSheetReads = async (store: string) => {
			await hold()
			w.__sheetHeldStore = store
			// Dexie 4.4 caches whole-table queries, so a keeper alone cannot hold
			// a warm listStatements read. Its cross-context mutation protocol
			// invalidates this table's cache and forces a real reread. This changes
			// neither the stored rows nor React's state, results, or rendering.
			dispatchEvent(
				new CustomEvent("x-storagemutated-1", {
					detail: { [`idb://finpoint/${store}/`]: { d: 1, from: -Infinity, to: [[]] } },
				}),
			)
		}
		w.__releaseSheetReads = () => {
			keeper.holding = false
		}
	})
}

async function holdReads(page: Page, store: "statements" | "records") {
	await page.evaluate(
		store =>
			(
				window as unknown as { __holdSheetReads: (store: string) => Promise<void> }
			).__holdSheetReads(store),
		store,
	)
}

async function releaseReads(page: Page) {
	await page.evaluate(() =>
		(window as unknown as Record<string, () => void>).__releaseSheetReads?.(),
	)
	await expect
		.poll(() =>
			page.evaluate(() =>
				(
					window as unknown as { __sheetAppReads: { request: IDBRequest }[] }
				).__sheetAppReads.every(
					({ request }) => request.readyState === "done" && request.error === null,
				),
			),
		)
		.toBe(true)
}

// Observe the app's native request, excluding the keeper connection. An
// independent probe proves only IDB scheduling, not a pending consumer read.
async function expectHeldRead(page: Page) {
	const state = () =>
		page.evaluate(() => {
			const w = window as unknown as {
				__sheetHeldStore: string
				__sheetAppReads: { store: string; request: IDBRequest }[]
				__sheetKeeper: { holding: boolean; pumps: number; error: string | null }
			}
			return {
				holding: w.__sheetKeeper.holding,
				pumps: w.__sheetKeeper.pumps,
				error: w.__sheetKeeper.error,
				store: w.__sheetHeldStore,
				reads: w.__sheetAppReads
					.filter(read => read.store === w.__sheetHeldStore)
					.map(read => read.request.readyState),
			}
		})
	await expect.poll(async () => (await state()).reads.length).toBeGreaterThan(0)
	const before = await state()
	await page.waitForTimeout(400)
	const after = await state()
	expect(after.holding).toBe(true)
	expect(after.error).toBeNull()
	expect(after.pumps).toBeGreaterThan(before.pumps)
	expect(after.reads.length).toBeGreaterThan(0)
	expect(after.reads.every(state => state === "pending")).toBe(true)
	await test.info().attach("held-consumer-read", {
		body: JSON.stringify({ before, after }, null, 2),
		contentType: "application/json",
	})
}

async function expectSilentSheet(
	page: Page,
	sheet: ReturnType<Page["getByRole"]>,
	emptyText: RegExp,
) {
	await expect(sheet).toBeVisible()
	await expectHeldRead(page)
	await expect(sheet.locator("li")).toHaveCount(0)
	await expect(sheet.getByText(emptyText)).toHaveCount(0)
	await expect(sheet.getByText(/^(Loading|Please wait|Loading\.\.\.)/)).toHaveCount(0)
	await expect(sheet.locator('[data-slot="skeleton"]')).toHaveCount(0)
}

test("pending confirmation sheet stays silent while held after closed time, then resolves", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await page.goto("/allocator")
	await expect(
		page.locator("main").getByRole("heading", { name: "Workflows", exact: true, level: 2 }),
	).toBeVisible()
	await expect(
		page.getByRole("checkbox", { name: "Select statement t1-s-free-2", exact: true }),
	).toBeVisible()
	await page.waitForTimeout(600)
	await installReadHold(page)
	await holdReads(page, "statements")
	await page
		.getByRole("checkbox", {
			name: `Select statement ${IDS.statements.unallocated[3]}`,
			exact: true,
		})
		.check()
	await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
	const sheet = page.getByRole("dialog", {
		name: "Replace a pending Statement",
		exact: true,
	})
	await expectSilentSheet(page, sheet, /No pending Statements for this Account\./)
	await page.waitForTimeout(400)
	await expect(sheet.getByText(/No pending Statements for this Account\./)).toHaveCount(0)
	await releaseReads(page)
	await expect(sheet.getByText("Pasar malam snacks")).toBeVisible()
	await expect(sheet.getByText(/No pending Statements for this Account\./)).toHaveCount(0)
	await expect(page.getByRole("dialog", { name: "Review Statement replacement" })).toHaveCount(0)
	await page.keyboard.press("Escape")
	await expect(sheet).not.toBeVisible()
	await holdReads(page, "statements")
	await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
	await expectSilentSheet(page, sheet, /No pending Statements for this Account\./)
	await page.waitForTimeout(400)
	await expect(sheet.getByText(/No pending Statements for this Account\./)).toHaveCount(0)
	await releaseReads(page)
	await expect(sheet.getByText("Pasar malam snacks")).toBeVisible()
})

test("statement search sheet stays silent while held after closed time, then resolves", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await page.goto(`/records/${IDS.records.partialPending}`)
	await expect(page.locator("main h2").filter({ hasText: "Hawker Dinner" })).toBeVisible()
	await page.waitForTimeout(600)
	await installReadHold(page)
	await page.getByRole("button", { name: "Edit Record", exact: true }).click()
	const editor = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await expect(editor).toBeVisible()
	await holdReads(page, "statements")
	await editor.getByRole("button", { name: "Allocate statement", exact: true }).click()
	const sheet = page.getByRole("dialog", {
		name: "Allocate statements to record",
		exact: true,
	})
	await expectSilentSheet(page, sheet, /No allocable Statements\./)
	await page.waitForTimeout(400)
	await expect(sheet.getByText(/No allocable Statements\./)).toHaveCount(0)
	await expect(sheet.getByText("1 Statement selected for allocation")).toHaveCount(0)
	await releaseReads(page)
	await sheet.getByLabel("Search statements").fill("STARBUCKS")
	await expect(sheet.getByText("STARBUCKS 4455")).toBeVisible()
	await sheet.getByRole("button").filter({ hasText: "STARBUCKS 4455" }).click()
	await sheet.getByRole("button", { name: "Done", exact: true }).click()
	await expect(sheet).not.toBeVisible()
	await holdReads(page, "statements")
	await editor.getByRole("button", { name: "Allocate statement", exact: true }).click()
	await expectSilentSheet(page, sheet, /No allocable Statements\./)
	await expect(sheet.getByText("1 Statement selected for allocation")).toHaveCount(0)
	await releaseReads(page)
	await expect(sheet.getByLabel("Search statements")).toBeVisible()
	await expect(sheet.getByText("SHENG SIONG 9902")).toBeVisible()
})

test("record search sheet stays silent while held after closed time, then resolves", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await page.goto(`/budgets/${IDS.budgets.manual}`)
	await expect(page.getByText("October Buffer")).toBeVisible()
	await page.waitForTimeout(600)
	await installReadHold(page)
	await holdReads(page, "records")
	await page.getByRole("button", { name: "Attach Record", exact: true }).click()
	const sheet = page.getByRole("dialog", {
		name: "Attach record to budget",
		exact: true,
	})
	await expectSilentSheet(page, sheet, /No matching Records\./)
	await page.waitForTimeout(400)
	await expect(sheet.getByText(/No matching Records\./)).toHaveCount(0)
	await releaseReads(page)
	await expect(sheet.getByText("Hawker Dinner")).toBeVisible()
	await expect(sheet.getByText(/No matching Records\./)).toHaveCount(0)
	await page.keyboard.press("Escape")
	await expect(sheet).not.toBeVisible()
	await holdReads(page, "records")
	await page.getByRole("button", { name: "Attach Record", exact: true }).click()
	await expectSilentSheet(page, sheet, /No matching Records\./)
	await page.waitForTimeout(400)
	await expect(sheet.getByText(/No matching Records\./)).toHaveCount(0)
	await releaseReads(page)
	await expect(sheet.getByText("Hawker Dinner")).toBeVisible()
})

async function markSheetRows(rows: Locator) {
	for (const row of await rows.all())
		await row.evaluate(node => {
			;(node as unknown as Record<string, boolean>).__keptRow = true
		})
}

async function expectRetainedRows(
	page: Page,
	sheet: ReturnType<Page["getByRole"]>,
	rows: Locator,
	emptyText: RegExp,
) {
	await expectHeldRead(page)
	await expect(rows).toHaveCount(1)
	await expect(sheet.locator("div.flex-1.overflow-y-auto")).toHaveCSS("opacity", "0.7")
	await expect(sheet.getByText(emptyText)).toHaveCount(0)
	await expect(sheet.getByText(/^(Loading|Please wait|Loading\.\.\.)/)).toHaveCount(0)
	await expect(sheet.locator('[data-slot="skeleton"]')).toHaveCount(0)
	for (const row of await rows.all()) {
		await expect(row).toBeVisible()
		await expect(
			row.evaluate(node => (node as unknown as Record<string, boolean>).__keptRow === true),
		).resolves.toBe(true)
		await expect(row.evaluate(node => getComputedStyle(node).opacity)).resolves.toBe("1")
	}
}

async function seedPendingSearch(page: Page) {
	await page.evaluate(async () => {
		const conn = await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open("finpoint")
			request.onsuccess = () => resolve(request.result)
			request.onerror = () => reject(request.error)
		})
		try {
			await new Promise<void>((resolve, reject) => {
				const tx = conn.transaction("statements", "readwrite")
				tx.oncomplete = () => resolve()
				tx.onerror = tx.onabort = () => reject(tx.error)
				for (const row of [
					{
						id: "sheet-pending-breakfast",
						account_id: "t1-acc-dbs",
						description: "Breakfast reservation",
					},
					{
						id: "sheet-pending-card",
						account_id: "t1-acc-uob",
						description: "Card lunch placeholder",
					},
				]) {
					tx.objectStore("statements").add({
						...row,
						datetime: "2026-10-12 09:36",
						amount: -9,
						index: 1,
						is_pending: 1,
					})
				}
			})
		} finally {
			conn.close()
		}
	})
}

test("pending confirmation sheet keeps prior rows while a held query change resolves", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await seedPendingSearch(page)
	await page.goto("/allocator")
	await page.getByRole("checkbox", { name: "Select statement t1-s-free-2", exact: true }).check()
	await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
	const sheet = page.getByRole("dialog", { name: "Replace a pending Statement", exact: true })
	await sheet.getByLabel("Search pending Statements").fill("Pasar")
	await expect(sheet.locator("li")).toHaveCount(1)
	await expect(sheet.getByText("Breakfast reservation")).toHaveCount(0)
	const prior = sheet.locator("li", { hasText: "Pasar malam snacks" })
	await expect(prior).toBeVisible()
	await markSheetRows(prior)
	await installReadHold(page)
	await holdReads(page, "statements")
	await sheet.getByLabel("Search pending Statements").fill("Breakfast")
	await expectRetainedRows(page, sheet, prior, /No pending Statements for this Account\./)
	await expect(sheet.getByText("Breakfast reservation")).toHaveCount(0)
	await releaseReads(page)
	await expect(sheet.getByText("Breakfast reservation")).toBeVisible()
	await expect(prior).toHaveCount(0)
	await expect(sheet.locator("li")).toHaveCount(1)
	await expect(sheet.locator("div.flex-1.overflow-y-auto")).toHaveCSS("opacity", "1")
	await expect(sheet.getByText("Card lunch placeholder")).toHaveCount(0)
})

test("pending confirmation sheet clears prior rows when reopened for another Statement", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await seedPendingSearch(page)
	await page.goto("/allocator")
	const first = page.getByRole("checkbox", { name: "Select statement t1-s-free-2", exact: true })
	await first.check()
	await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
	const sheet = page.getByRole("dialog", { name: "Replace a pending Statement", exact: true })
	await sheet.getByLabel("Search pending Statements").fill("Pasar")
	await expect(sheet.locator("li")).toHaveCount(1)
	await expect(sheet.getByText("Pasar malam snacks")).toBeVisible()
	await page.keyboard.press("Escape")
	await expect(sheet).not.toBeVisible()
	await first.uncheck()
	await page.getByRole("checkbox", { name: "Select statement t1-s-free-1", exact: true }).check()
	await installReadHold(page)
	await holdReads(page, "statements")
	await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
	await expect(sheet.getByText("STARBUCKS 4455", { exact: true })).toBeVisible()
	await expectSilentSheet(page, sheet, /No pending Statements for this Account\./)
	await expect(sheet.getByLabel("Search pending Statements")).toHaveValue("")
	await expect(sheet.getByText("Pasar malam snacks")).toHaveCount(0)
	await releaseReads(page)
	await expect(sheet.getByText("Card lunch placeholder")).toBeVisible()
	await expect(sheet.locator("li")).toHaveCount(1)
	await expect(sheet.getByText("Pasar malam snacks")).toHaveCount(0)
	await expect(sheet.getByText("Breakfast reservation")).toHaveCount(0)
	await expect(sheet.locator("div.flex-1.overflow-y-auto")).toHaveCSS("opacity", "1")
})

test("statement search sheet keeps prior rows while a held query change resolves", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await page.goto(`/records/${IDS.records.partialPending}`)
	await expect(page.locator("main h2").filter({ hasText: "Hawker Dinner" })).toBeVisible()
	await installReadHold(page)
	await page.getByRole("button", { name: "Edit Record", exact: true }).click()
	const editor = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await expect(editor).toBeVisible()
	await editor.getByRole("button", { name: "Allocate statement", exact: true }).click()
	const sheet = page.getByRole("dialog", {
		name: "Allocate statements to record",
		exact: true,
	})
	await expect(sheet).toBeVisible()
	await sheet.getByLabel("Search statements").fill("STARBUCKS")
	// Prove the filtered read settled before holding: exactly one row and no
	// SHENG result, so the marked rows are the STARBUCKS-filtered set.
	await expect(sheet.locator("li")).toHaveCount(1)
	await expect(sheet.getByText("SHENG SIONG 9902")).toHaveCount(0)
	const prior = sheet.locator("li", { hasText: "STARBUCKS 4455" })
	await expect(prior).toBeVisible()
	await markSheetRows(prior)
	await holdReads(page, "statements")
	await sheet.getByLabel("Search statements").fill("SHENG SIONG")
	await expectRetainedRows(page, sheet, prior, /No allocable Statements\./)
	await releaseReads(page)
	await expect(sheet.getByText("SHENG SIONG 9902")).toBeVisible()
	await expect(prior).toHaveCount(0)
	await expect(sheet.locator("li")).toHaveCount(1)
	await expect(sheet.locator("div.flex-1.overflow-y-auto")).toHaveCSS("opacity", "1")
	await expect(sheet.getByText(/No allocable Statements\./)).toHaveCount(0)
})

test("record search sheet keeps prior rows while a held query change resolves", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await page.goto(`/budgets/${IDS.budgets.manual}`)
	await expect(page.getByText("October Buffer")).toBeVisible()
	await installReadHold(page)
	await page.getByRole("button", { name: "Attach Record", exact: true }).click()
	const sheet = page.getByRole("dialog", {
		name: "Attach record to budget",
		exact: true,
	})
	await expect(sheet).toBeVisible()
	await sheet.getByLabel("Search records").fill("Hawker")
	// Prove the filtered read settled before holding: exactly one row and no
	// StashAway result, so the marked rows are the Hawker-filtered set.
	await expect(sheet.locator("li")).toHaveCount(1)
	await expect(sheet.getByText("StashAway Deposit")).toHaveCount(0)
	const prior = sheet.locator("li", { hasText: "Hawker Dinner" })
	await expect(prior.first()).toBeVisible()
	await markSheetRows(prior)
	await holdReads(page, "records")
	await sheet.getByLabel("Search records").fill("StashAway")
	await expectRetainedRows(page, sheet, prior, /No matching Records\./)
	await releaseReads(page)
	await expect(sheet.getByText("StashAway Deposit")).toBeVisible()
	await expect(prior).toHaveCount(0)
	await expect(sheet.locator("li")).toHaveCount(1)
	await expect(sheet.locator("div.flex-1.overflow-y-auto")).toHaveCSS("opacity", "1")
	await expect(sheet.getByText(/No matching Records\./)).toHaveCount(0)
})

test("statement search sheet keeps prior rows while a held filter change resolves", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	// Existing older Statements are fully allocated. Give this filter a real
	// newly eligible result so retaining the old list forever cannot pass.
	await page.evaluate(async () => {
		const conn = await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open("finpoint")
			request.onsuccess = () => resolve(request.result)
			request.onerror = () => reject(request.error)
		})
		try {
			await new Promise<void>((resolve, reject) => {
				const tx = conn.transaction("statements", "readwrite")
				tx.oncomplete = () => resolve()
				tx.onerror = tx.onabort = () => reject(tx.error)
				tx.objectStore("statements").add({
					id: "sheet-older-statement",
					account_id: "t1-acc-dbs",
					datetime: "2026-08-15 09:36",
					description: "Older allocable Statement",
					amount: -45,
					index: 1,
					is_pending: 0,
				})
			})
		} finally {
			conn.close()
		}
	})
	await page.goto(`/records/${IDS.records.partialPending}`)
	await expect(page.locator("main h2").filter({ hasText: "Hawker Dinner" })).toBeVisible()
	await installReadHold(page)
	await page.getByRole("button", { name: "Edit Record", exact: true }).click()
	const editor = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await expect(editor).toBeVisible()
	await editor.getByRole("button", { name: "Allocate statement", exact: true }).click()
	const sheet = page.getByRole("dialog", {
		name: "Allocate statements to record",
		exact: true,
	})
	await expect(sheet).toBeVisible()
	const prior = sheet.locator("li", { hasText: "STARBUCKS 4455" })
	await expect(prior).toBeVisible()
	await expect(sheet.getByText("Older allocable Statement")).toHaveCount(0)
	await markSheetRows(prior)
	await holdReads(page, "statements")
	// Desktop names it "Include older"; mobile (sm:hidden) names it "Older".
	await sheet.getByRole("button", { name: /^(Include older|Older)$/ }).click()
	await page.waitForTimeout(400)
	await expectRetainedRows(page, sheet, prior, /No allocable Statements\./)
	await expect(sheet.getByText("Older allocable Statement")).toHaveCount(0)
	await releaseReads(page)
	await expect(sheet.getByText("Older allocable Statement")).toBeVisible()
	await expect(sheet.getByText("STARBUCKS 4455")).toBeVisible()
	await expect(sheet.locator("div.flex-1.overflow-y-auto")).toHaveCSS("opacity", "1")
})
