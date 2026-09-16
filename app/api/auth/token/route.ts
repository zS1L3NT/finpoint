import { type NextRequest, NextResponse } from "next/server"
import { authCookieConfig, clientIp, rateLimit, unsealRefreshToken } from "@/lib/auth-vault"

export async function POST(request: NextRequest) {
	if (!rateLimit(`token:${clientIp(request)}`, 60)) {
		return NextResponse.json({ error: "Too many attempts." }, { status: 429 })
	}
	const sealed = request.cookies.get(authCookieConfig().name)?.value
	if (!sealed) {
		console.warn("auth/token denied: no_cookie.")
		return NextResponse.json({ error: "unauthorized", reason: "no_cookie" }, { status: 401 })
	}
	const refresh = await unsealRefreshToken(sealed).catch(() => null)
	if (!refresh) {
		console.warn("auth/token denied: bad_seal.")
		const response = NextResponse.json(
			{ error: "unauthorized", reason: "bad_seal" },
			{ status: 401 },
		)
		response.cookies.delete(authCookieConfig().name)
		return response
	}
	const clientId = process.env.GOOGLE_CLIENT_ID ?? ""
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? ""
	if (!clientId || !clientSecret) {
		console.error("Auth is not configured: missing GOOGLE_CLIENT_ID/SECRET.")
		return NextResponse.json({ error: "Auth is not configured." }, { status: 500 })
	}
	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			refresh_token: refresh,
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: "refresh_token",
		}),
	})
	if (!response.ok) {
		console.warn(`auth/token denied: refresh_rejected (${response.status}).`)
		const clear = NextResponse.json(
			{ error: "unauthorized", reason: "refresh_rejected" },
			{ status: 401 },
		)
		if (response.status === 400) clear.cookies.delete(authCookieConfig().name)
		return clear
	}
	const tokens = (await response.json()) as { access_token?: string; expires_in?: number }
	if (!tokens.access_token) {
		console.warn("auth/token denied: no_access_token.")
		return NextResponse.json(
			{ error: "unauthorized", reason: "no_access_token" },
			{ status: 401 },
		)
	}
	return NextResponse.json({
		access_token: tokens.access_token,
		expires_in: tokens.expires_in ?? 3600,
	})
}
