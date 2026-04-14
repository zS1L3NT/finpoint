export const formatCurrency = (amount: number) => {
	if (amount < 0) {
		return `-$${Math.abs(amount).toFixed(2)}`
	} else {
		return `$${amount.toFixed(2)}`
	}
}
