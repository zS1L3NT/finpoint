// Replacement for the Inertia `useHttp` fetch helper.
// Runs an async loader and returns its result (reactive on key change).

import { useEffect, useState } from "react"

export function useFetch<T>(loader: () => Promise<T>, defaultValue: T, key = ""): T {
	const [value, setValue] = useState<T>(defaultValue)

	useEffect(() => {
		let cancelled = false
		loader().then(
			result => {
				if (!cancelled) setValue(result)
			},
			() => undefined,
		)
		return () => {
			cancelled = true
		}
	}, [key])

	return value
}
