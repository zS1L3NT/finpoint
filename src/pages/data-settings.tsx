import { Icon as IconifyIcon } from "@iconify/react"
import { useLiveQuery } from "dexie-react-hooks"
import { useRef, useState } from "react"
import { toast } from "sonner"
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
import { db } from "@/data/db"
import {
	clearAllData,
	downloadExport,
	exportData,
	importData,
	parseImportFile,
	tableCounts,
} from "@/data/exportImport"
import { seedIfEmpty } from "@/data/seed"

export default function DataSettingsPage() {
	const [busy, setBusy] = useState<string | null>(null)
	const [importFile, setImportFile] = useState<File | null>(null)
	const [confirmingClear, setConfirmingClear] = useState(false)
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
			toast.success("Export downloaded.")
		} catch {
			toast.error("Export failed.")
		} finally {
			setBusy(null)
		}
	}

	const handleImport = async () => {
		if (!importFile) {
			toast.error("Choose an export file first.")
			return
		}
		setBusy("import")
		try {
			const text = await importFile.text()
			await importData(parseImportFile(text))
			toast.success("Import complete. Your data was replaced.")
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
			toast.success("Workspace cleared and defaults restored.")
			setConfirmingClear(false)
		} catch {
			toast.error("Could not clear data.")
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
					subtitle="Your data lives in this browser's IndexedDB — it persists across sessions with no account or server. Export a JSON backup before switching browsers, and import it to restore."
					description="Settings"
					icon="lucide:database"
				/>

				<div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
					<div className="grid gap-6">
						<Card>
							<CardHeader className="border-b">
								<CardTitle>Export backup</CardTitle>
								<CardDescription>
									Download every account, statement, record, allocation, budget,
									category, and bucket as one versioned JSON file.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{counts ? (
									<ul className="grid gap-2 text-sm sm:grid-cols-2">
										{Object.entries(counts).map(([table, count]) => (
											<li
												key={table}
												className="flex items-center justify-between gap-3 border-b py-1.5"
											>
												<span className="text-muted-foreground">
													{table.replaceAll("_", " ")}
												</span>
												<span className="font-medium tabular-nums">
													{count}
												</span>
											</li>
										))}
									</ul>
								) : (
									<p className="text-sm text-muted-foreground">Loading counts…</p>
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
									{busy === "export"
										? "Exporting…"
										: `Download JSON (${total} rows)`}
								</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader className="border-b">
								<CardTitle>Import backup</CardTitle>
								<CardDescription>
									Restore from a Finpoint JSON export. This replaces all current
									data in this browser.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<input
									ref={fileInputRef}
									type="file"
									accept=".json,application/json"
									aria-label="Finpoint export file"
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
												{(importFile.size / 1024).toFixed(2)} KB · importing
												replaces everything currently stored
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
									{busy === "import" ? "Importing…" : "Import and replace"}
								</Button>
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
										Everything is stored locally in IndexedDB — no server sees
										your data.
									</span>
								</li>
								<li className="flex gap-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background">
										2
									</span>
									<span>
										Schema upgrades run automatically via versioned migrations.
									</span>
								</li>
								<li className="flex gap-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs text-background">
										3
									</span>
									<span>
										Export JSON before clearing browser data or moving devices.
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
