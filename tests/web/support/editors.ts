import { expect, type Locator, type Page } from "@playwright/test"
import { expectVisibleBackdrop } from "./assertions"
import { getScenario, IDS } from "./data"

const data = getScenario("populated").tables
function fixtureRow<T extends { id: string }>(rows: T[], id: string): T {
	const row = rows.find(row => row.id === id)
	if (!row) throw new Error(`Missing editor fixture ${id}`)
	return row
}

export const account = fixtureRow(data.accounts, IDS.accounts.dbs)
export const budget = fixtureRow(data.budgets, IDS.budgets.manual)
export const record = fixtureRow(data.records, IDS.records.nulls)
export const pending = fixtureRow(data.statements, IDS.statements.pending)
export const kept = fixtureRow(data.statements, IDS.statements.duplicatePair[0])
export const deleted = fixtureRow(data.statements, IDS.statements.duplicatePair[1])
export const imported = fixtureRow(data.statements, "t1-s-free-2")
export const longText = "Editor café 日本語 — ".repeat(12)

export async function openEditor(page: Page, route: string, trigger: string, title: string) {
	await page.goto(route)
	await page.getByRole("button", { name: trigger, exact: true }).click()
	const dialog = page.getByRole("dialog", { name: title, exact: true })
	await expect(dialog).toBeVisible()
	await expectVisibleBackdrop(page)
	return dialog
}

export async function select(page: Page, dialog: Locator, label: string, option: string) {
	// Centre the trigger: edge-aligned auto-scrolls fight sticky dialog chrome.
	// No Escape here: with no popup open it would close the dialog under test.
	const trigger = dialog.getByLabel(label, { exact: true })
	await trigger.evaluate(element => element.scrollIntoView({ block: "center" }))
	await trigger.click()
	const choice = page.getByRole("option", { name: option, exact: true })
	await expect(choice).toBeVisible()
	await choice.click()
}

export async function chooseCategory(page: Page, dialog: Locator, name = "Groceries") {
	await dialog.getByLabel("Category", { exact: true }).fill(name)
	await page.getByRole("option", { name, exact: true }).click()
}
