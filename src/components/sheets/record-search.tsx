import { useLiveQuery } from "dexie-react-hooks"
import { useDeferredValue, useEffect, useState } from "react"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
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
import { classForCurrency, cn, formatCurrency, parseDatetime } from "@/lib/utils"
import { listRecords } from "@/logic/records"
import { round2 } from "@/logic/shared"
import { Record } from "@/types"

const PAGE = 40

export default function RecordSearchSheet({
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
	/** Amount being attached; Records whose remaining amount equals it are surfaced first. */
	target?: number
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	handler: (record: Record) => Promise<void>
	trigger?: React.ReactNode
}) {
	const [query, setQuery] = useState("")
	// Typing stays responsive; the list catches up at lower priority.
	const deferredQuery = useDeferredValue(query)
	const [includeOlder, setIncludeOlder] = useState(false)
	const [limit, setLimit] = useState(PAGE)
	const [attachingId, setAttachingId] = useState<string | null>(null)
	const records = useLiveQuery(() => {
		if (!isOpen) return []
		return listRecords({
			query: deferredQuery || null,
			exclude_budget_id: filters?.exclude_budget_id ?? null,
			start_date: includeOlder ? null : (filters?.start_date ?? null),
			end_date: filters?.end_date ?? null,
			is_allocated: filters?.is_allocated ?? null,
		})
	}, [
		isOpen,
		deferredQuery,
		includeOlder,
		filters?.exclude_budget_id,
		filters?.start_date,
		filters?.end_date,
		filters?.is_allocated,
	])

	useEffect(() => {
		if (!isOpen) {
			setQuery("")
			setIncludeOlder(false)
			setLimit(PAGE)
			setAttachingId(null)
		}
	}, [isOpen])

	const remainingOf = (record: Record) => round2(record.amount - record.allocated_amount)
	const isMatch = (record: Record) =>
		target !== undefined && target !== 0 && remainingOf(record) === round2(target)
	const sorted = records
		? target === undefined
			? records
			: [...records.filter(isMatch), ...records.filter(record => !isMatch(record))]
		: undefined
	const visible = sorted?.slice(0, limit) ?? []
	const matches = sorted?.filter(isMatch).length ?? 0

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent side="right" className="gap-0 md:data-[side=right]:max-w-xl">
				<SheetHeader className="gap-1 border-b p-4 pr-12 md:px-6">
					<SheetTitle className="text-base">{title}</SheetTitle>
					<SheetDescription>
						{target !== undefined ? (
							<>
								Attaching{" "}
								<span className="font-medium text-foreground tabular-nums">
									{formatCurrency(target)}
								</span>
								{matches
									? ` · ${matches} Record${matches === 1 ? "" : "s"} need exactly this`
									: ". Select the Record it belongs to."}
							</>
						) : (
							"Select the Record to attach."
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
							aria-label="Search records"
							placeholder={placeholder ?? "Search title, people, location..."}
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
						deferredQuery !== query && "opacity-70 transition-opacity",
					)}
				>
					{sorted === undefined ? null : visible.length === 0 ? (
						<div className="grid place-items-center gap-2 px-6 py-16 text-center text-sm text-muted-foreground">
							<IconifyIcon icon="lucide:search-x" className="size-6" />
							No matching Records.
							{filters?.start_date && !includeOlder ? (
								<Button
									variant="link"
									size="sm"
									onClick={() => setIncludeOlder(true)}
								>
									Search older Records too
								</Button>
							) : null}
						</div>
					) : (
						<ul className="grid gap-px p-2">
							{visible.map(record => (
								<li key={record.id}>
									<RecordOption
										record={record}
										remaining={remainingOf(record)}
										match={isMatch(record)}
										busy={attachingId === record.id}
										disabled={attachingId !== null}
										onSelect={async () => {
											setAttachingId(record.id)
											try {
												await handler(record)
											} finally {
												setAttachingId(null)
											}
										}}
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
			</SheetContent>
		</Sheet>
	)
}

function RecordOption({
	record,
	remaining,
	match,
	busy,
	disabled,
	onSelect,
}: {
	record: Record
	remaining: number
	match: boolean
	busy: boolean
	disabled: boolean
	onSelect: () => void
}) {
	const progress =
		record.amount === 0 ? 0 : Math.min(Math.abs(record.allocated_amount / record.amount), 1)
	const date = parseDatetime(record.datetime)
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onSelect}
			className={cn(
				"group grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none disabled:cursor-default",
				match && "bg-emerald-500/5 ring-1 ring-emerald-500/30 ring-inset",
				disabled && !busy && "opacity-60",
			)}
		>
			<Icon icon={record.category.icon} color={record.category.color} size={16} />
			<span className="min-w-0">
				<span className="flex items-center gap-1.5">
					<span className="truncate text-sm font-medium">{record.title}</span>
					{match ? (
						<Badge className="shrink-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
							Exact match
						</Badge>
					) : null}
				</span>
				<span className="block truncate text-xs text-muted-foreground">
					{date.isValid ? date.toFormat("d MMM yyyy") : record.datetime}
					{" · "}
					{record.category.name}
					{record.subtitle ? ` · ${record.subtitle}` : ""}
				</span>
				<span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-muted group-hover:bg-background">
					<span
						className="block h-full rounded-full bg-foreground/50"
						style={{ width: `${progress * 100}%` }}
					/>
				</span>
			</span>
			<span className="grid justify-items-end gap-0.5">
				<span
					className={cn(
						"text-sm font-semibold tabular-nums",
						classForCurrency(record.amount),
					)}
				>
					{formatCurrency(record.amount)}
				</span>
				<span className="text-[0.6875rem] text-muted-foreground tabular-nums">
					{busy ? (
						<IconifyIcon icon="lucide:loader-circle" className="size-3 animate-spin" />
					) : remaining !== 0 ? (
						`${formatCurrency(Math.abs(remaining))} left`
					) : record.pending_statement_count ? (
						"Awaiting bank statement"
					) : (
						"Fully allocated"
					)}
				</span>
			</span>
		</button>
	)
}
