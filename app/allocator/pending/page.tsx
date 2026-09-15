"use client"

export const dynamic = "force-dynamic"

import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import AllocatorTabs from "@/components/allocator-tabs"
import StatementReplacementReviewDialog, {
	dateDifferenceLabel,
} from "@/components/dialogs/statement-replacement-review"
import { UiIcon as IconifyIcon } from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { ClearFiltersButton, FILTER_CONTROL_CLASS, FilterBar } from "@/components/table/filter-bar"
import PaginationFooter from "@/components/table/pagination-footer"
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
import { useHistory } from "@/history"
import { classForCurrency, cn, formatCurrency, formatDatetime, round2dp } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { replacementComparison, replacementReason, sameDirection } from "@/logic/replacements"
import { listStatements, replacementCandidates } from "@/logic/statements"
import { pathStatement } from "@/routes"
import type {
	Paginated,
	PendingReplacementStatement,
	Statement,
	StatementReplacementCandidate,
} from "@/types"

type CandidatePage = Paginated<StatementReplacementCandidate>

export default function AllocatorPendingPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const pushParams = (next: URLSearchParams) => {
		const suffix = next.toString()
		router.push(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false })
	}
	const setSearchParams = (init: URLSearchParams | Record<string, string>) => {
		if (init instanceof URLSearchParams) {
			pushParams(init)
			return
		}
		const next = new URLSearchParams()
		for (const [key, value] of Object.entries(init)) {
			if (value !== undefined && value !== "") next.set(key, value)
		}
		pushParams(next)
	}
	const queueQueryParam = searchParams.get("query") ?? ""
	const candidateQueryParam = searchParams.get("candidate_query") ?? ""
	const accountId = searchParams.get("account_id") ?? "all"
	const candidateScope = searchParams.get("candidate_scope") ?? "suggested"
	const candidatePage = parsePage(searchParams.get("candidate_page"))
	const pendingStatementId = searchParams.get("pending_statement_id")
	const [queueQuery, setQueueQuery] = useState(queueQueryParam)
	const [candidateQuery, setCandidateQuery] = useState(candidateQueryParam)
	const [reviewStatement, setReviewStatement] = useState<Statement | null>(null)
	const reduceMotion = useReducedMotion()

	const updateParams = (
		changes: globalThis.Record<string, string | number | null>,
		clearCandidate = false,
	) => {
		const next = new URLSearchParams(searchParams.toString())
		for (const [key, value] of Object.entries(changes)) {
			if (value === null || value === "") next.delete(key)
			else next.set(key, String(value))
		}
		if (clearCandidate) {
			next.delete("candidate_query")
			next.delete("candidate_page")
		}
		pushParams(next)
	}

	useEffect(() => setQueueQuery(queueQueryParam), [queueQueryParam])
	useEffect(() => setCandidateQuery(candidateQueryParam), [candidateQueryParam])

	useEffect(() => {
		if (queueQuery === queueQueryParam) return
		const timer = window.setTimeout(() => {
			updateParams(
				{ query: queueQuery || null, page: null, pending_statement_id: null },
				true,
			)
		}, 300)
		return () => window.clearTimeout(timer)
	}, [queueQuery, queueQueryParam])

	useEffect(() => {
		if (candidateQuery === candidateQueryParam) return
		const timer = window.setTimeout(() => {
			updateParams({ candidate_query: candidateQuery || null, candidate_page: null })
		}, 300)
		return () => window.clearTimeout(timer)
	}, [candidateQuery, candidateQueryParam])

	const accounts = useLiveQuery(() => listAccounts(), []) ?? []
	const pending =
		useLiveQuery(
			() =>
				listStatements({
					query: queueQueryParam || null,
					account_id: accountId === "all" ? null : accountId,
					is_pending: "true",
				}),
			[queueQueryParam, accountId],
		) ?? []
	const allPending = useLiveQuery(() => listStatements({ is_pending: "true" }), []) ?? []
	const imports =
		useLiveQuery(
			() =>
				listStatements({
					account_id: accountId === "all" ? null : accountId,
					is_pending: "false",
					is_unallocated: "true",
				}),
			[accountId],
		) ?? []

	const sortedPending = useMemo(
		() =>
			[...pending].sort(
				(a, b) => a.datetime.localeCompare(b.datetime) || a.id.localeCompare(b.id),
			),
		[pending],
	)
	const queuePage = parsePage(searchParams.get("page"))
	const queuePageSize = parsePageSize(searchParams.get("per_page"), 25)
	const pendingStatements = useMemo<Paginated<PendingReplacementStatement>>(() => {
		const paginated = paginateItems(sortedPending, queuePage, queuePageSize)
		return {
			...paginated,
			data: paginated.data.map(statement => ({
				...statement,
				suggestion_count: countSuggestions(statement, imports),
			})),
		}
	}, [sortedPending, queuePage, queuePageSize, imports])

	const selectedPendingStatement = pendingStatementId
		? (allPending.find(statement => statement.id === pendingStatementId) ?? null)
		: null
	const selectionMissing = !!pendingStatementId && !selectedPendingStatement

	const candidates = useLiveQuery(
		() =>
			selectedPendingStatement
				? replacementCandidates(selectedPendingStatement.id, {
						query: candidateQueryParam || undefined,
						scope: candidateScope === "all" ? "all" : "suggested",
						page: candidatePage,
						per_page: 25,
					}).catch(() => null)
				: Promise.resolve(null),
		[selectedPendingStatement?.id, candidateQueryParam, candidateScope, candidatePage],
	)

	const selectPending = (statement: PendingReplacementStatement | null) => {
		setReviewStatement(null)
		updateParams({
			pending_statement_id: statement?.id ?? null,
			candidate_page: null,
			candidate_query: null,
		})
	}

	const clearQueueFilters = () => setSearchParams({})
	const activeFilterCount = [queueQueryParam, accountId === "all" ? "" : accountId].filter(
		Boolean,
	).length
	const afterReplacement = () => {
		const selectedIndex = pendingStatements.data.findIndex(
			s => s.id === selectedPendingStatement?.id,
		)
		const next =
			pendingStatements.data[selectedIndex + 1] ?? pendingStatements.data[selectedIndex - 1]
		setReviewStatement(null)
		const nextParams = new URLSearchParams(searchParams.toString())
		nextParams.delete("candidate_query")
		nextParams.delete("candidate_page")
		if (next) nextParams.set("pending_statement_id", next.id)
		else {
			nextParams.delete("pending_statement_id")
			if (pendingStatements.current_page > 1)
				nextParams.set("page", String(pendingStatements.current_page - 1))
		}
		pushParams(nextParams)
	}

	return (
		<>
			<AppHeader title="Allocator" />
			<PageContent>
				<PageHeader
					title="Allocator"
					subtitle="Compare pending Statements with imported activity, then move Allocations to the correct Statement."
					description="Allocation workspace"
					icon="lucide:link"
				/>
				<AllocatorTabs active="replace" />

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

				<div className="grid min-w-0 gap-4 md:grid-cols-[minmax(18rem,2fr)_minmax(0,3fr)]">
					<section
						className={cn(
							"min-w-0 flex-col gap-4",
							selectedPendingStatement ? "hidden md:flex" : "flex",
						)}
						aria-labelledby="pending-queue-title"
					>
						<div className="flex flex-col gap-2">
							<div>
								<h3
									id="pending-queue-title"
									className="font-heading text-base font-medium"
								>
									Pending Statements
								</h3>
								<p className="text-xs/relaxed text-muted-foreground">
									Oldest first · all Allocation states
								</p>
							</div>
							<Input
								placeholder="Search pending Statements..."
								value={queueQuery}
								onChange={event => setQueueQuery(event.target.value)}
							/>
							<FilterBar>
								<Select
									value={accountId}
									onValueChange={value =>
										updateParams(
											{
												account_id: value === "all" ? null : value,
												page: null,
												pending_statement_id: null,
											},
											true,
										)
									}
								>
									<SelectTrigger
										className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}
									>
										<IconifyIcon icon="lucide:landmark" />
										<SelectValue />
									</SelectTrigger>
									<SelectContent align="start" variant="filter">
										<SelectGroup>
											<SelectItem value="all">All Accounts</SelectItem>
											{accounts.map(account => (
												<SelectItem key={account.id} value={account.id}>
													{account.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								<ClearFiltersButton
									count={activeFilterCount}
									onClear={clearQueueFilters}
									className="sm:w-auto"
								/>
							</FilterBar>
						</div>

						{pendingStatements.data.length ? (
							<div className="flex flex-col gap-2">
								<AnimatePresence initial={false}>
									{pendingStatements.data.map((statement, index) => (
										<motion.div
											layout="position"
											key={statement.id}
											initial={reduceMotion ? false : { opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
											transition={{
												duration: reduceMotion ? 0 : 0.18,
												delay: reduceMotion
													? 0
													: Math.min(index * 0.025, 0.1),
												ease: "easeOut",
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
						) : (
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

						<PaginationFooter
							summary={`Showing ${pendingStatements.data.length} of ${pendingStatements.total} pending Statements.`}
							page={pendingStatements.current_page}
							lastPage={pendingStatements.last_page ?? 1}
						/>
					</section>

					<section
						className={cn(
							"min-w-0 flex-col gap-4",
							selectedPendingStatement ? "flex" : "hidden md:flex",
						)}
						aria-labelledby="candidate-title"
					>
						<AnimatePresence mode="wait" initial={false}>
							{selectedPendingStatement ? (
								<motion.div
									key={selectedPendingStatement.id}
									initial={reduceMotion ? false : { opacity: 0, x: 12 }}
									animate={{ opacity: 1, x: 0 }}
									exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
									transition={{
										duration: reduceMotion ? 0 : 0.18,
										ease: "easeOut",
									}}
									className="flex flex-col gap-4"
								>
									<Button
										variant="outline"
										className="w-fit md:hidden"
										onClick={() => selectPending(null)}
									>
										<IconifyIcon
											icon="lucide:arrow-left"
											data-icon="inline-start"
										/>
										Back to pending Statements
									</Button>
									<div className="flex flex-col gap-2">
										<div>
											<h3
												id="candidate-title"
												className="font-heading text-base font-medium"
											>
												Imported Statements
											</h3>
											<p className="truncate text-xs/relaxed text-muted-foreground">
												For {selectedPendingStatement.description} ·{" "}
												<span
													className={classForCurrency(
														selectedPendingStatement.amount,
													)}
												>
													{formatCurrency(
														selectedPendingStatement.amount,
													)}
												</span>
											</p>
										</div>
										<Input
											placeholder="Search imported Statements..."
											value={candidateQuery}
											onChange={event =>
												setCandidateQuery(event.target.value)
											}
										/>
										<FilterBar>
											<Select
												value={candidateScope}
												onValueChange={value =>
													updateParams({
														candidate_scope:
															value === "suggested" ? null : value,
														candidate_page: null,
													})
												}
											>
												<SelectTrigger
													className={cn(
														"w-full sm:w-52",
														FILTER_CONTROL_CLASS,
													)}
												>
													<IconifyIcon icon="lucide:list-filter" />
													<SelectValue />
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
											{candidateScope === "suggested" ? (
												<span className="self-center text-xs/relaxed text-muted-foreground">
													Within 7 days · up to $5 difference
												</span>
											) : null}
										</FilterBar>
									</div>

									<CandidateResults
										data={candidates ?? null}
										error={null}
										showLoading={
											candidates === undefined && !!selectedPendingStatement
										}
										scope={candidateScope}
										onReview={setReviewStatement}
										onPage={page =>
											updateParams({
												candidate_page: page === 1 ? null : page,
											})
										}
									/>
								</motion.div>
							) : (
								<motion.div
									key="empty"
									initial={reduceMotion ? false : { opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
									transition={{
										duration: reduceMotion ? 0 : 0.16,
										ease: "easeOut",
									}}
								>
									<Empty className="min-h-72 border">
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
				open={!!reviewStatement}
				onOpenChange={open => {
					if (!open) setReviewStatement(null)
				}}
				onConfirmed={afterReplacement}
			/>
		</>
	)
}

function countSuggestions(statement: Statement, imports: Statement[]): number {
	const pendingShape = {
		id: statement.id,
		account_id: statement.account.id,
		amount: statement.amount,
		datetime: statement.datetime,
		is_pending: true,
	}
	let count = 0
	for (const imported of imports) {
		if (imported.account.id !== statement.account.id) continue
		const candidate = {
			id: imported.id,
			account_id: imported.account.id,
			amount: imported.amount,
			datetime: imported.datetime,
			is_pending: false,
		}
		if (!sameDirection(candidate, pendingShape)) continue
		const comparison = replacementComparison(candidate, pendingShape, [])
		if (Math.abs(comparison.day_difference) > 7) continue
		if (comparison.amount_difference > 5) continue
		if (replacementReason(candidate, pendingShape, [], []) !== null) continue
		count += 1
	}
	return count
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
	const allocated = round2dp(statement.amount - statement.allocable_amount)
	return (
		<Card
			size="sm"
			className={cn(
				"transition-[box-shadow,background-color] duration-200 motion-reduce:transition-none",
				selected && "bg-muted/30 ring-2 ring-ring",
			)}
		>
			<CardHeader>
				<CardTitle className="line-clamp-2">{statement.description}</CardTitle>
				<CardDescription>
					{statement.account.name} · {formatDatetime(statement.datetime)}
				</CardDescription>
				<CardAction>
					<span className={cn("font-semibold", classForCurrency(statement.amount))}>
						{formatCurrency(statement.amount)}
					</span>
				</CardAction>
			</CardHeader>
			<CardContent className="flex flex-wrap gap-1.5">
				<Badge variant="outline">{formatCurrency(allocated)} allocated</Badge>
				<Badge variant="outline">
					{statement.allocation_count} Allocation
					{statement.allocation_count === 1 ? "" : "s"}
				</Badge>
				<Badge variant={statement.suggestion_count ? "secondary" : "warning"}>
					{statement.suggestion_count
						? `${statement.suggestion_count} suggestion${statement.suggestion_count === 1 ? "" : "s"}`
						: "No suggestions"}
				</Badge>
			</CardContent>
			<CardFooter className="justify-end">
				<Button size="sm" variant={selected ? "secondary" : "outline"} onClick={onSelect}>
					Compare
				</Button>
			</CardFooter>
		</Card>
	)
}

function CandidateResults({
	data,
	error,
	showLoading,
	scope,
	onReview,
	onPage,
}: {
	data: CandidatePage | null
	error: string | null
	showLoading: boolean
	scope: string
	onReview: (statement: Statement) => void
	onPage: (page: number) => void
}) {
	const { handlePush } = useHistory()
	const reduceMotion = useReducedMotion()
	const initial = reduceMotion ? false : { opacity: 0, y: 8 }
	const transition = { duration: reduceMotion ? 0 : 0.18, ease: "easeOut" as const }
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
	if (!data)
		return showLoading ? (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={transition}
				className="flex items-center gap-2 py-4 text-xs text-muted-foreground"
			>
				<IconifyIcon icon="lucide:loader-circle" className="animate-spin" />
				Finding imported Statements…
			</motion.div>
		) : null
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
						layout="position"
						initial={initial}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							...transition,
							delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.14),
						}}
					>
						<Card size="sm">
							<CardHeader>
								<CardTitle className="line-clamp-2">
									{statement.description}
								</CardTitle>
								<CardDescription>
									{formatDatetime(statement.datetime)}
								</CardDescription>
								<CardAction>
									<span
										className={cn(
											"font-semibold",
											classForCurrency(statement.amount),
										)}
									>
										{formatCurrency(statement.amount)}
									</span>
								</CardAction>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								<div className="flex flex-wrap gap-1.5">
									<Badge
										variant={
											statement.is_exact_amount ? "secondary" : "outline"
										}
									>
										{statement.is_exact_amount
											? "Same amount"
											: `${formatCurrency(statement.amount_difference)} difference`}
									</Badge>
									<Badge variant="outline">
										{dateDifferenceLabel(statement.day_difference)}
									</Badge>
									{!statement.can_replace ? (
										<Badge variant="destructive">Cannot replace</Badge>
									) : null}
								</div>
								{statement.disabled_reason ? (
									<p className="text-xs/relaxed text-destructive">
										{statement.disabled_reason}
									</p>
								) : (
									<p className="text-xs/relaxed text-muted-foreground">
										{formatCurrency(statement.remaining_allocable_amount)}{" "}
										remains allocable after replacement.
									</p>
								)}
							</CardContent>
							<CardFooter className="justify-end gap-1.5">
								<Button variant="outline" size="sm" asChild>
									<Link
										href={pathStatement(statement.id)}
										onClick={handlePush("Allocator")}
									>
										Open
									</Link>
								</Button>
								<Button
									size="sm"
									disabled={!statement.can_replace}
									onClick={() => onReview(statement)}
								>
									<IconifyIcon icon="lucide:replace" data-icon="inline-start" />
									Review replacement
								</Button>
							</CardFooter>
						</Card>
					</motion.div>
				))}
			</div>
			<div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
				<span>
					Showing {data.data.length} of {data.total} imported Statements.
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
