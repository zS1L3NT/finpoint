"use client"

import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"
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
import { ingestManualResult, resetSyncDisplay } from "@/logic/auto-sync"
import { disconnectDriveSync, pullDrive, pushDrive, syncDrive } from "@/logic/drive-sync"
import { formatRelativeTime } from "@/logic/shared"
import { pathPrivacy, pathTerms } from "@/routes"

const COUNT_ROWS = [
	["accounts", "Accounts"],
	["statements", "Statements"],
	["records", "Records"],
	["categories", "Categories"],
	["budgets", "Budgets"],
	["buckets", "Spending buckets"],
] as const

function DataCounts({ counts }: { counts: Record<string, number> | null }) {
	if (!counts) {
		return (
			<ul className="grid gap-2 text-sm sm:grid-cols-2">
				{Array.from({ length: 6 }).map((_, index) => (
					<li
						key={index}
						className="flex items-center justify-between gap-3 border-b py-1.5"
					>
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-10" />
					</li>
				))}
			</ul>
		)
	}
	return (
		<ul className="grid gap-2 text-sm sm:grid-cols-2">
			{COUNT_ROWS.map(([key, label]) => (
				<li key={key} className="flex items-center justify-between gap-3 border-b py-1.5">
					<span className="text-muted-foreground">{label}</span>
					<span className="font-medium tabular-nums">{counts[key] ?? 0}</span>
				</li>
			))}
		</ul>
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
		const timer = window.setInterval(() => setNow(Date.now()), 30_000)
		return () => window.clearInterval(timer)
	}, [])

	const handleExport = async () => {
		setBusy("export")
		try {
			downloadExport(await exportData())
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

	const handleDriveSync = async () => {
		setBusy("drive")
		try {
			const result = await syncDrive()
			await ingestManualResult(result)
			setConfirmingPush(false)
			setConfirmingPull(false)
			if (result.outcome === "up-to-date") toast.success("Already in sync with Google Drive.")
			else if (result.outcome === "pushed") {
				toast.success("This browser written to Google Drive.")
			} else if (result.outcome === "pulled") {
				toast.success("Google Drive read into this browser.")
			} else if (result.outcome === "conflict") {
				toast.warning("Both sides changed — choose which to keep.")
			} else if (result.outcome === "remote-newer") {
				toast.warning("Google Drive has a newer copy — choose what to do.")
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
			toast.success("This browser written to Google Drive.")
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
			toast.success("Google Drive read into this browser.")
		} catch (cause) {
			toast.error(cause instanceof Error ? cause.message : "Could not read from Drive.")
		} finally {
			setBusy(null)
		}
	}

	const handleDrivePush = () => {
		if (!confirmingPush) {
			setConfirmingPush(true)
			return
		}
		void resolveDrivePush()
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
	const remoteNewer = sync.kind === "remote-newer"
	const syncConflict = sync.kind === "conflict"
	const browserTone =
		sync.kind === "never-synced"
			? "bg-zinc-400"
			: sync.localDirty
				? "bg-amber-500"
				: "bg-emerald-500"
	const browserLabel =
		sync.kind === "never-synced"
			? "Not yet synced"
			: sync.localDirty
				? "Unsaved changes"
				: "No unsaved changes"
	const driveState: { tone: string; label: string } =
		sync.kind === "conflict"
			? { tone: "bg-amber-500", label: "Needs your decision" }
			: sync.kind === "remote-newer"
				? { tone: "bg-amber-500", label: "Newer copy available" }
				: sync.kind === "needs-auth"
					? { tone: "bg-red-500", label: "Reconnect needed" }
					: sync.kind === "offline"
						? { tone: "bg-zinc-400", label: "Offline" }
						: sync.kind === "error"
							? { tone: "bg-red-500", label: "Sync failed" }
							: sync.remoteModifiedTime
								? { tone: "bg-emerald-500", label: "Up to date" }
								: { tone: "bg-zinc-400", label: "No copy yet" }

	return (
		<>
			<PageContent>
				<PageHeader
					title="Sync"
					subtitle="Two separate backup systems: sync with your own Google Drive, or keep a backup file yourself. Both hold the same data shown above."
					description="Settings"
					icon="lucide:database"
				/>

				<div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
					<div className="grid gap-6">
						<Card>
							<CardHeader className="border-b">
								<CardTitle>Your data on this browser</CardTitle>
								<CardDescription>
									Everything below lives in this browser. Both backup systems
									below save exactly this.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<DataCounts counts={counts} />
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="border-b">
								<CardTitle>Automatic sync</CardTitle>
								<CardDescription>
									Stored in your own Drive's hidden app folder — we never see it.
									Write this browser to Drive, or read Drive into this browser.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								{driveUnconfigured ? (
									process.env.NODE_ENV === "development" ? (
										<ol className="grid list-decimal gap-2 pl-5 text-muted-foreground">
											<li>
												Create a Web OAuth client in Google Cloud Console.
											</li>
											<li>
												Add this site as an authorized JavaScript origin for
												that client.
											</li>
											<li>
												Set <code>VITE_GOOGLE_CLIENT_ID</code> to the client
												ID and restart.
											</li>
										</ol>
									) : (
										<p className="text-muted-foreground">
											Google Drive sync isn't available in this version of
											Finpoint. Your file backup below works regardless.
										</p>
									)
								) : driveTeaser ? (
									<p className="text-muted-foreground">
										Keep this browser in sync across your devices using your own
										Google Drive — we never see it.
									</p>
								) : (
									<>
										<ul className="grid gap-2">
											<li className="flex items-center justify-between gap-3 border-b py-1.5">
												<span className="flex items-center gap-2 text-muted-foreground">
													<span
														className={`size-2 shrink-0 rounded-full ${browserTone}`}
													/>
													This browser
												</span>
												<span className="font-medium">{browserLabel}</span>
											</li>
											<li className="flex items-center justify-between gap-3 border-b py-1.5">
												<span className="flex items-center gap-2 text-muted-foreground">
													<span
														className={`size-2 shrink-0 rounded-full ${driveState.tone}`}
													/>
													Google Drive
												</span>
												<span className="font-medium">
													{driveState.label}
												</span>
											</li>
											<li
												className="flex items-center justify-between gap-3 border-b py-1.5"
												aria-live="polite"
											>
												{sync.activity ? (
													<>
														<span className="flex items-center gap-2 text-muted-foreground">
															<span className="size-2 shrink-0 animate-pulse rounded-full bg-sky-500" />
															{sync.activity === "checking"
																? "Checking Drive"
																: sync.activity === "pushing"
																	? "Writing to Drive"
																	: "Reading from Drive"}
														</span>
														<span className="font-medium text-muted-foreground">
															now
														</span>
													</>
												) : (
													<>
														<span className="flex items-center gap-2 text-muted-foreground">
															<span className="size-2 shrink-0 rounded-full bg-zinc-400" />
															Last synced
														</span>
														{sync.lastSyncAt ? (
															<span
																className="font-medium tabular-nums"
																title={new Date(
																	sync.lastSyncAt,
																).toLocaleString()}
															>
																{formatRelativeTime(
																	sync.lastSyncAt,
																	now,
																)}
															</span>
														) : (
															<span className="font-medium text-muted-foreground">
																Never
															</span>
														)}
													</>
												)}
											</li>
										</ul>
										{syncConflict ? (
											<p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3">
												This browser and Google Drive both changed (Drive
												copy from{" "}
												{sync.conflictAt
													? new Date(sync.conflictAt).toLocaleString()
													: "recently"}
												). Writing overwrites Drive; reading replaces this
												browser — the loser is replaced.
											</p>
										) : null}
										{remoteNewer ? (
											<p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3">
												Google Drive has a newer copy (from{" "}
												{sync.conflictAt
													? new Date(sync.conflictAt).toLocaleString()
													: "recently"}
												) and this browser hasn't changed since the last
												sync. Reading it replaces this browser.
											</p>
										) : null}
									</>
								)}
							</CardContent>
							<CardFooter className="flex flex-wrap gap-2 border-t bg-muted/20">
								{driveUnconfigured ? null : (
									<>
										<Button
											type="button"
											disabled={busy !== null || driveUnconfigured}
											onClick={() => void handleDriveSync()}
										>
											{driveTeaser ? (
												<IconifyIcon icon="lucide:link" />
											) : (
												<IconifyIcon icon="lucide:refresh-cw" />
											)}
											{busy === "drive"
												? "Syncing…"
												: driveTeaser
													? "Connect Google Drive"
													: "Sync now"}
										</Button>
										{syncConflict || remoteNewer ? (
											<>
												<Button
													type="button"
													variant="outline"
													disabled={busy !== null}
													onClick={() => void resolveDrivePull()}
												>
													<IconifyIcon icon="lucide:cloud-download" />
													{busy === "drive-pull"
														? "Reading…"
														: "Read Drive into this browser"}
												</Button>
												<Button
													type="button"
													variant="outline"
													disabled={busy !== null}
													onClick={() => void resolveDrivePush()}
												>
													<IconifyIcon icon="lucide:cloud-upload" />
													{busy === "drive-push"
														? "Writing…"
														: "Write this browser to Drive"}
												</Button>
											</>
										) : driveTeaser ? null : (
											<>
												<Button
													type="button"
													variant="outline"
													disabled={busy !== null || !driveConnected}
													onClick={() => handleDrivePush()}
												>
													<IconifyIcon icon="lucide:cloud-upload" />
													{busy === "drive-push"
														? "Writing…"
														: confirmingPush
															? "Click again to overwrite Drive"
															: "Write this browser to Drive"}
												</Button>
												<Button
													type="button"
													variant="outline"
													disabled={busy !== null || !driveConnected}
													onClick={() => handleDrivePull()}
												>
													<IconifyIcon icon="lucide:cloud-download" />
													{busy === "drive-pull"
														? "Reading…"
														: confirmingPull
															? "Click again to replace this browser"
															: "Read Drive into this browser"}
												</Button>
												<Button
													type="button"
													variant="outline"
													disabled={busy !== null || !driveConnected}
													onClick={() => void handleDriveDisconnect()}
												>
													{busy === "drive-disconnect"
														? "Disconnecting…"
														: "Disconnect"}
												</Button>
											</>
										)}
									</>
								)}
							</CardFooter>
						</Card>

						<Card>
							<CardHeader className="border-b">
								<CardTitle>Manual sync</CardTitle>
								<CardDescription>
									Manual and offline. Download a backup file you keep, and restore
									it here later or on another device.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-3">
									<p className="text-sm font-medium">
										Download from this browser
									</p>
									<p className="text-sm text-muted-foreground">
										Save everything on this browser into one file.
									</p>
									<Button
										type="button"
										disabled={busy !== null || total === 0}
										onClick={() => void handleExport()}
									>
										<IconifyIcon icon="lucide:download" />
										{busy === "export"
											? "Downloading…"
											: `Download backup (${total} items)`}
									</Button>
								</div>
								<div className="space-y-3 border-t pt-6">
									<p className="text-sm font-medium">Restore into this browser</p>
									<p className="text-sm text-muted-foreground">
										Replace everything in this browser with a backup file you
										saved earlier.
									</p>
									<input
										ref={fileInputRef}
										type="file"
										accept=".json,application/json"
										aria-label="Finpoint backup file"
										onChange={event =>
											setImportFile(event.currentTarget.files?.[0] ?? null)
										}
									/>
									{importFile ? (
										<Item variant="outline">
											<ItemMedia>
												<IconifyIcon
													icon="lucide:file-json"
													className="size-5"
												/>
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{importFile.name}</ItemTitle>
												<ItemDescription>
													{(importFile.size / 1024).toFixed(2)} KB ·
													restoring replaces everything you have now
												</ItemDescription>
											</ItemContent>
										</Item>
									) : null}
									<Button
										type="button"
										variant="outline"
										disabled={busy !== null || !importFile}
										onClick={() => void handleImport()}
									>
										<IconifyIcon icon="lucide:upload" />
										{busy === "import" ? "Restoring…" : "Restore from file"}
									</Button>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="border-b">
								<CardTitle>Try demo data</CardTitle>
								<CardDescription>
									Load a ready-made workspace with 3 accounts, 5 months of
									records, allocations, budgets, and buckets — the fastest way to
									see what Finpoint can do. This replaces all current data in this
									browser.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="grid gap-2 text-sm sm:grid-cols-2">
									{[
										["400+ records", "daily life, salary, investments"],
										["470+ statements", "40+ waiting to be matched"],
										["2 budgets", "a trip and a monthly plan"],
										["Practice inbox", "unfinished items to complete"],
									].map(([title, detail]) => (
										<li
											key={title}
											className="flex items-center justify-between gap-3 border-b py-1.5"
										>
											<span className="font-medium">{title}</span>
											<span className="text-right text-muted-foreground">
												{detail}
											</span>
										</li>
									))}
								</ul>
							</CardContent>
							<CardFooter className="border-t bg-muted/20">
								<Button
									type="button"
									className="w-full sm:ml-auto sm:w-auto"
									disabled={busy !== null}
									onClick={() => {
										if (confirmingDemo) void handleDemo()
										else setConfirmingDemo(true)
									}}
								>
									<IconifyIcon icon="lucide:sparkles" />
									{busy === "demo"
										? "Loading…"
										: confirmingDemo
											? "Click again to replace everything with demo data"
											: "Load demo data"}
								</Button>
								{confirmingDemo && busy !== "demo" ? (
									<Button
										type="button"
										variant="outline"
										onClick={() => setConfirmingDemo(false)}
									>
										Cancel
									</Button>
								) : null}
							</CardFooter>
						</Card>

						<Card className="border-destructive/40">
							<CardHeader className="border-b">
								<CardTitle className="text-destructive">Danger zone</CardTitle>
								<CardDescription>
									Clear the entire workspace in this browser, then restore the
									default categories and buckets.
								</CardDescription>
							</CardHeader>
							<CardFooter className="bg-muted/20">
								<Button
									type="button"
									variant="destructive"
									className="w-full sm:ml-auto sm:w-auto"
									disabled={busy !== null}
									onClick={() => {
										if (confirmingClear) void handleClear()
										else setConfirmingClear(true)
									}}
								>
									<IconifyIcon icon="lucide:trash-2" />
									{busy === "clear"
										? "Clearing…"
										: confirmingClear
											? "Click again to confirm clearing everything"
											: "Clear all data"}
								</Button>
								{confirmingClear && busy !== "clear" ? (
									<Button
										type="button"
										variant="outline"
										onClick={() => setConfirmingClear(false)}
									>
										Cancel
									</Button>
								) : null}
							</CardFooter>
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

					<Card className="bg-muted/20" size="sm">
						<CardHeader>
							<CardTitle>How storage works</CardTitle>
							<CardDescription>A quick note on where things live.</CardDescription>
						</CardHeader>
						<CardContent>
							<ol className="grid gap-4 text-sm">
								<li className="flex gap-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background">
										1
									</span>
									<span>
										Everything is saved in this browser on this device — no
										account, no server, nobody else sees it.
									</span>
								</li>
								<li className="flex gap-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background">
										2
									</span>
									<span>
										Automatic sync: write this browser to your own Google Drive
										and read it back on another device. Finpoint never sees it.
									</span>
								</li>
								<li className="flex gap-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background">
										3
									</span>
									<span>
										Manual sync: download a file yourself and restore it here
										later. Nothing leaves your hands.
									</span>
								</li>
							</ol>
						</CardContent>
					</Card>
				</div>
			</PageContent>
		</>
	)
}
