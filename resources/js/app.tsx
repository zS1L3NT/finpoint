import { createInertiaApp } from "@inertiajs/react"
import { initializeAppearance } from "@/hooks/use-appearance"
import Layout from "@/layout"

await createInertiaApp({
	title: title => (title ? `${title} - Finpoint` : "Finpoint"),
	layout: () => Layout,
	strictMode: true,
})

initializeAppearance(document.documentElement.classList.contains("dark") ? "dark" : "system")
