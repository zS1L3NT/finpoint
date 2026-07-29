import { Icon as IconifyIcon } from "@iconify/react"
import { router } from "@inertiajs/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DataTable from "@/components/table/data-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
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
import { classForCurrency, cn, formatCurrency, formatDatetime, round2dp } from "@/lib/utils"
import type { Statement } from "@/types"
import { statementIndexApiRoute, statementReplacePendingApiRoute } from "@/wayfinder/routes"

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
	const [statements, setStatements] = useState<Statement[]>([])
	const [pendingStatement, setPendingStatement] = useState<Statement | null>(null)

	const handleSearch = async () => {
		if (!statement) {
			setStatements([])
			return
		}

		const response = await fetch(
			statementIndexApiRoute.url({
				query: {
					query,
					account_id: statement.account.id,
					is_pending: "true",
				},
			}),
			{ headers: { Accept: "application/json" } },
		)

		if (response.ok) {
			setStatements(await response.json())
		}
	}

	useEffect(() => {
		if (!isOpen) {
			setQuery("")
			return
		}

		void handleSearch()
	}, [isOpen, query, statement])

	const pendingAllocated = pendingStatement
		? round2dp(pendingStatement.amount - pendingStatement.allocable_amount)
		: 0
	const canReplace =
		!!statement &&
		!!pendingStatement &&
		(pendingAllocated === 0 ||
			(statement.amount > 0 &&
				pendingAllocated > 0 &&
				pendingAllocated <= statement.amount) ||
			(statement.amount < 0 && pendingAllocated < 0 && pendingAllocated >= statement.amount))

	const handleReplace = async () => {
		if (!statement || !pendingStatement || !canReplace) {
			return
		}

		const response = await fetch(
			statementReplacePendingApiRoute.url({
				statement,
				pending_statement: pendingStatement,
			}),
			{
				method: "POST",
				headers: { Accept: "application/json" },
			},
		)

		if (response.status === 422) {
			const data = await response.json().catch(() => null)
			const message = Object.values((data?.errors ?? {}) as Record<string, string[]>)[0]?.[0]
			toast.error("Pending statement could not be replaced.", {
				description: message,
			})
			return
		}

		if (response.ok) {
			setPendingStatement(null)
			setIsOpen(false)
			toast.success("Pending statement replaced.", {
				description: "Its allocations now belong to the imported statement.",
			})
			onConfirmed()
			router.reload()
		}
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
						<SheetTitle>Replace pending statement</SheetTitle>
						<SheetDescription>
							{statement
								? `${statement.description} · ${formatCurrency(statement.amount)}`
								: "Select one fully unallocated imported statement."}
						</SheetDescription>
					</SheetHeader>

					<div className="flex flex-1 flex-col gap-4 overflow-y-hidden p-4 md:p-6">
						<Field>
							<FieldLabel htmlFor="pending-statement-search-query">
								Search pending statements
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
											<Button
												size="sm"
												onClick={() => {
													setPendingStatement(row.original)
													setIsOpen(false)
												}}
											>
												Review
											</Button>
										),
									},
								]}
								mobileRow={({ original }) => (
									<div className="flex flex-col gap-3">
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<p className="whitespace-pre-line break-words font-medium">
													<Badge variant="warning" className="mr-1">
														Pending
													</Badge>
													{original.description}
												</p>
												<p className="text-xs text-muted-foreground">
													{formatDatetime(original.datetime)} ·{" "}
													{original.allocation_count} allocation(s)
												</p>
											</div>
											<span className={classForCurrency(original.amount)}>
												{formatCurrency(original.amount)}
											</span>
										</div>
										<div className="flex justify-end">
											<Button
												size="sm"
												onClick={() => {
													setPendingStatement(original)
													setIsOpen(false)
												}}
											>
												Review
											</Button>
										</div>
									</div>
								)}
								emptyMessage="No pending statements found for this account."
							/>
						</ScrollArea>
					</div>
				</SheetContent>
			</Sheet>

			<Dialog
				open={!!pendingStatement && !isOpen}
				onOpenChange={open => {
					if (!open) {
						setPendingStatement(null)
						setIsOpen(true)
					}
				}}
			>
				<DialogContent className="md:max-w-lg">
					<DialogHeader>
						<DialogTitle>Replace this pending statement?</DialogTitle>
						<DialogDescription>
							The handwritten statement will be permanently deleted after its
							allocations move unchanged to the imported statement.
						</DialogDescription>
					</DialogHeader>

					{statement && pendingStatement ? (
						<div className="grid gap-3">
							<div className="grid gap-1">
								<p className="text-xs font-medium text-muted-foreground">
									Imported statement
								</p>
								<p className="whitespace-pre-line break-words font-medium">
									{statement.description}
								</p>
								<p className={cn("text-xs", classForCurrency(statement.amount))}>
									{formatCurrency(statement.amount)} ·{" "}
									{formatDatetime(statement.datetime)}
								</p>
							</div>

							<div className="grid gap-1">
								<p className="text-xs font-medium text-muted-foreground">
									Pending statement
								</p>
								<p className="whitespace-pre-line break-words font-medium">
									{pendingStatement.description}
								</p>
								<p
									className={cn(
										"text-xs",
										classForCurrency(pendingStatement.amount),
									)}
								>
									{formatCurrency(pendingStatement.amount)} ·{" "}
									{formatDatetime(pendingStatement.datetime)} ·{" "}
									{pendingStatement.allocation_count} allocation(s)
								</p>
							</div>

							{!canReplace ? (
								<Alert variant="destructive">
									<IconifyIcon icon="lucide:circle-alert" />
									<AlertTitle>Allocations do not fit</AlertTitle>
									<AlertDescription>
										The pending statement’s unchanged allocations would
										over-allocate the imported statement or use the wrong sign.
									</AlertDescription>
								</Alert>
							) : null}
						</div>
					) : null}

					<DialogFooter>
						<DialogClose
							render={
								<Button type="button" variant="outline">
									Cancel
								</Button>
							}
						/>
						<Button disabled={!canReplace} onClick={() => void handleReplace()}>
							<IconifyIcon icon="lucide:replace" /> Replace pending
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
