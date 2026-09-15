import Link from "next/link"
import { START_DATE } from "@/constants"
import { cn } from "@/lib/utils"
import { pathAllocator, pathAllocatorPending } from "@/routes"

export default function AllocatorTabs({ active }: { active: "allocate" | "replace" }) {
	return (
		<nav className="flex border-b" aria-label="Allocator views">
			<Link
				className={cn(
					"border-b-2 px-4 py-2 text-sm",
					active === "allocate"
						? "border-foreground font-medium"
						: "border-transparent text-muted-foreground hover:text-foreground",
				)}
				href={pathAllocator({ start_date: START_DATE })}
			>
				Allocate to Records
			</Link>
			<Link
				className={cn(
					"border-b-2 px-4 py-2 text-sm",
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
