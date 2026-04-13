import { createInertiaApp } from "@inertiajs/react"
import Layout from "@/pages/layout"

await createInertiaApp({
	title: title => (title ? `${title} - Fintrack` : "Fintrack"),
	layout: () => Layout,
	strictMode: true,
})
