import type { CellContext, ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { useMemo } from "react"
import Icon from "@/components/icon"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import { Badge } from "@/components/ui/badge"
import { canUseMonthlyBudget, treatmentLabel } from "@/lib/analytics"
import { classForCurrency, cn, formatCurrency, parseDatetime } from "@/lib/utils"
import { pathRecord } from "@/routes"
import type { Allocation, Record } from "@/types"

type RecordRow = Record & { pivot?: Allocation }

type RecordTableOptions<TRecord extends RecordRow> = {
	amount?: "amount" | "allocated"
	/** Opens the Record. Pass the same handler as the table's `onRowClick`, so the whole row opens it. */
	onOpen?: (record: TRecord) => void | Promise<unknown>
	extraActions?: (record: TRecord) => React.ReactNode
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
	if (record.pending_statement_count) return "Awaiting confirmation of a Pending Statement"
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

/**
 * A Record's secondary line in every Record list: its Monthly Budget (or treatment) as an
 * inline badge, then the given details.
 */
export function RecordDetails({
	record,
	details,
	status,
	className,
}: {
	record: Record
	details: React.ReactNode
	/** Leads the line, for rows too narrow to show the status beside the title. */
	status?: React.ReactNode
	className?: string
}) {
	return (
		<p className={cn("flex min-w-0 items-center gap-1 text-muted-foreground", className)}>
			{status}
			<RecordMonthlyBudget record={record} inline />
			{details ? <span className="min-w-0 truncate">· {details}</span> : null}
		</p>
	)
}

/** `inline` drops the pill so the badge fits a line of muted row text. */
function RecordMonthlyBudget({ record, inline = false }: { record: Record; inline?: boolean }) {
	const className = inline ? "border-0 bg-transparent p-0" : undefined
	if (record.monthly_budget)
		return (
			<MonthlyBudgetBadge
				name={record.monthly_budget.name}
				color={record.monthly_budget.color}
				className={className}
			/>
		)
	if (canUseMonthlyBudget(record.analytics_treatment, record.amount))
		return <MonthlyBudgetBadge name="Unbudgeted" color={null} className={className} />
	return <span className="shrink-0">{treatmentLabel(record.analytics_treatment)}</span>
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

/** The Record's title. With `onOpen` it is the row's keyboard and screen reader way to open the Record. */
function RecordTitle<TRecord extends RecordRow>({
	record,
	onOpen,
}: {
	record: TRecord
	onOpen?: (record: TRecord) => void | Promise<unknown>
}) {
	if (!onOpen) return <span className="min-w-0 truncate font-medium">{record.title}</span>
	// A real link, so a modified click still opens the Record's own page in a new tab.
	return (
		<Link
			href={pathRecord(record.id)}
			data-opens-in-place
			aria-label={`Open ${record.title}`}
			className="min-w-0 truncate rounded-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
			onClick={event => {
				if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
				event.preventDefault()
				void onOpen(record)
			}}
		>
			{record.title}
		</Link>
	)
}

export function useRecordColumns<TRecord extends RecordRow>({
	amount = "amount",
	onOpen,
	extraActions,
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
								<RecordTitle record={row.original} onOpen={onOpen} />
								<PendingBadge record={row.original} />
							</p>
							<RecordDetails
								record={row.original}
								details={row.original.subtitle}
								className="text-xs"
							/>
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
			...(extraActions
				? [
						{
							id: "actions",
							meta: { width: "w-14" },
							cell: ({ row }: CellContext<TRecord, unknown>) => (
								<div className="flex justify-end">{extraActions(row.original)}</div>
							),
						},
					]
				: []),
		],
		[amount, onOpen, extraActions, grouped],
	)
}

export function useRecordMobileRow<TRecord extends RecordRow>({
	amount = "amount",
	onOpen,
	extraActions,
	leading,
	grouped = false,
}: RecordTableOptions<TRecord> & {
	leading?: (record: TRecord) => React.ReactNode
}): (row: Row<TRecord>) => React.ReactNode {
	return useMemo(
		() => (row: Row<TRecord>) => {
			const record = row.original
			const value = amount === "allocated" ? (record.pivot?.amount ?? 0) : record.amount

			// Three cells (main, amount, actions) for the list's shared subgrid.
			return (
				<>
					<div className="flex min-w-0 items-center gap-3">
						{leading?.(record)}
						<Icon {...record.category} size={14} />
						<div className="min-w-0 flex-1">
							<p className="flex">
								<RecordTitle record={record} onOpen={onOpen} />
							</p>
							{/* The status shares the second line so the title keeps the full width. */}
							<RecordDetails
								record={record}
								status={<PendingBadge record={record} />}
								details={[record.subtitle, formatRowTime(record.datetime, grouped)]
									.filter(Boolean)
									.join(" · ")}
								className="text-xs"
							/>
						</div>
					</div>
					<RecordAmountCell
						record={record}
						value={value}
						showAllocated={amount === "amount" && record.is_pending}
					/>
					{extraActions ? (
						<div className="flex justify-end">{extraActions(record)}</div>
					) : (
						<span />
					)}
				</>
			)
		},
		[amount, onOpen, extraActions, leading, grouped],
	)
}
