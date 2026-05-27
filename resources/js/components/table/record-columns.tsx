import { Link } from "@inertiajs/react"
import type { ColumnDef } from "@tanstack/react-table"
import type { ReactNode } from "react"
import Icon from "@/components/icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, formatCurrency, formatDatetime } from "@/lib/utils"
import type { Allocation, Record } from "@/types"
import { recordWebRoute } from "@/wayfinder/routes"

type RecordRow = Record & { pivot?: Allocation }

export function useRecordColumns<TRecord extends RecordRow>({
	amount = "amount",
	showQuota = false,
	pageName,
	extraActions,
	actionWidth = TABLE_WIDTH_CLASSNAMES.ACTIONS_OPEN,
}: {
	amount?: "amount" | "allocated"
	showQuota?: boolean
	pageName?: string
	extraActions?: (record: TRecord) => ReactNode
	actionWidth?: string
}): ColumnDef<TRecord>[] {
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
				<div className="truncate text-muted-foreground">
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
