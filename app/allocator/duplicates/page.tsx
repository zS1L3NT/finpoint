"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import AllocatorTabs from "@/components/allocator-tabs"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import PaginationFooter from "@/components/table/pagination-footer"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { TRANSITION } from "@/lib/motion"
import { formatCurrency, formatDatetime } from "@/lib/utils"
import { listAccounts } from "@/logic/accounts"
import {
	type DuplicateGroup,
	dismissDuplicatePair,
	dismissedDuplicatePairs,
	duplicateGroups,
	duplicateReview,
	type FixDuplicatesInput,
	fixDuplicates,
	restoreDuplicatePair,
} from "@/logic/duplicates"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { getRecord } from "@/logic/records"
import { pathRecord, pathStatement } from "@/routes"

export default function FixDuplicatesPage() {
	const params = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const manual = params.get("manual") === "true"
	const dismissed = params.get("view") === "dismissed"
	const query = params.get("query") ?? ""
	const accountId = params.get("account_id") ?? ""
	const accounts = useLiveQuery(() => listAccounts(), [])
	const groups = useLiveQuery(() => duplicateGroups(manual), [manual])
	const dismissals = useLiveQuery(() => dismissedDuplicatePairs(), [])
	const [review, setReview] = useState<FixDuplicatesInput | null>(null)
	const [affected, setAffected] = useState<string[]>([])
	const [busy, setBusy] = useState(false)
	const affectedRecords = useLiveQuery(
		() => Promise.all(affected.map(id => getRecord(id).catch(() => null))),
		[affected.join(",")],
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
				error instanceof Error ? error.message : "Unable to update these statements.",
			)
		} finally {
			setBusy(false)
		}
	}
	const matches = (statements: DuplicateGroup["statements"]) =>
		(!accountId || statements[0]?.account_id === accountId) &&
		(!query || statements.some(s => s.description.toLowerCase().includes(query.toLowerCase())))
	const filtered = (groups ?? []).filter(g => matches(g.statements))
	const filteredDismissals = (dismissals ?? []).filter(p => matches(p.statements))
	const groupPage = paginateItems(
		filtered,
		parsePage(params.get("page")),
		parsePageSize(params.get("per_page"), 10),
	)
	const dismissalPage = paginateItems(
		filteredDismissals,
		parsePage(params.get("page")),
		parsePageSize(params.get("per_page"), 10),
	)
	const page = dismissed ? dismissalPage : groupPage

	return (
		<PageContent>
			<PageHeader
				title="Workflows"
				subtitle="Review possible duplicate bank Statements and preserve the correct imported activity."
				description="Statement cleanup"
				icon="lucide:copy-check"
			/>
			<AllocatorTabs active="duplicates" />
			<div className="flex flex-wrap items-center gap-3">
				<label className="flex items-center gap-2 text-sm">
					<Checkbox
						checked={manual}
						onCheckedChange={value => updateParams({ manual: value ? "true" : "" })}
					/>
					Select statements manually
				</label>
				<Button
					variant="outline"
					onClick={() => updateParams({ view: dismissed ? "" : "dismissed" })}
				>
					{dismissed ? "Show suggestions" : "Dismissed pairs"}
				</Button>
			</div>
			<div className="flex flex-wrap gap-3">
				<Input
					aria-label="Search statement descriptions"
					placeholder="Search descriptions..."
					value={query}
					onChange={event => updateParams({ query: event.target.value })}
					className="sm:max-w-sm"
				/>
				<Select
					value={accountId || "all"}
					onValueChange={value =>
						updateParams({ account_id: value === "all" ? "" : value })
					}
				>
					<SelectTrigger aria-label="Filter account" className="w-full sm:w-52">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Accounts</SelectItem>
						{accounts?.map(a => (
							<SelectItem key={a.id} value={a.id}>
								{a.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<p className="text-sm text-muted-foreground">
				Same account, day, and signed amount · imported Statements only.{" "}
				{manual
					? "Descriptions and prior dismissals do not restrict manual selection."
					: "Suggestions compare identifying wording and numbers; review each statement before deleting it."}
			</p>
			{affected.length ? (
				<div role="status" className="grid gap-2 rounded-xl border p-4">
					<p>
						Duplicates removed. Review affected Records; missing allocations may leave
						them pending.
					</p>
					<div className="flex flex-wrap gap-3">
						{affectedRecords
							?.filter(r => !!r)
							.map(r => (
								<Link key={r.id} href={pathRecord(r.id)} className="underline">
									{r.title}
								</Link>
							))}
					</div>
					<Button variant="ghost" className="w-fit" onClick={() => setAffected([])}>
						Dismiss result
					</Button>
				</div>
			) : null}
			{groups === undefined || dismissals === undefined || accounts === undefined ? null : (
				<motion.div
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={TRANSITION.base}
					className="grid gap-4"
				>
					{dismissed
						? dismissalPage.data.map(pair => (
								<section
									key={pair.statements.map(s => s.id).join("|")}
									className="grid gap-3 rounded-xl border p-4"
								>
									{pair.statements.map(s => (
										<Link
											key={s.id}
											href={pathStatement(s.id)}
											className="break-words underline"
										>
											{s.description}
										</Link>
									))}
									<Button
										variant="outline"
										className="w-fit"
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
										Restore suggestion
									</Button>
								</section>
							))
						: groupPage.data.map(group => (
								<DuplicateGroupCard
									key={`${manual}-${group.statements.map(s => s.id).join(",")}-${group.pairs.map(p => p.join(":")).join(",")}`}
									group={group}
									manual={manual}
									accountName={
										accounts.find(a => a.id === group.statements[0]?.account_id)
											?.name ?? "Account"
									}
									busy={busy}
									onReview={setReview}
									onDismiss={(a, b) => action(() => dismissDuplicatePair(a, b))}
								/>
							))}
					{!page.total ? (
						<p className="rounded-xl border p-6 text-muted-foreground">
							{dismissed
								? "No dismissed pairs match these filters."
								: manual
									? "No same-day Statements with the same account and signed amount match these filters."
									: "No strong duplicate suggestions match these filters."}
						</p>
					) : null}
					<PaginationFooter
						summary={`${page.total} ${dismissed ? "dismissed pairs" : "groups"}`}
						page={page.current_page}
						lastPage={page.last_page ?? 1}
					/>
				</motion.div>
			)}
			{review ? (
				<DuplicateReviewDialog
					input={review}
					onClose={() => setReview(null)}
					onFixed={ids => {
						setAffected(ids)
						setReview(null)
					}}
				/>
			) : null}
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
	const [pair, setPair] = useState<string[]>([])
	const canDelete = (preserved: string, id: string) =>
		preserved !== id &&
		(manual ||
			group.pairs.some(
				([a, b]) => (a === preserved && b === id) || (b === preserved && a === id),
			))
	return (
		<section className="grid gap-4 rounded-xl border p-4">
			<h2 className="font-medium">
				{accountName} · {group.statements[0]?.datetime.slice(0, 10)} ·{" "}
				{formatCurrency(group.statements[0]?.amount ?? 0)}
			</h2>
			<p className="text-xs text-muted-foreground">
				Choose one to preserve, then select only the duplicates to delete. Connected
				suggestions do not prove every Statement is a duplicate.
			</p>
			<p className="text-xs text-muted-foreground">
				{manual ? "Eligible pairs" : "Suggested pairs"}:{" "}
				{group.pairs
					.map(
						([a, b]) =>
							`${group.statements.findIndex(s => s.id === a) + 1} ↔ ${group.statements.findIndex(s => s.id === b) + 1}`,
					)
					.join(", ")}
			</p>
			{group.statements.map((s, index) => (
				<div key={s.id} className="grid gap-2 rounded-lg border p-3">
					<p className="text-xs font-medium">Statement {index + 1}</p>
					<Link
						href={pathStatement(s.id)}
						className="break-words font-medium underline underline-offset-4"
					>
						{s.description}
					</Link>
					<span className="text-xs text-muted-foreground">
						{formatDatetime(s.datetime)}
					</span>
					<div className="flex flex-wrap gap-4 text-sm">
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name={`preserve-${group.id}`}
								checked={survivor === s.id}
								onChange={() => {
									setSurvivor(s.id)
									setDeleted(deleted.filter(id => canDelete(s.id, id)))
								}}
							/>
							Preserve this Statement
						</label>
						<label className="flex items-center gap-2">
							<Checkbox
								disabled={!survivor || !canDelete(survivor, s.id)}
								checked={deleted.includes(s.id)}
								onCheckedChange={checked =>
									setDeleted(
										checked
											? [...deleted, s.id]
											: deleted.filter(id => id !== s.id),
									)
								}
							/>
							Delete as duplicate
						</label>
						<label className="flex items-center gap-2">
							<Checkbox
								checked={pair.includes(s.id)}
								disabled={!pair.includes(s.id) && pair.length === 2}
								onCheckedChange={checked =>
									setPair(
										checked ? [...pair, s.id] : pair.filter(id => id !== s.id),
									)
								}
							/>
							Select for separate pair
						</label>
					</div>
				</div>
			))}
			<div className="flex flex-wrap gap-3">
				<Button
					disabled={busy || !survivor || !deleted.length}
					onClick={() => onReview({ survivor_id: survivor, delete_ids: deleted })}
				>
					Review deletion
				</Button>
				<Button
					variant="outline"
					disabled={busy || pair.length !== 2}
					onClick={() => {
						if (pair[0] && pair[1]) onDismiss(pair[0], pair[1])
						setPair([])
					}}
				>
					These are separate
				</Button>
			</div>
		</section>
	)
}

function DuplicateReviewDialog({
	input,
	onClose,
	onFixed,
}: {
	input: FixDuplicatesInput
	onClose: () => void
	onFixed: (ids: string[]) => void
}) {
	const review = useLiveQuery(
		() => duplicateReview([input.survivor_id, ...input.delete_ids]),
		[input.survivor_id, input.delete_ids.join(",")],
	)
	const [source, setSource] = useState("")
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState("")
	const survivorAllocated = review?.allocations.some(a => a.statement_id === input.survivor_id)
	const sources = [
		...new Set(
			review?.allocations
				.filter(a => a.statement_id !== input.survivor_id)
				.map(a => a.statement_id) ?? [],
		),
	]
	const effectiveSource = survivorAllocated
		? input.survivor_id
		: sources.length === 1
			? sources[0]
			: source
	const confirm = async () => {
		setBusy(true)
		setError("")
		try {
			onFixed(
				await fixDuplicates({
					...input,
					allocation_source_id: effectiveSource || undefined,
				}),
			)
		} catch (error) {
			setError(error instanceof Error ? error.message : "Unable to fix duplicates.")
		} finally {
			setBusy(false)
		}
	}
	return (
		<Dialog
			open
			onOpenChange={open => {
				if (!open && !busy) onClose()
			}}
		>
			<DialogContent className="md:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Confirm duplicate deletion</DialogTitle>
					<DialogDescription>
						The preserved Statement stays unchanged. Deleted descriptions are not
						remembered; an old export can recreate them. Records stay intact.
					</DialogDescription>
				</DialogHeader>
				{review === undefined ? null : (
					<>
						<div className="grid gap-3">
							{review.statements.map(s => (
								<div key={s.id} className="rounded-lg border p-3">
									<p className="text-xs font-semibold">
										{s.id === input.survivor_id ? "Preserve" : "Delete"}
									</p>
									<p className="break-words">{s.description}</p>
									<p className="text-xs text-muted-foreground">
										{
											review.allocations.filter(a => a.statement_id === s.id)
												.length
										}{" "}
										allocations
									</p>
								</div>
							))}
						</div>
						{survivorAllocated ? (
							<p>
								Keep the preserved Statement's allocations. Remove every deleted
								Statement's allocations.
							</p>
						) : sources.length === 0 ? (
							<p>No allocations to move or remove.</p>
						) : (
							<>
								<p>
									{sources.length === 1
										? "Move the duplicate's allocations to the preserved Statement."
										: "Choose one Statement's allocations to move. All other deleted Statements' allocations will be removed."}
								</p>
								{sources.length > 1 ? (
									<fieldset className="grid gap-3">
										<legend className="mb-2 font-medium">
											Allocation source
										</legend>
										{sources.map(id => (
											<label
												key={id}
												className="flex items-start gap-2 rounded-lg border p-3"
											>
												<input
													type="radio"
													name="allocation-source"
													checked={source === id}
													onChange={() => setSource(id)}
												/>
												<span className="break-words">
													{
														review.statements.find(s => s.id === id)
															?.description
													}
												</span>
											</label>
										))}
									</fieldset>
								) : null}
							</>
						)}
						<div className="grid gap-2">
							<h3 className="font-medium">Affected Records</h3>
							{review.records.length ? (
								review.records.map(r => (
									<div key={r.id}>
										<Link href={pathRecord(r.id)} className="underline">
											{r.title}
										</Link>
										{review.allocations
											.filter(a => a.record_id === r.id)
											.map(a => (
												<p
													key={a.statement_id}
													className="text-xs text-muted-foreground"
												>
													{a.statement_id === effectiveSource
														? "Preserve allocation"
														: "Remove allocation"}
													: {formatCurrency(a.amount)} ·{" "}
													{
														review.statements.find(
															s => s.id === a.statement_id,
														)?.description
													}
												</p>
											))}
									</div>
								))
							) : (
								<p className="text-muted-foreground">No affected Records.</p>
							)}
						</div>
						{error ? (
							<p role="alert" className="text-destructive">
								{error}
							</p>
						) : null}
						<DialogFooter>
							<Button variant="outline" disabled={busy} onClick={onClose}>
								Cancel
							</Button>
							<Button
								variant="destructive"
								disabled={
									busy || (!survivorAllocated && sources.length > 1 && !source)
								}
								onClick={confirm}
							>
								{busy ? "Deleting..." : "Delete selected duplicates"}
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
