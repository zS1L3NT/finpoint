import { type ClassValue, clsx } from "clsx"
import { DateTime } from "luxon"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const round2dp = (number: number) => {
	return Math.round(number * 100) / 100
}

export const currencyClass = (amount: number) => {
	return cn(
		"font-medium",
		amount < 0 ? "text-red-500" : amount > 0 ? "text-green-600" : "text-foreground",
	)
}

export const toCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-SG", {
		style: "currency",
		currency: "SGD",
	}).format(amount)
}

export const toDate = (date: string) => {
	return DateTime.fromFormat(date, "yyyy-MM-dd").toFormat("d MMM y")
}

export const toDatetime = (datetime: string) => {
	return DateTime.fromFormat(datetime, "yyyy-MM-dd HH:mm")
		.toFormat("d MMM y, h:mm a")
		.replace("12:00 AM", "-")
}

export const withMethod = (formData: FormData, method: "PUT" | "PATCH" | "DELETE") => {
	formData.set("_method", method)
	return formData
}
