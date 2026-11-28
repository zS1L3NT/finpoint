import type { ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { amountTone, formatRowTime } from "@/components/table/record-columns"
import { Badge } from "@/components/ui/badge"
import { useHistory } from "@/history"
import { cn, formatCurrency, round2 } from "@/lib/utils"
import { pathAllocatorDuplicates, pathStatement } from "@/routes"
import type { Allocation, Statement } from "@/types"

type StatementRow = Statement & { pivot?: Allocation }

type StatementTableOptions = {
	amount?: "amount" | "allocable" | "allocated"
	showAccount?: boolean
	/** Names this page on the Statement page's Back button. */
	pageName?: string
	/** Row clicks select, so the title is underlined to show it opens the Statement instead. */
	selectable?: boolean
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
	amount: StatementTableOptions["amount"]
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

/**
 * The Statement's description, linking to its page. In selectable tables a row click selects,
 * so the title is the way in.
 */
function StatementTitle({
	statement,
	pageName,
	selectable,
}: {
	statement: Statement
	pageName?: string
	selectable?: boolean
}) {
	const { handlePush } = useHistory()
	return (
		<Link
			href={pathStatement(statement.id)}
			className={cn(
				"min-w-0 truncate rounded-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
				selectable &&
					"underline decoration-muted-foreground/60 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-foreground",
			)}
			onClick={pageName ? handlePush(pageName) : undefined}
		>
			{statement.description || "No description"}
		</Link>
	)
}

export function useStatementColumns<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	pageName,
	selectable,
	grouped = false,
}: StatementTableOptions): ColumnDef<TStatement>[] {
	return useMemo(
		(): ColumnDef<TStatement>[] => [
			{
				header: "Statement",
				cell: ({ row }) => (
					<div className="min-w-0">
						<p className="flex items-center gap-1.5">
							<StatementTitle
								statement={row.original}
								pageName={pageName}
								selectable={selectable}
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
		],
		[amount, showAccount, pageName, selectable, grouped],
	)
}

export function useStatementMobileRow<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	pageName,
	selectable,
	leading,
	grouped = false,
}: StatementTableOptions & {
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
							<p className="flex">
								<StatementTitle
									statement={statement}
									pageName={pageName}
									selectable={selectable}
								/>
							</p>
							{/* Badges share the second line so the title keeps the full width. */}
							<p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
								<StatementBadges
									statement={statement}
									showUnallocated={amount !== "allocable"}
								/>
								<span className="truncate">
									{[showAccount ? statement.account.name : null, time]
										.filter(Boolean)
										.join(" · ")}
								</span>
							</p>
						</div>
					</div>
					<StatementAmount statement={statement} amount={amount} />
					<span />
				</>
			)
		},
		[amount, showAccount, pageName, selectable, leading, grouped],
	)
}
