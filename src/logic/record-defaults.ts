import { DateTime } from "luxon"
import { parseDatetime } from "@/lib/utils"
import type { Statement } from "@/types"

export function inferRecordDatetime(statements: Pick<Statement, "datetime" | "description">[]) {
	const dates = statements.flatMap(statement => {
		const statementDate = parseDatetime(statement.datetime)
		if (!statementDate.isValid) return []

		const describedDates = [
			...statement.description.matchAll(
				/\b(?:\d{2}(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)|\d{2}\/\d{2}\/(?:\d{4}|\d{2}))\b/gi,
			),
		].flatMap(([match]) => {
			const numeric = match.includes("/")
			const [day = 0, month = 0, year = 0] = match.split("/").map(Number)
			let date = numeric
				? DateTime.fromObject({ day, month, year: match.length === 8 ? 2000 + year : year })
				: DateTime.fromFormat(`${statementDate.year}-${match}`, "yyyy-ddMMM", {
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
			return date.isValid ? [date.startOf("day")] : []
		})
		return describedDates.length ? describedDates : [statementDate]
	})
	const earliestDate = dates.sort((a, b) => a.toMillis() - b.toMillis())[0]

	return earliestDate ? earliestDate.toFormat("yyyy-MM-dd'T'HH:mm") : ""
}
