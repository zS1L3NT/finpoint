import "./app.css"
import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { db } from "@/data/db"
import { seedIfEmpty } from "@/data/seed"
import { initializeAppearance } from "@/hooks/use-appearance"
import { router } from "@/router"

initializeAppearance(
	typeof document !== "undefined" && document.documentElement.classList.contains("dark")
		? "dark"
		: "system",
)

let boot: Promise<void> | null = null

function ensureDb(): Promise<void> {
	if (!boot) boot = db.open().then(() => seedIfEmpty())
	return boot
}

function App() {
	const [failed, setFailed] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false
		ensureDb().catch((cause: unknown) => {
			if (!cancelled) {
				setFailed(
					cause instanceof Error ? cause.message : "Unable to open the local database.",
				)
			}
		})
		return () => {
			cancelled = true
		}
	}, [])

	if (failed) {
		return (
			<div className="flex min-h-screen items-center justify-center p-8 text-sm text-muted-foreground">
				Finpoint could not start: {failed}
			</div>
		)
	}
	return <RouterProvider router={router} />
}

const root = document.getElementById("app")
if (root) {
	createRoot(root).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
}
