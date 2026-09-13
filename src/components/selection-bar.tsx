import { AnimatePresence, motion } from "framer-motion"

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
	return (
		<AnimatePresence>
			{open ? (
				<motion.aside
					initial={{ opacity: 0, y: -16, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -12, scale: 0.98 }}
					transition={{ duration: 0.18, ease: "easeOut" }}
					className="fixed inset-x-3 top-[calc(var(--header-height)+0.75rem)] z-40 mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border bg-background/95 p-3 shadow-2xl backdrop-blur-md motion-reduce:transform-none motion-reduce:transition-none"
					aria-live="polite"
				>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<strong className="mr-auto text-sm tabular-nums">{summary}</strong>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
							{children}
						</div>
					</div>
					{message ? <div className="text-sm">{message}</div> : null}
				</motion.aside>
			) : null}
		</AnimatePresence>
	)
}
