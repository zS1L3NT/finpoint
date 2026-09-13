import { UiIcon as IconifyIcon } from "@/components/icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const FILTER_CONTROL_CLASS = "border-border bg-input/20 text-foreground dark:bg-input/30"

export function FilterBar({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-[repeat(4,max-content)]">
			{children}
		</div>
	)
}

export function ClearFiltersButton({
	count,
	onClear,
	className,
}: {
	count: number
	onClear: () => void
	className?: string
}) {
	if (!count) return null

	return (
		<Button
			type="button"
			variant="outline"
			className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS, className)}
			onClick={onClear}
		>
			<IconifyIcon icon="lucide:list-filter-x" /> Clear
			<Badge variant="secondary">{count}</Badge>
		</Button>
	)
}
