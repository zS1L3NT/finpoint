import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import "@/app.css"
import Providers from "./providers"

export const metadata: Metadata = {
	title: {
		default: "Finpoint",
		template: "%s · Finpoint",
	},
	description: "Local-first personal finance tracker. Your data stays in your browser.",
	manifest: "/manifest.json",
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon.png", sizes: "512x512", type: "image/png" },
		],
		apple: "/apple-touch-icon.png",
	},
	appleWebApp: { capable: true },
}

export const viewport: Viewport = {
	themeColor: "#18181B",
	width: "device-width",
	initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const store = await cookies()
	const appearance = store.get("appearance")?.value
	const sidebarOpen = store.get("sidebar_state")?.value !== "false"
	return (
		<html
			lang="en"
			className={appearance === "dark" ? "dark" : undefined}
			suppressHydrationWarning
		>
			<body>
				<Providers sidebarOpen={sidebarOpen}>{children}</Providers>
			</body>
		</html>
	)
}
