import { AnimatePresence, motion } from "framer-motion"
import { useSidebar } from "@/components/ui/sidebar"
import { DURATION, EASE_OUT, SPRING } from "@/lib/motion"

export default function SelectionBar({
	open,
	summary,
	children,
	message,
}: {
	open: boolean
	summary: React.ReactNode
	children: React.ReactNode
	message?: React.ReactNode
}) {
	const { state, isMobile } = useSidebar()
	// Centre over the content column rather than the window, so the bar never runs under the
	// floating sidebar (its gap is the icon rail plus padding when collapsed).
	const sidebarGap = isMobile
		? "0px"
		: state === "expanded"
			? "var(--sidebar-width)"
			: "calc(var(--sidebar-width-icon) + 1rem)"
	return (
		<AnimatePresence>
			{open ? (
				<motion.aside
					layout
					initial={{ opacity: 0, y: -20, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{
						opacity: 0,
						y: -8,
						scale: 0.98,
						transition: { duration: DURATION.instant, ease: EASE_OUT },
					}}
					transition={SPRING.snappy}
					style={{ left: `calc(${sidebarGap} + 0.75rem)` }}
					className="fixed inset-x-3 top-[calc(var(--header-height)+0.75rem)] z-40 mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border bg-background/95 p-3 shadow-2xl backdrop-blur-md motion-reduce:transform-none motion-reduce:transition-none"
					aria-live="polite"
				>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<strong className="mr-auto text-sm tabular-nums">{summary}</strong>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
							{children}
						</div>
					</div>
					{message ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: DURATION.base, ease: EASE_OUT }}
							className="text-sm"
						>
							{message}
						</motion.div>
					) : null}
				</motion.aside>
			) : null}
		</AnimatePresence>
	)
}
