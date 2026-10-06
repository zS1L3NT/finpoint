import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useState } from "react"
import StatementReplacementReviewDialog from "@/components/dialogs/statement-replacement-review"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { classForCurrency, cn, formatCurrency, formatDatetime } from "@/lib/utils"
import { round2 } from "@/logic/shared"
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
				<SheetContent side="right" className="gap-0 md:data-[side=right]:max-w-xl">
					<SheetHeader className="gap-1 border-b p-4 pr-12 md:px-6">
						<SheetTitle className="text-base">Replace a pending Statement</SheetTitle>
						<SheetDescription>
							{statement ? (
								<>
									Choose the placeholder that{" "}
									<span className="font-medium text-foreground">
										{statement.description}
									</span>{" "}
									(
									<span className={classForCurrency(statement.amount)}>
										{formatCurrency(statement.amount)}
									</span>
									) should replace. Its Allocations carry over.
								</>
							) : (
								"Select one fully unallocated imported Statement."
							)}
						</SheetDescription>
					</SheetHeader>

					<div className="border-b px-4 py-3 md:px-6">
						<div className="relative">
							<IconifyIcon
								icon="lucide:search"
								className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								type="search"
								autoFocus
								aria-label="Search pending Statements"
								placeholder="Search descriptions and amounts..."
								className="pl-8"
								value={query}
								onChange={event => setQuery(event.target.value)}
							/>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto overscroll-contain">
						{statements.length === 0 ? (
							<p className="px-6 py-16 text-center text-sm text-muted-foreground">
								No pending Statements for this Account.
							</p>
						) : (
							<ul className="grid gap-px p-2">
								{statements.map(pending => {
									const exact =
										!!statement &&
										round2(pending.amount) === round2(statement.amount)
									return (
										<li key={pending.id}>
											<button
												type="button"
												onClick={() => review(pending)}
												className={cn(
													"grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted",
													exact &&
														"bg-emerald-500/5 ring-1 ring-emerald-500/30 ring-inset",
												)}
											>
												<span className="min-w-0">
													<span className="flex items-center gap-1.5">
														<span className="min-w-0 truncate text-sm font-medium">
															{pending.description}
														</span>
														{exact ? (
															<Badge className="shrink-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
																Same amount
															</Badge>
														) : null}
													</span>
													<span className="block truncate text-xs text-muted-foreground">
														{formatDatetime(pending.datetime)} ·{" "}
														{pending.allocation_count} Allocation
														{pending.allocation_count === 1 ? "" : "s"}
													</span>
												</span>
												<span
													className={cn(
														"text-sm font-semibold tabular-nums",
														classForCurrency(pending.amount),
													)}
												>
													{formatCurrency(pending.amount)}
												</span>
											</button>
										</li>
									)
								})}
							</ul>
						)}
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
