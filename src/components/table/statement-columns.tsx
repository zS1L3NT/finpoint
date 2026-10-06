import type { CellContext, ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { useMemo } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { amountTone, formatRowTime } from "@/components/table/record-columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { cn, formatCurrency, round2dp } from "@/lib/utils"
import { pathStatement } from "@/routes"
import type { Allocation, Statement } from "@/types"

type StatementRow = Statement & { pivot?: Allocation }

type StatementTableOptions<TStatement extends StatementRow> = {
	amount?: "amount" | "allocable" | "allocated"
	showAccount?: boolean
	pageName?: string
	onEdit?: (statement: TStatement) => void
	/** Rows sit under day headers, so only the time is shown. */
	grouped?: boolean
}

function StatementBadges({
	statement,
	showUnallocated,
}: {
	statement: Statement
	showUnallocated: boolean
}) {
	return (
		<>
			{statement.is_pending ? (
				<Badge
					variant="warning"
					className="shrink-0"
					title="Handwritten placeholder until the bank row is imported"
				>
					Pending
				</Badge>
			) : null}
			{showUnallocated && statement.is_unallocated ? (
				<Badge variant="outline" className="shrink-0 text-muted-foreground">
					Unallocated
				</Badge>
			) : null}
		</>
	)
}

function StatementAmount({
	statement,
	amount,
}: {
	statement: StatementRow
	amount: StatementTableOptions<StatementRow>["amount"]
}) {
	const allocable = round2dp(statement.allocable_amount)
	return (
		<span className="grid justify-items-end gap-0.5 text-right">
			<span className={cn("font-medium tabular-nums", amountTone(statement.amount))}>
				{formatCurrency(statement.amount)}
			</span>
			{amount === "allocated" ? (
				<span className="text-[0.6875rem] text-muted-foreground tabular-nums">
					{formatCurrency(statement.pivot?.amount ?? 0)} here
				</span>
			) : allocable !== statement.amount && (amount === "allocable" || allocable !== 0) ? (
				<span className="text-[0.6875rem] text-muted-foreground tabular-nums">
					{allocable === 0 ? "Fully allocated" : `${formatCurrency(allocable)} allocable`}
				</span>
			) : null}
		</span>
	)
}

function StatementActions<TStatement extends StatementRow>({
	statement,
	options,
}: {
	statement: TStatement
	options: StatementTableOptions<TStatement>
}) {
	const { handlePush } = useHistory()
	const { pageName, onEdit } = options
	return (
		<div className="flex shrink-0 items-center justify-end gap-0.5">
			{onEdit && statement.is_pending ? (
				<Button
					variant="ghost"
					size="icon-sm"
					title="Edit"
					aria-label="Edit pending statement"
					onClick={() => onEdit(statement)}
				>
					<IconifyIcon icon="lucide:pencil" />
				</Button>
			) : null}
			<Button variant="ghost" size="icon-sm" title="Open" asChild>
				<Link
					href={pathStatement(statement.id)}
					aria-label="Open statement"
					onClick={pageName ? handlePush(pageName) : undefined}
				>
					<IconifyIcon icon="lucide:chevron-right" />
				</Link>
			</Button>
		</div>
	)
}

function StatementActionsCell<TStatement extends StatementRow>({
	row,
	column,
}: CellContext<TStatement, unknown>) {
	const { statementActions } = column.columnDef.meta as {
		statementActions: StatementTableOptions<TStatement>
	}
	return <StatementActions statement={row.original} options={statementActions} />
}

export function useStatementColumns<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	pageName,
	onEdit,
	grouped = false,
}: StatementTableOptions<TStatement>): ColumnDef<TStatement>[] {
	return useMemo(
		(): ColumnDef<TStatement>[] => [
			{
				header: "Statement",
				cell: ({ row }) => (
					<div className="min-w-0">
						<p className="flex items-center gap-1.5">
							<span className="min-w-0 truncate font-medium">
								{row.original.description || "No description"}
							</span>
							<StatementBadges
								statement={row.original}
								showUnallocated={amount !== "allocable"}
							/>
						</p>
						{showAccount ? (
							<p className="flex items-center gap-1 truncate text-muted-foreground">
								<IconifyIcon icon="lucide:landmark" className="size-3 shrink-0" />
								{row.original.account.name}
							</p>
						) : null}
					</div>
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
				meta: { width: "w-40" },
				cell: ({ row }) => <StatementAmount statement={row.original} amount={amount} />,
			},
			{
				id: "actions",
				meta: {
					statementActions: { pageName, onEdit },
					width: onEdit ? "w-24" : "w-14",
				},
				cell: StatementActionsCell,
			},
		],
		[amount, showAccount, pageName, onEdit, grouped],
	)
}

export function useStatementMobileRow<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	pageName,
	leading,
	onEdit,
	grouped = false,
}: StatementTableOptions<TStatement> & {
	leading?: (statement: TStatement) => React.ReactNode
}): (row: Row<TStatement>) => React.ReactNode {
	return useMemo(
		() => (row: Row<TStatement>) => {
			const statement = row.original
			const time = formatRowTime(statement.datetime, grouped)
			return (
				<div className="flex min-w-0 items-center gap-3">
					{leading?.(statement)}
					<div className="min-w-0 flex-1">
						<p className="flex items-center gap-1.5">
							<span className="min-w-0 truncate font-medium">
								{statement.description || "No description"}
							</span>
							<StatementBadges
								statement={statement}
								showUnallocated={amount !== "allocable"}
							/>
						</p>
						<p className="truncate text-xs text-muted-foreground">
							{[showAccount ? statement.account.name : null, time]
								.filter(Boolean)
								.join(" · ")}
						</p>
					</div>
					<StatementAmount statement={statement} amount={amount} />
					<StatementActions statement={statement} options={{ pageName, onEdit }} />
				</div>
			)
		},
		[amount, showAccount, pageName, leading, onEdit, grouped],
	)
}
