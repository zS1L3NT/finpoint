import Link from "next/link"
import { cn } from "@/lib/utils"

/** Underlined section tabs for sibling pages. Moving between them leaves no Back entry. */
export default function TabNav({
	label,
	items,
}: {
	label: string
	items: { label: string; href: string; active: boolean }[]
}) {
	return (
		<nav
			data-tab-nav
			aria-label={label}
			className="flex overflow-x-auto border-b [scrollbar-width:none]"
		>
			{items.map(item => (
				<Link
					key={item.label}
					href={item.href}
					data-active={item.active}
					className={cn(
						"shrink-0 border-b-2 px-4 py-2 text-sm transition-colors duration-150 ease-out",
						item.active
							? "border-foreground font-medium"
							: "border-transparent text-muted-foreground hover:text-foreground",
					)}
				>
					{item.label}
				</Link>
			))}
		</nav>
	)
}
