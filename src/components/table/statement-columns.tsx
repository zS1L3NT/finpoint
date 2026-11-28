import type { ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { useMemo } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { amountTone, formatRowTime } from "@/components/table/record-columns"
import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency, round2 } from "@/lib/utils"
import { pathAllocatorDuplicates, pathStatement } from "@/routes"
import type { Allocation, Statement } from "@/types"

type StatementRow = Statement & { pivot?: Allocation }

type StatementTableOptions = {
	amount?: "amount" | "allocable" | "allocated"
	showAccount?: boolean
	/** Opens the Statement. Pass the same handler as the table's `onRowClick`, so the whole row opens it. */
	onOpen?: (statement: Statement) => void
	/** Row clicks select, so the title is underlined to show it opens the Statement instead. */
	selectable?: boolean
	/** Rows sit under day headers, so only the time is shown. */
	grouped?: boolean
}

export function StatementBadges({
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

/**
 * The Statement's description. With `onOpen` it opens the Statement in place, and in selectable
 * tables, where a row click selects, it is the way in.
 */
function StatementTitle({
	statement,
	onOpen,
	selectable,
}: {
	statement: Statement
	onOpen?: (statement: Statement) => void
	selectable?: boolean
}) {
	// A real link, so a modified click still opens the Statement over its list in a new tab.
	return (
		<Link
			href={pathStatement(statement.id)}
			data-opens-in-place={onOpen ? true : undefined}
			className={cn(
				"min-w-0 truncate rounded-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
				selectable &&
					"underline decoration-muted-foreground/60 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-foreground",
			)}
			onClick={event => {
				if (!onOpen || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
					return
				event.preventDefault()
				onOpen(statement)
			}}
		>
			{statement.description || "No description"}
		</Link>
	)
}

export function useStatementColumns<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	onOpen,
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
								onOpen={onOpen}
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
		[amount, showAccount, onOpen, selectable, grouped],
	)
}

export function useStatementMobileRow<TStatement extends StatementRow>({
	amount = "amount",
	showAccount = true,
	onOpen,
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
									onOpen={onOpen}
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
		[amount, showAccount, onOpen, selectable, leading, grouped],
	)
}
