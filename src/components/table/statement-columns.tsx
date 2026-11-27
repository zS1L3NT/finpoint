import type { CellContext, ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { amountTone, formatRowTime } from "@/components/table/record-columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useHistory } from "@/history"
import { cn, formatCurrency, round2 } from "@/lib/utils"
import { pathAllocatorDuplicates, pathStatement } from "@/routes"
import type { Allocation, Statement } from "@/types"

type StatementRow = Statement & { pivot?: Allocation }

type StatementTableOptions<TStatement extends StatementRow> = {
	amount?: "amount" | "allocable" | "allocated"
	showAccount?: boolean
	/** Names this page on the Statement page's Back button. */
	pageName?: string
	/** Row clicks select instead of opening, so the title stays plain and an Open button is shown. */
	selectable?: boolean
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
			{statement.is_duplicate ? (
				<Badge variant="destructive" asChild>
					<Link
						href={pathAllocatorDuplicates({ account_id: statement.account.id })}
						title="Possible duplicate statement. Review and fix duplicates."
					>
						Duplicate?
					</Link>
				</Badge>
			) : null}
			{statement.is_pending ? (
				<Badge
					variant="warning"
					className="shrink-0"
					title="Account activity awaiting confirmation"
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
	const allocable = round2(statement.allocable_amount)
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

/** Opens a Statement's page from a row click. Pass it as the table's `onRowClick`. */
export function useOpenStatement(pageName?: string) {
	const router = useRouter()
	const { handlePush } = useHistory()
	return (statement: Statement) => {
		if (pageName) handlePush(pageName)()
		router.push(pathStatement(statement.id))
	}
}

/** The Statement's description. Outside selectable tables it links to the Statement page. */
function StatementTitle({
	statement,
	options,
}: {
	statement: Statement
	options: Pick<StatementTableOptions<StatementRow>, "pageName" | "selectable">
}) {
	const { handlePush } = useHistory()
	const description = statement.description || "No description"
	if (options.selectable)
		return <span className="min-w-0 truncate font-medium">{description}</span>
	return (
		<Link
			href={pathStatement(statement.id)}
			className="min-w-0 truncate rounded-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
			onClick={options.pageName ? handlePush(options.pageName) : undefined}
		>
			{description}
		</Link>
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
	const { pageName, selectable, onEdit } = options
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
			{selectable ? (
				<Button variant="ghost" size="icon-sm" title="Open statement" asChild>
					<Link
						href={pathStatement(statement.id)}
						aria-label="Open statement"
						onClick={pageName ? handlePush(pageName) : undefined}
					>
						<IconifyIcon icon="lucide:arrow-up-right" />
					</Link>
				</Button>
			) : null}
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
	selectable,
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
							<StatementTitle
								statement={row.original}
								options={{ pageName, selectable }}
							/>
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
			...(selectable || onEdit
				? [
						{
							id: "actions",
							meta: {
								statementActions: { pageName, selectable, onEdit },
								width: "w-14",
							},
							cell: StatementActionsCell,
						},
					]
				: []),
		],
		[amount, showAccount, pageName, selectable, onEdit, grouped],
	)
}

export function useStatementMobileRow<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	pageName,
	selectable,
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
			// Three cells (main, amount, actions) for the list's shared subgrid.
			return (
				<>
					<div className="flex min-w-0 items-center gap-3">
						{leading?.(statement)}
						<div className="min-w-0 flex-1">
							<p className="flex items-center gap-1.5">
								<StatementTitle
									statement={statement}
									options={{ pageName, selectable }}
								/>
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
					</div>
					<StatementAmount statement={statement} amount={amount} />
					<StatementActions
						statement={statement}
						options={{ pageName, selectable, onEdit }}
					/>
				</>
			)
		},
		[amount, showAccount, pageName, selectable, leading, onEdit, grouped],
	)
}
