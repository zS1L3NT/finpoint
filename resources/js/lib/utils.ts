import { type ClassValue, clsx } from "clsx"
import { DateTime } from "luxon"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const round2dp = (number: number) => {
	return Math.floor(number * 100) / 100
}

export const toCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-SG", {
		style: "currency",
		currency: "SGD",
	}).format(amount)
}

export const toDate = (date: string) => {
	return DateTime.fromFormat(date, "y-MM-dd").toFormat("d MMM y")
}

export const toDatetime = (datetime: string) => {
	return DateTime.fromFormat(datetime, "y-MM-dd T")
		.toFormat("d MMM y, h:mm a")
		.replace("12:00 AM", "-")
}
