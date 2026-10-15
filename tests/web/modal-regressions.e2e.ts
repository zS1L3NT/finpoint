import {
	expectDropdownPreservesScroll,
	expectPopupEntrance,
	expectVisibleBackdrop,
	sampleVisibleRowAnimations,
} from "./support/assertions"
import { getScenario, IDS } from "./support/data"
import { expect, test } from "./support/fixtures"

test("editor popup fades and moves through intermediate rendered frames", async ({
	page,
}, testInfo) => {
	await page.goto("/categories", { waitUntil: "domcontentloaded" })
	const trigger = page.getByRole("button", { name: "Create Category", exact: true })
	await expect(trigger).toBeVisible()
	const samples = await sampleVisibleRowAnimations(page, '[data-slot="dialog-content"]', () =>
		trigger.click(),
	)
	await testInfo.attach("popup-frames", {
		body: JSON.stringify(samples),
		contentType: "application/json",
	})
	expect(samples).toHaveLength(1)
	const popup = samples[0]
	if (!popup) throw new Error("Popup was not sampled")
	const frames = popup.frames
	const last = frames.at(-1)
	if (!last) throw new Error("Popup has no rendered frames")
	if (testInfo.project.use.reducedMotion !== "reduce") {
		expect(
			frames.filter(frame => frame.opacity > 0 && frame.opacity < 1).length,
		).toBeGreaterThan(1)
		expect(new Set(frames.map(frame => frame.transform)).size).toBeGreaterThan(2)
	} else {
		expect(frames.every(frame => frame.transform === last.transform)).toBe(true)
	}
	expect(last.opacity).toBe(1)
	expect(Math.max(...frames.map(frame => frame.yOverflow))).toBeLessThanOrEqual(
		last.yOverflow + 1,
	)
	await expectVisibleBackdrop(page)
	await page.keyboard.press("Escape")
	await expect(page.getByRole("dialog")).toHaveCount(0)
	await expect(trigger).toBeFocused()
	for (let cycle = 0; cycle < 3; cycle++) {
		await trigger.click()
		await expect(page.getByRole("dialog")).toBeVisible()
		await page.keyboard.press("Escape")
		await trigger.click()
		await expect(page.getByRole("dialog")).toHaveCount(1)
		await expectVisibleBackdrop(page)
		await page.keyboard.press("Escape")
		await expect(page.getByRole("dialog")).toHaveCount(0)
	}
})

test("pending Record editor opens with initial content already laid out", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto(`/records/${IDS.records.partialPending}`, { waitUntil: "domcontentloaded" })
	const trigger = page.getByRole("button", { name: "Edit Record", exact: true })
	await expect(trigger).toBeVisible()
	await expectPopupEntrance(page, () => trigger.click())
	await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
		"Amount does not match the sum of Allocation Amounts",
	)
})

test("dropdown keeps the page scrollable and supports keyboard selection after reopening", async ({
	page,
}) => {
	await page.goto("http://127.0.0.1:5174/?section=primitives", { waitUntil: "domcontentloaded" })
	const trigger = page.getByRole("button", { name: "Open menu", exact: true })
	await trigger.scrollIntoViewIfNeeded()
	await expectDropdownPreservesScroll(page, () => trigger.click())
	await page.keyboard.press("Escape")
	await expect(page.getByRole("menu")).toHaveCount(0)
	await expect(trigger).toBeFocused()
	await trigger.press("Enter")
	await expect(page.getByRole("menuitem", { name: "Edit item", exact: true })).toBeFocused()
	await page.keyboard.press("Enter")
	await expect(page.getByTestId("dropdown-value")).toContainText("Menu: edit")
	await expect(page.getByRole("menu")).toHaveCount(0)
})

for (const modal of [
	{ trigger: "Open dialog", role: "dialog", title: "Harness dialog", close: "Close dialog" },
	{ trigger: "Open sheet", role: "dialog", title: "Harness sheet", close: "Close sheet" },
	{
		trigger: "Delete workspace",
		role: "alertdialog",
		title: "Delete workspace?",
		close: "Cancel",
	},
] as const) {
	test(`${modal.title}: backdrop, keyboard focus containment and restoration`, async ({
		page,
	}) => {
		await page.goto("http://127.0.0.1:5174/?section=primitives", {
			waitUntil: "domcontentloaded",
		})
		const trigger = page.getByRole("button", { name: modal.trigger, exact: true })
		await trigger.focus()
		await trigger.press("Enter")
		const popup = page.getByRole(modal.role, { name: modal.title, exact: true })
		await expect(popup).toBeVisible()
		await expectVisibleBackdrop(page)
		for (let step = 0; step < 5; step++) {
			await page.keyboard.press("Tab")
			expect(await popup.evaluate(element => element.contains(document.activeElement))).toBe(
				true,
			)
		}
		await popup.getByRole("button", { name: modal.close, exact: true }).click()
		await expect(popup).not.toBeVisible()
		await expect(trigger).toBeFocused()
		await trigger.press("Enter")
		await expect(popup).toBeVisible()
		await page.keyboard.press("Escape")
		await expect(popup).not.toBeVisible()
		await expect(trigger).toBeFocused()
	})
}

test("replacement review popup fades with stable initial content", async ({ page, workspace }) => {
	void workspace
	await page.goto("/allocator")
	await page
		.getByRole("checkbox", {
			name: `Select statement ${IDS.statements.unallocated[3]}`,
			exact: true,
		})
		.check()
	await page.getByRole("button", { name: "Replace Pending", exact: true }).click()
	const sheet = page.getByRole("dialog", { name: "Replace a pending Statement", exact: true })
	await expect(sheet).toBeVisible()
	await sheet.getByRole("searchbox", { name: "Search pending Statements" }).fill("Pasar malam")
	const choice = sheet.getByRole("button").filter({ hasText: "Pasar malam" })
	await expectPopupEntrance(page, () => choice.click())
	const review = page.getByRole("dialog", { name: "Review Statement replacement", exact: true })
	await expect(review).toContainText("Pasar malam")
	await expectVisibleBackdrop(page)
	await review.getByRole("button", { name: "Cancel", exact: true }).click()
	await expect(sheet).toBeVisible()
	await page.keyboard.press("Escape")
	await expect(sheet).not.toBeVisible()
})

test("statement search sheet opens with backdrop and reopens after Escape", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto(`/records/${IDS.records.partialPending}`)
	await page.getByRole("button", { name: "Edit Record", exact: true }).click()
	const editor = page.getByRole("dialog", { name: "Edit Record", exact: true })
	await expect(editor).toBeVisible()
	await editor.getByRole("button", { name: "Allocate statement", exact: true }).click()
	const sheet = page.getByRole("dialog", { name: "Allocate statements to record", exact: true })
	await expect(sheet).toBeVisible()
	await expectVisibleBackdrop(page)
	await page.keyboard.press("Escape")
	await expect(sheet).not.toBeVisible()
	await expect(editor).toBeVisible()
	await editor.getByRole("button", { name: "Allocate statement", exact: true }).click()
	await expect(sheet).toBeVisible()
})

test("record search sheet opens with backdrop and reopens after Escape", async ({
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
})

for (const action of ["Cancel", "Fix"] as const) {
	test(`duplicate review exit fades popup and backdrop through intermediate alpha then removal${action === "Fix" ? " after Fix" : ""}`, async ({
		page,
		workspace,
	}, testInfo) => {
		void workspace
		const tables = getScenario("populated").tables
		const keptDescription =
			tables.statements.find(s => s.id === IDS.statements.duplicatePair[0])?.description ?? ""
		const deletedDescription =
			tables.statements.find(s => s.id === IDS.statements.duplicatePair[1])?.description ?? ""
		// Second pair, seeded raw below with primitive literals only: distinct IDs
		// and reworded-but-matching descriptions, same account/day/amount.
		const secondKeepId = "t1-s-dupexit-a"
		const secondDeleteId = "t1-s-dupexit-b"
		const secondKeepDescription = "QUICKEXIT PROBE 5511 SECONDARY"
		const secondDeleteDescription = "SECONDARY 5511 QUICKEXIT PROBE"
		await page.evaluate(
			async ({ keepId, deleteId, keepDescription, deleteDescription }) => {
				const database = await new Promise<IDBDatabase>((resolve, reject) => {
					const open = indexedDB.open("finpoint")
					open.onsuccess = () => resolve(open.result)
					open.onerror = () => reject(open.error)
				})
				try {
					await new Promise<void>((resolve, reject) => {
						const transaction = database.transaction("statements", "readwrite")
						transaction.oncomplete = () => resolve()
						transaction.onabort = () => reject(transaction.error)
						const table = transaction.objectStore("statements")
						table.add({
							id: keepId,
							account_id: "t1-acc-revolut",
							datetime: "2026-10-06 09:14",
							description: keepDescription,
							amount: -28.9,
							index: 3,
							is_pending: 0,
						})
						table.add({
							id: deleteId,
							account_id: "t1-acc-revolut",
							datetime: "2026-10-06 09:14",
							description: deleteDescription,
							amount: -28.9,
							index: 4,
							is_pending: 0,
						})
					})
				} finally {
					database.close()
				}
			},
			{
				keepId: secondKeepId,
				deleteId: secondDeleteId,
				keepDescription: secondKeepDescription,
				deleteDescription: secondDeleteDescription,
			},
		)
		await page.goto("/allocator/duplicates")
		await page.getByRole("radio", { name: `Keep ${keptDescription}`, exact: true }).click()
		await page.getByRole("radio", { name: `Delete ${deletedDescription}`, exact: true }).click()
		const trigger = page.getByRole("button", { name: "Review deletion", exact: true }).first()
		await expectPopupEntrance(page, () => trigger.click())
		const dialog = page.getByRole("dialog", {
			name: "Delete duplicate Statements",
			exact: true,
		})
		await expect(dialog).toBeVisible()
		await expectVisibleBackdrop(page)
		const reduced = testInfo.project.use.reducedMotion === "reduce"
		// Record real rendered opacity through the close; the page clears the
		// review input synchronously, so only a latched popup/backdrop can fade.
		const recorder = await page.evaluateHandle(() => {
			const frames: {
				time: number
				popupOpacity: number | null
				popupPose: string | null
				backdropOpacity: number | null
				dialogs: number
				backdrops: number
			}[] = []
			let stopped = false
			let closedAt = 0
			let readyResolve: () => void = () => {
				throw new Error("recorder ready executor did not run")
			}
			const ready = new Promise<void>(resolve => {
				readyResolve = resolve
			})
			const done = new Promise<typeof frames>(resolve => {
				let first = true
				const sample = (now: number) => {
					if (first) {
						first = false
						readyResolve()
					}
					if (stopped) {
						resolve(frames)
						return
					}
					const popup = document.querySelector('[data-slot="dialog-content"]')
					const backdrop = document.querySelector('[data-slot="dialog-overlay"]')
					const popupStyle = popup ? getComputedStyle(popup) : null
					frames.push({
						time: now,
						popupOpacity: popupStyle ? Number(popupStyle.opacity) : null,
						popupPose: popupStyle
							? `${popupStyle.transform}|${popupStyle.translate}|${popupStyle.scale}|${popupStyle.rotate}`
							: null,
						backdropOpacity: backdrop
							? Number(getComputedStyle(backdrop).opacity)
							: null,
						dialogs: document.querySelectorAll('[role="dialog"]').length,
						backdrops: document.querySelectorAll('[data-slot="dialog-overlay"]').length,
					})
					if (closedAt > 0 && now - closedAt > 800) resolve(frames)
					else requestAnimationFrame(sample)
				}
				requestAnimationFrame(sample)
			})
			void done.catch(() => undefined)
			return {
				done,
				ready,
				markClosed: () => {
					closedAt = performance.now()
				},
				stop: () => {
					stopped = true
				},
			}
		})
		try {
			// Wait for the first native rAF sample while the popup is still open,
			// so the first-frame dialogs/opacity assertions are deterministic.
			await recorder.evaluate(state => state.ready)
			await dialog
				.getByRole("button", {
					name: action === "Fix" ? /^Delete \d+ Statements?$/ : "Cancel",
				})
				.click()
			await expect(page.getByRole("dialog")).toHaveCount(0)
			await expect(page.locator('[data-slot="dialog-overlay"]')).toHaveCount(0)
			await recorder.evaluate(state => state.markClosed())
			const frames = await recorder.evaluate(state => state.done)
			await testInfo.attach("duplicate-exit-frames", {
				body: JSON.stringify(frames),
				contentType: "application/json",
			})
			expect(frames.length).toBeGreaterThanOrEqual(3)
			expect(frames[0]?.dialogs).toBeGreaterThan(0)
			expect(frames.at(-1)?.dialogs).toBe(0)
			expect(frames.at(-1)?.backdrops).toBe(0)
			if (reduced) {
				const poses = frames
					.map(frame => frame.popupPose)
					.filter((pose): pose is string => pose !== null)
				expect(poses.length).toBeGreaterThanOrEqual(1)
				// Reduced motion disables transitions, so the close is a single
				// instant snap to the ending pose followed by removal: at most two
				// poses (same <= 2 snap contract as expectReducedRowMovement) and
				// no interpolated alpha between fully visible and gone.
				expect(new Set(poses).size).toBeLessThanOrEqual(2)
				expect(
					frames.every(
						frame =>
							frame.popupOpacity === null ||
							frame.popupOpacity === 0 ||
							frame.popupOpacity === 1,
					),
				).toBe(true)
			} else {
				expect(frames[0]?.popupOpacity).toBeGreaterThan(0.99)
				expect(
					frames.filter(
						frame =>
							frame.popupOpacity !== null &&
							frame.popupOpacity > 0 &&
							frame.popupOpacity < 1,
					).length,
				).toBeGreaterThan(1)
				expect(
					frames.filter(
						frame =>
							frame.backdropOpacity !== null &&
							frame.backdropOpacity > 0 &&
							frame.backdropOpacity < 1,
					).length,
				).toBeGreaterThan(1)
			}
			// Reopen with the OTHER seeded pair: the dialog must gate on the new
			// input and show only its rows, proving the latched close content did
			// not leak a stale row. (Reopening the same pair could not distinguish
			// fresh content from a stale latch, so it proves nothing here.)
			const secondCard = page.locator("section", { hasText: secondKeepDescription })
			await secondCard
				.getByRole("radio", { name: `Keep ${secondKeepDescription}`, exact: true })
				.click()
			await secondCard
				.getByRole("radio", { name: `Delete ${secondDeleteDescription}`, exact: true })
				.click()
			await expectPopupEntrance(page, () =>
				secondCard.getByRole("button", { name: "Review deletion", exact: true }).click(),
			)
			await expect(dialog).toContainText(secondKeepDescription)
			await expect(dialog).toContainText(secondDeleteDescription)
			await expect(dialog.getByText(keptDescription, { exact: true })).toHaveCount(0)
			await expect(dialog.getByText(deletedDescription, { exact: true })).toHaveCount(0)
			await page.keyboard.press("Escape")
			await expect(page.getByRole("dialog")).toHaveCount(0)
		} finally {
			await recorder.evaluate(state => state.stop())
			await recorder.dispose()
		}
	})
}
