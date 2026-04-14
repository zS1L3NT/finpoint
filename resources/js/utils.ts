export const formatCurrency = (amount: number) => {
	if (amount < 0) {
		return `-$${Math.abs(amount).toFixed(2)}`
	} else {
		return `$${amount.toFixed(2)}`
	}
}

export const styleCurrency = (amount: number) => {
	if (amount < 0) {
		return { color: "rgb(var(--bs-danger-rgb))" }
	} else if (amount > 0) {
		return { color: "rgb(var(--bs-success-rgb))" }
	} else {
		return {}
	}
}