"use client"

import { redirect, useSearchParams } from "next/navigation"
import { pathStatementsDuplicates } from "@/routes"

export default function RedirectPage() {
	const params = useSearchParams()
	redirect(pathStatementsDuplicates(Object.fromEntries(params.entries())))
}
