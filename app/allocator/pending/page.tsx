"use client"

import { redirect, useSearchParams } from "next/navigation"
import { pathStatementsPending } from "@/routes"

export default function RedirectPage() {
	const params = useSearchParams()
	redirect(pathStatementsPending(Object.fromEntries(params.entries())))
}
