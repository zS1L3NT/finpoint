import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useState } from "react"
import StatementReplacementReviewDialog from "@/components/dialogs/statement-replacement-review"
import DataTable from "@/components/table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, formatCurrency, formatDatetime } from "@/lib/utils"
import { listStatements } from "@/logic/statements"
import type { Statement } from "@/types"

export default function PendingStatementConfirmationSheet({
	statement,
	isOpen,
	setIsOpen,
	onConfirmed,
	trigger,
}: {
	statement: Statement | null
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	onConfirmed: () => void
	trigger: React.ReactElement
}) {
	const [query, setQuery] = useState("")
	const [pendingStatement, setPendingStatement] = useState<Statement | null>(null)
	const statements =
		useLiveQuery(() => {
			if (!isOpen || !statement) return []
			return listStatements({
				query: query || null,
				account_id: statement.account.id,
				is_pending: "true",
			})
		}, [isOpen, query, statement?.id]) ?? []

	useEffect(() => {
		if (!isOpen) {
			setQuery("")
		}
	}, [isOpen])

	const review = (pending: Statement) => {
		setPendingStatement(pending)
		setIsOpen(false)
	}

	return (
		<>
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>{trigger}</SheetTrigger>
				<SheetContent
					side="right"
					className="md:data-[side=right]:w-full md:data-[side=right]:max-w-4xl"
				>
					<SheetHeader className="gap-2 border-b">
						<SheetTitle>Replace pending Statement</SheetTitle>
						<SheetDescription>
							{statement
								? `${statement.description} · ${formatCurrency(statement.amount)}`
								: "Select one fully unallocated imported Statement."}
						</SheetDescription>
					</SheetHeader>

					<div className="flex flex-1 flex-col gap-4 overflow-y-hidden p-4 md:p-6">
						<Field>
							<FieldLabel htmlFor="pending-statement-search-query">
								Search pending Statements
							</FieldLabel>
							<Input
								id="pending-statement-search-query"
								type="search"
								placeholder="Search descriptions and amounts..."
								value={query}
								onChange={event => setQuery(event.target.value)}
							/>
						</Field>

						<ScrollArea className="flex-1 overflow-y-hidden">
							<DataTable
								data={statements}
								columns={[
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
										meta: { width: TABLE_WIDTH_CLASSNAMES.AMOUNT },
										cell: ({ row }) => (
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
												<Badge variant="warning" className="mr-1">
													Pending
												</Badge>
												{row.original.description}
											</div>
										),
									},
									{
										header: "Allocations",
										cell: ({ row }) => row.original.allocation_count,
									},
									{
										id: "actions",
										meta: {
											width: TABLE_WIDTH_CLASSNAMES.ACTIONS_FIXED_ATTACH,
										},
										cell: ({ row }) => (
											<Button size="sm" onClick={() => review(row.original)}>
												Review
											</Button>
										),
									},
								]}
								mobileRow={({ original }) => (
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<p className="truncate font-medium">
												{original.description}
											</p>
											<p className="text-xs text-muted-foreground">
												{formatDatetime(original.datetime)} ·{" "}
												{original.allocation_count} Allocation(s)
											</p>
										</div>
										<div className="flex shrink-0 flex-col items-end gap-1.5">
											<span className={classForCurrency(original.amount)}>
												{formatCurrency(original.amount)}
											</span>
											<Button size="sm" onClick={() => review(original)}>
												Review
											</Button>
										</div>
									</div>
								)}
								emptyMessage="No pending Statements found for this Account."
							/>
						</ScrollArea>
					</div>
				</SheetContent>
			</Sheet>

			<StatementReplacementReviewDialog
				statement={statement}
				pendingStatement={pendingStatement}
				open={!!pendingStatement && !isOpen}
				onOpenChange={open => {
					if (!open) {
						setPendingStatement(null)
						setIsOpen(true)
					}
				}}
				onConfirmed={() => {
					setPendingStatement(null)
					setIsOpen(false)
					onConfirmed()
				}}
			/>
		</>
	)
}
