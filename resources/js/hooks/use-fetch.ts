import { useHttp } from "@inertiajs/react"
import { useEffect } from "react"

export function useFetch<T>(url: string): T | null
export function useFetch<T>(url: string, defaultValue: T): T
export function useFetch<T>(url: string, defaultValue?: T) {
	const { get, response } = useHttp<null, T>()

	useEffect(() => {
		// biome-ignore lint/nursery/noFloatingPromises: No checkup on this promise needed
		get(url)
	}, [url])

	return response ?? defaultValue ?? null
}
