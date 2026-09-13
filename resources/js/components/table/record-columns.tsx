import { Icon as IconifyIcon } from "@iconify/react"
import type { CellContext, ColumnDef, Row } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import Icon from "@/components/icon"
import RecordAmount from "@/components/record-amount"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { formatDatetime } from "@/lib/utils"
import { pathRecord } from "@/routes"
import type { Allocation, Record } from "@/types"

type RecordRow = Record & { pivot?: Allocation }

type RecordTableOptions<TRecord extends RecordRow> = {
	amount?: "amount" | "allocated"
	pageName?: string
	extraActions?: (record: TRecord) => React.ReactNode
	actionWidth?: string
	onEdit?: (record: TRecord) => void
	loadingRecordId?: string | null
}

function RecordActionsCell<TRecord extends RecordRow>({
	row,
	column,
}: CellContext<TRecord, unknown>) {
	const { handlePush } = useHistory()
	const { pageName, extraActions, onEdit, loadingRecordId } = (
		column.columnDef.meta as { recordActions: RecordTableOptions<TRecord> }
	).recordActions
	const actions = (
		<div className="flex shrink-0 items-center justify-end gap-1.5">
			{onEdit ? (
				<Button
					variant="outline"
					size="sm"
					className="w-[4.25rem]"
					aria-busy={loadingRecordId === row.original.id}
					onClick={() => {
						if (!loadingRecordId) onEdit(row.original)
					}}
				>
					<IconifyIcon icon="lucide:pencil" />
					Edit
				</Button>
			) : null}
			<Button variant="outline" size="sm" asChild>
				<Link
					to={pathRecord(row.original.id)}
					onClick={pageName ? handlePush(pageName) : undefined}
				>
					Open
				</Link>
			</Button>
		</div>
	)

	return extraActions ? (
		<div className="flex justify-end gap-2">
			{actions}
			{extraActions(row.original)}
		</div>
	) : (
		actions
	)
}

export function useRecordColumns<TRecord extends RecordRow>({
	amount = "amount",
	pageName,
	extraActions,
	actionWidth = TABLE_WIDTH_CLASSNAMES.ACTIONS_OPEN,
	onEdit,
	loadingRecordId,
}: RecordTableOptions<TRecord>): ColumnDef<TRecord>[] {
	return [
		{
			header: "Record",
			meta: { width: TABLE_WIDTH_CLASSNAMES.RECORD },
			cell: ({ row }) => (
				<div className="flex items-center gap-3">
					<Icon {...row.original.category} size={16} />
					<div className="flex-1 overflow-hidden">
						<p className="truncate font-medium">
							{row.original.is_pending && (
								<Badge variant="warning" className="mr-1">
									Pending
								</Badge>
							)}
							{row.original.title}
						</p>
						<p className="truncate text-muted-foreground">
							{row.original.subtitle || "No extra context"}
						</p>
					</div>
				</div>
			),
		},
		{
			header: "Amount",
			meta: { width: TABLE_WIDTH_CLASSNAMES.AMOUNT },
			cell: ({ row }) => {
				const value =
					amount === "allocated" ? (row.original.pivot?.amount ?? 0) : row.original.amount

				return (
					<RecordAmount
						record={row.original}
						amount={value}
						showAccumulated={amount === "amount" && row.original.is_pending}
					/>
				)
			},
		},
		{
			header: "Date & Time",
			meta: { width: TABLE_WIDTH_CLASSNAMES.DATETIME },
			cell: ({ row }) => (
				<span className="text-muted-foreground">
					{formatDatetime(row.original.datetime)}
				</span>
			),
		},
		{
			header: "Description",
			meta: { width: TABLE_WIDTH_CLASSNAMES.DESCRIPTION },
			cell: ({ row }) => (
				<div className="whitespace-pre-line break-words text-muted-foreground">
					{row.original.description || "-"}
				</div>
			),
		},
		{
			id: "actions",
			meta: {
				recordActions: { pageName, extraActions, onEdit, loadingRecordId },
				width: onEdit
					? extraActions
						? TABLE_WIDTH_CLASSNAMES.ACTIONS_EDIT_OPEN_DETACH
						: TABLE_WIDTH_CLASSNAMES.ACTIONS_EDIT_OPEN
					: actionWidth,
			},
			cell: RecordActionsCell,
		},
	]
}

export function useRecordMobileRow<TRecord extends RecordRow>({
	amount = "amount",
	pageName,
	extraActions,
	leading,
	onEdit,
	loadingRecordId,
}: RecordTableOptions<TRecord> & {
	leading?: (record: TRecord) => React.ReactNode
}): (row: Row<TRecord>) => React.ReactNode {
	const { handlePush } = useHistory()

	return row => {
		const record = row.original
		const value = amount === "allocated" ? (record.pivot?.amount ?? 0) : record.amount
		const actions = (
			<div className="flex shrink-0 items-center justify-end gap-1.5">
				{onEdit ? (
					<Button
						variant="outline"
						size="sm"
						className="w-[4.25rem]"
						aria-busy={loadingRecordId === record.id}
						onClick={() => {
							if (!loadingRecordId) onEdit(record)
						}}
					>
						<IconifyIcon icon="lucide:pencil" />
						Edit
					</Button>
				) : null}
				<Button variant="outline" size="sm" asChild>
					<Link
						to={pathRecord(record.id)}
						onClick={pageName ? handlePush(pageName) : undefined}
					>
						Open
					</Link>
				</Button>
			</div>
		)

		return (
			<div className="grid min-w-0 gap-2">
				<div className="flex min-w-0 items-start gap-3">
					{leading?.(record)}
					<Icon {...record.category} size={18} />
					<div className="min-w-0 flex-1">
						<p className="font-medium break-words">
							{record.is_pending && (
								<Badge variant="warning" className="mr-1 align-middle">
									Pending
								</Badge>
							)}
							{record.title}
						</p>
						<p className="text-xs text-muted-foreground break-words">
							{record.subtitle || "No extra context"}
						</p>
					</div>
					<RecordAmount
						record={record}
						amount={value}
						showAccumulated={amount === "amount" && record.is_pending}
					/>
				</div>

				<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 pl-7 text-xs text-muted-foreground">
					<span className="truncate">{formatDatetime(record.datetime)}</span>
					<div className="flex flex-wrap items-center justify-end gap-1.5">
						{actions}
						{extraActions?.(record)}
					</div>
				</div>
			</div>
		)
	}
}
