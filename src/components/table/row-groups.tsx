import { DateTime } from "luxon"
import { useState } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { rowEnterCss } from "@/lib/motion"
import { classForCurrency, cn, formatCurrency } from "@/lib/utils"

export type RowGroup<TData> = {
	key: (row: TData) => string
	/** Left side of the group header, e.g. the day and how many rows it holds. */
	label: (key: string, rows: TData[]) => React.ReactNode
	/** Subtotal shown in the Amount column so it lines up with the row amounts. */
	total?: (rows: TData[]) => number
}

/**
 * Mobile lists share three columns across every row via subgrid, so a group's
 * subtotal sits exactly under the row amounts and clear of the row actions.
 * Mobile rows render as `[main, amount, actions]`.
 */
export const MOBILE_LIST_CLASS = "grid grid-cols-[minmax(0,1fr)_auto_auto]"
export const MOBILE_ROW_CLASS = "col-span-full grid grid-cols-subgrid items-center gap-x-3"

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

function GroupTotal({ value }: { value: number }) {
	return (
		<span
			className={cn("block text-right font-semibold tabular-nums", classForCurrency(value))}
		>
			{formatCurrency(value)}
		</span>
	)
}

/**
 * Desktop group header: one cell per column (keeping each column's responsive
 * visibility), the label in the first and the subtotal in the Amount column.
 */
export function GroupHeaderRow<TData>({
	group,
	groupKey,
	rows,
	columns,
	enter,
}: {
	group: RowGroup<TData>
	groupKey: string
	rows: TData[]
	columns: { id: string; className?: string }[]
	/** Entrance props shared with the group's first row, so the header never arrives alone. */
	enter?: Partial<React.ComponentProps<typeof TableRow>>
}) {
	const hasTotal = !!group.total && columns.some(column => column.id === "amount")
	if (!hasTotal) {
		return (
			<TableRow className="bg-muted/40 hover:bg-muted/40" {...enter}>
				<TableCell colSpan={columns.length} className="py-1.5">
					{group.label(groupKey, rows)}
				</TableCell>
			</TableRow>
		)
	}
	return (
		<TableRow className="bg-muted/40 hover:bg-muted/40" {...enter}>
			{columns.map((column, index) => (
				<TableCell
					key={column.id}
					className={cn("py-1.5", index === 0 && "overflow-visible", column.className)}
				>
					{index === 0 ? group.label(groupKey, rows) : null}
					{column.id === "amount" && group.total ? (
						<GroupTotal value={group.total(rows)} />
					) : null}
				</TableCell>
			))}
		</TableRow>
	)
}

/**
 * A mobile list row. Its entrance is decided once, at mount: swapping animation classes on a
 * mounted row would restart the animation, so later renders must never change it.
 */
export function MobileRow({
	index,
	cascade,
	className,
	style,
	...props
}: React.ComponentProps<"div"> & { index: number; cascade: boolean }) {
	const [enter] = useState(() => rowEnterCss(index, cascade))
	return (
		<div
			{...props}
			className={cn(MOBILE_ROW_CLASS, className, enter.className)}
			style={{ ...enter.style, ...style }}
		/>
	)
}

/** Mobile group header: same three subgrid columns as the rows beneath it. */
export function MobileGroupHeader<TData>({
	group,
	groupKey,
	rows,
	index,
	cascade,
}: {
	group: RowGroup<TData>
	groupKey: string
	rows: TData[]
	/** Position of the group's first row; headers enter together with it. */
	index: number
	cascade: boolean
}) {
	const [enter] = useState(() => rowEnterCss(index, cascade))
	return (
		<div
			className={cn(MOBILE_ROW_CLASS, "bg-muted/50 px-3 py-1.5 text-sm", enter.className)}
			style={enter.style}
		>
			<div className="min-w-0">{group.label(groupKey, rows)}</div>
			{group.total ? <GroupTotal value={group.total(rows)} /> : <span />}
			<span />
		</div>
	)
}

/**
 * Clicks on controls inside a clickable row must not also trigger the row, and
 * neither must the click that ends a text selection.
 */
export function isInteractiveTarget(target: EventTarget | null) {
	if (typeof window !== "undefined" && window.getSelection()?.toString()) return true
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
export function byDay<TData extends { datetime: string; amount: number }>(
	noun: string,
): RowGroup<TData> {
	return {
		key: row => row.datetime.slice(0, 10),
		label: (key, rows) => (
			<span className="flex items-baseline gap-2 text-xs">
				<span className="font-semibold text-foreground">{dayLabel(key)}</span>
				<span className="text-muted-foreground tabular-nums">
					{rows.length} {noun}
					{rows.length === 1 ? "" : "s"}
				</span>
			</span>
		),
		total: rows => rows.reduce((sum, row) => sum + row.amount, 0),
	}
}
