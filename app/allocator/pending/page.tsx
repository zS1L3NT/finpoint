"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useMemo, useState } from "react"
import StatementReplacementReviewDialog, {
	dateDifferenceLabel,
} from "@/components/dialogs/statement-replacement-review"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import {
	ClearFiltersButton,
	FILTER_CONTROL_CLASS,
	FilterBar,
	FilterSelect,
	filterControlClass,
} from "@/components/table/filter-bar"
import PaginationFooter from "@/components/table/pagination-footer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import WorkflowTabs from "@/components/workflow-tabs"
import { useHistory } from "@/history"
import { useUrlParams } from "@/hooks/use-url-params"
import { cardEnter, SPRING, TRANSITION } from "@/lib/motion"
import {
	classForCurrency,
	cn,
	formatCurrency,
	formatDatetime,
	pluralize,
	round2,
} from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import {
	listStatements,
	replacementCandidates,
	suggestedReplacementCounts,
} from "@/logic/statements"
import { pathStatement } from "@/routes"
import type {
	Paginated,
	PendingReplacementStatement,
	Statement,
	StatementReplacementCandidate,
} from "@/types"

type CandidatePage = Paginated<StatementReplacementCandidate>

export default function AllocatorPendingPage() {
	const { params, setParams } = useUrlParams()
	// The params are optimistic, so the inputs and every change below build on what the user
	// sees, never on a navigation that has not committed yet.
	const queueQuery = params.get("query") ?? ""
	const candidateQuery = params.get("candidate_query") ?? ""
	const accountId = params.get("account_id") ?? "all"
	const candidateScope = params.get("candidate_scope") ?? "suggested"
	const candidatePage = parsePage(params.get("candidate_page"))
	const pendingStatementId = params.get("pending_statement_id")
	const [reviewStatement, setReviewStatement] = useState<Statement | null>(null)

	// A new queue search abandons the selection and its candidate search in the same
	// navigation. The first keystroke starts a search (one Back undoes it); refining it replaces
	// that entry, unless a selection is being cleared, which Back should restore.
	const handleQueueQuery = (value: string) =>
		setParams(
			{
				query: value || null,
				page: null,
				pending_statement_id: null,
				candidate_page: null,
				candidate_query: null,
			},
			{ replace: url => !!url.get("query") && !url.get("pending_statement_id") },
		)

	const handleCandidateQuery = (value: string) =>
		setParams(
			{ candidate_query: value || null, candidate_page: null },
			{ replace: url => !!url.get("candidate_query") },
		)

	const accounts = useLiveQuery(() => listAccounts(), []) ?? []
	const pendingQuery = useLiveQuery(
		() =>
			listStatements({
				query: queueQuery || null,
				account_id: accountId === "all" ? null : accountId,
				is_pending: true,
			}),
		[queueQuery, accountId],
	)
	const pending = pendingQuery ?? []
	const allPending = useLiveQuery(() => listStatements({ is_pending: true }), [])
	const sortedPending = useMemo(
		() =>
			[...pending].sort(
				(a, b) => a.datetime.localeCompare(b.datetime) || a.id.localeCompare(b.id),
			),
		[pending],
	)
	const queuePage = parsePage(params.get("page"))
	const queuePageSize = parsePageSize(params.get("per_page"), 25)
	const pendingPage = useMemo(
		() => paginateItems(sortedPending, queuePage, queuePageSize),
		[sortedPending, queuePage, queuePageSize],
	)
	const pageIds = pendingPage.data.map(statement => statement.id)
	const suggestionCounts =
		useLiveQuery(() => suggestedReplacementCounts(pageIds), [pageIds.join(",")]) ?? {}
	const pendingStatements: Paginated<PendingReplacementStatement> = {
		...pendingPage,
		data: pendingPage.data.map(statement => ({
			...statement,
			suggestion_count: suggestionCounts[statement.id] ?? 0,
		})),
	}

	const selectedPendingStatement = pendingStatementId
		? (allPending?.find(statement => statement.id === pendingStatementId) ?? null)
		: null
	const selectionMissing =
		!!pendingStatementId && allPending !== undefined && !selectedPendingStatement

	const candidates = useLiveQuery(
		(): Promise<{ data: CandidatePage | null; error: string | null }> =>
			selectedPendingStatement
				? replacementCandidates(selectedPendingStatement.id, {
						query: candidateQuery || undefined,
						scope: candidateScope === "all" ? "all" : "suggested",
						page: candidatePage,
						per_page: 25,
					}).then(
						data => ({ data, error: null }),
						cause => ({
							data: null,
							error:
								cause instanceof Error ? cause.message : "Unable to load imports.",
						}),
					)
				: Promise.resolve({ data: null, error: null }),
		[selectedPendingStatement?.id, candidateQuery, candidateScope, candidatePage],
	)

	const selectPending = (statement: PendingReplacementStatement | null) => {
		setReviewStatement(null)
		setParams({
			page: null,
			pending_statement_id: statement?.id ?? null,
			candidate_page: null,
			candidate_query: null,
		})
	}

	const clearQueueFilters = () =>
		setParams(Object.fromEntries([...params.keys()].map(key => [key, null])))
	const activeFilterCount = [queueQuery, accountId === "all" ? "" : accountId].filter(
		Boolean,
	).length
	const afterReplacement = () => {
		const selectedIndex = pendingStatements.data.findIndex(
			s => s.id === selectedPendingStatement?.id,
		)
		const next =
			pendingStatements.data[selectedIndex + 1] ?? pendingStatements.data[selectedIndex - 1]
		setReviewStatement(null)
		setParams({
			candidate_query: null,
			candidate_page: null,
			pending_statement_id: next?.id ?? null,
			...(!next && pendingStatements.current_page > 1
				? { page: String(pendingStatements.current_page - 1) }
				: {}),
		})
	}

	return (
		<>
			<PageContent>
				<PageHeader
					title="Workflows"
					subtitle="Replace pending statements with imported activity."
					description="Statement replacement"
					icon="lucide:replace"
				/>
				<WorkflowTabs active="replace" />

				{selectionMissing ? (
					<Alert>
						<IconifyIcon icon="lucide:info" />
						<AlertTitle>Pending Statement unavailable</AlertTitle>
						<AlertDescription>
							It may already have been replaced or deleted. Choose another pending
							Statement.
						</AlertDescription>
					</Alert>
				) : null}

				<div className="grid min-w-0 gap-4 @4xl/page:grid-cols-[minmax(18rem,2fr)_minmax(0,3fr)]">
					<section
						className={cn(
							"relative min-w-0 flex-col gap-4",
							selectedPendingStatement ? "hidden @4xl/page:flex" : "flex",
						)}
						aria-label="Pending statements"
					>
						<div className="flex flex-col gap-2">
							<Input
								placeholder="Search descriptions..."
								value={queueQuery}
								onChange={event => handleQueueQuery(event.target.value)}
							/>
							<FilterBar>
								<FilterSelect
									name="account"
									icon="lucide:landmark"
									value={accountId === "all" ? null : accountId}
									onValueChange={value =>
										setParams({
											account_id: value,
											page: null,
											pending_statement_id: null,
											candidate_query: null,
											candidate_page: null,
										})
									}
								>
									<SelectItem value="all">All Accounts</SelectItem>
									{accounts.map(account => (
										<SelectItem key={account.id} value={account.id}>
											{account.name}
										</SelectItem>
									))}
								</FilterSelect>
								<ClearFiltersButton
									count={activeFilterCount}
									onClear={clearQueueFilters}
								/>
							</FilterBar>
						</div>

						{pendingStatements.data.length ? (
							<div className="flex flex-col gap-2">
								<AnimatePresence mode="popLayout">
									{pendingStatements.data.map((statement, index) => (
										<motion.div
											layout="position"
											key={statement.id}
											{...cardEnter(index)}
											data-slot="pending-queue-item"
											exit={{
												opacity: 0,
												scale: 0.97,
												transition: TRANSITION.fast,
											}}
											transition={{
												...cardEnter(index).transition,
												layout: SPRING.snappy,
											}}
										>
											<PendingCard
												statement={statement}
												selected={
													statement.id === selectedPendingStatement?.id
												}
												onSelect={() => selectPending(statement)}
											/>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						) : pendingQuery === undefined ? null : (
							<Empty className="border">
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<IconifyIcon icon="lucide:inbox" />
									</EmptyMedia>
									<EmptyTitle>No pending Statements</EmptyTitle>
									<EmptyDescription>
										{activeFilterCount
											? "No pending Statements match these filters."
											: "Every Statement has been imported or replaced."}
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						)}

						{pendingQuery !== undefined && (
							<PaginationFooter
								summary={`Showing ${pendingStatements.data.length} of ${pluralize(pendingStatements.total, "pending Statement")}.`}
								page={pendingStatements.current_page}
								lastPage={pendingStatements.last_page}
							/>
						)}
					</section>

					<section
						className={cn(
							"min-w-0 flex-col gap-4",
							selectedPendingStatement ? "flex" : "hidden @4xl/page:flex",
						)}
						aria-labelledby="candidate-title"
					>
						{/* popLayout crossfades in place: working down the queue never waits on an exit. */}
						<AnimatePresence mode="popLayout" initial={false}>
							{selectedPendingStatement ? (
								<motion.div
									key={selectedPendingStatement.id}
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -6, transition: TRANSITION.fast }}
									transition={TRANSITION.base}
									className="flex flex-col gap-4"
								>
									<Button
										variant="outline"
										className="w-fit @4xl/page:hidden"
										onClick={() => selectPending(null)}
									>
										<IconifyIcon
											icon="lucide:arrow-left"
											data-icon="inline-start"
										/>
										Back to pending Statements
									</Button>
									<div className="flex flex-col gap-2">
										<div className="grid gap-3 rounded-xl border bg-muted/20 p-3">
											<p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
												<IconifyIcon
													icon="lucide:circle-dashed"
													className="size-3.5"
												/>
												<Badge variant="secondary">Pending</Badge>
												<span>Replacing pending Statement</span>
											</p>
											<div className="flex items-start justify-between gap-3">
												<div className="min-w-0">
													<p className="truncate text-sm font-semibold">
														{selectedPendingStatement.description}
													</p>
													<p className="text-xs text-muted-foreground">
														{selectedPendingStatement.account.name} ·{" "}
														{formatDatetime(
															selectedPendingStatement.datetime,
														)}{" "}
														·{" "}
														{selectedPendingStatement.allocation_count}{" "}
														Allocation
														{selectedPendingStatement.allocation_count ===
														1
															? ""
															: "s"}{" "}
														carry over
													</p>
												</div>
												<span
													className={cn(
														"shrink-0 text-lg font-semibold tracking-tight tabular-nums",
														classForCurrency(
															selectedPendingStatement.amount,
														),
													)}
												>
													{formatCurrency(
														selectedPendingStatement.amount,
													)}
												</span>
											</div>
										</div>
										<h3
											id="candidate-title"
											className="font-heading text-sm font-semibold"
										>
											Imported Statements it could become
										</h3>
										<div className="relative">
											<IconifyIcon
												icon="lucide:search"
												className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
											/>
											<Input
												placeholder="Search descriptions..."
												className={cn(
													"pl-8",
													filterControlClass(!!candidateQuery),
												)}
												value={candidateQuery}
												onChange={event =>
													handleCandidateQuery(event.target.value)
												}
											/>
										</div>
										<FilterBar>
											<div>
												<Select
													value={candidateScope}
													onValueChange={value =>
														setParams({
															candidate_scope:
																value === "suggested"
																	? null
																	: value,
															candidate_page: null,
														})
													}
												>
													<SelectTrigger
														className={cn(
															"w-full",
															FILTER_CONTROL_CLASS,
														)}
													>
														<IconifyIcon icon="lucide:list-filter" />
														<SelectValue className="flex-1 text-left" />
													</SelectTrigger>
													<SelectContent align="start" variant="filter">
														<SelectGroup>
															<SelectItem value="suggested">
																Suggested replacements
															</SelectItem>
															<SelectItem value="all">
																All unallocated imports
															</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
											</div>
											{candidateScope === "suggested" ? (
												<span className="col-span-2 self-center text-xs/relaxed text-muted-foreground">
													Within 7 days · up to $5 difference
												</span>
											) : null}
										</FilterBar>
									</div>

									<CandidateResults
										data={candidates?.data ?? null}
										error={candidates?.error ?? null}
										scope={candidateScope}
										onReview={setReviewStatement}
										onPage={page =>
											setParams({
												candidate_page: page === 1 ? null : String(page),
											})
										}
									/>
								</motion.div>
							) : (
								<motion.div
									key="empty"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -4, transition: TRANSITION.fast }}
									transition={TRANSITION.base}
								>
									<Empty className="items-start p-4 text-left">
										<EmptyHeader>
											<EmptyMedia variant="icon">
												<IconifyIcon icon="lucide:replace" />
											</EmptyMedia>
											<EmptyTitle>Select a pending Statement</EmptyTitle>
											<EmptyDescription>
												Choose a placeholder to see nearby imported
												Statements that can inherit its Allocations.
											</EmptyDescription>
										</EmptyHeader>
									</Empty>
								</motion.div>
							)}
						</AnimatePresence>
					</section>
				</div>
			</PageContent>

			<StatementReplacementReviewDialog
				statement={reviewStatement}
				pendingStatement={selectedPendingStatement}
				isOpen={!!reviewStatement}
				setIsOpen={open => {
					if (!open) setReviewStatement(null)
				}}
				onConfirmed={afterReplacement}
			/>
		</>
	)
}

function PendingCard({
	statement,
	selected,
	onSelect,
}: {
	statement: PendingReplacementStatement
	selected: boolean
	onSelect: () => void
}) {
	const allocated = round2(statement.amount - statement.allocable_amount)
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={selected}
			className={cn(
				"group grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 rounded-lg border bg-card px-3 py-2.5 text-left transition-colors duration-150 ease-out hover:bg-muted/50",
				selected && "border-primary bg-muted ring-1 ring-primary/50",
			)}
		>
			<span className="min-w-0">
				<span className="block truncate text-sm font-medium">{statement.description}</span>
				<span className="block truncate text-xs text-muted-foreground">
					{statement.account.name} · {formatDatetime(statement.datetime)}
				</span>
			</span>
			<span className="flex items-center gap-1">
				<span
					className={cn(
						"text-sm font-semibold tabular-nums",
						classForCurrency(statement.amount),
					)}
				>
					{formatCurrency(statement.amount)}
				</span>
				<IconifyIcon
					icon="lucide:chevron-right"
					className={cn(
						"size-4 text-muted-foreground transition-transform duration-200 ease-out",
						selected && "translate-x-0.5 text-foreground",
					)}
				/>
			</span>
			<span className="col-span-2 flex flex-wrap gap-1.5 text-[0.6875rem] text-muted-foreground">
				<span>
					{statement.allocation_count} Allocation
					{statement.allocation_count === 1 ? "" : "s"} · {formatCurrency(allocated)}
				</span>
				<span aria-hidden>·</span>
				<span
					className={cn(
						"font-medium",
						statement.suggestion_count
							? "text-emerald-700 dark:text-emerald-400"
							: "text-muted-foreground",
					)}
				>
					{statement.suggestion_count
						? `${statement.suggestion_count} suggested match${statement.suggestion_count === 1 ? "" : "es"}`
						: "No suggested match"}
				</span>
			</span>
		</button>
	)
}

function CandidateResults({
	data,
	error,
	scope,
	onReview,
	onPage,
}: {
	data: CandidatePage | null
	error: string | null
	scope: string
	onReview: (statement: Statement) => void
	onPage: (page: number) => void
}) {
	const { handlePush } = useHistory()
	const initial = { opacity: 0, y: 6 }
	const transition = TRANSITION.base
	if (error)
		return (
			<motion.div initial={initial} animate={{ opacity: 1, y: 0 }} transition={transition}>
				<Alert variant="destructive">
					<IconifyIcon icon="lucide:circle-alert" />
					<AlertTitle>Imports unavailable</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</motion.div>
		)
	if (!data) return null
	if (!data.data.length)
		return (
			<motion.div initial={initial} animate={{ opacity: 1, y: 0 }} transition={transition}>
				<Empty className="border">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<IconifyIcon icon="lucide:search-x" />
						</EmptyMedia>
						<EmptyTitle>
							{scope === "suggested"
								? "No suggested replacements"
								: "No unallocated imports"}
						</EmptyTitle>
						<EmptyDescription>
							{scope === "suggested"
								? "Search by description or browse all unallocated imports for this Account."
								: "No imported Statements match this search."}
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</motion.div>
		)

	const lastPage = Math.max(1, Math.ceil(data.total / data.per_page))
	return (
		<motion.div
			initial={initial}
			animate={{ opacity: 1, y: 0 }}
			transition={transition}
			className="flex flex-col gap-3"
		>
			<div className="flex flex-col gap-2">
				{data.data.map((statement, index) => (
					<motion.div
						key={statement.id}
						data-slot="pending-candidate-item"
						layout="position"
						{...cardEnter(index)}
						transition={{ ...cardEnter(index).transition, layout: SPRING.snappy }}
					>
						<div
							className={cn(
								"grid gap-3 rounded-lg border bg-card p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
								statement.can_replace &&
									statement.is_exact_amount &&
									"border-emerald-500/40 bg-emerald-500/5",
							)}
						>
							<div className="min-w-0">
								<div className="flex items-center justify-between gap-3">
									<p className="truncate text-sm font-medium">
										{statement.description}
									</p>
									<span
										className={cn(
											"shrink-0 text-sm font-semibold tabular-nums",
											classForCurrency(statement.amount),
										)}
									>
										{formatCurrency(statement.amount)}
									</span>
								</div>
								<div className="mt-1 flex flex-wrap items-center gap-1.5 text-[0.6875rem]">
									<span className="text-muted-foreground">
										{formatDatetime(statement.datetime)}
									</span>
									<span
										className={cn(statement.is_exact_amount && "text-creative")}
									>
										{statement.is_exact_amount
											? "Same amount"
											: `${formatCurrency(statement.amount_difference)} difference`}
									</span>
									<span className="text-muted-foreground">
										· {dateDifferenceLabel(statement.day_difference)}
									</span>
								</div>
								<p
									className={cn(
										"mt-1.5 text-xs",
										statement.disabled_reason
											? "text-destructive"
											: "text-muted-foreground",
									)}
								>
									{statement.disabled_reason}
								</p>
							</div>
							<div className="flex items-center justify-end gap-1">
								<Button
									variant="ghost"
									size="icon-sm"
									title="Open Statement"
									asChild
								>
									<Link
										href={pathStatement(statement.id)}
										aria-label="Open Statement"
										onClick={handlePush("Allocator")}
									>
										<IconifyIcon icon="lucide:external-link" />
									</Link>
								</Button>
								<Button
									size="sm"
									disabled={!statement.can_replace}
									onClick={() => onReview(statement)}
								>
									<IconifyIcon icon="lucide:replace" data-icon="inline-start" />
									Replace
								</Button>
							</div>
						</div>
					</motion.div>
				))}
			</div>
			<div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
				<span>
					Showing {data.data.length} of {pluralize(data.total, "imported Statement")}.
				</span>
				<div className="flex gap-1.5">
					<Button
						variant="outline"
						size="sm"
						disabled={data.current_page <= 1}
						onClick={() => onPage(data.current_page - 1)}
					>
						<IconifyIcon icon="lucide:chevron-left" data-icon="inline-start" />
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={data.current_page >= lastPage}
						onClick={() => onPage(data.current_page + 1)}
					>
						Next
						<IconifyIcon icon="lucide:chevron-right" data-icon="inline-end" />
					</Button>
				</div>
			</div>
		</motion.div>
	)
}
