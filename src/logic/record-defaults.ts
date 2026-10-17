import { DateTime } from "luxon"
import { parseDatetime } from "@/lib/utils"
import type { Statement } from "@/types"

export function inferRecordDatetime(
	statements: Pick<Statement, "datetime" | "description" | "index">[],
) {
	const dates = statements.flatMap<{
		date: DateTime
		source: "description" | "statement"
		hasTime: boolean
	}>(statement => {
		const statementDate = parseDatetime(statement.datetime)
		if (!statementDate.isValid) return []

		const describedDates = [
			...statement.description.matchAll(
				/\b(\d{2}(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)|\d{2}\/\d{2}\/(?:\d{4}|\d{2}))(?=\b|T\d{2}:)(?:[ T]+([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?\b)?/gi,
			),
		].flatMap(([, dateText = "", hour, minute]) => {
			const numeric = dateText.includes("/")
			const [day = 0, month = 0, year = 0] = dateText.split("/").map(Number)
			let date = numeric
				? DateTime.fromObject({
						day,
						month,
						year: dateText.length === 8 ? 2000 + year : year,
					})
				: DateTime.fromFormat(`${statementDate.year}-${dateText}`, "yyyy-ddMMM", {
						locale: "en",
					})
			if (!date.isValid) return []
			// Only a date without a year needs the previous-year inference.
			if (!numeric && date > statementDate.endOf("day")) {
				date = DateTime.fromObject({
					year: date.year - 1,
					month: date.month,
					day: date.day,
				})
			}
			if (
				numeric &&
				(date > statementDate.endOf("day") ||
					date < statementDate.minus({ years: 1 }).startOf("day"))
			)
				return []
			return date.isValid
				? [
						{
							date: date.set({
								hour: Number(hour ?? 0),
								minute: Number(minute ?? 0),
							}),
							source: "description" as const,
							hasTime: hour !== undefined,
						},
					]
				: []
		})
		return describedDates.length
			? describedDates
			: [
					{
						date: statementDate,
						source: "statement" as const,
						// Indexed statements preserve date-only bank order; index zero keeps explicit times.
						hasTime: statement.index === 0,
					},
				]
	})
	const earliestDate = dates.sort((a, b) => a.date.toMillis() - b.date.toMillis())[0]

	return {
		value: earliestDate ? earliestDate.date.toFormat("yyyy-MM-dd'T'HH:mm") : "",
		source: earliestDate?.source ?? null,
		hasTime: earliestDate?.hasTime ?? false,
	}
}
