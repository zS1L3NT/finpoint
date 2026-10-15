import { getScenario } from "./support/data"
import { expect, test } from "./support/fixtures"

test.use({ workspaceScenario: "dense" })
const pending = getScenario("dense").tables.statements.filter(statement => statement.is_pending)
const first = pending.find(statement => statement.description === "Dense pending 13")
const next = pending.find(statement => statement.description === "Dense pending 26")
if (!first || !next) throw new Error("Two distinct Pending Statements are required")

test("Pending queue typing clears a missing selection and dismisses its availability alert", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto(
		"/allocator/pending?pending_statement_id=deleted-pending-statement&candidate_query=stale&candidate_page=2",
	)
	const alert = page.getByRole("alert").filter({ hasText: "Pending Statement unavailable" })
	await expect(alert).toBeVisible()
	const search = page
		.locator('section[aria-labelledby="pending-queue-title"]')
		.getByPlaceholder("Search descriptions...")
	await search.pressSequentially("Dense pending 26", { delay: 10 })
	await expect(alert).toHaveCount(0)
	await expect(page).not.toHaveURL(/pending_statement_id=/)
	await expect(page).toHaveURL(/query=Dense\+pending\+26/)
	await page.waitForTimeout(650)
	await expect(search).toHaveValue("Dense pending 26")
	await expect(alert).toHaveCount(0)
	await expect(page).not.toHaveURL(/pending_statement_id=|candidate_query=|candidate_page=/)
	await expect(page).toHaveURL(/query=Dense\+pending\+26/)
	await expect(page.getByRole("button", { name: /^Dense pending 26\b/ })).toBeVisible()
})

test("Pending queue typing clears an orphan candidate query without discarding the queue buffer", async ({
	page,
	workspace,
}) => {
	void workspace
	await page.goto("/allocator/pending?candidate_query=stale&candidate_page=2")
	const search = page
		.locator('section[aria-labelledby="pending-queue-title"]')
		.getByPlaceholder("Search descriptions...")
	await expect(search).toBeVisible()
	const historyLength = await page.evaluate(() => history.length)
	await search.pressSequentially("Dense pending 26", { delay: 10 })
	await expect(page).toHaveURL(/query=Dense\+pending\+26/)
	await page.waitForTimeout(650)
	await expect(search).toHaveValue("Dense pending 26")
	await expect(page).not.toHaveURL(/candidate_query=|candidate_page=/)
	await expect(page.getByRole("button", { name: /^Dense pending 26\b/ })).toBeVisible()
	expect((await page.evaluate(() => history.length)) - historyLength).toBeLessThanOrEqual(2)
})

test("Pending selection resets an unsettled candidate search without replaying it on the next Statement", async ({
	page,
	workspace,
	isMobile,
}) => {
	void workspace
	await page.goto(`/allocator/pending?pending_statement_id=${first.id}`)
	const candidate = page.locator('section[aria-labelledby="candidate-title"]')
	const search = candidate.getByPlaceholder("Search descriptions...")
	await expect(search).toBeVisible()
	// Record when the query was typed and when the next Statement was chosen, to prove the
	// selection changed while the 300ms search callback was still pending.
	await page.evaluate(() => {
		document.addEventListener(
			"click",
			event => {
				const target =
					event.target instanceof Element ? event.target.closest("button") : null
				// On mobile, leaving the candidate panel is the first selection change.
				const text = target?.textContent?.trim() ?? ""
				if (
					!Reflect.has(window, "__selectedAt") &&
					(text.startsWith("Dense pending 26") || text === "Back to pending Statements")
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
	if (isMobile)
		await page.getByRole("button", { name: "Back to pending Statements", exact: true }).click()
	await page.getByRole("button", { name: /^Dense pending 26\b/ }).click()
	const gap = await page.evaluate(
		() =>
			Number(Reflect.get(window, "__selectedAt")) - Number(Reflect.get(window, "__filledAt")),
	)
	expect(gap, "the selection changed before the search callback could fire").toBeLessThan(300)
	await expect(page).toHaveURL(new RegExp(`pending_statement_id=${next.id}`))
	await expect(candidate.getByText("Dense pending 26", { exact: true }).first()).toBeVisible()
	// The outgoing panel remains mounted briefly during its exit transition.
	await expect(search).toHaveCount(1)
	await expect(search).toHaveValue("")
	// Outlast both 300ms search callbacks to reject a stale query appearing later.
	await page.waitForTimeout(650)
	await expect(search).toHaveValue("")
	await expect(page).not.toHaveURL(/candidate_query=/)
})

test("Pending queue typing retains every character while clearing the old selection", async ({
	page,
	workspace,
	isMobile,
}) => {
	void workspace
	await page.goto(`/allocator/pending?pending_statement_id=${first.id}`)
	await expect(page.locator('section[aria-labelledby="candidate-title"]')).toBeVisible()
	if (isMobile)
		await page.getByRole("button", { name: "Back to pending Statements", exact: true }).click()
	const search = page
		.locator('section[aria-labelledby="pending-queue-title"]')
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
	expect((await page.evaluate(() => history.length)) - historyLength).toBeLessThanOrEqual(2)
})
