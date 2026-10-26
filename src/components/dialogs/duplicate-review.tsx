import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { useState } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
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
import { classForCurrency, cn, formatCurrency, formatDatetime, pluralize } from "@/lib/utils"
import {
	allocationOutcome,
	duplicateReview,
	type FixDuplicatesInput,
	fixDuplicates,
} from "@/logic/duplicates"
import { pathRecord } from "@/routes"

export default function DuplicateReviewDialog({
	input,
	isOpen,
	setIsOpen,
	onFixed,
}: {
	input: FixDuplicatesInput | null
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	onFixed: () => void
}) {
	const review = useLiveQuery(
		() =>
			input ? duplicateReview([input.keep_id, ...input.delete_ids]) : Promise.resolve(null),
		[input?.keep_id, input?.delete_ids.join(",")],
	)
	const [source, setSource] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState("")
	const [snapshot, setSnapshot] = useState<{
		input: FixDuplicatesInput
		review: Awaited<ReturnType<typeof duplicateReview>>
	} | null>(null)

	// Mount the popup only once the review for the CURRENT input resolves;
	// a cold read arriving after an empty shell would shift the footer.
	const inputIds = input ? [input.keep_id, ...input.delete_ids] : null
	const reviewReady =
		!!input &&
		!!review &&
		review.statements.length === inputIds?.length &&
		!!inputIds?.every(id => review.statements.some(s => s.id === id))
	// The page clears input synchronously on close; keep the last ready pair
	// so the popup and backdrop stay mounted for the exit fade. Reopening
	// with a new input stays empty until its own review resolves (no stale).
	if (isOpen && reviewReady && input && review) {
		if (snapshot?.input !== input || snapshot?.review !== review) setSnapshot({ input, review })
	}
	const displayInput = isOpen ? input : (snapshot?.input ?? null)
	const displayReview = isOpen ? review : (snapshot?.review ?? null)
	const showContent = isOpen ? reviewReady : snapshot !== null

	const {
		keptAllocated,
		sources,
		mustChoose,
		source: effectiveSource,
	} = allocationOutcome(
		displayInput?.keep_id ?? "",
		displayReview?.allocations ?? [],
		source || undefined,
	)
	const kept = displayReview?.statements.find(s => s.id === displayInput?.keep_id)
	const deleted = displayReview?.statements.filter(s => s.id !== displayInput?.keep_id) ?? []
	const countFor = (id: string) =>
		displayReview?.allocations.filter(a => a.statement_id === id).length ?? 0
	const descriptionFor = (id: string) =>
		displayReview?.statements.find(s => s.id === id)?.description

	const handleConfirm = async () => {
		if (!input || isSubmitting || (mustChoose && !source)) return

		setIsSubmitting(true)
		setError("")
		try {
			await fixDuplicates({ ...input, allocation_source_id: effectiveSource })
			setIsOpen(false)
			onFixed()
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Unable to fix duplicates.")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={next => {
				if (!next && isSubmitting) return
				setIsOpen(next)
			}}
			onOpenChangeComplete={opened => {
				if (!opened) {
					setSource("")
					setError("")
					setSnapshot(null)
				}
			}}
		>
			{showContent ? (
				<DialogContent className="md:max-w-2xl">
					<DialogHeader className="gap-1">
						<DialogTitle>Delete duplicate Statements</DialogTitle>
						<DialogDescription>
							The kept Statement stays unchanged. Deleted descriptions are not
							remembered; an old export can recreate them. Records stay intact.
						</DialogDescription>
					</DialogHeader>

					{displayReview ? (
						<div className="flex flex-col gap-4">
							{kept ? (
								<section className="flex flex-col gap-2">
									<h3 className="font-medium">Keep</h3>
									<StatementTile
										tone="keep"
										description={kept.description}
										datetime={kept.datetime}
										allocationCount={countFor(kept.id)}
									/>
								</section>
							) : null}

							<section className="flex flex-col gap-2">
								<h3 className="font-medium">Delete</h3>
								{deleted.map(s => (
									<StatementTile
										key={s.id}
										tone="delete"
										description={s.description}
										datetime={s.datetime}
										allocationCount={countFor(s.id)}
									/>
								))}
							</section>

							<Alert>
								<IconifyIcon icon="lucide:info" />
								<AlertTitle>Allocations</AlertTitle>
								<AlertDescription>
									{keptAllocated
										? "Keep the kept Statement’s Allocations. Remove every deleted Statement’s Allocations."
										: sources.length === 0
											? "No Allocations to move or remove."
											: sources.length === 1
												? "Move the duplicate’s Allocations to the kept Statement."
												: "Choose one Statement’s Allocations to move. All other deleted Statements’ Allocations will be removed."}
								</AlertDescription>
							</Alert>

							{mustChoose ? (
								<fieldset className="flex flex-col gap-2">
									<legend className="mb-2 font-medium">Allocation source</legend>
									{sources.map(id => {
										const statement = displayReview.statements.find(
											s => s.id === id,
										)
										return (
											<StatementTile
												key={id}
												tone="keep"
												selected={source === id}
												onSelect={() => setSource(id)}
												description={statement?.description ?? ""}
												datetime={statement?.datetime}
												allocationCount={countFor(id)}
											/>
										)
									})}
								</fieldset>
							) : null}

							<Card size="sm">
								<CardHeader>
									<CardTitle>Affected Records</CardTitle>
									<CardDescription>
										Records stay; only their Allocations to these Statements
										change.
									</CardDescription>
									<CardAction>
										<Badge variant="outline">
											{displayReview.records.length}
										</Badge>
									</CardAction>
								</CardHeader>
								<CardContent className="flex flex-col gap-3">
									{displayReview.records.length ? (
										displayReview.records.map(record => (
											<div
												key={record.id}
												className="flex items-start justify-between gap-3"
											>
												<Link
													href={pathRecord(record.id)}
													className="min-w-0 break-words font-medium underline-offset-4 hover:underline"
												>
													{record.title}
												</Link>
												<div className="flex shrink-0 flex-col items-end gap-1">
													{displayReview.allocations
														.filter(a => a.record_id === record.id)
														.map(a => (
															<div
																key={a.statement_id}
																title={descriptionFor(
																	a.statement_id,
																)}
																className="flex items-center gap-2"
															>
																<Badge
																	variant={
																		a.statement_id ===
																		effectiveSource
																			? "secondary"
																			: "outline"
																	}
																	className={
																		a.statement_id ===
																		effectiveSource
																			? undefined
																			: "border-destructive/40 text-destructive"
																	}
																>
																	{a.statement_id !==
																	effectiveSource
																		? "Removed"
																		: a.statement_id ===
																				displayInput?.keep_id
																			? "Stays"
																			: "Moves"}
																</Badge>
																<span
																	className={cn(
																		"font-medium tabular-nums",
																		classForCurrency(a.amount),
																	)}
																>
																	{formatCurrency(a.amount)}
																</span>
															</div>
														))}
												</div>
											</div>
										))
									) : (
										<p className="text-muted-foreground">
											No affected Records.
										</p>
									)}
								</CardContent>
							</Card>

							{error ? (
								<Alert variant="destructive">
									<IconifyIcon icon="lucide:circle-alert" />
									<AlertTitle>Unable to delete</AlertTitle>
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							) : null}
						</div>
					) : null}

					<DialogFooter>
						<DialogClose
							render={
								<Button type="button" variant="outline" disabled={isSubmitting}>
									Cancel
								</Button>
							}
						/>
						<Button
							variant="destructive"
							disabled={!displayReview || isSubmitting || (mustChoose && !source)}
							onClick={() => void handleConfirm()}
						>
							<IconifyIcon
								icon={isSubmitting ? "lucide:loader-circle" : "lucide:trash-2"}
								className={isSubmitting ? "animate-spin" : undefined}
								data-icon="inline-start"
							/>
							Delete {pluralize(displayInput?.delete_ids.length ?? 0, "Statement")}
						</Button>
					</DialogFooter>
				</DialogContent>
			) : null}
		</Dialog>
	)
}

function StatementTile({
	tone,
	description,
	datetime,
	allocationCount,
	selected,
	onSelect,
}: {
	tone: "keep" | "delete"
	description: string
	datetime?: string
	allocationCount: number
	selected?: boolean
	onSelect?: () => void
}) {
	const content = (
		<>
			<p className="whitespace-pre-wrap break-words font-medium">{description}</p>
			<div className="flex flex-wrap items-center gap-2 text-muted-foreground">
				{datetime ? <span>{formatDatetime(datetime)}</span> : null}
				<Badge variant="outline">{pluralize(allocationCount, "Allocation")}</Badge>
			</div>
		</>
	)
	const tint =
		tone === "keep"
			? "border-emerald-500/40 bg-emerald-500/5"
			: "border-destructive/40 bg-destructive/5"

	if (!onSelect)
		return (
			<div className={cn("flex flex-col gap-1 rounded-lg border p-3", tint)}>{content}</div>
		)

	return (
		<button
			type="button"
			aria-pressed={selected}
			onClick={onSelect}
			className={cn(
				"flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors hover:bg-emerald-500/10",
				selected ? tint : "border-border",
				selected && "ring-2 ring-emerald-500/40",
			)}
		>
			{content}
		</button>
	)
}
