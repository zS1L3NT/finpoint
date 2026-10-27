import type { Page } from "@playwright/test"
import timeline from "../../src/lib/guide-video-timeline.json" with { type: "json" }
import { expectPointerCursor } from "../support/assertions"
import { expect, seedWorkspace, test } from "../support/fixtures"
import { fits } from "../support/tables"

async function clearLearning(page: Page) {
	await page.evaluate(async () => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
			open.onerror = () => reject(open.error)
		})
		try {
			await new Promise<void>((resolve, reject) => {
				const transaction = database.transaction("learning", "readwrite")
				transaction.oncomplete = () => resolve()
				transaction.onerror = () => reject(transaction.error)
				transaction.objectStore("learning").clear()
			})
		} finally {
			database.close()
		}
	})
}

async function setLearning(page: Page, value: Record<string, unknown>) {
	await page.evaluate(async (json: string) => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
			open.onerror = () => reject(open.error)
		})
		try {
			await new Promise<void>((resolve, reject) => {
				const transaction = database.transaction("learning", "readwrite")
				transaction.oncomplete = () => resolve()
				transaction.onerror = () => reject(transaction.error)
				transaction.objectStore("learning").put({ key: "guide-v1", value: json })
			})
		} finally {
			database.close()
		}
	}, JSON.stringify(value))
}

async function addFullAllocations(page: Page) {
	await page.evaluate(
		async (ids: string[]) => {
			const database = await new Promise<IDBDatabase>((resolve, reject) => {
				const open = indexedDB.open("finpoint")
				open.onsuccess = () => resolve(open.result)
				open.onerror = () => reject(open.error)
			})
			try {
				const statements = await new Promise<{ id: string; amount: number }[]>(
					(resolve, reject) => {
						const request = database
							.transaction("statements", "readonly")
							.objectStore("statements")
							.getAll()
						request.onsuccess = () =>
							resolve(
								(request.result as { id: string; amount: number }[]).filter(row =>
									ids.includes(row.id),
								),
							)
						request.onerror = () => reject(request.error)
					},
				)
				await new Promise<void>((resolve, reject) => {
					const transaction = database.transaction("allocations", "readwrite")
					transaction.oncomplete = () => resolve()
					transaction.onerror = () => reject(transaction.error)
					const store = transaction.objectStore("allocations")
					for (const statement of statements)
						store.put({
							statement_id: statement.id,
							record_id: "t1-r-salary",
							amount: statement.amount,
						})
				})
			} finally {
				database.close()
			}
		},
		["t1-s-dup-a", "t1-s-dup-b", "t1-s-free-1", "t1-s-free-2", "t1-s-sep-a", "t1-s-sep-b"],
	)
}

test("help hub: search filters chapters and chapter cards link to articles", async ({ page }) => {
	await seedWorkspace(page, "populated")
	await clearLearning(page)
	await page.goto("/help")
	await expect(page.getByRole("heading", { name: "How can we help?", exact: true })).toBeVisible()
	await expect(page.locator("header h1")).toHaveText("Help & guides")
	const search = page.getByRole("searchbox", { name: "Search the guides" })
	await expect(search).toBeVisible()
	await expect(page.getByRole("heading", { name: "Finpoint, from the beginning" })).toBeVisible()
	await expect(page.getByRole("link", { name: "Watch" })).toBeVisible()
	await expect(search).toHaveValue("")
	await search.fill("Splitting one payment")
	await expect(page.getByRole("link", { name: /Splitting one payment/ }).first()).toBeVisible()
	await search.fill("no-such-guide-xyz")
	await expect(page.getByText(/No matching chapter/)).toBeVisible()
	await search.fill("")
	const card = page.getByRole("link", { name: /Splitting one payment/ }).first()
	await expect(card).toBeVisible()
	await expect(card).toContainText("Explain one Statement with several Records")
	await card.focus()
	await page.keyboard.press("Enter")
	await expect(page).toHaveURL(/\/help\?topic=split/)
	await expect(
		page.getByRole("heading", { name: "Splitting one payment", exact: true }),
	).toBeVisible()
	await expect(page.getByText(/supermarket trip/)).toBeVisible()
})

test("help article: destination, video and figure links open their targets", async ({ page }) => {
	await seedWorkspace(page, "populated")
	await clearLearning(page)
	await page.goto("/help?topic=lunch")
	await expect(
		page.getByRole("heading", { name: "Explaining your first purchase", exact: true }),
	).toBeVisible()
	await expect(page.getByText(/\$12 lunch/)).toBeVisible()
	const steps = page.locator("ol li")
	await expect(steps.first()).toBeVisible()
	expect(await steps.count()).toBeGreaterThanOrEqual(4)
	const figure = page.locator('figure img[src*="/guide/stills/lunch-"]').first()
	await expect(figure).toBeAttached()
	await expect(figure).toHaveAttribute("src", /\/guide\/stills\/lunch-/)
	const destination = page.getByRole("link", { name: "Open Workflows" })
	await expect(destination).toBeVisible()
	await expectPointerCursor(destination)
	await expect(destination).toHaveAttribute("href", "/allocator")
	await destination.click()
	await expect(page).toHaveURL(/\/allocator(\?|$)/)
	await page.goto("/help?topic=lunch")
	const watch = page.getByRole("link", { name: "Watch this chapter" })
	await expect(watch).toBeVisible()
	await expectPointerCursor(watch)
	await expect(watch).toHaveAttribute("href", "/help/video?chapter=lunch")
	await watch.click()
	await expect(page).toHaveURL(/\/help\/video\?chapter=lunch/)
	await expect(page.getByText("Explaining your first purchase").first()).toBeVisible()
	await page.goto("/help?topic=lunch")
	const still = page.getByRole("link", { name: "Watch this in the video guide" }).first()
	await expect(still).toBeVisible()
	await expect(still).toHaveAttribute("href", "/help/video?chapter=lunch")
	await still.focus()
	await page.keyboard.press("Enter")
	await expect(page).toHaveURL(/\/help\/video\?chapter=lunch/)
})

test("help review: month confirmation persists across reload", async ({ page }) => {
	await seedWorkspace(page, "populated")
	await clearLearning(page)
	await page.goto("/help?topic=dashboard")
	await expect(
		page.getByRole("heading", { name: "Where your numbers come from", exact: true }),
	).toBeVisible()
	await expect(page.getByText(/After checking October 2026/)).toBeVisible()
	const confirm = page.getByRole("button", { name: "I reviewed October 2026" })
	await expect(confirm).toBeVisible()
	await expect(confirm).toBeEnabled()
	await expectPointerCursor(confirm)
	await confirm.click()
	await expect(page.getByRole("button", { name: "October review confirmed" })).toBeDisabled()
	await page.reload()
	await expect(page.getByRole("button", { name: "October review confirmed" })).toBeDisabled()
	const mark = page.getByRole("button", { name: "Mark as reviewed" })
	await expect(mark).toBeVisible()
	await expectPointerCursor(mark)
	await mark.click()
	await expect(page.getByRole("button", { name: "Reviewed" })).toBeDisabled()
	await page.reload()
	await expect(page.getByRole("button", { name: "October review confirmed" })).toBeDisabled()
	await expect(page.getByRole("button", { name: "Reviewed" })).toBeDisabled()
})

test("help backup: found-file confirmation persists after a requested download", async ({
	page,
}) => {
	await seedWorkspace(page, "populated")
	await clearLearning(page)
	const requested = new Date().toISOString()
	await setLearning(page, {
		reviewed: [],
		videoFrame: 0,
		lastImportAt: null,
		lastRecordId: null,
		reviewedMonth: null,
		backupRequestedAt: requested,
		backupLocatedAt: null,
	})
	await page.goto("/help?topic=sync")
	await expect(
		page.getByRole("heading", { name: "Backups and Google Drive", exact: true }),
	).toBeVisible()
	await expect(page.getByText(/A backup download was requested/)).toBeVisible()
	const found = page.getByRole("button", {
		name: "I found and kept the backup file",
	})
	await expect(found).toBeVisible()
	await expect(found).toBeEnabled()
	await expectPointerCursor(found)
	await found.click()
	await expect(
		page.getByRole("button", { name: "File located (confirmed by you)" }),
	).toBeDisabled()
	await page.reload()
	await expect(
		page.getByRole("button", { name: "File located (confirmed by you)" }),
	).toBeDisabled()
})

test("help progress: milestones and video card reflect saved learning", async ({ page }) => {
	test.setTimeout(90_000)
	await seedWorkspace(page, "populated")
	await clearLearning(page)
	await page.goto("/help")
	await expect(page.getByText("0 of 4 done", { exact: true })).toBeVisible()
	await expect(page.getByRole("link", { name: "Watch" })).toBeVisible()
	const now = new Date().toISOString()
	await setLearning(page, {
		reviewed: ["lunch", "split"],
		videoFrame: 3000,
		lastImportAt: now,
		lastRecordId: "t1-r-groceries",
		reviewedMonth: "2026-10",
		backupRequestedAt: now,
		backupLocatedAt: now,
	})
	await page.goto("/help")
	await expect(page.getByText("4 of 4 done", { exact: true })).toBeVisible()
	await expect(page.getByText("Imported · Statements are present")).toBeVisible()
	await expect(page.getByText("2026-10 reviewed (confirmed by you)")).toBeVisible()
	await expect(page.getByText("Backup located (confirmed by you)")).toBeVisible()
	const resume = page.getByRole("link", { name: "Resume" })
	await expect(resume).toBeVisible()
	await expect(resume).toHaveAttribute("href", "/help/video")
	await expect(page.getByText(/Paused at 1:40/)).toBeVisible()
	await expectPointerCursor(resume)
	await resume.click()
	await expect(page).toHaveURL(/\/help\/video$/)
	await page.goto("/help")
	const milestone = page.getByRole("link", { name: /Bring in bank activity/ })
	await expect(milestone).toBeVisible()
	await milestone.click()
	await expect(page).toHaveURL(/\/help\?topic=import/)
})

test("help panel: related guides, full guide and back controls work", async ({ page }) => {
	await seedWorkspace(page, "populated")
	await clearLearning(page)
	await page.goto("/allocator")
	await page.getByRole("button", { name: "Help" }).first().click()
	const menu = page.getByRole("menu")
	await expect(menu.getByRole("menuitem", { name: "Splitting one payment" })).toBeVisible()
	await menu.getByRole("menuitem", { name: "Splitting one payment" }).click()
	const panel = page.getByRole("dialog")
	await expect(panel.getByRole("heading", { name: "Splitting one payment" })).toBeVisible()
	const related = panel.getByRole("combobox", { name: "Related guides" })
	await expect(related).toHaveText("Splitting one payment")
	await related.click()
	await page.getByRole("option", { name: "Workflows" }).click()
	await expect(panel.getByRole("heading", { name: "Workflows" })).toBeVisible()
	await expect(related).toHaveText("Workflows")
	const full = panel.getByRole("link", { name: /Full guide/ })
	await expect(full).toHaveAttribute("href", "/help?topic=allocator")
	await panel.getByRole("button", { name: "Back to what I was doing" }).click()
	await expect(panel).toHaveCount(0)
	await expect(page).toHaveURL(/\/allocator/)
})

test("help form: tooltip button opens the section guide beside the dialog", async ({ page }) => {
	await seedWorkspace(page, "populated")
	await clearLearning(page)
	await page.goto("/records")
	await page.getByRole("button", { name: "Create Pending Record" }).click()
	const dialog = page.getByRole("dialog", { name: "Create New Record" })
	await expect(dialog).toBeVisible()
	const help = dialog.getByRole("button", { name: "How this form works" })
	await expect(help).toBeVisible()
	await help.hover()
	await expect(page.getByRole("tooltip", { name: "How this form works" })).toBeVisible()
	await help.click()
	const panel = page.getByRole("dialog", { name: "Explaining your first purchase" })
	await expect(
		panel.getByRole("heading", { name: "Explaining your first purchase" }),
	).toBeVisible()
	await panel.getByRole("button", { name: "Back to what I was doing" }).click()
	await expect(panel).toHaveCount(0)
	await expect(dialog).toBeVisible()
})

test("empty guide: empty allocator and records explain import with working links", async ({
	page,
}) => {
	test.setTimeout(90_000)
	await seedWorkspace(page, "empty")
	await clearLearning(page)
	await page.goto("/allocator")
	await expect(
		page.getByText("No bank Statements in this workspace yet", { exact: true }),
	).toBeVisible()
	await expect(page.getByText(/Import a supported bank CSV/, { exact: false })).toBeVisible()
	const open = page.getByRole("link", { name: "Open Importer" })
	await expect(open).toBeVisible()
	await expectPointerCursor(open)
	await open.click()
	await expect(page).toHaveURL(/\/importer$/)
	await page.goto("/allocator")
	await page.getByRole("link", { name: "Help & guides" }).first().click()
	await expect(page).toHaveURL(/\/help$/)
	await expect(page.getByRole("button", { name: "Clear filters" })).toHaveCount(0)
	await page.goto("/records")
	await expect(
		page.getByText("No bank Statements in this workspace yet", { exact: true }),
	).toBeVisible()
	const recordsOpen = page.getByRole("link", { name: "Open Importer" })
	await recordsOpen.click()
	await expect(page).toHaveURL(/\/importer$/)
})

test("empty guide: filtered lists explain hiding with a working clear", async ({ page }) => {
	test.setTimeout(90_000)
	await seedWorkspace(page, "populated")
	await clearLearning(page)
	await page.goto("/allocator?query=no-such-statement-xyz")
	await expect(
		page.getByText("Your filters may be hiding the item you want", { exact: true }),
	).toBeVisible()
	const help = page.getByRole("link", { name: "Help me find my data" })
	await expect(help).toHaveAttribute("href", "/help?topic=allocator")
	await help.click()
	await expect(page).toHaveURL(/\/help\?topic=allocator/)
	await page.goto("/allocator?query=no-such-statement-xyz")
	const clear = page.getByRole("button", { name: "Clear filters" }).last()
	await expect(clear).toBeVisible()
	await expectPointerCursor(clear)
	await clear.click()
	await expect(page).toHaveURL(/\/allocator(\?|$)/)
	await expect(page.getByText("STARBUCKS 4455").filter({ visible: true }).first()).toBeVisible()
	await page.goto("/records?query=no-such-record-xyz")
	await expect(
		page.getByText("Your filters may be hiding the item you want", { exact: true }),
	).toBeVisible()
	await page.getByRole("button", { name: "Clear filters" }).last().click()
	await expect(page.getByText("FairPrice Run").filter({ visible: true }).first()).toBeVisible()
})

test("empty guide: full allocation and first-purchase states link onward", async ({ page }) => {
	test.setTimeout(90_000)
	await seedWorkspace(page, "populated")
	await addFullAllocations(page)
	await page.reload()
	await page.goto("/allocator")
	await expect(
		page.getByText("No remaining Statement amounts to explain", { exact: true }),
	).toBeVisible()
	const view = page.getByRole("link", { name: "View Statements" })
	await expect(view).toHaveAttribute("href", "/statements")
	await view.click()
	await expect(page).toHaveURL(/\/statements(\?|$)/)
	await seedWorkspace(page, "populated", {
		records: [],
		allocations: [],
		budget_records: [],
	})
	await clearLearning(page)
	await page.goto("/records")
	await expect(
		page.getByText("Bank activity is here. Now explain your first purchase.", {
			exact: true,
		}),
	).toBeVisible()
	const learn = page.getByRole("link", { name: "Learn your first purchase" })
	await expect(learn).toHaveAttribute("href", "/help?topic=lunch")
	await learn.click()
	await expect(page).toHaveURL(/\/help\?topic=lunch/)
})

test("pending help: record amounts, reasons and guide open from the dialog", async ({ page }) => {
	await seedWorkspace(page, "populated")
	await clearLearning(page)
	await page.goto("/records/t1-r-partial")
	const trigger = page.getByRole("button", { name: "Why Pending?" })
	await expect(trigger).toBeVisible()
	await expectPointerCursor(trigger)
	await trigger.click()
	const dialog = page.getByRole("dialog", { name: "Why this Record is Pending" })
	await expect(dialog).toBeVisible()
	await expect(dialog.getByText("Record amount", { exact: true })).toBeVisible()
	await expect(dialog).toContainText("-$60.00")
	await expect(dialog).toContainText("-$25.00")
	await expect(dialog).toContainText("-$35.00")
	await expect(dialog.getByText("Allocations", { exact: true })).toBeVisible()
	await expect(dialog.getByText(/does not match the Record amount/)).toBeVisible()
	await expect(dialog.locator('figure img[src*="/guide/stills/pending-"]').first()).toBeAttached()
	expect(
		await dialog.locator('figure img[src*="/guide/stills/pending-"]').count(),
	).toBeGreaterThan(0)
	await page.keyboard.press("Escape")
	await expect(dialog).toHaveCount(0)
	await page.goto("/records/t1-r-pending")
	await page.getByRole("button", { name: "Why Pending?" }).click()
	const tally = page.getByRole("dialog", { name: "Why this Record is Pending" })
	await expect(tally.getByText(/amounts tally, but this Record uses/)).toBeVisible()
	await expect(tally).toContainText("-$14.50")
	await page.keyboard.press("Escape")
	await expect(tally).toHaveCount(0)
})

test("help video page: resume, chapter list and read-article links work", async ({ page }) => {
	await seedWorkspace(page, "populated")
	await clearLearning(page)
	await setLearning(page, {
		reviewed: [],
		videoFrame: 3000,
		lastImportAt: null,
		lastRecordId: null,
		reviewedMonth: null,
		backupRequestedAt: null,
		backupLocatedAt: null,
	})
	await page.goto("/help/video")
	await expect(
		page.getByRole("heading", { name: "Finpoint, from the beginning", exact: true }),
	).toBeVisible()
	await expect(page.locator("header h1")).toHaveText("Help & guides")
	const video = page.locator("video")
	await expect(video).toHaveAttribute("src", "/guide/finpoint-guide.mp4")
	await expect(video).toHaveAttribute("poster", "/guide/poster.jpg")
	await expect
		.poll(() => video.evaluate((el: HTMLVideoElement) => el.readyState))
		.toBeGreaterThanOrEqual(2)
	await expect
		.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
		.toBeCloseTo(3000 / timeline.fps, 1)
	const nav = page.getByRole("navigation", { name: "Video chapters" })
	await expect(nav.getByRole("link")).toHaveCount(timeline.chapters.length)
	await expect(page.getByText("Why Finpoint?").first()).toBeVisible()
	const read = page.getByRole("link", { name: "Read article" })
	await expect(read).toHaveAttribute("href", "/help?topic=model")
	await expectPointerCursor(read)
	await read.click()
	await expect(page).toHaveURL(/\/help\?topic=model/)
	await expect(
		page.getByRole("heading", { name: "Statements, Records and Allocations", exact: true }),
	).toBeVisible()
	await page.goto("/help/video")
	await expect(
		page.getByRole("heading", { name: "Finpoint, from the beginning", exact: true }),
	).toBeVisible()
	const all = page.getByRole("link", { name: "All help topics" })
	await expect(all).toBeVisible()
	await all.click()
	await expect(page).toHaveURL(/\/help$/)
	await expect(page.getByRole("heading", { name: "How can we help?", exact: true })).toBeVisible()
	await page.goto("/help/video")
	await expect(
		page.getByRole("heading", { name: "Finpoint, from the beginning", exact: true }),
	).toBeVisible()
	const selected = timeline.chapters[1]
	if (!selected) throw new Error("Missing chapter fixture")
	const link = page.getByRole("navigation", { name: "Video chapters" }).getByRole("link").nth(1)
	await expect(link).toContainText(selected.title)
	await link.click()
	await expect
		.poll(() => page.locator("video").evaluate((el: HTMLVideoElement) => el.currentTime))
		.toBeCloseTo(selected.startFrame / timeline.fps, 1)
	await expect(page).toHaveURL(new RegExp(`/help/video\\?chapter=${selected.id}`))
	await fits(page, page.getByRole("heading", { name: "Finpoint, from the beginning" }))
})
