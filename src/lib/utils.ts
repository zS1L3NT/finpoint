import { type ClassValue, clsx } from "clsx"
import { DateTime } from "luxon"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const round2dp = (number: number) => {
	return Math.round(number * 100) / 100
}

export const parseDatetime = (value: string) => {
	return DateTime.fromFormat(value, "yyyy-MM-dd HH:mm")
}

export const parseDate = (value: string) => {
	return DateTime.fromFormat(value, "yyyy-MM-dd")
}

export const formatDatetime = (value: string) => {
	const datetime = parseDatetime(value)
	if (datetime.isValid) {
		return datetime.toFormat("d MMM y, h:mm a")?.replace("12:00 AM", "-")
	} else {
		return "<invalid datetime>"
	}
}

// Constructing an Intl.NumberFormat is far costlier than formatting with one;
// tables and chart axes call this thousands of times per render.
const currencyFormat = new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD" })

export const formatCurrency = (amount: number) => {
	return currencyFormat.format(amount)
}

export const classForCurrency = (amount: number) => {
	return amount < 0 ? "text-destructive" : amount > 0 ? "text-creative" : "text-foreground"
}

export const withMethod = (formData: FormData, method: "PUT" | "PATCH" | "DELETE") => {
	formData.set("_method", method)
	return formData
}
