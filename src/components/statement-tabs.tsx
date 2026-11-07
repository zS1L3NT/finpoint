import { DateTime } from "luxon"
import Link from "next/link"
import { useDefaultFilterEndDateToday, useDefaultFilterStartDate } from "@/hooks/use-settings"
import { cn } from "@/lib/utils"
import { pathStatements, pathStatementsDuplicates, pathStatementsPending } from "@/routes"

export default function StatementTabs({
	active,
}: {
	active: "statements" | "replace" | "duplicates"
}) {
	const defaultFilterStartDate = useDefaultFilterStartDate()
	const defaultFilterEndDateToday = useDefaultFilterEndDateToday()

	return (
		<nav className="flex overflow-x-auto border-b" aria-label="Statement views">
			<Link
				className={cn(
					"shrink-0 border-b-2 px-4 py-2 text-sm transition-colors duration-150 ease-out",
					active === "statements"
						? "border-foreground font-medium"
						: "border-transparent text-muted-foreground hover:text-foreground",
				)}
				href={pathStatements({
					start_date: defaultFilterStartDate ?? undefined,
					end_date: defaultFilterEndDateToday
						? DateTime.now().toFormat("yyyy-MM-dd")
						: undefined,
				})}
			>
				Statements
			</Link>
			<Link
				className={cn(
					"shrink-0 border-b-2 px-4 py-2 text-sm transition-colors duration-150 ease-out",
					active === "replace"
						? "border-foreground font-medium"
						: "border-transparent text-muted-foreground hover:text-foreground",
				)}
				href={pathStatementsPending()}
			>
				Replace pending
			</Link>
			<Link
				className={cn(
					"shrink-0 border-b-2 px-4 py-2 text-sm transition-colors duration-150 ease-out",
					active === "duplicates"
						? "border-foreground font-medium"
						: "border-transparent text-muted-foreground hover:text-foreground",
				)}
				href={pathStatementsDuplicates()}
			>
				Duplicates
			</Link>
		</nav>
	)
}
