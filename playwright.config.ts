import { defineConfig } from "@playwright/test"

export default defineConfig({
	testDir: "./tests/web",
	testMatch: "**/*.e2e.ts",
	fullyParallel: true,
	forbidOnly: true,
	workers: 1,
	retries: 0,
	timeout: 45_000,
	expect: { timeout: 10_000 },
	outputDir: "test-results",
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL: "http://localhost:5173",
		browserName: "chromium",
		viewport: { width: 1440, height: 900 },
		colorScheme: "light",
		reducedMotion: "no-preference",
		locale: "en-GB",
		timezoneId: "Asia/Singapore",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [
		{ name: "chromium", testIgnore: "**/tall-budget-motion.e2e.ts" },
		{ name: "tall-desktop", use: { viewport: { width: 1920, height: 1440 } } },
		{
			name: "mobile",
			testIgnore: "**/tall-budget-motion.e2e.ts",
			use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
		},
		{ name: "dark", testIgnore: "**/tall-budget-motion.e2e.ts", use: { colorScheme: "dark" } },
		{
			name: "reduced-motion",
			testIgnore: "**/tall-budget-motion.e2e.ts",
			use: { reducedMotion: "reduce" },
		},
		...(process.env.PLAYWRIGHT_BROWSERS === "all"
			? ([
					{
						name: "firefox",
						testIgnore: "**/tall-budget-motion.e2e.ts",
						use: { browserName: "firefox" },
					},
					{
						name: "webkit",
						testIgnore: "**/tall-budget-motion.e2e.ts",
						use: { browserName: "webkit" },
					},
				] as const)
			: []),
	],
	webServer:
		process.env.PLAYWRIGHT_EXTERNAL_SERVERS === "1"
			? undefined
			: [
					{
						command: "npm run dev",
						url: "http://localhost:5173",
						reuseExistingServer: true,
						timeout: 120_000,
					},
					{
						command: "npm run test:web:harness",
						url: "http://127.0.0.1:5174",
						reuseExistingServer: true,
						timeout: 120_000,
					},
				],
})
