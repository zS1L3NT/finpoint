import type { CellContext, ColumnDef, Row } from "@tanstack/react-table"
import { useMemo } from "react"
import { Link } from "react-router-dom"
import AllocateBar from "@/components/allocate-bar"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, formatCurrency, formatDatetime, round2dp } from "@/lib/utils"
import { pathStatement } from "@/routes"
import type { Allocation, Statement } from "@/types"

type StatementRow = Statement & { pivot?: Allocation }

type StatementTableOptions<TStatement extends StatementRow> = {
	amount?: "amount" | "allocable" | "allocated"
	showAccount?: boolean
	pageName?: string
	onEdit?: (statement: TStatement) => void
}

function StatementActionsCell<TStatement extends StatementRow>({
	row,
	column,
}: CellContext<TStatement, unknown>) {
	const { handlePush } = useHistory()
	const { pageName, onEdit } = (
		column.columnDef.meta as { statementActions: StatementTableOptions<TStatement> }
	).statementActions
	return (
		<div className="flex items-center justify-end gap-1.5">
			{onEdit && row.original.is_pending ? (
				<Button
					variant="outline"
					size="sm"
					className="w-[4.25rem]"
					onClick={() => onEdit(row.original)}
				>
					<IconifyIcon icon="lucide:pencil" /> Edit
				</Button>
			) : null}
			<Button variant="outline" size="sm" asChild>
				<Link
					to={pathStatement(row.original.id)}
					onClick={pageName ? handlePush(pageName) : undefined}
				>
					Open
				</Link>
			</Button>
		</div>
	)
}

export function useStatementColumns<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	pageName,
	onEdit,
}: StatementTableOptions<TStatement>): ColumnDef<TStatement>[] {
	return useMemo(
		(): ColumnDef<TStatement>[] => [
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
						{row.original.is_pending ? (
							<Badge variant="warning" className="mr-1">
								Pending
							</Badge>
						) : null}
						{row.original.description || "-"}
					</div>
				),
			},
			{
				id: "actions",
				meta: {
					statementActions: { pageName, onEdit },
					width: onEdit
						? TABLE_WIDTH_CLASSNAMES.ACTIONS_EDIT_OPEN
						: TABLE_WIDTH_CLASSNAMES.ACTIONS_FIXED_OPEN,
				},
				cell: StatementActionsCell,
			},
		],
		[amount, showAccount, pageName, onEdit],
	)
}

export function useStatementMobileRow<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	pageName,
	leading,
	onEdit,
}: StatementTableOptions<TStatement> & {
	leading?: (statement: TStatement) => React.ReactNode
}): (row: Row<TStatement>) => React.ReactNode {
	const { handlePush } = useHistory()

	return useMemo(
		() => (row: Row<TStatement>) => {
			const statement = row.original
			const actions = (
				<div className="flex shrink-0 items-center justify-end gap-1.5">
					{onEdit && statement.is_pending ? (
						<Button
							variant="outline"
							size="sm"
							className="w-[4.25rem]"
							onClick={() => onEdit(statement)}
						>
							<IconifyIcon icon="lucide:pencil" /> Edit
						</Button>
					) : null}
					<Button variant="outline" size="sm" asChild>
						<Link
							to={pathStatement(statement.id)}
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
						{leading?.(statement)}
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium">
								{statement.is_pending ? (
									<Badge variant="warning" className="mr-1">
										Pending
									</Badge>
								) : null}
								{showAccount
									? statement.account.name
									: statement.description || "Statement"}
							</p>
							{showAccount ? (
								<p className="truncate text-xs text-muted-foreground">
									{statement.description || "No description"}
								</p>
							) : null}
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

					<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 pl-7 text-xs text-muted-foreground">
						<span className="truncate">{formatDatetime(statement.datetime)}</span>
						{actions}
					</div>
				</div>
			)
		},
		[amount, showAccount, pageName, leading, onEdit, handlePush],
	)
}
