import { expect, test } from "@playwright/test"
import {
	expectPopupEntrance,
	expectReducedRowMovement,
	expectVisibleRowCascade,
	sampleVisibleRowAnimations,
} from "./support/assertions"

test.use({ reducedMotion: "no-preference" })

for (const moving of [false, true]) {
	test(`assertion.reduced ${moving ? "rejects animated" : "accepts immediate"} positional changes while retaining fades`, async ({
		page,
	}) => {
		await page.setContent("<button>Show</button>")
		await page.evaluate(moving => {
			document.querySelector("button")?.addEventListener("click", () => {
				const row = document.createElement("div")
				row.dataset.probe = "reduced"
				row.textContent = "Data row"
				row.style.transform = "translateY(10px)"
				row.style.opacity = "0"
				document.body.append(row)
				if (moving)
					row.animate(
						[
							{ transform: "translateY(10px)", opacity: 0 },
							{ transform: "none", opacity: 1 },
						],
						{ duration: 300, easing: "steps(1, end)", fill: "forwards" },
					)
				else
					requestAnimationFrame(() => {
						row.style.transform = "none"
						row.style.opacity = "1"
						row.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 })
					})
			})
		}, moving)
		const samples = await sampleVisibleRowAnimations(page, '[data-probe="reduced"]', () =>
			page.getByRole("button", { name: "Show" }).click(),
		)
		if (moving) expect(() => expectReducedRowMovement(samples)).toThrow(/positional animation/)
		else expectReducedRowMovement(samples)
	})
}

// Fault injection verifies the assertions themselves; product suites use real components.
for (const fault of [
	"none",
	"full viewport",
	"flash",
	"initial flash",
	"child rotation",
	"child height",
	"late child",
	"slow child",
	"changing height",
	"overflow",
	"transparent ancestor",
	"behind page",
] as const) {
	test(`assertion.popup ${fault === "none" || fault === "full viewport" ? "accepts" : "rejects"} ${fault}`, async ({
		page,
	}) => {
		await page.setContent(`<style>
@keyframes enter { from { opacity: 0 } to { opacity: 1 } }
@keyframes rotate { from { rotate: 20deg } to { rotate: 0deg } }
@keyframes height { from { height: 250px } to { height: 200px } }
@keyframes overflow { from { height: 500px } to { height: 1px } }
[data-overflow]::after { content:''; position:absolute; top:0; width:1px; animation:overflow 250ms linear; }
[role=dialog] { position:fixed; top:100px; left:20px; width:300px; height:200px; background:white; animation:enter 250ms linear; overflow:auto; }
[data-slot=dialog-overlay] { position:fixed; inset:0; background:rgba(0,0,0,.5); }
</style>`)
		const run = () =>
			expectPopupEntrance(page, () =>
				page.evaluate(fault => {
					const backdrop = document.createElement("div")
					backdrop.dataset.slot = "dialog-overlay"
					document.body.append(backdrop)
					const popup = document.createElement("div")
					popup.setAttribute("role", "dialog")
					popup.innerHTML = "<p>Initial content</p>"
					document.body.append(popup)
					if (fault === "full viewport")
						popup.style.cssText = "top:0;left:0;width:100vw;height:100vh"
					if (fault === "flash") popup.style.animation = "none"
					if (fault === "initial flash") {
						popup.style.animation = "none"
						setTimeout(() => {
							popup.style.animation = "enter 250ms linear"
						}, 70)
					}
					if (fault === "child height")
						(popup.firstChild as HTMLElement).style.animation = "height 250ms linear"
					if (fault === "transparent ancestor") {
						const parent = document.createElement("div")
						parent.style.opacity = "0"
						document.body.append(parent)
						parent.append(backdrop)
					}
					if (fault === "behind page") {
						const cover = document.createElement("div")
						cover.style.cssText = "position:fixed;inset:0;background:white;z-index:0"
						document.body.prepend(cover)
						backdrop.style.zIndex = "-1"
						popup.style.zIndex = "5"
					}
					if (fault === "child rotation")
						(popup.firstChild as HTMLElement).style.animation = "rotate 250ms linear"
					if (fault === "late child" || fault === "slow child")
						setTimeout(
							() => {
								const child = document.createElement("p")
								child.textContent = "Late content"
								popup.append(child)
							},
							fault === "slow child" ? 750 : 150,
						)
					if (fault === "changing height")
						popup.style.animation = "enter 250ms linear, height 250ms linear"
					if (fault === "overflow") popup.dataset.overflow = ""
				}, fault),
			)
		if (fault === "none" || fault === "full viewport") await run()
		else
			await expect(run()).rejects.toThrow(
				/whole popup must fade|must not flash|independently transform|initial child layout|already be mounted|remain stable|transient vertical popup overflow|Backdrop must visibly dim/,
			)
	})
}

for (const fault of ["none", "cutoff", "late batch", "reverse", "flash"] as const) {
	test(`assertion.cascade rejects ${fault}`, async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1440 })
		await page.setContent("<main></main>")
		const samples = await sampleVisibleRowAnimations(page, "main > div", () =>
			page.evaluate(fault => {
				for (let index = 0; index < 20; index++) {
					const row = document.createElement("div")
					row.textContent = `Row ${index}`
					row.style.height = "40px"
					const main = document.querySelector("main")
					if (!main) throw new Error("Probe surface missing")
					main.append(row)
					if (fault === "cutoff" && index >= 12) continue
					const delay =
						fault === "late batch" && index >= 12
							? 264
							: fault === "reverse"
								? (19 - index) * 22
								: index * 22
					const enter = () =>
						row.animate([{ opacity: 0 }, { opacity: 1 }], {
							duration: 220,
							delay,
							fill: "both",
						})
					if (fault === "flash") setTimeout(enter, 70)
					else enter()
				}
			}, fault),
		)
		expect(samples).toHaveLength(20)
		if (fault === "none") expectVisibleRowCascade(samples, 20)
		else
			expect(() => expectVisibleRowCascade(samples, 20)).toThrow(
				/entrance opacity|must not flash|second half also cascades|beyond twelve|visible item order/,
			)
	})
}

for (const ownsBackdrop of [false, true])
	test(`assertion.popup ${ownsBackdrop ? "accepts" : "rejects"} a stacked popup with ${ownsBackdrop ? "its own" : "only the previous"} backdrop`, async ({
		page,
	}) => {
		await page.setContent(`<style>
@keyframes enter { from { opacity: 0 } to { opacity: 1 } }
[role=dialog] { position:fixed; top:100px; left:20px; width:300px; height:200px; background:white; animation:enter 250ms linear; overflow:auto; }
[data-slot=dialog-overlay] { position:fixed; inset:0; background:rgba(0,0,0,.5); }
</style>
<div data-slot="dialog-overlay"></div>
<div role="dialog" id="old"><p>Old sheet</p></div>`)
		const run = () =>
			expectPopupEntrance(page, () =>
				page.evaluate(ownsBackdrop => {
					if (ownsBackdrop) {
						const backdrop = document.createElement("div")
						backdrop.dataset.slot = "dialog-overlay"
						document.body.append(backdrop)
					}
					const popup = document.createElement("div")
					popup.setAttribute("role", "dialog")
					popup.innerHTML = "<p>Initial content</p>"
					document.body.append(popup)
					setTimeout(() => document.getElementById("old")?.remove(), 50)
				}, ownsBackdrop),
			)
		if (ownsBackdrop) await run()
		else await expect(run()).rejects.toThrow(/own backdrop/)
	})

for (const count of [13, 15] as const) {
	test(`assertion.cascade rejects simultaneous tail with ${count} items`, async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1440 })
		await page.setContent("<main></main>")
		const samples = await sampleVisibleRowAnimations(page, "main > div", () =>
			page.evaluate(count => {
				for (let index = 0; index < count; index++) {
					const row = document.createElement("div")
					row.textContent = `Row ${index}`
					row.style.height = "40px"
					document.querySelector("main")?.append(row)
					const delay = index < 12 ? index * 22 : 242
					row.animate([{ opacity: 0 }, { opacity: 1 }], {
						duration: 220,
						delay,
						fill: "both",
					})
				}
			}, count),
		)
		expect(samples).toHaveLength(count)
		expect(() => expectVisibleRowCascade(samples, count)).toThrow(
			/beyond twelve|visible item order/,
		)
	})

	test(`assertion.cascade accepts bounded compressed stagger with ${count} items`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1920, height: 1440 })
		await page.setContent("<main></main>")
		const samples = await sampleVisibleRowAnimations(page, "main > div", () =>
			page.evaluate(count => {
				for (let index = 0; index < count; index++) {
					const row = document.createElement("div")
					row.textContent = `Row ${index}`
					row.style.height = "40px"
					document.querySelector("main")?.append(row)
					const delay = (450 * index) / (index + 15)
					row.animate([{ opacity: 0 }, { opacity: 1 }], {
						duration: 220,
						delay,
						fill: "both",
					})
				}
			}, count),
		)
		expect(samples).toHaveLength(count)
		expectVisibleRowCascade(samples, count)
	})

	test(`assertion.cascade accepts frame-tied fallback with ${count} items`, async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1440 })
		await page.setContent("<main></main>")
		const samples = await sampleVisibleRowAnimations(page, "main > div", () =>
			page.evaluate(count => {
				const main = document.querySelector("main")
				if (!main) throw new Error("Probe surface missing")
				const rows: HTMLDivElement[] = []
				for (let index = 0; index < count; index++) {
					const row = document.createElement("div")
					row.textContent = `Row ${index}`
					row.style.height = "40px"
					row.style.opacity = "0"
					main.append(row)
					rows.push(row)
				}
				const start = performance.now()
				const tick = (now: number) => {
					rows.forEach((row, index) => {
						const delay = 60 + (450 * index) / (index + 15)
						row.style.opacity = String(
							Math.max(0, Math.min(1, (now - start - delay) / 220)),
						)
					})
					if (now - start < 800) requestAnimationFrame(tick)
				}
				requestAnimationFrame(tick)
			}, count),
		)
		expect(samples).toHaveLength(count)
		expectVisibleRowCascade(samples, count)
	})
}

for (const count of [13, 15] as const) {
	test(`assertion.cascade fallback rejects a simultaneous ${count}-item tail`, async ({
		page,
	}) => {
		await page.setContent("<main></main>")
		await page.setViewportSize({ width: 1920, height: 1440 })
		const samples = await sampleVisibleRowAnimations(page, "main > div", () =>
			page.evaluate(count => {
				const rows = Array.from({ length: count }, (_, index) => {
					const row = document.createElement("div")
					row.textContent = `Row ${index}`
					row.style.cssText = "height:40px;opacity:0"
					document.querySelector("main")?.append(row)
					return row
				})
				const start = performance.now()
				const tick = (now: number) => {
					rows.forEach((row, index) => {
						const scheduledIndex = Math.min(index, 11)
						const delay = 60 + (450 * scheduledIndex) / (scheduledIndex + 15)
						row.style.opacity = String(
							Math.max(0, Math.min(1, (now - start - delay) / 220)),
						)
					})
					if (now - start < 800) requestAnimationFrame(tick)
				}
				requestAnimationFrame(tick)
			}, count),
		)
		expect(samples).toHaveLength(count)
		expect(() => expectVisibleRowCascade(samples, count)).toThrow(/separate rendered progress/)
	})
}

test("assertion.cascade rejects sub-millisecond native delay masquerading as a visible stagger", async ({
	page,
}) => {
	await page.setContent("<main></main>")
	const samples = await sampleVisibleRowAnimations(page, "main > div", () =>
		page.evaluate(() => {
			for (let index = 0; index < 2; index++) {
				const row = document.createElement("div")
				row.textContent = `Row ${index}`
				row.style.height = "40px"
				document.querySelector("main")?.append(row)
				row.animate([{ opacity: 0 }, { opacity: 1 }], {
					delay: 60 + index * 0.1,
					duration: 220,
					fill: "both",
				})
			}
		}),
	)
	expect(() => expectVisibleRowCascade(samples, 2)).toThrow(/visible item order/)
})

test("assertion.cascade rejects a whole scheduled list compressed into ten milliseconds", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1920, height: 1440 })
	await page.setContent("<main></main>")
	const samples = await sampleVisibleRowAnimations(page, "main > div", () =>
		page.evaluate(() => {
			for (let index = 0; index < 20; index++) {
				const row = document.createElement("div")
				row.textContent = `Row ${index}`
				row.style.height = "40px"
				document.querySelector("main")?.append(row)
				row.animate([{ opacity: 0 }, { opacity: 1 }], {
					delay: 60 + index * 0.5,
					duration: 220,
					fill: "both",
				})
			}
		}),
	)
	expect(() => expectVisibleRowCascade(samples, 20)).toThrow(/span visible cascade progress/)
})
