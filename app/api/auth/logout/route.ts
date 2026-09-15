import { type NextRequest, NextResponse } from "next/server"
import { authCookieConfig, unsealRefreshToken } from "@/lib/auth-vault"

export async function POST(request: NextRequest) {
	const sealed = request.cookies.get(authCookieConfig().name)?.value
	if (sealed) {
		const refresh = await unsealRefreshToken(sealed).catch(() => null)
		if (refresh) {
			await fetch(
				`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(refresh)}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
				},
			).catch(() => undefined)
		}
	}
	const response = NextResponse.json({ ok: true })
	response.cookies.delete(authCookieConfig().name)
	return response
}
