import type { Locator, Page } from "@playwright/test"
import { expectPointerCursor } from "../support/assertions"
import { IDS, learnedCoffee, statementRules } from "../support/data"
import {
	account,
	budget,
	chooseCategory,
	longText,
	openEditor,
	pending,
	record,
	select,
} from "../support/editors"
import { expect, seedWorkspace, test } from "../support/fixtures"
import {
	expectPopupEntrance,
	expectReducedRowMovement,
	sampleVisibleRowAnimations,
} from "../support/motion"

// Each opening is its own step in the shared entrance test below: a motion
// failure aborts later openings fail-fast, so entrance regressions surface
// one editor at a time in step order.
const editors = [
	{
		name: "Account editor",
		route: "/accounts",
		trigger: `Rename ${account.name}`,
		title: "Edit Account",
		field: "Name",
		value: account.name,
	},
	{
		name: "Budget creator",
		route: "/budgets",
		trigger: "New Budget",
		title: "Create Budget",
		field: "Name",
		value: "",
	},
	{
		name: "Budget editor",
		route: `/budgets/${budget.id}`,
		trigger: "Edit Budget",
		title: "Edit Budget",
		field: "Name",
		value: budget.name,
	},
	{
		name: "Category creator",
		route: "/categories",
		trigger: "Create Category",
		title: "Create Category",
		field: "Name",
		value: "",
	},
	{
		name: "Category editor",
		route: "/categories",
		trigger: "Edit Groceries",
		title: "Edit Category",
		field: "Name",
		value: "Groceries",
	},
	{
		name: "Monthly Budget creator",
		route: "/?month=October&year=2026",
		trigger: "New",
		title: "Create monthly budget",
		field: "Name",
		value: "",
	},
	{
		name: "Monthly Budget editor",
		route: "/?month=October&year=2026",
		trigger: "Edit Daily",
		title: "Edit Daily",
		field: "Name",
		value: "Daily",
	},
	{
		name: "Pending Statement creator",
		route: "/statements",
		trigger: "Create Pending Statement",
		title: "Create Pending Statement",
		field: "Description",
		value: "",
	},
	{
		name: "Pending Statement editor",
		route: `/statements/${pending.id}`,
		trigger: "Edit Pending Statement",
		title: "Edit Pending Statement",
		field: "Description",
		value: pending.description,
	},
	{
		name: "Record creator",
		route: "/records",
		trigger: "Create Pending Record",
		title: "Create New Record",
		field: "Title",
		value: "",
	},
	{
		name: "Record editor",
		route: `/records/${record.id}`,
		trigger: "Edit Record",
		title: "Edit Record",
		field: "Title",
		value: record.title,
	},
	{
		name: "Statement rule creator",
		route: "/statement-rules",
		trigger: "New rule",
		title: "New rule",
		field: "Name",
		value: "",
	},
	{
		name: "Statement rule editor",
		route: "/statement-rules",
		trigger: "Edit Starbucks coffee",
		title: "Edit rule",
		field: "Name",
		value: "Starbucks coffee",
	},
]

async function sampleWarningCollapse(page: Page, dialog: Locator) {
	await expect(
		dialog.locator("div.overflow-hidden").filter({ hasText: "Amount does not match" }).first(),
	).toHaveCSS("opacity", "1")
	const recorder = await page.evaluateHandle(() => ({
		done: new Promise<{ opacity: number; height: number }[]>(resolve => {
			const frames: { opacity: number; height: number }[] = []
			let count = 0
			const tick = () => {
				const target = [
					...document.querySelectorAll(
						'[data-slot="dialog-content"] div.overflow-hidden',
					),
				].find(element => element.textContent?.includes("Amount does not match"))
				frames.push(
					target
						? {
								opacity: Number(getComputedStyle(target).opacity),
								height: target.getBoundingClientRect().height,
							}
						: { opacity: 0, height: 0 },
				)
				if (++count < 24) requestAnimationFrame(tick)
				else resolve(frames)
			}
			tick()
		}),
	}))
	await dialog.getByLabel("Amount", { exact: true }).fill("0")
	try {
		return await recorder.evaluate(state => state.done)
	} finally {
		await recorder.dispose()
	}
}

test("editor popups: every create and update dialog enters as a whole", {
	tag: ["@reduced-motion"],
}, async ({ page, workspace }) => {
	test.setTimeout(150_000)
	void workspace
	for (const editor of editors) {
		// The rule dialogs need seeded rules; earlier steps run rule-free so
		// late rule suggestions cannot disturb their whole-popup invariants.
		if (editor.name === "Statement rule creator")
			await seedWorkspace(page, "populated", { statement_rules: statementRules() })
		await test.step(`${editor.name}: popup enters as a whole`, async () => {
			void workspace
			await page.goto(editor.route)
			const trigger = page.getByRole("button", { name: editor.trigger, exact: true })
			await expectPointerCursor(trigger)
			const children = await sampleVisibleRowAnimations(
				page,
				'[data-slot="dialog-content"] [data-slot="field"], [data-slot="dialog-content"] div.overflow-hidden',
				() =>
					expectPopupEntrance(
						page,
						() => trigger.click(),
						// The rule preview lists matches from a live query, so it fills in after opening.
						editor.name === "Statement rule editor"
							? '[data-slot="dialog-content"] aside ul'
							: undefined,
					),
			)
			for (const child of children) {
				expect(
					Math.min(...child.frames.map(frame => frame.opacity)),
					`${child.text}: initial fields must not separately fade`,
				).toBeGreaterThan(0.99)
			}
		})
	}
})

test("Monthly Budget editor: inherited amount reveals smoothly after override action", {
	tag: ["@reduced-motion"],
}, async ({ page, workspace }) => {
	void workspace
	const dialog = await openEditor(page, "/?month=October&year=2026", "Edit Daily", "Edit Daily")
	// The amount section mounts after the amount-source live query resolves.
	await expect(dialog.getByText("Amount for October 2026", { exact: true })).toBeVisible()
	await select(page, dialog, "Amount rule", "Default")
	await expect(dialog.getByLabel("Monthly amount", { exact: true })).toHaveCount(0)
	const samples = await sampleVisibleRowAnimations(
		page,
		'[data-slot="dialog-content"] div.overflow-hidden:has(#monthly-budget-amount)',
		() => select(page, dialog, "Amount rule", "Override one month"),
	)
	await expect(dialog.getByLabel("Monthly amount", { exact: true })).toBeVisible()
	expect(samples.length).toBe(1)
	const frames = samples[0]?.frames ?? []
	expect(
		frames.length,
		"Conditional amount wrapper is sampled over multiple frames",
	).toBeGreaterThan(2)
	if (!(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches))) {
		expect(
			Math.min(...frames.map(frame => frame.opacity)),
			"Newly revealed amount fades in after action",
		).toBeLessThan(0.95)
		expect(frames.at(-1)?.opacity).toBeGreaterThan(0.99)
	}
})

test("Record creator: pending warning reveals and collapses smoothly", {
	tag: ["@reduced-motion"],
}, async ({ page, workspace }) => {
	test.setTimeout(90_000)
	void workspace
	for (const amount of ["-12.34", "0"]) {
		await test.step(`Record creator: pending warning reveals and collapses smoothly for amount ${amount}`, async () => {
			void workspace
			const text = `${longText}(${amount})`
			const dialog = await openEditor(
				page,
				"/records",
				"Create Pending Record",
				"Create New Record",
			)
			await dialog.getByLabel("Title", { exact: true }).fill(text)
			await dialog.getByLabel("Description", { exact: true }).fill(longText)
			await dialog.getByLabel("Amount", { exact: true }).fill(amount)
			// A fresh creator defaults to no date; typing a time stamps today at that time.
			await dialog.locator("#datetime-time").fill("12:00")
			await chooseCategory(page, dialog)
			await expect(dialog.getByLabel("Treatment", { exact: true })).toContainText(
				"Category default · Spending",
			)
			await expect(dialog.getByLabel("Monthly budget", { exact: true })).toContainText(
				"Category default · Daily",
			)
			// The pending warning tracks the amount/allocation mismatch, not just mount state.
			const mismatch = dialog.getByText("Amount does not match the sum of Allocation Amounts")
			const expectWarningReveal = async (value: string) => {
				const samples = await sampleVisibleRowAnimations(
					page,
					'[data-slot="dialog-content"] div.overflow-hidden',
					() => dialog.getByLabel("Amount", { exact: true }).fill(value),
				)
				const warning = samples.find(sample =>
					sample.text.includes("Amount does not match"),
				)
				expect(warning, "Conditional warning wrapper is sampled").toBeDefined()
				const frames = warning?.frames ?? []
				expect(
					frames.length,
					"Conditional warning is sampled over multiple frames",
				).toBeGreaterThan(2)
				if (
					!(await page.evaluate(
						() => matchMedia("(prefers-reduced-motion: reduce)").matches,
					))
				) {
					expect(
						Math.min(...frames.map(frame => frame.opacity)),
						"Newly revealed warning fades in after action",
					).toBeLessThan(0.95)
					expect(frames.at(-1)?.opacity).toBeGreaterThan(0.99)
				}
			}
			const expectWarningHide = async () => {
				const frames = await sampleWarningCollapse(page, dialog)
				await expect(mismatch).toHaveCount(0)
				if (
					!(await page.evaluate(
						() => matchMedia("(prefers-reduced-motion: reduce)").matches,
					))
				) {
					expect(
						frames.length,
						"Collapse is sampled over multiple frames",
					).toBeGreaterThan(2)
					const first = frames[0]
					const last = frames.at(-1)
					expect(first?.opacity ?? Number.NaN).toBeGreaterThan(0.5)
					expect(
						(last?.opacity ?? 1) < (first?.opacity ?? 0) ||
							(last?.height ?? 0) < (first?.height ?? 0),
						"Collapsing warning shrinks instead of replaying an entrance",
					).toBe(true)
				}
			}
			if (amount === "0") {
				await expect(mismatch).toHaveCount(0)
				await expectWarningReveal("-12.34")
				await expect(mismatch).toBeVisible()
				await expectWarningHide()
			} else {
				await expect(mismatch).toBeVisible()
				await expectWarningHide()
				await expectWarningReveal(amount)
			}
		})
	}
})

test("Record creator: learned chips and late autofill notes rise in after the creator opens", {
	tag: ["@reduced-motion"],
}, async ({ page }) => {
	await seedWorkspace(page, "populated", {
		...learnedCoffee(),
		statement_rules: statementRules(),
	})
	// A tall viewport fits the whole creator, so every late chip and note
	// occupies the viewport while it enters.
	const size = page.viewportSize() ?? { width: 1440, height: 900 }
	await page.setViewportSize({ width: size.width, height: 1400 })
	await page.goto("/allocator")
	const box = page.getByRole("checkbox", {
		name: `Select statement ${IDS.statements.unallocated[2]}`,
		exact: true,
	})
	await expect(box).toBeVisible()
	await box.click()
	// Warm the creator once so route compile and live queries settle; the
	// sampled second opening then reveals chips promptly even under load.
	await page.getByRole("button", { name: "Create Record" }).click()
	const warm = page.getByRole("dialog", { name: "Create New Record" })
	await expect(warm).toBeVisible()
	await expect(warm.getByRole("button", { name: "Raffles Place", exact: true })).toHaveCount(1)
	await warm.getByRole("button", { name: "Close", exact: true }).click()
	await expect(warm).toHaveCount(0)
	const samples = await sampleVisibleRowAnimations(
		page,
		'[aria-label="Suggestions from past Records"] button, #title-autopopulated, #category_id-autopopulated, #datetime-autopopulated',
		() => page.getByRole("button", { name: "Create Record" }).click(),
	)
	const present = samples.filter(sample => sample.text.includes("copied from the statement"))
	const late = samples.filter(sample => !sample.text.includes("copied from the statement"))
	expect(
		samples.length,
		"chips, late autofill notes and the open-time datetime note are all sampled",
	).toBeGreaterThanOrEqual(6)
	expect(late.length, "chips and late autofill notes animate").toBeGreaterThanOrEqual(5)
	expect(present.length, "the datetime note is present at open").toBe(1)
	if (await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)) {
		expectReducedRowMovement(samples, 6)
	} else {
		for (const sample of late) {
			const frames = sample.frames
			expect(
				Math.min(...frames.map(frame => frame.opacity)),
				`${sample.text}: late content fades in`,
			).toBeLessThan(1)
			expect(
				frames.at(-1)?.opacity,
				`${sample.text}: late content settles visible`,
			).toBeGreaterThan(0.99)
			expect(
				frames.some(frame => frame.transform !== "none" || frame.translate !== "none"),
				`${sample.text}: late content rises with a translate on some frame`,
			).toBe(true)
		}
	}
	for (const sample of present) {
		expect(
			Math.min(...sample.frames.map(frame => frame.opacity)),
			`${sample.text}: the open-time note does not fade independently`,
		).toBe(1)
		expect(
			new Set(
				sample.frames.map(
					frame => `${frame.transform}|${frame.translate}|${frame.scale}|${frame.rotate}`,
				),
			).size,
			`${sample.text}: the open-time note does not move independently`,
		).toBe(1)
	}
	await test.info().attach("rule-suggestion-frames", {
		body: JSON.stringify(samples),
		contentType: "application/json",
	})
})
