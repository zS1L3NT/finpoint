import { useEffect, useState } from "react"
import { toast } from "sonner"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { classForCurrency, cn, formatCurrency, formatDatetime, pluralize } from "@/lib/utils"
import { getRecord } from "@/logic/records"
import { replacementReview, replacePendingStatement } from "@/logic/statements"
import { ValidationError } from "@/logic/validate"
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
	isOpen,
	setIsOpen,
	onConfirmed,
}: {
	statement: Statement | null
	pendingStatement: Statement | null
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	onConfirmed: () => void
}) {
	const [review, setReview] = useState<ReplacementReview | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		// While closing, keep the last review on screen; it's cleared once the exit completes.
		if (!isOpen) return
		if (!statement || !pendingStatement) {
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
	}, [isOpen, statement, pendingStatement])

	const handleReplace = async () => {
		if (!review?.can_replace || isSubmitting) return

		setIsSubmitting(true)
		try {
			await replacePendingStatement(review.statement.id, review.pending_statement.id)
			toast.success("Pending Statement replaced.", {
				description: "Its Allocations now belong to the imported Statement.",
			})
			setIsSubmitting(false)
			setIsOpen(false)
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
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
			onOpenChangeComplete={opened => {
				if (!opened) {
					setReview(null)
					setError(null)
				}
			}}
		>
			{review !== null || error !== null ? (
				<DialogContent className="md:max-w-xl">
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
						<div className="flex flex-col gap-5">
							<div className="overflow-hidden rounded-xl border">
								<StatementRow
									statement={review.pending_statement}
									label="Pending · removed after replacing"
								/>
								<div className="flex items-center gap-3 px-4 text-muted-foreground">
									<div className="h-px flex-1 bg-border" />
									<IconifyIcon icon="lucide:arrow-down" className="size-4" />
									<div className="h-px flex-1 bg-border" />
								</div>
								<StatementRow
									statement={review.statement}
									label="Imported · kept as is"
								/>
							</div>
							<div className="grid grid-cols-3 gap-3 border-b pb-5 text-xs">
								<div>
									<Amount label="Moving" amount={review.allocated_amount} />
									<p className="mt-1 text-muted-foreground">
										{pluralize(review.allocations.length, "Allocation")}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-muted-foreground">Difference</p>
									<p
										className={cn(
											"font-semibold tabular-nums",
											review.is_exact_amount
												? "text-creative"
												: "text-warning",
										)}
									>
										{review.is_exact_amount
											? "Same amount"
											: formatCurrency(review.amount_difference)}
									</p>
									<p
										className={
											Math.abs(review.day_difference) > 7
												? "text-warning"
												: "text-muted-foreground"
										}
									>
										{dateDifferenceLabel(review.day_difference)}
									</p>
								</div>
								<Amount
									label="Left to allocate afterward"
									amount={review.remaining_allocable_amount}
								/>
							</div>
							{review.allocations.length ? (
								<section className="space-y-3">
									<h3 className="text-sm font-medium">
										{review.can_replace
											? `${pluralize(review.allocations.length, "Allocation")} ready to move`
											: "Affected Records"}
									</h3>
									{review.allocations.map(record => (
										<div
											key={record.id}
											className="flex items-start justify-between gap-3 text-sm"
										>
											<div className="min-w-0">
												<p className="font-medium">{record.title}</p>
												<p className="text-xs text-muted-foreground">
													{record.category.name} ·{" "}
													{formatDatetime(record.datetime)}
												</p>
											</div>
											<span
												className={cn(
													"shrink-0 tabular-nums",
													classForCurrency(record.allocation_amount),
												)}
											>
												{formatCurrency(record.allocation_amount)}
											</span>
										</div>
									))}
								</section>
							) : (
								<p className="text-sm text-muted-foreground">
									No Allocations to transfer.
								</p>
							)}
							{!review.can_replace && (
								<Alert variant="destructive">
									<IconifyIcon icon="lucide:circle-alert" />
									<AlertTitle>This pair cannot be replaced</AlertTitle>
									<AlertDescription>{review.disabled_reason}</AlertDescription>
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
			) : null}
		</Dialog>
	)
}

function StatementRow({ statement, label }: { statement: Statement; label: string }) {
	return (
		<div className="flex items-center justify-between gap-4 p-4">
			<div className="min-w-0 space-y-1">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="break-words text-sm font-medium">{statement.description}</p>
				<p className="text-xs text-muted-foreground">
					{statement.account.name} · {formatDatetime(statement.datetime)}
				</p>
			</div>
			<span
				className={cn(
					"shrink-0 font-semibold tabular-nums",
					classForCurrency(statement.amount),
				)}
			>
				{formatCurrency(statement.amount)}
			</span>
		</div>
	)
}

function Amount({ label, amount }: { label: string; amount: number }) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-muted-foreground">{label}</span>
			<span className={cn("font-semibold tabular-nums", classForCurrency(amount))}>
				{formatCurrency(amount)}
			</span>
		</div>
	)
}

export function dateDifferenceLabel(days: number) {
	if (days === 0) return "Same day"
	return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ${days < 0 ? "earlier" : "later"}`
}
