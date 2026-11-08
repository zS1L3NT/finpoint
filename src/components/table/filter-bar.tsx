import { UiIcon as IconifyIcon } from "@/components/icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export const FILTER_CONTROL_CLASS =
	"border-border bg-input/20 text-foreground hover:bg-muted dark:bg-input/30 dark:hover:bg-muted"

// A filter away from its default also gets weight and a clear button, so it is not colour-only.
const ACTIVE_FILTER_CLASS =
	"border-primary bg-primary/10 font-medium hover:bg-primary/15 dark:bg-primary/15 dark:hover:bg-primary/20"

export const filterControlClass = (active: boolean) =>
	cn(FILTER_CONTROL_CLASS, active && ACTIVE_FILTER_CLASS)

export function FilterField({
	name,
	active,
	onClear,
	children,
}: {
	name: string
	active: boolean
	onClear: () => void
	children: React.ReactNode
}) {
	return (
		<div data-filter={name} data-active={active || undefined} className="relative">
			{children}
			{active ? (
				<button
					type="button"
					aria-label={`Reset ${name} filter`}
					className="absolute inset-y-0 right-8 my-auto grid size-5 cursor-pointer place-items-center rounded-full bg-background text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onClick={onClear}
				>
					<IconifyIcon icon="lucide:x" className="size-3.5" />
				</button>
			) : null}
		</div>
	)
}

export function FilterBar({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<div
			className={cn(
				// One 10rem track per control from sm up, so every filter keeps the same width on every
				// page whatever its value; long values truncate inside the control.
				"grid w-full grid-cols-2 gap-2 *:w-full *:min-w-0 sm:grid-cols-[repeat(auto-fill,10rem)]",
				className,
			)}
		>
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
	return (
		<Button
			type="button"
			variant="outline"
			className={cn("w-full", FILTER_CONTROL_CLASS, className)}
			disabled={!count}
			onClick={onClear}
		>
			<IconifyIcon icon="lucide:list-filter-x" /> Clear
			{count ? <Badge variant="secondary">{count}</Badge> : null}
		</Button>
	)
}

// A Select whose default is "all": `value` is null at the default, so null means inactive.
export function FilterSelect({
	name,
	icon,
	label,
	value,
	onValueChange,
	children,
}: {
	name: string
	icon: string
	label?: string
	value: string | null
	onValueChange: (value: string | null) => void
	children: React.ReactNode
}) {
	return (
		<FilterField name={name} active={value !== null} onClear={() => onValueChange(null)}>
			<Select
				value={value ?? "all"}
				onValueChange={next => onValueChange(next === "all" ? null : next)}
			>
				<SelectTrigger
					aria-label={label}
					className={cn("w-full", filterControlClass(value !== null))}
				>
					<IconifyIcon icon={icon} />
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="start" variant="filter">
					<SelectGroup>{children}</SelectGroup>
				</SelectContent>
			</Select>
		</FilterField>
	)
}
