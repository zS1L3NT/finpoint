import { useLiveQuery } from "dexie-react-hooks"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { UiIcon as IconifyIcon } from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
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

export default function DataSettingsPage() {
	const [busy, setBusy] = useState<string | null>(null)
	const [importFile, setImportFile] = useState<File | null>(null)
	const [confirmingClear, setConfirmingClear] = useState(false)
	const [confirmingDemo, setConfirmingDemo] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const counts =
		useLiveQuery(async () => {
			// Re-run whenever any table changes by depending on a cheap aggregate.
			await db.statements.toCollection().count()
			return tableCounts()
		}, []) ?? null

	const total = counts ? Object.values(counts).reduce((sum, count) => sum + count, 0) : 0

	const handleExport = async () => {
		setBusy("export")
		try {
			downloadExport(await exportData())
			toast.success("Backup saved.")
		} catch {
			toast.error("Couldn't save backup.")
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
			toast.success("Backup restored.")
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

	return (
		<>
			<AppHeader title="Data" />

			<PageContent>
				<PageHeader
					title="Data"
					subtitle="Everything is saved privately in this browser — no account, no server. Save a backup before switching devices, and restore it to pick up where you left off."
					description="Settings"
					icon="lucide:database"
				/>

				<div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
					<div className="grid gap-6">
						<Card>
							<CardHeader className="border-b">
								<CardTitle>Save a backup</CardTitle>
								<CardDescription>
									Save everything — accounts, statements, records, budgets,
									categories, and spending buckets — into one backup file you can
									keep or move to another device.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{counts ? (
									<ul className="grid gap-2 text-sm sm:grid-cols-2">
										{(
											[
												["accounts", "Accounts"],
												["statements", "Statements"],
												["records", "Records"],
												["categories", "Categories"],
												["budgets", "Budgets"],
												["buckets", "Spending buckets"],
											] as const
										).map(([key, label]) => (
											<li
												key={key}
												className="flex items-center justify-between gap-3 border-b py-1.5"
											>
												<span className="text-muted-foreground">
													{label}
												</span>
												<span className="font-medium tabular-nums">
													{counts[key] ?? 0}
												</span>
											</li>
										))}
									</ul>
								) : (
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
								)}
							</CardContent>
							<CardFooter className="border-t bg-muted/20">
								<Button
									type="button"
									className="w-full sm:ml-auto sm:w-auto"
									disabled={busy !== null || total === 0}
									onClick={() => void handleExport()}
								>
									<IconifyIcon icon="lucide:download" />
									{busy === "export" ? "Saving…" : `Save backup (${total} items)`}
								</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader className="border-b">
								<CardTitle>Restore a backup</CardTitle>
								<CardDescription>
									Bring back a backup you saved earlier. This replaces everything
									currently in this browser.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
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
												{(importFile.size / 1024).toFixed(2)} KB · restoring
												replaces everything you have now
											</ItemDescription>
										</ItemContent>
									</Item>
								) : null}
							</CardContent>
							<CardFooter className="border-t bg-muted/20">
								<Button
									type="button"
									className="w-full sm:ml-auto sm:w-auto"
									disabled={busy !== null || !importFile}
									onClick={() => void handleImport()}
								>
									<IconifyIcon icon="lucide:upload" />
									{busy === "import" ? "Restoring…" : "Restore backup"}
								</Button>
							</CardFooter>
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
										Finpoint keeps itself up to date in the background; your
										data carries over automatically.
									</span>
								</li>
								<li className="flex gap-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background">
										3
									</span>
									<span>
										Save a backup before clearing browser data or moving to
										another device.
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
