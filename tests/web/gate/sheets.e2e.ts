import type { Locator, Page } from "@playwright/test"
import { expectVisibleBackdrop } from "../support/assertions"
import { getScenario, IDS } from "../support/data"
import {
	budget,
	deleted,
	imported,
	kept,
	openEditor,
	pending,
	pickOption,
	record,
} from "../support/editors"
import { expect, test } from "../support/fixtures"
import { openReplacementSheet } from "../support/sheets"

test("search sheets: filter, allocate, attach and reopen", async ({ page, workspace }) => {
	void workspace
	await test.step("Statement search sheet: filters and allocates Statements, returns to the editor with Done and cancels an unsaved Allocation", async () => {
		void workspace
		const dialog = await openEditor(page, `/records/${record.id}`, "Edit Record", "Edit Record")
		await dialog.getByRole("button", { name: "Allocate statement", exact: true }).click()
		const sheet = page.getByRole("dialog", {
			name: "Allocate statements to record",
			exact: true,
		})
		await expectVisibleBackdrop(page)
		await sheet.getByRole("searchbox", { name: "Search statements" }).fill(imported.description)
		await sheet.getByRole("button").filter({ hasText: imported.description }).click()
		await sheet.getByRole("button", { name: "Done", exact: true }).click()
		await expect(sheet).not.toBeVisible()
		await expect(dialog).toContainText(imported.description)
		await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
		await expect(page.getByRole("dialog")).toHaveCount(0)
		// The cancelled allocation was never saved to the Record.
		await expect(page.locator("main")).not.toContainText(imported.description)
		await page.getByRole("button", { name: "Edit Record", exact: true }).click()
		const reopened = page.getByRole("dialog", { name: "Edit Record" })
		await expect(reopened).toBeVisible()
		await expect(
			reopened.getByRole("button", { name: "Allocate statement", exact: true }),
		).toBeVisible()
		await expect(reopened).not.toContainText(imported.description)
	})
	await test.step("Record search sheet: handles query misses and hits, persists attachment, closes with Escape and reopens by click", async () => {
		void workspace
		await page.goto(`/budgets/${budget.id}`)
		const trigger = page.getByRole("button", { name: "Attach Record", exact: true })
		await trigger.click()
		const sheet = page.getByRole("dialog", { name: "Attach record to budget", exact: true })
		await expectVisibleBackdrop(page)
		await sheet.getByRole("searchbox", { name: "Search records" }).fill("no-such-record-999")
		await expect(sheet).toContainText("No matching Records.")
		await sheet.getByRole("searchbox", { name: "Search records" }).fill(record.title)
		await sheet.getByRole("button").filter({ hasText: record.title }).click()
		await expect(sheet).not.toBeVisible()
		await page.reload()
		await expect(page.getByRole("main")).toContainText(record.title)
		await trigger.click()
		await page.keyboard.press("Escape")
		await expect(sheet).not.toBeVisible()
		await trigger.click()
		await expect(sheet).toBeVisible()
	})
})

test("review sheets: show selected descriptions, restore cancelled sheets and retain choices", async ({
	page,
	workspace,
}) => {
	void workspace
	await test.step("replacement review: shows selected descriptions and restores the sheet on cancel", async () => {
		void workspace
		const sheet = await openReplacementSheet(page)
		await expectVisibleBackdrop(page)
		await expect(sheet).toContainText(imported.description)
		await sheet
			.getByRole("searchbox", { name: "Search pending Statements" })
			.fill(pending.description)
		const choice = sheet.getByRole("button").filter({ hasText: pending.description })
		await choice.click()
		const review = page.getByRole("dialog", {
			name: "Review Statement replacement",
			exact: true,
		})
		await expect(review).toBeVisible()
		await expectVisibleBackdrop(page)
		await expect(review).toContainText(pending.description)
		await expect(review).toContainText(imported.description)
		await expect(
			review.getByRole("button", { name: "Replace pending Statement", exact: true }),
		).toBeEnabled()
		await review.getByRole("button", { name: "Cancel", exact: true }).click()
		await expect(sheet).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(sheet).not.toBeVisible()
	})
	await test.step("duplicate review: shows explicit keep and delete choices and retains them after cancel and reopen", async () => {
		void workspace
		await page.goto("/allocator/duplicates")
		// Review stays disabled until both a kept and a deleted Statement are chosen.
		await expect(
			page.getByRole("button", { name: "Review deletion", exact: true }).first(),
		).toBeDisabled()
		await page.getByRole("radio", { name: `Keep ${kept.description}`, exact: true }).click()
		await page
			.getByRole("radio", { name: `Delete ${deleted.description}`, exact: true })
			.click()
		const trigger = page.getByRole("button", { name: "Review deletion", exact: true }).first()
		await trigger.click()
		const dialog = page.getByRole("dialog", {
			name: "Delete duplicate Statements",
			exact: true,
		})
		await expect(dialog).toBeVisible()
		await expect(dialog).toContainText(kept.description)
		await expect(dialog).toContainText(deleted.description)
		await expect(
			dialog.getByRole("button", { name: "Delete 1 Statement", exact: true }),
		).toBeEnabled()
		await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
		await expect(dialog).not.toBeVisible()
		await trigger.click()
		await expect(dialog).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(dialog).not.toBeVisible()
	})
})

test("Statement search sheet: opens with backdrop and reopens after Escape", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto(`/records/${IDS.records.partialPending}`)
	await page.getByRole("button", { name: "Edit Record", exact: true }).click()
	const editor = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await expect(editor).toBeVisible()
	await editor.getByRole("button", { name: "Allocate statement", exact: true }).click()
	const sheet = page.getByRole("dialog", {
		name: "Allocate statements to record",
		exact: true,
	})
	await expect(sheet).toBeVisible()
	await expectVisibleBackdrop(page)
	await page.keyboard.press("Escape")
	await expect(sheet).not.toBeVisible()
	await expect(editor).toBeVisible()
	await editor.getByRole("button", { name: "Allocate statement", exact: true }).click()
	await expect(sheet).toBeVisible()
	await page.keyboard.press("Escape")
	await expect(sheet).not.toBeVisible()
})

test("Record search sheet: opens with backdrop and reopens after Escape", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto(`/budgets/${IDS.budgets.manual}`)
	const trigger = page.getByRole("button", { name: "Attach Record", exact: true })
	await trigger.click()
	const sheet = page.getByRole("dialog", { name: "Attach record to budget", exact: true })
	await expect(sheet).toBeVisible()
	await expectVisibleBackdrop(page)
	await page.keyboard.press("Escape")
	await expect(sheet).not.toBeVisible()
	await trigger.click()
	await expect(sheet).toBeVisible()
	await page.keyboard.press("Escape")
	await expect(sheet).not.toBeVisible()
})

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

test("pending confirmation sheet: stays silent while held after closed time, then resolves", async ({
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

test("Statement search sheet: stays silent while held after closed time, then resolves", async ({
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

test("Record search sheet: stays silent while held after closed time, then resolves", async ({
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

test("pending confirmation sheet: keeps prior rows while a held query change resolves", async ({
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

test("pending confirmation sheet: clears prior rows when reopened for another Statement", async ({
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

test("Statement search sheet: keeps prior rows while a held query change resolves", async ({
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

test("Record search sheet: keeps prior rows while a held query change resolves", async ({
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

test("Statement search sheet: keeps prior rows while a held filter change resolves", async ({
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

test.describe("dense workspace", () => {
	test.use({ workspaceScenario: "dense" })
	const pending = getScenario("dense").tables.statements.filter(statement => statement.is_pending)
	const first = pending.find(statement => statement.description === "Dense pending 13")
	const next = pending.find(statement => statement.description === "Dense pending 26")
	if (!first || !next) throw new Error("Two distinct Pending Statements are required")

	// One dense seed for the whole queue/candidate journey: every step navigates
	// fresh, so URL, alert and history assertions keep their original meaning.
	test("pending queue and candidate search: preserve typing, selection, pagination and Back behaviour", async ({
		page,
		workspace,
		isMobile,
	}) => {
		void workspace
		await test.step("pending queue: typing clears a missing selection and dismisses its availability alert", async () => {
			await page.goto(
				"/allocator/pending?pending_statement_id=deleted-pending-statement&candidate_query=stale&candidate_page=2",
			)
			const alert = page
				.getByRole("alert")
				.filter({ hasText: "Pending Statement unavailable" })
			await expect(alert).toBeVisible()
			const search = page
				.locator('section[aria-label="Pending statements"]')
				.getByPlaceholder("Search descriptions...")
			await search.pressSequentially("Dense pending 26", { delay: 10 })
			await expect(alert).toHaveCount(0)
			await expect(page).not.toHaveURL(/pending_statement_id=/)
			await expect(page).toHaveURL(/query=Dense\+pending\+26/)
			await page.waitForTimeout(650)
			await expect(search).toHaveValue("Dense pending 26")
			await expect(alert).toHaveCount(0)
			await expect(page).not.toHaveURL(
				/pending_statement_id=|candidate_query=|candidate_page=/,
			)
			await expect(page).toHaveURL(/query=Dense\+pending\+26/)
			await expect(page.getByRole("button", { name: /^Dense pending 26\b/ })).toBeVisible()
		})
		await test.step("pending queue: typing clears an orphan candidate query without discarding the queue buffer", async () => {
			await page.goto("/allocator/pending?candidate_query=stale&candidate_page=2")
			const search = page
				.locator('section[aria-label="Pending statements"]')
				.getByPlaceholder("Search descriptions...")
			await expect(search).toBeVisible()
			const historyLength = await page.evaluate(() => history.length)
			await search.pressSequentially("Dense pending 26", { delay: 10 })
			await expect(page).toHaveURL(/query=Dense\+pending\+26/)
			await page.waitForTimeout(650)
			await expect(search).toHaveValue("Dense pending 26")
			await expect(page).not.toHaveURL(/candidate_query=|candidate_page=/)
			await expect(page.getByRole("button", { name: /^Dense pending 26\b/ })).toBeVisible()
			expect((await page.evaluate(() => history.length)) - historyLength).toBeLessThanOrEqual(
				2,
			)
		})
		await test.step("pending selection: resets an unsettled candidate search without replaying it on the next Statement", async () => {
			await page.goto(`/allocator/pending?pending_statement_id=${first.id}`)
			const candidate = page.locator('section[aria-labelledby="candidate-title"]')
			const search = candidate.getByPlaceholder("Search descriptions...")
			await expect(search).toBeVisible()
			// Record when the query was typed and when the next Statement was chosen, to prove the
			// selection changed while the search callback was still pending. This document's
			// 300ms debounces are stretched to 1500ms, so the selection always lands inside
			// the window however slow the host is; the behaviour under test is unchanged.
			await page.evaluate(() => {
				const original = window.setTimeout
				window.setTimeout = ((
					handler: TimerHandler,
					timeout?: number,
					...rest: unknown[]
				) =>
					original(
						handler,
						timeout === 300 ? 1500 : timeout,
						...rest,
					)) as typeof window.setTimeout
				document.addEventListener(
					"click",
					event => {
						const target =
							event.target instanceof Element ? event.target.closest("button") : null
						// On mobile, leaving the candidate panel is the first selection change.
						const text = target?.textContent?.trim() ?? ""
						if (
							!Reflect.has(window, "__selectedAt") &&
							(text.startsWith("Dense pending 26") ||
								text === "Back to pending Statements")
						)
							Reflect.set(window, "__selectedAt", performance.now())
					},
					{ capture: true },
				)
				document.addEventListener(
					"input",
					() => Reflect.set(window, "__filledAt", performance.now()),
					{ capture: true },
				)
			})
			await search.fill("never matches another Statement")
			// The stretched debounce leaves room for ordinary, actionability-checked clicks.
			if (isMobile)
				await page
					.getByRole("button", { name: "Back to pending Statements", exact: true })
					.click()
			await page.getByRole("button", { name: /^Dense pending 26\b/ }).click()
			const gap = await page.evaluate(
				() =>
					Number(Reflect.get(window, "__selectedAt")) -
					Number(Reflect.get(window, "__filledAt")),
			)
			expect(gap, "the selection changed before the search callback could fire").toBeLessThan(
				1500,
			)
			await expect(page).toHaveURL(new RegExp(`pending_statement_id=${next.id}`))
			await expect(
				candidate.getByText("Dense pending 26", { exact: true }).first(),
			).toBeVisible()
			// The outgoing panel remains mounted briefly during its exit transition.
			await expect(search).toHaveCount(1)
			await expect(search).toHaveValue("")
			// Outlast both stretched search callbacks to reject a stale query appearing later.
			await page.waitForTimeout(3200)
			await expect(search).toHaveValue("")
			await expect(page).not.toHaveURL(/candidate_query=/)
		})
		await test.step("pending queue: typing retains every character while clearing the old selection", async () => {
			await page.goto(`/allocator/pending?pending_statement_id=${first.id}`)
			await expect(page.locator('section[aria-labelledby="candidate-title"]')).toBeVisible()
			if (isMobile) {
				await page
					.getByRole("button", { name: "Back to pending Statements", exact: true })
					.click()
				// Let the Back commit land and the candidate panel finish exiting
				// before typing: keystrokes during the transition race the commit.
				// Mobile-only: other projects show both panels, so typing there also
				// exercises clearing the live selection (asserted below); the mobile
				// run only proves character retention and history bounds.
				// The 30s budget covers cold-commit latency on dev servers; the
				// committed-URL assertions that follow stay strict.
				await expect(page).not.toHaveURL(/pending_statement_id=/, { timeout: 30000 })
				await page.waitForTimeout(500)
			}
			const search = page
				.locator('section[aria-label="Pending statements"]')
				.getByPlaceholder("Search descriptions...")
			const historyLength = await page.evaluate(() => history.length)
			await search.pressSequentially("Dense pending 26", { delay: 10 })
			await expect(search).toHaveValue("Dense pending 26")
			await expect(page).toHaveURL(/query=Dense\+pending\+26/)
			await expect(page).not.toHaveURL(/pending_statement_id=/)
			await page.waitForTimeout(650)
			await expect(search).toHaveValue("Dense pending 26")
			await expect(page.getByRole("button", { name: /^Dense pending 26\b/ })).toBeVisible()
			// One selection-clear navigation and one debounced query navigation are
			// sufficient; repeated clear intents must not add an entry per character.
			expect((await page.evaluate(() => history.length)) - historyLength).toBeLessThanOrEqual(
				2,
			)
		})
		await test.step("queue pagination: survives a candidate search commit", async () => {
			// Regression: timer-built URLs must not drop params from navigation that
			// bypasses the intent mirror (footer Links, Back/Forward). Paginate AFTER
			// the last pushParams push (selection): without invalidation the mirror
			// still holds the pre-pagination params and the timer commit drops
			// page=2. Each action waits for its commit.
			await page.goto("/allocator/pending?per_page=2")
			await page
				.getByRole("button", { name: /^Dense pending \d+/ })
				.first()
				.click()
			await expect(page).toHaveURL(/pending_statement_id=/)
			const selected = new URL(page.url()).searchParams.get("pending_statement_id")
			if (isMobile) {
				// The queue (and its footer) hides behind the selection on mobile,
				// so paginate by navigating with the selection preserved.
				await page.goto(
					`/allocator/pending?per_page=2&page=2&pending_statement_id=${selected}`,
				)
			} else {
				await page.getByRole("link", { name: "Go to next page", exact: true }).click()
			}
			await expect(page).toHaveURL(/[?&]page=2(&|$)/)
			const candidate = page
				.locator('section[aria-labelledby="candidate-title"]')
				.getByPlaceholder("Search descriptions...")
			await expect(candidate).toBeVisible()
			await candidate.fill("Dense Record")
			await expect(page).toHaveURL(/candidate_query=Dense\+Record/)
			await expect(page).toHaveURL(/[?&]page=2(&|$)/)
			await expect(page).toHaveURL(/pending_statement_id=/)
		})
		await test.step("browser Back: queue typing does not restore the Account filter", async () => {
			// Same stale-mirror hazard via popstate instead of Links.
			await page.goto("/allocator/pending")
			// Single combobox on this route (probed): the account filter trigger.
			// Display names are not zero-padded ("Dense Account 1", id t1-d-acc-01).
			await page.getByRole("combobox").first().click()
			await pickOption(page.getByRole("option", { name: "Dense Account 1", exact: true }))
			await expect(page).toHaveURL(/account_id=t1-d-acc-01/)
			await page.goBack()
			await expect(page).not.toHaveURL(/account_id=/)
			const search = page
				.locator('section[aria-label="Pending statements"]')
				.getByPlaceholder("Search descriptions...")
			await search.pressSequentially("Dense pending 26", { delay: 10 })
			await expect(page).toHaveURL(/query=Dense\+pending\+26/)
			await expect(page).not.toHaveURL(/account_id=/)
		})
	})
})

test.describe("dense workspace", () => {
	test.use({ workspaceScenario: "dense" })

	test("pending queue search: typing on while an earlier query commits keeps every character", async ({
		page,
		workspace,
	}) => {
		void workspace
		// When the 300ms debounce fires for "D" and starts its commit, type the rest in
		// that same task, so the commit always lands after newer keystrokes. Mirroring it
		// back into the input used to drop them ("Dnding 26" on a fast host).
		await page.addInitScript(() => {
			const original = window.setTimeout
			window.setTimeout = ((handler: TimerHandler, timeout?: number, ...rest: unknown[]) =>
				original(() => {
					if (typeof handler === "function") handler(...rest)
					const input = document.querySelector<HTMLInputElement>(
						'section[aria-label="Pending statements"] input[placeholder="Search descriptions..."]',
					)
					if (timeout !== 300 || input?.value !== "D" || Reflect.has(window, "__typedOn"))
						return
					Reflect.set(window, "__typedOn", true)
					const setValue = Object.getOwnPropertyDescriptor(
						HTMLInputElement.prototype,
						"value",
					)?.set
					for (const character of "ense pending 26") {
						setValue?.call(input, input.value + character)
						input.dispatchEvent(new Event("input", { bubbles: true }))
					}
				}, timeout)) as typeof window.setTimeout
		})
		await page.goto("/allocator/pending")
		const search = page
			.locator('section[aria-label="Pending statements"]')
			.getByPlaceholder("Search descriptions...")
		await expect(search).toBeVisible()
		await search.pressSequentially("D")
		await expect.poll(() => page.evaluate(() => Reflect.has(window, "__typedOn"))).toBe(true)
		await expect(page).toHaveURL(/query=Dense\+pending\+26/)
		await expect(search).toHaveValue("Dense pending 26")
	})
})
