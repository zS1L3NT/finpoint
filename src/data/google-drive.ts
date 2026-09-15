// Google Drive persistence (user's own Drive, plaintext JSON).
//
// Nothing is sent to us: the access token lives only in memory in this
// browser and goes only to googleapis.com. Set VITE_GOOGLE_CLIENT_ID to
// enable; the UI degrades to a setup hint when it is missing.

export const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata"
export const DRIVE_FILENAME = "finpoint-backup.json"

type TokenResponse = {
	access_token: string
	expires_in: number
	error?: string
}

declare global {
	interface Window {
		google?: {
			accounts: {
				oauth2: {
					initTokenClient: (config: {
						client_id: string
						scope: string
						callback: (response: TokenResponse) => void
					}) => { requestAccessToken: (options?: { prompt?: string }) => void }
				}
			}
		}
	}
}

export function googleClientId(): string {
	return import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""
}

export function isDriveConfigured(): boolean {
	return googleClientId().length > 0
}

let gsiPromise: Promise<void> | null = null
let cachedToken: { token: string; expiresAt: number } | null = null

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

export async function ensureDriveToken(): Promise<string> {
	const clientId = googleClientId()
	if (!clientId) throw new Error("Google Drive is not set up yet (missing client ID).")
	if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.token

	await loadGsi()
	const oauth2 = window.google?.accounts?.oauth2
	if (!oauth2) throw new Error("Could not load Google sign-in.")

	const token = await new Promise<string>((resolve, reject) => {
		const client = oauth2.initTokenClient({
			client_id: clientId,
			scope: DRIVE_SCOPE,
			callback: response => {
				if (response.error || !response.access_token) {
					reject(new Error("Google Drive connection was cancelled."))
					return
				}
				cachedToken = {
					token: response.access_token,
					expiresAt: Date.now() + response.expires_in * 1000,
				}
				resolve(response.access_token)
			},
		})
		client.requestAccessToken({ prompt: cachedToken ? "" : "consent" })
	})
	return token
}

export function disconnectDrive(): void {
	cachedToken = null
	if (window.google?.accounts?.oauth2 && googleClientId()) {
		window.google.accounts.oauth2.initTokenClient({
			client_id: googleClientId(),
			scope: DRIVE_SCOPE,
			// No-op: client created only so a future token request starts clean.
			callback: () => undefined,
		})
	}
}

export type DriveFileMeta = { id: string; modifiedTime: string; size?: string }

async function driveFetch(path: string, token: string, init?: RequestInit) {
	const response = await fetch(`https://www.googleapis.com${path}`, {
		...init,
		headers: { Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
	})
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
