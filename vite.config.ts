import { resolve } from "node:path"
import inertia from "@inertiajs/vite"
import { wayfinder } from "@laravel/vite-plugin-wayfinder"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import laravel from "laravel-vite-plugin"
import { defineConfig } from "vite"

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^lucide-react$/,
				replacement: resolve(__dirname, "resources/js/lib/lucide-react.ts"),
			},
		],
	},
	plugins: [
		laravel({
			input: ["resources/css/app.css", "resources/js/app.tsx"],
			refresh: true,
		}),
		inertia(),
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		tailwindcss(),
		wayfinder({
			path: "resources/js/wayfinder",
			actions: false,
		}),
	],
})
