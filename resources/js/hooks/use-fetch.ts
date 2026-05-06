import { useHttp } from "@inertiajs/react"
import { useEffect } from "react"

export function useFetch<T>(url: string) {
	const { get, response } = useHttp<null, T>()

	useEffect(() => {
		// biome-ignore lint/nursery/noFloatingPromises: No checkup on this promise needed
		get(url)
	}, [url])

	return response
}
