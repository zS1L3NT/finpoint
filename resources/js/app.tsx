import { createInertiaApp } from "@inertiajs/react"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { initializeAppearance } from "@/hooks/use-appearance"
import Layout from "@/layout"

await createInertiaApp({
	title: title => (title ? `${title} - Finpoint` : "Finpoint"),
	layout: () => Layout,
	strictMode: true,
	withApp(app) {
		return (
			<TooltipProvider delayDuration={0}>
				{app}
				<Toaster />
			</TooltipProvider>
		)
	},
})

initializeAppearance(document.documentElement.classList.contains("dark") ? "dark" : "system")
