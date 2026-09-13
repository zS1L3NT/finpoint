import { Icon as IconifyIcon } from "@iconify/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { classForCurrency, cn, formatCurrency, formatDatetime } from "@/lib/utils"
import { getRecord } from "@/logic/records"
import { ValidationError } from "@/logic/shared"
import { replacementReview, replacePendingStatement } from "@/logic/statements"
import type { Statement } from "@/types"

type ReviewAllocation = Awaited<ReturnType<typeof getRecord>> & {
	allocation_amount: number
}
type ReplacementReview = Omit<Awaited<ReturnType<typeof replacementReview>>, "allocations"> & {
	allocations: ReviewAllocation[]
}

export default function StatementReplacementReviewDialog({
	statement,
	pendingStatement,
	open,
	onOpenChange,
	onConfirmed,
}: {
	statement: Statement | null
	pendingStatement: Statement | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirmed: () => void
}) {
	const [review, setReview] = useState<ReplacementReview | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		if (!open || !statement || !pendingStatement) {
			setReview(null)
			setError(null)
			return
		}

		let cancelled = false
		setReview(null)
		setError(null)
		replacementReview(pendingStatement.id, statement.id).then(
			result => {
				void (async () => {
					try {
						const allocations = await Promise.all(
							result.allocations.map(async allocation => ({
								...(await getRecord(allocation.id)),
								allocation_amount: allocation.allocation_amount,
							})),
						)
						if (!cancelled) setReview({ ...result, allocations })
					} catch (fetchError) {
						if (cancelled) return
						setError(
							fetchError instanceof Error
								? fetchError.message
								: "The replacement could not be reviewed.",
						)
					}
				})()
			},
			(fetchError: unknown) => {
				if (cancelled) return
				if (fetchError instanceof ValidationError) {
					setError(
						Object.values(fetchError.errors)[0]?.[0] ??
							"The replacement could not be reviewed.",
					)
				} else if (fetchError instanceof Error) {
					setError(fetchError.message)
				} else {
					setError("The replacement could not be reviewed.")
				}
			},
		)

		return () => {
			cancelled = true
		}
	}, [open, statement, pendingStatement])

	const handleReplace = async () => {
		if (!review?.can_replace || isSubmitting) return

		setIsSubmitting(true)
		try {
			await replacePendingStatement(review.statement.id, review.pending_statement.id)
			toast.success("Pending Statement replaced.", {
				description: "Its Allocations now belong to the imported Statement.",
			})
			setIsSubmitting(false)
			onOpenChange(false)
			onConfirmed()
		} catch (cause) {
			const message =
				cause instanceof ValidationError
					? (Object.values(cause.errors)[0]?.[0] ??
						"The Statements changed while you were reviewing them. Refresh the pair and try again.")
					: "The Statements changed while you were reviewing them. Refresh the pair and try again."
			toast.error("Pending Statement could not be replaced.", { description: message })
			setIsSubmitting(false)
			setReview(null)
			setError(message)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="md:max-w-3xl">
				<DialogHeader className="gap-1">
					<DialogTitle>Review Statement replacement</DialogTitle>
					<DialogDescription>
						Confirm which imported Statement will inherit the pending Statement’s
						Allocations.
					</DialogDescription>
				</DialogHeader>

				{error ? (
					<Alert variant="destructive">
						<IconifyIcon icon="lucide:circle-alert" />
						<AlertTitle>Review unavailable</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				) : review ? (
					<div className="flex flex-col gap-4">
						<div className="grid items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
							<StatementCard
								label="Pending Statement"
								description="Deleted after replacement"
								badge="Source"
								statement={review.pending_statement}
								secondaryLabel="Moving unchanged"
								secondaryAmount={review.allocated_amount}
							/>
							<div className="flex items-center justify-center text-muted-foreground">
								<IconifyIcon icon="lucide:arrow-down" className="sm:hidden" />
								<IconifyIcon
									icon="lucide:arrow-right"
									className="hidden sm:block"
								/>
							</div>
							<StatementCard
								label="Imported Statement"
								description="Kept exactly as imported"
								badge="Destination"
								statement={review.statement}
								secondaryLabel="Allocable afterward"
								secondaryAmount={review.remaining_allocable_amount}
							/>
						</div>

						<div className="flex flex-wrap gap-1.5">
							<Badge variant={review.is_exact_amount ? "secondary" : "warning"}>
								{review.is_exact_amount
									? "Same amount"
									: `${formatCurrency(review.amount_difference)} amount difference`}
							</Badge>
							<Badge
								variant={
									Math.abs(review.day_difference) <= 7 ? "outline" : "warning"
								}
							>
								{dateDifferenceLabel(review.day_difference)}
							</Badge>
						</div>

						{review.allocations.length ? (
							<Card size="sm">
								<CardHeader>
									<CardTitle>Affected Records</CardTitle>
									<CardDescription>
										These Allocation amounts and Record associations will remain
										unchanged.
									</CardDescription>
									<CardAction>
										<Badge variant="outline">{review.allocations.length}</Badge>
									</CardAction>
								</CardHeader>
								<CardContent className="flex flex-col gap-2">
									{review.allocations.map(record => (
										<div
											key={record.id}
											className="flex items-start justify-between gap-3"
										>
											<div className="min-w-0">
												<p className="truncate font-medium">
													{record.title}
												</p>
												<p className="truncate text-muted-foreground">
													{record.category.name} ·{" "}
													{formatDatetime(record.datetime)}
												</p>
											</div>
											<span
												className={cn(
													"shrink-0 font-medium",
													classForCurrency(record.allocation_amount),
												)}
											>
												{formatCurrency(record.allocation_amount)}
											</span>
										</div>
									))}
								</CardContent>
							</Card>
						) : null}

						<Alert variant={review.can_replace ? "default" : "destructive"}>
							<IconifyIcon
								icon={
									review.can_replace
										? "lucide:circle-check"
										: "lucide:circle-alert"
								}
							/>
							<AlertTitle>
								{review.can_replace
									? review.allocations.length
										? `${review.allocations.length} Allocation${review.allocations.length === 1 ? "" : "s"} ready to move`
										: "No Allocations to transfer"
									: "This pair cannot be replaced"}
							</AlertTitle>
							<AlertDescription>
								{review.can_replace
									? review.allocations.length
										? `${formatCurrency(review.allocated_amount)} will move unchanged. The pending placeholder will then be deleted.`
										: "Replacing will delete the pending placeholder. The imported Statement will remain unallocated."
									: review.disabled_reason}
							</AlertDescription>
						</Alert>
					</div>
				) : (
					<div className="grid gap-3 sm:grid-cols-2">
						<Skeleton className="h-48" />
						<Skeleton className="h-48" />
					</div>
				)}

				<DialogFooter>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button
						disabled={!review?.can_replace || isSubmitting}
						onClick={() => void handleReplace()}
					>
						<IconifyIcon
							icon={isSubmitting ? "lucide:loader-circle" : "lucide:replace"}
							className={isSubmitting ? "animate-spin" : undefined}
							data-icon="inline-start"
						/>
						Replace pending Statement
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function StatementCard({
	label,
	description,
	badge,
	statement,
	secondaryLabel,
	secondaryAmount,
}: {
	label: string
	description: string
	badge: string
	statement: Statement
	secondaryLabel: string
	secondaryAmount: number
}) {
	return (
		<Card size="sm">
			<CardHeader>
				<CardTitle>{label}</CardTitle>
				<CardDescription>{description}</CardDescription>
				<CardAction>
					<Badge variant={statement.is_pending ? "warning" : "secondary"}>{badge}</Badge>
				</CardAction>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-3">
				<div className="flex flex-1 flex-col gap-1">
					<p className="whitespace-pre-line break-words font-medium">
						{statement.description}
					</p>
					<p className="text-muted-foreground">{statement.account.name}</p>
					<p className="text-muted-foreground">{formatDatetime(statement.datetime)}</p>
				</div>
				<Separator />
				<div className="grid grid-cols-2 gap-3">
					<Amount label="Statement amount" amount={statement.amount} />
					<Amount label={secondaryLabel} amount={secondaryAmount} />
				</div>
			</CardContent>
			<CardFooter>
				<Badge variant="outline">
					{statement.allocation_count} Allocation
					{statement.allocation_count === 1 ? "" : "s"}
				</Badge>
			</CardFooter>
		</Card>
	)
}

function Amount({ label, amount }: { label: string; amount: number }) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-muted-foreground">{label}</span>
			<span className={cn("font-semibold", classForCurrency(amount))}>
				{formatCurrency(amount)}
			</span>
		</div>
	)
}

export function dateDifferenceLabel(days: number) {
	if (days === 0) return "Same day"
	return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ${days < 0 ? "earlier" : "later"}`
}
