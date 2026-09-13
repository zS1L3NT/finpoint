// Client-side replacement: reads a URL search param via react-router.

import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"

export function useSearchParam(key: string): [string | null, (value: string | null) => void]
export function useSearchParam(
	key: string,
	defaultValue: string,
): [string, (value: string | null) => void]
export function useSearchParam(
	key: string,
	defaultValue?: string,
): [string | null, (value: string | null) => void] {
	const [searchParams, setSearchParams] = useSearchParams()
	const value = searchParams.get(key) ?? defaultValue ?? null

	const setValue = useCallback(
		(next: string | null) => {
			setSearchParams(prev => {
				const params = new URLSearchParams(prev)
				if (next === null || next === "") params.delete(key)
				else params.set(key, next)
				return params
			})
		},
		[key, setSearchParams],
	)

	return [value, setValue]
}
