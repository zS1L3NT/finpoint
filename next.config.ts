import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactCompiler: true,
	async redirects() {
		return [
			{ source: "/settings/data", destination: "/sync", permanent: true },
			// Monthly Records became the Dashboard's Records sheet; the query carries over.
			{ source: "/records/monthly", destination: "/?records=1", permanent: true },
		]
	},
}

export default nextConfig
