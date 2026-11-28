"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * A row of links that scrolls sideways when it does not fit. A chevron on each side that
 * hides more scrolls it into view; the item marked `data-active="true"`
 * is kept in view as `active` changes.
 */
export default function ScrollStrip({
	active,
	className,
	children,
}: {
	active?: string
	className?: string
	children: React.ReactNode
}) {
	const strip = useRef<HTMLDivElement>(null)
	const [edges, setEdges] = useState({ prev: false, next: false })

	useEffect(() => {
		const element = strip.current
		if (!element) return
		const update = () =>
			setEdges({
				prev: element.scrollLeft > 1,
				next: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
			})
		update()
		const observer = new ResizeObserver(update)
		observer.observe(element)
		element.addEventListener("scroll", update, { passive: true })
		return () => {
			observer.disconnect()
			element.removeEventListener("scroll", update)
		}
	}, [])

	// Centre the active item once the strip is known to overflow.
	const overflowing = edges.prev || edges.next
	useEffect(() => {
		if (!active || !overflowing) return
		strip.current
			?.querySelector('[data-active="true"]')
			?.scrollIntoView({ block: "nearest", inline: "center" })
	}, [active, overflowing])

	const scroll = (direction: 1 | -1) =>
		strip.current?.scrollBy({
			left: direction * strip.current.clientWidth * 0.7,
			behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
		})
	// Chevrons sit over the strip's edges on an opaque fade, so they never push the items.
	const chevron = (direction: 1 | -1, shown: boolean) =>
		shown ? (
			<span
				className={cn(
					"fade-in pointer-events-none absolute inset-y-0 flex animate-in items-center duration-150 ease-out",
					direction === 1
						? "right-0 bg-linear-to-l from-background from-50% to-transparent pl-10"
						: "left-0 bg-linear-to-r from-background from-50% to-transparent pr-10",
				)}
			>
				<button
					type="button"
					aria-label={direction === 1 ? "Show later items" : "Show earlier items"}
					onClick={() => scroll(direction)}
					className="pointer-events-auto flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground"
				>
					{direction === 1 ? (
						<ChevronRightIcon className="size-4" />
					) : (
						<ChevronLeftIcon className="size-4" />
					)}
				</button>
			</span>
		) : null

	return (
		<div className="relative flex min-w-0 flex-1 items-center">
			<div
				ref={strip}
				className={cn(
					"flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]",
					className,
				)}
			>
				{children}
			</div>
			{chevron(-1, edges.prev)}
			{chevron(1, edges.next)}
		</div>
	)
}
