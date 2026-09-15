import { type NextRequest, NextResponse } from "next/server"
import {
	authCookie,
	authCookieConfig,
	clientIp,
	rateLimit,
	sameOrigin,
	sealRefreshToken,
	unsealRefreshToken,
} from "@/lib/auth-vault"

export async function POST(request: NextRequest) {
	if (!rateLimit(`exchange:${clientIp(request)}`)) {
		return NextResponse.json({ error: "Too many attempts." }, { status: 429 })
	}
	if (!sameOrigin(request)) {
		return NextResponse.json({ error: "Forbidden." }, { status: 403 })
	}
	let code: unknown
	try {
		;({ code } = (await request.json()) as { code?: unknown })
	} catch {
		return NextResponse.json({ error: "Invalid request." }, { status: 400 })
	}
	if (typeof code !== "string" || code.length === 0 || code.length > 4096) {
		return NextResponse.json({ error: "Invalid code." }, { status: 400 })
	}
	const clientId = process.env.GOOGLE_CLIENT_ID ?? ""
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? ""
	if (!clientId || !clientSecret) {
		console.error("Auth is not configured: missing GOOGLE_CLIENT_ID/SECRET.")
		return NextResponse.json({ error: "Auth is not configured." }, { status: 500 })
	}

	const exchange = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: "postmessage",
			grant_type: "authorization_code",
		}),
	})
	if (!exchange.ok) {
		console.error(`Google code exchange failed: ${exchange.status}.`)
		return NextResponse.json(
			{ error: "Google rejected the authorization. Try connecting again." },
			{ status: 502 },
		)
	}
	const tokens = (await exchange.json()) as {
		access_token?: string
		refresh_token?: string
		expires_in?: number
	}
	// Google only returns a refresh token on first consent: keep the vaulted
	// one when it omits it, so re-auth never wipes a working grant.
	let refresh = tokens.refresh_token ?? null
	if (!refresh) {
		const sealed = request.cookies.get(authCookieConfig().name)?.value
		if (sealed) {
			refresh = await unsealRefreshToken(sealed).catch(() => null)
		}
	}
	if (!refresh || !tokens.access_token) {
		return NextResponse.json(
			{
				error: "reconnect",
				message:
					"Google did not return a lasting grant. Revoke Finpoint in your Google account and connect again.",
			},
			{ status: 400 },
		)
	}
	const sealed = await sealRefreshToken(refresh)
	const response = NextResponse.json({
		access_token: tokens.access_token,
		expires_in: tokens.expires_in ?? 3600,
	})
	const { name, maxAge } = authCookieConfig()
	response.cookies.set(authCookie(name, sealed, maxAge))
	return response
}
