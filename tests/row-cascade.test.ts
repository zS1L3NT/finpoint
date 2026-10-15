import { describe, expect, test } from "bun:test"
import { isPureRemoval } from "@/hooks/use-row-cascade"
import { cardEnter, rowEnter } from "@/lib/motion"

describe("isPureRemoval", () => {
	test("rows only removed", () => {
		expect(isPureRemoval("a|b|c|d", "a|c")).toBe(true)
		expect(isPureRemoval("a|b|c", "")).toBe(true)
	})

	test("rows gained", () => {
		expect(isPureRemoval("a|b", "a|b|c")).toBe(false)
		expect(isPureRemoval("a|b", "a|x")).toBe(false)
		expect(isPureRemoval("", "a")).toBe(false)
	})

	test("reordered rows are not a removal", () => {
		expect(isPureRemoval("a|b|c", "c|a")).toBe(false)
		expect(isPureRemoval("a|b", "b|a")).toBe(false)
	})
})

describe("bounded row and card cascade", () => {
	for (const entrance of ["cascade", "refilter"] as const) {
		test(`${entrance} includes tall viewport rows without an index cutoff`, () => {
			let previous = -1
			for (let index = 0; index < 100; index++) {
				const motion = rowEnter(index, entrance)
				expect(motion.initial.opacity).toBe(0)
				expect(motion.animate.opacity).toBe(1)
				const delay = motion.transition.delay ?? 0
				expect(delay).toBeGreaterThan(previous)
				expect(delay + motion.transition.duration).toBeLessThan(0.75)
				previous = delay
			}
		})
	}

	test("very large lists and grids have bounded waits", () => {
		expect(rowEnter(100_000, "cascade").transition.delay).toBeLessThan(0.45)
		expect(cardEnter(100_000).transition.delay).toBeLessThan(0.45)
		expect(cardEnter(13).transition.delay).toBeGreaterThan(cardEnter(12).transition.delay)
	})
})
