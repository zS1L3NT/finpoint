"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type ReactNode, useState } from "react"
import { toast } from "sonner"
import DuplicateReviewDialog from "@/components/dialogs/duplicate-review"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { ClearFiltersButton, FILTER_CONTROL_CLASS, FilterBar } from "@/components/table/filter-bar"
import PaginationFooter from "@/components/table/pagination-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import WorkflowTabs from "@/components/workflow-tabs"
import { SPRING, TRANSITION } from "@/lib/motion"
import {
	classForCurrency,
	cn,
	formatCurrency,
	parseDate,
	parseDatetime,
	pluralize,
} from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import {
	type DuplicateGroup,
	type DuplicateStatement,
	dismissDuplicatePair,
	dismissedDuplicatePairs,
	duplicateGroups,
	type FixDuplicatesInput,
	pairKey,
	restoreDuplicatePair,
} from "@/logic/duplicates"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { pathStatement } from "@/routes"

const VIEWS = {
	suggested: {
		label: "Suggested duplicates",
		hint: "similar description",
		icon: "lucide:copy-check",
		emptyTitle: "No duplicates found",
		emptyDescription:
			"Bank exports look clean. Switch to All same-day Statements to check by hand.",
	},
	all: {
		label: "All same-day Statements",
		hint: "any description",
		icon: "lucide:calendar-search",
		emptyTitle: "No same-day Statements",
		emptyDescription: "No two Statements share an account, day and amount.",
	},
	dismissed: {
		label: "Marked separate",
		hint: "marked not duplicates",
		icon: "lucide:split",
		emptyTitle: "Nothing marked separate",
		emptyDescription: "Pairs you mark as not duplicates appear here.",
	},
} as const

const CARD_MOTION = {
	layout: "position",
	initial: { opacity: 0, y: 6 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, scale: 0.97, transition: TRANSITION.fast },
	transition: { ...TRANSITION.base, layout: SPRING.snappy },
} as const

export default function FixDuplicatesPage() {
	const params = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const viewParam = params.get("view")
	const view = viewParam === "all" || viewParam === "dismissed" ? viewParam : "suggested"
	const query = params.get("query") ?? ""
	const accountId = params.get("account_id") ?? ""
	const accounts = useLiveQuery(() => listAccounts(), [])
	const groups = useLiveQuery(
		async () => (view === "dismissed" ? [] : duplicateGroups(view === "all")),
		[view],
	)
	const dismissals = useLiveQuery(
		async () => (view === "dismissed" ? dismissedDuplicatePairs() : []),
		[view],
	)
	const [review, setReview] = useState<FixDuplicatesInput | null>(null)
	const [busy, setBusy] = useState(false)

	const updateParams = (changes: Record<string, string>) => {
		const next = new URLSearchParams(params)
		next.delete("page")
		for (const [key, value] of Object.entries(changes)) {
			if (value) next.set(key, value)
			else next.delete(key)
		}
		router.push(next.size ? `${pathname}?${next}` : pathname, { scroll: false })
	}
	const action = async (operation: () => Promise<unknown>) => {
		setBusy(true)
		try {
			await operation()
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update these Statements.",
			)
		} finally {
			setBusy(false)
		}
	}
	const matches = (statements: DuplicateStatement[]) =>
		(!accountId || statements[0]?.account_id === accountId) &&
		(!query || statements.some(s => s.description.toLowerCase().includes(query.toLowerCase())))
	const pageNumber = parsePage(params.get("page"))
	const pageSize = parsePageSize(params.get("per_page"), 10)
	const page =
		view === "dismissed"
			? {
					kind: "pairs" as const,
					...paginateItems(
						(dismissals ?? []).filter(p => matches(p.statements)),
						pageNumber,
						pageSize,
					),
				}
			: {
					kind: "groups" as const,
					...paginateItems(
						(groups ?? []).filter(g => matches(g.statements)),
						pageNumber,
						pageSize,
					),
				}
	const filterCount = [query, accountId].filter(Boolean).length
	const accountName = (statement?: DuplicateStatement) =>
		accounts?.find(a => a.id === statement?.account_id)?.name ?? "Account"

	return (
		<PageContent>
			<PageHeader
				title="Workflows"
				subtitle="Review possible duplicate bank Statements and preserve the correct imported activity."
				description="Statement cleanup"
				icon="lucide:copy-check"
			/>
			<WorkflowTabs active="duplicates" />
			<div className="flex flex-col gap-2">
				<Input
					aria-label="Search statement descriptions"
					placeholder="Search descriptions..."
					value={query}
					onChange={event => updateParams({ query: event.target.value })}
				/>
				<div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
					<FilterBar className="lg:w-auto">
						<Select
							value={view}
							onValueChange={value =>
								updateParams({ view: value === "suggested" ? "" : value })
							}
						>
							<SelectTrigger
								aria-label="Duplicate view"
								className={cn("w-full sm:w-56", FILTER_CONTROL_CLASS)}
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent align="start" variant="filter">
								{Object.entries(VIEWS).map(([value, v]) => (
									<SelectItem key={value} value={value}>
										{v.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={accountId || "all"}
							onValueChange={value =>
								updateParams({ account_id: value === "all" ? "" : value })
							}
						>
							<SelectTrigger
								aria-label="Filter account"
								className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}
							>
								<IconifyIcon icon="lucide:landmark" />
								<SelectValue />
							</SelectTrigger>
							<SelectContent align="start" variant="filter">
								<SelectItem value="all">All Accounts</SelectItem>
								{accounts?.map(a => (
									<SelectItem key={a.id} value={a.id}>
										{a.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<ClearFiltersButton
							count={filterCount}
							onClear={() => updateParams({ query: "", account_id: "" })}
							className="sm:w-auto"
						/>
					</FilterBar>
					<p className="text-xs/relaxed text-muted-foreground">
						Same account · same day · same amount · {VIEWS[view].hint}
					</p>
				</div>
			</div>
			{groups === undefined || dismissals === undefined || accounts === undefined ? null : (
				<motion.div
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={TRANSITION.base}
					className="grid gap-4"
				>
					<AnimatePresence initial={false} mode="popLayout">
						{page.kind === "pairs"
							? page.data.map(pair => (
									<motion.section
										key={`dismissed-${pairKey(pair.statements[0].id, pair.statements[1].id)}`}
										{...CARD_MOTION}
										className="grid gap-3 rounded-xl border bg-card p-4"
									>
										<GroupHeader
											accountName={accountName(pair.statements[0])}
											statement={pair.statements[0]}
										/>
										{pair.statements.map(s => (
											<Link
												key={s.id}
												href={pathStatement(s.id)}
												className="min-w-0 break-words text-sm font-medium underline-offset-4 hover:underline"
											>
												{highlightDifferences(
													s.description,
													pair.statements.map(s => s.description),
												)}
											</Link>
										))}
										<Button
											variant="ghost"
											size="sm"
											className="w-fit justify-self-end"
											disabled={busy}
											onClick={() =>
												action(() =>
													restoreDuplicatePair(
														pair.statements[0].id,
														pair.statements[1].id,
													),
												)
											}
										>
											<IconifyIcon
												icon="lucide:undo-2"
												data-icon="inline-start"
											/>
											Restore suggestion
										</Button>
									</motion.section>
								))
							: page.data.map(group => (
									<motion.div
										key={`${view}-${group.statements.map(s => s.id).join(",")}-${group.pairs.map(p => pairKey(...p)).join(",")}`}
										{...CARD_MOTION}
									>
										<DuplicateGroupCard
											group={group}
											ignoreDescriptions={view === "all"}
											accountName={accountName(group.statements[0])}
											busy={busy}
											onReview={setReview}
											onDismiss={(a, b) =>
												action(() => dismissDuplicatePair(a, b))
											}
										/>
									</motion.div>
								))}
					</AnimatePresence>
					{!page.total ? (
						<Empty className="border">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<IconifyIcon icon={VIEWS[view].icon} />
								</EmptyMedia>
								<EmptyTitle>{VIEWS[view].emptyTitle}</EmptyTitle>
								<EmptyDescription>
									{filterCount
										? "No groups match these filters."
										: VIEWS[view].emptyDescription}
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : null}
					<PaginationFooter
						summary={`Showing ${page.data.length} of ${page.total} ${page.kind}`}
						page={page.current_page}
						lastPage={page.last_page ?? 1}
					/>
				</motion.div>
			)}
			<DuplicateReviewDialog
				input={review}
				open={review !== null}
				onOpenChange={open => {
					if (!open) setReview(null)
				}}
				onFixed={() => setReview(null)}
			/>
		</PageContent>
	)
}

function GroupHeader({
	accountName,
	statement,
	children,
}: {
	accountName: string
	statement?: DuplicateStatement
	children?: ReactNode
}) {
	return (
		<div className="flex items-start justify-between gap-3 text-sm">
			<div className="flex flex-wrap items-center gap-2">
				<h2 className="font-medium">
					{accountName} ·{" "}
					{parseDate((statement?.datetime ?? "").slice(0, 10)).toFormat("d MMM y")}
				</h2>
				{children}
			</div>
			<span
				className={cn(
					"shrink-0 font-semibold tabular-nums",
					classForCurrency(statement?.amount ?? 0),
				)}
			>
				{formatCurrency(statement?.amount ?? 0)}
			</span>
		</div>
	)
}

function DuplicateGroupCard({
	group,
	ignoreDescriptions,
	accountName,
	busy,
	onReview,
	onDismiss,
}: {
	group: DuplicateGroup
	ignoreDescriptions: boolean
	accountName: string
	busy: boolean
	onReview: (input: FixDuplicatesInput) => void
	onDismiss: (a: string, b: string) => void
}) {
	const [kept, setKept] = useState("")
	const [deleted, setDeleted] = useState<string[]>([])
	const canDelete = (keepId: string, id: string) =>
		keepId !== id &&
		(ignoreDescriptions || group.pairs.some(p => pairKey(...p) === pairKey(keepId, id)))
	return (
		<section className="grid gap-4 rounded-xl border bg-card p-4">
			<GroupHeader accountName={accountName} statement={group.statements[0]}>
				{group.statements.length > 2 ? (
					<Badge variant="outline">{group.statements.length} Statements</Badge>
				) : null}
			</GroupHeader>
			<div className="grid gap-2">
				{group.statements.map(s => (
					<div
						key={s.id}
						className={cn(
							"grid min-w-0 gap-3 rounded-lg border p-3 transition-colors duration-150 ease-out sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start",
							kept === s.id && "border-emerald-500/40 bg-emerald-500/5",
							deleted.includes(s.id) && "border-destructive/40 bg-destructive/5",
							kept && kept !== s.id && !canDelete(kept, s.id) && "opacity-60",
						)}
					>
						<div className="min-w-0">
							<Link
								href={pathStatement(s.id)}
								className={cn(
									"break-words whitespace-pre-wrap text-sm font-medium underline-offset-4 hover:underline",
									deleted.includes(s.id) &&
										"text-muted-foreground line-through decoration-destructive/40",
								)}
							>
								{highlightDifferences(
									s.description,
									group.statements.map(s => s.description),
								)}
							</Link>
							<p className="mt-1 text-xs text-muted-foreground">
								{parseDatetime(s.datetime).toFormat("HH:mm")} ·{" "}
								{group.allocationCounts[s.id]
									? pluralize(group.allocationCounts[s.id] ?? 0, "Allocation")
									: "No Allocations"}
							</p>
							{kept && kept !== s.id && !canDelete(kept, s.id) ? (
								<p className="mt-1.5 text-xs text-muted-foreground">
									Not suggested as a duplicate of the kept Statement
								</p>
							) : null}
						</div>
						<div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
							<ToggleGroup
								type="single"
								aria-label={`Action for ${s.description}`}
								value={
									kept === s.id ? "keep" : deleted.includes(s.id) ? "delete" : ""
								}
								disabled={busy}
								className="border bg-transparent"
								onValueChange={value => {
									if (value === "keep") {
										setKept(s.id)
										setDeleted(deleted.filter(id => canDelete(s.id, id)))
									} else if (kept === s.id) {
										setKept("")
										setDeleted([])
									} else
										setDeleted(
											value === "delete"
												? [...deleted, s.id]
												: deleted.filter(id => id !== s.id),
										)
								}}
							>
								<ToggleGroupItem value="keep" aria-label={`Keep ${s.description}`}>
									Keep
								</ToggleGroupItem>
								<ToggleGroupItem
									value="delete"
									aria-label={`Delete ${s.description}`}
									disabled={!kept || !canDelete(kept, s.id)}
								>
									Delete
								</ToggleGroupItem>
							</ToggleGroup>
							{!ignoreDescriptions && kept && canDelete(kept, s.id) ? (
								<Button
									variant="ghost"
									size="sm"
									disabled={busy}
									onClick={() => onDismiss(kept, s.id)}
								>
									<IconifyIcon icon="lucide:split" data-icon="inline-start" />
									Not a duplicate
								</Button>
							) : null}
						</div>
					</div>
				))}
			</div>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap items-center gap-2">
					<p className="text-xs text-muted-foreground">
						{kept
							? `Keep 1 · delete ${deleted.length}`
							: "Choose the Statement to keep"}
					</p>
					{!ignoreDescriptions && !kept && group.statements.length === 2 ? (
						<Button
							variant="ghost"
							size="sm"
							disabled={busy}
							onClick={() => {
								const [a, b] = group.statements
								if (a && b) onDismiss(a.id, b.id)
							}}
						>
							<IconifyIcon icon="lucide:split" data-icon="inline-start" />
							Not duplicates
						</Button>
					) : null}
				</div>
				<Button
					className="ml-auto"
					disabled={busy || !kept || !deleted.length}
					onClick={() => onReview({ keep_id: kept, delete_ids: deleted })}
				>
					<IconifyIcon icon="lucide:trash-2" data-icon="inline-start" />
					Review deletion
				</Button>
			</div>
		</section>
	)
}

function highlightDifferences(description: string, descriptions: string[]) {
	const words = descriptions.map(text => new Set(text.toLowerCase().split(/\s+/)))
	return description.split(/(\s+)/).map((word, index) =>
		word.trim() && !words.every(words => words.has(word.toLowerCase())) ? (
			<span
				key={`${index}-${word}`}
				className="rounded-sm bg-amber-500/15 px-0.5 text-amber-800 dark:text-amber-300"
			>
				{word}
			</span>
		) : (
			word
		),
	)
}
