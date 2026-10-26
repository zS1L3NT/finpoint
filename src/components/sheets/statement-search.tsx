import { useLiveQuery } from "dexie-react-hooks"
import { useDeferredValue, useEffect, useState } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { classForCurrency, cn, formatCurrency, parseDatetime, pluralize, round2 } from "@/lib/utils"
import { listStatements } from "@/logic/statements"
import type { Statement } from "@/types"

const PAGE = 40

export default function StatementSearchSheet({
	title,
	placeholder,
	filters,
	target,
	isOpen,
	setIsOpen,
	handler,
	trigger,
}: {
	title: string
	placeholder?: string
	filters?: globalThis.Record<string, string | undefined>
	/** Amount the record still needs; statements whose allocable amount equals it are surfaced first. */
	target?: number
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	handler: (statement: Statement) => Promise<void>
	trigger?: React.ReactNode
}) {
	const [query, setQuery] = useState("")
	// Typing stays responsive; the list catches up at lower priority.
	const deferredQuery = useDeferredValue(query)
	const [includeOlder, setIncludeOlder] = useState(false)
	const [limit, setLimit] = useState(PAGE)
	const [attachedIds, setAttachedIds] = useState<string[]>([])
	const [epoch, setEpoch] = useState(0)
	useEffect(() => {
		if (!isOpen) {
			setEpoch(value => value + 1)
			setQuery("")
			setIncludeOlder(false)
			setLimit(PAGE)
			setAttachedIds([])
		}
	}, [isOpen])
	const accountId = filters?.account_id ?? null
	const excludeIds = filters?.exclude_ids ?? null
	const startDate = includeOlder ? null : (filters?.start_date ?? null)
	const endDate = filters?.end_date ?? null
	const isAllocable = filters?.is_allocable ?? null
	const isPending = filters?.is_pending ?? null
	const isUnallocated = filters?.is_unallocated ?? null
	// Cache tag for the current filter set; readiness gates on the opening
	// epoch only, so prior rows stay mounted (dimmed) while a new read resolves.
	const queryKey = `${deferredQuery}|${includeOlder}|${accountId ?? ""}|${excludeIds ?? ""}|${startDate ?? ""}|${endDate ?? ""}|${isAllocable ?? ""}|${isPending ?? ""}|${isUnallocated ?? ""}`
	const data = useLiveQuery(async () => {
		if (!isOpen) return null
		const rows = await listStatements({
			query: deferredQuery || null,
			account_id: accountId,
			exclude_ids: excludeIds,
			start_date: startDate,
			end_date: endDate,
			is_allocable: isAllocable,
			is_pending: isPending,
			is_unallocated: isUnallocated,
		})
		return { epoch, key: queryKey, rows }
	}, [
		isOpen,
		epoch,
		deferredQuery,
		includeOlder,
		accountId,
		excludeIds,
		startDate,
		endDate,
		isAllocable,
		isPending,
		isUnallocated,
	])
	const current =
		isOpen && data !== undefined && data !== null && data.epoch === epoch ? data : undefined
	const results = current?.rows
	const stale = current !== undefined && (deferredQuery !== query || current.key !== queryKey)

	const isMatch = (statement: Statement) =>
		target !== undefined &&
		target !== 0 &&
		round2(statement.allocable_amount) === round2(target)
	const remaining =
		results === undefined
			? undefined
			: results.filter(statement => !attachedIds.includes(statement.id))
	const sorted = remaining
		? [...remaining.filter(isMatch), ...remaining.filter(statement => !isMatch(statement))]
		: undefined
	const visible = sorted?.slice(0, limit) ?? []
	const matches = sorted?.filter(isMatch).length ?? 0

	const attach = async (statement: Statement) => {
		setAttachedIds(previous =>
			previous.includes(statement.id) ? previous : [...previous, statement.id],
		)
		await handler(statement)
	}

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent side="right" className="gap-0 md:data-[side=right]:max-w-xl">
				<SheetHeader className="gap-1 border-b p-4 pr-12 md:px-6">
					<SheetTitle className="text-base">{title}</SheetTitle>
					<SheetDescription>
						{target !== undefined && target !== 0 ? (
							<>
								This Record still needs{" "}
								<span className="font-medium text-foreground tabular-nums">
									{formatCurrency(target)}
								</span>
								{matches
									? ` · ${pluralize(matches, "Statement")} with exactly this amount remaining`
									: ". Select the statements to allocate to this record."}
							</>
						) : (
							"Select the statements to allocate to this record."
						)}
					</SheetDescription>
				</SheetHeader>

				<div className="flex items-center gap-2 border-b px-4 py-3 md:px-6">
					<div className="relative flex-1">
						<IconifyIcon
							icon="lucide:search"
							className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							type="search"
							autoFocus
							aria-label="Search statements"
							placeholder={placeholder ?? "Search descriptions..."}
							className="pl-8"
							value={query}
							onChange={event => {
								setQuery(event.target.value)
								setLimit(PAGE)
							}}
						/>
					</div>
					{filters?.start_date ? (
						<Button
							type="button"
							variant={includeOlder ? "secondary" : "outline"}
							aria-pressed={includeOlder}
							onClick={() => setIncludeOlder(value => !value)}
						>
							<IconifyIcon icon="lucide:history" data-icon="inline-start" />
							<span className="hidden sm:inline">Include older</span>
							<span className="sm:hidden">Older</span>
						</Button>
					) : null}
				</div>

				<div
					className={cn(
						"flex-1 overflow-y-auto overscroll-contain",
						stale && "opacity-70 transition-opacity",
					)}
				>
					{sorted === undefined ? null : visible.length === 0 ? (
						<div className="grid place-items-center gap-2 px-6 py-16 text-center text-sm text-muted-foreground">
							<IconifyIcon icon="lucide:search-x" className="size-6" />
							No allocable Statements.
							{filters?.start_date && !includeOlder ? (
								<Button
									variant="link"
									size="sm"
									onClick={() => setIncludeOlder(true)}
								>
									Search older Statements too
								</Button>
							) : null}
						</div>
					) : (
						<ul className="grid gap-px p-2">
							{visible.map(statement => (
								<li key={statement.id}>
									<StatementOption
										statement={statement}
										match={isMatch(statement)}
										onSelect={() => void attach(statement)}
									/>
								</li>
							))}
							{sorted.length > visible.length ? (
								<li className="p-2">
									<Button
										variant="ghost"
										className="w-full"
										onClick={() => setLimit(value => value + PAGE)}
									>
										Show more ({sorted.length - visible.length} left)
									</Button>
								</li>
							) : null}
						</ul>
					)}
				</div>

				{attachedIds.length ? (
					<div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm md:px-6">
						<span className="text-muted-foreground">
							{pluralize(attachedIds.length, "Statement")} selected for allocation
						</span>
						<Button onClick={() => setIsOpen(false)}>Done</Button>
					</div>
				) : null}
			</SheetContent>
		</Sheet>
	)
}

function StatementOption({
	statement,
	match,
	onSelect,
}: {
	statement: Statement
	match: boolean
	onSelect: () => void
}) {
	const allocable = round2(statement.allocable_amount)
	const partly = allocable !== round2(statement.amount)
	const date = parseDatetime(statement.datetime)
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ease-out hover:bg-muted active:bg-muted/60 focus-visible:bg-muted focus-visible:outline-none",
				match && "bg-emerald-500/5 ring-1 ring-emerald-500/30 ring-inset",
			)}
		>
			<span className="min-w-0">
				<span className="flex items-center gap-1.5">
					<span
						className="min-w-0 truncate text-sm font-medium"
						title={statement.description}
					>
						{statement.description || "No description"}
					</span>
					{statement.is_pending ? (
						<Badge variant="warning" className="shrink-0">
							Pending
						</Badge>
					) : null}
					{match ? (
						<Badge className="shrink-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
							Exact match
						</Badge>
					) : null}
				</span>
				<span className="block truncate text-xs text-muted-foreground">
					{statement.account.name} ·{" "}
					{date.isValid
						? date.toFormat(
								date.toFormat("h:mm a") === "12:00 AM"
									? "d MMM yyyy"
									: "d MMM yyyy, h:mm a",
							)
						: statement.datetime}
				</span>
			</span>
			<span className="grid justify-items-end gap-0.5">
				<span
					className={cn(
						"text-sm font-semibold tabular-nums",
						classForCurrency(allocable),
					)}
				>
					{formatCurrency(allocable)}
				</span>
				<span className="text-[0.6875rem] text-muted-foreground tabular-nums">
					{partly ? `of ${formatCurrency(statement.amount)}` : "Unallocated"}
				</span>
			</span>
		</button>
	)
}
