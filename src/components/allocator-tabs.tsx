import { DateTime } from "luxon"
import Link from "next/link"
import { useDefaultFilterEndDateToday, useDefaultFilterStartDate } from "@/hooks/use-settings"
import { cn } from "@/lib/utils"
import { pathAllocator, pathAllocatorPending } from "@/routes"

export default function AllocatorTabs({ active }: { active: "allocate" | "replace" }) {
	const defaultFilterStartDate = useDefaultFilterStartDate()
	const defaultFilterEndDateToday = useDefaultFilterEndDateToday()

	return (
		<nav className="flex border-b" aria-label="Allocator views">
			<Link
				className={cn(
					"border-b-2 px-4 py-2 text-sm transition-colors duration-150 ease-out",
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
					"border-b-2 px-4 py-2 text-sm transition-colors duration-150 ease-out",
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
