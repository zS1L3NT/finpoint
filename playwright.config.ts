import { defineConfig } from "@playwright/test"
import { APP_URL } from "./tests/support/urls"

// Desktop and mobile run every case; tall-desktop, light and reduced-motion run only
// cases tagged for them. PLAYWRIGHT_FULL_MATRIX=1 drops those tag filters to run every case on every project.
const full = process.env.PLAYWRIGHT_FULL_MATRIX === "1"
// Animation tests are collected only with PLAYWRIGHT_ANIMATIONS=1, so ad-hoc runs stay core-only.
const animations = process.env.PLAYWRIGHT_ANIMATIONS === "1"
// Helper self-tests and the behaviour ledger run only in desktop.
const desktopOnly = ["**/helpers.e2e.ts", "**/ledger.e2e.ts"]
// Project testIgnore replaces the top-level value instead of merging, so the
// animations exclusion must be repeated in every project's own ignores.
const animationIgnores = animations ? [] : ["**/animations/**"]
const piggyback = (tag: RegExp, invert: RegExp[] = [/@mobile-only/, /@tall-only/]) => ({
	testIgnore: [...animationIgnores, ...desktopOnly],
	grepInvert: invert,
	...(full ? {} : { grep: tag }),
})

export default defineConfig({
	testDir: "./tests",
	testMatch: "{core,animations}/**/*.e2e.ts",
	testIgnore: animations ? undefined : "**/animations/**",
	fullyParallel: true,
	forbidOnly: true,
	workers: process.env.PLAYWRIGHT_WORKERS ?? 1,
	retries: 0,
	timeout: 45_000,
	expect: { timeout: 10_000 },
	// Playwright empties its output and report folders on start, so local runs keep to
	// their own subfolders. CI replaces these reporters with list and blob.
	outputDir: "test-results/adhoc",
	reporter: [
		["list"],
		[
			"html",
			{
				open: "never",
				outputFolder: process.env.PLAYWRIGHT_HTML_REPORT ?? "playwright-report/adhoc",
			},
		],
	],
	use: {
		baseURL: APP_URL,
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
		{
			name: "desktop",
			testIgnore: animationIgnores,
			grepInvert: [/@mobile-only/, /@tall-only/],
		},
		{
			name: "mobile",
			testIgnore: [...animationIgnores, ...desktopOnly],
			grepInvert: [/@desktop-only/, /@tall-only/],
			use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
		},
		{
			name: "tall-desktop",
			...piggyback(/@tall\b/, [/@mobile-only/]),
			use: { viewport: { width: 1920, height: 1440 } },
		},
		{ name: "light", ...piggyback(/@light\b/), use: { colorScheme: "light" } },
		{
			name: "reduced-motion",
			...piggyback(/@reduced-motion\b/),
			use: { reducedMotion: "reduce" },
		},
		...(process.env.PLAYWRIGHT_BROWSERS === "all"
			? [
					{
						name: "firefox",
						testIgnore: [...animationIgnores, ...desktopOnly],
						grepInvert: [/@mobile-only/, /@tall-only/],
						use: { browserName: "firefox" as const },
					},
					{
						name: "webkit",
						testIgnore: [...animationIgnores, ...desktopOnly],
						grepInvert: [/@mobile-only/, /@tall-only/],
						use: { browserName: "webkit" as const },
					},
				]
			: []),
	],
	webServer:
		process.env.PLAYWRIGHT_EXTERNAL_SERVERS === "1"
			? undefined
			: process.env.PLAYWRIGHT_SERVER === "production"
				? [
						{
							command: "bun run start --port 5273",
							url: "http://localhost:5273",
							reuseExistingServer: false,
							timeout: 300_000,
						},
						{
							command:
								"bunx vite preview --config tests/harness/vite.config.ts --host 127.0.0.1 --port 5274 --strictPort",
							url: "http://127.0.0.1:5274",
							reuseExistingServer: false,
							timeout: 300_000,
						},
					]
				: [
						{
							command: "npm run dev",
							url: "http://localhost:5173",
							reuseExistingServer: true,
							timeout: 120_000,
						},
						{
							command:
								"bunx vite --config tests/harness/vite.config.ts --host 127.0.0.1",
							url: "http://127.0.0.1:5174",
							reuseExistingServer: true,
							timeout: 120_000,
						},
					],
})
