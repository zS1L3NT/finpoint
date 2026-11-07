"use client"
import { useState } from "react"
import { clearWorkspace, loadDemoWorkspace, loadWorstCaseWorkspace } from "@/logic/workspace"

const MODES = [
	{ id: "demo", label: "Demo data", load: loadDemoWorkspace },
	{ id: "worst", label: "Worst case", load: loadWorstCaseWorkspace },
	{ id: "empty", label: "Empty", load: clearWorkspace },
] as const

/**
 * Dev-only stress switch (break-ui): replaces the whole local workspace with demo,
 * worst-case or empty data. Rendered only in development or when
 * NEXT_PUBLIC_DEV_TOOLS=1 is set at build time; never in a normal production build.
 */
export default function DevDataToggle() {
	const [mode, setMode] = useState<string | null>(null)
	if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_DEV_TOOLS !== "1")
		return null
	return (
		<div
			role="group"
			aria-label="Dev data"
			className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 gap-0.5 rounded-full bg-neutral-200 p-0.5 font-sans text-xs text-neutral-700 shadow"
		>
			{MODES.map(m => (
				<button
					key={m.id}
					type="button"
					aria-pressed={mode === m.id}
					onClick={async () => {
						setMode(m.id)
						await m.load()
					}}
					className={
						mode === m.id
							? "rounded-full bg-white px-3 py-1 text-neutral-900"
							: "rounded-full px-3 py-1"
					}
				>
					{m.label}
				</button>
			))}
		</div>
	)
}
