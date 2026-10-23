import { defineConfig } from "@playwright/test"

// Chromium and mobile run every case; tall-desktop, light and reduced-motion run only
// cases tagged for them. PLAYWRIGHT_FULL_MATRIX=1 drops those tag filters for a release run.
const full = process.env.PLAYWRIGHT_FULL_MATRIX === "1"
const tallOnly = "**/tall-budget-motion.e2e.ts"
// Static ledger gate and viewport/theme-independent helper probes.
const desktopOnly = ["**/coverage.e2e.ts", "**/assertion-probes.e2e.ts", "**/date-only.e2e.ts"]
const piggyback = (tag: RegExp) => ({
	testIgnore: [tallOnly, ...desktopOnly],
	grepInvert: /@mobile-only/,
	...(full ? {} : { grep: tag }),
})

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
		colorScheme: "dark",
		reducedMotion: "no-preference",
		locale: "en-GB",
		timezoneId: "Asia/Singapore",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [
		{ name: "chromium", testIgnore: tallOnly, grepInvert: /@mobile-only/ },
		{
			name: "mobile",
			testIgnore: [tallOnly, ...desktopOnly],
			grepInvert: /@desktop-only/,
			use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
		},
		{
			name: "tall-desktop",
			...piggyback(/@tall\b/),
			testIgnore: desktopOnly,
			use: { viewport: { width: 1920, height: 1440 } },
		},
		{ name: "light", ...piggyback(/@light\b/), use: { colorScheme: "light" } },
		{ name: "reduced-motion", ...piggyback(/@motion\b/), use: { reducedMotion: "reduce" } },
		...(process.env.PLAYWRIGHT_BROWSERS === "all"
			? ([
					{
						name: "firefox",
						testIgnore: tallOnly,
						grepInvert: /@mobile-only/,
						use: { browserName: "firefox" },
					},
					{
						name: "webkit",
						testIgnore: tallOnly,
						grepInvert: /@mobile-only/,
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
