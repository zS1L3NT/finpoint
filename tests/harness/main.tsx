import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/app.css"
import { App } from "./app"

const root = document.getElementById("root")
if (!root) throw new Error("harness root missing")
createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
