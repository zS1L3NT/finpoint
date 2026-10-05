import { DateTime } from "luxon"
import { classForCurrency, formatCurrency } from "@/lib/utils"

export type RowGroup<TData> = {
	key: (row: TData) => string
	header: (key: string, rows: TData[]) => React.ReactNode
}

/** Index of each group's first row → that group's key and members, in display order. */
export function groupStarts<TData>(rows: TData[], group: RowGroup<TData> | undefined) {
	const starts = new Map<number, { key: string; rows: TData[] }>()
	if (!group) return starts
	let current: { key: string; rows: TData[] } | null = null
	rows.forEach((row, index) => {
		const key = group.key(row)
		if (!current || current.key !== key) {
			current = { key, rows: [] }
			starts.set(index, current)
		}
		current.rows.push(row)
	})
	return starts
}

/** Clicks on controls inside a clickable row must not also open the row. */
export function isInteractiveTarget(target: EventTarget | null) {
	return (
		target instanceof Element &&
		!!target.closest("a, button, input, label, select, textarea, [role='checkbox']")
	)
}

/** "Today" / "Yesterday" / "Sat, 4 Oct", plus the year when it is not this year. */
export function dayLabel(day: string) {
	const date = DateTime.fromISO(day)
	if (!date.isValid) return day
	const today = DateTime.now().startOf("day")
	const diff = Math.round(today.diff(date.startOf("day"), "days").days)
	if (diff === 0) return "Today"
	if (diff === 1) return "Yesterday"
	return date.toFormat(date.year === today.year ? "ccc, d MMM" : "ccc, d MMM yyyy")
}

/** Day group: records and statements are listed newest first, so a day prefix groups them. */
export function byDay<TData extends { datetime: string; amount: number }>(): RowGroup<TData> {
	return {
		key: row => row.datetime.slice(0, 10),
		header: (key, rows) => {
			const net = rows.reduce((sum, row) => sum + row.amount, 0)
			return (
				<div className="flex items-center justify-between gap-3 text-xs">
					<span className="font-medium text-foreground">{dayLabel(key)}</span>
					<span className="tabular-nums text-muted-foreground">
						{rows.length} ·{" "}
						<span className={classForCurrency(net)}>{formatCurrency(net)}</span>
					</span>
				</div>
			)
		},
	}
}
