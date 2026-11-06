import { expect, test } from "bun:test"
import { formatChartCurrency } from "../../src/lib/chart-currency"

test("chart currency: always formats two decimal places", () => {
	for (const [value, expected] of [[748.6, "$748.60"], [-202.8, "−$202.80"], [0, "$0.00"], [1400, "$1.40k"]] as const) {
		expect(formatChartCurrency(value)).toBe(expected)
	}
})
