"use client"

import { SettingsIcon } from "lucide-react"
import { DateTime } from "luxon"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { useHistory } from "@/history"
import { useDefaultFilterEndDateToday, useDefaultFilterStartDate } from "@/hooks/use-settings"
import { useSyncStatus } from "@/hooks/use-sync-status"
import { cn } from "@/lib/utils"
import {
	pathAccounts,
	pathAllocator,
	pathBudgets,
	pathCategories,
	pathDashboard,
	pathDataSettings,
	pathImporter,
	pathRecords,
	pathSettings,
	pathStatementRules,
	pathStatements,
} from "@/routes"

const SETTINGS_PATHS = [
	pathSettings(),
	pathCategories(),
	pathStatementRules(),
	pathImporter(),
	pathDataSettings(),
]

const LINK_CLASS =
	"flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted/60 hover:text-foreground data-[active=true]:bg-muted data-[active=true]:font-medium data-[active=true]:text-foreground"

function useSyncIndicator() {
	const sync = useSyncStatus()
	if (!sync.configured) return null
	const busy = sync.activity != null
	const tone: string =
		sync.activity != null
			? "bg-sky-500"
			: sync.kind === "conflict"
				? "bg-amber-500"
				: sync.kind === "needs-auth" || sync.kind === "error"
					? "bg-red-500"
					: sync.kind === "offline"
						? sync.localDirty
							? "bg-amber-500"
							: "bg-zinc-400"
						: sync.kind === "local-changes" || sync.kind === "never-synced"
							? "bg-sky-500"
							: "bg-emerald-500"
	const title =
		sync.activity === "checking"
			? "Checking Drive…"
			: sync.activity === "pushing"
				? "Writing to Drive…"
				: sync.activity === "pulling"
					? "Reading from Drive…"
					: sync.kind === "conflict"
						? "Needs your decision"
						: sync.kind === "needs-auth"
							? "Reconnect Google Drive"
							: sync.kind === "offline"
								? "Offline"
								: sync.kind === "local-changes"
									? "Changes waiting to sync"
									: sync.kind === "never-synced"
										? "Not connected yet"
										: sync.kind === "error"
											? (sync.error ?? "Sync failed")
											: "In sync"
	return { tone, title, busy }
}

/** Drive sync state, shown on the Settings link because Data lives there. */
function SyncDot() {
	const indicator = useSyncIndicator()
	if (!indicator) return null
	return (
		<span
			title={indicator.title}
			className={`relative size-2 shrink-0 rounded-full transition-colors duration-300 ease-out ${indicator.tone}`}
		>
			{indicator.busy ? (
				<span className="absolute inset-0 animate-ping rounded-full bg-sky-500/60 motion-reduce:hidden" />
			) : null}
		</span>
	)
}

/** Top navigation: the everyday pages as buttons, and Settings for everything that sets them up. */
export default function AppNav({ title }: { title: string }) {
	const { handleClear } = useHistory()
	const pathname = usePathname()
	const defaultFilterStartDate = useDefaultFilterStartDate()
	const defaultFilterEndDateToday = useDefaultFilterEndDateToday()
	const defaultFilterEndDate = defaultFilterEndDateToday
		? DateTime.now().toFormat("yyyy-MM-dd")
		: undefined

	const items = [
		{ to: pathDashboard(), label: "Dashboard", active: pathname === pathDashboard() },
		{
			to: pathAllocator({
				start_date: defaultFilterStartDate ?? undefined,
				end_date: defaultFilterEndDate,
			}),
			label: "Workflows",
			active: pathname.startsWith(pathAllocator()),
		},
		{
			to: pathRecords(
				defaultFilterStartDate || defaultFilterEndDate
					? {
							start_date: defaultFilterStartDate ?? undefined,
							end_date: defaultFilterEndDate,
						}
					: undefined,
			),
			label: "Records",
			active: pathname.startsWith(pathRecords()),
		},
		{
			to: pathStatements(),
			label: "Statements",
			active: pathname.startsWith(pathStatements()),
		},
		{ to: pathAccounts(), label: "Accounts", active: pathname.startsWith(pathAccounts()) },
		{ to: pathBudgets(), label: "Budgets", active: pathname.startsWith(pathBudgets()) },
	]
	const active = items.find(item => item.active)?.label

	// Narrow screens scroll the page links sideways; keep the current page in view.
	const links = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!active) return
		links.current
			?.querySelector('[data-active="true"]')
			?.scrollIntoView({ block: "nearest", inline: "center" })
	}, [active])

	return (
		<header className="top-0 z-30 border-b bg-background/85 backdrop-blur-md lg:sticky">
			<h1 className="sr-only">{title}</h1>
			<nav
				data-app-nav
				aria-label="Main"
				className="container mx-auto grid grid-cols-[1fr_auto] items-center gap-x-4 px-4 md:px-8 lg:flex lg:h-14 lg:gap-x-6"
			>
				<Link
					href={pathDashboard()}
					onClick={handleClear}
					className="flex h-12 w-fit items-center gap-2 text-base font-semibold tracking-tight lg:h-auto"
				>
					<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
						<img src="/favicon.svg" alt="" className="size-5" />
					</span>
					Finpoint
				</Link>
				<div
					ref={links}
					className="order-last col-span-full -mx-4 flex gap-1 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:-mx-8 md:px-8 lg:order-none lg:mx-0 lg:flex-1 lg:p-0"
				>
					{items.map(item => (
						<Link
							key={item.label}
							href={item.to}
							data-active={item.active}
							onClick={handleClear}
							className={LINK_CLASS}
						>
							{item.label}
						</Link>
					))}
				</div>
				<Link
					href={pathSettings()}
					data-active={SETTINGS_PATHS.some(path => pathname.startsWith(path))}
					onClick={handleClear}
					className={cn(LINK_CLASS, "-mr-2 lg:mr-0")}
				>
					<SyncDot />
					<SettingsIcon className="size-4" />
					Settings
				</Link>
			</nav>
		</header>
	)
}
