import "./app.css"
import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { db } from "@/data/db"
import { seedIfEmpty } from "@/data/seed"
import { initializeAppearance } from "@/hooks/use-appearance"
import { router } from "@/router"
import { useAppStore } from "@/stores/app"

initializeAppearance(
	typeof document !== "undefined" && document.documentElement.classList.contains("dark")
		? "dark"
		: "system",
)

function Boot() {
	const markReady = useAppStore(state => state.markReady)
	const setError = useAppStore(state => state.setError)
	const ready = useAppStore(state => state.ready)
	const error = useAppStore(state => state.error)
	const [starting, setStarting] = useState(true)

	useEffect(() => {
		let cancelled = false
		db.open()
			.then(() => seedIfEmpty())
			.then(() => {
				if (!cancelled) {
					markReady()
					setStarting(false)
				}
			})
			.catch((cause: unknown) => {
				if (!cancelled) {
					setError(
						cause instanceof Error
							? cause.message
							: "Unable to open the local database.",
					)
					setStarting(false)
				}
			})
		return () => {
			cancelled = true
		}
	}, [markReady, setError])

	if (starting || !ready) {
		return (
			<div className="flex min-h-screen items-center justify-center p-8 text-sm text-muted-foreground">
				{error ? `Finpoint could not start: ${error}` : "Loading Finpoint…"}
			</div>
		)
	}
	return <RouterProvider router={router} />
}

const root = document.getElementById("app")
if (root) {
	createRoot(root).render(
		<StrictMode>
			<Boot />
		</StrictMode>,
	)
}
