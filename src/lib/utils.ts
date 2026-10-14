import { type ClassValue, clsx } from "clsx"
import { DateTime } from "luxon"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const round2 = (number: number) => {
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

export const pluralize = (count: number, noun: string) =>
	`${count} ${noun}${count === 1 ? "" : "s"}`

export const classForCurrency = (amount: number) => {
	return amount < 0 ? "text-destructive" : amount > 0 ? "text-creative" : "text-foreground"
}

// Readable ink over a user-chosen hex colour: dark ink on light colours, white on dark.
export const inkOn = (hex: string) => {
	const channel = (i: number) => parseInt(hex.replace("#", "").slice(i, i + 2), 16) / 255
	const linear = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
	const luminance =
		0.2126 * linear(channel(0)) + 0.7152 * linear(channel(2)) + 0.0722 * linear(channel(4))
	return luminance > 0.179 ? "text-zinc-950" : "text-white"
}
