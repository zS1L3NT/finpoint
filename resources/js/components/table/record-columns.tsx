import { Link } from "@inertiajs/react"
import type { ColumnDef, Row } from "@tanstack/react-table"
import type { ReactNode } from "react"
import Icon from "@/components/icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, cn, formatCurrency, formatDatetime } from "@/lib/utils"
import type { Allocation, Record } from "@/types"
import { recordWebRoute } from "@/wayfinder/routes"

type RecordRow = Record & { pivot?: Allocation }

type RecordTableOptions<TRecord extends RecordRow> = {
	amount?: "amount" | "allocated"
	showQuota?: boolean
	pageName?: string
	extraActions?: (record: TRecord) => ReactNode
	actionWidth?: string
	mobileVariant?: "default" | "dashboard"
}

export function useRecordColumns<TRecord extends RecordRow>({
	amount = "amount",
	showQuota = false,
	pageName,
	extraActions,
	actionWidth = TABLE_WIDTH_CLASSNAMES.ACTIONS_OPEN,
}: RecordTableOptions<TRecord>): ColumnDef<TRecord>[] {
	const { handlePush } = useHistory()

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
		...(showQuota
			? [
					{
						header: "Quota",
						meta: { width: TABLE_WIDTH_CLASSNAMES.QUOTA },
						cell: ({ row }) =>
							row.original.quota ? (
								<Badge
									variant="outline"
									style={{
										borderColor: row.original.quota.color,
										color: row.original.quota.color,
									}}
								>
									{row.original.quota.name}
								</Badge>
							) : null,
					} satisfies ColumnDef<TRecord>,
				]
			: []),
		{
			header: "Amount",
			meta: { width: TABLE_WIDTH_CLASSNAMES.AMOUNT },
			cell: ({ row }) => {
				const value =
					amount === "allocated" ? (row.original.pivot?.amount ?? 0) : row.original.amount

				return <span className={classForCurrency(value)}>{formatCurrency(value)}</span>
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
			meta: { width: actionWidth },
			cell: ({ row }) => {
				const openButton = (
					<Button variant="outline" size="sm" asChild>
						<Link
							href={recordWebRoute.url({ record: row.original })}
							onClick={pageName ? handlePush(pageName) : undefined}
						>
							Open
						</Link>
					</Button>
				)

				return extraActions ? (
					<div className="flex justify-end gap-2">
						{openButton}
						{extraActions(row.original)}
					</div>
				) : (
					openButton
				)
			},
		},
	]
}

export function useRecordMobileRow<TRecord extends RecordRow>({
	amount = "amount",
	showQuota = false,
	pageName,
	extraActions,
	leading,
	mobileVariant = "default",
}: RecordTableOptions<TRecord> & {
	leading?: (record: TRecord) => ReactNode
}): (row: Row<TRecord>) => ReactNode {
	const { handlePush } = useHistory()

	return row => {
		const record = row.original
		const value = amount === "allocated" ? (record.pivot?.amount ?? 0) : record.amount
		const openButton = (
			<Button variant="outline" size="sm" asChild>
				<Link
					href={recordWebRoute.url({ record })}
					onClick={pageName ? handlePush(pageName) : undefined}
				>
					Open
				</Link>
			</Button>
		)

		if (mobileVariant === "dashboard") {
			return (
				<div className="flex flex-col gap-3">
					<div className="flex items-start gap-3">
						<div className="pt-1">{leading?.(record)}</div>
						<Icon {...record.category} size={18} />
						<div className="min-w-0 flex-1">
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<p className="font-medium leading-snug break-words">
										{record.is_pending && (
											<Badge variant="warning" className="mr-1 align-middle">
												Pending
											</Badge>
										)}
										{record.title}
									</p>
									{record.subtitle ? (
										<p className="text-xs leading-relaxed text-muted-foreground break-words">
											{record.subtitle}
										</p>
									) : null}
								</div>
								<span
									className={cn(
										"shrink-0 text-sm font-medium tabular-nums whitespace-nowrap",
										classForCurrency(value),
									)}
								>
									{formatCurrency(value)}
								</span>
							</div>
						</div>
					</div>

					<div className="ml-12 flex flex-col gap-2 border-t pt-3 text-xs text-muted-foreground">
						<div className="flex flex-wrap items-center gap-2">
							<span>{formatDatetime(record.datetime)}</span>
							{showQuota ? (
								record.quota ? (
									<Badge
										variant="outline"
										style={{
											borderColor: record.quota.color,
											color: record.quota.color,
										}}
									>
										{record.quota.name}
									</Badge>
								) : (
									<span>No quota</span>
								)
							) : null}
						</div>
						{record.description ? (
							<p className="whitespace-pre-line break-words leading-relaxed">
								{record.description}
							</p>
						) : null}
						<div className="flex flex-wrap justify-end gap-2 pt-1">
							{openButton}
							{extraActions?.(record)}
						</div>
					</div>
				</div>
			)
		}

		return (
			<div className="flex flex-col gap-3">
				<div className="flex items-start gap-3">
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
					<span className={classForCurrency(value)}>{formatCurrency(value)}</span>
				</div>

				<div className="grid gap-2 text-xs text-muted-foreground">
					<div className="flex justify-between gap-3">
						<span>Date & Time</span>
						<span className="text-right">{formatDatetime(record.datetime)}</span>
					</div>
					{showQuota ? (
						<div className="flex items-center justify-between gap-3">
							<span>Quota</span>
							{record.quota ? (
								<Badge
									variant="outline"
									style={{
										borderColor: record.quota.color,
										color: record.quota.color,
									}}
								>
									{record.quota.name}
								</Badge>
							) : (
								<span>No quota</span>
							)}
						</div>
					) : null}
					{record.description ? (
						<p className="whitespace-pre-line break-words">{record.description}</p>
					) : null}
				</div>

				<div className="flex flex-wrap justify-end gap-2">
					{openButton}
					{extraActions?.(record)}
				</div>
			</div>
		)
	}
}
