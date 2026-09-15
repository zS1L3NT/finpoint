import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Suspense } from "react"
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

// Blocking theme init: same logic as use-appearance, applied before first
// paint so there is no flash — and no cookies() call, keeping this layout
// (and every route under it) statically prerenderable.
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)appearance=([^;]*)/);var a=m?decodeURIComponent(m[1]):"system";var d=a==="dark"||(a!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(_){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<Script
					id="theme-init"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{ __html: themeScript }}
				/>
				<Suspense fallback={null}>
					<Providers>{children}</Providers>
				</Suspense>
			</body>
		</html>
	)
}
