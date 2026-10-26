import { themeColor } from "@/lib/palette"
import { cn } from "@/lib/utils"

/**
 * The one way a monthly budget is shown inline: a hairline pill with the
 * monthly budget's colour as a dot. `color` is null for "Unbudgeted" and for scopes
 * that are not a single monthly budget (groups), which get a hollow dot instead.
 */
export default function MonthlyBudgetBadge({
	name,
	color,
	title,
	className,
}: {
	name: React.ReactNode
	color: string | null | undefined
	title?: string
	className?: string
}) {
	return (
		<span
			title={title}
			className={cn(
				"inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border bg-background px-2 py-0.5 text-xs font-normal whitespace-nowrap text-muted-foreground",
				className,
			)}
		>
			<span
				className={cn("size-2 shrink-0 rounded-full", !color && "border border-current/40")}
				style={color ? { backgroundColor: themeColor(color) } : undefined}
			/>
			{name}
		</span>
	)
}
