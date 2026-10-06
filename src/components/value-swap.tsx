"use client"

import { AnimatePresence, motion } from "framer-motion"
import { DURATION, EASE_OUT } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * Crossfades a displayed value when it changes (e.g. the month switches): a small
 * rise. Silent on first mount; the exit is quicker and smaller.
 */
export default function ValueSwap({
	value,
	className,
	children,
}: {
	/** Identity of what is shown; a new value triggers the swap. */
	value: string | number
	className?: string
	children?: React.ReactNode
}) {
	return (
		<span className={cn("relative inline-block max-w-full align-bottom", className)}>
			<AnimatePresence initial={false} mode="popLayout">
				<motion.span
					key={value}
					className="inline-block max-w-full tabular-nums"
					initial={{ opacity: 0, y: 4 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{
						opacity: 0,
						y: -3,
						transition: { duration: DURATION.instant, ease: EASE_OUT },
					}}
					transition={{ duration: DURATION.base - 0.04, ease: EASE_OUT }}
				>
					{children ?? value}
				</motion.span>
			</AnimatePresence>
		</span>
	)
}
