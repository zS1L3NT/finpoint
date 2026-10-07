// Real UI for the video guide. Drives a fresh Finpoint workspace through the guide's story with
// Playwright, saving a screenshot of each moment plus the on-screen boxes of the controls the video
// points at. Run from the repository root against a production build:
//   bun run build && npx next start --port 5174   (in another terminal)
//   bun video/scripts/capture.ts
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium, type Locator, type Page } from "playwright"
import * as XLSX from "xlsx"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const base = process.env.FINPOINT_URL ?? "http://localhost:5174"
const outDir = resolve(root, "public/guide-shots")
const viewport = { width: 1440, height: 900 }
/** The guide's fictional month. The browser clock is pinned here so dates read naturally. */
const now = new Date("2026-10-20T10:30:00+08:00")
const month = "?month=October&year=2026"

type Box = [number, number, number, number]
const shots: Record<string, { width: number; height: number; boxes: Record<string, Box> }> = {}

// ─── Fictional bank exports ───────────────────────────────────────────────────────────────

const ocbcRows: [string, string, number][] = [
	["01/10/2026", "SALARY ACME PTE LTD", 3000],
	["03/10/2026", "KOPI & CO RAFFLES PL", -12],
	["05/10/2026", "NTUC FAIRPRICE BEDOK", -80],
	["06/10/2026", "SISTIC CONCERT TIX", -200],
	["08/10/2026", "COLD STORAGE CENTRAL", -23.4],
	["10/10/2026", "SAKURA DINING", -90],
	["11/10/2026", "PAYNOW FROM SAM TAN", 60],
	["12/10/2026", "GRAB RIDE", -14.5],
	["14/10/2026", "NETFLIX.COM", -19.98],
	["15/10/2026", "SHOPEE SINGAPORE", -45.9],
	["17/10/2026", "SP SERVICES", -120.4],
	["18/10/2026", "TRANSFER TO UOB SAVINGS", -500],
]
const ocbcLater: [string, string, number][] = [
	["13/10/2026", "PAYNOW FROM JO LIM", 100],
	["19/10/2026", "BURGER JOINT TANJONG PAGAR", -35],
]

function ocbcCsv(rows: [string, string, number][]) {
	return [
		"Account details for:,OCBC 360 Account 601-234567-001",
		"Transaction History",
		"Transaction date,Value date,Description,Withdrawals(SGD),Deposits(SGD)",
		...rows.map(([date, description, amount]) =>
			[date, date, description, amount < 0 ? (-amount).toFixed(2) : "", amount > 0 ? amount.toFixed(2) : ""].join(","),
		),
	].join("\n")
}

function uobXls(path: string) {
	const sheet = XLSX.utils.aoa_to_sheet([
		["United Overseas Bank Limited"],
		["Account Transaction Details"],
		[""],
		[""],
		["Account Number:", "3021234567"],
		["Account Type:", "Uniplus Savings"],
		["Statement Period:", "01 Oct 2026 To 20 Oct 2026"],
		["Transaction Date", "Transaction Description", "Withdrawal", "Deposit"],
		["18 Oct 2026", "TRANSFER FROM OCBC 360", 0, 500],
	])
	const book = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(book, sheet, "Statement")
	XLSX.writeFile(book, path, { bookType: "xls" })
}

// ─── Capture helpers ──────────────────────────────────────────────────────────────────────

async function boxOf(locator: Locator): Promise<Box | null> {
	const box = await locator.first().boundingBox().catch(() => null)
	return box ? [box.x, box.y, box.width, box.height].map(Math.round) as Box : null
}

/**
 * Saves the current screen. `full` captures a whole scrolling list (measured from the top of the
 * page) so the video can pan down to rows below the fold; dialogs stay viewport-sized.
 */
async function shot(
	page: Page,
	name: string,
	targets: Record<string, Locator> = {},
	{ full = false }: { full?: boolean } = {},
) {
	await page.mouse.move(viewport.width - 4, viewport.height - 4)
	if (full) await page.evaluate(() => window.scrollTo(0, 0))
	await page.waitForTimeout(900)
	const boxes: Record<string, Box> = {}
	for (const [key, locator] of Object.entries(targets)) {
		const box = await boxOf(locator)
		if (box) boxes[key] = box
		else console.warn(`  ! ${name}: no box for ${key}`)
	}
	await page.screenshot({ path: resolve(outDir, `${name}.jpg`), type: "jpeg", quality: 82, fullPage: full })
	const height = full
		? await page.evaluate(() => document.documentElement.scrollHeight)
		: viewport.height
	shots[name] = { width: viewport.width, height, boxes }
	console.log(`  ${name}`)
}

const row = (page: Page, text: string) =>
	page.locator("tr, [data-slot=mobile-row]").filter({ hasText: text }).first()
const dialog = (page: Page) => page.getByRole("dialog").last()

async function go(page: Page, path: string) {
	await page.goto(`${base}${path}`, { waitUntil: "load" })
	await page.waitForTimeout(1500)
}

async function importOcbc(page: Page, file: string, capture: boolean) {
	await go(page, "/importer")
	if (capture) await shot(page, "importer", { banks: page.getByRole("radiogroup", { name: "Bank" }), ocbc: page.getByRole("radio", { name: /OCBC/ }), uob: page.getByRole("radio", { name: /UOB/ }) })
	await page.getByRole("radio", { name: /OCBC/ }).click()
	await page.locator('input[type="file"]').setInputFiles(file)
	if (capture)
		await shot(page, "importer-ready", {
			ocbc: page.getByRole("radio", { name: /OCBC/ }),
			files: page.getByText("ocbc-october.csv").first(),
			submit: page.getByRole("button", { name: /^Import/ }),
		})
	await page.getByRole("button", { name: /^Import/ }).click()
	await page.getByText(/new statements? imported/).first().waitFor()
	if (capture)
		await shot(page, "importer-done", {
			result: page.getByText(/new statements? imported/).first(),
			allocate: page.getByRole("link", { name: /Allocate them/ }).or(page.getByRole("button", { name: /Allocate them/ })),
		})
}

/** Select Allocator rows, then open Create Record. */
async function createFrom(page: Page, rows: string[]) {
	await go(page, `/allocator`)
	for (const text of rows) await row(page, text).click()
	await page.getByRole("button", { name: "Create Record" }).click()
	await dialog(page).getByText("Statements Attached").waitFor()
}

async function fillRecord(page: Page, { title, category, amount }: { title: string; category: string; amount?: string }) {
	const form = dialog(page)
	await form.locator("#title").fill(title)
	if (amount !== undefined) await form.locator("#amount").fill(amount)
	await form.locator("#category_id").click()
	await form.locator("#category_id").fill(category)
	await page.getByRole("option", { name: category }).first().click()
}

const creatorBoxes = (page: Page) => {
	const form = dialog(page)
	return {
		dialog: form,
		title: form.locator("#title"),
		amount: form.locator("#amount"),
		category: form.locator("#category_id"),
		analytics: form.getByText("Treatment").first().locator("xpath=ancestor::*[contains(@class,'rounded')][1]"),
		attached: form.getByText("Statements Attached").locator("xpath=.."),
		allocation: form.locator('input[inputmode="decimal"]').nth(1),
		allocation2: form.locator('input[inputmode="decimal"]').nth(2),
		submit: form.getByRole("button", { name: "Create Record" }),
		pending: form.getByText("Amount does not match"),
	}
}

async function save(page: Page, button = "Create Record") {
	await dialog(page).getByRole("button", { name: button }).click()
	await page.getByRole("dialog").waitFor({ state: "detached" }).catch(() => {})
	await page.waitForTimeout(600)
}

async function section(name: string, run: () => Promise<void>) {
	try {
		await run()
	} catch (error) {
		console.warn(`  ! ${name} failed: ${(error as Error).message.split("\n")[0]}`)
		await page.keyboard.press("Escape").catch(() => {})
	}
}

// ─── The story ────────────────────────────────────────────────────────────────────────────

const work = mkdtempSync(resolve(tmpdir(), "finpoint-capture-"))
rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
const first = resolve(work, "ocbc-october.csv")
const later = resolve(work, "ocbc-october-update.csv")
const uob = resolve(work, "uob-october.xls")
writeFileSync(first, ocbcCsv(ocbcRows))
writeFileSync(later, ocbcCsv([...ocbcRows, ...ocbcLater]))
uobXls(uob)

const browser = await chromium.launch(
	process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {},
)
const context = await browser.newContext({
	viewport,
	deviceScaleFactor: 2,
	timezoneId: "Asia/Singapore",
	locale: "en-SG",
	colorScheme: "light",
	// Entrances (row cascades, dialog zooms) resolve instantly, so every capture is a settled frame.
	reducedMotion: "reduce",
})
// Keep third-party analytics out of the captures (and out of a sandbox's network).
await context.route(/vercel|vitals|googleapis|google\.com/, route => route.abort())
const page = await context.newPage()
page.setDefaultTimeout(15000)
// Shift the browser's calendar to the guide's month while letting time run, so the app's own
// animations (which a frozen clock would stall) still play out.
await page.addInitScript(target => {
	const RealDate = Date
	const offset = target - RealDate.now()
	class GuideDate extends RealDate {
		constructor(...args: ConstructorParameters<DateConstructor> | []) {
			if (args.length === 0) super(RealDate.now() + offset)
			else super(...(args as ConstructorParameters<DateConstructor>))
		}
		static override now() {
			return RealDate.now() + offset
		}
	}
	globalThis.Date = GuideDate as DateConstructor
}, now.getTime())

try {
	// Importing
	await importOcbc(page, first, true)
	await go(page, "/importer")
	await page.getByRole("radio", { name: /UOB/ }).click()
	await page.locator('input[type="file"]').setInputFiles(uob)
	await page.getByRole("button", { name: /^Import/ }).click()
	await page.getByText(/new statements? imported/).first().waitFor()

	// The Allocator and its neighbours
	await go(page, "/allocator")
	await shot(page, "allocator", {
		list: page.locator("table").first(),
		lunch: row(page, "KOPI & CO"),
		supermarket: row(page, "NTUC FAIRPRICE"),
		dinner: row(page, "SAKURA DINING"),
		paynow: row(page, "PAYNOW FROM SAM"),
		amounts: page.getByRole("columnheader", { name: "Amount" }),
		tabs: page.getByRole("tablist").first(),
	}, { full: true })
	await go(page, "/statements")
	await shot(page, "statements", { list: page.locator("table").first(), create: page.getByRole("button", { name: "Create Pending Statement" }) }, { full: true })

	// First purchase
	await go(page, "/allocator")
	await row(page, "KOPI & CO").click()
	await shot(page, "lunch-selected", {
		lunch: row(page, "KOPI & CO"),
		bar: page.getByRole("button", { name: "Create Record" }).locator("xpath=ancestor::*[contains(@class,'fixed') or contains(@class,'sticky')][1]"),
		create: page.getByRole("button", { name: "Create Record" }),
	}, { full: true })
	await page.getByRole("button", { name: "Create Record" }).click()
	await dialog(page).getByText("Statements Attached").waitFor()
	await shot(page, "lunch-creator", creatorBoxes(page))
	await fillRecord(page, { title: "Lunch", category: "Dining Out" })
	await shot(page, "lunch-filled", creatorBoxes(page))
	await save(page)
	await shot(page, "lunch-done", { list: page.locator("table").first(), supermarket: row(page, "NTUC FAIRPRICE") }, { full: true })

	// Split one payment
	await createFrom(page, ["NTUC FAIRPRICE"])
	await shot(page, "groceries-creator", creatorBoxes(page))
	await fillRecord(page, { title: "Groceries", category: "Groceries", amount: "-50" })
	await dialog(page).locator('input[inputmode="decimal"]').nth(1).fill("-50")
	await shot(page, "groceries-filled", creatorBoxes(page))
	await save(page)
	await go(page, "/allocator")
	await shot(page, "split-remaining", { supermarket: row(page, "NTUC FAIRPRICE"), allocable: row(page, "NTUC FAIRPRICE").getByText(/allocable/) }, { full: true })
	await createFrom(page, ["NTUC FAIRPRICE"])
	await fillRecord(page, { title: "Birthday gift", category: "Gifts & Donations" })
	await shot(page, "gift-filled", creatorBoxes(page))
	await save(page)

	// Combine two Statements
	await go(page, "/allocator")
	await row(page, "SAKURA DINING").click()
	await row(page, "PAYNOW FROM SAM").click()
	await shot(page, "dinner-selected", {
		dinner: row(page, "SAKURA DINING"),
		paynow: row(page, "PAYNOW FROM SAM"),
		create: page.getByRole("button", { name: "Create Record" }),
		summary: page.getByText(/2 selected/),
		bar: page.getByRole("button", { name: "Create Record" }).locator("xpath=ancestor::*[contains(@class,'fixed') or contains(@class,'sticky')][1]"),
	}, { full: true })
	await page.getByRole("button", { name: "Create Record" }).click()
	await dialog(page).getByText("Statements Attached").waitFor()
	await fillRecord(page, { title: "Dinner with Sam", category: "Dining Out" })
	await shot(page, "dinner-filled", creatorBoxes(page))
	await save(page)
	await createFrom(page, ["SALARY ACME"])
	await fillRecord(page, { title: "Salary", category: "Income" })
	await save(page)
	await go(page, "/records")
	await shot(page, "records", {
		list: page.locator("table").first(),
		lunch: row(page, "Lunch"),
		groceries: row(page, "Groceries"),
		gift: row(page, "Birthday gift"),
		dinner: row(page, "Dinner with Sam"),
	}, { full: true })

	// Pending Records: a concert split, before the friend pays back
	await section("pending record", async () => {
		await createFrom(page, ["SISTIC CONCERT"])
		await fillRecord(page, { title: "Concert with Jo", category: "Entertainment", amount: "-100" })
		await shot(page, "concert-pending", creatorBoxes(page))
		await save(page)
		await go(page, "/records")
		await shot(page, "records-pending", {
			list: page.locator("table").first(),
			concert: row(page, "Concert with Jo"),
			badge: row(page, "Concert with Jo").getByText("Pending").first(),
		}, { full: true })
	})

	// The repayment arrives; attach it to the waiting Record
	await section("attach repayment", async () => {
		await importOcbc(page, later, false)
		await go(page, "/allocator")
		await row(page, "PAYNOW FROM JO").click()
		await shot(page, "repayment-selected", {
			paynow: row(page, "PAYNOW FROM JO"),
			attach: page.getByRole("button", { name: "Attach to Record" }),
			bar: page.getByRole("button", { name: "Attach to Record" }).locator("xpath=ancestor::*[contains(@class,'fixed') or contains(@class,'sticky')][1]"),
		}, { full: true })
		await page.getByRole("button", { name: "Attach to Record" }).click()
		await page.getByText("Concert with Jo").first().waitFor()
		await shot(page, "attach-sheet", {
			sheet: page.getByRole("dialog").last(),
			concert: page.getByRole("dialog").last().getByText("Concert with Jo").first(),
			exact: page.getByText("Exact match").first(),
		})
		await page.getByRole("dialog").last().getByText("Concert with Jo").first().click()
		await page.getByText("Edit Record").first().waitFor()
		await page.waitForTimeout(600)
		await shot(page, "attach-editor", {
			dialog: dialog(page),
			amount: dialog(page).locator("#amount"),
			attached: dialog(page).getByText("PAYNOW FROM JO").first(),
			submit: dialog(page).getByRole("button", { name: "Save changes" }),
		})
		await save(page, "Save changes")
	})

	// Pending Statements: a card payment the bank hasn't exported yet
	await section("pending statement", async () => {
		await go(page, "/statements")
		await page.getByRole("button", { name: "Create Pending Statement" }).click()
		const form = dialog(page)
		await form.locator("#account_id").click()
		await page.getByRole("option", { name: /360 Account/ }).click()
		await form.locator("#amount").fill("-35")
		await form.locator("#description").fill("Burger with Mia")
		await shot(page, "pending-statement", {
			dialog: form,
			account: form.locator("#account_id"),
			amount: form.locator("#amount"),
			description: form.locator("#description"),
			submit: form.getByRole("button", { name: "Create statement" }),
		})
		await save(page, "Create statement")
		await go(page, "/allocator")
		await shot(page, "pending-statement-row", {
			row: row(page, "Burger with Mia"),
			badge: row(page, "Burger with Mia").getByText("Pending").first(),
		}, { full: true })
		await createFrom(page, ["Burger with Mia"])
		await fillRecord(page, { title: "Burger with Mia", category: "Dining Out" })
		await save(page)
		await go(page, "/allocator/pending")
		await page.getByText("Burger with Mia").first().click()
		await page.getByRole("button", { name: "Replace", exact: true }).first().waitFor()
		await page.waitForTimeout(800)
		await shot(page, "replace-pending", {
			pending: page.getByText("Burger with Mia").first(),
			candidate: page.getByText("BURGER JOINT").first(),
			replace: page.getByRole("button", { name: "Replace", exact: true }).first(),
		})
		await page.getByRole("button", { name: "Replace", exact: true }).first().click()
		await page.getByText("Review Statement replacement").waitFor()
		await page.waitForTimeout(600)
		await shot(page, "replace-review", {
			dialog: dialog(page),
			source: dialog(page).getByText("Pending Statement").first(),
			destination: dialog(page).getByText("Imported Statement").first(),
			submit: dialog(page).getByRole("button", { name: "Replace pending Statement" }),
		})
		await save(page, "Replace pending Statement")
	})

	// Categories
	await section("categories", async () => {
		await go(page, "/categories")
		await shot(page, "categories", {
			grid: page.getByText("Groceries").first().locator("xpath=ancestor::section[1]"),
			groceries: page.getByRole("button", { name: "Edit Groceries" }),
		})
		await page.getByRole("button", { name: "Edit Groceries" }).click()
		await page.waitForTimeout(700)
		await shot(page, "category-dialog", {
			dialog: dialog(page),
			name: dialog(page).locator("#name"),
			defaults: dialog(page).getByText("Analytics defaults").locator("xpath=.."),
		})
	})

	// Dashboard and buckets
	await section("dashboard", async () => {
		await go(page, `/${month}`)
		await page.waitForTimeout(1500)
		await shot(page, "dashboard", {
			metrics: page.getByText("Total spending").first().locator("xpath=ancestor::*[contains(@class,'grid')][1]"),
			spending: page.getByText("Total spending").first(),
			breakdown: page.locator("#spending-breakdown-title"),
		})
		const breakdown = page.locator("#spending-breakdown-title")
		await breakdown.scrollIntoViewIfNeeded()
		await page.evaluate(() => window.scrollBy(0, -100))
		await shot(page, "dashboard-breakdown", {
			breakdown: breakdown.locator("xpath=ancestor::section[1]"),
			mix: page.getByText("Category spending mix").first().locator("xpath=ancestor::*[@data-slot='card'][1]"),
		})
		const buckets = page.getByText("Persistent groups").first()
		await buckets.scrollIntoViewIfNeeded()
		await page.evaluate(() => window.scrollBy(0, -120))
		await shot(page, "dashboard-buckets", {
			card: buckets.locator("xpath=ancestor::*[@data-slot='card'][1]"),
			daily: page.getByText("Daily", { exact: true }).first(),
			edit: page.getByRole("button", { name: "Edit" }).first(),
		})
		await page.getByRole("button", { name: "Edit" }).first().click()
		await page.waitForTimeout(700)
		const form = dialog(page)
		await form.locator("#bucket-no-target").click()
		await form.locator("#bucket-target").fill("500")
		await form.locator("#bucket-target-scope").click()
		await page.getByRole("option", { name: /onward/ }).click()
		await shot(page, "bucket-dialog", {
			dialog: form,
			target: form.locator("#bucket-target"),
			applies: form.locator("#bucket-target-scope"),
			submit: form.getByRole("button", { name: "Save changes" }),
		})
		await save(page, "Save changes")
		await page.waitForTimeout(800)
		await shot(page, "dashboard-target", {
			card: buckets.locator("xpath=ancestor::*[@data-slot='card'][1]"),
			daily: page.getByText("Daily", { exact: true }).first(),
			pace: page.getByText("Spending pace").first().locator("xpath=ancestor::section[1]"),
		})
	})

	// Budgets
	await section("budgets", async () => {
		await go(page, "/budgets")
		await page.getByRole("button", { name: "New Budget" }).click()
		const form = dialog(page)
		await form.locator("#name").fill("Bali trip")
		await form.locator("#amount").fill("1200")
		await shot(page, "budget-create", {
			dialog: form,
			name: form.locator("#name"),
			range: form.locator("#budget_create_date_range"),
			automatic: form.getByText("Automatic attach").first().locator("xpath=ancestor::*[@data-slot='field'][1]"),
		})
	})

	// Revolut asks for its Account
	await section("revolut", async () => {
		await go(page, "/importer")
		await page.getByRole("radio", { name: /Revolut/ }).click()
		await page.waitForTimeout(500)
		await shot(page, "importer-revolut", {
			revolut: page.getByRole("radio", { name: /Revolut/ }),
			account: page.getByText("Account", { exact: true }).first().locator("xpath=ancestor::*[contains(@class,'space-y') or @data-slot='field'][1]"),
		})
	})

	// Backups
	await section("data", async () => {
		await go(page, "/sync")
		await shot(page, "data", {
			file: page.getByRole("button", { name: /Download backup/ }).locator("xpath=ancestor::*[@data-slot='card'][1]"),
			download: page.getByRole("button", { name: /Download backup/ }),
			drive: page.getByText("Google Drive").first().locator("xpath=ancestor::*[@data-slot='card'][1]"),
			connect: page.getByRole("button", { name: /Google Drive/ }).first(),
		})
	})

	writeFileSync(resolve(root, "src/lib/guide-video-shots.json"), `${JSON.stringify(shots, null, "\t")}\n`)
} finally {
	await browser.close()
	rmSync(work, { recursive: true, force: true })
}
console.log(`Captured ${Object.keys(shots).length} screens into public/guide-shots.`)
