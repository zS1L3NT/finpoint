import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactCompiler: true,
	async redirects() {
		return [{ source: "/settings/data", destination: "/sync", permanent: true }]
	},
}

export default nextConfig
