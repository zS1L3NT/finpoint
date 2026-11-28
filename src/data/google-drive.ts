// Google Drive persistence (user's own Drive, plaintext JSON).
//
// Nothing financial is sent to us. Signing in uses a one-time code (popup in
// regular tabs, same-window redirect in installed PWAs or when popups are
// blocked) that our /api/auth/* broker exchanges for tokens; the lasting grant
// lives sealed inside an httpOnly cookie, never in JS. Set
// NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable.

import { pathDataSettings } from "@/routes"

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata"
const DRIVE_FILENAME = "finpoint-backup.json"
const REDIRECT_STATE_KEY = "finpoint_drive_oauth"
const REDIRECT_STATE_TTL_MS = 10 * 60_000
const OAUTH_QUERY_KEYS = [
	"code",
	"state",
	"scope",
	"error",
	"error_description",
	"authuser",
	"prompt",
] as const

export type DriveAction = "sync" | "push" | "pull"

export type PendingDriveRedirect = {
	action: DriveAction
	code?: string
	error?: string
}

type CodeResponse = {
	code?: string
	scope?: string
	error?: string
}

declare global {
	interface Window {
		google?: {
			accounts: {
				oauth2: {
					initCodeClient: (config: {
						client_id: string
						scope: string
						ux_mode: "popup"
						callback: (response: CodeResponse) => void
						error_callback?: (error: { type: string }) => void
					}) => { requestCode: () => void }
				}
			}
		}
	}
}

function googleClientId(): string {
	return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
}

export function isDriveConfigured(): boolean {
	return googleClientId().length > 0
}

let gsiPromise: Promise<void> | null = null
let cachedToken: { token: string; expiresAt: number } | null = null

export class AuthNeededError extends Error {
	constructor() {
		super("Google Drive needs reconnecting.")
		this.name = "AuthNeededError"
	}
}

export class AuthRedirectError extends Error {
	constructor() {
		super("Redirecting to Google sign-in.")
		this.name = "AuthRedirectError"
	}
}

class PopupBlockedError extends Error {
	constructor() {
		super("Google sign-in popup was blocked.")
		this.name = "PopupBlockedError"
	}
}

export function hasFreshDriveToken(): boolean {
	return !!cachedToken && Date.now() < cachedToken.expiresAt - 60_000
}

let vaultProven: boolean | null = null

/** Whether the last manual connect proved the vault round-trips. Null when
 * untested (offline) — only an explicit false means "didn't stick". */
export function wasVaultProven(): boolean | null {
	return vaultProven
}

function cacheToken(accessToken: string, expiresIn: number): string {
	cachedToken = { token: accessToken, expiresAt: Date.now() + expiresIn * 1000 }
	return accessToken
}

function isStandaloneApp(): boolean {
	if (typeof window === "undefined") return false
	return (
		(navigator as Navigator & { standalone?: boolean }).standalone === true ||
		window.matchMedia?.("(display-mode: standalone)").matches === true
	)
}

function startDriveRedirect(action: DriveAction): never {
	const clientId = googleClientId()
	if (!clientId) throw new Error("Google Drive is not set up yet (missing client ID).")
	const state = crypto.randomUUID()
	try {
		window.localStorage.setItem(
			REDIRECT_STATE_KEY,
			JSON.stringify({ state, action, startedAt: Date.now() }),
		)
	} catch {
		throw new Error("Could not start Google sign-in. Allow site storage and try again.")
	}
	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: `${window.location.origin}${pathDataSettings()}`,
		response_type: "code",
		scope: DRIVE_SCOPE,
		access_type: "offline",
		prompt: "consent",
		include_granted_scopes: "true",
		state,
	})
	window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
	throw new AuthRedirectError()
}

export function takeDriveRedirectCallback(): PendingDriveRedirect | null {
	if (typeof window === "undefined") return null
	const url = new URL(window.location.href)
	if (!url.searchParams.has("code") && !url.searchParams.has("error")) return null

	const code = url.searchParams.get("code")
	const error = url.searchParams.get("error")
	const state = url.searchParams.get("state")

	for (const key of OAUTH_QUERY_KEYS) url.searchParams.delete(key)
	window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`)

	let stored: { state?: unknown; action?: unknown; startedAt?: unknown } | null = null
	try {
		const raw = window.localStorage.getItem(REDIRECT_STATE_KEY)
		window.localStorage.removeItem(REDIRECT_STATE_KEY)
		stored = raw
			? (JSON.parse(raw) as { state?: unknown; action?: unknown; startedAt?: unknown })
			: null
	} catch {
		stored = null
	}

	const action: DriveAction =
		stored?.action === "push" || stored?.action === "pull" ? stored.action : "sync"
	const validState =
		typeof stored?.state === "string" &&
		stored.state === state &&
		typeof stored.startedAt === "number" &&
		Date.now() - stored.startedAt < REDIRECT_STATE_TTL_MS

	if (error) {
		return {
			action,
			error:
				error === "access_denied"
					? "Google Drive connection was cancelled."
					: "Could not connect Google Drive.",
		}
	}
	if (!code || !validState) {
		return {
			action: "sync",
			error: "Google sign-in expired or opened in a different browser. Try connecting again.",
		}
	}
	return { action, code }
}

function loadGsi(): Promise<void> {
	if (typeof window === "undefined")
		return Promise.reject(new Error("Drive sync needs a browser."))
	if (window.google?.accounts?.oauth2) return Promise.resolve()
	if (!gsiPromise) {
		gsiPromise = new Promise((resolve, reject) => {
			const script = document.createElement("script")
			script.src = "https://accounts.google.com/gsi/client"
			script.async = true
			script.defer = true
			script.onload = () => resolve()
			script.onerror = () => {
				gsiPromise = null
				reject(
					new Error(
						"Could not load Google sign-in. Check your connection and try again.",
					),
				)
			}
			document.head.appendChild(script)
		})
	}
	return gsiPromise
}

let codeFlow: Promise<string> | null = null

async function requestDriveCode(): Promise<string> {
	const clientId = googleClientId()
	if (!clientId) throw new Error("Google Drive is not set up yet (missing client ID).")

	await loadGsi()
	const oauth2 = window.google?.accounts?.oauth2
	if (!oauth2) throw new Error("Could not load Google sign-in.")

	// One popup at a time: concurrent callers share it instead of stacking windows.
	if (codeFlow) return codeFlow
	codeFlow = new Promise<string>((resolve, reject) => {
		const timer = window.setTimeout(
			() => reject(new Error("Google Drive connection timed out.")),
			120_000,
		)
		const done = (fn: () => void) => {
			window.clearTimeout(timer)
			fn()
		}
		const client = oauth2.initCodeClient({
			client_id: clientId,
			scope: DRIVE_SCOPE,
			ux_mode: "popup",
			callback: response => {
				if (!response.code) {
					done(() => reject(new Error("Google Drive connection was cancelled.")))
					return
				}
				done(() => resolve(response.code as string))
			},
			error_callback: error => {
				if (error.type === "popup_failed_to_open") {
					done(() => reject(new PopupBlockedError()))
					return
				}
				done(() => reject(new Error("Google Drive connection was cancelled.")))
			},
		})
		client.requestCode()
	})
	try {
		return await codeFlow
	} finally {
		codeFlow = null
	}
}

async function exchangeDriveCode(code: string, mode: "popup" | "redirect"): Promise<string> {
	const response = await fetch("/api/auth/exchange", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code, mode }),
	})
	const parsed = (await response.json().catch(() => null)) as {
		access_token?: string
		expires_in?: number
		message?: string
		error?: string
	} | null
	if (!response.ok || !parsed?.access_token) {
		throw new Error(parsed?.message ?? parsed?.error ?? "Could not connect Google Drive.")
	}
	const token = cacheToken(parsed.access_token, parsed.expires_in ?? 3600)
	// Prove the vault round-trips right now, while the user is watching —
	// otherwise a dead grant surfaces hours later as a mystery relogin.
	if (typeof navigator !== "undefined" && navigator.onLine) {
		const probe = await fetch("/api/auth/token", { method: "POST" }).catch(() => null)
		vaultProven = !!probe?.ok
	}
	return token
}

export async function completeDriveRedirect(code: string): Promise<string> {
	vaultProven = null
	if (typeof navigator !== "undefined" && !navigator.onLine) {
		throw new Error("You're offline — reconnect to sync with Google Drive.")
	}
	return exchangeDriveCode(code, "redirect")
}

export async function ensureDriveToken(action: DriveAction = "sync"): Promise<string> {
	if (hasFreshDriveToken() && cachedToken) return cachedToken.token
	vaultProven = null

	// Prefer the invisible refresh first: interactive sign-in is only warranted when
	// the grant itself is gone (first connect, revoked access).
	if (typeof navigator !== "undefined" && !navigator.onLine) {
		throw new Error("You're offline — reconnect to sync with Google Drive.")
	}
	try {
		return await ensureDriveTokenSilent()
	} catch (cause) {
		if (!(cause instanceof AuthNeededError)) throw cause
	}

	// Installed PWAs (especially iOS/iPadOS Home Screen apps) block popups or drop
	// window.opener across the standalone boundary; redirect in the same window instead.
	if (isStandaloneApp()) startDriveRedirect(action)

	let code: string
	try {
		code = await requestDriveCode()
	} catch (cause) {
		if (cause instanceof PopupBlockedError) startDriveRedirect(action)
		throw cause
	}
	return exchangeDriveCode(code, "popup")
}

export async function ensureDriveTokenSilent(): Promise<string> {
	if (hasFreshDriveToken() && cachedToken) return cachedToken.token

	const response = await fetch("/api/auth/token", { method: "POST" }).catch(() => null)
	const parsed = (await response?.json().catch(() => null)) as {
		access_token?: string
		expires_in?: number
	} | null
	if (!response?.ok || !parsed?.access_token) throw new AuthNeededError()
	return cacheToken(parsed.access_token, parsed.expires_in ?? 3600)
}

/** Ends the sign-in cookie. Throws when it may survive, so callers keep the connection. */
export async function disconnectDrive(): Promise<void> {
	const response = await fetch("/api/auth/logout", { method: "POST" })
	if (!response.ok) throw new Error("Could not sign out of Google.")
	cachedToken = null
}

export type DriveFileMeta = { id: string; modifiedTime: string; size?: string }

let clockSkewMs = 0

/** Device clock minus true time, learned from Google's Date header. */
export function getClockSkewMs(): number {
	return clockSkewMs
}

async function driveFetch(path: string, token: string, init?: RequestInit) {
	const response = await fetch(`https://www.googleapis.com${path}`, {
		...init,
		headers: { Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
	})
	const serverDate = response.headers.get("date")
	if (serverDate) {
		const skew = Date.now() - Date.parse(serverDate)
		clockSkewMs = Number.isFinite(skew) && Math.abs(skew) > 30_000 ? skew : 0
	}
	if (response.status === 401 || response.status === 403) {
		cachedToken = null
		throw new Error("Google Drive needs reconnecting — connect again and retry.")
	}
	if (!response.ok) throw new Error("Google Drive request failed.")
	return response
}

export async function findBackupFile(token: string): Promise<DriveFileMeta | null> {
	const query = encodeURIComponent(
		`name = '${DRIVE_FILENAME}' and 'appDataFolder' in parents and trashed = false`,
	)
	const response = await driveFetch(
		`/drive/v3/files?q=${query}&spaces=appDataFolder&fields=files(id,modifiedTime,size)&pageSize=1`,
		token,
	)
	const parsed = (await response.json()) as { files?: DriveFileMeta[] }
	return parsed.files?.[0] ?? null
}

export async function downloadBackupFile(token: string, id: string): Promise<string> {
	const response = await driveFetch(`/drive/v3/files/${id}?alt=media`, token)
	return response.text()
}

export async function uploadBackupFile(
	token: string,
	text: string,
	existingId?: string | null,
): Promise<DriveFileMeta> {
	if (existingId) {
		const response = await driveFetch(
			`/upload/drive/v3/files/${existingId}?uploadType=media`,
			token,
			{ method: "PATCH", headers: { "Content-Type": "application/json" }, body: text },
		)
		return (await response.json()) as DriveFileMeta
	}
	const metadata = JSON.stringify({ name: DRIVE_FILENAME, parents: ["appDataFolder"] })
	const boundary = `finpoint-${crypto.randomUUID()}`
	const body =
		`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
		`--${boundary}\r\nContent-Type: application/json\r\n\r\n${text}\r\n--${boundary}--`
	const response = await driveFetch("/upload/drive/v3/files?uploadType=multipart", token, {
		method: "POST",
		headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
		body,
	})
	return (await response.json()) as DriveFileMeta
}

export async function getFileMeta(token: string, id: string): Promise<DriveFileMeta> {
	const response = await driveFetch(`/drive/v3/files/${id}?fields=id,modifiedTime,size`, token)
	return (await response.json()) as DriveFileMeta
}

// Record file bytes live beside the snapshot, one immutable Drive file per content hash,
// so the snapshot stays small and an unchanged file is never uploaded twice.
const RECORD_FILE_PREFIX = "finpoint-file-"

/** Drive file ids of the stored Record file bytes, by SHA-256. */
export async function listRecordFileIds(token: string): Promise<Map<string, string>> {
	const query = encodeURIComponent(
		`name contains '${RECORD_FILE_PREFIX}' and 'appDataFolder' in parents and trashed = false`,
	)
	const ids = new Map<string, string>()
	let page: string | undefined
	do {
		const response = await driveFetch(
			`/drive/v3/files?q=${query}&spaces=appDataFolder&fields=nextPageToken,files(id,name)&pageSize=1000${page ? `&pageToken=${page}` : ""}`,
			token,
		)
		const parsed = (await response.json()) as {
			nextPageToken?: string
			files?: { id: string; name: string }[]
		}
		for (const file of parsed.files ?? [])
			ids.set(file.name.slice(RECORD_FILE_PREFIX.length), file.id)
		page = parsed.nextPageToken
	} while (page)
	return ids
}

export async function uploadRecordFile(
	token: string,
	sha256: string,
	data: ArrayBuffer,
	type: string,
): Promise<void> {
	const metadata = JSON.stringify({
		name: `${RECORD_FILE_PREFIX}${sha256}`,
		parents: ["appDataFolder"],
	})
	const boundary = `finpoint-${crypto.randomUUID()}`
	const body = new Blob([
		`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
		`--${boundary}\r\nContent-Type: ${type}\r\n\r\n`,
		data,
		`\r\n--${boundary}--`,
	])
	await driveFetch("/upload/drive/v3/files?uploadType=multipart", token, {
		method: "POST",
		headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
		body,
	})
}

export async function downloadRecordFile(token: string, id: string): Promise<ArrayBuffer> {
	const response = await driveFetch(`/drive/v3/files/${id}?alt=media`, token)
	return response.arrayBuffer()
}
