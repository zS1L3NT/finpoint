import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactCompiler: true,
	async redirects() {
		return [
			{ source: "/records/monthly", destination: "/records", permanent: true },
			{ source: "/settings/data", destination: "/sync", permanent: true },
			{ source: "/allocator/pending", destination: "/statements/pending", permanent: true },
			{
				source: "/allocator/duplicates",
				destination: "/statements/duplicates",
				permanent: true,
			},
		]
	},
}

export default nextConfig
