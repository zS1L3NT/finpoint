import type { CellContext, ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { useMemo, useState } from "react"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { classForCurrency, cn, formatCurrency, parseDatetime } from "@/lib/utils"
import { pathRecord } from "@/routes"
import type { Allocation, Record } from "@/types"

type RecordRow = Record & { pivot?: Allocation }

type RecordTableOptions<TRecord extends RecordRow> = {
	amount?: "amount" | "allocated"
	pageName?: string
	extraActions?: (record: TRecord) => React.ReactNode
	actionWidth?: string
	onEdit?: (record: TRecord) => void | Promise<unknown>
	/** Rows sit under day headers, so only the time is shown. */
	grouped?: boolean
}

/** Money in green, money out red: the app-wide currency colours. */
export function amountTone(value: number) {
	return classForCurrency(value)
}

export function formatRowTime(datetime: string, grouped: boolean) {
	const date = parseDatetime(datetime)
	if (!date.isValid) return datetime
	const time = date.toFormat("h:mm a")
	// Midnight means "no time recorded".
	if (grouped) return time === "12:00 AM" ? "" : time
	return time === "12:00 AM" ? date.toFormat("d MMM yyyy") : date.toFormat("d MMM, h:mm a")
}

function pendingReason(record: Record) {
	if (record.allocated_amount === 0) return "No statements allocated yet"
	if (record.allocated_amount !== record.amount)
		return `${formatCurrency(record.allocated_amount)} of ${formatCurrency(record.amount)} allocated`
	if (record.pending_statement_count) return "Awaiting the imported bank statement"
	return "Pending"
}

export function PendingBadge({ record }: { record: Record }) {
	if (!record.is_pending) return null
	return (
		<Badge variant="warning" className="shrink-0" title={pendingReason(record)}>
			Pending
		</Badge>
	)
}

export function RecordAmountCell({
	record,
	value,
	showAllocated,
}: {
	record: Record
	value: number
	showAllocated: boolean
}) {
	return (
		<span className="grid justify-items-end gap-0.5 text-right">
			<span className={cn("font-medium tabular-nums", amountTone(value))}>
				{formatCurrency(value)}
			</span>
			{showAllocated && record.allocated_amount !== record.amount ? (
				<span className="hidden text-[0.6875rem] text-muted-foreground tabular-nums sm:block">
					{formatCurrency(record.allocated_amount)} allocated
				</span>
			) : null}
		</span>
	)
}

function RecordEditButton<TRecord extends RecordRow>({
	record,
	onEdit,
}: {
	record: TRecord
	onEdit: (record: TRecord) => void | Promise<unknown>
}) {
	const [busy, setBusy] = useState(false)

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			title="Edit"
			aria-label={`Edit ${record.title}`}
			aria-busy={busy}
			onClick={() => {
				if (busy) return
				setBusy(true)
				void Promise.resolve(onEdit(record)).finally(() => setBusy(false))
			}}
		>
			<IconifyIcon icon={busy ? "lucide:loader-circle" : "lucide:pencil"} />
		</Button>
	)
}

function RecordActions<TRecord extends RecordRow>({
	record,
	options,
}: {
	record: TRecord
	options: RecordTableOptions<TRecord>
}) {
	const { handlePush } = useHistory()
	const { pageName, extraActions, onEdit } = options
	return (
		<div className="flex shrink-0 items-center justify-end gap-0.5">
			{onEdit ? <RecordEditButton record={record} onEdit={onEdit} /> : null}
			{extraActions?.(record)}
			<Button variant="ghost" size="icon-sm" title="Open" asChild>
				<Link
					href={pathRecord(record.id)}
					aria-label={`Open ${record.title}`}
					onClick={pageName ? handlePush(pageName) : undefined}
				>
					<IconifyIcon icon="lucide:chevron-right" />
				</Link>
			</Button>
		</div>
	)
}

function RecordActionsCell<TRecord extends RecordRow>({
	row,
	column,
}: CellContext<TRecord, unknown>) {
	const { recordActions } = column.columnDef.meta as {
		recordActions: RecordTableOptions<TRecord>
	}
	return <RecordActions record={row.original} options={recordActions} />
}

export function useRecordColumns<TRecord extends RecordRow>({
	amount = "amount",
	pageName,
	extraActions,
	onEdit,
	grouped = false,
}: RecordTableOptions<TRecord>): ColumnDef<TRecord>[] {
	return useMemo(
		(): ColumnDef<TRecord>[] => [
			{
				header: "Record",
				cell: ({ row }) => (
					<div className="flex items-center gap-3">
						<Icon {...row.original.category} size={14} />
						<div className="min-w-0 flex-1">
							<p className="flex items-center gap-1.5">
								<span className="min-w-0 truncate font-medium">
									{row.original.title}
								</span>
								<PendingBadge record={row.original} />
							</p>
							<p className="truncate text-muted-foreground">
								{row.original.category.name}
								{row.original.subtitle ? ` · ${row.original.subtitle}` : ""}
							</p>
						</div>
					</div>
				),
			},
			{
				header: "Description",
				meta: { width: "hidden w-1/4 xl:table-cell" },
				cell: ({ row }) => (
					<p
						className="truncate text-muted-foreground"
						title={row.original.description ?? undefined}
					>
						{row.original.description}
					</p>
				),
			},
			{
				header: grouped ? "Time" : "Date",
				meta: { width: grouped ? "w-24" : "w-36" },
				cell: ({ row }) => (
					<span className="text-muted-foreground tabular-nums">
						{formatRowTime(row.original.datetime, grouped)}
					</span>
				),
			},
			{
				id: "amount",
				header: () => <span className="block text-right">Amount</span>,
				meta: { width: "w-36" },
				cell: ({ row }) => (
					<RecordAmountCell
						record={row.original}
						value={
							amount === "allocated"
								? (row.original.pivot?.amount ?? 0)
								: row.original.amount
						}
						showAllocated={amount === "amount" && row.original.is_pending}
					/>
				),
			},
			{
				id: "actions",
				meta: {
					recordActions: { pageName, extraActions, onEdit },
					width: extraActions ? "w-36" : onEdit ? "w-24" : "w-14",
				},
				cell: RecordActionsCell,
			},
		],
		[amount, pageName, extraActions, onEdit, grouped],
	)
}

export function useRecordMobileRow<TRecord extends RecordRow>({
	amount = "amount",
	pageName,
	extraActions,
	leading,
	onEdit,
	grouped = false,
}: RecordTableOptions<TRecord> & {
	leading?: (record: TRecord) => React.ReactNode
}): (row: Row<TRecord>) => React.ReactNode {
	return useMemo(
		() => (row: Row<TRecord>) => {
			const record = row.original
			const value = amount === "allocated" ? (record.pivot?.amount ?? 0) : record.amount
			const time = formatRowTime(record.datetime, grouped)

			return (
				<div className="flex min-w-0 items-center gap-3">
					{leading?.(record)}
					<Icon {...record.category} size={14} />
					<div className="min-w-0 flex-1">
						<p className="flex items-center gap-1.5">
							<span className="min-w-0 truncate font-medium">{record.title}</span>
							<PendingBadge record={record} />
						</p>
						<p className="truncate text-xs text-muted-foreground">
							{[record.category.name, record.subtitle, time]
								.filter(Boolean)
								.join(" · ")}
						</p>
					</div>
					<RecordAmountCell
						record={record}
						value={value}
						showAllocated={amount === "amount" && record.is_pending}
					/>
					<RecordActions record={record} options={{ pageName, extraActions, onEdit }} />
				</div>
			)
		},
		[amount, pageName, extraActions, leading, onEdit, grouped],
	)
}
