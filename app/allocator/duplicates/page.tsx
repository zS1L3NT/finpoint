"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import AllocatorTabs from "@/components/allocator-tabs"
import DuplicateReviewDialog from "@/components/dialogs/duplicate-review"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { ClearFiltersButton, FILTER_CONTROL_CLASS, FilterBar } from "@/components/table/filter-bar"
import PaginationFooter from "@/components/table/pagination-footer"
import { PendingBadge } from "@/components/table/record-columns"
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
import { SPRING, TRANSITION } from "@/lib/motion"
import { classForCurrency, cn, formatCurrency, parseDate, parseDatetime } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import {
	type DuplicateGroup,
	dismissDuplicatePair,
	dismissedDuplicatePairs,
	duplicateGroups,
	type FixDuplicatesInput,
	restoreDuplicatePair,
} from "@/logic/duplicates"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { getRecord } from "@/logic/records"
import { pathRecord, pathStatement } from "@/routes"

export default function FixDuplicatesPage() {
	const params = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const view =
		params.get("view") === "all"
			? "all"
			: params.get("view") === "dismissed"
				? "dismissed"
				: "suggested"
	const query = params.get("query") ?? ""
	const accountId = params.get("account_id") ?? ""
	const accounts = useLiveQuery(() => listAccounts(), [])
	const groups = useLiveQuery(() => duplicateGroups(view === "all"), [view])
	const dismissals = useLiveQuery(() => dismissedDuplicatePairs(), [])
	const [review, setReview] = useState<FixDuplicatesInput | null>(null)
	const [affected, setAffected] = useState<string[] | null>(null)
	const [busy, setBusy] = useState(false)
	const affectedRecords = useLiveQuery(
		() => Promise.all((affected ?? []).map(id => getRecord(id).catch(() => null))),
		[affected?.join(",")],
	)

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
	const matches = (statements: DuplicateGroup["statements"]) =>
		(!accountId || statements[0]?.account_id === accountId) &&
		(!query || statements.some(s => s.description.toLowerCase().includes(query.toLowerCase())))
	const groupPage = paginateItems(
		(groups ?? []).filter(g => matches(g.statements)),
		parsePage(params.get("page")),
		parsePageSize(params.get("per_page"), 10),
	)
	const dismissalPage = paginateItems(
		(dismissals ?? []).filter(p => matches(p.statements)),
		parsePage(params.get("page")),
		parsePageSize(params.get("per_page"), 10),
	)
	const page = view === "dismissed" ? dismissalPage : groupPage
	const filterCount = [query, accountId].filter(Boolean).length

	return (
		<PageContent>
			<PageHeader
				title="Workflows"
				subtitle="Review possible duplicate bank Statements and preserve the correct imported activity."
				description="Statement cleanup"
				icon="lucide:copy-check"
			/>
			<AllocatorTabs active="duplicates" />
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
								<SelectItem value="suggested">Suggested duplicates</SelectItem>
								<SelectItem value="all">All same-day matches</SelectItem>
								<SelectItem value="dismissed">Marked separate</SelectItem>
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
						Same account · same day · same amount
						{view === "all" ? " · any description" : " · similar description"}
					</p>
				</div>
			</div>
			{affected !== null && affectedRecords !== undefined ? (
				<Card size="sm" role="status">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<IconifyIcon icon="lucide:circle-check" className="text-emerald-500" />
							Duplicates deleted
						</CardTitle>
						<CardDescription>
							{affectedRecords.length
								? "Records stay; review any that are now pending."
								: "No Records were affected."}
						</CardDescription>
						<CardAction>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Dismiss result"
								onClick={() => setAffected(null)}
							>
								<IconifyIcon icon="lucide:x" />
							</Button>
						</CardAction>
					</CardHeader>
					{affectedRecords.length ? (
						<CardContent className="flex flex-col gap-3">
							{affectedRecords
								.filter(r => !!r)
								.map(r => (
									<div
										key={r.id}
										className="flex items-center justify-between gap-3"
									>
										<div className="flex min-w-0 items-center gap-2">
											<Link
												href={pathRecord(r.id)}
												className="min-w-0 break-words font-medium underline-offset-4 hover:underline"
											>
												{r.title}
											</Link>
											<PendingBadge record={r} />
										</div>
										<span
											className={cn(
												"shrink-0 font-medium tabular-nums",
												classForCurrency(r.amount),
											)}
										>
											{formatCurrency(r.amount)}
										</span>
									</div>
								))}
						</CardContent>
					) : null}
				</Card>
			) : null}
			{groups === undefined || dismissals === undefined || accounts === undefined ? null : (
				<motion.div
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={TRANSITION.base}
					className="grid gap-4"
				>
					<AnimatePresence initial={false} mode="popLayout">
						{view === "dismissed"
							? dismissalPage.data.map(pair => (
									<motion.section
										key={`dismissed-${pair.statements.map(s => s.id).join("|")}`}
										layout="position"
										initial={{ opacity: 0, y: 6 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{
											opacity: 0,
											scale: 0.97,
											transition: TRANSITION.fast,
										}}
										transition={{ ...TRANSITION.base, layout: SPRING.snappy }}
										className="grid gap-3 rounded-xl border bg-card p-4"
									>
										<div className="flex items-start justify-between gap-3 text-sm">
											<h2 className="font-medium">
												{accounts.find(
													a => a.id === pair.statements[0].account_id,
												)?.name ?? "Account"}{" "}
												·{" "}
												{parseDate(
													pair.statements[0].datetime.slice(0, 10),
												).toFormat("d MMM y")}
											</h2>
											<span
												className={cn(
													"shrink-0 font-semibold tabular-nums",
													classForCurrency(pair.statements[0].amount),
												)}
											>
												{formatCurrency(pair.statements[0].amount)}
											</span>
										</div>
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
							: groupPage.data.map(group => (
									<motion.div
										key={`${view}-${group.statements.map(s => s.id).join(",")}-${group.pairs.map(p => p.join(":")).join(",")}`}
										layout="position"
										initial={{ opacity: 0, y: 6 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{
											opacity: 0,
											scale: 0.97,
											transition: TRANSITION.fast,
										}}
										transition={{ ...TRANSITION.base, layout: SPRING.snappy }}
									>
										<DuplicateGroupCard
											group={group}
											manual={view === "all"}
											accountName={
												accounts.find(
													a => a.id === group.statements[0]?.account_id,
												)?.name ?? "Account"
											}
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
									<IconifyIcon
										icon={
											view === "dismissed"
												? "lucide:split"
												: view === "all"
													? "lucide:calendar-search"
													: "lucide:copy-check"
										}
									/>
								</EmptyMedia>
								<EmptyTitle>
									{view === "dismissed"
										? "Nothing marked separate"
										: view === "all"
											? "No same-day matches"
											: "No duplicates found"}
								</EmptyTitle>
								<EmptyDescription>
									{filterCount
										? "No groups match these filters."
										: view === "dismissed"
											? "Pairs you mark as not duplicates appear here."
											: view === "all"
												? "No two Statements share an account, day and amount."
												: "Bank exports look clean. Switch to All same-day matches to check by hand."}
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : null}
					<PaginationFooter
						summary={`Showing ${page.data.length} of ${page.total} ${view === "dismissed" ? "pairs" : "groups"}`}
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
				onFixed={ids => {
					setAffected(ids)
					setReview(null)
				}}
			/>
		</PageContent>
	)
}

function DuplicateGroupCard({
	group,
	manual,
	accountName,
	busy,
	onReview,
	onDismiss,
}: {
	group: DuplicateGroup
	manual: boolean
	accountName: string
	busy: boolean
	onReview: (input: FixDuplicatesInput) => void
	onDismiss: (a: string, b: string) => void
}) {
	const [survivor, setSurvivor] = useState("")
	const [deleted, setDeleted] = useState<string[]>([])
	const canDelete = (preserved: string, id: string) =>
		preserved !== id &&
		(manual ||
			group.pairs.some(
				([a, b]) => (a === preserved && b === id) || (b === preserved && a === id),
			))
	return (
		<section className="grid gap-4 rounded-xl border bg-card p-4">
			<div className="flex items-start justify-between gap-3 text-sm">
				<div className="flex flex-wrap items-center gap-2">
					<h2 className="font-medium">
						{accountName} ·{" "}
						{parseDate((group.statements[0]?.datetime ?? "").slice(0, 10)).toFormat(
							"d MMM y",
						)}
					</h2>
					{group.statements.length > 2 ? (
						<Badge variant="outline">{group.statements.length} Statements</Badge>
					) : null}
				</div>
				<span
					className={cn(
						"shrink-0 font-semibold tabular-nums",
						classForCurrency(group.statements[0]?.amount ?? 0),
					)}
				>
					{formatCurrency(group.statements[0]?.amount ?? 0)}
				</span>
			</div>
			<div className="grid gap-2">
				{group.statements.map(s => (
					<div
						key={s.id}
						className={cn(
							"grid min-w-0 gap-3 rounded-lg border p-3 transition-colors duration-150 ease-out sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start",
							survivor === s.id && "border-emerald-500/40 bg-emerald-500/5",
							deleted.includes(s.id) && "border-destructive/40 bg-destructive/5",
							survivor &&
								survivor !== s.id &&
								!canDelete(survivor, s.id) &&
								"opacity-60",
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
								{group.allocations[s.id]
									? `${group.allocations[s.id]} Allocation${group.allocations[s.id] === 1 ? "" : "s"}`
									: "No Allocations"}
							</p>
							{survivor && survivor !== s.id && !canDelete(survivor, s.id) ? (
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
									survivor === s.id
										? "keep"
										: deleted.includes(s.id)
											? "delete"
											: ""
								}
								disabled={busy}
								className="border bg-transparent"
								onValueChange={value => {
									if (value === "keep") {
										setSurvivor(s.id)
										setDeleted(deleted.filter(id => canDelete(s.id, id)))
									} else if (survivor === s.id) {
										setSurvivor("")
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
									disabled={!survivor || !canDelete(survivor, s.id)}
								>
									Delete
								</ToggleGroupItem>
							</ToggleGroup>
							{!manual && survivor && canDelete(survivor, s.id) ? (
								<Button
									variant="ghost"
									size="sm"
									disabled={busy}
									onClick={() => onDismiss(survivor, s.id)}
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
						{survivor
							? `Keep 1 · delete ${deleted.length}`
							: "Choose the Statement to keep"}
					</p>
					{!manual && !survivor && group.statements.length === 2 ? (
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
					disabled={busy || !survivor || !deleted.length}
					onClick={() => onReview({ survivor_id: survivor, delete_ids: deleted })}
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
