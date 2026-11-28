import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactCompiler: true,
	async redirects() {
		return [
			{ source: "/settings/data", destination: "/sync", permanent: true },
			// Monthly Records became the Dashboard's Records sheet; the query carries over.
			{ source: "/records/monthly", destination: "/?records=1", permanent: true },
			// Records and Statements have no pages of their own; they open over their list.
			{ source: "/records/:id", destination: "/records?record=:id", permanent: false },
			{
				source: "/statements/:id",
				destination: "/statements?statement=:id",
				permanent: false,
			},
		]
	},
}

export default nextConfig
