import { Link } from "@inertiajs/react"
import type { ColumnDef } from "@tanstack/react-table"
import AllocateBar from "@/components/allocate-bar"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, formatCurrency, formatDatetime, round2dp } from "@/lib/utils"
import type { Allocation, Statement } from "@/types"
import { statementWebRoute } from "@/wayfinder/routes"

type StatementRow = Statement & { pivot?: Allocation }

export function useStatementColumns<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	pageName,
}: {
	amount?: "amount" | "allocable" | "allocated"
	showAccount?: boolean
	pageName?: string
}): ColumnDef<TStatement>[] {
	const { handlePush } = useHistory()

	return [
		...(showAccount
			? [
					{
						header: "Account",
						meta: { width: TABLE_WIDTH_CLASSNAMES.ACCOUNT },
						cell: ({ row }) => row.original.account.name,
					} satisfies ColumnDef<TStatement>,
				]
			: []),
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
			header: "Amount",
			meta: {
				width:
					amount === "amount"
						? TABLE_WIDTH_CLASSNAMES.AMOUNT
						: TABLE_WIDTH_CLASSNAMES.AMOUNT_BAR,
			},
			cell: ({ row }) =>
				amount === "allocable" ? (
					<AllocateBar
						title="Allocable"
						value={round2dp(row.original.allocable_amount)}
						total={row.original.amount}
					/>
				) : amount === "allocated" ? (
					<AllocateBar
						title="Allocated"
						value={row.original.pivot?.amount ?? 0}
						total={row.original.amount}
					/>
				) : (
					<span className={classForCurrency(row.original.amount)}>
						{formatCurrency(row.original.amount)}
					</span>
				),
		},
		{
			header: "Description",
			meta: { width: TABLE_WIDTH_CLASSNAMES.STATEMENT },
			cell: ({ row }) => (
				<div className="truncate text-muted-foreground">
					{row.original.description || "-"}
				</div>
			),
		},
		{
			id: "actions",
			meta: { width: TABLE_WIDTH_CLASSNAMES.ACTIONS_FIXED_OPEN },
			cell: ({ row }) => (
				<Button variant="outline" size="sm" asChild>
					<Link
						href={statementWebRoute.url({ statement: row.original })}
						onClick={pageName ? handlePush(pageName) : undefined}
					>
						Open
					</Link>
				</Button>
			),
		},
	]
}
