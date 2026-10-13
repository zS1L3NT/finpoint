const compactAmount = new Intl.NumberFormat("en-SG", {
	notation: "compact",
	maximumFractionDigits: 1,
})

export function formatChartCurrency(value: number) {
	return `${value < 0 ? "−" : ""}$${compactAmount.format(Math.abs(value)).toLowerCase()}`
}
