"use client"

import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { db } from "@/data/db"
import {
	clearAllData,
	downloadExport,
	exportData,
	importData,
	parseImportFile,
	tableCounts,
} from "@/data/export-import"
import { seedIfEmpty } from "@/data/seed"
import { generateTestData } from "@/data/test-data"
import { useSyncStatus } from "@/hooks/use-sync-status"
import { cn } from "@/lib/utils"
import { ingestManualResult, resetSyncDisplay } from "@/logic/auto-sync"
import {
	disconnectDriveSync,
	pullDrive,
	pushDrive,
	syncDrive,
	wasVaultProven,
} from "@/logic/drive-sync"
import { trackBackupRequested } from "@/logic/learning"
import { formatRelativeTime } from "@/logic/shared"
import { pathPrivacy, pathTerms } from "@/routes"

const COUNT_ROWS = [
	["accounts", "Accounts", "lucide:landmark"],
	["statements", "Statements", "lucide:credit-card"],
	["records", "Records", "lucide:receipt-text"],
	["categories", "Categories", "lucide:tag"],
	["budgets", "Budgets", "lucide:piggy-bank"],
	["buckets", "Buckets", "lucide:wallet-cards"],
] as const

type StatusTone = {
	tone: keyof typeof STATUS_TONES
	icon: string
	title: string
	detail: string
}

const STATUS_TONES = {
	good: {
		tile: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
		ring: "border-emerald-500/30",
	},
	busy: { tile: "bg-sky-500/10 text-sky-600 dark:text-sky-400", ring: "border-sky-500/30" },
	warning: {
		tile: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
		ring: "border-amber-500/40 bg-amber-500/5",
	},
	danger: { tile: "bg-red-500/10 text-red-600 dark:text-red-400", ring: "border-red-500/40" },
	neutral: { tile: "bg-muted text-muted-foreground", ring: "" },
}

function MethodHeader({
	icon,
	title,
	description,
	badge,
	active,
}: {
	icon: string
	title: string
	description: string
	badge?: string
	active?: boolean
}) {
	return (
		<CardHeader className="flex flex-row items-start gap-3 border-b py-4">
			<span className="grid size-9 shrink-0 place-items-center rounded-lg border bg-background">
				<IconifyIcon icon={icon} className="size-4" />
			</span>
			<div className="grid min-w-0 flex-1 gap-1">
				<CardTitle className="flex items-center gap-2">
					{title}
					{badge ? (
						<Badge variant={active ? "default" : "secondary"}>{badge}</Badge>
					) : null}
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</div>
		</CardHeader>
	)
}

function StateRow({ tone, label, value }: { tone: string; label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-3 border-b py-1.5 last:border-b-0">
			<dt className="flex items-center gap-2 text-muted-foreground">
				<span
					className={cn(
						"size-2 shrink-0 rounded-full transition-colors duration-200 ease-out",
						tone,
					)}
				/>
				{label}
			</dt>
			<dd className="font-medium tabular-nums">{value}</dd>
		</div>
	)
}

function WorkspaceRow({
	icon,
	title,
	description,
	destructive,
	children,
}: {
	icon: string
	title: string
	description: string
	destructive?: boolean
	children: React.ReactNode
}) {
	return (
		<div className="flex flex-col gap-3 border-b px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between md:px-6">
			<div className="flex items-start gap-3">
				<span
					className={cn(
						"grid size-9 shrink-0 place-items-center rounded-lg border bg-background",
						destructive && "border-destructive/30 text-destructive",
					)}
				>
					<IconifyIcon icon={icon} className="size-4" />
				</span>
				<div className="min-w-0">
					<p className={cn("text-sm font-medium", destructive && "text-destructive")}>
						{title}
					</p>
					<p className="mt-0.5 max-w-xl text-xs text-muted-foreground">{description}</p>
				</div>
			</div>
			<div className="flex shrink-0 gap-2 sm:justify-end">{children}</div>
		</div>
	)
}

export default function DataSettingsPage() {
	const [busy, setBusy] = useState<string | null>(null)
	const [importFile, setImportFile] = useState<File | null>(null)
	const [confirmingClear, setConfirmingClear] = useState(false)
	const [confirmingDemo, setConfirmingDemo] = useState(false)
	const [confirmingPush, setConfirmingPush] = useState(false)
	const [confirmingPull, setConfirmingPull] = useState(false)
	const [now, setNow] = useState(() => Date.now())
	const [dragging, setDragging] = useState(false)
	const sync = useSyncStatus()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const counts =
		useLiveQuery(async () => {
			// Re-run whenever any table changes by depending on a cheap aggregate.
			await db.statements.toCollection().count()
			return tableCounts()
		}, []) ?? null

	const total = counts ? Object.values(counts).reduce((sum, count) => sum + count, 0) : 0

	useEffect(() => {
		const timer = window.setInterval(() => setNow(Date.now()), 1000)
		return () => window.clearInterval(timer)
	}, [])

	const handleExport = async () => {
		setBusy("export")
		try {
			downloadExport(await exportData())
			void trackBackupRequested().catch(() => undefined)
			toast.success("Backup file downloaded.")
		} catch {
			toast.error("Couldn't save backup file.")
		} finally {
			setBusy(null)
		}
	}

	const handleImport = async () => {
		if (!importFile) {
			toast.error("Choose a backup file first.")
			return
		}
		setBusy("import")
		try {
			const text = await importFile.text()
			await importData(parseImportFile(text))
			toast.success("Backup file restored.")
			setImportFile(null)
			if (fileInputRef.current) fileInputRef.current.value = ""
		} catch (cause) {
			toast.error(cause instanceof Error ? cause.message : "Import failed.")
		} finally {
			setBusy(null)
		}
	}

	const handleClear = async () => {
		if (!confirmingClear) {
			setConfirmingClear(true)
			return
		}
		setBusy("clear")
		try {
			await clearAllData()
			await seedIfEmpty()
			toast.success("Workspace cleared.")
			setConfirmingClear(false)
		} catch {
			toast.error("Could not clear data.")
		} finally {
			setBusy(null)
		}
	}

	const handleDemo = async () => {
		if (!confirmingDemo) {
			setConfirmingDemo(true)
			return
		}
		setBusy("demo")
		try {
			await importData(generateTestData())
			toast.success("Demo workspace loaded.")
			setConfirmingDemo(false)
		} catch {
			toast.error("Could not load demo data.")
		} finally {
			setBusy(null)
		}
	}

	const clearDrivePrompts = () => {
		setConfirmingPush(false)
		setConfirmingPull(false)
	}

	const warnIfVaultUnproven = () => {
		if (wasVaultProven() === false) {
			toast.warning("Connected for now, but lasting sign-in didn't stick.", {
				description:
					"Background sync will stop within the hour. Check cookies for this site, then reconnect.",
			})
		}
	}

	const handleDriveSync = async () => {
		setBusy("drive")
		try {
			const result = await syncDrive()
			await ingestManualResult(result)
			setConfirmingPush(false)
			setConfirmingPull(false)
			if (result.outcome === "up-to-date") toast.success("Already in sync with Google Drive.")
			else if (result.outcome === "pushed") {
				toast.success("Saved data to your Drive.")
				warnIfVaultUnproven()
			} else if (result.outcome === "pulled") {
				toast.success("Restored data from your Drive.")
				warnIfVaultUnproven()
			} else if (result.outcome === "conflict") {
				toast.warning("Both sides changed — choose which to keep.")
			} else toast.info("Nothing to sync yet.")
		} catch (cause) {
			toast.error(cause instanceof Error ? cause.message : "Drive sync failed.")
		} finally {
			setBusy(null)
		}
	}

	const resolveDrivePush = async () => {
		setBusy("drive-push")
		try {
			await pushDrive()
			await ingestManualResult({ outcome: "pushed" })
			clearDrivePrompts()
			toast.success("Saved data to your Drive.")
		} catch (cause) {
			toast.error(cause instanceof Error ? cause.message : "Could not write to Drive.")
		} finally {
			setBusy(null)
		}
	}

	const resolveDrivePull = async () => {
		setBusy("drive-pull")
		try {
			await pullDrive()
			await ingestManualResult({ outcome: "pulled" })
			clearDrivePrompts()
			toast.success("Restored data from your Drive.")
		} catch (cause) {
			toast.error(cause instanceof Error ? cause.message : "Could not read from Drive.")
		} finally {
			setBusy(null)
		}
	}

	const handleDrivePull = () => {
		if (!confirmingPull) {
			setConfirmingPull(true)
			return
		}
		void resolveDrivePull()
	}

	const handleDriveDisconnect = async () => {
		setBusy("drive-disconnect")
		try {
			await disconnectDriveSync()
			await resetSyncDisplay()
			clearDrivePrompts()
			toast.success("Google Drive disconnected on this device.")
		} catch {
			toast.error("Could not disconnect.")
		} finally {
			setBusy(null)
		}
	}

	const driveUnconfigured = !sync.configured
	const driveConnected = sync.lastSyncAt != null
	const driveTeaser = sync.configured && sync.kind === "never-synced"
	const syncConflict = sync.kind === "conflict"
	const driveState: { tone: string; label: string } =
		sync.kind === "conflict"
			? { tone: "bg-amber-500", label: "Needs your decision" }
			: sync.kind === "needs-auth"
				? { tone: "bg-red-500", label: "Reconnect needed" }
				: sync.kind === "offline"
					? { tone: "bg-zinc-400", label: "Offline" }
					: sync.kind === "error"
						? { tone: "bg-red-500", label: "Sync failed" }
						: sync.remoteModifiedTime
							? { tone: "bg-emerald-500", label: "Up to date" }
							: { tone: "bg-zinc-400", label: "No copy yet" }
	const activityLabel =
		sync.activity === "checking"
			? "Checking Drive"
			: sync.activity === "pushing"
				? "Writing to Drive"
				: "Reading from Drive"
	const status: StatusTone = driveUnconfigured
		? {
				tone: "neutral",
				icon: "lucide:hard-drive",
				title: "Saved in this browser only",
				detail: "Download a backup file below to keep a copy somewhere safe.",
			}
		: sync.activity
			? {
					tone: "busy",
					icon: "lucide:refresh-cw",
					title: `${activityLabel}…`,
					detail:
						sync.activityStartedAt != null
							? `Started ${Math.max(0, Math.round((now - sync.activityStartedAt) / 1000))}s ago`
							: "Just started",
				}
			: driveTeaser
				? {
						tone: "neutral",
						icon: "lucide:cloud-off",
						title: "Not backed up yet",
						detail: "Connect your own Google Drive to keep every device in sync.",
					}
				: syncConflict
					? {
							tone: "warning",
							icon: "lucide:git-compare-arrows",
							title: "Needs your decision",
							detail: `This browser and Google Drive both changed${sync.conflictAt ? ` (Drive copy from ${new Date(sync.conflictAt).toLocaleString()})` : ""}. Keep one; the other is replaced.`,
						}
					: sync.kind === "needs-auth"
						? {
								tone: "danger",
								icon: "lucide:key-round",
								title: "Reconnect Google Drive",
								detail: "Sign-in expired, so background sync has paused.",
							}
						: sync.kind === "error"
							? {
									tone: "danger",
									icon: "lucide:triangle-alert",
									title: "Sync failed",
									detail: sync.error ?? "Try again in a moment.",
								}
							: sync.kind === "offline"
								? {
										tone: "neutral",
										icon: "lucide:wifi-off",
										title: "Offline",
										detail: sync.localDirty
											? "Your changes will sync when you're back online."
											: "Nothing waiting to sync.",
									}
								: sync.localDirty
									? {
											tone: "busy",
											icon: "lucide:cloud-upload",
											title: "Changes waiting to sync",
											detail: "They're saved here and will reach Drive shortly.",
										}
									: {
											tone: "good",
											icon: "lucide:cloud-check",
											title: "In sync with Google Drive",
											detail: sync.lastCheckAt
												? `Last checked ${formatRelativeTime(sync.lastCheckAt, now)}`
												: "Everything is backed up.",
										}

	return (
		<>
			<PageContent>
				<PageHeader
					title="Data"
					subtitle="Your data lives in this browser. Back it up automatically to your own Google Drive, or to a file you keep."
					description="Backup & sync"
					icon="lucide:database"
				/>

				<div className="grid max-w-5xl gap-6">
					<section
						aria-live="polite"
						className={cn(
							"grid gap-5 rounded-xl border bg-card p-5 transition-colors duration-200 ease-out md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6",
							STATUS_TONES[status.tone].ring,
						)}
					>
						<div className="flex items-start gap-4">
							<span
								className={cn(
									"grid size-12 shrink-0 place-items-center rounded-xl transition-colors duration-200 ease-out",
									STATUS_TONES[status.tone].tile,
								)}
							>
								<IconifyIcon
									icon={status.icon}
									className={cn(
										"size-6",
										sync.activity &&
											"animate-spin [animation-duration:2s] motion-reduce:animate-none",
									)}
								/>
							</span>
							<div
								key={status.title}
								className="min-w-0 animate-in duration-200 ease-out fade-in-0 slide-in-from-bottom-1"
							>
								<h3 className="text-lg font-semibold tracking-tight md:text-xl">
									{status.title}
								</h3>
								<p className="mt-0.5 text-sm text-muted-foreground">
									{status.detail}
								</p>
							</div>
						</div>
						{driveUnconfigured ? null : (
							<div className="flex flex-wrap gap-2 md:justify-end">
								{syncConflict ? (
									<>
										<Button
											type="button"
											variant="outline"
											disabled={busy !== null}
											onClick={() => void resolveDrivePull()}
										>
											<IconifyIcon icon="lucide:cloud-download" />
											{busy === "drive-pull" ? "Reading…" : "Keep Drive copy"}
										</Button>
										<Button
											type="button"
											disabled={busy !== null}
											onClick={() => setConfirmingPush(true)}
										>
											<IconifyIcon icon="lucide:monitor-check" />
											{busy === "drive-push"
												? "Writing…"
												: "Keep this browser"}
										</Button>
									</>
								) : (
									<Button
										type="button"
										size="lg"
										disabled={busy !== null}
										onClick={() => void handleDriveSync()}
									>
										<IconifyIcon
											icon={driveTeaser ? "lucide:link" : "lucide:refresh-cw"}
										/>
										{busy === "drive"
											? "Syncing…"
											: driveTeaser
												? "Connect Google Drive"
												: sync.kind === "needs-auth"
													? "Reconnect"
													: "Sync now"}
									</Button>
								)}
							</div>
						)}
					</section>

					<section
						aria-label="Data in this browser"
						className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3 lg:grid-cols-6"
					>
						{COUNT_ROWS.map(([key, label, icon]) => (
							<div key={key} className="grid gap-1 bg-card px-4 py-3">
								<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
									<IconifyIcon icon={icon} className="size-3.5" />
									{label}
								</span>
								{counts ? (
									<span className="text-xl font-semibold tabular-nums">
										{(counts[key] ?? 0).toLocaleString()}
									</span>
								) : (
									<span className="invisible text-xl font-semibold">0</span>
								)}
							</div>
						))}
					</section>

					<div className="grid gap-6 lg:grid-cols-2">
						<Card className="gap-0 py-0">
							<MethodHeader
								icon="lucide:cloud"
								title="Google Drive"
								description="Automatic. Stored in a hidden app folder in your own Drive. Finpoint never sees it."
								badge={
									driveUnconfigured
										? "Not available"
										: driveTeaser
											? "Not connected"
											: "Connected"
								}
								active={!driveUnconfigured && !driveTeaser}
							/>
							<CardContent className="grid flex-1 content-start gap-3 py-4 text-sm">
								{driveUnconfigured ? (
									process.env.NODE_ENV === "development" ? (
										<ol className="grid list-decimal gap-2 pl-5 text-muted-foreground">
											<li>
												Create a Web OAuth client in Google Cloud Console.
											</li>
											<li>
												Add this site as an authorised JavaScript origin.
											</li>
											<li>
												Set <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in{" "}
												<code>.env</code> and restart.
											</li>
										</ol>
									) : (
										<p className="text-muted-foreground">
											Drive sync isn't enabled on this deployment. Backup
											files work regardless.
										</p>
									)
								) : driveTeaser ? (
									<p className="text-muted-foreground">
										Connect once and Finpoint keeps this browser and your other
										devices in step in the background.
									</p>
								) : (
									<dl className="grid gap-2">
										<StateRow
											tone={
												sync.localDirty ? "bg-amber-500" : "bg-emerald-500"
											}
											label="This browser"
											value={sync.localDirty ? "Unsaved changes" : "Saved"}
										/>
										<StateRow
											tone={driveState.tone}
											label="Google Drive"
											value={driveState.label}
										/>
										<StateRow
											tone="bg-zinc-400"
											label="Last checked"
											value={
												sync.lastCheckAt
													? formatRelativeTime(sync.lastCheckAt, now)
													: "Never"
											}
										/>
									</dl>
								)}
							</CardContent>
							{driveUnconfigured || driveTeaser ? null : (
								<CardFooter className="flex flex-wrap gap-2 border-t py-3">
									<Button
										type="button"
										variant="outline"
										size="sm"
										disabled={busy !== null || !driveConnected}
										onClick={() => setConfirmingPush(true)}
									>
										<IconifyIcon icon="lucide:cloud-upload" />
										{busy === "drive-push" ? "Writing…" : "Overwrite Drive"}
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										disabled={busy !== null || !driveConnected}
										onClick={() => handleDrivePull()}
									>
										<IconifyIcon icon="lucide:cloud-download" />
										{busy === "drive-pull"
											? "Reading…"
											: confirmingPull
												? "Click again to replace this browser"
												: "Restore from Drive"}
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="sm:ml-auto"
										disabled={busy !== null || !driveConnected}
										onClick={() => void handleDriveDisconnect()}
									>
										{busy === "drive-disconnect"
											? "Disconnecting…"
											: "Disconnect"}
									</Button>
								</CardFooter>
							)}
						</Card>

						<Card className="gap-0 py-0">
							<MethodHeader
								icon="lucide:file-json"
								title="Backup file"
								description="Manual. Download one file you keep, and restore it here or on another device."
							/>
							<CardContent className="grid gap-4 py-4">
								<Button
									type="button"
									className="w-full"
									disabled={busy !== null || total === 0}
									onClick={() => void handleExport()}
								>
									<IconifyIcon icon="lucide:download" />
									{busy === "export"
										? "Downloading…"
										: `Download backup · ${total.toLocaleString()} items`}
								</Button>
								<Input
									ref={fileInputRef}
									type="file"
									accept=".json,application/json"
									aria-label="Finpoint backup file"
									className="hidden"
									onChange={event =>
										setImportFile(event.currentTarget.files?.[0] ?? null)
									}
								/>
								<button
									type="button"
									disabled={busy !== null}
									onClick={() => fileInputRef.current?.click()}
									onDragOver={event => {
										event.preventDefault()
										setDragging(true)
									}}
									onDragLeave={() => setDragging(false)}
									onDrop={event => {
										event.preventDefault()
										setDragging(false)
										const file = event.dataTransfer.files?.[0]
										if (file) setImportFile(file)
									}}
									className={cn(
										"grid cursor-pointer place-items-center gap-1.5 rounded-lg border border-dashed px-4 py-6 text-center text-sm transition-[background-color,border-color,transform] duration-150 ease-out hover:bg-muted/50 active:scale-[0.99] disabled:active:scale-100",
										dragging && "scale-[1.01] border-foreground bg-muted/60",
									)}
								>
									<IconifyIcon
										icon={importFile ? "lucide:file-check" : "lucide:upload"}
										className={cn(
											"size-5 text-muted-foreground transition-[transform,color] duration-150 ease-out",
											dragging && "-translate-y-1 text-foreground",
										)}
									/>
									{importFile ? (
										<>
											<span className="max-w-full truncate font-medium">
												{importFile.name}
											</span>
											<span className="text-xs text-muted-foreground">
												{(importFile.size / 1024).toFixed(1)} KB · choose
												another
											</span>
										</>
									) : (
										<>
											<span className="font-medium">
												Restore from a backup file
											</span>
											<span className="text-xs text-muted-foreground">
												Drop it here or click to choose
											</span>
										</>
									)}
								</button>
								{importFile ? (
									<div className="flex animate-in flex-wrap items-center justify-between gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs duration-200 ease-out fade-in-0 slide-in-from-top-1">
										<span>Restoring replaces everything in this browser.</span>
										<span className="flex gap-1.5">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => {
													setImportFile(null)
													if (fileInputRef.current)
														fileInputRef.current.value = ""
												}}
											>
												Cancel
											</Button>
											<Button
												type="button"
												size="sm"
												disabled={busy !== null}
												onClick={() => void handleImport()}
											>
												{busy === "import" ? "Restoring…" : "Restore"}
											</Button>
										</span>
									</div>
								) : null}
							</CardContent>
						</Card>
					</div>

					<Card className="gap-0 py-0">
						<CardHeader className="border-b py-4">
							<CardTitle>Workspace</CardTitle>
						</CardHeader>
						<WorkspaceRow
							icon="lucide:sparkles"
							title="Try demo data"
							description="3 accounts, 5 months of Records, 470+ Statements (40+ waiting to be matched), 2 budgets and buckets. Replaces everything in this browser."
						>
							{confirmingDemo && busy !== "demo" ? (
								<Button
									type="button"
									variant="ghost"
									className="animate-in duration-150 ease-out fade-in-0"
									onClick={() => setConfirmingDemo(false)}
								>
									Cancel
								</Button>
							) : null}
							<Button
								type="button"
								variant={confirmingDemo ? "default" : "outline"}
								disabled={busy !== null}
								onClick={() => {
									if (confirmingDemo) void handleDemo()
									else setConfirmingDemo(true)
								}}
							>
								{busy === "demo"
									? "Loading…"
									: confirmingDemo
										? "Replace with demo data"
										: "Load demo data"}
							</Button>
						</WorkspaceRow>
						<WorkspaceRow
							icon="lucide:trash-2"
							title="Clear all data"
							description="Delete everything in this browser, then restore the default categories and buckets."
							destructive
						>
							{confirmingClear && busy !== "clear" ? (
								<Button
									type="button"
									variant="ghost"
									className="animate-in duration-150 ease-out fade-in-0"
									onClick={() => setConfirmingClear(false)}
								>
									Cancel
								</Button>
							) : null}
							<Button
								type="button"
								variant="destructive"
								disabled={busy !== null}
								onClick={() => {
									if (confirmingClear) void handleClear()
									else setConfirmingClear(true)
								}}
							>
								{busy === "clear"
									? "Clearing…"
									: confirmingClear
										? "Yes, clear everything"
										: "Clear all data"}
							</Button>
						</WorkspaceRow>
					</Card>

					<p className="text-center text-xs text-muted-foreground">
						<Link href={pathPrivacy()} className="underline">
							Privacy Policy
						</Link>{" "}
						·{" "}
						<Link href={pathTerms()} className="underline">
							Terms of Service
						</Link>
					</p>
				</div>
			</PageContent>

			<AlertDialog open={confirmingPush} onOpenChange={setConfirmingPush}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Replace the Google Drive backup?</AlertDialogTitle>
						<AlertDialogDescription>
							This replaces the Finpoint data in Google Drive with the data on this
							browser. Changes that exist only in Drive will be lost.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={() => void resolveDrivePush()}
						>
							Replace Drive backup
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
