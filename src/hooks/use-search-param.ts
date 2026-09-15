"use client"

// Client-side replacement: reads a URL search param, mirroring the old
// react-router hook's tuple API so call sites stay untouched.

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function useSearchParam(key: string): [string | null, (value: string | null) => void]
export function useSearchParam(
	key: string,
	defaultValue: string,
): [string, (value: string | null) => void]
export function useSearchParam(
	key: string,
	defaultValue?: string,
): [string | null, (value: string | null) => void] {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const value = searchParams.get(key) ?? defaultValue ?? null

	const setValue = useCallback(
		(next: string | null) => {
			const params = new URLSearchParams(searchParams.toString())
			if (next === null || next === "") params.delete(key)
			else params.set(key, next)
			const suffix = params.toString()
			router.push(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false })
		},
		[key, searchParams, router, pathname],
	)

	return [value, setValue]
}
