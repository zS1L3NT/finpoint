import { expect, test } from "bun:test"
import { inferRecordDatetime } from "@/logic/record-defaults"

const statement = (description: string, datetime = "2026-10-18 12:30") => ({
	description,
	datetime,
})

for (const description of ["CARD 17OCT", "CARD 17oct", "CARD 17/10/26", "CARD 17/10/2026"]) {
	test(`record date is inferred from ${description}`, () => {
		expect(inferRecordDatetime([statement(description)])).toBe("2026-10-17T00:00")
	})
}

for (const description of [
	"32/10/26",
	"31/02/26",
	"29FEB",
	"117/10/26",
	"17/10/266",
	"19/10/26",
	"01/01/99",
	"CARD 17/10/25",
]) {
	test(`record date falls back for invalid or implausible description ${description}`, () => {
		expect(inferRecordDatetime([statement(description)])).toBe("2026-10-18T12:30")
	})
}

test("yearless dates roll back across new year", () => {
	expect(inferRecordDatetime([statement("CARD 31DEC", "2027-01-02 00:00")])).toBe(
		"2026-12-31T00:00",
	)
})

test("valid leap dates are accepted", () => {
	expect(inferRecordDatetime([statement("CARD 29/02/24", "2024-03-01 00:00")])).toBe(
		"2024-02-29T00:00",
	)
})

test("all date candidates are checked even after an invalid candidate", () => {
	expect(inferRecordDatetime([statement("32/10/26 17/10/26 16OCT")])).toBe("2026-10-16T00:00")
})

test("mixed selections include dates from descriptions and statements without one", () => {
	expect(
		inferRecordDatetime([statement("17/10/26"), statement("SHOP", "2026-10-15 09:00")]),
	).toBe("2026-10-15T09:00")
})

test("no statements or valid dates leave the field empty", () => {
	expect(inferRecordDatetime([])).toBe("")
	expect(inferRecordDatetime([statement("17/10/26", "invalid")])).toBe("")
})

test("year rollover does not turn an invalid leap day into 28 February", () => {
	expect(inferRecordDatetime([statement("29FEB", "2024-01-15 09:00")])).toBe("2024-01-15T09:00")
})
