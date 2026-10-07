"use client"

import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getEmptyGuideContext } from "@/logic/learning"
import { pathHelp, pathImporter, pathStatements } from "@/routes"

export function EmptyGuide({
	kind,
	onClear,
}: {
	kind: "records" | "allocator"
	onClear: () => void
}) {
	const context = useLiveQuery(getEmptyGuideContext, [])
	if (!context) return null
	const noImports = context.statements === 0 && (kind !== "records" || context.records === 0)
	const queueClear = kind === "allocator" && !noImports && context.remaining === 0
	const noRecords = kind === "records" && context.records === 0
	return (
		<div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 text-sm leading-6">
			<p className="font-medium">
				{noImports
					? "No bank Statements in this workspace yet"
					: queueClear
						? "No remaining Statement amounts to explain"
						: noRecords
							? "Bank activity is here. Now explain your first purchase."
							: "Your filters may be hiding the item you want"}
			</p>
			<p className="text-muted-foreground">
				{noImports
					? "Import a supported bank CSV to bring in activity, or try a sample lesson first."
					: queueClear
						? "Fully allocated Statements leave Allocator. You can still find them in Statements. Review Pending Records separately."
						: noRecords
							? "Importing Statements does not create finished Records. Use Allocator to connect a bank amount to an explanation."
							: "Search, dates, Account, amount, Category, or Pending filters can narrow a list to zero. Check them before assuming the data is missing."}
			</p>
			<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
				<Button asChild variant="outline" size="lg" className="min-h-11">
					<Link
						href={
							noImports
								? pathImporter()
								: queueClear
									? pathStatements()
									: pathHelp(noRecords ? "lunch" : "find")
						}
					>
						{noImports
							? "Open Importer"
							: queueClear
								? "View Statements"
								: noRecords
									? "Learn your first purchase"
									: "Help me find my data"}
					</Link>
				</Button>
				{!noImports && !queueClear && (
					<Button variant="outline" size="lg" className="min-h-11" onClick={onClear}>
						Clear filters
					</Button>
				)}
				<Button asChild variant="ghost" size="lg" className="min-h-11">
					<Link href={pathHelp()}>Help & guides</Link>
				</Button>
			</div>
		</div>
	)
}
