import { Icon as IconifyIcon } from "@iconify/react"
import { router } from "@inertiajs/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DataTable from "@/components/table/data-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
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
	const matchingSign =
		pendingAllocated === 0 ||
		(!!statement &&
			((statement.amount > 0 && pendingAllocated > 0) ||
				(statement.amount < 0 && pendingAllocated < 0)))
	const excessAmount =
		statement && matchingSign
			? round2dp(Math.max(0, Math.abs(pendingAllocated) - Math.abs(statement.amount)))
			: 0
	const allocationLabel = pendingStatement
		? `${pendingStatement.allocation_count} ${
				pendingStatement.allocation_count === 1 ? "allocation" : "allocations"
			}`
		: "0 allocations"
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
				<DialogContent className="md:max-w-2xl">
					<DialogHeader className="gap-1">
						<DialogTitle>Confirm statement replacement</DialogTitle>
						<DialogDescription>
							Review the allocation transfer. Finpoint will not change any allocation
							amounts automatically.
						</DialogDescription>
					</DialogHeader>

					{statement && pendingStatement ? (
						<div className="flex flex-col gap-4">
							<div className="grid items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
								<Card size="sm">
									<CardHeader>
										<CardTitle>Pending statement</CardTitle>
										<CardDescription>Deleted after replacement</CardDescription>
										<CardAction>
											<Badge variant="warning">Source</Badge>
										</CardAction>
									</CardHeader>
									<CardContent className="flex flex-1 flex-col gap-3">
										<div className="flex flex-1 flex-col gap-1">
											<p className="whitespace-pre-line break-words font-medium">
												{pendingStatement.description}
											</p>
											<p className="text-muted-foreground">
												{formatDatetime(pendingStatement.datetime)}
											</p>
										</div>
										<div className="grid grid-cols-2 gap-3 border-t pt-3">
											<div className="flex flex-col gap-0.5">
												<span className="text-muted-foreground">
													Statement amount
												</span>
												<span
													className={cn(
														"font-semibold",
														classForCurrency(pendingStatement.amount),
													)}
												>
													{formatCurrency(pendingStatement.amount)}
												</span>
											</div>
											<div className="flex flex-col gap-0.5">
												<span className="text-muted-foreground">
													Moving unchanged
												</span>
												<span
													className={cn(
														"font-semibold",
														classForCurrency(pendingAllocated),
													)}
												>
													{formatCurrency(pendingAllocated)}
												</span>
											</div>
										</div>
										<Badge variant="outline">{allocationLabel}</Badge>
									</CardContent>
								</Card>

								<div className="flex items-center justify-center text-muted-foreground">
									<IconifyIcon
										icon="lucide:arrow-down"
										className="size-4 sm:hidden"
									/>
									<IconifyIcon
										icon="lucide:arrow-right"
										className="hidden size-4 sm:block"
									/>
								</div>

								<Card size="sm">
									<CardHeader>
										<CardTitle>Imported statement</CardTitle>
										<CardDescription>Kept exactly as imported</CardDescription>
										<CardAction>
											<Badge variant="secondary">Destination</Badge>
										</CardAction>
									</CardHeader>
									<CardContent className="flex flex-1 flex-col gap-3">
										<div className="flex flex-1 flex-col gap-1">
											<p className="whitespace-pre-line break-words font-medium">
												{statement.description}
											</p>
											<p className="text-muted-foreground">
												{formatDatetime(statement.datetime)}
											</p>
										</div>
										<div className="grid grid-cols-2 gap-3 border-t pt-3">
											<div className="flex flex-col gap-0.5">
												<span className="text-muted-foreground">
													Statement amount
												</span>
												<span
													className={cn(
														"font-semibold",
														classForCurrency(statement.amount),
													)}
												>
													{formatCurrency(statement.amount)}
												</span>
											</div>
											<div className="flex flex-col gap-0.5">
												<span className="text-muted-foreground">
													Allocated now
												</span>
												<span className="font-semibold">
													{formatCurrency(0)}
												</span>
											</div>
										</div>
										<Badge variant="outline">Fully unallocated</Badge>
									</CardContent>
								</Card>
							</div>

							{canReplace ? (
								<Alert>
									<IconifyIcon icon="lucide:circle-check" />
									<AlertTitle>
										{pendingAllocated === 0
											? "No allocations to transfer"
											: `${allocationLabel} ready to move`}
									</AlertTitle>
									<AlertDescription>
										{pendingAllocated === 0
											? "Replacing will only delete the handwritten pending statement."
											: `${formatCurrency(pendingAllocated)} will move unchanged to the imported statement. The pending statement will then be permanently deleted.`}
									</AlertDescription>
								</Alert>
							) : (
								<Alert variant="destructive">
									<IconifyIcon icon="lucide:circle-alert" />
									<AlertTitle>
										{matchingSign
											? `Over capacity by ${formatCurrency(excessAmount)}`
											: "Allocation direction does not match"}
									</AlertTitle>
									<AlertDescription>
										{matchingSign
											? `${allocationLabel} total ${formatCurrency(pendingAllocated)}, but the imported statement can hold ${formatCurrency(statement.amount)}. Reduce the allocations before replacing.`
											: `The pending allocations total ${formatCurrency(pendingAllocated)}, while the imported statement is ${formatCurrency(statement.amount)}. Their directions must match before replacing.`}
									</AlertDescription>
								</Alert>
							)}
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
							<IconifyIcon icon="lucide:replace" data-icon="inline-start" />
							Transfer & replace
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
