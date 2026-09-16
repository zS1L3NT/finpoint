// Google Drive persistence (user's own Drive, plaintext JSON).
//
// Nothing financial is sent to us. Signing in uses a one-time popup code
// that our /api/auth/* broker exchanges for tokens; the lasting grant lives
// sealed inside an httpOnly cookie, never in JS. Set
// NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable.

export const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata"
export const DRIVE_FILENAME = "finpoint-backup.json"

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

export function googleClientId(): string {
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

async function requestDriveCode(): Promise<string> {
	const clientId = googleClientId()
	if (!clientId) throw new Error("Google Drive is not set up yet (missing client ID).")

	await loadGsi()
	const oauth2 = window.google?.accounts?.oauth2
	if (!oauth2) throw new Error("Could not load Google sign-in.")

	return new Promise<string>((resolve, reject) => {
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
			error_callback: () => {
				done(() => reject(new Error("Google Drive connection was cancelled.")))
			},
		})
		client.requestCode()
	})
}

export async function ensureDriveToken(): Promise<string> {
	if (hasFreshDriveToken() && cachedToken) return cachedToken.token
	vaultProven = null

	const response = await fetch("/api/auth/exchange", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code: await requestDriveCode() }),
	})
	const parsed = (await response.json().catch(() => null)) as {
		access_token?: string
		expires_in?: number
		message?: string
	} | null
	if (!response.ok || !parsed?.access_token) {
		throw new Error(parsed?.message ?? "Could not connect Google Drive.")
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

export async function disconnectDrive(): Promise<void> {
	cachedToken = null
	await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined)
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
