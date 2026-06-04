import { Link } from "@inertiajs/react"
import type { ColumnDef, Row } from "@tanstack/react-table"
import type { ReactNode } from "react"
import AllocateBar from "@/components/allocate-bar"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, formatCurrency, formatDatetime, round2dp } from "@/lib/utils"
import type { Allocation, Statement } from "@/types"
import { statementWebRoute } from "@/wayfinder/routes"

type StatementRow = Statement & { pivot?: Allocation }

type StatementTableOptions = {
	amount?: "amount" | "allocable" | "allocated"
	showAccount?: boolean
	pageName?: string
}

export function useStatementColumns<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	pageName,
}: StatementTableOptions): ColumnDef<TStatement>[] {
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
				<div className="whitespace-pre-line break-words text-muted-foreground">
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

export function useStatementMobileRow<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	pageName,
	leading,
}: StatementTableOptions & {
	leading?: (statement: TStatement) => ReactNode
}): (row: Row<TStatement>) => ReactNode {
	const { handlePush } = useHistory()

	return row => {
		const statement = row.original

		return (
			<div className="flex flex-col gap-3">
				<div className="flex items-start gap-3">
					{leading?.(statement)}
					<div className="min-w-0 flex-1">
						<p className="whitespace-pre-line break-words font-medium">
							{showAccount
								? statement.account.name
								: statement.description || "Statement"}
						</p>
						<p className="text-xs text-muted-foreground">
							{formatDatetime(statement.datetime)}
						</p>
					</div>
					{amount === "amount" ? (
						<span className={classForCurrency(statement.amount)}>
							{formatCurrency(statement.amount)}
						</span>
					) : null}
				</div>

				{amount === "allocable" || amount === "allocated" ? (
					<AllocateBar
						title={amount === "allocable" ? "Allocable" : "Allocated"}
						value={
							amount === "allocable"
								? round2dp(statement.allocable_amount)
								: (statement.pivot?.amount ?? 0)
						}
						total={statement.amount}
					/>
				) : null}

				{showAccount ? (
					<p className="whitespace-pre-line break-words text-xs text-muted-foreground">
						{statement.description || "-"}
					</p>
				) : null}

				<div className="flex justify-end">
					<Button variant="outline" size="sm" asChild>
						<Link
							href={statementWebRoute.url({ statement })}
							onClick={pageName ? handlePush(pageName) : undefined}
						>
							Open
						</Link>
					</Button>
				</div>
			</div>
		)
	}
}
