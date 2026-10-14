import { describe, expect, test } from "bun:test"
import { isPureRemoval } from "@/hooks/use-row-cascade"

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
