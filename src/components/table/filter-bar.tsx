"use client"

import { useEffect, useState } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export const FILTER_CONTROL_CLASS =
	"border-border bg-input/20 text-foreground hover:bg-muted dark:bg-input/30 dark:hover:bg-muted"

// From sm up, controls share each row (a smaller basis, growing to fill but never
// below their content), so a full set fits one line instead of orphaning Clear.
const BAR_CLASS =
	"w-full gap-2 sm:flex sm:flex-wrap sm:*:min-w-fit sm:*:max-w-56 sm:*:shrink-0 sm:*:grow sm:*:basis-32"

export function FilterBar({
	count,
	children,
	className,
}: {
	/** Active filters. Passing it folds the bar behind a Filters button and sheet on phones. */
	count?: number
	children: React.ReactNode
	className?: string
}) {
	const [isOpen, setIsOpen] = useState(false)

	// The sheet is phone-only: crossing into the inline layout closes it, or its backdrop would
	// linger over the page while the inline controls stay unmounted.
	useEffect(() => {
		const query = window.matchMedia("(min-width: 40rem)")
		const close = () => query.matches && setIsOpen(false)
		query.addEventListener("change", close)
		return () => query.removeEventListener("change", close)
	}, [])

	if (count === undefined)
		return <div className={cn("grid grid-cols-2", BAR_CLASS, className)}>{children}</div>

	return (
		<>
			{/* Phones fold every filter behind one button, so the list keeps the screen. */}
			<Button
				type="button"
				variant="outline"
				className={cn("w-fit sm:hidden", FILTER_CONTROL_CLASS)}
				onClick={() => setIsOpen(true)}
			>
				<IconifyIcon icon="lucide:sliders-horizontal" /> Filters
				{count ? <Badge variant="secondary">{count}</Badge> : null}
			</Button>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="top-auto bottom-0 left-0 w-full max-w-none translate-x-0 translate-y-0 rounded-b-none pb-[max(1rem,env(safe-area-inset-bottom))] starting:transform-[translateY(100%)] data-starting-style:transform-[translateY(100%)] data-ending-style:transform-[translateY(100%)] data-starting-style:opacity-100 data-ending-style:opacity-100 sm:hidden">
					<DialogHeader>
						<DialogTitle>Filters</DialogTitle>
					</DialogHeader>
					<div className="grid grid-cols-1 gap-2">{children}</div>
					<DialogFooter>
						<Button type="button" onClick={() => setIsOpen(false)}>
							Done
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{isOpen ? null : <div className={cn("hidden", BAR_CLASS, className)}>{children}</div>}
		</>
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
			className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS, className)}
			disabled={!count}
			onClick={onClear}
		>
			<IconifyIcon icon="lucide:list-filter-x" /> Clear
			{count ? <Badge variant="secondary">{count}</Badge> : null}
		</Button>
	)
}
