import path from "node:path"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const harnessDir = fileURLToPath(new URL(".", import.meta.url))
const repoRoot = path.resolve(harnessDir, "..", "..")

export default defineConfig(({ command }) => ({
	root: harnessDir,
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.join(repoRoot, "src"),
		},
	},
	css: {
		// String form is a postcss-load-config search *directory*, not a file
		// (verified in Vite 8 resolvePostcssConfig: searchPath -> loadConfig).
		postcss: repoRoot,
	},
	define: {
		// next/link reads process.env.* at module scope and Vite dev defines
		// nothing for `process`, so the REAL next/link module throws
		// `ReferenceError: process is not defined` on import (blank harness).
		// Shim the env object with Next-dev values so product pagination code
		// loads unchanged — no test double, no behaviour faked. Applies to
		// dev-served source transforms (and `vite build`, verified: zero
		// `process.env` occurrences left in the bundle).
		"process.env": JSON.stringify({
			NODE_ENV: command === "build" ? "production" : "development",
		}),
	},
	optimizeDeps: {
		// lucide-react's barrel re-exports ~1500 icon modules; without an
		// explicit pre-bundle the browser waterfalls through them and the
		// harness stalls on load. Pre-bundling keeps one hashed chunk.
		include: ["lucide-react"],
		// The dep optimizer runs its own esbuild WITHOUT vite `define`, so
		// pre-bundled next/link keeps a module-scope
		// `process.env.__NEXT_ROUTER_BASEPATH` read (has-base-path.js) that
		// throws on import. Shim it here too — same values, same rationale.
		rolldownOptions: {
			transform: {
				define: {
					"process.env": JSON.stringify({ NODE_ENV: "development" }),
				},
			},
		},
	},
	build: {
		outDir: path.join(repoRoot, ".scratch/ui-regression/harness-build"),
		emptyOutDir: true,
		rolldownOptions: {
			input: {
				index: path.join(harnessDir, "index.html"),
				display: path.join(harnessDir, "display.html"),
			},
		},
	},
	server: {
		port: 5174,
		strictPort: true,
		host: "127.0.0.1",
	},
	preview: {
		port: 5174,
		strictPort: true,
	},
}))
