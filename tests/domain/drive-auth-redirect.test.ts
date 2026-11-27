import { afterEach, beforeEach, expect, test } from "bun:test"
import { NextRequest } from "next/server"
import { POST as exchangePost } from "../../app/api/auth/exchange/route"
import {
	AuthRedirectError,
	completeDriveRedirect,
	disconnectDrive,
	ensureDriveToken,
	takeDriveRedirectCallback,
	wasVaultProven,
} from "../../src/data/google-drive"

const realFetch = globalThis.fetch
const realWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window")
const realNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator")
const realEnv = {
	NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	AUTH_ENCRYPTION_KEY: process.env.AUTH_ENCRYPTION_KEY,
}

type FakeWindow = {
	location: { href: string; origin: string; assign: (url: string) => void }
	history: { state: unknown; replaceState: (state: unknown, title: string, url: string) => void }
	localStorage: {
		getItem: (key: string) => string | null
		setItem: (key: string, value: string) => void
		removeItem: (key: string) => void
	}
	matchMedia: (query: string) => { matches: boolean }
	setTimeout: typeof setTimeout
	clearTimeout: typeof clearTimeout
	google?: Window["google"]
}

let storage = new Map<string, string>()
let assignedUrl: string | null = null
let replacedUrl: string | null = null
let standaloneMedia = false
let navStandalone = false
let fakeWindow: FakeWindow

function installBrowser(href = "https://finpoint.zectan.com/sync") {
	storage = new Map()
	assignedUrl = null
	replacedUrl = null
	standaloneMedia = false
	navStandalone = false
	const origin = new URL(href).origin
	fakeWindow = {
		location: {
			href,
			origin,
			assign: (url: string) => {
				assignedUrl = url
			},
		},
		history: {
			state: { kept: true },
			replaceState: (_state: unknown, _title: string, url: string) => {
				replacedUrl = url
				fakeWindow.location.href = new URL(url, origin).href
			},
		},
		localStorage: {
			getItem: key => storage.get(key) ?? null,
			setItem: (key, value) => {
				storage.set(key, value)
			},
			removeItem: key => {
				storage.delete(key)
			},
		},
		matchMedia: (query: string) => ({
			matches: query === "(display-mode: standalone)" && standaloneMedia,
		}),
		setTimeout: globalThis.setTimeout,
		clearTimeout: globalThis.clearTimeout,
	}
	Object.defineProperty(globalThis, "window", {
		value: fakeWindow,
		writable: true,
		configurable: true,
	})
	Object.defineProperty(globalThis, "navigator", {
		value: {
			onLine: true,
			get standalone() {
				return navStandalone
			},
		},
		writable: true,
		configurable: true,
	})
}

beforeEach(async () => {
	process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "test-client-id"
	process.env.GOOGLE_CLIENT_ID = "test-client-id"
	process.env.GOOGLE_CLIENT_SECRET = "test-client-secret"
	process.env.AUTH_ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
	installBrowser()
	globalThis.fetch = (async () => new Response(JSON.stringify({ ok: true }))) as typeof fetch
	await disconnectDrive()
})

afterEach(() => {
	globalThis.fetch = realFetch
	if (realWindowDescriptor) Object.defineProperty(globalThis, "window", realWindowDescriptor)
	else Reflect.deleteProperty(globalThis, "window")
	if (realNavigatorDescriptor)
		Object.defineProperty(globalThis, "navigator", realNavigatorDescriptor)
	else Reflect.deleteProperty(globalThis, "navigator")
	for (const [key, value] of Object.entries(realEnv)) {
		if (value === undefined) delete process.env[key]
		else process.env[key] = value
	}
})

test("standalone PWA skips the popup and redirects in the same window", async () => {
	navStandalone = true
	let popupInitialised = false
	fakeWindow.google = {
		accounts: {
			oauth2: {
				initCodeClient: () => {
					popupInitialised = true
					return { requestCode: () => undefined }
				},
			},
		},
	}
	globalThis.fetch = (async () => new Response(null, { status: 401 })) as typeof fetch

	await expect(ensureDriveToken("push")).rejects.toBeInstanceOf(AuthRedirectError)
	expect(popupInitialised).toBe(false)
	expect(assignedUrl).not.toBeNull()

	const target = new URL(assignedUrl as string)
	expect(`${target.origin}${target.pathname}`).toBe("https://accounts.google.com/o/oauth2/v2/auth")
	expect(target.searchParams.get("client_id")).toBe("test-client-id")
	expect(target.searchParams.get("redirect_uri")).toBe("https://finpoint.zectan.com/sync")
	expect(target.searchParams.get("response_type")).toBe("code")
	expect(target.searchParams.get("access_type")).toBe("offline")
	expect(target.searchParams.get("prompt")).toBe("consent")

	const stored = JSON.parse(storage.get("finpoint_drive_oauth") ?? "{}") as {
		state?: string
		action?: string
	}
	expect(stored.state).toBe(target.searchParams.get("state"))
	expect(stored.action).toBe("push")
})

test("a blocked popup in a regular browser tab falls back to the redirect flow", async () => {
	fakeWindow.google = {
		accounts: {
			oauth2: {
				initCodeClient: config => ({
					requestCode: () => config.error_callback?.({ type: "popup_failed_to_open" }),
				}),
			},
		},
	}
	globalThis.fetch = (async () => new Response(null, { status: 401 })) as typeof fetch

	await expect(ensureDriveToken("sync")).rejects.toBeInstanceOf(AuthRedirectError)
	expect(assignedUrl).toStartWith("https://accounts.google.com/o/oauth2/v2/auth?")
})

test("closing the popup manually cancels without redirecting", async () => {
	fakeWindow.google = {
		accounts: {
			oauth2: {
				initCodeClient: config => ({
					requestCode: () => config.error_callback?.({ type: "popup_closed" }),
				}),
			},
		},
	}
	globalThis.fetch = (async () => new Response(null, { status: 401 })) as typeof fetch

	await expect(ensureDriveToken("sync")).rejects.toThrow("Google Drive connection was cancelled.")
	expect(assignedUrl).toBeNull()
})

test("takeDriveRedirectCallback validates state, strips OAuth params and rejects mismatched state", () => {
	storage.set(
		"finpoint_drive_oauth",
		JSON.stringify({ state: "expected-state", action: "pull", startedAt: Date.now() }),
	)
	fakeWindow.location.href =
		"https://finpoint.zectan.com/sync?code=oauth-code&state=expected-state&scope=drive&keep=1#section"

	const callback = takeDriveRedirectCallback()
	expect(callback).toEqual({ action: "pull", code: "oauth-code" })
	expect(replacedUrl).toBe("/sync?keep=1#section")
	expect(storage.has("finpoint_drive_oauth")).toBe(false)

	storage.set(
		"finpoint_drive_oauth",
		JSON.stringify({ state: "other-state", action: "sync", startedAt: Date.now() }),
	)
	fakeWindow.location.href = "https://finpoint.zectan.com/sync?code=oauth-code&state=wrong-state"

	const mismatched = takeDriveRedirectCallback()
	expect(mismatched?.code).toBeUndefined()
	expect(mismatched?.error).toContain("expired")
})

test("takeDriveRedirectCallback maps access_denied to a cancellation message", () => {
	fakeWindow.location.href = "https://finpoint.zectan.com/sync?error=access_denied"

	const callback = takeDriveRedirectCallback()
	expect(callback).toEqual({
		action: "sync",
		error: "Google Drive connection was cancelled.",
	})
	expect(replacedUrl).toBe("/sync")
})

test("completeDriveRedirect exchanges with redirect mode and verifies the vault", async () => {
	let exchangeBody: unknown = null
	globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const url = String(input)
		if (url === "/api/auth/exchange") {
			exchangeBody = JSON.parse(String(init?.body))
			return new Response(JSON.stringify({ access_token: "fresh-token", expires_in: 3600 }))
		}
		if (url === "/api/auth/token") {
			return new Response(JSON.stringify({ access_token: "fresh-token", expires_in: 3600 }))
		}
		return new Response(null, { status: 404 })
	}) as typeof fetch

	const token = await completeDriveRedirect("returned-code")
	expect(token).toBe("fresh-token")
	expect(exchangeBody).toEqual({ code: "returned-code", mode: "redirect" })
	expect(wasVaultProven()).toBe(true)
})

test("auth/exchange uses the same-origin /sync redirect_uri in redirect mode and postmessage in popup mode", async () => {
	const seenRedirectUris: string[] = []
	globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
		const params = new URLSearchParams(String(init?.body))
		seenRedirectUris.push(params.get("redirect_uri") ?? "")
		return new Response(
			JSON.stringify({
				access_token: "tok",
				refresh_token: "ref",
				expires_in: 3600,
			}),
		)
	}) as typeof fetch

	const redirectReq = new NextRequest("https://finpoint.zectan.com/api/auth/exchange", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			origin: "https://finpoint.zectan.com",
			host: "finpoint.zectan.com",
		},
		body: JSON.stringify({ code: "abc", mode: "redirect" }),
	})
	const redirectRes = await exchangePost(redirectReq)
	expect(redirectRes.status).toBe(200)

	const popupReq = new NextRequest("https://finpoint.zectan.com/api/auth/exchange", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			origin: "https://finpoint.zectan.com",
			host: "finpoint.zectan.com",
		},
		body: JSON.stringify({ code: "def" }),
	})
	const popupRes = await exchangePost(popupReq)
	expect(popupRes.status).toBe(200)

	expect(seenRedirectUris).toEqual(["https://finpoint.zectan.com/sync", "postmessage"])

	const badModeReq = new NextRequest("https://finpoint.zectan.com/api/auth/exchange", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			origin: "https://finpoint.zectan.com",
			host: "finpoint.zectan.com",
		},
		body: JSON.stringify({ code: "ghi", mode: "evil" }),
	})
	const badModeRes = await exchangePost(badModeReq)
	expect(badModeRes.status).toBe(400)
})
