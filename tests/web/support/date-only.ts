import type { Page } from "@playwright/test"

const revisions = new WeakMap<Page, number>()

// Pin calendar time without replacing the native clocks used by CSS and rAF.
export async function setDateOnly(page: Page, time: Date | number) {
	const epoch = Number(time)
	if (!Number.isFinite(epoch)) throw new TypeError("Expected a finite date")
	const revision = (revisions.get(page) ?? 0) + 1
	revisions.set(page, revision)
	const input = { time: epoch, revision }
	await page.addInitScript(installDateOnly, input)
	await page.evaluate(installDateOnly, input)
}

// Runs in the browser. Init scripts have no ordering guarantee, so a later
// override must win even if an older default script runs after it on reload.
export function installDateOnly({ time, revision }: { time: number; revision: number }) {
	const scope = globalThis as typeof globalThis & {
		__finpointDateOnlyTestClock?: { time: number; revision: number }
	}
	const existing = scope.__finpointDateOnlyTestClock
	if (existing) {
		if (revision > existing.revision) {
			existing.time = time
			existing.revision = revision
		}
		return
	}

	const NativeDate = globalThis.Date
	const state = { time, revision }
	Object.defineProperty(scope, "__finpointDateOnlyTestClock", { value: state })
	const fixedNow = { now: () => state.time }.now
	globalThis.Date = new Proxy(NativeDate, {
		apply() {
			// Date() ignores arguments; new Date(undefined) must still be invalid.
			return Reflect.apply(NativeDate.prototype.toString, new NativeDate(state.time), [])
		},
		construct(target, args, newTarget) {
			return Reflect.construct(target, args.length === 0 ? [state.time] : args, newTarget)
		},
		get(target, key, receiver) {
			return key === "now" ? fixedNow : Reflect.get(target, key, receiver)
		},
	})
}
