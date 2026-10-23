import { DateTime } from "luxon"
import Link from "next/link"
import { useDefaultFilterEndDateToday, useDefaultFilterStartDate } from "@/hooks/use-settings"
import { cn } from "@/lib/utils"
import { pathAllocator, pathAllocatorDuplicates, pathAllocatorPending } from "@/routes"

export default function WorkflowTabs({
	active,
}: {
	active: "allocate" | "replace" | "duplicates"
}) {
	const defaultFilterStartDate = useDefaultFilterStartDate()
	const defaultFilterEndDateToday = useDefaultFilterEndDateToday()

	return (
		<nav className="flex overflow-x-auto border-b" aria-label="Workflow views">
			<Link
				className={cn(
					"shrink-0 border-b-2 px-4 py-2 text-sm transition-colors duration-150 ease-out",
					active === "allocate"
						? "border-foreground font-medium"
						: "border-transparent text-muted-foreground hover:text-foreground",
				)}
				href={pathAllocator({
					start_date: defaultFilterStartDate ?? undefined,
					end_date: defaultFilterEndDateToday
						? DateTime.now().toFormat("yyyy-MM-dd")
						: undefined,
				})}
			>
				Allocate to Records
			</Link>
			<Link
				className={cn(
					"shrink-0 border-b-2 px-4 py-2 text-sm transition-colors duration-150 ease-out",
					active === "duplicates"
						? "border-foreground font-medium"
						: "border-transparent text-muted-foreground hover:text-foreground",
				)}
				href={pathAllocatorDuplicates()}
			>
				Fix Duplicates
			</Link>
			<Link
				className={cn(
					"shrink-0 border-b-2 px-4 py-2 text-sm transition-colors duration-150 ease-out",
					active === "replace"
						? "border-foreground font-medium"
						: "border-transparent text-muted-foreground hover:text-foreground",
				)}
				href={pathAllocatorPending()}
			>
				Replace Pending
			</Link>
		</nav>
	)
}
