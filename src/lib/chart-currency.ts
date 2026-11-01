const compactAmount = new Intl.NumberFormat("en-SG", {
	notation: "compact",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

export function formatChartCurrency(value: number) {
	return `${value < 0 ? "−" : ""}$${compactAmount.format(Math.abs(value)).toLowerCase()}`
}
