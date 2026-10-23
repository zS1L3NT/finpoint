import { readFile } from "node:fs/promises"
import type { Page } from "@playwright/test"
import { IDS } from "../support/data"
import { expect, seedWorkspace, test } from "../support/fixtures"

const GOOGLE_RE = /google|gstatic|googleapis/i

async function blockGoogle(page: Page): Promise<string[]> {
	const attempted: string[] = []
	await page.route(GOOGLE_RE, async route => {
		attempted.push(route.request().url())
		await route.abort()
	})
	return attempted
}

async function countStore(page: Page, store: string): Promise<number> {
	return page.evaluate(async (name: string) => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
			open.onerror = () => reject(open.error ?? new Error("Unable to open database."))
		})
		try {
			return await new Promise<number>((resolve, reject) => {
				const request = database.transaction(name, "readonly").objectStore(name).count()
				request.onsuccess = () => resolve(request.result)
				request.onerror = () =>
					reject(request.error ?? new Error(`Unable to count ${name}.`))
			})
		} finally {
			database.close()
		}
	}, store)
}

async function findRecordId(page: Page, title: string): Promise<string | null> {
	return page.evaluate(async (want: string) => {
		const database = await new Promise<IDBDatabase>((resolve, reject) => {
			const open = indexedDB.open("finpoint")
			open.onsuccess = () => resolve(open.result)
			open.onerror = () => reject(open.error ?? new Error("Unable to open database."))
		})
		try {
			const rows = await new Promise<{ id: string; title: string }[]>((resolve, reject) => {
				const request = database
					.transaction("records", "readonly")
					.objectStore("records")
					.getAll()
				request.onsuccess = () => resolve(request.result as never)
				request.onerror = () =>
					reject(request.error ?? new Error("Unable to read records."))
			})
			return rows.find(row => row.title === want)?.id ?? null
		} finally {
			database.close()
		}
	}, title)
}

async function pickCategory(page: Page, name: string) {
	const input = page.locator("#category_id")
	await expect(input).toBeVisible()
	await input.click()
	await input.fill(name)
	const option = page.getByRole("option", { name: new RegExp(name, "i") }).first()
	try {
		await option.waitFor({ timeout: 5000 })
		await option.click()
	} catch {
		await input.press("Enter")
	}
	// Either path must actually choose the category: the input keeps its name.
	await expect(input).toHaveValue(new RegExp(name, "i"))
}

async function selectAllocatorStatements(page: Page, ids: string[]) {
	await page.goto("/allocator")
	for (const id of ids) {
		const box = page.getByRole("checkbox", {
			name: `Select statement ${id}`,
			exact: true,
		})
		await expect(box).toBeVisible()
		await box.click()
	}
}

async function expectAllocatorSelection(page: Page, summary: string, footer: string) {
	// SelectionBar summary lives in the complementary aside; the table footer
	// summary lives in main. Asserting both keeps the check finite.
	await expect(page.getByRole("complementary").getByText(summary)).toBeVisible()
	await expect(page.locator("main").getByText(footer)).toBeVisible()
}

async function ensureAllocatorDatetime(dialog: ReturnType<Page["getByRole"]>) {
	// Allocator creation infers the earliest statement datetime, so the time
	// input must already hold a value. If the product ever leaves it empty,
	// stamp today at noon like a user would instead of dropping validation.
	const time = dialog.locator("#datetime-time")
	if (!(await time.inputValue())) await time.fill("12:00")
	await expect(time).not.toHaveValue("")
}

test("allocator: exact Statements allocate to a new Record and persist across reload", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	const google = await blockGoogle(page)
	const beforeRecords = await (async () => {
		await page.goto("/")
		return countStore(page, "records")
	})()
	expect(beforeRecords).toBe(15)

	await selectAllocatorStatements(page, [
		IDS.statements.unallocated[2],
		IDS.statements.unallocated[3],
	])
	await expectAllocatorSelection(
		page,
		"2 selected · -$59.20",
		"2 selected. Showing 6 of 6 statements.",
	)
	await page.getByRole("button", { name: "Create Record" }).click()
	const dialog = page.getByRole("dialog", { name: "Create New Record" })
	await expect(dialog).toBeVisible()
	await ensureAllocatorDatetime(dialog)
	await dialog.locator("#title").fill("Workflow exact supper")
	await pickCategory(page, "Groceries")
	await dialog.getByRole("button", { name: "Create Record" }).click()
	await expect(dialog).toHaveCount(0)
	await expect(page.getByRole("complementary")).toHaveCount(0)

	const id = await findRecordId(page, "Workflow exact supper")
	expect(id).not.toBeNull()
	await page.goto(`/records/${id}`)
	await expect(page.getByText("Workflow exact supper")).toBeVisible()
	await expect(
		page.locator("main").getByText("STARBUCKS 4455", { exact: true }).filter({ visible: true }),
	).toBeVisible()
	await expect(
		page
			.locator("main")
			.getByText("SHENG SIONG 9902", { exact: true })
			.filter({ visible: true }),
	).toBeVisible()
	await expect(page.locator("main").getByText("Pending", { exact: true })).toHaveCount(0)

	await page.goto("/statements/t1-s-free-1")
	await expect(page.getByText("Fully allocated")).toBeVisible()
	await page.reload()
	await expect(page.getByText("Fully allocated")).toBeVisible()
	expect(await countStore(page, "records")).toBe(16)
	expect(google.length).toBe(0)
})

test("Record creator: under-allocation warns that the Record stays Pending", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await selectAllocatorStatements(page, [IDS.statements.unallocated[2]])
	await expectAllocatorSelection(
		page,
		"1 selected · -$6.80",
		"1 selected. Showing 6 of 6 statements.",
	)
	await page.getByRole("button", { name: "Create Record" }).click()
	const dialog = page.getByRole("dialog", { name: "Create New Record" })
	await expect(dialog).toBeVisible()
	await ensureAllocatorDatetime(dialog)
	await dialog.locator("#title").fill("Workflow short supper")
	await pickCategory(page, "Groceries")
	await dialog.locator("#amount").fill("-20")
	await expect(
		dialog.getByText("Amount does not match the sum of Allocation Amounts"),
	).toBeVisible()
	await dialog.getByRole("button", { name: "Create Record" }).click()
	await expect(dialog).toHaveCount(0)

	const id = await findRecordId(page, "Workflow short supper")
	expect(id).not.toBeNull()
	await page.goto(`/records/${id}`)
	await expect(page.locator("main").getByText("Pending", { exact: true }).first()).toBeVisible()
	await expect(page.locator("main").getByText(/\[.*6\.80.*\]/)).toBeVisible()
	await page.reload()
	await expect(page.locator("main").getByText("Pending", { exact: true }).first()).toBeVisible()
})

test("Record creator: over-allocation is blocked with a useful message and no mutation", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)
	const before = await (async () => {
		await page.goto("/")
		return countStore(page, "records")
	})()

	await selectAllocatorStatements(page, [IDS.statements.unallocated[2]])
	await expectAllocatorSelection(
		page,
		"1 selected · -$6.80",
		"1 selected. Showing 6 of 6 statements.",
	)
	await page.getByRole("button", { name: "Create Record" }).click()
	const dialog = page.getByRole("dialog", { name: "Create New Record" })
	await expect(dialog).toBeVisible()
	await ensureAllocatorDatetime(dialog)
	await dialog.locator("#title").fill("Workflow greedy supper")
	await pickCategory(page, "Groceries")
	await dialog.locator('input[name="statements[0].amount"]').fill("-60")
	await expect(dialog.locator('input[name="statements[0].amount"]')).toHaveValue("-60")
	await dialog.getByRole("button", { name: "Create Record" }).click()
	await expect(dialog.getByText("This amount exceeds what can be allocated.")).toBeVisible({
		timeout: 10_000,
	})
	await expect(dialog).toBeVisible()
	await expect(await findRecordId(page, "Workflow greedy supper")).toBeNull()
	await page.reload()
	expect(await countStore(page, "records")).toBe(before)
})

test("allocate bar: not, partial and fully allocated states show finite values", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await page.goto("/statements/t1-s-free-2")
	await expect(page.getByText("Not allocated")).toBeVisible()
	const fresh = page.getByRole("progressbar")
	await expect(fresh).toHaveAttribute("aria-valuenow", "0")

	await selectAllocatorStatements(page, [IDS.statements.unallocated[2]])
	await expectAllocatorSelection(
		page,
		"1 selected · -$6.80",
		"1 selected. Showing 6 of 6 statements.",
	)
	await page.getByRole("button", { name: "Create Record" }).click()
	const dialog = page.getByRole("dialog", { name: "Create New Record" })
	await ensureAllocatorDatetime(dialog)
	await dialog.locator("#title").fill("Workflow half supper")
	await pickCategory(page, "Groceries")
	await dialog.locator('input[name="statements[0].amount"]').fill("-3")
	await dialog.locator("#amount").fill("-3")
	await dialog.getByRole("button", { name: "Create Record" }).click()
	await expect(dialog).toHaveCount(0)

	await page.goto("/statements/t1-s-free-1")
	await expect(page.getByText("Partially allocated")).toBeVisible()
	const partial = page.getByRole("progressbar")
	const partialNow = Number(await partial.getAttribute("aria-valuenow"))
	expect(Number.isFinite(partialNow)).toBe(true)
	expect(partialNow).toBeGreaterThan(0)
	expect(partialNow).toBeLessThan(100)

	await page.goto("/statements/t1-s-groceries")
	await expect(page.getByText("Fully allocated")).toBeVisible()
	const full = page.getByRole("progressbar")
	expect(await full.getAttribute("aria-valuenow")).toBe("100")
})

test("amount display: zero and negative amounts render with correct accounting", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await page.goto("/accounts")
	await expect(page.getByText("One Card")).toBeVisible()
	// The directory shows 30-day In/Out/Net, not the stored balance: One Card
	// inflow is the $20 refund with $131.80 outflow (25 + 60 + 40 + 6.80).
	const oneCard = page.locator("article", {
		has: page.getByRole("heading", { name: "One Card" }),
	})
	await expect(oneCard.getByText("$20.00")).toBeVisible()
	await expect(oneCard.getByText("-$131.80")).toBeVisible()
	await expect(oneCard.getByText("-$111.80")).toBeVisible()
	await expect(oneCard.getByText("5 Statements")).toBeVisible()
	await expect(oneCard.getByRole("link", { name: "1 unallocated" })).toBeVisible()
	// Everyday Savings proves large inflow and multi-statement outflow math.
	const savings = page.locator("article", {
		has: page.getByRole("heading", { name: "Everyday Savings" }),
	})
	await expect(savings.getByText("$5,203.50")).toBeVisible()
	await expect(savings.getByText("-$415.70")).toBeVisible()
	await expect(savings.getByText("$4,787.80")).toBeVisible()
	await expect(savings.getByText("10 Statements")).toBeVisible()

	await page.goto("/records/t1-r-zero")
	await expect(page.locator("main").getByText("$0.00").first()).toBeVisible()
	await expect(page.locator("main").getByText("Pending", { exact: true }).first()).toBeVisible()

	await page.goto("/statements/t1-s-groceries")
	await expect(page.locator("main").getByText("Fully allocated")).toBeVisible()
	await expect(page.locator("main").getByText("-$84.20").first()).toBeVisible()
	const now = Number(await page.getByRole("progressbar").getAttribute("aria-valuenow"))
	expect(Number.isFinite(now)).toBe(true)
	expect(now).toBe(100)
})

test("Record search sheet: selected Statements allocate to a Pending Record", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await selectAllocatorStatements(page, [IDS.statements.unallocated[3]])
	await expectAllocatorSelection(
		page,
		"1 selected · -$52.40",
		"1 selected. Showing 6 of 6 statements.",
	)
	await page.getByRole("button", { name: "Allocate to record" }).click()
	const sheet = page.getByRole("dialog", { name: "Allocate to pending record" })
	await expect(sheet).toBeVisible()
	await expect(sheet.getByText(/Allocating/)).toBeVisible()
	await sheet.getByLabel("Search records").fill("StashAway")
	await sheet.getByRole("button", { name: /StashAway Deposit/ }).click()

	const editor = page.getByRole("dialog", { name: "Edit Record" })
	await expect(editor).toBeVisible()
	await expect(editor.getByText("SHENG SIONG 9902")).toBeVisible()
	await editor.getByRole("button", { name: "Save changes" }).click()
	await expect(editor).toHaveCount(0)

	await page.goto("/records/t1-r-saving")
	await expect(
		page
			.locator("main")
			.getByText("SHENG SIONG 9902", { exact: true })
			.filter({ visible: true }),
	).toBeVisible()
	await expect(page.locator("main").getByText("Pending", { exact: true }).first()).toBeVisible()
	await page.goto("/allocator?query=SHENG+SIONG")
	// Desktop and mobile render separate empty-state nodes; assert the visible one.
	await expect(
		page
			.locator("main")
			.getByText("No statements found.", { exact: true })
			.filter({ visible: true }),
	).toBeVisible()
})

test("Statement search sheet: an allocable Statement is appended in the Record editor", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await page.goto(`/records/${IDS.records.partialPending}`)
	await page.getByRole("button", { name: "Edit Record" }).click()
	const editor = page.getByRole("dialog", { name: "Edit Record" })
	await expect(editor).toBeVisible()
	await editor.getByRole("button", { name: "Allocate statement" }).click()
	const sheet = page.getByRole("dialog", { name: "Allocate statements to record" })
	await expect(sheet).toBeVisible()
	await sheet.getByLabel("Search statements").fill("STARBUCKS")
	await sheet.getByRole("button", { name: /STARBUCKS/ }).click()
	// The sheet stays open until Done: the choice only stages the allocation.
	await expect(sheet.getByText("1 Statement selected for allocation")).toBeVisible()
	await sheet.getByRole("button", { name: "Done", exact: true }).click()
	await expect(sheet).toHaveCount(0)
	await expect(editor.getByText("STARBUCKS 4455")).toBeVisible()
	await editor.getByRole("button", { name: "Save changes" }).click()
	await expect(editor).toHaveCount(0)

	await expect(
		page.locator("main").getByText("STARBUCKS 4455", { exact: true }).filter({ visible: true }),
	).toBeVisible()
	await expect(
		page
			.locator("main")
			.getByText("Hawker Dinner · UOB ONE 3344", { exact: true })
			.filter({ visible: true }),
	).toBeVisible()
	await expect(page.locator("main").getByText("Pending", { exact: true }).first()).toBeVisible()
	await page.reload()
	await expect(
		page.locator("main").getByText("STARBUCKS 4455", { exact: true }).filter({ visible: true }),
	).toBeVisible()
})

test("Record editor: removing an Allocation keeps its sibling identity and persists", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await page.goto(`/records/${IDS.records.split}`)
	await page.getByRole("button", { name: "Edit Record" }).click()
	const editor = page.getByRole("dialog", { name: "Edit Record" })
	await expect(editor).toBeVisible()
	const firstInput = editor.locator('input[name="statements[0].amount"]')
	const secondInput = editor.locator('input[name="statements[1].amount"]')
	// getRecord sorts statements newest-first, so Contactless 1002 (-40,
	// 15:09) precedes Contactless 1001 (-60, 15:06).
	await expect(firstInput).toHaveValue("-40")
	await expect(secondInput).toHaveValue("-60")

	// Scope removal to the second allocation card: a generic icon scan could hit
	// the category combobox clear instead. The delete button carries the
	// statement description in its accessible name (product aria-label). Cards
	// carry data-slot="card" in app source.
	const sibling = editor.locator('[data-slot="card"]', {
		hasText: "Uniqlo Basics · Contactless 1002",
	})
	await sibling.evaluate(node => {
		;(node as unknown as Record<string, boolean>).__keptSibling = true
	})
	await editor
		.getByRole("button", { name: "Remove Uniqlo Basics · Contactless 1001", exact: true })
		.click()
	await expect(editor.locator('input[name="statements[1].amount"]')).toHaveCount(0)
	await expect(editor.locator('input[name="statements[0].amount"]')).toHaveValue("-40")
	// The sibling card keeps its DOM identity: the same node survives with its
	// marker intact, fully opaque with no replayed entrance fade.
	await expect(
		sibling.evaluate(
			node => (node as unknown as Record<string, boolean>).__keptSibling === true,
		),
	).resolves.toBe(true)
	await expect(editor.getByText("Uniqlo Basics · Contactless 1002")).toBeVisible()
	await expect(sibling.evaluate(node => getComputedStyle(node).opacity)).resolves.toBe("1")
	// The sibling card keeps its identity: same description, kept amount.
	await expect(editor.getByText("Uniqlo Basics · Contactless 1002")).toBeVisible()
	await expect(editor.getByText("Uniqlo Basics · Contactless 1001")).toHaveCount(0)
	await editor.getByRole("button", { name: "Save changes" }).click()
	await expect(editor).toHaveCount(0)

	await expect(page.locator("main").getByRole("heading", { name: /Uniqlo Basics/ })).toBeVisible()
	await expect(page.locator("main").getByText("Pending", { exact: true }).first()).toBeVisible()
	await page.goto("/allocator?query=1001")
	await expect(
		page
			.locator("main")
			.getByText("Uniqlo Basics · Contactless 1001", { exact: true })
			.filter({ visible: true }),
	).toBeVisible()
})

test("duplicates: keep moves Allocations and the deleted Statement is gone", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await selectAllocatorStatements(page, [IDS.statements.duplicatePair[0]])
	await expectAllocatorSelection(
		page,
		"1 selected · -$28.90",
		"1 selected. Showing 6 of 6 statements.",
	)
	await page.getByRole("button", { name: "Create Record" }).click()
	const creator = page.getByRole("dialog", { name: "Create New Record" })
	await ensureAllocatorDatetime(creator)
	await creator.locator("#title").fill("Dup allocation dinner")
	await pickCategory(page, "Groceries")
	await creator.getByRole("button", { name: "Create Record" }).click()
	await expect(creator).toHaveCount(0)

	await page.goto("/allocator/duplicates")
	await expect(
		page.locator("main").getByText("DON DON DONKI PURCHASE 8821").first(),
	).toBeVisible()
	await page.getByRole("radio", { name: "Keep DON DON DONKI 8821 PURCHASE", exact: true }).click()
	await page
		.getByRole("radio", { name: "Delete DON DON DONKI PURCHASE 8821", exact: true })
		.click()
	await page.getByRole("button", { name: "Review deletion" }).click()
	const review = page.getByRole("dialog", { name: "Delete duplicate Statements" })
	await expect(review).toBeVisible()
	await expect(
		review.getByText("Move the duplicate’s Allocations to the kept Statement."),
	).toBeVisible()
	await review.getByRole("button", { name: "Delete 1 Statement" }).click()
	await expect(review).toHaveCount(0)

	await page.goto(`/statements/${IDS.statements.duplicatePair[0]}`)
	await expect(page.getByText("Statement not found.")).toBeVisible()
	await page.goto(`/statements/${IDS.statements.duplicatePair[1]}`)
	await expect(page.getByText("Fully allocated")).toBeVisible()
	const id = await findRecordId(page, "Dup allocation dinner")
	expect(id).not.toBeNull()
	await page.goto(`/records/${id}`)
	await expect(
		page
			.locator("main")
			.getByText("DON DON DONKI 8821 PURCHASE", { exact: true })
			.filter({ visible: true }),
	).toBeVisible()
})

test("duplicates: restoring a Separate pair re-suggests its Statements", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await page.goto("/allocator/duplicates?view=dismissed")
	await expect(page.getByText("GRAB RIDE 7712")).toBeVisible()
	await page.getByRole("button", { name: "Restore suggestion" }).click()
	await expect(page.getByText("Nothing marked separate")).toBeVisible()

	await page.goto("/allocator/duplicates?view=all&query=GRAB+RIDE")
	await expect(page.getByText("GRAB RIDE 7712")).toBeVisible()
	await expect(page.getByText("GRAB RIDE 7713")).toBeVisible()
	await page.reload()
	await expect(page.getByText("GRAB RIDE 7712")).toBeVisible()
})

test("pending queue: replacing a Pending Statement preserves Allocations on the imported Statement", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await page.goto("/allocator/pending")
	const queue = page.locator("section[aria-labelledby='pending-queue-title']")
	await queue.getByPlaceholder("Search descriptions...").fill("Pasar malam")
	await page.getByRole("button", { name: /Pasar malam/ }).click()
	await expect(page).toHaveURL(/pending_statement_id=t1-s-pending/)
	await expect(page).toHaveURL(/query=Pasar\+malam/)
	await expect(page).toHaveURL(/pending_statement_id=t1-s-pending/)
	await expect(page.getByText("Replacing pending Statement")).toBeVisible()
	await page
		.getByRole("combobox")
		.filter({ hasText: "Suggested replacements", visible: true })
		.click()
	await page.getByRole("option", { name: "All unallocated imports" }).click()
	const candidateSection = page.locator("section[aria-labelledby='candidate-title']")
	await candidateSection.getByPlaceholder("Search descriptions...").fill("SHENG SIONG")
	await page.getByRole("button", { name: "Replace", exact: true }).click()
	const review = page.getByRole("dialog", { name: "Review Statement replacement" })
	await expect(review).toBeVisible()
	await expect(review.getByText(/Allocation.*ready to move/)).toBeVisible()
	await review.getByRole("button", { name: "Replace pending Statement" }).click()
	await expect(review).toHaveCount(0)
	await expect(page.getByText("Pending Statement replaced.")).toBeVisible()

	await queue.getByPlaceholder("Search descriptions...").fill("Pasar malam")
	await expect(page.getByText("No pending Statements", { exact: true })).toBeVisible()
	await page.goto(`/statements/${IDS.statements.pending}`)
	await expect(page.getByText("Statement not found.")).toBeVisible()
	await page.goto(`/records/${IDS.records.pendingStatement}`)
	await expect(
		page
			.locator("main")
			.getByText("SHENG SIONG 9902", { exact: true })
			.filter({ visible: true }),
	).toBeVisible()
	await page.goto("/statements/t1-s-free-2")
	await expect(page.locator("main").getByText("Partially allocated")).toBeVisible()
})

const DBS_VALID = [
	"Account Details For:,Everyday Savings t1-acc-dbs",
	...Array.from({ length: 7 }, (_, index) => `metadata ${index}`),
	"Transaction Date,Status,Supplementary Code,Client Reference,Additional Reference,Debit Amount,Credit Amount",
	"14 Oct 2026,Settled,WORKFLOW E2E IMPORT,,,-9.99,",
].join("\n")

test("importer: invalid files are rejected without mutation and duplicates are skipped", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)
	await page.goto("/importer")
	const before = await countStore(page, "statements")

	await page.getByRole("radio", { name: /DBS/ }).click()
	let [chooser] = await Promise.all([
		page.waitForEvent("filechooser"),
		page.getByRole("button", { name: /Drop.*here/ }).click(),
	])
	await chooser.setFiles([
		{ name: "broken.csv", mimeType: "text/csv", buffer: Buffer.from("nope,not,bank\n1,2\n") },
	])
	await page.getByRole("button", { name: /Import 1 file/ }).click()
	await expect(page.getByText("Account details are missing from this export.")).toBeVisible()
	expect(await countStore(page, "statements")).toBe(before)

	;[chooser] = await Promise.all([
		page.waitForEvent("filechooser"),
		page.getByRole("button", { name: /Drop.*here/ }).click(),
	])
	await chooser.setFiles([
		{
			name: "garbage.xlsx",
			mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			buffer: Buffer.from("definitely not a workbook"),
		},
	])
	await page.getByRole("button", { name: /Import 1 file/ }).click()
	// A non-workbook XLSX is rejected without mutation; the surfaced files
	// alert names the actual problem (missing account details for an empty
	// sheet, missing worksheets, unreadable CSV, or a generic import failure).
	await expect(
		page.getByText(
			/Account details are missing|no worksheets|Could not read|Unsupported|Import failed/i,
		),
	).toBeVisible()
	expect(await countStore(page, "statements")).toBe(before)

	const valid = { name: "dbs-valid.csv", mimeType: "text/csv", buffer: Buffer.from(DBS_VALID) }
	;[chooser] = await Promise.all([
		page.waitForEvent("filechooser"),
		page.getByRole("button", { name: /Drop.*here/ }).click(),
	])
	await chooser.setFiles([valid])
	await page.getByRole("button", { name: /Import 1 file/ }).click()
	await expect(page.getByText("1 new statement imported")).toBeVisible()
	expect(await countStore(page, "statements")).toBe(before + 1)

	// A successful import resets the form (bank included), so re-choose DBS
	// before re-importing the same file to prove duplicates are skipped.
	await page.getByRole("radio", { name: /DBS/ }).click()
	;[chooser] = await Promise.all([
		page.waitForEvent("filechooser"),
		page.getByRole("button", { name: /Drop.*here/ }).click(),
	])
	await chooser.setFiles([valid])
	await page.getByRole("button", { name: /Import 1 file/ }).click()
	await expect(page.getByText("0 new statements imported")).toBeVisible()
	expect(await countStore(page, "statements")).toBe(before + 1)
})

test("importer: a Revolut pending import surfaces in the pending queue", async ({
	page,
	workspace,
}) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)
	await page.goto("/importer")
	const before = await countStore(page, "statements")

	await page.getByRole("radio", { name: /Revolut/ }).click()
	await page.locator("#account_select").click()
	await page.getByRole("option", { name: "Vault" }).click()
	const [chooser] = await Promise.all([
		page.waitForEvent("filechooser"),
		page.getByRole("button", { name: /Drop.*here/ }).click(),
	])
	await chooser.setFiles([
		{
			name: "revolut-pending.csv",
			mimeType: "text/csv",
			buffer: Buffer.from(
				"State,Started Date,Description,Amount,Fee\nPENDING,2026-10-14 12:00:00,Workflow pending import,-9.99,0",
			),
		},
	])
	await page.getByRole("button", { name: /Import 1 file/ }).click()
	await expect(page.getByText("1 new statement imported")).toBeVisible()
	expect(await countStore(page, "statements")).toBe(before + 1)

	await page.goto("/allocator/pending")
	const queue = page.locator("section[aria-labelledby='pending-queue-title']")
	await queue.getByPlaceholder("Search descriptions...").fill("Workflow pending import")
	await expect(page.getByRole("button", { name: /Workflow pending import/ })).toBeVisible()
})

test("settings: default filters validate, persist and reload", async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await page.goto("/settings")
	const save = page.getByRole("button", { name: "Save default filters" })
	await expect(page.locator("#default_filter_start_date")).toContainText("1 Oct 2026")
	await expect(save).toBeDisabled()

	await page.locator("#default_filter_end_date").click()
	await page.getByRole("option", { name: "Today" }).click()
	await expect(save).toBeEnabled()
	await save.click()
	await expect(page.getByText("Default filters saved.")).toBeVisible()
	await page.reload()
	await expect(page.locator("#default_filter_end_date")).toContainText("Today")
	await expect(page.locator("#default_filter_start_date")).toContainText("1 Oct 2026")

	await page.getByRole("button", { name: "Clear date" }).click()
	await expect(save).toBeEnabled()
	await save.click()
	await expect(page.getByText("Default filters saved.")).toBeVisible()
	await page.reload()
	await expect(page.locator("#default_filter_start_date")).toContainText("No default start date")
})

test("sync: signed-out data stays local with no external Google calls", {
	tag: ["@desktop-only"],
}, async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	const google = await blockGoogle(page)

	await page.goto("/sync")
	await expect(page.getByText("Saved in this browser only")).toBeVisible()
	await expect(page.getByRole("button", { name: /Download backup/ })).toBeVisible()
	expect(google.length).toBe(0)
	await page.reload()
	await expect(page.getByText("Saved in this browser only")).toBeVisible()
	expect(google.length).toBe(0)
})

test("backup: a downloaded backup round-trips and restores the workspace", {
	tag: ["@desktop-only"],
}, async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await page.goto("/sync")
	const [download] = await Promise.all([
		page.waitForEvent("download"),
		page.getByRole("button", { name: /Download backup/ }).click(),
	])
	expect(download.suggestedFilename()).toMatch(/^finpoint-backup-.*\.json$/)
	const backupPath = await download.path()
	expect(backupPath).not.toBeNull()
	const backup = JSON.parse(await readFile(backupPath as string, "utf8")) as {
		app: string
		tables: { records: unknown[]; statements: unknown[] }
	}
	expect(backup.app).toBe("finpoint")
	expect(backup.tables.records.length).toBe(15)
	expect(backup.tables.statements.length).toBe(20)
	await expect(page.getByText("Backup file downloaded.")).toBeVisible()

	await seedWorkspace(page, "empty")
	await page.goto("/sync")
	expect(await countStore(page, "records")).toBe(0)
	await expect(page.getByRole("button", { name: /Download backup/ })).toBeDisabled()

	const [chooser] = await Promise.all([
		page.waitForEvent("filechooser"),
		page.getByRole("button", { name: /Restore from a backup file/ }).click(),
	])
	await chooser.setFiles([
		{
			name: "finpoint-backup.json",
			mimeType: "application/json",
			buffer: Buffer.from(JSON.stringify(backup)),
		},
	])
	await page.getByRole("button", { name: "Restore", exact: true }).click()
	await expect(page.getByText("Backup file restored.")).toBeVisible()
	expect(await countStore(page, "records")).toBe(15)
	const id = await findRecordId(page, "Monthly Salary")
	expect(id).toBe(IDS.records.salaryIncome)
})

test("reset: a cancelled reset preserves workspace data", async ({ page, workspace }) => {
	expect(workspace).toBe("populated")
	await blockGoogle(page)

	await page.goto("/sync")
	const before = await countStore(page, "records")
	expect(before).toBe(15)
	await page.getByRole("button", { name: "Clear all data" }).click()
	await expect(page.getByRole("button", { name: "Yes, clear everything" })).toBeVisible()
	await page.getByRole("button", { name: "Cancel" }).click()
	await expect(page.getByRole("button", { name: "Clear all data" })).toBeVisible()
	expect(await countStore(page, "records")).toBe(before)
	await page.goto("/records")
	await expect(
		page.locator("main").getByText("Monthly Salary", { exact: true }).filter({ visible: true }),
	).toBeVisible()
})
