// The guide's story, filmed in the real app. Takes play in order in one browser, so each builds on
// the data the last one left behind. Each take names the beats it shows; `setup` runs off camera
// (navigating, importing the rows the narration is about), then `play` acts on the narration's
// words with `t.at(beat, word)`.
//
// Locators are the only thing tied to the UI: find controls by role and visible label, so a
// restyle or layout change needs no edits, and a renamed control fails loudly here.
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { resolve } from "node:path"
import type { Frame, Locator } from "@playwright/test"
import { glide, pick, press, retype, scrollTo, type Take, type } from "./director"

export type TakeScript = {
	name: string
	chapter: string
	beats: string[]
	setup?: (t: Take) => Promise<void>
	play: (t: Take) => Promise<void>
}

// ─── Fictional bank exports ───────────────────────────────────────────────────────────────

type Row = [date: string, description: string, amount: number]

/** The first import: what the basics chapters explain, one by one. */
const october: Row[] = [
	["03/10/2026", "KOPI & CO RAFFLES PL", -12],
	["05/10/2026", "NTUC FAIRPRICE BEDOK", -80],
	["10/10/2026", "SAKURA DINING", -90],
	// Sam pays their share back a week after dinner.
	["17/10/2026", "PAYNOW FROM SAM TAN", 60],
]
const concert: Row = ["06/10/2026", "SISTIC CONCERT TIX", -200]
const repayment: Row = ["13/10/2026", "PAYNOW FROM JO LIM", 100]
const burger: Row = ["19/10/2026", "BURGER JOINT TANJONG PAGAR", -35]
// Banks reorder words between exports; Finpoint flags the same words on the same account, day
// and amount.
const grab: Row = ["14/10/2026", "GRAB RIDE SG 8823", -18.4]
const grabAgain: Row = ["14/10/2026", "SG 8823 GRAB RIDE", -18.4]
const phone: Row[] = [
	["02/09/2026", "SINGTEL BILL PAYMENT", -45],
	["02/10/2026", "SINGTEL BILL PAYMENT", -45],
]
/** The month's income and saving, and last month, explained off camera for the Overview. */
const salary: Row = ["01/10/2026", "SALARY ACME PTE LTD", 3000]
const investment: Row = ["18/10/2026", "TRANSFER TO SYFE INVEST", -500]
const september: [...Row, string, string][] = [
	["01/09/2026", "SALARY ACME PTE LTD", 3000, "Salary", "Income"],
	["04/09/2026", "SHENG SIONG BEDOK", -64.2, "Groceries", "Groceries"],
	["08/09/2026", "TOAST BOX TAMPINES", -9.5, "Breakfast", "Dining Out"],
	["12/09/2026", "GRAB RIDE", -18, "Taxi home", "Transport"],
	["15/09/2026", "SP SERVICES", -96.3, "Electricity", "Bills & Utilities"],
	["19/09/2026", "SUSHIRO TAMPINES", -42, "Dinner", "Dining Out"],
	["21/09/2026", "FAIRPRICE XTRA", -38.4, "Groceries", "Groceries"],
	["27/09/2026", "UNIQLO BUGIS", -59.9, "Jeans", "Shopping"],
]
const lateOctober: [...Row, string, string][] = [
	["08/10/2026", "TOAST BOX RAFFLES", -8.9, "Breakfast", "Dining Out"],
	["12/10/2026", "SHENG SIONG BEDOK", -52.6, "Groceries", "Groceries"],
	["15/10/2026", "SP SERVICES", -88.1, "Electricity", "Bills & Utilities"],
	["16/10/2026", "BUS/MRT TRANSIT", -21.6, "Transport", "Transport"],
]

function ocbcCsv(rows: Row[]) {
	return [
		"Account details for:,OCBC 360 Account 601-234567-001",
		"Transaction History",
		"Transaction date,Value date,Description,Withdrawals(SGD),Deposits(SGD)",
		...rows.map(([date, description, amount]) =>
			[date, date, description, amount < 0 ? (-amount).toFixed(2) : "", amount > 0 ? amount.toFixed(2) : ""].join(","),
		),
	].join("\n")
}

const files = mkdtempSync(resolve(tmpdir(), "finpoint-exports-"))
function exportFile(name: string, rows: Row[]) {
	const file = resolve(files, name)
	writeFileSync(file, ocbcCsv(rows))
	return file
}

// ─── Moving around ────────────────────────────────────────────────────────────────────────

async function go(t: Take, path: string) {
	await t.app.goto(new URL(path, t.app.url()).toString(), { waitUntil: "load" })
	await t.page.waitForTimeout(1200)
}

/**
 * Navigates by clicking the sidebar, the way a person moves between pages. A click that lands
 * while a dialog is still closing can be swallowed, so it's repeated until the page changes.
 */
async function via(t: Take, label: string) {
	const item = sidebar(t.app, label)
	await press(t.page, item)
	for (let attempt = 0; attempt < 3; attempt++) {
		if ((await item.getAttribute("data-active").catch(() => null)) === "true") break
		await t.page.waitForTimeout(300)
		if (attempt === 1) await item.click()
	}
	await t.page.waitForTimeout(700)
}

const sidebar = (frame: Frame, label: string) =>
	frame.locator("[data-sidebar=menu-button]").filter({ hasText: label }).first()
const card = (frame: Frame, title: string | RegExp) =>
	frame.getByText(title, { exact: typeof title === "string" }).first().locator("xpath=ancestor::*[@data-slot='card'][1]")
const row = (frame: Frame, text: string) =>
	frame.locator("tr, [data-slot=mobile-row]").filter({ hasText: text }).first()
const table = (frame: Frame) => frame.locator("table").first()
const dialog = (frame: Frame) => frame.getByRole("dialog").last()
const button = (scope: Frame | Locator, name: string | RegExp) =>
	scope.getByRole("button", { name, exact: typeof name === "string" }).first()
const selectionBar = (frame: Frame) =>
	frame.getByText(/\d+ selected ·/).first().locator("xpath=ancestor::*[contains(@class,'fixed') or contains(@class,'sticky')][1]")

const creator = (frame: Frame) => {
	const form = dialog(frame)
	return {
		dialog: form,
		title: form.locator("#title"),
		amount: form.locator("#amount"),
		category: form.locator("#category_id"),
		analytics: form.getByText("Analytics", { exact: true }).locator("xpath=.."),
		allocations: form.getByText("Statement allocations").locator("xpath=.."),
		allocation: form.locator('input[inputmode="decimal"]').nth(1),
		submit: form.getByRole("button", { name: /Create Record|Save changes/ }),
	}
}

async function closed(t: Take) {
	await t.app.getByRole("dialog").waitFor({ state: "detached" }).catch(() => {})
	await t.page.waitForTimeout(400)
}

/** Imports an OCBC export off camera. Rows already imported are skipped by the Importer. */
async function importOcbc(t: Take, name: string, rows: Row[]) {
	await go(t, "/importer")
	await t.app.getByRole("radio", { name: /OCBC/ }).click()
	await t.app.locator('input[type="file"]').setInputFiles(exportFile(name, rows))
	await t.app.getByRole("button", { name: /^Import/ }).click()
	await t.app.getByText(/new statements? imported|already here/).first().waitFor()
}

/** Explains one Statement off camera with a single Record. */
async function explain(t: Take, text: string, title: string, category: string) {
	const app = t.app
	await row(app, text).click()
	await app.getByRole("button", { name: "Create Record" }).first().click()
	await creator(app).title.waitFor()
	await creator(app).title.fill(title)
	await creator(app).category.click()
	await creator(app).category.fill(category)
	await app.getByRole("option", { name: category }).first().click()
	await creator(app).submit.click()
	await closed(t)
}

async function fillRecord(t: Take, title: string, query: string, category: string) {
	await press(t.page, creator(t.app).title)
	await type(t.page, title)
	await pick(t.page, t.app, creator(t.app).category, query, category)
}

// ─── The story ────────────────────────────────────────────────────────────────────────────

export const story: TakeScript[] = [
	// A brand-new browser: the Dashboard offers demo data, and Help offers practice.
	{
		name: "workspace",
		chapter: "workspace",
		beats: ["demo", "practice", "own"],
		setup: t => go(t, "/"),
		async play(t) {
			const app = t.app
			const offer = app.getByText("New to Finpoint?").locator("xpath=ancestor::*[contains(@class,'rounded-xl')][1]")
			await t.at("demo", "demo data")
			await t.focus(offer, { zoom: 1.6 })
			await t.ring("offer", button(app, /Try demo data/))
			await glide(t.page, button(app, /Try demo data/))
			await t.at("demo", "three accounts")
			await t.ring("text", app.getByText(/3 accounts and 5 months/))
			await t.at("demo", "lived-in")
			await t.unring()
			await t.wide()
			await via(t, "Help")
			await t.at("practice", "practice lessons")
			const practice = app.getByRole("link", { name: /practi/i }).first()
			await t.ring("practice", practice)
			await glide(t.page, practice)
			await t.at("own")
			await t.unring()
			await via(t, "Importer")
		},
	},
	{
		name: "revolut",
		chapter: "import",
		beats: ["revolut"],
		setup: t => go(t, "/importer"),
		async play(t) {
			const app = t.app
			await t.focus(card(app, "Upload statements"), { zoom: 1.5 })
			const revolut = app.getByRole("radio", { name: /Revolut/ })
			await t.at("revolut", "Revolut’s")
			await t.ring("revolut", revolut)
			await press(t.page, revolut)
			await t.at("revolut", "pick or name")
			await t.unring()
			const account = app.getByText("Account", { exact: true }).first().locator("xpath=ancestor::*[@data-slot='field' or contains(@class,'space-y')][1]")
			await t.ring("account", account)
			await glide(t.page, account)
			// Back to OCBC off the record, so the next take starts from a clean form.
			await t.page.waitForTimeout(400)
		},
	},
	{
		name: "import",
		chapter: "import",
		beats: ["choose", "result", "next"],
		setup: t => go(t, "/importer"),
		async play(t) {
			const app = t.app
			const upload = card(app, "Upload statements")
			await t.at("choose", "Importer")
			await t.focus(upload, { zoom: 1.5 })
			await t.at("choose", "bank")
			const ocbc = app.getByRole("radio", { name: /OCBC/ })
			await t.ring("bank", ocbc)
			await press(t.page, ocbc)
			await t.at("choose", "add")
			await t.unring("bank")
			const chooser = t.page.waitForEvent("filechooser")
			await press(t.page, app.getByText(/Drop bank exports here/).first())
			await (await chooser).setFiles(exportFile("ocbc-october.csv", october))
			const submit = app.getByRole("button", { name: /^Import/ })
			await t.at("result", "Import", { early: 0.6 })
			await t.ring("submit", submit)
			await press(t.page, submit)
			await t.unring("submit")
			const result = app.getByText(/new statements? imported/).first()
			await result.waitFor()
			await t.wide()
			await t.at("result", "how many")
			await t.ring("result", result.locator("xpath=ancestor::*[contains(@class,'rounded-xl')][1]"))
			await t.at("next", "Workflows")
			await t.unring("result")
			await t.ring("workflows", sidebar(app, "Workflows"))
			await t.at("next", "Allocate to Records")
			await t.unring()
			const allocate = app.getByRole("link", { name: /Allocate them/ })
			await t.ring("allocate", allocate)
			await press(t.page, allocate)
			await t.unring()
		},
	},
	{
		name: "allocator",
		chapter: "allocator",
		beats: ["list", "left", "tabs", "pages"],
		setup: t => go(t, "/allocator"),
		async play(t) {
			const app = t.app
			await t.at("list", "Allocate to Records")
			const tab = app.getByRole("link", { name: "Allocate to Records" })
			await t.ring("tab", tab)
			await t.at("list", "lists")
			await t.unring()
			await t.ring("list", table(app))
			await glide(t.page, row(app, "PAYNOW FROM SAM"), { dx: 0.3, ms: 700 })
			await glide(t.page, row(app, "KOPI & CO"), { dx: 0.3, ms: 1100 })
			await t.at("left", "how much is left")
			await t.unring()
			const amountCell = row(app, "NTUC FAIRPRICE").locator("td").last()
			await t.ring("left", amountCell)
			await glide(t.page, amountCell)
			await t.at("tabs")
			await t.unring()
			await t.ring("duplicates", app.getByRole("link", { name: "Fix Duplicates" }))
			await glide(t.page, app.getByRole("link", { name: "Fix Duplicates" }))
			await t.at("tabs", "Replace Pending")
			await t.unring()
			await t.ring("replace", app.getByRole("link", { name: "Replace Pending" }))
			await glide(t.page, app.getByRole("link", { name: "Replace Pending" }))
			await t.at("pages", "Statements")
			await t.unring()
			await t.ring("statements", sidebar(app, "Statements"))
			await glide(t.page, sidebar(app, "Statements"))
			await t.at("pages", "Records lists")
			await t.unring()
			await t.ring("records", sidebar(app, "Records"))
			await glide(t.page, sidebar(app, "Records"))
			await t.at("pages", "Workflows only")
			await t.unring()
			await t.ring("workflows", sidebar(app, "Workflows"))
		},
	},
	{
		name: "lunch",
		chapter: "lunch",
		beats: ["select", "create", "fill", "ignore", "save"],
		setup: t => go(t, "/allocator"),
		async play(t) {
			const app = t.app
			await t.at("select", "click")
			await t.ring("lunch", row(app, "KOPI & CO"))
			await press(t.page, row(app, "KOPI & CO"), { dx: 0.3 })
			await t.at("select", "A bar")
			await t.unring()
			await t.ring("bar", selectionBar(app))
			await t.at("create", "Create Record")
			await t.unring()
			await press(t.page, button(app, "Create Record"))
			await creator(app).title.waitFor()
			await t.focus(creator(app).dialog, { zoom: 1.5 })
			await t.at("create", "already allocated")
			await t.ring("allocations", creator(app).allocations)
			await t.at("create", "amount and date")
			await t.unring()
			await t.ring("amount", creator(app).amount)
			await t.at("fill", "Give it")
			await t.unring()
			await press(t.page, creator(app).title)
			await type(t.page, "Lunch")
			await t.at("fill", "pick")
			await pick(t.page, app, creator(app).category, "Dining", "Dining Out")
			await t.at("ignore", "Analytics")
			await t.ring("analytics", creator(app).analytics)
			await scrollTo(app, creator(app).analytics)
			await t.at("save", "Create Record")
			await t.unring()
			await press(t.page, creator(app).submit)
			await closed(t)
			await t.wide()
			await t.at("save", "leaves the list")
			await t.ring("list", table(app))
		},
	},
	{
		name: "split",
		chapter: "split",
		beats: ["select", "amount", "left", "gift", "save"],
		setup: t => go(t, "/allocator"),
		async play(t) {
			const app = t.app
			await t.at("select", "Select it")
			await press(t.page, row(app, "NTUC FAIRPRICE"), { dx: 0.3 })
			await t.at("select", "Create Record")
			await press(t.page, button(app, "Create Record"))
			await creator(app).title.waitFor()
			await t.focus(creator(app).dialog, { zoom: 1.5 })
			await t.at("amount", "Call it")
			await press(t.page, creator(app).title)
			await type(t.page, "Groceries")
			await t.at("amount", "Record’s amount")
			await t.ring("amount", creator(app).amount)
			await retype(t.page, creator(app).amount, "-50")
			await t.at("amount", "Allocation")
			await t.unring()
			await t.ring("allocation", creator(app).allocation)
			await retype(t.page, creator(app).allocation, "-50")
			await t.unring()
			await pick(t.page, app, creator(app).category, "Groc", "Groceries")
			await t.at("left", "Save")
			await press(t.page, creator(app).submit)
			await closed(t)
			await t.wide()
			await t.at("left", "$30 left")
			const left = row(app, "NTUC FAIRPRICE")
			await t.ring("left", left)
			await t.at("gift", "Select it again")
			await t.unring()
			await press(t.page, left, { dx: 0.3 })
			await press(t.page, button(app, "Create Record"))
			await creator(app).title.waitFor()
			await t.focus(creator(app).dialog, { zoom: 1.5 })
			await t.at("gift", "second Record")
			await press(t.page, creator(app).title)
			await type(t.page, "Birthday gift")
			await pick(t.page, app, creator(app).category, "Gift", "Gifts & Donations")
			await t.at("gift", "fills that amount")
			await t.ring("amount", creator(app).amount)
			await t.at("save", "Save")
			await t.unring()
			await press(t.page, creator(app).submit)
			await closed(t)
			await t.wide()
			await t.at("save", "leaves the list")
			await t.ring("list", table(app))
		},
	},
	{
		name: "repayment",
		chapter: "repayment",
		beats: ["select", "create", "done"],
		setup: t => go(t, "/allocator"),
		async play(t) {
			const app = t.app
			await t.at("select", "$90")
			await press(t.page, row(app, "SAKURA DINING"), { dx: 0.3 })
			await t.at("select", "$60")
			await press(t.page, row(app, "PAYNOW FROM SAM"), { dx: 0.3 })
			await t.at("select", "The bar")
			await t.ring("bar", selectionBar(app))
			await t.at("create", "Create Record")
			await t.unring()
			await press(t.page, button(app, "Create Record"))
			await creator(app).title.waitFor()
			await t.focus(creator(app).dialog, { zoom: 1.5 })
			await t.at("create", "Dinner with Sam")
			await press(t.page, creator(app).title)
			await type(t.page, "Dinner with Sam")
			await t.at("create", "Both Statements")
			await t.ring("allocations", creator(app).allocations)
			await t.at("create", "comes to $30")
			await t.unring()
			await t.ring("amount", creator(app).amount)
			await pick(t.page, app, creator(app).category, "Dining", "Dining Out")
			await t.at("done", "Save")
			await t.unring()
			await press(t.page, creator(app).submit)
			await closed(t)
			await t.wide()
			await via(t, "Records")
			await t.at("done", "single Record")
			await t.ring("dinner", row(app, "Dinner with Sam"))
		},
	},
	{
		// The salary, an investment and last month are explained off camera, so the Overview has
		// income, a saving and months to compare with.
		name: "dashboard",
		chapter: "dashboard",
		beats: ["real", "categories"],
		async setup(t) {
			await importOcbc(t, "ocbc-history.csv", [
				salary,
				investment,
				...[...september, ...lateOctober].map(([date, description, amount]) => [date, description, amount] as Row),
			])
			await go(t, "/allocator")
			await explain(t, "TRANSFER TO SYFE", "Investing", "Savings & Investments")
			for (const [, description, , title, category] of [...september, ...lateOctober])
				await explain(t, description, title, category)
			await explain(t, "SALARY ACME", "Salary", "Income")
			await go(t, "/?month=October&year=2026")
		},
		async play(t) {
			const app = t.app
			await t.at("real", "what you really spent")
			const spending = app.getByText(/spending/i).first().locator("xpath=ancestor::*[@data-slot='card'][1]")
			await t.ring("spending", spending)
			await glide(t.page, spending)
			await t.at("categories", "Categories this month")
			await t.unring()
			const categories = card(app, /^Categories this month/)
			await scrollTo(app, categories, { middle: 0.45 })
			await t.focus(categories, { zoom: 1.5 })
			await glide(t.page, categories.getByText("Dining Out").first())
		},
	},
	{
		name: "pending",
		chapter: "pending",
		beats: ["concert", "flag", "list"],
		async setup(t) {
			await importOcbc(t, "ocbc-concert.csv", [concert])
			await go(t, "/allocator")
		},
		async play(t) {
			const app = t.app
			await t.at("concert", "create the Record")
			await press(t.page, row(app, "SISTIC CONCERT"), { dx: 0.3 })
			await press(t.page, button(app, "Create Record"))
			await creator(app).title.waitFor()
			await t.focus(creator(app).dialog, { zoom: 1.5 })
			await fillRecord(t, "Concert with Jo", "Enter", "Entertainment")
			await t.at("flag", "$100 against")
			await t.ring("amount", creator(app).amount)
			await retype(t.page, creator(app).amount, "-100")
			await t.at("flag", "warns you")
			await t.unring()
			const warning = creator(app).dialog.getByRole("alert").first()
			await t.ring("warning", warning)
			await t.at("flag", "saves the Record")
			await t.unring()
			await press(t.page, creator(app).submit)
			await closed(t)
			await t.wide()
			await via(t, "Records")
			await t.at("list", "marked")
			await t.ring("badge", row(app, "Concert with Jo").getByText("Pending").first())
		},
	},
	{
		name: "attach",
		chapter: "pending",
		beats: ["attach", "complete"],
		async setup(t) {
			await importOcbc(t, "ocbc-repayment.csv", [repayment])
			await go(t, "/allocator")
		},
		async play(t) {
			const app = t.app
			await t.at("attach", "select it")
			await press(t.page, row(app, "PAYNOW FROM JO"), { dx: 0.3 })
			await t.at("attach", "Allocate to record")
			const allocate = button(app, "Allocate to record")
			await t.ring("allocate", allocate)
			await press(t.page, allocate)
			await t.unring()
			const sheet = dialog(app)
			await sheet.getByText("Concert with Jo").first().waitFor()
			await t.at("attach", "suggests")
			await t.ring("suggestion", sheet.getByText("Concert with Jo").first())
			await t.at("complete")
			await t.unring()
			await press(t.page, sheet.getByText("Concert with Jo").first())
			await app.getByText("Edit Record").first().waitFor()
			await t.focus(creator(app).dialog, { zoom: 1.5 })
			await t.at("complete", "both payments")
			await t.ring("allocations", creator(app).allocations)
			await t.at("complete", "Save")
			await t.unring()
			await press(t.page, creator(app).submit)
			await closed(t)
			await t.wide()
			await via(t, "Records")
			await t.at("complete", "no longer Pending")
			await t.ring("concert", row(app, "Concert with Jo"))
		},
	},
	{
		name: "placeholder",
		chapter: "pending-statements",
		beats: ["create", "explain"],
		setup: t => go(t, "/statements"),
		async play(t) {
			const app = t.app
			await t.at("create", "Create Pending Statement")
			await press(t.page, button(app, "Create Pending Statement"))
			const form = dialog(app)
			await form.locator("#account_id").waitFor()
			await t.focus(form, { zoom: 1.5 })
			await t.at("create", "account")
			await press(t.page, form.locator("#account_id"))
			await press(t.page, app.getByRole("option", { name: /360 Account/ }).first())
			await t.at("create", "amount")
			await retype(t.page, form.locator("#amount"), "-35")
			await t.at("create", "description")
			await press(t.page, form.locator("#description"))
			await type(t.page, "Burger with Mia")
			await press(t.page, button(form, "Create statement"))
			await closed(t)
			await t.wide()
			await t.at("explain", "Workflows")
			await via(t, "Workflows")
			await t.ring("pending", row(app, "Burger with Mia").getByText("Pending").first())
			await t.at("explain", "Explain it")
			await t.unring()
			await press(t.page, row(app, "Burger with Mia"), { dx: 0.3 })
			await press(t.page, button(app, "Create Record"))
			await creator(app).title.waitFor()
			await t.focus(creator(app).dialog, { zoom: 1.5 })
			await t.at("explain", "Burger with Mia")
			await fillRecord(t, "Burger", "Dining", "Dining Out")
			await press(t.page, creator(app).submit)
			await closed(t)
			await t.wide()
			await via(t, "Records")
			await t.at("explain", "stays Pending")
			await t.ring("burger", row(app, "Burger").getByText("Pending").first())
		},
	},
	{
		name: "replace",
		chapter: "pending-statements",
		beats: ["replace", "review"],
		async setup(t) {
			await importOcbc(t, "ocbc-burger.csv", [burger])
			await go(t, "/allocator")
		},
		async play(t) {
			const app = t.app
			await t.at("replace", "Replace Pending")
			await press(t.page, app.getByRole("link", { name: "Replace Pending" }))
			await app.getByText("Burger with Mia").first().waitFor()
			await t.at("replace", "Pick")
			await press(t.page, app.getByText("Burger with Mia").first())
			const candidate = app.getByText("BURGER JOINT").first()
			await candidate.waitFor()
			await t.at("replace", "suggests")
			await t.ring("candidate", candidate.locator("xpath=ancestor::*[@data-slot='card' or contains(@class,'rounded')][1]"))
			await t.at("review", "Review")
			await t.unring()
			await press(t.page, button(app, "Replace"))
			await app.getByText("Review Statement replacement").waitFor()
			await t.focus(dialog(app), { zoom: 1.4 })
			await t.at("review", "Replace pending Statement")
			const confirm = button(dialog(app), "Replace pending Statement")
			await t.ring("confirm", confirm)
			await press(t.page, confirm)
			await t.unring()
			await closed(t)
			await t.wide()
		},
	},
	{
		name: "duplicates",
		chapter: "duplicates",
		beats: ["badge", "choose", "review"],
		async setup(t) {
			await importOcbc(t, "ocbc-grab.csv", [grab])
			await importOcbc(t, "ocbc-grab-again.csv", [grabAgain])
			await go(t, "/allocator")
		},
		async play(t) {
			const app = t.app
			await t.at("badge", "possible duplicates")
			await t.ring("badge", row(app, "GRAB").getByText("Duplicate?").first())
			await t.at("badge", "Fix Duplicates")
			await t.unring()
			await press(t.page, app.getByRole("link", { name: "Fix Duplicates" }))
			await app.getByText("SG 8823 GRAB RIDE").first().waitFor()
			const pair = app.getByText("SG 8823 GRAB RIDE").first().locator("xpath=ancestor::section[1]")
			await t.focus(pair, { zoom: 1.5 })
			await t.at("choose", "Not duplicates")
			await t.ring("separate", button(pair, "Not duplicates"))
			await glide(t.page, button(pair, "Not duplicates"))
			await t.at("choose", "Statement to keep")
			await t.unring()
			const keep = pair.getByRole("radio", { name: /^Keep GRAB RIDE SG/ }).first()
			await t.ring("keep", keep)
			await press(t.page, keep)
			await t.unring()
			await press(t.page, pair.getByRole("radio", { name: /^Delete SG 8823/ }).first())
			await t.at("choose", "Review deletion")
			await t.unring()
			const fix = button(pair, /Review deletion/)
			await t.ring("fix", fix)
			await press(t.page, fix)
			await t.unring()
			await dialog(app).waitFor()
			await t.at("review", "shows what will happen")
			await t.focus(dialog(app), { zoom: 1.4 })
			await t.at("review", "Allocations follow")
			const submit = dialog(app).getByRole("button", { name: /Delete/ }).last()
			await t.ring("submit", submit)
			await press(t.page, submit)
			await t.unring()
			await closed(t)
			await t.wide()
		},
	},
	{
		name: "find",
		chapter: "find",
		beats: ["records", "edit", "statements", "settings"],
		setup: t => go(t, "/records"),
		async play(t) {
			const app = t.app
			const search = app.getByPlaceholder(/^Search/).first()
			await t.at("records", "Search")
			await t.ring("search", search)
			await press(t.page, search)
			await type(t.page, "dinner")
			await t.at("records", "filter")
			await t.unring()
			await t.page.keyboard.press("ControlOrMeta+a")
			await t.page.keyboard.press("Backspace")
			await t.at("edit", "Open a Record")
			await press(t.page, row(app, "Dinner with Sam").getByRole("link").first())
			await app.getByText("Edit Record").first().waitFor()
			await t.at("edit", "its Statements")
			await t.ring("statements", card(app, /^Statements allocated/))
			await t.at("edit", "Edit Record")
			await t.unring()
			await t.ring("edit", button(app, /Edit Record/))
			await press(t.page, button(app, /Edit Record/))
			await creator(app).title.waitFor()
			await t.unring()
			await t.focus(creator(app).dialog, { zoom: 1.4 })
			await t.at("edit", "Allocations")
			await t.ring("allocations", creator(app).allocations)
			await t.at("statements")
			await t.unring()
			await t.page.keyboard.press("Escape")
			await closed(t)
			await t.wide()
			await via(t, "Statements")
			await t.at("statements", "each Account")
			await t.ring("accounts", sidebar(app, "Accounts"))
			await glide(t.page, sidebar(app, "Accounts"))
			await t.at("settings", "Settings")
			await t.unring()
			await via(t, "Settings")
			await t.focus(card(app, "Default filters"), { zoom: 1.5 })
			await t.ring("filters", card(app, "Default filters"))
		},
	},
	{
		name: "categories",
		chapter: "categories",
		beats: ["most", "examples", "defaults"],
		setup: t => go(t, "/categories"),
		async play(t) {
			const app = t.app
			await t.at("examples", "Dining Out")
			await t.ring("dining", app.getByText("Dining Out", { exact: true }).first())
			await glide(t.page, app.getByText("Dining Out", { exact: true }).first())
			await t.at("examples", "Groceries")
			await t.unring()
			await t.ring("groceries", app.getByText("Groceries", { exact: true }).first())
			await t.at("examples", "Gifts & Donations")
			await t.unring()
			await t.ring("gifts", app.getByText("Gifts & Donations", { exact: true }).first())
			await t.at("defaults", "two defaults")
			await t.unring()
			await press(t.page, button(app, "Edit Dining Out"))
			await dialog(app).waitFor()
			await t.focus(dialog(app), { zoom: 1.4 })
			await t.at("defaults", "treatment")
			const treatment = dialog(app).getByText(/treatment/i).first().locator("xpath=ancestor::*[@data-slot='field'][1]")
			await t.ring("treatment", treatment)
			await t.at("defaults", "Monthly Budget")
			await t.unring()
			const budget = dialog(app).getByText(/monthly budget/i).first().locator("xpath=ancestor::*[@data-slot='field'][1]")
			await t.ring("budget", budget)
			await t.at("defaults", "fills them in")
			await t.unring()
			await t.page.keyboard.press("Escape")
			await closed(t)
			await t.wide()
		},
	},
	{
		name: "rules",
		chapter: "rules",
		beats: ["match", "fill", "use"],
		async setup(t) {
			await importOcbc(t, "ocbc-phone.csv", phone)
			await go(t, "/statement-rules")
		},
		async play(t) {
			const app = t.app
			await t.at("match", "New rule")
			await press(t.page, button(app, /New rule/))
			const form = dialog(app)
			await form.locator("#rule-name").waitFor()
			await t.focus(form, { zoom: 1.3 })
			await t.at("match", "name")
			await press(t.page, form.locator("#rule-name"))
			await type(t.page, "Phone bill")
			await t.at("match", "text to look for")
			await press(t.page, form.getByLabel("Text to look for").first())
			await type(t.page, "SINGTEL")
			await t.at("match", "shows the Statements")
			await t.ring("matches", form.getByText(/matching Statement/).first().locator("xpath=.."))
			await t.at("fill", "title")
			await t.unring()
			const title = form.getByLabel(/^Title$/).first()
			await press(t.page, title)
			await type(t.page, "Phone bill")
			await t.at("fill", "Category")
			await pick(t.page, app, form.getByLabel(/^Category$/).first(), "Bills", "Bills & Utilities")
			await t.at("fill", "Autofill")
			await t.ring("autofill", form.getByText("Autofill", { exact: true }).first())
			await t.at("fill", "Suggest")
			await t.unring()
			await t.ring("suggest", form.getByText("Suggest", { exact: true }).first())
			await t.unring()
			await press(t.page, form.getByRole("button", { name: /Create|Save/ }).last())
			await closed(t)
			await t.wide()
			await t.at("use", "create a Record")
			await via(t, "Workflows")
			await press(t.page, row(app, "SINGTEL"), { dx: 0.3 })
			await press(t.page, button(app, "Create Record"))
			await creator(app).title.waitFor()
			await t.focus(creator(app).dialog, { zoom: 1.4 })
			await t.at("use", "ready")
			await t.ring("title", creator(app).title)
			await t.at("use", "change any")
			await t.unring()
			await t.page.keyboard.press("Escape")
			await closed(t)
			await t.wide()
		},
	},
	{
		name: "treatments",
		chapter: "treatments",
		beats: ["dashboard"],
		setup: t => go(t, "/?month=October&year=2026"),
		async play(t) {
			const app = t.app
			await t.at("dashboard", "Income and Spending")
			await t.ring("income", app.getByText(/income/i).first().locator("xpath=ancestor::*[@data-slot='card'][1]"))
			await t.at("dashboard", "its own section")
			await t.unring()
			const saving = app.locator("#investment-title").locator("xpath=ancestor::section[1]")
			await scrollTo(app, saving, { middle: 0.45 })
			await t.focus(saving, { zoom: 1.4 })
			await t.ring("saving", saving)
		},
	},
	{
		name: "monthly-budget",
		chapter: "buckets",
		beats: ["daily", "amount", "rule", "compare"],
		setup: t => go(t, "/?month=October&year=2026"),
		async play(t) {
			const app = t.app
			const budgets = card(app, "Monthly budgets")
			await scrollTo(app, budgets, { middle: 0.45 })
			await t.at("daily", "Daily")
			await t.focus(budgets, { zoom: 1.4 })
			await t.ring("daily", budgets.getByText("Daily", { exact: true }).first())
			await t.at("amount", "Edit")
			await t.unring()
			const edit = button(app, "Edit Daily")
			await t.ring("edit", edit)
			await press(t.page, edit)
			await t.unring()
			const form = dialog(app)
			await form.locator("#monthly-budget-amount-scope").waitFor()
			await t.focus(form, { zoom: 1.3 })
			await t.at("rule", "Amount rule")
			const rule = form.locator("#monthly-budget-amount-scope")
			await t.ring("rule", rule)
			await press(t.page, rule)
			await t.at("rule", "Override default")
			await press(t.page, app.getByRole("option", { name: "Override default" }))
			await t.unring()
			await t.at("rule", "this month onward")
			const amount = form.locator("#monthly-budget-amount")
			await amount.waitFor()
			await t.ring("amount", amount)
			await retype(t.page, amount, "500")
			await t.unring()
			await press(t.page, form.getByRole("button", { name: "Save changes" }))
			await closed(t)
			await t.at("compare", "against the plan")
			await t.focus(budgets, { zoom: 1.4 })
			await t.ring("daily", budgets.getByText("Daily", { exact: true }).first().locator("xpath=ancestor::*[contains(@class,'rounded')][1]"))
		},
	},
	{
		name: "monthly",
		chapter: "monthly",
		beats: ["days", "drill", "review"],
		setup: t => go(t, "/?month=October&year=2026"),
		async play(t) {
			const app = t.app
			const tab = app.getByRole("link", { name: "Monthly Records" }).first()
			await t.at("days", "Monthly Records")
			await t.ring("tab", tab)
			await press(t.page, tab)
			await t.unring()
			await t.at("days", "grouped by day")
			await t.ring("list", app.locator("main").first())
			await t.at("drill")
			await t.unring()
			await press(t.page, app.getByRole("link", { name: "Overview" }).first())
			await t.at("drill", "Click any part")
			const chart = card(app, /^Categories this month/)
			await scrollTo(app, chart, { middle: 0.45 })
			await glide(t.page, chart.getByText("Groceries").first())
			await t.at("review", "Review this month")
			const review = app.getByLabel("Review this month")
			await scrollTo(app, review, { middle: 0.6 })
			await t.ring("review", review)
		},
	},
	{
		name: "insights",
		chapter: "insights",
		beats: ["metrics", "scope", "forecast", "category", "calendar"],
		setup: t => go(t, "/?month=October&year=2026"),
		async play(t) {
			const app = t.app
			await t.at("metrics", "what came in")
			const metrics = app.getByText(/income/i).first().locator("xpath=ancestor::*[contains(@class,'grid')][1]")
			await t.focus(metrics, { zoom: 1.4 })
			await t.ring("metrics", metrics)
			await t.at("scope", "Choose a Monthly Budget")
			await t.unring()
			await t.wide()
			const scope = app.getByLabel("Spending scope")
			await t.ring("scope", scope)
			await glide(t.page, scope)
			await t.at("scope", "Total")
			await t.unring()
			await t.at("forecast", "spending chart")
			const forecast = app.locator("[data-slot=card]").filter({ has: app.locator("svg") }).first()
			await scrollTo(app, forecast, { middle: 0.45 })
			await t.ring("forecast", forecast)
			await glide(t.page, forecast, { dx: 0.6 })
			await t.at("category", "Categories this month")
			await t.unring()
			const categories = card(app, /^Categories this month/)
			await scrollTo(app, categories, { middle: 0.45 })
			await t.ring("categories", categories)
			await t.at("category", "Biggest changes")
			await t.unring()
			const changes = card(app, /^Biggest changes/)
			await scrollTo(app, changes, { middle: 0.45 })
			await t.ring("changes", changes)
			await t.at("calendar", "calendar")
			await t.unring()
			const calendar = card(app, /^Spending calendar/)
			await scrollTo(app, calendar, { middle: 0.45 })
			await t.focus(calendar, { zoom: 1.4 })
			await t.at("calendar", "Pick a day")
			await press(t.page, calendar.getByRole("button", { name: /12/ }).first())
		},
	},
	{
		name: "budgets",
		chapter: "budgets",
		beats: ["create", "attach", "own"],
		setup: t => go(t, "/budgets"),
		async play(t) {
			const app = t.app
			await press(t.page, button(app, /New Budget/))
			const form = dialog(app)
			await form.locator("#name").waitFor()
			await t.focus(form, { zoom: 1.4 })
			await t.at("create", "name")
			await press(t.page, form.locator("#name"))
			await type(t.page, "Bali trip")
			await t.at("create", "amount")
			await retype(t.page, form.locator("#amount"), "1200")
			await t.at("create", "dates")
			await press(t.page, form.locator("#budget_create_date_range"))
			await press(t.page, app.getByRole("button", { name: /October 28(th)?, 2026/ }).first())
			const november = app.getByRole("button", { name: /November 4(th)?, 2026/ }).first()
			if (!(await november.isVisible().catch(() => false)))
				await press(t.page, app.getByRole("button", { name: /next month/i }).first())
			await press(t.page, app.getByRole("button", { name: /November 4(th)?, 2026/ }).first())
			await press(t.page, app.getByRole("button", { name: "Apply", exact: true }))
			const automatic = form.getByText("Automatic attach").first().locator("xpath=ancestor::*[@data-slot='field'][1]")
			await t.at("attach", "Automatic attach")
			await t.ring("automatic", automatic)
			await t.at("attach", "turn it off")
			await press(t.page, automatic.getByRole("checkbox").first())
			await t.unring()
			await press(t.page, button(form, "Create budget"))
			await closed(t)
			await t.wide()
			await t.at("own", "small dashboard")
			await press(t.page, app.getByText("Bali trip").first())
			await app.getByRole("heading", { name: "Bali trip" }).first().waitFor()
		},
	},
	{
		name: "data",
		chapter: "sync",
		beats: ["file", "drive"],
		setup: t => go(t, "/sync"),
		async play(t) {
			const app = t.app
			const download = button(app, /Download backup/)
			await t.at("file", "Download it")
			await t.focus(download.locator("xpath=ancestor::*[@data-slot='card'][1]"), { zoom: 1.4 })
			await t.ring("download", download)
			await glide(t.page, download)
			await t.at("file", "restore it")
			await t.unring()
			await t.ring("restore", app.getByText("Restore from a backup file").first())
			await t.at("drive", "Google Drive")
			await t.unring()
			await t.wide()
			const connect = button(app, /Connect Google Drive/)
			await t.ring("connect", connect)
			await glide(t.page, connect)
		},
	},
	{
		name: "help",
		chapter: "routine",
		beats: ["help"],
		setup: t => go(t, "/allocator"),
		async play(t) {
			const app = t.app
			const help = app.getByRole("button", { name: "Help" }).first()
			await t.at("help", "Help")
			await t.ring("help", help)
			await press(t.page, help)
			await t.unring()
			await t.at("help", "Every chapter")
			await t.ring("panel", dialog(app))
		},
	},
]
