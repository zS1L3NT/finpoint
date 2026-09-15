import * as jose from "jose"

// Server-only: refresh-token vault where the auth cookie IS the vault.
// Nothing here may be imported by client components: it reads server secrets.

export const AUTH_COOKIE_NAME = "finpoint_auth"
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

function encryptionKey(): Uint8Array {
	const hex = process.env.AUTH_ENCRYPTION_KEY ?? ""
	if (!/^[\da-fA-F]{64}$/.test(hex)) {
		throw new Error("AUTH_ENCRYPTION_KEY must be 32 bytes as hex.")
	}
	return new Uint8Array(Buffer.from(hex, "hex"))
}

export async function sealRefreshToken(refreshToken: string): Promise<string> {
	return new jose.CompactEncrypt(new TextEncoder().encode(refreshToken))
		.setProtectedHeader({ alg: "dir", enc: "A256GCM" })
		.encrypt(encryptionKey())
}

export async function unsealRefreshToken(sealed: string): Promise<string> {
	const { plaintext } = await jose.compactDecrypt(sealed, encryptionKey())
	return new TextDecoder().decode(plaintext)
}

export function authCookie(name: string, value: string, maxAge: number) {
	return {
		name,
		value,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		path: "/",
		maxAge,
	}
}

export function authCookieConfig() {
	return { name: AUTH_COOKIE_NAME, maxAge: AUTH_COOKIE_MAX_AGE }
}

const hits = new Map<string, number[]>()

/** Best-effort per-instance sliding window. Returns false when over limit. */
export function rateLimit(key: string, limit = 20, windowMs = 60_000): boolean {
	const now = Date.now()
	const recent = (hits.get(key) ?? []).filter(time => now - time < windowMs)
	recent.push(now)
	hits.set(key, recent)
	return recent.length <= limit
}

export function clientIp(request: Request): string {
	return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
}

/** The popup code flow is same-origin by construction; reject anything else. */
export function sameOrigin(request: Request): boolean {
	const origin = request.headers.get("origin")
	if (!origin) return true
	try {
		return new URL(origin).host === request.headers.get("host")
	} catch {
		return false
	}
}
