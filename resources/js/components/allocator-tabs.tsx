import { Link } from "@inertiajs/react"
import { cn } from "@/lib/utils"
import { allocatorPendingWebRoute, allocatorWebRoute } from "@/wayfinder/routes"

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
				href={allocatorWebRoute()}
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
				href={allocatorPendingWebRoute()}
			>
				Replace Pending
			</Link>
		</nav>
	)
}
