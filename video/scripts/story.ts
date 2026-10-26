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
import type { Frame } from "@playwright/test"
import { press, type Take } from "./director"

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

const card = (frame: Frame, title: string) =>
	frame.getByText(title, { exact: true }).locator("xpath=ancestor::*[@data-slot='card'][1]")

// ─── The story ────────────────────────────────────────────────────────────────────────────

export const story: TakeScript[] = [
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
			await t.at("result", "Import")
			await t.ring("submit", submit)
			await press(t.page, submit)
			await t.unring("submit")
			const result = app.getByText(/new statements? imported/).first()
			await result.waitFor()
			await t.wide()
			await t.at("result", "how many")
			await t.ring("result", result.locator("xpath=ancestor::*[contains(@class,'rounded-xl')][1]"))
			await t.at("next", "Allocator")
			await t.unring("result")
			const allocate = app.getByRole("link", { name: /Allocate them/ })
			await t.ring("allocate", allocate)
			await press(t.page, allocate)
			await t.unring()
		},
	},
]
